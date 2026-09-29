# NNN GAMES 웹사이트 및 Roblox 전문 스튜디오 PRD

> 2026-09 구조 변경: 홈페이지 소스는 `site/`, 덱은 `decks/`, 데이터·이미지·에셋은 `shared/` 아래에 있다. 이 문서의 경로 표기는 배포 URL 기준이며, 소스 위치와 매핑은 `scripts/build.js` 와 루트 `CLAUDE.md` 를 따른다.

본 문서는 현재 코드베이스(정적 웹사이트)에서 구현된 내용과 제공 가치에 기반해 작성되었으며, 향후 기능/콘텐츠 확장을 위한 기준 문서로 계속 업데이트한다.

## 1. 제품 개요
- **제품 목적**: Roblox 게임·UGC 전문 스튜디오 NNN GAMES의 역량, 진행/운영 중인 Roblox 프로젝트, 연락 채널을 명확히 전달하는 마케팅·세일즈용 웹사이트.
- **핵심 메시지**: Roblox 네이티브 제작력, 리텐션 중심 시스템/라이브옵스, 브랜드/수익을 연결하는 설계 역량.
- **운영 형태**: 정적 HTML/CSS/JS 기반 (파일 경로: `index.html`, `projects-roblox.html`, 개별 프로젝트 상세 페이지, `js/*.js`, `css/style.css`).

## 2. 주요 사용자와 목표
- **브랜드/파트너 담당자**: 협업·수주 문의, Roblox 제작 역량과 레퍼런스 확인 → `contact.html` 내 이메일/주소 노출.
- **플랫폼 운영사 및 투자자**: Roblox 제작·운영 경험, 수상/지표, 파이프라인 확인.
- **게이머/커뮤니티**: 개별 Roblox 프로젝트 플레이/체험 링크 확인.

## 3. 정보 구조 (현재 구현)
- **홈(`index.html`)**
  - Hero: Roblox 전문 스튜디오 메시지, CTA는 `projects-roblox.html`.
  - 커뮤니티 포털: `data/community-groups.json`에 정의된 활성 Roblox 그룹의 아이콘/멤버 수를 표시. `npm run update:metrics`가 `status/showOnHomepage/includeInHeroSubscriberTotal` 플래그 기준으로 `data/communities.json`을 생성/갱신하고, 프런트는 이 JSON을 우선 사용하며 실패 시 설정 JSON + Roblox 공개 API로 폴백한다. 각 링크는 Roblox share/community URL로 연결.
  - 프로젝트 프리뷰: `projects-data.js`의 featured 목록을 `project-renderer.js`로 동적 렌더.
- **프로젝트 목록(`projects-roblox.html`)**: 필터/검색 UI(카테고리/상태/검색) 적용, 카드 렌더.
- **프로젝트 상세**
  - 공통 HTML 셸과 `js/project-detail.js`, 프로젝트별 콘텐츠 설정으로 렌더합니다. 등록 페이지는 아래 프로젝트 파이프라인을 따릅니다.
  - Ducky Merge Farm [RNG], Star Reach는 2026-09-29 아카이브하여 사이트와 사이트맵에서 제외했습니다. 원본은 `_archive/projects/2026-09-29/`에 보관합니다.
- **문의(`contact.html`)**: 이메일, 주소, 사업자등록번호, 지도 iframe.
- **공통 UI**: 헤더/푸터, 모바일 메뉴 토글(`js/main.js`), 이미지 지연 로딩 및 스크롤 애니메이션, CTA 추적(sendBeacon 우선 → fetch 폴백, payload v/schema/cta/origin/projectId/href/text/viewport 포함). `meta[name="cta-endpoint"]`/전역 `window.CTA_CONFIG.endpoint`로 엔드포인트 오버라이드 가능, 기본 `/analytics/cta`, 스키마 버전은 `cta-schema-version` 메타 또는 전역 설정으로 덮어씀(기본 `v1`).

