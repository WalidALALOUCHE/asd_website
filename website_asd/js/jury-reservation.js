document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('juryReservationForm');
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            section: document.getElementById('section').value,
            experience: document.getElementById('experience').value,
            message: document.getElementById('message').value,
            submissionDate: new Date().toISOString()
        };
        
        try {
            // Show loading state
            const submitBtn = form.querySelector('.submit-btn');
            const originalText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = 'Submitting...';
            
            // Save to localStorage (in a real app, this would be an API call)
            localStorage.setItem('juryApplication', JSON.stringify(formData));
            
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Redirect to confirmation page
            window.location.href = 'jury-confirmation.html';
            
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('An error occurred while submitting your application. Please try again.');
            
            // Reset button state
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    });
    
    // Add input validation
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            if (input.checkValidity()) {
                input.classList.remove('invalid');
            } else {
                input.classList.add('invalid');
            }
        });
    });

    const photoInput = document.getElementById('juryPhoto');
    const photoPreview = document.getElementById('juryPhotoPreview');

    if (photoInput && photoPreview) {
        photoInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    photoPreview.innerHTML = `<img src="${e.target.result}" alt="Photo Preview">`;
                };
                reader.readAsDataURL(file);
            } else {
                photoPreview.innerHTML = ''; // Clear preview if no file selected
            }
        });
    }
}); 