# Listily Reviews — Backend Setup Guide

By default, reviews are stored in each visitor's browser (`localStorage`) — this means **reviews are not shared between visitors**. For a real community site you'll want to connect a shared backend.

This guide walks you through three options, from easiest to most powerful.

## Quick reference — what to change

Open `docs/js/reviews.js` and change line 20:

```js
const STORAGE_ADAPTER = 'localStorage'; // CHANGE THIS to switch backend
```

Replace `'localStorage'` with `'sheets'`, `'firebase'`, or `'supabase'`. Then fill in the matching URL in `WEBHOOK_URLS` just below it.

---

## Option 1 — Google Sheets (recommended for starting)

**Cost:** Free · **Setup time:** ~15 minutes · **Best for:** small to medium sites, easy moderation

### Steps

1. **Create a new Google Sheet** at https://sheets.google.com — call it "Listily Reviews".

2. **Add these column headers in row 1:**
   ```
   id | listingId | listingType | listingName | reviewer | rating | title | body | suburb | ts | status | helpful | reported
   ```

3. **Open Apps Script** via `Extensions → Apps Script`.

4. **Paste this code** and save:

   ```js
   const SHEET_NAME = 'Sheet1';

   function doGet(e) {
     if (e.parameter.action === 'getAll') {
       const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
       const data = sheet.getDataRange().getValues();
       const headers = data[0];
       const rows = data.slice(1).map(row => {
         const obj = {};
         headers.forEach((h, i) => obj[h] = row[i]);
         return obj;
       });
       return ContentService.createTextOutput(JSON.stringify(rows))
         .setMimeType(ContentService.MimeType.JSON);
     }
     return ContentService.createTextOutput('{}');
   }

   function doPost(e) {
     const body = JSON.parse(e.postData.contents);
     const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);

     if (body.action === 'add') {
       const r = body.review;
       sheet.appendRow([r.id, r.listingId, r.listingType, r.listingName, r.reviewer, r.rating, r.title, r.body, r.suburb, r.ts, r.status, r.helpful, r.reported]);
     } else if (body.action === 'update') {
       const data = sheet.getDataRange().getValues();
       for (let i = 1; i < data.length; i++) {
         if (data[i][0] === body.id) {
           Object.keys(body.patch).forEach(key => {
             const colIdx = data[0].indexOf(key);
             if (colIdx > -1) sheet.getRange(i + 1, colIdx + 1).setValue(body.patch[key]);
           });
           break;
         }
       }
     } else if (body.action === 'remove') {
       const data = sheet.getDataRange().getValues();
       for (let i = 1; i < data.length; i++) {
         if (data[i][0] === body.id) { sheet.deleteRow(i + 1); break; }
       }
     }
     return ContentService.createTextOutput('OK');
   }
   ```

5. **Deploy** via `Deploy → New deployment`:
   - Type: **Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
   - Click **Deploy** and **authorise**

6. **Copy the Web app URL** (looks like `https://script.google.com/macros/s/AKfycby.../exec`).

7. **Edit `docs/js/reviews.js`:**

   ```js
   const STORAGE_ADAPTER = 'sheets';
   const WEBHOOK_URLS = {
     sheets: 'https://script.google.com/macros/s/AKfycby.../exec',  // ← paste your URL
     ...
   };
   ```

8. **Commit and push.** Reviews now write to your Google Sheet and are visible to everyone.

### Moderation
- Open the Google Sheet to view all reviews directly.
- Change the `status` column to `approved`, `pending` or `removed` to moderate manually.
- Or use the Admin → Reviews tab in the Listily admin panel as before.

---

## Option 2 — Firebase Realtime Database

**Cost:** Free up to 100k reads/day · **Setup time:** ~20 minutes · **Best for:** higher traffic sites

### Steps

1. Go to https://console.firebase.google.com and create a new project.
2. In the left sidebar: **Realtime Database → Create Database** (start in test mode).
3. Copy your database URL — it looks like `https://your-project-default-rtdb.firebaseio.com`.
4. Edit `docs/js/reviews.js`:

   ```js
   const STORAGE_ADAPTER = 'firebase';
   const WEBHOOK_URLS = {
     ...
     firebase: 'https://your-project-default-rtdb.firebaseio.com/reviews.json',
     ...
   };
   ```

5. The Firebase adapter needs implementing in `reviews.js` (scaffolded but not complete in current build). The pattern is identical to the Sheets adapter — replace fetch URLs to use Firebase REST endpoints.

6. Important: lock down your database rules in Firebase console once you have admin auth working. Default test mode allows anyone to read/write.

---

## Option 3 — Supabase (Postgres)

**Cost:** Free 500MB · **Setup time:** ~25 minutes · **Best for:** structured data, advanced queries

### Steps

1. Sign up at https://supabase.com and create a project.
2. In the SQL Editor, create a table:

   ```sql
   CREATE TABLE reviews (
     id text PRIMARY KEY,
     listing_id text,
     listing_type text,
     listing_name text,
     reviewer text,
     rating int,
     title text,
     body text,
     suburb text,
     ts timestamptz,
     status text DEFAULT 'pending',
     helpful int DEFAULT 0,
     reported boolean DEFAULT false
   );

   -- Allow public read of approved reviews only
   ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
   CREATE POLICY "public reads approved" ON reviews FOR SELECT
     USING (status = 'approved');
   CREATE POLICY "anyone can submit" ON reviews FOR INSERT
     WITH CHECK (status = 'pending');
   ```

3. Copy your project URL and anon key from `Project Settings → API`.
4. Edit `docs/js/reviews.js` to use the Supabase JS client (or REST API directly).

---

## Which one should I pick?

| Need | Pick |
|------|------|
| Just want it working today | **Google Sheets** |
| 1000s of visitors per day | **Firebase** |
| Querying / dashboards / SQL | **Supabase** |
| Already have AWS / GCP / Azure | Roll your own with a small Lambda/Function |

---

## Privacy and safety notes

- All three options store **public review data only** — no passwords, no payment info.
- Add a CAPTCHA before launch — current code has none. Consider [hCaptcha](https://www.hcaptcha.com) (free).
- The duplicate-submission check uses a per-device random ID stored in `sessionStorage`. It is not foolproof against a determined spammer. Auto-moderation tools (e.g. Akismet) help.
- Once you move to a shared backend, **the Admin → Reviews tab still works** — it reads from whichever backend you've configured.

## Need help?

File an issue on the repo or email hello@listily.com.au.
