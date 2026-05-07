# Tomato Splatter Simulator 상세 페이지 작업 계획

- **slug**: `tomato-splatter-simulator`
- **HTML**: `tomato-splatter-simulator.html`
- **콘텐츠 설정 파일**: `js/project-details/tomato-splatter-simulator.js`
- **카드 메타 위치**: `data/projects.json` (id: `tomato-splatter-simulator`)

> 사용자에게 노출되는 모든 텍스트 필드는 KO / EN / JA 3개 언어로 채워야 합니다.
> 작성 기준: `assets/tomatosplattersimulator/info.png` 의 인게임 설명 OCR 결과.

---

## 0. 메타 (`data/projects.json`)
- category: `roblox`
- status: `active`
- featured: `true`
- launchDate: `2026`
- platform: `Roblox`
- client: `Internal Project`
- technologies: `[ "Roblox Studio", "Luau", "Action Simulator" ]`
- placeId / universeId: `98363496512711` / `8296982488`
- thumbnail (image): `assets/tomatosplattersimulator/tss-preview.jpg` (현재 `images/nnn-logo.png` 임시 → 교체 예정)
- detailPage: `tomato-splatter-simulator.html`
- 외부 링크
  - play: `https://www.roblox.com/ko/games/98363496512711/Tomato-Splatter-Simulator`
  - showcase: 동일 (play 와 중복이라 노출은 play 한 곳만 유지)
  - trailer / article / group: 미정 (확보되면 추가)
- reporting: `collectMetrics: true`, `includeInHeroProjectCount: true`, `includeInHeroVisitTotal: true`

## 1. SEO
- title
  - ko: `Tomato Splatter Simulator - NNN GAMES`
  - en: `Tomato Splatter Simulator - NNN GAMES`
  - ja: `Tomato Splatter Simulator - NNN GAMES`
- description
  - ko: 토마토를 부수고 성장하며 더 강해지는 Roblox 액션 시뮬레이터 프로젝트입니다.
  - en: A Roblox action simulator built on a smash-and-grow loop that turns every tomato into power.
  - ja: トマトを潰して成長し、さらに強くなっていくRobloxアクションシミュレーターです。
- keywords
  - ko: `Roblox, Tomato Splatter Simulator, action simulator, growth, casual combat`
  - en: `Roblox, Tomato Splatter Simulator, action simulator, growth, casual combat`
  - ja: `Roblox, Tomato Splatter Simulator, action simulator, growth, casual combat`
- ogTitle
  - ko: `Tomato Splatter Simulator | Roblox Action Simulator`
  - en: `Tomato Splatter Simulator | Roblox Action Simulator`
  - ja: `Tomato Splatter Simulator | Roblox Action Simulator`
- ogDescription
  - ko: 처치 → 성장 → 더 강한 처치로 이어지는 끝없는 도파민 루프의 Roblox 액션 시뮬레이터.
  - en: A Roblox action simulator wrapped around an endless smash-and-grow dopamine loop.
  - ja: 倒す→成長→さらに倒す、無限のドーパミン・ループを軸にしたRobloxアクションシミュレーター。
- ogImage: `assets/tomatosplattersimulator/tss-main.jpg`

## 2. Hero
- title (KO / EN / JA): `Tomato Splatter Simulator` (3개 언어 동일)
- tagline
  - ko: 토마토를 박살내고 더 빠르고 거대해지는, 끊임없이 성장하는 Roblox 액션 시뮬레이터입니다.
  - en: A Roblox action simulator where every tomato you smash makes you faster, bigger, and stronger.
  - ja: トマトを叩き潰すほど速く、大きく、強くなるRobloxアクションシミュレーターです。
- status 배지
  - ko: 정식 운영 중
  - en: Live
  - ja: 運営中
- genre 라벨
  - ko: `장르: 액션 시뮬레이터`
  - en: `Genre: Action Simulator`
  - ja: `ジャンル: アクションシミュレーター`
- platform 라벨
  - ko: `플랫폼: Roblox`
  - en: `Platform: Roblox`
  - ja: `プラットフォーム: Roblox`

## 3. CTA 버튼
| # | type | style | 버튼 텍스트 (KO / EN / JA) |
|---|------|-------|------------------|
| 1 | play | primary | Roblox에서 플레이 / Play on Roblox / Robloxでプレイ |

> trailer / article / group 확보 시 ghost 스타일 버튼으로 추가.

