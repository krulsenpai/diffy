// Engine tests. Run them with:  node --test tests/
// No dependencies and no browser. After editing the script in diffy.html, run node rehash.mjs first.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { html, script, cspHash, scriptHash, Engine as E, EX_A, EX_B, random } from './diffy.mjs';

const file = name => readFileSync(new URL('../' + name, import.meta.url), 'utf8').replace(/\r\n?/g, '\n');

const acceptAll = M => E.merge(M, () => true, true);
const rejectAll = M => E.merge(M, () => false, false);
const label = h => h.sub + (h.flags.length ? ' [' + h.flags.join(', ') + ']' : '');
const labels = M => M.order.map(id => label(M.hunks[id]));
const renderAll = M => { E.renderUnified(M, { markup: true }); E.renderSplit(M, { markup: true }); E.critic(M, null); };

test('the script matches the hash in the Content-Security-Policy', () => {
  assert.equal(scriptHash, cspHash, 'the browser would refuse to run the script: run node rehash.mjs');
});

test('the whole script parses', () => { new Function(script); });

test('the version in the comment at the top of the file is the one the app shows', () => {
  const inScript = /const VERSION = '(\d+\.\d+\.\d+)'/.exec(script), inComment = /^<!doctype html>\n<!--\n\s*Diffy (\d+\.\d+\.\d+):/.exec(html);
  assert.ok(inScript && inComment, 'a version like 1.2.3 in both places');
  assert.equal(inComment[1], inScript[1]);
});

test('the changelog has an entry for this version, which becomes the release notes', () => {
  const version = /const VERSION = '([^']+)'/.exec(script)[1];
  const entry = new RegExp('^## ' + version.replace(/\./g, '\\.') + '\\n+([^#]+)', 'm').exec(file('CHANGELOG.md'));
  assert.ok(entry && entry[1].trim().length > 20, 'CHANGELOG.md needs a "## ' + version + '" section that says what changed');
});

test('the page people share and the app describe themselves the same way', () => {
  // index.html is the address that gets shared; a link preview is drawn from these labels
  const labels = page => ['<title>([^<]+)</title>', 'name="description" content="([^"]+)"', 'property="og:title" content="([^"]+)"', 'property="og:description" content="([^"]+)"', 'property="og:image" content="([^"]+)"']
    .map(re => (new RegExp(re).exec(page) || [])[1]);
  const app = labels(html), front = labels(file('index.html'));
  assert.ok(app.every(Boolean), 'diffy.html has a title, a description and a picture for link previews');
  assert.deepEqual(front, app);
  assert.equal(app[0], app[2]); assert.equal(app[1], app[3]);
});

test('nothing in the app is a clickable link', () => {
  // an address in Diffy is plain text to copy; this covers the page and every piece of HTML the script builds
  assert.equal((html.match(/<a[\s>]/gi) || []).length, 0, 'no <a> element anywhere in diffy.html');
  assert.ok(!/window\.open|location\.(?:href|assign|replace)\s*[=(]/.test(script), 'no code that navigates');
});

test('printing uses the light palette whatever the theme', () => {
  // the print rules must outrank the hand-picked dark theme, :root[data-oled][data-theme="dark"], and set the text colour again
  const print = /@media print\{\s*(?:\/\*[\s\S]*?\*\/\s*)?(:root\S*)\{([^}]*)\}/.exec(html);
  assert.ok(print, 'a palette inside @media print');
  assert.ok((print[1].match(/:root/g) || []).length >= 3, 'a selector at least as specific as the dark theme rules');
  const light = /:root\{([^}]*)\}/.exec(html)[1], val = (css, name) => new RegExp(name + ':([^;]+)').exec(css)[1];
  for (const name of ['--bg', '--tx', '--del', '--ins', '--mv', '--flag']) assert.equal(val(print[2], name), val(light, name), name);
});

