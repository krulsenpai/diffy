# What's new in Diffy

Diffy cannot check for updates, so this page is where you find out what changed. Press `?` inside Diffy to see which version you have.

## 1.0.7

Fixes from two stress tests and two close reviews of the code. One new setting; nothing else to learn.

- **Old text files open right.** A file saved by an older Windows program could open with its accents turned into Russian letters: "Café" became "Cafй", and "€5" became "Ђ5". Western text now opens as it was written, and so do old Turkish, Polish and other Central European, Greek, Hebrew, Arabic and Russian files. A file with a few broken characters keeps the rest of its text as it was.
- **A new document starts a new review.** Put another text in either box (open a file, paste, load the example, clear a box), switch one of the three comparison settings, or press Swap, and your accept and reject decisions are cleared. Ctrl+Z, or the Undo button in the message that says so, brings back the texts, the setting and every decision. Before, a decision could carry over into a different document that shared a sentence with the last one, and rejecting one word of a moved paragraph, then switching off "Detect moved text", could drop the whole paragraph from the final text. Editing a text by typing still keeps your decisions, and each one stays with the change you made it on, even when the same change appears elsewhere in the text.
- **A name spelled one letter differently is flagged.** "Philip" → "Phillip" was taken for a typo fix. It is a changed name, also after "by" or "said": "Signed by Philip". A term a contract defines is still put right as a spelling fix: "the Tennant" → "the Tenant".
- **Two parties that change places are flagged** when they are written in small letters too: "the employer pays the employee" turned into "the employee pays the employer".
- **German.** German gives every noun a capital, and Diffy took those nouns for names. Now a name needs a capital word beside it, as in "Herr Müller" or "Anna Schmidt". A unit such as "5 Meter" is part of its figure, and "ß" written as "ss" is a spelling.
- **Fewer false flags.** "9 AM" → "9 PM" and "5 GB" → "5 TB" are a changed figure, not a changed name too. "On Fridays" → "on Thursdays" is a changed day, not a changed name. An emoji such as a family, or the flag of England, Scotland or Wales, changes as a whole, with no "hidden character" badges inside it. A line break copied from Word or a PDF reads as a line break.
- **Clearer descriptions.** "first" → "second" now reads that way, not "Added 'second'", and so does "Clause 8" → "Clause 9". "It's" → "It is" is one change, a contraction: you can no longer end up with "It's is". Bold turned into italics shows the word, "\*\*very\*\*" → "\*very\*".
- **Accept shown and Reject shown** now say how many changes hidden by your filters are still undecided.
- **Keyboard.** After Compare, Page Down, Space and the arrow keys scroll the text. A new setting switches off the one-key shortcuts (J, K, A, R and the rest), for people who use speech input. M goes back to the filters you had, not to Default. Hiding changes with the filters no longer loses your place.
- **The Rewrite threshold setting is gone.** It did nothing in most texts.
- **Smaller things.** The review panel shows how many changes you have reviewed once, in its ring, instead of twice. Printing leaves out the outline of the selected change. On a phone, Settings no longer squeezes its descriptions, and messages no longer cover the buttons. A long web address no longer runs out of its card. "100% similar" no longer shows next to a flagged change. Screen readers no longer announce changes your filters hide, and the results have a heading for them.

## 1.0.6

Exports you can rely on, and a truer reading of text that changed places. There is nothing new to learn.

