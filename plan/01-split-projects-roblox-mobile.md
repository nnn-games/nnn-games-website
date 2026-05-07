# 작업 01 — 프로젝트 페이지 분할 (Roblox / Mobile)

## 최종 목표
프로젝트 페이지를 **Roblox**와 **Mobile** 두 개로 분할하고, 상단 네비게이션 "프로젝트" 메뉴에서 양쪽으로 진입할 수 있도록 한다.
- 데스크톱: "프로젝트" 메뉴에 **hover** 하면 헤더 바로 아래에 **드롭다운**으로 `Roblox` / `Mobile` 두 항목을 노출.
- 모바일: 햄버거 메뉴를 열면 "프로젝트" 하위에 두 항목이 펼쳐짐.
- Roblox 페이지 / Mobile 페이지 자체에도 헤더 아래 드롭다운(또는 탭) 형태의 카테고리 스위처를 동일하게 둔다.

## 최종 결정 사항 (확정)
| 항목 | 결정 |
|---|---|
| 데스크톱 hover 드롭다운 | **노출** (Roblox / Mobile 두 항목) |
| 모바일 페이지 카테고리 필터 옵션 | **iOS / Android** 두 옵션만 |
| 모바일 페이지 UGC 섹션 | **노출 안 함** (제거) |
| 탭/스위처 위치 | **헤더 아래 드롭다운** 형태 |
| 기존 `projects.html` 처리 | **삭제** (리다이렉트 stub 두지 않음) |
| 외부 인입 SEO 404 | **감수** (별도 리다이렉트 처리 안 함) |

## 결과물 (Deliverables)
### 신규/변경 파일
- `projects-roblox.html` — 기존 `projects.html`을 `git mv`로 이전. 메타·헤더 텍스트를 Roblox 전용으로 갱신. UGC 섹션 유지.
- `projects-mobile.html` — 신규. 모바일 프로젝트 전용 페이지. 카테고리 필터는 iOS / Android. UGC 섹션 없음. 데이터 없을 때 빈 상태 카피 노출.
- `projects.html` — 삭제 (이름 변경으로 사라짐).

### 공통 컴포넌트
- 헤더의 "프로젝트" 메뉴: 데스크톱 hover 드롭다운(Roblox / Mobile), 모바일 햄버거 펼침.
- 페이지 상단(헤더 바로 아래)의 카테고리 스위처: 두 페이지 모두 동일한 드롭다운/탭 컴포넌트.
- 활성 페이지에 해당하는 항목은 시각적으로 active 처리.

### 데이터/렌더러
- `data/projects.json` 스키마 변경 없음. `category` 값으로 `roblox` / `mobile` 분리. 모바일 데이터는 추후 추가.
- `js/project-renderer.js`: 페이지 스코프(`roblox` / `mobile`) 분기. `<body data-projects-scope="...">` 속성으로 식별.

### i18n (`js/i18n.js`)
신규 키:
- `nav_projects_roblox` → "Roblox" / "Roblox" / "Roblox"
- `nav_projects_mobile` → "모바일" / "Mobile" / "モバイル"
- `projects_roblox_page_title` → "Roblox 프로젝트 - NNN GAMES" / "Roblox Projects - NNN GAMES" / "Robloxプロジェクト - NNN GAMES"
- `projects_roblox_page_header` → "Roblox 프로젝트" / "Roblox Projects" / "Robloxプロジェクト"
- `projects_mobile_page_title` → "모바일 프로젝트 - NNN GAMES" / "Mobile Projects - NNN GAMES" / "モバイルプロジェクト - NNN GAMES"
- `projects_mobile_page_header` → "모바일 프로젝트" / "Mobile Projects" / "モバイルプロジェクト"
- `projects_mobile_filter_ios` → "iOS"
- `projects_mobile_filter_android` → "Android"
- `projects_mobile_empty_state` → 빈 상태 안내 문구 (3개 언어)

### 사이트 전역 링크 갱신 (13개 파일)
모든 `projects.html` 참조를 `projects-roblox.html`로 치환:
- HTML: `index.html`, `contact.html`, `nnn-ugc.html`, `tower-flood-race.html`, `korean-spa.html`, `legendary-dj-gear.html`, `fruit-battles.html`, `great-tower-reset.html`, `hacker-vs-security.html`, `projects-roblox.html`(self)
- JS: `js/project-detail.js`
- Docs: `docs/prd.md`, `docs/guideline.md`

