# 개발 로드맵 (NNN GAMES 랜딩 페이지)
오늘부터 진행할 개발 계획과 진행 상황을 기록하는 문서다. 완료된 기능/콘텐츠는 검증 후 `docs/prd.md`에 반영한다.

## 1. 운영 원칙
- PR 기반 변경, 1인 리뷰. PR 요약에 변경·테스트·리스크·스크린샷 포함.
- i18n·접근성·CTA 링크·외부 링크(UTM/추적) 확인을 기본 체크리스트로 유지.
- 완료 → 검증 → `docs/prd.md` 업데이트 순서 준수.

## 2. 진행 현황 요약
- 현재 상태: 정적 웹사이트(다국어 KO/EN/JA) + 프로젝트 카드 동적 렌더 + 모바일 내비/지연 로딩 구현.
- 주요 우선순위: 프로젝트 필터/정렬 연결, CTA 정확도, SEO/분석 기초, 문의 흐름 개선.

## 3. 일정 개요 
- 모든 개발 일정은 수요가 발생한 즉시 진행할 계획이므로 특별한 사유가 있지 않은 한 목표 일정을 수립하지 않는다.

## 4. 작업 보드 (수시 업데이트)
| ID | 항목 | 상태 | 산출물/링크 |
| --- | --- | --- | --- |
| N-02 | 히어로 섹션 하단에 현재 운영중인 커뮤니티 포탈 기능 개발. 커뮤니티는 계속 추가될 예정이며 각 커뮤니티의 인원을 공개 API를 이용해 가져와 합산하여 섹션에 잘 보이게 표시. `npm run update:metrics` 시 `data/communities.json`으로 정적 데이터 생성, 프런트는 JSON 우선 사용 후 API 폴백 | Completed | `index.html`, `js/i18n.js`, `js/main.js`, `src/styles/tailwind.css`, `scripts/update-metrics.js`, `data/communities.json` |
| N-03 | 인라인 스타일 제거 후 Tailwind 공용 적용 | Completed | `tower-flood-race.html`, `js/main.js` |
| N-04 | CTA 추적 엔드포인트/스키마 확정 및 적용 | Completed | `js/main.js`, `docs/prd.md` |
| N-05 | 히어로/커뮤니티 집계 규칙을 status/flag 기반으로 명시화 | Completed | `data/projects.json`, `data/community-groups.json`, `data/communities.json`, `js/projects-data.js`, `js/main.js`, `scripts/update-metrics.js`, `docs/metric.md`, `docs/dev_plan.md` |
| N-06 | 에이전트 기반 개발환경 1단계: 루트 `CLAUDE.md`, 역할별 에이전트(site/decks), 스킬(add-project/refresh-metrics/new-deck), 검증 스크립트(`npm run check`: i18n/links/data/lint), ESLint/Prettier/EditorConfig, 로컬 서버(`npm run dev`) | Completed | `CLAUDE.md`, `.claude/`, `scripts/check-*.js`, `eslint.config.js`, `package.json` |
| N-07 | 개발환경 2단계: `npm run build` 로 `dist/` 조립(sitemap/robots 포함), GitHub Actions 로 main 푸시 시 검증·빌드·Pages 배포, 매일 12:00 KST 지표 자동 갱신 커밋, `css/style.css` 추적 해제 | Completed | `scripts/build.js`, `.github/workflows/deploy.yml`, `.github/workflows/metrics.yml`, `robots.txt` |
| N-08 | 개발환경 3단계: 소스를 `site/`(홈페이지), `decks/`(슬라이드), `shared/`(data/images/assets) 로 재배치. 빌드가 배포 URL 구조로 매핑하므로 소스 내부 상대 경로와 서비스 URL 은 그대로 유지. `npm run dev` 가 dist 감시 서비스, `check:links` 는 dist 기준 검사 | Completed | `scripts/build.js`, `scripts/check-*.js`, `site/`, `decks/`, `shared/` |
| N-10 | 에이전트 운영 1단계: 표시 순서를 `projects.json`의 `order`로 이동, `detailRenderer` 예외 필드, `check:data` 상태별 규칙(order 유일성, 상태↔렌더러, 중단 시 featured 금지, launchDate 형식), 스킬 `activate-project`/`update-project`/`retire-project` 추가 | Completed | `shared/data/projects.json`, `site/js/project-renderer.js`, `scripts/check-data.js`, `.claude/skills/` |
| N-11 | 에이전트 운영 2단계: `decks/decks.json` 레지스트리(slug·제목·대상·status·언어·연결 프로젝트) 도입, 빌드 MAP·sitemap 이 레지스트리에서 덱을 읽음, `check:data` 레지스트리 검사, `check:i18n` 언어 일치, 스킬 `update-deck`/`archive-deck` 추가, `new-deck` 은 등록 방식으로 변경 | Completed | `decks/decks.json`, `scripts/build.js`, `scripts/check-data.js`, `scripts/check-i18n.js`, `.claude/skills/` |
| N-12 | 에이전트 운영 3단계: PR 미리보기 아티팩트, `export-deck`(Playwright 스크린샷·PDF) | Pending | - |
| N-09 | 개발환경 4단계: 덱 런타임 통합, 상세 렌더러 통합, 헤더/푸터 템플릿화 | Pending | - |
