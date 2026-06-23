#!/usr/bin/env node
/* ============================================================
   generate-index.js — bake my listing pages into static HTML
   ============================================================

   My case-study and article pages are already generated (generate.js
   and generate-articles.js). This script does the same for the three
   pages that USED to be built in the browser by js/main.js:

     • index.html      hero image + "Recent projects" carousel + Field Notes
     • portfolio.html  the full project grid
     • writing.html    the articles index list

   I keep editing data/works.js and data/articles.js as my single
   source of truth; this writes their content straight into the HTML
   between the <!-- build:NAME:start --> / <!-- build:NAME:end -->
   markers, so the pages show everything on first load with no
   JavaScript. js/main.js still runs as a fallback, but only fills a
   list if the build left it empty, so nothing is ever doubled.

   Run from the repo root:
       node build/generate-index.js        (or)  npm run build
============================================================ */

"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const WORKS = require(path.join(ROOT, "data", "works.js"));
const ARTICLES = require(path.join(ROOT, "data", "articles.js"));

const HOME_LIMIT = 9;        // projects shown on the homepage before "Load More"
const HOME_WRITING = 3;      // Field Notes cards on the homepage
const TAG_LABELS = { research: "Research", tutorial: "Tutorial", studio: "Studio" };

/* ---------- helpers (mirror the ones in js/main.js so output matches) ---------- */

function escapeHtml(s) {
  return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
  });
}
const escapeAttr = escapeHtml;

function projectUrl(p) {
  if (p.url) return p.url;
  if (p.slug) return "projects/" + p.slug + ".html";
  return "#";
}

function fmtDate(iso) {
  if (!iso) return "";
  const d = new Date(iso + "T00:00:00");
  if (isNaN(d)) return iso;
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

// Newest first — I add new entries to the BOTTOM of works.js / articles.js.
const RECENT = WORKS.slice().reverse();
const RECENT_ARTICLES = ARTICLES.slice().reverse();

/* ---------- section builders ---------- */

function heroHtml() {
  const first = RECENT[0];
  const href = first ? projectUrl(first) : "#";
  const label = first ? "View project: " + first.title : "View project";
  const bg = first && first.image
    ? ` style="background-image:url('${first.image}')"`
    : "";
  return `
    <a class="hero__bg" id="heroLink" href="${escapeAttr(href)}" aria-label="${escapeAttr(label)}">
      <div class="hero__layer is-visible" id="heroLayerA" aria-hidden="true"${bg}></div>
      <div class="hero__layer" id="heroLayerB" aria-hidden="true"></div>
    </a>
  `;
}

function workCard(p) {
  const typeTag = p.type
    ? `<span class="work-card__type">${escapeHtml(p.type)}</span>`
    : "";
  return `      <a class="work-card" href="${escapeAttr(projectUrl(p))}" role="listitem" aria-label="${escapeAttr(p.title + " — " + (p.descriptor || ""))}">
        <div class="work-card__img" style="background-image:url('${p.image}')" role="img" aria-label="${escapeAttr(p.title)}">
          <div class="work-card__overlay">${typeTag}
            <h3 class="work-card__title">${escapeHtml(p.title)}</h3>
            <p class="work-card__desc">${escapeHtml(p.descriptor || "")}</p>
          </div>
        </div>
      </a>`;
}

function carouselHtml() {
  return "\n" + RECENT.slice(0, HOME_LIMIT).map(workCard).join("\n") + "\n    ";
}

function portfolioItem(p) {
  return `      <a class="portfolio__item" href="${escapeAttr(projectUrl(p))}">
        <div class="portfolio__img" style="background-image:url('${p.image}')" role="img" aria-label="${escapeAttr(p.title)}"></div>
        <div class="portfolio__cap">
          <div class="t">${escapeHtml(p.title)}</div>
          <div class="d">${escapeHtml(p.descriptor || "")}</div>
        </div>
      </a>`;
}

function portfolioHtml() {
  return "\n" + RECENT.map(portfolioItem).join("\n") + "\n      ";
}

function writingCard(a) {
  if (!a.slug) return "";
  const label = TAG_LABELS[a.tag] || a.tag || "";
  const tag = a.tag ? `<span class="tag tag--${escapeAttr(a.tag)}">${escapeHtml(label)}</span>` : "";
  const summary = a.excerpt || a.description || "";
  return `      <a class="card-article" href="writing/${escapeAttr(a.slug)}.html">${tag}
        <h3>${escapeHtml(a.title)}</h3>
        <p>${escapeHtml(summary)}</p>
      </a>`;
}

function writingCardsHtml() {
  const cards = RECENT_ARTICLES.slice(0, HOME_WRITING).map(writingCard).filter(Boolean);
  if (!cards.length) return "";
  return "\n" + cards.join("\n") + "\n    ";
}

function writingItem(a) {
  if (!a.slug) return "";
  const label = TAG_LABELS[a.tag] || a.tag || "";
  const tag = a.tag ? `<span class="tag tag--${escapeAttr(a.tag)}">${escapeHtml(label)}</span>` : "";
  const date = a.date ? `<span class="writing-item__date">${escapeHtml(fmtDate(a.date))}</span>` : "";
  const excerpt = a.excerpt || a.description || "";
  return `      <a class="writing-item" href="writing/${escapeAttr(a.slug)}.html">
        <div class="writing-item__meta">${tag}${date}</div>
        <h2 class="writing-item__title">${escapeHtml(a.title)}</h2>
        <p class="writing-item__excerpt">${escapeHtml(excerpt)}</p>
      </a>`;
}

function writingListHtml() {
  const items = RECENT_ARTICLES.map(writingItem).filter(Boolean);
  if (!items.length) return "";
  return "\n" + items.join("\n") + "\n      ";
}

/* ---------- marker replacement ---------- */

// Replace whatever sits between <!-- build:NAME:start --> and :end with `inner`.
function fill(html, name, inner) {
  const start = `<!-- build:${name}:start -->`;
  const end = `<!-- build:${name}:end -->`;
  const re = new RegExp(
    escapeRe(start) + "[\\s\\S]*?" + escapeRe(end)
  );
  if (!re.test(html)) {
    console.warn(`  ! marker "${name}" not found — skipped`);
    return html;
  }
  return html.replace(re, start + inner + end);
}
function escapeRe(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }

// Read, apply a set of [name, inner] fills, write only if changed.
function process(file, fills) {
  const p = path.join(ROOT, file);
  if (!fs.existsSync(p)) { console.warn(`  ! ${file} not found`); return; }
  const before = fs.readFileSync(p, "utf8");
  let after = before;
  fills.forEach(([name, inner]) => { after = fill(after, name, inner); });
  if (after === before) {
    console.log(`  · ${file} (unchanged)`);
    return;
  }
  fs.writeFileSync(p, after, "utf8");
  console.log(`  ✓ ${file} (updated)`);
}

/* ---------- run ---------- */

process("index.html", [
  ["hero", heroHtml()],
  ["carousel", carouselHtml()],
  ["writing-cards", writingCardsHtml()],
]);
process("portfolio.html", [
  ["portfolio", portfolioHtml()],
]);
process("writing.html", [
  ["writing-list", writingListHtml()],
]);

console.log("\nDone — listing pages baked in.");
