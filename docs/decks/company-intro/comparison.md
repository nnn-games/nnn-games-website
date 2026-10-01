# 보관된 회사 소개 덱 비교 검토

검토일: 2026-10-01  
대상: `decks/nnn/`(2026-07 버전), `decks/company/`(2026-08 버전)  
후속 문서: [신규 슬라이드 구성안](slide-outline.md)

실제 `index.html`, `slides.js`, 공통 회사 소개 렌더러를 기준으로 비교했습니다. 과거 기획서의 초기 장수와 현재 보관된 덱의 장수가 달라, 아래 순번은 보관된 실행 소스를 따릅니다. 웹 화면의 본문·고정 숫자와 KO/EN/JA 사전을 함께 확인했습니다.

## 1. 전체 성격

| 항목 | nnn | company |
| --- | --- | --- |
| 장수 | 본편 12장 + 부록 1장 = 13장 | 본편 14장, 부록 없음 |
| 중심 메시지 | Roblox 게임 개발·UGC·출시 이후 운영 | 게임 개발·브랜드/IP 체험·커뮤니티 구축 |
| 공통 기반 | 회사 개요, 팀, 연혁, 운영 게임, UGC 제작, 게임 사례, 협업 경험, 연락처 | 같은 기반을 재사용 |
| 후반부 | 라이브 운영 → 개발 중 → 기획 중 → 클로징 | IP 진입 전략 → 커뮤니티 구축 → 사업 확장 → 보유 기술 → 클로징 |
| 파트너 신뢰 근거 | 게임·운영 경험 중심, Get Train은 부록 | 구성원 경력·포트폴리오 추가, Get Train을 본편 앞으로 이동 |

`company`는 회사 소개를 브랜드·IP 협업 제안에 맞게 바꾼 버전으로 판단됩니다. 그 과정에서 `nnn`의 라이브 운영 및 개발·기획 파이프라인 설명이 빠졌습니다. 새 소개에는 현재 프로젝트를 보여주는 흐름과 파트너가 판단할 제작·운영 역량을 함께 담는 것이 적합합니다.

출처: [nnn 슬라이드 데이터][n-js], [company 슬라이드 데이터][c-js], [nnn 화면][n-html], [company 화면][c-html].

## 2. 공통 부분과 변경점

같은 슬라이드 ID를 사용하는 항목은 10개입니다. 위치·수치·팀 소개·메시지가 달라진 항목도 있으므로, 아래의 공통은 주제와 기본 내용의 공유를 뜻합니다.

| 공통 주제 / ID | nnn 순번 | company 순번 | 공통 내용 | 차이와 신규 제작 판단 |
| --- | --- | --- | --- | --- |
| 표지 / `cover` | 1 | 1 | 회사명, 대표·연락처, 운영 게임 4종 이미지 | 부제가 Game & UGC에서 Game, IP Experience & UGC로 변경. 신규에는 게임·UGC·운영을 포괄하는 소개 문구 사용 |
| 회사 개요 / `about` | 2 | 2 | Roblox 전문 스튜디오, 게임 개발·라이브 운영·UGC 보상 3대 역량, 개발→출시→운영→개선 흐름 | 프로젝트 수는 6으로 동일하지만 방문·커뮤니티 수가 다름. 현행 데이터와 집계 범위로 전면 갱신 |
| 팀 / `people` | 3 | 3 | ONESHOT·JEFF·PAPASLIME 아바타, JEFF 강조, 배경 AI 도구 이미지 | nnn은 실행 속도 문구, company는 오현석·박종철의 경력과 포트폴리오 이미지 추가. 최신 구성원·역할을 확인해 경력 소개 재사용 |
| 연혁 / `history` | 4 | 4 | MOBILE(~2021)→IFLAND(2022)→ZEPETO(2023~2025)→ROBLOX(2026~현재), 같은 대표 이미지 | Roblox 방문 수 문구 변경. 두 덱 모두 수상 데이터가 비어 있어 수상 경력을 새로 만들어 넣을 근거는 없음. 자세한 연혁은 선택 부록으로 이동 |
| 운영 게임 / `titles` | 5 | 6 | TFR, AFK or arcade game, Tomato Splatter Simulator, FREE UGC RNG 4종, 같은 장르·이미지 | 방문 수 갱신. 현재 운영 6종을 모두 보여주도록 Fruit Battles·Korean Spa 추가 |
| UGC 제작 / `ugcworks` | 6 | 7 | UGC 썸네일 12종, 품질·부위/소재/애니메이션·게임 연동 판매 설명, Since 2024.06 | 본문과 제작물 배열 동일. 대표 최신 제작물과 현재 제작 범위를 확인해 사용 |
| 일반 게임 사례 / `case` | 7 | 8 | TFR의 경쟁·성장·운영, Tomato Splatter Simulator의 타격감·성장 루프 | 본문·이미지 동일. 게임 목록과 중복하지 않도록 설계 사례에 집중 |
| UGC 게임 사례 / `ugc` | 8 | 9 | AFK의 플레이→코인→UGC, RNG의 수집·성장→한정 보상 | 본문·이미지 동일. UGC 제작 능력과 UGC를 게임에 연결하는 설계 능력을 각각 설명 |
| 대기업 협업 / `global` | 13, 부록 | 5, 본편 | JR EAST × NAVER Z Get Train, JRE WALLET 연동, 같은 이미지·성과 | 제목이 GLOBAL PROJECT EXPERIENCE에서 ENTERPRISE COLLABORATION EXPERIENCE로 변경. 일반 파트너 소개에는 본편에 유지하되 ZEPETO 사례임을 명시 |
| 클로징 / `closing` | 12 | 14 | NNN 의미, 웹사이트·이메일·주소, 개발·운영·UGC 역량 | 다음 Roblox 게임을 함께 만들자는 문구가 IP 체험 확장으로 변경. 신규에는 협업 범위와 구체적인 다음 행동을 함께 제시 |

