# nnn-games-website

TripleN Games Inc. Website

## 개발 환경

에이전트 작업 규칙과 저장소 구조는 `CLAUDE.md`, 역할별 정의는 `.claude/agents/`(site, decks), 반복 작업 절차는 `.claude/skills/`를 참고합니다.

```bash
npm install
npm run dev          # dist/ 빌드 + 변경 감시 + http://localhost:8080 서비스
npm run check        # 빌드 후 i18n 키, 내부 링크(dist 기준), 데이터 규칙, ESLint 검사 (커밋 전 필수)
npm run build        # dist/ 조립 + Tailwind 빌드 + sitemap (배포 산출물, git 추적 안 함)
npm run update:metrics
npm run snapshot     # 주요 페이지 스크린샷 → exports/site (최초 1회 npx playwright install chromium)
npm run export:deck  # 덱 PNG/PDF → exports/decks
npm run audit        # 정기 점검 보고서 → exports/audit
```

### 디렉터리 구조

```text
site/     홈페이지 (HTML, js/, styles/, privacy/, _partials/ 공통 헤더·푸터)   -> /
shared/   공유 자산 (data/, images/, assets/)                                  -> /data, /images, /assets
decks/    웹 슬라이드 (decks.json 레지스트리, shared/ 런타임, company/, nnn/, jumpstart/)
                                                                              -> /slides/shared, /company, /nnn, /jumpstart
scripts/  빌드·검증·지표·점검 스크립트
docs/, plan/  문서 (배포 안 함)
```

소스 안의 상대 경로는 소스 위치가 아니라 배포 URL 구조 기준으로 씁니다. 매핑은 `scripts/build.js` 가 정의하고, 덱은 `decks/decks.json` 에 등록하면 자동으로 배포됩니다. 헤더·푸터·공통 head 는 `site/_partials/` 에 한 벌만 있고 페이지의 `<!-- @include … -->` 마커에 빌드가 인라인합니다.

### 배포

- `main` 에 푸시하면 `.github/workflows/deploy.yml` 이 검증 → 빌드 → GitHub Pages 배포를 수행합니다. 저장소 Settings > Pages > Source 는 **GitHub Actions** 입니다.
- PR 을 열면 `.github/workflows/preview.yml` 이 검증 후 dist 와 스크린샷 아티팩트를 올리고 PR 에 요약 코멘트를 남깁니다.
- `.github/workflows/metrics.yml` 이 매일 12:00 KST 에 지표를 갱신해 `data: metrics YYMMDD` 커밋을 만들고 재배포합니다. 수동 실행: `gh workflow run metrics.yml`.
- `.github/workflows/audit.yml` 이 매주 월요일 10:00 KST 에 점검 보고서를 `audit` 라벨 이슈로 올립니다.
- 덱 PDF 는 저장소에 두지 않고 `Export decks` 워크플로(수동)의 아티팩트로 받습니다.
- 빌드 결과(`dist/`)와 `exports/` 는 커밋하지 않습니다. 새로 클론하면 `npm install` 후 `npm run dev` 로 바로 확인할 수 있습니다.

## 홈페이지 지표 업데이트 절차

평소에는 CI 가 매일 자동으로 갱신합니다. 수동으로 할 때의 절차입니다.

1. 프로젝트 집계 대상을 확인합니다.
   - `shared/data/projects.json`에서 메트릭 수집 대상은 `reporting.collectMetrics: true`인 프로젝트입니다.
   - 홈 히어로 프로젝트 수/방문 수 포함 여부는 `includeInHeroProjectCount`, `includeInHeroVisitTotal`로 제어합니다.
   - 새 프로젝트를 추가할 때는 `universeId`도 함께 채워야 합니다.

2. 커뮤니티 집계 대상을 확인합니다.
   - `shared/data/community-groups.json`에서 `status`, `showOnHomepage`, `includeInHeroSubscriberTotal` 값을 조정합니다.
   - 홈 커뮤니티 카드 노출과 히어로 구독자 합계는 이 파일 기준으로 결정됩니다.

3. 메트릭 갱신 명령을 실행합니다.
   ```bash
   npm run update:metrics
   ```

4. 생성 결과를 확인합니다.
   - 프로젝트 히어로 요약: `shared/data/projects.json`의 `summary.hero`
   - 커뮤니티 히어로 요약: `shared/data/communities.json`의 `totals.heroSubscriberCount`
   - 프로젝트 상세 페이지의 방문 수/좋아요 비율도 같은 `projects.json`을 기준으로 반영됩니다.
   - `npm run check:data` 로 집계 규칙 일치를 확인합니다.

5. 변경 내용을 검토한 뒤 커밋/배포합니다.
   - 지표만 갱신했다면 보통 `shared/data/projects.json`, `shared/data/communities.json` 변경이 생깁니다.

상세 구조와 Roblox API 기준은 `docs/metric.md`를 참고하면 됩니다.
