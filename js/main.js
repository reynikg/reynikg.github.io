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

  // Only run the hero rotation on pages that actually have a hero.
  if (layerA && layerB) {
    runHeroRotation();
  }

  function runHeroRotation() {
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
  } /* end runHeroRotation */

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

  /* ---------- 3. PORTFOLIO GRID (portfolio.html) ---------- */

  var grid = document.getElementById("portfolioGrid");
  if (grid) {
    WORKS.forEach(function (p) {
      var a = document.createElement("a");
      a.className = "portfolio__item";
      a.href = p.url || "#";
      a.innerHTML =
        '<div class="portfolio__img" style="background-image:url(\'' +
          p.image + '\')" role="img" aria-label="' + escapeAttr(p.title) + '"></div>' +
        '<div class="portfolio__cap">' +
          '<div class="t">' + escapeHtml(p.title) + '</div>' +
          '<div class="d">' + escapeHtml(p.descriptor) + '</div>' +
        '</div>';
      grid.appendChild(a);
    });
  }

  /* ---------- 4. MULTILINGUAL GREETING (contact.html) ---------- */

  var hello = document.getElementById("helloGreeting");
  if (hello) {
    // Greetings — English, Greek and Chinese first (languages Robert uses),
    // then a world tour. Add or reorder freely.
    var greetings = [
      "Hello", "Γεια σου", "你好", "Ahoj", "Hola", "Bonjour",
      "Ciao", "Hallo", "Olá", "こんにちは", "Namaste", "Salaam"
    ];
    var hi = 0;
    var reduce = window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!reduce) {
      setInterval(function () {
        hello.classList.add("is-fading");          // fade out
        setTimeout(function () {
          hi = (hi + 1) % greetings.length;
          hello.textContent = greetings[hi];
          hello.setAttribute("aria-label", greetings[hi]);
          hello.classList.remove("is-fading");      // fade back in
        }, 400);                                     // matches CSS transition
      }, 2800);
    }
  }

  /* ---------- small helpers to keep text safe ---------- */
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function escapeAttr(s) { return escapeHtml(s); }
})();
