# 작업 03 — 모바일 프로젝트 상세 페이지 3종 추가

## 목표
`projects-mobile.html` (작업 01에서 생성) 카드 그리드에서 연결될 모바일 프로젝트 상세 페이지 3종을 신규로 추가한다.
- `sweet-forest.html` — Sweet Forest
- `mine-sweeper.html` — Mine Sweeper
- `star-reach.html` — Star Reach

## Placeholder 정책 (확정)
- **신규 페이지의 모든 텍스트는 더미(Lorem ipsum 스타일) 처리**, 이미지는 모두 **`images/nnn-logo.png` placeholder** 로 대체.
- 적용 범위: 3개 프로젝트의 description / overview / hero.tagline / highlights / features / snapshot / gallery alt 등 모든 표시 텍스트 + preview / main / gallery 이미지 경로.
- 적용 제외: 슬러그(`sweet-forest` / `mine-sweeper` / `star-reach`), 표시 제목(Sweet Forest / Mine Sweeper / Star Reach), 파일명, 스키마 키.
- **더미 텍스트 양식**:
  - 한국어: `"한국어 더미 텍스트입니다."`
  - 영어: `"Placeholder description for this project."`
  - 일본어: `"プレースホルダー説明です。"`
- 신규 이미지 파일은 만들지 않고 모든 참조를 `images/nnn-logo.png`로 통일. 추후 실제 이미지(`sf-*` / `ms-*` / `sr-*`) 준비되면 교체.
- `ctaButtons` / `links` 는 빈 배열로 시작 (실제 스토어 링크 미보유).

## 현재 상태 (확인 사항)
- `projects-mobile.html`은 작업 01의 산출물로 아직 생성 전. **본 작업은 작업 01 완료 후 또는 병행 진행**.
- `data/projects.json`에 `category === "mobile"` 항목이 0건 → 본 작업으로 3건 추가.
- 모바일 프로젝트용 이미지/HTML/JS는 모두 신규 생성.
- 기존 상세 페이지 패턴: `<body data-project-id="...">` + `js/project-details/<id>.js`에 `window.ProjectDetailConfigs[id]` 정의 → `js/project-detail.js`가 자동 렌더링.

## 변경 사항

### 1. 데이터 — `data/projects.json`에 3개 항목 추가
모든 항목 공통 필드:
- `category: "mobile"`
- `platform`: 결정 필요 (예: `"iOS / Android"`, `"iOS"`, `"Android"`)
- `mobilePlatform: ["ios", "android"]` 같은 신규 필드를 둘지 결정 (작업 01의 모바일 필터 옵션과 연동)
- `placeId`/`universeId`는 모바일에 부적합 → `null` 유지 또는 필드 제거. **결정 필요**.
- `reporting.collectMetrics: false` (모바일은 Roblox API 메트릭 수집 대상 아님)
- `reporting.includeInHeroProjectCount` / `includeInHeroVisitTotal`: `false` (Roblox 전용 hero 통계와 분리)
- `featured`: 기본 `false`, 필요 시 true로 변경
- `status`: `"development"` 기본 (실제 상태로 갱신)

#### 1-1. `sweet-forest`
```json
{
  "id": "sweet-forest",
  "title": { "ko": "Sweet Forest", "en": "Sweet Forest", "ja": "Sweet Forest" },
  "description": {
    "ko": "한국어 더미 텍스트입니다.",
    "en": "Placeholder description for this project.",
    "ja": "プレースホルダー説明です。"
  },
  "image": "images/nnn-logo.png",
  "detailPage": "sweet-forest.html",
  "category": "mobile",
  "status": "development",
  "featured": false,
  "launchDate": "(미정)",
  "platform": "iOS / Android",
  "mobilePlatform": ["ios", "android"],
  "client": "Internal Project",
  "technologies": ["(미정)"],
  "links": { "play": "", "trailer": "", "article": "", "appStore": "", "playStore": "" },
  "reporting": { "collectMetrics": false, "includeInHeroProjectCount": false, "includeInHeroVisitTotal": false },
  "metrics": { "visits": null, "playing": null, "favorites": null, "likeRatio": null, "updatedAt": null }
}
```

