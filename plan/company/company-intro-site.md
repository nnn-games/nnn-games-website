# 회사 소개 페이지(`/nnn`) 구축 기획서

> 원본: `plan/company/company_intro.pdf` (8슬라이드, 16:9)
> 확장: 원본 ABOUT 슬라이드 뒤에 **People / History** 2장을 신규 추가 → 총 10슬라이드
> 산출물: `https://www.triplengames.com/nnn` 로 접근하는 파워포인트 형식의 회사 소개 페이지
> 노출 텍스트는 KO / EN / JA 3개 언어를 모두 채운다.

---

## 0. 요구사항 요약

| 항목 | 내용 |
|---|---|
| 접근 경로 | `https://www.triplengames.com/nnn` (직접 입력해야만 접근) |
| 기존 사이트 연결 | **없음** — 헤더/푸터/사이트맵/네비게이션 어디에도 링크하지 않음 |
| 표현 형식 | PPT 형식(1화면 = 1슬라이드), "다음" 버튼으로 페이지 전환 |
| 다국어 | KO / EN / JA, 사이트 언어 설정에 맞춰 자동 적용 |
| 슬라이드 수 | **10장** = 원본 PDF 8장 + 신규 People / History 2장 (ABOUT 다음 위치) |

---

## 1. 라우팅 / 배포

현재 저장소는 GitHub Pages 정적 호스팅(`CNAME` = `www.triplengames.com`)이며 빌드 툴이 없다. 따라서 **디렉터리 인덱스 방식**을 사용한다.

```
nnn/
  index.html      ← /nnn 및 /nnn/ 모두 이 파일로 서빙됨
  deck.css        ← 슬라이드 전용 스타일 (Tailwind 빌드와 분리)
  deck.js         ← 슬라이드 전환 / 언어 / 키보드 / 스와이프 컨트롤러
  slides.js       ← 슬라이드 콘텐츠 데이터 (KO/EN/JA)
  assets/         ← 슬라이드 이미지 (PDF에서 추출)
```

- GitHub Pages는 `/nnn` 요청을 `/nnn/`으로 301 리다이렉트한 뒤 `index.html`을 제공한다. 별도 서버 설정 불필요.
- 상대 경로가 한 단계 깊어지므로 공용 에셋 참조 시 `../images/...` 형태를 사용한다. 다만 아래 "독립성" 원칙에 따라 슬라이드 에셋은 `nnn/assets/`에 자체 보관한다.
- `css/style.css`(Tailwind 빌드 산출물)는 **불러오지 않는다**. 본 페이지는 기존 사이트 레이아웃(헤더/푸터/컨테이너)을 쓰지 않는 완전 독립 화면이므로 `deck.css` 하나로 끝낸다. `tailwind.config.js`의 content 경로도 건드리지 않는다.

### 검색 노출 차단
"직접 입력해야만 확인 가능"이라는 요구사항을 충족하려면 링크 부재만으로는 부족하다.

- `<meta name="robots" content="noindex, nofollow">`
- 루트에 `robots.txt`가 없다면 생성하고 `Disallow: /nnn/` 추가 (선택, noindex와 병행 시 크롤 차단으로 noindex가 안 읽힐 수 있으므로 **noindex 메타만 사용하는 쪽을 권장**)
- `sitemap.xml`이 추가되더라도 `/nnn`은 제외

---

## 2. 언어 처리

기존 `js/i18n.js`는 `localStorage.getItem('language')`(값: `ko`|`en`|`ja`)에 언어를 저장한다. 이 키를 **그대로 공유**하여 "사이트 설정에 맞춰 자동" 요구를 만족시킨다.

언어 결정 순서:
1. URL 쿼리 `?lang=ko|en|ja` (공유용 강제 지정)
2. `localStorage.language` (기존 사이트에서 선택한 값)
3. `navigator.language` 접두사 매칭 (`ko*`→ko, `ja*`→ja, 그 외→en)
4. 폴백: `ko`

- `js/i18n.js`를 그대로 로드하지는 않는다(사이트 전용 키가 대부분이고 DOM 훅이 헤더/푸터를 전제로 함). 대신 `deck.js`가 위 로직만 재구현하고 저장 키만 공유한다.
- 슬라이드 우측 상단에 `KO | EN | JA` 미니 스위처를 두고, 변경 시 `localStorage.language`에 기록 → 기존 사이트로 이동해도 언어가 유지된다.
- 언어 전환은 **슬라이드 위치를 유지한 채** 텍스트만 교체한다.
- `<html lang>` 속성을 선택 언어로 동기화.
- 폰트: 기존 사이트와 동일하게 `Inter` + `Noto Sans KR` + `Noto Sans JP` + `Poppins`를 Google Fonts에서 로드.

---

## 3. 슬라이드 UX 사양

### 전환
- 기본 조작: 화면 우하단 **`다음 →`** 버튼 (요구사항 핵심). 좌측에 `← 이전` 버튼.
- 첫 슬라이드에서 `이전` 비활성, 마지막 슬라이드에서 `다음` 비활성(또는 "처음으로" 로 전환).
- 보조 조작
  - 키보드: `→`/`Space`/`PageDown` = 다음, `←`/`PageUp` = 이전, `Home`/`End` = 처음/끝
  - 모바일: 좌우 스와이프(수평 이동 > 60px, 수직 이동보다 클 때만)
  - 하단 도트 인디케이터 클릭 → 해당 슬라이드로 점프
- 전환 애니메이션: 200ms 크로스페이드 + 8px 슬라이드업. `prefers-reduced-motion: reduce` 시 애니메이션 제거.

### 상태 / 딥링크
- URL 해시 `#/2` 형태로 현재 슬라이드 반영 (`history.replaceState`, 뒤로가기 오염 방지)
- 새로고침 시 해당 슬라이드 복원
- 하단에 `03 / 10` 카운터 + 상단 얇은 진행 바

### 레이아웃
- 한 슬라이드 = 정확히 1뷰포트. 스크롤 없음(`overflow: hidden`).
- 16:9 고정 캔버스를 `min(100vw, 100vh * 16/9)` 로 계산해 중앙 정렬 → 어떤 화면에서도 PPT 비율 유지. 내부 타이포는 `clamp()` 기반으로 스케일.
- 모바일 세로 화면(<768px)에서는 16:9 강제를 풀고 2단 → 1단 세로 스택으로 리플로우. 이 경우에만 슬라이드 내부 세로 스크롤 허용.
- 인쇄(`@media print`): 슬라이드마다 페이지 브레이크 → PDF 재출력 가능.

### 접근성
- 슬라이드 컨테이너 `role="region"` + `aria-roledescription="slide"` + `aria-label="3 / 8"`
- 비활성 슬라이드는 `hidden` 처리해 스크린리더/탭 순서에서 제외
- 전환 시 `aria-live="polite"` 로 슬라이드 제목 announce
- 버튼 포커스 링 유지, 명도 대비 4.5:1 이상

---

## 4. 디자인 토큰

원본 덱의 색을 그대로 사용한다.

