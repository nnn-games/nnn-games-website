# 작업 02 — `watermelon-farm` 신규 추가 / `great-tower-reset` → `reset-tower` 이름 변경

## 목표
1. **`watermelon-farm`** 프로젝트를 신규로 추가하여 `projects-roblox.html`의 카드 그리드에 노출하고, 별도 상세 페이지로 연결한다.
2. 기존 **`great-tower-reset`** 프로젝트의 식별자/파일명을 **`reset-tower`** 로 변경한다 (게임 표시 제목은 별도 결정 항목).

## Placeholder 정책 (확정)
- **신규 페이지의 모든 텍스트는 더미(Lorem ipsum 스타일) 처리**, 이미지는 모두 **placeholder 이미지로 대체**.
- 적용 대상: `watermelon-farm` 신규 항목의 description / overview / hero.tagline / highlights / features / snapshot / gallery alt 등 모든 표시 텍스트.
- 적용 제외: 식별자(`id`, 슬러그), 파일명, 스키마 키, URL, 코드 구조.
- **Placeholder 이미지**: `images/nnn-logo.png` (전 페이지 공통 fallback).
- **더미 텍스트 양식**:
  - 한국어: `"한국어 더미 텍스트입니다."` 또는 `"여기에 설명이 들어갑니다."`
  - 영어: `"Placeholder description for this project."`
  - 일본어: `"プレースホルダー説明です。"`
- 표시 제목은 그대로 사용 (예: "Watermelon Farm").
- `reset-tower` 이름 변경 시 기존 콘텐츠는 그대로 유지(더미로 교체하지 않음). 단, 표시 제목을 "Reset Tower"로 통합하기로 한 부분만 적용.

## 현재 상태 (확인 사항)
- `data/projects.json`의 7개 항목 중 `great-tower-reset` (id), `images/gt-*.jpg` (이미지 7장), `great-tower-reset.html` (상세 페이지), `js/project-details/great-tower-reset.js` (상세 설정) 가 한 세트.
- `great-tower-reset`은 `showInProjectsList: false`, `showDetailLinkInProjects: false`로 되어 있어 현재는 카드 그리드에 노출되지 않음.
- `watermelon-farm` 관련 이미지/HTML/JS/데이터는 **존재하지 않음** → 모두 신규 생성.
- `images/` 디렉터리에 `slimesanctum-*` 이미지 세트가 있으나 `projects.json`에는 없음 (이번 작업 범위 외).

## 변경 사항

### A. `watermelon-farm` 신규 추가

#### 1. 데이터 — `data/projects.json` 항목 추가
```json
{
  "id": "watermelon-farm",
  "title": { "ko": "Watermelon Farm", "en": "Watermelon Farm", "ja": "Watermelon Farm" },
  "description": {
    "ko": "한국어 더미 텍스트입니다.",
    "en": "Placeholder description for this project.",
    "ja": "プレースホルダー説明です。"
  },
  "image": "images/nnn-logo.png",
  "detailPage": "watermelon-farm.html",
  "category": "roblox",
  "status": "development",            // 또는 "active" — 결정 필요
  "featured": false,
  "launchDate": "(미정)",
  "platform": "Roblox",
  "client": "Internal Project",
  "technologies": ["Roblox Studio", "Luau"],
  "placeId": null,
  "universeId": null,
  "links": { "play": "", "trailer": "", "article": "", "group": "", "showcase": "" },
  "reporting": {
    "collectMetrics": false,
    "includeInHeroProjectCount": false,
    "includeInHeroVisitTotal": false
  },
  "metrics": { "visits": null, "playing": null, "favorites": null, "likeRatio": null, "updatedAt": null }
}
```
- `showInProjectsList` / `showDetailLinkInProjects`는 기본값(true)으로 두어 카드 + 상세 링크 모두 노출.
- 향후 정식 출시 시 `status`, `placeId`, `universeId`, `links`, `reporting` 갱신.

