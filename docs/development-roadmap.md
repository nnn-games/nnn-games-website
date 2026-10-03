# 개발 로드맵 (NNN GAMES 랜딩 페이지)
오늘부터 진행할 개발 계획과 진행 상황을 기록하는 문서다. 완료된 기능/콘텐츠는 검증 후 `docs/site/prd.md`에 반영한다.

## 1. 운영 원칙
- PR 기반 변경, 1인 리뷰. PR 요약에 변경·테스트·리스크·스크린샷 포함.
- i18n·접근성·CTA 링크·외부 링크(UTM/추적) 확인을 기본 체크리스트로 유지.
- 완료 → 검증 → `docs/site/prd.md` 업데이트 순서 준수.

## 2. 진행 현황 요약
- 현재 상태: 정적 웹사이트(다국어 KO/EN/JA) + 프로젝트 카드 동적 렌더 + 모바일 내비/지연 로딩 구현.
- 주요 우선순위: 프로젝트 필터/정렬 연결, CTA 정확도, SEO/분석 기초, 문의 흐름 개선.

## 3. 일정 개요 
- 모든 개발 일정은 수요가 발생한 즉시 진행할 계획이므로 특별한 사유가 있지 않은 한 목표 일정을 수립하지 않는다.

## 4. 작업 보드 (수시 업데이트)
| ID | 항목 | 상태 | 산출물/링크 |
| --- | --- | --- | --- |
| N-15 | 1인 개발 편의 중심 구조 정리: 기획·원고·참고 자료를 docs/site·projects·decks로 통합, 도메인·검색 파일을 site로 이동, 오래된 작업 경로 수정. 단일 dev/check/build와 자동 배포 유지 | Completed | `README.md`, `docs/README.md`, `site/CNAME`, `site/robots.txt`, `scripts/build.js` |
| N-02 | 히어로 섹션 하단에 현재 운영중인 커뮤니티 포탈 기능 개발. 커뮤니티는 계속 추가될 예정이며 각 커뮤니티의 인원을 공개 API를 이용해 가져와 합산하여 섹션에 잘 보이게 표시. `npm run update:metrics` 시 `data/communities.json`으로 정적 데이터 생성, 프런트는 JSON 우선 사용 후 API 폴백 | Completed | `index.html`, `js/i18n.js`, `js/main.js`, `src/styles/tailwind.css`, `scripts/update-metrics.js`, `data/communities.json` |
| N-03 | 인라인 스타일 제거 후 Tailwind 공용 적용 | Completed | `tower-flood-race.html`, `js/main.js` |
| N-04 | CTA 추적 엔드포인트/스키마 확정 및 적용 | Completed | `js/main.js`, `docs/site/prd.md` |
| N-05 | 히어로/커뮤니티 집계 규칙을 status/flag 기반으로 명시화 | Completed | `data/projects.json`, `data/community-groups.json`, `data/communities.json`, `js/projects-data.js`, `js/main.js`, `scripts/update-metrics.js`, `docs/site/metric.md`, `docs/site/dev-plan.md` |
| N-06 | 에이전트 기반 개발환경 1단계: 루트 `CLAUDE.md`, 역할별 에이전트(site/decks), 스킬(add-project/refresh-metrics/new-deck), 검증 스크립트(`npm run check`: i18n/links/data/lint), ESLint/Prettier/EditorConfig, 로컬 서버(`npm run dev`) | Completed | `CLAUDE.md`, `.claude/`, `scripts/check-*.js`, `eslint.config.js`, `package.json` |
| N-07 | 개발환경 2단계: `npm run build` 로 `dist/` 조립(sitemap/robots 포함), GitHub Actions 로 main 푸시 시 검증·빌드·Pages 배포, 매일 12:00 KST 지표 자동 갱신 커밋, `css/style.css` 추적 해제 | Completed | `scripts/build.js`, `.github/workflows/deploy.yml`, `.github/workflows/metrics.yml`, `robots.txt` |
| N-08 | 개발환경 3단계: 소스를 `site/`(홈페이지), `decks/`(슬라이드), `shared/`(data/images/assets) 로 재배치. 빌드가 배포 URL 구조로 매핑하므로 소스 내부 상대 경로와 서비스 URL 은 그대로 유지. `npm run dev` 가 dist 감시 서비스, `check:links` 는 dist 기준 검사 | Completed | `scripts/build.js`, `scripts/check-*.js`, `site/`, `decks/`, `shared/` |
| N-10 | 에이전트 운영 1단계: 표시 순서를 `projects.json`의 `order`로 이동, `detailRenderer` 예외 필드, `check:data` 상태별 규칙(order 유일성, 상태↔렌더러, 중단 시 featured 금지, launchDate 형식), 스킬 `activate-project`/`update-project`/`retire-project` 추가 | Completed | `shared/data/projects.json`, `site/js/project-renderer.js`, `scripts/check-data.js`, `.claude/skills/` |
| N-11 | 에이전트 운영 2단계: `decks/decks.json` 레지스트리(slug·제목·대상·status·언어·연결 프로젝트) 도입, 빌드 MAP·sitemap 이 레지스트리에서 덱을 읽음, `check:data` 레지스트리 검사, `check:i18n` 언어 일치, 스킬 `update-deck`/`archive-deck` 추가, `new-deck` 은 등록 방식으로 변경 | Completed | `decks/decks.json`, `scripts/build.js`, `scripts/check-data.js`, `scripts/check-i18n.js`, `.claude/skills/` |
| N-12 | 에이전트 운영 3단계: PR 미리보기 워크플로(검증 → dist·스크린샷 아티팩트 → PR 코멘트), `npm run snapshot`(주요 페이지 데스크톱/모바일 스크린샷), `npm run export:deck` + `Export decks` 워크플로(슬라이드 PNG·언어별 PDF 아티팩트), 스킬 `export-deck` | Completed | `.github/workflows/preview.yml`, `.github/workflows/export-decks.yml`, `scripts/snapshot.js`, `scripts/export-deck.js`, `scripts/lib/preview-server.js` |
| N-13 | 에이전트 운영 4단계: `npm run audit`(검증 결과, 지표 신선도, 외부 링크 생존, 번역 누락 의심, 덱 수치 대조, 에셋 위생) + 주간 `Site audit` 워크플로가 `audit` 라벨 이슈 생성·갱신, 스킬 `audit-site`(발견→조치 매핑) | Completed | `scripts/audit.js`, `.github/workflows/audit.yml`, `.claude/skills/audit-site/` |
| N-14 | 에셋 정리: 미참조 이미지 24개 삭제, jumpstart 이미지 6개 PNG→WebP(각 2.0~2.8MB → 0.2~0.4MB), `npm run optimize:images` 스크립트(sharp) 추가 | Completed | `scripts/optimize-images.js`, `decks/jumpstart/img/` |
| N-09 | 개발환경 4단계: 덱 런타임을 `decks/shared/deck.js` 하나로 통합(회사 덱 렌더러 `company-renderers.js` 분리, `data-deck-render` 훅), 상세 렌더러 `project-detail.js` 하나로 통합(standard/development 모드), 헤더·푸터·공통 head 를 `site/_partials/`로 템플릿화(빌드 인라인), 덱 PDF 80MB 저장소 제거(export-decks 로 대체, 복구는 커밋 11c6257) | Completed | `decks/shared/`, `site/js/project-detail.js`, `site/_partials/`, `scripts/build.js` |


