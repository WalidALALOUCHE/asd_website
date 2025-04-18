@echo off
echo ========================================
echo All-Star Debate Website Fix Script
echo ========================================
echo.

echo Step 1: Setting up assets directory and placeholder images...
call setup-assets.bat
echo.

echo Step 2: Checking script loading order...
echo Verifying index.html...
find "components.js" index.html > nul
if %errorlevel% neq 0 (
    echo WARNING: index.html may be missing components.js reference
) else (
    echo index.html includes components.js - OK
)

find "data-loader.js" index.html > nul
if %errorlevel% neq 0 (
    echo WARNING: index.html may be missing data-loader.js reference
) else (
    echo index.html includes data-loader.js - OK
)

echo.
echo Step 3: Opening test page...
echo You can now open test.html in your browser to check if components and assets are loading correctly.
echo.

echo Step 4: Website data...
echo Website data has been updated with new co-founders information and Youtube links.
echo.

echo Step 5: Debaters data...
echo Debaters information for the 2nd edition has been added.
echo.

echo ========================================
echo NEXT STEPS:
echo ========================================
echo 1. Open test.html in your browser to check component loading
echo 2. Run index.html through a local web server to test the entire site
echo 3. Check browser console for any JavaScript errors
echo 4. Verify that all pages display correctly with the new color scheme
echo 5. Test language switching functionality
echo.
echo For a full list of fixes applied, refer to test-plan.md
echo ========================================

pause 