#### 2. 상세 페이지 HTML — `watermelon-farm.html`
- `great-tower-reset.html` (또는 `reset-tower.html`) 을 베이스 템플릿으로 복제.
- `<body data-project-id="watermelon-farm">` 로 변경.
- 메타(title/description/OG/twitter card) Watermelon Farm 전용으로 갱신.
- 헤더 nav의 "프로젝트" 링크는 `projects-roblox.html`로 (작업 01과 일관).

#### 3. 상세 설정 JS — `js/project-details/watermelon-farm.js`
- `great-tower-reset.js`를 베이스로 복제 후 키를 `'watermelon-farm'`으로 변경.
- 필요 섹션: `seo`, `hero`, `ctaButtons`, `media`, `overview`, `highlights`, `snapshot`, `features`, `links`, `gallery`.
- **모든 텍스트는 더미로 채움** (한/영/일 §Placeholder 정책 양식 사용).
- **모든 이미지 경로는 `images/nnn-logo.png`** 로 통일.
- `ctaButtons`/`links`는 빈 배열로 시작 (실제 링크 미보유).

#### 4. 이미지 — placeholder 사용
- 신규 이미지 파일을 만들지 않고 **모든 참조를 `images/nnn-logo.png`** 로 처리.
- 차후 실제 이미지가 준비되면 `images/wm-preview.jpg` / `wm-main.jpg` / `wm-gallery-*.jpg` 로 교체.

#### 5. 상세 페이지 로더 점검 — `js/project-detail.js`
- 새 id에 대한 별도 로직이 필요한지 확인. `window.ProjectDetailConfigs[id]`만 정의되면 자동 동작하는 구조라면 추가 작업 불필요.

#### 6. 인덱스/홈 노출 (선택)
- `index.html` 의 홈 미리보기에 노출할지 여부 결정. 노출 시 `reporting.includeInHomePreview: true` 추가.

### B. `great-tower-reset` → `reset-tower` 이름 변경

#### 1. 파일 이동 (`git mv`)
```
git mv great-tower-reset.html reset-tower.html
git mv js/project-details/great-tower-reset.js js/project-details/reset-tower.js
```
- 이미지 파일(`images/gt-*.jpg`)을 `rt-*.jpg`로 함께 변경할지는 **결정 필요** (아래 §B-5 참조).

#### 2. `data/projects.json` 갱신
- `id`: `"great-tower-reset"` → `"reset-tower"`
- `detailPage`: `"great-tower-reset.html"` → `"reset-tower.html"`
- `image`: 이미지 prefix 변경 시 `"images/rt-preview.jpg"`로.
- `title` 필드의 표시명("The Great Tower Reset")을 그대로 둘지 "Reset Tower"로 바꿀지 **결정 필요**.

#### 3. JS 상세 설정 키 갱신 — `js/project-details/reset-tower.js`
- `window.ProjectDetailConfigs['great-tower-reset']` → `window.ProjectDetailConfigs['reset-tower']`
- 내부 `seo.title`, `hero.title`, `media.alt`, `overview`, `gallery` 등 표시 텍스트 변경 여부는 §B-2의 표시명 결정에 따름.

#### 4. HTML 갱신 — `reset-tower.html`
- `<body data-project-id="great-tower-reset">` → `<body data-project-id="reset-tower">`
- 헤더 nav의 "프로젝트" 링크를 `projects-roblox.html`로 (작업 01과 함께 처리).

#### 5. 이미지 prefix 정책 — 결정 필요
- **옵션 A (권장)**: `images/gt-*.jpg` → `images/rt-*.jpg` 로 일괄 `git mv`. 코드/데이터의 모든 참조를 동시에 갱신.
- **옵션 B**: 이미지 파일명은 유지(`gt-*`). 코드/데이터에서는 새 id(`reset-tower`)를 쓰지만 이미지 prefix는 history로 남김.
- 옵션 A는 깔끔하지만 변경 면적이 큼. 옵션 B는 일관성이 떨어지지만 작업이 단순.