## 2026-09-29 프로젝트 정리
- 완료: Ducky Merge Farm [RNG], Star Reach 페이지와 메타를 `_archive/projects/2026-09-29/`에 보관하고 사이트 등록에서 제외.
- 완료: Enchanted Weapon → Enchant a Weapon (KO/EN/JA 제목·메타·상세 콘텐츠).
- 완료: Hunt a slime, Tomato Splatter, ASMR UGC Town 개발 중 페이지 등록, 이름 기반 콘셉트 아트 3장 생성 및 카드/상세 이미지 반영, KO/EN/JA 소개 추가. 상단 4개 고정 및 라이브 6개 누적 방문 수 내림차순 정렬 반영.

- 출시 일정 반영: Enchant a Weapon·ASMR UGC Town 2026-10, Hunt a slime 2026-11, Tomato Splatter 2027-02. 카드 데이터와 상세 페이지 KO/EN/JA 출시 예정 문구 동기화.

- 2026-09-29: NNNRPG(487193470) 커뮤니티 추가. 홈 노출·히어로 멤버 합계 포함, 공식 API 지표·아이콘 갱신. 신규 프로젝트 페이지는 이름 및 게임 정보 확인 대기.

- 2026-09-29: Hacker vs Security 페이지·설정·데이터 아카이브. 홈·프로젝트 목록·사이트맵에서 제외. 기존 이미지와 계획서는 보존.


