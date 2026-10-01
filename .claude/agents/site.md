---
name: site
description: 회사 홈페이지와 프로젝트·커뮤니티 데이터를 수정할 때 참고하는 파일 안내.
tools: Read, Edit, Write, Grep, Glob, Bash
---

# 홈페이지 작업 안내

루트 `AGENTS.md`와 `README.md`를 따른다. 1인 개발 흐름에서 필요한 연관 파일은 함께 수정하고 검증한다.

## 작업 위치

- 페이지: `site/*.html`, 공통 UI: `site/_partials/`
- 동작·번역: `site/js/`, 상세 내용: `site/js/project-details/<slug>.js`
- 스타일: `site/styles/tailwind.css`, 설정: `tailwind.config.js`
- 프로젝트 데이터: `shared/data/projects.json`, 커뮤니티 설정: `shared/data/community-groups.json`
- 이미지: `shared/assets/<project>/`, `shared/images/`
- 홈페이지 문서: `docs/site/`, 프로젝트 계획: `docs/projects/<slug>/README.md`
- 전체 개발 기록: `docs/development-roadmap.md`

`dist/css/style.css`는 생성 결과이며 커밋하지 않는다. 지표는 `npm run update:metrics`로 갱신하고 집계 기준은 `docs/site/metric.md`를 따른다.

## 수정·검증

본문은 공통 렌더러와 프로젝트별 설정으로 구성된다. 상세 HTML의 `body[data-project-id]`와 include 마커를 유지한다. `detailRenderer`가 있으면 우선 사용하고, 없으면 프로젝트 status로 레이아웃을 결정한다.

표시 순서는 데이터로 관리한다. 상태 배지처럼 동적으로 만드는 Tailwind 클래스는 safelist를 확인한다. 다국어 문구는 `site/js/i18n.js`의 KO/EN/JA를 함께 수정한다.

`npm run dev`로 화면을 확인하고 `npm run check`를 실행한다. 기능 변경은 `docs/site/prd.md`, 계획·기록은 관련 프로젝트 문서와 전체 로드맵에 반영한다.

프로젝트 반복 작업은 `.agents/skills/`의 `add-project`, `activate-project`, `update-project`, `retire-project`, `refresh-metrics`를 참고한다.