- **The CriticMarkup export agrees with the Final text.** With some changes accepted, some rejected and some left open, the exported file could differ from what Diffy showed: a paragraph you kept and one still open could run together into one. Now taking every suggestion in the file gives exactly the Final text, and refusing them gives the text with those changes rejected.
- **CriticMarkup keeps indentation.** A suggestion at the start of an indented paragraph lost the indentation.
- **Two things that changed places.** When two list items or two paragraphs swap, either one can be called "the one that moved". Diffy now picks the shorter one, and a sentence that was edited where it stands is compared there. Before, a list with two items swapped and a third one edited could read as one bigger block, "moved & edited".
- **A section that moved takes its heading along.** Move a section with a one-word heading, and Diffy used to show the heading removed in one place, the text moved, and the heading added in the other. Now it is one move. If the heading was renamed on the way, that is an edit of its own inside the move.
- **Unrelated paragraphs come in two blocks.** When several paragraphs are taken out and others are put in their place, Diffy now shows the removed ones together, then the added ones. Before, they came one by one in turn, as if each old paragraph had turned into a new one. In the text itself, a removed paragraph and the one put in its place are now drawn as two paragraphs. They used to run together.
- **"Should I…?" is not a name.** A word in front of "I" was taken for a name, because "I" is a capital. So "Should I sign?" turned into "Must I sign?" was flagged under Names. It is now flagged under Obligation, where it belongs.
- **°C and °F.** "4 °C" turned into "4 °F" is flagged as a changed figure. Before, it was flagged as a changed name.
- **Smaller things.** A changed word order now shows the whole stretch it runs over: a "not" that went to another clause used to preview as "not → not". In a table row, a figure that changed next to a cell that was added is a change of its own. Bold turned into italics is called "Bold → italics".

## 1.0.5

Diffy was tried on two Word files full of planted traps. This version fixes what they showed. Word files are now read more fully, so the same two files can show changes that were invisible before.

- **Tables in Word files.** A table is now read row by row. Before, every cell was a paragraph of its own, and a row that moved could turn into false number changes on the row next to it.
- **More of a Word file is read.** Headers and footers. Words that are struck through, shown as `~~struck~~`. The address behind a link, shown as `[words](address)`, so a link that keeps its words but points somewhere new is flagged. Tick boxes. Equations. Page numbers in a header or footer are left out, because they change by themselves.
- **Names after a label.** "Landlord: John Smith" turned into "Landlord: Jane Doe" was not flagged. Neither was a short sentence made mostly of names. Both are now.
- **Dates after a dash or a colon.** "August–October" turned into "August–November" was not flagged, and neither was a month that opens a sentence. Short day names such as *Mon* and *Fri* are now read as dates when a figure or another date stands beside them.
- **Marks that carry meaning.** A box ticked or cleared (☐ → ☒), a tick turned into a cross, *≤* turned into *≥* and a grade going from *B−* to *B+* are now flagged. Before, they were filed as punctuation.
- **Hidden characters.** Invisible "tag" characters, which can spell out words nobody sees, are now flagged like other hidden characters. A hidden character inside a number no longer reads as a changed number.
- **Unrelated text is not "rewritten".** A paragraph taken out and a different one put in its place used to be one "rewritten" change, with flags such as "1923 → 6". Now it is a removal and an addition.
- **A line of figures.** When several figures in one line change, as in the row of a table or in "Version 1, February 1989", each is a change of its own.
- **Smaller things.** *10 000* written with a thin space is the same number as *10000*. Two hidden edits a word apart are two changes. An old `.doc` file, or a file locked with a password, gets a message that says what it is.

## 1.0.4

Fixes found by looking closely at the built-in example. There is nothing new to learn.

- **A move and the edits made on the way are decided apart.** A sentence that moved and was also edited used to be one change, so you could not keep the new order and refuse a new date. Now the move is one change and each edit inside it is a change of its own, with its own flag. Reject the move and the sentence goes back to its old place, its edits still there to accept or reject.
- **The "moved" tags say which way.** They read "moved to ↑" where the text was and "moved from ↓" where it is now. An arrow alone was read as the way the text went. Both tags are now blue in every view, the colour of moved text.
- **A "not" that moved is flagged.** "may not sublet … must repair" turned into "may sublet … must not repair" keeps every word, so it was shown as a harmless change of word order. Now it is flagged: the "not" applies to another word.
- **A hidden character inside a word** is shown as exactly that. Before, the word was split in two, which could raise a false flag: "today" with an invisible character in it read as a date removed.
- **The card's buttons.** "Go to the other end" is now a button like Accept and Reject, with its key (G), and no longer runs past the card's edge. G also works on the move whose card is open, as A and R do.
- **The privacy notes scroll** on a short screen, such as a phone: their last lines were cut off.
- **Smaller things.** A change's context starts with "…" only where text was cut. "Every shown change is reviewed" goes away when you undo a decision. Help no longer says the list of changes is "on the right", which it isn't on a narrow screen.