#### 1-2. `mine-sweeper`
- 위와 동일한 구조, `id: "mine-sweeper"`, `image: "images/nnn-logo.png"`, `detailPage: "mine-sweeper.html"`.
- 표시 제목: `"Mine Sweeper"` (한/영/일 동일).
- description / 이외 모든 콘텐츠는 §Placeholder 정책에 따라 더미.

#### 1-3. `star-reach`
- `id: "star-reach"`, `image: "images/nnn-logo.png"`, `detailPage: "star-reach.html"`.
- 표시 제목: `"Star Reach"` (한/영/일 동일).
- description / 이외 모든 콘텐츠는 §Placeholder 정책에 따라 더미.

### 2. 상세 페이지 HTML — 3개 신규
- 베이스 템플릿: `projects-roblox.html`에 연결되는 기존 상세 페이지(예: `tower-flood-race.html`) 또는 작업 02에서 정리한 `reset-tower.html`.
- 헤더 nav의 "프로젝트" 링크는 `projects-roblox.html`로 통일 (작업 01과 일관). 모바일 프로젝트 페이지지만 메인 진입점은 Roblox 페이지로.
- 단, 헤더 드롭다운(작업 01)이 적용되면 Mobile 항목으로 직접 이동 가능.
- `<body data-project-id="sweet-forest">` 등으로 식별자 부여.
- 메타(title/description/OG/twitter card) 각 프로젝트 전용으로 갱신.
- (선택) 모바일 프로젝트 상세 페이지에서는 Roblox 전용 요소(예: Roblox 게임 임베드, "PLAY ON ROBLOX" CTA)를 노출하지 않도록 템플릿 분기.

### 3. 상세 설정 JS — `js/project-details/<id>.js` 3개 신규
- `js/project-details/sweet-forest.js`
- `js/project-details/mine-sweeper.js`
- `js/project-details/star-reach.js`

각 파일 구조 (기존 Roblox 상세 설정과 동일):
```js
window.ProjectDetailConfigs = window.ProjectDetailConfigs || {};
window.ProjectDetailConfigs['<id>'] = {
  seo: { title: {...}, description: {...}, keywords: {...}, ogTitle: {...}, ogDescription: {...}, ogImage: '...' },
  hero: { title: {...}, tagline: {...}, status: {...}, genre: {...}, platform: {...} },
  ctaButtons: [],          // 모바일 스토어 링크가 있으면 추가
  media: { type: 'image', src: 'images/<prefix>-main.jpg', alt: {...} },
  overview: [ {...}, {...} ],
  highlights: [ {...} ],
  snapshot: { launch: {...}, status: {...}, client: {...}, stack: {...} },
  features: [ {...} ],
  links: [],               // 스토어 링크, 공식 사이트 등
  gallery: [ { src: '...', alt: {...} } ]
};
```
- `hero.platform`은 "Platform: iOS / Android" 처럼 모바일 표기.
- `ctaButtons`/`links`에 App Store / Google Play 링크 슬롯을 마련. 미출시 시 빈 배열.

### 4. 이미지 — placeholder 사용
- 본 작업에서는 **신규 이미지 파일을 생성하지 않고 모든 참조를 `images/nnn-logo.png`** 로 처리.
- 차후 실제 이미지가 준비되면 아래 prefix로 교체 (예약):
  | 프로젝트 | preview | main | gallery |
  |---|---|---|---|
  | sweet-forest | `images/sf-preview.jpg` | `images/sf-main.jpg` | `images/sf-gallery-0..N.jpg` |
  | mine-sweeper | `images/ms-preview.jpg` | `images/ms-main.jpg` | `images/ms-gallery-0..N.jpg` |
  | star-reach | `images/sr-preview.jpg` | `images/sr-main.jpg` | `images/sr-gallery-0..N.jpg` |