## 2026-09-30 ASMR UGC Town 상세 페이지
- 완료: 사용자 제공 게임 설명을 바탕으로 개발 중 간소 페이지를 표준 상세 구성으로 확장. 개요·핵심 포인트 3개·프로젝트 정보·특징 4개·기존 갤러리 3장 반영.
- 완료: 홈·목록 카드, HTML 메타, 상세 SEO·본문·이미지 대체 텍스트를 KO/EN/JA로 동기화. 개발 중 상태, 2026-10 출시 예정, 집계·지표 유지.
- 검증: `npm run check` 통과, KO/EN/JA × PC/모바일 스크린샷 6장 확인, Playwright로 1280/390/320px 상세·언어 전환·이미지·가로 넘침·메뉴·목록 이동 확인.


## 2026-10-01 OpenAI 기반 에이전트 개발환경

- 공식 OpenAI 문서 조사: Codex 권장 작업 방식, AGENTS.md, 저장소 스킬, 프로젝트 config, Docs MCP, 환경 준비·worktree. 출처와 적용 판단은 `docs/agent-development.md`에 기록.
- 공통 규칙을 `AGENTS.md`로 통합하고 기존 스킬 10개를 `.agents/skills/`로 이동. 홈페이지 개발·브라우저 QA 스킬 2개를 추가해 총 12개 구성. Claude 호환 링크 유지.
- `agent:setup`, `agent:doctor`, `deck:new`, `agent:smoke`, `agent:test`, `agent:check` 추가. 새 덱은 공통 런타임·다국어 UI·원고·draft 등록까지 생성하고 기존 파일·URL 충돌을 거부.
- 브라우저 검증·덱 내보내기는 개별 임시 빌드와 포트를 사용. draft도 상태 변경 없이 검증·PNG/PDF 내보내기 가능. PR preview에 하네스 회귀·KO PC/모바일 검증·증거 아티팩트 추가.
- 검증 중 발견한 company·nnn 덱의 모바일 하단 컨트롤 넘침을 슬라이드 표시 폭 제한으로 수정.
- 검증: 환경 준비·진단, 스킬 12개 공식 validator, 기존 검사·배포 회귀 4개, 하네스 회귀 4개 통과. `agent:check`의 KO/EN/JA × 1280/390/320px 69개 조합 통과, 화면 증거 465장. 새 덱 골격 9개 조합도 별도 확인. 외부 미디어·폰트 요청 실패는 warnings에 기록.


## 2026-10-01 회사 소개 덱 보관 및 신규 초안

- 완료: company(2026-08)·nnn(2026-07)을 archived로 전환. 기존 소스·자산·기획 원본은 보존하며 개발·운영 빌드에서 제외.
- 완료: company-intro를 partner 대상 KO/EN/JA draft로 등록. 흰색 빈 슬라이드 1장과 공통 언어 전환·전체화면·발표 컨트롤을 준비.
- 신규 제작 위치: `decks/company-intro/`, 후속 원고·근거·디자인은 `docs/decks/company-intro/`. 최신 데이터·프로젝트 본문은 후속 작업에서 작성.
- 검증: `npm run check`·환경 진단 통과, KO/EN/JA × 1280/390/320px smoke 9개 조합 및 PNG 확인, KO PNG/PDF 내보내기 통과. 운영에서 company·nnn·company-intro 404, 개발에서 company·nnn 404 및 company-intro 200 확인. 모든 덱 사이트맵 제외.


## 2026-10-01 회사 소개 비교 검토·신규 구성안

- company·nnn의 실제 27장과 KO/EN/JA 문구·고정 수치·렌더러를 비교. 공통 주제 10개와 각 덱 고유 내용, company의 12.1M+/11.8M+ 불일치와 과거/현행 출시일 차이를 정리.
- 저장소 2026-09-30 지표와 운영 게임 6종·개발 프로젝트 5종 확인. 신규 게임 4종·NNN UGC 제작 프로젝트를 구분하고 보관된 게임은 현재 파이프라인에서 제외.
- `docs/decks/company-intro/comparison.md`, `slide-outline.md` 작성. 본편 13장 + 선택 부록 4장, 장별 주장·근거·시각 자료·확인할 자료 제안. 웹 덱은 빈 슬라이드 1장·draft 유지.
- 검증: 전체 슬라이드 대응·문서 링크·인용 수치·기준일 확인, `npm run check` 통과. 문서만 변경하여 화면 회귀는 반복하지 않음.
- 2026-10-01 타이틀 정리: 신규 구성안의 본편 13장·부록 4장 제목을 두 단어 이내의 개념명으로 통일. 목차와 장별 제목을 함께 반영.

### 2026-10-01 — 신규 회사 소개 덱 제작

