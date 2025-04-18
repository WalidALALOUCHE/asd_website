import { authAPI, reservationAPI } from './api.js';

console.log('reservation.js loaded');

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded');

    // DOM Elements
    const steps = document.querySelectorAll('.form-step');
    const stepIndicators = document.querySelectorAll('.step');
    const seatsGrid = document.getElementById('seatsGrid');
    const selectedSeatInfo = document.getElementById('selectedSeatInfo');
    const reserveNowBtn = document.getElementById('reserveNowBtn');
    const initialView = document.getElementById('initialView');
    const reservationFormContainer = document.getElementById('reservationForm');
    const reservationForm = document.getElementById('reservationFormContent');
    const selectedSeatInput = document.getElementById('selectedSeat');
    const loginForm = document.querySelector('.form-step[data-step="1"]');
    const loginEmailInput = document.getElementById('loginEmail');
    const loginPasswordInput = document.getElementById('loginPassword');
    const loginNextBtn = loginForm.querySelector('.next-step-btn');
    const photoInput = document.getElementById('photo');
    const photoPreview = document.getElementById('photoPreview');
    const paymentButtons = document.querySelectorAll('.payment-btn');
    const submitBtn = reservationForm.querySelector('.submit-btn');
    const loginErrorMsg = document.createElement('p');
    loginErrorMsg.style.color = 'red';
    loginErrorMsg.style.marginTop = '1rem';
    loginErrorMsg.style.textAlign = 'center';
    loginForm.querySelector('.login-container').appendChild(loginErrorMsg);

    // State
    let currentStep = 1;
    let selectedSeatElement = null;
    let currentScale = 1;
    const totalSeats = 800; // Total seats in the amphitheater

    // --- Helper Functions ---
    const updateSelectedSeatInfo = () => {
        if (selectedSeatElement) {
            const seatNumber = selectedSeatElement.dataset.seat;
            const section = selectedSeatElement.dataset.section;
            const row = selectedSeatElement.dataset.row;
            
            // Calculate price based on section
            let price = 50; // Default price
            switch(section) {
                case 'VIP':
                    price = 150;
                    break;
                case 'A':
                    price = 100;
                    break;
                case 'B':
                    price = 75;
                    break;
                case 'C':
                    price = 50;
                    break;
            }
            
            // Update price in payment step
            const seatPriceElement = document.getElementById('seatPrice');
            if (seatPriceElement) {
                seatPriceElement.textContent = `$${price}`;
            }
            
            // Use dataset for multilingual text
            const enText = `Selected: Seat ${seatNumber} (Section ${section}, Row ${row}) - $${price}`;
            const frText = `Sélectionné : Siège ${seatNumber} (Section ${section}, Rangée ${row}) - ${price}€`;
            const arText = `محدد: مقعد ${seatNumber} (قسم ${section}، صف ${row}) - $${price}`;
            
            selectedSeatInfo.textContent = eval(`${localStorage.getItem('lang') || 'en'}Text`);
            selectedSeatInfo.dataset.en = enText;
            selectedSeatInfo.dataset.fr = frText;
            selectedSeatInfo.dataset.ar = arText;
            reserveNowBtn.disabled = false;
        } else {
            const enText = `Please select a seat`;
            const frText = `Veuillez sélectionner une place`;
            const arText = `يرجى اختيار مقعد`;
            selectedSeatInfo.textContent = eval(`${localStorage.getItem('lang') || 'en'}Text`);
            selectedSeatInfo.dataset.en = enText;
            selectedSeatInfo.dataset.fr = frText;
            selectedSeatInfo.dataset.ar = arText;
            reserveNowBtn.disabled = true;
        }
    };

    const showStep = (stepNumber) => {
        currentStep = stepNumber;
        steps.forEach(step => {
            const isActive = parseInt(step.dataset.step) === stepNumber;
            step.style.opacity = isActive ? '1' : '0';
            step.style.display = isActive ? 'block' : 'none';
        });

        stepIndicators.forEach(indicator => {
            indicator.classList.toggle('active', parseInt(indicator.dataset.step) === stepNumber);
        });
    };

    const setLoadingState = (button, isLoading) => {
        if (isLoading) {
            button.classList.add('button-loading');
            button.disabled = true;
        } else {
            button.classList.remove('button-loading');
            button.disabled = false;
        }
    };

    // --- Amphitheater Creation ---
    const createAmphitheater = () => {
        if (!seatsGrid) {
            console.error('Seats grid element not found!');
            if(selectedSeatInfo) selectedSeatInfo.textContent = 'Error loading seats.';
            return;
        }
        
        seatsGrid.innerHTML = ''; // Clear existing content
        
        // Create container for better layout
        const seatsContainer = document.createElement('div');
        seatsContainer.className = 'seats-container';
        seatsGrid.appendChild(seatsContainer);
        
        // Create zoom controls
        const zoomControls = document.createElement('div');
        zoomControls.className = 'zoom-controls';
        zoomControls.innerHTML = `
            <div class="zoom-btn zoom-out" title="Zoom Out"><i class="fas fa-minus"></i></div>
            <div class="zoom-btn zoom-in" title="Zoom In"><i class="fas fa-plus"></i></div>
        `;
        seatsGrid.insertBefore(zoomControls, seatsContainer);
        
        // Setup zoom functionality
        const zoomIn = zoomControls.querySelector('.zoom-in');
        const zoomOut = zoomControls.querySelector('.zoom-out');
        
        zoomIn.addEventListener('click', () => {
            if (currentScale < 1.5) {
                currentScale += 0.1;
                seatsContainer.style.transform = `scale(${currentScale})`;
            }
        });
        
        zoomOut.addEventListener('click', () => {
            if (currentScale > 0.5) {
                currentScale -= 0.1;
                seatsContainer.style.transform = `scale(${currentScale})`;
            }
        });
        
        // Define sections
        const sections = [
            { name: 'VIP', rows: 3, seatsPerRow: [20, 24, 28], startSeat: 1 },
            { name: 'A', rows: 8, seatsPerRow: [32, 36, 40, 42, 46, 48, 50, 52], startSeat: 73 },
            { name: 'B', rows: 8, seatsPerRow: [54, 56, 58, 60, 62, 64, 66, 68], startSeat: 383 },
            { name: 'C', rows: 5, seatsPerRow: [70, 72, 74, 74, 76], startSeat: 663 }
        ];
        
        // Randomly set some seats as unavailable (about 10%)
        const unavailableSeats = new Set();
        const totalSeatsCount = sections.reduce((acc, section) => {
            return acc + section.rows * section.seatsPerRow.reduce((sum, seats) => sum + seats, 0) / section.rows;
        }, 0);
        
        const reservedCount = Math.floor(totalSeatsCount * 0.1);
        for (let i = 0; i < reservedCount; i++) {
            unavailableSeats.add(Math.floor(Math.random() * totalSeatsCount) + 1);
        }
        
        // Create section headers and seats
        let seatCount = 0;
        
        sections.forEach(section => {
            // Add section divider
            const sectionDivider = document.createElement('div');
            sectionDivider.className = 'section-divider';
            sectionDivider.textContent = `Section ${section.name}`;
            seatsContainer.appendChild(sectionDivider);
            
            let seatNumber = section.startSeat;
            
            // Create rows for this section
            for (let rowIndex = 0; rowIndex < section.rows; rowIndex++) {
                const rowNumber = rowIndex + 1;
                const seatRow = document.createElement('div');
                seatRow.className = `seat-row row-${rowNumber} section-${section.name}`;
                
                // Add row label
                const rowLabel = document.createElement('div');
                rowLabel.className = 'row-label';
                rowLabel.textContent = `${section.name}${rowNumber}`;
                seatRow.appendChild(rowLabel);
                
                // Calculate curvature - more pronounced at the back rows
                const curvatureFactor = 0.5 + (rowIndex * 0.05);
                
                // Add seats to this row
                const seatsInThisRow = section.seatsPerRow[rowIndex];
                for (let seatIndex = 0; seatIndex < seatsInThisRow; seatIndex++) {
                    const seat = document.createElement('div');
                    seat.className = `seat ${unavailableSeats.has(seatNumber) ? 'unavailable' : ''}`;
                    seat.dataset.seat = seatNumber;
                    seat.dataset.section = section.name;
                    seat.dataset.row = rowNumber;
                    
                    // Apply curved effect for amphitheater look
                    // Calculate angle based on position in row
                    const angle = (seatIndex - (seatsInThisRow / 2)) * (1.5 / seatsInThisRow) * curvatureFactor;
                    
                    // Apply rotation and translation based on angle
                    seat.style.transform = `rotate(${angle}deg) translateY(${Math.abs(angle) * 2}px)`;
                    
                    // Add click event for seat selection
                    seat.addEventListener('click', () => {
                        if (!seat.classList.contains('unavailable')) {
                            if (selectedSeatElement === seat) {
                                seat.classList.remove('selected');
                                selectedSeatElement = null;
                            } else {
                                if (selectedSeatElement) {
                                    selectedSeatElement.classList.remove('selected');
                                }
                                seat.classList.add('selected');
                                selectedSeatElement = seat;
                            }
                            updateSelectedSeatInfo();
                        }
                    });
                    
                    seatRow.appendChild(seat);
                    seatNumber++;
                    seatCount++;
                }
                
                seatsContainer.appendChild(seatRow);
            }
        });
        
        // Update seat legend
        const legend = document.querySelector('.seat-legend');
        if (legend) {
            legend.innerHTML = `
                <div class="legend-item">
                    <div class="seat available"></div>
                    <span data-en="Available" data-fr="Disponible" data-ar="متاح">Available</span>
                </div>
                <div class="legend-item">
                    <div class="seat selected"></div>
                    <span data-en="Selected" data-fr="Sélectionné" data-ar="مختار">Selected</span>
                </div>
                <div class="legend-item">
                    <div class="seat unavailable"></div>
                    <span data-en="Unavailable" data-fr="Indisponible" data-ar="غير متاح">Unavailable</span>
                </div>
                <div class="legend-item">
                    <div class="seat section-VIP"></div>
                    <span>VIP</span>
                </div>
                <div class="legend-item">
                    <div class="seat section-A"></div>
                    <span>Section A</span>
                </div>
                <div class="legend-item">
                    <div class="seat section-B"></div>
                    <span>Section B</span>
                </div>
                <div class="legend-item">
                    <div class="seat section-C"></div>
                    <span>Section C</span>
                </div>
            `;
        }
        
        console.log(`Generated ${seatCount} seats in amphitheater.`);
        updateSelectedSeatInfo();
    };

    // --- Event Listeners ---
    reserveNowBtn.addEventListener('click', () => {
        if (!selectedSeatElement) { return; }

        const section = selectedSeatElement.dataset.section;
        const row = selectedSeatElement.dataset.row;
        const seatNumber = selectedSeatElement.dataset.seat;
        
        // Calculate price based on section
        let price = 50; // Default price
        switch(section) {
            case 'VIP':
                price = 150;
                break;
            case 'A':
                price = 100;
                break;
            case 'B':
                price = 75;
                break;
            case 'C':
                price = 50;
                break;
        }
        
        selectedSeatInput.value = `${section}${row}-${seatNumber}`;

        // Update price in payment step
        const seatPriceElement = document.getElementById('seatPrice');
        if (seatPriceElement) {
            seatPriceElement.textContent = `$${price}`;
        }

        initialView.style.display = 'none';
        reservationFormContainer.style.display = 'block';
        showStep(1);
    });

    loginNextBtn.addEventListener('click', async () => {
        const email = loginEmailInput.value;
        const password = loginPasswordInput.value;
        loginErrorMsg.textContent = '';

        if (!email || !password) {
            loginErrorMsg.textContent = 'Please fill in all fields';
            return;
        }

        setLoadingState(loginNextBtn, true);

        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            const mockResponse = { token: 'mockToken123', user: { name: 'Mock User', email: email } };

            localStorage.setItem('token', mockResponse.token);
            localStorage.setItem('user', JSON.stringify(mockResponse.user));
            showStep(2);
        } catch (error) {
            console.error('Login failed:', error);
            loginErrorMsg.textContent = error.message || 'Login failed. Please check credentials.';
        } finally {
            setLoadingState(loginNextBtn, false);
        }
    });

    document.querySelector('.create-account').addEventListener('click', (e) => {
        e.preventDefault();
        alert('Registration form needs implementation.');
    });

    document.querySelectorAll('.next-step-btn:not(.login-next-btn)').forEach(button => {
        button.addEventListener('click', () => {
            if (currentStep < 3) {
                showStep(currentStep + 1);
            }
        });
    });

    document.querySelectorAll('.prev-step-btn').forEach(button => {
        button.addEventListener('click', () => {
            if (currentStep > 1) {
                showStep(currentStep - 1);
            }
        });
    });

    if (photoInput && photoPreview) {
        photoInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    photoPreview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
                };
                reader.readAsDataURL(file);
            } else {
                photoPreview.innerHTML = '';
            }
        });
    }

    paymentButtons.forEach(button => {
        button.addEventListener('click', () => {
            paymentButtons.forEach(btn => btn.classList.remove('selected'));
            button.classList.add('selected');
        });
    });

    reservationForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const requiredFields = ['name', 'phone', 'nationalId', 'photo', 'selectedSeat'];
        let firstInvalidField = null;
        for (const fieldId of requiredFields) {
            const field = document.getElementById(fieldId);
            if (!field || !field.value) {
                alert(`Please fill in the ${fieldId} field`);
                if (!firstInvalidField) firstInvalidField = field;
            }
        }
        if (firstInvalidField) {
            firstInvalidField.focus();
            return;
        }

        const selectedPayment = document.querySelector('.payment-btn.selected');
        if (!selectedPayment) {
            alert('Please select a payment method');
            return;
        }
        
        // Get seat information and calculate price
        const seatInfo = selectedSeatInput.value;
        const section = seatInfo.split(/[0-9]/)[0]; // Extract section (e.g., "VIP" from "VIP2-15")
        
        // Calculate price based on section
        let price = 50; // Default price
        switch(section) {
            case 'VIP':
                price = 150;
                break;
            case 'A':
                price = 100;
                break;
            case 'B':
                price = 75;
                break;
            case 'C':
                price = 50;
                break;
        }

        const reservationData = {
            seatNumber: selectedSeatInput.value,
            name: document.getElementById('name').value,
            phone: document.getElementById('phone').value,
            nationalId: document.getElementById('nationalId').value,
            paymentMethod: selectedPayment.dataset.payment,
            amount: price,
            eventDate: new Date().toISOString()
        };

        console.log('Submitting Reservation:', reservationData);
        setLoadingState(submitBtn, true);

        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            const mockResponse = { 
                success: true, 
                reservationId: 'mockRes123',
                amount: price,
                seat: selectedSeatInput.value
            };

            // Success message with price information
            alert(`Reservation successful! ID: ${mockResponse.reservationId}\nTotal amount: $${mockResponse.amount}`);
            window.location.href = 'index.html';
        } catch (error) {
            console.error('Reservation failed:', error);
            alert(error.message || 'Reservation failed. Please try again.');
        } finally {
            setLoadingState(submitBtn, false);
        }
    });

    // Initialize amphitheater and view state
    createAmphitheater();
    showStep(1); // Start at step 1 logic
    
    // Add window resize handler to adjust amphitheater display
    window.addEventListener('resize', () => {
        // Adjust scale based on window width
        if (window.innerWidth < 768) {
            currentScale = 0.7;
        } else if (window.innerWidth < 992) {
            currentScale = 0.8;
        } else if (window.innerWidth < 1200) {
            currentScale = 0.9;
        } else {
            currentScale = 1;
        }
        
        const seatsContainer = document.querySelector('.seats-container');
        if (seatsContainer) {
            seatsContainer.style.transform = `scale(${currentScale})`;
        }
    });
});

