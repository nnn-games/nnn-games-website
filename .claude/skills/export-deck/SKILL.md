---
name: export-deck
description: 웹 슬라이드 덱을 슬라이드별 PNG 와 언어별 PDF 로 내보낸다. 로컬(Playwright) 또는 GitHub Actions(Export decks 워크플로)로 실행하고, 결과물은 저장소에 커밋하지 않는다. "덱 PDF 만들어줘", "슬라이드 이미지로 뽑아줘", "제안서 파일로 보내야 해" 요청에 사용.
---

# 덱 내보내기 절차

인자: `$ARGUMENTS` (덱 slug, 언어, PDF/PNG 여부. 비우면 전체 덱·전체 언어·둘 다)

## 0. 사전 확인
- `decks/decks.json`에서 대상이 `archived`가 아닌지 확인한다. archived 덱은 빌드에 없으므로 내보낼 수 없다(필요하면 `/archive-deck`으로 `draft` 전환 후).
- 최신 지표를 인용하는 덱이면 내보내기 전에 `shared/data`가 최신인지(`metrics.updatedAt`) 사용자에게 알린다.
- 결과물(`exports/`)은 git 에 추가하지 않는다. `.gitignore`에 있다.

## 1. 로컬 실행
```
npx playwright install chromium        # 최초 1회
npm run export:deck -- jumpstart --lang ko,en
npm run export:deck                    # 전체 덱, 전체 언어
```
- 출력: `exports/decks/<slug>/<slug>-<lang>.pdf`, `exports/decks/<slug>/<lang>/<nn>-<slide-id>.png`, `manifest.json`
- 옵션: `--pdf-only`, `--png-only`, `--out <dir>`

## 2. CI 실행 (권장: 사용자에게 파일을 전달할 때)
```
gh workflow run export-decks.yml -f slugs="jumpstart" -f langs="ko,en"
gh run watch
```
- 완료 후 Actions 실행 페이지의 `deck-exports-<n>` 아티팩트(zip)를 내려받는다. 보존 30일.
- 오래 보관해야 하면 사용자에게 Release 첨부를 제안한다. 저장소에 PDF 를 커밋하지 않는다.

## 3. 결과 확인
- PDF 페이지 수 = 슬라이드 수(부록 포함)인지, 첫 페이지와 마지막 페이지가 잘리지 않았는지 확인한다.
- PNG 는 1280×720. 글자 겹침·이미지 누락이 보이면 해당 슬라이드 id 를 `/update-deck` 작업으로 넘긴다.
- 폰트는 Google Fonts 를 네트워크에서 받는다. 오프라인이면 대체 폰트로 렌더되므로 보고에 명시한다.

## 보고
생성된 파일 목록(경로, 슬라이드 수, 언어), 실행 방식(로컬/CI, 아티팩트 링크), 확인한 이상 유무.
