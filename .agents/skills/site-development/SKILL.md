---
name: site-development
description: NNN GAMES 홈페이지의 UI, Tailwind 스타일, 공통 헤더·푸터, 다국어 동작과 상세 렌더러를 개발하거나 수정한다. 홈페이지 화면 수정, 모바일 메뉴, 필터, 번역 요청에 사용한다. 웹 발표자료는 덱 스킬을 사용한다.
---

# 홈페이지 개발

루트 `AGENTS.md`와 `README.md`를 읽고 요청한 화면의 현재 구현을 확인한다. 기존 전역 객체 기반 JavaScript와 CommonJS 빌드를 따른다.

## 작업 위치

자산 프로젝트 13개의 원본은 `shared/assets/www-<프로젝트>/content.json`이다. 전체 매핑은 `docs/projects/asset-content.md`를 따른다. 상세 JS는 JSON 로더이고 운영 설정·지표는 레지스트리에서 유지한다. catalogOnly 자산은 홈페이지에 추가하지 않는다.

Tower Flood Race의 콘텐츠 원본은 `shared/assets/www-tower-flood-race/content.json`이다. 영상 렌더러는 `detail.communityVideos`의 목록 경로·다국어 UI를 읽는다. 수집 지표와 운영 설정은 기존 레지스트리에 유지한다.

Tomato Splatter의 콘텐츠 원본은 `shared/assets/www-tomato-splatter/content.json`이다. 기존 JSON 빌드·로더를 재사용한다. Tomato Splatter Simulator는 별도로 유지한다.

Enchant a Weapon의 콘텐츠 원본은 `shared/assets/www-enchant-a-weapon/content.json`이다. 프로젝트 ID·페이지는 enchanted-weapon을 유지하며 앞선 프로젝트의 JSON 빌드·로더를 재사용한다.

ASMR UGC Town의 정보·링크·다국어 상세·SEO·회사 소개는 `shared/assets/www-asmr-ugc-town/content.json`이 원본이다. Hunt a Slime의 빌드 병합과 JSON 로더를 재사용한다. 운영 설정·지표는 기존 레지스트리에 유지한다.

- 공통 UI: `site/_partials/`. 개별 HTML의 `@include` 마커를 유지한다.
- 스타일: `site/styles/tailwind.css`. 동적으로 만드는 클래스는 `tailwind.config.js`의 safelist를 확인한다.
- 다국어: 공통 문구는 `site/js/i18n.js`, 상세 콘텐츠는 `site/js/project-details/<slug>.js`. KO/EN/JA와 HTML SEO 메타를 함께 맞춘다.
- 렌더러: `site/js/project-detail.js`, `project-renderer.js`, 데이터 로더 `projects-data.js`, 공통 유틸 `utils.js`.
- 메타·링크·정렬: `shared/data/projects.json`. 수집 지표는 `npm run update:metrics`로만 변경한다.
- Hunt a Slime의 정보·링크·다국어 상세·SEO·발표 소개는 `shared/assets/www-hunt-a-slime/content.json`이 원본이다. 상세 JS는 로더이며 빌드가 운영 데이터와 병합한다. 운영 상태·정렬·노출·수집 설정·지표는 기존 파일에서 관리한다.
- 기획·동작 기준: `docs/site/prd.md`, 지표 작업이면 `docs/site/metric.md`. 프로젝트 추가·수정·상태 변경은 해당 공용 스킬을 읽는다.

자산 URL은 빌드 후 주소(`assets/...`, `data/...`) 기준이다. 공유 자산 참조를 바꾸면 덱에서 쓰는 참조도 확인한다. 관련 파일 수정은 요청 범위 안에서 함께 수행한다.

## 검증과 완료

1. 변경을 구현하고 `npm run check`를 실행한다.
2. 바꾼 페이지를 실제 브라우저에서 검사한다. 예: `npm run agent:smoke -- --pages /,/projects-roblox.html,/asmr-ugc-town.html`.
3. 하네스는 KO/EN/JA, 1280·390·320px, 언어 전환, 모바일 메뉴, 목록 필터, JS·로컬 요청 오류, 이미지와 가로 넘침을 검사한다. 보고서의 실패를 확인하고 요청한 변경으로 생긴 문제를 고친다.
4. `exports/agent/<실행>/`에서 변경한 화면 PNG를 직접 열어 배치·가독성·이미지·CTA를 확인한다. 자동 검사만으로 디자인 완성을 판정하지 않는다.
5. 기능 변경은 PRD, 작업 기록은 로드맵에 반영한다. 변경한 동작, 검증 결과, 필요한 번역 검토와 스크린샷 위치를 보고한다.

화면마다 하네스가 다루지 않는 상호작용은 해당 페이지에서 직접 검증한다. 외부 API·폰트 오류는 보고서의 warnings와 실행 환경을 함께 설명한다. `--offline`은 외부 요청을 차단하고 대체 폰트로 검사한다.
