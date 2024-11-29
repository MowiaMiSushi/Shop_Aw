// Pobieranie danych użytkownika
async function getUserData() {
    try {
        // W rzeczywistej aplikacji tutaj byłoby zapytanie do API
        const response = await fetch('/api/user/profile');
        const userData = await response.json();
        return userData;
    } catch (error) {
        console.error('Błąd podczas pobierania danych użytkownika:', error);
        return null;
    }
}

// Aktualizacja danych w interfejsie
function updateUserInterface(userData) {
    if (!userData) return;

    // Aktualizacja emaila w karcie statusu
    const subscribedEmail = document.querySelector('[data-translate="subscribedEmail"]');
    if (subscribedEmail) {
        subscribedEmail.textContent = `Email: ${userData.email}`;
    }

    // Aktualizacja statusu subskrypcji
    const statusCard = document.querySelector('.status-card');
    if (statusCard) {
        statusCard.classList.toggle('active', userData.newsletterActive);
    }

    // Aktualizacja preferencji
    if (userData.preferences) {
        const checkboxes = document.querySelectorAll('.preference-item input[type="checkbox"]');
        checkboxes.forEach((checkbox, index) => {
            if (userData.preferences[index]) {
                checkbox.checked = userData.preferences[index];
            }
        });
    }

    // Aktualizacja częstotliwości
    if (userData.frequency) {
        const frequencyInput = document.querySelector(`input[name="frequency"][value="${userData.frequency}"]`);
        if (frequencyInput) {
            frequencyInput.checked = true;
        }
    }
}

// Inicjalizacja strony
async function initNewsletterPage() {
    const userData = await getUserData();
    if (userData) {
        updateUserInterface(userData);
    }
}

// Nasłuchiwanie na załadowanie dokumentu
document.addEventListener('DOMContentLoaded', initNewsletterPage); 

// Obsługa błędów
function showLoadingState() {
    const content = document.querySelector('.newsletter-section');
    if (content) {
        content.classList.add('loading');
    }
}

function hideLoadingState() {
    const content = document.querySelector('.newsletter-section');
    if (content) {
        content.classList.remove('loading');
    }
}

function showError(message) {
    // Implementacja wyświetlania błędu
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    document.querySelector('.newsletter-section').prepend(errorDiv);
}

// Zmodyfikuj funkcję initNewsletterPage
async function initNewsletterPage() {
    try {
        showLoadingState();
        const userData = await getUserData();
        if (userData) {
            updateUserInterface(userData);
        }
    } catch (error) {
        showError('Nie udało się załadować danych użytkownika');
        console.error(error);
    } finally {
        hideLoadingState();
    }
}