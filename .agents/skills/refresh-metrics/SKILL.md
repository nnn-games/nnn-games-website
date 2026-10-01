---
name: refresh-metrics
description: Roblox 공개 API로 프로젝트 방문 수·플레이 수·즐겨찾기·좋아요 비율과 커뮤니티 멤버 수를 갱신하고 data/projects.json, data/communities.json 을 커밋 가능한 상태로 만든다. "지표 갱신", "메트릭 업데이트", "방문 수 업데이트" 요청에 사용.
---

# 지표 갱신 절차

평소에는 `.github/workflows/metrics.yml`이 매일 12:00 KST 에 자동으로 갱신·커밋·재배포한다. 이 절차는 사용자가 즉시 갱신을 원하거나 집계 대상을 바꿀 때 쓴다. 로컬 실행 대신 `gh workflow run metrics.yml`로 CI 를 수동 실행해도 된다.

## 1. 집계 대상 확인
- `shared/data/projects.json`: `reporting.collectMetrics: true`이고 `universeId`가 있는 프로젝트만 수집된다.
- `shared/data/community-groups.json`: `status`, `showOnHomepage`, `includeInHeroSubscriberTotal` 값이 홈 노출과 히어로 합계를 결정한다.
- 대상을 바꾸려는 요청이면 이 두 파일의 플래그만 수정한다. 수치는 절대 손으로 고치지 않는다.

## 2. 실행
```
npm run update:metrics
```
- 네트워크 오류나 API 429가 나면 한 번만 재시도하고, 계속 실패하면 어느 프로젝트/그룹에서 실패했는지 보고한다. 부분 실패 상태로 커밋하지 않는다.

## 3. 검증
```
npm run check:data
git diff --stat shared/data/
```
- 변경이 `shared/data/projects.json`, `shared/data/communities.json` 두 파일에만 있어야 한다.
- `summary.hero.projectCount`, `totalVisits`, `totals.heroSubscriberCount`가 플래그 기준과 일치하는지 `check:data`가 확인한다.
- 방문 수가 이전보다 줄어든 프로젝트가 있으면 API 응답 이상일 수 있으니 보고한다.

## 4. 커밋
- 브랜치 `site/metrics-YYMMDD` 또는 사용자가 지정한 브랜치.
- 메시지: `data: metrics YYMMDD` (예: `data: metrics 260907`).
- 사용자가 요청하지 않았으면 push 하지 않는다.

## 보고
갱신된 프로젝트 수, 히어로 합계(프로젝트 수/방문 수/구독자 수) 전후 값, 실패 항목을 표로 적는다.
