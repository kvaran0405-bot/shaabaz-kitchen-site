# Shaabaz Kitchen website

The new website for [shaabazkitchen.sg](https://shaabazkitchen.sg/).
Plain HTML, CSS and JavaScript. No server, no build step, so it can be hosted free
(Netlify, Vercel or GitHub Pages) and stays live 24/7.

## Pages

| File | Page |
| --- | --- |
| `index.html` | Home |
| `menus.html` | Menus: four category photo tiles (Buffet, Bento, Festive, Live Station), then package cards per category |
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
- Real photos: drop them into `images/photos/` with the names listed in `images/photos/README.md`. They appear automatically.
- Background video: save as `images/hero.mp4` and uncomment the `<video>` line at the top of `index.html`
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
