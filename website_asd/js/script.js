// Language switching functionality
const langButtons = document.querySelectorAll('.lang-btn');
const currentLang = localStorage.getItem('lang') || 'en';

// Set initial language
document.documentElement.lang = currentLang;
updateLanguage(currentLang);

langButtons.forEach(button => {
    button.addEventListener('click', () => {
        const lang = button.dataset.lang;
        document.documentElement.lang = lang;
        localStorage.setItem('lang', lang);
        updateLanguage(lang);
        
        // Update active button
        langButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
    });
});

function updateLanguage(lang) {
    document.querySelectorAll('[data-en], [data-fr]').forEach(element => {
        if (element.tagName === 'A') {
            element.textContent = element.getAttribute(`data-${lang}`);
        } else {
            const text = element.getAttribute(`data-${lang}`);
            if (text) {
                element.textContent = text;
            }
        }
    });
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add active class to navigation links on scroll
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');
    const scrollPosition = window.scrollY;

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        const id = section.getAttribute('id');

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${id}`) {
                    link.classList.add('active');
                }
            });
        }
    });
});

// Intersection Observer for animations
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            observer.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

// Observe all sections and cards
document.querySelectorAll('.section, .community-card, .edition-card, .section-card').forEach(element => {
    observer.observe(element);
});

// Dynamic loading of YouTube videos
const youtubeVideos = document.querySelectorAll('.youtube-video iframe');
youtubeVideos.forEach(video => {
    video.addEventListener('load', () => {
        video.style.opacity = '1';
    });
});

// Add hover effect to community cards
document.querySelectorAll('.community-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-5px)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
    });
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
}); 