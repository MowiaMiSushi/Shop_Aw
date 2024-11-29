class AccountSidebar {
    constructor() {
        this.init();
    }

    init() {
        this.sidebar = document.querySelector('.account-sidebar');
        if (!this.sidebar) return;

        // Dodaj przycisk menu mobilnego
        this.addMobileToggle();
        this.mobileMenuToggle = this.sidebar.querySelector('.mobile-menu-toggle');
        this.accountNav = this.sidebar.querySelector('.account-nav');
        
        this.bindEvents();
    }

    addMobileToggle() {
        const toggle = document.createElement('div');
        toggle.className = 'mobile-menu-toggle';
        toggle.innerHTML = `
            <span></span>
            <span></span>
            <span></span>
        `;
        this.sidebar.insertBefore(toggle, this.sidebar.firstChild);
    }

    bindEvents() {
        this.mobileMenuToggle.addEventListener('click', () => {
            this.toggleSidebar();
        });

        // Zamykanie menu po kliknięciu poza nim
        document.addEventListener('click', (e) => {
            if (!this.sidebar.contains(e.target) && 
                this.accountNav.classList.contains('mobile-visible')) {
                this.closeSidebar();
            }
        });

        // Zamykanie menu przy zmianie szerokości ekranu
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                this.closeSidebar();
            }
        });
    }

    toggleSidebar() {
        this.accountNav.classList.toggle('mobile-visible');
        this.mobileMenuToggle.classList.toggle('active');
    }

    closeSidebar() {
        this.accountNav.classList.remove('mobile-visible');
        this.mobileMenuToggle.classList.remove('active');
    }
}

// Inicjalizacja
document.addEventListener('DOMContentLoaded', () => {
    new AccountSidebar();
});