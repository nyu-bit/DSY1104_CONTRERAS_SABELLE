// ========================================
// LG-040: CRUD DE CARRITO EN LOCALSTORAGE
// Sistema completo de gestión de carrito
// ========================================

// Configuración del carrito
const CART_CONFIG = {
    storageKey: 'levelup_cart',
    maxQuantity: 99,
    minQuantity: 1,
    shippingThreshold: 50000, // CLP
    shippingCost: 2990, // CLP
    autoSaveDelay: 500, // ms
    
    // LG-042: Reglas mínimas del carrito
    validation: {
        minItemsForCheckout: 1,
        maxItemsPerProduct: 10,
        minOrderAmount: 5000, // CLP - mínimo $5.000
        maxOrderAmount: 5000000, // CLP - máximo $5.000.000
        allowEmptyCart: true,
        requireTermsAcceptance: true,
        validateStock: true,
        maxCartItems: 50 // máximo 50 productos diferentes en el carrito
    },
    
    // Mensajes de error personalizados
    errorMessages: {
        emptyCart: 'Tu carrito está vacío. Agrega productos antes de continuar.',
        minQuantity: 'La cantidad mínima es 1 unidad.',
        maxQuantity: 'La cantidad máxima es 99 unidades por producto.',
        maxCartItems: 'Has alcanzado el límite máximo de 50 productos diferentes.',
        minOrderAmount: 'El monto mínimo de compra es $5.000.',
        maxOrderAmount: 'El monto máximo de compra es $5.000.000.',
        insufficientStock: 'No hay suficiente stock disponible.',
        invalidQuantity: 'Por favor ingresa una cantidad válida.',
        maxItemsPerProduct: 'Máximo 10 unidades de este producto.',
        productNotFound: 'Producto no encontrado.',
        checkoutValidation: 'Revisa los errores antes de continuar.'
    }
};

// Estado global del carrito
let cartState = {
    items: [],
    subtotal: 0,
    shipping: 0,
    discount: 0,
    total: 0,
    itemCount: 0,
    discountCode: null,
    lastUpdated: null
};

// Códigos de descuento válidos
const DISCOUNT_CODES = {
    'LEVELUP10': { percentage: 10, description: 'Descuento Level-Up 10%', minAmount: 20000 },
    'GAMER20': { percentage: 20, description: 'Descuento Gamer 20%', minAmount: 50000 },
    'FIRSTBUY': { percentage: 15, description: 'Primera compra 15%', minAmount: 30000 },
    'DUOCUC': { percentage: 25, description: 'Estudiante Duoc UC 25%', minAmount: 15000 }
};

// ========================================
// INICIALIZACIÓN DEL CARRITO
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    initializeCartSystem();
});

/**
 * Inicializa el sistema completo del carrito
 */
function initializeCartSystem() {
    loadCartFromStorage();
    setupCartEventListeners();
    updateAllCartDisplays();
    
    // Verificar integridad del carrito periódicamente
    setInterval(validateCartIntegrity, 30000);
    
    console.log('✅ Sistema de carrito inicializado');
}

/**
 * Configura los event listeners del carrito
 */
function setupCartEventListeners() {
    // Event listeners para botones de cantidad
    document.addEventListener('click', function(e) {
        if (e.target.matches('.quantity-increase')) {
            const productId = e.target.closest('[data-product-id]')?.dataset.productId;
            if (productId) increaseQuantity(productId);
        }
        
        if (e.target.matches('.quantity-decrease')) {
            const productId = e.target.closest('[data-product-id]')?.dataset.productId;
            if (productId) decreaseQuantity(productId);
        }
        
        if (e.target.matches('.remove-item-btn')) {
            const productId = e.target.closest('[data-product-id]')?.dataset.productId;
            if (productId) removeFromCart(productId);
        }
        
        if (e.target.matches('.clear-cart-btn')) {
            clearCart();
        }
    });
    
    // Event listeners para campos de cantidad
    document.addEventListener('change', function(e) {
        if (e.target.matches('.quantity-input')) {
            const productId = e.target.closest('[data-product-id]')?.dataset.productId;
            const newQuantity = parseInt(e.target.value);
            if (productId && !isNaN(newQuantity)) {
                updateQuantity(productId, newQuantity);
            }
        }
    });
    
    // Event listener para códigos de descuento
    const discountForm = document.getElementById('discountForm');
    if (discountForm) {
        discountForm.addEventListener('submit', function(e) {
            e.preventDefault();
            applyDiscountCode();
        });
    }
}

// ========================================
// OPERACIONES CRUD DEL CARRITO
// ========================================

/**
 * CREATE: Agregar producto al carrito
 * @param {string|object} productData - ID del producto o objeto del producto
 * @param {number} quantity - Cantidad a agregar
 * @param {object} options - Opciones adicionales (color, talla, etc.)
 */
function addToCart(productData, quantity = 1, options = {}) {
    try {
        // Normalizar datos del producto
        const product = normalizeProductData(productData);
        if (!product) {
            throw new Error(CART_CONFIG.errorMessages.productNotFound);
        }
        
        // LG-042: Validar cantidad con nuevas reglas
        const quantityValidation = validateQuantity(quantity, product);
        if (!quantityValidation.valid) {
            showValidationErrors([quantityValidation.error]);
            return false;
        }
        
        // LG-042: Validar número máximo de productos diferentes
        const existingItemIndex = findCartItemIndex(product.id, options);
        if (existingItemIndex === -1) {
            const maxItemsValidation = validateMaxCartItems();
            if (!maxItemsValidation.valid) {
                showValidationErrors([maxItemsValidation.error]);
                return false;
            }
        }
        
        // Verificar stock disponible
        if (!checkStock(product.id, quantity)) {
            showValidationErrors([CART_CONFIG.errorMessages.insufficientStock]);
            return false;
        }
        
        if (existingItemIndex !== -1) {
            // UPDATE: Actualizar cantidad del producto existente
            const existingItem = cartState.items[existingItemIndex];
            const newQuantity = existingItem.quantity + quantity;
            
            // Validar nueva cantidad total
            const newQuantityValidation = validateQuantity(newQuantity, product);
            if (!newQuantityValidation.valid) {
                showValidationErrors([newQuantityValidation.error]);
                return false;
            }
            
            existingItem.quantity = newQuantity;
            existingItem.updatedAt = new Date().toISOString();
            
            // Emitir evento de actualización
            emitCartEvent('updated', {
                action: 'quantity_updated',
                product: product,
                newQuantity: newQuantity
            });
        } else {
            // CREATE: Agregar nuevo producto al carrito
            const cartItem = createCartItem(product, quantity, options);
            cartState.items.push(cartItem);
            
            // Emitir evento de agregado
            emitCartEvent('updated', {
                action: 'added',
                product: product,
                quantity: quantity
            });
        }
        
        // Actualizar carrito
        updateCartState();
        saveCartToStorage();
        updateAllCartDisplays();
        
        // Mostrar confirmación con notificación específica
        notifyProductAdded(product, quantity);
        
        // Analytics tracking
        trackCartEvent('add_to_cart', {
            product_id: product.id,
            product_name: product.name,
            quantity: quantity,
            price: product.price
        });
        
        console.log(`✅ Producto agregado al carrito: ${product.name} (cantidad: ${quantity})`);
        return true;
        
    } catch (error) {
        console.error('Error al agregar al carrito:', error);
        
        // Emitir evento de error
        emitCartEvent('error', {
            action: 'add_to_cart',
            message: error.message,
            product: productData
        });
        
        return false;
    }
}

/**
 * READ: Obtener productos del carrito
 * @param {string} productId - ID del producto (opcional)
 * @returns {array|object} Lista de productos o producto específico
 */
