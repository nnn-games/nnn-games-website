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

## 운영 방법

`decks.json`의 `status` 하나만 관리합니다.

- `active`: 홈페이지와 함께 자동 배포됩니다.
- `draft`: `npm run dev`에서만 확인하며 운영 빌드에는 포함되지 않습니다.
- `archived`: 개발 화면과 운영 빌드 모두에서 제외됩니다.

발표자료는 모두 `noindex, nofollow`를 적용하고 사이트맵에서 제외합니다. 기존 발표 주소는 유지합니다. 검색 제외는 주소 접근을 제한하지 않습니다.

평소에는 `npm run dev`로 작업하고 `main`에 푸시하면 기존 자동 배포가 진행됩니다. 발표 준비가 끝나면 `status`를 `active`로 바꾸면 됩니다. `npm run build`와 `npm run serve`는 운영 결과를 확인할 때 사용합니다. 스냅샷과 PDF 내보내기는 active 덱을 대상으로 합니다.

기획·원고·디자인 원본은 [docs/decks/](../docs/decks/README.md)에 모읍니다. 실제 웹 화면에서 사용하는 파일만 이 폴더에 둡니다.
