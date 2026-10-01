---
name: decks
description: 회사 소개·외부 강연·제안 발표자료를 수정할 때 참고하는 파일 안내.
tools: Read, Edit, Write, Grep, Glob, Bash
---

# 발표자료 작업 안내

루트 `CLAUDE.md`와 `README.md`를 따른다. 1인 개발 흐름에서 필요한 연관 파일은 함께 수정하고 검증한다.

## 작업 위치

- 발표 목록·상태: `decks/decks.json`
- 실행 코드: `decks/<slug>/index.html`, `slides.js`, `deck.css`
- 발표용 이미지: `decks/<slug>/assets/` (기존 jumpstart는 `img/`)
- 공통 런타임·렌더러: `decks/shared/`
- 원고·기획·디자인 원본: `docs/decks/<slug>/`
- 프로젝트 참고 자료: `docs/projects/<slug>/`
- 인용 데이터·공통 이미지: `shared/data/`, `shared/assets/`, `shared/images/`

상태는 `active`(배포), `draft`(dev에서만 확인), `archived`(제외)만 사용한다. 발표자료는 모두 noindex이며 사이트맵에서 제외한다.

## 수정·검증

`index.html`의 `data-slide` 마크업과 `slides.js`의 `DECK_SLIDES` 순서를 맞춘다. 문구는 `DECK_I18N`에 두고 `data-deck-key` 속성으로 연결한다. 언어는 레지스트리·언어 버튼·번역 사전에서 일치해야 한다.

모든 발표는 `decks/shared/deck.js`를 사용한다. 동적 슬라이드는 `DECK_RENDERERS` 훅으로 연결한다. 회사 소개 렌더러는 `decks/shared/company-renderers.js`에 있다. 로드 순서는 `slides.js` → 선택 렌더러 → 공통 `deck.js`다.

공통 런타임의 배포 주소는 `/slides/shared/`, 각 발표의 주소는 `/<slug>/`다. 자산 경로는 배포 주소 기준으로 쓰고 소스 폴더명을 붙이지 않는다.

수치를 인용하면 데이터 출처와 기준일을 기록한다. 원고·이미지 프롬프트는 실행 코드 폴더가 아닌 `docs/decks/<slug>/`에 둔다.

`npm run dev`에서 슬라이드 이동·언어·모바일·인쇄를 확인하고 `npm run check`를 실행한다. 전달용 PDF·PNG는 `npm run export:deck -- <slug>`로 생성한다. 공통 런타임 수정 시 기존 발표를 함께 확인한다.

반복 작업은 `.claude/skills/`의 `new-deck`, `update-deck`, `archive-deck`, `export-deck`을 참고한다.
