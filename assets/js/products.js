// ================================
// LEVEL-UP GAMER - GESTIÓN DE PRODUCTOS
// Funcionalidades del catálogo y productos
// ================================

// Estado del sistema de productos
let productsState = {
    currentCategory: null,
    currentFilters: {},
    searchQuery: '',
    sortOrder: 'name',
    currentPage: 1,
    itemsPerPage: 12,
    totalItems: 0,
    allProducts: []
};

// ================================
// LG-028: SISTEMA DE FAVORITOS / WISHLIST
// ================================

// Estado de favoritos
let favoritesState = {
    items: []
};

// Inicializar favoritos desde localStorage
function initializeFavorites() {
    try {
        const savedFavorites = localStorage.getItem('levelup_favorites');
        if (savedFavorites) {
            favoritesState.items = JSON.parse(savedFavorites);
        }
    } catch (e) {
        console.warn('Error cargando favoritos desde localStorage:', e);
        favoritesState.items = [];
    }
    updateFavoritesUI();
}

// Guardar favoritos en localStorage
function saveFavorites() {
    try {
        localStorage.setItem('levelup_favorites', JSON.stringify(favoritesState.items));
    } catch (e) {
        console.warn('Error guardando favoritos en localStorage:', e);
    }
}

// Verificar si un producto está en favoritos
function isInFavorites(productId) {
    return favoritesState.items.includes(productId);
}

// Alternar producto en favoritos
function toggleFavorite(productId) {
    const index = favoritesState.items.indexOf(productId);
    
    if (index > -1) {
        // Remover de favoritos
        favoritesState.items.splice(index, 1);
        showNotification('Producto removido de favoritos', 'info');
    } else {
        // Agregar a favoritos
        favoritesState.items.push(productId);
        showNotification('Producto agregado a favoritos ❤️', 'success');
    }
    
    saveFavorites();
    updateFavoritesUI();
    updateFavoriteButtons();
}

// Obtener productos favoritos
function getFavoriteProducts() {
    return favoritesState.items
        .map(id => PRODUCT_DATABASE[id])
        .filter(product => product); // Filtrar productos que ya no existen
}

// Actualizar UI de favoritos
function updateFavoritesUI() {
    // Actualizar contador de favoritos
    const favoriteCounters = document.querySelectorAll('.favorites-counter');
    favoriteCounters.forEach(counter => {
        counter.textContent = favoritesState.items.length;
        counter.style.display = favoritesState.items.length > 0 ? 'inline' : 'none';
    });
    
    // Actualizar panel de acceso rápido si existe
    const favoritesQuickAccess = document.querySelector('[data-action="favorites"]');
    if (favoritesQuickAccess) {
        const badge = favoritesQuickAccess.querySelector('.favorites-badge');
        if (badge) {
            badge.textContent = favoritesState.items.length;
            badge.style.display = favoritesState.items.length > 0 ? 'inline' : 'none';
        }
    }
}

// Actualizar botones de favoritos en las cards
function updateFavoriteButtons() {
    const favoriteButtons = document.querySelectorAll('.favorite-btn');
    favoriteButtons.forEach(btn => {
        const productId = btn.getAttribute('data-product-id');
        const isActive = isInFavorites(productId);
        
        btn.classList.toggle('active', isActive);
        btn.setAttribute('aria-pressed', isActive);
        
        const icon = btn.querySelector('i');
        if (icon) {
            icon.className = isActive ? 'fas fa-heart' : 'far fa-heart';
        }
        
        const text = btn.querySelector('.favorite-text');
        if (text) {
            text.textContent = isActive ? 'En Favoritos' : 'Agregar a Favoritos';
        }
    });
}

// Limpiar favoritos
function clearFavorites() {
    if (favoritesState.items.length === 0) {
        showNotification('No hay favoritos para limpiar', 'info');
        return;
    }
    
    if (confirm('¿Estás seguro de que quieres limpiar todos los favoritos?')) {
        favoritesState.items = [];
        saveFavorites();
        updateFavoritesUI();
        updateFavoriteButtons();
        showNotification('Favoritos limpiados', 'success');
    }
}

