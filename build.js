#!/usr/bin/env node
/* ==========================================================================
   build.js  -  creates the search-engine pages for the website.

   Run it after you change js/data.js (listings, contact details, address):

       node build.js

   It needs only Node.js (no installs) and creates or refreshes:
     listings/<id>.html                 one real page per property
     land-for-sale-in-accra.html        category pages that rank for
     houses-for-sale-in-accra.html      "land for sale in Accra",
     houses-for-rent-in-accra.html      "houses for rent in Accra", etc.
     sitemap.xml, robots.txt, 404.html
     the title, description, social-sharing and structured-data tags
     in index.html (between the SEO:START and SEO:END markers)
   ========================================================================== */

"use strict";
const fs = require("fs");
const path = require("path");

const ROOT = __dirname;
const read = (f) => fs.readFileSync(path.join(ROOT, f), "utf8");
const write = (f, s) => {
  fs.mkdirSync(path.dirname(path.join(ROOT, f)), { recursive: true });
  fs.writeFileSync(path.join(ROOT, f), s);
};

/* ---------- Load site data ---------- */

const { SITE, LISTINGS } = new Function(read("js/data.js") + "; return { SITE, LISTINGS };")();
const R = require("./js/render.js")(SITE, LISTINGS);
const esc = R.esc;

const BASE_URL = String(SITE.url || "").replace(/\/+$/, "");
const PLACEHOLDER = !BASE_URL || /your-domain/i.test(BASE_URL);
const TODAY = new Date().toISOString().slice(0, 10);
const CITY = SITE.locality || "Accra";
const CURRENCY_CODE = /GH/i.test(SITE.currency || "") ? "GHS" : (SITE.currencyCode || "GHS");

const abs = (p) => (/^https?:\/\//.test(p) ? p : BASE_URL + "/" + String(p).replace(/^\/+/, ""));
const jsonLd = (obj) => '<script type="application/ld+json">' + JSON.stringify(obj).replace(/</g, "\\u003c") + "</script>";
const cut = (s, n) => {
  s = String(s).replace(/\s+/g, " ").trim();
  if (s.length <= n) return s;
  return s.slice(0, n - 1).replace(/\s+\S*$/, "") + "…";
};

/* ---------- Shared head tags ---------- */

function seoHead(o) {
  const img = abs(o.image || "og-image.jpg");
  return [
    "<title>" + esc(o.title) + "</title>",
    '<meta name="description" content="' + esc(o.description) + '">',
    '<link rel="canonical" href="' + esc(o.canonical) + '">',
    '<meta name="robots" content="' + (o.robots || "index, follow, max-image-preview:large") + '">',
    '<meta property="og:type" content="website">',
    '<meta property="og:site_name" content="' + esc(SITE.brand) + '">',
    '<meta property="og:locale" content="en_GH">',
    '<meta property="og:title" content="' + esc(o.title) + '">',
    '<meta property="og:description" content="' + esc(o.description) + '">',
    '<meta property="og:url" content="' + esc(o.canonical) + '">',
    '<meta property="og:image" content="' + esc(img) + '">',
    '<meta name="twitter:card" content="summary_large_image">',
    '<meta name="twitter:title" content="' + esc(o.title) + '">',
    '<meta name="twitter:description" content="' + esc(o.description) + '">',
    '<meta name="twitter:image" content="' + esc(img) + '">'
  ].concat((o.jsonld || []).map(jsonLd)).join("\n  ");
}

/* ---------- Structured data ---------- */

function businessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "@id": BASE_URL + "/#business",
    name: SITE.brand,
    description: "Land for sale, houses and apartments for sale, and homes to rent in Accra, Ghana.",
    url: BASE_URL + "/",
    logo: abs("icon-512.png"),
    image: abs("og-image.jpg"),
    telephone: SITE.phone,
    email: SITE.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.streetAddress || SITE.address,
      addressLocality: CITY,
      addressRegion: SITE.region || "Greater Accra",
      addressCountry: SITE.countryCode || "GH"
    },
    areaServed: [CITY, "Kwabenya", "Kwabenya Comet", "Kwabenya ACP"].concat(
      Array.from(new Set(LISTINGS.map((l) => l.area)))
    ).filter((v, i, a) => a.indexOf(v) === i).map((n) => ({ "@type": "Place", name: n + ", Ghana" }))
  };
}

