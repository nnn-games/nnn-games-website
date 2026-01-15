# Roblox 메트릭 자동 갱신 가이드

## 개요
- 정적 사이트 특성상 프런트엔드에서 Roblox Public API를 직접 호출하기 어렵습니다(CORS, 비공개 키 노출 문제).
- 빌드/배포 전에 스크립트를 실행해 `data/projects.json`의 `metrics`를 갱신하는 방식으로 운영합니다.
- 서버나 서버리스 비용이 들지 않으며, 로컬 빌드 또는 CI(GitHub Actions 등)에서 실행할 수 있습니다.

## 준비
- Node 18+ (네이티브 `fetch` 사용)
- `data/projects.json`에 `universeId`가 설정된 프로젝트

## 스크립트 위치와 역할
- 파일: `scripts/update-metrics.js`
- 동작:
  1) `data/projects.json`에서 `universeId` 목록을 수집
  2) Roblox Public API 호출
     - 요약 지표: `https://games.roblox.com/v1/games?universeIds=<ids>`
     - 투표 지표: `https://games.roblox.com/v1/games/votes?universeIds=<ids>`
  3) 각 프로젝트의 `metrics`를 업데이트  
     - `visits`, `playing`, `favorites`, `likeRatio`, `updatedAt`
  4) 커뮤니티 그룹(3개)의 멤버 수·아이콘을 업데이트  
     - 그룹 메타: `https://groups.roblox.com/v1/groups/<groupId>`
     - 아이콘: `https://thumbnails.roblox.com/v1/groups/icons?groupIds=...`
     - 결과를 `data/communities.json`에 저장 (`groups[]`, `totalMembers`, `updatedAt`, `icon`, `url`, `memberCount`)
  5) 파일 저장

## 그룹 ID로 universeId 조회하기 (수동)
Roblox 그룹이 소유한 경험(게임)의 `universeId`를 알아낼 때 사용할 수 있는 공개 엔드포인트입니다.
- URL: `https://games.roblox.com/v2/groups/<groupId>/games?accessFilter=All&sortOrder=Asc&limit=10`
  - `groupId`: 그룹 숫자 ID
  - `limit`: 한 번에 가져올 개수(최대 100). 더 필요하면 `cursor`로 페이지네이션.
- 응답 예시 주요 필드: `data[].id` 가 `universeId` 입니다.
  - `data[].rootPlaceId`는 placeId, `name`, `playing`, `visits` 등 메타가 함께 옵니다.
- 절차:
  1) 위 URL을 호출해 `data[].id` 값을 확인 (universeId)
  2) `data/projects.json`의 해당 프로젝트에 `universeId`를 채움
  3) 이후 `npm run update:metrics` 실행으로 지표 자동 갱신

간단 요청 예시(curl):
```
curl "https://games.roblox.com/v2/groups/<groupId>/games?accessFilter=All&sortOrder=Asc&limit=10"
```

## 게임 주소(Place URL)로 universeId 알아내기 (수동)
Roblox 경험(게임) URL에 포함된 `placeId`를 사용해 `universeId`를 조회할 수 있습니다.
- URL 형식: `https://www.roblox.com/games/<placeId>/...`
- 조회 엔드포인트: `https://apis.roblox.com/universes/v1/places/<placeId>/universe`
- 응답의 `universeId` 값을 `data/projects.json`에 반영한 뒤 `npm run update:metrics`를 실행합니다.

간단 요청 예시(curl):
```
curl "https://apis.roblox.com/universes/v1/places/<placeId>/universe"
```

## 실행 방법
로컬 또는 CI에서 빌드 전에 한 번 실행합니다.
```bash
npm run update:metrics
```
이후 정적 빌드/배포를 진행하세요.

## CI 예시 아이디어 (선택)
- GitHub Actions의 스케줄(cron) 또는 수동 실행(workflow_dispatch)으로 `npm run update:metrics` 실행 후 커밋/배포를 트리거할 수 있습니다.
- 별도 서버/서버리스가 필요 없으며, GitHub Actions 무료 범위 내에서 동작합니다.

## 주의사항
- Roblox Public API는 일시적으로 rate limit가 있을 수 있습니다. 실패 시 재시도하거나, 스케줄 주기를 길게 설정하세요.
- `universeId`가 없는 프로젝트는 건너뜁니다.
- API 응답 구조 변경 시 스크립트(`scripts/update-metrics.js`)의 필드 매핑을 확인해 주세요.
