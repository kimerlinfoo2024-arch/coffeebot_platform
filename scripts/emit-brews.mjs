#!/usr/bin/env node
/* Simulated CoffeeBot machine. Reports brewed cups to the shared database the way a
   real machine's IoT gateway would, so every open dashboard updates live.

   Usage:  node scripts/emit-brews.mjs [--every 3] [--count 20] [--machine m2]
   Reads VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY from the environment or .env.local.

   Each report calls the `brew` database function (supabase/schema.sql), which locks the
   machine's row, adds one and returns the new value in a single transaction. Reports from
   several machines, scripts and browsers at the same instant all count. */
import { readFileSync } from 'node:fs';

const MACHINES = ['m1', 'm2', 'm3', 'm4'];
const arg = (name, dflt) => { const i = process.argv.indexOf(`--${name}`); return i > -1 ? process.argv[i + 1] : dflt; };

function loadEnv() {
  const env = { ...process.env };
  try {
    readFileSync(new URL('../.env.local', import.meta.url), 'utf8').split('\n').forEach((l) => {
      const m = l.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
      if (m && !(m[1] in env)) env[m[1]] = m[2];
    });
  } catch { /* no .env.local, rely on the environment */ }
  return env;
}
const env = loadEnv();
const URL_ = env.VITE_SUPABASE_URL, KEY = env.VITE_SUPABASE_ANON_KEY;
if (!URL_ || !KEY) { console.error('Missing VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY (set them or create .env.local).'); process.exit(1); }

async function brew(machine) {
  const res = await fetch(`${URL_}/rest/v1/rpc/brew`, {
    method: 'POST',
    headers: { apikey: KEY, Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ machine }),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    if (res.status === 404) throw new Error('the brew function is not installed — run supabase/schema.sql in the Supabase SQL editor');
    throw new Error(body.message || `${res.status} ${res.statusText}`);
  }
  return body.cups;
}

const every = Number(arg('every', 3)) * 1000;
const total = arg('count') ? Number(arg('count')) : Infinity;
const only = arg('machine');
if (only && !MACHINES.includes(only)) { console.error(`Unknown machine ${only}. Use one of ${MACHINES.join(', ')}.`); process.exit(1); }
let n = 0, failures = 0;
console.log(`Simulated machines reporting to ${URL_} every ${every / 1000}s${only ? ` (machine ${only})` : ''}. Ctrl+C to stop.`);
const tick = async () => {
  const m = only || MACHINES[Math.floor(Math.random() * MACHINES.length)];
  try { console.log(`${new Date().toLocaleTimeString()}  ${m} brewed a cup (machine total ${await brew(m)})`); failures = 0; }
  catch (e) { console.error(`${m}: ${e.message}`); if (++failures >= 3) { console.error('Giving up after 3 failures in a row.'); process.exit(1); } }
  if (++n >= total) process.exit(0);
  setTimeout(tick, every);
};
tick();