출처: [nnn 화면][n-html], [company 화면][c-html], [두 덱이 사용하는 렌더러][renderers].

## 3. 한쪽에만 있는 부분

| 항목 / ID | nnn | company | 신규 소개 반영 |
| --- | --- | --- | --- |
| 라이브 운영 / `liveops` | 9장. Top 100 Challenge·Golden Ducky 이벤트 이미지, 퀘스트·랭킹·한정 UGC·반복 개선 | 독립 슬라이드 없음. tech에서 일부 운영 역량 설명 | 복원. 실제 이벤트 사례와 운영 루프를 한 장으로 정리 |
| 개발 중 게임 / `development` | 10장. FREE UGC TOWN·FREE UGC TOWER·DUCKY RNG·ENCHANTED WEAPON | 없음 | 현행 신규 게임 4종으로 교체 |
| 기획 중 게임 / `planning` | 11장. HACKER VS SECURITY·STAR REACH·TOMATO SPLATTER 2 | 없음 | 과거 목록은 그대로 사용하지 않음. 현재 개발 파이프라인 한 장으로 통합 |
| IP 진입 / `kungya-entry` | 없음 | 10장. 캐릭터·세계관 소개→관심 수요 확인→커뮤니티 성장 | 일반 회사 소개의 브랜드·IP 접근법으로 압축 |
| 커뮤니티 구축 / `kungya-community` | 없음 | 11장. 친숙한 게임→가입 유도→UGC 지급→사업 확장, 1개월 약 5만 명 사례 | 일반 접근법에 통합. 과거 성장 수치는 기간 증빙 확보 후 사용 |
| 사업 확장 / `kungya-expansion` | 없음 | 12장. 브랜드 홍보·수익형 콘텐츠·온오프라인 이벤트 | 일반 접근법과 협업 범위로 통합. 특정 IP용 상세 제안은 선택 부록 |
| 보유 기술 / `tech` | 없음 | 13장. UGC 지급·관리, 이벤트 자동화, 크로스 프로모션 | 유지. 운영 결과를 보여주는 liveops와 이를 지원하는 시스템을 구분 |

`kungya-*`는 소스의 식별자입니다. 실제 본문은 브랜드·IP에 적용할 전략과 제안으로 쓰여 있으며, 특정 IP 프로젝트의 실행 성과가 확인된 사례로 표시되어 있지는 않습니다. 신규 소개에서 이 내용을 구현 실적이나 성과 보장으로 바꾸지 않습니다.

## 4. 지표 비교와 확인할 불일치

아래 과거 값은 보관된 화면에 적힌 표기 그대로입니다. 새 측정 결과로 해석하지 않습니다.

