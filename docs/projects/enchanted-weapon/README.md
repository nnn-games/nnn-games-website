# Enchanted Weapon 참고 자료

기존 루트 `tmp/`에 보관하던 기획 이미지를 이곳으로 옮겼습니다.

- [모바일 GDD 이미지](images/eaw-gdd-mobile.png)
- [핵심 루프 이미지](images/gdd-core-loop.png)

이미지와 실제 콘텐츠는 `shared/assets/www-enchant-a-weapon/`에서 함께 관리합니다. 기존 프로젝트 ID·페이지 주소는 `enchanted-weapon`·`enchanted-weapon.html`을 유지합니다.

## JSON 편집 방법 (2026-10-03)

원본: `shared/assets/www-enchant-a-weapon/content.json`. Hunt a Slime·ASMR UGC Town의 JSON 빌드 연결을 재사용합니다.

| JSON 위치 | 수정 내용 |
| --- | --- |
| `project` | 카드 제목·설명·프리뷰 이미지·상세 주소·카테고리·출시 일정·플랫폼·클라이언트·기술 스택·링크 |
| `detail` | KO/EN/JA SEO·히어로·요약·대표 이미지·개요·핵심 포인트·갤러리 3장과 alt |
| `presentations.company-intro` | 회사 소개 제목·요약·이미지 alt (KO/EN/JA) |
| `presentations.jumpstart` | 제안서 이미지 캡션·alt (KO/EN) |

홈페이지 문구는 필드별 `{ "ko": "한국어", "en": "English", "ja": "日本語" }`, 발표 문구는 언어별 키 사전입니다. 이미지 경로는 `assets/www-enchant-a-weapon/...`를 사용합니다. 빌드가 카드 데이터·초기 SEO·발표 번역을 생성하며, 발표의 `{{project:enchanted-weapon:image}}`를 `../assets/...` 프리뷰 경로로 바꿉니다. `site/js/project-details/enchanted-weapon.js`는 같은 JSON의 `detail`을 읽는 로더입니다.

운영 상태·표시 순서·노출·수집 ID·reporting·metrics는 `shared/data/projects.json`에서 유지합니다. 지표는 수집 스크립트로만 갱신합니다. 발표의 출시 월·단계별 연구 목표는 기존 덱에서 관리합니다. 이미지 6개 중 대표·프리뷰·갤러리 3장을 현재 화면에서 사용하며 기존 `ew-preview.jpg`도 보존합니다.

검증: `npm run check`, `npm run agent:smoke -- --pages /,/projects-roblox.html,/enchanted-weapon.html,/company-intro/,/jumpstart/`.
