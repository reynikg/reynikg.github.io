/* ============================================================
   about.js — builds the About page accordion from data/about.js
   ============================================================

   Each section in ABOUT becomes a collapsible panel. They all start
   closed; the visitor opens whichever they like (more than one can be
   open at once). Skills render as a flat row of pills; every other
   section renders its items as entries.
============================================================ */

(function () {
  "use strict";

  if (typeof ABOUT === "undefined") return;

  var host = document.getElementById("aboutSections");
  var notesHost = document.getElementById("aboutNotes");

  /* ---------- text safety ---------- */
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  var CHEVRON =
    '<svg class="acc__icon" width="20" height="20" viewBox="0 0 24 24" fill="none" ' +
    'stroke="currentColor" stroke-width="1.6" stroke-linecap="round" ' +
    'stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>';

  /* ---------- one list entry ---------- */
  function renderEntry(it) {
    var head =
      '<div class="entry__head">' +
        '<div class="entry__headings">' +
          '<div class="entry__title">' + esc(it.title) + "</div>" +
          (it.subtitle ? '<div class="entry__subtitle">' + esc(it.subtitle) + "</div>" : "") +
        "</div>" +
        (it.meta ? '<div class="entry__meta">' + esc(it.meta) + "</div>" : "") +
      "</div>";

    var body = "";
    if (it.detail) {
      body += "<p>" + esc(it.detail) + "</p>";
    }
    if (Array.isArray(it.details) && it.details.length) {
      body +=
        "<ul>" +
        it.details.map(function (d) { return "<li>" + esc(d) + "</li>"; }).join("") +
        "</ul>";
    }
    if (Array.isArray(it.links) && it.links.length) {
      body +=
        '<div class="entry__links">' +
        it.links
          .map(function (l) {
            return '<a href="' + esc(l.url) + '" target="_blank" rel="noopener">' +
              esc(l.label || l.url) + "</a>";
          })
          .join("") +
        "</div>";
    }
    if (body) body = '<div class="entry__body">' + body + "</div>";

    return '<div class="entry">' + head + body + "</div>";
  }

  /* ---------- a section's inner content ---------- */
  function renderContent(section) {
    if (section.layout === "tags") {
      var tags = (section.tags || [])
        .map(function (t) { return '<span class="skill">' + esc(t) + "</span>"; })
        .join("");
      return '<div class="skills">' + tags + "</div>";
    }
    var items = (section.items || []).map(renderEntry).join("");
    return '<div class="acc__content">' + items + "</div>";
  }

  /* ---------- build every section ---------- */
  if (host) {
    ABOUT.sections.forEach(function (section, i) {
      var panelId = "acc-panel-" + i;
      var isOpen = !!section.open;

      var acc = document.createElement("section");
      acc.className = "acc" + (isOpen ? " is-open" : "");
      acc.innerHTML =
        '<button class="acc__head" type="button" aria-expanded="' + isOpen +
          '" aria-controls="' + panelId + '">' +
          '<span class="acc__title">' + esc(section.title) + "</span>" +
          CHEVRON +
        "</button>" +
        '<div class="acc__panel" id="' + panelId + '" role="region">' +
          '<div class="acc__inner">' + renderContent(section) + "</div>" +
        "</div>";

      var head = acc.querySelector(".acc__head");
      head.addEventListener("click", function () {
        var open = acc.classList.toggle("is-open");
        head.setAttribute("aria-expanded", open ? "true" : "false");
      });

      host.appendChild(acc);
    });
  }

  /* ---------- closing notes ---------- */
  if (notesHost && Array.isArray(ABOUT.notes)) {
    notesHost.innerHTML = ABOUT.notes
      .map(function (n) { return '<p class="about-note">' + esc(n) + "</p>"; })
      .join("");
  }
})();
