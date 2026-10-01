---
name: browser-qa
description: NNN GAMES 사이트와 웹 덱의 실제 브라우저 회귀를 검사하고 오류를 재현한다. 화면 검증, 다국어·모바일 확인, 슬라이드 동작 점검, 스크린샷으로 확인 요청에 사용한다. 수치·외부 링크 운영 점검은 audit-site를 사용한다.
---

# 브라우저 검증

변경한 배포 경로와 관련 공통 코드의 영향 범위를 정한다. `npm run agent:doctor`로 브라우저를 확인하고 필요하면 `npm run agent:setup -- --skip-install`을 실행한다.

## 실행

```bash
npm run agent:smoke -- --pages /,/contact.html
npm run agent:smoke -- --pages /company/ --lang ko,en,ja
npm run agent:smoke -- --pages /jumpstart/ --lang ko,en --widths 1280,390,320
npm run agent:smoke -- --offline
```

경로를 생략하면 홈·목록·문의·운영/개발 중 상세 예시와 모든 active/draft 덱을 검사한다. 덱은 레지스트리에 등록된 언어만 사용한다. 하네스는 매번 소스로부터 별도 `tmp/agent-build-*`를 만들고 임시 포트로 서비스한다. 실행 중인 dev 서버와 운영 `dist/`를 재사용하지 않는다.

사이트는 언어 전환·모바일 메뉴·프로젝트 필터, 덱은 모든 슬라이드·이전/다음·키보드·해시와 새로고침·언어 전환·지원되는 전체화면·인쇄 노출을 검사한다. 이미지 실패·JS 예외·로컬 HTTP 오류·가로 넘침·슬라이드 영역의 잘림은 실패로 기록한다.

## 증거 확인

- `exports/agent/<실행>/report.json`의 `cases[].failures`, `warnings`, `screenshots`를 읽는다. 실패가 있으면 종료 코드가 1이다.
- 바뀐 페이지와 슬라이드의 PNG를 직접 연다. 글자 겹침·잘린 문구·읽기 어려운 크기·어색한 여백·이미지 구도를 확인한다. 덱의 시각 기준은 `docs/decks/<slug>/`를 따른다.
- 실제 개발 오류와 외부 폰트·분석·API의 네트워크 실패를 구별한다. `--offline`에서는 외부 요청과 폰트가 차단된다는 점을 결과에 적는다.
- 회귀 원인을 고쳤으면 관련 경로만 다시 실행한다. 공용 코드를 바꿨으면 영향을 받는 화면을 함께 검사한다.
- PDF 요청은 `npm run export:deck -- <slug> --lang ko`. draft도 상태를 바꾸지 않고 내보낼 수 있다. PNG·PDF는 `exports/`에만 둔다.

기존 화면의 문제를 발견하면 재현 조건과 증거를 보고한다. 작업 범위와 무관한 콘텐츠나 배포 상태를 검증 통과를 위해 바꾸지 않는다.