test('the built-in example is classified as expected', () => {
  const M = E.compare(EX_A, EX_B, {});
  assert.deepEqual(labels(M), [
    'Reworded [number]', 'Reworded [scope]', 'Removed [tone]', 'Look-alike word [name, lookalike]', 'Quote style',
    'Reworded [modal]', 'Quote style', 'Contraction', 'UK/US spelling', 'Spelling',
    'Sentence moved & edited [scope]', 'Sentence moved & edited [number]', 'Added [polarity]', 'Reworded [polarity]',
  ]);
  assert.equal(M.stats.wordsA, 141);
  assert.equal(M.stats.wordsB, 145);
});

/* ---------- accepting everything gives the revised text, rejecting everything gives the original ---------- */
const PAIRS = [
  ['example', EX_A, EX_B],
  ['identical', 'Same text. Twice.\n', 'Same text. Twice.\n'],
  ['empty original', '', 'Now there is text.\n'],
  ['empty revision', 'There was text.\n', ''],
  ['no final newline', 'One line', 'One line, changed'],
  ['spacing only', 'Same text.  Twice.\n', 'Same text. Twice.\n\n'],
  ['leading blank lines', '\n\n  Indented start. More.\n', 'Indented start. More!\n'],
  ['Windows line endings', 'First line.\r\nSecond line.\r\n\r\nNew paragraph.\r\n', 'First line.\r\nSecond line, edited.\r\n\r\nNew paragraph.\r\n'],
  ['line endings changed', 'First line.\r\nSecond line.\r\n', 'First line.\nSecond line.\n'],
  ['byte-order mark added', 'Plain start.\n', '\uFEFFPlain start.\n'],
  ['paragraph split', 'One sentence here. Another sentence there.\n', 'One sentence here.\n\nAnother sentence there.\n'],
  ['paragraph merged', 'One sentence here.\n\nAnother sentence there.\n', 'One sentence here. Another sentence there.\n'],
  ['paragraph moved', 'Alpha paragraph stays first.\n\nBravo paragraph will travel down.\n\nCharlie paragraph stays put.\n\nDelta ends it.\n', 'Alpha paragraph stays first.\n\nCharlie paragraph stays put.\n\nDelta ends it.\n\nBravo paragraph will travel down.\n'],
  ['Markdown', '# Title\n\nSome **bold** text with a [link](https://example.com/a) and `code`.\n\n- item one\n- item two\n', '## Title\n\nSome *bold* text with a [link](https://example.com/b) and code.\n\n- item one\n- item 2\n- item three\n'],
  ['Japanese', '日本語の文章です。これは二番目の文です。\n\n第三段落。数字は一千二百です。\n', '日本語の文章でした。これは二番目の文です。\n\n第三段落。数字は一千三百です。\n'],
  ['hidden characters', 'Pay to paypal.com today.\n', 'Pay to p\u0430ypal.com to\u200Bday.\n'],
  ['wrapped email', 'This line of an email\nis hard wrapped at some\ncolumn width. It goes on.\n\nSecond paragraph.\n', 'This line of an email is hard wrapped\nat some other column width. It goes on.\n\nSecond paragraph.\n'],
];
const OPTIONS = [{}, { markdown: false }, { paraMode: 'line' }, { paraMode: 'blank' }, { moves: false }, { threshold: 0.3 }, { threshold: 0.6 }];

for (const [name, a, b] of PAIRS) {
  test('round trip: ' + name, () => {
    for (const opt of OPTIONS) {
      const M = E.compare(a, b, opt), where = ' with ' + JSON.stringify(opt);
      assert.equal(acceptAll(M), b, 'accepting everything should give the revised text' + where);
      assert.equal(rejectAll(M), a, 'rejecting everything should give the original' + where);
      renderAll(M);
    }
  });
}

