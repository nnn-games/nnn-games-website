# Korean Spa 상세 페이지 작업 계획

- **slug**: `korean-spa`
- **HTML**: `korean-spa.html`
- **콘텐츠 설정 파일**: `js/project-details/korean-spa.js`
- **카드 메타 위치**: `data/projects.json` (id: `korean-spa`)

> 사용자에게 노출되는 모든 텍스트 필드는 KO / EN / JA 3개 언어로 채워야 합니다.

---

## 0. 메타 (`data/projects.json`)
- category:
- status: (active | development | completed | paused)
- featured: (true | false)
- launchDate: (YYYY-MM | YYYY-Qn)
- platform:
- client:
- technologies: []
- placeId / universeId:
- thumbnail (image):
- detailPage:
- 외부 링크: play / trailer / article / group / showcase
- reporting: collectMetrics / includeInHeroProjectCount / includeInHeroVisitTotal

## 1. SEO
- title (KO / EN / JA):
- description (KO / EN / JA):
- keywords (KO / EN / JA):
- ogTitle (KO / EN / JA):
- ogDescription (KO / EN / JA):
- ogImage:

## 2. Hero
- title (KO / EN / JA):
- tagline (KO / EN / JA):
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
- launch (KO / EN / JA):
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
- [ ] `data/projects.json` 메타·링크·리포팅 갱신
- [ ] `js/project-details/korean-spa.js` 콘텐츠 입력 (KO / EN / JA)
- [ ] 이미지 에셋 준비 (preview / main / og / gallery)
- [ ] 외부 링크 유효성 확인 (https)
- [ ] i18n 누락 키 확인
- [ ] `npm run build:css` 후 로컬 미리보기 동작 확인

## 메모 / 결정 사항
-