function getCartItems(productId = null) {
    if (productId) {
        return cartState.items.find(item => item.id === productId) || null;
    }
    return [...cartState.items]; // Retornar copia para evitar mutaciones
}

/**
 * UPDATE: Actualizar cantidad de un producto
 * @param {string} productId - ID del producto
 * @param {number} newQuantity - Nueva cantidad
 * @param {object} options - Opciones del producto
 */
function updateQuantity(productId, newQuantity, options = {}) {
    try {
        // LG-042: Validar cantidad con nuevas reglas
        const product = getProductById(productId);
        const quantityValidation = validateQuantity(newQuantity, product);
        if (!quantityValidation.valid) {
            showValidationErrors([quantityValidation.error]);
            return false;
        }
        
        // Buscar el producto en el carrito
        const itemIndex = findCartItemIndex(productId, options);
        if (itemIndex === -1) {
            showValidationErrors([CART_CONFIG.errorMessages.productNotFound]);
            return false;
        }
        
        const item = cartState.items[itemIndex];
        
        // Verificar stock disponible
        if (!checkStock(productId, newQuantity)) {
            showValidationErrors([CART_CONFIG.errorMessages.insufficientStock]);
            return false;
        }
        
        // Si la cantidad es 0, eliminar el producto
        if (newQuantity === 0) {
            removeFromCart(productId, options);
            return true;
        }
        
        // Actualizar cantidad
        const oldQuantity = item.quantity;
        item.quantity = newQuantity;
        item.updatedAt = new Date().toISOString();
        
        // Actualizar carrito
        updateCartState();
        saveCartToStorage();
        updateAllCartDisplays();
        
        // Feedback al usuario con notificación específica
        notifyQuantityChanged(product, oldQuantity, newQuantity);
        
        // Emitir evento de actualización
        emitCartEvent('updated', {
            action: 'quantity_updated',
            product: product,
            oldQuantity: oldQuantity,
            newQuantity: newQuantity
        });
        
        return true;
        
        // Analytics tracking
        trackCartEvent('update_quantity', {
            product_id: productId,
            old_quantity: oldQuantity,
            new_quantity: newQuantity
        });
        
        return true;
        
    } catch (error) {
        console.error('Error al actualizar cantidad:', error);
        showCartNotification(error.message, 'error');
        return false;
    }
}

/**
 * DELETE: Eliminar producto del carrito
 * @param {string} productId - ID del producto
 * @param {object} options - Opciones del producto
 */
function removeFromCart(productId, options = {}) {
    try {
        // Buscar el producto en el carrito
        const itemIndex = findCartItemIndex(productId, options);
        if (itemIndex === -1) {
            throw new Error('Producto no encontrado en el carrito');
        }
        
        const item = cartState.items[itemIndex];
        
        // Eliminar el producto
        cartState.items.splice(itemIndex, 1);
        
        // Actualizar carrito
        updateCartState();
        saveCartToStorage();
        updateAllCartDisplays();
        
        // Emitir evento de eliminación
        emitCartEvent('updated', {
            action: 'removed',
            product: item
        });
        
        // Analytics tracking
        trackCartEvent('remove_from_cart', {
            product_id: productId,
            product_name: item.name,
            quantity: item.quantity
        });
        
        console.log(`🗑️ Producto eliminado del carrito: ${item.name}`);
        return true;
        
    } catch (error) {
        console.error('Error al eliminar del carrito:', error);
        
        // Emitir evento de error
        emitCartEvent('error', {
            action: 'remove_from_cart',
            message: error.message,
            productId: productId
        });
        
        return false;
    }
}

/**
 * DELETE: Vaciar carrito completo
 */
function clearCart() {
    try {
        const itemCount = cartState.items.length;
        
        if (itemCount === 0) {
            showCartNotification('El carrito ya está vacío', 'info');
            return;
        }
        
        // Confirmar acción
        if (!confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
            return;
        }
        
        // Limpiar carrito
        cartState.items = [];
        
        // Actualizar carrito
        updateCartState();
        saveCartToStorage();
        updateAllCartDisplays();
        
        // Feedback al usuario
        showCartNotification(
            `Carrito vaciado (${itemCount} productos eliminados)`,
            'info'
        );
        
        // Analytics tracking
        trackCartEvent('clear_cart', {
            items_removed: itemCount
        });
        
        return true;
        
    } catch (error) {
        console.error('Error al vaciar carrito:', error);
        showCartNotification('Error al vaciar el carrito', 'error');
        return false;
    }
}

// ========================================
// OPERACIONES AUXILIARES
// ========================================

/**
 * Incrementar cantidad de un producto
 */
function increaseQuantity(productId, options = {}) {
    const item = getCartItems(productId);
    if (item) {
        const newQuantity = Math.min(item.quantity + 1, CART_CONFIG.maxQuantity);
        updateQuantity(productId, newQuantity, options);
    }
}

/**
 * Decrementar cantidad de un producto
 */
function decreaseQuantity(productId, options = {}) {
    const item = getCartItems(productId);
    if (item) {
        const newQuantity = Math.max(item.quantity - 1, 0);
        updateQuantity(productId, newQuantity, options);
    }
}

/**
 * Mover producto a lista de deseos
 */
function moveToWishlist(productId, options = {}) {
    try {
        const item = getCartItems(productId);
        if (!item) {
            throw new Error('Producto no encontrado');
        }
        
        // Agregar a wishlist
        let wishlist = JSON.parse(localStorage.getItem('levelup_wishlist') || '[]');
        const wishlistItem = {
            id: productId,
            addedAt: new Date().toISOString(),
            fromCart: true
        };
        
        if (!wishlist.find(w => w.id === productId)) {
            wishlist.push(wishlistItem);
            localStorage.setItem('levelup_wishlist', JSON.stringify(wishlist));
        }
        
        // Eliminar del carrito
        removeFromCart(productId, options);
        
        showCartNotification(
            `${item.name} movido a lista de deseos`,
            'success'
        );
        
        return true;
        
    } catch (error) {
        console.error('Error al mover a wishlist:', error);
        showCartNotification(error.message, 'error');
        return false;
    }
}

// ========================================
// PERSISTENCIA EN LOCALSTORAGE
// ========================================

/**
 * Cargar carrito desde localStorage
 */
function loadCartFromStorage() {
    try {
        const storedCart = localStorage.getItem(CART_CONFIG.storageKey);
        
        if (storedCart) {
            const cartData = JSON.parse(storedCart);
            
            // Validar estructura del carrito guardado
            if (validateCartStructure(cartData)) {
                cartState.items = cartData.items || [];
                cartState.discountCode = cartData.discountCode || null;
                cartState.lastUpdated = cartData.lastUpdated || null;
                
                // Limpiar productos que ya no existen
                cartState.items = cartState.items.filter(item => {
                    const productExists = checkProductExists(item.id);
                    if (!productExists) {
                        console.warn(`Producto ${item.id} ya no existe, eliminando del carrito`);
                    }
                    return productExists;
                });
                
                updateCartState();
                console.log('✅ Carrito cargado desde localStorage');
            } else {
                console.warn('⚠️ Estructura de carrito inválida, inicializando nuevo carrito');
                resetCart();
            }
        } else {
            console.log('📦 Carrito vacío, inicializando nuevo');
            resetCart();
        }
        
    } catch (error) {
        console.error('❌ Error al cargar carrito:', error);
        resetCart();
    }
}

/**
 * Guardar carrito en localStorage
 */
