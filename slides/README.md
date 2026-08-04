# New slide deck foundation

`slides/shared/` contains the presentation runtime and the responsive 16:9 shell shared by all new decks. It owns navigation, deep links, language selection, fullscreen mode, accessibility state, mobile handling, and print output.

Each deck keeps only page-specific concerns in its own directory:

```text
company/
  index.html       # route entry: /company/
  slides.js        # slide order, optional appendix flags, KO/EN/JA copy
jumpstart/
  index.html       # route entry: /jumpstart/
  slides.js        # slide order, optional appendix flags, KO/EN/JA copy
slides/shared/
  deck.css         # shared shell and temporary-slide layout
  deck.js          # shared controller
```

When final designs are ready, add page-specific styles beside the relevant page and assets under `company/assets/` or `jumpstart/assets/`. Keep interaction changes in `slides/shared/` only when they are intended to apply to every new deck.
