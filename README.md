# Dr. Anagha Deshpande – Ophthalmology Website

Bilingual (English / मराठी) website and appointment-request system for Dr. Anagha Deshpande, Consultant Ophthalmologist, Chembur, Mumbai.

- Node.js 20+ with **no runtime dependencies** (nothing to `npm install` in production).
- Every page is server-rendered in English (`/about`) and Marathi (`/mr/about`), so it works without JavaScript and is fully indexable.
- Ships in **preview mode**: hidden from search engines, with a review banner, until the doctor approves the content and an admin ticks *Website is LIVE* in **Admin → Settings**.

See [REVIEW-CHECKLIST.md](REVIEW-CHECKLIST.md) for what Dr. Deshpande needs to confirm before launch.

## Run locally

```bash
npm start                      # http://localhost:3000
npm run create-admin           # create the first admin login (interactive)
```

Then open http://localhost:3000/admin/login.

## What is included

| Area | Where |
| --- | --- |
| Pages: Home, About, Cataract & Phaco Surgery, Eye Care Services, FAQs (33), Articles (4), Book Appointment, Appointment Status, Clinics & Timings, Contact, Privacy Policy, Medical Disclaimer | `lib/views.js`, content in `content/` |
| Clinic numbers, hours, addresses, services, doctor profile (defaults) | `content/site.js` |
| FAQ library, English + Marathi | `content/faqs.js` |
| Cataract page, articles, privacy policy, disclaimer text | `content/pages.js` |
| Interface text and validation messages (EN/MR) | `lib/i18n.js` |
| Booking rules (OPD days/hours, slots, capacity, holidays, duplicates) | `lib/booking.js` |
| Admin dashboard | `lib/admin.js` at `/admin` |
| Styles / browser scripts | `public/css/site.css`, `public/js/site.js` |

On first start the defaults from `content/site.js` and `content/faqs.js` are copied into `DATA_DIR/content.json` and `DATA_DIR/faqs.json`. **After that, edit them in the admin dashboard** (changes to the default files are not applied once the data copy exists). The cataract page, articles, privacy policy and disclaimer are edited in `content/pages.js`.

### Phone and WhatsApp links

| Clinic | OPD | Call | WhatsApp |
| --- | --- | --- | --- |
| SRV Hospital, Chembur | Mon–Sat, 10:00 AM–1:00 PM | `tel:8451800800` | none (landline) |
| Just Care Heart & Eye Clinic | Mon–Fri, 6:00 PM–8:00 PM | `tel:8879758831` | `https://wa.me/918879758831?text=…` (prefilled, editable before sending) |

The mobile bottom bar's **Call** button opens a chooser with both clinics, so the numbers are never mixed up.

### Appointment workflow

1. Patient picks a clinic, then calls, WhatsApps (Just Care) or sends an online request.
2. The server checks the clinic's OPD days and hours, holidays/leave, booking window, same-day notice, slot capacity and duplicate requests (same mobile, clinic and date).
3. The patient sees **"Request received – awaiting confirmation"** with a reference (e.g. `AD-7K4P-Q9MX`). Nothing is shown as confirmed until staff confirm it.
4. Staff call or WhatsApp the patient (one-tap links in the admin list), then **Confirm**, **Reschedule** or **Cancel**. The patient can check the status at `/appointment-status` with reference + mobile number.

There is no automatic SMS. If you want SMS/email notifications later, add a provider in `server.js` (`createAppointment`) and `lib/admin.js` (`updateAppointment`).

### Admin roles

- **admin**: everything, including content, timings, holidays/leave, clinic details, photos, users, CSV export, activity log.
- **staff**: appointments and enquiries only.

Create users with `npm run create-admin` or in **Admin → Users**. Passwords are hashed with scrypt; logins are rate-limited; all actions are logged.

## Security and privacy

- AES-256-GCM encryption at rest for appointments, enquiries and the activity log (`DATA_ENCRYPTION_KEY`).
- HttpOnly, SameSite=Strict, Secure session cookies; CSRF tokens on every admin form; same-origin checks on all form posts.
- Strict Content-Security-Policy, HSTS (behind HTTPS), no third-party scripts or cookies. Fonts are self-hosted.
- No patient data in URLs; the public availability API returns only open/full slots.
- Honeypot and rate limits on public forms.
- Records older than the retention period (default 365 days, **Admin → Settings**) are deleted automatically each day. Daily backups go to `DATA_DIR/backups/<date>/` (last 14 kept). Copy that folder off the server regularly (see below).
- Analytics are off unless `PLAUSIBLE_DOMAIN` is set (cookie-free), and are only loaded once the site is live. Patient data is never sent to analytics.

## Deploy

Required environment variables in production (see `.env.example`): `NODE_ENV=production`, `SITE_URL`, `SESSION_SECRET`, `DATA_ENCRYPTION_KEY`, and `DATA_DIR` on a **persistent disk**. The server refuses to start in production without them. Keep `DATA_ENCRYPTION_KEY` safe: without it the appointment records cannot be read.

### Option A: Docker on any VPS (recommended)

```bash
docker build -t anagha-website .
docker run -d --name anagha --restart unless-stopped -p 127.0.0.1:3000:3000 \
  -v anagha-data:/data --env-file .env anagha-website
docker exec -it anagha node scripts/create-user.js     # first admin login
```

Put Caddy in front for automatic HTTPS (`Caddyfile.example`) and set `TRUST_PROXY=1`.

### Option B: Render / Railway / Fly.io

Create a web service from this folder (start command `npm start`), add a persistent disk mounted at `/data`, set the environment variables above with `TRUST_PROXY=1`, and run `node scripts/create-user.js` once from the service shell.

### Backups off the server

```bash
npm run backup                  # writes DATA_DIR/backups/<date>/
# then copy it elsewhere, e.g. rsync -a server:/data/backups/ ./backups/
```

### After going live

1. Tick *Website is LIVE* in **Admin → Settings**.
2. Submit `https://<your-domain>/sitemap.xml` in Google Search Console.
3. Create or claim the Google Business Profile listings for both clinics with exactly the same name, address and phone as on the site.

## Tests

```bash
npm test          # 25 server tests: booking rules, numbers & WhatsApp links, all pages EN/MR, internal links, SEO tags, validation, duplicates, encryption, admin confirm/reschedule/cancel, roles, CSRF
npm i && npm run test:e2e   # browser test: mobile journey, call chooser, language switch, Marathi font, FAQ search, axe WCAG A/AA scan, no horizontal scroll (needs Chromium; set CHROME_PATH)
```
