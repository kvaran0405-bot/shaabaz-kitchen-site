# Shaabaz Kitchen website

The new website for [shaabazkitchen.sg](https://shaabazkitchen.sg/).
Plain HTML, CSS and JavaScript. No server, no build step, so it can be hosted free
(Netlify, Vercel or GitHub Pages) and stays live 24/7.

## Pages

| File | Page |
| --- | --- |
| `index.html` | Home |
| `menus.html` | Menus (package cards with tabs: Wedding, Events & Corporate, Bentos, Biryani Trays) |
| `events.html` | Events & Catering |
| `gallery.html` | Gallery |
| `about.html` | About |
| `contact.html` | Order / Enquire (form opens WhatsApp with the details filled in) |

`css/style.css` holds all the styling (colours at the top). `js/main.js` holds the
effects: cursor ripple (also on tap), scroll fade-in, mobile menu, menu tabs and the
WhatsApp enquiry form. Effects turn off for visitors who ask their device for less motion.

## Still to fill in (search for `[` in the HTML)

- WhatsApp / phone number: replace `6500000000` everywhere (it is a placeholder)
- Email, kitchen address, opening hours
- Menu dishes, prices per pax, minimum orders
- Real photos: replace each `<div class="ph">Photo coming soon</div>` with an image
- Customer reviews and names
- Logo (currently a simple "S" mark)
- About page numbers (year started, events catered)
- Add phone and address to the structured data in `index.html` once known

## Google

Each page has its own title and description, `sitemap.xml` and `robots.txt` are ready,
and the home page has structured data that tells Google this is a caterer in Singapore.
After launch: submit the sitemap in Google Search Console and set up a Google Business Profile.

## Preview locally

Open `index.html` in a browser, or run `python3 -m http.server` in this folder and go to
http://localhost:8000.
