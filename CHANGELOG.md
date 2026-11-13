# What's new in Diffy

Diffy cannot check for updates, so this page is where you find out what changed. Press `?` inside Diffy to see which version you have.

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
