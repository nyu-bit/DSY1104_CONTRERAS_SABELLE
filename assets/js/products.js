// ================================
// LEVEL-UP GAMER - GESTIÓN DE PRODUCTOS
// Funcionalidades del catálogo y productos
// ================================

// Estado del sistema de productos
let productsState = {
    currentCategory: null,
    currentFilters: {},
    searchQuery: '',
    sortOrder: 'name'
};

// ================================
// INICIALIZACIÓN
// ================================

document.addEventListener('DOMContentLoaded', function() {
    initializeProducts();
});

function initializeProducts() {
    // Esperar a que la base de datos esté cargada
    if (typeof PRODUCT_DATABASE === 'undefined') {
        setTimeout(initializeProducts, 100);
        return;
    }
    
    loadPageProducts();
    setupProductEventListeners();
    updateCategoriesUI();
}

function loadPageProducts() {
    const path = window.location.pathname;
    
    if (path.includes('/productos/')) {
        loadProductsPage();
    } else if (path.includes('/index.html') || path.endsWith('/')) {
        loadFeaturedProducts();
    }
}

// ================================
// PRODUCTOS DESTACADOS (HOME)
// ================================

function loadFeaturedProducts() {
    const container = document.getElementById('featuredProducts');
    if (!container) return;

    // Obtener productos destacados
    const featuredProducts = getFeaturedProducts();
    
    if (featuredProducts.length === 0) {
        // Si no hay productos marcados como destacados, usar los mejor calificados
        const allProducts = Object.values(PRODUCT_DATABASE);
        const topRated = allProducts
            .sort((a, b) => b.rating - a.rating)
            .slice(0, 3);
        renderProductsGrid(topRated, container);
    } else {
        renderProductsGrid(featuredProducts, container);
    }
}

// ================================
// PÁGINA DE PRODUCTOS
// ================================

function loadProductsPage() {
    const container = document.getElementById('productsGrid');
    if (!container) return;

    // Obtener parámetros de URL
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    const search = urlParams.get('search');

    let products = Object.values(PRODUCT_DATABASE);

    // Aplicar filtros
    if (category) {
        products = products.filter(p => p.category === category);
        productsState.currentCategory = category;
        updateCategoryTitle(category);
    }

    if (search) {
        products = searchProducts(search);
        productsState.searchQuery = search;
        updateSearchTitle(search);
    }

    renderProductsGrid(products, container);
    updateProductsCount(products.length);
}

// ================================
// RENDERIZADO DE PRODUCTOS
// ================================

function renderProductsGrid(products, container) {
    if (!container) return;

    if (products.length === 0) {
        container.innerHTML = `
            <div class="no-products">
                <div class="no-products-icon">😕</div>
                <h3>No se encontraron productos</h3>
                <p>Intenta con otros términos de búsqueda o categorías</p>
                <a href="../productos/" class="cta-button">Ver Todos los Productos</a>
            </div>
        `;
        return;
    }

    container.innerHTML = products.map(product => renderProductCard(product)).join('');
}

