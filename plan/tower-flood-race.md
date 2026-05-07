# Tower Flood Race 상세 페이지 작업 계획

- **slug**: `tower-flood-race`
- **HTML**: `tower-flood-race.html`
- **콘텐츠 설정 파일**: `js/project-details/tower-flood-race.js`
- **카드 메타 위치**: `data/projects.json` (id: `tower-flood-race`)

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
- [ ] `js/project-details/tower-flood-race.js` 콘텐츠 입력 (KO / EN / JA)
- [ ] 이미지 에셋 준비 (preview / main / og / gallery)
- [ ] 외부 링크 유효성 확인 (https)
- [ ] i18n 누락 키 확인
- [ ] `npm run build:css` 후 로컬 미리보기 동작 확인

## 12. 신규 기능 명세: 커뮤니티 영상 큐레이션 (Long-form / Short-form)

### 12.1 목적 / 배경
- 다양한 크리에이터가 YouTube·TikTok에 Tower Flood Race 관련 숏폼·롱폼 영상을 업로드 중.
- 방문자가 한 곳에서 다양한 플레이 영상을 탐색하면 게임 신뢰도와 페이지 체류시간을 동시에 확보 가능.
- "Race Up. Water Rises." 핵심 카피와 시너지 — 빠른 라운드와 긴장감을 영상으로 직관 전달.

### 12.2 핵심 사용자 시나리오
1. 방문자가 상세 페이지 진입 → (기존 갤러리 자리에) **Shorts — 숏폼 가로 스크롤러**로 짧은 클립을 좌우 스와이프/스크롤 탐색.
2. 그 아래 **Community Highlights — 롱폼 그리드**가 노출.
3. 카드 클릭 → 모달 플레이어에서 임베드 재생 (페이지 이탈 없음).
4. 더 보고 싶을 때 **원본 보기** 링크로 YouTube/TikTok 이동.

### 12.3 데이터 모델 (런타임 산출, per video)
저장은 텍스트 파일(URL 한 줄씩). 다음 필드는 페이지가 URL → 런타임 산출 / oEmbed 보강을 통해 만든다.

| 필드 | 출처 | 비고 |
|------|------|------|
| id | URL | `<platform>:<videoId>` |
| platform | URL 호스트 | `youtube` \| `tiktok` |
| format | URL 패턴 | YouTube `/shorts/` → short, TikTok → short, 그 외 long |
| videoId | URL | `/shorts/<id>`, `?v=<id>`, `/video/<id>` |
| url | 원본 | videos.txt 의 한 줄 |
| embedUrl | URL | iframe `src` |
| thumbnail | YouTube URL / oEmbed | YouTube 표준 `i.ytimg.com` URL, TikTok 은 oEmbed 결과 |
| title | oEmbed | 미수신 시 "(제목 없음)" |
| creator.name | oEmbed / URL | TikTok 은 `@handle` 부분 fallback |

### 12.4 운영 입력 — 텍스트 파일 직접 편집 (구현 완료)

> **결정**: CLI·Admin 페이지·시트 동기화·후보 큐 모두 제거. 단독 운영자가 `assets/towerfloodrace/videos.txt` 파일에 URL을 한 줄씩 붙여넣고 저장하면, 페이지가 새로고침 시점에 직접 파싱·렌더한다.

#### 12.4.1 데이터 파일 — `assets/towerfloodrace/videos.txt`
- 한 줄에 하나의 URL (YouTube / TikTok)
- 줄 시작이 `#` 이면 주석 (무시)
- 빈 줄 무시
- 위에서부터 표시 순서
- **섹션 마커 `[long]` / `[short]`** — 마커 아래의 URL 은 모두 해당 포맷으로 분류 (가장 최근 마커가 적용)
- 마커가 없는 영역의 URL 은 URL 패턴으로 자동 분류 (12.4.3 참고)

예시:
```text
[long]
https://www.youtube.com/watch?v=abc123
https://youtu.be/def456

[short]
https://www.youtube.com/shorts/xyz
https://www.tiktok.com/@user/video/7891234567890
```

#### 12.4.2 런타임 처리 흐름 (`js/project-details/tower-flood-race-videos.js`)
1. `assets/towerfloodrace/videos.txt` 를 `fetch` (no-cache).
2. 줄 단위 파싱 → 주석/공백 제거 → URL 추출.
3. URL 만으로 즉시 산출 가능한 항목으로 카드를 먼저 렌더 (체감 지연 0):
   - `platform` (youtube/tiktok) — 호스트 기반
   - `videoId` — `/shorts/<id>`, `?v=<id>`, `/video/<id>` 패턴
   - `format` — YouTube `/shorts/` → short, TikTok 모두 short, 그 외 long
   - `embedUrl` — `https://www.youtube.com/embed/<id>` 또는 `https://www.tiktok.com/embed/v2/<id>`
   - `thumbnail` (YouTube 한정) — `https://i.ytimg.com/vi/<id>/hqdefault.jpg`
   - TikTok `creator` 핸들 — URL의 `/@<handle>` 부분
