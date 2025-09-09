// ================================
// LEVEL-UP GAMER - CARRITO DE COMPRAS CON LOCALSTORAGE
// Funcionalidades específicas del carrito
// ================================

// Variables específicas del carrito
let cartState = {
    items: [],
    subtotal: 0,
    shipping: 0,
    discount: 0,
    total: 0,
    discountCode: null
};

// Códigos de descuento válidos
const DISCOUNT_CODES = {
    'LEVELUP10': { percentage: 10, description: 'Descuento Level-Up 10%' },
    'GAMER20': { percentage: 20, description: 'Descuento Gamer 20%' },
    'FIRSTBUY': { percentage: 15, description: 'Primera compra 15%' },
    'DUOCUC': { percentage: 20, description: 'Estudiante Duoc UC 20%' }
};

// ================================
// INICIALIZACIÓN DEL CARRITO
// ================================

document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('/carrito/')) {
        initializeCart();
    }
});

function initializeCart() {
    // Esperar a que la base de datos esté cargada
    if (typeof PRODUCT_DATABASE === 'undefined') {
        // Cargar la base de datos de productos primero
        loadProductDatabase().then(() => {
            loadCartFromStorage();
            updateCartDisplay();
            setupCartEventListeners();
        });
    } else {
        loadCartFromStorage();
        updateCartDisplay();
        setupCartEventListeners();
    }
}

function loadProductDatabase() {
    return new Promise((resolve) => {
        if (typeof PRODUCT_DATABASE !== 'undefined') {
            resolve();
            return;
        }
        
        // Cargar el script de la base de datos
        const script = document.createElement('script');
        script.src = '../assets/js/products-database.js';
        script.onload = resolve;
        document.head.appendChild(script);
    });
}

function loadCartFromStorage() {
    try {
        const cartData = localStorage.getItem('levelup_cart');
        const cartItems = cartData ? JSON.parse(cartData) : [];
        
        // Convertir datos del localStorage a items del carrito con información completa
        cartState.items = cartItems.map(cartItem => {
            const product = getProductById(cartItem.productId);
            if (!product) return null;
            
            return {
                id: cartItem.productId,
                key: cartItem.key,
                name: product.name,
                price: product.price,
                image: product.image,
                sku: product.code,
                category: product.categoryName,
                quantity: cartItem.quantity,
                options: cartItem.options || {},
                stock: product.stock,
                addedAt: cartItem.addedAt
            };
        }).filter(item => item !== null); // Eliminar productos que ya no existen
        
        calculateCartTotals();
    } catch (error) {
        console.error('Error al cargar carrito:', error);
        cartState.items = [];
    }
}

function saveCartToStorage() {
    try {
        const cartData = cartState.items.map(item => ({
            productId: item.id,
            key: item.key,
            quantity: item.quantity,
            options: item.options,
            addedAt: item.addedAt
        }));
        
        localStorage.setItem('levelup_cart', JSON.stringify(cartData));
    } catch (error) {
        console.error('Error al guardar carrito:', error);
    }
}

// ================================
// CÁLCULOS DEL CARRITO
// ================================

function calculateCartTotals() {
    // Calcular subtotal
    cartState.subtotal = cartState.items.reduce((sum, item) => {
        return sum + (item.price * item.quantity);
    }, 0);

    // Calcular envío (gratis por encima de $50.000 CLP)
    cartState.shipping = cartState.subtotal >= 50000 ? 0 : 2990;

    // Aplicar descuento si existe
    cartState.discount = cartState.discountCode ? 
        (cartState.subtotal * cartState.discountCode.percentage / 100) : 0;

    // Calcular total
    cartState.total = cartState.subtotal + cartState.shipping - cartState.discount;
}

// ================================
// ACTUALIZACIÓN DE LA INTERFAZ
// ================================

function updateCartDisplay() {
    updateCartItems();
    updateCartSummary();
    updateEmptyState();
    updateGlobalCartCounter();
}

