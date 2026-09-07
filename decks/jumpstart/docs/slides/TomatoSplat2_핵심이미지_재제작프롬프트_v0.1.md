# Tomato Splatter — 핵심 이미지 재제작 프롬프트

문서 v0.1 · 2026-08-02  
용도: Jumpstart 제안 슬라이드 핵심 이미지 3종 재제작  
출력 성격: `Visual Direction Study — Not Final Gameplay`

## 공통 방향

- 대상: 18세 이상 핵앤슬래시·아이템 파밍 플레이어
- 유지할 것: 토마토 무리, 휠윈드, 케첩 타격, Coin과 무기 드랍, 직접적인 아이템 성장
- 제거할 것: 복셀 농장, 기본 블록 캐릭터, 아동용 과장 표정, 장난감 같은 재질, 불필요한 배경 프롭
- 화면 목표: 전투 밀도가 높아도 플레이어, 공격 범위, 우선 목표와 전리품이 분리되어 읽혀야 한다.
- 표현 목표: 토마토 소재의 유머는 유지하되, 화면 구성과 재질·조명·VFX는 성인용 액션 RPG 제안서에 맞는 정교함을 가져야 한다.
- 배경 원칙: 아직 확정되지 않은 마을 테마를 발명하지 않는다. 단순한 중립 전투장 또는 정보가 적은 배경을 사용한다.
- 금지: 다른 게임의 캐릭터·UI·로고·고유 디자인 모방, 피와 고어, 텍스트, 워터마크
- `피와 고어` 금지의 근거: 연령 배려가 아니라 붉은 액체를 토마토 과즙으로 고정하기 위한 아트 아이덴티티 제약이다. 스플래시의 양, 슬라이스 밀도, 연쇄 길이는 오히려 적극적으로 키운다. 상세는 `TomatoSplat2_슬라이드_이미지프롬프트_v0.2.md` §0 참조.

---

## 1. 고밀도 휠윈드 전투

### 표현하려는 내용

이 이미지는 다음 한 문장을 증명해야 한다.

> 플레이어가 토마토 무리의 중심으로 들어가 휠윈드 한 번으로 화면을 장악하고, 연쇄 타격 뒤에 희귀 전리품을 발견한다.

필수 정보:

- 한 명의 플레이어와 매우 많은 토마토 적
- 플레이어 중심의 360도 공격 범위
- 공격 전·적중·처치가 한 화면에서 시간의 흐름처럼 읽히는 무리 반응
- 토마토와 케첩으로만 표현되는 타격
- 일반 Coin·무기 드랍과 한 개의 희귀 무기 빛기둥
- 배경보다 전투가 먼저 보이는 화면 위계

### 생성 프롬프트

```text
Use case: stylized-concept
Asset type: 16:9 Jumpstart pitch-deck hero gameplay visual
Input image: Image 1 is a semantic reference only. Preserve its intended gameplay information—dense tomato crowd, central whirlwind, ketchup impacts, Coin and a rare weapon drop—but do not preserve its voxel farm, blocky child character, cartoon faces, toy materials, lighting or art style.
Primary request: redraw the core Tomato Splatter combat moment for an adult action-RPG audience. One high-fidelity stylized humanoid game avatar stands inside an extremely dense ring of tomato enemies and performs a powerful 360-degree whirlwind. Enemies closest to the blade compress, split and burst into graphic ketchup-like splashes; enemies farther out remain readable as the next wave closing in. Coin and a few weapons drop behind the cleared arc. One rare weapon produces a restrained vertical rarity-colored light beam.
Scene/backdrop: a compact neutral private combat arena with a dark matte ground plane and only minimal distant geometry; no farm, barn, windmill, medieval village, biome story or decorative props.
Style/medium: polished high-fidelity stylized 3D game key art; sophisticated action-RPG presentation; clean authored silhouettes; detailed but optimized-looking materials; graphic VFX shapes rather than particle fog; clearly achievable as a real-time game target.
Composition/framing: elevated three-quarter gameplay camera, not a cinematic eye-level shot; wide 16:9; complete whirlwind radius visible; high enemy count around the full circumference; the player, active hit zone, surviving enemies, dropped loot and rare beam remain separate visual layers.
Lighting/mood: controlled dramatic lighting with strong value separation; intense and satisfying but witty because every red splash is visibly tomato ketchup, never frightening.
Color palette: restrained charcoal and warm neutral arena; lacquered tomato red and leaf green; ivory-gold whirlwind trail; small cyan or violet rare-drop accent. Avoid rainbow saturation.
Materials/textures: tomatoes have smooth natural skin with simple faceted deformation, not plastic voxel cubes; weapon metal and cloth have believable stylized material response.
Constraints: no blood, gore or body horror; no cute screaming emoji faces; no giant head proportions; no default block avatar; no UI; no text; no logos; no watermark. Do not copy any existing game character or environment.
```