| 토큰 | 값 | 용도 |
|---|---|---|
| `--nnn-orange` | `#F5A623` (원본 표지 배경) | 표지/마지막 슬라이드 배경, 강조 |
| `--nnn-ink` | `#1F242B` | 본문 텍스트 (기존 `theme-color`와 동일) |
| `--nnn-navy` | `#3D4A5C` | 섹션 라벨(ABOUT NNN GAMES 등) |
| `--nnn-paper` | `#F7F6F3` | 내지 배경 (종이 질감) |
| `--nnn-line` | `#D8D5CE` | 구분선 |
| 액센트 4색 | `#D0342C` / `#1D4ED8` / `#3F9E52` / `#EFC03B` | 슬라이드 6의 4분면 바 |

- 내지 상하좌우의 손그림 오렌지 테두리는 CSS 의사요소 + SVG 테두리로 재현하거나, 원본에서 잘라낸 프레임 PNG를 `background`로 사용.
- 각 내지 좌하단에 `NNN GAMES` 워터마크 텍스트.

---

## 5. 슬라이드별 콘텐츠 (KO / EN / JA 확정본)

### S1 — 표지 (오렌지 풀블리드)
- **타이틀**: `NNN GAMES` (3개 언어 공통)
- **서브타이틀** — KO/EN/JA 공통 영문: `ROBLOX Game & UGC Development Studio`
- **연락처 블록** (공통 + 언어별 라벨)
  - `https://triplengames.com`
  - KO: `대표 : 오현석, nnnceo@triplengames.com` / EN: `CEO: Hyunseok Oh, nnnceo@triplengames.com` / JA: `代表 : オ・ヒョンソク, nnnceo@triplengames.com`
  - KO: `경기도 화성시 동탄구 동탄순환대로 878 (영천동), 311호`
    EN: `311, 878 Dongtansunhwan-daero, Dongtan-gu, Hwaseong-si, Gyeonggi-do, Republic of Korea`
    JA: `〒18469 韓国 京畿道 華城市 東灘区 東灘循環大路878 東灘ITタワー 311号室`
- **우측**: 게임 썸네일 2×2 그리드 (Tower Flood Race / Tomato Splatter / Free UGC 2종)

### S2 — ABOUT NNN GAMES
- 섹션 라벨: `ABOUT NNN GAMES` (공통)
- **헤드라인**
  - KO `ROBLOX 전문 게임 개발 스튜디오`
  - EN `A ROBLOX-Native Game Development Studio`
  - JA `ROBLOX専門ゲーム開発スタジオ`
- **리드 문단**
  - KO `트리플엔게임즈는 자체 게임 개발과 라이브 운영을 중심으로, 브랜드·IP 게임과 UGC 콘텐츠를 제작하는 ROBLOX 전문 게임 스튜디오입니다.`
  - EN `Triple N Games is a ROBLOX-focused studio built around in-house game development and live operations, producing brand/IP titles and UGC content.`
  - JA `トリプルエヌゲームズは、自社ゲーム開発とライブ運営を軸に、ブランド・IPゲームとUGCコンテンツを制作するROBLOX専門ゲームスタジオです。`
- **지표 블록** — 기간 라벨 KO `2026.01 ~ 현재` / EN `2026.01 – Present` / JA `2026.01 ~ 現在`
  | 값 | KO | EN | JA |
  |---|---|---|---|
  | `6` | 운영 프로젝트 | Live Projects | 運営プロジェクト |
  | `10M +` | 누적 방문 | Total Visits | 累計訪問数 |
  | `100K+` | 커뮤니티 멤버 | Community Members | コミュニティメンバー |
- **불릿**: `Original Games / Brand & IP / UGC-driven Content` (공통)
- **우측 "핵심 역량"** — 제목 KO `핵심 역량` / EN `Core Capabilities` / JA `コア能力`
  - 리드: KO `ROBLOX 게임 개발부터 출시 이후 운영과 UGC 보상 설계까지 하나의 흐름으로 연결합니다.` / EN `From ROBLOX game development to post-launch operations and UGC reward design — connected as one pipeline.` / JA `ROBLOXゲーム開発から、リリース後の運営とUGC報酬設計までを一つの流れでつなぎます。`
  - `01 GAME DEVELOPMENT`
    KO `자체 ROBLOX 게임 및 브랜드/IP 기반 게임 기획 및 개발`
    EN `Planning and development of in-house ROBLOX titles and brand/IP-based games`
    JA `自社ROBLOXゲームおよびブランド/IPベースゲームの企画・開発`
  - `02 LIVE OPERATIONS`
    KO `출시 이후 업데이트/이벤트/퀘스트/랭킹 지속 운영`
    EN `Ongoing updates, events, quests, and rankings after launch`
    JA `リリース後のアップデート/イベント/クエスト/ランキングの継続運営`
  - `03 UGC & REWARDS`
    KO `Free/Limited UGC를 게임 플레이와 보상 루프에 연결`
    EN `Connecting Free/Limited UGC to gameplay and reward loops`
    JA `Free/Limited UGCをゲームプレイと報酬ループに接続`
  - 하단 파이프라인 배지: `BUILD → LAUNCH → OPERATE → IMPROVE` (공통)
    캡션 KO `기획 및 개발 → 출시 → 라이브 운영 → 데이터 기반 개선` / EN `Plan & Build → Launch → Live Ops → Data-driven Improvement` / JA `企画・開発 → リリース → ライブ運営 → データに基づく改善`

### S3 — PEOPLE (신규)

> 원본 PDF에 없는 신규 슬라이드. **로블록스 아바타 스크린샷 3개를 가로 배치하고, 각 이미지 하단에 해당 아바타 네임을 표시**한다. 레이아웃과 3개 언어 라벨은 확정, **아바타 스크린샷·네임은 입력 필요**(§5-1 참조).

- 섹션 라벨: `PEOPLE` (공통)
- 제목: KO `게임을 만드는 사람들` / EN `The People Behind the Games` / JA `ゲームをつくる人たち`
- 리드
  KO `기획·개발·아트·운영이 한 팀에서 함께 일합니다. 작은 조직이 빠르게 판단하고 바로 반영합니다.`
  EN `Design, engineering, art, and operations sit in one team. A small org decides fast and ships the decision immediately.`
  JA `企画・開発・アート・運営が一つのチームに同居しています。小さな組織が素早く判断し、すぐに反映します。`

**본문 — 아바타 카드 3개 가로 배치**

| 위치 | 이미지 | 하단 네임 |
|---|---|---|
| 좌 | `nnn/assets/people-oneshot.webp` | `ONESHOT` |
| 가운데 | `nnn/assets/people-jeff.webp` | `JEFF` |
| 우 | `nnn/assets/people-papaslime.webp` | `PAPASLIME` |