## 4. 메인 미디어
- type: `image` (트레일러 확보 시 `youtube` 로 교체 검토)
- src: `assets/tomatosplattersimulator/tss-main.jpg`
- alt
  - ko: Tomato Splatter Simulator 대표 이미지
  - en: Tomato Splatter Simulator key visual
  - ja: Tomato Splatter Simulator キービジュアル

## 5. 개요 (Overview)
1. 문단 1 (정체성 + 핵심 루프)
   - ko: Tomato Splatter Simulator는 토마토를 부수고 성장하며 더 강해지는 Roblox 액션 시뮬레이터입니다. 평화로운 농장에서 화산 계곡까지 무대를 옮기며 더 많은 토마토를 처치할수록 캐릭터는 점점 빠르고 거대하며 강력해집니다.
   - en: Tomato Splatter Simulator is a Roblox action simulator built around a satisfying smash-and-grow loop. As you crush tomatoes from peaceful farms all the way to volcanic valleys, your character becomes faster, bigger, and stronger with every wave.
   - ja: Tomato Splatter Simulatorは、トマトを潰して成長していくRobloxアクションシミュレーターです。穏やかな農場から火山の谷まで舞台を移しながら、倒したトマトの数だけキャラクターはどんどん速く・大きく・強くなっていきます。
2. 문단 2 (디자인 의도 + 결)
   - ko: 스킬 업그레이드와 신규 섬 해금이 끊임없는 도파민 루프를 만듭니다. 토마토 주스가 튀는 연출, 회오리 성장, 플라잉 소드 같은 과장된 액션 장치가 가족친화적 톤을 유지하면서도 시원한 타격감을 전달합니다.
   - en: Skill upgrades and new-island unlocks chain into an endless dopamine loop. Splashing tomato juice, whirlwind-scale growth, and flying-sword unlocks keep the action exaggerated and family-safe while still delivering punchy hit feedback.
   - ja: スキル強化と新しい島のアンロックが、終わりのないドーパミン・ループを生み出します。飛び散るトマトジュース、竜巻スケールの成長、フライングソードの解放など、ファミリー向けの軽快なトーンを保ちながらも強い手応えを届ける誇張表現を採用しています。

## 6. 핵심 포인트 (Highlights) — 3개
1. **Growth** — 성장이 곧 게임플레이
   - eyebrow (KO/EN/JA): `Growth` / `Growth` / `Growth`
   - title
     - ko: 처치할수록 더 빠르고 거대해지는 성장 루프
     - en: Defeat more, grow faster and bigger
     - ja: 倒すほど速く・大きくなる成長ループ
   - description
     - ko: 쓰러뜨린 토마토 수가 곧 캐릭터의 속도·크기·파워로 직결됩니다.
     - en: Every tomato you crush translates directly into speed, size, and damage.
     - ja: 倒したトマトの数が、そのままスピード・サイズ・火力に反映されます。
2. **Variety** — 다양한 환경과 해금
   - eyebrow: `Variety`
   - title
     - ko: 농장에서 화산 계곡까지 이어지는 신규 섬 해금
     - en: From farms to volcanic valleys — keep unlocking new islands
     - ja: 農場から火山の谷まで、次々アンロックされる新しい島
   - description
     - ko: 환경이 바뀔 때마다 새로운 토마토와 보상이 등장해 진행 동기를 끌어올립니다.
     - en: Each new biome introduces fresh tomato types and rewards, keeping progression alive.
     - ja: 新しい環境ごとに、新たなトマトと報酬が登場して進行モチベーションを高めます。
3. **Spectacle** — 시각적 카타르시스
   - eyebrow: `Spectacle`
   - title
     - ko: 토마토 주스 연출이 만드는 명확한 타격감
     - en: Splashy tomato-juice feedback that lands every hit
     - ja: トマトジュース演出が生む明確なヒット感
   - description
     - ko: 파격적인 이펙트와 회오리·플라잉 소드 같은 과장된 액션이 가벼운 톤 안에서 강한 카타르시스를 만듭니다.
     - en: Bold splashes, whirlwinds, and flying swords keep the action exaggerated and cathartic — without leaving the casual tone.
     - ja: 派手なエフェクトと竜巻・フライングソードのような誇張表現が、軽快なトーンの中で強いカタルシスを生みます。

## 7. 스냅샷 (Snapshot)
- launch
  - ko: `2026년`
  - en: `2026`
  - ja: `2026年`
- status
  - ko: `라이브 운영`
  - en: `Live operation`
  - ja: `ライブ運営`
