# NNN GAMES 웹사이트 — 에이전트 작업 지침

TripleN Games(NNN GAMES)의 정적 회사 홈페이지와 웹 슬라이드 덱을 한 저장소에서 관리한다.
`main` 에 푸시하면 GitHub Actions 가 검증·빌드 후 `dist/`를 GitHub Pages(`www.triplengames.com`)에 배포한다.

## 1. 두 가지 역할

| 역할 | 담당 범위 | 소유 디렉터리 | 정의 파일 |
| --- | --- | --- | --- |
| `site` | 회사 홈페이지, 프로젝트 목록/상세, 프로젝트·커뮤니티 지표 데이터 | `site/`, `shared/data/`(스크립트 경유), `docs/`, `plan/` | `.claude/agents/site.md` |
| `decks` | 회사 소개 및 프로젝트 소개용 웹 슬라이드 | `decks/` | `.claude/agents/decks.md` |

작업을 시작하면 먼저 어느 역할인지 판단하고 해당 정의 파일을 따른다. 반복 작업은 `.claude/skills/`의 스킬을 쓴다: 프로젝트 `add-project`/`activate-project`/`update-project`/`retire-project`/`refresh-metrics`, 덱 `new-deck`/`update-deck`/`archive-deck`/`export-deck`, 점검 `audit-site`. 두 영역에 걸치는 작업(공유 에셋 변경, 빌드 매핑 변경)은 사용자에게 확인한 뒤 진행한다.

## 2. 저장소 지도와 배포 매핑

소스는 역할별로 나뉘어 있지만 **서비스 URL 은 예전 단일 루트 구조 그대로**다. `scripts/build.js`의 `MAP`이 소스 → `dist/` 매핑을 정의하고, 덱 항목은 `decks/decks.json`에서 자동으로 추가된다.

```
소스                                  배포 URL            설명
site/                                 /                   홈페이지 (site 소유)
  index.html, projects-roblox.html, contact.html          메인 페이지
  <slug>.html (11개)                                      프로젝트 상세 셸 (본문은 JS가 렌더)
  _partials/head-common.html, header.html, footer.html    공통 마크업. 페이지의 `<!-- @include … -->` 마커에 빌드가 인라인 (배포 안 함)
  js/                                                     전역 객체 기반 스크립트 (ES 모듈 아님)
    utils.js, i18n.js, main.js, projects-data.js, project-renderer.js
    project-detail.js                                     상세 렌더러 하나. status/detailRenderer 로 standard·development 모드 선택
    project-details/<slug>.js                             프로젝트별 콘텐츠 설정 (KO/EN/JA)
  styles/tailwind.css                 /css/style.css      Tailwind @apply 소스 (빌드가 생성, 배포 안 함)
  privacy/                            /privacy/           법무 검토 없이 수정 금지
shared/                                                   공유 자산 (site 가 관리, decks 는 읽기 전용)
  data/projects.json, communities.json   /data/           지표 데이터 (CI 가 매일 갱신)
  data/community-groups.json          /data/             커뮤니티 집계 설정 (사람이 편집)
  images/, assets/<project>/          /images, /assets    이미지 (양쪽에서 참조)
decks/                                                    슬라이드 (decks 소유)
  decks.json                                              덱 레지스트리: slug, 제목, 대상, status(active/draft/archived), 언어, 연결 프로젝트. 빌드 MAP 과 sitemap 이 이걸 읽는다
  shared/deck.js, deck.css            /slides/shared/     공용 덱 런타임 (모든 덱이 사용). data-deck-render 훅 제공
  shared/company-renderers.js         /slides/shared/     회사 소개 덱의 커스텀 슬라이드 렌더러 (아바타·연혁·수상·UGC)
  company/, nnn/                      /company/, /nnn/    회사 소개 덱 (nnn 은 7월 버전)
  jumpstart/                          /jumpstart/         프로젝트 제안 덱
  각 덱: index.html + slides.js(DECK_SLIDES, DECK_I18N) + deck.css + assets|img/. pdf/ 는 배포·커밋하지 않음 (export-decks 워크플로로 생성)
scripts/                                                  빌드·검증·지표 (배포 안 함)
  build.js                                                MAP 대로 dist/ 조립, Tailwind 빌드, sitemap/.nojekyll 생성, --watch/--serve
  check-i18n.js, check-links.js, check-data.js            검증
  update-metrics.js                                       Roblox API 지표 수집
docs/, plan/                                              PRD, 가이드라인, 로드맵, 계획서 (배포 안 함)
tailwind.config.js                                        브랜드 색상·폰트 (양쪽 공용)
CNAME, robots.txt                     /                   그대로 배포
.github/workflows/deploy.yml                              main 푸시 시 check(빌드 포함) → Pages 배포
.github/workflows/metrics.yml                             매일 12:00 KST 지표 갱신 커밋 후 deploy 호출
_archive/                                                 보관용, 수정·배포 안 함
dist/                                                     빌드 산출물 (git 추적 안 함)
```

