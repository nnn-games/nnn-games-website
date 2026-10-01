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
- 프로젝트·커뮤니티 지표는 `npm run update:metrics`로 갱신한다. 메타·집계 플래그는 편집할 수 있지만 수집 수치는 손으로 변경하지 않는다. 규칙은 `docs/site/metric.md`를 따른다.
- 발표에 수치를 인용하면 출처와 기준일을 함께 기록한다. 실행 시 최신 값으로 바꾸는 기능을 임의로 추가하지 않는다.
- 공유 자산의 이름 변경·삭제는 홈페이지와 발표 참조를 함께 확인한다. 웹 이미지는 압축하고 발표 전용 이미지는 해당 발표 폴더에 둔다.
- 개인정보 처리방침은 법무 검토 없이 수정하지 않는다. 과거 보관 자료는 요청 범위에 포함된 경우에만 수정한다.
- 기존 전역 객체 기반 브라우저 코드와 Node CommonJS 구조를 유지한다. 구조 정리만으로 프레임워크·모듈 체계를 교체하지 않는다.
- 응답·코드 주석은 한국어, 파일은 UTF-8. 기존 파일의 들여쓰기·줄 끝을 유지하고 불필요한 전체 재포맷을 하지 않는다.

## 검증과 문서

`npm run check`를 실행한다. 화면을 바꾸면 변경한 화면에서 언어 전환·모바일·슬라이드 동작을 확인하고 필요 시 `npm run snapshot` 또는 `npm run export:deck`을 사용한다. 구조만 변경하면 배포 경로·산출물·문서 참조가 유지되는지 확인한다.

기능 변경은 `docs/site/prd.md`, 개발 기록은 `docs/development-roadmap.md`, 프로젝트·발표 기획은 해당 `docs/projects/`·`docs/decks/` 문서에 반영한다. 과거 설계 문서의 구현 설명은 당시 기록이며 현재 파일 구조는 루트 README를 우선한다.

역할별 파일 안내는 `.claude/agents/site.md`·`decks.md`, 반복 작업은 `.claude/skills/`를 참고한다. 이는 작업 위치를 찾기 위한 안내이며 사용자의 명시적 요청과 1인 개발 흐름이 우선한다. `.ai/rule.md`는 이 문서로 연결된다.

배포·지표 갱신·PR 스크린샷·발표 내보내기·정기 점검 워크플로는 `.github/workflows/`에 있다. 의존성 추가, 외부 메시지 전송, 파괴적 Git 작업은 요청 범위를 확인한다. 브랜치·커밋을 만들 때는 기존 저장소 관례를 따르며 사용자 변경을 덮어쓰지 않는다.
