# Diffy

**See what changed between two drafts. Show them to no one.**

One HTML file. No server, no account, no network.

**[Open it in your browser](https://krulsenpai.github.io/diffy/)** or [download `diffy.html`](https://github.com/krulsenpai/diffy/releases/latest/download/diffy.html) and double-click it.

## Read the terms. Go on.

You have a contract and a "lightly revised" contract. You search *compare text online*, paste both into a stranger's text box, and get a tidy answer in two seconds.

Now open that site's terms of service.

Some of them take a **perpetual, irrevocable, worldwide licence** to use, reproduce and build on whatever you paste. No fee. No notice. No end date.

So that was your unsigned contract. Your unpublished chapter. Your medical letter. Your NDA, the one about not sharing things.

The tool was free because you paid with the text. Nobody reads the terms before pasting, and the whole business depends on that.

Code never had this problem, because `git diff` runs on your own machine. Prose did. A line-based diff turns one moved comma into a red paragraph, so people went online instead.

Diffy is a diff built for prose that runs on your machine, in a file your browser will not let talk to anyone.

## What it does

- **Reads like an editor.** It matches sentences, not lines, so rewrapping, splitting or merging paragraphs doesn't throw it. Changes are marked word by word, and a fixed typo letter by letter.
- **Flags what changes the meaning.** *will* → *will not*. *5 mg* → *50 mg*. *may* → *must*. *some* → *all*. A name, a date, a link that now points somewhere else.
- **Sees what you can't.** *liable* → *viable*. A letter from another alphabet hiding in a word. Zero-width and direction-flipping characters.
- **Keeps the noise out of the way.** Spelling, punctuation, quotes, spacing and formatting each get a category you can hide. "Meaning only" leaves just the edits that matter.
- **Follows moves.** A paragraph that moved, even one edited on the way, shows up as a move.
- **Track changes, minus Word.** Accept or reject each change, then copy or download the result.
- **Opens real files.** `.docx` with tracked changes read as accepted, Markdown, HTML, and plain text in most encodings. Drop two files and the older one becomes the original.
- **Exports** the final text, a standalone redline page, CriticMarkup, a printout or a PDF.

The word-based flags (negation, obligation, scope, tone) and the spelling checks go by English word lists. Everything else works in any language: the comparison itself, and the flags for figures, links and look-alike characters.

`J` `K` move between changes · `A` `R` accept or reject · `F` next flag · `G` other end of a move · `1` `2` `3` switch views · `?` everything else

## Privacy you can check

A privacy policy is a promise. Diffy ships a rule your browser enforces.

- **No requests.** The page's Content-Security-Policy says `default-src 'none'` and `connect-src 'none'`. The page cannot load, fetch or post anything: no uploads, analytics, fonts or CDNs.
- **One script.** `script-src` allows only the script inside the file, matched by its SHA-256 hash. Nothing injected or added can run beside it.
- **No way out.** A policy cannot stop a page from sending you to another address, so that part is the script's job: it has no links out and nothing that navigates. It is the only code that runs, and you can read it.
- **Nothing kept.** Your texts live in the tab and go when it closes. Only your settings are saved, in your browser's `localStorage`.
- **A copy you can verify.** The hash in the policy ties the script to the policy, and whoever edits the file can edit both. So each release also lists the SHA-256 of `diffy.html` itself. Match it and you have the released file, byte for byte.

Check it yourself: open DevTools, watch the Network tab, compare something. Or read the source. It is one file.

## Get it

- **Download** [`diffy.html`](https://github.com/krulsenpai/diffy/releases/latest/download/diffy.html) and open it. That is the whole install, and it works offline.
- **Check your copy.** Every [release](https://github.com/krulsenpai/diffy/releases) lists the file's SHA-256. Compare it with yours: `sha256sum diffy.html` on Linux, `shasum -a 256 diffy.html` on macOS, `certutil -hashfile diffy.html SHA256` on Windows.
- **Update by hand.** Diffy cannot check for updates: it cannot reach the internet, by design. Help (`?`) shows the version you have. For a newer one, come back to the [releases](https://github.com/krulsenpai/diffy/releases) and download it again.
- **Online:** [krulsenpai.github.io/diffy](https://krulsenpai.github.io/diffy/) is the same file, served from this repo. Fine for a look. For anything sensitive, use your own copy: a file on your disk is the one version nobody can swap out.
- **Host your own:** it is a static file. Fork the repo, turn on GitHub Pages, done.

## Change it

Edit the script in `diffy.html`, then:

```bash
node rehash.mjs        # re-pin the script's hash, or the browser won't run your edit
node --test tests/     # a few seconds, no dependencies
```

The tests check, among other things, that accepting or rejecting every change gives back your exact text.

## License

[AGPL-3.0](LICENSE). Copyright (C) 2026 krulsenpai.

Use it, fork it, host it. If you host a modified Diffy for other people, you share your source with them. If that sounds strict, scroll back up.
