# 신규 회사 소개

대상: 협력사·브랜드/IP 파트너  
상태: 제작 초안 (`draft`)  
언어: KO/EN/JA  
구성: 본편 13장 + 부록 4장

Hunt a Slime의 제목·소개·이미지 alt는 `shared/assets/www-hunt-a-slime/content.json`의 `presentations.company-intro`에서 KO/EN/JA로 관리합니다. 빌드가 DECK_I18N과 초기 HTML에 반영합니다. 이미지 마커는 같은 JSON의 `project.image`를 사용하며, 발표에서 인용하는 출시 예정 월과 기타 설명은 이 덱에서 관리합니다.

2026-10-01 보관한 `company`·`nnn`의 이미지·설명을 재구성하고 현행 운영 게임 6종, 개발 게임 4종, NNN UGC 제작 프로젝트와 최신 공개 지표를 반영했습니다. 타이틀은 두 단어 이내의 개념명으로 통일합니다. 기존 덱 소스는 보존합니다.

## 구성과 근거

- [보관 덱 비교 검토](comparison.md): 공통 주제·차이와 검토 당시 데이터.
- [슬라이드 구성안](slide-outline.md): 확정 목차와 장별 메시지·자료 기준.
- [이미지 레이아웃 기준](design.md): 원본 전체 보존과 17장별 이미지 배치.
- [제작 출처](sources.md): 고정 지표·프로젝트·문구·이미지의 출처와 재사용 범위.
- [발표 메모](speaker-notes.md): 화면에서 제거한 서브타이틀·도입 문구의 KO/EN/JA 원문.

본편: 01 회사소개, 02 주요지표, 03 운영게임, 04 게임설계, 05 UGC 보상, 06 UGC 제작, 07 라이브 운영, 08 보유기술, 09 개발현황, 10 팀소개, 11 협업사례, 12 IP 전략, 13 협업문의.

부록: A1 회사연혁, A2 상세지표, A3 추가사례, A4 IP 제안. 본편 마지막 장에서 부록으로 이동하며 인쇄·내보내기에는 17장 모두 포함합니다.

## 제작 기준

지표는 `npm run update:metrics`로 갱신한 2026-10-01 14:57 KST 스냅샷입니다. 실행 중 자동 갱신하지 않습니다. 커뮤니티 가입 합계는 그룹 간 중복을 포함하며 방문은 재방문을 포함한 누적 횟수입니다. Get Train은 과거 ZEPETO 협업 사례, 라이브 이벤트는 과거 운영 사례, 개발 예정 월은 등록된 계획으로 표시합니다.

이미지를 자르지 않고 원본 비율을 보존해 레이아웃을 구성합니다. 가로 게임 화면·정사각형 제작물·배너는 각각 필요한 폭과 자연 높이로 표시합니다. 전용 WebP 36개를 사용하며 현재 프로젝트 이미지는 공유 배포 경로를 재사용합니다.

10 팀소개는 사용자 요청에 따라 nnn people의 구성을 복원했습니다. ONESHOT·JEFF·PAPASLIME 순서의 아바타·이름, 중앙 JEFF 강조와 Claude·ChatGPT 배경 장식을 재사용합니다. 공통 avatars 렌더러를 연결하며 아바타 원본은 그대로 사용합니다. 공통 런타임·기존 보관 덱은 수정하지 않습니다.

전체 17장의 서브타이틀·도입 문구는 제거했습니다. 제목·본문·이미지·출처를 유지하고 제목에서 본문까지 간격을 정리했습니다. 제거한 설명 문구는 발표자가 구두로 사용할 수 있도록 발표 메모에 보관합니다.

## 작업 위치와 확인

- `decks/company-intro/index.html`: 17장 마크업
- `decks/company-intro/slides.js`: 순서·부록·KO/EN/JA 문구
- `decks/company-intro/deck.css`: 신규 회사 소개 디자인
- `decks/company-intro/assets/`: 보관 덱에서 재사용한 압축 이미지
- `docs/decks/company-intro/`: 구성·근거·원고 관리

`npm run dev` 실행 후 <http://localhost:8080/company-intro/>에서 확인합니다. 운영 빌드에는 포함되지 않으며 검색·사이트맵에서 제외됩니다.

```bash
npm run check
npm run agent:smoke -- --pages /company-intro/
npm run export:deck -- company-intro --lang ko,en,ja
```

검증 스크린샷과 PNG/PDF는 `exports/`에 생성되며 커밋하지 않습니다.