#### 6. 표시명 정책 — 결정 필요
- **옵션 A**: 식별자만 `reset-tower`로 변경, 표시 제목은 "The Great Tower Reset" 유지.
- **옵션 B**: 표시 제목도 "Reset Tower"로 동시 변경 (한/영/일 모두).
- 본 작업은 "프로젝트명 reset-tower로 수정" 요청에 따라 **옵션 B (표시명까지 변경)** 를 기본으로 진행.

#### 7. `showInProjectsList` 정책
- 현재 `false`로 카드 그리드에 미노출. 사용자 요청("projects-roblox에 연결될 카드 추가")에 따라 **`true`로 변경**하여 노출.
- `showDetailLinkInProjects`도 `true`로 변경.

#### 8. 외부 참조 점검
- 다른 페이지/스크립트에서 `great-tower-reset` 문자열을 참조하는 곳이 있는지 grep으로 확인 후 모두 갱신.
- 검색엔진 인입은 작업 01과 동일하게 SEO 404 감수.

## 영향 받는 파일
### 신규
- `watermelon-farm.html`
- `js/project-details/watermelon-farm.js`
- `images/wm-preview.jpg`, `wm-main.jpg`, `wm-gallery-*.jpg` (이미지 준비 전까지는 placeholder)

### 이름 변경
- `great-tower-reset.html` → `reset-tower.html`
- `js/project-details/great-tower-reset.js` → `js/project-details/reset-tower.js`
- (옵션 A 선택 시) `images/gt-*.jpg` → `images/rt-*.jpg`

### 수정
- `data/projects.json` (watermelon-farm 항목 추가, great-tower-reset → reset-tower 갱신, 이미지 경로/표시명/노출 플래그)
- 사이트 전반에서 `great-tower-reset` 문자열을 참조하는 모든 파일 (grep으로 식별)
- `images/`에서 prefix 변경 시 모든 파일 참조

### 작업 01 의존성
- 헤더 nav의 "프로젝트" 링크를 `projects-roblox.html`로 일괄 변경하는 작업과 충돌하지 않도록 순서 조율.
- 신규 생성하는 `watermelon-farm.html`과 이름 변경된 `reset-tower.html`은 처음부터 `projects-roblox.html` 링크 사용.

## 작업 순서
1. `git mv great-tower-reset.html reset-tower.html`
2. `git mv js/project-details/great-tower-reset.js js/project-details/reset-tower.js`
3. (이미지 prefix 변경 결정 시) `git mv images/gt-*.jpg images/rt-*.jpg` 일괄 처리
4. `reset-tower.html` 내부 `data-project-id` 등 참조 갱신
5. `js/project-details/reset-tower.js`의 키와 표시명 갱신
6. `data/projects.json`에서 `great-tower-reset` → `reset-tower` 갱신, `showInProjectsList`/`showDetailLinkInProjects`를 `true`로
7. `grep -r great-tower-reset` 결과로 누락된 참조 일괄 수정
8. `watermelon-farm.html` / `js/project-details/watermelon-farm.js` 생성 (`reset-tower` 템플릿 베이스)
9. `images/wm-*` placeholder 또는 실제 이미지 배치
10. `data/projects.json`에 `watermelon-farm` 항목 추가
11. `projects-roblox.html` 브라우저 확인: 두 카드 모두 노출, 클릭 시 상세 페이지 정상 진입, 한/영/일 모두 표시 정상

## 결정 / 확인 필요
- **B-5 이미지 prefix**: `gt-*` → `rt-*` 일괄 변경 vs 유지. 권장: **변경 (옵션 A)** 일관성 확보.
- **B-6 표시명**: "The Great Tower Reset" 유지 vs "Reset Tower"로 통합 변경. 기본: **Reset Tower로 통합** (식별자와 일치).
- **A-1 watermelon-farm status**: `development` / `active` 중 선택. 기본: `development`.
- **A-1 콘텐츠**: 모두 **더미 텍스트** (확정).
- **A-4 이미지**: 모두 **`images/nnn-logo.png` placeholder** (확정).
- **B-7 great-tower-reset 노출 정책**: `showInProjectsList`를 true로 바꾸면 hero summary(`projectCount`, `totalVisits`)에 영향 가능 — `reporting.includeInHero*`는 false 유지로 무영향.
