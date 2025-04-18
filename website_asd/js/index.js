// DOM Elements
const header = document.querySelector('.main-header');
const languageBtns = document.querySelectorAll('.language-btn');
const loginBtn = document.querySelector('.login-btn');
const registerBtn = document.querySelector('.register-btn');
const logoutBtn = document.querySelector('.logout-btn');
const userProfileBtn = document.querySelector('.user-profile');

document.addEventListener('DOMContentLoaded', function() {
    initHeroSlider();
    initCompetitionSlider();
    initVideoThumbnails();
    animateStatistics();
    initYouTubeVideos();

    // Add header scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Language switcher
    if (languageBtns) {
        languageBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const language = this.getAttribute('data-lang');
                
                // Remove active class from all buttons
                languageBtns.forEach(b => b.classList.remove('active'));
                
                // Add active class to clicked button
                this.classList.add('active');
                
                // Call function to update page content based on selected language
                if (window.dataLoader && typeof window.dataLoader.setLanguage === 'function') {
                    window.dataLoader.setLanguage(language);
                }
            });
        });
    }
    
    // Authentication functionality (placeholder)
    if (loginBtn) {
        loginBtn.addEventListener('click', function() {
            // Show login modal or redirect to login page
            alert('Login functionality will be implemented here');
        });
    }
    
    if (registerBtn) {
        registerBtn.addEventListener('click', function() {
            // Show registration modal or redirect to registration page
            alert('Registration functionality will be implemented here');
        });
    }
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            // Handle logout
            alert('Logout functionality will be implemented here');
        });
    }
});

// Initialize hero slider
function initHeroSlider() {
    const heroSwiper = new Swiper('.hero-slider', {
        slidesPerView: 1,
        spaceBetween: 0,
        loop: true,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.hero-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.hero-button-next',
            prevEl: '.hero-button-prev',
        },
        effect: 'fade',
        fadeEffect: {
            crossFade: true
        },
        speed: 1000,
    });
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
        effect: 'slide',
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

// Initialize video thumbnails
function initVideoThumbnails() {
    // Get all video thumbnail elements
    const videoThumbnails = document.querySelectorAll('.video-thumbnail');
    
    // Add click event listener to each thumbnail
    videoThumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', function() {
            // Get the YouTube video ID from the data attribute
            const videoId = this.getAttribute('data-video-id');
            
            if (videoId) {
                // Create the YouTube embed URL
                const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
                
                // Create modal elements
                const modalOverlay = document.createElement('div');
                modalOverlay.className = 'video-modal-overlay';
                
                const modalContent = document.createElement('div');
                modalContent.className = 'video-modal-content';
                
                const closeButton = document.createElement('button');
                closeButton.className = 'video-modal-close';
                closeButton.innerHTML = '&times;';
                
                const iframe = document.createElement('iframe');
                iframe.src = embedUrl;
                iframe.width = '100%';
                iframe.height = '100%';
                iframe.frameBorder = '0';
                iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
                iframe.allowFullscreen = true;
                
                // Append elements to the DOM
                modalContent.appendChild(closeButton);
                modalContent.appendChild(iframe);
                modalOverlay.appendChild(modalContent);
                document.body.appendChild(modalOverlay);
                
                // Show modal
                setTimeout(() => {
                    modalOverlay.classList.add('active');
                }, 10);
                
                // Handle close button click
                closeButton.addEventListener('click', function() {
                    closeVideoModal(modalOverlay);
                });
                
                // Close modal on outside click
                modalOverlay.addEventListener('click', function(e) {
                    if (e.target === modalOverlay) {
                        closeVideoModal(modalOverlay);
                    }
                });
                
                // Close modal on ESC key
                document.addEventListener('keydown', function(e) {
                    if (e.key === 'Escape') {
                        closeVideoModal(modalOverlay);
                    }
                });
            }
        });
    });
}

// Close video modal function
function closeVideoModal(modalOverlay) {
    modalOverlay.classList.remove('active');
    setTimeout(() => {
        document.body.removeChild(modalOverlay);
    }, 300);
}

// Animate statistics counter
function animateStatistics() {
    const statisticNumbers = document.querySelectorAll('.statistic-number');
    const statisticsSection = document.querySelector('.statistics-section');
    
    let animated = false;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animated) {
                animated = true;
                
                statisticNumbers.forEach(number => {
                    const target = parseInt(number.getAttribute('data-count'));
                    let count = 0;
                    const duration = 2000; // 2 seconds
                    let interval;
                    
                    // Different interval calculation based on target value
                    if (target <= 10) {
                        interval = Math.floor(duration / (target * 2));
                        const step = 0.5;
                        
                        const counter = setInterval(() => {
                            count += step;
                            number.textContent = Math.floor(count);
                            
                            if (count >= target) {
                                clearInterval(counter);
                                number.textContent = target;
                            }
                        }, interval);
                    } else {
                        interval = Math.floor(duration / 30); // Fixed number of steps
                        const step = target / 30;
                        
                        const counter = setInterval(() => {
                            count += step;
                            number.textContent = Math.floor(count);
                            
                            if (count >= target) {
                                clearInterval(counter);
                                number.textContent = target;
                            }
                        }, interval);
                    }
                });
            }
        });
    }, {
        threshold: 0.5
    });
    
    if (statisticsSection) {
        observer.observe(statisticsSection);
    }
}

/**
 * Initialize the YouTube iframes for the previous editions section
 */
function initYouTubeVideos() {
  // Get all YouTube iframes
  const youtubeIframes = document.querySelectorAll('.video-container iframe');
  
  // Add event listener for window resize to maintain aspect ratio
  window.addEventListener('resize', () => {
    youtubeIframes.forEach(iframe => {
      const container = iframe.closest('.video-container');
      const containerWidth = container.clientWidth;
      const height = containerWidth * 0.5625; // 16:9 aspect ratio
      
      // Update container height if needed for responsiveness
      if (window.innerWidth < 768) {
        container.style.height = `${height}px`;
      }
    });
  });
  
  // Initialize edition box animations
  const editionBoxes = document.querySelectorAll('.edition-box');
  editionBoxes.forEach(box => {
    // Add animation when edition box enters viewport
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    
    observer.observe(box);
  });
} 