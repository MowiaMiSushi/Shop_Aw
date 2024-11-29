// Obsługa formularza danych osobowych
class AccountDetails {
    constructor() {
        this.form = document.querySelector('.details-form');
        this.init();
    }

    async init() {
        await this.loadUserData();
        this.setupEventListeners();
    }

    async loadUserData() {
        try {
            showLoadingState();
            const response = await fetch('/api/user/profile');
            const userData = await response.json();
            this.fillFormData(userData);
        } catch (error) {
            showError('Nie udało się załadować danych użytkownika');
            console.error(error);
        } finally {
            hideLoadingState();
        }
    }

    fillFormData(userData) {
        const fields = ['firstName', 'lastName', 'email', 'phone'];
        fields.forEach(field => {
            const input = document.getElementById(field);
            if (input && userData[field]) {
                input.value = userData[field];
            }
        });

        // Wypełnij preferencje komunikacji
        const newsletterCheckbox = document.querySelector('input[name="newsletter"]');
        const smsCheckbox = document.querySelector('input[name="smsNotifications"]');
        
        if (newsletterCheckbox) newsletterCheckbox.checked = userData.newsletter;
        if (smsCheckbox) smsCheckbox.checked = userData.smsNotifications;
    }

    setupEventListeners() {
        if (this.form) {
            this.form.addEventListener('submit', this.handleSubmit.bind(this));
        }

        // Walidacja hasła w czasie rzeczywistym
        const newPasswordInput = document.getElementById('newPassword');
        const confirmPasswordInput = document.getElementById('confirmPassword');
        
        if (newPasswordInput && confirmPasswordInput) {
            confirmPasswordInput.addEventListener('input', () => {
                this.validatePasswords(newPasswordInput.value, confirmPasswordInput.value);
            });
        }
    }

    validatePasswords(newPassword, confirmPassword) {
        const confirmInput = document.getElementById('confirmPassword');
        const errorDiv = document.querySelector('.password-error');
        
        if (newPassword && confirmPassword && newPassword !== confirmPassword) {
            confirmInput.classList.add('error');
            if (!errorDiv) {
                const error = document.createElement('div');
                error.className = 'password-error error-message';
                error.textContent = 'Hasła nie są identyczne';
                confirmInput.parentNode.appendChild(error);
            }
            return false;
        } else {
            confirmInput.classList.remove('error');
            if (errorDiv) errorDiv.remove();
            return true;
        }
    }

    async handleSubmit(event) {
        event.preventDefault();
        
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData.entries());

        // Walidacja hasła
        if (data.newPassword) {
            if (!this.validatePasswords(data.newPassword, data.confirmPassword)) {
                return;
            }
        }

        try {
            showLoadingState();
            const response = await fetch('/api/user/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) throw new Error('Błąd aktualizacji danych');

            showSuccess('Dane zostały zaktualizowane');
        } catch (error) {
            showError('Nie udało się zaktualizować danych');
            console.error(error);
        } finally {
            hideLoadingState();
        }
    }
}

// Funkcje pomocnicze
function showLoadingState() {
    document.querySelector('.details-section').classList.add('loading');
}

function hideLoadingState() {
    document.querySelector('.details-section').classList.remove('loading');
}

function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    document.querySelector('.details-section').prepend(errorDiv);
    setTimeout(() => errorDiv.remove(), 5000);
}

function showSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    document.querySelector('.details-section').prepend(successDiv);
    setTimeout(() => successDiv.remove(), 5000);
}

// Inicjalizacja
document.addEventListener('DOMContentLoaded', () => {
    new AccountDetails();
}); 