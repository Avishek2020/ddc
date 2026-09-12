# DDC Website + Admin

A content-managed version of the DDC site. A small Node.js server serves the
public page, stores editable text and contact messages in JSON files, and
provides a password-protected admin panel.

## Requirements
- Node.js 18 or newer (check with `node -v`)

## Setup & run (local)
```bash
npm install        # first time only
npm start          # starts the server
```
Then open:
- Website:  http://localhost:3000
- Admin:    http://localhost:3000/admin

Stop the server with Ctrl+C.

## Admin login
Default password: `ddc-admin`

**Change this before putting the site online.** Set your own password and a
session secret via environment variables:

```bash
# macOS / Linux
ADMIN_PASSWORD="your-strong-password" SESSION_SECRET="a-long-random-string" npm start

# Windows (PowerShell)
$env:ADMIN_PASSWORD="your-strong-password"; $env:SESSION_SECRET="a-long-random-string"; npm start
```

## What the admin can do
- **Home, About, Product Development, Services, Current Projects, References** —
  edit every text field (German + English) per section. Saving pushes changes
  live to all visitors immediately.
- **Messages** — read every contact-form submission, mark read/unread, reply by
  email (opens your mail app pre-filled), and delete.



## Product Development — add/remove phases
The Product Development section is a **dynamic list**. In the admin you can add
as many phases as you like, remove them, and reorder them (↑ / ↓). Each phase is
an **image card**: an image (URL or upload), a title, and a description — all
bilingual for the text. New phases appear on the site automatically after saving.

On the public page the phases display as a **horizontal strip you scroll left/right** (arrows and edge fades appear when there are more items off-screen). Cards are compact, and **clicking a phase image opens it full-size** in a lightbox (Esc or click outside to close).

## Images (per placeholder)
Every image spot — the About image, the 4 project thumbnails and the 5 client
logos — is editable in the admin. For each you can either **paste an image URL**
or **upload a file** from your computer (PNG, JPG, GIF, WEBP, SVG, AVIF; max 5 MB).
Uploaded files are stored in `public/uploads/` and served automatically. Remember
to press **Save** after choosing/uploading an image.



## Admin sign-in with Google (optional)
You can let specific Google accounts sign in to the admin (the password login
still works as a fallback). It's off until you configure it.

### 1. Create Google OAuth credentials
1. Go to **Google Cloud Console → APIs & Services**.
2. **OAuth consent screen**: choose *External*, fill the app name/email, and add
   your Google account under *Test users* (or publish the app).
3. **Credentials → Create credentials → OAuth client ID → Web application**.
4. Under *Authorized redirect URIs* add:
   - `http://localhost:3000/auth/google/callback` (local)
   - your production URL later, e.g. `https://yourdomain.com/auth/google/callback`
5. Copy the **Client ID** and **Client secret**.

### 2. Fill in `.env`
```
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
# Optional, defaults to http://localhost:3000/auth/google/callback
GOOGLE_CALLBACK_URL=
# Comma-separated Google emails allowed into the admin:
ADMIN_EMAILS=you@gmail.com, colleague@company.com
```
Restart the server. The login page now shows **Continue with Google**. Only emails
in `ADMIN_EMAILS` are allowed in; anyone else is rejected with a clear message.

> `ADMIN_EMAILS` is the allowlist — without it, no Google account can sign in
> (Google verifies identity, but you decide who is an admin).


## Legal pages (Privacy Policy & Terms)
Detailed, bilingual **Privacy Policy** and **Terms of Service** are stored in the
database and served at **`/privacy`** and **`/terms`** (formatted from Markdown).
The Privacy Policy includes the **Google API Services / Limited Use** disclosures
required for Google OAuth verification.

- Edit them in the admin under **Legal Pages** (Markdown, DE + EN). Saving is live.
- Language toggle on each page: `/privacy?lang=en`, `/terms?lang=en`.
- Footer links point to them; add your Privacy Policy URL (`https://yourdomain/privacy`)
  in the Google Cloud **OAuth consent screen**.

### One-time Supabase setup for legal pages
In the SQL Editor run, in order:
1. `supabase/legal_schema.sql`  (creates the `legal_pages` table)
2. `supabase/legal_seed.sql`    (inserts the Privacy/Terms content — re-running UPDATES it)

> These documents are a solid starting template, not legal advice. Have them
> reviewed by a lawyer and fill in anything specific to your business (e.g. a
> separate Impressum, which German law requires in addition to these).

## Storage: Supabase or local files
The server auto-selects where data lives:
- If `SUPABASE_URL` and `SUPABASE_SERVICE_KEY` are set in `.env`, it uses your
  **Supabase** Postgres (tables `site_content` and `messages`).
- If they're not set, it falls back to **local JSON files** in `data/`.

On startup it prints which backend is active (`Storage backend: Supabase` or
`local JSON files`).

### One-time Supabase setup
1. In the Supabase SQL Editor, run `supabase/schema.sql`, then `supabase/seed_content.sql`.
2. Put your Project URL and service (secret) key in `.env`:
   ```
   SUPABASE_URL=https://YOUR-REF.supabase.co
   SUPABASE_SERVICE_KEY=your-service-role-or-secret-key
   ```
3. `npm start`. Admin edits now write to Supabase; the public page reads from it.

Images still upload to `public/uploads/` on the server. To store them in Supabase
Storage instead, create a public bucket and ask — the upload endpoint can be repointed.

## Where data lives
- `data/content.json`  — the editable website text (created on first run from
  `data/content.defaults.json`).
- `data/messages.json` — contact submissions.

Back up the `data/` folder (content + messages) and `public/uploads/` (images) to keep your content and messages. Deleting
`data/content.json` resets the site to its original text.

## Project structure
```
ddc-site/
├── server.js               # the backend
├── package.json
├── schema.json             # which fields the admin can edit
├── data/
│   ├── content.defaults.json
│   ├── content.json        # (auto-created)
│   └── messages.json       # (auto-created)
└── public/
    ├── index.html          # the website
    ├── admin.html          # the admin panel
    └── assets/             # logo, etc.
```

## Putting it online
This needs a host that runs Node.js (e.g. Render, Railway, Fly.io, a VPS) —
not a static host. Set `ADMIN_PASSWORD` and `SESSION_SECRET` there, run
`npm install` and `npm start`, and enable HTTPS. On a persistent host the
`data/` folder keeps your content and messages between restarts.

## Contact form → email (optional next step)
Right now messages are stored in the admin inbox. If you also want an email
notification whenever someone writes, that can be added with an SMTP service
(e.g. Nodemailer + a provider). Ask and it can be wired in.
