# Setup — connect the form to Google Sheets & go live

Two one-time steps: **(A)** wire the form to a Google Sheet, then **(B)** turn
on the free website host. Budget ~10 minutes.

---

## A. Send responses to Google Sheets (Google Apps Script)

This keeps every address field in its **own column**, so the sheet is ready
for mail merge.

### 1. Create the spreadsheet
1. Go to <https://sheets.google.com> and create a **Blank** spreadsheet.
2. Name it something like **“Michael & Lucia — Save the Date responses.”**

### 2. Add the script
1. In that sheet, open **Extensions → Apps Script**.
2. Delete any starter code in `Code.gs`.
3. Copy the entire contents of [`google-apps-script/Code.gs`](google-apps-script/Code.gs)
   from this repo and paste it in.
4. Click **Save** (💾).
5. (Optional) In the function dropdown pick **`setupHeaders`** and click **Run**
   once to write the column titles. Approve the permission prompt the first time
   (choose your account → *Advanced* → *Go to project (unsafe)* → *Allow*).
   This is Google warning you about your **own** script; it’s expected.

### 3. Deploy it as a Web App
1. Click **Deploy → New deployment**.
2. Click the ⚙️ gear next to *Select type* → **Web app**.
3. Set:
   - **Description:** `Save the date form`
   - **Execute as:** **Me**
   - **Who has access:** **Anyone**  ← required so guests can submit
4. Click **Deploy**, approve access if asked, then **copy the Web app URL**.
   It looks like:
   `https://script.google.com/macros/s/AKfycb..../exec`

### 4. Paste the URL into the site
1. Open [`assets/script.js`](assets/script.js).
2. Put the URL between the quotes on this line near the top:
   ```js
   const FORM_ENDPOINT = "https://script.google.com/macros/s/AKfycb..../exec";
   ```
3. Save and commit the change.

> **Test it:** open the live site, submit the form — a new row should appear in
> the sheet within a second or two.

### Where to view responses
Open the same Google Sheet. Every submission is a new row with columns:
**Timestamp · Your full name · Partner/guest full name · Street address · City ·
State/Province · ZIP/Postal code · Country · Email address.**
Use **File → Download → CSV** anytime for a mail-merge export.

> **If you ever edit `Code.gs` later:** re-deploy with **Deploy → Manage
> deployments → ✏️ Edit → Version: New version → Deploy** so changes take effect.

---

## B. Publish the website (GitHub Pages — free)

One click, no build setup needed — Pages serves the files directly (the
`.nojekyll` file tells it to publish them as-is):

1. Go to the repo on GitHub → **Settings → Pages**.
2. Under **Build and deployment → Source**, choose **Deploy from a branch**.
3. Set **Branch** to `claude/save-the-date-website-xag5wb` (or `main` once you
   merge) and the folder to **/ (root)**, then click **Save**.
4. Wait ~1 minute and refresh. Your live URL will be:

```
https://michael-chemistry.github.io/Michael_Lucia_wedding/
```

> **Note:** GitHub Pages is free for **public** repositories (this one is
> public). If you ever make it private, you'd need GitHub Pro — or drag the repo
> folder onto <https://app.netlify.com/drop> for instant free hosting instead.

---

## Personalize before sharing
Edit these in [`index.html`](index.html) (all clearly marked near the top):
- The couple’s names (currently **Michael & Lucia**)
- The “After …, we said yes” story line
- **Fall 2026** and **the Hudson Valley, New York** (season/year + location)

That’s it — share the link and watch the responses roll into your sheet. 💌