function websiteSchema() {
  return { "@context": "https://schema.org", "@type": "WebSite", "@id": BASE_URL + "/#website", name: SITE.brand, url: BASE_URL + "/", inLanguage: "en-GH" };
}

function breadcrumbSchema(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it[0], item: it[1] }))
  };
}

function offerFor(item) {
  if (!R.hasPrice(item)) return undefined;
  const offer = {
    "@type": "Offer",
    price: Number(item.price),
    priceCurrency: CURRENCY_CODE,
    availability: item.status === "Available" ? "https://schema.org/InStock" : item.status === "Under offer" ? "https://schema.org/LimitedAvailability" : "https://schema.org/SoldOut",
    url: abs(R.listingUrl(item))
  };
  const unit = /month/i.test(item.period || "") ? "MON" : /year/i.test(item.period || "") ? "ANN" : null;
  if (unit) offer.priceSpecification = { "@type": "UnitPriceSpecification", price: Number(item.price), priceCurrency: CURRENCY_CODE, unitCode: unit };
  return offer;
}

function listingSchema(item) {
  const url = abs(R.listingUrl(item));
  const o = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    "@id": url + "#listing",
    url: url,
    name: item.title,
    description: item.description,
    image: item.images.map(abs),
    inLanguage: "en-GH",
    contentLocation: {
      "@type": "Place",
      name: item.area + ", " + (item.city || CITY),
      address: { "@type": "PostalAddress", addressLocality: item.area, addressRegion: SITE.region || "Greater Accra", addressCountry: SITE.countryCode || "GH" }
    },
    provider: { "@id": BASE_URL + "/#business" }
  };
  const offer = offerFor(item);
  if (offer) o.offers = offer;
  return o;
}

/* ---------- Copy for titles and descriptions ---------- */

const KIND = { land: "Land for Sale", sale: "For Sale", rent: "For Rent" };

function listingTitle(item) {
  if (item.seoTitle) return item.seoTitle;
  return item.title + " – " + KIND[item.type] + " | " + SITE.brand;
}

function listingDescription(item) {
  if (item.seoDescription) return item.seoDescription;
  const place = item.area + ", " + (item.city || CITY);
  const price = R.hasPrice(item) ? " " + R.formatPrice(item) + "." : "";
  let lead;
  if (item.type === "land") {
    lead = item.size + " of land for sale at " + place + ".";
  } else {
    const specs = [];
    if (item.beds != null) specs.push(item.beds === 0 ? "studio" : item.beds + "-bedroom");
    const kind = specs.length ? specs.join(" ") + " " : "";
    lead = (kind ? kind.charAt(0).toUpperCase() + kind.slice(1) : "") + "property " + (item.type === "rent" ? "to rent" : "for sale") + " at " + place + (item.size ? ", " + item.size : "") + ".";
    lead = lead.replace(/^property/, "Property");
  }
  const tail = " Message " + SITE.brand + " on WhatsApp or call " + SITE.phoneDisplay + " to " + (item.type === "land" ? "arrange a site visit." : "arrange a viewing.");
  return cut(lead + price + tail, 158);
}

/* ---------- Page chunks taken from index.html (header and footer) ---------- */

const indexSrc = read("index.html");
const headerChunk = indexSrc.slice(indexSrc.indexOf("  <!-- Top contact bar -->"), indexSrc.indexOf("</header>") + "</header>".length);
const footerChunk = indexSrc.slice(indexSrc.indexOf('  <footer class="site-footer">'), indexSrc.indexOf("</footer>") + "</footer>".length);
const floatChunk = (indexSrc.match(/<a class="wa-float"[\s\S]*?<\/a>/) || [""])[0];