| 항목 | nnn 화면 | company 화면 |
| --- | --- | --- |
| 운영 프로젝트 | 6 | 6 |
| 누적 방문, 회사 개요 | 11.2M+ | 12.1M+ |
| 누적 방문, 연혁 | 1,120만 회 / 11.2M+ | 1,180만 회 / 11.8M+ |
| 커뮤니티 멤버, 회사 개요 | 130K+ | 165K+ |
| Tower Flood Race 방문 | 9.4M | 10.1M |
| Tomato Splatter Simulator 방문 | 1.05M | 1.08M |
| AFK or arcade game 방문 / 좋아요 | 375K / 97% | 585K / 97% |
| FREE UGC RNG 방문 | 113K | 173K |
| TFR / Tomato 최고 동접 | 2.2K / 164 | 2.2K / 164 |
| Get Train 방문 / 최고 WAU | 2.5M / 600K | 2.5M / 600K |
| RNG 출시 후 1개월 커뮤니티 | 없음 | 53,337, 본문은 약 5만 명 |

- `company`의 회사 개요 12.1M+와 연혁 11.8M+가 일치하지 않습니다. 같은 집계 범위·기준일로 통일해야 합니다.
- 주석상 지표 기준일은 nnn이 2026-07-29 23:55 UTC, company가 2026-08-10 21:09 UTC입니다. company의 모든 표시값이 그 기준일에 맞춰 함께 변경되었는지는 소스만으로 확정할 수 없습니다.
- 두 덱은 AFK 출시일을 2026.07.04, RNG를 2026.07.07로 표시하지만 현행 프로젝트 메타는 두 게임 모두 2026-05입니다. 정확한 출시일을 확인하기 전 신규 소개에는 현행 메타의 월 단위를 쓰고, 날짜 차이를 제작 단계에서 확인합니다.
- 회사 개요의 Roblox 기간은 2026.01~현재지만 현행 Korean Spa 출시 월은 2025-12입니다. 사업 집중 시점과 개별 게임 출시 시점을 구분해 연혁 문구를 확인합니다.
- 공개 수집 필드 `playing`은 현재 동접입니다. 기존 Peak CCU를 갱신하거나 대신할 수 없습니다. Get Train의 과거 성과와 1개월 커뮤니티 성장도 해당 기간의 원본 기록을 별도로 확인합니다.
- 두 덱의 대표 연락처는 `nnnceo@triplengames.com`으로 같지만 [현재 홈페이지 문의 페이지](../../../site/contact.html)는 `developer@triplengames.com`을 표시합니다. 신규 소개의 대표 연락처와 일반 협업 문의를 어떤 주소로 안내할지 제작 단계에서 정리합니다.

출처: [nnn 지표 주석][n-js], [company 지표 주석][c-js], [과거 화면 고정 수치][c-html], [현행 프로젝트 메타][projects].

## 5. 현재 데이터로 교체할 내용

구성안 작성 시점에 저장소에 있는 스냅샷은 **2026-09-30 18:14:59 KST**(`2026-09-30T09:14:59.345Z`)입니다. 이번 검토에서는 API를 다시 수집하지 않았습니다.

| 항목 | 저장소 값 | 발표용 표기 제안 | 출처 필드 |
| --- | --- | --- | --- |
| 운영 게임 | 6개 | 운영 게임 6개 | projects.summary.hero.projectCount |
| 집계 대상 게임 누적 방문 | 14,000,991회 | 1,400만+ / 14.0M+ | projects.summary.hero.totalVisits |
| 커뮤니티 가입 수 합계 | 208,736 | 20.8만+ / 208K+ | communities.totals.heroSubscriberCount |
| NNN UGC 그룹 가입 수 | 84,125 | 8.4만+ / 84K+ | communities.groups[id=34453707].memberCount |

누적 방문은 재방문을 포함한 방문 횟수이며 고유 이용자 수가 아닙니다. 커뮤니티 수는 집계 대상 7개 그룹의 가입 수 합계이며 그룹 간 중복을 제거한 인원이 아닙니다. 여러 그룹 합계에 NNN UGC를 다시 더하지 않습니다. 현재 NNN UGC 가입 수로 과거 1개월 성장 사례를 대체하지 않습니다.

