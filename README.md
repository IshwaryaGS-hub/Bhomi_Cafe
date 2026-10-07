# பூமி — Bhoomi

A standalone Vite + React café branding website.

## Run

```powershell
cd D:\IG_Tea\bhoomi
npm install
npm run dev
```

Open the local URL printed by Vite. To use port 5174: `npm run dev -- --port 5174`.

Production build: `npm run build`. Preview the build: `npm run preview`.

## Experience

- Tamil shop-sign wordmark, turmeric yellow, bottle green, and chilli red; bold lettering, framed film, handwritten notes, and printed-style menu cards.
- Real MP4 footage of plantation terraces, tea processing, roasted beans, pouring coffee, and a hand lifting tea.
- Interactive Three.js pour at `#ritual`: modelled brass tumblers and dabara, terracotta chai mode, flowing liquid, steam, foam, and orbiting beans or leaves. Drag horizontally or use the rotation buttons. The scene loads near the viewport, stops rendering offscreen, respects the global pause setting, and shows a photo if WebGL is unavailable.
- Six chapter journey, scroll transitions, and a film viewer with play/pause and chapter controls.
- Sixteen illustrative drinks with tea/coffee filters, photography, readable rupee prices, and tasting-note dialogs.
- Mobile navigation, keyboard focus management, reduced-motion support, and a global motion pause control.

The harvesting chapter uses a real photograph. Stock footage depicts the general tea/coffee process, not verified Bhoomi suppliers. Names, prices, and menu descriptions are concept content; there is no online ordering or backend.

All required media is stored locally. Fonts are loaded from Google Fonts with system fallbacks. No AI API, hosting connector, or special hosting folder is needed to run the site.

## Media credits

Video licensed/downloaded via Magnific's Freepik catalogue: Pouring Coffee (4081), Aerial View of a Tea Plantation (3544182), Tea Leaves Drying in a Processing Facility (3544431), Roasted Coffee Beans with Smoke (2490713), Person Picking Up a Steaming Cup of Tea (2368132).

Harvesting photo: https://www.kiambethufarm.com/new-gallery . Other photography: Unsplash. Image filenames are local; the original photo identifiers include 1442512595331-e89e73853f31, 1470087167738-6aa485ff65dc, 1447933601403-0c6688de566e, 1514432324607-a09d9b4aefdd, 1544787219-7f47ccb76574, 1515823064-d6e0c04616a7, 1541167760496-1628856ab772, 1461023058943-07fcbe16d735, 1652283821037-ab3b61c9e13a, and 1601390395693-364c0e22031a.

## Checks

`node check-browser.mjs` runs browser checks against a dev server on port 5174 using locally installed Chrome. Checks cover Tamil/rupee encoding, video playback, chapter controls, menu switching, dialog focus, image loading, and mobile overflow.


Menu photography update: Masala chai (Freepik 385491515), green tea (Freepik 4567195), and espresso (Freepik 9375690), downloaded through Magnific. Filter kaapi: [Foaming filter coffee](https://commons.wikimedia.org/wiki/File:Foaming_filter_coffee.jpg), Charles Haynes, [CC BY-SA 2.0](https://creativecommons.org/licenses/by-sa/2.0/). The filter-coffee image was resized and converted to WebP; responsive display crops it. Its image license remains CC BY-SA 2.0. Original downloads are in the ignored media-originals folder.