- **아바타 네임은 3개 언어 공통**으로 로블록스 유저네임을 원문 그대로 노출한다(번역·음차 없음).
- **역할 라벨은 표시하지 않는다(확정).** 카드는 아바타 이미지 + 네임 두 요소로만 구성한다.
- 이미지 사양 (확보 완료)
  - 원본은 1200×1600 투명 PNG 3장. 본체(머리~발) 높이가 936 / 901 / 990 으로 이미 거의 정렬되어 있었다.
  - 3장에 **동일한 크롭 박스**(세 장의 알파 bbox 합집합 + 여백 3%)를 적용해 상대 크기와 발 위치를 보존한 채 빈 여백만 제거했다 → 공통 캔버스 1200×1145 (비율 1.048).
  - 캔버스가 같으므로 `object-fit: contain` 이 세 장을 동일 배율로 그린다. 프레임의 `aspect-ratio` 를 이 캔버스에 맞춰 여백 없이 채운다.
  - 배포본은 720×687 WebP (투명도 유지). 원본 PNG 3장 합계 3.0MB → **191KB**.
- 카드 구성: 이미지 → 아바타 네임(굵게, `--nnn-ink`). 그 아래 추가 텍스트는 두지 않는다.
- 카드 하단에 얇은 `--nnn-orange` 언더라인으로 3장을 시각적으로 묶는다.
- 모바일 세로에서는 3열 → 1열 스택 대신 **가로 스크롤 없는 3열 축소 유지**를 우선한다(아바타는 작아져도 식별 가능). 320px 미만에서만 1열로 전환.
- 하단 요약 배지: KO `기획 → 개발 → 아트 → 운영, 한 팀에서` / EN `Design → Build → Art → Operate, in one team` / JA `企画 → 開発 → アート → 運営、ワンチームで`
- `alt` 텍스트: KO `NNN GAMES 팀원 로블록스 아바타 — {네임}` / EN `NNN GAMES team member Roblox avatar — {name}` / JA `NNN GAMESチームメンバーのRobloxアバター — {ネーム}`

### S4 — HISTORY (신규)

> 원본 PDF에 없는 신규 슬라이드. **플랫폼 전환 연대기** 형식으로, 모바일 → IFLAND → ZEPETO → ROBLOX 4개 시대를 좌에서 우로 배치한다.

- 섹션 라벨: `HISTORY` (공통)
- 제목: KO `걸어온 길` / EN `Our Track Record` / JA `これまでの歩み`
- 리드
  KO `모바일 게임에서 출발해 메타버스 플랫폼을 거쳐, 지금은 ROBLOX에서 자체 게임을 만들고 운영합니다.`
  EN `Starting from mobile games, moving through metaverse platforms, and now building and operating our own titles on ROBLOX.`
  JA `モバイルゲームから出発し、メタバースプラットフォームを経て、現在はROBLOXで自社ゲームを開発・運営しています。`

**연대기 — 4개 시대 (가로 타임라인)**

| 시기 | 플랫폼 (공통 표기) | 설명 KO | 설명 EN | 설명 JA |
|---|---|---|---|---|
| `~ 2021` | `MOBILE` | 모바일 게임 개발 — iOS/Android 기반 게임 제작으로 시작 | Mobile game development — began with iOS/Android titles | モバイルゲーム開発 — iOS/Androidタイトルからスタート |
| `2022` | `IFLAND` | 메타버스 플랫폼 콘텐츠 제작 — 이용자 참여형 공간·이벤트 구축 | Metaverse platform content — built participatory spaces and events | メタバースプラットフォームコンテンツ制作 — 参加型スペース・イベントを構築 |
| `2023 ~ 2025` | `ZEPETO` | 제페토 월드 개발·운영 — JR EAST × NAVER Z `Get Train` 포함 (2.5M 방문, Peak WAU 600K) | ZEPETO world development and operations — including JR EAST × NAVER Z `Get Train` (2.5M visits, 600K peak WAU) | ZEPETOワールドの開発・運営 — JR EAST × NAVER Z『Get Train』を含む（250万訪問、Peak WAU 60万） |
| `2026 ~ 현재` | `ROBLOX` | 자체 게임 개발·라이브 운영 체제 전환 — 6개 프로젝트, 누적 10M+ 방문 | Shifted to in-house development and live operations — 6 projects, 10M+ total visits | 自社ゲーム開発・ライブ運営体制へ移行 — 6プロジェクト、累計1,000万+訪問 |

- `2026 ~ 현재` 라벨의 "현재" 부분만 번역: KO `2026 ~ 현재` / EN `2026 – Present` / JA `2026 ~ 現在`. 나머지 시기 라벨과 플랫폼명은 3개 언어 공통.
- **시각 처리**
  - 가로 축 1줄 + 4개 노드. 좌→우로 갈수록 노드 크기가 커지고, 마지막 `ROBLOX` 노드만 `--nnn-orange` 채움 + 굵은 라벨로 현재 시점을 강조.
  - 축 자체는 좌측 `--nnn-line` → 우측 `--nnn-orange` 로 이어지는 그라디언트.
  - 각 노드 위에 플랫폼 로고 또는 워드마크. 로고 사용은 상표 문제가 있으므로 **기본은 텍스트 워드마크**로 처리하고, 로고 삽입은 사용 허가 확인 후 결정한다(§5-1).
  - 노드 아래 설명은 2줄 이내로 자른다. 4개 컬럼이 균등 폭이어야 시대 간 비교가 읽힌다.
- 모바일 세로에서는 가로축 → **세로축**으로 전환(좌측 라인 + 위→아래 4노드).

**시대별 대표작 이미지 (플레이스홀더로 개발)**

각 시대 노드 아래에 대표작 이미지를 **1~3장** 배치한다. 실제 이미지는 추후 확보하므로, 개발 단계에서는 플레이스홀더로 구현하고 파일만 교체하면 되도록 만든다.

| 시대 | 슬롯 | 파일 | 상태 |
|---|---|---|---|
| `~2021` MOBILE | 2 | `mobile-sc1.webp`, `mobile-sc2.webp` | **확보 완료** (2026-07-30) |
| `2022` IFLAND | 2 | `ifland-sc1.webp`, `ifland-sc2.webp` | **확보 완료** (2026-07-30) |
| `2023~2025` ZEPETO | 2 | `zepeto-sc1.webp`, `zepeto-sc2.webp` | **확보 완료** (2026-07-30) |
| `2026~` ROBLOX | 4 | `game-tfr.jpg`, `game-tomato.jpg`, `ugc-afk.jpg`, `ugc-rng.jpg` | **확보 완료** (2026-07-30) — 기존 에셋 재사용 |

**변환 레시피** (제공받은 원본 → 배포용 에셋). 시대별로 같은 절차를 쓴다.

1. 원본을 흰 배경에 합성해 불투명 RGB 로 만든다(알파가 안티에일리어싱 잔여값만 갖는 경우가 많다).
2. 비율이 16:9 에서 **±0.06 이내**면 왜곡 없이 중앙 크롭으로 정확히 16:9 로 맞춘다. (`ifland-*`, `zepeto-sc2` 는 1200×680 → 0.7% 크롭)
3. 벗어나면 16:9 캔버스에 **원본을 확대·블러(σ=18)·밝기 0.62 로 깐 배경** 위에 원본 전체를 얹는다. (`mobile-sc1` 800×713 이 이 경우)
4. `640×360 WebP, quality 86, method 6` 로 저장한다.
5. `slides.js` 의 `eras[].works` 에 파일명을 넣고 원본은 `nnn/assets/` 에서 제거한다.

