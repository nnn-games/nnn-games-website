# 프로젝트별 기획·참고 자료

각 상세 페이지의 실제 노출 데이터(카피, 메타, 링크, 에셋)를 KO/EN/JA 3개 언어 기준으로 정리하기 위한 페이지별 계획서입니다.

- 표준 골격: [`_template.md`](_template.md)
- 데이터 반영 순서: 본 계획서 확정 → [프로젝트별 JSON 편집 안내](asset-content.md)에 따라 `shared/assets/www-<project>/content.json` 수정 → 필요한 운영 설정만 `shared/data/projects.json` 수정 → 로컬 빌드 검증. `contentFile`이 없는 프로젝트는 기존 상세 JS를 사용합니다.

## 페이지 목록

### Roblox
- [`hacker-vs-security/`](hacker-vs-security/README.md) — Hacker vs Security (2026-09-29 페이지 아카이브)
- [`star-reach/`](star-reach/README.md) — Star Reach (2026-09-29 페이지 아카이브)
- [`nnn-ugc/`](nnn-ugc/README.md) — NNN UGC

### Mobile
- [`forest-workshop/`](forest-workshop/README.md) — Forest Workshop
- [`mine-sweeper/`](mine-sweeper/README.md) — Mine Sweeper

### 신규 프로젝트 (2026-09-29 등록)
- [`hunt-a-slime/`](hunt-a-slime/README.md) — Hunt a slime
- [`tomato-splatter/`](tomato-splatter/README.md) — Tomato Splatter
- [`asmr-ugc-town/`](asmr-ugc-town/README.md) — ASMR UGC Town

### 추가 참고 자료

- [Tower Flood Race](tower-flood-race/README.md)
- [Enchanted Weapon 참고 이미지](enchanted-weapon/README.md)
- [콘셉트 이미지 생성 프롬프트](project-concept-image-prompts.json)

새 프로젝트는 `<slug>/README.md`에 기획서를 작성하고, 원본·참고 이미지는 같은 폴더에 모읍니다. 웹 화면에서 직접 사용하는 자산은 `shared/assets/<project>/`에 둡니다.
## 자산 JSON 편집 안내

현재 `shared/assets`의 모든 프로젝트 폴더는 이미지와 다국어 콘텐츠를 함께 관리합니다. [전체 매핑·편집 규칙](asset-content.md)을 먼저 참고하세요. 보관·미등록 프로젝트의 공개 상태는 유지합니다.