- 확정 타이틀로 company-intro 본편 13장·부록 4장 구현. 회사 현황→게임·UGC 설계→운영·기술→개발·팀·협업→IP·문의 흐름, KO/EN/JA 제공.
- company·nnn의 문구·사례를 재구성하고 보관 이미지 36개를 WebP로 압축(1,737,628바이트). 현행 운영 게임 6종·개발 게임 4종·NNN UGC 제작 프로젝트와 공유 이미지를 반영.
- 공식 갱신 스냅샷: 2026-10-01 14:57 KST, 운영 방문 14,008,163회·커뮤니티 가입 합계 208,979·NNN UGC 그룹 84,356. 방문·커뮤니티 정의와 기준일을 함께 표기하고 과거 미확인 Peak CCU·Get Train 성과·1개월 성장 수치는 제외.
- 모바일 상세지표는 게임별 카드로 변환. 개발 프로젝트 포스터 비율·팀 포트폴리오·협업 문의 배치를 직접 화면 검토 후 보완.
- 구성안·README·레지스트리 설명 갱신, `docs/decks/company-intro/sources.md`에 인용과 이미지 원본 경로 기록. company·nnn archived, company-intro draft, 공통 런타임 유지.
- 검증: `npm run check` 통과, KO/EN/JA × 1280/390/320px smoke 9개 조합·17장·249개 스크린샷 생성(오류/경고 0). 각 언어·폭의 PNG 직접 확인. 3개 언어 PNG 각 17개와 PDF 각 17쪽 내보내기 및 화면 확인.

### 2026-10-01 — 회사 소개 이미지 전체 보존 레이아웃

- 사용자 요청에 따라 17장 전체를 검토. 14개 이미지 슬라이드의 원본 46개·배치 53개를 크롭 없이 표시하도록 재설계.
- 고정 이미지 높이·강제 종횡비·cover·회전·카드 마스킹 제거. HTML에 원본 크기 기록, 자연 높이와 원본 비율 유지.
- 운영 게임 2열×3행·개발 현황 2열×2행의 이미지/설명 병렬 배치. 게임·보상 화면과 이벤트 배너 전체 확대, 기술 화면은 각 비율로 배정, 팀 아바타와 이름 병렬화 및 포트폴리오 확대.
- 협업 사례는 전체 화면·가로 배너·정사각형 캠페인을 고유 비율로 배치. 추가 사례는 가로 게임 이미지와 UGC 정사각형에 별도 영역을 배정. 모바일은 원본 비율의 전체 이미지와 설명을 세로로 펼침.
- `docs/decks/company-intro/design.md`에 장별 배치·이미지 보존 기준 기록, 구성안·출처·README 반영. 기존 타이틀·본문·지표·공통 런타임과 draft 상태 유지.
- 검증: npm run check 통과. KO/EN/JA × 1280/390/320px smoke 9조합·17장·248PNG, 실패/경고 0. 이미지 비율·슬라이드/부모 잘림 계측은 화면 9조합+인쇄 3조합, 각 53개·총 636개 확인, 실패 0. 언어별 인쇄 PNG 전체와 데스크톱·모바일 PNG 직접 확인. KO/EN/JA PDF 각 17쪽·PNG 각 17개 갱신.


### 2026-10-01 — 팀 소개를 nnn 원본 구성으로 복원

- 사용자 요청으로 10 팀소개의 경력·역할·포트폴리오 카드 구성을 폐기. nnn people의 KO/EN/JA 리드 문구, ONESHOT·JEFF·PAPASLIME 순서와 이름, 중앙 JEFF 강조·Claude/ChatGPT 배경 장식을 복원. 짧은 제목 10 팀소개 유지.
- 기존 공통 avatars 렌더러를 연결하고 nnn 아바타 WebP 원본을 그대로 재사용. 배경 PNG는 무손실 WebP로 변환하고 투명도·보이는 픽셀 일치 확인. 원본과 같은 720:687 contain 프레임으로 이미지 전체 보존, 모바일 장식 위치를 조정해 잘림 방지. 신규 덱에서 폐기한 포트폴리오 사본·문구 키·전용 카드 스타일 제거.
- 구성안·디자인·출처·README 갱신. 공통 코드·보관 덱·다른 슬라이드·지표·배포 상태 유지.
- 검증: npm run check·agent:doctor 통과. KO/EN/JA × 1280/390/320px smoke 9조합·17장·242PNG, 실패/경고 0. 팀의 원문·순서·원본 파일·언어 전환 alt와 45개 이미지 표시 영역·비율 확인. 변경 화면·PDF 10쪽 직접 확인, 3언어 PDF 각 17쪽·PNG 각 17개 갱신.


### 2026-10-01 — 회사 소개 전체 서브타이틀 제거

