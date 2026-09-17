# Slide decks

Every deck is registered in `decks/decks.json` (slug, title, audience, status, languages, linked project). The build copies and lists decks from that registry, so adding or archiving a deck never touches `scripts/build.js`.

`decks/shared/` (served at `/slides/shared/`) contains the presentation runtime and the responsive 16:9 shell shared by all decks. It owns navigation, deep links (`#/<n>`), language selection (`?lang=`), fullscreen mode, accessibility state, mobile handling, and print output (`@page 1280x720`).

Each deck keeps only page-specific concerns in its own directory:

```text
decks/decks.json        # registry: slug, title, audience, status (active/draft/archived), languages, runtime, project
decks/company/
  index.html            # route entry: /company/
  slides.js             # DECK_SLIDES (order, appendix flags, renderer data) + DECK_I18N (KO/EN/JA copy)
  deck.css              # deck-specific styles
  assets/
decks/nnn/              # route entry: /nnn/ (2026-07 version of the company deck, same structure)
decks/jumpstart/
  index.html            # route entry: /jumpstart/
  slides.js
  deck.css
  img/
decks/shared/           # served at /slides/shared/ (see scripts/build.js)
  deck.css              # shared shell and temporary-slide layout
  deck.js               # shared controller. Hook: elements with data-deck-render="<name>" are rendered by
                        #   window.DECK_RENDERERS[name](target, slideData, ctx); ctx.onLanguage(fn) re-runs on language change
  company-renderers.js  # renderers used by company/ and nnn/ (avatars, eras, awards, ugcworks); load after slides.js, before deck.js
```

Script order in a deck page: `slides.js` → (optional renderers) → `../slides/shared/deck.js`.

Deck PDFs and slide images are not committed. Generate them with `npm run export:deck` or the `Export decks` workflow (artifact).

When final designs are ready, add page-specific styles beside the relevant page and assets under `decks/<slug>/assets/`. Keep interaction changes in `decks/shared/` only when they are intended to apply to every deck, and check all decks with `npm run export:deck -- --png-only` afterwards.