function hydrate(html) {
  return html
    .replace(/href="#(?=[a-z])/g, 'href="index.html#')
    .replace(/<(span|small)([^>]*?)data-site="(\w+)"([^>]*)><\/\1>/g, (m, tag, a, key, b) => "<" + tag + a + 'data-site="' + key + '"' + b + ">" + esc(SITE[key] == null ? "" : SITE[key]) + "</" + tag + ">")
    .replace(/<span([^>]*?)data-icon="(\w+)"([^>]*?)><\/span>/g, (m, a, name, b) => {
      const size = (/data-size="(\d+)"/.exec(a + b) || [])[1];
      return "<span" + a + 'data-icon="' + name + '"' + b + ">" + R.icon(name, Number(size) || 18) + "</span>";
    })
    .replace(/href="#"([^>]*?)data-tel/g, 'href="' + R.telLink() + '"$1data-tel')
    .replace(/href="#"([^>]*?)data-mail/g, 'href="mailto:' + SITE.email + '"$1data-mail')
    .replace(/href="#"([^>]*?)data-wa/g, 'href="' + R.waLink("Hello, I would like to ask about available properties.") + '" target="_blank" rel="noopener"$1data-wa')
    .replace(/<span data-year><\/span>/g, "<span data-year>" + new Date().getFullYear() + "</span>");
}

function page(o) {
  const baseTag = o.base ? '<base href="' + esc(o.base) + '">\n  ' : "";
  return (
    "<!doctype html>\n" +
    '<html lang="en">\n<head>\n' +
    '  <meta charset="utf-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1">\n  ' +
    baseTag + seoHead(o) + "\n\n" +
    '  <meta name="theme-color" content="#123B2E">\n' +
    '  <link rel="icon" href="favicon.ico" sizes="48x48">\n  <link rel="icon" href="favicon.svg" type="image/svg+xml">\n  <link rel="apple-touch-icon" href="apple-touch-icon.png">\n  <link rel="manifest" href="site.webmanifest">\n' +
    '  <link rel="preconnect" href="https://fonts.googleapis.com">\n  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n' +
    '  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Fraunces:opsz,wght@9..144,500;9..144,600&display=swap" rel="stylesheet">\n' +
    '  <link rel="stylesheet" href="css/styles.css">\n</head>\n<body>\n\n' +
    hydrate(headerChunk) + "\n\n" +
    o.main + "\n\n" +
    hydrate(footerChunk) + "\n\n  " + hydrate(floatChunk) + "\n\n" +
    '  <script src="js/data.js"></script>\n  <script src="js/render.js"></script>\n' +
    (o.script ? "  " + o.script + "\n" : "") +
    '  <script src="js/main.js"></script>\n</body>\n</html>\n'
  );
}

/* ---------- Listing pages ---------- */

const listingFiles = [];
LISTINGS.forEach((item) => {
  const file = "listings/" + item.id + ".html";
  const canonical = abs(file);
  const cat = R.CATEGORY[item.type];
  const html = page({
    base: "../",
    title: listingTitle(item),
    description: listingDescription(item),
    canonical,
    image: item.images[0],
    jsonld: [
      listingSchema(item),
      breadcrumbSchema([["Home", BASE_URL + "/"], [cat.name, abs(cat.file)], [item.title, canonical]])
    ],
    main: '  <main class="detail-wrap">\n    <div class="container" id="detail" data-prerendered="' + esc(item.id) + '">' + R.detailHTML(item) + "</div>\n  </main>",
    script: "<script>window.LISTING_ID = " + JSON.stringify(item.id).replace(/</g, "\\u003c") + ";</script>"
  });
  write(file, html);
  listingFiles.push(file);
});

// remove pages of listings that no longer exist
if (fs.existsSync(path.join(ROOT, "listings"))) {
  fs.readdirSync(path.join(ROOT, "listings")).forEach((f) => {
    if (f.endsWith(".html") && listingFiles.indexOf("listings/" + f) === -1) fs.unlinkSync(path.join(ROOT, "listings", f));
  });
}

/* ---------- Category landing pages ---------- */

const CATEGORY_COPY = {
  land: {
    title: "Land for Sale in Accra | Plots at Kwabenya | " + SITE.brand,
    description: "Land for sale in Accra: half plots, full plots and multiple plots at Kwabenya, Kwabenya Comet and Kwabenya ACP. Enquire on WhatsApp to arrange a site visit.",
    h1: "Land for sale in Accra",
    intro: "Browse plots of land for sale in Accra, including half plots, full plots and multiple plots at Kwabenya, Kwabenya Comet and Kwabenya ACP. Message us on WhatsApp for the latest availability and to arrange a site visit.",
    body:
      "<h2>Plots of land at Kwabenya and around Accra</h2>" +
      "<p>Kwabenya is in the north of Accra, close to Haatso, Dome and Atomic Junction, and is popular with buyers building a family home or holding land as an investment. We list land at Kwabenya, Kwabenya Comet and Kwabenya ACP, and add new plots as they become available.</p>" +
      "<h2>What to check before you buy land in Accra</h2>" +
      "<ul>" +
      "<li>Ask to see the title documents and the site plan, and confirm the exact size and boundaries on the ground.</li>" +
      "<li>Have the land searched at the Lands Commission before you make any payment.</li>" +
      "<li>Confirm access: is there a motorable road, and are water and electricity close by?</li>" +
      "<li>Visit the plot in person, ideally with a lawyer or a licensed surveyor.</li>" +
      "</ul>" +
      "<p>A standard plot in and around Accra is commonly about 70 ft by 100 ft (roughly 0.16 acre), but sizes vary, so always confirm the dimensions of the specific plot.</p>"
  },
  sale: {
    title: "Houses and Apartments for Sale in Accra | " + SITE.brand,
    description: "Houses and apartments for sale in Accra for buyers and investors. See photos and details, then message us on WhatsApp to arrange a viewing.",
    h1: "Houses and apartments for sale in Accra",
    intro: "Browse houses and apartments for sale in Accra. Each listing shows the area, size and photos, and you can message us on WhatsApp to confirm availability and arrange a viewing.",
    body:
      "<h2>Buying a house or apartment in Accra</h2>" +
      "<p>Tell us the area you prefer, your budget and the number of bedrooms you need, and we will point you to suitable homes for sale. Before paying for any property, ask to see the ownership documents and have them checked by your lawyer.</p>"
  },
  rent: {
    title: "Houses and Apartments for Rent in Accra | " + SITE.brand,
    description: "Houses, apartments and studios to rent in Accra, furnished and unfurnished. See photos and prices, then message us on WhatsApp to arrange a viewing.",
    h1: "Houses and apartments for rent in Accra",
    intro: "Browse houses, apartments and studios to rent in Accra. See the area, size and price on each listing, then message us on WhatsApp to confirm availability and book a viewing.",
    body:
      "<h2>Renting a home in Accra</h2>" +
      "<p>Tell us the area you want, your budget and the number of bedrooms and we will suggest homes that fit, from studios and apartments to family houses. Ask what the rent covers, how long the advance is and what the tenancy terms are before you pay.</p>"
  }
};

const categoryFiles = [];
Object.keys(R.CATEGORY).forEach((type) => {
  const cat = R.CATEGORY[type];
  const copy = CATEGORY_COPY[type];
  const items = LISTINGS.filter((l) => l.type === type);
  const areas = Array.from(new Set(items.map((l) => l.area))).sort();
  const canonical = abs(cat.file);
  const others = Object.keys(R.CATEGORY).filter((t) => t !== type).map((t) => '<a href="' + R.CATEGORY[t].file + '">' + esc(R.CATEGORY[t].name) + "</a>").join(" or ");

  const cards = items.length
    ? '<div class="cards">' + items.map(R.cardHTML).join("") + "</div>"
    : '<div class="empty-box"><p>Nothing listed here right now. New properties are added regularly, so message us and we will tell you what is coming up.</p><a class="btn btn-wa" href="' + R.waLink("Hello, I would like to ask about available properties.") + '" target="_blank" rel="noopener">Message us on WhatsApp</a></div>';

  const main =
    "  <main>\n" +
    '    <section class="page-hero">\n      <div class="container">\n' +
    '        <nav class="crumbs" aria-label="Breadcrumb"><a href="index.html">Home</a><span>/</span>' + esc(cat.name) + "</nav>\n" +
    "        <h1>" + esc(copy.h1) + "</h1>\n        <p>" + esc(copy.intro) + "</p>\n" +
    '        <a class="btn btn-gold btn-lg" target="_blank" rel="noopener" href="' + R.waLink("Hello, I would like to ask about " + cat.name.toLowerCase() + ".") + '">Ask on WhatsApp</a>\n' +
    "      </div>\n    </section>\n" +
    '    <section class="section">\n      <div class="container">\n' +
    '        <div class="section-head"><span class="eyebrow">' + items.length + (items.length === 1 ? " listing" : " listings") + '</span><h2>Available now' + (areas.length ? " in " + esc(areas.join(", ")) : "") + "</h2></div>\n" +
    "        " + cards + "\n      </div>\n    </section>\n" +
    '    <section class="section section-alt">\n      <div class="container">\n        <div class="page-copy">' + copy.body +
    "<p>You can also see " + others + ", or <a href=\"index.html#contact\">contact us</a> with what you are looking for.</p></div>\n      </div>\n    </section>\n" +
    "  </main>";

  const html = page({
    title: copy.title,
    description: copy.description,
    canonical,
    image: items[0] ? items[0].images[0] : "og-image.jpg",
    jsonld: [
      {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: copy.h1,
        url: canonical,
        description: copy.description,
        isPartOf: { "@id": BASE_URL + "/#website" },
        mainEntity: { "@type": "ItemList", itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, url: abs(R.listingUrl(it)), name: it.title })) }
      },
      breadcrumbSchema([["Home", BASE_URL + "/"], [cat.name, canonical]])
    ],
    main
  });
  write(cat.file, html);
  categoryFiles.push(cat.file);
});

