/* ==========================================================================
   Shared page-building code. Used by the browser (main.js) and by build.js
   (which pre-builds static pages so search engines can read every listing).
   You should not need to edit this file for normal updates.
   ========================================================================== */

(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory;
  else root.Render = factory;
})(this, function (SITE, LISTINGS) {
  "use strict";

  var ICONS = {
    phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
    chat: '<path d="M21 11.5a8.4 8.4 0 0 1-12.4 7.4L3 20.5l1.7-5.4A8.5 8.5 0 1 1 21 11.5z"/>',
    pin: '<path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    check: '<path d="m5 12 5 5 9-10"/>'
  };

  var TYPE_LABEL = { sale: "For sale", rent: "For rent", land: "Land" };

  // Landing pages that group listings by type (created by build.js)
  var CATEGORY = {
    land: { file: "land-for-sale-in-accra.html", name: "Land for sale in Accra" },
    sale: { file: "houses-for-sale-in-accra.html", name: "Houses and apartments for sale in Accra" },
    rent: { file: "houses-for-rent-in-accra.html", name: "Houses and apartments for rent in Accra" }
  };

  function esc(s) {
    return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  function icon(name, size) {
    size = size || 18;
    return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (ICONS[name] || "") + "</svg>";
  }

  // wa.me links need digits only, so spaces and the + sign are removed
  function waLink(text) {
    return "https://wa.me/" + String(SITE.whatsapp).replace(/\D/g, "") + "?text=" + encodeURIComponent(text);
  }
  function telLink() { return "tel:" + String(SITE.phone).replace(/[^\d+]/g, ""); }
  function mailLink(subject, body) {
    return "mailto:" + SITE.email + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body || "");
  }

  function hasPrice(item) { return !(item.price === null || item.price === undefined || item.price === ""); }

  function formatPrice(item) {
    if (!hasPrice(item)) return "Price on request";
    var n = Number(item.price).toLocaleString("en-GH");
    return SITE.currency + " " + n + (item.period ? " " + item.period : "");
  }

  function enquiryText(item) {
    return "Hello, I would like to enquire about the " + item.title + " in " + item.area + " (" + TYPE_LABEL[item.type].toLowerCase() + "). Is it still available?";
  }

  function listingUrl(item) { return "listings/" + encodeURIComponent(item.id) + ".html"; }

  function cardHTML(item) {
    var msg = enquiryText(item);
    var specs = [];
    if (item.type === "land") {
      specs.push(item.size);
    } else {
      if (item.beds != null) specs.push(item.beds === 0 ? "Studio" : item.beds + (item.beds === 1 ? " bedroom" : " bedrooms"));
      if (item.baths != null) specs.push(item.baths + (item.baths === 1 ? " bathroom" : " bathrooms"));
      specs.push(item.size);
    }
    var specHTML = specs.map(function (s) { return "<span>" + esc(s) + "</span>"; }).join("");
    var statusClass = item.status === "Available" ? "" : " is-off";
    var href = listingUrl(item);
    var alt = esc(item.title + ", " + item.area + ", " + (item.city || "Accra"));
    return (
      '<article class="card">' +
        '<a class="card-media" href="' + href + '" aria-label="View ' + esc(item.title) + '">' +
          '<img src="' + esc(item.images[0]) + '" alt="' + alt + '" loading="lazy" decoding="async">' +
          '<span class="badge badge-' + item.type + '">' + TYPE_LABEL[item.type] + "</span>" +
          '<span class="status' + statusClass + '"><i></i>' + esc(item.status) + "</span>" +
        "</a>" +
        '<div class="card-body">' +
          '<h3><a href="' + href + '">' + esc(item.title) + "</a></h3>" +
          '<p class="loc">' + icon("pin", 16) + esc(item.area) + ", " + esc(item.city || "Accra") + "</p>" +
          '<div class="specs">' + specHTML + "</div>" +
          '<p class="price">' + formatPrice(item) + "</p>" +
          '<div class="btn-row">' +
            '<a class="btn btn-wa btn-sm" target="_blank" rel="noopener" href="' + waLink(msg) + '">' + icon("chat", 16) + "WhatsApp</a>" +
            '<a class="btn btn-outline btn-sm" href="' + telLink() + '" aria-label="Call about ' + esc(item.title) + '">' + icon("phone", 16) + "Call</a>" +
            '<a class="btn btn-outline btn-sm" href="' + mailLink("Enquiry: " + item.title + ", " + item.area, msg + "\n\nMy name: \nMy phone: ") + '" aria-label="Email about ' + esc(item.title) + '">' + icon("mail", 16) + "Email</a>" +
          "</div>" +
        "</div>" +
      "</article>"
    );
  }

  function detailHTML(item) {
    var msg = enquiryText(item);
    var cat = CATEGORY[item.type];

    var facts = [];
    if (item.type !== "land") {
      if (item.beds != null) facts.push(["Bedrooms", item.beds === 0 ? "Studio" : item.beds]);
      if (item.baths != null) facts.push(["Bathrooms", item.baths]);
    }
    facts.push([item.type === "land" ? "Plot size" : "Size", item.size]);
    facts.push(["Area", item.area]);
    facts.push(["Status", item.status]);
    (item.extra || []).forEach(function (e) { facts.push(e); });

    var thumbs = item.images.length > 1 ? item.images.map(function (src, i) {
      return '<button type="button" class="thumb' + (i === 0 ? " is-active" : "") + '" data-src="' + esc(src) + '" aria-label="Show photo ' + (i + 1) + '"><img src="' + esc(src) + '" alt="' + esc(item.title + ", photo " + (i + 1)) + '" loading="lazy" decoding="async"></button>';
    }).join("") : "";

    var related = LISTINGS.filter(function (l) { return l.type === item.type && l.id !== item.id; }).slice(0, 3);
    var features = (item.features || []).length
      ? "<h2>Features</h2>" + '<ul class="features">' + item.features.map(function (f) { return "<li>" + icon("check", 18) + esc(f) + "</li>"; }).join("") + "</ul>"
      : "";

    return (
      '<nav class="crumbs" aria-label="Breadcrumb"><a href="index.html">Home</a><span>/</span><a href="' + cat.file + '">' + esc(cat.name) + "</a><span>/</span>" + esc(item.title) + "</nav>" +
      '<div class="detail-grid">' +
        '<div class="detail-main">' +
          '<div class="gallery">' +
            '<div class="gallery-main"><img id="gallery-main" src="' + esc(item.images[0]) + '" alt="' + esc(item.title + ", " + item.area + ", " + (item.city || "Accra")) + '" fetchpriority="high">' +
            '<span class="badge badge-' + item.type + '">' + TYPE_LABEL[item.type] + "</span></div>" +
            (thumbs ? '<div class="thumbs">' + thumbs + "</div>" : "") +
          "</div>" +
          '<h1 class="detail-title">' + esc(item.title) + "</h1>" +
          '<p class="loc loc-lg">' + icon("pin", 18) + esc(item.area) + ", " + esc(item.city || "Accra") + "</p>" +
          '<div class="facts">' + facts.map(function (f) { return "<div><span>" + esc(f[0]) + "</span><strong>" + esc(f[1]) + "</strong></div>"; }).join("") + "</div>" +
          "<h2>About this property</h2><p>" + esc(item.description) + "</p>" +
          features +
        "</div>" +
        '<aside class="detail-side">' +
          '<div class="side-card">' +
            '<p class="price price-lg">' + formatPrice(item) + "</p>" +
            '<p class="muted">Contact us to confirm availability and arrange a ' + (item.type === "land" ? "site visit" : "viewing") + ".</p>" +
            '<a class="btn btn-wa btn-block" target="_blank" rel="noopener" href="' + waLink(msg) + '">' + icon("chat") + "Enquire on WhatsApp</a>" +
            '<a class="btn btn-primary btn-block" href="' + telLink() + '">' + icon("phone") + "Call " + esc(SITE.phoneDisplay) + "</a>" +
            '<a class="btn btn-outline btn-block" href="' + mailLink("Enquiry: " + item.title + ", " + item.area, msg + "\n\nMy name: \nMy phone: ") + '">' + icon("mail") + "Email us</a>" +
          "</div>" +
        "</aside>" +
      "</div>" +
      (related.length ? '<h2 class="related-title">Similar properties</h2><div class="cards">' + related.map(cardHTML).join("") + "</div>" : "")
    );
  }

  return {
    ICONS: ICONS, TYPE_LABEL: TYPE_LABEL, CATEGORY: CATEGORY,
    esc: esc, icon: icon, waLink: waLink, telLink: telLink, mailLink: mailLink,
    hasPrice: hasPrice, formatPrice: formatPrice, enquiryText: enquiryText,
    listingUrl: listingUrl, cardHTML: cardHTML, detailHTML: detailHTML
  };
});
