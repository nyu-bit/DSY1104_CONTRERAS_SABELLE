// ====================================================
// FUNCIONES PRINCIPALES LEVEL-UP GAMER
// Inicialización y funciones globales
// ====================================================

// Variables globales
window.LEVELUP_GAMER = {
    initialized: false,
    cartReady: false,
    searchReady: false,
    productsReady: false
};

// Función principal de inicialización
function initializeLevelUpGamer() {
    console.log('🚀 Inicializando LEVEL-UP GAMER...');
    
    // Verificar que todos los sistemas estén listos
    const systemsReady = {
        products: !!window.PRODUCT_DATABASE,
        cart: !!window.shoppingCart,
        search: !!window.smartSearchManager
    };
    
    console.log('🔍 Estado de sistemas:', systemsReady);
    
    if (Object.values(systemsReady).every(ready => ready)) {
        window.LEVELUP_GAMER.initialized = true;
        console.log('✅ Todos los sistemas inicializados correctamente');
        
        // Configurar eventos globales
        setupGlobalEvents();
        
        // Cargar productos destacados
        loadFeaturedProducts();
        
        // Mostrar mensaje de bienvenida en consola
        console.log(`
🎮 ========================================
   LEVEL-UP GAMER - SISTEMA ACTIVO
========================================
✅ Base de datos: ${Object.keys(window.PRODUCT_DATABASE).length} productos
✅ Carrito: Funcional
✅ Búsqueda: Inteligente activa
✅ Todos los sistemas operativos
========================================`);
    } else {
        console.warn('⚠️ Algunos sistemas no están listos:', systemsReady);
    }
}

// Configurar eventos globales
function setupGlobalEvents() {
    // Event listener para debugging
    document.addEventListener('keydown', (e) => {
        // Ctrl + Shift + D = Debug info
        if (e.ctrlKey && e.shiftKey && e.key === 'D') {
            e.preventDefault();
            showDebugInfo();
        }
    });
    
    console.log('🎯 Eventos globales configurados');
}

// Cargar productos destacados dinámicamente
function loadFeaturedProducts() {
    console.log('⭐ Cargando productos destacados...');
    
    const featuredContainer = document.getElementById('featuredProducts');
    if (!featuredContainer) {
        console.warn('⚠️ Contenedor de productos destacados no encontrado');
        return;
    }
    
    if (!window.PRODUCT_DATABASE) {
        console.error('❌ Base de datos de productos no disponible');
        return;
    }
    
    // Seleccionar productos destacados (los primeros 3 con stock)
    const featuredProducts = Object.values(window.PRODUCT_DATABASE)
        .filter(product => product.stock > 0)
        .slice(0, 3);
    
    console.log('📦 Productos destacados seleccionados:', featuredProducts.length);
    
    if (featuredProducts.length === 0) {
        featuredContainer.innerHTML = `
            <div class="no-products-message">
                <i class="fas fa-box-open"></i>
                <h3>No hay productos destacados disponibles</h3>
                <p>Vuelve pronto para ver nuestras mejores ofertas</p>
            </div>`;
        return;
    }
    
    // Generar HTML para cada producto
    const productsHTML = featuredProducts.map(product => `
        <article class="product-card card-gamer" data-product-id="${product.codigo}">
            <div class="product-badge">
                <span class="badge-featured">DESTACADO</span>
            </div>
            <div class="product-image">
                <img src="${product.imagen || 'assets/images/placeholder-product.jpg'}" 
                     alt="${product.nombre}" 
                     loading="lazy"
                     onerror="this.src='assets/images/placeholder-product.jpg'">
                <div class="product-overlay">
                    <button class="quick-view-btn" onclick="showProductDetails('${product.codigo}')" 
                            aria-label="Vista rápida de ${product.nombre}">
                        <i class="fas fa-eye"></i> Vista Rápida
                    </button>
                </div>
            </div>
            <div class="product-info">
                <div class="product-category">${product.categoria}</div>
                <h3 class="product-title">${product.nombre}</h3>
                <div class="product-description">
                    ${product.descripcion ? product.descripcion.substring(0, 80) + '...' : 'Producto gaming de alta calidad'}
                </div>
                <div class="product-price">
                    <span class="price-current">${formatPrice(product.precio)}</span>
                    <span class="price-currency">CLP</span>
                </div>
                <div class="product-stock">
                    <i class="fas fa-box"></i>
                    <span class="stock-count">${product.stock} disponibles</span>
                </div>
                <div class="product-rating">
                    <div class="stars">
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                    </div>
                    <span class="rating-text">(4.8/5)</span>
                </div>
            </div>
            <div class="product-actions">
                <button class="add-to-cart-btn btn-primary" 
                        data-product-id="${product.codigo}"
                        data-quantity="1"
                        aria-label="Agregar ${product.nombre} al carrito">
                    <i class="fas fa-shopping-cart"></i>
                    Agregar al Carrito
                </button>
                <button class="wishlist-btn btn-secondary" 
                        onclick="addToWishlist('${product.codigo}')"
                        aria-label="Agregar ${product.nombre} a favoritos">
                    <i class="far fa-heart"></i>
                </button>
            </div>
        </article>
    `).join('');
    
    // Insertar en el DOM con animación
    featuredContainer.innerHTML = productsHTML;
    
    // Agregar event listeners para los botones de agregar al carrito
    setupProductCardEvents(featuredContainer);
    
    // Animación de aparición
    featuredContainer.style.opacity = '0';
    featuredContainer.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        featuredContainer.style.transition = 'all 0.6s ease';
        featuredContainer.style.opacity = '1';
        featuredContainer.style.transform = 'translateY(0)';
    }, 100);
    
    console.log('✅ Productos destacados cargados exitosamente');
}

