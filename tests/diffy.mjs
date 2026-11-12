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

// the two example texts behind "Try an example"
const literal = name => new Function('return ' + new RegExp('const ' + name + " = ('(?:[^'\\\\]|\\\\.)*');").exec(script)[1])();
export const EX_A = literal('EX_A'), EX_B = literal('EX_B');

// a small seeded random source: failures can be replayed
export function random(seed) {
  const next = () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  next.pick = list => list[Math.floor(next() * list.length)];
  return next;
}
