# 회사 홈페이지

- 화면: 루트 HTML 파일
- 공통 마크업: `_partials/`
- 동작·번역: `js/`
- 프로젝트 상세 내용: `js/project-details/<slug>.js`
- 스타일: `styles/tailwind.css`
- 도메인·검색 설정: `CNAME`, `robots.txt`

프로젝트 데이터와 웹 자산은 `../shared/`, 기획 문서는 [홈페이지 문서](../docs/site/README.md)와 [프로젝트 문서](../docs/projects/README.md)에 있습니다.

저장소 루트에서 `npm run dev`를 실행합니다. 이 폴더는 빌드 시 사이트 루트(`/`)로 배치되므로 자산 경로는 `assets/...`, `images/...`, `js/...`처럼 배포 주소 기준으로 씁니다.
