# ASMR UGC Town 상세 페이지 작업 계획 — 개발 중 페이지

> 2026-09-29 사용자 요청에 따라 이름 기반 콘셉트 이미지와 소개를 작성하여 등록했습니다. 실제 게임 기능은 미확정이며 출시 예정 월은 사용자 지정 일정입니다.
> 사용자에게 노출되는 모든 텍스트 필드는 KO / EN / JA 3개 언어로 채워야 합니다.

- **slug**: `asmr-ugc-town`
- **HTML**: `asmr-ugc-town.html`
- **콘텐츠 설정 파일**: `js/project-details/asmr-ugc-town.js`
- **카드 메타 위치**: `data/projects.json` (id: `asmr-ugc-town`)

---

## 0. 메타 (`data/projects.json`)
- category: roblox
- status: development
- featured: true
- launchDate: 2026-10 (예정)
- platform: Roblox
- client: 미정
- technologies: []
- placeId / universeId:
- thumbnail (image): assets/asmrugctown/asmr-ugc-town-preview.jpg
- detailPage: asmr-ugc-town.html
- 외부 링크: play / trailer / article / group / showcase
- reporting: collectMetrics=false / includeInHeroProjectCount=false / includeInHeroVisitTotal=false

## 1. SEO
- title (KO / EN / JA): ASMR UGC Town / ASMR UGC Town / ASMR UGC Town
- description (KO / EN / JA): 포근한 소리와 아기자기한 UGC 아이템이 어우러지는 편안한 마을 콘셉트. / A cozy town concept where soothing sounds meet playful UGC accessories. / 心地よい音とかわいいUGCアイテムが調和する、くつろぎの街のコンセプト。
- keywords (KO / EN / JA):
- ogTitle (KO / EN / JA):
- ogDescription (KO / EN / JA):
- ogImage:

## 2. Hero
- title (KO / EN / JA): ASMR UGC Town / ASMR UGC Town / ASMR UGC Town
- tagline (KO / EN / JA): 포근한 소리와 아기자기한 UGC 아이템이 어우러지는 편안한 마을 콘셉트. / A cozy town concept where soothing sounds meet playful UGC accessories. / 心地よい音とかわいいUGCアイテムが調和する、くつろぎの街のコンセプト。
- status 배지 (KO / EN / JA):
- genre 라벨 (KO / EN / JA):
- platform 라벨 (KO / EN / JA):

## 3. CTA 버튼
| # | type | style | 버튼 텍스트 (KO / EN / JA) |
|---|------|-------|------------------|
| 1 |  |  |  |
| 2 |  |  |  |
| 3 |  |  |  |

## 4. 메인 미디어
- type: (image | video)
- src:
- alt (KO / EN / JA):

## 5. 개요 (Overview)
1. 문단 1 (KO / EN / JA):
2. 문단 2 (KO / EN / JA):

## 6. 핵심 포인트 (Highlights)
1. eyebrow / title / description (KO / EN / JA):
2.
3.

## 7. 스냅샷 (Snapshot)
- launch (KO / EN / JA): 2026년 10월 출시 예정 / Expected October 2026 / 2026年10月公開予定
- status (KO / EN / JA):
- client (KO / EN / JA):
- stack (KO / EN / JA):

## 8. 특징 (Features)
1. title / description (KO / EN / JA):
2.
3.
4.

## 9. 관련 링크 (Links)
| type | 표시 텍스트 (KO / EN / JA) | URL |
|------|----------------------------|-----|
|  |  |  |

## 10. 갤러리 (Gallery)
- 1: `images/...` — alt (KO / EN / JA):
- 2: `images/...` — alt:
- 3: `images/...` — alt:

## 11. 체크리스트
- [x] `data/projects.json` 메타·링크·리포팅 갱신
- [x] `js/project-details/asmr-ugc-town.js` 콘텐츠 입력 (KO / EN / JA)
- [x] 이미지 에셋 준비 (preview / main / og, 개발 중 페이지는 갤러리 생략)
- 해당 없음: 외부 링크 미등록
- [x] i18n 누락 키 확인
- [x] `npm run build:css` 후 로컬 미리보기 동작 확인

## 메모 / 결정 사항
- 2026-09-29: 사용자가 이름 기반 더미 이미지 생성 및 페이지 채우기를 요청하여 진행.
- 기본 제공 image_gen 도구로 프로젝트별 콘셉트 아트 1장 생성. 생성 프롬프트는 `project-concept-image-prompts.json`에 보관.
- 카드: `assets/asmrugctown/asmr-ugc-town-preview.jpg` (640px), 상세·OG: `assets/asmrugctown/asmr-ugc-town-main.jpg` (1200px).
- 이름 기반 임시 콘셉트임을 KO/EN/JA 안내문으로 명시.
- 상태는 개발 중. 플레이 링크, 클라이언트, 기술 스택은 미정.
- 정렬값: 20. 상단 고정 프로젝트로 등록. 고정 4개 이후 라이브 6개는 누적 방문 수 내림차순.
- 기술·성과·출시 지표는 임의 생성하지 않음.

## 검증 결과
- `npm run check` 통과.
- `npm run snapshot`: 홈·목록·신규 상세 3개, KO/EN/JA × PC/모바일, 총 30장.
- Playwright: 신규 3개 이미지 디코딩, 모바일 가로 넘침 없음, KO/EN/JA 언어 전환, JS 오류 없음 확인.
