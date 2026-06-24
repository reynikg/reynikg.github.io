#!/usr/bin/env node
/* ============================================================
   optimize-images.js — shrink my photos to web size (once each)
   ============================================================

   Cameras and design exports drop 2–3 MB images into my project
   folders. On the web that's the single biggest thing slowing a page
   down, so I run this to resize anything oversized and re-compress it,
   in place, before I commit.

   It walks Selected-Works/ and writing/ and, for every image:
     • rotates by its EXIF orientation, then resizes so the long edge
       is at most MAX_EDGE px (big enough for full-width display);
     • re-encodes JPEG/WebP at QUALITY, optimises PNG;
     • only overwrites when the result is at least 5% smaller.

   --- Why it never degrades my old images ---
   It keeps a ledger at build/.images-optimized.json recording the
   content hash of every image it has already optimised. On each run it
   hashes each file and SKIPS any whose hash is already in the ledger —
   so a photo is optimised at most once, ever. Re-running does nothing
   to files I haven't changed. If I replace or edit an image, its hash
   changes, so it gets optimised once more, then recorded again.

   --- Running it ---
       npm install                 (once per machine — installs sharp)
       npm run optimize            (process everything new/changed)
       npm run optimize -- PATH…   (only the files/folders I name)

   Examples:
       npm run optimize -- Selected-Works/light-shield
       npm run optimize -- Selected-Works/coral-cycles-thumbnail.jpg
       npm run optimize -- --force Selected-Works/foo.jpg   (re-do even if recorded)
============================================================ */

"use strict";

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

let sharp;
try {
  sharp = require("sharp");
} catch (e) {
  console.error("\n  sharp isn't installed yet. I run `npm install` once, then `npm run optimize`.\n");
  process.exit(1);
}

const ROOT = path.join(__dirname, "..");
const ROOTS = ["Selected-Works", "writing"];
const MAX_EDGE = 1600;
const QUALITY = 82;
const SKIP_UNDER = 300 * 1024; // already-small files are recorded without re-encoding
const EXTS = new Set([".jpg", ".jpeg", ".png", ".webp"]);
const MANIFEST = path.join(__dirname, ".images-optimized.json");

/* ---------- the ledger of already-optimised files ---------- */

function loadManifest() {
  try { return JSON.parse(fs.readFileSync(MANIFEST, "utf8")); }
  catch (e) { return {}; }
}
function saveManifest(m) {
  fs.writeFileSync(MANIFEST, JSON.stringify(m, Object.keys(m).sort(), 2) + "\n");
}
function hash(buf) { return crypto.createHash("sha1").update(buf).digest("hex"); }
function rel(p) { return path.relative(ROOT, p).split(path.sep).join("/"); }

/* ---------- find the files to look at ---------- */

function walk(dir, out) {
  if (!fs.existsSync(dir)) return out;
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) walk(p, out);
    else if (EXTS.has(path.extname(name).toLowerCase())) out.push(p);
  }
  return out;
}

// Turn CLI arguments (files or folders, relative to the repo root or absolute)
// into a concrete list of image files. No args → the default ROOTS.
function collectTargets(args) {
  const files = [];
  if (!args.length) {
    ROOTS.forEach((r) => walk(path.join(ROOT, r), files));
    return files;
  }
  for (const a of args) {
    const abs = path.isAbsolute(a) ? a : path.join(ROOT, a);
    if (!fs.existsSync(abs)) { console.warn(`  ! not found: ${a}`); continue; }
    if (fs.statSync(abs).isDirectory()) walk(abs, files);
    else if (EXTS.has(path.extname(abs).toLowerCase())) files.push(abs);
    else console.warn(`  ! not an image: ${a}`);
  }
  return files;
}

/* ---------- optimise one file ---------- */

async function optimize(file) {
  const ext = path.extname(file).toLowerCase();
  const original = fs.readFileSync(file);
  const before = original.length;

  const img = sharp(original).rotate(); // apply EXIF orientation
  const meta = await img.metadata();
  const longEdge = Math.max(meta.width || 0, meta.height || 0);
  const oversized = longEdge > MAX_EDGE;

  // Already small and correctly sized → leave the bytes alone, just record it.
  if (!oversized && before < SKIP_UNDER) {
    return { before, after: before, finalHash: hash(original), written: false };
  }

  let pipe = img;
  if (oversized) pipe = pipe.resize({ width: MAX_EDGE, height: MAX_EDGE, fit: "inside", withoutEnlargement: true });
  if (ext === ".png") pipe = pipe.png({ compressionLevel: 9, palette: true });
  else if (ext === ".webp") pipe = pipe.webp({ quality: QUALITY });
  else pipe = pipe.jpeg({ quality: QUALITY, progressive: true, mozjpeg: true });

  const buf = await pipe.toBuffer();
  if (buf.length < before * 0.95) {
    fs.writeFileSync(file, buf);
    return { before, after: buf.length, finalHash: hash(buf), written: true };
  }
  // Not worth rewriting → keep original, but record it so we don't retry it.
  return { before, after: before, finalHash: hash(original), written: false };
}

/* ---------- run ---------- */

(async () => {
  const argv = process.argv.slice(2);
  const force = argv.includes("--force");
  const targets = collectTargets(argv.filter((a) => !a.startsWith("-")));

  const manifest = loadManifest();
  let written = 0, skipped = 0, recorded = 0;
  let totalBefore = 0, totalAfter = 0;
  const rows = [];

  for (const f of targets) {
    const key = rel(f);
    try {
      // Skip anything already in the ledger with a matching hash.
      if (!force) {
        const cur = hash(fs.readFileSync(f));
        if (manifest[key] === cur) { skipped++; continue; }
      }
      const r = await optimize(f);
      manifest[key] = r.finalHash;
      totalBefore += r.before; totalAfter += r.after;
      if (r.written) { written++; rows.push({ ...r, key }); }
      else recorded++;
    } catch (e) {
      console.warn(`  ! skipped ${key} - ${e.message}`);
    }
  }

  saveManifest(manifest);

  rows.sort((a, b) => (b.before - b.after) - (a.before - a.after));
  rows.slice(0, 40).forEach((r) =>
    console.log(`  ✓ ${(r.before / 1048576).toFixed(2)}MB → ${(r.after / 1024).toFixed(0)}KB  ${r.key}`)
  );
  const saved = totalBefore - totalAfter;
  console.log(
    `\n${written} rewritten, ${recorded} already-lean (recorded), ${skipped} unchanged (skipped via ledger).` +
    (written ? `  Saved ${(saved / 1048576).toFixed(1)}MB this run.` : "")
  );
})();
