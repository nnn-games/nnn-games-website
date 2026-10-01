# 신규 회사 소개 제작 출처

제작일: 2026-10-01  
지표 기준: 2026.10.01 14:57 KST (`2026-10-01T05:57:11.388Z`)  
덱: `decks/company-intro/` · 본편 13장 + 부록 4장 · KO/EN/JA · draft

## 지표 스냅샷

`npm run update:metrics`를 실행해 운영 게임 6개와 집계 커뮤니티 7개를 갱신했습니다. 수집 명령·집계 규칙은 [수집 스크립트](../../../scripts/update-metrics.js)와 [지표 규칙](../../site/metric.md)을 따릅니다. 원본은 [프로젝트 데이터](../../../shared/data/projects.json)와 [커뮤니티 데이터](../../../shared/data/communities.json)입니다.

공식 공개 API: 게임 방문·즐겨찾기는 `games.roblox.com/v1/games`, 좋아요 비율은 해당 게임 votes 응답, 커뮤니티 가입 수는 `groups.roblox.com/v1/groups/<groupId>`의 `memberCount`입니다. 덱에는 수집한 값을 정적으로 인용하며 실행 중 최신 값으로 바꾸지 않습니다.

| 지표 | 고정 값 | 집계·표기 |
| --- | ---: | --- |
| 운영 게임 | 6 | `summary.hero.projectCount`, active 집계 대상 |
| 게임 누적 방문 | 14,008,163 | `summary.hero.totalVisits`, 재방문 포함. 본편 `14.0M+` |
| 커뮤니티 가입 합계 | 208,979 | `totals.heroSubscriberCount`, 7개 그룹 합계·중복 포함. 본편 `208K+` |
| NNN UGC 가입 수 | 84,356 | 그룹 ID `34453707`, IP 전략 참고 카드 |

본편의 축약 수치는 내림 표기합니다. A2에는 정확한 방문·즐겨찾기와 좋아요 비율(정수 %로 반올림)을 기록합니다. 현재 접속자·Peak CCU·리텐션·매출은 이 덱의 성과 지표에 포함하지 않습니다.

| 운영 게임 | 출시 월 | 누적 방문 | 즐겨찾기 | 좋아요 |
| --- | --- | ---: | ---: | ---: |
| Tower Flood Race | 2026-01 | 11,387,959 | 525,667 | 60% |
| Tomato Splatter Simulator | 2026-04 | 1,245,221 | 12,483 | 77% |
| [Free UGC] AFK or arcade game | 2026-05 | 826,310 | 8,665 | 97% |
| 🎁 FREE UGC RNG | 2026-05 | 347,212 | 5,638 | 83% |
| Korean Spa | 2025-12 | 144,271 | 739 | 86% |
| Fruit Battles | 2026-04 | 57,190 | 249 | 56% |

출시 월은 프로젝트 메타이며 수집 날짜와 구분합니다. 개발 프로젝트는 게임 4종(Enchant a Weapon, ASMR UGC Town, Hunt a slime, Tomato Splatter), NNN UGC는 별도 UGC 제작 프로젝트로 소개합니다. 등록된 출시 예정 월은 보장된 일정으로 표현하지 않습니다. Hunt a slime·Tomato Splatter 이미지는 개발 콘셉트로 표시합니다.

## 장별 내용 근거