/* ---------- the same, on a few thousand random edits ---------- */
const BASES = [
  EX_A, EX_B, PAIRS[13][1], PAIRS[14][1], PAIRS[16][1],
  '\n\n  Leading blank lines.  Double  spaces\tand tabs.\nSecond line here.\n\nLast line without newline',
  'He said "no." She didn\'t agree; it\'s not allowed... Is it? Yes! Mr. Smith arrived at 5 p.m. on Jan. 3.\n',
];
const SPACES = [' ', '  ', '\n', '\n\n', '\t', ' \n', '\n\n\n', ''];
const EXTRAS = ['not', 'must', 'all', 'never', '12', '15%', '**', '_', '"', '“', '”', ',', '.', '—', '(', ')', 'Marta', '\u200B', 'https://x.io/q', '~~', '[', '](u)', '#', '- ', 'é', 'colour', 'color'];
function mutate(s, rnd) {
  const parts = s.split(/(\s+)/);
  for (let k = 1 + Math.floor(rnd() * 5); k > 0; k--) {
    const i = Math.floor(rnd() * parts.length), op = Math.floor(rnd() * 8);
    if (op === 0) parts.splice(i, 1);
    else if (op === 1) parts.splice(i, 0, rnd.pick(EXTRAS), rnd.pick(SPACES));
    else if (op === 2 && i + 2 < parts.length) { const t = parts[i]; parts[i] = parts[i + 2]; parts[i + 2] = t; }
    else if (op === 3) { if (/^\s+$/.test(parts[i] || '')) parts[i] = rnd.pick(SPACES); }
    else if (op === 4) parts[i] = (parts[i] || '').toUpperCase();
    else if (op === 5) { const j = Math.floor(rnd() * parts.length), seg = parts.splice(i, Math.min(12, parts.length - i)); parts.splice(Math.min(j, parts.length), 0, ...seg); }
    else if (op === 6) parts[i] = (parts[i] || '') + rnd.pick(EXTRAS);
    else parts.splice(i, Math.floor(rnd() * 6));
  }
  return parts.join('');
}
// One line-ending style per text: a text that mixes them is normalised to its commonest one, by design.
function randomPair(rnd) {
  const base = rnd.pick(BASES);
  let a = rnd() < 0.3 ? mutate(base, rnd) : base, b = mutate(rnd() < 0.2 ? rnd.pick(BASES) : a, rnd);
  if (rnd() < 0.15) a = a.replace(/\n/g, '\r\n');
  if (rnd() < 0.15) b = b.replace(/\n/g, '\r\n');
  const opt = { markdown: rnd() < 0.7, paraMode: rnd.pick(['auto', 'auto', 'blank', 'line']), moves: rnd() < 0.8, threshold: rnd.pick([0.3, 0.45, 0.6]) };
  return { a, b, opt };
}

test('round trip: 3,000 random edits', () => {
  const rnd = random(12345);
  for (let run = 0; run < 3000; run++) {
    const { a, b, opt } = randomPair(rnd), M = E.compare(a, b, opt);
    const where = ' (run ' + run + ', ' + JSON.stringify(opt) + ')\noriginal: ' + JSON.stringify(a) + '\nrevised:  ' + JSON.stringify(b);
    assert.equal(acceptAll(M), b, 'accept all' + where);
    assert.equal(rejectAll(M), a, 'reject all' + where);
    renderAll(M);
  }
});

test('any mix of decisions merges, renders and exports without an error', () => {
  const rnd = random(777);
  for (let run = 0; run < 1000; run++) {
    const { a, b, opt } = randomPair(rnd), M = E.compare(a, b, opt);
    const dec = new Map();
    for (const id of M.order) { const r = rnd(); if (r < 0.4) dec.set(id, 'acc'); else if (r < 0.8) dec.set(id, 'rej'); }
    const isNew = h => dec.has(h.id) ? dec.get(h.id) === 'acc' : true;
    assert.equal(typeof E.merge(M, isNew, true), 'string');
    assert.equal(typeof E.merge(M, h => dec.get(h.id) === 'acc', false), 'string');
    assert.equal(typeof E.critic(M, h => dec.get(h.id) || null), 'string');
    E.renderUnified(M, { markup: false, cls: h => dec.has(h.id) ? ' ' + dec.get(h.id) : '' });
  }
});

