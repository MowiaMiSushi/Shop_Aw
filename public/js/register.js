document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Pobierz wartości z formularza
            const formData = {
                firstName: document.getElementById('firstName').value,
                lastName: document.getElementById('lastName').value,
                email: document.getElementById('email').value,
                password: document.getElementById('password').value,
                confirmPassword: document.getElementById('confirmPassword').value
            };

            // Podstawowa walidacja
            if (formData.password !== formData.confirmPassword) {
                showError('Hasła nie są identyczne');
                return;
            }

            try {
                const response = await fetch('/api/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });

                const data = await response.json();

                if (response.ok) {
                    showSuccess('Rejestracja zakończona pomyślnie');
                    setTimeout(() => {
                        window.location.href = '/logowanie';
                    }, 2000);
                } else {
                    showError(data.message || 'Błąd podczas rejestracji');
                }
            } catch (error) {
                showError('Wystąpił błąd podczas połączenia z serwerem');
            }
        });
    }

    // Funkcje pomocnicze do wyświetlania komunikatów
    function showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        insertMessage(errorDiv);
    }

    function showSuccess(message) {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.textContent = message;
        insertMessage(successDiv);
    }

    function insertMessage(messageElement) {
        const form = document.getElementById('registerForm');
        const existingMessage = form.querySelector('.error-message, .success-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        form.insertBefore(messageElement, form.firstChild);
    }
}); 