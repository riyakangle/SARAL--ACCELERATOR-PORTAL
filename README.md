# SARAL AYUSH Startup Portal

SARAL is a single-page portal with 12 in-app views.

The original prototype stack is used:

- HTML5
- CSS3
- Browser JavaScript
- Supabase Authentication, database records, and document storage
- Browser local storage for theme preference

Open `saralayush.html` directly in a browser for a static preview, or publish the repository with GitHub Pages.

## Multi-page version

The linked 12-page version is in `saral-github-portal-split/`. It preserves the portal design and Supabase configuration while separating the views into individual HTML files.

Run it locally from that folder:

```bash
cd saral-github-portal-split
python3 -m http.server 5500
```

Then open `http://localhost:5500/index.html`.
