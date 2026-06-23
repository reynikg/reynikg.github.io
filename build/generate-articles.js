#!/usr/bin/env node
/* ============================================================
   generate-articles.js — build one static article page per entry
   ============================================================

   Reads the article list from  data/articles.js  and writes a full
   HTML page to  writing/<slug>.html  for each one. Same idea as
   build/generate.js (which builds the project case studies), but
   tuned for long-form articles and heavily SEO / GEO optimised.

   Run it from the repo root:

       node build/generate-articles.js
       node build/generate-articles.js <slug>      (build just one)
       node build/generate-articles.js --force     (rewrite all)

   For every article it:
     • renders the fixed template: intro → TL;DR → cover → body → FAQ;
     • auto-calculates the "X min read" from the word count;
     • emits SEO + GEO metadata: <title>, meta description, keywords,
       canonical link, Open Graph / Twitter cards, and JSON-LD for
       both the Article and (if present) the FAQ — the structured data
       that gets articles into AI answers and rich results;
     • only writes a file when the bytes actually change, so git shows
       a clean one-page diff.
   ============================================================ */

"use strict";

const fs = require("fs");
const path = require("path");

/* ------------------------------------------------------------
   SITE — the public base URL, used for canonical + Open Graph URLs.
   If you move to a custom domain (e.g. https://robertreynik.com),
   change this one line and rebuild.
------------------------------------------------------------ */
const SITE = "https://robertreynik.com";
const AUTHOR = "Robert Reynik";
const WORDS_PER_MINUTE = 200;

const ROOT = path.join(__dirname, "..");
const OUT_DIR = path.join(ROOT, "writing");
const ARTICLES = require(path.join(ROOT, "data", "articles.js"));

const TAG_LABELS = { research: "Research", tutorial: "Tutorial", studio: "Studio" };

/* ---------- small helpers ---------- */

function escapeHtml(s) {
  return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
  });
}

