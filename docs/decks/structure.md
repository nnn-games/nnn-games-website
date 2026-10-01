# Company / Jumpstart 신규 슬라이드 작성 계획

## 목표

- `https://www.triplengames.com/company/`, `https://www.triplengames.com/jumpstart/`에서 임시 덱을 접근 가능하게 한다.
- `/nnn`과 같은 발표 조작 경험을 콘텐츠와 분리해 사전 구축한다.
- 실제 문구·이미지·지표가 확정될 때 각 페이지의 `slides.js`와 개별 에셋만 교체·추가한다.

## 공통 기반 범위

- 이전/다음 버튼, 슬라이드 도트, 진행 바, 현재 장수 표시
- 주소 해시 딥링크 (`#/2`) 및 뒤로/앞으로 탐색
- 키보드(화살표, Page Up/Down, Home/End, F), 모바일 스와이프
- KO/EN/JA, `?lang=` 우선 적용, 기존 사이트와 공유하는 `localStorage.language`
- 전체화면과 발표 중 무입력 시 컨트롤 숨김, reduced-motion, 인쇄용 16:9 페이지
- 비활성 슬라이드의 `inert` 처리 및 라이브 알림 등 접근성 상태

## 폴더 책임

- `slides/shared/`: 모든 신규 덱이 공유하는 기능·셸 스타일
- `company/`, `jumpstart/`: 각 URL의 HTML 마크업과 언어별 콘텐츠/슬라이드 순서
- `company/assets/`, `jumpstart/assets/`: 실제 에셋 수급 후 추가할 전용 이미지·영상 썸네일

## 콘텐츠 제작 단계

1. 페이지별 슬라이드 목차와 확정 문구를 `slides.js`에 입력한다.
2. 페이지별 CSS를 추가하고, 임시 플레이스홀더를 실제 컴포넌트로 교체한다.
3. 에셋을 전용 `assets/`에 넣고 3개 언어 대체 텍스트를 입력한다.
4. 데스크톱(16:9)·모바일·인쇄/PDF·3개 언어에서 최종 검수한다.
