# Tomato Splatter — Jumpstart 슬라이드 이미지 프롬프트

문서 v0.3 · 2026-08-03  
기준 문서: `../TomatoSplat2_Jumpstart_제안서_초안_v0.5.md`  
용도: 실제 제출 슬라이드에 사용할 이미지 제작 지시서

---

## 0. `no blood, no gore` 제약의 근거

이 문서와 하위 프롬프트 전반에 들어 있는 `no blood`, `no gore`, `no horror` 제약은 **저연령 이용자를 배려하기 위한 제한이 아니다.** 이 제안의 대상은 Roblox의 성인 이용자이며, 무해함은 세일즈 포인트가 아니다.

이 제약의 실제 목적은 두 가지다.

1. **아트 아이덴티티 고정** — 튀는 붉은 액체가 피가 아니라 토마토 과즙과 과육으로 읽혀야 한다. 씨앗, 과육, 껍질 조각이 보여야 한다는 지시가 여기에 해당한다.
2. **표현 강도의 상한 제거** — 피는 강도를 올릴수록 혐오감이 함께 올라가 연출에 제동이 걸린다. 토마토는 그 축을 제거하기 때문에 피를 쓰는 게임이 멈춰야 하는 지점보다 더 많은 양, 더 넓은 범위, 더 긴 연쇄까지 밀어붙일 수 있다.

따라서 프롬프트에서 제거해야 하는 것은 **고어의 강도가 아니라 피라는 소재**다. 스플래시의 양, 슬라이스의 밀도, 연쇄의 길이는 오히려 적극적으로 키운다. 반대로 `아동용 과장 표정`, `장난감 재질`, `cute emoji faces`처럼 저연령 톤을 만드는 요소는 계속 금지한다.

---

## 1. 사용 원칙

### 프롬프트에 고정해도 되는 요소

다음 요소는 현재 기획서에 명시되어 있으므로 이미지에 사용할 수 있다.

- 플레이어 주변을 가득 메우는 토마토 무리
- 360도 휠윈드와 연쇄 타격
- 토마토가 터질 때 표현되는 케첩 또는 토마토 주스
- Coin과 무기 드랍
- 희귀 무기의 등급색 빛기둥
- 기본형·원거리형·프리즘형·엘리트형의 적 역할
- 넓고 느린 한손 대형 무기와 좁고 빠른 쌍수
- 티어·등급·타입, 랜덤 옵션, 소켓과 보석
- 개인 전투장, 웨이브와 보스
- 마을 4개와 전투장 12개의 진행 구조
- 직접 조작과 자동 전투의 즉시 전환
- 강화·합성·분해·보석 배치·성장 투자는 플레이어가 직접 결정

### 참조 자료 없이 고정하면 안 되는 요소

다음 요소는 문서에서 시각 디자인이 확정되지 않았다.

- 플레이어 캐릭터의 성별, 얼굴, 복장과 색상
- 마을 1~4와 전투장 1~12의 구체적인 테마
- 토마토 적의 얼굴, 팔다리와 재질 표현
- 보스 12종의 외형
- 무기 25종의 구체적인 실루엣
- 펫 32종의 외형
- 실제 HUD, 인벤토리와 성장 화면의 배치
- 로고와 서체

이 요소들은 프롬프트에 임의로 작성하지 않고 `{확정 디자인}` 변수 또는 입력 참조 이미지로 제공한다.

### 권장 입력 이미지

실제 제출용 이미지를 만들기 전에 다음 자료를 준비한다.

- Image 1: 전작 토마토 모델과 재질 참조
- Image 2: 신작 플레이어 캐릭터 디자인 참조
- Image 3: 한손 대형 무기와 쌍수 디자인 참조
- Image 4: 확정된 마을 또는 전투장 아트 참조
- Image 5: 전작 휠윈드·슬라이스 VFX 참조

참조 자료가 없는 경우 결과물에는 반드시 `Visual Direction Concept — Designs Not Final`을 표시한다.

---

## 2. 우선순위