- **슬롯 수는 시대마다 달라도 된다.** `eras[].works` 배열 길이에 따라 **1~4장**이 렌더된다. 배열이 비면 이미지 영역 자체를 렌더하지 않는다.
- **이미지 블록 높이는 4개 시대 공통(15.4rem)으로 고정한다.** 슬롯 수마다 높이를 바꾸면 타임라인 노드 축이 어긋난다. 2슬롯은 이 높이를 16:9 두 칸으로 정확히 채우고, 그 외(1·3·4슬롯)는 칸을 16:9 로 유지한 채 **블록 위쪽에 붙여** 네 시대 이미지의 윗변을 한 줄로 맞춘다.
- 4슬롯은 2×2 그리드다. 열 폭이 13.6rem 뿐이라 칸 하나가 6.65rem 로 줄어 **2슬롯 시대보다 이미지가 작게 보인다.** 4장을 유지하는 대신 감수하는 부분이며, 크기를 맞추려면 슬롯을 2개로 줄여야 한다.
- 이미지 사양: **가로 16:9, 폭 640px, WebP 품질 86**. 노드 폭 안에서 세로로 쌓거나(1~2장) 2열 그리드(3장)로 배치.
- 원본이 16:9 가 아니면(세로 모바일 캡처 등) 잘라내지 말고 **16:9 캔버스에 블러 배경 + 원본 전체를 얹어** 내보낸다. `object-fit` 으로 crop 하면 타이틀·UI 가 사라진다. 실제로 `mobile-sc1`(800×713)이 이 경우였다.
- 슬롯 수와 세로 여유: 수상 경력 영역이 꺼져 있으면 2슬롯이 16:9 로 정확히 들어간다(블록 15.4rem). 수상 경력을 켜면 블록이 12rem 으로 줄어 2슬롯은 좌우 여백이 생기므로, **수상 경력을 넣을 때는 시대별 슬롯을 1개로 줄이는 편이 낫다**(실측: 15.4rem 은 24px 넘침, 12rem 은 9px 여유).
- **플레이스홀더 처리**
  - 실제 파일이 없는 동안에는 `--nnn-line` 테두리 + `--nnn-paper` 채움의 빈 프레임에 플랫폼명 워드마크만 옅게 표시한다. "이미지 준비 중" 같은 문구는 넣지 않는다.
  - 플레이스홀더는 CSS만으로 구성해 더미 이미지 파일을 커밋하지 않는다. `data-placeholder` 속성 유무로 스타일을 가른다.
  - 교체 작업이 파일 복사만으로 끝나도록, 파일명·슬롯 수를 `slides.js`의 `eras[].works`에서 한 곳으로 관리한다.
- 각 이미지 `alt`는 작품명이 확정된 뒤 채운다. 확정 전에는 `alt=""` + `role="presentation"`으로 두어 스크린리더가 빈 플레이스홀더를 읽지 않게 한다.

**하단 — 수상경력 2종**

타임라인 아래 가로 스트립으로 수상 2건을 배치한다.

- 영역 라벨: KO `수상 경력` / EN `Awards` / JA `受賞歴`
- 각 항목 구성: 연도 · 수상명 · 시상 주체 (+ 선택: 엠블럼/트로피 아이콘)

| # | 연도 | 수상명 (KO / EN / JA) | 시상 주체 (KO / EN / JA) |
|---|---|---|---|
| 1 | (입력 필요) | (입력 필요) | (입력 필요) |
| 2 | (입력 필요) | (입력 필요) | (입력 필요) |

- 수상명·주체가 **공식 영문/일본어 표기를 가진 경우 그대로 사용**하고, 없으면 한국어 원문 + 괄호 영문 병기로 처리한다. 임의 번역하지 않는다.
- 시각 처리: 좌측에 `--nnn-orange` 세로 바 또는 트로피 아이콘, 우측에 연도(작게) → 수상명(굵게) → 주체(작게) 3단.
- 2건이 가로로 나란히, 타임라인과 시각적으로 분리되도록 상단에 `--nnn-line` 구분선 1줄.
- 수상 정보가 확보되지 않으면 **이 영역 전체를 렌더하지 않는다**(§5-1).
- 누적 지표 스트립(`10M+ Total Visits` 등)은 수상경력 영역과 중복 배치하지 않는다. 하단 공간은 수상경력에 할당하고, 지표는 S2에만 남긴다.

### S5 — 주요 ROBLOX 게임 (2×2 카드)
- 제목: KO `주요 ROBLOX 게임` / EN `Key ROBLOX Titles` / JA `主要ROBLOXゲーム`
- 라벨(공통 영문): `Release date` / `Total visits` / `Peak CCU` / `Rating` / `NEW`

| 게임 | 출시 | 지표 | 장르 (KO / EN / JA) |
|---|---|---|---|
| TOWER FLOOD RACE | 2026.01.24 | 9.3M visits, 2.2K CCU | 오비 & 플랫포머 / 타워 오비 · Obby & Platformer / Tower Obby · オビー＆プラットフォーマー / タワーオビー |
| [FREE UGC] AFK or ARCADE GAME `NEW` | 2026.07.04 | 108K visits, 97% rating | 파티 & 캐주얼 / 미니게임 · Party & Casual / Minigame · パーティー＆カジュアル / ミニゲーム |
| TOMATO SPLATTER SIMULATOR | 2026.04.10 | 1M visits, 164 CCU | 시뮬레이션 / 인크리멘탈 · Simulation / Incremental Simulator · シミュレーション / インクリメンタル |
| FREE UGC RNG `NEW` | 2026.07.07 | 64K visits | 시뮬레이션 / 인크리멘탈 · Simulation / Incremental Simulator · シミュレーション / インクリメンタル |

> 지표는 **정적 값**으로 시작한다. 이후 `scripts/update-metrics.js`가 생성하는 데이터와 연동해 자동 갱신하는 것은 2차 과제(§9).

### S6 — CASE STUDIES: 자체 개발·운영 게임
- 섹션 라벨: `CASE STUDIES` / 제목 KO `자체 개발·운영 게임` · EN `In-House Development & Live Ops` · JA `自社開発・運営ゲーム`
- **TOWER FLOOD RACE** — 부제 KO `멀티플레이 경쟁 · 라이브 운영` / EN `Multiplayer competition · Live operations` / JA `マルチプレイ競争・ライブ運営`
  1. KO `상승하는 물을 피해 타워를 오르는 멀티플레이 레이스` / EN `A multiplayer race up a tower while escaping rising water` / JA `上昇する水を避けてタワーを登るマルチプレイレース`
  2. KO `순위 경쟁과 Slap·아이템을 활용한 플레이어 간 견제` / EN `Rank competition with Slap and item-based player interference` / JA `順位競争とSlap・アイテムを活用したプレイヤー間の牽制`
  3. KO `보상과 퀘스트를 통한 성장·반복 플레이 구조` / EN `Progression and replay loops driven by rewards and quests` / JA `報酬とクエストによる成長・反復プレイ構造`
  4. KO `시즌·랭킹·이벤트 기반 지속적인 라이브 운영` / EN `Continuous live ops built on seasons, rankings, and events` / JA `シーズン・ランキング・イベントに基づく継続的なライブ運営`
