# 작업 05 — Roblox 신규 프로젝트 상세 페이지 추가 (universeId `8296982488`)

## 목표
Roblox 크리에이터 대시보드 URL `https://create.roblox.com/dashboard/creations/experiences/8296982488/` 에 해당하는 신규 프로젝트를 사이트에 추가한다.
- `data/projects.json`에 항목 추가 (Roblox 카테고리)
- 상세 페이지 HTML / 상세 설정 JS / 이미지 세트 신규 생성
- `projects-roblox.html` 카드 그리드에 노출 + 지표 자동 집계 대상으로 등록

## Placeholder 정책 (확정)
- **신규 페이지의 모든 표시 텍스트는 더미 처리**, **모든 이미지 참조는 `images/nnn-logo.png`** 로 통일.
- 적용 범위: title / description / overview / hero.tagline / highlights / features / snapshot / gallery alt / seo 메타 등.
- 적용 제외: 식별자(`id`, 슬러그), 파일명, 스키마 키, `universeId: "8296982488"` (실제 값), 자동 집계되는 `metrics` 필드.
- **더미 텍스트 양식**:
  - 한국어: `"한국어 더미 텍스트입니다."`
  - 영어: `"Placeholder description for this project."`
  - 일본어: `"プレースホルダー説明です。"`
- 표시 제목은 임시로 `"New Roblox Project"` (한/영/일 동일) 사용. 실제 게임명 확정 시 교체.
- `placeId`/`links.play`/`ctaButtons` 등 외부 자원 의존 항목은 빈 값 또는 비활성으로 유지.
- 본 작업에서는 **Roblox 공개 API 호출을 통한 자동 콘텐츠 추출 단계도 수행하지 않음** — 정책에 따라 더미만 채움.

## 현재 상태 (확인 사항)
- 대시보드 URL의 ID `8296982488`은 **universeId** (Roblox 대시보드는 universe 단위로 experience를 표시).
- 공개 게임 URL(`https://www.roblox.com/games/{placeId}`)에 필요한 `placeId`는 **별도로 확보 필요**.
- 프로젝트의 슬러그/표시명/설명/장르/이미지 등 모든 콘텐츠 정보는 미정 → 사용자 제공 또는 Roblox 공개 API로 획득.
- `scripts/update-metrics.js`는 `universeId`가 있고 `reporting.collectMetrics: true`(또는 `status: "active"` 기본값) 인 항목에 대해 자동으로 visits/playing/favorites/likeRatio를 갱신.

## 미정 / 사용자 제공 필요 (Placeholder 정책으로 모두 더미 처리)
| 항목 | 메모 | 더미/Placeholder |
|---|---|---|
| 프로젝트 슬러그(`id`) | 파일명·식별자에 사용 | `new-roblox-project` (또는 `project-8296982488`) |
| 표시 제목 (한/영/일) | hero.title, seo.title 등 | `New Roblox Project` |
| 설명·태그라인 | overview, hero.tagline | 더미 텍스트 (한/영/일) |
| 장르 / 기술 스택 | hero.genre, technologies | 더미 (예: "Genre: TBD", `["Roblox Studio", "Luau"]`) |
| `placeId` | 공개 게임 URL 구성용 | `null` |
| 출시/개발 상태 | `status`: active / development | `development` |
| `launchDate` | YYYY-MM | `(미정)` |
| 이미지 | preview / main / gallery | **`images/nnn-logo.png`** |
| `featured` 여부 | hero summary 노출 | `false` |
| 트레일러 / 그룹 / showcase 링크 | links | 빈 문자열 |

> Roblox 공개 API로 자동 추출하던 단계는 본 작업에서 수행하지 않음. 정책상 더미로만 채움. 단, **`metrics` 필드는 `scripts/update-metrics.js`가 universeId 기반으로 자동 채움** (이는 정책 적용 제외 항목).

## 변경 사항

### 1. 데이터 — `data/projects.json` 항목 추가
```json
{
  "id": "new-roblox-project",
  "title": { "ko": "New Roblox Project", "en": "New Roblox Project", "ja": "New Roblox Project" },
  "description": {
    "ko": "한국어 더미 텍스트입니다.",
    "en": "Placeholder description for this project.",
    "ja": "プレースホルダー説明です。"
  },
  "image": "images/nnn-logo.png",
  "detailPage": "new-roblox-project.html",
  "category": "roblox",
  "status": "development",
  "featured": false,
  "launchDate": "(미정)",
  "platform": "Roblox",
  "client": "Internal Project",
  "technologies": ["Roblox Studio", "Luau"],
  "placeId": null,
  "universeId": "8296982488",
  "links": { "play": "", "trailer": "", "article": "", "group": "", "showcase": "" },
  "reporting": {
    "collectMetrics": true,
    "includeInHeroProjectCount": false,
    "includeInHeroVisitTotal": false
  },
  "metrics": { "visits": null, "playing": null, "favorites": null, "likeRatio": null, "updatedAt": null }
}
```
- `universeId: "8296982488"` 으로 설정해 다음 `update-metrics.js` 실행 시 자동 집계.
- `status`가 `development`인 동안에는 `reporting.includeInHero*`를 false로 두어 hero 통계 왜곡 방지. 정식 출시 시 `active`로 전환하고 hero 포함 여부 결정.
- `showInProjectsList` / `showDetailLinkInProjects`는 기본값(true)으로 두어 카드 + 상세 링크 노출.