| 우선순위 | 이미지 | 사용 슬라이드 | 제작 방식 |
|---|---|---|---|
| P0 | 핵심 전투 히어로 이미지 | 1, 2 | 참조 기반 생성 또는 실제 빌드 캡처 |
| P0 | 휠윈드 연쇄 타격 시퀀스 | 4 | 참조 기반 생성 또는 실제 빌드 캡처 |
| P0 | 한손 대형·쌍수 비교 | 6 | 참조 기반 생성 |
| P0 | 전리품 발견과 직접 성장 | 7 | 실제 UI 목업 또는 실제 빌드 캡처 |
| P1 | 적 역할 4종 비교 | 4 또는 6 보조 | 참조 기반 생성 |
| P1 | 희귀 드랍 연출 비교 | 2 또는 7 보조 | 참조 기반 생성 |
| P1 | 직접 조작·자동 전투 비교 | 5 | 동일 장면의 상태 비교 |
| P1 | 모바일 화면 가독성 검증 장면 | 10, 11 | 실제 빌드 캡처 우선 |
| P2 | 마을·전투장 진행 비주얼 | 9 | 테마 확정 후 생성 |
| P2 | 무기 등급·티어 연출 보드 | 7 또는 12 | 무기 디자인 확정 후 생성 |
| 실제 자료 | 전작 검증 캡처 | 13 | 생성 금지 |
| 실제 자료 | 제작 파이프라인 사례 | 13 | 생성 금지 |

---

## 3. 공통 프롬프트 블록

아래 블록을 모든 생성 프롬프트 뒤에 붙인다.

```text
Input images:
- Image 1: tomato enemy design reference; preserve its silhouette, face language, material and color
- Image 2: player character design reference; preserve identity, proportions, outfit and colors
- Image 3: weapon design reference; preserve silhouettes and construction
- Image 4: environment art reference; preserve theme, palette and material language
- Image 5: combat VFX reference; preserve the established whirlwind and hit-effect language

Style/medium: polished stylized 3D game visual consistent with all supplied references; readable at presentation size
Constraints: show only mechanics and designs specified in this prompt or supplied references; no invented UI; no invented characters; tomatoes and ketchup only; no blood; no gore; no horror; no text; no logo; no watermark
Avoid: photorealism; realistic human anatomy; dark grim tone; visual clutter that hides enemies, attack range or loot; designs borrowed from other games
```

입력하지 않은 참조 이미지는 목록에서 삭제한다. 참조가 없는데 `preserve`를 요구하지 않는다.

---

## 4. 이미지 프롬프트

## IMG-01. 핵심 전투 히어로 이미지

사용 슬라이드: 1, 2  
목적: 한 장으로 게임의 플레이 순간을 설명  
화면 비율: 16:9

```text
Use case: stylized-concept
Asset type: pitch-deck hero gameplay image
Primary request: show one player character entering the center of a very dense tomato enemy crowd and performing a powerful 360-degree whirlwind; many tomatoes are hit in a rapid chain and burst into ketchup-like splashes; Coin and several weapon drops scatter from defeated enemies; one rare weapon is immediately recognizable by a vertical rarity-colored light beam
Scene/backdrop: {confirmed battlefield theme}; keep the arena readable and less visually complex than the combat
Subject: one player character, a dense ring of tomato enemies, a clear circular whirlwind trail, chain-hit reactions, Coin, common weapon drops and one rare weapon drop
Composition/framing: elevated three-quarter gameplay camera; wide 16:9 frame; player and whirlwind at the center; the entire enemy ring and rare-drop beam visible; reserve clean space for the slide title
Lighting/mood: energetic and triumphant; humorous tomato-and-ketchup context rather than frightening violence
Required readability: player silhouette, attack radius, number of enemies, ketchup hit reactions, Coin and rare-drop beam must remain separately readable
```

금지: 확정되지 않은 농장·중세 마을·성·사막·설원 등을 임의로 선택하지 않는다.

---

## IMG-02. 휠윈드 연쇄 타격 3단계

사용 슬라이드: 4  
목적: 휠윈드가 움직일 때 완성되는 타격 리듬을 설명  
화면 비율: 16:9, 가로 3패널

```text
Use case: illustration-story
Asset type: three-panel gameplay action storyboard
Primary request: depict one continuous Tomato Splatter combat action in three equal panels
Panel 1: the player enters a dense tomato crowd; enemies converge around the player; no enemies have burst yet
Panel 2: the 360-degree whirlwind makes contact; several tomatoes deform or split at the hit timing; the circular weapon trail remains clearly visible
Panel 3: the chain attack completes; many tomatoes have burst into ketchup-like splashes; Coin and weapons scatter; one rare weapon creates a vertical rarity-colored light beam
Scene/backdrop: identical {confirmed battlefield theme} and identical camera in all three panels
Subject: the same player, same weapon and same tomato crowd across the sequence
Composition/framing: locked elevated three-quarter gameplay camera; consistent player position and scale; actions readable from left to right
Constraints: preserve temporal continuity; do not redesign the player, weapon, enemies or arena between panels; no captions or panel numbers inside the image
```

