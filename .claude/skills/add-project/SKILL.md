---
name: add-project
description: 홈페이지에 새 Roblox 프로젝트를 추가한다. shared/data/projects.json 메타, site/<slug>.html 셸, site/js/project-details/<slug>.js 콘텐츠, 표시 순서, 에셋을 순서대로 만들고 검증한다. "프로젝트 추가", "새 게임 페이지", "상세 페이지 만들어줘" 요청에 사용.
---

# 프로젝트 추가 절차

인자: `$ARGUMENTS` (slug 와 프로젝트 정보. 없으면 사용자에게 slug, 상태, placeId/universeId, 링크를 묻는다)

## 0. 사전 확인
- slug 는 kebab-case, 기존 `shared/data/projects.json`의 `id`와 겹치지 않아야 한다.
- 상태가 `active`이면 `universeId`가 필요하다(지표 수집). 개발 중이면 `development`.
- `plan/<slug>.md` 계획서가 있으면 그 내용을 콘텐츠 원천으로 쓴다. 없으면 `plan/_template.md`를 복사해 먼저 채우고 사용자 확인을 받는다.

## 1. 에셋
- `shared/assets/<slug-without-dash>/`에 미리보기(`*-preview.jpg`), 메인(`*-main.jpg`), 갤러리 이미지를 넣는다. 가로 1200px 이하, 2MB 이하.

## 2. 데이터 (`shared/data/projects.json`)
- `all` 배열에 항목 추가. 기존 항목 하나를 복사해 필드 구조를 그대로 유지한다.
- 필수: `id`, `title{ko,en,ja}`, `description{ko,en,ja}`, `image`, `detailPage`, `category`, `status`, `featured`, `launchDate`, `platform`, `technologies`, `links{play,trailer,article,group,showcase}`, `reporting{collectMetrics,includeInHeroProjectCount,includeInHeroVisitTotal}`.
- `image`, `detailPage` 값은 배포 구조 기준(`assets/...`, `<slug>.html`)으로 적는다. `shared/`, `site/`를 붙이지 않는다.
- `metrics`는 비워 두고(`null` 값) `npm run update:metrics`가 채우게 한다. `summary.hero`도 스크립트가 다시 계산한다.

## 3. 상세 셸 HTML (`<slug>.html`)
- 상태가 `active`이면 `korean-spa.html`, `development`이면 `hacker-vs-security.html`을 복사한다(둘 다 최신 헤더 변형).
- `<title>`, meta description/keywords, OG/Twitter 메타, `body[data-project-id]`, `<script src="js/project-details/<slug>.js">`를 바꾼다.

## 4. 콘텐츠 설정 (`site/js/project-details/<slug>.js`)
- 같은 상태의 기존 파일을 복사해 `window.ProjectDetailConfigs['<slug>']`를 채운다. 모든 문구는 `{ko, en, ja}` 객체다.
- 운영 중: `seo`, `hero`, `ctaButtons`, `overview`, `highlights`, `snapshot`, `features`, `gallery`. 개발 중 렌더러는 필드가 다르므로 `project-detail-development.js`를 읽고 맞춘다.

## 5. 표시 순서
- `site/js/project-renderer.js`의 `projectDisplayOrder`에 slug 를 원하는 위치에 넣는다.

## 6. 검증
```
npm run update:metrics     # active 프로젝트일 때
npm run check
npm run dev                # /<slug>.html, /projects-roblox.html, / 확인
```
- KO/EN/JA 전환, 모바일 메뉴, CTA 링크(play/group), 갤러리 이미지 로딩을 확인한다.

## 7. 문서
- `docs/prd.md` 3장 상세 페이지 목록에 추가. `plan/README.md` 목록에 계획서 링크 추가.

## 보고
변경 파일 목록, 실행한 검증 명령, 사용자가 채워야 할 빈 값(링크, 이미지)을 적는다.
