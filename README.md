# Single-page site with JS-loaded partials

This keeps the site as a single page with the same anchor-based navigation:

- `#research`
- `#papers`
- `#links`

The content is split into partial HTML files under `partials/`, and `main.js` loads them into `index.html`.

## Local preview

Serve the folder over HTTP rather than opening `index.html` directly:

```bash
cd academic-site-single-page-js-includes
python3 -m http.server 8000 --bind 127.0.0.1
```

Then open <http://127.0.0.1:8000>.

## Notes

- `cv.pdf` is still referenced in the nav, matching the original site; add your real `cv.pdf` at the project root.
- `images/prof_pic.jpeg` and `images/complex.svg` are placeholder assets because the originals were not uploaded.
