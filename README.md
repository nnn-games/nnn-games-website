# nnn-games-website

TripleN Games Inc. Website

## 개발 환경

에이전트 작업 규칙과 저장소 구조는 `CLAUDE.md`, 역할별 정의는 `.claude/agents/`(site, decks), 반복 작업 절차는 `.claude/skills/`를 참고합니다.

```bash
npm install
npm run dev          # http://localhost:8080 (fetch 가 file:// 에서 동작하지 않으므로 서버 필수)
npm run check        # i18n 키, 내부 링크, 데이터 규칙, ESLint 검사 (커밋 전 필수)
npm run build        # Tailwind 빌드 + dist/ 조립 (배포 산출물, git 추적 안 함)
npm run update:metrics
```

### 배포

- `main` 에 푸시하면 `.github/workflows/deploy.yml` 이 검증 → 빌드 → GitHub Pages 배포를 수행합니다. 저장소 Settings > Pages > Source 를 **GitHub Actions** 로 설정해야 합니다.
- `.github/workflows/metrics.yml` 이 매일 12:00 KST 에 지표를 갱신해 `data: metrics YYMMDD` 커밋을 만들고 재배포합니다. 수동 실행: `gh workflow run metrics.yml`.
- `css/style.css` 는 더 이상 커밋하지 않습니다. 새로 클론하면 `npm install && npm run build:css` 를 먼저 실행하세요.

## 홈페이지 지표 업데이트 절차

1. 프로젝트 집계 대상을 확인합니다.
   - `data/projects.json`에서 메트릭 수집 대상은 `reporting.collectMetrics: true`인 프로젝트입니다.
   - 홈 히어로 프로젝트 수/방문 수 포함 여부는 `includeInHeroProjectCount`, `includeInHeroVisitTotal`로 제어합니다.
   - 새 프로젝트를 추가할 때는 `universeId`도 함께 채워야 합니다.

2. 커뮤니티 집계 대상을 확인합니다.
   - `data/community-groups.json`에서 `status`, `showOnHomepage`, `includeInHeroSubscriberTotal` 값을 조정합니다.
   - 홈 커뮤니티 카드 노출과 히어로 구독자 합계는 이 파일 기준으로 결정됩니다.

3. 메트릭 갱신 명령을 실행합니다.
   ```bash
   npm run update:metrics
   ```

4. 생성 결과를 확인합니다.
   - 프로젝트 히어로 요약: `data/projects.json`의 `summary.hero`
   - 커뮤니티 히어로 요약: `data/communities.json`의 `totals.heroSubscriberCount`
   - 프로젝트 상세 페이지의 방문 수/좋아요 비율도 같은 `data/projects.json`을 기준으로 반영됩니다.

5. 변경 내용을 검토한 뒤 커밋/배포합니다.
   - 지표만 갱신했다면 보통 `data/projects.json`, `data/communities.json` 변경이 생깁니다.

상세 구조와 Roblox API 기준은 `docs/metric.md`를 참고하면 됩니다.
