# My site workflow

This is my own cheat-sheet for running the site. The whole thing is plain
static HTML — every page is real HTML on disk, so it loads instantly and search
engines and link-preview bots see all the content without running any
JavaScript. I never hand-edit the generated pages; I edit data, drop in images,
and run the build.

## The one rule

`data/works.js` and `data/articles.js` are my single source of truth. I change
content there, then run the build. The build writes:

- a case-study page per project → `projects/<slug>.html`
- an article page per entry → `writing/<slug>.html`
- the homepage hero + "Recent projects" + "Field Notes" → into `index.html`
- the full project grid → into `portfolio.html`
- the articles index → into `writing.html`
- `sitemap.xml` and `robots.txt`

The listing pages (home, portfolio, writing) have `<!-- build:...:start/end -->`
markers in them. The build fills the space between the markers. I leave the
markers alone and never type project/article cards by hand.

## Adding a project

1. Pick a slug (lowercase-with-hyphens, e.g. `silent-suites`).
2. Drop images in `Selected-Works/<slug>/` using the convention names
   (`cover.jpg`, `sketch.jpg`, `cad.jpg`, `prototype.jpg`, `final.jpg`,
   `decisions.jpg`, `outcome.jpg`, `gallery-1.jpg`…), and keep the grid
   thumbnail at `Selected-Works/<slug>-thumbnail.jpg`.
3. Add an entry to the BOTTOM of `data/works.js` (newest goes last; the site
   shows newest first) and fill in the text.
4. `npm run optimize` — shrink the new images (see "Images" below).
5. `npm run build`
6. `git add -A && git commit -m "Add <slug>" && git push`

## Adding an article

1. Pick a slug. If it has images, put them in `writing/<slug>/`.
2. Add an entry to the BOTTOM of `data/articles.js` and fill in the text.
3. `npm run optimize` (if I added images)
4. `npm run build`
5. Commit and push.

## Images — the thing that actually matters for speed

Big images are the #1 thing that slows the site down. My rule: never commit an
image straight off the camera or a design export. After I drop new images in,
I run:

```bash
npm install        # ONCE, the first time on a machine — installs sharp
npm run optimize   # resizes anything oversized + recompresses, in place
```

`optimize` caps the long edge at 1600px and re-compresses. It only rewrites a
file when the result is meaningfully smaller and skips files that are already
small, so running it repeatedly is safe and won't degrade anything. (One-time
note: I already ran this once and it took the image folder from ~32 MB to
~9 MB. The original full-size files are still in my git history if I ever need
them.)

## The commands

```bash
npm run build          # rebuild everything (only changed files are written)
npm run build:index    # just re-bake the home/portfolio/writing listings
npm run build:projects # just the project case-study pages
npm run build:articles # just the article pages
npm run build:sitemap  # just sitemap.xml + robots.txt
npm run optimize        # shrink images (needs `npm install` once)
```

Building only rewrites a file when its content actually changed, so `git`
shows a clean, small diff — usually just the page I touched.

## Why it's set up this way

The homepage, portfolio, and writing index used to be assembled in the browser
by `js/main.js` reading the data files. That meant the first thing a visitor
(or Google) got was an empty shell, and the content only appeared after the
JavaScript ran. Now the build bakes that content into the HTML at publish time.
`js/main.js` still runs — for the hero cross-fade, the image lightbox, the
contact button, the greeting animation — and it still knows how to build the
lists, but only as a fallback if it finds a list empty. So it never doubles up.

## Publishing

GitHub Pages serves whatever I push to the repo. So the flow is always:
edit data → `npm run optimize` (if new images) → `npm run build` → commit →
push. Live a minute later.
