require('dotenv').config();
/* DDC website — content-managed backend
 * Storage: Supabase (when configured) or JSON files — handled by ./db.js
 */
const express = require('express');
const session = require('express-session');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const db = require('./db');
const md = require('markdown-it')({ html: false, linkify: true, typographer: true });

const app = express();
const PORT = process.env.PORT || 3000;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'ddc-admin';
const SESSION_SECRET = process.env.SESSION_SECRET || 'change-this-secret';
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL || `http://localhost:${PORT}/auth/google/callback`;
const ADMIN_EMAILS = new Set((process.env.ADMIN_EMAILS || '').split(',').map(e => e.trim().toLowerCase()).filter(Boolean));
const googleEnabled = !!(GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET);

const SCHEMA = (() => { try { return JSON.parse(fs.readFileSync(path.join(__dirname, 'schema.json'), 'utf8')); } catch (e) { return []; } })();
const UPLOADS_DIR = path.join(__dirname, 'public', 'uploads');
fs.mkdirSync(UPLOADS_DIR, { recursive: true });
const LEGAL_TEMPLATE = (() => { try { return fs.readFileSync(path.join(__dirname, 'legal-template.html'), 'utf8'); } catch (e) { return '{{BODY}}'; } })();
function escapeHtml(x) { return String(x == null ? '' : x).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }
async function renderLegalPage(slug, req, res) {
  const doc = await db.getLegal(slug);
  if (!doc) return res.status(404).send('Not found');
  const lang = req.query.lang === 'en' ? 'en' : 'de';
  const other = lang === 'de' ? 'en' : 'de';
  const title = (doc.title && doc.title[lang]) || slug;
  const bodyHtml = md.render((doc.body && doc.body[lang]) || '');
  const updated = doc.updated_at ? new Date(doc.updated_at).toLocaleDateString(lang === 'en' ? 'en-GB' : 'de-DE', { year: 'numeric', month: 'long', day: 'numeric' }) : '';
  const html = LEGAL_TEMPLATE
    .replace(/{{LANG}}/g, lang)
    .replace(/{{SLUG}}/g, slug)
    .replace(/{{OTHER_LANG}}/g, other)
    .replace(/{{OTHER_LABEL}}/g, other.toUpperCase())
    .replace(/{{BACK}}/g, lang === 'en' ? '\u2190 Back to site' : '\u2190 Zur Website')
    .replace(/{{UPDATED_LABEL}}/g, lang === 'en' ? 'Last updated:' : 'Stand:')
    .replace(/{{UPDATED}}/g, escapeHtml(updated))
    .replace(/{{TITLE}}/g, escapeHtml(title))
    .replace('{{BODY}}', function () { return bodyHtml; });
  res.set('Content-Type', 'text/html; charset=utf-8').send(html);
}

/* ---------- middleware ---------- */
app.use(express.json({ limit: '512kb' }));
app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, sameSite: 'lax', maxAge: 1000 * 60 * 60 * 8 }
}));
// ---------- Google OAuth (optional) ----------
if (googleEnabled) {
  passport.use(new GoogleStrategy(
    { clientID: GOOGLE_CLIENT_ID, clientSecret: GOOGLE_CLIENT_SECRET, callbackURL: GOOGLE_CALLBACK_URL },
    (accessToken, refreshToken, profile, done) => {
      const email = ((profile.emails && profile.emails[0] && profile.emails[0].value) || '').toLowerCase();
      if (email && ADMIN_EMAILS.has(email)) return done(null, { email });
      return done(null, false); // not on the admin allowlist
    }
  ));
  app.use(passport.initialize());

  app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
  app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/admin?error=denied', session: false }),
    (req, res) => {
      req.session.admin = true;
      req.session.email = req.user && req.user.email;
      res.redirect('/admin');
    });
}
// tells the login page whether to show the Google button
app.get('/api/authinfo', (req, res) => res.json({ google: googleEnabled }));

function requireAuth(req, res, next) {
  if (req.session && req.session.admin) return next();
  return res.status(401).json({ error: 'unauthorized' });
}
const wrap = fn => (req, res) => fn(req, res).catch(err => {
  console.error(err);
  res.status(500).json({ error: 'server error' });
});

/* ---------- public API ---------- */
app.get('/api/content', wrap(async (req, res) => {
  res.json(await db.getContent());
}));

app.get('/api/legal/:slug', wrap(async (req, res) => {
  const d = await db.getLegal(req.params.slug);
  if (!d) return res.status(404).json({ error: 'not found' });
  res.json(d);
}));

