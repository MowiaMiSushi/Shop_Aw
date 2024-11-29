class CartPage {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('cartItems')) || [];
        this.init();
    }

    init() {
        this.renderItems();
        this.updateSummary();
        this.setupEventListeners();
    }

    renderItems() {
        const cartItems = document.querySelector('.cart-items');
        cartItems.innerHTML = this.items.map(item => `
            <div class="cart-item" data-id="${item.id}">
                <img src="${item.image}" alt="${item.name}">
                <div class="item-details">
                    <h3>${item.name}</h3>
                    <p class="price">${item.price.toFixed(2)} zł</p>
                    <div class="quantity-controls">
                        <button class="quantity-btn minus">-</button>
                        <input type="number" value="${item.quantity}" min="1" max="99">
                        <button class="quantity-btn plus">+</button>
                    </div>
                </div>
                <button class="remove-item"><i class="fas fa-trash"></i></button>
            </div>
        `).join('');
    }

    updateSummary() {
        const subtotal = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const shipping = subtotal > 200 ? 0 : 15;
        const total = subtotal + shipping;

        document.querySelector('.cart-subtotal').textContent = `${subtotal.toFixed(2)} zł`;
        document.querySelector('.shipping-cost').textContent = `${shipping.toFixed(2)} zł`;
        document.querySelector('.cart-total').textContent = `${total.toFixed(2)} zł`;
    }

    setupEventListeners() {
        // Implementacja obsługi zdarzeń
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new CartPage();
}); 