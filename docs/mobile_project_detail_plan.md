# 모바일 게임 상세 페이지 사이트 기획서

본 문서는 NNN GAMES 웹사이트(`projects-mobile.html` 하위)에서 운영하는 **모바일 게임 소개 상세 페이지**의 일반 기획 기준을 정의한다. 신규 모바일 프로젝트가 추가될 때 본 문서를 따라 IA·콘텐츠·에셋·기술 요구를 확정하고, 개별 프로젝트 계획은 `plan/<slug>.md`에서 구체화한다.

> 적용 범위: iOS / Android(또는 단일 OS) 모바일 게임. Roblox/UGC 프로젝트는 별도 기획(`docs/prd.md` §3, `docs/project_templete.md`)을 따른다.

---

## 1. 목적과 핵심 목표
- **1차 목적**: 프로젝트를 외부에 노출 가능한 형태로 소개하고, 스토어 또는 사전 예약 채널로 트래픽을 전환한다.
- **2차 목적**: 프레스/파트너에게 보낼 수 있는 "PR 키트 대체" 페이지 역할 — 트레일러·키 비주얼·핵심 메시지·연락처가 한 화면에서 정리되어야 한다.
- **성공 지표**:
  - 상세 페이지 → 스토어/사전 예약 CTA 클릭률
  - 트레일러 영상 재생 시작률 / 완료율
  - 평균 체류 시간, 갤러리 스크롤 도달률
  - 다국어 페이지 비율 (KO/EN/JA)

## 2. 타깃 사용자
| 페르소나 | 주된 행동 | 핵심 컴포넌트 |
| --- | --- | --- |
| 플레이어/유저 | 트레일러 시청, 스크린샷 확인, 스토어 이동 | Hero 영상, 갤러리, Store 배지 |
| 프레스/크리에이터 | 스크린샷/로고 다운로드, 보도자료 확인 | Press Kit 링크, 미디어 문의 |
| 퍼블리셔/파트너 | 개발사 정보·실적 확인 | About / Snapshot, 연락처 |
| 검색 유입(SEO) | 게임명/장르 키워드로 접근 | SEO 메타, OG, 구조화 데이터 |

## 3. 정보 구조 (Information Architecture)
모바일 게임 상세 페이지는 다음 섹션을 표준 순서로 가진다. 선택(Optional) 항목은 프로젝트 단계(개발/사전예약/CBT/정식 출시)에 따라 노출 여부를 결정한다.

```
1. Header / Nav (공통)
2. Hero
   ├ 게임 타이틀 / 카피
   ├ 상태 배지 (Pre-registration / CBT / Soft Launch / Live)
   ├ 메타 (장르 · 플랫폼 · 출시일)
   ├ 키 비주얼 또는 트레일러 영상
   └ Primary CTA (스토어 / 사전예약)
3. Overview (리드 문단 1~2개)
4. Highlights (3~4개 핵심 셀링 포인트)
5. Gameplay / Features (특징 리스트 또는 블록형 소개)
6. Media
   ├ 트레일러 영상 (메인)
   ├ Optional: 게임플레이 영상
   └ 스크린샷 갤러리 (디바이스 목업 권장)
7. Snapshot Sidebar (Sticky, 데스크톱)
   ├ 출시일 · 상태 · 플랫폼 · 장르 · 가격 모델
   ├ 지원 언어 · 연령 등급 · 용량 · OS 최소 사양
   └ 다운로드/스토어 배지
8. News & Updates (Optional, 라이브 운영 시)
9. Press Kit / Media (Optional)
10. Related Projects (스튜디오 다른 작품 카드 2~3개)
11. Footer (공통)
```

## 4. 섹션별 콘텐츠 요구사항
### 4.1 Hero
- **상태 배지**: `pre-registration` / `cbt` / `soft-launch` / `live` / `service-end` 중 1개.
- **카피**: 헤드라인 1줄(≤ 30자 KO 기준) + 데크 1~2문장.
- **메인 미디어**: 정식 트레일러(YouTube embed) 우선, 미공개 단계에서는 키 비주얼(JPG/WebP, 1920×1080 권장).
- **Primary CTA**: 출시 단계별로 노출 분기.
  - 사전 예약: App Store / Google Play 사전 예약, 또는 자체 사전 예약 폼
  - CBT: 신청 폼 / 디스코드 가입
  - Live: App Store / Google Play / (필요 시) Galaxy Store / One Store
