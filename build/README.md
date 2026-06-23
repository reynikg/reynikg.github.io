# Build scripts

There are four build scripts, all plain Node (no install needed for the build
itself). `npm run build` runs them in order:

- `generate.js` — one case-study page per project → `projects/<slug>.html`
- `generate-articles.js` — one page per article → `writing/<slug>.html`
- `generate-index.js` — bakes the homepage hero/carousel/Field Notes, the
  portfolio grid, and the articles index straight into `index.html`,
  `portfolio.html`, and `writing.html` (between their `<!-- build:... -->`
  markers), so those pages carry their content without JavaScript
- `generate-sitemap.js` — `sitemap.xml` + `robots.txt`

There's also `optimize-images.js` (`npm run optimize`), which resizes and
recompresses oversized images in place. It's the only script that needs a
dependency, so it's a one-time `npm install` (it uses `sharp`). The day-to-day
flow and full command list live in `../WORKFLOW.md`.

## Case-study builder (generate.js)

This turns each entry in `data/works.js` into a full case-study page at
`projects/<slug>.html`. You never hand-write a project HTML file — you fill in
text in `works.js`, drop images in a folder, and run one command.

## Add or edit a project

1. **Choose a slug** — lowercase, hyphens, no spaces (e.g. `silent-suites`).
   It becomes both the page URL (`projects/silent-suites.html`) and the image
   folder name.

2. **Drop images** in `Selected-Works/<slug>/` using these names (skip any you
   don't have — the section just won't render):

   | File | Where it shows |
   |------|----------------|
   | `cover.jpg` | Big image under the title |
   | `sketch.jpg` · `cad.jpg` · `prototype.jpg` · `final.jpg` | The four Process tiles |
   | `decisions.jpg` | Beside the Key decisions text |
   | `outcome.jpg` | Outcome section |
   | `gallery-1.jpg`, `gallery-2.jpg`, … | Optional gallery grid |

   `.jpg`, `.jpeg`, `.png`, and `.webp` all work. Keep the grid **thumbnail**
   in `Selected-Works/` as before (e.g. `silent-suites-thumbnail.jpg`).

3. **Fill in the text** in `data/works.js` — `title`, `oneLiner`, `role`,
   `client`, `year`, `brief`, `decisions.text`, `outcome.text`, and the
   `outcome.metrics` cards. Every field except `slug`/`title` is optional.

4. **Build:**

   ```bash
   npm run build                     # rebuild all (only changed pages are written)
   node build/generate.js <slug>     # rebuild just one project
   node build/generate.js a b c      # rebuild a few specific projects
   node build/generate.js --force    # rewrite every page even if unchanged
   ```

5. **Commit and push.** GitHub Pages serves the generated files directly.

### Only changed pages are written (small git diffs)

The builder compares the freshly generated HTML against what's already on
disk and **only writes a file when its content actually changed**. So if you
edit one project and run `npm run build`, every other `projects/*.html` stays
byte-for-byte identical and `git` shows just the one page you touched — no more
"all pages updated" mega-commits. Output legend:

- `✓ … (new)` / `✓ … (updated)` — file was written
- `· … (unchanged)` — already up to date, left alone
- `· … (not targeted)` — skipped because you named specific slugs

If you ever need to force a clean rebuild of everything (e.g. after changing the
template in `build/generate.js`), use `--force`.

## How images are found

The builder looks for an explicit path in `works.js` first; if there isn't one
(or the file is missing), it falls back to the convention names above in
`Selected-Works/<slug>/`. Gallery images are auto-collected from any
`gallery-*` file in that folder — no need to list them.

## Notes

- Pure Node, **no `npm install`** needed.
- Re-running the build is safe; it overwrites `projects/*.html` each time.
- Section labels and the "Have a project like this?" call to action live in
  `build/generate.js` if you ever want to reword them.
