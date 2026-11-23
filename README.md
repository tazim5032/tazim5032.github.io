# Mohammad Fakhrul Islam · Portfolio

**Live site:** https://tazim-dev.netlify.app

Personal portfolio of a software engineer and engineering lead: full-stack web development, real-time 3D with Unreal Engine Pixel Streaming, AI evaluation and competitive programming.

## Features

- **Single-page profile:** experience timeline, featured projects with live demos, skills, competitive programming, education and a contact form.
- **Résumé:** one-click download and in-browser view; the one-page PDF is generated from `resume/resume.html`.
- **Blog:** Markdown posts in `posts/`, listed with search and topic filters and rendered client-side.
- **Open roles:** a searchable, category-filtered board of job referrals loaded from `referrals.json`.
- **Polish:** light/dark theme, scroll reveals, active-section navigation, responsive layout, print styles, Google Analytics events.

No framework and no build step for the site itself: plain HTML, CSS and JavaScript.

## Project structure

```
index.html            Main page
blog.html, post.html  Blog list and post page
referrals.html        Open roles board
styles.css, site.js   Shared styles and behaviour
analytics.js          Google Analytics loader (set GA_MEASUREMENT_ID)
posts/                Blog posts (Markdown) + posts.json index
referrals.json        Open roles data
resume/resume.html    Résumé source → Mohammad_Fakhrul_Islam_Resume.pdf
build.js              Copies the public files into dist/ for deployment
server.js             Zero-dependency local preview server
```

## Run locally

```bash
npm start
```

Then open http://localhost:8765

## Deploy

```bash
npm run build   # writes only the public files to dist/
```

Upload the contents of `dist/` to Netlify (drag-and-drop or `npx netlify deploy --dir=dist --prod`).

## Update the résumé

Edit `resume/resume.html`, then print it to PDF (for example with Edge or Chrome headless), overwriting `Mohammad_Fakhrul_Islam_Resume.pdf`, and redeploy. Keep it to one A4 page.

## Add a blog post

1. Write the post in Markdown as `posts/<slug>.md` (slug: lowercase letters, numbers and dashes, e.g. `my-first-bug-hunt`).
2. Add an entry to `posts/posts.json`:
   ```json
   { "slug": "my-first-bug-hunt", "title": "My first bug hunt", "date": "2026-12-01",
     "summary": "One or two sentences.", "tags": ["engineering"], "readingTime": "4 min read" }
   ```
   Add `"draft": true` to hide a post from the list.

## Google Analytics

Paste your GA4 Measurement ID (`G-XXXXXXX`) into `analytics.js`. Analytics is skipped on localhost.
Custom events sent: `resume_download`, `resume_view`, `email_click`, `outbound_click`, `referral_click`, `contact_form_submit`.

## Contact form (Formspree)

1. Sign up free at https://formspree.io and create a form that sends to your email.
2. Copy the form endpoint (looks like `https://formspree.io/f/abcdwxyz`).
3. In `index.html`, find `id="contact-form"` and paste it into `data-endpoint=""`.

Until then, the form opens the visitor's email app with the message filled in.

## Open roles (referral links)

Edit `referrals.json`. Each role:

```json
{ "company": "Acme", "role": "Frontend Engineer", "location": "Remote", "type": "Full-time",
  "level": "Mid-level", "note": "Optional short note.", "link": "https://...", "deadline": "2026-12-31", "hidden": false }
```

Links must start with `https://`. Roles disappear automatically after their `deadline`; set `"hidden": true` to hide one manually.
