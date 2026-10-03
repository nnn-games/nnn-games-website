# NNN GAMES 웹사이트

회사 홈페이지와 외부 회의·강연용 웹 발표자료를 함께 개발하는 정적 사이트입니다.

## 시작하기

```bash
npm install
npm run dev    # 홈페이지 + 발표자료(초안 포함), http://localhost:8080
npm run check  # 빌드·번역·링크·데이터·코드·배포 상태 검사
```

작업 후 `main`에 푸시하면 기존 GitHub Actions가 검증하고 GitHub Pages에 자동 배포합니다. 홈페이지와 발표자료를 한 번에 빌드하고 배포합니다.

## 어디를 수정하면 되나요?

| 작업 | 파일 위치 |
| --- | --- |
| 홈페이지 화면 | `site/*.html` |
| 헤더·푸터·공통 head | `site/_partials/` |
| 홈페이지 동작·번역·스타일 | `site/js/`, `site/styles/tailwind.css` |
| 프로젝트 상세 내용 | `site/js/project-details/<slug>.js` |
| assets 프로젝트 정보·다국어 상세·발표 소개 | `shared/assets/www-<프로젝트>/content.json` — [전체 목록](docs/projects/asset-content.md) |
| 프로젝트·커뮤니티 정보 | `shared/data/` |
| 프로젝트 이미지·공통 로고 | `shared/assets/<project>/`, `shared/images/` |
| 발표 내용·디자인 | `decks/<slug>/index.html`, `slides.js`, `deck.css` |
| 발표 공통 기능 | `decks/shared/` |
| 홈페이지 기획·개발 문서 | [docs/site/](docs/site/README.md) |
| 프로젝트별 기획·참고 이미지 | [docs/projects/](docs/projects/README.md) |
| 발표 원고·기획·디자인 원본 | [docs/decks/](docs/decks/README.md) |

## 폴더 구조

```text
site/          회사 홈페이지 코드, 스타일, CNAME·robots.txt
  _partials/   공통 마크업
  js/          동작·번역·프로젝트 상세 내용
  styles/      Tailwind 소스
  privacy/     개인정보 처리방침

decks/         발표자료 코드와 발표용 이미지
  decks.json   발표 목록·상태
  shared/      공통 슬라이드 런타임
  company-intro/  신규 회사 소개 (본편 13장·부록 4장 초안)
  company/     보관된 회사 소개 (2026-08)
  nnn/         보관된 회사 소개 (2026-07)
  jumpstart/   프로젝트 제안

shared/        양쪽에서 사용하는 데이터·이미지·프로젝트 자산
docs/          기획·원고·참고 자료 (배포하지 않음)
  site/        홈페이지 기획·규칙
  projects/    프로젝트별 계획서·참고 이미지
  decks/       발표별 원고·디자인 원본
scripts/       빌드·검증·지표·내보내기 도구
_archive/      과거 소스 보관
dist/          자동 생성되는 배포 결과
exports/       스크린샷·PDF·점검 결과
tmp/           임시 작업 파일 (Git 제외)
```

기획과 원본은 `docs/`, 실제 화면에서 사용하는 파일은 `site/`, `decks/`, `shared/`에 둡니다. 공통 자산은 그대로 재사용하고, 발표에만 쓰는 이미지는 해당 발표 폴더에 둡니다.

`shared/assets`의 프로젝트 13개는 `www-<프로젝트>/content.json`에 이미지와 다국어 콘텐츠를 함께 관리합니다. `project`는 카드 정보·링크, `detail`은 KO/EN/JA 상세·SEO, `presentations`는 발표별 문구입니다. 운영 설정·지표는 기존 레지스트리에 유지하고 빌드가 카드·SEO·발표 번역을 생성합니다. 미등록·보관 자산은 `catalogOnly`로 구분하여 홈페이지에 자동 추가하지 않습니다. 전체 폴더 매핑과 편집 방법은 [자산·콘텐츠 관리 안내](docs/projects/asset-content.md)를 참고하세요.

## 발표자료 관리

