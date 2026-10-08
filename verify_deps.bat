@echo off
echo =========================================
echo DeepShield Dependencies Verification
echo =========================================

echo.
echo [1] Checking FFmpeg
ffmpeg -version >nul 2>&1
IF %ERRORLEVEL% EQU 0 (
    echo [OK] ffmpeg is available
) ELSE (
    echo [ERROR] ffmpeg is NOT available in PATH
)

echo.
echo [2] Checking FFprobe
ffprobe -version >nul 2>&1
IF %ERRORLEVEL% EQU 0 (
    echo [OK] ffprobe is available
) ELSE (
    echo [ERROR] ffprobe is NOT available in PATH
)

echo.
echo [3] Checking yt-dlp
IF EXIST "backend\venv\Scripts\yt-dlp.exe" (
    echo [OK] yt-dlp is available in backend venv
    backend\venv\Scripts\yt-dlp.exe --version
) ELSE (
    echo [ERROR] yt-dlp is NOT installed in backend\venv
)

echo.
echo =========================================
pause
