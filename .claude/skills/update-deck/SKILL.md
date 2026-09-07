---
name: update-deck
description: 기존 웹 슬라이드 덱의 슬라이드 추가·삭제·순서 변경, 문구·이미지·테마 수정, 지표 인용 갱신을 처리한다. DECK_SLIDES·마크업·DECK_I18N 세 곳의 일치와 언어별 문구를 강제한다. "슬라이드 추가", "덱 문구 수정", "슬라이드 순서 바꿔줘", "덱에 최신 수치 반영" 요청에 사용.
---

# 덱 수정 절차

인자: `$ARGUMENTS` (덱 slug 와 바꿀 내용)

## 0. 사전 확인
- `decks/decks.json`에서 대상 덱의 `status`, `languages`, `runtime`, `project`를 확인한다. `archived` 덱을 고치려면 먼저 `/archive-deck`으로 되살릴지 사용자에게 묻는다.
- `decks/<slug>/index.html`의 `data-slide` 목록과 `slides.js`의 `DECK_SLIDES`를 읽어 현재 슬라이드 순서를 표로 정리한다.
- 덱을 내리거나 올리는 요청은 `/archive-deck`으로 안내한다. 새 덱은 `/new-deck`.

## 1. 어디를 고치는지

| 바꿀 것 | 파일 |
| --- | --- |
| 슬라이드 순서·부록 여부·테마 | `slides.js`의 `DECK_SLIDES` (마크업 순서도 같이 맞춘다) |
| 슬라이드 추가/삭제 | `index.html`의 `<section class="slide" data-slide="<id>" data-theme="…">` + `DECK_SLIDES` + `DECK_I18N` 문구 키 |
| 문구 | `slides.js`의 `DECK_I18N` (`languages`에 있는 모든 언어). 마크업은 `data-deck-key`로만 바인딩하고 하드코딩하지 않는다 |
| 이미지 | `decks/<slug>/assets/` 또는 `img/`에 추가, `alt`는 `data-deck-key-alt`. 프로젝트 이미지는 `shared/assets/<project>/`를 `../assets/...`로 재사용 |
| 덱 전용 스타일 | `decks/<slug>/deck.css`. 공용 동작 변경은 `decks/shared/`이며 사용자에게 먼저 알린다 |
| 제목·대상·언어 메타 | `decks/decks.json` (`title`, `audience`, `languages`, `note`) |
| 지표 인용 | `shared/data/projects.json`·`communities.json`에서 읽어 문구에 반영하고 갱신일을 함께 적는다. 데이터 파일은 수정하지 않는다 |

## 2. 규칙
- 새 슬라이드 id 는 kebab-case, 기존 id 와 중복 금지. `DECK_SLIDES` 순서 = 마크업 순서.
- 문구 키를 추가하면 `languages`의 모든 언어에 넣는다. 번역이 없으면 KO 문구를 넣고 보고에 "번역 필요"로 표시한다.
- 언어를 추가하려면 `DECK_I18N` 블록, `index.html`의 `data-lang` 버튼, `decks.json`의 `languages` 세 곳을 함께 바꾼다. `check:i18n`이 셋의 일치를 검사한다.
- `company`와 `nnn`은 자체 `deck.js` 사본을 쓴다. 런타임 동작을 바꿔야 하면 어느 파일을 고칠지 사용자에게 먼저 알린다.
- 파일 전체 재포맷 금지. 수정한 줄만 바꾼다. 기존 캐시 버스터(`slides.js?v=YYYYMMDD-n`)가 있으면 값을 올린다.

## 3. 검증
```
npm run check
npm run dev      # http://localhost:8080/<slug>/  ← → 이동, #<slide-id> 딥링크, 언어 전환, 전체화면, 모바일 폭, 인쇄 미리보기
```

## 보고
변경한 슬라이드 id, 추가·변경한 문구 키와 번역 필요 여부, 변경 파일, 실행한 검증. 브랜치 `decks/update-<slug>`, 커밋 접두어 `decks:`.
