const API_BASE_URL = 'http://localhost:5000/api';

// Helper function to handle API responses
const handleResponse = async (response) => {
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Something went wrong');
    }
    return response.json();
};

// Authentication API
export const authAPI = {
    async login(email, password) {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        return handleResponse(response);
    },

    async register(userData) {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });
        return handleResponse(response);
    }
};

// Reservations API
export const reservationAPI = {
    async createReservation(reservationData) {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/reservations`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(reservationData)
        });
        return handleResponse(response);
    },

    async getMyReservations() {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/reservations/my-reservations`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return handleResponse(response);
    },

    async cancelReservation(reservationId) {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/reservations/${reservationId}/cancel`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return handleResponse(response);
    },
    
    // Calculate seat price based on section
    calculateSeatPrice(seatInfo) {
        // Extract section from seat identifier (e.g. "VIP2-15" -> "VIP")
        const section = seatInfo.split(/[0-9]/)[0];
        
        // Set price based on section
        switch(section) {
            case 'VIP':
                return 150;
            case 'A':
                return 100;
            case 'B':
                return 75;
            case 'C':
                return 50;
            default:
                return 50; // Default price
        }
    },
    
    // Get available seat sections with prices
    getSeatPricing() {
        return {
            VIP: { name: 'VIP Section', price: 150, color: '#FF9800' },
            A: { name: 'Section A', price: 100, color: '#4CAF50' },
            B: { name: 'Section B', price: 75, color: '#2196F3' },
            C: { name: 'Section C', price: 50, color: '#9C27B0' }
        };
    }
}; 