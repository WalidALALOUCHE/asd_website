@echo off
echo Creating assets directory structure...

mkdir assets\images
mkdir assets\images\logos
mkdir assets\images\debaters
mkdir assets\images\editions
mkdir assets\images\team
mkdir assets\images\partners
mkdir assets\images\gallery\2024

echo Directory structure created!
echo Creating placeholder images...

REM Create a placeholder logo
echo ^<svg xmlns="http://www.w3.org/2000/svg" width="200" height="60"^>^<rect width="200" height="60" fill="#000000"/^>^<text x="100" y="30" font-family="Arial" font-size="20" fill="#FFD700" text-anchor="middle" dominant-baseline="middle"^>All-Star Debate^</text^>^</svg^> > assets\images\logo.svg

REM Create placeholder for hero image
echo ^<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800"^>^<rect width="1200" height="800" fill="#1a1a1a"/^>^<text x="600" y="400" font-family="Arial" font-size="60" fill="#FFD700" text-anchor="middle" dominant-baseline="middle"^>Hero Image^</text^>^</svg^> > assets\images\hero1.svg

REM Create placeholder for cofounders
echo ^<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300"^>^<rect width="300" height="300" fill="#2a2a2a"/^>^<text x="150" y="150" font-family="Arial" font-size="24" fill="#FFD700" text-anchor="middle" dominant-baseline="middle"^>Walid Alalouche^</text^>^</svg^> > assets\images\cofounder1.svg
echo ^<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300"^>^<rect width="300" height="300" fill="#2a2a2a"/^>^<text x="150" y="150" font-family="Arial" font-size="24" fill="#FFD700" text-anchor="middle" dominant-baseline="middle"^>Marouane Benkerroum^</text^>^</svg^> > assets\images\cofounder2.svg

REM Create placeholder for debaters
echo ^<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300"^>^<rect width="300" height="300" fill="#2a2a2a"/^>^<text x="150" y="150" font-family="Arial" font-size="24" fill="#FFD700" text-anchor="middle" dominant-baseline="middle"^>Debater^</text^>^</svg^> > assets\images\debaters\placeholder.svg

REM Create placeholders for editions
echo ^<svg xmlns="http://www.w3.org/2000/svg" width="400" height="225"^>^<rect width="400" height="225" fill="#2a2a2a"/^>^<text x="200" y="112" font-family="Arial" font-size="32" fill="#FFD700" text-anchor="middle" dominant-baseline="middle"^>1st Edition^</text^>^</svg^> > assets\images\editions\edition1.svg
echo ^<svg xmlns="http://www.w3.org/2000/svg" width="400" height="225"^>^<rect width="400" height="225" fill="#2a2a2a"/^>^<text x="200" y="112" font-family="Arial" font-size="32" fill="#FFD700" text-anchor="middle" dominant-baseline="middle"^>2nd Edition^</text^>^</svg^> > assets\images\editions\edition2.svg

echo Placeholder images created!
echo.
echo NOTE: These are SVG placeholder images. 
echo To convert them to PNG, use an online converter or image editing software.
echo.
echo Setup complete! 