// Mostrar modal de favoritos
function showFavoritesModal() {
    const favoriteProducts = getFavoriteProducts();
    
    if (favoriteProducts.length === 0) {
        showNotification('No tienes productos favoritos aún', 'info');
        return;
    }
    
    let modalHTML = `
        <div class="favorites-modal-overlay" onclick="closeFavoritesModal()">
            <div class="favorites-modal" onclick="event.stopPropagation()">
                <div class="favorites-modal-header">
                    <h2>❤️ Mis Favoritos</h2>
                    <button class="modal-close-btn" onclick="closeFavoritesModal()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="favorites-modal-content">
                    <div class="favorites-actions">
                        <span class="favorites-count">${favoriteProducts.length} productos favoritos</span>
                        <button class="btn-clear-favorites" onclick="clearFavorites()">
                            <i class="fas fa-trash"></i> Limpiar Todo
                        </button>
                    </div>
                    <div class="favorites-grid">
    `;
    
    favoriteProducts.forEach(product => {
        modalHTML += `
            <div class="favorite-item">
                <div class="favorite-item-image">
                    <img src="${product.image || 'assets/images/placeholder-product.jpg'}" 
                         alt="${product.name}"
                         onerror="this.src='assets/images/placeholder-product.jpg'">
                </div>
                <div class="favorite-item-info">
                    <h4>${product.name}</h4>
                    <p class="favorite-item-price">$${formatPrice(product.price)}</p>
                    <div class="favorite-item-actions">
                        <button class="btn-view-product" onclick="viewProduct('${product.id}')">
                            <i class="fas fa-eye"></i> Ver Producto
                        </button>
                        <button class="btn-remove-favorite" onclick="toggleFavorite('${product.id}')">
                            <i class="fas fa-heart-broken"></i> Remover
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
    
    modalHTML += `
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Crear e insertar modal
    const modalContainer = document.createElement('div');
    modalContainer.innerHTML = modalHTML;
    document.body.appendChild(modalContainer);
}

// ================================
// LG-029: RECOMENDACIONES PERSONALIZADAS
// ================================

// Estado de historial y recomendaciones
let recommendationsState = {
    viewHistory: [],
    purchaseHistory: [],
    categoryPreferences: {},
    brandPreferences: {},
    priceRange: { min: 0, max: 1000000 }
};

// Inicializar sistema de recomendaciones
function initializeRecommendations() {
    try {
        const savedHistory = localStorage.getItem('levelup_user_history');
        if (savedHistory) {
            recommendationsState = { ...recommendationsState, ...JSON.parse(savedHistory) };
        }
    } catch (e) {
        console.warn('Error cargando historial de usuario:', e);
    }
    
    updateRecommendations();
}

// Guardar historial en localStorage
function saveUserHistory() {
    try {
        localStorage.setItem('levelup_user_history', JSON.stringify(recommendationsState));
    } catch (e) {
        console.warn('Error guardando historial de usuario:', e);
    }
}

// Registrar vista de producto
function trackProductView(productId) {
    const product = getProductById(productId);
    if (!product) return;
    
    // Agregar al historial de vistas
    recommendationsState.viewHistory = recommendationsState.viewHistory.filter(id => id !== productId);
    recommendationsState.viewHistory.unshift(productId);
    
    // Mantener solo las últimas 50 vistas
    if (recommendationsState.viewHistory.length > 50) {
        recommendationsState.viewHistory = recommendationsState.viewHistory.slice(0, 50);
    }
    
    // Actualizar preferencias de categoría
    const category = product.category;
    recommendationsState.categoryPreferences[category] = 
        (recommendationsState.categoryPreferences[category] || 0) + 1;
    
    // Actualizar preferencias de marca
    const brand = product.brand;
    if (brand) {
        recommendationsState.brandPreferences[brand] = 
            (recommendationsState.brandPreferences[brand] || 0) + 1;
    }
    
    // Actualizar rango de precios
    if (product.price < recommendationsState.priceRange.min || recommendationsState.priceRange.min === 0) {
        recommendationsState.priceRange.min = Math.max(0, product.price - 50000);
    }
    if (product.price > recommendationsState.priceRange.max) {
        recommendationsState.priceRange.max = product.price + 50000;
    }
    
    saveUserHistory();
    updateRecommendations();
}

// Registrar compra de producto
function trackProductPurchase(productId) {
    const product = getProductById(productId);
    if (!product) return;
    
    // Agregar al historial de compras
    recommendationsState.purchaseHistory.unshift(productId);
    
    // Peso mayor para productos comprados
    const category = product.category;
    recommendationsState.categoryPreferences[category] = 
        (recommendationsState.categoryPreferences[category] || 0) + 3;
    
    const brand = product.brand;
    if (brand) {
        recommendationsState.brandPreferences[brand] = 
            (recommendationsState.brandPreferences[brand] || 0) + 2;
    }
    
    saveUserHistory();
    updateRecommendations();
}

// Generar recomendaciones personalizadas
function generatePersonalizedRecommendations(limit = 6) {
    const allProducts = Object.values(PRODUCT_DATABASE);
    
    // Si no hay historial, devolver productos mejor calificados
    if (recommendationsState.viewHistory.length === 0) {
        return allProducts
            .filter(p => p.rating >= 4.0)
            .sort((a, b) => b.rating - a.rating)
            .slice(0, limit);
    }
    
    // Calcular score para cada producto
    const scoredProducts = allProducts.map(product => {
        let score = 0;
        
        // Puntuación base por rating
        score += product.rating * 10;
        
        // Bonus por categoría preferida
        const categoryPreference = recommendationsState.categoryPreferences[product.category] || 0;
        score += categoryPreference * 20;
        
        // Bonus por marca preferida
        const brandPreference = recommendationsState.brandPreferences[product.brand] || 0;
        score += brandPreference * 15;
        
        // Penalty si está fuera del rango de precio preferido
        if (product.price < recommendationsState.priceRange.min || 
            product.price > recommendationsState.priceRange.max) {
            score -= 30;
        }
        
        // Bonus si está en el rango de precio preferido
        if (product.price >= recommendationsState.priceRange.min && 
            product.price <= recommendationsState.priceRange.max) {
            score += 25;
        }
        
        // Penalty si ya fue visto recientemente
        const viewIndex = recommendationsState.viewHistory.indexOf(product.id);
        if (viewIndex !== -1) {
            score -= (50 - viewIndex * 2); // Menos penalty para vistas más antiguas
        }
        
        // Penalty si ya fue comprado
        if (recommendationsState.purchaseHistory.includes(product.id)) {
            score -= 100;
        }
        
        // Bonus por stock disponible
        if (product.stock > 0) {
            score += 10;
        }
        
        return { ...product, recommendationScore: score };
    });
    
    // Ordenar por score y devolver los mejores
    return scoredProducts
        .sort((a, b) => b.recommendationScore - a.recommendationScore)
        .slice(0, limit);
}

// Generar recomendaciones por categoría similar
function getRecommendationsByCategory(productId, limit = 4) {
    const product = getProductById(productId);
    if (!product) return [];
    
    return Object.values(PRODUCT_DATABASE)
        .filter(p => 
            p.category === product.category && 
            p.id !== productId &&
            p.stock > 0
        )
        .sort((a, b) => b.rating - a.rating)
        .slice(0, limit);
}

// Generar recomendaciones por marca similar
function getRecommendationsByBrand(productId, limit = 4) {
    const product = getProductById(productId);
    if (!product || !product.brand) return [];
    
    return Object.values(PRODUCT_DATABASE)
        .filter(p => 
            p.brand === product.brand && 
            p.id !== productId &&
            p.stock > 0
        )
        .sort((a, b) => b.rating - a.rating)
        .slice(0, limit);
}

// Generar recomendaciones "Los usuarios también vieron"
function getAlsoViewedRecommendations(productId, limit = 4) {
    // Simulación simple: productos de la misma categoría y rango de precio similar
    const product = getProductById(productId);
    if (!product) return [];
    
    const priceRange = {
        min: product.price * 0.7,
        max: product.price * 1.3
    };
    
    return Object.values(PRODUCT_DATABASE)
        .filter(p => 
            p.category === product.category && 
            p.id !== productId &&
            p.price >= priceRange.min &&
            p.price <= priceRange.max &&
            p.stock > 0
        )
        .sort(() => Math.random() - 0.5) // Aleatorio pero reproducible
        .slice(0, limit);
}

// Actualizar sección de recomendaciones en la página
function updateRecommendations() {
    const recommendationsContainer = document.getElementById('personalizedRecommendations');
    if (!recommendationsContainer) return;
    
    const recommendations = generatePersonalizedRecommendations(6);
    
    if (recommendations.length === 0) return;
    
    let html = `
        <div class="recommendations-header">
            <h3>🎯 Recomendado para ti</h3>
            <p>Basado en tu historial de navegación y preferencias</p>
        </div>
        <div class="recommendations-grid">
    `;
    
    recommendations.forEach(product => {
        html += renderProductCard(product);
    });
    
    html += '</div>';
    
    recommendationsContainer.innerHTML = html;
}

// Mostrar razón de la recomendación
function getRecommendationReason(product) {
    const reasons = [];
    
    if (recommendationsState.categoryPreferences[product.category] > 2) {
        reasons.push(`Te gusta la categoría ${product.category}`);
    }
    
    if (recommendationsState.brandPreferences[product.brand] > 1) {
        reasons.push(`Has visto productos de ${product.brand}`);
    }
    
    if (product.rating >= 4.5) {
        reasons.push('Altamente calificado');
    }
    
    if (product.price >= recommendationsState.priceRange.min && 
        product.price <= recommendationsState.priceRange.max) {
        reasons.push('En tu rango de precio');
    }
    
    return reasons.length > 0 ? reasons[0] : 'Producto popular';
}

// Renderizar widget de recomendaciones
function renderRecommendationsWidget(containerId, productId = null) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    let recommendations;
    let title;
    
    if (productId) {
        // Recomendaciones específicas para un producto
        const categoryRecs = getRecommendationsByCategory(productId, 2);
        const brandRecs = getRecommendationsByBrand(productId, 2);
        const alsoViewed = getAlsoViewedRecommendations(productId, 2);
        
        recommendations = [...categoryRecs, ...brandRecs, ...alsoViewed]
            .filter((product, index, self) => 
                index === self.findIndex(p => p.id === product.id)
            )
            .slice(0, 4);
        
        title = 'Productos relacionados';
    } else {
        // Recomendaciones personalizadas generales
        recommendations = generatePersonalizedRecommendations(4);
        title = 'Recomendado para ti';
    }
    
    if (recommendations.length === 0) {
        container.style.display = 'none';
        return;
    }
    
    let html = `
        <div class="recommendations-widget">
            <h4 class="widget-title">${title}</h4>
            <div class="widget-products">
    `;
    
    recommendations.forEach(product => {
        const reason = getRecommendationReason(product);
        html += `
            <div class="widget-product" onclick="viewProductDetails('${product.id}')">
                <div class="widget-product-image">
                    <img src="${product.image}" alt="${product.name}"
                         onerror="this.src='assets/images/placeholder-product.jpg'">
                </div>
                <div class="widget-product-info">
                    <h5>${product.name}</h5>
                    <div class="widget-product-price">$${formatPrice(product.price)}</div>
                    <div class="widget-product-reason">${reason}</div>
                </div>
            </div>
        `;
    });
    
    html += `
            </div>
        </div>
    `;
    
    container.innerHTML = html;
    container.style.display = 'block';
}

function closeFavoritesModal() {
    const modal = document.querySelector('.favorites-modal-overlay');
    if (modal) {
        modal.remove();
    }
}

// ================================
// FUNCIONES HELPER
// ================================

// Función para formatear precios
function formatPrice(price) {
    return new Intl.NumberFormat('es-CL').format(price);
}

// Función para mostrar notificaciones
function showNotification(message, type = 'info') {
    if (typeof window.notificationSystem !== 'undefined') {
        window.notificationSystem.showNotification(message, type);
    } else {
        // Fallback simple
        alert(message);
    }
}

// Función para ver producto (redirección)
function viewProduct(productId) {
    window.location.href = `productos/detalle.html?id=${productId}`;
}

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
    
    initializeFavorites();
    initializeRecommendations();
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

    // Guardar todos los productos filtrados
    productsState.allProducts = products;
    productsState.totalItems = products.length;
    
    // Renderizar primera página
    renderProductsWithPagination(container);
    renderPagination();
    updateProductsCount(products.length);
}

