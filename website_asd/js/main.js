import { dataLoader } from './data-loader.js';

// --- Global Initializations ---

// Initialize Swiper for hero section
let heroSwiper = null; // Initialize later
function initSwiper() {
    if (document.querySelector('.swiper-container') && !heroSwiper) { // Check if element exists and not already initialized
        heroSwiper = new Swiper('.swiper-container', {
            loop: true,
            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            // Add navigation arrows if needed
            // navigation: {
            //    nextEl: '.swiper-button-next',
            //    prevEl: '.swiper-button-prev',
            // },
        });
        console.log("Hero Swiper Initialized");
    }
}

// Handle header scroll effect
const header = document.querySelector('header');
if (header) {
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        if (currentScroll <= 50) { // Give some buffer
            header.classList.remove('scrolled');
            return;
        }
        // Add scrolled class regardless of direction if past buffer
        if (!header.classList.contains('scrolled')) {
             header.classList.add('scrolled');
        }
        lastScroll = currentScroll; // Update lastScroll anyway
    });
}

// Initialize hero slider
function initHeroSlider() {
    const heroSwiper = new Swiper('.hero-slider', {
        slidesPerView: 1,
        spaceBetween: 0,
        loop: true,
        autoplay: {
            delay: 6000,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.hero-pagination',
            clickable: true,
            renderBullet: function (index, className) {
                return '<span class="' + className + '"></span>';
            },
        },
        navigation: {
            nextEl: '.hero-button-next',
            prevEl: '.hero-button-prev',
        },
        effect: 'fade',
        fadeEffect: {
            crossFade: true
        },
        speed: 1500,
        watchSlidesProgress: true,
        on: {
            init: function() {
                const activeSlide = this.slides[this.activeIndex];
                if (activeSlide) {
                    activeSlide.classList.add('animated-slide');
                }
            },
            slideChangeTransitionStart: function() {
                document.querySelectorAll('.hero-content').forEach(content => {
                    content.style.opacity = '0';
                    content.style.transform = 'translateY(-30%) scale(0.95)';
                });
            },
            slideChangeTransitionEnd: function() {
                const activeSlide = this.slides[this.activeIndex];
                if (activeSlide) {
                    const content = activeSlide.querySelector('.hero-content');
                    if (content) {
                        setTimeout(() => {
                            content.style.opacity = '1';
                            content.style.transform = 'translateY(-50%) scale(1)';
                        }, 200);
                    }
                }
                
                // Add parallax effect to active slide background
                const slideBackground = activeSlide.querySelector('.hero-slide');
                if (slideBackground) {
                    slideBackground.style.transition = 'transform 8s ease';
                    slideBackground.style.transform = 'scale(1)';
                    
                    // Reset other slide backgrounds
                    this.slides.forEach(slide => {
                        if (slide !== activeSlide) {
                            const bg = slide.querySelector('.hero-slide');
                            if (bg) {
                                bg.style.transition = 'none';
                                bg.style.transform = 'scale(1.05)';
                            }
                        }
                    });
                }
            }
        }
    });

    // Add swipe indicator interaction
    const swipeIndicator = document.querySelector('.slide-indicator');
    if (swipeIndicator) {
        swipeIndicator.addEventListener('click', () => {
            heroSwiper.slideNext();
        });
    }
}

// Initialize competition slider
function initCompetitionSlider() {
    const competitionSwiper = new Swiper('.competition-slider', {
        slidesPerView: 1,
        spaceBetween: 20,
        loop: true,
        autoplay: {
            delay: 4000,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.competition-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.competition-button-next',
            prevEl: '.competition-button-prev',
        },
        grabCursor: true,
        speed: 800,
        breakpoints: {
            // when window width is >= 576px
            576: {
                slidesPerView: 2,
                spaceBetween: 20
            },
            // when window width is >= 992px
            992: {
                slidesPerView: 3,
                spaceBetween: 30
            }
        }
    });
}

// Add smooth scrolling for anchor links
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 80; // Height of fixed header
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Animate statistics counter
function animateStatistics() {
    const statisticNumbers = document.querySelectorAll('.statistic-number');
    
    if (statisticNumbers.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = parseInt(entry.target.getAttribute('data-count'));
                    let count = 0;
                    const duration = 2000; // 2 seconds
                    const interval = Math.floor(duration / 30); // 30 steps
                    const step = target / 30;
                    
                    const counter = setInterval(() => {
                        count += step;
                        entry.target.textContent = Math.floor(count);
                        
                        if (count >= target) {
                            clearInterval(counter);
                            entry.target.textContent = target;
                        }
                    }, interval);
                    
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.5
        });
        
        statisticNumbers.forEach(number => {
            observer.observe(number);
        });
    }
}