function renderProductCard(product) {
    const discountPercentage = calculateDiscount(product);
    const currentUser = window.authManager?.getCurrentUser();
    const userDiscount = getUserDiscount(currentUser);
    const finalPrice = calculateFinalPrice(product.price, userDiscount);

    return `
        <article class="product-card" data-product-id="${product.id}">
            <div class="product-image-container">
                <img src="${product.image}" alt="${product.name}" class="product-image" 
                     onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22400%22 viewBox=%220 0 400 400%22><rect width=%22400%22 height=%22400%22 fill=%22%23f0f0f0%22/><text x=%22200%22 y=%22200%22 text-anchor=%22middle%22 dy=%22.3em%22 font-family=%22Arial%22 font-size=%2224%22 fill=%22%23999%22>🎮</text></svg>'">
                ${product.featured ? '<div class="featured-badge">⭐ Destacado</div>' : ''}
                ${product.originalPrice > product.price ? 
                    `<div class="discount-badge">-${discountPercentage}%</div>` : ''}
                ${userDiscount > 0 ? 
                    `<div class="user-discount-badge">-${userDiscount}% Adicional</div>` : ''}
            </div>
            
            <div class="product-info">
                <div class="product-category">${product.categoryName || 'Producto'}</div>
                <h3 class="product-title">${product.name}</h3>
                <div class="product-rating">
                    <span class="stars">${renderStars(product.rating)}</span>
                    <span class="rating-text">(${product.reviews})</span>
                </div>
                
                <div class="product-features">
                    ${product.features ? product.features.slice(0, 2).map(feature => 
                        `<span class="feature-tag">${feature}</span>`
                    ).join('') : ''}
                </div>
                
                <div class="product-pricing">
                    ${userDiscount > 0 ? `
                        <div class="price-original">$${formatPrice(product.price)}</div>
                        <div class="price-final">$${formatPrice(finalPrice)}</div>
                    ` : `
                        <div class="price-current">$${formatPrice(product.price)}</div>
                    `}
                </div>
                
                <div class="product-stock">
                    ${product.stock > 10 ? 
                        '<span class="stock-available">✅ Disponible</span>' :
                        product.stock > 0 ?
                        `<span class="stock-limited">⚠️ Últimas ${product.stock} unidades</span>` :
                        '<span class="stock-unavailable">❌ Sin stock</span>'
                    }
                </div>
            </div>
            
            <div class="product-actions">
                <button class="product-button" onclick="viewProductDetails('${product.id}')">
                    Ver Detalles
                </button>
                <button class="cta-button" onclick="addToCart('${product.id}')" 
                        ${product.stock === 0 ? 'disabled' : ''}>
                    ${product.stock === 0 ? 'Sin Stock' : 'Agregar al Carrito'}
                </button>
            </div>
        </article>
    `;
}

function renderStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return '⭐'.repeat(fullStars) + 
           (hasHalfStar ? '✨' : '') + 
           '☆'.repeat(emptyStars);
}

// ================================
// DETALLES DE PRODUCTO
// ================================

function viewProductDetails(productId) {
    const product = getProductById(productId);
    if (!product) return;

    showProductModal(product);
}

