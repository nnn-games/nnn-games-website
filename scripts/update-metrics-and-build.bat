@echo off
pushd "%~dp0.."
call npm run build:all
set "BUILD_RESULT=%errorlevel%"
popd
exit /b %BUILD_RESULT%