4. 백그라운드에서 oEmbed 호출(API 키 불필요)하여 제목·작성자·TikTok 썸네일을 보강:
   - YouTube: `https://www.youtube.com/oembed?url=...&format=json`
   - TikTok: `https://www.tiktok.com/oembed?url=...`
   - 응답을 `localStorage` 에 7일 캐시 → 재방문 시 즉시 표시
   - CORS/네트워크 실패 시 1단계 산출 결과 그대로 유지 (재생은 정상 작동)
5. 카드 클릭 → 모달 + 임베드 iframe 자동재생.

#### 12.4.3 분류 규칙 (우선순위)
1. **섹션 마커 `[long]` / `[short]`** — 마커 아래 URL 은 무조건 해당 포맷.
2. 마커가 없으면 URL 패턴 자동 분류:
   - YouTube `/shorts/<id>` → `short`
   - TikTok 모든 URL → `short`
   - YouTube 일반 URL (`watch?v=`, `youtu.be/`) → `long`

> YouTube 공유 버튼이 일반 영상과 Shorts 모두 `youtu.be/<id>` 형식을 주는 경우가 있어, Shorts 는 가급적 `[short]` 마커 아래에 두거나 `youtube.com/shorts/<id>` 형태로 적는 것을 권장.

#### 12.4.4 운영 흐름
1. `assets/towerfloodrace/videos.txt` 열기
2. URL 한 줄 추가 (또는 여러 줄 일괄 붙여넣기)
3. 저장 → `git commit && git push` → GitHub Pages 배포
4. 페이지 새로고침 → 즉시 반영

> 빌드 단계 없음. CLI 없음. 단일 텍스트 파일만 관리하면 된다.

### 12.5 분류 규칙 (롱폼 vs 숏폼)
| 플랫폼 | 분류 기준 |
|--------|-----------|
| YouTube | URL이 `/shorts/` 포함 **또는** `duration ≤ 60s` → `short`. 그 외는 `long`. |
| TikTok | 항상 `short` (3분 미만 가정). |
| 예외 | duration 미상 + `/shorts/` 표시 없음 → `format` 수동 지정. |

기본 정렬: `publishedAt DESC`. 토글: 인기순(`metrics.views DESC`).

### 12.6 UI 와이어프레임

> **결정**: 탭 구조 제거. 갤러리 자리에 두 섹션을 (1) 숏폼 가로 스크롤러 → (2) 롱폼 그리드 순서로 배치. 각 섹션은 작은 키커(`Shorts` / `Community Highlights`)만 표시하고 별도 타이틀·서브타이틀 없음.

#### (A) 숏폼 섹션 — 9:16 가로 스크롤러
```
Shorts

  ‹ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ›
    │[TT]│ │[TT]│ │[YT]│ │[TT]│ │[YT]│ │[TT]│  ←  스크롤 →
    │thmb│ │thmb│ │thmb│ │thmb│ │thmb│ │thmb│
    ├────┤ ├────┤ ├────┤ ├────┤ ├────┤ ├────┤
    │@usr│ │@usr│ │@usr│ │@usr│ │@usr│ │@usr│
    └────┘ └────┘ └────┘ └────┘ └────┘ └────┘
```

#### (B) 롱폼 섹션 — 16:9 그리드 (desktop 4-col / tablet 2-col / mobile 1-col)
```
Community Highlights

┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│ [YT]        │ │ [YT]        │ │ [YT]        │ │ [YT]        │
│   ▣ thumb   │ │   ▣ thumb   │ │   ▣ thumb   │ │   ▣ thumb   │
├─────────────┤ ├─────────────┤ ├─────────────┤ ├─────────────┤
│ Title…      │ │ Title…      │ │ Title…      │ │ Title…      │
│ @Creator    │ │ @Creator    │ │ @Creator    │ │ @Creator    │
└─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘
```
- 카드 폭 고정 (모바일 150px / 데스크톱 180px), `scroll-snap-type: x mandatory`
- 좌우 둥근 화살표 버튼 (`hover` 환경에서만 노출 — 터치 디바이스 자동 숨김)
- 양 끝 그라디언트 페이드 — `data-can-prev/next` 가 true 일 때만 표시
- 네이티브 스와이프·휠 가로 스크롤 모두 지원

#### (C) 카드 공통 구성
- 좌측 상단: 플랫폼 뱃지 (`YT` / `TT`)
- 썸네일 hover 시: 살짝 확대 + 그림자, focusable, `aria-label`
- 카드 본문: title (1~2줄 ellipsis) → creator
- 클릭 시 모달 오픈