// Configurar eventos para las cards de productos
function setupProductCardEvents(container) {
    const addToCartButtons = container.querySelectorAll('.add-to-cart-btn');
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            
            const productId = button.dataset.productId;
            const quantity = parseInt(button.dataset.quantity) || 1;
            
            console.log(`🛒 Agregando al carrito: ${productId} (cantidad: ${quantity})`);
            
            if (window.shoppingCart) {
                const success = window.shoppingCart.addToCart(productId, quantity);
                
                if (success) {
                    // Efecto visual de éxito
                    button.style.transform = 'scale(0.95)';
                    button.innerHTML = '<i class="fas fa-check"></i> ¡Agregado!';
                    button.classList.add('added');
                    
                    setTimeout(() => {
                        button.style.transform = 'scale(1)';
                        button.innerHTML = '<i class="fas fa-shopping-cart"></i> Agregar al Carrito';
                        button.classList.remove('added');
                    }, 2000);
                }
            } else {
                console.error('❌ Sistema de carrito no disponible');
                showNotification('Error: Sistema de carrito no disponible', 'error');
            }
        });
    });
}

// Mostrar información de debug
function showDebugInfo() {
    const debugInfo = {
        timestamp: new Date().toISOString(),
        systems: {
            products: !!window.PRODUCT_DATABASE,
            cart: !!window.shoppingCart,
            search: !!window.smartSearchManager,
            initialized: window.LEVELUP_GAMER.initialized
        },
        cart: window.shoppingCart ? window.shoppingCart.getCartSummary() : null,
        products: window.PRODUCT_DATABASE ? Object.keys(window.PRODUCT_DATABASE).length : 0,
        localStorage: {
            cart: !!localStorage.getItem('levelup_gamer_cart'),
            products: !!localStorage.getItem('levelup_gamer_products')
        }
    };
    
    console.log('🐛 LEVEL-UP GAMER Debug Info:', debugInfo);
    
    // Mostrar en modal si es necesario
    alert(`LEVEL-UP GAMER Debug Info:
    
Sistemas: ${JSON.stringify(debugInfo.systems, null, 2)}
Carrito: ${debugInfo.cart ? debugInfo.cart.totalItems + ' items' : 'No disponible'}
Productos: ${debugInfo.products} disponibles
LocalStorage: ${Object.values(debugInfo.localStorage).every(v => v) ? 'OK' : 'Parcial'}`);
}