ASMR UGC Town에도 같은 JSON 구조를 적용했습니다. 원본은 `shared/assets/www-asmr-ugc-town/content.json`이며, 대표·프리뷰·갤러리 3장도 같은 폴더에 있습니다. [편집 안내](docs/projects/asmr-ugc-town/README.md)를 참고하세요.

`decks/decks.json`의 `status` 하나만 관리합니다.

- `active`: 자동 배포합니다.
- `draft`: `npm run dev`에서 확인하고 운영 빌드에서는 제외합니다.
- `archived`: 개발 화면과 운영 빌드에서 제외합니다.

발표자료는 모두 검색과 사이트맵에서 제외합니다. 공개 주소 접근을 제한하는 기능은 아닙니다. 상세 구조는 [decks/README.md](decks/README.md)를 참고합니다.

## 필요한 명령

| 명령 | 용도 |
| --- | --- |
| `npm run dev` | 변경을 감시하며 홈페이지와 발표자료 개발 |
| `npm run check` | 커밋 전 전체 검증 |
| `npm run build` / `npm run serve` | 운영 배포 결과 생성 / 로컬 확인 |
| `npm run update:metrics` | 프로젝트·커뮤니티 지표 갱신 |
| `npm run snapshot` | 주요 화면 스크린샷 → `exports/site/` |
| `npm run export:deck -- company-intro --lang ko` | 초안 발표 PNG·PDF → `exports/decks/` |
| `npm run audit` | 점검 보고서 → `exports/audit/` |

스크린샷·PDF 도구는 최초 한 번 `npx playwright install chromium`이 필요합니다. Windows의 지표 갱신·빌드 도우미는 `scripts/update-metrics-and-build.bat`입니다.

지표는 매일 CI에서 갱신합니다. 수동 조정 시 `shared/data/projects.json`의 `reporting.*`와 `shared/data/community-groups.json`의 노출·집계 설정을 수정한 뒤 `npm run update:metrics`를 실행합니다. 집계 기준은 [지표 문서](docs/site/metric.md)를 참고합니다.

## 경로와 배포

소스 폴더와 배포 주소의 매핑은 `scripts/build.js`가 처리합니다. HTML·JS·CSS·JSON 안의 자산 경로는 **배포 주소 기준**입니다.

- `site/` → `/`
- `shared/data/`, `shared/images/`, `shared/assets/` → `/data/`, `/images/`, `/assets/`
- `decks/<slug>/` → `/<slug>/`
- `decks/shared/` → `/slides/shared/`

사이트와 운영 중 발표의 주소, 자동 배포 방식은 유지합니다. 보관한 발표의 주소는 개발·운영 빌드에서 404가 됩니다. 배포 설정은 `.github/workflows/`, 도메인·검색 설정은 `site/CNAME`·`site/robots.txt`에 있습니다. 빌드 결과와 내보내기 결과는 커밋하지 않습니다.

작업 지침은 [AGENTS.md](AGENTS.md), 문서 목록과 개발 기록은 [docs/README.md](docs/README.md)를 참고합니다.

## 에이전트로 개발하기

OpenAI 공식 자료를 기준으로 구성한 [에이전트 개발환경](docs/agent-development.md)에는 홈페이지·덱 작업용 공용 스킬 12개와 준비·생성·브라우저 검증 하네스가 있습니다. Codex와 Claude가 같은 지침과 스킬을 사용합니다.

```bash
npm run agent:setup                 # 새 환경: lockfile 설치·Chromium·빌드·진단
npm run agent:doctor                # 환경 확인
npm run agent:smoke -- --pages /,/company-intro/  # 다국어·모바일·슬라이드·화면 증거
npm run deck:new -- proposal --title "제안서" --langs ko,en
npm run agent:check                 # 정적·회귀·환경·실제 브라우저 전체 검증
```

덱 골격은 draft로 등록됩니다. 초안도 `agent:smoke`와 `export:deck`에서 운영 상태를 바꾸지 않고 확인할 수 있습니다. 두 명령은 별도 임시 빌드를 사용하며 보고서·이미지·PDF는 `exports/`에 생성됩니다.
