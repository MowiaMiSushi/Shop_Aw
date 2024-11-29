// Klasa reprezentująca status zamówienia
const OrderStatus = {
    PENDING: 'pending',
    PROCESSING: 'processing',
    SHIPPED: 'shipped',
    DELIVERED: 'delivered',
    CANCELLED: 'cancelled'
};

// Pobieranie zamówień użytkownika
async function getUserOrders() {
    try {
        // W rzeczywistej aplikacji tutaj byłoby zapytanie do API
        const response = await fetch('/api/user/orders');
        const orders = await response.json();
        return orders;
    } catch (error) {
        console.error('Błąd podczas pobierania zamówień:', error);
        return null;
    }
}

// Formatowanie daty
function formatDate(dateString) {
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('pl-PL', options);
}

// Formatowanie ceny
function formatPrice(price) {
    return new Intl.NumberFormat('pl-PL', {
        style: 'currency',
        currency: 'PLN'
    }).format(price);
}

// Generowanie HTML dla statusu zamówienia
function getStatusHTML(status) {
    const statusClasses = {
        [OrderStatus.PENDING]: 'pending',
        [OrderStatus.PROCESSING]: 'processing',
        [OrderStatus.SHIPPED]: 'shipped',
        [OrderStatus.DELIVERED]: 'delivered',
        [OrderStatus.CANCELLED]: 'cancelled'
    };

    const statusTranslations = {
        [OrderStatus.PENDING]: 'Oczekujące',
        [OrderStatus.PROCESSING]: 'W realizacji',
        [OrderStatus.SHIPPED]: 'Wysłane',
        [OrderStatus.DELIVERED]: 'Dostarczone',
        [OrderStatus.CANCELLED]: 'Anulowane'
    };

    const statusIcons = {
        [OrderStatus.PENDING]: 'clock',
        [OrderStatus.PROCESSING]: 'cog',
        [OrderStatus.SHIPPED]: 'truck',
        [OrderStatus.DELIVERED]: 'check-circle',
        [OrderStatus.CANCELLED]: 'times-circle'
    };

    return `
        <div class="order-status ${statusClasses[status]}">
            <i class="fas fa-${statusIcons[status]}"></i>
            <span>${statusTranslations[status]}</span>
        </div>
    `;
}

// Generowanie HTML dla pojedynczego zamówienia
function createOrderHTML(order) {
    return `
        <div class="order-card" data-order-id="${order.id}">
            <div class="order-header">
                <div class="order-info">
                    <h3>Zamówienie #${order.orderNumber}</h3>
                    <p class="order-date">${formatDate(order.date)}</p>
                </div>
                ${getStatusHTML(order.status)}
            </div>
            
            <div class="order-products">
                ${order.products.map(product => `
                    <div class="order-product">
                        <img src="${product.image}" alt="${product.name}">
                        <div class="product-info">
                            <h4>${product.name}</h4>
                            <p class="product-variant">
                                ${product.variant ? `Wariant: ${product.variant}` : ''}
                            </p>
                            <p class="product-quantity">Ilość: ${product.quantity}</p>
                            <p class="product-price">${formatPrice(product.price)}</p>
                        </div>
                    </div>
                `).join('')}
            </div>

            <div class="order-summary">
                <div class="summary-item">
                    <span>Wartość produktów:</span>
                    <span>${formatPrice(order.subtotal)}</span>
                </div>
                <div class="summary-item">
                    <span>Dostawa:</span>
                    <span>${formatPrice(order.shipping)}</span>
                </div>
                ${order.discount ? `
                    <div class="summary-item discount">
                        <span>Rabat:</span>
                        <span>-${formatPrice(order.discount)}</span>
                    </div>
                ` : ''}
                <div class="summary-item total">
                    <span>Razem:</span>
                    <span>${formatPrice(order.total)}</span>
                </div>
            </div>

            <div class="order-actions">
                <button class="btn-secondary" onclick="showOrderDetails('${order.id}')">
                    <i class="fas fa-eye"></i>
                    Szczegóły zamówienia
                </button>
                ${order.status === OrderStatus.DELIVERED ? `
                    <button class="btn-primary" onclick="addReview('${order.id}')">
                        <i class="fas fa-star"></i>
                        Oceń produkty
                    </button>
                ` : ''}
                ${order.status === OrderStatus.PENDING ? `
                    <button class="btn-danger" onclick="cancelOrder('${order.id}')">
                        <i class="fas fa-times"></i>
                        Anuluj zamówienie
                    </button>
                ` : ''}
            </div>
        </div>
    `;
}