### 5. 모바일 페이지 카테고리 필터 연동 (작업 01과 결합)
- 작업 01에서 모바일 페이지 카테고리 필터를 **iOS / Android** 두 옵션으로 결정.
- 본 작업의 3개 프로젝트는 `mobilePlatform` 배열로 iOS/Android 분류.
- `js/project-renderer.js`의 모바일 스코프 분기에서 `mobilePlatform`을 카테고리 필터로 사용하도록 작업 01 §8 (렌더러 분기)에 반영.
- 본 작업 단계에서는 데이터 필드만 정확히 채우고, 필터 로직은 작업 01 작업자가 처리.

### 6. i18n 키 (선택)
- 각 프로젝트의 한/영/일 표시 텍스트는 상세 설정 JS 안에 인라인으로 들어가므로 i18n.js에 별도 키 추가는 **불필요**.
- 작업 01에서 추가하기로 한 모바일 빈 상태 카피는 본 작업으로 데이터 채워 넣으면 자동 비노출.

### 7. `js/project-detail.js` 분기 점검
- 현재 로더가 `category === 'roblox'`에 종속된 분기를 가지고 있는지 확인.
- 모바일 프로젝트에서 노출 불필요한 섹션(Roblox 게임 카드, Place ID, Visit/Favorite 메트릭 등)이 자동 숨김되는지 확인 후, 필요 시 카테고리 분기 추가.

## 영향 받는 파일
### 신규
- `sweet-forest.html`, `mine-sweeper.html`, `star-reach.html`
- `js/project-details/sweet-forest.js`, `mine-sweeper.js`, `star-reach.js`
- `images/sf-*.jpg`, `ms-*.jpg`, `sr-*.jpg` (preview/main/gallery 세트)

### 수정
- `data/projects.json` (3개 항목 추가)
- `js/project-detail.js` (필요 시 모바일 분기 추가)
- `js/project-renderer.js` (작업 01과 연동: `mobilePlatform` 기반 필터링)

### 의존성
- 작업 01 (`projects-mobile.html` 생성, 헤더 드롭다운, 렌더러 스코프 분기) 완료 후 또는 병행 시 카드 노출이 정상 동작.

## 작업 순서
1. 이미지 prefix 결정 및 placeholder 파일 배치 (실제 이미지 제공 전).
2. `data/projects.json`에 3개 항목(`sweet-forest`, `mine-sweeper`, `star-reach`) 추가.
3. `js/project-details/<id>.js` 3개 파일을 기존 Roblox 상세 설정 구조로 생성 (placeholder 텍스트).
4. 상세 페이지 HTML 3개 파일 생성 (`<body data-project-id="...">`만 다르게).
5. `js/project-detail.js` 분기 점검 및 필요 시 모바일 전용 처리 추가.
6. `projects-mobile.html`(작업 01) 완성 후 카드 노출 및 상세 진입 동선 브라우저 검증 (한/영/일).
7. 카테고리 필터(iOS / Android) 동작 확인.

## 결정 / 확인 필요
- **모바일 플랫폼 표기 방식**:
  - `platform` 단일 문자열(`"iOS / Android"`) vs 신규 `mobilePlatform: ["ios","android"]` 필드 추가.
  - 작업 01의 카테고리 필터(iOS/Android) 동작을 단순하게 하려면 **`mobilePlatform` 배열 필드 권장**.
- **`placeId`/`universeId` 필드**: 모바일 항목에서 `null` 유지 vs 필드 제거. 권장: `null` 유지(스키마 일관성).
- **콘텐츠/이미지**: 모두 **더미 텍스트 + `images/nnn-logo.png`** (확정).
- **CTA 버튼**: 빈 배열로 시작 (확정).
- **상세 페이지의 Roblox 전용 요소 노출 여부**: 모바일 페이지에서는 자동 숨김 처리 필요.
- **`featured` 플래그**: 모바일 프로젝트가 홈/대표 영역에 노출되어야 하는지.