function saveCartToStorage() {
    try {
        const cartData = {
            items: cartState.items,
            discountCode: cartState.discountCode,
            lastUpdated: new Date().toISOString(),
            version: '2.0' // Para futuras migraciones
        };
        
        localStorage.setItem(CART_CONFIG.storageKey, JSON.stringify(cartData));
        cartState.lastUpdated = cartData.lastUpdated;
        
        // Validar que se guardó correctamente
        const saved = localStorage.getItem(CART_CONFIG.storageKey);
        if (!saved) {
            throw new Error('No se pudo guardar en localStorage');
        }
        
        console.log('💾 Carrito guardado en localStorage');
        return true;
        
    } catch (error) {
        console.error('❌ Error al guardar carrito:', error);
        showCartNotification('Error al guardar cambios', 'error');
        return false;
    }
}

/**
 * Resetear carrito a estado inicial
 */
function resetCart() {
    cartState = {
        items: [],
        subtotal: 0,
        shipping: 0,
        discount: 0,
        total: 0,
        itemCount: 0,
        discountCode: null,
        lastUpdated: null
    };
    
    saveCartToStorage();
}

// ========================================
// FUNCIONES DE VALIDACIÓN
// ========================================

/**
 * Validar estructura del carrito guardado
 */
function validateCartStructure(cartData) {
    if (!cartData || typeof cartData !== 'object') return false;
    if (!Array.isArray(cartData.items)) return false;
    
    // Validar cada item del carrito
    return cartData.items.every(item => {
        return item.id &&
               typeof item.quantity === 'number' &&
               item.quantity > 0 &&
               item.price &&
               typeof item.price === 'number';
    });
}

/**
 * Validar cantidad
 */
function isValidQuantity(quantity) {
    return Number.isInteger(quantity) &&
           quantity >= CART_CONFIG.minQuantity &&
           quantity <= CART_CONFIG.maxQuantity;
}

/**
 * Verificar si un producto existe
 */
function checkProductExists(productId) {
    // Verificar en la base de datos de productos
    if (typeof PRODUCTS !== 'undefined' && PRODUCTS[productId]) {
        return true;
    }
    
    // Verificar en PRODUCT_DATABASE si está disponible
    if (typeof PRODUCT_DATABASE !== 'undefined') {
        return PRODUCT_DATABASE.some(product => product.id === productId);
    }
    
    return false;
}

/**
 * Verificar stock disponible
 */
function checkStock(productId, requestedQuantity) {
    // En un sistema real, esto verificaría contra el inventario
    // Por ahora, asumimos stock ilimitado pero con límite por usuario
    return requestedQuantity <= CART_CONFIG.maxQuantity;
}

/**
 * Validar integridad del carrito
 */
function validateCartIntegrity() {
    let hasChanges = false;
    
    // Eliminar productos que ya no existen
    const validItems = cartState.items.filter(item => {
        const exists = checkProductExists(item.id);
        if (!exists) {
            console.warn(`Eliminando producto inexistente: ${item.id}`);
            hasChanges = true;
        }
        return exists;
    });
    
    // Validar cantidades
    validItems.forEach(item => {
        if (!isValidQuantity(item.quantity)) {
            console.warn(`Corrigiendo cantidad inválida para ${item.id}: ${item.quantity} -> 1`);
            item.quantity = 1;
            hasChanges = true;
        }
    });
    
    if (hasChanges) {
        cartState.items = validItems;
        updateCartState();
        saveCartToStorage();
        updateAllCartDisplays();
        showCartNotification('Carrito actualizado automáticamente', 'info');
    }
}

// ========================================
// FUNCIONES AUXILIARES
// ========================================

/**
 * Normalizar datos del producto
 */
function normalizeProductData(productData) {
    if (typeof productData === 'string') {
        // Es un ID, buscar el producto
        const productId = productData;
        
        if (typeof PRODUCTS !== 'undefined' && PRODUCTS[productId]) {
            return PRODUCTS[productId];
        }
        
        if (typeof PRODUCT_DATABASE !== 'undefined') {
            const product = PRODUCT_DATABASE.find(p => p.id === productId);
            if (product) return product;
        }
        
        return null;
    }
    
    if (typeof productData === 'object' && productData.id) {
        // Es un objeto producto
        return productData;
    }
    
    return null;
}

/**
 * Crear item del carrito
 */
function createCartItem(product, quantity, options = {}) {
    return {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image || '',
        quantity: quantity,
        options: options,
        addedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        sku: product.sku || null,
        category: product.category || null
    };
}

/**
 * Encontrar índice de item en el carrito
 */
function findCartItemIndex(productId, options = {}) {
    return cartState.items.findIndex(item => {
        if (item.id !== productId) return false;
        
        // Si hay opciones, compararlas también
        if (Object.keys(options).length > 0) {
            return JSON.stringify(item.options) === JSON.stringify(options);
        }
        
        return true;
    });
}

/**
 * Actualizar estado del carrito
 */
function updateCartState() {
    // Calcular subtotal
    cartState.subtotal = cartState.items.reduce((sum, item) => {
        return sum + (item.price * item.quantity);
    }, 0);

    // Calcular envío
    cartState.shipping = cartState.subtotal >= CART_CONFIG.shippingThreshold ? 
        0 : CART_CONFIG.shippingCost;

    // Aplicar descuento si existe y es válido
    cartState.discount = 0;
    if (cartState.discountCode && isDiscountValid(cartState.discountCode)) {
        cartState.discount = Math.floor(
            cartState.subtotal * cartState.discountCode.percentage / 100
        );
    }

    // Calcular total
    cartState.total = cartState.subtotal + cartState.shipping - cartState.discount;

    // Contar items
    cartState.itemCount = cartState.items.reduce((sum, item) => sum + item.quantity, 0);
}

/**
 * Verificar si un descuento es válido
 */
function isDiscountValid(discountCode) {
    if (!discountCode || !discountCode.minAmount) return true;
    return cartState.subtotal >= discountCode.minAmount;
}

// ========================================
// ACTUALIZACIÓN DE INTERFAZ
// ========================================

/**
 * Actualizar todas las visualizaciones del carrito
 */
function updateAllCartDisplays() {
    updateCartCounter();
    updateCartSidebar();
    updateCartPage();
    updateCheckoutSummary();
}

/**
 * Actualizar contador del carrito en el header
 */
function updateCartCounter() {
    const counters = document.querySelectorAll('.cart-counter, #cartCounter, .cart-badge');
    counters.forEach(counter => {
        counter.textContent = cartState.itemCount;
        counter.style.display = cartState.itemCount > 0 ? 'flex' : 'none';
        
        // Animación de actualización
        counter.classList.add('updated');
        setTimeout(() => counter.classList.remove('updated'), 300);
    });
}

/**
 * Actualizar sidebar del carrito
 */
function updateCartSidebar() {
    const sidebar = document.getElementById('cartSidebar');
    if (!sidebar) return;
    
    const itemsContainer = sidebar.querySelector('.cart-items');
    const summaryContainer = sidebar.querySelector('.cart-summary');
    
    if (itemsContainer) {
        updateCartItemsDisplay(itemsContainer);
    }
    
    if (summaryContainer) {
        updateCartSummaryDisplay(summaryContainer);
    }
}

/**
 * Actualizar página del carrito
 */
function updateCartPage() {
    const cartPage = document.getElementById('cartPage');
    if (!cartPage) return;
    
    const itemsContainer = cartPage.querySelector('.cart-items');
    const summaryContainer = cartPage.querySelector('.cart-summary');
    const emptyState = cartPage.querySelector('.empty-cart');
    
    if (cartState.items.length === 0) {
        if (itemsContainer) itemsContainer.style.display = 'none';
        if (summaryContainer) summaryContainer.style.display = 'none';
        if (emptyState) emptyState.style.display = 'block';
    } else {
        if (itemsContainer) {
            itemsContainer.style.display = 'block';
            updateCartItemsDisplay(itemsContainer);
        }
        if (summaryContainer) {
            summaryContainer.style.display = 'block';
            updateCartSummaryDisplay(summaryContainer);
        }
        if (emptyState) emptyState.style.display = 'none';
    }
}

