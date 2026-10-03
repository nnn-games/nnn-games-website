# Tomato Splatter 상세 페이지

## 현재 구성 (2026-10-02)

- HTML: `site/tomato-splatter.html` → `/tomato-splatter.html`
- 콘텐츠 원본: `shared/assets/www-tomato-splatter/content.json`
- 상세 로더: `site/js/project-details/tomato-splatter.js`
- 운영 설정·지표: `shared/data/projects.json` (id: `tomato-splatter`)
- 상태: development / 출시 예정: 2027-02 / 플랫폼: Roblox
- featured·정렬값 40·pinned 유지. 외부 링크·클라이언트·기술 스택은 미확정.
- 수집 지표와 히어로 집계 플래그는 변경하지 않음. Tomato Splatter Simulator와 별도 프로젝트.

## JSON 편집 방법 (2026-10-03)

이미지 10개와 프로젝트 콘텐츠를 `shared/assets/www-tomato-splatter/`에서 함께 관리합니다. 화면에서는 압축된 WebP를 사용하며 기존 PNG 원본도 보존합니다.

| JSON 위치 | 수정 내용 |
| --- | --- |
| `project` | KO/EN/JA 카드 제목·설명·프리뷰 이미지·상세 주소·프로젝트 정보·링크 |
| `detail` | KO/EN/JA SEO·히어로·개요·핵심 포인트·요약·특징·대표 이미지·갤러리 3장과 alt |
| `presentations.company-intro` | 회사 소개 제목·요약·이미지 alt (KO/EN/JA) |
| `presentations.jumpstart` | 제안서 이미지 캡션·alt (KO/EN) |

홈페이지 문구는 필드별 `{ "ko": "한국어", "en": "English", "ja": "日本語" }`, 발표 문구는 언어별 키 사전입니다. 경로는 `assets/www-tomato-splatter/...`를 사용합니다. 기존 빌드가 카드 데이터·초기 SEO·발표 번역을 생성하고 `{{project:tomato-splatter:image}}`를 프리뷰 경로로 바꿉니다. 상세 JS는 JSON의 `detail`을 읽습니다.

운영 상태·정렬·노출·수집 ID·reporting·metrics는 기존 레지스트리에 유지합니다. 발표의 출시 월·단계별 연구 목표·진척도는 기존 덱에서 관리합니다. Tomato Splatter Simulator의 정보와 자산은 별도로 유지합니다.

검증: `npm run check`, `npm run agent:smoke -- --pages /,/projects-roblox.html,/tomato-splatter.html,/company-intro/,/jumpstart/`.

## 레이아웃·원고 기준

Hunt a Slime·ASMR UGC Town을 참고해 기존 공통 렌더러의 `mode: standard`를 사용합니다. 제목·소개·배지·목록 복귀 버튼, 대표 이미지, 개요·핵심 포인트·관련 링크, 프로젝트 정보·주요 특징 사이드바, 갤러리 순서입니다. 모바일은 같은 공통 레이아웃에서 한 열로 전환합니다.

KO/EN/JA 원고·SEO·이미지 대체 텍스트는 `content.json`의 `detail`에 기록합니다. 카드 설명은 `project`에서 관리하고 HTML 기본 메타는 빌드가 생성합니다.

- 장르: Action RPG. 제목 소개와 카드·SEO에 장르 및 사냥·성장·마왕에 맞서는 모험을 반영합니다.
- 개요: 게임 소개 / 마왕의 부활과 마을·탐험 / 봉인의 비밀과 붉은 정원 / 개발 안내.
- 핵심 포인트: 토마토 괴물 무리 사냥 / 전리품과 장비·스킬 성장 / 분열·합체하는 괴물과 보스 도전.
- 주요 특징: 플레이 흐름 / 대상 플레이어. Hunt a Slime의 해당 구성을 토마토 괴물에 맞춰 적용합니다.
- 개발 상태와 기존 출시 예정 월을 표시. 소개된 시스템은 개발 목표이며 실제 플레이 화면·체험 주소는 추후 공개.

## 사용자 제공 스토리 (2026-10-02)

오래전 봉인된 **토마토 마왕**이 깨어나면서, 평화로운 세계가 거대한 덩굴과 토마토 괴물들에게 침식되기 시작한다. 플레이어는 자신의 아바타로 사냥꾼이 되어 위기에 빠진 마을을 구하고, 숲과 광산, 무너진 요새를 탐험하며 성장한다. 동료들과 함께 봉인의 비밀을 밝혀낸 사냥꾼들은 마왕의 영역인 **‘붉은 정원’**으로 향한다. 세계 전체가 마왕의 정원으로 변하기 전에, 그 지배를 끊고 빼앗긴 땅을 되찾아야 한다.

- EN 명칭 초안: Tomato Demon King / Crimson Garden.
- JA 명칭 초안: トマト魔王 / 紅の庭園.
- 게임 플레이 특징은 사용자 요청에 따라 Hunt a Slime과 동일하게 적용합니다. 몬스터 명칭은 토마토 괴물로 바꾸고, 무리 사냥·전리품 수집·장비/스킬 성장·분열/합체·보스 도전 및 대상 플레이어를 반영합니다.
- 플레이 흐름: 지역 탐험 → 토마토 괴물 사냥 → 전리품 획득 → 장비 교체·스킬 성장 → 다음 지역과 보스에 도전.

## 이미지

원본 PNG 5종은 `shared/assets/www-tomato-splatter/`에 보존합니다. 새 이미지들은 실제 플레이 화면이 아닌 콘셉트 아트로 소개합니다. 동일 폴더의 웹용 WebP 사본 5종은 총 약 0.9MB입니다.

| 용도 | 배포 경로 | 크기 |
| --- | --- | --- |
| 홈·목록 카드 / 회사 소개 카드 | `assets/www-tomato-splatter/tomatosplatter-preview.webp` | 640×360 |
| 상세 대표 / OG·Twitter | `assets/www-tomato-splatter/tomatosplatter-main.webp` | 1200×675 |
| 갤러리: 무기 궤적 | `assets/www-tomato-splatter/tomatosplatter-gallery-1.webp` | 1200×675 |
| 갤러리: 번개 마법 | `assets/www-tomato-splatter/tomatosplatter-gallery-2.webp` | 1200×675 |
| 갤러리: 세계 전경 | `assets/www-tomato-splatter/tomato-splatter-concept1.webp` | 1200×600 |

## 작업 이력

- 2026-09-29: 이름 기반 임시 농장 콘셉트 이미지·소개 등록. 생성 당시 프롬프트와 경로는 `docs/projects/project-concept-image-prompts.json`에 과거 기록으로 보존.
- 2026-10-02: 사용자 제공 프로젝트 이미지 기반으로 소개와 표준 상세 레이아웃 작성. 삭제된 JPG를 참조하던 카드·상세·회사 소개 경로 교체.

## 검증

- `npm run check` 통과.
- 홈·목록·상세·회사 소개의 KO/EN/JA × 1280·390·320px smoke 36조합 통과, 실패·경고 0.
- 이미지 비율 보완 후 상세 smoke 9조합 통과, 이미지 표시 비율 36개 확인. PC·모바일 PNG 직접 확인.
- 최종 상세 증거: `exports/agent/2026-10-01T20-27-55-194Z-57668/`.

- 스토리·Action RPG·플레이 특징 반영 후 `npm run check` 통과. 상세·홈·목록 × KO/EN/JA × 1280·390·320px smoke 27조합 통과(실패·경고 0). KO PC·EN/JA 모바일 PNG 직접 확인. 증거: `exports/agent/2026-10-01T20-34-14-970Z-65213/`.