class ReservationHandler {
    constructor() {
        this.apiUrl = '/backend/api/reservations.php';
        this.selectedSeat = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.generateSeatGrid();
        this.updateSelectedSeatInfo();
    }

    generateSeatGrid() {
        const grid = document.querySelector('.amphitheater-grid');
        if (!grid) return;

        // Clear existing seats
        grid.innerHTML = '';

        // Create stage
        const stage = document.createElement('div');
        stage.className = 'stage';
        stage.textContent = 'Stage';
        grid.appendChild(stage);

        // Generate 100 seats (10x10 grid)
        for (let row = 1; row <= 10; row++) {
            for (let col = 1; col <= 10; col++) {
                const seat = document.createElement('div');
                seat.className = 'seat';
                seat.dataset.row = row;
                seat.dataset.col = col;
                seat.dataset.number = `${row}-${col}`;
                seat.addEventListener('click', () => this.handleSeatSelection(seat));
                grid.appendChild(seat);
            }
        }
    }

    handleSeatSelection(seat) {
        // Deselect previous seat
        if (this.selectedSeat) {
            this.selectedSeat.classList.remove('selected');
        }

        // Select new seat
        seat.classList.add('selected');
        this.selectedSeat = seat;
        this.updateSelectedSeatInfo();

        // Update hidden input
        const seatInput = document.querySelector('input[name="seat_number"]');
        if (seatInput) {
            seatInput.value = seat.dataset.number;
        }
    }

