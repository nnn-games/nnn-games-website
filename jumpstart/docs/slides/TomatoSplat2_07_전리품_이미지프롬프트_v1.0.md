# Tomato Splatter 슬라이드 07 이미지 생성 프롬프트 v1.0

## 목적

디아블로 II: 레저렉션의 게임 화면을 참고해 `전리품이 쏟아진다 → 직접 고른다 → 새 무기로 다시 싸운다`는 흐름을 Tomato Splatter의 캐릭터와 토마토 전투로 재해석한다.

디아블로 II 이미지는 아이템이 쏟아지는 밀도, 아이템을 살펴보는 행동, 장착 후 다시 전투로 돌아가는 흐름만 참고한다. 캐릭터, 적, 무기, 배경, UI는 그대로 복제하지 않는다.

## 필요한 참조 이미지

1. `REFERENCE 1 — Diablo II loot drop`: 몬스터 처치 직후 여러 아이템 이름과 장비가 바닥에 쏟아진 게임 화면
2. `REFERENCE 2 — Diablo II item inspection`: 인벤토리에서 새 무기의 능력치를 확인하는 화면
3. `REFERENCE 3 — Diablo II Barbarian combat`: 이전과 다른 무기를 장착한 바바리안의 전투 화면
4. `REFERENCE 4 — Tomato Splatter art`: 확정된 플레이어 캐릭터, 토마토 적, 전투장, 무기 디자인

가능하면 Diablo II 참조 이미지는 공식 미디어 또는 직접 캡처한 화면을 사용하고, 슬라이드 하단 출처 표기를 위해 원본 URL이나 캡처 정보를 함께 보관한다.

## 최종 생성 프롬프트

```text
Use case: stylized-concept
Asset type: vertical three-moment gameplay story for the left side of a 16:9 game pitch slide
Primary request: translate the loot-to-next-fight excitement shown in the supplied Diablo II: Resurrected gameplay references into the original Tomato Splatter game world.

Input images:
- Reference Image 1 — Diablo II loot-drop gameplay: use only for the density, anticipation, and readability of many items appearing immediately after combat.
- Reference Image 2 — Diablo II inventory inspection: use only for the idea that the player pauses to inspect and choose a newly found weapon.
- Reference Image 3 — Diablo II Barbarian combat: use only for the transition from equipping a different weapon to returning to combat with a visibly different attack feel.
- Reference Image 4 — Tomato Splatter art direction: use as the authoritative source for the player character, tomato enemies, weapons, arena, materials, lighting, and overall stylized 3D look.

Scene structure: create one 4:5 vertical image divided into three connected cinematic gameplay moments, read from top to bottom. The divisions should feel like a continuous story rather than hard UI panels.

Moment 1 — Loot spills out:
Immediately after a dense tomato horde is defeated, many different rewards are scattered across the stone arena: common materials, coins, and clearly different weapon silhouettes including an axe, hammer, sword, and another one-handed weapon. Most drops are visually quiet while one rare weapon is easy to notice through a restrained vertical rarity-colored light beam. Tomato remains must read as ketchup, seeds, pulp, and tomato skin, never blood or gore.

Moment 2 — A choice worth making:
The same player character stops to inspect the new rare weapon. Show the old weapon and the newly found weapon clearly enough that the choice is understandable through their silhouettes. Do not create a detailed inventory interface or fake stat comparison UI. The character's attention and hand placement should communicate deliberate selection.

Moment 3 — The next fight feels different:
The same character has equipped the newly selected weapon and is fighting a fresh tomato group. The weapon silhouette and attack effect must be visibly different from the previous equipment. Emphasize a satisfying new attack rhythm, strong enemy reactions, and renewed momentum toward the next hunt.

Style/medium: premium stylized 3D action-RPG concept art, elevated isometric gameplay camera, readable at slide scale, original Tomato Splatter character and world design.
Composition/framing: 4:5 portrait asset intended to fill the left 48 percent of a landscape slide; keep the player, loot, and selected weapon large enough to read; maintain the same character identity, arena, lighting, and color palette across all three moments.
Lighting/mood: dark medieval arena with warm torchlight, restrained gold and violet loot accents, energetic but not grim.

Constraints:
- Diablo II references guide pacing, loot density, and player behavior only; do not copy its characters, UI, item names, fonts, icons, environment assets, or exact weapon designs.
- Show several different weapon silhouettes; do not make the arsenal sword-only.
- No readable item names, stats, labels, captions, interface windows, logos, or watermark inside the generated image.
- Ketchup must clearly be tomato condiment with visible seeds and pulp; no realistic blood, human injury, gore, or severed body parts.
- Do not imply that a detailed rarity, socket, gem, or affix system is final.
```

## 슬라이드 표기

새 이미지를 적용할 때 기존 캡션 `CONCEPT VISUAL — NOT FINAL GAMEPLAY`을 유지한다. 디아블로 II 실제 화면을 슬라이드에 직접 삽입하는 경우에만 별도 캡션 `REFERENCE GAMEPLAY — DIABLO II: RESURRECTED`과 이미지 출처를 표시한다.
