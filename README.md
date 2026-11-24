# rbsilks
Website for R B SILKS, a saree and textile shop in Podili, Andhra Pradesh. It shows the shop's collections, location and hours, with one-tap WhatsApp, call and directions.

## Store details

| Detail | Information |
| :--- | :--- |
| Store | R B SILKS |
| Address | College Road, Viswanathapuram, Podili, Andhra Pradesh 523240 |
| Phone / WhatsApp | +91 77990 58291 |
| Hours | Open 24 hours (Monday to Saturday), 8:00 AM to 10:00 PM (Sunday) |

## What the site shows
- **What We Offer:** pattu and wedding sarees, fancy and daily wear sarees, dress materials, nightwear and innerwear, blankets, bed sheets (4x6, 5x6, 6x6, 7x6), towels, shirting (Ramraj, Deeksha) and door curtains. Text and photos only, no prices.
- **Contact:** call, Google Maps directions and WhatsApp buttons, plus a video-call shopping request.
- **Store info:** location, opening hours, testimonials and FAQs.

## Built-in features that are switched off
Both are controlled by switches at the top of [`js/data.js`](js/data.js). Set a switch to `true` to turn the feature on.

| Switch | Feature |
| :--- | :--- |
| `ENABLE_CATALOG` | Product catalogue with search, category filters, wishlist and per-item WhatsApp order |
| `ENABLE_BAG` | Multi-item inquiry bag sent as one WhatsApp order |

The catalogue can also load products from a published Google Sheet. Paste the sheet's CSV link into `SHEET_CSV_URL` in `js/data.js`.

## Project structure
```
index.html      Single page
css/style.css   Custom styles
js/data.js      Store details, FAQs, testimonials, product data and feature switches
js/app.js       Page logic
images/         Photos used in the What We Offer section
```

## Run locally
Open `index.html` in a browser, or run a local server:

```powershell
python -m http.server 3000
```
Then visit `http://localhost:3000`.

## Hosting on GitHub Pages
In the repository, go to **Settings > Pages**, choose **Deploy from a branch**, select `main` and the `/ (root)` folder, then save. The site is published at `https://buildwith-brahma.github.io/rbsilks/`.

## Built with
HTML, CSS and JavaScript, with Tailwind CSS and Font Awesome loaded from CDNs. There is no build step or backend.
