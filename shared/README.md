# 공통 데이터·자산

홈페이지와 발표자료가 함께 참조하는 파일입니다.

- `data/projects.json`: 프로젝트 메타·집계 설정·지표
- `data/community-groups.json`: 커뮤니티 노출·집계 설정
- `data/communities.json`: 수집된 커뮤니티 지표
- `images/`: 공통 로고와 기존 이미지
- `assets/<project>/`: 프로젝트별 웹 이미지·자료

배포 시 각각 `/data/`, `/images/`, `/assets/`로 배치됩니다. 기존 이미지 주소를 유지하기 위해 `images/`와 `assets/`를 유지합니다. 발표 전용 이미지는 `decks/<slug>/`에 둡니다.

지표는 `npm run update:metrics`로 갱신합니다. 이미지 이름을 바꾸거나 삭제하면 홈페이지·발표자료 참조를 함께 확인하고 `npm run check`를 실행합니다. 기획 원본·이미지 프롬프트는 `docs/projects/` 또는 `docs/decks/`에 둡니다.