// ================================
// RENDERIZADO DE PRODUCTOS
// ================================

function renderProductsWithPagination(container) {
    const startIndex = (productsState.currentPage - 1) * productsState.itemsPerPage;
    const endIndex = startIndex + productsState.itemsPerPage;
    const currentPageProducts = productsState.allProducts.slice(startIndex, endIndex);
    
    renderProductsGrid(currentPageProducts, container);
}

function renderPagination() {
    const paginationContainer = document.getElementById('pagination');
    if (!paginationContainer) return;
    
    const totalPages = Math.ceil(productsState.totalItems / productsState.itemsPerPage);
    
    if (totalPages <= 1) {
        paginationContainer.innerHTML = '';
        return;
    }
    
    let paginationHTML = `
        <div class="pagination-container">
            <div class="pagination-info">
                Página ${productsState.currentPage} de ${totalPages} 
                (${productsState.totalItems} productos)
            </div>
            <div class="pagination-controls">
    `;
    
    // Botón anterior
    if (productsState.currentPage > 1) {
        paginationHTML += `
            <button class="pagination-btn pagination-prev" onclick="goToPage(${productsState.currentPage - 1})">
                <i class="fas fa-chevron-left"></i> Anterior
            </button>
        `;
    }
    
    // Números de página
    const maxVisible = 5;
    let startPage = Math.max(1, productsState.currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);
    
    if (endPage - startPage < maxVisible - 1) {
        startPage = Math.max(1, endPage - maxVisible + 1);
    }
    
    if (startPage > 1) {
        paginationHTML += `<button class="pagination-btn" onclick="goToPage(1)">1</button>`;
        if (startPage > 2) {
            paginationHTML += `<span class="pagination-dots">...</span>`;
        }
    }
    
    for (let i = startPage; i <= endPage; i++) {
        const activeClass = i === productsState.currentPage ? 'active' : '';
        paginationHTML += `
            <button class="pagination-btn ${activeClass}" onclick="goToPage(${i})">
                ${i}
            </button>
        `;
    }
    
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            paginationHTML += `<span class="pagination-dots">...</span>`;
        }
        paginationHTML += `<button class="pagination-btn" onclick="goToPage(${totalPages})">${totalPages}</button>`;
    }
    
    // Botón siguiente
    if (productsState.currentPage < totalPages) {
        paginationHTML += `
            <button class="pagination-btn pagination-next" onclick="goToPage(${productsState.currentPage + 1})">
                Siguiente <i class="fas fa-chevron-right"></i>
            </button>
        `;
    }
    
    paginationHTML += `
            </div>
            <div class="pagination-per-page">
                <label>Productos por página:</label>
                <select onchange="changeItemsPerPage(this.value)">
                    <option value="12" ${productsState.itemsPerPage === 12 ? 'selected' : ''}>12</option>
                    <option value="24" ${productsState.itemsPerPage === 24 ? 'selected' : ''}>24</option>
                    <option value="48" ${productsState.itemsPerPage === 48 ? 'selected' : ''}>48</option>
                </select>
            </div>
        </div>
    `;
    
    paginationContainer.innerHTML = paginationHTML;
}

