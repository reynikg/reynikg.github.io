# Case-study builder

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
   npm run build        # or:  node build/generate.js
   ```

5. **Commit and push.** GitHub Pages serves the generated files directly.

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
