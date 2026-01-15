# NNN GAMES 웹사이트 및 Roblox 전문 스튜디오 PRD

본 문서는 현재 코드베이스(정적 웹사이트)에서 구현된 내용과 제공 가치에 기반해 작성되었으며, 향후 기능/콘텐츠 확장을 위한 기준 문서로 계속 업데이트한다.

## 1. 제품 개요
- **제품 목적**: Roblox 게임·UGC 전문 스튜디오 NNN GAMES의 역량, 진행/운영 중인 Roblox 프로젝트, 연락 채널을 명확히 전달하는 마케팅·세일즈용 웹사이트.
- **핵심 메시지**: Roblox 네이티브 제작력, 리텐션 중심 시스템/라이브옵스, 브랜드/수익을 연결하는 설계 역량.
- **운영 형태**: 정적 HTML/CSS/JS 기반 (파일 경로: `index.html`, `projects.html`, 개별 프로젝트 상세 페이지, `js/*.js`, `css/style.css`).

## 2. 주요 사용자와 목표
- **브랜드/파트너 담당자**: 협업·수주 문의, Roblox 제작 역량과 레퍼런스 확인 → `contact.html` 내 이메일/주소 노출.
- **플랫폼 운영사 및 투자자**: Roblox 제작·운영 경험, 수상/지표, 파이프라인 확인.
- **게이머/커뮤니티**: 개별 Roblox 프로젝트 플레이/체험 링크 확인.

## 3. 정보 구조 (현재 구현)
- **홈(`index.html`)**
  - Hero: Roblox 전문 스튜디오 메시지, CTA는 `projects.html`.
  - 커뮤니티 포털: Roblox 그룹 3종(IDs: 34453707, 294985728, 916094546) 아이콘/멤버 수를 공개 API로 실시간 표시, 각 링크는 Roblox share URL로 연결.
  - 프로젝트 프리뷰: `projects-data.js`의 featured 목록을 `project-renderer.js`로 동적 렌더.
- **프로젝트 목록(`projects.html`)**: 필터/검색 UI(카테고리/상태/검색) 적용, 카드 렌더.
- **프로젝트 상세**
  - `tower-flood-race.html` (Roblox 오비 레이스), `korean-spa.html` (Roblox 퍼즐 어드벤처), `legendary-dj-gear.html` (Roblox 음악 수집), `nnn-ugc.html` (Roblox UGC 아이템)
- **문의(`contact.html`)**: 이메일, 주소, 사업자등록번호, 지도 iframe.
- **공통 UI**: 헤더/푸터, 모바일 메뉴 토글(`js/main.js`), 이미지 지연 로딩 및 스크롤 애니메이션, CTA 추적(data-cta/sendBeacon) 경량 스텁.

## 4. 데이터 및 렌더링 구조
- **데이터 소스**: `data/projects.json` (정적 JSON) + `js/projects-data.js` (fallback)
  - 필드: `id`, `title{ko,en,ja}`, `description{ko,en,ja}`, `image`, `detailPage`, `category`, `status(active/development/...)`, `launchDate`, `platform`, `client`, `technologies`, `featured`, `placeId`, `universeId`, `links{play,trailer,article,group,showcase}`, `metrics{visits,playing,favorites,likeRatio,updatedAt}`.
- **렌더링**: `js/project-renderer.js`
  - JSON 로드 후 카드 동적 생성, 플랫폼/상태/카테고리 배지, 언어 변경 시 실시간 텍스트 교체, 목록 카드에 visits/playing/favorites 배지 노출.
- **상세 페이지 지표/링크 주입**: `js/main.js`
  - `renderHeaderMetrics()`로 상세 헤더에 방문자수·좋아요% 표시, `applyProjectLinks()`로 CTA URL을 프로젝트 데이터 기반으로 동기화.
- **커뮤니티 데이터**: Roblox 공개 API 사용
  - 그룹 정보: `https://groups.roblox.com/v1/groups/{groupId}` → 멤버 수/이름
  - 썸네일: `https://thumbnails.roblox.com/v1/groups/icons?groupIds=...&size=150x150&format=Png&isCircular=false`
  - 구현: `js/main.js`의 `renderCommunities()`가 홈 섹션에 실시간 렌더, 실패 시 로고/텍스트 폴백.
- **국제화**: `js/i18n.js`
  - 지원 언어: KO/EN/JA. `localStorage` 기반 언어 기억, `data-key`를 통해 텍스트 교체, `languageChanged` 커스텀 이벤트로 프로젝트 카드 재렌더.

## 5. 현재 프로젝트 파이프라인 (코드 기준)
| 이름 | 플랫폼 | 상태 | 예정/출시 | 클라이언트 | 상세 페이지 |
| --- | --- | --- | --- | --- | --- |
| Tower Flood Race | ROBLOX | 운영 | 2026-01 | Internal | `tower-flood-race.html` |
| Korean Spa | ROBLOX | 운영 | 2025-12 | Internal | `korean-spa.html` |
| Legendary DJ Gear | ROBLOX | 운영 | 2024-11 | Internal | `legendary-dj-gear.html` |
| NNN UGC | ROBLOX | 개발 | 2025-Q1 | Confidential | `nnn-ugc.html` |

### 진행 상태 메모
- N-01(신규 프로젝트 추가: Tower Flood Race) 완료, 데이터/페이지/지표 연동 반영됨.
- N-02(커뮤니티 포탈 섹션) 완료: 홈 섹션에 3개 그룹 아이콘·멤버 수 실시간 표시.

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
- SEO/OG: 모든 주요 페이지에 meta description/keywords, OG/Twitter 카드, 파비콘 적용(로블록스 키워드 중심).

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