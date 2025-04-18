class AuthHandler {
    constructor() {
        this.apiUrl = '/backend/api/auth.php';
        this.currentUser = null;
        this.init();
    }

    async init() {
        await this.checkAuthStatus();
        this.setupEventListeners();
    }

    async checkAuthStatus() {
        try {
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ action: 'check' })
            });
            const data = await response.json();
            
            if (data.status === 'success' && data.user) {
                this.currentUser = data.user;
                this.updateUIForLoggedInUser();
            } else {
                this.updateUIForLoggedOutUser();
            }
        } catch (error) {
            console.error('Error checking auth status:', error);
        }
    }

    async login(email, password) {
        try {
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'login',
                    email: email,
                    password: password
                })
            });
            const data = await response.json();
            
            if (data.status === 'success') {
                this.currentUser = data.user;
                this.updateUIForLoggedInUser();
                return { success: true };
            } else {
                return { success: false, message: data.message };
            }
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, message: 'An error occurred during login.' };
        }
    }

    async register(username, email, password) {
        try {
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'register',
                    username: username,
                    email: email,
                    password: password
                })
            });
            const data = await response.json();
            
            if (data.status === 'success') {
                return { success: true, message: data.message };
            } else {
                return { success: false, message: data.message };
            }
        } catch (error) {
            console.error('Registration error:', error);
            return { success: false, message: 'An error occurred during registration.' };
        }
    }

    async logout() {
        try {
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ action: 'logout' })
            });
            const data = await response.json();
            
            if (data.status === 'success') {
                this.currentUser = null;
                this.updateUIForLoggedOutUser();
                return true;
            }
            return false;
        } catch (error) {
            console.error('Logout error:', error);
            return false;
        }
    }

    updateUIForLoggedInUser() {
        // Update navigation
        const loginLinks = document.querySelectorAll('.login-link');
        const registerLinks = document.querySelectorAll('.register-link');
        const logoutLinks = document.querySelectorAll('.logout-link');
        const userMenu = document.querySelector('.user-menu');
        
        loginLinks.forEach(link => link.style.display = 'none');
        registerLinks.forEach(link => link.style.display = 'none');
        logoutLinks.forEach(link => link.style.display = 'block');
        if (userMenu) {
            userMenu.style.display = 'block';
            const usernameElement = userMenu.querySelector('.username');
            if (usernameElement) {
                usernameElement.textContent = this.currentUser.username;
            }
        }

        // Update reservation form if exists
        const reservationForm = document.querySelector('.reservation-form');
        if (reservationForm) {
            const userFields = reservationForm.querySelectorAll('.user-field');
            userFields.forEach(field => {
                field.value = this.currentUser[field.dataset.userField] || '';
                field.disabled = true;
            });
        }
    }

    updateUIForLoggedOutUser() {
        // Update navigation
        const loginLinks = document.querySelectorAll('.login-link');
        const registerLinks = document.querySelectorAll('.register-link');
        const logoutLinks = document.querySelectorAll('.logout-link');
        const userMenu = document.querySelector('.user-menu');
        
        loginLinks.forEach(link => link.style.display = 'block');
        registerLinks.forEach(link => link.style.display = 'block');
        logoutLinks.forEach(link => link.style.display = 'none');
        if (userMenu) {
            userMenu.style.display = 'none';
        }

        // Update reservation form if exists
        const reservationForm = document.querySelector('.reservation-form');
        if (reservationForm) {
            const userFields = reservationForm.querySelectorAll('.user-field');
            userFields.forEach(field => {
                field.disabled = false;
            });
        }
    }

    setupEventListeners() {
        // Login form handler
        const loginForm = document.querySelector('.login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const email = loginForm.querySelector('[name="email"]').value;
                const password = loginForm.querySelector('[name="password"]').value;
                
                const result = await this.login(email, password);
                if (result.success) {
                    // Redirect or show success message
                    window.location.href = '/';
                } else {
                    // Show error message
                    const errorElement = loginForm.querySelector('.error-message');
                    if (errorElement) {
                        errorElement.textContent = result.message;
                        errorElement.style.display = 'block';
                    }
                }
            });
        }

        // Register form handler
        const registerForm = document.querySelector('.register-form');
        if (registerForm) {
            registerForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const username = registerForm.querySelector('[name="username"]').value;
                const email = registerForm.querySelector('[name="email"]').value;
                const password = registerForm.querySelector('[name="password"]').value;
                
                const result = await this.register(username, email, password);
                if (result.success) {
                    // Redirect to login or show success message
                    window.location.href = '/login.html';
                } else {
                    // Show error message
                    const errorElement = registerForm.querySelector('.error-message');
                    if (errorElement) {
                        errorElement.textContent = result.message;
                        errorElement.style.display = 'block';
                    }
                }
            });
        }

        // Logout handler
        const logoutButtons = document.querySelectorAll('.logout-link');
        logoutButtons.forEach(button => {
            button.addEventListener('click', async (e) => {
                e.preventDefault();
                await this.logout();
                window.location.href = '/';
            });
        });
    }
}

// Initialize auth handler when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.authHandler = new AuthHandler();
}); 