// For text that goes inside a JSON-LD string value (strip markdown, keep plain).
function plain(s) {
  return String(s == null ? "" : s)
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

// Minimal, safe inline formatter: escape first, THEN turn **bold** and
// `code` markers into tags. Because escaping leaves * and ` untouched,
// this is safe and can't inject HTML.
function inline(s) {
  let out = escapeHtml(s);
  out = out.replace(/`([^`]+)`/g, "<code>$1</code>");
  out = out.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  return out;
}

// Split a text blob into <p> paragraphs on blank lines, with inline formatting.
function paragraphs(text, cls) {
  const c = cls ? ` class="${cls}"` : "";
  return String(text || "")
    .split(/\n\s*\n+/)
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => `<p${c}>${inline(s)}</p>`)
    .join("\n        ");
}

// Root-relative asset path → "../" hop, since pages live in writing/.
function up(rel) {
  if (!rel) return rel;
  if (/^https?:\/\//i.test(rel)) return rel;
  return "../" + rel.replace(/^\/+/, "");
}

/* ---------- reading time ---------- */

function countWords(s) {
  const t = plain(s);
  return t ? t.split(/\s+/).length : 0;
}

function readingTime(a) {
  if (a.readingTime) return a.readingTime;
  let words = countWords(a.intro) + countWords(a.tldr);
  (a.body || []).forEach((b) => {
    if (typeof b === "string") words += countWords(b);
    else if (!b || b.type === "code") return; // code isn't read at prose speed
    else if (b.type === "list") (b.items || []).forEach((i) => (words += countWords(i)));
    else words += countWords(b.text);
  });
  (a.faq || []).forEach((f) => {
    words += countWords(f.q) + countWords(f.a);
  });
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE)) + " min read";
}

/* ---------- image resolution ---------- */

// Resolve a cover/body image src to a root-relative path.
//   • full URL  → used as-is
//   • has a "/" → treated as already root-relative
//   • bare name → looked up inside writing/<slug>/
// Returns { rel, exists }.
function resolveImg(slug, src) {
  if (!src) return null;
  if (/^https?:\/\//i.test(src)) return { rel: src, exists: true };
  const rel = src.includes("/") ? src.replace(/^\/+/, "") : `writing/${slug}/${src}`;
  const exists = fs.existsSync(path.join(ROOT, rel));
  return { rel, exists };
}

// An <img> if the file exists, otherwise a labelled placeholder box so the
// layout (and the image's place in the flow) is still visible. Drop the real
// file in writing/<slug>/ and rebuild to replace it.
function imageEl(slug, src, alt, classes, caption) {
  const r = resolveImg(slug, src);
  const a = escapeHtml(alt || "");
  let media;
  if (r && r.exists) {
    media = `<img class="${classes}" src="${escapeHtml(up(r.rel))}" alt="${a}" loading="lazy">`;
  } else {
    media =
      `<div class="${classes} article__img--placeholder" role="img" aria-label="${a}">` +
      `<span>Image: ${a || "add " + escapeHtml(src)}</span></div>`;
  }
  if (caption) {
    return `<figure class="article__figure">\n        ${media}\n        <figcaption class="article__caption">${inline(
      caption
    )}</figcaption>\n      </figure>`;
  }
  return media;
}

/* ---------- date formatting ---------- */

function fmtDate(iso) {
  if (!iso) return "";
  const d = new Date(iso + "T00:00:00");
  if (isNaN(d)) return iso;
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

/* ---------- body blocks ---------- */

function renderBody(a) {
  return (a.body || [])
    .map((b) => {
      if (typeof b === "string") return paragraphs(b);
      if (!b) return "";
      switch (b.type) {
        case "paragraph":
          return paragraphs(b.text);
        case "heading": {
          const lvl = b.level === 3 ? 3 : 2;
          const cls = lvl === 2 ? "article__h2" : "article__h3";
          const id = slugify(b.text);
          return `<h${lvl} id="${id}" class="${cls}">${inline(b.text)}</h${lvl}>`;
        }
        case "image":
          return imageEl(a.slug, b.src, b.alt, "article__img", b.caption);
        case "list": {
          const tag = b.ordered ? "ol" : "ul";
          const items = (b.items || [])
            .map((i) => `<li>${inline(i)}</li>`)
            .join("\n          ");
          return `<${tag} class="article__list">\n          ${items}\n        </${tag}>`;
        }
        case "code": {
          const lang = b.language ? ` data-lang="${escapeHtml(b.language)}"` : "";
          return `<pre class="article__code"${lang}><code>${escapeHtml(b.code)}</code></pre>`;
        }
        default:
          return "";
      }
    })
    .filter(Boolean)
    .join("\n      ");
}

function slugify(s) {
  return String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

/* ---------- structured data (JSON-LD) ---------- */

function jsonLd(a) {
  const url = `${SITE}/writing/${a.slug}.html`;
  const cover = a.cover && resolveImg(a.slug, a.cover.src);
  const image = cover ? (/^https?:/.test(cover.rel) ? cover.rel : `${SITE}/${cover.rel}`) : undefined;

  const article = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: plain(a.title),
    description: plain(a.description || a.excerpt || ""),
    author: { "@type": "Person", name: AUTHOR },
    publisher: { "@type": "Person", name: AUTHOR },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url: url,
  };
  if (a.date) article.datePublished = a.date;
  if (a.updated || a.date) article.dateModified = a.updated || a.date;
  if (image) article.image = image;
  if (Array.isArray(a.keywords) && a.keywords.length) article.keywords = a.keywords.join(", ");

  const blocks = [article];

  if (Array.isArray(a.faq) && a.faq.length) {
    blocks.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: a.faq.map((f) => ({
        "@type": "Question",
        name: plain(f.q),
        acceptedAnswer: { "@type": "Answer", text: plain(f.a) },
      })),
    });
  }

  return blocks
    .map(
      (b) =>
        `  <script type="application/ld+json">\n${JSON.stringify(b, null, 2)}\n  </script>`
    )
    .join("\n");
}

/* ---------- shared chrome ---------- */

function renderNav() {
  return `  <header class="nav">
    <div class="nav__inner">
      <a class="nav__brand" href="../index.html" aria-label="Robert Reynik — home"><img class="nav__logo" src="../images/RR-logo.svg" alt="Robert Reynik" width="40" height="40"></a>
      <nav class="nav__links" aria-label="Primary">
        <a href="../portfolio.html">Portfolio</a>
        <a href="../writing.html" class="is-active" aria-current="page">Articles</a>
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

/* ---------- the page template ---------- */

function renderPage(a) {
  const url = `${SITE}/writing/${a.slug}.html`;
  const title = escapeHtml(a.seoTitle || a.title) + " — Robert Reynik";
  const desc = plain(a.description || a.excerpt || a.title);
  const tagLabel = TAG_LABELS[a.tag] || (a.tag ? a.tag : "");
  const tagPill = a.tag
    ? `<span class="tag tag--${escapeHtml(a.tag)}">${escapeHtml(tagLabel)}</span>`
    : "";

  const cover = a.cover && resolveImg(a.slug, a.cover.src);
  const ogImage = cover ? (/^https?:/.test(cover.rel) ? cover.rel : `${SITE}/${cover.rel}`) : "";

  /* ── meta block (head) ── */
  const head = `  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>
  <meta name="description" content="${escapeHtml(desc)}">
${a.keywords && a.keywords.length ? `  <meta name="keywords" content="${escapeHtml(a.keywords.join(", "))}">\n` : ""}  <meta name="author" content="${AUTHOR}">
  <link rel="canonical" href="${url}">
  <meta property="og:type" content="article">
  <meta property="og:title" content="${escapeHtml(a.seoTitle || a.title)}">
  <meta property="og:description" content="${escapeHtml(desc)}">
  <meta property="og:url" content="${url}">
${ogImage ? `  <meta property="og:image" content="${escapeHtml(ogImage)}">\n` : ""}  <meta name="twitter:card" content="${ogImage ? "summary_large_image" : "summary"}">
  <meta name="twitter:title" content="${escapeHtml(a.seoTitle || a.title)}">
  <meta name="twitter:description" content="${escapeHtml(desc)}">
${ogImage ? `  <meta name="twitter:image" content="${escapeHtml(ogImage)}">\n` : ""}${a.date ? `  <meta property="article:published_time" content="${a.date}">\n` : ""}  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500&family=Hanken+Grotesk:wght@300;400;500;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../css/style.css">
${jsonLd(a)}`;

  /* ── body ── */
  const metaLine = `<div class="article__meta">
        ${tagPill}
        ${a.date ? `<time datetime="${a.date}">${fmtDate(a.date)}</time>` : ""}
        <span class="article__readtime">${readingTime(a)}</span>
      </div>`;

  const intro = a.intro ? `<div class="article__intro">\n        ${paragraphs(a.intro)}\n      </div>` : "";

  const tldr = a.tldr
    ? `<aside class="article__tldr" aria-label="TL;DR — summary">
        <p class="article__tldr-label">TL;DR</p>
        ${paragraphs(a.tldr)}
      </aside>`
    : "";

  const coverEl =
    a.cover && a.cover.src
      ? `<div class="article__cover-wrap">${imageEl(
          a.slug,
          a.cover.src,
          a.cover.alt,
          "article__cover",
          a.cover.caption
        )}</div>`
      : "";

  const body = `<div class="article__body">
      ${renderBody(a)}
      </div>`;

  let faq = "";
  if (Array.isArray(a.faq) && a.faq.length) {
    const items = a.faq
      .map(
        (f) => `        <div class="article__faq-item">
          <h3 class="article__faq-q">${inline(f.q)}</h3>
          ${paragraphs(f.a, "article__faq-a")}
        </div>`
      )
      .join("\n");
    faq = `<section class="article__faq" aria-label="Frequently asked questions">
        <h2 class="article__h2">FAQ</h2>
${items}
      </section>`;
  }

  let refs = "";
  if (Array.isArray(a.references) && a.references.length) {
    const links = a.references
      .map(
        (r) =>
          `<a href="${escapeHtml(r.url)}" target="_blank" rel="noopener">${escapeHtml(r.label)}</a>`
      )
      .join(", ");
    refs = `<p class="article__refs">References: ${links}</p>`;
  }

  const backLink = `      <a class="case__back" href="../writing.html">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        Back to writing
      </a>`;

  const cta = `<section class="case__cta">
        <h2>Want to work together?</h2>
        <a class="btn btn--solid" href="../contact.html">Get in touch</a>
      </section>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
${head}
</head>
<body>

${renderNav()}

  <main>
    <article class="article">
${backLink}
      <header class="article__head">
        <h1 class="article__title">${escapeHtml(a.title)}</h1>
        ${metaLine}
      </header>
      ${intro}
      ${tldr}
      ${coverEl}
      ${body}
      ${faq}
      ${refs}
      ${cta}
    </article>
  </main>

${renderFooter()}

  <script src="../js/main.js"></script>
</body>
</html>
`;
}

/* ---------- run ---------- */

function main() {
  const args = process.argv.slice(2);
  const force = args.includes("--force");
  const targets = args.filter((a) => !a.startsWith("-"));
  const wantAll = targets.length === 0;

  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

  if (!wantAll) {
    const known = new Set(ARTICLES.map((a) => a.slug).filter(Boolean));
    const unknown = targets.filter((t) => !known.has(t));
    if (unknown.length) {
      console.error(`  ! unknown slug(s): ${unknown.join(", ")}`);
      console.error(`    available: ${[...known].join(", ")}`);
      process.exitCode = 1;
      return;
    }
  }

  const seen = new Set();
  let wrote = 0,
    unchanged = 0,
    skipped = 0;

  ARTICLES.forEach((a) => {
    if (!a.slug) {
      console.warn(`  ! skipped "${a.title || "untitled"}" — missing slug`);
      return;
    }
    if (seen.has(a.slug)) {
      console.warn(`  ! duplicate slug "${a.slug}" — second one overwrites the first`);
    }
    seen.add(a.slug);

    if (!wantAll && !targets.includes(a.slug)) {
      skipped++;
      return;
    }

    const html = renderPage(a);
    const outPath = path.join(OUT_DIR, `${a.slug}.html`);
    const current = fs.existsSync(outPath) ? fs.readFileSync(outPath, "utf8") : null;

    if (!force && current === html) {
      unchanged++;
      console.log(`  · writing/${a.slug}.html (unchanged)`);
      return;
    }

    fs.writeFileSync(outPath, html, "utf8");
    wrote++;
    console.log(`  ✓ writing/${a.slug}.html ${current === null ? "(new)" : "(updated)"}`);
  });

  const bits = [`${wrote} written`];
  if (unchanged) bits.push(`${unchanged} unchanged`);
  if (skipped) bits.push(`${skipped} not targeted`);
  console.log(`\nDone — ${bits.join(", ")}.`);
}

main();
