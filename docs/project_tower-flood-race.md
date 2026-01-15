## 신규 프로젝트 등록 템플릿

신규 프로젝트를 추가할 때 아래 항목을 채워 주세요. 값을 모르면 `TBD`로 표시하고, 번역이 없으면 한국어만 먼저 적어도 됩니다.  
데이터 확정 후 `data/projects.json`, `js/i18n.js`(필요 시), 개별 상세 페이지(옵션) 순서로 반영합니다.

---
### 1) 기본 메타
- id/slug: (예: `tower-flood-race`) — 소문자, 하이픈
- title:  
  - ko: 타워 홍수 경주
  - en: Tower Flood Race
  - ja: タワー・フラッド・レース
- description (1~2문장):  
  - ko: "Race Up. Water Rises. – 멈추는 순간 뒤처지는 타워 레이스. 매 라운드마다 다른 랜덤 타워를 오르고, 아래에서 차오르는 물을 피해 누구보다 빠르게 정상에 도달하세요. 잠깐의 멈춤도 바로 순위로 이어집니다. 지금 당신의 Obby 실력을 증명해 보세요."
  - en: "Race up while the water keeps rising. Each round spawns a new random tower—climb faster than everyone else before the flood catches you. Even a brief pause turns into a rank gap. Prove your obby skills now."
  - ja: "水位が上がり続ける中、ひたすら上へ。毎ラウンド新しいランダムタワーが生成され、下から迫る水を避けて誰よりも速く頂上を目指します。少しの立ち止まりがすぐ順位差に。あなたのObbyスキルを証明してください。"
- category: `roblox` (기본)
- platform: `Roblox`
- status: `active`
- launchDate: `2026-01`
- client: (예: Internal / Brand name / Confidential)
- technologies: [예: "Roblox Studio", "Luau", ...]

### 2) 링크 (빈 값은 `""`)
- play: 77732766603333
- universeId: 8908746905
- trailer: (YouTube 등)
- article: (보도/블로그)
- group: 294985728
- showcase: (이미지/영상 데모 링크, 있을 경우)

### 3) 메트릭 (없으면 `null`)
- visits: number | null
- playing: null
- favorites: null
- likeRatio: 0~1 소수 | null
- updatedAt: ISO datetime (예: `2025-12-31T05:19:44.590Z`) | null

### 4) 에셋 경로
- icon: `images/tfr-icon.jpg`
- thumbnail: `images/tfr-preview.jpg`
- main image: `images/tfr-main.jpg`
- gallery: `images/tfr-gallery-1.jpg`, `...-3.jpg`, ...

### 5) i18n/카피 (추가 카피가 있을 때)
홈/목록 카드 카피는 `description`으로 대체되며, 상세 페이지가 필요할 때만 `js/i18n.js`에 전용 키를 추가합니다.
- 필요한 추가 키: 상세 페이지 섹션 제목/특징 리스트/관련 링크 레이블 등
- 없으면 i18n 키 추가 없이 카드만 노출 가능합니다.

### 6) 상세 페이지 생성 여부
- 필요 여부: yes  
- 필요 시 파일명: `tower-flood-race.html`
- 포함 섹션: 헤더 메타(OG/SEO), 히어로/CTA, 개요, 특징(리스트), 관련 링크, 갤러리.

### 7) 검증 체크리스트
- JSON 스키마: 필수 필드(id, title{ko,en,ja}, description{ko,en,ja}, image, detailPage, category, status, launchDate, platform, client, technologies, links, metrics) 누락 없음
- i18n: 새 키 추가 시 KO/EN/JA 모두 입력 (없으면 최소 KO, 나머지 `TBD`)
- 링크: 외부 URL 유효성(https), 빈 값은 `""`
- 이미지: 경로/파일명 일치, 의미 있는 alt 작성
- 상태/날짜: 표준 포맷 유지(`active/development/...`, `YYYY-MM` 또는 `YYYY-Qn`)
- 로컬 확인: `npm run build:css` 후 간단한 정적 서버로 `data/projects.json` 로드되는지 확인