/* ---------- Home page: head tags and pre-built listing cards ---------- */

(function () {
  let html = read("index.html");
  const title = "Land and Houses for Sale and Rent in Accra | " + SITE.brand;
  const description = "Land for sale in Kwabenya and Accra, houses and apartments for sale, homes to rent. Message " + SITE.brand + " on WhatsApp to arrange a viewing.";
  const head = seoHead({
    title, description, canonical: BASE_URL + "/", image: "og-image.jpg",
    jsonld: [businessSchema(), websiteSchema()]
  });
  html = html.replace(/<!--SEO:START-->[\s\S]*?<!--SEO:END-->/, "<!--SEO:START-->\n  " + head + "\n  <!--SEO:END-->");
  html = html.replace(/<!--GRID:START-->[\s\S]*?<!--GRID:END-->/, "<!--GRID:START-->" + LISTINGS.map(R.cardHTML).join("") + "<!--GRID:END-->");
  write("index.html", html);
})();

/* ---------- sitemap.xml, robots.txt, 404.html ---------- */

(function () {
  const urls = [{ loc: BASE_URL + "/", priority: "1.0", images: [] }]
    .concat(categoryFiles.map((f) => ({ loc: abs(f), priority: "0.9", images: [] })))
    .concat(LISTINGS.map((l) => ({ loc: abs(R.listingUrl(l)), priority: "0.8", images: l.images.map(abs) })));
  const xml =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n' +
    urls.map((u) =>
      "  <url>\n    <loc>" + esc(u.loc) + "</loc>\n    <lastmod>" + TODAY + "</lastmod>\n    <priority>" + u.priority + "</priority>\n" +
      u.images.map((i) => "    <image:image><image:loc>" + esc(i) + "</image:loc></image:image>\n").join("") + "  </url>"
    ).join("\n") + "\n</urlset>\n";
  write("sitemap.xml", xml);
  write("robots.txt", "User-agent: *\nAllow: /\n\nSitemap: " + BASE_URL + "/sitemap.xml\n");

  const notFound = page({
    base: BASE_URL + "/",
    title: "Page not found | " + SITE.brand,
    description: "This page could not be found.",
    canonical: BASE_URL + "/",
    robots: "noindex, follow",
    main:
      '  <main class="detail-wrap">\n    <div class="container">\n      <div class="empty"><h1>Page not found</h1><p>This page may have moved or the link is incorrect.</p>' +
      '<a class="btn btn-primary" href="index.html#listings">See available properties</a></div>\n    </div>\n  </main>'
  });
  write("404.html", notFound);
})();

/* ---------- Report ---------- */

console.log("Built " + listingFiles.length + " listing pages, " + categoryFiles.length + " category pages, sitemap.xml, robots.txt, 404.html");
if (PLACEHOLDER) {
  console.log("\nWARNING: SITE.url in js/data.js is still the placeholder (" + (SITE.url || "empty") + ").");
  console.log("Set it to your real website address and run  node build.js  again before uploading.");
}
