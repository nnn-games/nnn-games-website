---
name: new-deck
description: decks/shared 공용 런타임을 사용하는 새 웹 슬라이드 덱을 decks/<slug>/ 에 만든다. 디렉터리, index.html 셸, slides.js(DECK_SLIDES, DECK_I18N), deck.css 를 생성하고 검증한다. "새 덱", "슬라이드 만들어줘", "제안서 웹 슬라이드" 요청에 사용.
---

# 새 덱 생성 절차

인자: `$ARGUMENTS` (덱 slug 와 주제. 없으면 사용자에게 slug, 대상 청중, 슬라이드 개요를 묻는다)

## 0. 사전 확인
- slug 는 kebab-case 디렉터리명이며 `decks/<slug>/` 에 만들고 URL 은 `/<slug>/` 가 된다. 배포 여부는 `decks/decks.json` 등록으로 결정되며 `scripts/build.js`는 건드리지 않는다. 기존 `company`, `nnn`, `jumpstart`와 겹치지 않아야 한다.
- 슬라이드 개요(제목, 순서, 테마)를 먼저 표로 사용자에게 확인받는다. 확인 전에는 파일을 만들지 않는다.

## 1. 디렉터리
```
<slug>/
  index.html     jumpstart/index.html 을 복사해 시작 (공용 런타임을 쓰는 유일한 최신 예시)
  slides.js      jumpstart/slides.js 구조를 따름
  deck.css       덱 전용 스타일 (비어 있어도 됨)
  assets/        이미지
```

## 2. index.html
- `<link rel="stylesheet" href="../slides/shared/deck.css">` 와 `<script src="../slides/shared/deck.js">`를 유지한다 (배포 시 `decks/shared` → `/slides/shared`). `deck.js` 사본을 만들지 않는다.
- 슬라이드마다 `<section class="slide" data-slide="<id>" data-theme="paper|dark|image" role="region" aria-roledescription="slide">`.
- 문구는 `data-deck-key="<key>"`, 이미지 alt 는 `data-deck-key-alt`, 버튼 라벨은 `data-deck-key-aria-label`.
- 아이콘 경로는 `../images/nnn-logo.png`.

## 3. slides.js
- `window.DECK_SLIDES = [{ id, theme, appendix? }, ...]` 순서가 마크업 순서와 같아야 한다.
- `window.DECK_I18N = { ko: {...}, en: {...}, ja: {...} }`. `ui_*` 키(페이지 제목, 이전/다음, 전체화면, 위치 표시)는 jumpstart 에서 복사한다.
- 모든 키를 세 언어에 넣는다. 번역이 준비되지 않았으면 KO 문구를 넣고 보고에 "번역 필요" 목록을 남긴다.

## 4. 레지스트리 등록 (`decks/decks.json`)
- `decks` 배열에 항목을 추가한다. 기존 항목을 복사해 구조를 맞춘다.
  - `slug`, `title{ko,en,ja}`(제목은 세 언어 모두), `audience`(partner/publisher/investor/internal/public), `status`(검토 중이면 `draft`, 공개 시 `active`), `languages`(DECK_I18N 과 언어 버튼에 있는 언어와 정확히 일치), `runtime: "shared"`, `project`(관련 프로젝트 id 또는 null), `note`.
- `check:data`가 디렉터리·런타임·언어·프로젝트 연결을 검사하고, 등록되지 않은 `decks/<dir>/`는 오류로 잡는다.

## 5. 데이터 인용
- 지표 숫자는 `shared/data/projects.json`, `shared/data/communities.json`에서 읽어 넣고 갱신일을 함께 적는다. 파일은 수정하지 않는다.

## 6. 검증
```
npm run check
npm run dev      # http://localhost:8080/<slug>/
```
- 키보드(← →), 해시 딥링크(`#<slide-id>`), 언어 전환, 전체화면, 모바일 폭, 인쇄 미리보기를 확인한다.

## 7. 문서
- `decks/README.md`의 덱 목록에 추가한다. 공개(`active`) 전환은 `/archive-deck`으로 처리한다.

## 보고
슬라이드 id 목록, 번역 필요 키, 사용자가 채워야 할 이미지 자리, 실행한 검증 명령을 적는다.