---

## 2. 한손 대형 무기와 쌍수의 전투 차이

### 표현하려는 내용

이 이미지는 다음 선택을 설명해야 한다.

> 한손 대형 무기는 넓은 무리를 한 번에 정리하고, 쌍수는 좁은 범위에서 엘리트와 보스를 빠르게 집중 공격한다.

두 무기는 외형만 달라서는 안 된다. 공격 범위, 적의 수, 타격 리듬이 한눈에 달라야 한다.

### 생성 프롬프트

```text
Use case: stylized-concept
Asset type: 16:9 Jumpstart pitch-deck combat comparison visual
Input image: Image 1 is a semantic reference only. Preserve only the left-versus-right gameplay comparison. Replace the voxel farm, block character, cartoon tomato king, toy weapons and child-oriented rendering completely.
Primary request: show the same high-fidelity stylized humanoid game avatar using two weapon types in two equal gameplay panels. Left panel: one oversized one-handed heavy weapon creates a broad, slower 360-degree sweep that strikes a very large tomato crowd at once; the complete wide attack radius and many simultaneous hit reactions are visible. Right panel: dual weapons create narrow, extremely rapid alternating strikes concentrated on one large elite tomato; repeated hit flashes cluster tightly around the target while surrounding basic enemies remain mostly untouched.
Scene/backdrop: the exact same compact neutral private combat arena in both panels; dark matte ground and minimal distant geometry; no farm, village or narrative environment.
Style/medium: polished high-fidelity stylized 3D game visual for an adult action-RPG pitch; authored silhouettes; restrained premium color; realistic material response within a stylized real-time rendering target.
Composition/framing: locked elevated three-quarter gameplay camera, same avatar scale and same arena position in both panels; an intentional clean gap separates the two actions; left reads as wide and slow, right reads as narrow and fast even as a small slide thumbnail.
Lighting/mood: controlled contrast and crisp attack readability; powerful, deliberate and tactical rather than playful chaos.
Color/VFX: left uses one broad ivory-gold arc with limited sparks; right uses several short cool-white or cyan hit streaks tightly grouped on the elite. Tomato impacts use graphic ketchup splashes only.
Constraints: the left weapon must be visibly held and controlled as one one-handed heavy weapon; the right must show exactly two weapons; no crown, royal costume or invented boss lore; no cute emoji faces; no blood or gore; no UI; no text; no logos; no watermark; do not imitate another game's weapons or character.
```

---

## 3. 전리품을 직접 성장으로 바꾸는 과정

### 표현하려는 내용

이 이미지는 작업대나 제작 시설을 설명하는 장면이 아니다. 다음 플레이 흐름을 보여줘야 한다.

> 전투에서 얻은 전리품을 확인하고, 비교하고, 선택한 무기에 보석을 배치해 다음 전투를 준비한다.

자동 제작 기계나 시스템의 자동 선택이 아니라 플레이어의 직접적인 판단이 화면의 주인공이어야 한다.

### 생성 프롬프트

