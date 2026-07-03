# Michael & Lucia — Save the Date 💌

A single-page, mobile-first save-the-date website. It announces the engagement
and collects each guest’s mailing details into **Google Sheets** (one column
per field, mail-merge ready).

**Live URL (after enabling Pages — see below):**
`https://michael-chemistry.github.io/Michael_Lucia_wedding/`

---

## What’s here

| File | Purpose |
| --- | --- |
| `index.html` | The page — announcement + details form |
| `assets/styles.css` | Mobile-first, responsive styling |
| `assets/script.js` | Required-field validation + submit to Google Sheets |
| `google-apps-script/Code.gs` | The Google Apps Script that writes rows to your sheet |
| `.github/workflows/deploy.yml` | Auto-deploys the site to GitHub Pages |
| **[`SETUP.md`](SETUP.md)** | **Step-by-step: connect Sheets + go live** |

## Features
- 📱 **Mobile-first & responsive** — designed for a phone first.
- ✅ **Required-field validation** — the form won’t submit half-blank; email
  format is checked; the address stays split into separate columns.
- 🎉 **Confirmation message** — “Thanks — see you soon!” after a successful send.
- 📊 **Straight to Google Sheets** — every response is a new row.

## Quick start
1. Follow **[`SETUP.md`](SETUP.md)** to:
   - create a Google Sheet + Apps Script Web App, and
   - paste its URL into `assets/script.js` (`FORM_ENDPOINT`).
2. In the repo, **Settings → Pages → Source → GitHub Actions** to publish.

## Personalize
In `index.html` (marked near the top):
- Names — **Michael & Lucia**
- The “After …, we said yes” story line
- **Fall 2026** and **the Hudson Valley, New York** (season/year + location)

## Local preview
Open `index.html` in a browser, or:
```bash
python3 -m http.server 8000   # then visit http://localhost:8000
```
(The form only records to Sheets once `FORM_ENDPOINT` is set.)
