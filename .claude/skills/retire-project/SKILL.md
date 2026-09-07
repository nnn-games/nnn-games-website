---
name: retire-project
description: 운영 중 프로젝트를 일시중단(paused) 또는 완료(completed)로 전환한다. 히어로 집계 제외, 지표 수집 중단, 홈 미리보기 제외, 상세 페이지는 유지하되 상태 문구 갱신. "서비스 종료", "일시중단 처리", "완료 처리", "홈에서 내려줘(운영 종료)" 요청에 사용.
---

# 프로젝트 중단/완료 절차

인자: `$ARGUMENTS` (slug, `paused` 또는 `completed`, 사유·시점)

## 0. 사전 확인
- 대상의 현재 `status`가 `active`인지 확인한다. `development` 프로젝트를 접는 경우는 `completed`가 아니라 사용자와 상의해 `paused`로 두거나 `_archive/` 이동(별도 작업)을 제안한다.
- 전환 전 `summary.hero` 값(프로젝트 수, 방문 수 합계)을 기록한다. 이 프로젝트가 히어로 합계에서 빠지면 수치가 줄어든다는 점을 사용자에게 먼저 알린다.
- `paused`: 다시 돌아올 가능성이 있음(재활성화는 `/activate-project`). `completed`: 운영 종료.

## 1. 데이터 (`shared/data/projects.json`)
- `status`: `paused` 또는 `completed`.
- `featured: false` (홈 미리보기 제외. `check:data`가 강제한다).
- `reporting`: `collectMetrics: false`, `includeInHeroProjectCount: false`, `includeInHeroVisitTotal: false`.
- `metrics`는 지우지 않는다. 마지막 스냅샷과 `updatedAt`이 상세 페이지에 "최종 지표"로 남는다.
- `links.play`는 게임이 비공개 처리되었으면 빈 문자열로 바꾼다(플레이 CTA 가 사라진다). 그룹 링크는 유지.
- `order`는 유지한다. 목록 페이지에서 상태 필터(일시중단/완료)로 걸러진다.

## 2. 상세 페이지
- `site/<slug>.html`은 그대로 둔다(운영용 렌더러 유지, 상태 배지가 `status-paused`/`status-completed`로 바뀐다).
- `site/js/project-details/<slug>.js`의 `hero.status`를 KO/EN/JA 로 갱신한다(예: `2026년 8월 서비스 종료` / `Service ended August 2026` / `2026年8月サービス終了`).
- 플레이 CTA 를 제거했다면 `ctaButtons`에서도 `play` 항목을 뺀다.

## 3. 검증
```
npm run update:metrics   # 히어로 집계(summary.hero, communities totals) 재계산
npm run check
npm run dev              # /, /projects-roblox.html (상태 필터), /<slug>.html
```
- 홈 히어로 프로젝트 수·방문 수 합계가 예상대로 줄었는지 확인한다.
- 홈 미리보기에서 카드가 빠졌는지, 목록에서 상태 배지가 바뀌었는지 확인한다.

## 4. 문서
- `docs/prd.md` 상세 목록의 상태를 갱신하고, 종료 사유가 있으면 `docs/development_roadmap.md`에 한 줄 남긴다.

## 보고
전환 전후 `summary.hero`, 변경 파일, 실행한 검증, 사용자가 확인할 외부 상태(Roblox 게임 비공개 여부)를 적는다. 브랜치 `site/retire-<slug>`, 커밋 접두어 `site:`.