**경로 작성 규칙:** HTML/JS/CSS/JSON 안의 상대 경로는 소스 위치가 아니라 **배포 구조 기준**으로 쓴다. 예: `site/index.html`은 `css/style.css`, `images/...`를 쓰고, `decks/jumpstart/index.html`은 `../slides/shared/deck.js`, `../images/...`를 쓴다. `site/`, `shared/`, `decks/`를 경로에 붙이지 않는다. 새 덱은 `decks/decks.json`에 등록하면 되고, 그 밖의 새 최상위 디렉터리는 `build.js`의 `MAP`에 추가한다.

## 3. 소유권 규칙

- `site` 에이전트는 `decks/`를, `decks` 에이전트는 `site/`와 `shared/`를 수정하지 않는다.
- `shared/data/projects.json`, `communities.json`의 수치는 `npm run update:metrics`(CI 가 매일 실행)로만 갱신한다. 손으로 숫자를 고치지 않는다. 프로젝트 메타(제목, 링크, 플래그)는 site 가 편집한다.
- decks 는 지표를 하드코딩하지 않는다. 슬라이드에 방문 수 등을 넣을 때는 `shared/data/projects.json` 값을 인용하고 갱신일(`metrics.updatedAt`)을 함께 적는다.
- `shared/images/`, `shared/assets/`에 새 파일을 넣을 때: 웹용 압축(JPEG/WebP), 가로 1200px 이하 권장, 2MB 이하. 이름 변경·삭제는 덱 링크도 깨질 수 있으므로 `npm run check`로 확인한다. PDF 등 대용량 파일은 추가하지 않는다(기존 PDF 는 이후 단계에서 Git LFS 로 이전 예정).
- 헤더/푸터/공통 head 는 `site/_partials/`에 한 벌만 있다. 페이지에는 `<!-- @include header active="home|projects|contact" -->`, `<!-- @include footer -->`, `<!-- @include head-common -->` 마커만 둔다. 공통 UI 는 파셜만 고치고, 페이지 안에 헤더/푸터를 다시 복사하지 않는다.
- `scripts/build.js`의 `MAP`과 워크플로 파일을 바꿀 때는 사용자에게 먼저 알린다.

## 4. 공통 규칙

- 응답과 코드 주석은 한국어. 파일 인코딩은 UTF-8.
- 다국어 텍스트는 KO/EN/JA를 항상 함께 추가한다. 사이트는 `site/js/i18n.js` + `data-key` 속성, 덱은 각 덱 `slides.js`의 `DECK_I18N` + `data-deck-key` 속성. `npm run check:i18n`이 누락을 잡는다.
- 최소 침습 원칙: 요청 범위 밖 기능 추가 금지. 사용자가 되돌린 변경을 재도입하지 않는다.
- 파괴적 git 명령(`reset --hard`, force push, 브랜치 삭제)은 사용자 확인 후에만 실행한다.
- 서드파티 스크립트 추가 금지(Google Fonts 제외). 외부 API 호출은 `scripts/update-metrics.js` 안에서만 한다.
- 개인정보: 이메일, 주소, 사업자번호 외 PII를 추가하지 않는다. 폼을 도입할 때는 사용자와 먼저 상의한다.
- 코드 스타일: `site/`, `decks/`의 HTML/JS/CSS는 4칸 들여쓰기, `scripts/`와 설정 파일은 2칸. 줄 끝(CRLF/LF)은 기존 파일을 따른다. 파일 전체 재포맷은 하지 않고 수정한 줄만 고친다.
- 브랜치는 `site/<topic>`, `decks/<topic>`으로 만들고 main에 직접 커밋하지 않는다. 커밋 메시지 접두어: `site:`, `decks:`, `data: metrics YYMMDD`, `chore:`.

## 5. 검증 명령

