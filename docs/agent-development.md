# 에이전트 개발환경

조사·설정 기준일: **2026-10-01 (Asia/Seoul)**. 회사 홈페이지와 웹 발표자료를 같은 저장소·빌드·배포에서 개발하기 위한 환경입니다.

## 공식 자료에서 확인한 방향

OpenAI는 소프트웨어 개발용 에이전트로 Codex를 제공하고, CLI·IDE·앱 등에서 저장소를 연결해 작성·검토·디버깅하도록 안내합니다. 이 프로젝트에서는 현재 설치된 Codex 클라이언트를 사용합니다. 웹사이트에서 에이전트를 서비스하는 기능이 필요한 경우에만 Agents API·SDK 같은 별도 애플리케이션 런타임을 검토합니다. [Code generation](https://developers.openai.com/api/docs/guides/code-generation), [Agent runtime 비교](https://developers.openai.com/api/docs/guides/agents).

| 확인한 공식 자료                                                                    | 이 저장소에 적용한 내용                                                    |
| ----------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| [Codex Best practices](https://learn.chatgpt.com/guides/best-practices)             | 작업 맥락·완료 조건을 규칙과 스킬에 담고 빌드·실제 동작·화면 증거로 검증   |
| [AGENTS.md](https://learn.chatgpt.com/docs/agent-configuration/agents-md)           | 루트 `AGENTS.md`를 공통 지침으로 사용, Claude 지침은 이 파일을 참조        |
| [Build skills](https://learn.chatgpt.com/docs/build-skills)                         | 프로젝트 스킬 12개를 `.agents/skills/`에 두고 필요한 작업에서만 읽음       |
| [Config basics](https://learn.chatgpt.com/docs/config-file/config-basic)            | `.codex/config.toml`에 프로젝트 설정만 저장하고 개인 모델·계정·권한은 상속 |
| [Docs MCP](https://developers.openai.com/learn/docs-mcp)                            | OpenAI 공식 문서를 검색·조회하는 읽기 전용 MCP 연결                        |
| [Local environments](https://learn.chatgpt.com/docs/environments/local-environment) | 새 워크트리에서 재사용할 설치·브라우저·빌드 명령 제공                      |
| [Git worktrees](https://learn.chatgpt.com/docs/environments/git-worktrees)          | 동시에 다른 변경을 진행할 때 작업 폴더와 생성 결과 분리                    |

모델은 계정과 클라이언트에서 선택한 설정을 유지합니다. 공식 가이드는 현재 GPT-6.1 Sol을 사용 가능한 계정에서 권장합니다. 계정별 가용성은 이 저장소 설정으로 보장하지 않습니다. [현재 권장과 추론 수준](https://learn.chatgpt.com/guides/best-practices#strong-first-use-context-and-prompts).

## 빠른 시작

```bash
npm run agent:setup
npm run dev
```

`agent:setup`은 `npm ci`로 lockfile 의존성을 설치하고 Chromium을 준비한 뒤 빌드와 환경 진단을 수행합니다. Node.js 20 이상이며 CI와 버전을 맞출 때는 22를 사용합니다. 이미 설치한 의존성을 유지하려면 `npm run agent:setup -- --skip-install`을 사용합니다. Linux에서 브라우저 시스템 라이브러리도 설치해야 하는 환경은 `--with-deps`, 브라우저 없이 정적 검증만 준비하는 환경은 `--skip-browser`를 사용할 수 있습니다.

```bash
npm run agent:doctor
npm run check
npm run agent:smoke -- --pages /,/projects-roblox.html
npm run agent:check
```

CLI·IDE·앱의 새 세션에서 프로젝트를 열면 지침과 공용 스킬을 발견합니다. `.codex/config.toml`은 trusted 프로젝트에서 적용됩니다. 이 설정은 현재 세션의 권한이나 개인 설정을 덮어쓰지 않습니다. 공식 문서 MCP는 다음 세션에서 `/mcp` 또는 `codex mcp list`로 확인할 수 있습니다. [설정 로드 조건](https://learn.chatgpt.com/docs/config-file/config-basic), [MCP 연결](https://learn.chatgpt.com/docs/extend/mcp).

Codex 앱에서 워크트리 자동 준비를 사용할 경우 Local environment의 setup script에 `npm run agent:setup`을 지정하고, Run action에는 `npm run dev`, 검증 action에는 `npm run agent:check`를 지정합니다. 앱 전용 환경 파일은 공식 안내대로 앱 Settings에서 생성합니다. CLI에서도 같은 npm 명령을 사용할 수 있습니다. [앱 환경 설정](https://learn.chatgpt.com/docs/environments/local-environment).

## 하네스 구성

여기서 프로젝트 하네스는 Codex가 실행할 수 있는 준비·생성·검증 도구를 뜻합니다. 모델·도구 루프는 Codex 클라이언트가 담당하고, 아래 명령은 프로젝트의 결과를 확인합니다.

| 명령           | 수행 내용                                                                     |
| -------------- | ----------------------------------------------------------------------------- |
| `agent:setup`  | lockfile 설치, Chromium, 빌드, 진단                                           |
| `agent:doctor` | Node, 개발 패키지, 지침·스킬, Chromium 실제 실행, 선택적 CLI 버전 확인        |
| `deck:new`     | 안전한 새 덱 골격·다국어 UI·draft 등록·원고 폴더 생성                         |
| `check`        | 기존 빌드·i18n·링크·데이터·lint·상태별 배포 회귀 검사                         |
| `agent:test`   | 덱 생성·중복 거부·출력 경로·브라우저 오류 탐지 회귀 검사                      |
| `agent:smoke`  | 임시 빌드로 실제 페이지와 슬라이드를 열고 동작·이미지·오류·넘침·스크린샷 검사 |
| `agent:check`  | `check` → `agent:test` → `agent:doctor` → `agent:smoke`                       |
| `export:deck`  | 최신 소스로 발표 PNG·PDF 생성, 명시한 draft도 상태 변경 없이 지원             |

`agent:smoke`와 `export:deck`은 각자 `tmp/` 아래에 빌드하고 임의 로컬 포트를 사용합니다. 운영 `dist/`나 켜 둔 개발 서버를 덮어쓰지 않습니다. 운영 빌드는 active만 포함하며 초안 일회성 빌드는 `--out tmp/<폴더> --include-drafts`에서만 허용합니다.

## 사이트 개발

```text
$site-development 홈페이지 프로젝트 필터를 개선하고 KO/EN/JA와 모바일 화면까지 검증해줘.
$add-project 제공한 프로젝트 기획서를 바탕으로 새 상세 페이지를 작성해줘.
$update-project ASMR UGC Town의 설명과 갤러리를 수정해줘.
```

일반적인 한국어 요청도 스킬의 설명과 맞으면 자동으로 선택할 수 있습니다. 홈페이지는 partials·Tailwind·공통 렌더러를 재사용하고, 문구와 메타는 세 언어를 함께 맞춥니다.

```bash
npm run agent:smoke -- --pages /,/projects-roblox.html,/asmr-ugc-town.html
```

## 덱 작성

```text
$new-deck 프로젝트 기획서를 사용해 퍼블리셔에게 보여줄 KO/EN 웹 덱을 만들어줘.
$update-deck jumpstart의 핵심 메시지를 다듬고 모든 슬라이드를 검증해줘.
$browser-qa company 덱의 언어 전환, 모바일 배치와 PDF 인쇄를 확인해줘.
```

필요하면 생성 도구를 직접 실행할 수 있습니다.

```bash
npm run deck:new -- partner-proposal --title "파트너 제안" --langs ko,en --audience partner
npm run agent:smoke -- --pages /partner-proposal/
npm run export:deck -- partner-proposal --lang ko,en
```

골격은 공통 런타임을 사용하는 표지·핵심 메시지·다음 단계 3장으로 시작합니다. 본문은 작성 안내이고 제목은 입력값을 공통으로 넣으므로 실제 내용과 제목 번역으로 바꿔야 합니다. 내용에 맞춰 장수와 디자인을 발전시킵니다. 공개 전환은 사용자의 요청에 따라 status를 active로 바꾸면 됩니다.

## 브라우저 검사와 증거

기본 경로는 홈·목록·문의·운영 중/개발 중 상세 예시·모든 active/draft 덱입니다. 기본 언어는 KO/EN/JA, 화면 폭은 1280·390·320px이며 덱은 등록된 언어만 검사합니다.

- 사이트: 언어 전환·모바일 메뉴·목록 필터, JS 예외, 로컬 요청 오류, 이미지 실패, 가로 넘침.
- 덱: 모든 활성 슬라이드의 순서·이전/다음·키보드·해시 딥링크·새로고침, 언어 전환·지원되는 전체화면·인쇄 노출, 슬라이드 영역 잘림.
- 결과: `exports/agent/<실행>/report.json`과 페이지·슬라이드별 PNG. 실패가 있으면 종료 코드 1, 외부 요청 실패는 warnings에 기록.

```bash
npm run agent:smoke -- --pages /company/ --lang ko,en,ja --widths 1280,390,320
npm run agent:smoke -- --offline
```

`--offline`은 외부 요청을 차단하고 대체 폰트로 검사합니다. 폰트가 바뀌면 배치가 달라질 수 있으므로 최종 디자인은 정상 네트워크에서도 PNG를 직접 확인합니다. 자동 검사는 의미·번역 품질·글자 겹침·디자인 의도까지 판정하지 않습니다.

PR preview 워크플로는 기존 검사·스크린샷에 하네스 회귀 테스트와 KO 브라우저 검증을 추가하고 보고서·화면 증거를 아티팩트로 보관합니다. 로컬 전체 검증은 `agent:check`를 사용합니다.

## 스킬 목록과 관리

| 스킬                                 | 작업                                |
| ------------------------------------ | ----------------------------------- |
| `site-development`                   | 홈페이지 UI·공통 코드·스타일·다국어 |
| `add-project`, `update-project`      | 프로젝트 등록·설명·링크·이미지      |
| `activate-project`, `retire-project` | 프로젝트 출시·중단·종료             |
| `refresh-metrics`                    | 공식 공개 API 지표 갱신             |
| `new-deck`, `update-deck`            | 웹 덱 생성·원고·스타일·수정         |
| `archive-deck`, `export-deck`        | 덱 상태 전환·PNG/PDF                |
| `browser-qa`                         | 실제 브라우저 오류 재현·화면 검증   |
| `audit-site`                         | 운영 상태 점검                      |

실제 스킬 파일은 `.agents/skills/` 한 곳에 둡니다. `.claude/skills/<name>`은 같은 폴더를 가리키는 호환 링크이며 별도 사본을 관리하지 않습니다. 공통 작업 지침은 `AGENTS.md`, 긴 작업의 계획 형식은 [agent-plans.md](agent-plans.md)입니다. 반복되는 실수가 확인되면 관련 지침·스킬·회귀 검사 중 알맞은 곳에 좁게 반영합니다.
