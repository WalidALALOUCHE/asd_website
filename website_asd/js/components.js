// Function to load header and footer components
async function loadComponents() {
    try {
        // Load header and footer
        const response = await fetch('components/header-footer.html');
        const html = await response.text();
        
        // Create temporary container
        const tempContainer = document.createElement('div');
        tempContainer.innerHTML = html;
        
        // Get header and footer elements
        const header = tempContainer.querySelector('.main-header');
        const footer = tempContainer.querySelector('.main-footer');
        
        // Insert header at the beginning of body
        document.body.insertBefore(header, document.body.firstChild);
        
        // Insert footer at the end of body
        document.body.appendChild(footer);
        
        // Initialize components
        initializeHeader();
        initializeFooter();
        
    } catch (error) {
        console.error('Error loading components:', error);
    }
}

// Function to initialize header functionality
function initializeHeader() {
    // Update active navigation link
    updateActiveNavLink();
    
    // Initialize language switcher
    initializeLanguageSwitcher();
    
    // Initialize auth state
    initializeAuthState();
    
    // Add scroll effect
    window.addEventListener('scroll', handleHeaderScroll);
}

// Function to initialize footer functionality
function initializeFooter() {
    // Initialize newsletter form
    initializeNewsletterForm();
    
    // Initialize social links
    initializeSocialLinks();
}

// Function to update active navigation link
function updateActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href').split('/').pop();
        if (linkPage === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Function to initialize language switcher
function initializeLanguageSwitcher() {
    const langButtons = document.querySelectorAll('.lang-btn');
    const currentLang = localStorage.getItem('language') || 'en';
    
    // Set initial active language
    langButtons.forEach(btn => {
        if (btn.dataset.lang === currentLang) {
            btn.classList.add('active');
        }
    });
    
    // Add click handlers
    langButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.dataset.lang;
            localStorage.setItem('language', lang);
            
            // Update active state
            langButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Trigger language change event
            window.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: lang } }));
        });
    });
}

// Function to initialize auth state
function initializeAuthState() {
    const userMenu = document.querySelector('.user-menu');
    const loginLinks = document.querySelectorAll('.login-link, .register-link');
    const logoutLink = document.querySelector('.logout-link');
    const usernameSpan = document.querySelector('.username');
    
    // Check if user is logged in
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (user) {
        // User is logged in
        userMenu.style.display = 'block';
        loginLinks.forEach(link => link.style.display = 'none');
        if (usernameSpan) usernameSpan.textContent = user.username;
        
        // Add logout handler
        if (logoutLink) {
            logoutLink.addEventListener('click', (e) => {
                e.preventDefault();
                localStorage.removeItem('user');
                window.location.reload();
            });
        }
    } else {
        // User is not logged in
        userMenu.style.display = 'none';
        loginLinks.forEach(link => link.style.display = 'block');
    }
}

// Function to handle header scroll effect
function handleHeaderScroll() {
    const header = document.querySelector('.main-header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
}

// Function to initialize newsletter form
function initializeNewsletterForm() {
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = newsletterForm.querySelector('input[type="email"]').value;
            
            try {
                // Here you would typically send the email to your backend
                console.log('Subscribing email:', email);
                alert('Thank you for subscribing to our newsletter!');
                newsletterForm.reset();
            } catch (error) {
                console.error('Error subscribing to newsletter:', error);
                alert('Sorry, there was an error subscribing to the newsletter.');
            }
        });
    }
}

// Function to initialize social links
function initializeSocialLinks() {
    const socialLinks = document.querySelectorAll('.social-link');
    socialLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Don't prevent default - let links work normally
            const platform = link.textContent.toLowerCase();
            // Here you would typically track the social media click
            console.log('Social media click:', platform);
        });
    });
}

// Add global error handler
window.addEventListener('error', function(e) {
    console.error('Global error: ', e.message, ' at ', e.filename, ':', e.lineno);
});

// Load components when DOM is ready
document.addEventListener('DOMContentLoaded', loadComponents); 