- **TOMATO SPLATTER SIMULATOR** — 부제 KO `타격감과 지속 성장을 결합한 액션 중심 시뮬레이션` / EN `Action-driven simulation combining punchy feedback with steady progression` / JA `打撃感と持続的成長を組み合わせたアクション中心シミュレーション`
  1. KO `쫄깃한 타격감` / EN `Satisfying hit feedback` / JA `小気味よい打撃感`
  2. KO `자원과 오브젝트 기반 지속 성장` / EN `Continuous growth through resources and objects` / JA `リソースとオブジェクトに基づく持続的成長`
  3. KO `성장 변화를 직접 체감하는 액션 플레이` / EN `Action play where progression is immediately felt` / JA `成長の変化を直接体感するアクションプレイ`
  4. KO `간단한 조작과 반복 강화를 결합한 플레이 구조` / EN `Simple controls paired with repeatable upgrade loops` / JA `簡単な操作と反復強化を組み合わせたプレイ構造`

### S7 — UGC x GAMEPLAY
- 섹션 라벨 `UGC x GAMEPLAY` / 제목 KO `무료 UGC를 게임 루프의 일부로 설계` · EN `Designing Free UGC as Part of the Game Loop` · JA `無料UGCをゲームループの一部として設計`
- **[FREE UGC] AFK OR ARCADE GAME** — 부제 KO `클래식 미니게임과 UGC 수집을 결합한 캐주얼 아케이드` / EN `A casual arcade blending classic minigames with UGC collection` / JA `クラシックミニゲームとUGC収集を組み合わせたカジュアルアーケード`
  1. KO `클래식 미니게임 플레이` / EN `Classic minigame play` / JA `クラシックミニゲームプレイ`
  2. KO `마을 탐험과 코인 수집` / EN `Town exploration and coin collection` / JA `街の探索とコイン収集`
  3. KO `AFK 기반 자동 코인 획득` / EN `AFK-based idle coin earning` / JA `AFKベースの自動コイン獲得`
  4. KO `코인을 활용한 Free UGC 교환` / EN `Exchanging coins for Free UGC` / JA `コインを活用したFree UGC交換`
- **FREE UGC RNG** — 부제 KO `RNG 수집과 UGC 보상을 결합한 컬렉션 시뮬레이션` / EN `A collection sim merging RNG rolls with UGC rewards` / JA `RNG収集とUGC報酬を組み合わせたコレクションシミュレーション`
  1. KO `무료 Roll 기반 RNG 수집` / EN `Free-roll–driven RNG collection` / JA `無料Rollベースのランダム収集`
  2. KO `Merge 중심 성장 구조` / EN `Merge-centered progression` / JA `Merge中心の成長構造`
  3. KO `Coin으로 Limited UGC 획득` / EN `Acquiring Limited UGC with coins` / JA `コインでLimited UGCを獲得`
  4. KO `이벤트 기반 희귀 보상 수집` / EN `Event-driven rare reward collection` / JA `イベントベースのレア報酬収集`

### S8 — 실제 라이브 운영 사례
- 섹션 라벨 KO `실제 라이브 운영 사례` / EN `Live Operations in Practice` / JA `実際のライブ運営事例`
- 제목 KO `출시 이후 운영` / EN `Post-Launch Operations` / JA `リリース後の運営`
- 리드 KO `출시 이후의 운영까지 게임 개발의 일부로 봅니다.` / EN `We treat post-launch operations as part of game development.` / JA `リリース後の運営までをゲーム開発の一部と捉えています。`
- 4분면(제목은 영문 공통, 항목만 번역)
  - `SEASONAL EVENTS` — `Top 100 Challenge` / KO `기간 한정 경쟁 콘텐츠` · EN `Limited-time competitive content` · JA `期間限定の競争コンテンツ`
  - `PLAYER ENGAGEMENT` — `Quest` / `Ranking` / `Challenge`
  - `UGC REWARDS` — `Limited UGC` / `Event Rewards` / `Collection`
  - `CONTINUOUS ITERATION` — `Player Data` / `Balance` / `Content Updates`
- 우측: 2-Week Top 100 Challenge 배너 + Golden Ducky Drop 배너

### S9 — GLOBAL PROJECT EXPERIENCE
- 섹션 라벨 `GLOBAL PROJECT EXPERIENCE` (공통)
- 제목 `JR EAST × NAVER Z "Get Train" (2024.09 ~ 2025.12)` (공통)
- 설명 1
  KO `JR동일본, 네이버제트와 함께 진행한 도쿄 야마노테선을 배경으로 제작된 게임형 체험 프로젝트`
  EN `A game-style experience project set on Tokyo's Yamanote Line, produced with JR East and NAVER Z`
  JA `JR東日本、NAVER Zと共に進めた、東京・山手線を舞台にしたゲーム型体験プロジェクト`
- 설명 2
  KO `JRE WALLET(블록체인 기반 전자지갑) 연동 이벤트 시스템 개발 및 운영`
  EN `Development and operation of an event system integrated with JRE WALLET (a blockchain-based wallet)`
  JA `JRE WALLET（ブロックチェーン基盤の電子ウォレット）連携イベントシステムの開発・運営`
- 지표: `Release date 2025.02.26` / `Total visits 2.5M` / `Peak WAU 600K`

### S10 — 클로징 (오렌지 풀블리드)
- 타이틀 `LET'S BUILD THE NEXT ROBLOX GAME.` (공통)
- 서브 `Game Development · Brand & IP · Live Operations · UGC` (공통)
- 본문
  KO `트리플엔게임즈는 자체 게임 개발과 라이브 운영 경험을 바탕으로, 파트너와 함께 지속적으로 성장하는 ROBLOX 게임을 만들어갑니다.`
  EN `Backed by in-house development and live operations experience, Triple N Games builds ROBLOX games that keep growing alongside our partners.`
  JA `トリプルエヌゲームズは、自社ゲーム開発とライブ運営の経験をもとに、パートナーと共に成長し続けるROBLOXゲームを作っていきます。`
- 브랜드 슬로건 `NNN` / `Novelty · Notable · Nimble` (공통)
- 연락처 블록: S1과 동일 (동일 i18n 키 재사용)
- CTA: `nnnceo@triplengames.com` mailto 링크 + `https://triplengames.com` 링크 (여기만 외부 링크 허용 — 기존 사이트로의 네비게이션 링크는 두지 않음)

---

### 5-1. 입력이 필요한 미확정 데이터

신규 2개 슬라이드에만 해당한다. 나머지 8장은 PDF 기준으로 확정 상태다.