---

## IMG-03. 적 역할 4종 실루엣 보드

사용 슬라이드: 4 또는 6의 보조 자료  
목적: 수치 색칠이 아니라 역할이 다른 적 구성임을 보여줌  
화면 비율: 16:9

```text
Use case: stylized-concept
Asset type: enemy role lineup for a game pitch deck
Primary request: show four tomato enemy designs in one clean lineup, each communicating a different gameplay role while remaining members of the same tomato enemy family
Role 1 — Basic: the standard mass enemy; simplest and smallest silhouette
Role 2 — Ranged: a silhouette and pose that clearly communicates attacking from distance; do not decide the projectile design unless supplied in a reference
Role 3 — Prism: a reward target that visually suggests it releases Coin and weapon drops when hit; use only the confirmed prism visual reference if supplied
Role 4 — Elite: larger and tougher priority target associated with gem drops; stronger silhouette without becoming a boss
Scene/backdrop: plain neutral presentation background, no battlefield
Composition/framing: four full-body enemies at the same baseline; front three-quarter view plus small silhouette thumbnails; equal spacing
Constraints: do not invent names, weapons, costumes or elemental themes; preserve the supplied tomato design language; no text inside the image
```

주의: 원거리형의 투사체 방식과 프리즘형의 구체적 외형은 미확정이다. 참조가 없으면 이미지 제작을 보류한다.

---

## IMG-04. 한손 대형 무기와 쌍수 비교

사용 슬라이드: 6  
목적: 두 타입이 같은 수치의 외형 차이가 아니라 다른 전투 해법임을 시각화  
화면 비율: 16:9, 좌우 비교

```text
Use case: stylized-concept
Asset type: split gameplay comparison image
Primary request: show the same player character in two combat situations using the two confirmed weapon types
Left situation: one oversized one-handed weapon produces a broad, slower 360-degree attack that hits a large tomato crowd at once; emphasize wide range and screen control
Right situation: dual weapons produce rapid concentrated hits against one elite tomato or boss; emphasize narrow range, speed and repeated critical-hit rhythm
Scene/backdrop: the same {confirmed battlefield theme}, camera, lighting and player identity on both sides
Composition/framing: balanced left-right comparison; enough separation that the two attack shapes never overlap; entire attack ranges remain visible
Color/VFX: use the supplied VFX reference; attack trails may differ in shape and rhythm but must not introduce unconfirmed elements or powers
Constraints: use the exact supplied one-handed and dual-weapon designs; no additional weapons; no UI; no text
```

---

## IMG-05. 희귀 드랍 순간

사용 슬라이드: 2 또는 7  
목적: 일반 드랍과 희귀 드랍이 전투 중 즉시 구분되는 순간을 보여줌  
화면 비율: 16:9 또는 4:3

```text
Use case: stylized-concept
Asset type: close gameplay loot-drop image
Primary request: show the moment immediately after a dense tomato group is defeated; Coin and several weapon drops lie across the combat ground; common drops remain visually quiet while one rare weapon is recognizable from a distance through its rarity color and a vertical light beam
Scene/backdrop: {confirmed battlefield theme}; ground texture simple enough to preserve loot readability
Subject: defeated tomato traces expressed only as ketchup-like splashes, Coin, several weapons from the supplied design sheet, one rare weapon and its light beam
Composition/framing: elevated gameplay camera; rare weapon placed away from the center so the beam does not cover the player; compare quiet common drops and prominent rare drop in the same frame
Lighting/mood: rewarding discovery after combat
Constraints: no loot chest unless confirmed; no treasure room; no text labels; no floating item names; no inventory UI
```

---

## IMG-06. 전리품을 직접 성장으로 바꾸는 화면

사용 슬라이드: 5, 7, 11  
목적: 성장 행위를 시스템이 대신하지 않는다는 것을 보여줌  
화면 비율: 16:9 안에 모바일 세로 화면 2~3개

