# 개발·운영 도구

명령은 저장소 루트에서 실행합니다. 홈페이지와 발표자료는 같은 개발 서버·빌드·배포를 사용합니다.

| 파일 | 명령 / 역할 |
| --- | --- |
| `build.js` | `npm run dev`, `build`, `serve`: 빌드·감시·서버 |
| `check-i18n.js`, `check-links.js`, `check-data.js` | `npm run check`: 번역·배포 경로·데이터 검증 |
| `update-metrics.js` | `npm run update:metrics`: 지표 수집 |
| `snapshot.js` | `npm run snapshot`: 화면 캡처 |
| `export-deck.js` | `npm run export:deck`: 발표 PNG·PDF |
| `audit.js` | `npm run audit`: 점검 보고서 |
| `optimize-images.js` | `npm run optimize:images -- <files>`: 이미지 압축 |
| `lib/` | 스크립트 공통 함수 |
| `tests/` | 빌드·발표 상태 회귀 검증 (`npm run check`에 포함) |

Windows에서 `update-metrics-and-build.bat`를 실행하면 저장소 루트로 이동하여 `npm run build:all`을 실행합니다. 내보내기·점검 결과는 `exports/`, 배포 결과는 `dist/`에 생성됩니다.