운영 게임 6종은 Tower Flood Race, Tomato Splatter Simulator, [Free UGC] AFK or arcade game, FREE UGC RNG, Korean Spa, Fruit Battles입니다. 신규 포트폴리오에는 6종을 모두 넣고, 자세한 게임 설계 사례는 기존 대표 4종을 중심으로 유지합니다.

| 현행 개발 프로젝트 | 출시 예정 / 표기 | 신규 반영 |
| --- | --- | --- |
| Enchant a Weapon | 2026-10 예정 | 최신 이름·RPG/무기 제작·강화 설명. 기존 ENCHANTED WEAPON에서 이름 변경된 프로젝트 |
| ASMR UGC Town | 2026-10 예정 | 사용자 제공 최신 설명인 ASMR 장애물·탐험·재료 수집·무료 UGC 교환 |
| Hunt a slime | 2026-11 예정 | 개발 중 사냥 모험 콘셉트. 세부 기능과 실적은 미확정 |
| Tomato Splatter | 2027-02 예정 | 개발 중 캐주얼 액션 콘셉트. 운영 중인 Tomato Splatter Simulator와 별도 프로젝트 |
| NNN UGC | 메타 2025-Q1, 상세 페이지는 제작 중 | UGC 제작 페이지에 별도 소개. 신규 게임 4종의 출시 일정에는 포함하지 않음 |

Hunt a slime·Tomato Splatter는 이름 기반 임시 콘셉트 이미지·소개를 사용합니다. 과거 TOMATO SPLATTER 2의 액션 RPG 설정을 현재 Tomato Splatter의 확정 기능으로 옮기지 않습니다. ASMR UGC Town의 최신 설명은 2026-09-30 사용자 제공 내용을 따릅니다.

Hacker vs Security·Star Reach는 2026-09-29 보관되어 현행 목록에서 제외되었습니다. Ducky Merge Farm [RNG]도 같은 날 제외되었습니다. 과거 덱의 FREE UGC TOWN·FREE UGC TOWER·DUCKY RNG는 현재 같은 이름으로 등록되어 있지 않으며, 현행 프로젝트와의 동일성이 확인되지 않아 임의로 이름을 대응시키지 않습니다.

출처: [프로젝트 데이터][projects], [커뮤니티 데이터][communities], [프로젝트 보관 기록][project-archive], [ASMR 최신 기획][asmr], [Hunt a slime 기획][hunt], [Tomato Splatter 기획][tomato], [개발 기록][roadmap].

## 6. 신규 구성의 편집 기준

- 유지: 회사의 3대 역량, 대표 운영 게임 사례, UGC 제작·게임 연동, 파트너 협업 경험.
- 복원: nnn의 실제 라이브 운영 사례, 현재 개발 프로젝트를 보여주는 파이프라인.
- 보강: company의 구성원 경력·포트폴리오와 운영 시스템 설명. 현직·팀 구성·현재 사용 시스템은 제작 단계에서 재확인.
- 압축: company의 브랜드·IP 전략 3장을 일반 회사 소개용 1장으로 통합. 파트너별 상세 제안은 부록에서 확장.
- 교체: 과거 숫자, 과거 개발·기획 게임 목록, NEW 배지와 과거 출시일.
- 이동: 플랫폼별 상세 연혁은 부록. 본편에서는 현재 Roblox 프로젝트와 제작·운영 근거를 먼저 전달.

이 기준을 반영한 권장 분량은 **본편 13장 + 선택 부록 4장**입니다. 슬라이드별 주장·근거·시각 자료·출처·보완할 자료는 [신규 구성안](slide-outline.md)에 기록했습니다.

[n-js]: ../../../decks/nnn/slides.js
[c-js]: ../../../decks/company/slides.js
[n-html]: ../../../decks/nnn/index.html
[c-html]: ../../../decks/company/index.html
[renderers]: ../../../decks/shared/company-renderers.js
[projects]: ../../../shared/data/projects.json
[communities]: ../../../shared/data/communities.json
[project-archive]: ../../../_archive/projects/2026-09-29/README.md
[asmr]: ../../projects/asmr-ugc-town/README.md
[hunt]: ../../projects/hunt-a-slime/README.md
[tomato]: ../../projects/tomato-splatter/README.md
[roadmap]: ../../development-roadmap.md