    updateSelectedSeatInfo() {
        const infoElement = document.getElementById('selectedSeatInfo');
        if (!infoElement) return;

        if (this.selectedSeat) {
            infoElement.textContent = `Selected Seat: Row ${this.selectedSeat.dataset.row}, Column ${this.selectedSeat.dataset.col}`;
            infoElement.style.display = 'block';
        } else {
            infoElement.style.display = 'none';
        }
    }

    async handleReservationSubmit(event) {
        event.preventDefault();
        const form = event.target;

        // Validate form
        if (!this.validateForm(form)) {
            return;
        }

        // Get form data
        const formData = new FormData(form);
        const data = {
            seat_number: formData.get('seat_number'),
            full_name: formData.get('full_name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            national_id: formData.get('national_id'),
            payment_method: formData.get('payment_method')
        };

        // Handle photo upload if present
        const photoInput = form.querySelector('input[type="file"]');
        if (photoInput && photoInput.files.length > 0) {
            const file = photoInput.files[0];
            data.photo = await this.convertFileToBase64(file);
        }

        try {
            // Show loading state
            const submitButton = form.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            submitButton.disabled = true;
            submitButton.textContent = 'Processing...';

            // Send reservation request
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            // Reset button state
            submitButton.disabled = false;
            submitButton.textContent = originalText;

            if (result.status === 'success') {
                // Show success message
                this.showMessage('Reservation successful!', 'success');
                
                // Redirect to confirmation page or clear form
                setTimeout(() => {
                    window.location.href = `/reservation-confirmation.html?id=${result.reservation_id}`;
                }, 2000);
            } else {
                // Show error message
                this.showMessage(result.message || 'Failed to create reservation', 'error');
            }
        } catch (error) {
            console.error('Reservation error:', error);
            this.showMessage('An error occurred while processing your reservation', 'error');
        }
    }

    validateForm(form) {
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                field.classList.add('error');
            } else {
                field.classList.remove('error');
            }
        });

        // Validate email format
        const emailField = form.querySelector('input[type="email"]');
        if (emailField && !this.isValidEmail(emailField.value)) {
            isValid = false;
            emailField.classList.add('error');
        }

        // Validate phone format
        const phoneField = form.querySelector('input[name="phone"]');
        if (phoneField && !this.isValidPhone(phoneField.value)) {
            isValid = false;
            phoneField.classList.add('error');
        }

        // Validate seat selection
        if (!this.selectedSeat) {
            isValid = false;
            this.showMessage('Please select a seat', 'error');
        }

        return isValid;
    }

    isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    isValidPhone(phone) {
        const re = /^\+?[\d\s-]{10,}$/;
        return re.test(phone);
    }

    async convertFileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }

    showMessage(message, type = 'info') {
        const messageElement = document.createElement('div');
        messageElement.className = `message ${type}`;
        messageElement.textContent = message;

        // Remove existing messages
        const existingMessages = document.querySelectorAll('.message');
        existingMessages.forEach(msg => msg.remove());

        // Add new message
        document.body.appendChild(messageElement);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            messageElement.remove();
        }, 5000);
    }

    setupEventListeners() {
        // Form submission
        const form = document.querySelector('.reservation-form');
        if (form) {
            form.addEventListener('submit', (e) => this.handleReservationSubmit(e));
        }

        // Photo upload preview
        const photoInput = document.querySelector('input[type="file"]');
        if (photoInput) {
            photoInput.addEventListener('change', (e) => this.handlePhotoPreview(e));
        }

        // Payment method selection
        const paymentMethods = document.querySelectorAll('input[name="payment_method"]');
        paymentMethods.forEach(method => {
            method.addEventListener('change', (e) => this.handlePaymentMethodChange(e));
        });
    }

    handlePhotoPreview(event) {
        const file = event.target.files[0];
        const preview = document.querySelector('.photo-preview');
        
        if (file && preview) {
            const reader = new FileReader();
            reader.onload = (e) => {
                preview.src = e.target.result;
                preview.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    }

    handlePaymentMethodChange(event) {
        const creditCardDetails = document.querySelector('.credit-card-details');
        if (creditCardDetails) {
            creditCardDetails.style.display = event.target.value === 'credit_card' ? 'block' : 'none';
        }
    }
}

// Initialize reservation handler when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.reservationHandler = new ReservationHandler();
}); 