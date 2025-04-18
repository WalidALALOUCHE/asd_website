// Import APIs and utilities
import { messageAPI } from './api/messageAPI.js';
import { dataLoader } from './data-loader.js';

document.addEventListener('DOMContentLoaded', () => {
    initContactPage();
});

function initContactPage() {
    // Initialize all components
    setupContactForm();
    setupFaqAccordion();
    setupGoogleMap();
    
    // Apply gold theme styling (ensuring consistency with the rest of the site)
    applyGoldTheme();
    
    // Update content based on language
    dataLoader.updateContactPageContent();
}

/**
 * Apply gold theme styling to ensure consistency with rest of the site
 */
function applyGoldTheme() {
    // Apply theme class to body if not already there
    if (!document.body.classList.contains('gold-theme')) {
        document.body.classList.add('gold-theme');
    }
    
    // Ensure all buttons have themed styling
    document.querySelectorAll('.btn-primary').forEach(button => {
        button.classList.add('gold-btn');
    });
    
    // Add gold accent to form inputs on focus
    const formInputs = document.querySelectorAll('input, textarea');
    formInputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.style.borderColor = '#d4af37';
        });
        
        input.addEventListener('blur', () => {
            if (!input.value) {
                input.style.borderColor = '#e0e0e0';
            }
        });
    });
}

/**
 * Contact Form Validation and Submission
 */
function setupContactForm() {
    const contactForm = document.getElementById('contactForm');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const subjectInput = document.getElementById('subject');
    const messageInput = document.getElementById('message');
    const successModal = document.getElementById('successModal');
    const modalOverlay = document.getElementById('modalOverlay');
    const closeModalBtn = document.getElementById('closeModal');
    const okButton = document.getElementById('okButton');
    
    if (!contactForm) return;
    
    // Form submission
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Reset error messages
        document.querySelectorAll('.error-message').forEach(error => {
            error.style.display = 'none';
        });
        
        // Validate form
        let isValid = true;
        
        // Name validation
        if (nameInput.value.trim() === '') {
            document.getElementById('nameError').style.display = 'block';
            isValid = false;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailInput.value.trim())) {
            document.getElementById('emailError').style.display = 'block';
            isValid = false;
        }
        
        // Subject validation
        if (subjectInput.value.trim() === '') {
            document.getElementById('subjectError').style.display = 'block';
            isValid = false;
        }
        
        // Message validation
        if (messageInput.value.trim() === '') {
            document.getElementById('messageError').style.display = 'block';
            isValid = false;
        }
        
        if (!isValid) return;
        
        // Submit form if valid
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        
        try {
            // Disable button and show loading state
            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            
            // Prepare data
            const formData = {
                name: nameInput.value.trim(),
                email: emailInput.value.trim(),
                subject: subjectInput.value.trim(),
                message: messageInput.value.trim()
            };
            
            // Send message
            await messageAPI.sendMessage(formData);
            
            // Reset form
            contactForm.reset();
            
            // Show success modal
            showModal();
            
        } catch (error) {
            console.error('Error sending message:', error);
            alert('There was an error sending your message. Please try again later.');
        } finally {
            // Reset button state
            submitButton.disabled = false;
            submitButton.textContent = originalText;
        }
    });
    
    // Modal functionality
    function showModal() {
        modalOverlay.classList.add('active');
    }
    
    function hideModal() {
        modalOverlay.classList.remove('active');
    }
    
    // Close modal with button
    closeModalBtn.addEventListener('click', hideModal);
    okButton.addEventListener('click', hideModal);
    
    // Close modal when clicking outside
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            hideModal();
        }
    });
    
    // Close modal with ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
            hideModal();
        }
    });
}

/**
 * FAQ Accordion Functionality
 */
function setupFaqAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // Check if this item is already active
            const isActive = item.classList.contains('active');
            
            // Close all FAQ items
            faqItems.forEach(faqItem => {
                faqItem.classList.remove('active');
            });
            
            // If clicked item wasn't active, open it
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}

/**
 * Google Maps Integration
 */
