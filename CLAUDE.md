# NNN GAMES 웹사이트 — 에이전트 작업 지침

TripleN Games(NNN GAMES)의 정적 회사 홈페이지와 웹 슬라이드 덱을 한 저장소에서 관리한다.
GitHub Pages(`www.triplengames.com`)로 배포되며, 빌드 도구 없이 저장소 루트가 그대로 서비스된다.

## 1. 두 가지 역할

| 역할 | 담당 범위 | 정의 파일 |
| --- | --- | --- |
| `site` | 회사 홈페이지, 프로젝트 목록/상세, 프로젝트·커뮤니티 지표 데이터 | `.claude/agents/site.md` |
| `decks` | 회사 소개 및 프로젝트 소개용 웹 슬라이드 | `.claude/agents/decks.md` |

작업을 시작하면 먼저 어느 역할인지 판단하고 해당 정의 파일을 따른다. 두 영역에 걸치는 작업은 사용자에게 확인한 뒤 진행한다.

## 2. 저장소 지도

```
site 영역
  index.html, projects-roblox.html, contact.html   메인 페이지
  <slug>.html (11개)                                프로젝트 상세 셸 (본문은 JS가 렌더)
  js/                                                전역 객체 기반 스크립트 (ES 모듈 아님)
    utils.js, i18n.js, main.js, projects-data.js, project-renderer.js
    project-detail.js                                운영 중 프로젝트 상세 렌더러
    project-detail-development.js                    개발 중 프로젝트 상세 렌더러
    project-details/<slug>.js                        프로젝트별 콘텐츠 설정 (KO/EN/JA)
  src/styles/tailwind.css  ->  css/style.css         Tailwind @apply 소스 -> 빌드 결과물(커밋 대상)
  data/projects.json, data/communities.json          지표 데이터 (스크립트가 갱신)
  data/community-groups.json                         커뮤니티 집계 설정 (사람이 편집)
  scripts/update-metrics.js                          Roblox API 지표 수집
  docs/, plan/                                       PRD, 가이드라인, 로드맵, 페이지별 계획서

decks 영역
  slides/shared/deck.js, deck.css                    공용 덱 런타임 (jumpstart 사용)
  company/, nnn/                                     회사 소개 덱 (각자 deck.js 사본 보유, 통합 예정)
  jumpstart/                                         프로젝트 제안 덱
  각 덱: index.html(슬라이드 마크업) + slides.js(순서, DECK_I18N) + deck.css(덱 전용 스타일)

공유 자산
  images/, assets/<project>/                         이미지 (양쪽에서 참조)
  tailwind.config.js                                 브랜드 색상·폰트 정의
  data/*.json                                        decks 는 읽기 전용

손대지 않는 곳
  _archive/                                          보관용, 수정 금지
  privacy/                                           법무 검토 없이 수정 금지
  CNAME                                              도메인 설정
```

## 3. 소유권 규칙

- `site` 에이전트는 decks 영역을, `decks` 에이전트는 site 영역을 수정하지 않는다.
- `data/projects.json`, `data/communities.json`의 수치는 `npm run update:metrics`로만 갱신한다. 손으로 숫자를 고치지 않는다. 프로젝트 메타(제목, 링크, 플래그)는 편집 가능하다.
- decks 는 지표를 하드코딩하지 않는다. 슬라이드에 방문 수 등을 넣을 때는 `data/projects.json` 값을 인용하고 갱신일(`metrics.updatedAt`)을 함께 적는다.
- `images/`, `assets/`에 새 파일을 넣을 때: 웹용 압축(JPEG/WebP), 가로 1200px 이하 권장, 2MB 이하. PDF 등 대용량 파일은 추가하지 않는다(2단계에서 Git LFS 이전 예정).
- 헤더/푸터는 14개 HTML에 복제되어 있다. 공통 UI를 바꿀 때는 `index.html`을 기준으로 모든 페이지에 동일하게 반영하고 `npm run check`로 확인한다.

