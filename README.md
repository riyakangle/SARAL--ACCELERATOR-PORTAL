# SARAL AYUSH Startup Portal

The portal is a single-page application with 12 in-app views.

## Run with Express.js

```bash
npm install
npm start
```

Then open http://localhost:3000.

The Express server serves `saralayush.html` and exposes:

- `GET /api/health`
- `GET /api/modules`

AngularJS is loaded in the portal through its browser CDN and powers the module map on the Home view.

GitHub Pages can host the static HTML file, but it cannot run the Express server. Use a Node-compatible host for the Express version.
