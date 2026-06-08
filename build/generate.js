#!/usr/bin/env node
/* ============================================================
   generate.js — build one static case-study page per project
   ============================================================

   Reads the project list from  data/works.js  and writes a full
   HTML page to  projects/<slug>.html  for each one. No separate
   HTML file to hand-author, and no npm install — plain Node.

   Run it from the repo root:

       node build/generate.js
       (or)  npm run build

   For every project it:
     • auto-discovers images in  Selected-Works/<slug>/
       (cover, sketch, cad, prototype, final, decisions, outcome,
        gallery-*) so you only have to drop files in the folder;
     • only renders a section when there's content for it, so a
       half-filled project still produces a tidy page;
     • escapes all text, so quotes and symbols are safe.
============================================================ */

"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const OUT_DIR = path.join(ROOT, "projects");
const WORKS = require(path.join(ROOT, "data", "works.js"));

/* ---------- small helpers ---------- */

function escapeHtml(s) {
  return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
  });
}

// A root-relative asset path, verified to exist (http URLs pass through).
function existsRootRel(rel) {
  if (!rel) return null;
  if (/^https?:\/\//i.test(rel)) return rel;
  return fs.existsSync(path.join(ROOT, rel)) ? rel : null;
}

// Look for Selected-Works/<slug>/<base>.<ext> across common extensions.
function auto(slug, base) {
  const exts = ["jpg", "jpeg", "png", "webp", "JPG", "JPEG", "PNG", "WEBP"];
  for (const ext of exts) {
    const rel = `Selected-Works/${slug}/${base}.${ext}`;
    if (fs.existsSync(path.join(ROOT, rel))) return rel;
  }
  return null;
}

// Prefer an explicit (existing) path, then the folder convention.
function pick(explicit, slug, base) {
  return existsRootRel(explicit) || auto(slug, base);
}

// Pages live in projects/, so root-relative assets need a "../" hop.
function up(rel) {
  if (!rel) return rel;
  if (/^https?:\/\//i.test(rel)) return rel;
  return "../" + rel.replace(/^\/+/, "");
}

// A CSS background-image rule for a (possibly missing) asset.
function bg(rel) {
  return rel ? `background-image:url('${up(rel)}')` : "";
}

// Split a text blob into <p> paragraphs on blank lines.
function paragraphs(text) {
  return String(text || "")
    .split(/\n\s*\n+/)
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => `<p>${escapeHtml(s)}</p>`)
    .join("\n          ");
}

function slugify(s) {
  return String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

/* ---------- image resolution per project ---------- */

function resolveImages(p) {
  const slug = p.slug;

  const cover =
    pick(p.cover, slug, "cover") || existsRootRel(p.image) || p.image || null;

  // Process steps: explicit list, else the default four by convention.
  const defaults = [
    ["Sketch", "sketch"],
    ["CAD", "cad"],
    ["Prototype", "prototype"],
    ["Final", "final"],
  ];
  let steps;
  if (Array.isArray(p.process) && p.process.length) {
    steps = p.process
      .map((s) => {
        const img = pick(s.image, slug, slugify(s.label));
        return img ? { label: s.label, image: img } : null;
      })
      .filter(Boolean);
  } else {
    steps = defaults
      .map(([label, base]) => {
        const img = auto(slug, base);
        return img ? { label, image: img } : null;
      })
      .filter(Boolean);
  }

  const decisionsImg = pick(p.decisions && p.decisions.image, slug, "decisions");
  const outcomeImg = pick(p.outcome && p.outcome.image, slug, "outcome");

  // Gallery: explicit (existing) entries + any gallery-*.ext in the folder.
  const gallery = [];
  (Array.isArray(p.gallery) ? p.gallery : []).forEach((g) => {
    const r = existsRootRel(g);
    if (r) gallery.push(r);
  });
  const dir = path.join(ROOT, "Selected-Works", slug);
  if (fs.existsSync(dir)) {
    fs.readdirSync(dir)
      .filter((f) => /^gallery-.*\.(jpe?g|png|webp)$/i.test(f))
      .sort()
      .forEach((f) => {
        const rel = `Selected-Works/${slug}/${f}`;
        if (!gallery.includes(rel)) gallery.push(rel);
      });
  }

  return { cover, steps, decisionsImg, outcomeImg, gallery };
}

/* ---------- the page template ---------- */

function renderNav() {
  return `  <header class="nav">
    <div class="nav__inner">
      <a class="nav__brand" href="../index.html" aria-label="Robert Reynik — home"><img class="nav__logo" src="../images/RR-logo.svg" alt="Robert Reynik" width="40" height="40"></a>
      <nav class="nav__links" aria-label="Primary">
        <a href="../portfolio.html" class="is-active" aria-current="page">Portfolio</a>
        <a href="../writing.html">Articles</a>
        <a href="../about.html">About</a>
        <a href="../contact.html">Contact</a>
      </nav>
    </div>
  </header>`;
}

function renderFooter() {
  return `  <footer class="footer">
    <span class="footer__social">
      <a href="../contact.html">Email</a>
      <a href="#">Behance</a>
      <a href="#">LinkedIn</a>
      <a href="#">Instagram</a>
    </span>
    <span>© <span id="year"></span> Robert Reynik</span>
  </footer>`;
}

function renderPage(p) {
  const img = resolveImages(p);

  /* 1 · COVER */
  const lead = p.oneLiner ? `<p class="case__lead">${escapeHtml(p.oneLiner)}</p>` : "";
  const metaRows = [];
  if (p.role)   metaRows.push(`<div><dt>Role</dt><dd>${escapeHtml(p.role)}</dd></div>`);
  if (p.client) metaRows.push(`<div><dt>Client</dt><dd>${escapeHtml(p.client)}</dd></div>`);
  if (p.year)   metaRows.push(`<div><dt>Year</dt><dd>${escapeHtml(p.year)}</dd></div>`);
  const meta = metaRows.length ? `<dl class="case__meta">${metaRows.join("")}</dl>` : "";
  const cover = img.cover
    ? `<div class="case__cover" style="${bg(img.cover)}" role="img" aria-label="${escapeHtml(p.title)}"></div>`
    : "";

  const cover_section = `
    <section class="case__section">
      <h1 class="case__title">${escapeHtml(p.title)}</h1>
      ${lead}
      ${meta}
      ${cover}
    </section>`;

  /* 2 · THE BRIEF */
  let brief_section = "";
  if (p.brief) {
    brief_section = `
    <section class="case__section case__brief">
      <p class="case__eyebrow">The brief</p>
      ${paragraphs(p.brief)}
    </section>`;
  }

  /* 3 · PROCESS */
  let process_section = "";
  if (img.steps.length) {
    const steps = img.steps
      .map(
        (s) => `
        <figure class="case__step">
          <div class="case__step-img" style="${bg(s.image)}" role="img" aria-label="${escapeHtml(s.label)}"></div>
          <figcaption class="case__step-label">${escapeHtml(s.label)}</figcaption>
        </figure>`
      )
      .join("");
    process_section = `
    <section class="case__section">
      <p class="case__eyebrow">Process</p>
      <div class="case__process">${steps}
      </div>
    </section>`;
  }

  /* 4 · KEY DECISIONS */
  let decisions_section = "";
  const dText = p.decisions && p.decisions.text;
  if (dText || img.decisionsImg) {
    const di = img.decisionsImg
      ? `<div class="case__decisions-img" style="${bg(img.decisionsImg)}" role="img" aria-label="Key decisions"></div>`
      : "";
    decisions_section = `
    <section class="case__section">
      <p class="case__eyebrow">Key decisions</p>
      <div class="case__decisions">
        <div>
          ${dText ? paragraphs(dText) : ""}
        </div>
        ${di}
      </div>
    </section>`;
  }

  /* 5 · OUTCOME */
  let outcome_section = "";
  const o = p.outcome || {};
  const metrics = Array.isArray(o.metrics) ? o.metrics.filter((m) => m && m.value) : [];
  if (o.text || img.outcomeImg || metrics.length) {
    const oi = img.outcomeImg
      ? `<div class="case__outcome-img" style="${bg(img.outcomeImg)}" role="img" aria-label="Outcome"></div>`
      : "";
    const oText = o.text ? paragraphs(o.text) : "";
    const mCards = metrics
      .map(
        (m) => `
        <div class="case__metric"><dt>${escapeHtml(m.label)}</dt><dd>${escapeHtml(m.value)}</dd></div>`
      )
      .join("");
    const mBlock = metrics.length ? `<dl class="case__metrics">${mCards}\n      </dl>` : "";
    outcome_section = `
    <section class="case__section case__outcome">
      <p class="case__eyebrow">Outcome</p>
      ${oi}
      ${oText}
      ${mBlock}
    </section>`;
  }

  /* GALLERY (optional) */
  let gallery_section = "";
  if (img.gallery.length) {
    const tiles = img.gallery
      .map(
        (g, i) => `
        <div class="case__gallery-img" style="${bg(g)}" role="img" aria-label="${escapeHtml(p.title)} image ${i + 1}"></div>`
      )
      .join("");
    gallery_section = `
    <section class="case__section">
      <p class="case__eyebrow">Gallery</p>
      <div class="case__gallery">${tiles}
      </div>
    </section>`;
  }

  /* 6 · CALL TO ACTION */
  const cta_section = `
    <section class="case__cta">
      <h2>Have a project like this?</h2>
      <a class="btn btn--solid" href="../contact.html">Get in touch</a>
    </section>`;

  const backLink = `
      <a class="case__back" href="../portfolio.html">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        Back to portfolio
      </a>`;

  const desc = p.oneLiner || p.descriptor || (p.title + " — case study by Robert Reynik");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(p.title)} — Robert Reynik</title>
  <meta name="description" content="${escapeHtml(desc)}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500&family=Hanken+Grotesk:wght@300;400;500;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../css/style.css">
</head>
<body>

${renderNav()}

  <main>
    <article class="case">
${backLink}
${cover_section}${brief_section}${process_section}${decisions_section}${outcome_section}${gallery_section}
${cta_section}
    </article>
  </main>

${renderFooter()}

  <script src="../js/main.js"></script>
</body>
</html>
`;
}

/* ---------- run ----------

   Usage:
     node build/generate.js                 build all (only rewrites pages
                                             whose content actually changed)
     node build/generate.js silent-suites   build only that project
     node build/generate.js a b c           build only projects a, b, c
     node build/generate.js --force         rewrite every page even if
                                             unchanged (rarely needed)

   Why the change-detection matters: the script compares the freshly
   generated HTML against what's already on disk and ONLY writes when they
   differ. So rebuilding after editing one project leaves every other file
   byte-for-byte identical, and `git` sees just the one page you changed —
   no more giant "all pages updated" commits.
*/

function main() {
  const args = process.argv.slice(2);
  const force = args.includes("--force");
  // anything that isn't a flag is treated as a target slug
  const targets = args.filter((a) => !a.startsWith("-"));
  const wantAll = targets.length === 0;

  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

  // Validate any requested slugs up front so typos fail loudly.
  if (!wantAll) {
    const known = new Set(WORKS.map((p) => p.slug).filter(Boolean));
    const unknown = targets.filter((t) => !known.has(t));
    if (unknown.length) {
      console.error(`  ! unknown slug(s): ${unknown.join(", ")}`);
      console.error(`    available: ${[...known].join(", ")}`);
      process.exitCode = 1;
      return;
    }
  }

  const seen = new Set();
  let wrote = 0;
  let unchanged = 0;
  let skipped = 0;

  WORKS.forEach((p) => {
    if (!p.slug) {
      console.warn(`  ! skipped "${p.title || "untitled"}" — missing slug`);
      return;
    }
    if (seen.has(p.slug)) {
      console.warn(`  ! duplicate slug "${p.slug}" — second one overwrites the first`);
    }
    seen.add(p.slug);

    // When targeting specific projects, leave the rest untouched.
    if (!wantAll && !targets.includes(p.slug)) {
      skipped++;
      return;
    }

    const html = renderPage(p);
    const outPath = path.join(OUT_DIR, `${p.slug}.html`);

    // Idempotent write: only touch the file if the bytes actually differ.
    const current = fs.existsSync(outPath) ? fs.readFileSync(outPath, "utf8") : null;
    if (!force && current === html) {
      unchanged++;
      console.log(`  · projects/${p.slug}.html (unchanged)`);
      return;
    }

    fs.writeFileSync(outPath, html, "utf8");
    wrote++;
    console.log(`  ✓ projects/${p.slug}.html ${current === null ? "(new)" : "(updated)"}`);
  });

  const bits = [`${wrote} written`];
  if (unchanged) bits.push(`${unchanged} unchanged`);
  if (skipped) bits.push(`${skipped} not targeted`);
  console.log(`\nDone — ${bits.join(", ")}.`);
  if (wrote === 0) console.log("Nothing changed, so git will show no diff. 👍");
}

main();