```text
Use case: ui-mockup
Asset type: high-fidelity mobile game UI flow mockup
Primary request: create a practical three-screen mobile inventory flow for Tomato Splatter using the supplied UI wireframe and art references
Screen 1 — Review: inventory grid sorted by tier and rarity; selected weapon shows type, tier, rarity, random options and socket count in one comparison panel
Screen 2 — Decide: the player manually selects which items to keep, enhance, combine or dismantle; multiple selection is visible, but no action has executed yet
Screen 3 — Confirm: a clear summary shows selected targets, Coin or material cost and expected result; the player must press one final confirmation button
Style/medium: realistic shippable mobile game UI, not concept art; large touch targets; readable hierarchy; restrained decoration
Composition/framing: three portrait phone frames on one landscape presentation canvas; identical inventory data across the sequence
Constraints: the system must not auto-select an enhancement, combination, dismantle or investment result; no background resource consumption; do not invent final icons or typography—use neutral placeholders where references are absent; no store or purchase prompt
Avoid: small desktop-style text; dense tooltips; automatic crafting conveyor imagery; fake engagement metrics
```

필수 입력: UI 와이어프레임. 와이어프레임 없이 만든 이미지는 최종 UI 증빙으로 사용하지 않는다.

---

## IMG-07. 직접 조작과 자동 전투 전환

사용 슬라이드: 5  
목적: 두 모드가 별도 게임이 아니라 같은 전투 흐름임을 보여줌  
화면 비율: 16:9, 동일 장면 2패널

```text
Use case: stylized-concept
Asset type: two-state gameplay comparison
Primary request: show the exact same Tomato Splatter battlefield moment in two side-by-side states
Left state — Direct control: the player is manually repositioning through a tomato crowd while the 360-degree attack continues
Right state — Auto battle: the same character moves toward the nearest enemy cluster, gathers enemies around the player, clears the cluster with the same whirlwind and prepares to move to the next cluster
Scene/backdrop: identical {confirmed battlefield theme}, enemy count, camera and lighting in both states
Composition/framing: locked elevated gameplay camera; show the movement direction and enemy clustering through poses and spacing, not through invented UI
Constraints: combat result, damage and loot rules are identical in both states; do not show automatic enhancement, combination, dismantling, equipment, point investment or pet combination; no text inside the image
```

---

## IMG-08. 모바일 화면 가독성 검증 장면

사용 슬라이드: 10, 11  
목적: 고밀도 전투에서도 핵심 정보가 읽히는 화면을 제시  
화면 비율: 실제 모바일 가로 화면 비율

```text
Use case: stylized-concept
Asset type: mobile gameplay readability target image
Primary request: show a dense Tomato Splatter combat scene framed exactly as a mobile gameplay screen; many tomato enemies surround the player, but the player silhouette, whirlwind radius, elite target, incoming ranged threat, Coin and rare-drop beam remain separately readable
Scene/backdrop: {confirmed battlefield theme}; simplified ground and props; no decorative objects inside the combat readability zone
Subject: one player, dense basic tomato group, one ranged enemy, one prism enemy, one elite enemy, whirlwind attack, Coin and one rare weapon drop
Composition/framing: elevated three-quarter gameplay camera; keep important targets away from phone edges and thumb-control zones
VFX constraint: cap simultaneous bright effects; use size, timing, silhouette and color hierarchy rather than filling the screen with particles
Constraints: this is a visual target, not performance proof; do not display FPS, memory, device model or benchmark values; no invented UI except safe-area guides if requested
```

실제 성능 슬라이드에는 최종적으로 이 콘셉트 대신 대표 기기에서 촬영한 실제 빌드 캡처를 사용한다.

---

## IMG-09. 마을과 전투장 진행 비주얼

사용 슬라이드: 9  
목적: 마을 하나와 그에 속한 세 전투장이 하나의 테마를 공유하며 변주되는 구조를 설명  
화면 비율: 16:9, 4패널

```text
Use case: stylized-concept
Asset type: environment progression concept sheet
Primary request: show one confirmed town theme and its three related battlefields as a coherent four-panel environment family
Panel 1: {confirmed town theme}, including social area, shop/training functions only if their visual designs are supplied
Panel 2: Battlefield A using the same terrain family with the lightest enemy density and simplest props
Panel 3: Battlefield B using the same terrain family with changed spawn density, lighting and prop arrangement
Panel 4: Battlefield C using the same terrain family with the strongest progression atmosphere and boss arena readability
Style/medium: stylized 3D environment concept consistent with the supplied art reference
Composition/framing: four equal establishing views using comparable camera height and scale
Constraints: share terrain and prop language across all four panels; vary density, lighting and arrangement rather than inventing unrelated biomes; no characters; no enemies; no text
```