function updateCartItems() {
    const cartItemsContainer = document.getElementById('cartItems');
    if (!cartItemsContainer) return;

    if (cartState.items.length === 0) {
        cartItemsContainer.innerHTML = '';
        return;
    }

    cartItemsContainer.innerHTML = cartState.items.map(item => `
        <div class="cart-item" data-product-id="${item.id}">
            <div class="item-image">
                <img src="${item.image}" alt="${item.name}" 
                     onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22 viewBox=%220 0 100 100%22><rect width=%22100%22 height=%22100%22 fill=%22%23f0f0f0%22/><text x=%2250%22 y=%2250%22 text-anchor=%22middle%22 dy=%22.3em%22 font-family=%22Arial%22 font-size=%2224%22 fill=%22%23999%22>🎮</text></svg>'">
            </div>
            
            <div class="item-details">
                <h3 class="item-name">${item.name}</h3>
                <p class="item-price">$${formatPrice(item.price)} c/u</p>
                <p class="item-sku">Código: ${item.sku}</p>
                <p class="item-category">${item.category}</p>
                ${Object.keys(item.options).length > 0 ? `
                    <div class="item-options">
                        ${Object.entries(item.options).map(([key, value]) => 
                            `<span class="option-tag">${key}: ${value}</span>`
                        ).join('')}
                    </div>
                ` : ''}
            </div>
            
            <div class="item-quantity">
                <label for="quantity-${item.id}" class="sr-only">Cantidad de ${item.name}</label>
                <div class="quantity-controls">
                    <button 
                        type="button" 
                        class="quantity-btn decrease" 
                        onclick="changeItemQuantity('${item.id}', ${item.quantity - 1})"
                        ${item.quantity <= 1 ? 'disabled' : ''}
                        aria-label="Disminuir cantidad">
                        -
                    </button>
                    <input 
                        type="number" 
                        id="quantity-${item.id}"
                        class="quantity-input" 
                        value="${item.quantity}" 
                        min="1" 
                        max="${item.stock}"
                        onchange="changeItemQuantity('${item.id}', this.value)">
                    <button 
                        type="button" 
                        class="quantity-btn increase" 
                        onclick="changeItemQuantity('${item.id}', ${item.quantity + 1})"
                        ${item.quantity >= item.stock ? 'disabled' : ''}
                        aria-label="Aumentar cantidad">
                        +
                    </button>
                </div>
                <small class="stock-info">Stock: ${item.stock}</small>
            </div>
            
            <div class="item-total">
                <span class="total-price">$${formatPrice(item.price * item.quantity)}</span>
            </div>
            
            <div class="item-actions">
                <button 
                    type="button" 
                    class="remove-item-btn" 
                    onclick="removeItemFromCart('${item.id}')"
                    aria-label="Eliminar ${item.name} del carrito">
                    🗑️ Eliminar
                </button>
                <button 
                    type="button" 
                    class="save-later-btn" 
                    onclick="saveForLater('${item.id}')"
                    aria-label="Guardar ${item.name} para después">
                    ❤️ Guardar
                </button>
            </div>
        </div>
    `).join('');
}

function updateCartSummary() {
    // Actualizar subtotal
    const subtotalElement = document.getElementById('subtotal');
    if (subtotalElement) {
        subtotalElement.textContent = `$${formatPrice(cartState.subtotal)}`;
    }

    // Actualizar envío
    const shippingElement = document.getElementById('shipping');
    if (shippingElement) {
        shippingElement.textContent = cartState.shipping === 0 ? 'GRATIS' : `$${formatPrice(cartState.shipping)}`;
    }

    // Actualizar descuento
    const discountElement = document.getElementById('discount');
    if (discountElement) {
        if (cartState.discount > 0) {
            discountElement.textContent = `-$${formatPrice(cartState.discount)}`;
            discountElement.parentElement.style.display = 'flex';
        } else {
            discountElement.parentElement.style.display = 'none';
        }
    }

    // Actualizar total
    const totalElement = document.getElementById('total');
    if (totalElement) {
        totalElement.textContent = `$${formatPrice(cartState.total)}`;
    }

    // Mostrar mensaje de envío gratis
    updateShippingMessage();
}