/**
 * Actualizar resumen del checkout
 */
function updateCheckoutSummary() {
    const checkout = document.getElementById('checkoutSummary');
    if (!checkout) return;
    
    updateCartSummaryDisplay(checkout);
}

/**
 * Cargar base de datos de productos si no está disponible
 */
function ensureProductDatabase() {
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
                <p class="item-price">${formatPrice(item.price)} c/u</p>
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
        subtotalElement.textContent = formatPrice(cartState.subtotal);
    }

    // Actualizar envío
    const shippingElement = document.getElementById('shipping');
    if (shippingElement) {
        shippingElement.textContent = cartState.shipping === 0 ? 'GRATIS' : formatPrice(cartState.shipping);
    }

    // Actualizar descuento
    const discountElement = document.getElementById('discount');
    if (discountElement) {
        if (cartState.discount > 0) {
            discountElement.textContent = `-${formatPrice(cartState.discount)}`;
            discountElement.parentElement.style.display = 'flex';
        } else {
            discountElement.parentElement.style.display = 'none';
        }
    }

    // Actualizar total
    const totalElement = document.getElementById('total');
    if (totalElement) {
        totalElement.textContent = formatPrice(cartState.total);
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
        shippingMessage.innerHTML = `📦 Agrega ${formatPrice(remaining)} más para envío gratis`;
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
    // LG-042: Validaciones completas antes del checkout
    const validation = validateCartForCheckout();
    if (!validation.valid) {
        showValidationErrors(validation.errors);
        return false;
    }

    // Verificar si el usuario está logueado
    const user = JSON.parse(localStorage.getItem('levelup_user') || 'null');
    if (!user) {
        showCartNotification('Debes iniciar sesión para continuar', 'warning');
        setTimeout(() => {
            window.location.href = '../usuario/';
        }, 1500);
        return false;
    }

    // Mostrar resumen final antes de proceder
    showCheckoutSummary();
    
    // Simular proceso de checkout exitoso
    showCartNotification('Procesando compra...', 'info');
    
    setTimeout(() => {
        // Dar puntos por compra
        if (window.gamificationSystem) {
            const pointsToAdd = Math.floor(cartState.total / 1000); // 1 punto por cada $1000
            window.gamificationSystem.addPoints('purchase', pointsToAdd);
        }
        
        // Limpiar carrito después de compra exitosa
        clearCart();
        
        showCartNotification('¡Compra realizada exitosamente!', 'success');
        
        // Tracking de compra exitosa
        trackCartEvent('purchase_completed', {
            total: cartState.total,
            items: cartState.itemCount
        });
        
    }, 2000);
    
    return true;
}

/**
 * LG-042: Mostrar resumen detallado del checkout
 */
function showCheckoutSummary() {
    const validation = validateCartForCheckout();
    
    let summaryHTML = `
        <div class="checkout-summary">
            <h3>🛒 Resumen de tu Compra</h3>
            <div class="summary-items">
                <p><strong>Productos:</strong> ${cartState.itemCount} unidades</p>
                <p><strong>Subtotal:</strong> ${formatPrice(cartState.subtotal)}</p>
                <p><strong>Envío:</strong> ${cartState.shipping === 0 ? 'GRATIS' : formatPrice(cartState.shipping)}</p>
                ${cartState.discount > 0 ? `<p><strong>Descuento:</strong> -${formatPrice(cartState.discount)}</p>` : ''}
                <p class="total-line"><strong>Total a pagar:</strong> ${formatPrice(cartState.total)}</p>
            </div>
    `;
    
    if (!validation.valid) {
        summaryHTML += `
            <div class="validation-errors">
                <h4>⚠️ Problemas detectados:</h4>
                <ul>
                    ${validation.errors.map(error => `<li>${error}</li>`).join('')}
                </ul>
            </div>
        `;
    } else {
        summaryHTML += `
            <div class="validation-success">
                <p>✅ Tu carrito está listo para el checkout</p>
            </div>
        `;
    }
    
    summaryHTML += `</div>`;
    
    console.log('Resumen del checkout:', summaryHTML);
    return validation.valid;
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

/**
 * Formatear precio en formato CLP (Peso Chileno)
 * @param {number} price - Precio a formatear
 * @returns {string} - Precio formateado en CLP
 */
function formatPrice(price) {
    if (!price || isNaN(price)) return '$0';
    
    return new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(Math.round(price));
}

/**
 * Formatear precio sin símbolo de moneda (solo números)
 * @param {number} price - Precio a formatear
 * @returns {string} - Precio formateado sin símbolo
 */
function formatPriceNumber(price) {
    if (!price || isNaN(price)) return '0';
    
    return new Intl.NumberFormat('es-CL', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(Math.round(price));
}

// ========================================
// LG-043: MENSAJES Y NOTIFICACIONES DEL CARRITO
// ========================================

/**
 * Sistema de notificaciones del carrito con accesibilidad
 * @param {string} message - Mensaje a mostrar
 * @param {string} type - Tipo: 'success', 'error', 'warning', 'info'
 * @param {Object} options - Opciones adicionales
 */
function showCartNotification(message, type = 'info', options = {}) {
    const config = {
        duration: options.duration || (type === 'error' ? 5000 : 3000),
        persistent: options.persistent || false,
        sound: options.sound !== false,
        ariaLevel: options.ariaLevel || 'polite', // 'polite' | 'assertive'
        showCounter: options.showCounter !== false,
        actions: options.actions || null
    };
    
    // Crear o obtener container de notificaciones
    let notificationsContainer = document.getElementById('cart-notifications-container');
    if (!notificationsContainer) {
        notificationsContainer = createNotificationsContainer();
    }
    
    // Crear región aria-live si no existe
    let ariaLiveRegion = document.getElementById('cart-aria-live');
    if (!ariaLiveRegion) {
        ariaLiveRegion = createAriaLiveRegion();
    }
    
    // Crear notificación visual
    const notification = createNotificationElement(message, type, config);
    
    // Agregar al container
    notificationsContainer.appendChild(notification);
    
    // Anunciar a lectores de pantalla
    announceToScreenReader(message, type, ariaLiveRegion, config.ariaLevel);
    
    // Reproducir sonido si está habilitado
    if (config.sound) {
        playNotificationSound(type);
    }
    
    // Actualizar contador del carrito
    if (config.showCounter) {
        updateCartBadge();
    }
    
    // Auto-remover si no es persistente
    if (!config.persistent) {
        setTimeout(() => {
            removeNotification(notification);
        }, config.duration);
    }
    
    // Tracking del evento
    trackNotificationEvent(message, type);
    
    // Log para debugging
    console.log(`🔔 Notificación ${type.toUpperCase()}: ${message}`);
    
    return notification;
}

/**
 * Crear container principal de notificaciones
 */
function createNotificationsContainer() {
    const container = document.createElement('div');
    container.id = 'cart-notifications-container';
    container.className = 'cart-notifications-container';
    container.setAttribute('role', 'status');
    container.setAttribute('aria-label', 'Notificaciones del carrito de compras');
    
    // Insertar al inicio del body
    document.body.insertBefore(container, document.body.firstChild);
    
    return container;
}

/**
 * Crear región aria-live para accesibilidad
 */
function createAriaLiveRegion() {
    const region = document.createElement('div');
    region.id = 'cart-aria-live';
    region.className = 'sr-only'; // Solo para lectores de pantalla
    region.setAttribute('aria-live', 'polite');
    region.setAttribute('aria-atomic', 'true');
    region.setAttribute('aria-label', 'Anuncios del carrito');
    
    document.body.appendChild(region);
    
    return region;
}

/**
 * Crear elemento de notificación visual
 */
function createNotificationElement(message, type, config) {
    const notification = document.createElement('div');
    notification.className = `cart-notification cart-notification-${type}`;
    notification.setAttribute('role', 'alert');
    notification.setAttribute('tabindex', '-1');
    
    // Icono según el tipo
    const icons = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️'
    };
    
    const icon = icons[type] || icons.info;
    
    notification.innerHTML = `
        <div class="notification-content">
            <div class="notification-icon" aria-hidden="true">${icon}</div>
            <div class="notification-message">${message}</div>
            ${config.actions ? createNotificationActions(config.actions) : ''}
        </div>
        <button type="button" class="notification-close" aria-label="Cerrar notificación">
            <i class="fas fa-times" aria-hidden="true"></i>
        </button>
    `;
    
    // Event listener para cerrar
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => removeNotification(notification));
    
    // Animación de entrada
    notification.style.transform = 'translateX(100%)';
    notification.style.opacity = '0';
    
    requestAnimationFrame(() => {
        notification.style.transform = 'translateX(0)';
        notification.style.opacity = '1';
    });
    
    return notification;
}