## 4. 데이터 및 렌더링 구조
- **데이터 소스**: `data/projects.json` (정적 JSON) + `js/projects-data.js` (fallback)
  - 필드: `id`, `title{ko,en,ja}`, `description{ko,en,ja}`, `image`, `detailPage`, `category`, `status(active/development/...)`, `launchDate`, `platform`, `client`, `technologies`, `featured`, `order`(표시 순서), `pinned`(상단 고정 여부), `detailRenderer`(선택, 렌더러 예외), `placeId`, `universeId`, `links{play,trailer,article,group,showcase}`, `reporting{collectMetrics,includeInHeroProjectCount,includeInHeroVisitTotal}`, `metrics{visits,playing,favorites,likeRatio,updatedAt}`, `summary.hero`.
- **렌더링**: `js/project-renderer.js`
  - JSON 로드 후 카드 동적 생성, 플랫폼/상태/카테고리 배지, 언어 변경 시 실시간 텍스트 교체, 목록 카드에 visits/playing/favorites 배지 노출.
- **상세 페이지 지표/링크 주입**: `js/main.js`
  - `renderHeaderMetrics()`로 상세 헤더에 방문자수·좋아요% 표시, `applyProjectLinks()`로 CTA URL을 프로젝트 데이터 기반으로 동기화.
- **상세 페이지 본문 렌더링**: `js/project-detail.js` + `js/project-details/*.js`
  - 프로젝트별 설정 파일에서 SEO, 히어로 카피, 개요, 핵심 포인트, 스냅샷, 특징, 링크, 갤러리를 읽어 공통 레이아웃으로 렌더.
- **커뮤니티 데이터**: 설정 JSON + 정적 JSON + 공개 API 폴백
  - 설정 소스: `data/community-groups.json` — `status`, `showOnHomepage`, `includeInHeroSubscriberTotal`, `names`, `url`
  - 정적 소스: `data/communities.json` (`npm run update:metrics` 실행 시 생성) — `groups[]`, `totals.heroSubscriberCount`, `totalMembers`, `icon`, `memberCount`, `updatedAt`
  - 폴백 API:  
    - 그룹 정보: `https://groups.roblox.com/v1/groups/{groupId}`  
    - 썸네일: `https://thumbnails.roblox.com/v1/groups/icons?groupIds=...&size=150x150&format=Png&isCircular=false`
  - 구현: `js/main.js`의 `renderCommunities()`가 정적 JSON 우선 사용, 실패 시 설정 JSON을 기준으로 API 재시도 후 폴백 렌더. 실패 시 에러 메시지 출력.
- **국제화**: `js/i18n.js`
  - 지원 언어: KO/EN/JA. `localStorage` 기반 언어 기억, `data-key`를 통해 텍스트 교체, `languageChanged` 커스텀 이벤트로 프로젝트 카드 재렌더.

## 5. 현재 프로젝트 파이프라인 (코드 기준)
| 이름 | 플랫폼 | 상태 | 예정/출시 | 클라이언트 | 상세 페이지 |
| --- | --- | --- | --- | --- | --- |
| Tower Flood Race | Roblox | 운영 | 2026-01 | Internal Project | `tower-flood-race.html` |
| Hacker vs Security | Roblox | 개발 | 2026-06 | Internal Project | `hacker-vs-security.html` |
| Korean Spa | Roblox | 운영 | 2025-12 | Internal Project | `korean-spa.html` |
| Tomato Splatter Simulator | Roblox | 운영 | 2026-04 | Internal Project | `tomato-splatter-simulator.html` |
| [Free UGC] AFK or arcade game | Roblox | 운영 | 2026-05 | BlockyUGC | `afk-or.html` |
| 🎁 FREE UGC RNG | Roblox | 운영 | 2026-05 | NNN UGC | `free-ugc-rng.html` |
| Enchant a Weapon | Roblox | 개발 | 2026-10 (예정) | Internal Project | `enchanted-weapon.html` |
| Fruit Battles | Roblox | 운영 | 2026-04 | Internal Project | `fruit-battles.html` |
| NNN UGC | Roblox | 개발 | 2025-Q1 | Confidential | `nnn-ugc.html` |
| Hunt a slime | Roblox | 개발 | 2026-11 (예정) | 미정 | `hunt-a-slime.html` |
| Tomato Splatter | Roblox | 개발 | 2027-02 (예정) | 미정 | `tomato-splatter.html` |
| ASMR UGC Town | Roblox | 개발 | 2026-10 (예정) | 미정 | `asmr-ugc-town.html` |