function showProductModal(product) {
    const currentUser = window.authManager?.getCurrentUser();
    const userDiscount = getUserDiscount(currentUser);
    const finalPrice = calculateFinalPrice(product.price, userDiscount);

    const modal = document.createElement('div');
    modal.className = 'modal product-modal';
    modal.innerHTML = `
        <div class="modal-content product-detail-content">
            <div class="modal-header">
                <h2>${product.name}</h2>
                <button class="modal-close" onclick="closeProductModal()">&times;</button>
            </div>
            
            <div class="modal-body">
                <div class="product-detail-grid">
                    <div class="product-image-section">
                        <img src="${product.image}" alt="${product.name}" class="product-image-large"
                             onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22400%22 viewBox=%220 0 400 400%22><rect width=%22400%22 height=%22400%22 fill=%22%23f0f0f0%22/><text x=%22200%22 y=%22200%22 text-anchor=%22middle%22 dy=%22.3em%22 font-family=%22Arial%22 font-size=%2248%22 fill=%22%23999%22>🎮</text></svg>'">
                        <div class="product-badges">
                            <span class="code-badge">${product.code}</span>
                            ${product.manufacturer ? `<span class="brand-badge">${product.manufacturer}</span>` : ''}
                            ${product.origin ? `<span class="origin-badge">📍 ${product.origin}</span>` : ''}
                        </div>
                    </div>
                    
                    <div class="product-info-section">
                        <div class="product-category-detail">${product.categoryName || 'Producto'}</div>
                        
                        <div class="product-rating-detail">
                            <span class="stars-large">${renderStars(product.rating)}</span>
                            <span class="rating-number">${product.rating}</span>
                            <span class="reviews-count">(${product.reviews} reseñas)</span>
                        </div>
                        
                        <div class="product-description">
                            <p>${product.description}</p>
                        </div>
                        
                        <div class="product-features-detail">
                            <h4>✨ Características</h4>
                            <ul>
                                ${product.features ? product.features.map(feature => `<li>${feature}</li>`).join('') : '<li>Sin características especificadas</li>'}
                            </ul>
                        </div>
                        
                        ${product.customizable ? `
                            <div class="customization-options">
                                <h4>🎨 Personalización</h4>
                                ${product.sizes ? `
                                    <div class="size-options">
                                        <label>Talla:</label>
                                        <select id="productSize">
                                            ${product.sizes.map(size => 
                                                `<option value="${size}">${size}</option>`
                                            ).join('')}
                                        </select>
                                    </div>
                                ` : ''}
                                ${product.colors ? `
                                    <div class="color-options">
                                        <label>Color:</label>
                                        <select id="productColor">
                                            ${product.colors.map(color => 
                                                `<option value="${color}">${color}</option>`
                                            ).join('')}
                                        </select>
                                    </div>
                                ` : ''}
                            </div>
                        ` : ''}
                        
                        <div class="product-pricing-detail">
                            ${userDiscount > 0 ? `
                                <div class="pricing-breakdown">
                                    <div class="price-line">
                                        <span>Precio base:</span>
                                        <span class="price-original">$${formatPrice(product.price)}</span>
                                    </div>
                                    <div class="price-line discount">
                                        <span>Descuento ${currentUser?.role === 'student' ? 'estudiante' : 'usuario'}:</span>
                                        <span class="discount-amount">-${userDiscount}%</span>
                                    </div>
                                    <div class="price-line final">
                                        <span>Total:</span>
                                        <span class="price-final">$${formatPrice(finalPrice)}</span>
                                    </div>
                                </div>
                            ` : `
                                <div class="price-simple">$${formatPrice(product.price)}</div>
                            `}
                        </div>
                        
                        <div class="product-stock-detail">
                            ${product.stock > 10 ? 
                                '<span class="stock-available">✅ En stock (más de 10 unidades)</span>' :
                                product.stock > 0 ?
                                `<span class="stock-limited">⚠️ Stock limitado (${product.stock} unidades)</span>` :
                                '<span class="stock-unavailable">❌ Sin stock</span>'
                            }
                        </div>
                        
                        <div class="product-actions-detail">
                            <div class="quantity-selector">
                                <label>Cantidad:</label>
                                <div class="quantity-controls">
                                    <button onclick="changeQuantity(-1)">-</button>
                                    <input type="number" id="productQuantity" value="1" min="1" max="${product.stock}">
                                    <button onclick="changeQuantity(1)">+</button>
                                </div>
                            </div>
                            
                            <button class="cta-button add-to-cart-detail" 
                                    onclick="addToCartFromModal('${product.id}')"
                                    ${product.stock === 0 ? 'disabled' : ''}>
                                ${product.stock === 0 ? 'Sin Stock' : 'Agregar al Carrito'}
                            </button>
                        </div>
                    </div>
                </div>
                
                <!-- Sección de reseñas -->
                <div class="reviews-container" id="productReviews">
                    <!-- Las reseñas se cargarán aquí -->
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    modal.style.display = 'flex';

    // Cargar reseñas del producto
    if (window.reviewsSystem) {
        window.reviewsSystem.renderProductReviews(product.id, modal.querySelector('#productReviews'));
    }
}

function closeProductModal() {
    const modal = document.querySelector('.product-modal');
    if (modal) {
        modal.remove();
    }
}

function changeQuantity(delta) {
    const quantityInput = document.getElementById('productQuantity');
    if (!quantityInput) return;

    const currentValue = parseInt(quantityInput.value);
    const newValue = currentValue + delta;
    const maxValue = parseInt(quantityInput.max);

    if (newValue >= 1 && newValue <= maxValue) {
        quantityInput.value = newValue;
    }
}

function addToCartFromModal(productId) {
    const quantityInput = document.getElementById('productQuantity');
    const quantity = quantityInput ? parseInt(quantityInput.value) : 1;

    // Obtener opciones de personalización si existen
    const sizeSelect = document.getElementById('productSize');
    const colorSelect = document.getElementById('productColor');
    
    const options = {};
    if (sizeSelect) options.size = sizeSelect.value;
    if (colorSelect) options.color = colorSelect.value;

    addToCart(productId, quantity, options);
    closeProductModal();
}

// ================================
// CARRITO CON LOCALSTORAGE
// ================================

function addToCart(productId, quantity = 1, options = {}) {
    const product = getProductById(productId);
    if (!product || product.stock === 0) {
        showNotification('Producto no disponible', 'error');
        return;
    }

    // Obtener carrito actual del localStorage
    let cart = getCartFromStorage();
    
    // Crear clave única para el producto (incluye opciones)
    const cartKey = createCartKey(productId, options);
    
    // Verificar si el producto ya está en el carrito
    const existingItem = cart.find(item => item.key === cartKey);
    
    if (existingItem) {
        // Actualizar cantidad
        const newQuantity = existingItem.quantity + quantity;
        if (newQuantity <= product.stock) {
            existingItem.quantity = newQuantity;
            showNotification(`Cantidad actualizada: ${product.name}`, 'success');
        } else {
            showNotification(`Stock insuficiente. Máximo: ${product.stock}`, 'warning');
            return;
        }
    } else {
        // Agregar nuevo producto
        if (quantity <= product.stock) {
            cart.push({
                key: cartKey,
                productId: productId,
                quantity: quantity,
                options: options,
                addedAt: new Date().toISOString()
            });
            showNotification(`${product.name} agregado al carrito`, 'success');
        } else {
            showNotification(`Stock insuficiente. Máximo: ${product.stock}`, 'warning');
            return;
        }
    }
    
    // Guardar carrito actualizado
    saveCartToStorage(cart);
    updateCartUI();
    
    // Dar puntos por agregar al carrito (si el sistema de gamificación está disponible)
    if (window.gamificationSystem) {
        window.gamificationSystem.addPoints('add_to_cart');
    }
}

function createCartKey(productId, options = {}) {
    const optionsString = Object.keys(options).length > 0 ? 
        JSON.stringify(options) : '';
    return `${productId}_${optionsString}`;
}

function getCartFromStorage() {
    try {
        const cartData = localStorage.getItem('levelup_cart');
        return cartData ? JSON.parse(cartData) : [];
    } catch (error) {
        console.error('Error al cargar carrito:', error);
        return [];
    }
}

function saveCartToStorage(cart) {
    try {
        localStorage.setItem('levelup_cart', JSON.stringify(cart));
    } catch (error) {
        console.error('Error al guardar carrito:', error);
    }
}

function updateCartUI() {
    const cart = getCartFromStorage();
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    
    // Actualizar contador del carrito en la UI
    const cartBadge = document.querySelector('.cart-badge');
    if (cartBadge) {
        cartBadge.textContent = cartCount;
        cartBadge.style.display = cartCount > 0 ? 'block' : 'none';
    }
    
    // Actualizar icono del carrito
    const cartIcon = document.querySelector('.cart-icon');
    if (cartIcon) {
        cartIcon.classList.toggle('has-items', cartCount > 0);
    }
}

// ================================
// FILTROS Y BÚSQUEDA
// ================================

function setupProductEventListeners() {
    // Filtros de categoría
    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach(card => {
        card.addEventListener('click', function() {
            const category = this.dataset.category;
            window.location.href = `productos/?category=${category}`;
        });
    });

    // Búsqueda
    const searchForm = document.getElementById('searchForm');
    if (searchForm) {
        searchForm.addEventListener('submit', handleSearch);
    }

    // Filtros avanzados
    setupAdvancedFilters();
    
    // Inicializar UI del carrito
    updateCartUI();
}

function handleSearch(event) {
    event.preventDefault();
    const searchInput = document.getElementById('searchInput');
    if (searchInput && searchInput.value.trim()) {
        window.location.href = `productos/?search=${encodeURIComponent(searchInput.value.trim())}`;
    }
}

function setupAdvancedFilters() {
    const filterElements = [
        'categoryFilter',
        'priceFilter', 
        'ratingFilter',
        'sortFilter'
    ];

    filterElements.forEach(filterId => {
        const element = document.getElementById(filterId);
        if (element) {
            element.addEventListener('change', applyFilters);
        }
    });
}

function applyFilters() {
    const category = document.getElementById('categoryFilter')?.value;
    const priceRange = document.getElementById('priceFilter')?.value;
    const rating = document.getElementById('ratingFilter')?.value;
    const sort = document.getElementById('sortFilter')?.value;

    let products = Object.values(PRODUCT_DATABASE);

    // Aplicar filtros
    if (category) {
        products = products.filter(p => p.category === category);
    }

    if (priceRange) {
        const [min, max] = priceRange.split('-').map(Number);
        products = products.filter(p => {
            if (max) return p.price >= min && p.price <= max;
            return p.price >= min;
        });
    }

    if (rating) {
        products = products.filter(p => p.rating >= parseFloat(rating));
    }

    // Aplicar ordenamiento
    if (sort) {
        switch (sort) {
            case 'price-low':
                products.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                products.sort((a, b) => b.price - a.price);
                break;
            case 'rating':
                products.sort((a, b) => b.rating - a.rating);
                break;
            case 'name':
                products.sort((a, b) => a.name.localeCompare(b.name));
                break;
        }
    }

    const container = document.getElementById('productsGrid');
    if (container) {
        renderProductsGrid(products, container);
        updateProductsCount(products.length);
    }
}

// ================================
// UTILIDADES
// ================================

function updateCategoryTitle(category) {
    const categoryInfo = CATEGORIES[category];
    const titleElement = document.querySelector('.products-title');
    if (titleElement && categoryInfo) {
        titleElement.innerHTML = `${categoryInfo.icon} ${categoryInfo.name}`;
    }
}

function updateSearchTitle(query) {
    const titleElement = document.querySelector('.products-title');
    if (titleElement) {
        titleElement.innerHTML = `🔍 Resultados para: "${query}"`;
    }
}

function updateProductsCount(count) {
    const countElement = document.querySelector('.products-count');
    if (countElement) {
        countElement.textContent = `${count} productos encontrados`;
    }
}

function updateCategoriesUI() {
    const categoriesContainer = document.querySelector('.categories-grid');
    if (!categoriesContainer) return;

    // Actualizar contadores de productos por categoría
    Object.keys(CATEGORIES).forEach(categoryId => {
        const categoryCard = document.querySelector(`[data-category="${categoryId}"]`);
        if (categoryCard) {
            const products = Object.values(PRODUCT_DATABASE).filter(p => p.category === categoryId);
            const countElement = categoryCard.querySelector('.category-count');
            if (countElement) {
                countElement.textContent = `${products.length}+ productos`;
            }
        }
    });
}

function calculateDiscount(product) {
    if (product.originalPrice && product.originalPrice > product.price) {
        return Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
    }
    return 0;
}

function getUserDiscount(user) {
    if (!user) return 0;
    
    // Descuento especial para estudiantes Duoc UC
    if (user.email && user.email.includes('@duocuc.cl')) {
        return 20;
    }
    
    // Descuento por nivel de gamificación
    if (window.gamificationSystem) {
        const levelInfo = window.gamificationSystem.getCurrentLevelInfo();
        if (levelInfo && levelInfo.benefits) {
            const discountText = levelInfo.benefits.find(b => b.includes('Descuento'));
            if (discountText) {
                const match = discountText.match(/(\d+)%/);
                return match ? parseInt(match[1]) : 0;
            }
        }
    }
    
    return 0;
}

function calculateFinalPrice(price, discountPercentage) {
    return price * (1 - discountPercentage / 100);
}

function formatPrice(price) {
    return new Intl.NumberFormat('es-CL').format(Math.round(price));
}

function showNotification(message, type = 'info') {
    if (window.levelUpGamer && window.levelUpGamer.showNotification) {
        window.levelUpGamer.showNotification(message, type);
    } else {
        console.log(`${type.toUpperCase()}: ${message}`);
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

// ================================
// EXPORTAR FUNCIONES
// ================================

window.productsManager = {
    loadFeaturedProducts,
    renderProductsGrid,
    viewProductDetails,
    applyFilters,
    addToCart,
    getCartFromStorage,
    saveCartToStorage,
    updateCartUI,
    calculateFinalPrice,
    getUserDiscount
};