function updateShippingMessage() {
    const shippingMessage = document.getElementById('shippingMessage');
    if (!shippingMessage) return;

    if (cartState.subtotal >= 50000) {
        shippingMessage.innerHTML = '🎉 ¡Tienes envío gratis!';
        shippingMessage.className = 'shipping-message success';
    } else {
        const remaining = 50000 - cartState.subtotal;
        shippingMessage.innerHTML = `📦 Agrega $${formatPrice(remaining)} más para envío gratis`;
        shippingMessage.className = 'shipping-message info';
    }
}

function updateEmptyState() {
    const cartContainer = document.getElementById('cartContainer');
    const emptyCart = document.getElementById('emptyCart');

    if (cartState.items.length === 0) {
        if (cartContainer) cartContainer.style.display = 'none';
        if (emptyCart) emptyCart.style.display = 'block';
    } else {
        if (cartContainer) cartContainer.style.display = 'block';
        if (emptyCart) emptyCart.style.display = 'none';
    }
}

// ================================
// GESTIÓN DE PRODUCTOS EN EL CARRITO
// ================================

function changeItemQuantity(productId, newQuantity) {
    newQuantity = parseInt(newQuantity);
    
    if (newQuantity < 1) {
        removeItemFromCart(productId);
        return;
    }

    const item = cartState.items.find(item => item.id === productId);
    if (!item) return;

    if (newQuantity > item.stock) {
        newQuantity = item.stock;
        showCartNotification(`Cantidad máxima disponible: ${item.stock} unidades`, 'warning');
    }

    item.quantity = newQuantity;
    saveCartToStorage();
    calculateCartTotals();
    updateCartDisplay();
    
    // Dar puntos por interacción con carrito
    if (window.gamificationSystem) {
        window.gamificationSystem.addPoints('cart_interaction');
    }
}

function removeItemFromCart(productId) {
    const itemIndex = cartState.items.findIndex(item => item.id === productId);
    if (itemIndex > -1) {
        const item = cartState.items[itemIndex];
        cartState.items.splice(itemIndex, 1);
        
        saveCartToStorage();
        calculateCartTotals();
        updateCartDisplay();
        
        showCartNotification(`${item.name} eliminado del carrito`, 'info');
    }
}

function clearCart() {
    if (cartState.items.length === 0) {
        showCartNotification('El carrito ya está vacío', 'info');
        return;
    }

    if (confirm('¿Estás seguro de que quieres vaciar todo el carrito?')) {
        cartState.items = [];
        cartState.discountCode = null;
        
        saveCartToStorage();
        calculateCartTotals();
        updateCartDisplay();
        
        showCartNotification('Carrito vaciado completamente', 'info');
    }
}

function saveForLater(productId) {
    const item = cartState.items.find(item => item.id === productId);
    if (item) {
        // Guardar en lista de deseados
        let savedItems = JSON.parse(localStorage.getItem('levelup_wishlist')) || [];
        if (!savedItems.includes(productId)) {
            savedItems.push(productId);
            localStorage.setItem('levelup_wishlist', JSON.stringify(savedItems));
        }
        
        removeItemFromCart(productId);
        showCartNotification(`${item.name} guardado en lista de deseos`, 'success');
    }
}

// ================================
// CÓDIGOS DE DESCUENTO
// ================================