app.post('/api/messages', wrap(async (req, res) => {
  const b = req.body || {};
  const name = String(b.name || '').trim();
  const email = String(b.email || '').trim();
  const company = String(b.company || '').trim();
  const message = String(b.message || '').trim();
  if (!name || !email || !message) return res.status(400).json({ error: 'name, email and message are required' });
  if (name.length > 200 || email.length > 200 || company.length > 200 || message.length > 5000)
    return res.status(400).json({ error: 'field too long' });
  await db.addMessage({ name, email, company, message });
  res.json({ ok: true });
}));

/* ---------- auth ---------- */
app.post('/api/login', (req, res) => {
  const pw = String((req.body || {}).password || '');
  if (pw && pw === ADMIN_PASSWORD) { req.session.admin = true; return res.json({ ok: true }); }
  return res.status(401).json({ error: 'wrong password' });
});
app.post('/api/logout', (req, res) => { req.session.destroy(() => res.json({ ok: true })); });
app.get('/api/session', (req, res) => res.json({ authed: !!(req.session && req.session.admin) }));

/* ---------- admin API (protected) ---------- */
app.get('/api/schema', requireAuth, (req, res) => res.json(SCHEMA));

app.post('/api/admin/content', requireAuth, wrap(async (req, res) => {
  await db.saveContent(req.body || {});
  res.json({ ok: true });
}));

app.get('/api/admin/legal', requireAuth, wrap(async (req, res) => {
  res.json(await db.getAllLegal());
}));

app.post('/api/admin/legal', requireAuth, wrap(async (req, res) => {
  const b = req.body || {};
  const slug = b.slug === 'terms' ? 'terms' : (b.slug === 'privacy' ? 'privacy' : null);
  if (!slug) return res.status(400).json({ error: 'bad slug' });
  const title = { de: String((b.title || {}).de || ''), en: String((b.title || {}).en || '') };
  const body = { de: String((b.body || {}).de || ''), en: String((b.body || {}).en || '') };
  await db.saveLegal(slug, { title, body });
  res.json({ ok: true });
}));

app.get('/api/admin/messages', requireAuth, wrap(async (req, res) => {
  res.json(await db.listMessages());
}));

app.patch('/api/admin/messages/:id', requireAuth, wrap(async (req, res) => {
  const ok = await db.patchMessage(req.params.id, req.body || {});
  if (!ok) return res.status(404).json({ error: 'not found' });
  res.json({ ok: true });
}));

app.delete('/api/admin/messages/:id', requireAuth, wrap(async (req, res) => {
  await db.deleteMessage(req.params.id);
  res.json({ ok: true });
}));

/* ---------- image upload (protected) ---------- */
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename: (req, file, cb) => {
    const ext = (path.extname(file.originalname) || '').toLowerCase().replace(/[^.a-z0-9]/g, '');
    const base = Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
    cb(null, base + (ext || '.img'));
  }
});
const ALLOWED = ['image/png', 'image/jpeg', 'image/gif', 'image/webp', 'image/svg+xml', 'image/avif'];
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => cb(ALLOWED.includes(file.mimetype) ? null : new Error('unsupported type'), ALLOWED.includes(file.mimetype))
});
app.post('/api/admin/upload', requireAuth, (req, res) => {
  upload.single('file')(req, res, (err) => {
    if (err) return res.status(400).json({ error: err.message || 'upload failed' });
    if (!req.file) return res.status(400).json({ error: 'no file' });
    res.json({ url: '/uploads/' + req.file.filename });
  });
});

/* ---------- legal pages (server-rendered) ---------- */
app.get('/privacy', (req, res) => renderLegalPage('privacy', req, res).catch(err => { console.error(err); res.status(500).send('server error'); }));
app.get('/terms', (req, res) => renderLegalPage('terms', req, res).catch(err => { console.error(err); res.status(500).send('server error'); }));

/* ---------- static site ---------- */
app.use(express.static(path.join(__dirname, 'public')));
app.get('/admin', (req, res) => res.sendFile(path.join(__dirname, 'public', 'admin.html')));

app.listen(PORT, () => {
  console.log(`DDC site running:  http://localhost:${PORT}`);
  console.log(`Admin panel:       http://localhost:${PORT}/admin`);
  console.log(`Storage backend:   ${db.useSupabase ? 'Supabase' : 'local JSON files'}`);
  console.log(`Google sign-in:    ${googleEnabled ? 'enabled' : 'disabled (set GOOGLE_CLIENT_ID/SECRET + ADMIN_EMAILS)'}`);
});