## 1.0.3

Diffy was tried on real documents: fifteen pairs of licence versions, forty Word files and two editions of a book. This version fixes what they showed. There is nothing new to learn.

- **Fewer false "Names" flags.** Words such as *You*, *Your*, *If* and *The* are no longer taken for names when a text writes them with a capital. Neither is a word shouted in capitals, as in *WITHOUT ANY WARRANTY*, the first word of a heading in Title Case, or the plural of the same word (*License* → *Licenses*).
- **"©" is not a change of tone.** *(c)* turned into *©* is typography and nothing more. The same goes for ® and ™.
- **Number words that are not figures.** *third* in "third party", *first* in "you first think" and a *MAY* in capitals are no longer flagged as changed numbers or dates.
- **A flag that was missing.** *thirteenth* → *fourteenth* was not flagged. Ordinals above *twelfth* now are.
- **Footnotes in Word files.** A sentence that ends with a footnote mark is now seen to end there, so sentences line up better. Add one footnote and Diffy shows one renumbering, instead of flagging every mark after it.
- **A contents page.** When page numbers shift, Diffy shows one renumbering, not a flagged number on every line.
- **A line break that becomes a paragraph break** is a paragraph split. Before, it could read as words removed in one place and a paragraph added in another.
- **Short lines.** A date line or a table cell that changed is "reworded", no longer a "rewritten sentence".
- **Two edits stay two.** "Pay 1,500 by 1 May" turned into "Pay 15,000 by 1 June" is now two changes, so you can accept one and reject the other.
- **Sturdier.** The underline of an accepted or rejected change is written in a form every browser understands. Opened from the website, the button at the top says "Private" instead of "Offline & private". A browser too old to open Word files now says so.

## 1.0.2

Diffy reads changes more accurately. There is nothing new to learn: the same two texts now give a truer picture.

- **A clause added to a numbered text.** Add one clause to a contract and every clause after it gets a new number. Diffy now shows one added clause and one renumbering, instead of flagging every number that shifted. A number mentioned in the text, such as "see Section 8", is still flagged when it changes.
- **A paragraph added among edited ones.** The paragraphs after it are no longer compared with the wrong partner, or shown as moved when they never moved.
- **Names and figures that change places.** "The Seller shall indemnify the Buyer" turned into "The Buyer shall indemnify the Seller" is now flagged. So is "5 on day 10" turned into "10 on day 5".
- **Spelling fixes are no longer a rewrite.** A sentence with several corrected words, or a text converted from British to American spelling, now shows each fix as a spelling change. Before, the whole sentence could be called rewritten.
- **More edits flagged.** *and* → *or*. A unit written out in words, such as *10 miles* → *10 meters*. The period of a rate, such as *per day* → *per week*.
- **Fewer false alarms.** A phone number that only lost its brackets or hyphens, *9am* → *9 am*, *Jan* → *January* and a corrected *Wendesday* are no longer flagged as changed numbers or dates. A corrected word such as *shoudl* → *should* is a spelling fix and nothing more.
- **Flag dots in the right place.** Side by side, each column now marks its own flagged changes, and the stray dot in front of unchanged words is gone. A flagged move is marked at its new place as well as its old one.
- **Copying from the page.** Copying from the side-by-side Original column no longer leaves out the changed words, and copying from the inline view no longer leaves double spaces.
- **Dropping a file.** While you drag a file over Diffy, the window now shows two halves, Original and Revised, so it is plain where the file will go. Before, one message covered the whole window, and it said "revised" even when the file was about to land in the original.

## 1.0.1

- **Try it in one click.** Adding `#example` to the end of Diffy's address opens it straight onto the built-in example.
- **Keep your own copy.** Diffy is made to be downloaded once and kept. When you use it online, it now says so and tells you where to get the file.
- **Links to Diffy look like something.** A link shared in a chat or a post now shows a title, a short description and a picture.
- **A clearer message when Diffy can't start.** It now names the likeliest cause: a browser that needs updating.
- **The licence, stated exactly.** GNU AGPL, version 3 only. What you export from Diffy is yours.
- Help now says where to find ways to support Diffy.

## 1.0.0

The first release.