// Add hover animations to mission cards
function initMissionCardAnimations() {
    const missionCards = document.querySelectorAll('.mission-card');
    
    missionCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            const icon = card.querySelector('.mission-card-icon i');
            if (icon) {
                icon.style.transform = 'scale(1.1)';
            }
        });
        
        card.addEventListener('mouseleave', () => {
            const icon = card.querySelector('.mission-card-icon i');
            if (icon) {
                icon.style.transform = 'scale(1)';
            }
        });
    });
}

// Initialize video thumbnails and modal functionality
function initVideoThumbnails() {
    // Implementation for video thumbnails
    console.log('Video thumbnails initialized');
}

// Initialize YouTube videos for previous editions section
function initYouTubeVideos() {
    const videoContainers = document.querySelectorAll('.video-container[data-video-id]');
    const videoModal = document.querySelector('.video-modal');
    const videoModalIframe = videoModal ? videoModal.querySelector('iframe') : null;
    const videoModalClose = videoModal ? videoModal.querySelector('.video-modal-close') : null;
    
    if (!videoContainers.length || !videoModal || !videoModalIframe || !videoModalClose) {
        console.warn('Video elements not found');
        return;
    }
    
    // Handle clicking on video thumbnails
    videoContainers.forEach(container => {
        container.addEventListener('click', () => {
            const videoId = container.getAttribute('data-video-id');
            if (videoId) {
                // Set the iframe source with autoplay parameter
                videoModalIframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
                
                // Show the modal
                videoModal.classList.add('active');
                
                // Disable scrolling on body
                document.body.style.overflow = 'hidden';
            }
        });
    });
    
    // Handle closing the modal
    videoModalClose.addEventListener('click', () => {
        closeVideoModal();
    });
    
    // Close when clicking outside the content
    videoModal.addEventListener('click', (e) => {
        if (e.target === videoModal) {
            closeVideoModal();
        }
    });
    
    // Close with ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && videoModal.classList.contains('active')) {
            closeVideoModal();
        }
    });
    
    function closeVideoModal() {
        videoModal.classList.remove('active');
        
        // Reset iframe src to stop video
        setTimeout(() => {
            videoModalIframe.src = '';
        }, 300);
        
        // Re-enable scrolling
        document.body.style.overflow = '';
    }
    
    console.log('YouTube videos initialized with thumbnail preview');
}

// --- DOMContentLoaded Event Listener ---
document.addEventListener('DOMContentLoaded', function() {
    // Load data and update page content
    dataLoader.loadData()
        .then(() => {
            console.log('Data loaded successfully');
            dataLoader.updatePageContent();
        })
        .catch(error => {
            console.error('Error loading data:', error);
        });
    
    // Initialize components
    initHeroSlider();
    initCompetitionSlider();
    initSmoothScrolling();
    animateStatistics();
    initMissionCardAnimations();
    initVideoThumbnails();
    initYouTubeVideos();

    // Add header scroll effect
    window.addEventListener('scroll', function() {
        const header = document.querySelector('.main-header');
        if (header) {
            if (window.scrollY > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
    });

    // --- Language Switcher --- 
    const langButtons = document.querySelectorAll('.lang-btn');
    langButtons.forEach(button => {
        button.addEventListener('click', () => {
            const lang = button.dataset.lang;
            dataLoader.setLanguage(lang); // Use dataLoader to handle language change and content update

            // Update active button state (dataLoader might do this, but safer here too)
            langButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
        });
    });
    // Set initial active button based on dataLoader's current language
    const currentLang = dataLoader.currentLanguage;
    const activeLangButton = document.querySelector(`.lang-btn[data-lang="${currentLang}"]`);
    if (activeLangButton) {
        langButtons.forEach(btn => btn.classList.remove('active'));
        activeLangButton.classList.add('active');
    }

    // --- General Animation on Scroll (Using Intersection Observer) --- 
    const animateOnScrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in-up'); // Example animation class
                animateOnScrollObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1, // Trigger when 10% visible
        rootMargin: '0px 0px -50px 0px' // Trigger slightly before it fully enters viewport
    });

    // Observe elements that should animate
    document.querySelectorAll('.content-section h2, .content-section p, .mission-card, .cofounder-card, .stat-item, .edition-card, .community-card, .logo-item').forEach(element => {
         // Add relevant classes like .animate-on-scroll to these elements if needed by CSS
        animateOnScrollObserver.observe(element);
    });
}); // --- End DOMContentLoaded --- 