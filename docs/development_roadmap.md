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
| N-01 | 프로젝트 상세 허브 실링크/지표 반영(플레이·영상·기사·메트릭 확정) | Todo | `get-train.html`, `legendary-dj-gear.html`, `korean-spa.html`, `nnn-ugc.html`, `slime-sanctum.html`, `js/i18n.js`, `data/projects.json` |
| N-02 | 프로젝트 데이터/i18n 정규화(상세 CTA/링크/카피를 JSON+i18n 키로 분리) | Todo | `data/projects.json`, `js/projects-data.js`, `js/project-renderer.js`, `js/i18n.js` |
| N-03 | 레거시 인라인 스타일 제거 및 Tailwind 공용 스타일 적용 | Todo | `slime-sanctum.html` 등 인라인 스타일 잔존 페이지, `src/styles/tailwind.css` |
| N-04 | CTA 추적 엔드포인트/스키마 확정 및 적용(sendBeacon 대상 교체) | Todo | `js/main.js`, 서버 수집 URL/스키마 정의 |

## 5. 근무 주기 제안
- 매주: 배포 전 수동 검증(다국어, 모바일 내비, CTA, 외부 링크), Lighthouse(모바일/데스크톱) 스냅샷.
- 완료 시: `docs/prd.md`에 반영 후 이 로드맵의 해당 항목을 Done으로 이동.