- **Secondary CTA**: 트레일러 보기, 공식 SNS, 디스코드.

### 4.2 Overview
- 게임 한 줄 정의 → 핵심 차별화 → 타깃 톤. 3개 언어 동일 길이감 유지.
- 마케팅 카피보다 **무엇을 하는 게임인지**가 먼저 드러나야 한다(검색 유입 대응).

### 4.3 Highlights (3~4개)
- 각 항목: `eyebrow`(태그) · `title`(한 줄) · `description`(2~3줄).
- 시스템적 차별점(예: 매치 구조), 비주얼/세계관, 라이브 운영/이벤트, 소셜·길드 등에서 추출.

### 4.4 Gameplay / Features
- 4~6개 블록 권장. 각 블록은 `title + description + (선택) 인라인 이미지/짧은 클립`.
- 영상은 자동재생·음소거된 짧은 루프(`mp4` 또는 `<video muted loop playsinline>`)가 적합.

### 4.5 Media (Trailer & Gallery)
- 트레일러: 1080p 이상, 30~90초 길이가 전환에 유리. YouTube `rel=0&modestbranding=1&playsinline=1` 파라미터 유지.
- 스크린샷: 최소 6장, 권장 8~12장.
  - 가로 비율(16:9) — 데스크톱 갤러리 그리드용
  - 세로 비율(9:16 또는 9:19.5) — 모바일 게임 특성상 디바이스 목업(phone frame)에 합성 권장
  - 파일명: `<slug>-gallery-<n>.jpg`, 1920px 이상 원본 + WebP 1200px 압축본 병행
- 캡션(Optional): 각 이미지에 `alt` 외 짧은 설명을 달면 SEO·접근성 모두 강화.

### 4.6 Snapshot Sidebar
모바일 전용 메타. 데스크톱은 sticky, 모바일은 Hero 직후 인라인 카드.
- 출시일 (또는 사전 예약 시작일)
- 상태 (라이브/사전예약/CBT/…)
- 플랫폼 (iOS / Android / 둘 다)
- 장르 (메인 + 서브 1개)
- 가격 모델 (Free-to-Play / Premium / Subscription)
- 인앱 결제 여부 (Y/N)
- 지원 언어 (KO/EN/JA/…)
- 연령 등급 (App Store rating + Google Play rating 표기, 가능하면 GRAC도)
- 용량 (출시 시점 기준 대략치)
- 최소 OS (iOS x.x / Android x.x)
- 스토어 배지 (이미지 링크, 공식 가이드라인 준수: Apple/Google 배지 정책)

### 4.7 News & Updates (Optional)
라이브 운영 단계에서만 노출. 최신 3~5건의 패치 노트/이벤트 카드.

### 4.8 Press Kit
- 로고(SVG + PNG) · 키 비주얼(원본) · 스크린샷 zip · Fact Sheet PDF.
- 미디어 문의용 이메일(`developer@triplengames.com` 또는 별도 PR 채널).
- presskit() 형식의 별도 페이지로 분리 가능.

### 4.9 Related Projects
스튜디오 다른 프로젝트 카드 2~3개. 같은 카테고리(mobile) 우선, 부족 시 featured 카드로 폴백.

## 5. 데이터 스키마 (모바일 확장 필드)
기존 `data/projects.json` 스키마(`docs/prd.md` §4)에 모바일 전용 필드를 추가/덮어쓴다.