// Filtrowanie zamówień
function filterOrders(orders, filters) {
    return orders.filter(order => {
        if (filters.status && filters.status !== 'all' && order.status !== filters.status) {
            return false;
        }
        if (filters.dateFrom && new Date(order.date) < new Date(filters.dateFrom)) {
            return false;
        }
        if (filters.dateTo && new Date(order.date) > new Date(filters.dateTo)) {
            return false;
        }
        return true;
    });
}

// Sortowanie zamówień
function sortOrders(orders, sortBy) {
    return [...orders].sort((a, b) => {
        switch (sortBy) {
            case 'date-desc':
                return new Date(b.date) - new Date(a.date);
            case 'date-asc':
                return new Date(a.date) - new Date(b.date);
            case 'total-desc':
                return b.total - a.total;
            case 'total-asc':
                return a.total - b.total;
            default:
                return 0;
        }
    });
}

// Aktualizacja interfejsu
function updateOrdersUI(orders) {
    const ordersContainer = document.querySelector('.orders-grid');
    if (!ordersContainer) return;

    if (orders.length === 0) {
        ordersContainer.innerHTML = `
            <div class="no-orders">
                <i class="fas fa-shopping-bag"></i>
                <h3>Brak zamówień</h3>
                <p>Nie masz jeszcze żadnych zamówień</p>
                <a href="/shop" class="btn-primary">Przejdź do sklepu</a>
            </div>
        `;
        return;
    }

    ordersContainer.innerHTML = orders.map(order => createOrderHTML(order)).join('');
}

// Obsługa filtrów i sortowania
function setupFiltersAndSort() {
    const statusFilter = document.getElementById('status-filter');
    const dateFromFilter = document.getElementById('date-from');
    const dateToFilter = document.getElementById('date-to');
    const sortSelect = document.getElementById('sort-select');

    async function updateOrders() {
        const filters = {
            status: statusFilter.value,
            dateFrom: dateFromFilter.value,
            dateTo: dateToFilter.value
        };

        const orders = await getUserOrders();
        if (!orders) return;

        const filteredOrders = filterOrders(orders, filters);
        const sortedOrders = sortOrders(filteredOrders, sortSelect.value);
        updateOrdersUI(sortedOrders);
    }

    // Dodanie event listenerów
    [statusFilter, dateFromFilter, dateToFilter, sortSelect].forEach(element => {
        element.addEventListener('change', updateOrders);
    });
}

// Inicjalizacja strony
async function initOrdersPage() {
    try {
        showLoadingState();
        const orders = await getUserOrders();
        if (orders) {
            updateOrdersUI(orders);
            setupFiltersAndSort();
        }
    } catch (error) {
        showError('Nie udało się załadować zamówień');
        console.error(error);
    } finally {
        hideLoadingState();
    }
}

// Funkcje pomocnicze dla stanu ładowania i błędów
function showLoadingState() {
    const content = document.querySelector('.orders-section');
    if (content) {
        content.classList.add('loading');
    }
}

function hideLoadingState() {
    const content = document.querySelector('.orders-section');
    if (content) {
        content.classList.remove('loading');
    }
}

function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    document.querySelector('.orders-section').prepend(errorDiv);
}

// Funkcje akcji dla zamówień
function showOrderDetails(orderId) {
    // Implementacja pokazywania szczegółów zamówienia
    console.log(`Pokazywanie szczegółów zamówienia: ${orderId}`);
}

function addReview(orderId) {
    // Implementacja dodawania recenzji
    console.log(`Dodawanie recenzji dla zamówienia: ${orderId}`);
}

function cancelOrder(orderId) {
    // Implementacja anulowania zamówienia
    console.log(`Anulowanie zamówienia: ${orderId}`);
}

// Nasłuchiwanie na załadowanie dokumentu
document.addEventListener('DOMContentLoaded', initOrdersPage);