| 명령 | 내용 |
| --- | --- |
| `npm run dev` | `dist/` 빌드 → `site/ shared/ decks/` 변경 감시 → `http://localhost:8080` 서비스. 화면 확인은 반드시 이걸로 한다 (`fetch()`가 `file://`에서 동작하지 않음) |
| `npm run check` | `build` + `check:i18n` + `check:links` + `check:data` + `lint`. 커밋 전 필수. CI 도 같은 명령을 실행한다 |
| `npm run build` | `dist/` 조립 + Tailwind 빌드 + sitemap. 배포 대상 누락 여부를 확인할 때 쓴다 |
| `npm run check:i18n` | `site/js/i18n.js` KO/EN/JA 일치, `site/*.html` `data-key` 존재, 덱 `DECK_I18N`·언어 버튼·슬라이드 id 일치 |
| `npm run check:links` | **dist/ 기준**으로 HTML/CSS/JSON/상세 설정의 내부 링크·에셋 경로 존재 여부. 빌드가 먼저 필요 |
| `npm run check:data` | `shared/data/*.json` 스키마, 집계 규칙, `order` 유일성, 상태↔렌더러 일치, 상태별 규칙(중단 프로젝트는 featured 불가 등), `decks/decks.json` 레지스트리(디렉터리·런타임·언어·연결 프로젝트) |
| `npm run lint` | ESLint (`site/`, `decks/`, `scripts/`) |
| `npm run format` | Prettier 검사(변경하지 않음). `format:write`는 사용자 요청 시에만 |
| `npm run update:metrics` | Roblox API로 지표 갱신. 평소에는 CI 가 매일 실행하므로 수동 실행은 요청이 있을 때만 |
| `npm run snapshot` | 주요 페이지(홈·목록·문의·상세 2개·덱 표지)를 데스크톱/모바일로 스크린샷 → `exports/site/`. 화면 변경 검증과 PR 미리보기에 쓴다. 최초 1회 `npx playwright install chromium` |
| `npm run export:deck` | 덱을 슬라이드별 PNG·언어별 PDF 로 → `exports/decks/`. 저장소에 커밋하지 않는다 |
| `npm run optimize:images -- <files> [--update-refs <dir>]` | 이미지를 WebP 로 재인코딩(선택: `--max-width`), 참조 갱신과 원본 삭제까지. 2MB 초과 이미지 조치에 쓴다 |
| `npm run audit` | 정기 점검 보고서 → `exports/audit/`. 지표 신선도, 외부 링크, 번역 누락 의심, 덱 수치 대조, 에셋 위생. CI 가 매주 월요일 실행해 `audit` 라벨 이슈로 올린다 |

작업 완료 기준: `npm run check` 통과, `npm run dev` 또는 `npm run snapshot`으로 변경 페이지를 KO/EN/JA 와 모바일 폭(768px 미만)에서 확인, 결과 요약에 실행한 검증 명령을 명시. 화면이 바뀐 작업은 스크린샷을 첨부한다.

## 6. 배포

- `main` 푸시 → `deploy.yml`: `npm ci` → `npm run check`(빌드 포함) → `dist/`를 Pages 에 업로드. 검증이 실패하면 배포되지 않는다.
- 매일 12:00 KST → `metrics.yml`: 지표 갱신 → `check:data` → 변경이 있으면 `data: metrics YYMMDD` 커밋을 main 에 푸시하고 `deploy.yml`을 호출한다. 수동 실행은 `gh workflow run metrics.yml`.
- 저장소 Settings > Pages > Source 는 **GitHub Actions** 다 (2026-09-07 전환 완료).
- PR 을 열면 `preview.yml`이 검증 후 `dist` 와 스크린샷을 아티팩트로 올리고 PR 에 요약 코멘트를 남긴다. 사용자는 이 코멘트로 검토한다.
- 덱 파일 전달은 `export-decks.yml`(수동 실행) 아티팩트로 한다. PDF 를 저장소에 커밋하지 않는다.
- 매주 월요일 10:00 KST → `audit.yml`: 점검 보고서를 `audit` 라벨 이슈로 생성·갱신한다. 조치는 `audit-site` 스킬의 매핑표를 따른다.
- 배포 실패는 Actions 로그를 읽고 원인을 보고한다.

## 7. 문서 동기화

- 기능이 완료되면 `docs/prd.md`에 반영하고, 진행 계획은 `docs/development_roadmap.md`를 갱신한다.
- `docs/guideline.md`와 `docs/prd.md`의 경로 표기는 배포 URL 기준이고 일부는 존재하지 않는 파일명(`get-train.html` 등)을 언급한다. 실제 파일 목록이 우선한다.
- `.ai/rule.md`는 이 문서로 대체되었다.

## 8. 개발환경 로드맵

1. 완료: 에이전트 컨텍스트, 역할 정의, 검증 스크립트
2. 완료: `dist/` 빌드 + GitHub Actions(지표 스케줄 갱신, CSS 빌드, Pages 배포)
3. 완료: `site/`, `decks/`, `shared/` 디렉터리 재배치 (빌드 매핑으로 URL·상대 경로 유지)
4. 완료: 덱 런타임을 `decks/shared/deck.js` 하나로 통합(회사 덱 렌더러는 `company-renderers.js`로 분리), 상세 렌더러를 `project-detail.js` 하나로 통합, 헤더/푸터/공통 head 를 `site/_partials/`로 템플릿화, 덱 PDF(80MB) 저장소에서 제거(복구: `git checkout 11c6257 -- decks/company/pdf decks/jumpstart/pdf`)
