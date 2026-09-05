@echo off
setlocal enabledelayedexpansion
title Parotta Layer Counter

echo ===================================================
echo     PAROTTA LAYER COUNTER
echo     TinkerHub Useless Projects 3.0
echo ===================================================
echo.

set PATH=C:\Program Files\nodejs;%APPDATA%\npm;%LOCALAPPDATA%\Microsoft\WindowsApps;%PATH%

if exist .venv\Scripts\python.exe (
    set PY_EXEC=.venv\Scripts\python.exe
) else (
    set PY_EXEC=py
)

echo Starting backend and frontend...
%PY_EXEC% run_app.py

pause