| 슬라이드 | 항목 | 상태 |
|---|---|---|
| S3 People | 로블록스 아바타 스크린샷 3장 | **확보 완료** (2026-07-30) |
| S3 People | 아바타 네임 3개 | **확보 완료** — 좌 ONESHOT / 가운데 JEFF / 우 PAPASLIME |
| S3 People | 네임 아래 역할 라벨 | **확정 — 표시하지 않음** (2026-07-30) |
| S4 History | `~2021` 모바일 게임 시기의 시작 연도 및 대표 타이틀명 | 미확보 — 표기 정밀화용 |
| S4 History | 2022 IFLAND 프로젝트명 (대외 공개 가능 여부 포함) | 미확보 |
| S4 History | ZEPETO 시기 `Get Train` 외 공개 가능한 대표 월드 | 미확보 |
| S4 History | 플랫폼 로고 사용 가부 (IFLAND / ZEPETO / ROBLOX 상표) | **결정 필요** — 기본값 텍스트 워드마크 |
| S4 History | **시대별 대표작 이미지** (시대당 1~3장, 총 4~12장) | 미확보 — 플레이스홀더로 선개발, 추후 교체 |
| S4 History | 시대별 대표작 이미지 슬롯 수 (시대마다 1/2/3 중) | **결정 필요** — 확보되는 대로 |
| S4 History | **수상경력 2종** — 연도 · 수상명 · 시상 주체 | 미확보 — 필수 (없으면 영역 미렌더) |
| S4 History | 수상명/주체의 공식 영문·일본어 표기 | 미확보 — 없으면 원문 + 영문 병기 |

- S3 는 아바타 3장과 네임이 모두 채워져 완성 상태다. (플레이스홀더 프레임 경로는 `image`/`name` 이 `null` 일 때만 동작하도록 그대로 남아 있다.)
- S4는 위 표가 비어도 §5의 4개 시대 연대기만으로 완성된 슬라이드가 된다. 대표작 이미지와 수상경력은 **비어 있으면 해당 영역을 렌더하지 않는 구조**로 만들어, 자료 확보 시점과 배포 시점을 분리한다.
- 대표작 이미지는 플레이스홀더 상태로 배포해도 무방하나, **수상경력은 플레이스홀더로 노출하지 않는다.** 빈 수상 항목은 실적이 없다는 인상을 주므로 확보 전까지 영역째 숨긴다.
- 미확보 항목이 끝까지 채워지지 않으면 해당 요소는 **삭제**한다(빈 자리·"준비 중" 표기를 남기지 않는다).

## 6. 데이터 구조 (`nnn/slides.js`)

```js
// 언어 독립 데이터(수치·영문 고유명사)는 slide 레벨에,
// 번역 텍스트는 i18n 키로 분리한다.
const SLIDES = [
  { id: 'cover',      layout: 'cover',       theme: 'orange' },
  { id: 'about',      layout: 'about',       theme: 'paper' },
  { id: 'people',     layout: 'avatar-row',  theme: 'paper', avatars: [...] },  // 신규
  { id: 'history',    layout: 'era-timeline',theme: 'paper', eras: [...], awards: [...] }, // 신규
  { id: 'titles',     layout: 'game-grid',   theme: 'paper', games: [...] },
  { id: 'case',       layout: 'two-column',  theme: 'paper' },
  { id: 'ugc',        layout: 'two-column',  theme: 'paper' },
  { id: 'liveops',    layout: 'quadrant',    theme: 'paper' },
  { id: 'global',     layout: 'global',      theme: 'paper' },
  { id: 'closing',    layout: 'closing',     theme: 'orange' },
];

const DECK_I18N = {
  ko: { cover_subtitle: '…', about_headline: '…', /* … */ },
  en: { /* … */ },
  ja: { /* … */ },
};
```

- 신규 레이아웃은 `avatar-row`(3열 아바타 카드), `era-timeline`(4노드 가로 타임라인) 2종이다.
- **아바타 네임과 플랫폼명(`MOBILE` / `IFLAND` / `ZEPETO` / `ROBLOX`)은 번역 대상이 아니다.** i18n 키를 만들지 말고 HTML에 고정 문자열로 둔다.
- S4의 대표작 이미지와 수상경력은 **개수가 유동적**이므로 예외적으로 데이터 기반 렌더링을 적용한다. 나머지 슬라이드의 정적 마크업 원칙은 그대로 유지한다.

```js
// history 슬라이드 데이터 형태
eras: [
  { period: '~ 2021',      platform: 'MOBILE', works: [] },                    // 이미지 미확보 → 플레이스홀더
  { period: '2022',        platform: 'IFLAND', works: ['era-ifland-1.jpg'] },  // 1장
  { period: '2023 ~ 2025', platform: 'ZEPETO', works: ['era-zepeto-1.jpg', 'era-zepeto-2.jpg'] },
  { period: null,          platform: 'ROBLOX', works: [], current: true },     // period는 i18n 키로 처리
],
awards: [],  // 빈 배열이면 수상경력 영역 자체를 렌더하지 않음
```
- 마크업은 `index.html`에 10개 `<section class="slide" data-slide="…">`로 정적으로 작성하고, 텍스트 노드에만 `data-deck-key`를 붙여 `deck.js`가 교체하는 방식(기존 `js/i18n.js`의 `data-key` 패턴과 동일)으로 간다. 런타임 템플릿 렌더링보다 초기 표시가 빠르고 SEO/인쇄에도 유리하다.
- 숫자 지표(`9.3M`, `2.2K` 등)는 번역 대상이 아니므로 HTML에 그대로 둔다.

---

## 7. 에셋 준비

PDF에서 추출해 `nnn/assets/`에 저장한다. (PyMuPDF 또는 원본 PPTX에서 내보내기)

| 파일 | 출처 | 용도 |
|---|---|---|
| `cover-tfr.jpg`, `cover-tomato.jpg`, `cover-afk.jpg`, `cover-rng.jpg` | S1 우측 2×2 | 표지 썸네일 |
| `people-oneshot.webp`, `people-jeff.webp`, `people-papaslime.webp` | 제공받은 1200×1600 투명 PNG 3장을 공통 크롭 후 변환 | S3 아바타 카드 — 720×687 WebP, 합계 191KB |
| `era-mobile-*.jpg`, `era-ifland-*.jpg`, `era-zepeto-*.jpg`, `era-roblox-*.jpg` | **추후 확보** (시대당 1~3장) | S4 시대별 대표작 — 16:9, 폭 480px+. 개발 중에는 CSS 플레이스홀더 |
| `mobile-sc1.webp`, `mobile-sc2.webp` | 제공받은 PNG 2장 (sc1 은 16:9 캔버스로 재구성) | S4 MOBILE 대표작 — 640×360 WebP, 34KB |
| `ifland-sc1.webp`, `ifland-sc2.webp` | 제공받은 JPG 2장 (1200×680 → 0.7% 중앙 크롭) | S4 IFLAND 대표작 — 640×360 WebP, 81KB |
| `zepeto-sc1.webp`, `zepeto-sc2.webp` | 제공받은 JPG/PNG 2장 | S4 ZEPETO 대표작 — 640×360 WebP, 90KB |
| `game-tfr.jpg`, `game-afk.jpg`, `game-tomato.jpg`, `game-rng.jpg` | S5 카드 | 게임 카드 |
| `case-tfr.jpg`, `case-tomato.jpg` | S6 | 케이스 스터디 스크린샷 |
| `ugc-afk.jpg`, `ugc-rng.jpg` | S7 | UGC 인게임 스크린샷 |
| `event-top100.jpg`, `event-golden-ducky.jpg` | S8 | 이벤트 배너 |
| `global-gettrain-*.jpg` (4장) | S9 | Get Train 콜라주 |
| `frame-border.svg` (선택) | 내지 테두리 | 손그림 오렌지 프레임 |

