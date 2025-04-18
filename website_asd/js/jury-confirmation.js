document.addEventListener('DOMContentLoaded', () => {
    // Get application data from localStorage
    const applicationData = JSON.parse(localStorage.getItem('juryApplication'));
    
    if (!applicationData) {
        // Redirect to reservation page if no data found
        window.location.href = 'jury-reservation.html';
        return;
    }
    
    // Update confirmation details
    document.getElementById('confirmation-name').textContent = applicationData.name;
    document.getElementById('confirmation-email').textContent = applicationData.email;
    document.getElementById('confirmation-phone').textContent = applicationData.phone;
    document.getElementById('confirmation-section').textContent = getSectionName(applicationData.section);
    document.getElementById('confirmation-experience').textContent = `${applicationData.experience} years`;
    document.getElementById('confirmation-message').textContent = applicationData.message || 'None provided';
    
    // Clear the application data from localStorage
    localStorage.removeItem('juryApplication');
});

function getSectionName(section) {
    const sections = {
        english: {
            en: 'English Section',
            fr: 'Section Anglaise',
            ar: 'القسم الإنجليزي'
        },
        french: {
            en: 'French Section',
            fr: 'Section Française',
            ar: 'القسم الفرنسي'
        },
        arabic: {
            en: 'Arabic Section',
            fr: 'Section Arabe',
            ar: 'القسم العربي'
        }
    };
    
    const currentLang = localStorage.getItem('language') || 'en';
    return sections[section][currentLang];
}

document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('.jury-form');
    const photoInput = document.getElementById('photo');
    const photoPreview = document.querySelector('.photo-preview');
    const submitBtn = document.querySelector('.submit-btn');

    // Handle photo preview
    photoInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                photoPreview.innerHTML = `<img src="${e.target.result}" alt="Photo Preview">`;
            };
            reader.readAsDataURL(file);
        }
    });

    // Handle form submission
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Disable submit button to prevent multiple submissions
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';

        try {
            const formData = new FormData(form);
            
            // Add validation here if needed
            const requiredFields = ['fullName', 'email', 'phone', 'nationalId', 'section'];
            for (const field of requiredFields) {
                if (!formData.get(field)) {
                    throw new Error(`Please fill in the ${field} field`);
                }
            }

            // Simulate API call (replace with actual API endpoint)
            const response = await fetch('/api/jury-confirmation', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Failed to submit form');
            }

            // Show success message
            alert('Your confirmation has been submitted successfully!');
            form.reset();
            photoPreview.innerHTML = '';
            
        } catch (error) {
            alert(error.message);
        } finally {
            // Re-enable submit button
            submitBtn.disabled = false;
            submitBtn.textContent = 'Confirm Presence';
        }
    });
}); 