제작 전 필요 결정: `{마을 테마}`, `{지형 재질}`, `{조명 변화}`, `{대표 프롭}`. 마을 3·4 테마는 원 GDD에서도 정합성 미결정으로 기록되어 있으므로 임의 생성하지 않는다.

---

## IMG-10. 무기 등급과 티어의 시각 언어

사용 슬라이드: 7, 9 또는 12의 보조 자료  
목적: 모델을 무한히 늘리지 않고 색상·트레일·파티클 레이어로 확장하는 방식을 설명  
화면 비율: 16:9

```text
Use case: stylized-concept
Asset type: weapon visual-system concept board
Primary request: use one exact supplied weapon model to demonstrate the confirmed visual layers without changing the base silhouette
Row 1 — Rarity: show five rarity states differentiated by the approved rarity colors and presentation intensity
Row 2 — Tier: show the same base weapon with the approved tier trail progression
Row 3 — Special option: show only approved particle accents associated with special options
Style/medium: clean stylized 3D game asset presentation, neutral dark background, consistent scale and camera
Composition/framing: aligned grid; every weapon uses the identical base model and angle so only the visual layer changes
Constraints: do not invent rarity colors, tier colors, particle symbols or option effects; use supplied tables and VFX references; no text inside the rendered image
```

제작 전 필요 자료: 등급 색상표, 티어별 트레일 규칙, 특수 옵션 파티클 규칙.

---

## 5. 생성하지 않고 실제 자료로 준비할 이미지

## CAP-01. 전작 실제 전투 캡처

사용 슬라이드: 13

촬영 조건:

- 휠윈드 모션, 토마토 피격과 VFX가 동시에 보이는 장면
- HUD가 핵심 전투를 가리지 않는 해상도
- 개발용 디버그 정보 제거
- 실제 라이브 또는 검증 빌드임을 확인할 수 있는 원본 보관
- 캡션: `Tomato Splatter Simulator — Live Build Capture`

생성형 이미지로 대체하지 않는다.

## CAP-02. 전작 라이브 출시 증빙

사용 슬라이드: 13

필요 자료:

- 실제 Roblox 경험 페이지 캡처
- 게임명과 제작자 정보가 읽히는 상태
- 공개 상태나 출시 사실을 확인할 수 있는 영역
- 이용자 수치가 유리하지 않거나 맥락이 불명확하면 수치를 확대하지 않는다.

## CAP-03. 아트 제작 파이프라인

사용 슬라이드: 13

필요 자료:

- 동일 자산의 모델링 → 애니메이션 → VFX 적용 전후
- 한 화면에 세 공정이 비교되도록 동일 카메라 사용
- 실제 제작 파일 또는 빌드 화면 사용
- 캡션에 담당 범위와 제작 기간은 검증 가능한 사실만 표기

## CAP-04. 모바일 성능 검증 캡처

사용 슬라이드: 10

필요 자료:

- 대표 모바일 기기에서 실행한 실제 빌드
- 전투 밀도가 높은 조건
- 프레임, 메모리, 장시간 안정성 값은 측정 도구의 실제 결과만 사용
- 콘셉트 이미지에 임의의 FPS나 메모리 수치를 합성하지 않는다.

---

## 6. 현재 생성 이미지에 대한 판단

현재 `assets` 폴더의 PNG 3종은 슬라이드 구성을 시험하기 위한 초기 콘셉트다.

| 파일 | 사용할 수 있는 부분 | 확정되지 않은 부분 |
|---|---|---|
| `01_hero_whirlwind_concept.png` | 무리, 휠윈드, 케첩, Coin, 희귀 드랍 | 농장 배경, 캐릭터, 토마토 얼굴, 무기 디자인 |
| `02_weapon_comparison_concept.png` | 넓은 무리 공격과 빠른 보스 공격의 대비 | 캐릭터, 무기, 보스와 배경 디자인 |
| `03_loot_build_choice_concept.png` | 플레이어가 전리품을 직접 고른다는 메시지 | 작업대와 마을 배경은 기획서에 없는 연출 |

따라서 이 파일들은 내부 방향 검토에는 사용할 수 있지만, 최종 제출본에는 확정 아트 참조를 반영한 이미지로 교체하는 것이 안전하다.

