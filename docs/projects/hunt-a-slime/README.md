# Hunt a Slime 상세 페이지 — 개발 중 Action RPG

> 2026-09-29 사용자 요청에 따라 이름 기반 콘셉트 이미지와 소개를 작성하여 등록했습니다. 실제 게임 기능은 미확정이며 출시 예정 월은 사용자 지정 일정입니다.
> 사용자에게 노출되는 모든 텍스트 필드는 KO / EN / JA 3개 언어로 채워야 합니다.

- **slug**: `hunt-a-slime`
- **HTML**: `hunt-a-slime.html`
- **콘텐츠 설정 파일**: `js/project-details/hunt-a-slime.js`
- **카드 메타 위치**: `data/projects.json` (id: `hunt-a-slime`)

---

## 0. 메타 (`data/projects.json`)
- category: roblox
- status: development
- featured: true
- launchDate: null (출시 일정 확정 후 공개)
- platform: Roblox
- client: 미정
- technologies: []
- placeId / universeId:
- thumbnail (image): assets/www-hunt-a-slime/hunt-a-slime-preview.webp
- detailPage: hunt-a-slime.html
- 외부 링크: play / trailer / article / group / showcase
- reporting: collectMetrics=false / includeInHeroProjectCount=false / includeInHeroVisitTotal=false

## 1. SEO
- title (KO / EN / JA): Hunt a slime / Hunt a slime / Hunt a slime
- description (KO / EN / JA): 말랑한 슬라임을 찾아 초록빛 세계로 떠나는 사냥 모험 콘셉트. / A hunting adventure concept that follows bouncy slimes into a vibrant green world. / ぷるぷるのスライムを探し、緑豊かな世界へ出かけるハンティングアドベンチャーのコンセプト。
- keywords (KO / EN / JA):
- ogTitle (KO / EN / JA):
- ogDescription (KO / EN / JA):
- ogImage:

## 2. Hero
- title (KO / EN / JA): Hunt a slime / Hunt a slime / Hunt a slime
- tagline (KO / EN / JA): 말랑한 슬라임을 찾아 초록빛 세계로 떠나는 사냥 모험 콘셉트. / A hunting adventure concept that follows bouncy slimes into a vibrant green world. / ぷるぷるのスライムを探し、緑豊かな世界へ出かけるハンティングアドベンチャーのコンセプト。
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
- type: image
- src: `assets/www-hunt-a-slime/hunt-a-slime-main.webp`
- alt: 달빛 아래 슬라임과 황금 검을 그린 대표 이미지 (KO / EN / JA 반영)

## 5. 개요 (Overview)
1. 문단 1 (KO / EN / JA):
2. 문단 2 (KO / EN / JA):

## 6. 핵심 포인트 (Highlights)
1. eyebrow / title / description (KO / EN / JA):
2.
3.

## 7. 스냅샷 (Snapshot)
- launch (KO / EN / JA): 2026년 11월 출시 예정 / Expected November 2026 / 2026年11月公開予定
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
- 1: `assets/www-hunt-a-slime/hunt-a-slime-main-gallery-1.webp` — 달빛 비치는 유적에서 검을 휘두르는 캐릭터와 초록 슬라임 (KO / EN / JA 반영)
- 2: `assets/www-hunt-a-slime/icon-slash.webp` — 검을 들어 올린 캐릭터와 커다란 초록 슬라임의 정사각형 이미지 (KO / EN / JA 반영)

## 11. 체크리스트
- [x] `data/projects.json` 메타·링크·리포팅 갱신
- [x] `js/project-details/hunt-a-slime.js` 콘텐츠 입력 (KO / EN / JA)
- [x] 이미지 에셋 준비 (preview / main / og / gallery 2종)
- 해당 없음: 외부 링크 미등록
- [x] i18n 누락 키 확인
- [x] `npm run build:css` 후 로컬 미리보기 동작 확인

