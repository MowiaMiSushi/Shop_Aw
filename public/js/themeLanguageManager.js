import translations from './translations.js';

class ThemeLanguageManager {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.currentLang = localStorage.getItem('lang') || 'pl';
        this.translations = translations;
        
        this.init();
    }

    init() {
        this.applyTheme();
        this.applyLanguage();
        this.setupEventListeners();
    }

    applyTheme() {
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        const themeIcon = document.getElementById('theme-icon');
        if (themeIcon) {
            themeIcon.className = this.currentTheme === 'light' ? 
                'fas fa-moon switch-icon' : 'fas fa-sun switch-icon';
        }
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        localStorage.setItem('theme', this.currentTheme);
        this.applyTheme();
    }

    applyLanguage() {
        document.documentElement.setAttribute('lang', this.currentLang);
        const langDisplay = document.querySelector('.current-lang');
        if (langDisplay) {
            langDisplay.textContent = this.currentLang.toUpperCase();
        }
        this.translatePage();
    }

    toggleLanguage() {
        this.currentLang = this.currentLang === 'pl' ? 'en' : 'pl';
        localStorage.setItem('lang', this.currentLang);
        this.applyLanguage();
    }

    translatePage() {
        const elements = document.querySelectorAll('[data-translate]');
        elements.forEach(element => {
            const key = element.getAttribute('data-translate');
            const translation = this.translations[this.currentLang][key];
            if (translation) {
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    element.placeholder = translation;
                } else {
                    element.textContent = translation;
                }
            }
        });
    }

    setupEventListeners() {
        const themeSwitch = document.querySelector('.theme-switch');
        const langSwitch = document.querySelector('.lang-switch');

        if (themeSwitch) {
            themeSwitch.addEventListener('click', () => this.toggleTheme());
        }
        if (langSwitch) {
            langSwitch.addEventListener('click', () => this.toggleLanguage());
        }
    }
}

export default ThemeLanguageManager; 