- client
  - ko: `내부 프로젝트`
  - en: `Internal project`
  - ja: `内部プロジェクト`
- stack
  - ko: `Roblox Studio / Luau / Action Simulator`
  - en: `Roblox Studio / Luau / Action Simulator`
  - ja: `Roblox Studio / Luau / Action Simulator`

## 8. 특징 (Features) — 4개
1. **끊임없는 성장 루프**
   - title: 끊임없는 성장 루프 / Endless growth loop / エンドレスな成長ループ
   - description
     - ko: 처치 → 레벨업 → 더 강해진 처치의 자가 강화 사이클로 진행 동기를 유지합니다.
     - en: A self-reinforcing kill → level → bigger kill cycle keeps motivation high.
     - ja: 処理→レベルアップ→さらに強くなって処理、という自己強化サイクルで動機を維持します。
2. **환경 기반 진행**
   - title: 환경 기반 진행 / Environment-driven progression / 環境ごとの進行
   - description
     - ko: 농장·계곡·화산 등 지역마다 차별화된 적과 보상이 등장해 신선도가 유지됩니다.
     - en: Farms, valleys, and volcanic zones each introduce new enemies and rewards to keep things fresh.
     - ja: 農場・谷・火山など、エリアごとに異なる敵と報酬が登場し、鮮度を保ちます。
3. **스킬 & 섬 해금 시스템**
   - title: 스킬 & 섬 해금 / Skill & island unlocks / スキル＆島のアンロック
   - description
     - ko: 스킬 업그레이드와 신규 섬 해금이 진행 깊이와 재방문 동기를 만듭니다.
     - en: Skill upgrades and new-island unlocks add depth and repeat-play value.
     - ja: スキル強化と新しい島のアンロックが、深みと再訪動機を作ります。
4. **캐주얼·가족친화 톤**
   - title: 캐주얼·가족친화 톤 / Casual, family-safe tone / カジュアル＆ファミリーフレンドリー
   - description
     - ko: 토마토 주스로 표현된 연출 (Not real blood) 이 진입 장벽을 낮추면서 시원한 손맛을 유지합니다.
     - en: Tomato-juice action — explicitly "not real blood" — keeps the experience accessible while still feeling punchy.
     - ja: トマトジュースで表現された演出（Not real blood）が、誰でも気軽に遊べる爽快感を保ちます。

## 9. 관련 링크 (Links)
| type | 표시 텍스트 (KO / EN / JA) | URL |
|------|----------------------------|-----|
| play | Tomato Splatter Simulator 플레이하기 / Play Tomato Splatter Simulator / Tomato Splatter Simulatorをプレイ | https://www.roblox.com/ko/games/98363496512711/Tomato-Splatter-Simulator |

> trailer/article 확보 시 추가.

## 10. 갤러리 (Gallery)
- 현재 에셋 미확보. 인게임 스크린샷 N장 (제안 5~8장) 수집 후 `assets/tomatosplattersimulator/tss-gallery-0.jpg` … 형식으로 배치.
- alt 패턴
  - ko: `Tomato Splatter Simulator 갤러리 N`
  - en: `Tomato Splatter Simulator gallery N`
  - ja: `Tomato Splatter Simulator ギャラリー N`

## 11. 체크리스트
- [ ] `data/projects.json` 카드 thumbnail 을 `assets/tomatosplattersimulator/tss-preview.jpg` 로 교체
- [ ] `js/project-details/tomato-splatter-simulator.js` 콘텐츠 입력 (KO / EN / JA — 본 plan 의 1~10번 그대로 옮기기)
- [ ] 이미지 에셋 준비 (`tss-preview.jpg` / `tss-main.jpg` / `tss-gallery-N.jpg`) → `assets/tomatosplattersimulator/` 에 배치
- [ ] `tomato-splatter-simulator.html` 의 og:image / twitter:image 경로를 `assets/tomatosplattersimulator/tss-main.jpg` 로 갱신
- [ ] 외부 링크 유효성 확인 (https)
- [ ] i18n 누락 키 확인
- [ ] `npm run build:css` 후 로컬 미리보기 동작 확인

## 메모 / 결정 사항
- 정보 출처: 인게임 설명 스크린샷 (`assets/tomatosplattersimulator/info.png`) OCR.
- 트레일러 / 기사 / 그룹 링크는 현재 미보유 → 확보 시 CTA 와 Snapshot 양쪽에 반영.
- 컨셉 키워드: `smash-and-grow`, `endless dopamine loop`, `family-safe`, `flying swords`, `cute tomatoes`.