- Hunt a slime, Tomato Splatter, ASMR UGC Town: 개발 중으로 등록. 이름 기반 콘셉트 이미지·소개를 KO/EN/JA로 제공하며 임시 콘셉트 안내를 표시합니다. 출시 예정 월은 카드와 상세 페이지에 표시하며 외부 링크는 미정입니다.
- 신규 3개의 카드 이미지는 640px, 상세·OG 이미지는 1200px JPEG입니다. `plan/project-concept-image-prompts.json`에 생성 프롬프트를 기록합니다.
- 홈과 프로젝트 목록의 첫 4개는 Enchant a Weapon → ASMR UGC Town → Hunt a slime → Tomato Splatter 순으로 고정(`pinned: true`, `order: 10/20/30/40`). 이후 운영 중 6개는 누적 방문 수 내림차순, 나머지는 `order`순입니다. 동률은 `order`와 원본 순서로 정렬합니다. NNN UGC는 목록의 별도 UGC 섹션을 사용합니다.
- Enchant a Weapon의 기존 URL `enchanted-weapon.html`과 내부 ID는 유지합니다.

### 진행 상태 메모
- N-01(신규 프로젝트 추가: Tower Flood Race) 완료, 데이터/페이지/지표 연동 반영됨.
- N-02(커뮤니티 포탈 섹션) 완료: 홈 섹션에 활성 그룹 아이콘·멤버 수 표시.

## 6. 기능 요구사항 (현행)
- 다국어 전환 버튼 동작 및 브라우저 저장.
- 프로젝트 카드 동적 생성(메인/목록)과 다국어 업데이트.
- 반응형 네비게이션(모바일 토글) 및 스크롤 스타일 변경.
- 이미지 lazy-load, 스크롤 진입 애니메이션.
- 공통 연락처/사업자 정보 노출.

## 7. 비기능 요구사항 (현행 가이드)
- 반응형 레이아웃: 768px 기준 모바일 메뉴 전환.
- 성능: 이미지 지연 로딩, IntersectionObserver 사용.
- 접근성/언어: `<html lang>` 업데이트, 3개 국어 번역 유지.
- 호스팅: 정적 사이트 (CNAME 포함)로 GitHub Pages/정적 호스팅 대응.
- SEO/OG: 모든 주요 페이지에 meta description/keywords, OG/Twitter 카드, 파비콘 적용(Roblox 키워드 중심).

## 8. 향후 개선 및 로드맵
- 개선·신규 작업 항목은 `docs/development_roadmap.md`에서 통합 관리한다.  
- 본 PRD는 “현재 구현/운영 중인 결과”를 가독성 있게 정리하는 데 집중한다.

## 9. 운영 가이드
- 콘텐츠 업데이트: `js/projects-data.js`와 `js/i18n.js`의 번역 키 동시 수정 → 필요 시 상세 페이지 HTML 갱신.
- 자산 관리: `images/`에 썸네일·갤러리 추가 시 용량/명명 규칙 유지.
- 품질 체크: 다국어 전환, 모바일 네비게이션, 주요 CTA 링크 동작을 릴리즈 전 수동 검증.

## 10. 성공 지표 (제안)
- 세일즈 파이프라인: 문의 메일 클릭률, CTA→문의 전환률.
- 참여: 프로젝트 상세 페이지 조회, 외부 플레이 링크 클릭률.
- 국제화: 언어 전환 사용 비율, 해외 트래픽 비중.