| 슬라이드 | 근거·재사용 범위 |
| --- | --- |
| 01 회사소개 | 두 덱 cover·about의 게임 개발/UGC/라이브 운영 역량을 새 중심 문구로 정리. 현재 운영 프로젝트 이미지 사용 |
| 02 주요지표 | 공식 갱신 데이터와 현재 집계 정의. 두 덱 about의 오래된 숫자를 최신 고정 값으로 교체 |
| 03 운영게임 | 현행 active 6개 프로젝트의 메타·이미지·공개 지표 |
| 04 게임설계 | 두 덱 case + 현재 TFR·Tomato Splatter Simulator 상세 설명. 실제 플레이 루프로 정리 |
| 05 UGC 보상 | 두 덱 ugc + 현재 AFK/RNG 상세 설명. 기존 Merge 문구 대신 현행 수집·코인·UGC 교환 흐름 |
| 06 UGC 제작 | 공통 ugcworks 제작물 1~8과 현재 `site/js/project-details/nnn-ugc.js`의 제작 범위 |
| 07 라이브 운영 | nnn liveops의 Top 100 Challenge·Golden Ducky. 과거 이벤트 사례로 표기, 당시 숫자·현재 상시 운영 주장 제외 |
| 08 보유기술 | company tech의 UGC 지급·이벤트·크로스 프로모션 시스템 화면과 기능. 무인 운영·절감률 주장 제외 |
| 09 개발현황 | `shared/data/projects.json`, 각 프로젝트 상세와 `docs/projects/`의 현재 기획. 옛 계획 목록을 현행 4종으로 교체 |
| 10 팀소개 | nnn people의 ONESHOT/JEFF/PAPASLIME 아바타·이름·JEFF 강조·Claude/ChatGPT 배경 구성. 기존 경력·포트폴리오 카드는 사용자 요청으로 폐기, 리드 문구는 전체 서브타이틀 제거 기준에 따라 발표 메모로 이동 |
| 11 협업사례 | 공통 global의 JR EAST × NAVER Z Get Train, 야마노테선·JRE WALLET 연동 설명. ZEPETO와 기존 기재 기간 2024.09–2025.12 명시 |
| 12 IP 전략 | company kungya-entry/community/expansion의 접근법을 일반 브랜드/IP 제안 흐름으로 재작성. NNN UGC 현재 가입 수를 별도 참고 지표로 제시 |
| 13 협업문의 | 공통 closing의 제공 역량. 대표 이메일은 기존 덱, 일반 문의·주소는 현행 홈페이지 기준 |
| A1 회사연혁 | 공통 history의 MOBILE·IFLAND·ZEPETO 경험. Roblox 시작 연도 차이는 단정하지 않고 현재 운영으로 표시 |
| A2 상세지표 | 이번 공식 갱신의 동일 기준일·대상·정의·정확한 숫자 |
| A3 추가사례 | Korean Spa·Fruit Battles 현재 상세와 공통 ugcworks 제작물 9~12 |
| A4 IP 제안 | company expansion 이미지를 브랜드 노출·콘텐츠·이벤트의 일반 접근법 예시로 재사용. 특정 IP 협업 확정안 아님 |

[두 덱 비교 검토](comparison.md)는 검토 시점(2026-09-30)의 값과 불일치를 기록한 문서로 보존합니다. 과거 2.2K/164 Peak CCU, Get Train 2.5M 방문/600K Peak WAU, 1개월 커뮤니티 53,337명은 별도 측정 근거가 없어 신규 덱 성과 숫자로 인용하지 않습니다.

## 이미지 출처

두 보관 덱의 필요한 자산을 재사용했습니다. 팀 아바타 3장은 nnn의 WebP를 그대로 복사하고, Claude·ChatGPT 장식은 원본 PNG를 무손실 WebP로 변환했습니다. 나머지는 company의 원본 경로를 기준으로 압축했습니다. 원본 내용·크롭을 새로 생성하지 않습니다. 전용 이미지 36개 총 1,637,282바이트(약 1.64MB)입니다. 원본은 수정하지 않습니다.

