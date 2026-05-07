# 작업 04 — 신규 커뮤니티 `Tomato Lab` 추가 / 가입자순 정렬 / 지표 집계 반영

## 목표
1. 신규 Roblox 커뮤니티 **Tomato Lab** (https://www.roblox.com/ko/communities/844932134/Tomato-Lab#!/about) 을 사이트의 커뮤니티 시스템에 추가한다.
2. `index.html` 홈 화면의 커뮤니티 카드 목록을 **가입자수(memberCount) 내림차순**으로 정렬한다.
3. 신규 커뮤니티가 **지표 집계 파이프라인**(`scripts/update-metrics.js`)에 자동 반영되어 멤버수/아이콘이 갱신되고, 홈 hero의 `커뮤니티 구독자` 합계에도 포함되도록 한다.

## Placeholder 정책 (해당 없음)
- 본 작업은 신규 페이지를 생성하지 않으며, 커뮤니티 정보(이름·아이콘·멤버수)는 모두 **Roblox 공개 API에서 자동 수집되는 실제 데이터**를 사용한다 (더미 미사용).
- `data/community-groups.json`에 입력하는 표시명("Tomato Lab")과 URL은 실제 값.

## 현재 상태 (확인 사항)
- 커뮤니티 시스템은 두 개의 JSON으로 분리:
  - `data/community-groups.json` — **설정(SoT)**: id, url, names, status, 노출/집계 플래그.
  - `data/communities.json` — **집계 결과**: 위 설정에 멤버수·아이콘·timestamp가 결합된 산출물. `scripts/update-metrics.js`가 작성.
- 현재 등록된 커뮤니티 4개:
  | id | 이름 | memberCount |
  |---|---|---|
  | 294985728 | NNN PLAY | 49,150 |
  | 34453707 | NNN UGC | 6,672 |
  | 916094546 | NNN Weapon Master | 186 |
  | 937186626 | NNN FUN | 5 |
- 홈 화면 렌더링: `js/main.js`의 `renderCommunities()` (line ~349). 현재 정렬 없이 `community-groups.json`의 배열 순서대로 노출.
- 지표 집계: `scripts/update-metrics.js`의 `updateCommunities()` (line ~201)가 `community-groups.json`을 읽어 Roblox API에서 그룹 정보(`/v1/groups/{id}`)와 아이콘 (`/v1/groups/icons`)을 가져와 `communities.json`에 저장. **신규 항목을 `community-groups.json`에 추가만 하면 자동 집계됨**.
- Hero 합계(`커뮤니티 구독자`)는 `includeInHeroSubscriberTotal: true` 항목들의 `memberCount` 합으로 계산.

## 변경 사항

### 1. `data/community-groups.json` — Tomato Lab 항목 추가
```json
{
  "id": "844932134",
  "url": "https://www.roblox.com/ko/communities/844932134/Tomato-Lab#!/about",
  "names": {
    "ko": "Tomato Lab",
    "en": "Tomato Lab",
    "ja": "Tomato Lab"
  },
  "status": "active",
  "showOnHomepage": true,
  "includeInHeroSubscriberTotal": true
}
```
- 배열 끝에 추가 (정렬은 §3에서 런타임 처리).
- `names` 한/영/일 표기는 그대로 "Tomato Lab" 통일 (사용자 요청 시 현지화 가능).

### 2. `data/communities.json` — 집계 스크립트로 자동 채움
- 직접 수정하지 않고 `node scripts/update-metrics.js` 실행으로 갱신.
- 결과: `groups` 배열 끝에 Tomato Lab 항목이 `memberCount`/`icon`/`updatedAt`과 함께 추가되고, `totals.heroSubscriberCount`/`totalMembers`가 재계산됨.
- 스크립트가 GitHub Actions 등 자동 빌드에 등록되어 있다면 별도 수동 실행 없이 다음 빌드 시 반영.
- 수동 실행 명령:
  ```
  node scripts/update-metrics.js
  ```
  또는 기존에 있는 `update-metrics-and-build.bat` 사용.

### 3. 홈 커뮤니티 카드 정렬 — `js/main.js`
- `renderCommunities()` 내에서 `groups`/`homepageGroups` 배열을 렌더 전에 **`memberCount` 내림차순**으로 정렬.
- 두 분기 모두 적용:
  - 분기 A (정적 JSON 사용, line ~365):
    ```js
    const groups = communityData.groups
      .filter(shouldShowCommunityOnHomepage)
      .slice()
      .sort(byMemberCountDesc);
    ```
  - 분기 B (실시간 API 폴백, line ~409): `homepageGroups`를 `mergedGroups`와 매핑한 뒤 동일하게 정렬 후 렌더.
- 정렬 헬퍼 신규 추가:
  ```js
  function byMemberCountDesc(a, b) {
    const av = typeof a.memberCount === 'number' ? a.memberCount : -1;
    const bv = typeof b.memberCount === 'number' ? b.memberCount : -1;
    if (av !== bv) return bv - av;
    // tie-break: 한국어 표시명 알파벳 오름차순 (또는 id 오름차순)
    const an = (a.names && a.names.ko) || a.name || a.id;
    const bn = (b.names && b.names.ko) || b.name || b.id;
    return an.localeCompare(bn);
  }
  ```
- `memberCount`가 `null`/미정의인 항목은 가장 뒤로 정렬.

### 4. 지표 집계 시스템 반영 점검 — `scripts/update-metrics.js`
- 코드 변경 **불필요**. `community-groups.json`에서 항목을 읽어 처리하는 구조이므로 §1 추가만으로 자동 반영.
- 동작 검증:
  1. `node scripts/update-metrics.js` 실행.
  2. `data/communities.json`의 `groups`에 `id: "844932134"` 항목이 추가되고, `memberCount`·`icon`이 채워졌는지 확인.
  3. `totals.heroSubscriberCount` 가 5개 그룹 합으로 재계산되었는지 확인.
  4. `index.html` 헤더/hero의 "커뮤니티 구독자" 카운트가 갱신되었는지 브라우저 확인.

### 5. 정렬 결과 검증
- 현재 데이터 기준 정렬 결과 (Tomato Lab 멤버수 미상으로 X 표기):
  ```
  1. NNN PLAY (49,150)
  2. NNN UGC (6,672)
  3. Tomato Lab (X)            ← 위치는 X 값에 따라 결정
  4. NNN Weapon Master (186)
  5. NNN FUN (5)
  ```
- Tomato Lab 멤버수 확인 후 위치 변동 정상 여부 확인.

## 영향 받는 파일
### 수정
- `data/community-groups.json` — Tomato Lab 항목 1건 추가.
- `js/main.js` — `renderCommunities()` 두 분기에 멤버수 내림차순 정렬 추가, 정렬 헬퍼(`byMemberCountDesc`) 신규.

### 자동 갱신 (스크립트 산출물)
- `data/communities.json` — `node scripts/update-metrics.js` 실행 결과로 갱신.

### 변경 불필요
- `scripts/update-metrics.js` — 설정 기반으로 동작하므로 코드 변경 없음.
- `index.html` — DOM 구조 그대로.

## 작업 순서
1. `data/community-groups.json`에 Tomato Lab 항목 추가 (id `844932134`, URL, names, status: active, 노출/집계 플래그 모두 true).
2. `node scripts/update-metrics.js` 실행 → `data/communities.json` 자동 갱신.
3. 결과 JSON에서 Tomato Lab의 `memberCount`/`icon`이 정상 채워졌는지, `totals.heroSubscriberCount`가 5개 그룹 합인지 확인.
4. `js/main.js`의 `renderCommunities()`에 멤버수 내림차순 정렬 로직 추가.
5. 브라우저에서 한/영/일 모두에 대해 카드 순서가 멤버수 내림차순으로 노출되는지, 헤더/hero "커뮤니티 구독자" 카운트가 5개 합계로 표시되는지 확인.
6. 자동 빌드(예: `update-metrics-and-build.bat`)가 정상 동작하는지 한 번 실행해 확인.

## 결정 / 확인 필요
- **정렬 동률 시 tie-breaker**: 표시명 가나다순(권장) vs id 오름차순 vs 등록 순서. 기본: **이름순**.
- **`memberCount`가 `null`인 그룹 위치**: 맨 뒤(권장) vs 맨 앞. 기본: **맨 뒤**.
- **Tomato Lab의 한/영/일 표시명 현지화 여부**: 현재는 모두 "Tomato Lab" 동일. 한국어로 "토마토 랩" 등 별도 표기 필요 시 알려주세요.
- **`status`/`showOnHomepage`/`includeInHeroSubscriberTotal`**: 모두 `true`(active + 홈 노출 + 합계 포함)로 시작. 다르게 운영해야 할 사정이 있으면 조정.
- **API 호출 안정성**: Roblox 그룹 API가 가끔 응답 실패 시 fallback이 동작하는지(`infoMap.get`이 null일 때 `memberCount: null`로 들어감) 확인. 정렬 헬퍼는 `null`을 맨 뒤로 보내므로 안전.