#### (D) 모달 플레이어 (클릭 시)
```
┌────────────── overlay (ESC 닫기) ──────────────┐
│                                          [×]   │
│        ┌──────────────────────────────┐        │
│        │                              │        │
│        │   YouTube/TikTok iframe      │        │
│        │   16:9 (long) | 9:16 (short) │        │
│        │                              │        │
│        └──────────────────────────────┘        │
│   Title                                         │
│   @Creator · 1.2M views · 2025-12-01            │
│   [ Open on YouTube ]   [ Share ]               │
│                                                 │
│   [ ◀ prev ]                       [ next ▶ ]   │
└────────────────────────────────────────────────┘
```

- 배경 dim + 클릭/ESC 닫기, focus trap, 닫을 때 영상 정지(postMessage `pauseVideo`).
- 모바일에서는 풀스크린 시트 형태로 변형.

#### (F) 빈 상태 / 오류 상태
```
┌─────────────────────────────────────┐
│      🎬                              │
│  아직 등록된 영상이 없습니다.            │
│  업로드한 영상이 있다면 알려주세요!       │
│  [ Submit your video ]               │
└─────────────────────────────────────┘
```

### 12.7 임베드 / 재생 정책
- YouTube 임베드: `https://www.youtube.com/embed/<id>?rel=0&modestbranding=1&playsinline=1`
- YouTube Shorts: 동일 embed URL 사용 가능 (Shorts 전용 embed는 베타).
- TikTok 임베드: oEmbed API 또는 `https://www.tiktok.com/embed/v2/<id>`.
- 자동재생: 모달 진입 시 muted autoplay → 사용자 인터랙션 후 음소거 해제.
- iframe `loading="lazy"` + IntersectionObserver, 화면 밖 카드는 placeholder 유지.

### 12.8 i18n 키 (KO / EN / JA)
- `community_highlights_title`
- `community_highlights_subtitle`
- `community_long_kicker`, `community_shorts_kicker`
- `community_prev`, `community_next`
- `sort_latest`, `sort_popular`
- `card_views_label` (예: "{count} views")
- `cta_open_on_youtube`, `cta_open_on_tiktok`, `cta_share`
- `empty_state_title`, `empty_state_action`
- 영상 `title`, `creator.name` 은 원본 유지 (번역 X).

### 12.9 작업 분해 (구현 현황)
- [x] `assets/towerfloodrace/videos.txt` 텍스트 파일 (URL 한 줄씩, 주석 지원)
- [x] `js/project-details/tower-flood-race-videos.js` 런타임 파싱 + oEmbed 보강 + localStorage 캐시 + 롱폼 그리드 + 숏폼 가로 스크롤러 + 모달
- [x] 기존 갤러리 데이터 제거 (`tower-flood-race.js` `gallery` 배열 삭제)
- [x] `tower-flood-race.html` 에 렌더러 스크립트 추가
- [x] CLI / JSON 데이터파일 / `add-video` npm 스크립트 제거
- [ ] 시드 URL 추가 (`videos.txt` 에 5~10개 붙여넣기)
- [ ] 데스크톱 / 태블릿 / 모바일 QA
- [ ] oEmbed CORS 동작 확인 (실패 시 fallback UI 만으로 충분한지 판단)

### 12.10 검증 체크리스트
- [ ] `videos.txt` 에 YouTube 일반/Shorts/TikTok URL 추가 후 새로고침 시 카드 렌더 확인
- [ ] 주석(`#`)·빈 줄·중복 URL 처리 정상
- [ ] 롱폼 그리드 16:9 + 숏폼 가로 스크롤러 9:16 레이아웃 정상
- [ ] YouTube 일반·Shorts·TikTok 임베드 재생 정상
- [ ] 모달 닫기(ESC / 배경 클릭 / × 버튼) 시 영상 정지
- [ ] oEmbed 응답으로 제목·작성자 보강 성공 (또는 실패 시 카드가 깨지지 않음)
- [ ] localStorage 캐시 hit/miss 정상 (동일 URL 재방문 시 즉시 표시)
- [ ] 외부 링크 `rel="noopener noreferrer"` 적용
- [ ] 가로 스크롤러 prev/next 버튼 동작 (양 끝에서 자동 hide), 터치 디바이스에서 버튼 미노출
- [ ] 키보드만으로 카드/모달 접근 가능

### 12.11 Open Questions
- oEmbed CORS 가 실제 운영 환경에서 안정적으로 동작하는가? (실패 시 카드 fallback 으로 충분한지 결정)
- TikTok 임베드 한국 IP 차단/지연 이슈 발생 시 대안 — 썸네일 + 외부 이동만으로 축소?
- 모달 내 prev/next 탐색 기능 포함 여부와 모바일 UX?

---

## 메모 / 결정 사항
-