function setupGoogleMap() {
    const mapContainer = document.getElementById('googleMap');
    
    if (!mapContainer) return;
    
    // Check if Google Maps API is loaded
    if (typeof google === 'undefined' || typeof google.maps === 'undefined') {
        console.error('Google Maps API not loaded');
        mapContainer.innerHTML = '<div style="text-align: center; padding: 50px;">Map loading failed. Please try again later.</div>';
        return;
    }
    
    try {
        // Map coordinates (sample coordinates for Paris, France)
        const coordinates = { lat: 48.8566, lng: 2.3522 };
        
        // Create map with gold theme
        const map = new google.maps.Map(mapContainer, {
            center: coordinates,
            zoom: 15,
            styles: [
                {
                    "elementType": "geometry",
                    "stylers": [{"color": "#f5f5f5"}]
                },
                {
                    "elementType": "labels.icon",
                    "stylers": [{"visibility": "off"}]
                },
                {
                    "elementType": "labels.text.fill",
                    "stylers": [{"color": "#616161"}]
                },
                {
                    "elementType": "labels.text.stroke",
                    "stylers": [{"color": "#f5f5f5"}]
                },
                {
                    "featureType": "administrative.land_parcel",
                    "elementType": "labels.text.fill",
                    "stylers": [{"color": "#bdbdbd"}]
                },
                {
                    "featureType": "poi",
                    "elementType": "geometry",
                    "stylers": [{"color": "#eeeeee"}]
                },
                {
                    "featureType": "poi",
                    "elementType": "labels.text.fill",
                    "stylers": [{"color": "#757575"}]
                },
                {
                    "featureType": "poi.park",
                    "elementType": "geometry",
                    "stylers": [{"color": "#e5e5e5"}]
                },
                {
                    "featureType": "poi.park",
                    "elementType": "labels.text.fill",
                    "stylers": [{"color": "#9e9e9e"}]
                },
                {
                    "featureType": "road",
                    "elementType": "geometry",
                    "stylers": [{"color": "#ffffff"}]
                },
                {
                    "featureType": "road.arterial",
                    "elementType": "labels.text.fill",
                    "stylers": [{"color": "#757575"}]
                },
                {
                    "featureType": "road.highway",
                    "elementType": "geometry",
                    "stylers": [{"color": "#dadada"}]
                },
                {
                    "featureType": "road.highway",
                    "elementType": "labels.text.fill",
                    "stylers": [{"color": "#616161"}]
                },
                {
                    "featureType": "road.local",
                    "elementType": "labels.text.fill",
                    "stylers": [{"color": "#9e9e9e"}]
                },
                {
                    "featureType": "transit.line",
                    "elementType": "geometry",
                    "stylers": [{"color": "#e5e5e5"}]
                },
                {
                    "featureType": "transit.station",
                    "elementType": "geometry",
                    "stylers": [{"color": "#eeeeee"}]
                },
                {
                    "featureType": "water",
                    "elementType": "geometry",
                    "stylers": [{"color": "#1a1a1a"}]
                },
                {
                    "featureType": "water",
                    "elementType": "labels.text.fill",
                    "stylers": [{"color": "#9e9e9e"}]
                }
            ]
        });
        
        // Custom marker with gold color
        const marker = new google.maps.Marker({
            position: coordinates,
            map: map,
            title: 'All-Star Debate Headquarters',
            animation: google.maps.Animation.DROP,
            icon: {
                path: google.maps.SymbolPath.CIRCLE,
                fillColor: '#d4af37',
                fillOpacity: 1,
                strokeColor: '#1a1a1a',
                strokeWeight: 2,
                scale: 10
            }
        });
        
        // Custom styled info window
        const infoWindow = new google.maps.InfoWindow({
            content: `
                <div style="padding: 10px; max-width: 200px; color: #1a1a1a;">
                    <h4 style="color: #d4af37; margin-top: 0;">All-Star Debate</h4>
                    <p style="margin-bottom: 0;">123 Avenue des Champs-Élysées<br>75008 Paris, France</p>
                </div>
            `
        });
        
        marker.addListener('click', () => {
            infoWindow.open(map, marker);
        });
        
    } catch (error) {
        console.error('Error initializing Google Map:', error);
        mapContainer.innerHTML = '<div style="text-align: center; padding: 50px;">Map loading failed. Please try again later.</div>';
    }
} 