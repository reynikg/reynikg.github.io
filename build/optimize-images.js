#!/usr/bin/env node
/* ============================================================
   optimize-images.js — shrink my photos to web size
   ============================================================

   Cameras and design exports drop 2–3 MB images into my project
   folders. On the web that's the single biggest thing slowing a page
   down, so I run this to resize anything oversized and re-compress it,
   in place, before I commit.

   It walks Selected-Works/ and writing/ and, for every image:
     • rotates by its EXIF orientation, then resizes so the long edge
       is at most MAX_EDGE px (big enough for full-width display);
     • re-encodes JPEG/WebP at QUALITY, optimises PNG;
     • only overwrites when the result is at least 5% smaller, and
       skips files that are already small — so re-running is safe and
       never slowly degrades an image.

   This is the ONE part of the toolchain that needs a dependency, so:
       npm install        (once — installs sharp)
       npm run optimize    (then  npm run build,  then commit)
============================================================ */

"use strict";

const fs = require("fs");
const path = require("path");

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
const SKIP_UNDER = 300 * 1024; // already-small files are left untouched
const EXTS = new Set([".jpg", ".jpeg", ".png", ".webp"]);

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

async function optimize(file) {
  const ext = path.extname(file).toLowerCase();
  const before = fs.statSync(file).size;
  const img = sharp(file).rotate(); // apply EXIF orientation
  const meta = await img.metadata();
  const longEdge = Math.max(meta.width || 0, meta.height || 0);
  const oversized = longEdge > MAX_EDGE;

  // Leave small, correctly-sized files alone (keeps reruns lossless).
  if (!oversized && before < SKIP_UNDER) return { file, before, after: before, skipped: true };

  let pipe = img;
  if (oversized) pipe = pipe.resize({ width: MAX_EDGE, height: MAX_EDGE, fit: "inside", withoutEnlargement: true });

  if (ext === ".png") pipe = pipe.png({ compressionLevel: 9, palette: true });
  else if (ext === ".webp") pipe = pipe.webp({ quality: QUALITY });
  else pipe = pipe.jpeg({ quality: QUALITY, progressive: true, mozjpeg: true });

  const buf = await pipe.toBuffer();
  if (buf.length < before * 0.95) {
    fs.writeFileSync(file, buf);
    return { file, before, after: buf.length, written: true };
  }
  return { file, before, after: before, skipped: true };
}

(async () => {
  const files = [];
  ROOTS.forEach((r) => walk(path.join(ROOT, r), files));

  let totalBefore = 0, totalAfter = 0, written = 0;
  const rows = [];
  for (const f of files) {
    try {
      const r = await optimize(f);
      totalBefore += r.before; totalAfter += r.after;
      if (r.written) { written++; rows.push(r); }
    } catch (e) {
      console.warn("  ! skipped", path.relative(ROOT, f), "-", e.message);
    }
  }

  rows.sort((a, b) => (b.before - b.after) - (a.before - a.after));
  rows.slice(0, 40).forEach((r) =>
    console.log(`  ✓ ${(r.before / 1048576).toFixed(2)}MB → ${(r.after / 1024).toFixed(0)}KB  ${path.relative(ROOT, r.file)}`)
  );
  const saved = totalBefore - totalAfter;
  console.log(`\n${written} image(s) rewritten. Total ${(totalBefore / 1048576).toFixed(1)}MB → ${(totalAfter / 1048576).toFixed(1)}MB (saved ${(saved / 1048576).toFixed(1)}MB).`);
})();