- 사용자 요청에 따라 본편 13장·부록 4장의 서브타이틀·도입 문구 제거. 제목 아래 intro-lead 15개와 표지 소개 문구 2개, 문의 도입 문구 1개, 회사연혁 하단의 중복 도입 문구 1개를 실행 HTML에서 삭제.
- KO/EN/JA의 해당 18개 문구 키와 미사용 서브타이틀 스타일 제거. 제목-본문 간격을 데스크톱 1.4rem·모바일 1.2rem로 통일하고 표지·문의의 중복 여백 정리. 슬라이드 순서·본문·이미지·아바타·지표·공통 코드·배포 상태 유지.
- 제거 문구는 docs/decks/company-intro/speaker-notes.md에 17장별 KO/EN/JA 발표 메모로 보관. 구성안·디자인·출처·README 반영.
- 검증: npm run check 통과. KO/EN/JA × 1280/390/320px smoke 9조합·17장·236PNG, 실패/경고 0. 3언어 데스크톱 17장 전체·한국어 모바일 전체·영어/일본어 320px 대표 화면 직접 확인. 3언어 PDF 각 17쪽·PNG 각 17개 갱신, PDF 서브타이틀 제거와 첫/마지막 페이지 직접 확인.


### 2026-10-02 — Hunt a slime 이미지 교체·갤러리 표시

- 사용자 제공 PNG 4종의 웹용 WebP 사본 생성(1200px 이하, 총 약 713KB). 원본 PNG 보존.
- 홈·목록 카드, 상세 대표·OG/Twitter, 회사 소개 초안 카드의 삭제된 JPG 참조 교체.
- 개발 중 공통 렌더러에 선택 갤러리 출력 추가. Hunt a slime의 가로·정사각형 이미지는 원본 비율로 표시하고, 갤러리 2종 및 KO/EN/JA 대체 텍스트·개발 안내 반영.
- 검증: `npm run check` 통과. 홈·프로젝트 목록·Hunt a slime·다른 개발 중 상세 2개·회사 소개 초안의 KO/EN/JA × 1280/390/320px smoke 54조합 통과. 상세 이미지 27개 표시 비율 계측 및 PC·모바일 PNG 직접 확인. 증거: `exports/agent/2026-10-01T15-03-23-914Z-46921/`.


### 2026-10-02 — Hunt a Slime 게임 소개서 반영

- 사용자 제공 원페이저 기반 KO/EN/JA 실제 콘텐츠 제작. 제목·Action RPG·카드·SEO 동기화, 새 소개서에 따라 출시 월을 미확정으로 변경.
- 표준 상세 렌더러 활용, 타이틀 대표·이미지 피처 3개·플레이 흐름·젤라리아 세계관·개발 안내 구성. 원본 비율 유지.
- 공통 렌더러에 선택 이미지 피처·소개 섹션 및 내부 CTA 지원 추가. 개발 소식 버튼은 페이지 하단 안내로 연결.
- 원페이저와 현재 구현 기준은 docs/projects/hunt-a-slime/game-introduction.md에 기록.
- 검증: npm run check 통과. 관련 6경로 × 3언어 × 3폭 smoke 54조합과 최종 상세 9조합 통과. 내부 CTA·소개 섹션·이미지 36개 비율 확인, KO/EN/JA PC·모바일 PNG 직접 확인. 최종 증거: exports/agent/2026-10-01T15-37-09-710Z-83997/.


### 2026-10-02 — Hunt a Slime 기본 상세 레이아웃 복원

- 사용자 피드백 반영: 다른 프로젝트와 동일한 기본 본문/사이드바·텍스트 핵심 포인트 구성. 전용 배치·이미지 피처·추가 소개 섹션·내부 CTA 지원 제거.
- 게임 소개·세계관·개발 안내는 개요, 플레이 흐름·대상 플레이어는 주요 특징에 반영. KO/EN/JA 내용 유지.
- 상세·OG에는 main, 카드에는 preview만 사용. 갤러리 이미지 연결 제거, 원본 파일은 추후 개발용으로 보존.
- 검증: npm run check 통과. Hunt a Slime·ASMR UGC Town·Tower Flood Race·프로젝트 목록의 KO/EN/JA × 1280/390/320px smoke 36조합 통과. 기본 2열/모바일 1열 배치, 상세 main 1장·추가 이미지 및 갤러리 없음 확인. PNG 직접 검토: exports/agent/2026-10-01T15-56-41-314Z-10582/.


### 2026-10-02 — Jumpstart 2026.10.3 진행현황 챕터 추가

