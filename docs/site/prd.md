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
  - NNNRPG 커뮤니티(`487193470`)를 홈 포털과 히어로 멤버 합계에 포함합니다.
- **프로젝트 목록(`projects-roblox.html`)**: 필터/검색 UI(카테고리/상태/검색) 적용, 카드 렌더.
- **프로젝트 상세**
  - 공통 HTML 셸과 `js/project-detail.js`, 프로젝트별 콘텐츠 설정으로 렌더합니다. 등록 페이지는 아래 프로젝트 파이프라인을 따릅니다.
  - Ducky Merge Farm [RNG], Star Reach, Hacker vs Security는 2026-09-29 아카이브하여 사이트와 사이트맵에서 제외했습니다. 원본은 `_archive/projects/2026-09-29/`에 보관합니다.
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
  - Hunt a Slime은 `shared/assets/www-hunt-a-slime/content.json`에서 카드 정보·링크, KO/EN/JA 상세·SEO, 발표별 소개 문구를 관리한다. 상세 설정 JS는 JSON 로더이며, 빌드는 운영 설정·지표와 카드 정보를 합쳐 `/data/projects.json`을 만들고 초기 SEO·발표 번역·프리뷰 경로를 생성한다. 다른 프로젝트는 기존 관리 방식을 유지한다.
  - ASMR UGC Town도 `shared/assets/www-asmr-ugc-town/content.json`에서 같은 방식으로 관리한다. 대표·프리뷰·갤러리 3장과 KO/EN/JA 상세·카드·회사 소개 문구를 같은 폴더에 두며 공통 빌드 연결을 재사용한다.
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

`shared/assets` 프로젝트 13개는 www- 폴더와 content.json 구조로 통일한다. 등록 프로젝트 9개는 기존 레지스트리의 운영 설정·지표와 병합하고, 미등록/보관 자산 4개는 catalogOnly 검증만 수행한다. 페이지·목록·사이트맵·집계에 자동 추가하지 않는다. 전체 필드·경로 매핑은 `docs/projects/asset-content.md`를 따른다.

Tower Flood Race도 `shared/assets/www-tower-flood-race/content.json`에서 카드 정보·KO/EN/JA 상세·SEO·공유 문구·CTA·커뮤니티 영상 UI·회사 소개 문구를 관리한다. 이미지 2개·videos.txt를 함께 보관하며 영상 목록 파싱·보강·모달·언어 전환을 유지한다. 운영 수집 지표·집계·수집 ID는 기존 레지스트리에 유지한다.

Tomato Splatter도 `shared/assets/www-tomato-splatter/content.json`에서 카드 정보·KO/EN/JA 상세·SEO·갤러리·회사 소개 및 Jumpstart 이미지 소개를 관리한다. 이미지 10개와 JSON을 함께 보관하고 기존 JSON 빌드·로더를 재사용한다. Tomato Splatter Simulator는 별도 프로젝트다.

Enchant a Weapon도 `shared/assets/www-enchant-a-weapon/content.json`에서 카드 정보·KO/EN/JA 상세·SEO·갤러리·회사 소개 및 Jumpstart 이미지 소개를 관리한다. 이미지 6개와 JSON을 함께 보관하며 기존 JSON 빌드와 상세 로더를 재사용한다. 프로젝트 ID와 상세 주소는 enchanted-weapon을 유지한다.
| 이름 | 플랫폼 | 상태 | 예정/출시 | 클라이언트 | 상세 페이지 |
| --- | --- | --- | --- | --- | --- |
| Tower Flood Race | Roblox | 운영 | 2026-01 | Internal Project | `tower-flood-race.html` |
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

- Hunt a Slime: 개발 중 Action RPG. 사용자 제공 기획 소개를 KO/EN/JA로 반영하고 다른 프로젝트와 같은 표준 상세 구성으로 텍스트 핵심 포인트·개요·프로젝트 정보·주요 특징을 제공합니다. 개요에 젤라리아 세계관·개발 안내, 주요 특징에 플레이 흐름·대상 플레이어를 담습니다. 소개된 기능은 개발 목표이며 출시 일정과 체험 주소는 미확정입니다. 상세·OG는 main, 홈·목록은 preview만 사용하며 갤러리는 추후 추가합니다.
- Tomato Splatter: 개발 중·2027-02 출시 예정인 Action RPG. 사용자 제공 토마토 마왕·붉은 정원 스토리를 KO/EN/JA로 소개합니다. 자신의 아바타로 마을을 구하고 숲·광산·무너진 요새를 탐험하며, 동료들과 봉인의 비밀을 밝혀 마왕의 지배를 끊는 모험입니다. Hunt a Slime과 같은 몬스터 무리 사냥·전리품 수집·장비 및 스킬 성장·분열/합체 몬스터와 보스 도전 흐름을 반영합니다. `mode: standard`로 개요·핵심 포인트 3개·프로젝트 정보·플레이 흐름 및 대상 플레이어·갤러리 3장을 제공합니다. 소개된 시스템은 개발 목표이며 체험 주소는 추후 공개합니다.
- ASMR UGC Town: ASMR 장애물이 있는 마을을 탐험하고 수집한 재화·재료를 무료 Roblox UGC로 교환하는 캐주얼 Obby. 개발 중 상태와 2026-10 출시 예정은 유지하며, `detailRenderer: standard`로 개요·핵심 포인트 3개·프로젝트 정보·특징 4개·갤러리 3장을 제공합니다. 본문·카드·SEO는 KO/EN/JA로 동기화하며 외부 링크는 미정입니다.
- Hunt a slime은 사용자 제공 PNG 원본에서 만든 1200px 이하 WebP를 카드·상세·OG에 사용합니다. Hunt a Slime은 표준 상세 레이아웃을 그대로 사용하며 피처 이미지·전용 배치·추가 섹션을 사용하지 않습니다. Tomato Splatter는 사용자 제공 PNG 원본을 보존하고 카드 640px, 상세·OG·갤러리 1200px 이하 WebP 사본을 사용합니다. 최초 3개 프로젝트의 생성 프롬프트는 `docs/projects/project-concept-image-prompts.json`에 기록되어 있으며, ASMR UGC Town은 현재 등록된 대표·카드·갤러리 이미지를 사용합니다.
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
- 개선·신규 작업 항목은 `docs/development-roadmap.md`에서 통합 관리한다.
- 본 PRD는 “현재 구현/운영 중인 결과”를 가독성 있게 정리하는 데 집중한다.

## 9. 운영 가이드
- 콘텐츠 업데이트: `js/projects-data.js`와 `js/i18n.js`의 번역 키 동시 수정 → 필요 시 상세 페이지 HTML 갱신.
- 자산 관리: `images/`에 썸네일·갤러리 추가 시 용량/명명 규칙 유지.
- 품질 체크: 다국어 전환, 모바일 네비게이션, 주요 CTA 링크 동작을 릴리즈 전 수동 검증.

## 10. 성공 지표 (제안)
- 세일즈 파이프라인: 문의 메일 클릭률, CTA→문의 전환률.
- 참여: 프로젝트 상세 페이지 조회, 외부 플레이 링크 클릭률.
- 국제화: 언어 전환 사용 비율, 해외 트래픽 비중.
