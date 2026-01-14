# 개발 로드맵 (NNN GAMES 랜딩 페이지)
오늘부터 진행할 개발 계획과 진행 상황을 기록하는 문서다. 완료된 기능/콘텐츠는 검증 후 `docs/prd.md`에 반영한다.

## 1. 운영 원칙
- PR 기반 변경, 1인 리뷰. PR 요약에 변경·테스트·리스크·스크린샷 포함.
- i18n·접근성·CTA 링크·외부 링크(UTM/추적) 확인을 기본 체크리스트로 유지.
- 완료 → 검증 → `docs/prd.md` 업데이트 순서 준수.

## 2. 진행 현황 요약
- 현재 상태: 정적 웹사이트(다국어 KO/EN/JA) + 프로젝트 카드 동적 렌더 + 모바일 내비/지연 로딩 구현.
- 주요 우선순위: 프로젝트 필터/정렬 연결, CTA 정확도, SEO/분석 기초, 문의 흐름 개선.

## 3. 일정 개요 
- 모든 개발 일정은 수요가 발생한 즉시 진행

## 4. 작업 보드 (수시 업데이트)
| ID | 항목 | 상태 | 산출물/링크 |
| --- | --- | --- | --- |
| R-01 | 데이터/카테고리 로블록스 전용화(비로블록스: zepeto/horizon/other 제거) | Completed | `js/projects-data.js`, `js/project-renderer.js`, `css/style.css` |
| R-02 | i18n/텍스트 로블록스화(Hero/미션/footer 등 멀티플랫폼 언급 제거) | Completed | `index.html`, `about.html`, 공통 footer, `js/i18n.js` |
| R-03 | 프로젝트 상세 허브화(플레이·영상·기사 링크와 실제 카피/지표로 교체) | In Progress | `get-train.html` 등 상세 페이지 |
| R-04 | 프로젝트 필터/검색 UI 연결(카테고리/상태, 필요 시 검색) | Completed | `projects.html`, `js/project-renderer.js` |
| R-05 | 공통 CTA/링크 블록 정립 + 추적용 data-attr/클래스 적용, 경량 분석 스크립트 결정 | Todo | 주요 페이지 HTML |
| R-06 | SEO/OG/파비콘 정비(로블록스 키워드 중심 title/description/og) | Todo | 주요 페이지 HTML, `images/` |
| R-07 | 문서 동기화(로블록스 전용 내용으로 `docs/prd.md`/가이드 갱신) | Todo | `docs/prd.md`, `docs/guideline.md` |
| R-08 | 경량 구조 정리(데이터 분리, 이미지 디렉터리 정돈, 필요 시 빌드 경로 추가) | Todo | `data/` 또는 `js/projects-data.js`, `images/`, 빌드 스크립트 |

## 5. 근무 주기 제안
- 매주: 배포 전 수동 검증(다국어, 모바일 내비, CTA, 외부 링크), Lighthouse(모바일/데스크톱) 스냅샷.
- 완료 시: `docs/prd.md`에 반영 후 이 로드맵의 해당 항목을 Done으로 이동.