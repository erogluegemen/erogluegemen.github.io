# Egemen Eroğlu — DHL‑themed Personal Site (static)

A playful, **fully static** personal site using DHL colors and a van **GIF** animation.

## How to use your DHL GIF
1. Extract your chosen GIF from `Vehicles & Delivery.zip` (e.g. `dhl-van.gif`).
2. Copy it to `assets/images/dhl-van.gif` (overwrite the placeholder path if needed).
3. Open `index.html` — the GIF is referenced at `assets/images/dhl-van.gif` by default.

> You can also rename your file and update the `src` attribute in `index.html` accordingly.

## Fonts
DHL corporate fonts (Delivery / DHL Type) are proprietary.
If you have licensed files, place them under `assets/fonts/` and uncomment the `@font-face` blocks inside `assets/css/style.css` to self‑host.

## Develop / Preview locally
Just open `index.html` in a browser.
For a local server (optional):
```bash
python3 -m http.server 8080
# then browse http://localhost:8080
```

## Deploy to GitHub Pages
- Create a repository (e.g. `egemeneroglu.github.io`) and commit these files to the root.
- In **Settings → Pages**, set Source to the `main` branch (root) and save.
- Pages will build and publish automatically.

## Accessibility & motion
- Dark mode toggle with preference saved to `localStorage`.
- If a user enables *reduced motion*, the van animation is disabled by CSS.

## Legal
This is a personal website. DHL, the DHL logo and related design elements are trademarks of DHL. This site uses brand‑inspired colors purely for personal, non‑commercial presentation.
© 2025 Egemen Eroğlu