- 기존 14장 뒤에 날짜별 챕터 표지와 완료·진행·다음 단계 작성 틀 2장 추가(총 16장), KO/EN 반영.
- 실제 진행 내용은 미제공으로 작성 예정 표시. 전용 모바일 스타일과 문서 추가.
- 검증: `npm run check` 통과. KO/EN × 1280·390·320px smoke 6조합·16장, 실패/경고 0. 추가 슬라이드 PC·모바일 PNG 직접 확인. 증거: `exports/agent/2026-10-01T18-12-13-194Z-29865/`.


### 2026-10-02 — Tomato Splatter 표준 상세 페이지 작성

- 다른 프로젝트와 동일한 공통 표준 상세 레이아웃 적용. KO/EN/JA 개요·핵심 포인트 3개·프로젝트 정보·특징 3개·갤러리 3장 구성.
- 새 프로젝트 이미지의 토마토 몬스터·검과 마법·판타지 배경 콘셉트 반영. 게임 규칙·성장·보상 미확정 안내, 개발 중 상태·2027-02 예정 월 유지.
- 사용자 PNG 5종 보존, 웹용 WebP 사본 생성(640/1200px 이하, 총 약 0.9MB). 카드·상세·OG·회사 소개의 삭제된 JPG 참조 교체. 갤러리 이미지 원본 비율 유지.
- PRD·프로젝트 문서 갱신. 검증: npm run check 통과, 관련 4경로 × 3언어 × 3폭 smoke 36조합 및 최종 상세 9조합 통과(실패·경고 0). 이미지 표시 비율 36개 계측 및 PC·모바일 PNG 직접 확인. 최종 증거: exports/agent/2026-10-01T20-27-55-194Z-57668/.


### 2026-10-02 — Tomato Splatter 스토리·Action RPG 반영

- 사용자 제공 토마토 마왕의 부활·마을 구출·숲/광산/요새 탐험·봉인의 비밀·붉은 정원 스토리를 KO/EN/JA 개요에 적용. 히어로·장르·카드·SEO 동기화.
- Hunt a Slime과 동일한 무리 사냥·전리품 수집·장비와 스킬 성장·분열/합체 몬스터·보스 도전을 토마토 괴물 테마로 반영. 주요 특징에는 플레이 흐름·대상 플레이어 표시.
- 프로젝트 문서·PRD 갱신, 기존 레이아웃·이미지 활용. 영어/일본어 세계관 명칭은 번역 초안으로 기록.
- 검증: npm run check 통과. 관련 상세·홈·목록의 KO/EN/JA × 1280·390·320px smoke 27조합 통과(실패·경고 0), PNG 직접 확인. 증거: exports/agent/2026-10-01T20-34-14-970Z-65213/.


### 2026-10-02 — Jumpstart 진행현황 개발 계획 반영

- 공유 날짜를 사용자 정정에 따라 2026.10.2로 변경. 16장의 작성 틀을 액션 RPG 개발·운영 환경 구축 3단계 계획으로 교체, KO/EN 반영.
- AI 지형·애니메이션·아이템 제작 시스템 → RPG 운영 데이터·노하우 수집 → 고퀄리티 액션 RPG 출시·운영 순서. 단계별 완료 여부와 일정은 추정하지 않음.
- 검증: `npm run check` 통과. KO/EN × 1280·390·320px smoke 6조합·16장, 실패/경고 0. 변경 화면 PNG 직접 확인. 증거: `exports/agent/2026-10-01T20-54-13-093Z-85495/`.


### 2026-10-02 — Jumpstart 1단계 목표 추가

- 개발 계획 뒤에 1단계 목표 슬라이드 추가(총 17장). AI 지형·R15 애니메이션·아이템/UGC 제작 시스템과 기본 전투 환경 구축 목표를 KO/EN으로 반영.
- Enchant a Weapon 대표 이미지 재사용, 전체 이미지와 원본 비율 보존.
- 검증: `npm run check` 통과. KO/EN × 1280·390·320px smoke 6조합·17장, 실패/경고 0. 새 슬라이드 PC·모바일 PNG 직접 확인. 증거: `exports/agent/2026-10-01T20-59-44-395Z-90984/`.


### 2026-10-02 — Jumpstart 2단계 목표 추가

- 1단계 뒤에 RPG 운영 데이터·노하우, 콘텐츠 소진 속도, 이벤트, 커뮤니티, 운영 지표, 운영 주기 및 시스템 구축의 6개 목표 추가(총 18장). KO/EN 반영.
- PC 2열·모바일 1열, 구체적인 지표 수치와 운영 기간은 추정하지 않음.
- 검증: `npm run check` 통과. KO/EN × 1280·390·320px smoke 6조합·18장, 실패/경고 0. 새 슬라이드 PC·모바일 PNG 직접 확인. 증거: `exports/agent/2026-10-01T21-01-50-386Z-93737/`.


