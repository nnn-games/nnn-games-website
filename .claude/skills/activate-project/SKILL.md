---
name: activate-project
description: 개발 중(development) 프로젝트를 운영 중(active)으로 전환한다. universeId·reporting 플래그 설정, 상세 셸을 운영용 렌더러로 교체, 콘텐츠 설정을 운영용 필드로 보강, 표시 순서와 featured 결정, 지표 1회 갱신, 히어로 집계 변화 보고. "프로젝트 활성화", "출시 반영", "운영 중으로 바꿔줘" 요청에 사용.
---

# 프로젝트 활성화 절차

인자: `$ARGUMENTS` (slug, placeId/universeId, 출시일, 플레이/그룹 링크. 없으면 사용자에게 묻는다)

## 0. 사전 확인
- `shared/data/projects.json`에서 대상의 `status`가 `development`인지 확인한다. 이미 `active`면 중단하고 보고한다.
- `universeId`가 없으면 반드시 사용자에게 받는다. placeId 만 있으면 `https://apis.roblox.com/universes/v1/places/<placeId>/universe`로 조회할 수 있다고 안내하되, 조회는 사용자가 하거나 `scripts/update-metrics.js`에 위임한다(외부 호출은 그 스크립트 안에서만).
- 활성화 후 히어로 집계(프로젝트 수, 방문 수 합계)가 바뀐다. 전환 전 값을 `summary.hero`에서 기록해 둔다.

## 1. 데이터 (`shared/data/projects.json`)
- `status: "active"`, `launchDate`(YYYY-MM), `placeId`, `universeId`, `links.play`, `links.group` 설정.
- `reporting`: `collectMetrics: true`, `includeInHeroProjectCount: true`, `includeInHeroVisitTotal: true`. UGC처럼 방문 수 개념이 없는 프로젝트는 사용자와 상의해 히어로 플래그를 `false`로 둔다.
- `featured`: 홈 미리보기 노출 여부. 기본 `true`.
- `order`: 지표가 있는 운영 프로젝트는 동접·방문 수로 정렬되므로 `order`는 지표 없는 프로젝트 사이의 순서에만 쓰인다. 기존 값을 유지한다.
- `detailRenderer`가 있으면 제거한다(상태에서 유추). 운영용 렌더러를 쓰지 않는 예외만 `"standard"`/`"development"`를 명시.

## 2. 상세 셸 (`site/<slug>.html`)
- 스크립트는 바꾸지 않는다. `project-detail.js`가 `status: "active"`를 보고 표준 레이아웃으로 전환한다.
- `<title>`, meta description, OG 문구에 "개발 중/Coming soon" 표현이 있으면 출시 문구로 바꾼다.

## 3. 콘텐츠 설정 (`site/js/project-details/<slug>.js`)
- 개발 중 렌더러와 운영 렌더러는 필드가 다르다. `site/js/project-detail.js`가 읽는 필드(`seo`, `hero`, `ctaButtons`, `overview`, `highlights`, `snapshot`, `features`, `gallery`)를 같은 상태의 기존 파일(예: `korean-spa.js`)을 참고해 채운다.
- `hero.status`를 출시 문구로(예: `2026년 5월 출시 운영 중` / `Live since May 2026` / `2026年5月リリース・運営中`).
- `ctaButtons`에 `play`(플레이), `group`(그룹) CTA 를 넣는다. URL 은 `data-cta` 연동으로 `projects.json`의 `links`에서 동기화된다.
- 모든 문구는 KO/EN/JA.

## 4. 지표 갱신과 검증
```
npm run update:metrics
npm run check
npm run dev        # /<slug>.html, /projects-roblox.html, / 확인
```
- `check:data`가 렌더러·상태 일치, `order` 중복, 히어로 집계 재계산을 검사한다.
- 홈 히어로의 프로젝트 수·방문 수 합계가 예상대로 바뀌었는지, 카드에 방문/동접/즐겨찾기 배지가 나오는지 확인한다.

## 5. 문서
- `docs/prd.md`의 상세 페이지 목록에서 상태를 갱신한다.

## 보고
전환 전후 `summary.hero`(프로젝트 수, 방문 수 합계), 수집된 첫 지표, 변경 파일, 실행한 검증, 사용자가 채워야 할 빈 값을 표로 적는다. 브랜치 `site/activate-<slug>`, 커밋 접두어 `site:`.