| 필드 | 타입 | 설명 |
| --- | --- | --- |
| `category` | string | `"mobile"` 고정 |
| `mobilePlatform` | string[] | `["ios", "android"]` 중 해당 항목 |
| `pricingModel` | enum | `"f2p"` \| `"premium"` \| `"subscription"` |
| `hasIAP` | boolean | 인앱 결제 여부 |
| `ageRating` | object | `{ appStore: "4+", googlePlay: "Everyone", grac: "전체이용가" }` |
| `osMin` | object | `{ ios: "14.0", android: "8.0" }` |
| `sizeMb` | number \| null | 설치 용량(대략) |
| `languages` | string[] | `["ko","en","ja"]` |
| `links.appStore` | url | iOS 스토어 URL |
| `links.playStore` | url | Google Play URL |
| `links.galaxyStore` | url \| "" | 선택 |
| `links.preRegister` | url \| "" | 사전 예약 단계에서 사용 |
| `links.discord` | url \| "" | 커뮤니티 |
| `links.presskit` | url \| "" | Press Kit 페이지 |

세부 페이지 카피(다국어)는 `js/project-details/<slug>.js`의 `ProjectDetailConfigs[slug]`로 관리한다 — 기존 Roblox 프로젝트와 동일한 패턴(`js/project-detail.js` 렌더러).

## 6. 미디어·에셋 가이드
- **트레일러**: YouTube 호스팅. 자체 호스팅(`.mp4`)은 1080p 5MB 이하 짧은 루프에 한해 허용.
- **스크린샷**: WebP 우선, 폴백 JPG. 모든 이미지 `loading="lazy"`.
- **디바이스 목업**: 동일 프로젝트 내 동일 기종(예: 모두 iPhone 15 Pro frame)으로 톤 일치.
- **OG 이미지**: 1200×630, 텍스트는 좌측 정렬, 우측 50% 키 비주얼.
- **저작권**: 폰트/사운드/외주 비주얼은 사용 라이선스 확인 후 `plan/<slug>.md`에 기록.

## 7. 다국어 (i18n)
- `KO / EN / JA` 3개 언어를 모든 사용자 노출 텍스트에 적용 (`js/i18n.js` + `data-key`).
- 게임명(고유명사)은 번역하지 않고 원어 유지, 단 부제·태그라인은 번역.
- 스토어 배지 이미지는 언어별 자산(`badge-appstore-ko.svg`, `-en.svg`, `-ja.svg`)을 사용.
- 누락 키 자동 폴백 순서: 현재 언어 → EN → KO.

## 8. SEO / 공유
- `<title>`: `"<게임명> - NNN GAMES"`
- `meta[description]`: Overview 첫 문단 ≤ 160자.
- `meta[keywords]`: 게임명·장르·플랫폼·"모바일 게임".
- OG/Twitter: 게임명·데크·OG 이미지 적용. `og:type` = `"article"` 유지(현재 셸과 동일).
- 구조화 데이터 (`application/ld+json`): `VideoGame` 스키마 권장.
  - `name`, `genre`, `gamePlatform: ["iOS", "Android"]`, `applicationCategory: "GameApplication"`, `operatingSystem`, `offers`(가격), `aggregateRating`(있을 때).

## 9. CTA 추적 / 분석
- 모든 CTA에 `data-cta`, `data-project-id`, `data-cta-origin` 부여 (`docs/guideline.md` §4).
- 모바일 전용 origin 키:
  - `detail-hero-mobile` (Hero CTA)
  - `detail-snapshot-store` (사이드바 스토어 배지)
  - `detail-media-trailer` (트레일러 재생)
  - `detail-gallery` (갤러리 클릭/확대)
  - `detail-presskit` (Press Kit 진입)
- 스토어 외부 링크에는 필요 시 UTM 부착 (`utm_source=nnn-website`, `utm_medium=detail`, `utm_campaign=<slug>`).

## 10. 반응형 / UI 가이드
- 기준: 모바일 우선. 768px 이하에서 Hero·갤러리·사이드바 1열 적층.
- 터치 타겟 ≥ 44px, 스토어 배지는 가로 ≥ 160px.
- Sticky Sidebar: 1024px 이상에서만 활성, 그 외 인라인.
- 가로 스크롤 갤러리(스와이프) — 모바일 권장.
- 다크 테마 톤(`#1F242B`) 유지, 게임별 강조 컬러는 1색만 허용(접근성 대비 4.5:1).