function applyDiscountCode() {
    const codeInput = document.getElementById('discountCode');
    if (!codeInput) return;

    const code = codeInput.value.trim().toUpperCase();
    
    if (!code) {
        showCartNotification('Ingresa un código de descuento', 'warning');
        return;
    }

    if (DISCOUNT_CODES[code]) {
        cartState.discountCode = DISCOUNT_CODES[code];
        calculateCartTotals();
        updateCartDisplay();
        
        codeInput.value = '';
        codeInput.disabled = true;
        
        const applyBtn = document.getElementById('applyDiscountBtn');
        if (applyBtn) {
            applyBtn.textContent = 'Aplicado ✓';
            applyBtn.disabled = true;
        }
        
        showCartNotification(
            `Código aplicado: ${cartState.discountCode.description}`, 
            'success'
        );
    } else {
        showCartNotification('Código de descuento inválido', 'error');
        codeInput.focus();
    }
}

function removeDiscountCode() {
    cartState.discountCode = null;
    calculateCartTotals();
    updateCartDisplay();
    
    const codeInput = document.getElementById('discountCode');
    const applyBtn = document.getElementById('applyDiscountBtn');
    
    if (codeInput) {
        codeInput.disabled = false;
        codeInput.value = '';
    }
    
    if (applyBtn) {
        applyBtn.textContent = 'Aplicar';
        applyBtn.disabled = false;
    }
    
    showCartNotification('Código de descuento removido', 'info');
}

// ================================
// CHECKOUT
// ================================

function proceedToCheckout() {
    if (cartState.items.length === 0) {
        showCartNotification('Tu carrito está vacío', 'error');
        return;
    }

    // Verificar si el usuario está logueado
    const user = JSON.parse(localStorage.getItem('levelup_user') || 'null');
    if (!user) {
        showCartNotification('Debes iniciar sesión para continuar', 'warning');
        setTimeout(() => {
            window.location.href = '../usuario/';
        }, 1500);
        return;
    }

    // Simular proceso de checkout exitoso
    showCartNotification('Procesando compra...', 'info');
    
    setTimeout(() => {
        // Dar puntos por compra
        if (window.gamificationSystem) {
            const pointsToAdd = Math.floor(cartState.total / 1000); // 1 punto por cada $1000
            window.gamificationSystem.addPoints('purchase', pointsToAdd);
        }
        
        // Limpiar carrito después de la compra
        cartState.items = [];
        cartState.discountCode = null;
        saveCartToStorage();
        calculateCartTotals();
        updateCartDisplay();
        
        showCartNotification('¡Compra realizada exitosamente! 🎉', 'success');
    }, 2000);
}

// ================================
// UTILIDADES
// ================================

function updateGlobalCartCounter() {
    const cartBadge = document.querySelector('.cart-badge');
    const totalItems = cartState.items.reduce((sum, item) => sum + item.quantity, 0);
    
    if (cartBadge) {
        cartBadge.textContent = totalItems;
        cartBadge.style.display = totalItems > 0 ? 'block' : 'none';
    }
}

function setupCartEventListeners() {
    // Botón de vaciar carrito
    const clearCartBtn = document.querySelector('.product-button');
    if (clearCartBtn && clearCartBtn.textContent.includes('Vaciar')) {
        clearCartBtn.addEventListener('click', clearCart);
    }

    // Botón de checkout
    const checkoutBtn = document.querySelector('.cta-button');
    if (checkoutBtn && checkoutBtn.textContent.includes('Pago')) {
        checkoutBtn.addEventListener('click', proceedToCheckout);
    }
}

function getProductById(productId) {
    return window.PRODUCT_DATABASE ? window.PRODUCT_DATABASE[productId] : null;
}

function formatPrice(price) {
    return new Intl.NumberFormat('es-CL').format(Math.round(price));
}

