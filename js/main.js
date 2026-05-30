/* ============================================================
   main.js — brings the page to life from the WORKS manifest
   (defined in data/works.js, loaded just before this file)

   Two jobs:
     1. Rotate the hero background through the project images,
        updating the caption to name the current project.
     2. Build the "Selected work" carousel cards.
============================================================ */

(function () {
  "use strict";

  // Footer year
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Guard: if the manifest is missing or empty, do nothing gracefully.
  if (typeof WORKS === "undefined" || !WORKS.length) {
    console.warn("WORKS manifest is empty — add projects in data/works.js");
    return;
  }

  /* ---------- 1. HERO ROTATION ---------- */

  var layerA = document.getElementById("heroLayerA");
  var layerB = document.getElementById("heroLayerB");
  var captionTitle = document.querySelector(".hero__caption-title");
  var captionSub = document.querySelector(".hero__caption-sub");

  // Shuffle a copy so the order is random on each visit.
  function shuffled(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  var order = shuffled(WORKS);
  var idx = 0;
  var showingA = true;

  function applyCaption(project) {
    if (captionTitle) captionTitle.textContent = project.title;
    if (captionSub) captionSub.textContent = project.descriptor;
  }

  function showProject(project) {
    var incoming = showingA ? layerB : layerA;
    var outgoing = showingA ? layerA : layerB;
    incoming.style.backgroundImage = 'url("' + project.image + '")';
    incoming.classList.add("is-visible");
    outgoing.classList.remove("is-visible");
    showingA = !showingA;
    applyCaption(project);
  }

  // Show the first one immediately.
  showProject(order[0]);

  // Only auto-rotate if the user hasn't asked for reduced motion
  // and there's more than one image to rotate through.
  var reduceMotion = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!reduceMotion && order.length > 1) {
    setInterval(function () {
      idx = (idx + 1) % order.length;
      showProject(order[idx]);
    }, 6000); // change every 6 seconds
  }

  /* ---------- 2. CAROUSEL ---------- */

  var carousel = document.getElementById("carousel");
  if (carousel) {
    WORKS.forEach(function (p) {
      var a = document.createElement("a");
      a.className = "work-card";
      a.href = p.url || "#";
      a.setAttribute("role", "listitem");
      a.innerHTML =
        '<div class="work-card__img" style="background-image:url(\'' +
          p.image + '\')" role="img" aria-label="' + escapeAttr(p.title) + '"></div>' +
        '<div class="work-card__title">' + escapeHtml(p.title) + '</div>' +
        '<div class="work-card__desc">' + escapeHtml(p.descriptor) + '</div>';
      carousel.appendChild(a);
    });
  }

  /* ---------- small helpers to keep text safe ---------- */
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function escapeAttr(s) { return escapeHtml(s); }
})();
