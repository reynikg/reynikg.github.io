# My site workflow

My own complete playbook for running robertreynik.com. Everything I need is in
this one file. The same details also live next to the code (in
`build/README.md`, the comments at the top of each `data/*.js` file, the
`README.txt` files in `Selected-Works/`, and my private `SEO-GEO-GUIDE.md`) —
this is the consolidated copy I reference while I'm working.

---

## How the site works (the 60-second model)

It's a **static site on GitHub Pages**. Every page is real HTML on disk, so it
loads fast and search engines and link-preview bots see the content without
running any JavaScript.

I don't hand-write the content-heavy pages. Instead I edit **data files**, then
run a **build** that writes the HTML for me:

| I edit this…            | …and the build writes this                                        |
|-------------------------|-------------------------------------------------------------------|
| `data/works.js`         | every `projects/<slug>.html`, plus the home hero/carousel and the portfolio grid |
| `data/articles.js`      | every `writing/<slug>.html`, plus the home "Field Notes" and the articles index |
| (both of the above)     | `sitemap.xml` and `robots.txt`                                     |

Two pages are still built **in the browser** (their content is not pre-rendered
and is invisible to crawlers — that's fine for these two):

| I edit this…       | …and JavaScript fills this in the browser            |
|--------------------|------------------------------------------------------|
| `data/about.js`    | the About-page accordion (`js/about.js`)             |
| `data/tools.json`  | the Tools & Games grid (`js/tools.js`, page is `noindex`) |

Everything else (`about.html` prose, `contact.html`, the nav, the footer) is
plain HTML I edit directly.

### What is generated vs. what I edit by hand

- **NEVER hand-edit:** anything in `projects/`, anything in `writing/`,
  `sitemap.xml`, `robots.txt`, and the text **between** the
  `<!-- build:...:start -->` / `<!-- build:...:end -->` markers inside
  `index.html`, `portfolio.html`, and `writing.html`. The build overwrites all
  of it. I also leave the markers themselves in place.
- **Hand-edit freely:** the data files, `about.html` prose, `contact.html`,
  `tools.html`, `css/style.css`, and everything **outside** the build markers on
  the home/portfolio/writing pages (headings, the hero text, the strip, etc.).

---

## The golden rules

1. **Data files are the single source of truth.** Change content there, not in
   the generated HTML.
2. **Newest goes at the BOTTOM** of `data/works.js` and `data/articles.js`. The
   site shows newest first; the build reverses the list.
3. **Paths are case-sensitive** on GitHub Pages. `Selected-Works` (capital S, W)
   and every filename must match exactly. `light-shield.jpg` ≠ `Light-Shield.JPG`.
4. **Never commit a huge image.** Run `npm run optimize` first (see below).
5. **Build before I commit**, so the generated pages match the data.

---

## ⭐ What to do EVERY time (the universal publish loop)

No matter what I changed — project, article, page, text, image, CSS — I finish
with this same loop:

```bash
# 1. Only if I added or changed images:
npm install        # FIRST TIME ONLY on a machine (installs sharp)
npm run optimize   # shrinks/recompresses images in place

# 2. Always:
npm run build      # regenerate project/article pages, listings, sitemap

# 3. Preview locally (static server — file:// breaks the Tools page fetch):
python3 -m http.server 8000      # then open http://localhost:8000
#   (or)  npx serve

# 4. Ship it:
git add -A
git commit -m "Describe what I changed"
git push
```

GitHub Pages redeploys within a minute of the push.

**Note:** `npm run build` only rewrites a file when its content actually
changed, so `git` shows a clean, small diff — usually just the page(s) I
touched.

### The full command list

```bash
npm run build           # everything, in order (projects → articles → listings → sitemap)
npm run build:projects  # just the project case-study pages
npm run build:articles  # just the article pages
npm run build:index     # just the home/portfolio/writing listings (between the markers)
npm run build:sitemap   # just sitemap.xml + robots.txt
npm run optimize        # shrink NEW/changed images (needs `npm install` once, uses sharp)
npm run optimize -- Selected-Works/light-shield        # only that folder
npm run optimize -- Selected-Works/coral-cycles-thumbnail.jpg   # only that file
```

`npm run optimize` works from anywhere inside the repo (npm finds the root
`package.json` for me). It optimises each image at most once — see the Images
section for why re-running is always safe.

Build a single project or article without touching the rest:

```bash
node build/generate.js silent-suites            # one project (slug)
node build/generate.js a b c                     # a few projects
node build/generate.js --force                   # rewrite all (after editing the template)
node build/generate-articles.js <slug>           # one article
```

---

## What to do when adding / updating a PROJECT

Source of truth: `data/works.js`. Images: `Selected-Works/`.

### Adding a project

1. **Pick a slug** — lowercase, hyphens, no spaces (e.g. `silent-suites`). This
   becomes the page URL (`projects/silent-suites.html`) AND the image folder
   name.
2. **Add the grid thumbnail** at `Selected-Works/<slug>-thumbnail.jpg`. This is
   the image used in the hero rotation, the homepage carousel, and the portfolio
   grid.
3. **Add the case-study images** in a folder `Selected-Works/<slug>/` using the
   convention names (any I skip are simply left off the page):

   | File | Where it appears |
   |------|------------------|
   | `cover.jpg` | big image under the title (16:9 looks best) |
   | `sketch.jpg` · `cad.jpg` · `prototype.jpg` · `final.jpg` | the four Process tiles |
   | `decisions.jpg` | beside the "Key decisions" text (4:3) |
   | `outcome.jpg` | the Outcome section (16:9) |
   | `gallery-1.jpg`, `gallery-2.jpg`, … | optional gallery grid |

   `.jpg / .jpeg / .png / .webp` all work. (If there's no `cover`, the build
   falls back to the thumbnail.)
4. **Add an entry to the BOTTOM of `data/works.js`** and fill in the text.
   Required: `slug`, `title`. Everything else optional: `descriptor`, `type`
   ("Personal Project" / "Academic Work" / "Professional Work" / "Other"),
   `image` (the thumbnail path), `oneLiner`, `role`, `client`, `year`, `brief`,
   `decisions: { text }`, `outcome: { text, metrics: [{label, value}] }`,
   `gallery`. Copy an existing block as a template; the full field reference is
   in the comment at the top of `data/works.js`.
5. **Optimize + build + ship** (the universal loop above).

### Updating a project

- Edit its entry in `data/works.js` (text) and/or swap images in its
  `Selected-Works/<slug>/` folder.
- Then the universal loop. To rebuild only that page:
  `node build/generate.js <slug>` (or just `npm run build`).

### Removing a project

1. Delete its block from `data/works.js`.
2. Delete the now-orphaned generated page `projects/<slug>.html` (the build does
   **not** auto-delete it).
3. Delete its images: `Selected-Works/<slug>/` and
   `Selected-Works/<slug>-thumbnail.jpg`.
4. Universal loop (the build refreshes the listings and sitemap so the project
   disappears from the grid/carousel/hero).

---

## What to do when adding / updating an ARTICLE

Source of truth: `data/articles.js`. Images: `writing/<slug>/`. The deep SEO/GEO
guidance lives in my private `SEO-GEO-GUIDE.md`.

### Adding an article

1. **Pick a slug** (lowercase, hyphens). It becomes `writing/<slug>.html` and
   the image folder `writing/<slug>/`.
2. **Add images** (if any) to `writing/<slug>/`. The cover is
   `writing/<slug>/cover.jpg`; reference body images by bare filename. Keep the
   cover under ~300 KB. Every image needs factual `alt` text.
3. **Add an entry to the BOTTOM of `data/articles.js`.** Required for good
   ranking: `slug`, `title`, `description`, `tldr`, `cover.alt`. Strongly
   recommended: `keywords`, `faq`. The `body` is an array of blocks
   (paragraph / heading / image / list / code) rendered in order. Full schema is
   in the comment at the top of `data/articles.js`.
4. **Write to be answer-first** (BLUF): the `description` and `tldr` lead with
   the answer; one `<h1>` (auto from `title`); clean h2/h3; FAQ with 3–6 real
   questions. (See `SEO-GEO-GUIDE.md` for the full per-article checklist.)
5. **Optimize + build + ship.** The build generates the page with all SEO
   markup (meta tags, Open Graph, Twitter card, JSON-LD Article + FAQ, reading
   time) for me. To rebuild only this article:
   `node build/generate-articles.js <slug>`.

### Updating an article

- Edit its entry in `data/articles.js`. Set `updated: "YYYY-MM-DD"` when it's a
  meaningful revision (the build emits `dateModified`).
- Universal loop.

### Removing an article

1. Delete its block from `data/articles.js`.
2. Delete the generated `writing/<slug>.html`.
3. Delete its images folder `writing/<slug>/`.
4. Universal loop.

---

## What to do when adding / removing a PAGE

This is the most manual job, because the nav menu is repeated in several places.
A "page" here means a brand-new top-level HTML file (like a future
`services.html`), not a project or article.

### Adding a new page

1. **Create the file** by copying an existing simple page (e.g. `about.html`) so
   I inherit the `<head>`, nav, and footer. Update the `<title>`, the meta
   description, the canonical URL, the Open Graph / Twitter tags, and the page
   content.
2. **Add the link to the nav on EVERY page.** The nav block is hand-copied into:
   `index.html`, `portfolio.html`, `writing.html`, `about.html`,
   `contact.html`, `tools.html`. Add the new `<a>` to each.
3. **Add it to the nav in the GENERATORS too**, so project and article pages get
   the link: the `renderNav()` function in `build/generate.js` and in
   `build/generate-articles.js`.
4. **Add it to the sitemap.** Edit the `staticPages` array in
   `build/generate-sitemap.js` (give it a `loc`, `priority`, `changefreq`).
   Leave it out only if I deliberately want it unindexed (like `tools.html`,
   which carries a `noindex` tag and is intentionally not in the sitemap).
5. **Optimize + build + ship.** (`npm run build` rebuilds the project/article
   pages with the new nav and regenerates the sitemap.)

### Removing a page

1. Delete the HTML file.
2. Remove its `<a>` from the nav in all the pages listed in step 2 above.
3. Remove it from `renderNav()` in both generators (step 3 above).
4. Remove its entry from `staticPages` in `build/generate-sitemap.js`.
5. Universal loop.

---

## What to do when adding / removing / editing CONTENT on a page

Where the content lives depends on the page. Find the row, edit that thing, then
run the universal loop.

| I want to change… | Edit this | Build needed? |
|-------------------|-----------|---------------|
| Home hero heading, role line, intro paragraph, "Recent projects"/"Field Notes" section titles | `index.html` (the parts **outside** the build markers) | No build needed for these, but harmless to run |
| The home hero image / carousel cards / Field Notes cards (the marked regions) | Don't edit the HTML — edit `data/works.js` / `data/articles.js`, then `npm run build` | **Yes** |
| Portfolio grid items | `data/works.js` → `npm run build` | **Yes** |
| Articles index list | `data/articles.js` → `npm run build` | **Yes** |
| About-page intro prose + CV download buttons | `about.html` directly | No |
| About-page accordion (Education, Experience, Skills, etc.) | `data/about.js` (renders in the browser) | No — just commit |
| Contact details / greeting / form | `contact.html` directly | No |
| Tools & Games entries | `data/tools.json` (renders in the browser) | No — just commit |
| Footer text / social links | each page's footer (and `renderFooter()` in both generators for project/article pages) | Yes, if I touched the generator footers |
| Colours, fonts, spacing, the whole look | `css/style.css` — the `:root` block at the top has every colour and the two fonts | No |

**Why some need a build and some don't:** the project/article pages and the
home/portfolio/writing **listings** are baked from data at build time, so
changing their data requires a rebuild. The About accordion and the Tools grid
are still assembled in the browser, so editing their data files takes effect on
the next page load with no build — I just commit and push.

---

## Images — the thing that actually matters for speed

Big images are the #1 thing that slows the site down. My rule: never commit an
image straight off the camera or a design export. After I drop new images in, I
run:

```bash
npm install        # ONCE per machine — installs sharp
npm run optimize   # resizes anything oversized + recompresses, in place
npm run optimize -- Selected-Works/light-shield              # one folder
npm run optimize -- Selected-Works/coral-cycles-thumbnail.jpg   # one file
```

`optimize` caps the long edge at 1600 px and re-compresses (JPEG/WebP at quality
82, PNG optimised). Targets to keep in mind: thumbnails and covers ideally a few
hundred KB, article covers under ~300 KB. The original full-size files are
recoverable from git history if I ever need them.

### Why re-running it never degrades my old images

The script keeps a ledger at `build/.images-optimized.json` — the content hash
of every image it has already optimised. On each run it hashes each file and
**skips any whose hash is already in the ledger**, so a photo is optimised at
most once, ever. Re-running after adding one new image only touches that new
image; everything else is left byte-for-byte untouched. If I replace or edit an
image its hash changes, so it gets optimised once more and re-recorded.

**The ledger is committed to git** — keep it in the repo so a fresh clone (where
the images are already optimised) doesn't redo them.

Targeting specific images (also handy if I ever want to redo just one):

```bash
npm run optimize -- Selected-Works/<slug>            # a whole folder
npm run optimize -- Selected-Works/<file>.jpg        # a single file
npm run optimize -- --force Selected-Works/<file>.jpg # force a redo even if recorded
```

`--force` is the only way to re-compress something already in the ledger, so I
use it deliberately and rarely.

---

## Reference

### File / folder map

```
index.html, portfolio.html, writing.html   ← hand-written shell; listings baked in by the build
about.html, contact.html, tools.html        ← hand-written pages
projects/<slug>.html                          ← GENERATED from data/works.js (don't edit)
writing/<slug>.html                           ← GENERATED from data/articles.js (don't edit)
sitemap.xml, robots.txt                       ← GENERATED (don't edit)

data/works.js        ← project list (source of truth)
data/articles.js     ← article list (source of truth)
data/about.js        ← About accordion (browser-rendered)
data/tools.json      ← Tools grid (browser-rendered)

build/generate.js            ← builds project pages
build/generate-articles.js   ← builds article pages
build/generate-index.js      ← bakes home/portfolio/writing listings into the markers
build/generate-sitemap.js    ← builds sitemap.xml + robots.txt (has the staticPages list)
build/optimize-images.js     ← `npm run optimize`
build/.images-optimized.json  ← ledger of already-optimised images (committed; don't hand-edit)

css/style.css        ← all styling; theme variables in the :root block up top
js/main.js           ← hero rotation, lightbox, contact button, greeting; fallback list-builder
js/about.js          ← builds the About accordion
js/tools.js          ← builds the Tools grid
Selected-Works/      ← project images (thumbnail in root, case-study images in <slug>/ subfolder)
writing/<slug>/      ← article images
images/              ← logos and shared images (RR-logo.svg, RR-logo2.png = the social/share image)
files/               ← CV / portfolio PDFs linked from About
CNAME                ← the custom domain
SEO-GEO-GUIDE.md     ← my private writing playbook (gitignored, never published)
```

### Gotchas

- **Case-sensitive paths** on GitHub Pages — match `Selected-Works` and every
  filename exactly.
- **Newest at the bottom** of `works.js` / `articles.js`.
- **The build doesn't delete orphans** — when I remove a project/article I also
  delete its generated `projects/`/`writing/` file by hand.
- **The contact form doesn't send yet** — `contact.html` has a Formspree
  placeholder (`YOUR_FORM_ID`) and a disabled Send button. To enable it: make a
  free Formspree form, paste the endpoint into the form `action`, and remove the
  `disabled` attribute on the button.
- **`file://` preview is incomplete** — the Tools page uses `fetch()`, which
  needs a real server. Use `python3 -m http.server` to preview properly.

### If I ever change the domain

The public URL is set in **four** places — update all of them, then
`npm run build`:

- the `SITE` constant at the top of `build/generate.js`
- the `SITE` constant in `build/generate-articles.js`
- the `SITE` constant in `build/generate-sitemap.js`
- the `CNAME` file (and the GitHub Pages custom-domain setting)

The per-page `<link rel="canonical">` and Open Graph URLs on the hand-written
pages (`index`, `portfolio`, `writing`, `about`, `contact`) are typed in those
files, so I'd update those by hand too.