- 포맷: 사진성 이미지는 JPEG(품질 82), 가로 최대 1600px. 전체 합계 1.5MB 이하 목표.
- `loading="lazy"`는 **현재 슬라이드 이후의 것만** 적용 (첫 화면 이미지는 eager).
- 모든 `<img>`에 KO/EN/JA `alt` 지정.

---

## 8. 구현 단계

1. **골격** — `nnn/index.html` 10개 섹션 + `deck.css` 16:9 캔버스/테마 토큰/`avatar-row`·`era-timeline` 레이아웃 + noindex 메타
2. **컨트롤러** — `deck.js`: 슬라이드 인덱스 상태, 다음/이전 버튼, 키보드, 스와이프, 도트, 해시 동기화
3. **다국어** — `DECK_I18N` 3개 언어 입력, `localStorage.language` 연동, `?lang=` 처리, 미니 스위처
4. **콘텐츠** — §5 확정본을 슬라이드별로 마크업에 반영
5. **에셋** — §7 이미지 추출·최적화·삽입, alt 3개 언어. S4 대표작은 플레이스홀더 상태로 두고 파일 확보 시 `eras[].works`만 갱신
6. **반응형/인쇄** — 모바일 세로 리플로우, `prefers-reduced-motion`, `@media print`
7. **검수** — 아래 체크리스트

---

## 9. 2차 과제 (본 릴리스 범위 밖)

- S5 게임 지표 및 S2/S4 누적 지표를 `scripts/update-metrics.js` 산출 데이터와 연동해 자동 갱신
- 슬라이드 PDF 다운로드 버튼 (원본 PDF를 `nnn/assets/`에 배치 후 링크)
- 프레젠터 모드(전체화면 API, `F` 키)
- 열람 이벤트 로깅(현재 사이트에 애널리틱스가 없으므로 도입 시점에 함께 검토)

---

## 10. 체크리스트

검증 방법: 로컬 정적 서버 + 헤드리스 Chrome 스크린샷/DOM 측정. 미확보 자료에 의존하는 항목만 보류.

- [x] `/nnn` 및 `/nnn/` 두 경로 모두 정상 표시 (GitHub Pages 디렉터리 인덱스)
- [x] 기존 사이트(헤더·푸터·index·projects·contact) 어디에도 `/nnn` 링크가 없음
- [x] `<meta name="robots" content="noindex, nofollow">` 적용
- [x] `다음` 버튼만으로 10장 전부 순회 가능, 마지막에서 다음 비활성
- [x] 슬라이드 순서가 표지 → ABOUT → People → History → 주요 게임 → … 순으로 배치됨
- [x] S3 PEOPLE 슬라이드가 3번 위치에 노출됨 (총 10장)
- [x] S3 아바타 3장의 크기·발 위치가 정렬되어 카드가 어긋나 보이지 않음 (공통 크롭 박스 + 동일 캔버스)
- [x] S3 아바타 네임이 3개 언어에서 동일하게(원문 그대로) 표시됨 — 좌 ONESHOT / 가운데 JEFF / 우 PAPASLIME
- [x] S4 연대기 4개 시대(`~2021` MOBILE / `2022` IFLAND / `2023~2025` ZEPETO / `2026~` ROBLOX)가 균등 폭으로 배치되고 마지막 노드만 강조됨
- [x] S4의 ZEPETO 시기 서술이 S9(Get Train 상세)과 모순되지 않음
- [x] S4 대표작 이미지가 시대별 1~3장 가변으로 렌더되고, 슬롯이 비면 플레이스홀더로 표시됨 (MOBILE·IFLAND·ZEPETO 실제 이미지 6장 + ROBLOX 플레이스홀더 2장 혼재 상태로 확인, 노드 4개 y좌표 동일)
- [x] 플레이스홀더가 CSS만으로 구성되어 더미 이미지 파일이 커밋되지 않음
- [x] 이미지 파일을 `nnn/assets/`에 넣고 `eras[].works`에 파일명만 추가하면 교체가 끝남
- [x] S4 수상경력이 3개 언어로 표시되고, `awards`가 비면 영역 자체가 렌더되지 않음 (샘플 2건으로 렌더 검증 후 원복)
- [x] 플레이스홀더 이미지에 `alt=""` + `role="presentation"` 적용 (스크린리더가 읽지 않음)
- [x] `이전` 버튼 / 키보드(→ ← Space PageUp/Down Home End) / 스와이프 / 도트 4가지 보조 조작 동작
- [x] 새로고침 시 해시 기준 슬라이드 복원 (첫 슬라이드에서는 URL 을 건드리지 않음)
- [x] KO/EN/JA 전환 시 누락 텍스트 없음 (참조 키 82개 × 3개 언어 파리티 검사 + 빈 문자열 0건)
- [x] 기존 사이트에서 언어 변경 후 `/nnn` 진입 시 해당 언어로 표시 (`localStorage.language` 공유, 쓰기까지 확인)
- [x] 최초 방문(로컬스토리지 없음) 시 브라우저 언어로 자동 판별
- [x] 1920×1080 / 1600×900 / 1440×900 / 500×900(세로)에서 레이아웃 깨짐 없음
- [x] 모든 이미지 alt 3개 언어 지정 (alt·role 누락 0건)
- [x] `prefers-reduced-motion: reduce` 에서 전환 애니메이션 제거
- [x] Tailwind 빌드(`npm run build:css`) 결과에 영향 없음 (`css/style.css` diff 없음 — content 글롭이 `./*.html` 로 루트만 스캔)
- [x] 총 페이지 용량(HTML+CSS+JS+이미지) 2MB 이하 — **약 1.17MB** (에셋 1.08MB + 코드 90KB)
- [x] 인쇄 시 슬라이드당 1페이지, 정확한 16:9 (9페이지 PDF 재출력 확인)
- [x] JS 런타임 오류 0건, 비활성 슬라이드 `inert` 처리 확인

---

## 11. 구현 결과 / 기획서와 달라진 점

산출물

```
nnn/
  index.html     10개 슬라이드 정적 마크업 (data-deck-key 로 다국어 연결)
  deck.css       16:9 캔버스 · 테마 토큰 · 레이아웃 · 반응형 · 인쇄
  deck.js        슬라이드 전환 / 언어 / 아바타·연대기·수상경력 렌더
  slides.js      슬라이드 데이터 + KO/EN/JA 문자열 82키 × 3
  assets/        PDF 에서 추출한 이미지 16개 + 종이 텍스처 + 손그림 프레임 SVG
```

기획서 대비 확정·변경 사항