function goToPage(page) {
    productsState.currentPage = page;
    const container = document.getElementById('productsGrid');
    if (container) {
        renderProductsWithPagination(container);
        renderPagination();
        
        // Scroll suave al inicio de los productos
        container.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function changeItemsPerPage(newItemsPerPage) {
    productsState.itemsPerPage = parseInt(newItemsPerPage);
    productsState.currentPage = 1;
    
    const container = document.getElementById('productsGrid');
    if (container) {
        renderProductsWithPagination(container);
        renderPagination();
    }
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
                
                <!-- Botón de favoritos -->
                <button class="favorite-btn ${isInFavorites(product.id) ? 'active' : ''}" 
                        data-product-id="${product.id}"
                        onclick="toggleFavorite('${product.id}')"
                        aria-label="${isInFavorites(product.id) ? 'Remover de favoritos' : 'Agregar a favoritos'}"
                        aria-pressed="${isInFavorites(product.id)}">
                    <i class="${isInFavorites(product.id) ? 'fas fa-heart' : 'far fa-heart'}" aria-hidden="true"></i>
                </button>
                
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

    // Trackear la vista del producto para recomendaciones
    trackProductView(productId);
    
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
    // Usar función global de main.js si está disponible
    if (window.showNotification && window.showNotification !== showNotification) {
        window.showNotification(message, type);
        return;
    }
    
    // Fallback si no está disponible
    console.log(`${type.toUpperCase()}: ${message}`);
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