### 2026-10-02 — Jumpstart 2·3단계 이미지 및 3단계 목표 반영

- 2단계에 Hunt a Slime 대표 이미지 추가. 3단계 목표를 19장으로 추가해 AI 기반 고품질 콘텐츠 업데이트 시스템·짧은 주기 업데이트·시즌 이벤트·이슈에 따른 이벤트를 KO/EN 반영.
- 3단계 Tomato Splatter 대표 이미지 재사용. 두 이미지 모두 전체 영역과 원본 비율 보존.
- 검증: `npm run check` 통과. KO/EN × 1280·390·320px smoke 6조합·19장, 실패/경고 0. 2·3단계 PC·모바일 PNG 직접 확인, 영어 모바일 목표 번호 줄바꿈 보완 후 재검증. 증거: `exports/agent/2026-10-01T21-08-21-466Z-1246/`.


### 2026-10-02 — Jumpstart 출시 일정·개발 진척도 추가

- 사용자 제공 현황을 17~19장 프로젝트 이미지 아래에 KO/EN 표시. Enchant a Weapon 2026년 10월 중·60%, Hunt a Slime 2026년 11월 말·25%, Tomato Splatter 2027년 2월·5%.
- 기준일과 출처를 Jumpstart 문서에 기록.
- 검증: `npm run check` 통과. KO/EN × 1280·390·320px smoke 6조합·19장, 실패/경고 0. 변경 3장 및 모바일 PNG 직접 확인. 증거: `exports/agent/2026-10-01T21-48-46-622Z-30290/`.


### 2026-10-02 — Jumpstart 16장 프로젝트·월간 타임라인 추가

- 3단계 카드에 출시 프로젝트명을 추가. 2026.09~2027.02 월간 타임라인에 프로젝트별 색상과 출시 예정 월·개발 진척도 60%/25%/5% 표시.
- 막대는 월 칸 안의 개발 진척도이며 개발 기간·시작일·미래 진척도를 추정하지 않음.
- 검증: `npm run check` 통과. KO/EN × 1280·390·320px smoke 6조합·19장, 실패/경고 0. 16장 PC·모바일 PNG 직접 확인. 증거: `exports/agent/2026-10-01T21-59-29-614Z-37662/`.


### 2026-10-02 — Jumpstart Roblox 연구 적용 실험 요약

- 사용자 제공 연구 문서를 보존하고 마지막 20장에 3D 생성·메시 최적화·캐릭터 셋업·월드 최적화의 적용 시도를 KO/EN으로 요약.
- 공개 논문/공식 발표 6종 확인 후 직접 출처 링크 연결. 적용 실험과 검토 상태를 구분하고 완료·개선 실적은 주장하지 않음.
- 검증: `npm run check` 통과. KO/EN × 1280·390·320px smoke 6조합·20장, 실패/경고 0. 마지막 슬라이드 PC·모바일 PNG 직접 확인. 증거: `exports/agent/2026-10-01T22-05-09-173Z-41709/`.


### 2026-10-02 — Jumpstart 16장 공통 시작일·현재 진척도 수정

- 세 프로젝트 모두 2026년 9월 시작으로 수정. 출시 예정까지 기간 막대와 10월 2일 공통 위치의 현재 진척도 배지(60%/25%/5%)를 구분.
- 단계별 카드 우상단에 프로젝트 대표 이미지 원본 비율로 추가, KO/EN 반영.
- 검증: `npm run check` 통과. KO/EN × 1280·390·320px smoke 6조합·20장, 실패/경고 0. 변경 화면 PC·모바일 PNG 직접 확인. 증거: `exports/agent/2026-10-01T22-21-24-178Z-53374/`.


### 2026-10-02 — Jumpstart 20장 BibTeX 서지 형식 변경

- 링크 버튼을 제거하고 연구별 6개 카드(PC 3열·모바일 1열)에 적용 시도와 BibTeX 저자·제목·연도 표시. 참고 원문 링크는 문서에 보존.
- 카드 크기·글자·간격을 서지 정보에 맞게 조정. KO/EN 반영.
- 검증: `npm run check` 통과. KO/EN × 1280·390·320px smoke 6조합·20장, 실패/경고 0. 변경 화면 PC·모바일 PNG 직접 확인. 증거: `exports/agent/2026-10-01T22-21-24-178Z-53374/`.


### 2026-10-02 — Jumpstart 17장 완료 상태 표시

