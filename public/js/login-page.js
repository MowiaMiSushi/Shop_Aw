class LoginPage {
    constructor() {
        this.form = document.getElementById('loginPageForm');
        this.init();
    }

    init() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.form.addEventListener('submit', (e) => this.handleLogin(e));
        
        // Obsługa logowania przez social media
        const googleBtn = document.querySelector('.social-button.google');
        const facebookBtn = document.querySelector('.social-button.facebook');
        
        if (googleBtn) {
            googleBtn.addEventListener('click', () => this.handleSocialLogin('google'));
        }
        
        if (facebookBtn) {
            facebookBtn.addEventListener('click', () => this.handleSocialLogin('facebook'));
        }
    }

    async handleLogin(e) {
        e.preventDefault();
        const formData = new FormData(this.form);
        const email = formData.get('email');
        const password = formData.get('password');
        const remember = formData.get('remember') === 'on';

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password, remember }),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.token);
                window.location.href = '/'; // Przekierowanie na stronę główną
            } else {
                this.showError(data.error || 'Błąd logowania');
            }
        } catch (error) {
            console.error('Błąd logowania:', error);
            this.showError('Wystąpił błąd podczas logowania');
        }
    }

    handleSocialLogin(provider) {
        // Tutaj implementacja logowania przez social media
        console.log(`Logowanie przez ${provider}`);
    }

    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        
        const form = document.getElementById('loginPageForm');
        const existingError = form.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        form.insertBefore(errorDiv, form.firstChild);
        
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new LoginPage();
}); 