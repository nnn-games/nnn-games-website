# NNN GAMES 웹사이트 작업 지침

회사 홈페이지와 외부 회의·강연용 발표자료를 한 저장소에서 관리한다. 1인 개발의 편의성을 우선하며, 개발 서버·빌드·검증·배포는 하나로 유지한다. 사용자가 요청한 작업에 필요한 연관 파일은 함께 수정하고 검증한다. 폴더 경계를 이유로 별도 승인 절차를 추가하지 않는다.

## 빠른 시작

- 작업 위치와 명령은 루트 `README.md`를 먼저 참고한다.
- `npm run dev`: 홈페이지와 발표자료(초안 포함)를 `http://localhost:8080`에서 개발한다.
- `npm run check`: 빌드·번역·링크·데이터·ESLint·발표 상태 회귀 검증. 커밋 전 실행한다.
- `main`에 푸시하면 기존 GitHub Actions가 `dist/`를 GitHub Pages에 자동 배포한다.
- 요청 범위 밖 기능이나 별도 공개 설정·배포 단계를 추가하지 않는다.

## 저장소 구조

| 위치 | 내용 |
| --- | --- |
| `site/` | 홈페이지 HTML·JS·스타일·개인정보 처리방침·CNAME·robots.txt |
| `site/_partials/` | 공통 head·헤더·푸터 |
| `site/js/project-details/` | 프로젝트별 상세 콘텐츠 |
| `decks/<slug>/` | 발표 HTML·슬라이드 데이터·스타일·웹 이미지 |
| `decks/decks.json` | 발표 목록과 status |
| `decks/shared/` | 공통 런타임과 회사 소개 렌더러 |
| `shared/data/`, `images/`, `assets/` | 공통 프로젝트·커뮤니티 데이터와 웹 자산 |
| `docs/site/` | 홈페이지 PRD·규칙·지표 기준 |
| `docs/projects/<slug>/` | 프로젝트 기획·참고 자료 |
| `docs/decks/<slug>/` | 발표 원고·기획·디자인 원본 |
| `docs/development-roadmap.md` | 전체 개발 기록 |
| `scripts/` | 빌드·검증·수집·내보내기 도구 |
| `_archive/` | 과거 소스 보관 |
| `dist/`, `exports/`, `tmp/` | 자동 생성 결과·내보내기·임시 작업 (Git 제외) |

`site/`, `decks/`, `shared/`에는 화면에서 실제 사용하는 파일을 둔다. 기획·원고·이미지 프롬프트·디자인 원본은 `docs/`에서 관리한다. 문서를 실행 코드 폴더에 다시 분산시키지 않는다.

## 경로와 발표 상태

빌드 매핑은 `scripts/build.js`가 정의한다. 소스 폴더를 옮겨도 배포 주소는 유지한다.

- `site/` → `/` (`site/CNAME`, `site/robots.txt` 포함)
- `shared/data/`, `shared/images/`, `shared/assets/` → `/data/`, `/images/`, `/assets/`
- `decks/<slug>/` → `/<slug>/`
- `decks/shared/` → `/slides/shared/`

HTML·JS·CSS·JSON의 자산 경로는 배포 주소 기준이다. 홈페이지는 `assets/...`, 발표는 `../assets/...` 또는 `assets/...`를 사용한다. 원고·문서 참조는 실제 저장소 경로 기준이다.

발표는 `status` 하나로 관리한다. `active`는 배포, `draft`는 dev에서만 확인, `archived`는 제외한다. 발표자료는 모두 noindex이며 사이트맵에서 제외한다. 새 발표는 `decks/decks.json`에 등록하고 공통 런타임을 사용한다.

## 수정 기준

- 홈페이지 공통 UI는 `site/_partials/` 한 곳에서 수정한다. 페이지의 include 마커를 유지한다.
- 홈페이지 스타일은 `site/styles/tailwind.css`에서 수정한다. `dist/css/style.css`는 빌드 결과이며 커밋하지 않는다. Tailwind 스캔은 홈페이지 파일만 대상으로 한다.
- 프로젝트 메타·표시 순서·링크는 `shared/data/projects.json`, 상세 카피는 `site/js/project-details/<slug>.js`에서 수정한다.
- Hunt a Slime은 `shared/assets/www-hunt-a-slime/content.json`에서 카드 정보·링크·KO/EN/JA 상세·SEO·발표 소개를 관리한다. 운영 상태·표시 순서·노출·수집 설정·지표는 기존 `shared/data/projects.json`에 유지한다. 상세 JS는 JSON 로더, 초기 SEO·카드 데이터·발표 번역은 빌드 산출물이다. 필드 안내는 `docs/projects/hunt-a-slime/README.md`를 따른다.
- 프로젝트·커뮤니티 지표는 `npm run update:metrics`로 갱신한다. 메타·집계 플래그는 편집할 수 있지만 수집 수치는 손으로 변경하지 않는다. 규칙은 `docs/site/metric.md`를 따른다.
- 발표에 수치를 인용하면 출처와 기준일을 함께 기록한다. 실행 시 최신 값으로 바꾸는 기능을 임의로 추가하지 않는다.
- 공유 자산의 이름 변경·삭제는 홈페이지와 발표 참조를 함께 확인한다. 웹 이미지는 압축하고 발표 전용 이미지는 해당 발표 폴더에 둔다.
- 개인정보 처리방침은 법무 검토 없이 수정하지 않는다. 과거 보관 자료는 요청 범위에 포함된 경우에만 수정한다.
- 기존 전역 객체 기반 브라우저 코드와 Node CommonJS 구조를 유지한다. 구조 정리만으로 프레임워크·모듈 체계를 교체하지 않는다.
- 응답·코드 주석은 한국어, 파일은 UTF-8. 기존 파일의 들여쓰기·줄 끝을 유지하고 불필요한 전체 재포맷을 하지 않는다.

