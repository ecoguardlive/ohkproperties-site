# Property Sales and Rentals Website

A static website for a client selling and renting properties and land. Visitors browse listings and contact the client by WhatsApp, phone or email. There is no backend or build step: open `index.html` in a browser, or upload the folder to any web host.

## Files

```
index.html        Home page: hero, listings with filters, services, enquiry form
property.html     Property detail page (opens as property.html?id=<listing id>)
css/styles.css    All styling. Colours and fonts are variables at the top
js/data.js        Contact details and all property listings (edit this most)
js/render.js      Shared code that draws listing cards and detail pages
js/main.js        Site behaviour (filters, hero search, enquiry links)
build.js          Creates the search-engine pages (run with: node build.js)
listings/         One page per property (created by build.js, do not edit by hand)
*-in-accra.html   Land / sale / rent category pages (created by build.js)
sitemap.xml, robots.txt, 404.html, site.webmanifest, favicons, og-image.jpg
```

## Every time you change js/data.js

Run this once in the site folder (needs Node.js, nothing else to install):

```
node build.js
```

It rebuilds every listing page, the three category pages, the sitemap and the
search tags, then upload the whole folder again. If you skip this step, new
listings will not have their own page and will not be in the sitemap.

## Things to change first

1. **Contact details**: open `js/data.js` and edit the `SITE` block (brand name, WhatsApp number, phone, email, address, opening hours). Every button and link on both pages updates from there.
   - The WhatsApp number uses international format with digits only, for example `233201234567`.
2. **Listings**: edit the `LISTINGS` array in `js/data.js`. Copy an existing entry, change the fields and give it a unique `id`.
   - `type` is `sale`, `rent` or `land`.
   - `price` is a number, or `null` to show "Price on request". Use `period` for "per month" or "per year".
   - `status` can be `Available`, `Under offer`, `Let` or `Sold`.
   - `city` (optional) is shown after the area and defaults to "Accra".
   - `extra` (optional) is a list of `[label, value]` pairs shown in the facts grid on the detail page, for example `["Furnishing", "Unfurnished"]`.
3. **Photos**: the sample photos are linked from Unsplash. Replace them with the client's own photos by saving them in an `images/` folder and using paths like `images/villa-1.jpg` in each listing's `images` list. The first image is the main photo.
4. **Brand colours and fonts**: edit the `:root` block at the top of `css/styles.css`.
5. **Page text and SEO**: edit the `<title>` and `<meta name="description">` in each HTML file, and the headings and paragraphs in `index.html`.
6. **Logo**: the logo is a small inline SVG in the header of both HTML files. Replace it with an `<img>` tag pointing at the client's logo.

## Notes

- Enquiry buttons on each listing open WhatsApp or the email app with a message already written, naming the property.
- The enquiry form does not send data to a server. It builds a WhatsApp or email message from what the visitor types.
- To send enquiries to a database or email inbox automatically, a form service or small backend would be needed.
- The detail page reads the listing from the address (`property.html?id=...`), so it works on any static host. Open the site through a host or a local server rather than some browsers' `file://` view if images or links misbehave.
- Fonts load from Google Fonts. Photos load from Unsplash until you replace them.


## Getting found on Google (Search Console checklist)

1. **Set your web address.** In `js/data.js`, change `url: "https://www.your-domain.com"` to your real address (no trailing slash), then run `node build.js`. The canonical tags, sitemap and structured data all use this address.
2. **Upload the whole folder** to your host and open `https://your-address/sitemap.xml` to check it loads.
3. **Add the site in Google Search Console** (search.google.com/search-console). A "Domain" property verified through your DNS is the most reliable. Alternatively choose "URL prefix" and paste the HTML tag into the marked place in the `<head>` of `index.html`.
4. **Submit the sitemap**: in Search Console open Sitemaps and enter `sitemap.xml`.
5. **Request indexing** for the home page and the three category pages using the URL Inspection tool.
6. **Create a Google Business Profile** for the Kwabenya School Junction address, with the same name, phone number and website. This is what puts a business on Google Maps and in local results such as "land for sale near me".
7. **Add real photos and details** to every listing. Pages with real descriptions, sizes and locations rank better than the placeholder text.
8. Use the same business name, phone number and address everywhere (Facebook, Instagram, Jiji and other listing sites) and link back to the website.

Rankings take weeks to build and cannot be guaranteed. The site is set up so Google can read, index and understand every page.

## What the SEO setup includes

- A unique title, description and canonical address for every page.
- One real, crawlable page for each property (`listings/<id>.html`) plus category pages for land for sale, houses for sale and houses for rent in Accra.
- Structured data (JSON-LD): the business (RealEstateAgent), the website, each listing, and breadcrumbs.
- Open Graph and Twitter tags so links look good when shared on WhatsApp, Facebook and X.
- `sitemap.xml` (with photos), `robots.txt`, a 404 page, favicons and a web manifest.
- Optional per-listing `seoTitle` and `seoDescription` fields in `js/data.js`.
- `property.html?id=...` still works but is marked `noindex` so it does not compete with the real pages.
