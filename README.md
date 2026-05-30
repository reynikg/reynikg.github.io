# Robert Reynik — portfolio

A static portfolio + writing site, built to run on GitHub Pages.
No build step, no frameworks — just open `index.html`.

## Folder structure

```
.
├── index.html            ← the landing page
├── about.html            ← (create this for the "About" link)
├── css/
│   └── style.css         ← all styling; edit colours/fonts at the top
├── js/
│   └── main.js           ← hero rotation + carousel logic
├── data/
│   └── works.js          ← YOUR PROJECT LIST (the one file you edit most)
├── Selected-Works/       ← project images live here, one per project
│   ├── light-shield.jpg
│   └── ...
├── images/               ← other site images (logos, about photo, etc.)
└── writing/              ← article / case-study pages go here later
```

## How the hero + carousel work

`data/works.js` is the single source of truth. Both the rotating hero
background and the "Selected work" carousel read from it. The hero
shows the images in a random order, changing every 6 seconds, and the
caption names whichever project is showing.

## Adding a project (your normal workflow)

1. Save the project's main image into `Selected-Works/`
   (~1600px wide, JPG, lowercase-hyphenated filename).
2. Open `data/works.js` and add one entry, copying the pattern.
3. Commit and push. The hero and carousel pick it up automatically.

## Editing the look

Open `css/style.css`. The `:root` block at the top has every colour
and the two fonts in one place — change `--panel` to retune the blue
hero panel, `--accent` for buttons, etc.

## Gotchas

- File paths are **case-sensitive** once live on GitHub. `Selected-Works`
  and the filenames in `works.js` must match exactly.
- The newsletter form doesn't send anything yet — wire it to a service
  like Formspree when you're ready (it needs no server).
- Replace the four placeholder images with your real renders.
