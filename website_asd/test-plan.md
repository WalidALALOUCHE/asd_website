# Website Testing and Fix Plan

## 1. Critical Issues Identified

### Missing Assets Directory
- PROBLEM: `assets` directory is missing, which contains images referenced in HTML files
- FIX: Create the `assets` directory structure with required subdirectories

### Script Loading Order
- PROBLEM: Some pages have scripts loading in different orders
- FIX: Standardize script loading order in all HTML files

### CSS Variables Consistency
- PROBLEM: CSS uses a mix of hardcoded colors and variables
- FIX: Ensure all CSS files use the same color variables

### Header Class Mismatch
- PROBLEM: `components.js` targets `header` but the element class is `main-header`
- FIX: Update selectors in JavaScript files to match HTML classes

## 2. Testing and Fix Steps

### Step 1: Create Missing Assets Structure
```bash
mkdir -p assets/images
mkdir -p assets/images/logos
mkdir -p assets/images/debaters
mkdir -p assets/images/editions
mkdir -p assets/images/team
mkdir -p assets/images/partners
mkdir -p assets/images/gallery/2024
```

### Step 2: Provide Placeholder Images
- Create or download placeholder images for:
  - logo.png
  - hero1.jpg
  - cofounder1.jpg and cofounder2.jpg
  - debaters/placeholder.jpg
  - logos for partners

### Step 3: Fix Component Loading
- Update `js/components.js` to correctly handle the current HTML structure:
```javascript
// Fix header selector
function handleHeaderScroll() {
    const header = document.querySelector('.main-header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
}
```

### Step 4: Standardize Script Loading Order
For all HTML files, ensure scripts are loaded in this order:
```html
<script src="js/components.js"></script>
<script src="js/data-loader.js"></script>
<script src="js/main.js"></script>
<!-- Page-specific scripts -->
```

### Step 5: Update data-loader.js to Use JSON
- Modify `data-loader.js` to fetch data from `website.json` instead of using hardcoded data

### Step 6: CSS Consistency Check
- Review all CSS files to ensure they use the same color scheme
- Replace hardcoded colors with CSS variables

### Step 7: Test Page by Page
1. **Home Page (index.html)**
   - Verify header and footer load
   - Check that hero images load
   - Verify statistics counter works

2. **Debaters Page (debaters.html)**
   - Verify images load
   - Test carousel functionality
   - Test edition switching

3. **Reservation Page (reservation.html)**
   - Test seat selection
   - Verify form steps work
   - Check payment options

4. **Jury Reservation (jury-reservation.html)**
   - Test form validation
   - Verify file upload preview

### Step 8: Test Responsive Design
- Test on multiple screen sizes:
  - Desktop (1200px+)
  - Tablet (768px - 1199px)
  - Mobile (<768px)

### Step 9: Test Language Switching
- Verify that language switching works on all pages
- Check that all translated content displays correctly

## 3. Console Error Testing

Create a simple test script to log errors:

```javascript
// Add to components.js at the top
window.addEventListener('error', function(e) {
    console.error('Global error: ', e.message, ' at ', e.filename, ':', e.lineno);
});

// Add to the end of each page load
console.log('Page fully loaded');
```

## 4. Performance Testing

- Use browser dev tools to check load times
- Identify any slow-loading resources
- Optimize image sizes if needed

## 5. Implementation Checklist

For each page:
- [ ] HTML structure is valid
- [ ] CSS is properly applied
- [ ] JavaScript executes without errors
- [ ] Assets load correctly
- [ ] Responsive design works
- [ ] Language switching functions properly
- [ ] Forms validate correctly
- [ ] Navigation works between pages

## 6. Data Consistency

- Update contact information in footer to match website.json
- Ensure social media links point to correct URLs
- Verify all data attributes for language switching are present

## 7. Browser Testing

Test on:
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge 