/* ============================================================
   SELECTED WORKS — your project list (the single source of truth)
   ============================================================

   Both the rotating hero background AND the "Selected work" carousel
   read from this one list. To add a project:

     1. Put its main image in the  Selected-Works/  folder.
     2. Add one { ... } block below, copying the pattern.
     3. Save, then commit + push.

   IMPORTANT — file paths are case-sensitive on GitHub.
   The folder is "Selected-Works" (capital S, capital W). The path you
   write here must match the real filename exactly, or the image will
   work on your Mac but break once it's live.

   Fields:
     title      — shown bold in the carousel + hero caption
     descriptor — the one-line subtitle
     image      — path to the image, relative to index.html
     url        — where the card links (use "#" until the case study exists)
============================================================ */

const WORKS = [
  {
    title: "Light Shield",
    descriptor: "A wearable safety solution",
    image: "Selected-Works/light-shield.jpg",
    url: "#"
  },
  {
    title: "Trike Concept",
    descriptor: "Lightweight personal mobility",
    image: "Selected-Works/orange-trike.jpg",
    url: "#"
  },
  {
    title: "Privacy Booths",
    descriptor: "Acoustic focus pods for open offices",
    image: "Selected-Works/privacy-booths.jpg",
    url: "#"
  },
  {
    title: "Acoustic Headset",
    descriptor: "Ergonomic listening, rethought",
    image: "Selected-Works/acoustic-headset.jpg",
    url: "#"
  }
];