## 11. 접근성
- 영상에 `title` 제공, 자막(YouTube 자동 자막 활성화 또는 별도 cc 트랙).
- 갤러리 이미지 `alt`는 의미 중심으로 작성(예: "캐릭터 X가 스킬을 시전하는 전투 화면").
- 키보드 포커스: 스토어 배지, CTA, 갤러리 항목 모두 Tab 이동 가능.
- 자동재생 루프 영상은 `prefers-reduced-motion` 사용자에게 정지 상태로 노출.

## 12. 성능
- 초기 viewport 외 이미지·iframe 모두 lazy.
- 트레일러 YouTube iframe은 사용자 클릭 시 삽입(Facade 패턴)하면 LCP 개선.
- 갤러리 이미지 srcset/`sizes` 적용으로 모바일에서 1200px 이하 자산만 다운로드.
- Lighthouse 모바일 Performance ≥ 80, Accessibility ≥ 90 목표.

## 13. 운영 / 콘텐츠 업데이트 프로세스
1. `plan/<slug>.md` 작성 (본 문서 §3·§4를 채워 확정안 정리)
2. 에셋 준비 (`assets/<slug>/`) — 명명 규칙 `<prefix>-main.jpg`, `<prefix>-gallery-<n>.jpg`
3. 데이터 입력 (`data/projects.json`) — §5 필드 누락 확인
4. 상세 카피 입력 (`js/project-details/<slug>.js`) — KO/EN/JA 모두
5. 상세 HTML 생성 (`<slug>.html`) — 공통 셸 사용
6. 로컬 검증 (다국어 전환, CTA 동작, 모바일 레이아웃)
7. PR 리뷰 → 배포

## 14. 검증 체크리스트 (릴리즈 전)
- [ ] 3개 언어 모두 노출 텍스트가 비어 있지 않음
- [ ] Hero 트레일러/키 비주얼이 모바일·데스크톱 모두에서 정상 표시
- [ ] 스토어 배지 외부 링크가 HTTPS이며 정확한 앱 페이지로 연결
- [ ] OG 이미지가 1200×630이며 SNS 미리보기 검증 (Facebook Debugger / Twitter Card Validator)
- [ ] 갤러리 모든 이미지에 의미 있는 `alt` 작성
- [ ] CTA 추적 속성(`data-cta`, `data-project-id`, `data-cta-origin`) 부착
- [ ] 사이드바 메타(연령/용량/OS)가 실제 스토어 정보와 일치
- [ ] 다른 모바일 프로젝트 페이지와 톤·레이아웃 일관성 (Related Projects 카드 포함)
- [ ] Lighthouse 모바일 Performance/Accessibility 목표 충족
- [ ] 사전 예약·CBT 종료일이 지났는데 해당 CTA가 남아있지 않음 (상태 전환 점검)

## 15. 단계별 페이지 변형 매트릭스
| 단계 | Hero 배지 | Primary CTA | Snapshot 출시일 | News 섹션 | 비고 |
| --- | --- | --- | --- | --- | --- |
| Announce | 공개 예정 | 디스코드/뉴스레터 | "미정" | 비노출 | 스크린샷 1~2장만 |
| Pre-registration | 사전 예약 | 사전 예약 (App/Play) | "Q? YYYY" | 비노출 | 디바이스 목업 필수 |
| CBT / Soft Launch | CBT 진행 중 | 신청 폼 | "테스트 기간" | Optional | 피드백 채널 노출 |
| Live | 서비스 중 | 스토어 다운로드 | 출시일 | 권장 | 평점/리뷰 표기 검토 |
| Service End | 서비스 종료 | 비노출 | "운영 종료 YYYY-MM" | 종료 공지 | CTA 모두 제거, 보존 안내 |

---

본 문서는 신규 모바일 프로젝트가 추가될 때마다 부족한 항목·예외 케이스를 반영해 업데이트한다. 변경 시 `docs/prd.md` §3·§4, `docs/guideline.md` §3과 일관성을 유지할 것.
