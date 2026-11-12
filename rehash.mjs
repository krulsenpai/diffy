// Recomputes the SHA-256 of diffy.html's inline script and writes it into the page's
// Content-Security-Policy. Run it after editing the script: node rehash.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

const file = new URL('./diffy.html', import.meta.url);
const src = readFileSync(file, 'utf8');
const m = /<script>([\s\S]*?)<\/script>/i.exec(src);
const RE_HASH = /(script-src ')sha256-[A-Za-z0-9+/=]+(')/;
if (!m || !RE_HASH.test(src)) throw new Error('diffy.html: no inline <script> or no script-src hash to update');
// Browsers hash the script as parsed, after every CRLF or lone CR has become LF.
const hash = createHash('sha256').update(m[1].replace(/\r\n?/g, '\n'), 'utf8').digest('base64');
const out = src.replace(RE_HASH, '$1sha256-' + hash + '$2');
if (out === src) console.log('diffy.html: script hash already current');
else { writeFileSync(file, out); console.log('diffy.html: script hash updated to sha256-' + hash); }
