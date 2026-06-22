/* ============================================================
   tools.js — builds the (hidden) Tools & Games grid on tools.html
   from the manifest in data/tools.json.

   To add a project: edit data/tools.json. Each entry takes:
     name        display title
     url         link to the live project ("" = no link yet)
     image       path to a thumbnail (falls back to a placeholder
                 if the file is missing)
     description short blurb (10–15 words)
     type        "Game", "Tool", etc.
     version     e.g. "1.10-stable"
     year        e.g. 2026
============================================================ */

(function () {
  "use strict";

  // Footer year
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  var grid = document.getElementById("toolsGrid");
  if (!grid) return;

  fetch("data/tools.json")
    .then(function (res) {
      if (!res.ok) throw new Error("Could not load tools.json (" + res.status + ")");
      return res.json();
    })
    .then(function (tools) {
      if (!Array.isArray(tools) || !tools.length) {
        grid.innerHTML = '<p class="tools-empty">No projects to show yet.</p>';
        return;
      }
      tools.forEach(function (t) { grid.appendChild(buildCard(t)); });
    })
    .catch(function (err) {
      console.warn(err);
      grid.innerHTML = '<p class="tools-empty">Projects are unavailable right now.</p>';
    });

  function buildCard(t) {
    var hasUrl = t.url && t.url.trim() !== "";

    // A linked card is an <a>; an unlinked one (no URL yet) is a <div>.
    var card = document.createElement(hasUrl ? "a" : "div");
    card.className = "tool-card" + (hasUrl ? "" : " tool-card--soon");
    if (hasUrl) {
      card.href = t.url;
      card.target = "_blank";
      card.rel = "noopener";
      card.setAttribute("aria-label", t.name + " — open project");
    }

    // Image (with graceful fallback to a placeholder if it fails to load)
    var media = document.createElement("div");
    media.className = "tool-card__media";
    var placeholder = '<span class="tool-card__placeholder">' + escapeHtml(t.name) + "</span>";
    if (t.image && t.image.trim() !== "") {
      var img = document.createElement("img");
      img.className = "tool-card__img";
      img.src = t.image;
      img.alt = t.name;
      img.loading = "lazy";
      img.onerror = function () { media.innerHTML = placeholder; };
      media.appendChild(img);
    } else {
      media.innerHTML = placeholder;
    }

    // Body
    var body = document.createElement("div");
    body.className = "tool-card__body";

    var meta =
      '<div class="tool-card__meta">' +
        (t.type ? '<span class="tool-card__type">' + escapeHtml(t.type) + "</span>" : "") +
        (hasUrl ? "" : '<span class="tool-card__soon">Coming soon</span>') +
      "</div>";

    var sub = [];
    if (t.version) sub.push("v" + escapeHtml(t.version));
    if (t.year) sub.push(escapeHtml(t.year));

    body.innerHTML =
      meta +
      '<h2 class="tool-card__title">' + escapeHtml(t.name) + "</h2>" +
      '<p class="tool-card__desc">' + escapeHtml(t.description || "") + "</p>" +
      (sub.length ? '<p class="tool-card__sub">' + sub.join(" · ") + "</p>" : "");

    card.appendChild(media);
    card.appendChild(body);
    return card;
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
})();
