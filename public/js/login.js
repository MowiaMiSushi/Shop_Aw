class LoginManager {
    constructor() {
        this.modal = document.getElementById('loginModal');
        this.loginForm = document.getElementById('loginForm');
        this.closeBtn = document.querySelector('.close');
        this.loginTriggers = document.querySelectorAll('[href="/konto"], [href="/logowanie"]');
        
        this.init();
    }

    init() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Otwieranie modalu
        this.loginTriggers.forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                this.openModal();
            });
        });

        // Zamykanie modalu
        this.closeBtn.addEventListener('click', () => this.closeModal());
        window.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeModal();
            }
        });

        // Obsługa formularza logowania
        this.loginForm.addEventListener('submit', (e) => this.handleLogin(e));
    }

    openModal() {
        this.modal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Blokuje scrollowanie strony pod modalem
    }

    closeModal() {
        this.modal.style.display = 'none';
        document.body.style.overflow = ''; // Przywraca scrollowanie
    }

    async handleLogin(e) {
        e.preventDefault();
        const formData = new FormData(this.loginForm);
        const email = formData.get('email');
        const password = formData.get('password');

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                // Zapisz token w localStorage
                localStorage.setItem('token', data.token);
                // Zamknij modal i odśwież stronę
                this.closeModal();
                window.location.reload();
            } else {
                // Pokaż błąd
                alert(data.error || 'Błąd logowania');
            }
        } catch (error) {
            console.error('Błąd logowania:', error);
            alert('Wystąpił błąd podczas logowania');
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new LoginManager();
}); 