## 헤더/드롭다운 구조 (확정안)

### 데스크톱 — main nav 드롭다운
```html
<nav class="main-nav">
  <ul>
    <li><a href="index.html" data-key="nav_home">홈</a></li>
    <li class="has-dropdown">
      <a href="projects-roblox.html" data-key="nav_projects">프로젝트</a>
      <ul class="nav-dropdown">
        <li><a href="projects-roblox.html" data-key="nav_projects_roblox">Roblox</a></li>
        <li><a href="projects-mobile.html" data-key="nav_projects_mobile">Mobile</a></li>
      </ul>
    </li>
    <li><a href="contact.html" data-key="nav_contact">문의</a></li>
    ...
  </ul>
</nav>
```
- `.has-dropdown:hover .nav-dropdown { display: block }` (CSS only)
- `.nav-dropdown`은 헤더 바로 아래에 absolute 포지셔닝.
- 키보드 접근성: `:focus-within`도 동일하게 처리.

### 모바일 — 햄버거 메뉴
- 햄버거 펼침 시 "프로젝트" 항목 아래에 들여쓰기된 두 항목(Roblox / Mobile) 직접 노출.
- 별도 토글 없이 항상 펼친 상태로 보여 단순화.

### 페이지 내 카테고리 스위처 (두 페이지 공통)
페이지 헤더(`<section class="page-header">`) 바로 아래에 동일한 드롭다운/탭 영역을 둔다.
```html
<section class="projects-switcher container">
  <a href="projects-roblox.html" class="projects-switch-tab active">Roblox</a>
  <a href="projects-mobile.html" class="projects-switch-tab">Mobile</a>
</section>
```
- 자기 페이지 항목에 `active` 클래스.
- CSS: `css/style.css`에 `.projects-switcher`, `.projects-switch-tab`, `.projects-switch-tab.active` 추가.
- 활성 탭은 브랜드 컬러 언더라인 + 굵은 글씨.

## 작업 순서

### 완료
- [x] `git mv projects.html projects-roblox.html`

### 남은 작업
1. **링크 일괄 치환** — 13개 파일의 `projects.html` → `projects-roblox.html`.
2. **`projects-roblox.html` 정리** — 메타(title/description/OG/twitter), 헤더 H1을 Roblox 전용으로 갱신. `<body data-projects-scope="roblox">` 부여.
3. **`projects-mobile.html` 생성** — `projects-roblox.html` 복제 후:
   - 메타·헤더 텍스트 모바일 전용으로 교체.
   - UGC 섹션(`#specialProjectSection`) 제거.
   - 카테고리 필터를 iOS / Android 두 옵션만 노출.
   - `<body data-projects-scope="mobile">` 부여.
   - 빈 상태 카피 노출.
4. **헤더 드롭다운 구현** — 모든 페이지 헤더에 `.has-dropdown`/`.nav-dropdown` 구조 적용. CSS 추가. 모바일 햄버거 펼침 동작 확인.
5. **페이지 내 카테고리 스위처 구현** — `projects-roblox.html` / `projects-mobile.html` 헤더 아래에 추가. CSS 추가.
6. **렌더러 분기** — `js/project-renderer.js`에서 `body[data-projects-scope]` 읽고 해당 카테고리만 렌더링. 카테고리 필터 옵션도 스코프별로 분리.
7. **i18n 키 추가** — `js/i18n.js`에 신규 키 한/영/일 3개 언어 모두 추가.
8. **수동 테스트** — 한·영·일 모두에서 헤더 드롭다운, 페이지 내 스위처, 빈 상태 노출, 모든 링크 연결을 브라우저에서 확인.

## 영향 받는 파일 (요약)
- `projects.html` (삭제됨)
- `projects-roblox.html` (이름 변경 + 정리)
- `projects-mobile.html` (신규)
- `css/style.css` (드롭다운 + 스위처 스타일)
- `js/i18n.js` (번역 키 추가)
- `js/project-renderer.js` (스코프 분기, 필터 옵션 분리)
- `js/main.js` (필요 시 모바일 햄버거 동작 보강)
- `js/project-detail.js`, `js/project-details/*` (목록 링크 갱신)
- `index.html`, `contact.html`, `nnn-ugc.html`, 5개 게임 상세 페이지 (헤더/푸터 링크 + 드롭다운)
- `docs/prd.md`, `docs/guideline.md` (참조 갱신)
- `data/projects.json` (스키마 유지, mobile 항목 추후 추가)