/**
 * Crear acciones para notificaciones (ej: "Deshacer")
 */
function createNotificationActions(actions) {
    return `
        <div class="notification-actions">
            ${actions.map(action => `
                <button type="button" 
                        class="notification-action-btn" 
                        onclick="${action.handler}"
                        aria-label="${action.label}">
                    ${action.text}
                </button>
            `).join('')}
        </div>
    `;
}

/**
 * Anunciar mensaje a lectores de pantalla
 */
function announceToScreenReader(message, type, ariaRegion, level) {
    // Cambiar nivel de aria-live según urgencia
    if (type === 'error' || level === 'assertive') {
        ariaRegion.setAttribute('aria-live', 'assertive');
    } else {
        ariaRegion.setAttribute('aria-live', 'polite');
    }
    
    // Prefijo según tipo para mayor claridad
    const prefixes = {
        success: 'Éxito: ',
        error: 'Error: ',
        warning: 'Advertencia: ',
        info: 'Información: '
    };
    
    const prefix = prefixes[type] || '';
    const fullMessage = `${prefix}${message}`;
    
    // Limpiar y establecer mensaje
    ariaRegion.textContent = '';
    setTimeout(() => {
        ariaRegion.textContent = fullMessage;
    }, 100);
    
    // Limpiar después de un tiempo para evitar spam
    setTimeout(() => {
        if (ariaRegion.textContent === fullMessage) {
            ariaRegion.textContent = '';
        }
    }, 5000);
}

/**
 * Reproducir sonido de notificación
 */
function playNotificationSound(type) {
    try {
        // Solo si el usuario ha interactuado con la página
        if (document.hasFocus()) {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            // Frecuencias según tipo
            const frequencies = {
                success: 800,
                error: 300,
                warning: 600,
                info: 500
            };
            
            oscillator.frequency.setValueAtTime(frequencies[type] || 500, audioContext.currentTime);
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.2);
        }
    } catch (error) {
        // Fallar silenciosamente si no hay soporte de audio
        console.warn('No se pudo reproducir sonido de notificación:', error);
    }
}

/**
 * Remover notificación con animación
 */
