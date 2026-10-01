---
name: new-deck
description: NNN GAMES의 새 웹 발표자료, 회사 소개, 제안서 또는 강연 덱을 공통 런타임으로 작성한다. 새 덱, 제안서 웹 슬라이드, 발표자료 만들어줘 요청에 사용한다. 기존 덱 수정은 update-deck을 사용한다.
---

# 새 웹 덱 작성

루트 `AGENTS.md`, `decks/README.md`를 읽는다. 청중·목적·주제·자료가 이미 제공됐으면 그 정보로 진행한다. 결과를 결정하는 정보가 빠진 경우만 질문하고, 확인된 자료로 할 수 있는 원고·구조 작업은 이어간다. 단순 골격 생성 때문에 추가 승인을 요구하지 않는다.

## 원고와 화면

- 참고할 프로젝트 계획은 `docs/projects/<slug>/`, 원고·디자인·이미지 프롬프트는 `docs/decks/<deck-slug>/`에 둔다.
- 슬라이드별 주장, 근거, 시각 자료, 청중의 다음 행동을 정한다. 사실과 수치는 제공된 자료 또는 확인한 출처를 사용한다. 지표에는 출처 파일과 기준일을 기록한다.
- 슬라이드의 밀도와 구성은 내용에 맞춘다. 생성 골격의 3장 구성을 완성 덱의 분량으로 고정하지 않는다.

## 생성 하네스

```bash
npm run deck:new -- <deck-slug> --title "덱 제목" --langs ko,en --audience publisher
```

이 명령은 `decks/<slug>/index.html`, `slides.js`, `deck.css`, `assets/`, 원고 폴더와 레지스트리의 draft 항목을 만든다. 중복 slug·공유 URL·기존 파일을 거부한다. 생성된 문구는 작성 안내이며, 제목은 입력값이 각 언어에 들어가므로 실제 원고와 번역으로 교체한다.

- 공통 런타임은 `../slides/shared/deck.js`, 공통 CSS는 `../slides/shared/deck.css`. 런타임 사본을 만들지 않는다.
- 마크업의 `data-slide`와 `window.DECK_SLIDES`의 id·순서를 일치시킨다. 문구는 `DECK_I18N`과 `data-deck-key`, 이미지 alt는 `data-deck-key-alt`를 사용한다.
- 언어 버튼·레지스트리 languages·번역 사전을 맞추고 제공할 모든 언어의 본문을 번역한다. 누락된 번역을 한국어 복사로 완료 처리하지 않는다.
- 스타일은 해당 덱 `deck.css`에 쓴다. 시각 표현은 기존 회사·프로젝트 자산을 우선 재사용하고, 새 이미지가 필요하면 가용 이미지 생성 스킬을 사용한다. 실제 사진·실적 자료와 콘셉트 이미지를 구분한다.
- 공통 자산은 `../assets/...`, 발표 전용 자산은 `assets/...`. 자료 출처는 저장소 경로 기준으로 기록한다.
- 기본 draft를 유지한다. 공개 상태 전환 요청이 포함됐으면 그 요청에 따라 `archive-deck` 절차를 적용한다.

## 완료 검증

```bash
npm run check
npm run agent:smoke -- --pages /<deck-slug>/
npm run export:deck -- <deck-slug> --lang ko
```

초안도 별도 임시 빌드로 검사·내보내기 가능하다. smoke 보고서와 모든 변경 슬라이드의 언어별·모바일 PNG를 직접 확인한다. 요청한 전달 형식이 PDF면 생성 PDF도 확인한다. 원고·출처·완료한 번역·검증·결과 파일을 보고하고 `decks/README.md`와 관련 문서 목록을 갱신한다.