- 사용자 제공 상태 반영: 01·02·04 녹색 텍스트 및 완료 표기, 03 진행 중. KO/EN 상태 문구 추가.
- 검증: `npm run check` 통과. KO/EN × 1280·390·320px smoke 6조합·20장 통과. 17장 PC·모바일 PNG 직접 확인. 증거: `exports/agent/2026-10-01T22-28-39-851Z-58897/`.


### 2026-10-02 — Jumpstart 18장 목표 통합·추가

- 기존 운영 목표 6개를 데이터 분석·이벤트/커뮤니티 운영·운영 시스템 3개로 통합. 디아블로2 드랍 시스템 완료(녹색), 스토리 콘텐츠 진행 중 추가. KO/EN 총 5개 목표.
- 검증: `npm run check` 및 KO/EN × 1280·390·320px smoke 6조합·20장 통과. 18장 PC·모바일 PNG 직접 확인. 증거: `exports/agent/2026-10-01T22-32-38-280Z-61588/`.


### 2026-10-02 — Jumpstart 16~20장 영문 맥락 검토

- 한국어 대조 후 운영·개발 목표 표현 교정. 콘텐츠 소진 속도 명확화, Diablo II-style 표기, 연구 적용 실험을 완전한 현재 시제 문장으로 수정. 서지·일정·상태 유지.
- 검증: `npm run check` 및 KO/EN × 1280·390·320px smoke 6조합·20장 통과. 16~20장 영문 PC·모바일 PNG 확인, 20장 카드 여백 보완. 증거: `exports/agent/2026-10-01T22-36-26-413Z-64884/`.


### 2026-10-02 — Jumpstart 20장 연구 노트 구성

- BibTeX·6카드 그리드를 제거하고 발표 연도와 제목 6개를 1열로 정리. KO 번역 제목·EN 원문 제목, 적용 실험 설명 유지. PC 한 줄·모바일 자연 줄바꿈.
- 검증: `npm run check` 및 KO/EN × 1280·390·320px smoke 6조합·20장 통과. 20장 PC·모바일 PNG 직접 확인. 증거: `exports/agent/2026-10-01T22-44-21-563Z-70611/`.


### 2026-10-02 — Jumpstart 20장 적용 연구 분야 분류

- 1열 노트에 3D 에셋·지형 제작 / NPC·캐릭터 제작 / 3D 모델 최적화 / 월드·배경 최적화 분류를 KO/EN 추가. 제목·연도·실험 상태 유지.
- 검증: `npm run check` 및 KO/EN × 1280·390·320px smoke 6조합·20장 통과. 20장 PC·모바일 PNG 직접 확인. 증거: `exports/agent/2026-10-01T22-49-22-597Z-74204/`.

- 2026-10-03: Hunt a Slime 공유 이미지 경로를 `assets/www-hunt-a-slime/`로 변경. 홈페이지 카드·상세·OG, company-intro·jumpstart 발표 및 관련 문서 반영.

- 2026-10-03: Hunt a Slime의 카드 정보·링크·KO/EN/JA 상세·SEO·발표 소개를 이미지 옆 `shared/assets/www-hunt-a-slime/content.json`으로 통합. 운영 설정과 수집 지표는 기존 레지스트리에 유지하고 빌드가 카드 데이터·초기 SEO·발표 문구·이미지 경로를 생성. 상세 JS는 기존 ProjectDetailReady 방식의 JSON 로더로 변경. 다른 프로젝트·발표 상태·공유 URL 유지.
- 검증: `npm run check` 5개 테스트, `npm run agent:test` 4개 테스트, 홈·Roblox 목록·상세·company-intro·jumpstart smoke 42조합 통과. 이전 카드 정보·지표·상세 번역·발표 사전과 동일함을 비교 검증. 관련 PNG 직접 확인. 증거: `exports/agent/2026-10-03T08-53-37-969Z-34648/`. Windows 테스트 디렉터리 링크는 junction으로 생성해 기존 권한 오류 해결.

- 2026-10-03: ASMR UGC Town의 대표·프리뷰·갤러리 3장 경로를 `assets/www-asmr-ugc-town/`로 변경. 이미지 옆 `content.json`으로 카드 정보·링크·KO/EN/JA 상세·SEO·회사 소개 문구를 이전하고 Hunt a Slime의 공통 빌드·로더 연결을 재사용. 운영 설정·지표·출시 일정·공유 URL 유지.
- 검증: `npm run check` 통과, 홈·Roblox 목록·ASMR 상세·회사 소개 KO/EN/JA × 1280·390·320px smoke 36조합 통과. 기존 정보·지표·상세 및 발표 번역과 이미지 5개의 동일성 확인. 모바일 상세와 영어 발표 PNG 직접 확인. 증거: `exports/agent/2026-10-03T09-34-44-794Z-2444/`.
