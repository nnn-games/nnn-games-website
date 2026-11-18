# 2026년 11월 진행 중인 프로젝트

덱 ID·주소: `nnn-dev-2611` · `/nnn-dev-2611/`

2026년 11월 개발 프로젝트 6종을 소개하는 총 본문 7장 덱입니다. 프로젝트 제목과 기존 이미지·화면을 연결하고 사용자 제공 출시 목표와 개발 진척도를 반영했습니다. 각 상세 슬라이드에는 장르·주요 타깃·핵심 재미를 간략하게 소개합니다. 상태는 `active`, 언어는 KO/EN/JA입니다. 2026-11-18 사용자 배포 요청으로 초안을 공개 전환했습니다.

공개 영어 발표 주소: [Games in Development · November 2026](https://www.triplengames.com/nnn-dev-2611/?lang=en#/1). 검색과 사이트맵에는 포함하지 않습니다.

## 슬라이드 구성

| 실제 순서 | 화면 번호 | ID | 내용 |
| --- | --- | --- | --- |
| 01 | 없음 | `projects` | 6개 프로젝트 이미지와 타이틀만 소개 |
| 02 | 01 | `tomato-splatter` | Tomato Splatter |
| 03 | 02 | `enchanted-weapon` | Enchant a Weapon |
| 04 | 03 | `hunt-a-slime` | Hunt a Slime |
| 05 | 04 | `asmr-ugc-town` | ASMR UGC Town |
| 06 | 05 | `loppy-asmr-tower` | Loppy ASMR Tower |
| 07 | 06 | `archer-simulator` | Archer Simulator |

첫 소개 페이지는 번호 없이 표시하며 게임 설명 제목 옆에만 01~06을 붙입니다. 하단의 별도 페이지 카운터는 숨겨 화면에는 게임 번호만 표시합니다. 7장 구성과 이동 버튼·도트·키보드·기존 `#/1`~`#/7` 주소는 유지합니다. 공통 런타임을 바꾸지 않고 카운터의 필수 DOM 요소는 숨긴 상태로 유지합니다.

프로젝트 6종은 사용자 확인에 따라 기존 개발 게임 4종과 Loppy ASMR Tower·Archer Simulator로 확정했습니다. NNN UGC는 포함하지 않습니다. Loppy 표기는 사용자 요청을 따르며 연결한 기존 자산은 Loopy ASMR Tower 자료입니다. 홈페이지의 프로젝트 등록·운영 상태는 바꾸지 않습니다.

소개 카드와 개별 슬라이드의 프로젝트 순서는 Tomato Splatter → Enchant a Weapon → Hunt a Slime → ASMR UGC Town → Loppy ASMR Tower → Archer Simulator입니다. 사용자 지정 3종을 앞에 배치하고 나머지는 기존 상대 순서를 유지했습니다.

## 출시 목표와 개발 진척도

출시 목표와 진척도의 출처는 2026-11-18 사용자 제공 개발 현황입니다. 현재 발표가 2026년 11월 기준이므로 다가오는 1월은 2027년으로 해석했습니다. 목표 일정이며 확정 출시일을 뜻하지 않습니다. 사용자 메시지의 Loppy ASMR Town은 기존 Loppy ASMR Tower의 진척도로 반영했습니다.

| 프로젝트 | 출시 목표 | 개발 진척도 |
| --- | --- | --- |
| Tomato Splatter | 2027년 1월경 | 55% |
| Enchant a Weapon | 2026년 11월 | 90% |
| Hunt a Slime | 2026년 12월 | 60% |
| ASMR UGC Town | 2026년 11월 | 80% |
| Loppy ASMR Tower | 2026년 12월 | 65% |
| Archer Simulator | 2027년 1월 말 | 20% |

현재 덱의 프로젝트별 `release_<id>`·`progress_<id>` 문구를 KO/EN/JA로 관리하며 홈페이지와 다른 덱의 출시 계획·진척도는 별도 자료로 유지합니다.

## 형식

- 1장은 PC 3열×2행, 모바일 1열입니다. 프로젝트 6종의 이미지 전체 비율을 보존하고 타이틀만 붙입니다.
- 2~7장은 Jumpstart의 게임 소개인 `progress-2026-10-29-stage-1`~`stage-3`을 참고합니다. 좌측 번호형 장르·타깃·재미 요약, 우측 프로젝트 이미지와 하단 출시 목표·개발 진척도 카드로 구성합니다. 게임 설명에서는 게임명을 상단 제목에만 표시하고 정보 카드 위의 중복 레이블은 두지 않습니다.
- 좌측은 게임 장르·주요 타깃·핵심 재미의 세 항목입니다. 타깃은 연령과 성별을 두 줄로 구분해 표시합니다. 출시 목표와 개발 진척도는 위 사용자 현황을 표시합니다. 기존 Jumpstart의 10월 진척도와 출시 계획은 현재 덱에 인용하지 않습니다.
- 전체 제목·번호·서체·색상·여백은 company-intro 기본 형식을 유지합니다. 공통 `decks/shared/deck.css`와 `deck.js`를 사용합니다. 다른 덱의 배포 상태에 의존하지 않도록 필요한 스타일과 발표 전용 이미지는 새 덱에 둡니다.

## 게임별 간략 소개

| 프로젝트 | 장르 | 주요 타깃(연령·성별) | 핵심 재미 |
| --- | --- | --- | --- |
| Tomato Splatter | 3D 서바이버 · 루팅 액션 RPG | 15세 이상 · 남성 중심 | 대규모 몬스터 사냥과 희귀 전리품, 장비·스킬 조합으로 강해지는 재미 |
| Enchant a Weapon | AD&D 룰 기반 무기 제작·강화 RPG | 10~18세 · 남성 중심 | 재료를 모아 무기를 만들고, +10 강화에 도전해 UGC를 얻는 성취감 |
| Hunt a Slime | 슬라임 사냥 액션 RPG | 10~18세 · 남성 중심 | 슬라임 무리 사냥, 전리품 파밍과 장비·스킬 조합, 보스 도전 |
| ASMR UGC Town | 캐주얼 Obby · ASMR · 수집 | 8~12세 · 여성 중심 | 장애물을 넘는 소리·반응의 쾌감과 모은 재료를 UGC로 바꾸는 보상 |
| Loppy ASMR Tower | 캐릭터 IP 기반 ASMR 타워 Obby | 8세 이하 · 여성 중심 | 디저트 발판을 오르는 도전과 루피 테마, 소리·반응의 즐거움 |
| Archer Simulator | 캐주얼 활쏘기 시뮬레이터 | 10~24세 · 전체 | 정확히 맞히는 손맛, 기록 경신과 장비 성장 |

장르와 재미 요소는 기존 기획을 요약했습니다. 주요 타깃은 2026-11-18 편집 초안을 사용자 수정사항으로 보정한 목표 연령·성별입니다. 화면 항목명은 주요 타깃으로 표시합니다. 실제 이용자 구성 통계가 아닌 기획 검토용 초안입니다. Archer의 장르와 재미도 명칭을 바탕으로 작성한 콘셉트 제안입니다.

- Tomato Splatter: `docs/decks/jumpstart/README.md` 26장 확정 방향(3D 뱀파이어 서바이버 + 디아블로식 루팅)과 `shared/assets/www-tomato-splatter/content.json`의 전투·전리품·성장 설명.
- Enchant a Weapon: `shared/assets/www-enchant-a-weapon/content.json`의 제작·강화·+10 UGC 보상 설명. AD&D 룰 기반이라는 설명은 2026-11-18 사용자 제공 개발 정보입니다.
- Hunt a Slime: `docs/projects/hunt-a-slime/game-introduction.md`와 해당 자산 JSON의 대상 플레이어·전투·성장 설명.
- ASMR UGC Town: `shared/assets/www-asmr-ugc-town/content.json`의 ASMR Obby·탐험·수집·UGC 교환 설명.
- Loppy ASMR Tower: `decks/company-intro/`의 Pororo IP·루피 ASMR 타워 소개와 디저트 발판 썸네일.
- Archer Simulator: 사용자 제공 프로젝트명에서 출발한 편집 제안. 기록 경신·장비 성장은 확정 기능으로 취급하지 않습니다.

## 자산과 문구 출처

| 프로젝트 | 이미지 | 성격 |
| --- | --- | --- |
| Enchant a Weapon | `shared/assets/www-enchant-a-weapon/eaw-preview.jpg` | Jumpstart에서도 사용하는 기존 대표 이미지 |
| ASMR UGC Town | `shared/assets/www-asmr-ugc-town/asmr-ugc-town-preview.jpg` | 기존 대표 이미지 |
| Hunt a Slime | `shared/assets/www-hunt-a-slime/hunt-a-slime-preview.webp` | Jumpstart에서도 사용하는 기존 대표 이미지 |
| Tomato Splatter | `decks/nnn-dev-2611/assets/tomato-development.webp` | Jumpstart `img/tmsp-v1.webp`의 개발 로비 화면 복사본 |
| Loppy ASMR Tower | `decks/nnn-dev-2611/assets/loppy-asmr-tower.webp` | company-intro `assets/pororo-loopy-thumbnail.webp`의 게임 썸네일 복사본 |
| Archer Simulator | `decks/nnn-dev-2611/assets/archer-simulator.webp` | 2026-11-18 사용자 제공 프로모션 이미지 |

신규 이미지를 생성하지 않았습니다. 대표 이미지·썸네일은 실제 플레이 스크린샷과 구별합니다. Tomato Splatter 이미지는 원본 1914×753 비율로 보존합니다. Archer Simulator의 제목·출시 목표·진척도는 사용자 제공 현황을 사용합니다. 장르·타깃·재미는 프로젝트명을 바탕으로 작성한 콘셉트 제안이며 슬라이드에도 이를 표시합니다.

Archer 이미지는 사용자 첨부 파일 `Screenshot 2026-11-18 at 11.56.58 AM.png`를 사용합니다. 원본은 [source-images/archer-simulator.png](source-images/archer-simulator.png)에 보존하고, 웹에서는 품질 90의 WebP 사본을 소개 카드와 상세 슬라이드 양쪽에 연결했습니다. 956×536 원본 비율과 전체 구도를 유지하며 960,364바이트에서 88,808바이트로 압축했습니다. 원본 SHA-256: `21c72994f50a5f452e8e517703b4201219e9ced320097bab7861d57dd91332d9`.

자산 프로젝트 4종의 제목·이미지 alt·장르·타깃·재미 문구는 각 `shared/assets/www-<project>/content.json`의 `presentations.nnn-dev-2611`에서 KO/EN/JA로 관리합니다. 빌드가 이 문구를 덱에 합칩니다. Loppy·Archer 소개와 공통 항목 제목은 `decks/nnn-dev-2611/slides.js`의 `DECK_I18N`에서 관리합니다.

## 영어 발표 원고

2026-11-18 북미 게임 업계 실무자 대상 발표에 맞춰 7장 전체 영어 문구를 교정했습니다. 영어 표시 제목은 `Games in Development · November 2026`이며 브라우저·접근성·등록 제목도 같은 문구를 사용합니다.

- 장르는 문장형 대소문자로 통일하고 `loot-driven action RPG`, `RPG based on AD&D rules, with weapon crafting and upgrades`, `ASMR obby` 등 실제 플레이를 설명하는 표현을 사용합니다.
- `Genre`·`Target Audience`·`Core Appeal`·`Target Launch`·`Development Progress`를 공통 항목명으로 사용합니다.
- 주요 타깃은 `Ages 10–18` / `Primarily male`처럼 연령·성별 두 줄로 표시합니다. 기존 연령과 성별 방향은 그대로 반영합니다.
- 핵심 재미는 플레이어 행동 중심의 짧은 문장으로 정리합니다. UGC 보상은 `UGC avatar items`로 구체화하고 소리·반응은 `satisfying sounds and feedback`으로 표현합니다.
- Tomato의 1월경은 `January 2027 (est.)`, Archer의 1월 말은 `Late January 2027`로 표시합니다. Archer의 별도 콘셉트 주석과 기존 게임명 표기는 유지합니다.

## 편집과 확인

- 화면: `decks/nnn-dev-2611/index.html`, 순서·공통 번역: `slides.js`, 스타일: `deck.css`.
- 각 `.project-goals`의 `.goal-body`에 `genre_<id>`·`target_<id>`·`fun_<id>` 문구를 연결합니다. 자산 프로젝트는 위 JSON에서, Loppy·Archer는 덱 번역 사전에서 편집합니다. 출시 목표·진척도를 변경하면 근거와 기준일도 이 문서에 기록합니다.
- `npm run dev` 후 `http://localhost:8080/nnn-dev-2611/`에서 검토합니다. 운영 빌드에 포함하며 사이트맵에서는 제외합니다.

```bash
npm run check
npm run agent:smoke -- --pages /nnn-dev-2611/
```

기존 검증 이력: 초기 3장 `exports/agent/2026-11-18T01-54-28-336Z-5352/`, 이름 확정 전 7장 골격 `exports/agent/2026-11-18T02-03-25-434Z-10962/`. 과거 `exports/decks/nnn-dev-2611/`의 3장 PNG·PDF는 현재 덱과 다릅니다. 모든 검토 이미지는 Git에서 제외한 `exports/`에 둡니다.

현재 형식 검토본 검증: `npm run check` 통과. KO/EN/JA × 1280·390·320px smoke 9조합 통과, 실패·경고 0건. 7장 전체와 모바일 하단 화면 69개를 직접 확인했습니다. 보고서: `exports/agent/2026-11-18T02-14-18-420Z-17095/report.json`.

프로젝트 순서 조정 후 `npm run check`와 smoke 9조합 통과(실패·경고 0건). 소개 카드와 이동한 2·3·5장의 PC·320px PNG를 직접 확인했습니다. 보고서: `exports/agent/2026-11-18T02-30-32-928Z-25744/report.json`.

출시 목표 반영 후 `npm run check`와 smoke 9조합 통과(실패·경고 0건). 상세 6장의 PC·언어별 320px 일정을 직접 확인했습니다. 보고서: `exports/agent/2026-11-18T02-41-04-801Z-31095/report.json`. 일본어 1월 말 표기를 `1月末`로 다듬은 뒤 번역 검사와 JA 320px smoke를 다시 통과하고 Archer 화면을 확인했습니다: `exports/agent/2026-11-18T02-42-28-899Z-31945/report.json`.

개발 진척도 반영 후 `npm run check`와 KO/EN/JA × 1280·390·320px smoke 9조합 통과(실패·경고 0건). 상세 6장의 PC·320px 진척도 카드를 직접 확인했습니다. 보고서: `exports/agent/2026-11-18T02-46-29-358Z-34494/report.json`.

장르·타깃·재미 요약 반영 후 `npm run check`와 smoke 9조합 통과(실패·경고 0건). 생성된 화면은 75개이며 변경한 상세 6장의 언어별 PC·모바일·스크롤 하단 PNG를 직접 확인했습니다. 보고서: `exports/agent/2026-11-18T02-56-08-608Z-39502/report.json`.

Archer 이미지 반영 후 `npm run check`와 smoke 9조합 통과(실패·경고 0건). 1·7장의 PC·모바일 및 언어별 Archer 하단 PNG에서 이미지 전체 영역과 정보 카드를 확인했습니다. 보고서: `exports/agent/2026-11-18T03-00-12-408Z-42507/report.json`.

타깃을 연령·성별 제안으로 변경한 뒤 `npm run check`와 smoke 9조합 통과(실패·경고 0건). 상세 6장의 언어별 PC·390·320px PNG에서 두 줄 표시와 제안 라벨을 직접 확인했습니다. 보고서: `exports/agent/2026-11-18T04-14-11-286Z-49303/report.json`.

사용자 타깃 수정 후 `npm run check`와 smoke 9조합 통과(실패·경고 0건). 변경한 5장 PC 및 KO/EN/JA 모바일 PNG에서 8세 이하·15세 이상·성별 변경을 확인했습니다. 보고서: `exports/agent/2026-11-18T04-22-13-839Z-52717/report.json`.

덱 제목을 「2026년 11월 진행 중인 프로젝트」로 바꾸고 등록 제목·브라우저 제목·첫 장·접근성 제목·영어/일본어를 맞췄습니다. `npm run check`와 smoke 9조합 통과, PC·언어별 320px 제목 PNG 확인: `exports/agent/2026-11-18T04-26-34-156Z-55466/report.json`. 한국어 모바일 단어 줄바꿈을 보완한 뒤 KO 390·320px smoke 2조합 통과 및 최종 PNG 확인: `exports/agent/2026-11-18T04-28-37-297Z-56538/report.json`.

소개 번호 제거·게임 번호 01~06 반영 후 `npm run check`와 smoke 9조합 통과(실패·경고 0건). PC 전체 제목·하단 카운터 숨김과 모바일 소개·첫 게임·마지막 게임 PNG를 직접 확인했습니다. 보고서: `exports/agent/2026-11-18T04-34-19-310Z-59819/report.json`.

주요 타깃 항목명에서 제안 표시를 제거하고 KO/EN/JA를 동기화했습니다. `npm run check`와 KO 1280·320px smoke 2조합 및 언어 전환을 통과했고 대표 상세 PNG를 직접 확인했습니다. 보고서: `exports/agent/2026-11-18T04-42-05-746Z-64194/report.json`.

게임 설명 1~6장의 출시 목표 위 중복 게임명 레이블을 제거하고 이미지와 정보 카드 사이 여백을 정리했습니다. `npm run check`와 KO 1280·320px smoke 2조합 및 언어 전환을 통과했고 PC·모바일 PNG를 직접 확인했습니다. 보고서: `exports/agent/2026-11-18T04-44-32-684Z-65714/report.json`.

북미 게임 업계 발표용 영어 7장 전체 교정 후 `npm run check`와 `npm run agent:doctor`를 통과했습니다. EN 1280·390·320px smoke 3조합 통과(실패·경고 0건). PC·320px 전체 7장과 390px 대표 화면·스크롤 하단 PNG를 직접 확인했으며, 언어 전환·키보드·해시·전체화면·인쇄 동작도 통과했습니다. 보고서: `exports/agent/2026-11-18T04-48-58-592Z-68103/report.json`.

Enchant a Weapon 장르에 사용자 제공 AD&D 룰 기반 설명을 KO/EN/JA로 추가했습니다. 영어는 `RPG based on AD&D rules, with weapon crafting and upgrades`입니다. `npm run check`와 KO/EN/JA × 1280·320px smoke 6조합 통과(실패·경고 0건), 영어 PC와 3개 언어 모바일 PNG를 직접 확인했습니다. 보고서: `exports/agent/2026-11-18T04-52-38-999Z-70968/report.json`.

공개 배포 전 변경분만 분리한 작업 경로에서 `npm run check` 및 홈페이지·신규 덱 KO/EN/JA × 1280·390·320px smoke 18조합을 통과했습니다(실패·경고 0건). 대표 PC·모바일 PNG와 active 운영 빌드·7장·noindex·사이트맵 제외를 확인했습니다. 보고서: `exports/agent/2026-11-18T04-57-16-655Z-73669/report.json`.
