@echo off
setlocal enabledelayedexpansion

echo [1/2] update:metrics
call npm run update:metrics
if errorlevel 1 (
  echo update:metrics failed.
  exit /b 1
)

echo [2/2] build:css
call npm run build:css
if errorlevel 1 (
  echo build:css failed.
  exit /b 1
)

echo Done.
exit /b 0
