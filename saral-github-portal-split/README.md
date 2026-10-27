# SARAL AYUSH Startup Portal — GitHub multi-page version

This is the GitHub portal from the original `saralayush.html`, separated into 12 linked HTML pages. The original visual design and Supabase based portal features are retained. Shared styles and behavior are in `styles.css` and `app.js`.

## Pages

1. `index.html` — Home
2. `profile.html` — Profile
3. `dashboard.html` — Dashboard
4. `documents.html` — Documents
5. `labs.html` — Labs
6. `funding.html` — Funding
7. `mentors.html` — Mentors
8. `review.html` — Review
9. `guide.html` — AI guide
10. `application.html` — Applications
11. `notifications.html` — Notifications
12. `settings.html` — Settings

## Run locally

1. Open Terminal and change into this folder:
   ```bash
   cd /Users/riyakangle7/.codex/.chatgpt-projects/g-p-6ada2485a6f4819190193e4dab2d148d/saral-github-portal-split
   ```
2. Start a local server:
   ```bash
   python3 -m http.server 5500
   ```
3. Open `http://localhost:5500/index.html` in a browser.
4. Stop the server with `Ctrl+C`.

For VS Code, open this folder, right-click `index.html`, then select **Open with Live Server**.

The portal uses the same Supabase project settings included in the original `saralayush.html` source. It connects to Supabase whenever the CDN and browser storage are available; if they are unavailable, it falls back to browser-only demo mode so the pages remain usable during preview.

Use Settings → Language to switch the interface between English and Hindi. The choice is saved in the browser and applies across the portal pages.