// Funciones de compatibilidad para botones antiguos
window.addToCartOffer = function(offerId) {
    console.log('🔄 Llamada legacy addToCartOffer:', offerId);
    
    // Mapear IDs legacy a nuevos IDs
    const legacyMapping = {
        'offer-1': 'PC-RTX4070',
        'offer-2': 'CONSOLE-PS5',
        'offer-3': 'CHAIR-SECRETLAB'
    };
    
    const productId = legacyMapping[offerId];
    if (productId && window.shoppingCart) {
        window.shoppingCart.addToCart(productId, 1);
    } else {
        console.error('❌ No se pudo mapear offer:', offerId);
    }
};

// Mostrar detalles de producto (vista rápida)
window.showProductDetails = function(productId) {
    console.log('👁️ Mostrando detalles de:', productId);
    
    if (!window.PRODUCT_DATABASE || !window.PRODUCT_DATABASE[productId]) {
        console.error('❌ Producto no encontrado:', productId);
        return;
    }
    
    const product = window.PRODUCT_DATABASE[productId];
    
    // Crear modal simple
    const modal = document.createElement('div');
    modal.className = 'product-modal-overlay';
    modal.innerHTML = `
        <div class="product-modal">
            <div class="modal-header">
                <h3>${product.nombre}</h3>
                <button class="modal-close" onclick="this.closest('.product-modal-overlay').remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <div class="modal-image">
                    <img src="${product.imagen || 'assets/images/placeholder-product.jpg'}" 
                         alt="${product.nombre}"
                         onerror="this.src='assets/images/placeholder-product.jpg'">
                </div>
                <div class="modal-info">
                    <div class="product-category">${product.categoria}</div>
                    <div class="product-description">
                        ${product.descripcion || 'Producto gaming de alta calidad'}
                    </div>
                    <div class="product-price">
                        <strong>${formatPrice(product.precio)}</strong>
                    </div>
                    <div class="product-stock">
                        Stock: ${product.stock} disponibles
                    </div>
                    <div class="product-tags">
                        ${product.tags ? product.tags.map(tag => `<span class="tag">#${tag}</span>`).join('') : ''}
                    </div>
                </div>
            </div>
            <div class="modal-actions">
                <button class="btn btn-primary" onclick="window.shoppingCart?.addToCart('${productId}', 1); this.closest('.product-modal-overlay').remove();">
                    <i class="fas fa-shopping-cart"></i> Agregar al Carrito
                </button>
                <button class="btn btn-secondary" onclick="this.closest('.product-modal-overlay').remove()">
                    Cerrar
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Cerrar con Escape
    const closeOnEscape = (e) => {
        if (e.key === 'Escape') {
            modal.remove();
            document.removeEventListener('keydown', closeOnEscape);
        }
    };
    document.addEventListener('keydown', closeOnEscape);
};

// Agregar a lista de deseos
window.addToWishlist = function(productId) {
    console.log('❤️ Agregando a favoritos:', productId);
    
    let wishlist = JSON.parse(localStorage.getItem('levelup_gamer_wishlist') || '[]');
    
    if (!wishlist.includes(productId)) {
        wishlist.push(productId);
        localStorage.setItem('levelup_gamer_wishlist', JSON.stringify(wishlist));
        showNotification('Producto agregado a favoritos', 'success');
    } else {
        showNotification('El producto ya está en favoritos', 'info');
    }
};

window.quickViewOffer = function(offerId) {
    console.log('👁️ Vista rápida legacy:', offerId);
    // Placeholder para vista rápida
    alert(`Vista rápida de ${offerId} - Funcionalidad en desarrollo`);
};

// Funciones adicionales de utilidad
window.formatPrice = function(price) {
    return new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP',
        minimumFractionDigits: 0
    }).format(price);
};

window.showNotification = function(message, type = 'info') {
    if (window.shoppingCart) {
        window.shoppingCart.showNotification(message, type);
    } else {
        console.log(`${type.toUpperCase()}: ${message}`);
    }
};

// Inicialización automática
document.addEventListener('DOMContentLoaded', () => {
    // Esperar un poco para que otros scripts se carguen
    setTimeout(initializeLevelUpGamer, 500);
});

// También intentar inicializar si la página ya está cargada
if (document.readyState !== 'loading') {
    setTimeout(initializeLevelUpGamer, 100);
}

console.log('📝 Main.js cargado correctamente');