test('CriticMarkup with every change decided is just the merged text', () => {
  const rnd = random(4242);
  for (let run = 0; run < 500; run++) {
    const { a, b, opt } = randomPair(rnd), M = E.compare(a, b, opt);
    const dec = new Map(M.hunks.map(h => [h.id, rnd() < 0.5 ? 'acc' : 'rej']));
    assert.equal(E.critic(M, h => dec.get(h.id)), E.merge(M, h => dec.get(h.id) === 'acc', true), 'run ' + run);
  }
});

/* ---------- regressions: bugs that were found and fixed ---------- */
const moveTags = html => [...html.matchAll(/<span class="mvtag[^"]*" data-goto="(\w+)" data-h="(\d+)"[^>]*>moved (.)<\/span>/gu)].map(m => ({ to: m[1], id: +m[2], arrow: m[3] }));
const arrowsById = tags => { const by = new Map(); for (const t of tags) by.set(t.id, (by.get(t.id) || '') + t.arrow); return by; };

test('the arrows on a move point at each other, whichever way the text moved', () => {
  const M = E.compare(EX_A, EX_B, {}); // "The damage occurred…" moves down, "A public meeting…" moves up
  assert.deepEqual(M.hunks.filter(h => h.kind === 'move').map(h => h.down), [true, false]);
  // inline: reading from the top, the first tag of a move points down at the second, which points back up
  assert.deepEqual([...arrowsById(moveTags(E.renderUnified(M, {}))).values()], ['↓↑', '↓↑']);
  // side by side: the original column holds the old place, which is above the new one only when the text moved down
  for (const t of moveTags(E.renderSplit(M, {}))) assert.equal(t.arrow, (t.to === 'dst') === M.hunks[t.id].down ? '↓' : '↑', 'move ' + t.id + ', tag leading to ' + t.to);
});

test('move arrows stay consistent on random edits', () => {
  const rnd = random(99);
  let moves = 0;
  for (let run = 0; run < 1500; run++) {
    const { a, b, opt } = randomPair(rnd), M = E.compare(a, b, Object.assign(opt, { moves: true }));
    const by = arrowsById(moveTags(E.renderUnified(M, {})));
    // every move has a tag at both ends, even when one end starts right after a paragraph break
    for (const h of M.hunks) if (h.kind === 'move') { moves++; assert.equal(by.get(h.id), '↓↑', 'run ' + run + ', move ' + h.id); }
  }
  assert.ok(moves > 50, 'the random edits should produce moves to check (got ' + moves + ')');
});

test('a snippet never starts or ends with a paragraph mark', () => {
  const M = E.compare(EX_A, EX_B, {}), first = M.hunks.find(h => h.kind === 'move');
  assert.equal(E.textOf(M.B, first.b, 0), 'The damage occurred slowly, over many years, and was largely invisible from the shore.');
  const rnd = random(31337);
  let inner = 0;
  for (let run = 0; run < 800; run++) {
    const { a, b, opt } = randomPair(rnd), R = E.compare(a, b, opt);
    for (const h of R.hunks) for (const [D, list] of [[R.A, h.a], [R.B, h.b]]) {
      const s = E.textOf(D, list, 0);
      assert.ok(!/^¶|¶$/.test(s), 'run ' + run + ': ' + JSON.stringify(s));
      if (/\S ¶ \S/.test(s)) inner++;
    }
  }
  assert.ok(inner > 0, 'a mark between two paragraphs of one change is still shown');
});

test('one moved sentence is not called a paragraph, a moved paragraph is', () => {
  const one = E.compare(
    'Agreement\n\nThe goods ship in 30 days.\n\nThis whole paragraph will be removed in the revision. It has two sentences.\n\nSame text here.\n',
    'Agreement\n\nThe goods ship in 30 days.\n\nSame text here.\n\nA brand new closing paragraph was added. It also has two sentences.\n', {});
  assert.deepEqual(one.hunks.filter(h => h.kind === 'move').map(h => h.sub), ['Sentence moved & edited']);
  const [, a, b] = PAIRS.find(p => p[0] === 'paragraph moved');
  assert.deepEqual(E.compare(a, b, {}).hunks.filter(h => h.kind === 'move').map(h => h.sub), ['Paragraph moved']);
});

test('words and paragraphs are counted the way the comparison reads the text', () => {
  assert.deepEqual(E.countDoc('One two.\n\nThree **four** five.\n', {}), { words: 5, paras: 2 });
  assert.deepEqual(E.countDoc('First line\nsecond line\n', { paraMode: 'line' }), { words: 4, paras: 2 });
  assert.equal(E.countWords(EX_A, {}), 141);
  assert.deepEqual(E.countDoc('', {}), { words: 0, paras: 0 });
});

/* ---------- rendering ---------- */
test('a phrase that was added or removed is marked in one piece, not word by word', () => {
  const added = E.renderUnified(E.compare('The cat sat.\n', 'The cat quietly and calmly sat.\n', {}), {});
  assert.match(added, /<ins class="i">quietly and calmly<\/ins>/);
  const removed = E.renderUnified(E.compare('The big old grey cat sat.\n', 'The cat sat.\n', {}), {});
  assert.match(removed, /<del class="d">big old grey<\/del>/);
  const split = E.renderSplit(E.compare('The cat sat.\n', 'The cat quietly and calmly sat.\n', {}), {});
  assert.match(split, /<ins class="i">quietly and calmly<\/ins>/);
});

test('a change that only removes or only adds words says so in its class', () => {
  const cls = (a, b) => /<span class="(h [^"]*)"/.exec(E.renderUnified(E.compare(a, b, {}), {}))[1].split(' ');
  assert.ok(cls('The big cat sat.\n', 'The cat sat.\n').includes('od'));
  assert.ok(cls('The cat sat.\n', 'The big cat sat.\n').includes('oi'));
  const both = cls('The big cat sat.\n', 'The small cat sat.\n');
  assert.ok(!both.includes('od') && !both.includes('oi'));
  assert.ok(cls('Keep this.\n\nDrop this whole paragraph.\n\nKeep that.\n', 'Keep this.\n\nKeep that.\n').includes('od'));
});