```text
Use case: illustration-story
Asset type: 16:9 three-panel loot-and-build storyboard for a Jumpstart pitch deck
Input image: Image 1 is a semantic reference only. Preserve the idea that the player actively chooses weapons and gems. Remove the farm, workshop, workbench, forge, shop, pet token, block character and all invented environment details.
Primary request: create a continuous three-panel sequence showing how Tomato Splatter turns battle loot into a player-made build decision. Panel 1—Discover: immediately after combat in the neutral private arena, the avatar stands near several weapon and gem drops; one rare weapon is marked by a restrained rarity-colored beam. Panel 2—Compare: in a clean neutral inspection space, the same avatar deliberately holds two different weapon choices at equal height and studies their distinct silhouettes and socket positions; no automatic recommendation is shown. Panel 3—Commit: close view of the avatar's hands manually inserting one chosen colored gem into the selected weapon socket; unchosen items remain visible and untouched.
Scene/backdrop: minimal dark neutral presentation space derived from the combat arena; no workshop, table, forge, village, store or crafting machine.
Style/medium: polished high-fidelity stylized 3D game storyboard for an adult action-RPG pitch; premium restrained rendering; precise prop silhouettes; interface-free visual storytelling.
Composition/framing: three equal vertical panels read left to right; same avatar and selected weapon across the sequence; each panel has one clear action; generous separation prevents visual clutter.
Lighting/mood: rewarding discovery followed by focused consideration and a satisfying deliberate commitment.
Color palette: restrained charcoal and warm neutral base; weapon metals; tomato-red residue only in the first panel; a single gem color becomes the focal accent across panels two and three.
Constraints: player choice must be unmistakable; no automatic enhancement, auto-combine, auto-dismantle, auto-equip, auto-investment or automated machinery; no numerical stats or invented UI; no pet token; no cute emoji faces; no blood or gore; no text; no logos; no watermark.
```

---

## 결과 사용 원칙

- 세 결과는 시각 방향을 검토하기 위한 재제작안이며 실제 게임 화면으로 표기하지 않는다.
- 기존 PNG 3종을 덮어쓰지 않고 `_v2` 파일로 보관한다.
- 최종 제출 사용 여부는 아트 디렉터가 캐릭터, 토마토, 무기와 VFX 방향을 확인한 뒤 결정한다.
- 전작 및 신작의 실제 자료가 확보되면 해당 자료를 참조 이미지로 다시 생성하거나 실제 빌드 캡처로 교체한다.

## 생성 결과

| 표현하려는 내용 | 결과 파일 | 검토 포인트 |
|---|---|---|
| 고밀도 휠윈드로 무리를 장악하고 희귀 전리품을 발견 | `assets/01_hero_whirlwind_concept_v3.png` | 베이컨 아바타·적 유형·공격 범위·드랍 가독성 |
| 한손 대형 무기와 쌍수가 서로 다른 전투 해법을 제공 | `assets/02_weapon_comparison_concept_v2.png` | 넓고 느린 공격과 좁고 빠른 공격의 즉시 구분 |
| 발견한 전리품을 비교하고 보석을 직접 배치 | `assets/03_loot_build_choice_concept_v2.png` | 자동 성장이 아닌 플레이어의 직접 판단 |

제작 방식: Codex 내장 `image_gen`.

### 1번 이미지 추가 수정 프롬프트

최초 재제작안에서 토마토의 발광 눈과 표정이 지나치게 위협적으로 나와 다음 수정 프롬프트를 추가 적용했다. 최종 `_v2` 파일은 이 수정 결과다.

