---
name: update-project
description: 기존 프로젝트의 문구·링크·갤러리·메타·표시 순서·featured 를 상태 변경 없이 수정한다. KO/EN/JA 동시 반영과 검증을 강제한다. "프로젝트 설명 수정", "트레일러 링크 바꿔줘", "갤러리 이미지 추가", "홈에서 빼줘/올려줘", "순서 바꿔줘" 요청에 사용.
---

# 프로젝트 수정 절차

인자: `$ARGUMENTS` (slug 와 바꿀 내용)

## 0. 사전 확인
- `shared/data/projects.json`에서 대상을 찾고 현재 `status`, `featured`, `order`, `links`를 확인한다.
- 상태 전환(개발 중 ↔ 운영 중, 중단)이 섞여 있으면 이 스킬이 아니라 `/activate-project` 또는 `/retire-project`로 안내한다.
- 지표 수치(`metrics`, `summary`)는 절대 손으로 바꾸지 않는다.

## 1. 어디를 고치는지 (필드 → 파일)

| 바꿀 것 | 파일 |
| --- | --- |
| 카드 제목·설명, 카테고리, 기술 스택, 출시일 | `shared/data/projects.json` (`title`, `description`, `technologies`, `launchDate`) |
| 플레이/트레일러/기사/그룹/쇼케이스 링크 | `shared/data/projects.json` `links.*` (http(s) URL, 없으면 빈 문자열). 상세 CTA 는 자동 동기화 |
| 홈 미리보기 노출 | `shared/data/projects.json` `featured` |
| 표시 순서 | `shared/data/projects.json` `order` (양의 정수, 중복 금지, 10 단위 권장). 운영 프로젝트는 동접·방문 수가 우선이므로 `order`는 지표 없는 프로젝트끼리의 순서다 |
| 카드 썸네일 | `shared/data/projects.json` `image` + `shared/assets/<project>/` 파일 |
| 상세 히어로/개요/특징/갤러리/SEO 문구 | `site/js/project-details/<slug>.js` (`{ko,en,ja}` 객체) |
| 상세 페이지 `<title>`, meta, OG 이미지 | `site/<slug>.html` 헤더 + `<slug>.js`의 `seo` (JS 가 런타임에 덮어쓰므로 둘 다 맞춘다) |
| 갤러리 이미지 | `shared/assets/<project>/` 에 추가 후 `<slug>.js`의 `gallery` 배열. 경로는 `assets/...` (배포 기준) |
| 공통 UI 문구 | `site/js/i18n.js` (14개 페이지 공통이므로 영향 범위를 먼저 알린다) |

## 2. 규칙
- 문구는 KO/EN/JA 를 모두 고친다. 한 언어만 요청받았으면 나머지 언어 초안을 만들고 보고에 "번역 확인 필요"로 표시한다.
- 이미지: 웹용 압축, 가로 1200px 이하, 2MB 이하, 의미 있는 `alt`(세 언어).
- 링크는 `check:data`가 http(s) 형식만 검사한다. 실제 Roblox 링크가 살아 있는지는 사용자가 확인한다.
- 파일 전체 재포맷 금지. 수정한 줄만 바꾼다.

## 3. 검증
```
npm run check
npm run dev      # /<slug>.html 과 / (카드), 언어 3종, 모바일 폭
```

## 보고
변경 파일과 바뀐 필드, 실행한 검증, 번역 확인이 필요한 문구를 적는다. 브랜치 `site/update-<slug>`, 커밋 접두어 `site:`.