test('side by side: a row with no change showing is marked as the same on both sides', () => {
  const M = E.compare(EX_A, EX_B, {});
  const rows = html => [...html.matchAll(/<div class="(row[^"]*)">/g)].map(m => m[1]);
  assert.deepEqual(rows(E.renderSplit(M, {})), ['row same', 'row', 'row', 'row gap', 'row']);
  // with every change filtered out, every row is the same
  assert.deepEqual(new Set(rows(E.renderSplit(M, { cls: () => ' off' }))), new Set(['row same', 'row gap same']));
});

/* ---------- reading the edits: what gets flagged, and what it is called ---------- */
const read = (a, b) => labels(E.compare(a + '\n', b + '\n', {}));
const sentences = text => E._t.parseDoc(text, {}).units.filter(u => u.kind === 's').length;

test('a word changed next to a number is not a changed number', () => {
  assert.deepEqual(read('In 2019 a study found that sales rose by 5 in March.', 'In 2019 the study found that sales rose by 5 during March.'), ['Reworded', 'Reworded']);
  assert.deepEqual(read('I am 5 years old.', 'I was 5 years old.'), ['Word form']);
  assert.deepEqual(read('It costs USD 500 a month.', 'It costs USD 600 a month.'), ['Reworded [number]']);
  assert.deepEqual(read('Take 5 mg daily.', 'Take 5 g daily.'), ['Reworded [number]']);
});