function showCartNotification(message, type = 'info') {
    if (window.levelUpGamer && window.levelUpGamer.showNotification) {
        window.levelUpGamer.showNotification(message, type);
    } else {
        // Fallback visual
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
            color: white;
            border-radius: 4px;
            z-index: 10000;
        `;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    }
}

// Exponer funciones para uso global
window.cartManager = {
    changeItemQuantity,
    removeItemFromCart,
    clearCart,
    saveForLater,
    applyDiscountCode,
    removeDiscountCode,
    proceedToCheckout,
    loadCartFromStorage,
    updateCartDisplay
};

// ================================
// CÁLCULOS DEL CARRITO
// ================================

function calculateCartTotals() {
    // Calcular subtotal
    cartState.subtotal = cartState.items.reduce((sum, item) => {
        return sum + (item.price * item.quantity);
    }, 0);

    // Calcular envío (gratis por encima de $100)
    cartState.shipping = cartState.subtotal >= 100 ? 0 : 5.99;

    // Aplicar descuento si existe
    cartState.discount = cartState.discountCode ? 
        (cartState.subtotal * cartState.discountCode.percentage / 100) : 0;

    // Calcular total
    cartState.total = cartState.subtotal + cartState.shipping - cartState.discount;
}

// ================================
// ACTUALIZACIÓN DE LA INTERFAZ
// ================================

function updateCartDisplay() {
    updateCartItems();
    updateCartSummary();
    updateEmptyState();
}

function updateCartItems() {
    const cartItemsContainer = document.getElementById('cartItems');
    if (!cartItemsContainer) return;

    if (cartState.items.length === 0) {
        cartItemsContainer.innerHTML = '';
        return;
    }

    cartItemsContainer.innerHTML = cartState.items.map(item => `
        <div class="cart-item" data-product-id="${item.id}">
            <div class="item-image">
                ${item.image}
            </div>
            
            <div class="item-details">
                <h3 class="item-name">${item.name}</h3>
                <p class="item-price">$${item.price.toFixed(2)} c/u</p>
                <p class="item-sku">SKU: ${item.sku || 'N/A'}</p>
            </div>
            
            <div class="item-quantity">
                <label for="quantity-${item.id}" class="sr-only">Cantidad de ${item.name}</label>
                <div class="quantity-controls">
                    <button 
                        type="button" 
                        class="quantity-btn decrease" 
                        onclick="changeItemQuantity(${item.id}, ${item.quantity - 1})"
                        ${item.quantity <= 1 ? 'disabled' : ''}
                        aria-label="Disminuir cantidad">
                        -
                    </button>
                    <input 
                        type="number" 
                        id="quantity-${item.id}"
                        class="quantity-input" 
                        value="${item.quantity}" 
                        min="1" 
                        max="99"
                        onchange="changeItemQuantity(${item.id}, this.value)">
                    <button 
                        type="button" 
                        class="quantity-btn increase" 
                        onclick="changeItemQuantity(${item.id}, ${item.quantity + 1})"
                        ${item.quantity >= 99 ? 'disabled' : ''}
                        aria-label="Aumentar cantidad">
                        +
                    </button>
                </div>
            </div>
            
            <div class="item-total">
                <span class="total-price">$${(item.price * item.quantity).toFixed(2)}</span>
            </div>
            
            <div class="item-actions">
                <button 
                    type="button" 
                    class="remove-item-btn" 
                    onclick="removeItemFromCart(${item.id})"
                    aria-label="Eliminar ${item.name} del carrito">
                    🗑️ Eliminar
                </button>
                <button 
                    type="button" 
                    class="save-later-btn" 
                    onclick="saveForLater(${item.id})"
                    aria-label="Guardar ${item.name} para después">
                    ❤️ Guardar
                </button>
            </div>
        </div>
    `).join('');
}

function updateCartSummary() {
    // Actualizar subtotal
    const subtotalElement = document.getElementById('subtotal');
    if (subtotalElement) {
        subtotalElement.textContent = `$${cartState.subtotal.toFixed(2)}`;
    }

    // Actualizar envío
    const shippingElement = document.getElementById('shipping');
    if (shippingElement) {
        shippingElement.textContent = cartState.shipping === 0 ? 'GRATIS' : `$${cartState.shipping.toFixed(2)}`;
    }

    // Actualizar descuento
    const discountElement = document.getElementById('discount');
    if (discountElement) {
        if (cartState.discount > 0) {
            discountElement.textContent = `-$${cartState.discount.toFixed(2)}`;
            discountElement.parentElement.style.display = 'flex';
        } else {
            discountElement.parentElement.style.display = 'none';
        }
    }

    // Actualizar total
    const totalElement = document.getElementById('total');
    if (totalElement) {
        totalElement.textContent = `$${cartState.total.toFixed(2)}`;
    }

    // Mostrar mensaje de envío gratis
    updateShippingMessage();
}

function updateShippingMessage() {
    const shippingMessage = document.getElementById('shippingMessage');
    if (!shippingMessage) return;

    if (cartState.subtotal >= 100) {
        shippingMessage.innerHTML = '🎉 ¡Tienes envío gratis!';
        shippingMessage.className = 'shipping-message success';
    } else {
        const remaining = 100 - cartState.subtotal;
        shippingMessage.innerHTML = `📦 Agrega $${remaining.toFixed(2)} más para envío gratis`;
        shippingMessage.className = 'shipping-message info';
    }
}

function updateEmptyState() {
    const cartContainer = document.getElementById('cartContainer');
    const emptyCart = document.getElementById('emptyCart');

    if (cartState.items.length === 0) {
        if (cartContainer) cartContainer.style.display = 'none';
        if (emptyCart) emptyCart.style.display = 'block';
    } else {
        if (cartContainer) cartContainer.style.display = 'block';
        if (emptyCart) emptyCart.style.display = 'none';
    }
}

// ================================
// GESTIÓN DE PRODUCTOS EN EL CARRITO
// ================================

function changeItemQuantity(productId, newQuantity) {
    newQuantity = parseInt(newQuantity);
    
    if (newQuantity < 1) {
        removeItemFromCart(productId);
        return;
    }

    if (newQuantity > 99) {
        newQuantity = 99;
        showCartNotification('Cantidad máxima: 99 unidades', 'warning');
    }

    const item = cartState.items.find(item => item.id === productId);
    if (item) {
        item.quantity = newQuantity;
        saveCartState();
        calculateCartTotals();
        updateCartDisplay();
        updateGlobalCartCounter();
    }
}

function removeItemFromCart(productId) {
    const itemIndex = cartState.items.findIndex(item => item.id === productId);
    if (itemIndex > -1) {
        const item = cartState.items[itemIndex];
        cartState.items.splice(itemIndex, 1);
        
        saveCartState();
        calculateCartTotals();
        updateCartDisplay();
        updateGlobalCartCounter();
        
        showCartNotification(`${item.name} eliminado del carrito`, 'info');
    }
}

function clearEntireCart() {
    if (cartState.items.length === 0) {
        showCartNotification('El carrito ya está vacío', 'info');
        return;
    }

    if (confirm('¿Estás seguro de que quieres vaciar todo el carrito?')) {
        cartState.items = [];
        cartState.discountCode = null;
        
        saveCartState();
        calculateCartTotals();
        updateCartDisplay();
        updateGlobalCartCounter();
        
        showCartNotification('Carrito vaciado completamente', 'info');
    }
}

function saveForLater(productId) {
    // Simular guardar para después
    const item = cartState.items.find(item => item.id === productId);
    if (item) {
        // En una implementación real, esto se guardaría en una lista separada
        let savedItems = JSON.parse(localStorage.getItem('levelup_saved_items')) || [];
        savedItems.push(item);
        localStorage.setItem('levelup_saved_items', JSON.stringify(savedItems));
        
        removeItemFromCart(productId);
        showCartNotification(`${item.name} guardado para después`, 'success');
    }
}

// ================================
// CÓDIGOS DE DESCUENTO
// ================================

function applyDiscountCode() {
    const codeInput = document.getElementById('discountCode');
    if (!codeInput) return;

    const code = codeInput.value.trim().toUpperCase();
    
    if (!code) {
        showCartNotification('Ingresa un código de descuento', 'warning');
        return;
    }

    if (DISCOUNT_CODES[code]) {
        cartState.discountCode = DISCOUNT_CODES[code];
        calculateCartTotals();
        updateCartDisplay();
        
        codeInput.value = '';
        codeInput.disabled = true;
        
        const applyBtn = document.getElementById('applyDiscountBtn');
        if (applyBtn) {
            applyBtn.textContent = 'Aplicado ✓';
            applyBtn.disabled = true;
        }
        
        showCartNotification(
            `Código aplicado: ${cartState.discountCode.description}`, 
            'success'
        );
    } else {
        showCartNotification('Código de descuento inválido', 'error');
        codeInput.focus();
    }
}

function removeDiscountCode() {
    cartState.discountCode = null;
    calculateCartTotals();
    updateCartDisplay();
    
    const codeInput = document.getElementById('discountCode');
    const applyBtn = document.getElementById('applyDiscountBtn');
    
    if (codeInput) {
        codeInput.disabled = false;
        codeInput.value = '';
    }
    
    if (applyBtn) {
        applyBtn.textContent = 'Aplicar';
        applyBtn.disabled = false;
    }
    
    showCartNotification('Código de descuento removido', 'info');
}

// ================================
// PERSISTENCIA Y SINCRONIZACIÓN
// ================================

function saveCartState() {
    localStorage.setItem('levelup_cart', JSON.stringify(cartState.items));
}

function updateGlobalCartCounter() {
    const counter = document.getElementById('cartCounter');
    if (counter) {
        const totalItems = cartState.items.reduce((sum, item) => sum + item.quantity, 0);
        counter.textContent = totalItems;
        counter.style.display = totalItems > 0 ? 'flex' : 'none';
    }
}

// ================================
// EVENT LISTENERS
// ================================

function setupCartEventListeners() {
    // Botón de vaciar carrito
    const clearCartBtn = document.getElementById('clearCartBtn');
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', clearEntireCart);
    }

    // Botón de aplicar descuento
    const applyDiscountBtn = document.getElementById('applyDiscountBtn');
    if (applyDiscountBtn) {
        applyDiscountBtn.addEventListener('click', applyDiscountCode);
    }

    // Input de código de descuento (Enter)
    const discountInput = document.getElementById('discountCode');
    if (discountInput) {
        discountInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                applyDiscountCode();
            }
        });
    }

    // Botón de checkout
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', proceedToCheckout);
    }
}

// ================================
// CHECKOUT
// ================================

function proceedToCheckout() {
    if (cartState.items.length === 0) {
        showCartNotification('Tu carrito está vacío', 'error');
        return;
    }

    // Verificar si el usuario está logueado
    const user = JSON.parse(localStorage.getItem('levelup_user'));
    if (!user) {
        showCartNotification('Debes iniciar sesión para continuar', 'warning');
        setTimeout(() => {
            window.location.href = '../usuario/login.html';
        }, 1500);
        return;
    }

    // Simular proceso de checkout
    showCartNotification('Redirigiendo al checkout...', 'info');
    
    // Aquí iría la lógica real del checkout
    setTimeout(() => {
        showCartNotification('Función de checkout en desarrollo', 'info');
    }, 1000);
}

// ================================
// NOTIFICACIONES DEL CARRITO
// ================================

function showCartNotification(message, type = 'info') {
    // Reutilizar la función de notificaciones globales
    if (window.levelUpGamer && window.levelUpGamer.showNotification) {
        window.levelUpGamer.showNotification(message, type);
    } else {
        // Fallback simple
        console.log(`${type.toUpperCase()}: ${message}`);
        alert(message);
    }
}

// ================================
// FUNCIONES AUXILIARES
// ================================

function formatPrice(price) {
    return `$${price.toFixed(2)}`;
}

function validateQuantity(quantity) {
    const num = parseInt(quantity);
    return !isNaN(num) && num >= 1 && num <= 99;
}

// Exponer funciones para uso global
window.cartManager = {
    changeItemQuantity,
    removeItemFromCart,
    clearEntireCart,
    saveForLater,
    applyDiscountCode,
    removeDiscountCode,
    proceedToCheckout
};
