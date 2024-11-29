class AddressManager {
    constructor() {
        this.addresses = [];
        this.init();
    }

    async init() {
        await this.loadAddresses();
        this.setupEventListeners();
    }

    async loadAddresses() {
        try {
            showLoadingState();
            const response = await fetch('/api/user/addresses');
            this.addresses = await response.json();
            this.renderAddresses();
        } catch (error) {
            showError('Nie udało się załadować adresów');
            console.error(error);
        } finally {
            hideLoadingState();
        }
    }

    renderAddresses() {
        const container = document.querySelector('.addresses-grid');
        if (!container) return;

        if (this.addresses.length === 0) {
            container.innerHTML = `
                <div class="no-addresses">
                    <i class="fas fa-map-marker-alt"></i>
                    <p>Nie masz jeszcze żadnych zapisanych adresów</p>
                </div>
            `;
            return;
        }

        container.innerHTML = this.addresses.map(address => this.createAddressCard(address)).join('');
    }

    createAddressCard(address) {
        return `
            <div class="address-card" data-address-id="${address.id}">
                <div class="address-header">
                    <h3>
                        <i class="fas fa-map-marker-alt"></i>
                        ${address.name}
                    </h3>
                    <div class="address-badges">
                        ${address.isDefault ? '<span class="badge primary">Domyślny</span>' : ''}
                        ${address.isBilling ? '<span class="badge">Rozliczeniowy</span>' : ''}
                    </div>
                </div>
                <div class="address-content">
                    <p class="name">${address.firstName} ${address.lastName}</p>
                    <p>${address.street}</p>
                    <p>${address.postalCode} ${address.city}</p>
                    <p>${address.country}</p>
                    <p class="phone">${address.phone}</p>
                </div>
                <div class="address-actions">
                    ${!address.isDefault ? `
                        <button class="btn-text" onclick="addressManager.setAsDefault('${address.id}')">
                            Ustaw jako domyślny
                        </button>
                    ` : ''}
                    <button class="btn-secondary" onclick="addressManager.editAddress('${address.id}')">
                        <i class="fas fa-edit"></i> Edytuj
                    </button>
                    <button class="btn-danger" onclick="addressManager.deleteAddress('${address.id}')">
                        <i class="fas fa-trash"></i> Usuń
                    </button>
                </div>
            </div>
        `;
    }

    setupEventListeners() {
        const addButton = document.querySelector('.add-address-btn');
        if (addButton) {
            addButton.addEventListener('click', () => this.showAddressModal());
        }
    }

    async setAsDefault(addressId) {
        try {
            showLoadingState();
            await fetch(`/api/user/addresses/${addressId}/default`, {
                method: 'PUT'
            });
            await this.loadAddresses();
            showSuccess('Adres został ustawiony jako domyślny');
        } catch (error) {
            showError('Nie udało się ustawić adresu jako domyślnego');
            console.error(error);
        } finally {
            hideLoadingState();
        }
    }

    showAddressModal(addressData = null) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h2>${addressData ? 'Edytuj adres' : 'Dodaj nowy adres'}</h2>
                <form id="address-form">
                    <!-- Pola formularza -->
                    <div class="form-group">
                        <label for="name">Nazwa adresu</label>
                        <input type="text" id="name" name="name" value="${addressData?.name || ''}" required>
                    </div>
                    <!-- Pozostałe pola formularza -->
                    <div class="modal-actions">
                        <button type="button" class="btn-secondary" onclick="this.closest('.modal').remove()">
                            Anuluj
                        </button>
                        <button type="submit" class="btn-primary">
                            ${addressData ? 'Zapisz zmiany' : 'Dodaj adres'}
                        </button>
                    </div>
                </form>
            </div>
        `;

        document.body.appendChild(modal);
        
        const form = modal.querySelector('#address-form');
        form.addEventListener('submit', (e) => this.handleAddressSubmit(e, addressData?.id));
    }

    async handleAddressSubmit(event, addressId = null) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData.entries());

        try {
            showLoadingState();
            const url = addressId ? 
                `/api/user/addresses/${addressId}` : 
                '/api/user/addresses';
            
            await fetch(url, {
                method: addressId ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            await this.loadAddresses();
            event.target.closest('.modal').remove();
            showSuccess(`Adres został ${addressId ? 'zaktualizowany' : 'dodany'}`);
        } catch (error) {
            showError(`Nie udało się ${addressId ? 'zaktualizować' : 'dodać'} adresu`);
            console.error(error);
        } finally {
            hideLoadingState();
        }
    }

    async editAddress(addressId) {
        const address = this.addresses.find(a => a.id === addressId);
        if (address) {
            this.showAddressModal(address);
        }
    }

    async deleteAddress(addressId) {
        if (!confirm('Czy na pewno chcesz usunąć ten adres?')) return;

        try {
            showLoadingState();
            await fetch(`/api/user/addresses/${addressId}`, {
                method: 'DELETE'
            });
            await this.loadAddresses();
            showSuccess('Adres został usunięty');
        } catch (error) {
            showError('Nie udało się usunąć adresu');
            console.error(error);
        } finally {
            hideLoadingState();
        }
    }
}

// Funkcje pomocnicze
function showLoadingState() {
    document.querySelector('.addresses-section').classList.add('loading');
}

function hideLoadingState() {
    document.querySelector('.addresses-section').classList.remove('loading');
}

function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    document.querySelector('.addresses-section').prepend(errorDiv);
    setTimeout(() => errorDiv.remove(), 5000);
}

function showSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    document.querySelector('.addresses-section').prepend(successDiv);
    setTimeout(() => successDiv.remove(), 5000);
}

// Inicjalizacja
let addressManager;
document.addEventListener('DOMContentLoaded', () => {
    addressManager = new AddressManager();
}); 