test('a.m. and p.m. are part of the time', () => {
  assert.deepEqual(read('Come at 5 p.m. on Friday.', 'Come at 5 a.m. on Friday.'), ['Reworded [number]']);
});

test('an address with digits in it is a link, not a number', () => {
  assert.deepEqual(read('See https://example.com/terms for details.', 'See https://example.com/terms-2026 for details.'), ['Reworded [link]']);
});

test('the same amount written another way is a number format, with words or symbols', () => {
  assert.deepEqual(read('It is 12% of revenue.', 'It is 12 percent of revenue.'), ['Number format']);
  assert.deepEqual(read('The fee is $1,500.00 a month.', 'The fee is $1500 a month.'), ['Number format']);
});

test('"No." ends a sentence unless a number follows; "sat." is a word, "Sat." a day', () => {
  assert.equal(sentences('Did it work? No. He left early.'), 3);
  assert.equal(sentences('See No. 7 for details.'), 1);
  assert.equal(sentences('The cat sat. The dog ran.'), 2);
  assert.equal(sentences('We meet on Sat. 5 June. Bring fig. 3 with you.'), 2);
  assert.equal(sentences('Dr. Okafor met Mr. Smith at 5 p.m. today.'), 1);
});

test('the first word of a sentence is a name only with support', () => {
  assert.deepEqual(read('Customers may cancel at any time.', 'Clients may cancel at any time.'), ['Reworded']);
  assert.deepEqual(read('1. Boil the water first.', '1. Heat the water first.'), ['Reworded']);
  // support: the same word capitalized in mid-sentence, or a capitalized word right after it
  const M = E.compare('Maria signed it. Then we thanked Maria for it.\n', 'Marta signed it. Then we thanked Maria for it.\n', {});
  assert.deepEqual(labels(M), ['Look-alike word [name, lookalike]']);
  assert.equal(M.hunks[M.order[0]].finfo[0][1], '“Maria” → “Marta”');
  assert.deepEqual(read('New York was chosen.', 'New Jersey was chosen.'), ['Reworded [name]']);
});

test('dashes and quotes set differently are typography, not spelling', () => {
  assert.deepEqual(read('He left -- quickly.', 'He left — quickly.'), ['Dash style']);
  assert.deepEqual(read('He said "wait" twice.', 'He said “wait” twice.'), ['Quote style', 'Quote style']);
});

test('a clause moved inside a sentence is one change in word order', () => {
  const a = 'On Monday, the board approved the budget.\n', b = 'The board approved the budget on Monday.\n';
  const M = E.compare(a, b, {});
  assert.deepEqual(labels(M), ['Word order', 'Capitalization']);
  assert.equal(acceptAll(M), b);
  assert.equal(rejectAll(M), a);
  // each change can still be decided on its own
  const order = M.hunks.find(h => h.cat === 'order');
  assert.equal(E.merge(M, h => h === order, false), 'the board approved the budget on Monday.\n');
});

test('a sentence replaced word for word is called rewritten', () => {
  assert.deepEqual(read('Our team worked hard to finish the project before the deadline despite many setbacks.',
    'Despite numerous obstacles, the project was completed on schedule thanks to the team\'s dedication.'), ['Sentence rewritten [scope]']);
  assert.ok(!read('Yes, we agree.', 'No, we refuse.').some(l => l.startsWith('Sentence rewritten')), 'a three-word sentence is not a rewrite');
});

test('reordered list items are moves, not rewrites', () => {
  assert.deepEqual(read('1. Wash the rice.\n2. Boil the water.\n3. Add salt.', '1. Wash the rice.\n2. Add salt.\n3. Boil the water.'), ['Paragraph moved & edited', 'Paragraph moved & edited']);
});