### 2. 상세 페이지 HTML — `new-roblox-project.html`
- `tower-flood-race.html`을 베이스로 복제.
- `<body data-project-id="new-roblox-project">` 로 변경.
- 메타(title/description/OG/twitter) 모두 더미 텍스트로 채움.
- 헤더 nav "프로젝트" 링크는 `projects-roblox.html`로 (작업 01과 일관).

### 3. 상세 설정 JS — `js/project-details/new-roblox-project.js`
- `js/project-details/tower-flood-race.js`를 베이스로 복제.
- 키 `window.ProjectDetailConfigs['new-roblox-project']`로 변경.
- 섹션: `seo`, `hero`, `ctaButtons`, `media`, `overview`, `highlights`, `snapshot`, `features`, `links`, `gallery`.
- 모든 표시 텍스트를 §Placeholder 정책 양식의 더미로 채움.
- `media.src` 및 `gallery[].src`는 모두 `images/nnn-logo.png`.
- `ctaButtons` / `links`는 빈 배열로 시작.

### 4. 이미지 — placeholder 사용
- 신규 이미지 파일을 만들지 않고 **모든 참조를 `images/nnn-logo.png`** 로 처리.

### 5. 지표 집계 자동 반영 — `scripts/update-metrics.js`
- 코드 변경 **불필요**. `projects.json`에 `universeId`+`reporting.collectMetrics: true` 조건이면 자동 수집.
- 작업 후 다음 명령으로 즉시 갱신 가능:
  ```
  node scripts/update-metrics.js
  ```
- 결과: `metrics.visits/playing/favorites/likeRatio/updatedAt` 자동 채움.

### 6. Hero/Summary 영향 점검
- `data/projects.json`의 `summary.hero.projectCount` / `totalVisits` 는 `reporting.includeInHero*`가 true인 active 프로젝트 합. 본 신규 항목은 `development`로 시작하므로 영향 없음.
- 정식 출시 후 `status: "active"` + `includeInHero* : true`로 전환할 때 hero 카운트가 +1, totalVisits에 합산됨.

### 7. `projects-roblox.html` 카드 노출
- `category: "roblox"` 이므로 작업 01에서 만든 Roblox 페이지의 카드 그리드에 자동 노출.
- 노출 순서는 `js/project-renderer.js`의 `projectDisplayOrder` 배열로 제어 → 신규 슬러그를 원하는 위치에 추가할지 결정.

## 영향 받는 파일
### 신규
- `<slug>.html`
- `js/project-details/<slug>.js`
- `images/<prefix>-preview.jpg`, `<prefix>-main.jpg`, `<prefix>-gallery-*.jpg` (이미지 준비 전까지 placeholder)

### 수정
- `data/projects.json` (항목 1건 추가)
- `js/project-renderer.js`의 `projectDisplayOrder` 배열 (선택, 노출 순서 제어 시)

### 변경 불필요
- `scripts/update-metrics.js` — 데이터 기반 동작.
- `js/project-detail.js` — `ProjectDetailConfigs`에 키만 추가하면 자동 렌더.

## 작업 순서
1. 슬러그 확정 (기본: `new-roblox-project`).
2. `data/projects.json`에 항목 추가 (universeId `8296982488`, 더미 텍스트, `image: images/nnn-logo.png`).
3. `new-roblox-project.html` 생성 (`tower-flood-race.html` 템플릿 베이스, `data-project-id` 변경, 메타 더미 텍스트).
4. `js/project-details/new-roblox-project.js` 생성 (`tower-flood-race.js` 템플릿 베이스, 모든 표시 텍스트 더미, 모든 이미지 경로 `images/nnn-logo.png`).
5. `node scripts/update-metrics.js` 실행 → `metrics` 자동 채움 확인.
6. `projects-roblox.html` 브라우저 검증: 카드 노출, 카드 클릭 시 상세 페이지 정상, 한/영/일 모두 표기.
7. (선택) `js/project-renderer.js`의 `projectDisplayOrder`에 신규 슬러그 추가하여 노출 순서 조정.

## 결정 / 확인 필요
- **슬러그(`id`)**: 기본 `new-roblox-project`로 진행. 다른 이름이면 알려주세요.
- **콘텐츠/이미지**: 모두 **더미 텍스트 + `images/nnn-logo.png`** (확정).
- **상태**: `development` 시작 (확정).
- **`featured` / hero 포함 여부**: false (확정, 정식 출시 시 재검토).
- **노출 순서**: `projectDisplayOrder` 끝에 추가 (또는 미추가).
- **`reporting.collectMetrics`**: `true` (universeId 기반 자동 수집).
