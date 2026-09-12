/* Data layer for the DDC site.
 * Uses Supabase when SUPABASE_URL + SUPABASE_SERVICE_KEY are set,
 * otherwise falls back to local JSON files (so it still runs without Supabase).
 * Same async API either way.
 */
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, 'data');
const CONTENT_FILE = path.join(DATA_DIR, 'content.json');
const DEFAULTS_FILE = path.join(DATA_DIR, 'content.defaults.json');
const MESSAGES_FILE = path.join(DATA_DIR, 'messages.json');

function readJSON(file, fb) { try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch (e) { return fb; } }
function writeJSON(file, obj) { fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, JSON.stringify(obj, null, 2)); }

const DEFAULTS = readJSON(DEFAULTS_FILE, {});
const LEGAL_DEFAULTS_FILE = path.join(DATA_DIR, 'legal.defaults.json');
const LEGAL_FILE = path.join(DATA_DIR, 'legal.json');
const LEGAL_DEFAULTS = readJSON(LEGAL_DEFAULTS_FILE, {});

const SB_URL = process.env.SUPABASE_URL;
const SB_KEY = process.env.SUPABASE_SERVICE_KEY;
const useSupabase = !!(SB_URL && SB_KEY);

let supabase = null;
if (useSupabase) {
  const { createClient } = require('@supabase/supabase-js');
  supabase = createClient(SB_URL, SB_KEY, { auth: { persistSession: false, autoRefreshToken: false } });
}

/* ---------------- content ---------------- */
async function getContent() {
  if (useSupabase) {
    const { data, error } = await supabase.from('site_content').select('key,value');
    if (error) throw error;
    const map = {};
    (data || []).forEach(r => { map[r.key] = r.value; });
    return Object.assign({}, DEFAULTS, map); // defaults fill any missing key
  }
  if (!fs.existsSync(CONTENT_FILE)) writeJSON(CONTENT_FILE, DEFAULTS);
  return Object.assign({}, DEFAULTS, readJSON(CONTENT_FILE, {}));
}

async function saveContent(partial) {
  const keys = Object.keys(partial || {});
  if (!keys.length) return;
  if (useSupabase) {
    const rows = keys.map(k => ({ key: k, value: partial[k] }));
    const { error } = await supabase.from('site_content').upsert(rows, { onConflict: 'key' });
    if (error) throw error;
    return;
  }
  const cur = Object.assign({}, DEFAULTS, readJSON(CONTENT_FILE, {}));
  keys.forEach(k => { cur[k] = partial[k]; });
  writeJSON(CONTENT_FILE, cur);
}

/* ---------------- messages ---------------- */
async function listMessages() {
  if (useSupabase) {
    const { data, error } = await supabase.from('messages').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return (data || []).map(m => ({
      id: m.id, name: m.name, email: m.email, company: m.company,
      message: m.message, read: m.read, replied: m.replied, createdAt: m.created_at
    }));
  }
  return readJSON(MESSAGES_FILE, []);
}

async function addMessage(msg) {
  if (useSupabase) {
    const { error } = await supabase.from('messages').insert({
      name: msg.name, email: msg.email, company: msg.company || null, message: msg.message
    });
    if (error) throw error;
    return;
  }
  const arr = readJSON(MESSAGES_FILE, []);
  arr.unshift({
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
    name: msg.name, email: msg.email, company: msg.company, message: msg.message,
    createdAt: new Date().toISOString(), read: false, replied: false
  });
  writeJSON(MESSAGES_FILE, arr);
}

async function patchMessage(id, flags) {
  const upd = {};
  if (typeof flags.read === 'boolean') upd.read = flags.read;
  if (typeof flags.replied === 'boolean') upd.replied = flags.replied;
  if (useSupabase) {
    const { data, error } = await supabase.from('messages').update(upd).eq('id', id).select('id');
    if (error) throw error;
    return (data || []).length > 0;
  }
  const arr = readJSON(MESSAGES_FILE, []);
  const m = arr.find(x => x.id === id);
  if (!m) return false;
  Object.assign(m, upd);
  writeJSON(MESSAGES_FILE, arr);
  return true;
}

async function deleteMessage(id) {
  if (useSupabase) {
    const { error } = await supabase.from('messages').delete().eq('id', id);
    if (error) throw error;
    return;
  }
  const arr = readJSON(MESSAGES_FILE, []).filter(x => x.id !== id);
  writeJSON(MESSAGES_FILE, arr);
}

/* ---------------- legal pages ---------------- */
async function getLegal(slug) {
  if (useSupabase) {
    const { data, error } = await supabase.from('legal_pages').select('slug,title,body,updated_at').eq('slug', slug).maybeSingle();
    if (error) throw error;
    if (data) return data;
    const d = LEGAL_DEFAULTS[slug];
    return d ? { slug, title: d.title, body: d.body, updated_at: null } : null;
  }
  const file = readJSON(LEGAL_FILE, {});
  const d = file[slug] || LEGAL_DEFAULTS[slug];
  return d ? { slug, title: d.title, body: d.body, updated_at: d.updated_at || null } : null;
}
async function getAllLegal() {
  const out = {};
  for (const slug of ['privacy', 'terms']) out[slug] = await getLegal(slug);
  return out;
}
async function saveLegal(slug, doc) {
  const payload = { slug, title: doc.title, body: doc.body };
  if (useSupabase) {
    const { error } = await supabase.from('legal_pages').upsert(payload, { onConflict: 'slug' });
    if (error) throw error;
    return;
  }
  const file = readJSON(LEGAL_FILE, {});
  file[slug] = { title: doc.title, body: doc.body, updated_at: new Date().toISOString() };
  writeJSON(LEGAL_FILE, file);
}

module.exports = { useSupabase, DEFAULTS, getContent, saveContent, listMessages, addMessage, patchMessage, deleteMessage, getLegal, getAllLegal, saveLegal };