```text
Use case: precise-object-edit
Asset type: revised 16:9 Jumpstart pitch-deck hero gameplay visual
Input images: Image 1 is the edit target. Image 2 is the visual reference only for the tomato enemy face treatment and slightly cleaner readability.
Primary request: change only the tomato enemies' faces and the excessive red splash density in Image 1. Replace every glowing eye, fang-like mouth and demonic expression with the restrained tomato treatment from Image 2: normal small dark eyes, minimal graphic brows, subtle determined or mildly annoyed expressions, no visible teeth. Reduce the ketchup splashes enough that individual enemy silhouettes and the dark arena ground remain readable, while still preserving a strong ring of chain-hit reactions.
Invariants: preserve Image 1's exact elevated camera, wide composition, central female warrior identity and pose, full 360-degree ivory-gold whirlwind, very high enemy count, neutral dark arena, coin drops, weapon drops, violet rare-weapon beam, overall material quality and presentation. Keep the same adult action-RPG polish; do not brighten it into a children's game.
Constraints: tomatoes must read immediately as tomatoes, not monsters or severed heads; ketchup only, no blood, gore or horror; no cute emoji faces; no UI; no text; no logos; no watermark. Change only the specified tomato expressions and splash density.
```

### 1번 이미지 베이컨 아바타·적 유형 수정 프롬프트

사용자 검토에 따라 현실형 캐릭터를 고품질 베이컨 아바타로 교체하고, 동일한 토마토 무리를 역할별 네 가지 실루엣으로 재구성했다. 최종 `_v3` 파일은 다음 프롬프트의 결과다.

```text
Use case: precise-object-edit
Asset type: revised 16:9 Jumpstart pitch-deck hero gameplay visual for Tomato Splatter
Input image: Image 1 is the edit target.
Primary request: replace the central realistic human warrior with a high-quality Roblox R15 Bacon Hair avatar, and replace the nearly identical tomato crowd with four clearly differentiated tomato enemy concepts based on real tomato varieties and the game's four combat roles.
Character replacement: a recognizable premium-quality Bacon Hair Roblox avatar with authentic R15 block-based proportions and visible segmented Roblox joints; square tan head; classic simple Roblox face; layered swept brown bacon-strip hair; blue jacket over a dark shirt; dark pants; blocky hands and boots. Keep the avatar unmistakably Roblox, not a realistic human, anime character, miniature toy, or voxel character. The avatar performs the same centered 360-degree whirlwind using a large fantasy sword, with a polished high-fidelity real-time material treatment.
Tomato variety system:
1. Basic enemies: many small round cherry tomatoes moving in tight packs, simple red skin and minimal determined faces.
2. Ranged enemies: fewer tall elongated Roma tomatoes, distinct vertical silhouette, leafy vine appendage raised in a ranged attack wind-up with visible seed projectiles forming near them.
3. Prism enemies: rare faceted golden-orange heirloom tomatoes with restrained translucent prism surfaces and small Coin glints, visually valuable but still clearly tomatoes.
4. Elite enemies: a few very large ribbed beefsteak tomatoes with deep crimson skin, thick broad green calyx shapes like natural armor, stronger silhouette and subtle gem-colored accents; no crown and no invented royal theme.
Composition: preserve the exact elevated three-quarter camera, wide arena framing, central full 360-degree ivory-gold whirlwind, high overall enemy density, dark neutral private arena, Coin and weapon drops, violet rare-weapon beam and readable negative space. Distribute all four enemy types across the crowd so their silhouettes remain identifiable at slide size; basic cherry tomatoes are the majority, ranged and prism types are sparse priority targets, elite types are large anchors.
Visual style: polished expressive high-fidelity Roblox game target for an adult action-RPG audience; sophisticated lighting and materials while retaining authentic Roblox avatar geometry; tomatoes should be smoothly modeled and organically ribbed, not cubes, voxels, LEGO-like bricks or low-poly block spheres.
Hit reactions: tomatoes inside the active attack ring show squash, slicing and ketchup-like splashes; intact tomatoes remain outside the ring. Ketchup must read as tomato pulp and juice, never blood.
Constraints: preserve gameplay readability; no identical tomato clones; no cute screaming emoji faces; no demonic faces, glowing eyes, fangs, gore or horror; no realistic human anatomy; no generic voxel art; no farm or village; no UI; no text; no logo; no watermark. Change only the player design, tomato enemy variety and associated hit reactions; keep the established composition and loot presentation.
```