## 4. 공통 규칙

- 응답과 코드 주석은 한국어. 파일 인코딩은 UTF-8.
- 다국어 텍스트는 KO/EN/JA를 항상 함께 추가한다. 사이트는 `js/i18n.js` + `data-key` 속성, 덱은 각 덱 `slides.js`의 `DECK_I18N` + `data-deck-key` 속성. `npm run check:i18n`이 누락을 잡는다.
- 최소 침습 원칙: 요청 범위 밖 기능 추가 금지. 사용자가 되돌린 변경을 재도입하지 않는다.
- 파괴적 git 명령(`reset --hard`, force push, 브랜치 삭제)은 사용자 확인 후에만 실행한다.
- 서드파티 스크립트 추가 금지(Google Fonts 제외). 외부 API 호출은 `scripts/update-metrics.js` 안에서만 한다.
- 개인정보: 이메일, 주소, 사업자번호 외 PII를 추가하지 않는다. 폼을 도입할 때는 사용자와 먼저 상의한다.
- 코드 스타일: `js/`, HTML, CSS는 4칸 들여쓰기, `scripts/`와 설정 파일은 2칸. 줄 끝(CRLF/LF)은 기존 파일을 따른다. 파일 전체 재포맷은 하지 않고 수정한 줄만 고친다.
- 브랜치는 `site/<topic>`, `decks/<topic>`으로 만들고 main에 직접 커밋하지 않는다. 커밋 메시지 접두어: `site:`, `decks:`, `data: metrics YYMMDD`, `chore:`.

## 5. 검증 명령

| 명령 | 내용 |
| --- | --- |
| `npm run dev` | `http://localhost:8080` 로컬 서버. `fetch()`가 `file://`에서 동작하지 않으므로 화면 확인은 반드시 서버로 한다 |
| `npm run check` | `check:i18n` + `check:links` + `check:data` + `lint`. 커밋 전 필수 |
| `npm run check:i18n` | i18n 키 KO/EN/JA 일치, HTML `data-key`/`data-deck-key` 존재 여부 |
| `npm run check:links` | HTML, CSS, JSON, 상세 설정 파일의 내부 링크·에셋 경로 존재 여부 |
| `npm run check:data` | `data/*.json` 스키마와 집계 규칙 일치 |
| `npm run lint` | ESLint |
| `npm run format` | Prettier 검사(변경하지 않음). `format:write`는 사용자 요청 시에만 |
| `npm run build:css` | Tailwind 빌드. `src/styles/tailwind.css`를 수정했으면 반드시 실행하고 `css/style.css`를 함께 커밋 |
| `npm run update:metrics` | Roblox API로 지표 갱신 |

작업 완료 기준: `npm run check` 통과, `npm run dev`로 변경 페이지를 열어 KO/EN/JA 전환과 모바일 폭(768px 미만) 확인, 결과 요약에 실행한 검증 명령을 명시.

## 6. 문서 동기화

- 기능이 완료되면 `docs/prd.md`에 반영하고, 진행 계획은 `docs/development_roadmap.md`를 갱신한다.
- `docs/guideline.md`와 `docs/prd.md` 일부는 존재하지 않는 파일명(`get-train.html`, `legendary-dj-gear.html`, `reset-tower.html`)을 언급한다. 실제 파일 목록이 우선한다.
- `.ai/rule.md`는 이 문서로 대체되었다.

## 7. 개발환경 로드맵

1. 완료: 에이전트 컨텍스트, 역할 정의, 검증 스크립트 (이 문서)
2. 예정: `dist/` 빌드 + GitHub Actions(지표 스케줄 갱신, CSS 빌드, Pages 배포), `css/style.css` 추적 해제
3. 예정: `site/`, `decks/`, `shared/` 디렉터리 재배치
4. 예정: 덱 런타임 3벌 통합, 상세 렌더러 2개 통합, 헤더/푸터 템플릿화