## 메모 / 결정 사항
- 2026-09-29: 사용자가 이름 기반 더미 이미지 생성 및 페이지 채우기를 요청하여 진행.
- 기본 제공 image_gen 도구로 프로젝트별 콘셉트 아트 1장 생성. 생성 프롬프트는 `project-concept-image-prompts.json`에 보관.
- 카드: `assets/www-hunt-a-slime/hunt-a-slime-preview.jpg` (640px), 상세·OG: `assets/www-hunt-a-slime/hunt-a-slime-main.jpg` (1200px).
- 이름 기반 임시 콘셉트임을 KO/EN/JA 안내문으로 명시.
- 상태는 개발 중. 플레이 링크, 클라이언트, 기술 스택은 미정.
- 정렬값: 30. 상단 고정 프로젝트로 등록. 고정 4개 이후 라이브 6개는 누적 방문 수 내림차순.
- 기술·성과·출시 지표는 임의 생성하지 않음.

## 검증 결과
- `npm run check` 통과.
- `npm run snapshot`: 홈·목록·신규 상세 3개, KO/EN/JA × PC/모바일, 총 30장.
- Playwright: 신규 3개 이미지 디코딩, 모바일 가로 넘침 없음, KO/EN/JA 언어 전환, JS 오류 없음 확인.


## 2026-10-02 이미지 교체 반영
- 사용자 제공 PNG 4종은 그대로 보존하고, 웹에서는 가로 1200px 이하·각 156~209KB WebP 사본을 사용합니다.
- 삭제된 JPG 참조를 홈·목록 카드, 상세 대표 이미지, HTML/JS OG 및 Twitter 이미지, company-intro 개발 카드에서 교체했습니다.
- 개발 중 렌더러에 선택 갤러리를 연결하고 가로 장면은 한 열 전체 폭, 정사각형 이미지는 최대 640px 중앙 배치로 표시합니다. 원본 비율을 유지합니다.
- KO/EN/JA 이미지 설명과 개발 안내문을 사용자 제공 이미지에 맞게 변경했습니다. 상태·일정·게임 콘셉트는 유지합니다.
- 검증: `npm run check` 통과, 관련 6개 경로의 3언어·3폭 smoke 54조합 통과. 상세 이미지 27개 비율 계측 및 PC·모바일 PNG 확인. 보고서: `exports/agent/2026-10-01T15-03-23-914Z-46921/report.json`.


## 2026-10-02 게임 소개서 반영
- 최신 소개 기준은 [게임 소개서](game-introduction.md)입니다. 아래의 9월 콘셉트·11월 예정 기록은 당시 작업 이력입니다.
- `detailRenderer: standard`로 개요·이미지 피처 3개·프로젝트 정보·대상 플레이어·플레이 흐름·젤라리아 세계관·개발 안내를 제공합니다.
- 대표·OG는 타이틀 이미지, 핵심 피처는 전투·전리품·정사각형 슬라임 비주얼을 사용합니다. 원본 비율 유지.
- 이름을 Hunt a Slime으로 통일하고, 장르 Action RPG 및 KO/EN/JA 본문·카드·SEO를 반영했습니다.
- 출시 일정은 새 소개서에 따라 미확정으로 정리했습니다. 개발 안내 버튼은 페이지 내 안내로 이동합니다.
- 검증: npm run check 및 관련 화면 smoke 54조합, 최종 상세 9조합 통과. 내부 CTA·이미지 비율·소개 섹션 확인. 최종 PNG: exports/agent/2026-10-01T15-37-09-710Z-83997/.


## 2026-10-02 기본 레이아웃으로 정리
- 사용자 피드백에 따라 표준 상세의 본문/우측 사이드바 배치를 그대로 사용합니다.
- 개요에는 게임 소개·세계관·개발 안내, 핵심 포인트에는 텍스트 3개, 주요 특징에는 플레이 흐름·대상 플레이어를 표시합니다.
- 상세·OG는 main, 홈·목록 카드는 preview만 사용합니다. 피처에 붙였던 이미지 및 별도 플레이 흐름·세계관·개발 소식 섹션과 버튼을 제거했습니다.
- 갤러리는 연결하지 않습니다. 기존 갤러리 파일은 추후 개발용으로 보존합니다. 현재 기준은 game-introduction.md의 홈페이지 적용 항목입니다.
- 검증: npm run check 통과. Hunt a Slime·ASMR UGC Town·Tower Flood Race·프로젝트 목록의 KO/EN/JA × 1280/390/320px smoke 36조합 통과. 기본 2열/모바일 1열 배치, 상세 main 1장·추가 이미지 및 갤러리 없음 확인. PNG 직접 검토: exports/agent/2026-10-01T15-56-41-314Z-10582/.
