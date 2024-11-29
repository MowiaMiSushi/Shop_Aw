import ThemeLanguageManager from './themeLanguageManager.js';

// Klasa do zarządzania koszykiem
class Cart {
    constructor(themeLanguageManager) {
        this.items = [];
        this.total = 0;
        this.themeLanguageManager = themeLanguageManager;
    }

    addItem(product) {
        this.items.push(product);
        this.calculateTotal();
        this.updateCartDisplay();
        this.updateCartDropdown();
    }

    calculateTotal() {
        this.total = this.items.reduce((sum, item) => sum + item.price, 0);
    }

    updateCartDisplay() {
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            cartCount.textContent = this.items.length;
        }
    }

    updateCartDropdown() {
        const cartDropdown = document.querySelector('.cart-dropdown');
        if (!cartDropdown) return;

        cartDropdown.innerHTML = this.items.length ? this.items.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.translations[this.themeLanguageManager.currentLang].name}">
                <div class="item-details">
                    <h4>${item.translations[this.themeLanguageManager.currentLang].name}</h4>
                    <p>${item.price.toFixed(2)} zł</p>
                </div>
            </div>
        `).join('') : '<p>Koszyk jest pusty</p>';
    }
}

// Klasa do zarządzania produktami
class ProductManager {
    constructor(cart, themeLanguageManager) {
        this.cart = cart;
        this.themeLanguageManager = themeLanguageManager;
        this.products = [];
    }

    async fetchProducts() {
        try {
            const response = await fetch('../data/products.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Błąd podczas pobierania produktów:', error);
            return [];
        }
    }

    displayProducts() {
        const productsGrid = document.querySelector('.products-grid');
        if (!productsGrid) return;

        productsGrid.innerHTML = this.products.map(product => `
            <div class="product-card">
                <img src="${product.image}" alt="${product.translations[this.themeLanguageManager.currentLang].name}">
                <h3>${product.translations[this.themeLanguageManager.currentLang].name}</h3>
                <p class="price">${product.price.toFixed(2)} zł</p>
                <p class="description">${product.translations[this.themeLanguageManager.currentLang].description}</p>
                <button class="add-to-cart" data-id="${product._id}">
                    ${this.themeLanguageManager.translations[this.themeLanguageManager.currentLang].addToCart}
                </button>
            </div>
        `).join('');

        this.setupProductEventListeners();
    }

    setupProductEventListeners() {
        const addToCartButtons = document.querySelectorAll('.add-to-cart');
        addToCartButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = e.target.dataset.id;
                const product = this.products.find(p => p._id === productId);
                if (product) {
                    this.cart.addItem(product);
                }
            });
        });
    }
}

// Inicjalizacja po załadowaniu dokumentu
document.addEventListener('DOMContentLoaded', () => {
    const themeLanguageManager = new ThemeLanguageManager();
    const cart = new Cart(themeLanguageManager);
    const productManager = new ProductManager(cart, themeLanguageManager);
    
    // Dodaj referencję do productManager w window
    window.productManager = productManager;
    
    productManager.fetchProducts();

    // Obsługa menu burger
    const burgerMenu = document.querySelector('.burger-menu');
    const navLinks = document.querySelector('.nav-links');

    if (burgerMenu && navLinks) {
        burgerMenu.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }
});