1. **`works` 슬롯 표기 규칙 확정** — 기획서 §5 에서 "배열이 비면 영역 미렌더"와 "빈 프레임 플레이스홀더"가 충돌했다. 구현은 다음으로 정리했다.
   - `'era-zepeto-1.jpg'` (문자열) → 해당 이미지 렌더
   - `null` → CSS 플레이스홀더 프레임 (더미 파일 없음)
   - `[]` (빈 배열) → 그 시대의 이미지 영역 자체를 렌더하지 않음
   현재 기본값은 시대별 `[null, null]` (2슬롯).
2. **`.era-works` 높이를 슬롯 수별 고정값으로 잡았다** (1장 7.7rem / 2장 13rem / 3장 11.7rem). 4개 시대의 축(노드)이 같은 높이에 정렬되어야 하고, 수상경력 영역이 켜졌을 때도 세로로 넘치지 않아야 해서다. 실제 이미지가 들어오면 슬롯 수에 맞춰 이 값만 조정하면 된다.
3. **S3 PEOPLE 은 자료 없이도 노출한다** — 아바타 렌더 3장과 네임이 미확보지만 슬라이드는 덱에 포함해 **10장**으로 배포한다. 카드는 플레이스홀더 프레임으로 보이고, 자료가 들어오면 `slides.js` 의 `avatars[].image` / `.name` 만 채우면 끝난다. (`enabled: false` 로 특정 슬라이드를 빼는 스위치와 `?preview=all` 로 되살리는 경로는 그대로 남아 있다.)
4. **S4 ZEPETO 설명에서 수치를 뺐다** — 기획서 §5 표에는 `(2.5M 방문, Peak WAU 600K)` 가 있었으나, 4열 레이아웃에서 설명은 2줄 이내여야 하고 상세 지표는 S9 담당이라는 메모 결정과도 맞다. 시대 단위 서술만 남겼다.
5. **표지 썸네일은 S5 게임 카드 이미지를 공유한다** — 별도 `cover-*.jpg` 를 두면 같은 그림이 두 벌이 되어 약 190KB 를 낭비한다. `game-*.jpg` 4장을 양쪽에서 쓴다.
6. **이미지 비율 처리** — 콜라주·연대기·아바타는 래퍼 `<div>` 안에 `position:absolute; inset:0` 로 이미지를 가둔다. 그리드 `1fr` 트랙 위에서는 `height:100%` 가 해석되지 않아 셀을 넘치고, `<img>` 의 `width/height` 속성이 `aspect-ratio` 를 무력화하기 때문이다(둘 다 실제로 겪은 버그).
7. **모바일 미디어쿼리를 `screen and (max-width: 767px)` 로 한정했다** — 인쇄 시 페이지 폭이 좁게 평가되면 세로 리플로우가 적용되어 출력이 깨진다. 인쇄는 `@page { size: 1280px 720px }` 로 디자인 캔버스를 그대로 한 페이지에 싣는다.
8. **`preview=all` 쿼리 추가** — 비활성 슬라이드를 배포 없이 검토하기 위한 개발용 스위치.

남은 입력 대기 항목은 §5-1 표와 `slides.js` 상단 주석에 그대로 있다. 두 곳 모두 자료를 넣는 위치와 형식을 명시해 두었다.

---

## 메모 / 결정 사항

- 원본 PDF는 34페이지가 아닌 **8슬라이드**다(PyMuPDF 기준). 8장은 1:1 매핑하고, 여기에 People / History 2장을 ABOUT 뒤에 삽입해 총 10장으로 확정.
- People / History를 ABOUT 직후에 둔 이유: "회사가 무엇을 하는가(ABOUT) → 누가 하는가(People) → 어떻게 여기까지 왔는가(History) → 무엇을 만들었는가(게임·케이스)" 순으로 신뢰 근거를 먼저 쌓고 실적을 제시하는 흐름이다.
- History는 개별 출시 이벤트 나열이 아니라 **플랫폼 전환 연대기**(모바일 → IFLAND → ZEPETO → ROBLOX)로 구성한다. 개별 타이틀 실적은 S5·S9가 이미 담당하므로 중복을 피하고, "플랫폼이 바뀌어도 계속 만들어온 팀"이라는 서사에 집중시키는 편이 낫다.
- ZEPETO 시기(2023~2025)와 S9의 `Get Train`(2024.09~2025.12)은 같은 사업의 다른 축척이다. S4는 시대 단위로만 언급하고 상세 지표는 S9에 남긴다.
- ROBLOX 시대에 제공받은 `roblox-sc1~4.jpg` 는 S1/S5/S7 에서 쓰는 파일과 **바이트 단위로 동일**했다(`game-tfr`, `game-tomato`, `ugc-afk`, `ugc-rng`). 사본을 늘리지 않고 기존 에셋을 참조하도록 해 추가 다운로드는 0KB 다. 대신 같은 그림이 S1·S4·S5 에 세 번, S4·S7 에 두 번 나온다는 점은 감수한 결과다.
- 대표작 이미지는 `object-fit: contain` 으로 그린다. 스크린샷 비율이 제각각이라 `cover` 로 잘라내면 게임 타이틀·UI 가 사라진다. 대신 내보내는 단계에서 16:9 캔버스에 맞춰 두면 여백이 보이지 않는다.
- 아바타는 **WebP** 로 내보냈다. 투명도가 필요해 PNG 를 쓰면 3장 합계 3.0MB 로 페이지 예산(2MB)을 넘긴다. WebP 는 알파를 지원하면서 191KB 로 끝난다.
- 제공받은 원본 PNG 3장(합계 3.0MB)은 WebP 변환 후 `nnn/assets/` 에서 삭제했다(2026-07-30). 배포 폴더에는 참조되는 파일만 둔다. 아바타를 교체할 때는 **3장 모두 같은 크롭 박스로 다시 내보내야** 배율과 발 위치가 유지된다.
- S3 카드에 역할 라벨(게임 기획 / 클라이언트 개발 등)은 넣지 않기로 확정했다. 아바타 이미지 + 네임 두 요소로만 구성한다.
- S3의 아바타 스크린샷 3장은 원본 PDF에 없는 신규 에셋이다. 자료가 없어도 슬라이드는 노출하고, 카드만 플레이스홀더로 둔다(§5-1).
- S4의 대표작 이미지는 **플레이스홀더 선개발 → 추후 파일 교체** 방식이다. 자료 확보를 기다리지 않고 레이아웃을 먼저 확정한다.
- 대표작 이미지와 수상경력의 "비면 숨긴다" 원칙이 서로 다른 이유: 이미지는 비어도 시대 노드가 성립하지만(플레이스홀더 허용), 빈 수상 항목은 실적 부재로 읽히므로 영역째 숨긴다.
- 기존 `js/i18n.js`는 재사용하지 않고 `localStorage.language` 키만 공유한다. 사유: 헤더/푸터 DOM을 전제로 한 훅과 사이트 전용 키가 대부분이라 결합도만 높아진다.
- 회사 대표 영문 표기는 `Hyunseok Oh`(기존 git 설정 표기)를 사용. 공식 영문 표기가 따로 있다면 교체 필요.
- 주소 영문/일본어 표기는 기존 `js/i18n.js`의 `footer_address` 값을 그대로 재사용해 사이트 전체 일관성을 유지한다.
