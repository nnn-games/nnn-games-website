# ASMR UGC Town 상세 페이지 작업 계획

> 2026-09-30 사용자 제공 게임 설명을 바탕으로 표준 상세 페이지를 완성합니다. 개발 중 상태와 기존 출시 예정 월은 유지합니다.
> 본문·카드·SEO·이미지 대체 텍스트는 KO / EN / JA를 함께 제공합니다. 언어별 전체 문구는 콘텐츠 설정 파일을 기준으로 합니다.

- **slug**: `asmr-ugc-town`
- **HTML**: `site/asmr-ugc-town.html`
- **콘텐츠 원본**: `shared/assets/www-asmr-ugc-town/content.json`
- **상세 로더**: `site/js/project-details/asmr-ugc-town.js`
- **운영 설정·지표**: `shared/data/projects.json` (id: `asmr-ugc-town`)

## JSON 편집 방법 (2026-10-03)

이미지와 텍스트를 `shared/assets/www-asmr-ugc-town/`에서 함께 관리합니다. Hunt a Slime에 적용한 JSON 연결을 재사용합니다.

| JSON 위치 | 수정 내용 |
| --- | --- |
| `project` | 카드 제목·설명, 프리뷰 이미지, 상세 주소, 카테고리·플랫폼·클라이언트·기술 스택·출시 일정·링크 |
| `detail` | KO/EN/JA SEO·히어로·개요·핵심 포인트·요약·특징·대표 이미지·갤러리 3장과 alt |
| `presentations.company-intro` | 회사 소개의 프로젝트 제목·요약·이미지 alt (KO/EN/JA) |

홈페이지 문구는 필드별 `{ "ko": "한국어", "en": "English", "ja": "日本語" }`, 발표 문구는 언어별 키 사전으로 관리합니다. 이미지 경로는 `assets/www-asmr-ugc-town/...`를 사용합니다. 빌드가 기존 `/data/projects.json`의 카드 데이터와 초기 SEO를 생성하고, 회사 소개의 `{{project:asmr-ugc-town:image}}`를 프리뷰 이미지로 바꾸며 발표 번역을 합칩니다. 상세 로더는 같은 JSON의 `detail`을 읽습니다.

운영 상태·featured·pinned·order·placeId·universeId·reporting·metrics는 기존 레지스트리에서 관리합니다. 지표는 수집 스크립트로만 갱신합니다. 같은 정보의 중복 정의와 누락 번역은 검증으로 검사합니다.

검증 명령: `npm run check`, `npm run agent:smoke -- --pages /,/projects-roblox.html,/asmr-ugc-town.html,/company-intro/`.

## 1. 메타와 표시 방식

- category / platform: roblox / Roblox
- status: development
- detailRenderer: standard (기존 공통 상세 레이아웃 사용)
- featured / pinned / order: true / true / 20
- launchDate: 2026-10 (예정)
- client / technologies: 미정. 상세에서는 다국어로 미정·추후 공개 표시.
- placeId / universeId / 외부 링크: 미등록
- reporting: 기존 값 유지. 지표 수집·히어로 집계 제외.
- 카드: `assets/www-asmr-ugc-town/asmr-ugc-town-preview.jpg`
- 상세·OG: `assets/www-asmr-ugc-town/asmr-ugc-town-main.jpg`

## 2. 게임 소개와 SEO

- 게임 정의: ASMR 장애물이 있는 마을을 탐험하고, 수집한 재화와 재료를 무료 UGC 아이템으로 교환하는 Roblox 캐주얼 Obby.
- 핵심 재미: ASMR 요소와 상호작용하는 쾌감, 다양한 재료를 모으는 재미, 실제 Roblox UGC 아이템으로 교환하는 성취감.
- 장르: 캐주얼 Obby · ASMR · 수집.
- 히어로: 제목, 한 줄 소개, 개발 중·출시 예정 배지, 장르, 플랫폼, 프로젝트 목록 복귀 버튼.
- SEO: description / keywords / OG / Twitter를 본문과 일치시킴. HTML 초기 메타는 한국어, 런타임 메타는 선택 언어에 맞춰 전환.
- 확인되지 않은 재료 종류·교환 조건·보상 수량·이벤트·게임 링크는 추가하지 않음.

## 3. 본문 구성

- **개요**: 마을 탐험과 ASMR 장애물 상호작용, 재화·재료 수집에서 무료 UGC 교환으로 이어지는 흐름을 두 문단으로 소개.
- **핵심 포인트 3개**: ASMR Play / Explore & Collect / Free UGC.
- **프로젝트 정보**: 2026년 10월 출시 예정, 개발 중, Roblox, 클라이언트 미정, 기술 스택 추후 공개.
- **특징 4개**: 마을 탐험형 캐주얼 Obby, 다양한 ASMR 장애물, 재화와 재료 수집, 무료 UGC 아이템 교환.
- **관련 링크**: 공통 렌더러의 준비 중 안내 사용. 외부 링크 등록 전에는 플레이 버튼을 표시하지 않음.
- **갤러리**: 기존 이미지 3장을 연결하고 장면별 대체 텍스트를 KO/EN/JA로 제공.

## 4. 갤러리

| 경로 (배포 URL 기준) | 장면 |
| --- | --- |
| `assets/www-asmr-ugc-town/asmr-ugc-town-gallery-1.jpg` | 키보드 길 위의 버터·젤리 장애물과 캐릭터들 |
| `assets/www-asmr-ugc-town/asmr-ugc-town-gallery-2.jpg` | 마을 위에 떠 있는 버터 모양 발판 |
| `assets/www-asmr-ugc-town/asmr-ugc-town-gallery-3.jpg` | 알록달록한 젤리 발판의 공중 장애물 코스 |

## 5. 작업 이력

- 2026-09-29: 사용자 요청으로 이름 기반 임시 소개와 콘셉트 이미지를 등록. 생성 프롬프트는 `project-concept-image-prompts.json`에 보관.
- 2026-09-30: 사용자 제공 게임 설명으로 임시 소개를 교체. FREE UGC RNG 등 기존 프로젝트의 표준 상세 구성을 적용하고 현재 등록된 이미지들을 연결. 홈·목록 카드와 SEO를 세 언어로 동기화.

## 6. 검증

- `npm run check` 통과 (빌드·번역 키·링크·데이터·ESLint).
- `npm run snapshot -- --pages /asmr-ugc-town.html --lang <ko|en|ja> --out exports/site/asmr-ugc-town/<lang>`: 1280px / 390px 스크린샷 총 6장 생성 및 화면 확인.
- Playwright: KO/EN/JA × 1280px / 390px / 320px에서 본문·상태·SEO 전환, 이미지 4장 로딩, 모바일 메뉴, 가로 넘침 없음, 목록 복귀·상세 재진입 확인. 브라우저 JS 오류 없음.
- 홈·프로젝트 목록 카드의 KO/EN/JA 설명·이미지·상세 링크 확인.
- 상세 콘텐츠의 다국어 필드 35개에 KO/EN/JA 값 존재 확인. 카드 설명·렌더러 외 프로젝트 데이터 및 지표 불변 확인.
- 검증 기록: `exports/site/asmr-ugc-town/verification.json`. 영어·일본어 문구는 사용자 검토용 번역 초안.
