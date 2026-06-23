#!/usr/bin/env node
/* ============================================================
   generate-sitemap.js — build sitemap.xml and robots.txt
   ============================================================

   Reads the project list (data/works.js) and article list
   (data/articles.js) and writes two files at the repo root:

       sitemap.xml   every indexable URL on the site
       robots.txt    allow-all + a pointer to the sitemap

   Run it from the repo root:

       node build/generate-sitemap.js
       (or)  npm run build   (runs this after the page builds)

   If you move to a different domain, change SITE below — it's the
   same constant used by build/generate-articles.js.

   Note: tools.html is intentionally excluded — it carries a
   noindex robots tag, so it must not appear in the sitemap.
============================================================ */

"use strict";

const fs = require("fs");
const path = require("path");

const SITE = "https://robertreynik.com";

const ROOT = path.join(__dirname, "..");
const WORKS = require(path.join(ROOT, "data", "works.js"));
const ARTICLES = require(path.join(ROOT, "data", "articles.js"));

const today = new Date().toISOString().slice(0, 10);

/* ---------- collect URLs ---------- */

// Static, hand-authored pages. "" is the home page (served at "/").
const staticPages = [
  { loc: "", priority: "1.0", changefreq: "monthly" },
  { loc: "portfolio.html", priority: "0.9", changefreq: "monthly" },
  { loc: "writing.html", priority: "0.9", changefreq: "weekly" },
  { loc: "about.html", priority: "0.7", changefreq: "yearly" },
  { loc: "contact.html", priority: "0.5", changefreq: "yearly" },
];

const urls = [];

staticPages.forEach((p) => {
  urls.push({
    loc: `${SITE}/${p.loc}`,
    lastmod: today,
    changefreq: p.changefreq,
    priority: p.priority,
  });
});

WORKS.filter((p) => p.slug).forEach((p) => {
  urls.push({
    loc: `${SITE}/projects/${p.slug}.html`,
    lastmod: today,
    changefreq: "yearly",
    priority: "0.8",
  });
});

ARTICLES.filter((a) => a.slug).forEach((a) => {
  urls.push({
    loc: `${SITE}/writing/${a.slug}.html`,
    lastmod: a.updated || a.date || today,
    changefreq: "yearly",
    priority: "0.8",
  });
});

/* ---------- write sitemap.xml ---------- */

function xmlEscape(s) {
  return String(s).replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" }[c])
  );
}

const body = urls
  .map(
    (u) =>
      `  <url>\n` +
      `    <loc>${xmlEscape(u.loc)}</loc>\n` +
      `    <lastmod>${u.lastmod}</lastmod>\n` +
      `    <changefreq>${u.changefreq}</changefreq>\n` +
      `    <priority>${u.priority}</priority>\n` +
      `  </url>`
  )
  .join("\n");

const sitemap =
  `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  `${body}\n` +
  `</urlset>\n`;

fs.writeFileSync(path.join(ROOT, "sitemap.xml"), sitemap, "utf8");

/* ---------- write robots.txt ---------- */

const robots =
  `User-agent: *\n` +
  `Allow: /\n` +
  `\n` +
  `Sitemap: ${SITE}/sitemap.xml\n`;

fs.writeFileSync(path.join(ROOT, "robots.txt"), robots, "utf8");

console.log(`  ✓ sitemap.xml (${urls.length} URLs)`);
console.log(`  ✓ robots.txt`);
console.log(`\nDone.`);