## 검증과 문서

`npm run check`를 실행한다. 화면을 바꾸면 변경한 화면에서 언어 전환·모바일·슬라이드 동작을 확인하고 필요 시 `npm run snapshot` 또는 `npm run export:deck`을 사용한다. 구조만 변경하면 배포 경로·산출물·문서 참조가 유지되는지 확인한다.

기능 변경은 `docs/site/prd.md`, 개발 기록은 `docs/development-roadmap.md`, 프로젝트·발표 기획은 해당 `docs/projects/`·`docs/decks/` 문서에 반영한다. 과거 설계 문서의 구현 설명은 당시 기록이며 현재 파일 구조는 루트 README를 우선한다.

역할별 파일 안내는 `.claude/agents/site.md`·`decks.md`, 반복 작업은 `.agents/skills/`를 참고한다. 이는 작업 위치를 찾기 위한 안내이며 사용자의 명시적 요청과 1인 개발 흐름이 우선한다. `CLAUDE.md`와 `.ai/rule.md`는 이 문서로 연결된다.

배포·지표 갱신·PR 스크린샷·발표 내보내기·정기 점검 워크플로는 `.github/workflows/`에 있다. 의존성 추가, 외부 메시지 전송, 파괴적 Git 작업은 요청 범위를 확인한다. 브랜치·커밋을 만들 때는 기존 저장소 관례를 따르며 사용자 변경을 덮어쓰지 않는다.

## 에이전트 하네스와 스킬

- 새 환경·워크트리: `npm run agent:setup` (lockfile 설치·Chromium·빌드·진단). 기존 의존성을 유지하려면 `-- --skip-install`.
- 환경 진단: `npm run agent:doctor`.
- 실제 브라우저 검증: `npm run agent:smoke -- --pages /,/company/`. 기본은 KO/EN/JA와 1280·390·320px이며 덱은 등록된 언어만 검사한다.
- 새 덱 골격: `npm run deck:new -- <slug> --title "제목" --langs ko,en`. 기본 draft이며 기존 파일과 레지스트리 항목을 덮어쓰지 않는다.
- `npm run agent:check`: 기존 전체 검증 + 하네스 회귀 테스트 + 환경 진단 + 브라우저 검증.
- 화면 변경은 해당 경로로 smoke를 실행하고 생성된 PNG를 직접 확인한다. 오류 보고서는 `exports/agent/<실행>/report.json`. 하네스는 임시 빌드와 임의 포트를 사용해 실행 중인 dev와 운영 dist를 건드리지 않는다.
- 공통 런타임·UI를 바꾸면 관련 사이트·덱을 함께 검증한다. 새 덱·초안도 smoke에 포함된다. 보관 덱은 제외된다.
- 홈페이지 UI·다국어·상세 렌더러: `.agents/skills/site-development/SKILL.md`. 프로젝트 등록·수정·상태 변경은 해당 프로젝트 스킬을 사용한다.
- 덱 작성·수정·상태·내보내기: `new-deck`, `update-deck`, `archive-deck`, `export-deck`. 화면 회귀 검증과 오류 재현은 `browser-qa`.
- OpenAI 제품·Codex 설정 작업은 `openaiDeveloperDocs` MCP로 공식 문서를 검색한 뒤 원문을 읽는다. 일반 사이트 콘텐츠 작업에서는 필요할 때만 사용한다.
- 여러 단계가 이어지는 작업은 `docs/agent-plans.md`의 형식으로 `tmp/plans/`에 진행 상태·결정·검증을 기록한다. 간단한 수정에는 계획 파일을 만들 필요가 없다.
- 설정·명령·출처·사용 예시는 `docs/agent-development.md`를 참고한다.

## Code Review Rules

- 변경으로 기존 홈페이지·발표의 공유 URL이나 active/draft/archived 배포 정책이 깨지는지 확인한다. 초안이 운영 산출물에 포함되면 오류다.
- 공통 UI·렌더러 변경이 다른 언어·페이지·덱을 깨뜨리거나, 지표 인용에서 출처·기준일이 사라지는지 확인한다.
- 데이터 경로가 소스 폴더 기준으로 바뀌거나 수집 지표가 수동으로 덮어써지면 오류다. 형식·lint 문제는 자동 검사에 맡긴다.
