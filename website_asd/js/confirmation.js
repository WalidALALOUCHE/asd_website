document.addEventListener('DOMContentLoaded', () => {
    // Get reservation details from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const reservationId = urlParams.get('id');

    if (!reservationId) {
        showError('No reservation ID provided');
        return;
    }

    // Fetch reservation details
    fetchReservationDetails(reservationId);
});

async function fetchReservationDetails(reservationId) {
    try {
        const response = await fetch(`/api/reservations/${reservationId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch reservation details');
        }

        const reservation = await response.json();
        updateConfirmationPage(reservation);
    } catch (error) {
        showError('Failed to load reservation details. Please try again later.');
        console.error('Error fetching reservation:', error);
    }
}

function updateConfirmationPage(reservation) {
    // Update reservation details
    document.getElementById('reservationId').textContent = reservation.id;
    document.getElementById('eventName').textContent = reservation.eventName;
    document.getElementById('eventDate').textContent = formatDate(reservation.eventDate);
    document.getElementById('eventTime').textContent = reservation.eventTime;
    document.getElementById('seatNumber').textContent = reservation.seatNumber;

    // Update personal information
    document.getElementById('fullName').textContent = reservation.fullName;
    document.getElementById('email').textContent = reservation.email;
    document.getElementById('phone').textContent = reservation.phone;
    document.getElementById('nationalId').textContent = reservation.nationalId;

    // Update payment information
    document.getElementById('totalAmount').textContent = formatCurrency(reservation.totalAmount);
    document.getElementById('paymentMethod').textContent = reservation.paymentMethod;
    document.getElementById('paymentStatus').textContent = reservation.paymentStatus;
    document.getElementById('transactionId').textContent = reservation.transactionId || 'N/A';
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    
    const container = document.querySelector('.confirmation-container');
    container.innerHTML = '';
    container.appendChild(errorDiv);
}

// Print functionality
document.getElementById('printBtn').addEventListener('click', () => {
    window.print();
});

// Return to home page
document.getElementById('homeBtn').addEventListener('click', () => {
    window.location.href = '/';
}); 