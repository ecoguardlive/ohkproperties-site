/* ==========================================================================
   Site behaviour. Reads SITE and LISTINGS from data.js and uses render.js.
   ========================================================================== */

(function () {
  "use strict";

  var R = Render(SITE, LISTINGS);

  function qs(sel, root) { return (root || document).querySelector(sel); }
  function qsa(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  /* ---------- Fill in site-wide details ---------- */

  function applySite() {
    qsa("[data-site]").forEach(function (el) {
      var key = el.getAttribute("data-site");
      if (SITE[key] !== undefined) el.textContent = SITE[key];
    });
    qsa("[data-wa]").forEach(function (el) {
      var msg = el.getAttribute("data-wa") || "Hello, I would like to ask about available properties.";
      el.href = R.waLink(msg);
      el.target = "_blank";
      el.rel = "noopener";
    });
    qsa("[data-tel]").forEach(function (el) { el.href = R.telLink(); });
    qsa("[data-mail]").forEach(function (el) { el.href = "mailto:" + SITE.email; });
    qsa("[data-icon]").forEach(function (el) {
      el.innerHTML = R.icon(el.getAttribute("data-icon"), Number(el.getAttribute("data-size")) || 18);
    });
    qsa("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });
  }

  /* ---------- Mobile navigation ---------- */

  function initNav() {
    var btn = qs(".nav-toggle");
    var nav = qs(".site-nav");
    if (!btn || !nav) return;
    btn.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
    qsa("a", nav).forEach(function (a) {
      a.addEventListener("click", function () {
        nav.classList.remove("open");
        btn.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- Listings, filters and hero search ---------- */

  function initListings() {
    var grid = qs("#listing-grid");
    if (!grid) return;

    var state = { type: "all", area: "all" };
    var tabs = qsa("#listings [data-filter]");
    var areaSelect = qs("#area-select");
    var heroType = qs("#hero-type");
    var heroArea = qs("#hero-area");
    var count = qs("#result-count");
    var empty = qs("#empty-state");

    var areas = [];
    LISTINGS.forEach(function (l) { if (areas.indexOf(l.area) === -1) areas.push(l.area); });
    areas.sort();
    var areaOptions = '<option value="all">All areas</option>' + areas.map(function (a) { return '<option value="' + R.esc(a) + '">' + R.esc(a) + "</option>"; }).join("");
    if (areaSelect) areaSelect.innerHTML = areaOptions;
    if (heroArea) heroArea.innerHTML = areaOptions;

    // Show counts on the filter tabs
    tabs.forEach(function (t) {
      var f = t.getAttribute("data-filter");
      var n = LISTINGS.filter(function (l) { return f === "all" || l.type === f; }).length;
      var label = t.getAttribute("data-label") || t.textContent.replace(/\s*\(\d+\)$/, "");
      t.setAttribute("data-label", label);
      t.textContent = label + " (" + n + ")";
    });

    function render() {
      var list = LISTINGS.filter(function (l) {
        return (state.type === "all" || l.type === state.type) && (state.area === "all" || l.area === state.area);
      });
      grid.innerHTML = list.map(R.cardHTML).join("");
      if (count) count.textContent = list.length + (list.length === 1 ? " property shown" : " properties shown");
      if (empty) empty.hidden = list.length !== 0;
      tabs.forEach(function (t) {
        var on = t.getAttribute("data-filter") === state.type;
        t.classList.toggle("is-active", on);
        t.setAttribute("aria-pressed", on ? "true" : "false");
      });
      if (areaSelect) areaSelect.value = state.area;
      if (heroType) heroType.value = state.type;
      if (heroArea) heroArea.value = state.area;
    }

    tabs.forEach(function (t) {
      t.addEventListener("click", function () { state.type = t.getAttribute("data-filter"); render(); });
    });
    if (areaSelect) areaSelect.addEventListener("change", function () { state.area = areaSelect.value; render(); });

    var heroForm = qs("#hero-search");
    if (heroForm) {
      heroForm.addEventListener("submit", function (e) {
        e.preventDefault();
        state.type = heroType.value;
        state.area = heroArea.value;
        render();
        qs("#listings").scrollIntoView({ behavior: "smooth" });
      });
    }

    // Allow links like index.html?type=rent#listings
    var t = new URLSearchParams(window.location.search).get("type");
    if (t && ["sale", "rent", "land"].indexOf(t) !== -1) state.type = t;

    render();
  }

  /* ---------- Property detail page ---------- */

  function initDetail() {
    var root = qs("#detail");
    if (!root) return;

    var id = window.LISTING_ID || new URLSearchParams(window.location.search).get("id");
    var item = LISTINGS.filter(function (l) { return l.id === id; })[0];

    if (!item) {
      root.innerHTML =
        '<div class="empty"><h1>Property not found</h1>' +
        '<p>This property may have been removed or the link is incorrect.</p>' +
        '<a class="btn btn-primary" href="index.html#listings">Back to all properties</a></div>';
      return;
    }

    // Static listing pages are already built; the old property.html?id= page builds itself
    if (root.getAttribute("data-prerendered") !== item.id) {
      document.title = item.title + ", " + item.area + " | " + SITE.brand;
      root.innerHTML = R.detailHTML(item);
    }

    var main = qs("#gallery-main");
    qsa(".thumb", root).forEach(function (t) {
      t.addEventListener("click", function () {
        main.src = t.getAttribute("data-src");
        qsa(".thumb", root).forEach(function (o) { o.classList.remove("is-active"); });
        t.classList.add("is-active");
      });
    });
  }

  /* ---------- Enquiry form (opens WhatsApp or email) ---------- */

  function initForm() {
    var form = qs("#enquiry-form");
    if (!form) return;
    var wa = qs("#form-wa");
    var mail = qs("#form-mail");

    function body() {
      var name = form.elements.name.value.trim() || "[my name]";
      var phone = form.elements.phone.value.trim();
      var interest = form.elements.interest.value;
      var message = form.elements.message.value.trim();
      return "Hello, my name is " + name + ". I am interested in: " + interest + "." + (message ? " " + message : "") + (phone ? " You can reach me on " + phone + "." : "");
    }
    function update() {
      wa.href = R.waLink(body());
      wa.target = "_blank";
      wa.rel = "noopener";
      mail.href = R.mailLink("Property enquiry", body());
    }
    form.addEventListener("input", update);
    form.addEventListener("change", update);
    form.addEventListener("submit", function (e) { e.preventDefault(); });
    update();
  }

  /* ---------- Start ---------- */

  document.addEventListener("DOMContentLoaded", function () {
    initListings();
    initDetail();
    applySite();
    initNav();
    initForm();
  });
})();
