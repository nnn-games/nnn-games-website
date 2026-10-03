# 프로젝트 자산·다국어 콘텐츠 관리

`shared/assets`의 프로젝트 13개는 이미지와 `content.json`을 `www-<프로젝트>` 폴더에서 함께 관리합니다. JSON의 자산 URL은 배포 주소 `assets/www-.../` 기준입니다. 프로젝트·상세 페이지 ID와 공개 URL은 유지합니다.

| 프로젝트 ID | 자산 폴더 | 연결 상태 |
| --- | --- | --- |
| tower-flood-race | www-tower-flood-race | 홈페이지 등록 |
| korean-spa | www-korean-spa | 홈페이지 등록 |
| tomato-splatter-simulator | www-tomato-splatter-simulator | 홈페이지 등록 |
| afk-or | www-afk-or | 홈페이지 등록 |
| free-ugc-rng | www-free-ugc-rng | 홈페이지 등록 |
| enchanted-weapon | www-enchant-a-weapon | 홈페이지 등록 |
| hunt-a-slime | www-hunt-a-slime | 홈페이지 등록 |
| tomato-splatter | www-tomato-splatter | 홈페이지 등록 |
| asmr-ugc-town | www-asmr-ugc-town | 홈페이지 등록 |
| forest-workshop | www-forest-workshop | unlisted: 자산만 보관 |
| ducky-merge-farm | www-ducky-merge-farm | archived: 자산만 보관 |
| hacker-vs-security | www-hacker-vs-security | archived: 자산만 보관 |
| star-reach | www-star-reach | archived: 자산만 보관 |

## 편집할 필드

| JSON 위치 | 수정하는 내용 |
| --- | --- |
| `id` | 기존 프로젝트 ID |
| `project` | 카드 제목·설명·이미지·상세 주소·카테고리·출시 일정·플랫폼·클라이언트·기술 스택·링크 |
| `detail` | KO/EN/JA 상세·SEO·공유 문구·히어로·CTA·개요·핵심 포인트·요약·특징·갤러리·alt |
| `presentations.<덱>.<언어>` | 해당 덱의 프로젝트 제목·소개·장르·이미지 캡션·alt |
| `detail.communityVideos` | Tower Flood Race 영상 목록 경로·다국어 UI |
| `catalogOnly`, `catalogStatus` | 홈페이지 미등록 자산임을 명시 (`true`, `archived` 또는 `unlisted`) |

홈페이지 문구는 필드별 `{ "ko": "한국어", "en": "English", "ja": "日本語" }`, 발표 문구는 등록 언어별 사전입니다. 없는 정보는 새로 추정하지 않습니다. Forest Workshop은 기존 상세 JSON에서 확인되는 정보만 카드 정보에 복사했습니다. 보관 프로젝트는 `_archive/projects/2026-09-29/`의 기존 원고·메타를 복사했고 아카이브 원본은 수정하지 않았습니다. 과거 기록에 등장하는 옛 자산 폴더는 위 표의 새 폴더로 대응합니다.

## 빌드와 운영 데이터

등록 프로젝트는 `shared/data/projects.json`의 `contentFile`로 연결합니다. 운영 상태·featured·pinned·order·placeId·universeId·reporting·metrics는 해당 레지스트리에서 관리합니다. 수집 지표는 `npm run update:metrics`로만 갱신합니다.

빌드는 카드 정보와 운영 데이터를 합쳐 기존 `/data/projects.json`을 생성합니다. 상세 JS는 JSON의 `detail`을 읽는 로더이며, `@project-seo` 마커는 초기 검색·공유 메타를 생성합니다. 발표의 `{{project:<id>:image}}`는 카드 프리뷰 경로로 바뀌고 프로젝트 번역을 DECK_I18N에 합칩니다. 발표 지표와 기준일·연구 목표는 덱의 고정 인용으로 유지합니다.

`catalogOnly` JSON은 다국어·자산 경로를 검증하지만 홈페이지·카드·사이트맵·지표 수집에 추가하지 않습니다. 자산 파일은 기존 공유 자산과 같은 정책으로 빌드에 복사되며 페이지를 새로 생성하지 않습니다. Fruit Battles·NNN UGC처럼 `shared/images`만 사용하는 프로젝트의 기존 구조는 유지합니다.

JSON과 레지스트리에 같은 정보 필드를 중복 정의하면 검증이 실패합니다. `npm run check`로 번역·링크·데이터·배포 상태를 확인하고, 변경한 페이지는 `npm run agent:smoke -- --pages <경로>`로 언어·모바일을 검사합니다.