| 기존 원본 | 신규 WebP |
| --- | --- |
| `decks/company/assets/case-tfr.jpg` | `decks/company-intro/assets/case-tfr.webp` |
| `decks/company/assets/case-tomato.jpg` | `decks/company-intro/assets/case-tomato.webp` |
| `decks/company/assets/ugc-afk.jpg` | `decks/company-intro/assets/ugc-afk.webp` |
| `decks/company/assets/ugc-rng.jpg` | `decks/company-intro/assets/ugc-rng.webp` |
| `decks/company/assets/event-top100.jpg` | `decks/company-intro/assets/event-top100.webp` |
| `decks/company/assets/event-golden-ducky.jpg` | `decks/company-intro/assets/event-golden-ducky.webp` |
| `decks/company/assets/ugc-admin.jpg` | `decks/company-intro/assets/ugc-admin.webp` |
| `decks/company/assets/ugc-operation.jpg` | `decks/company-intro/assets/ugc-operation.webp` |
| `decks/company/assets/cross-promotion.jpg` | `decks/company-intro/assets/cross-promotion.webp` |
| `decks/nnn/assets/people-oneshot.webp` | `decks/company-intro/assets/people-oneshot.webp` |
| `decks/nnn/assets/people-jeff.webp` | `decks/company-intro/assets/people-jeff.webp` |
| `decks/nnn/assets/people-papaslime.webp` | `decks/company-intro/assets/people-papaslime.webp` |
| `decks/nnn/assets/claude-icon.png` | `decks/company-intro/assets/claude-icon.webp` |
| `decks/nnn/assets/chatgpt-icon.png` | `decks/company-intro/assets/chatgpt-icon.webp` |
| `decks/company/assets/global-gettrain-1.jpg` | `decks/company-intro/assets/global-gettrain-1.webp` |
| `decks/company/assets/global-gettrain-2.jpg` | `decks/company-intro/assets/global-gettrain-2.webp` |
| `decks/company/assets/global-gettrain-3.jpg` | `decks/company-intro/assets/global-gettrain-3.webp` |
| `decks/company/assets/ex-ads.jpg` | `decks/company-intro/assets/ex-ads.webp` |
| `decks/company/assets/ex-contents.jpg` | `decks/company-intro/assets/ex-contents.webp` |
| `decks/company/assets/ex-events.jpg` | `decks/company-intro/assets/ex-events.webp` |
| `decks/company/assets/mobile-sc1.webp` | `decks/company-intro/assets/mobile-sc1.webp` |
| `decks/company/assets/ifland-sc1.webp` | `decks/company-intro/assets/ifland-sc1.webp` |
| `decks/company/assets/zepeto-sc1.webp` | `decks/company-intro/assets/zepeto-sc1.webp` |
| `decks/company/assets/community-nnn-ugc-icon.png` | `decks/company-intro/assets/community-nnn-ugc-icon.webp` |
| `decks/company/assets/ugc-1.png` | `decks/company-intro/assets/ugc-1.webp` |
| `decks/company/assets/ugc-2.png` | `decks/company-intro/assets/ugc-2.webp` |
| `decks/company/assets/ugc-3.png` | `decks/company-intro/assets/ugc-3.webp` |
| `decks/company/assets/ugc-4.png` | `decks/company-intro/assets/ugc-4.webp` |
| `decks/company/assets/ugc-5.png` | `decks/company-intro/assets/ugc-5.webp` |
| `decks/company/assets/ugc-6.png` | `decks/company-intro/assets/ugc-6.webp` |
| `decks/company/assets/ugc-7.png` | `decks/company-intro/assets/ugc-7.webp` |
| `decks/company/assets/ugc-8.png` | `decks/company-intro/assets/ugc-8.webp` |
| `decks/company/assets/ugc-9.png` | `decks/company-intro/assets/ugc-9.webp` |
| `decks/company/assets/ugc-10.png` | `decks/company-intro/assets/ugc-10.webp` |
| `decks/company/assets/ugc-11.png` | `decks/company-intro/assets/ugc-11.webp` |
| `decks/company/assets/ugc-12.png` | `decks/company-intro/assets/ugc-12.webp` |

현재 운영·개발 프로젝트 이미지 경로는 `shared/data/projects.json`의 `image`를 따릅니다. 웹 덱에서 `../assets/...`·`../images/...` 배포 경로로 참조하며 복제하지 않습니다. 대체 텍스트는 KO/EN/JA로 작성했습니다. 정적 이미지에는 HTML 원본 크기를 기록하고, 팀 아바타는 원본과 같은 비율의 contain 프레임으로 전체 내용을 보존합니다. 슬라이드별 배치는 [이미지 레이아웃 기준](design.md)을 따릅니다.

## 수정·검증 위치

슬라이드 ID와 마크업 순서는 `index.html`·`DECK_SLIDES`에서 일치하며 마지막 4장은 `appendix: true`입니다. 텍스트는 `DECK_I18N`의 200개 키를 KO/EN/JA로 작성했습니다. 팀소개의 `people_avatar_alt`는 nnn 원문을 그대로 사용합니다. 아바타·배경 장식은 기존 `company-renderers.js`의 avatars 렌더러를 사용하며 역할 라벨과 people_badge는 nnn 원본 화면과 동일하게 표시하지 않습니다. 전체 17장의 서브타이틀 18개 문구 키와 회사연혁의 중복 도입 문구는 실행 마크업에서 제거하고 [발표 메모](speaker-notes.md)에 보관했습니다. 언어 전환·키보드 이동·해시 딥링크·전체화면·부록은 공통 런타임을 사용합니다.