function removeNotification(notification) {
    if (!notification || !notification.parentNode) return;
    
    notification.style.transform = 'translateX(100%)';
    notification.style.opacity = '0';
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

/**
 * Actualizar badge del carrito
 */
function updateCartBadge() {
    const badge = document.querySelector('.cart-badge, .cart-counter, .nav-cart-count');
    if (badge && cartState) {
        const itemCount = cartState.itemCount || 0;
        badge.textContent = itemCount > 99 ? '99+' : itemCount.toString();
        badge.style.display = itemCount > 0 ? 'block' : 'none';
        
        // Animar badge
        badge.style.transform = 'scale(1.2)';
        setTimeout(() => {
            badge.style.transform = 'scale(1)';
        }, 200);
    }
}

/**
 * Tracking de eventos de notificación
 */
function trackNotificationEvent(message, type) {
    if (window.gtag) {
        gtag('event', 'cart_notification', {
            event_category: 'Cart',
            event_label: type,
            value: message.length
        });
    }
}

// ========================================
// NOTIFICACIONES ESPECÍFICAS DEL CARRITO
// ========================================

/**
 * Notificación al agregar producto
 */
function notifyProductAdded(product, quantity) {
    const message = `${product.name} ${quantity > 1 ? `(${quantity} unidades)` : ''} agregado al carrito`;
    showCartNotification(message, 'success', {
        actions: [{
            text: 'Ver carrito',
            label: 'Ir al carrito de compras',
            handler: 'window.location.href="../carrito/"'
        }]
    });
}

/**
 * Notificación al eliminar producto
 */
function notifyProductRemoved(product, wasLastItem = false) {
    const message = wasLastItem 
        ? `${product.name} eliminado del carrito`
        : `${product.name} eliminado del carrito. ${cartState.itemCount} productos restantes`;
    
    showCartNotification(message, 'info', {
        actions: [{
            text: 'Deshacer',
            label: 'Volver a agregar producto',
            handler: `addToCart('${product.id}', 1)`
        }]
    });
}

/**
 * Notificación al cambiar cantidad
 */
function notifyQuantityChanged(product, oldQuantity, newQuantity) {
    const action = newQuantity > oldQuantity ? 'aumentada' : 'reducida';
    const message = `Cantidad ${action}: ${product.name} (${newQuantity} ${newQuantity === 1 ? 'unidad' : 'unidades'})`;
    
    showCartNotification(message, 'info', {
        duration: 2000
    });
}

/**
 * Notificación al vaciar carrito
 */
function notifyCartCleared(itemCount) {
    const message = `Carrito vaciado completamente. ${itemCount} ${itemCount === 1 ? 'producto eliminado' : 'productos eliminados'}`;
    
    showCartNotification(message, 'info', {
        persistent: true,
        actions: [{
            text: 'Deshacer',
            label: 'Restaurar carrito',
            handler: 'restoreLastCartState()'
        }]
    });
}

/**
 * Notificación de error de stock
 */
function notifyStockError(product, requestedQuantity, availableStock) {
    const message = availableStock === 0 
        ? `${product.name} no está disponible`
        : `Solo ${availableStock} ${availableStock === 1 ? 'unidad disponible' : 'unidades disponibles'} de ${product.name}`;
    
    showCartNotification(message, 'warning', {
        duration: 4000,
        ariaLevel: 'assertive'
    });
}

/**
 * Notificación de descuento aplicado
 */
function notifyDiscountApplied(discountCode, discountAmount) {
    const message = `¡Descuento aplicado! Código "${discountCode}" - Ahorras ${formatPrice(discountAmount)}`;
    
    showCartNotification(message, 'success', {
        duration: 4000,
        sound: true
    });
}

/**
 * Notificación de envío gratis
 */
function notifyFreeShipping() {
    const message = '🎉 ¡Felicidades! Tienes envío gratis en tu pedido';
    
    showCartNotification(message, 'success', {
        duration: 3000,
        sound: true
    });
}

/**
 * Notificación para completar envío gratis
 */
function notifyAlmostFreeShipping(remaining) {
    const message = `¡Casi tienes envío gratis! Agrega ${formatPrice(remaining)} más para obtenerlo`;
    
    showCartNotification(message, 'info', {
        duration: 5000,
        actions: [{
            text: 'Ver productos',
            label: 'Explorar productos para agregar',
            handler: 'window.location.href="../productos/"'
        }]
    });
}

/**
 * Notificación de checkout exitoso
 */
function notifyCheckoutSuccess(orderTotal, itemCount) {
    const message = `¡Compra realizada exitosamente! Total: ${formatPrice(orderTotal)} - ${itemCount} ${itemCount === 1 ? 'producto' : 'productos'}`;
    
    showCartNotification(message, 'success', {
        persistent: true,
        sound: true,
        ariaLevel: 'assertive'
    });
}

/**
 * Notificación de error de validación
 */
function notifyValidationError(errors) {
    const message = errors.length === 1 
        ? errors[0]
        : `${errors.length} problemas encontrados. Revisa tu carrito.`;
    
    showCartNotification(message, 'error', {
        duration: 6000,
        ariaLevel: 'assertive',
        actions: [{
            text: 'Ver detalles',
            label: 'Ver errores de validación',
            handler: 'showValidationErrors(' + JSON.stringify(errors) + ')'
        }]
    });
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
// ========================================
// LG-042: VALIDACIONES DEL CARRITO
// ========================================

/**
 * Validar cantidad de producto
 * @param {number} quantity - Cantidad a validar
 * @param {Object} product - Producto para validar stock
 * @returns {Object} - {valid: boolean, error: string}
 */
function validateQuantity(quantity, product = null) {
    const num = parseInt(quantity);
    
    // Validar que sea un número válido
    if (isNaN(num)) {
        return {
            valid: false,
            error: CART_CONFIG.errorMessages.invalidQuantity
        };
    }
    
    // Validar cantidad mínima
    if (num < CART_CONFIG.minQuantity) {
        return {
            valid: false,
            error: CART_CONFIG.errorMessages.minQuantity
        };
    }
    
    // Validar cantidad máxima
    if (num > CART_CONFIG.maxQuantity) {
        return {
            valid: false,
            error: CART_CONFIG.errorMessages.maxQuantity
        };
    }
    
    // Validar máximo por producto específico
    if (num > CART_CONFIG.validation.maxItemsPerProduct) {
        return {
            valid: false,
            error: CART_CONFIG.errorMessages.maxItemsPerProduct
        };
    }
    
    // Validar stock si el producto está disponible
    if (product && CART_CONFIG.validation.validateStock) {
        if (product.stock && num > product.stock) {
            return {
                valid: false,
                error: `Solo quedan ${product.stock} unidades disponibles.`
            };
        }
    }
    
    return { valid: true, error: null };
}

/**
 * Validar si el carrito está vacío
 * @returns {Object} - {valid: boolean, error: string}
 */
function validateCartNotEmpty() {
    if (cartState.items.length === 0) {
        return {
            valid: false,
            error: CART_CONFIG.errorMessages.emptyCart
        };
    }
    
    return { valid: true, error: null };
}

/**
 * Validar monto mínimo del pedido
 * @returns {Object} - {valid: boolean, error: string}
 */
function validateMinOrderAmount() {
    if (cartState.subtotal < CART_CONFIG.validation.minOrderAmount) {
        return {
            valid: false,
            error: `${CART_CONFIG.errorMessages.minOrderAmount} Necesitas ${formatPrice(CART_CONFIG.validation.minOrderAmount - cartState.subtotal)} más.`
        };
    }
    
    return { valid: true, error: null };
}

/**
 * Validar monto máximo del pedido
 * @returns {Object} - {valid: boolean, error: string}
 */
function validateMaxOrderAmount() {
    if (cartState.total > CART_CONFIG.validation.maxOrderAmount) {
        return {
            valid: false,
            error: CART_CONFIG.errorMessages.maxOrderAmount
        };
    }
    
    return { valid: true, error: null };
}

/**
 * Validar número máximo de productos diferentes en el carrito
 * @returns {Object} - {valid: boolean, error: string}
 */
function validateMaxCartItems() {
    if (cartState.items.length >= CART_CONFIG.validation.maxCartItems) {
        return {
            valid: false,
            error: CART_CONFIG.errorMessages.maxCartItems
        };
    }
    
    return { valid: true, error: null };
}

/**
 * Validación completa del carrito para checkout
 * @returns {Object} - {valid: boolean, errors: Array}
 */
function validateCartForCheckout() {
    const errors = [];
    
    // Validar carrito no vacío
    const emptyValidation = validateCartNotEmpty();
    if (!emptyValidation.valid) {
        errors.push(emptyValidation.error);
    }
    
    // Validar monto mínimo
    const minAmountValidation = validateMinOrderAmount();
    if (!minAmountValidation.valid) {
        errors.push(minAmountValidation.error);
    }
    
    // Validar monto máximo
    const maxAmountValidation = validateMaxOrderAmount();
    if (!maxAmountValidation.valid) {
        errors.push(maxAmountValidation.error);
    }
    
    // Validar cantidades de cada producto
    cartState.items.forEach(item => {
        const product = getProductById(item.id);
        const quantityValidation = validateQuantity(item.quantity, product);
        if (!quantityValidation.valid) {
            errors.push(`${item.name}: ${quantityValidation.error}`);
        }
    });
    
    return {
        valid: errors.length === 0,
        errors: errors
    };
}

/**
 * Mostrar errores de validación al usuario
 * @param {Array} errors - Array de mensajes de error
 */
function showValidationErrors(errors) {
    if (!errors || errors.length === 0) return;
    
    // Mostrar notificación principal
    const errorMessage = errors.length === 1 
        ? errors[0] 
        : `Se encontraron ${errors.length} problemas:\n• ${errors.join('\n• ')}`;
    
    showCartNotification(errorMessage, 'error');
    
    // Crear o actualizar panel de errores en el DOM
    let errorPanel = document.getElementById('cart-validation-errors');
    if (!errorPanel) {
        errorPanel = document.createElement('div');
        errorPanel.id = 'cart-validation-errors';
        errorPanel.className = 'validation-errors-panel';
        
        // Insertar al inicio del container del carrito
        const cartContainer = document.getElementById('cartContainer') || document.querySelector('.cart-container');
        if (cartContainer) {
            cartContainer.insertBefore(errorPanel, cartContainer.firstChild);
        }
    }
    
    errorPanel.innerHTML = `
        <div class="error-header">
            <i class="fas fa-exclamation-triangle" aria-hidden="true"></i>
            <span>Problemas en tu carrito:</span>
            <button type="button" class="close-errors-btn" onclick="hideValidationErrors()" aria-label="Cerrar errores">
                <i class="fas fa-times" aria-hidden="true"></i>
            </button>
        </div>
        <ul class="error-list">
            ${errors.map(error => `<li>${error}</li>`).join('')}
        </ul>
    `;
    
    errorPanel.style.display = 'block';
    
    // Auto-ocultar después de 10 segundos
    setTimeout(() => {
        hideValidationErrors();
    }, 10000);
    
    // También mostrar en consola para debugging
    console.error('Errores de validación del carrito:', errors);
}

/**
 * Ocultar panel de errores de validación
 */
function hideValidationErrors() {
    const errorPanel = document.getElementById('cart-validation-errors');
    if (errorPanel) {
        errorPanel.style.display = 'none';
    }
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

// ========================================
// FUNCIONES DE VISUALIZACIÓN
// ========================================

/**
 * Actualizar visualización de items del carrito
 */
function updateCartItemsDisplay(container) {
    if (!container) return;
    
    if (cartState.items.length === 0) {
        container.innerHTML = `
            <div class="empty-cart-message">
                <i class="fas fa-shopping-cart" aria-hidden="true"></i>
                <h3>Tu carrito está vacío</h3>
                <p>Agrega algunos productos increíbles para comenzar</p>
                <a href="/productos/" class="btn btn-primary">
                    <i class="fas fa-gamepad" aria-hidden="true"></i>
                    Explorar Productos
                </a>
            </div>
        `;
        return;
    }
    
    container.innerHTML = cartState.items.map(item => `
        <div class="cart-item" data-product-id="${item.id}">
            <div class="item-image">
                <img src="${item.image}" alt="${item.name}" loading="lazy">
            </div>
            
            <div class="item-details">
                <h3 class="item-name">${item.name}</h3>
                <p class="item-price">${formatPrice(item.price)}</p>
                ${item.sku ? `<p class="item-sku">SKU: ${item.sku}</p>` : ''}
                ${generateOptionsDisplay(item.options)}
            </div>
            
            <div class="item-quantity">
                <label for="quantity-${item.id}" class="sr-only">
                    Cantidad de ${item.name}
                </label>
                <div class="quantity-controls">
                    <button type="button" 
                            class="quantity-btn quantity-decrease" 
                            ${item.quantity <= 1 ? 'disabled' : ''}
                            aria-label="Disminuir cantidad de ${item.name}">
                        <i class="fas fa-minus" aria-hidden="true"></i>
                    </button>
                    <input type="number" 
                           id="quantity-${item.id}"
                           class="quantity-input" 
                           value="${item.quantity}" 
                           min="1" 
                           max="${CART_CONFIG.maxQuantity}"
                           aria-label="Cantidad de ${item.name}">
                    <button type="button" 
                            class="quantity-btn quantity-increase"
                            ${item.quantity >= CART_CONFIG.maxQuantity ? 'disabled' : ''}
                            aria-label="Aumentar cantidad de ${item.name}">
                        <i class="fas fa-plus" aria-hidden="true"></i>
                    </button>
                </div>
                <small class="quantity-info">
                    Máx: ${CART_CONFIG.maxQuantity}
                </small>
            </div>
            
            <div class="item-total">
                <span class="total-price">${formatPrice(item.price * item.quantity)}</span>
            </div>
            
            <div class="item-actions">
                <button type="button" 
                        class="remove-item-btn" 
                        aria-label="Eliminar ${item.name} del carrito">
                    <i class="fas fa-trash" aria-hidden="true"></i>
                    Eliminar
                </button>
                <button type="button" 
                        class="wishlist-btn" 
                        onclick="moveToWishlist('${item.id}')"
                        aria-label="Mover ${item.name} a lista de deseos">
                    <i class="fas fa-heart" aria-hidden="true"></i>
                    Guardar
                </button>
            </div>
        </div>
    `).join('');
}

/**
 * Actualizar visualización del resumen del carrito
 */
function updateCartSummaryDisplay(container) {
    if (!container) return;
    
    container.innerHTML = `
        <div class="cart-summary-content">
            <h3>Resumen del Pedido</h3>
            
            <div class="summary-line">
                <span>Subtotal (${cartState.itemCount} productos):</span>
                <span>${formatPrice(cartState.subtotal)}</span>
            </div>
            
            ${cartState.discount > 0 ? `
                <div class="summary-line discount">
                    <span>Descuento (${cartState.discountCode.description}):</span>
                    <span class="discount-amount">-${formatPrice(cartState.discount)}</span>
                </div>
            ` : ''}
            
            <div class="summary-line">
                <span>Envío:</span>
                <span class="${cartState.shipping === 0 ? 'free-shipping' : ''}">
                    ${cartState.shipping === 0 ? 'GRATIS' : formatPrice(cartState.shipping)}
                </span>
            </div>
            
            ${cartState.shipping === 0 && cartState.subtotal < CART_CONFIG.shippingThreshold ? `
                <div class="shipping-info">
                    <i class="fas fa-info-circle" aria-hidden="true"></i>
                    Envío gratis por compras sobre ${formatPrice(CART_CONFIG.shippingThreshold)}
                </div>
            ` : ''}
            
            <div class="summary-line total">
                <span>Total:</span>
                <span class="total-amount">${formatPrice(cartState.total)}</span>
            </div>
            
            ${generateDiscountSection()}
            
            <div class="cart-actions">
                ${cartState.items.length > 0 ? `
                    <button type="button" class="btn btn-primary checkout-btn" onclick="proceedToCheckout()">
                        <i class="fas fa-credit-card" aria-hidden="true"></i>
                        Proceder al Checkout
                    </button>
                    <button type="button" class="btn btn-secondary clear-cart-btn">
                        <i class="fas fa-trash" aria-hidden="true"></i>
                        Vaciar Carrito
                    </button>
                ` : ''}
            </div>
        </div>
    `;
}

/**
 * Generar display de opciones del producto
 */
function generateOptionsDisplay(options) {
    if (!options || Object.keys(options).length === 0) return '';
    
    return `
        <div class="item-options">
            ${Object.entries(options).map(([key, value]) => `
                <span class="option">${key}: ${value}</span>
            `).join('')}
        </div>
    `;
}

/**
 * Generar sección de códigos de descuento
 */
function generateDiscountSection() {
    if (cartState.discountCode) {
        return `
            <div class="discount-section applied">
                <div class="discount-applied">
                    <i class="fas fa-check-circle" aria-hidden="true"></i>
                    <span>Código aplicado: ${cartState.discountCode.description}</span>
                    <button type="button" class="remove-discount-btn" onclick="removeDiscountCode()">
                        <i class="fas fa-times" aria-hidden="true"></i>
                    </button>
                </div>
            </div>
        `;
    }
    
    return `
        <div class="discount-section">
            <form id="discountForm" class="discount-form">
                <label for="discountCode" class="sr-only">Código de descuento</label>
                <div class="discount-input-group">
                    <input type="text" 
                           id="discountCode" 
                           class="discount-input" 
                           placeholder="Código de descuento"
                           maxlength="20"
                           autocomplete="off">
                    <button type="submit" class="apply-discount-btn">
                        Aplicar
                    </button>
                </div>
            </form>
            <div class="available-codes">
                <small>Códigos disponibles: LEVELUP10, GAMER20, FIRSTBUY, DUOCUC</small>
            </div>
        </div>
    `;
}

// ========================================
// CÓDIGOS DE DESCUENTO
// ========================================

/**
 * Aplicar código de descuento
 */
function applyDiscountCode() {
    const input = document.getElementById('discountCode');
    if (!input) return;
    
    const code = input.value.trim().toUpperCase();
    
    if (!code) {
        showCartNotification('Ingresa un código de descuento', 'warning');
        return;
    }
    
    if (cartState.discountCode) {
        showCartNotification('Ya tienes un código aplicado', 'info');
        return;
    }
    
    const discountData = DISCOUNT_CODES[code];
    if (!discountData) {
        showCartNotification('Código de descuento inválido', 'error');
        input.classList.add('error');
        setTimeout(() => input.classList.remove('error'), 3000);
        return;
    }
    
    if (cartState.subtotal < discountData.minAmount) {
        showCartNotification(
            `Compra mínima para este código: ${formatPrice(discountData.minAmount)}`,
            'warning'
        );
        return;
    }
    
    // Aplicar descuento
    cartState.discountCode = discountData;
    updateCartState();
    saveCartToStorage();
    updateAllCartDisplays();
    
    showCartNotification(
        `¡Código aplicado! ${discountData.description}`,
        'success'
    );
    
    // Analytics tracking
    trackCartEvent('apply_discount', {
        code: code,
        discount_amount: cartState.discount
    });
}

/**
 * Remover código de descuento
 */
function removeDiscountCode() {
    if (!cartState.discountCode) return;
    
    const oldDiscount = cartState.discount;
    cartState.discountCode = null;
    
    updateCartState();
    saveCartToStorage();
    updateAllCartDisplays();
    
    showCartNotification('Código de descuento removido', 'info');
    
    // Analytics tracking
    trackCartEvent('remove_discount', {
        discount_removed: oldDiscount
    });
}

// ========================================
// UTILIDADES
// ========================================

/**
 * Mostrar notificación del carrito
 */
function showCartNotification(message, type = 'info') {
    // Crear notificación
    const notification = document.createElement('div');
    notification.className = `cart-notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${getNotificationIcon(type)}" aria-hidden="true"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Agregar al DOM
    document.body.appendChild(notification);
    
    // Mostrar con animación
    requestAnimationFrame(() => {
        notification.classList.add('show');
    });
    
    // Remover después de un tiempo
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
    
    // Anunciar a lectores de pantalla
    announceToScreenReader(message);
}

/**
 * Obtener ícono para notificación
 */
function getNotificationIcon(type) {
    const icons = {
        success: 'check-circle',
        error: 'exclamation-triangle',
        warning: 'exclamation-circle',
        info: 'info-circle'
    };
    return icons[type] || 'info-circle';
}

/**
 * Tracking de eventos del carrito
 */
function trackCartEvent(eventName, eventData = {}) {
    // Analytics tracking (Google Analytics, Facebook Pixel, etc.)
    console.log(`🛒 Cart Event: ${eventName}`, eventData);
    
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, {
            event_category: 'ecommerce',
            ...eventData
        });
    }
    
    if (typeof fbq !== 'undefined') {
        fbq('track', 'AddToCart', eventData);
    }
}

/**
 * Anunciar a lectores de pantalla
 */
function announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
        if (document.body.contains(announcement)) {
            document.body.removeChild(announcement);
        }
    }, 1000);
}

/**
 * Proceder al checkout
 */
function proceedToCheckout() {
    if (cartState.items.length === 0) {
        showCartNotification('El carrito está vacío', 'warning');
        return;
    }
    
    // Validar stock antes del checkout
    const stockIssues = cartState.items.filter(item => 
        !checkStock(item.id, item.quantity)
    );
    
    if (stockIssues.length > 0) {
        showCartNotification('Algunos productos no tienen stock suficiente', 'error');
        return;
    }
    
    // Guardar estado del carrito para el checkout
    localStorage.setItem('levelup_checkout_cart', JSON.stringify(cartState));
    
    // Redirigir al checkout
    window.location.href = '/checkout/';
    
    // Analytics tracking
    trackCartEvent('begin_checkout', {
        items: cartState.items.length,
        value: cartState.total
    });
}

// ========================================
// EXPORTAR FUNCIONES GLOBALES
// ========================================

// Hacer funciones disponibles globalmente para compatibilidad
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;
window.clearCart = clearCart;
window.increaseQuantity = increaseQuantity;
window.decreaseQuantity = decreaseQuantity;
window.moveToWishlist = moveToWishlist;
window.applyDiscountCode = applyDiscountCode;
window.removeDiscountCode = removeDiscountCode;
window.proceedToCheckout = proceedToCheckout;

// Funciones adicionales para obtener estado
window.getCartItems = getCartItems;
window.getCartState = function() {
    return {
        items: [...cartState.items],
        subtotal: cartState.subtotal,
        shipping: cartState.shipping,
        discount: cartState.discount,
        total: cartState.total,
        itemCount: cartState.itemCount,
        discountCode: cartState.discountCode,
        lastUpdated: cartState.lastUpdated
    };
};

// Estado del carrito accesible globalmente
window.cartState = cartState;

// ========================================
// EVENTOS PERSONALIZADOS DE CARRITO
// ========================================

/**
 * Emite un evento personalizado de carrito
 */
function emitCartEvent(eventType, data = {}) {
    const event = new CustomEvent('cart:' + eventType, {
        detail: { ...data, cartState: getCartState() }
    });
    document.dispatchEvent(event);
}

/**
 * Setup de listeners para eventos de carrito
 */
function setupCartEventListeners() {
    // Listener para actualización del carrito
    document.addEventListener('cart:updated', function(event) {
        updateCartBadge();
        if (typeof showNotification === 'function') {
            const { action, product } = event.detail;
            if (action === 'added') {
                showNotification(`✅ ${product.name} agregado al carrito`, 'cart', 2000);
            } else if (action === 'removed') {
                showNotification(`🗑️ ${product.name} eliminado del carrito`, 'warning', 2000);
            } else if (action === 'quantity_updated') {
                showNotification(`� Cantidad de ${product.name} actualizada`, 'info', 1500);
            }
        }
    });

    // Listener para errores del carrito
    document.addEventListener('cart:error', function(event) {
        if (typeof showNotification === 'function') {
            showNotification(`❌ ${event.detail.message}`, 'error', 3000);
        }
        console.error('Error en carrito:', event.detail);
    });
}

/**
 * Actualiza el badge del carrito en la UI
 */
function updateCartBadge() {
    const badges = document.querySelectorAll('#cartBadge, .cart-badge, .cart-count');
    const itemCount = cartState.itemCount;
    
    badges.forEach(badge => {
        badge.textContent = itemCount;
        badge.style.display = itemCount > 0 ? 'flex' : 'none';
        
        // Animación de actualización
        if (itemCount > 0) {
            badge.style.transform = 'scale(1.2)';
            setTimeout(() => {
                badge.style.transform = 'scale(1)';
            }, 200);
        }
    });
}

// Agregar listeners al sistema
setupCartEventListeners();

console.log('�🛒 Sistema CRUD de carrito inicializado completamente');
console.log('📊 Estado inicial del carrito:', getCartState());

// ========================================
// LG-043: NOTIFICACIONES ESPECÍFICAS DEL CARRITO
// ========================================

/**
 * Notificación cuando se agrega un producto al carrito
 */
function notifyProductAdded(product, quantity = 1) {
    const message = `🛒 ${product.name} agregado al carrito (${quantity} ${quantity === 1 ? "unidad" : "unidades"})`;
    showCartNotification(message, "success", {
        duration: 2500,
        ariaLevel: "polite",
        sound: true
    });
}

/**
 * Notificación cuando se elimina un producto del carrito
 */
function notifyProductRemoved(product) {
    const message = `🗑️ ${product.name} eliminado del carrito`;
    showCartNotification(message, "info", {
        duration: 2000,
        ariaLevel: "polite",
        sound: false
    });
}

/**
 * Notificación cuando se actualiza la cantidad de un producto
 */
function notifyQuantityUpdated(product, oldQuantity, newQuantity) {
    const action = newQuantity > oldQuantity ? "aumentada" : "reducida";
    const message = `📊 Cantidad ${action}: ${product.name} (${newQuantity} ${newQuantity === 1 ? "unidad" : "unidades"})`;
    showCartNotification(message, "info", {
        duration: 2000,
        ariaLevel: "polite",
        sound: false
    });
}

/**
 * Notificación cuando se vacía el carrito
 */
function notifyCartCleared() {
    const message = "🗑️ Carrito vaciado completamente";
    showCartNotification(message, "info", {
        duration: 2500,
        ariaLevel: "polite",
        sound: false
    });
}

/**
 * Notificación de compra exitosa
 */
function notifyPurchaseSuccess(total, itemCount) {
    const message = `🎉 ¡Compra exitosa! ${itemCount} ${itemCount === 1 ? "producto" : "productos"} por ${formatPrice(total)}`;
    showCartNotification(message, "success", {
        duration: 5000,
        ariaLevel: "assertive",
        sound: true,
        persistent: false
    });
}

// Exportar funciones de notificación globalmente
window.cartNotifications = {
    notifyProductAdded,
    notifyProductRemoved,
    notifyQuantityUpdated,
    notifyCartCleared,
    notifyPurchaseSuccess
};

