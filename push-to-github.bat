@echo off
echo ========================================
echo PUSH MATH CLUB GAME TO GITHUB
echo ========================================
echo.

REM Thay YOUR_GITHUB_USERNAME và YOUR_REPO_NAME bang thong tin cua ban
set GITHUB_USERNAME=YOUR_GITHUB_USERNAME
set REPO_NAME=YOUR_REPO_NAME

echo Initializing Git repository...
git init

echo Adding all files...
git add .

echo Creating first commit...
git commit -m "Initial commit: Math Club Trung Thu Game"

echo Connecting to GitHub...
git remote add origin https://github.com/%GITHUB_USERNAME%/%REPO_NAME%.git

echo Pushing to GitHub...
git branch -M main
git push -u origin main

echo.
echo ========================================
echo DONE! Your code is now on GitHub!
echo ========================================
pause
