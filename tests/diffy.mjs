// Loads the engine straight out of diffy.html, so the tests always run the code that ships.
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

// Browsers hash and run the script as parsed, after every CRLF or lone CR has become LF.
export const html = readFileSync(new URL('../diffy.html', import.meta.url), 'utf8').replace(/\r\n?/g, '\n');
export const script = /<script>([\s\S]*?)<\/script>/.exec(html)[1];
export const cspHash = /script-src 'sha256-([^']+)'/.exec(html)[1];
export const scriptHash = createHash('sha256').update(script, 'utf8').digest('base64');

// The engine is the first of the script's two parts and touches no DOM, so it runs in Node as it is.
const start = script.indexOf('const Engine = (() => {');
const ui = script.indexOf('DIFFY UI');
if (start < 0 || ui < 0) throw new Error('diffy.html: the engine was not found');
export const Engine = new Function(script.slice(start, script.lastIndexOf('/*', ui)) + '\nreturn Engine;')();

// The Word reader is in the script's second part and asks the browser for an XML reader. A small one stands in for
// it here: elements, attributes and namespaces, which is all the reader uses.
const ENT = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'" };
const unent = s => s.indexOf('&') < 0 ? s : s.replace(/&(#x[0-9a-fA-F]+|#\d+|\w+);/g, (m, e) => e[0] === '#' ? String.fromCodePoint(e[1] === 'x' ? parseInt(e.slice(2), 16) : +e.slice(1)) : (ENT[e] ?? m));
class El {
  constructor(qname, attrs, parent) {
    this.attrs = attrs; this.parent = parent; this.kids = [];
    this.ns = Object.create(parent ? parent.ns : null);
    for (const [q, v] of attrs) { if (q === 'xmlns') this.ns[''] = v; else if (q.startsWith('xmlns:')) this.ns[q.slice(6)] = v; }
    const i = qname.indexOf(':');
    this.localName = i < 0 ? qname : qname.slice(i + 1);
    this.namespaceURI = this.ns[i < 0 ? '' : qname.slice(0, i)] || null;
  }
  get children() { return this._c || (this._c = this.kids.filter(k => typeof k !== 'string')); }
  get textContent() { return this.kids.map(k => typeof k === 'string' ? k : k.textContent).join(''); }
  getAttribute(q) { return this.attrs.has(q) ? this.attrs.get(q) : null; }
  getAttributeNS(ns, local) {
    for (const [q, v] of this.attrs) { const i = q.indexOf(':'); if (i > 0 && q.slice(i + 1) === local && (this.ns[q.slice(0, i)] || null) === ns) return v; }
    return null;
  }
}
function parseXml(xml) {
  const re = /<!--[\s\S]*?-->|<\?[\s\S]*?\?>|<!\[CDATA\[([\s\S]*?)\]\]>|<!DOCTYPE[^>]*>|<\/([^\s>]+)\s*>|<([^\s\/>]+)((?:\s+[^\s=\/>]+\s*=\s*(?:"[^"]*"|'[^']*'))*)\s*(\/?)>|([^<]+)/g;
  let m, cur = null, root = null;
  while ((m = re.exec(xml))) {
    if (m[1] !== undefined) { if (cur) cur.kids.push(m[1]); }
    else if (m[2] !== undefined) { cur = cur.parent; }
    else if (m[3] !== undefined) {
      const attrs = new Map(), ar = /([^\s=]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g; let a;
      while ((a = ar.exec(m[4]))) attrs.set(a[1], unent(a[2] ?? a[3]));
      const el = new El(m[3], attrs, cur);
      if (cur) cur.kids.push(el); else root = el;
      if (!m[5]) cur = el;
    } else if (m[6] !== undefined && cur) cur.kids.push(unent(m[6]));
  }
  if (cur) throw new Error('an element is never closed');
  return root;
}
class DOMParser {
  parseFromString(xml) {
    let root = null; try { root = parseXml(xml); } catch (e) { root = null; }
    return { documentElement: root, getElementsByTagName: n => (n === 'parsererror' && !root ? [1] : []) };
  }
}
const files = script.indexOf('/* ---------- files ---------- */'), filesEnd = script.indexOf('async function loadFile(');
if (files < 0 || filesEnd < 0) throw new Error('diffy.html: the file reader was not found');
const Files = new Function('DOMParser', script.slice(files, filesEnd) + '\nreturn { readFile };')(DOMParser);
// the text the app reads from a file that is opened or dropped: its name and its bytes
export async function readFile(name, bytes) {
  return (await Files.readFile({ name, size: bytes.length, arrayBuffer: async () => bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.length) })).text;
}
// A zip archive made of the given files, { name: text }, stored as they are. (No compression and no checksums: the
// reader asks for neither.) A Word file is such an archive.
export function zip(parts) {
  const enc = new TextEncoder(), body = [], dir = [];
  const u16 = n => [n & 255, n >> 8 & 255], u32 = n => [n & 255, n >> 8 & 255, n >> 16 & 255, n >>> 24];
  let at = 0;
  for (const [name, text] of Object.entries(parts)) {
    const n = enc.encode(name), d = enc.encode(text);
    const head = [...u16(20), ...u16(0), ...u16(0), ...u16(0), ...u16(0), ...u32(0), ...u32(d.length), ...u32(d.length), ...u16(n.length), ...u16(0)];
    body.push(Uint8Array.from([0x50, 0x4B, 3, 4, ...head]), n, d);
    dir.push(Uint8Array.from([0x50, 0x4B, 1, 2, ...u16(20), ...head, ...u16(0), ...u16(0), ...u16(0), ...u32(0), ...u32(at)]), n);
    at += 30 + n.length + d.length;
  }
  const size = dir.reduce((s, x) => s + x.length, 0), count = dir.length / 2;
  const all = body.concat(dir, [Uint8Array.from([0x50, 0x4B, 5, 6, ...u16(0), ...u16(0), ...u16(count), ...u16(count), ...u32(size), ...u32(at), ...u16(0)])]);
  const out = new Uint8Array(all.reduce((s, x) => s + x.length, 0));
  let p = 0; for (const x of all) { out.set(x, p); p += x.length; }
  return out;
}

// the two example texts behind "Try an example"
const literal = name => new Function('return ' + new RegExp('const ' + name + " = ('(?:[^'\\\\]|\\\\.)*');").exec(script)[1])();
export const EX_A = literal('EX_A'), EX_B = literal('EX_B');

// a small seeded random source: failures can be replayed
export function random(seed) {
  const next = () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  next.pick = list => list[Math.floor(next() * list.length)];
  return next;
}

// How decisions carry from one comparison to the next (the texts edited, Undo, Clear decisions), and how Diffy starts
// over (another text in a box, a comparison setting switched, Swap) with a message whose Undo puts everything back: the
// interface's own functions for it, cut out of the script by name and run on the real engine, with the page left out.
// They are cut when decisions() is first called, and a name the script doesn't have is left out, so this module also
// loads with an older diffy.html (and the tests of what that one lacks fail there).
const DECISION_PARTS = ['pl', 'DEF', 'engineOpts', 'sameOpts', 'snapshot', 'yourDec', 'startOver', 'setTexts', 'typedOver', 'swapTexts', 'putState', 'replaced', 'onSetting', 'remap', 'ensureModel', 'clearDecisions', 'decide', 'undo', 'redo'];
const CALLED = ['ensureModel', 'decide', 'undo', 'redo', 'clearDecisions', 'setTexts', 'typedOver', 'swapTexts', 'onSetting'];
function cutOut(name) {
  const m = new RegExp('^(?:function ' + name + '\\b|const ' + name + ' = )', 'm').exec(script);
  if (!m) return '';
  if (script.startsWith('const', m.index)) return script.slice(m.index, script.indexOf('\n', m.index)); // (a one-line const)
  // to the brace that closes the function, past strings and comments
  for (let j = script.indexOf('{', m.index), depth = 0, q = null; j < script.length; j++) {
    const c = script[j];
    if (q) { if (c === '\\') j++; else if (c === q) q = null; continue; }
    if (c === '/' && script[j + 1] === '/') { j = script.indexOf('\n', j); continue; }
    if (c === '/' && script[j + 1] === '*') { j = script.indexOf('*/', j) + 1; continue; }
    if (c === "'" || c === '"' || c === '`') q = c;
    else if (c === '{') depth++;
    else if (c === '}' && --depth === 0) return script.slice(m.index, j + 1);
  }
  throw new Error('diffy.html: the end of ' + name + ' was not found');
}
let make = null;
// A fresh set of decisions: S holds the settings (the app's own defaults to begin with), set(a, b) puts texts in the
// boxes as typing would, the messages Diffy would show are collected in toasts, and pressUndo() presses the Undo button
// of the last one that had one.
export function decisions() {
  make ??= new Function('E', 'env', 'const { st, S, ta, tb } = env, noop = () => {}, afterDecide = noop, updateCounts = noop, updateLive = noop, save = noop, dropToast = noop;\n' +
    'const toast = (m, o) => { env.toasts.push(m); if (o && o.action === "Undo") env.undoButton = o.run; };\n' + DECISION_PARTS.map(cutOut).join('\n') +
    '\nObject.assign(S, JSON.parse(JSON.stringify(DEF)));\nreturn { ' + CALLED.map(n => n + ': typeof ' + n + ' === "function" ? ' + n + ' : undefined').join(', ') + ' };');
  const env = {
    st: { version: 1, M: null, dec: new Map(), undo: [], redo: [], cur: -1, listLimit: 400, screen: 'compose', names: { a: '', b: '' }, loaded: { a: '', b: '' } },
    S: {}, ta: { value: '' }, tb: { value: '' }, toasts: [], undoButton: null,
  };
  return Object.assign(make(Engine, env), env, { set(a, b) { env.ta.value = a; env.tb.value = b; env.st.version++; }, pressUndo() { env.undoButton(); } });
}
