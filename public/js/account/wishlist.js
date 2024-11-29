class WishlistManager {
    constructor() {
        this.items = [];
        this.init();
    }

    async init() {
        await this.loadWishlist();
        this.setupEventListeners();
    }

    async loadWishlist() {
        try {
            showLoadingState();
            const response = await fetch('/api/user/wishlist');
            this.items = await response.json();
            this.renderWishlist();
        } catch (error) {
            showError('Nie udało się załadować listy życzeń');
            console.error(error);
        } finally {
            hideLoadingState();
        }
    }

    renderWishlist() {
        const container = document.querySelector('.wishlist-grid');
        if (!container) return;

        if (this.items.length === 0) {
            container.innerHTML = `
                <div class="no-items">
                    <i class="fas fa-heart"></i>
                    <p>Twoja lista życzeń jest pusta</p>
                    <a href="/shop" class="btn-primary">Przejdź do sklepu</a>
                </div>
            `;
            return;
        }

        container.innerHTML = this.items.map(item => this.createWishlistItem(item)).join('');
        this.updateWishlistCount();
    }

    createWishlistItem(item) {
        return `
            <div class="wishlist-item ${!item.available ? 'unavailable' : ''}" data-item-id="${item.id}">
                <div class="item-image">
                    <img src="${item.image}" alt="${item.name}">
                    <button class="remove-btn" onclick="wishlistManager.removeItem('${item.id}')" aria-label="Usuń z listy życzeń">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <div class="item-details">
                    <h3 class="item-name">${item.name}</h3>
                    <div class="item-price">
                        ${item.oldPrice ? `<span class="old-price">${formatPrice(item.oldPrice)}</span>` : ''}
                        <span class="current-price">${formatPrice(item.price)}</span>
                    </div>
                    ${!item.available ? `
                        <div class="item-status out-of-stock">
                            <i class="fas fa-times"></i> Niedostępny
                        </div>
                    ` : ''}
                </div>

                <div class="item-actions">
                    ${item.available ? `
                        <button class="btn-primary" onclick="wishlistManager.addToCart('${item.id}')">
                            <i class="fas fa-shopping-cart"></i>
                            Dodaj do koszyka
                        </button>
                    ` : `
                        <button class="btn-secondary notify-btn" onclick="wishlistManager.notifyAvailability('${item.id}')">
                            <i class="fas fa-bell"></i>
                            Powiadom o dostępności
                        </button>
                    `}
                </div>
            </div>
        `;
    }

    setupEventListeners() {
        const sortSelect = document.querySelector('.sort-select');
        if (sortSelect) {
            sortSelect.addEventListener('change', () => this.sortItems(sortSelect.value));
        }
    }

    updateWishlistCount() {
        const countElement = document.querySelector('.wishlist-count strong');
        if (countElement) {
            countElement.textContent = this.items.length;
        }
    }

    sortItems(sortBy) {
        const sortedItems = [...this.items].sort((a, b) => {
            switch (sortBy) {
                case 'newest':
                    return new Date(b.addedDate) - new Date(a.addedDate);
                case 'price-asc':
                    return a.price - b.price;
                case 'price-desc':
                    return b.price - a.price;
                case 'name-asc':
                    return a.name.localeCompare(b.name);
                default:
                    return 0;
            }
        });

        this.items = sortedItems;
        this.renderWishlist();
    }

    async removeItem(itemId) {
        try {
            showLoadingState();
            await fetch(`/api/user/wishlist/${itemId}`, {
                method: 'DELETE'
            });
            this.items = this.items.filter(item => item.id !== itemId);
            this.renderWishlist();
            showSuccess('Produkt został usunięty z listy życzeń');
        } catch (error) {
            showError('Nie udało się usunąć produktu z listy życzeń');
            console.error(error);
        } finally {
            hideLoadingState();
        }
    }

    async addToCart(itemId) {
        try {
            showLoadingState();
            await fetch('/api/cart/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ itemId, quantity: 1 })
            });
            showSuccess('Produkt został dodany do koszyka');
        } catch (error) {
            showError('Nie udało się dodać produktu do koszyka');
            console.error(error);
        } finally {
            hideLoadingState();
        }
    }

    async notifyAvailability(itemId) {
        try {
            showLoadingState();
            await fetch(`/api/notifications/availability/${itemId}`, {
                method: 'POST'
            });
            showSuccess('Powiadomimy Cię o dostępności produktu');
        } catch (error) {
            showError('Nie udało się zapisać powiadomienia');
            console.error(error);
        } finally {
            hideLoadingState();
        }
    }
}

// Funkcje pomocnicze
function formatPrice(price) {
    return new Intl.NumberFormat('pl-PL', {
        style: 'currency',
        currency: 'PLN'
    }).format(price);
}

function showLoadingState() {
    document.querySelector('.wishlist-section').classList.add('loading');
}

function hideLoadingState() {
    document.querySelector('.wishlist-section').classList.remove('loading');
}

function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    document.querySelector('.wishlist-section').prepend(errorDiv);
    setTimeout(() => errorDiv.remove(), 5000);
}

function showSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    document.querySelector('.wishlist-section').prepend(successDiv);
    setTimeout(() => successDiv.remove(), 5000);
}

// Inicjalizacja
let wishlistManager;
document.addEventListener('DOMContentLoaded', () => {
    wishlistManager = new WishlistManager();
}); 