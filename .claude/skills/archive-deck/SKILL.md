---
name: archive-deck
description: 웹 슬라이드 덱의 배포 상태를 바꾼다. archived 로 내리면 빌드·sitemap 에서 빠지고 소스는 남는다. draft 는 배포되지만 sitemap 에 실리지 않고, active 는 정식 공개. "덱 내려줘", "덱 보관", "덱 다시 올려줘", "초안으로 공개" 요청에 사용.
---

# 덱 상태 전환 절차

인자: `$ARGUMENTS` (덱 slug 와 목표 상태 `active` / `draft` / `archived`, 사유)

## 상태 의미

| status | 빌드/배포 | sitemap | 용도 |
| --- | --- | --- | --- |
| `active` | 포함 | 포함 | 정식 공개 |
| `draft` | 포함 | 제외 | 링크를 아는 사람만 보는 검토용 |
| `archived` | 제외 (URL 이 404 가 됨) | 제외 | 종료·대체된 덱. 소스와 이력은 유지 |

## 0. 사전 확인
- `decks/decks.json`에서 현재 `status`를 확인한다.
- `archived`로 내릴 때는 URL(`/<slug>/`)이 404 가 된다는 점을 사용자에게 먼저 알린다. 외부에 공유된 링크가 있을 수 있는 덱(예: `nnn`)은 사용자가 대체 링크를 안내할지 결정한다.
- 대체 덱이 있으면(예: `nnn` → `company`) `note`에 적는다.

## 1. 데이터 (`decks/decks.json`)
- 대상 덱의 `status`를 바꾼다. `note`에 사유와 날짜, 대체 덱을 한 줄로 남긴다.
- 다른 필드와 `decks/<slug>/` 파일은 건드리지 않는다. 삭제는 하지 않는다(필요하면 사용자와 별도 상의).

## 2. 검증
```
npm run check
npm run dev
```
- 빌드 로그의 `덱 N개(...)` 목록에 대상이 의도대로 포함/제외됐는지 확인한다.
- `archived`: `http://localhost:8080/<slug>/`가 404 인지, `dist/sitemap.xml`에 없는지 확인.
- `draft`: 페이지는 200 이고 `dist/sitemap.xml`에는 없는지 확인.
- `active`: 페이지 200, sitemap 포함.

## 3. 문서
- `decks/README.md`의 덱 목록 표기와 `docs/development_roadmap.md`에 한 줄 남긴다.

## 보고
전환 전후 상태, 영향받는 URL, 대체 덱 안내 여부, 실행한 검증. 브랜치 `decks/<status>-<slug>`, 커밋 접두어 `decks:`.
