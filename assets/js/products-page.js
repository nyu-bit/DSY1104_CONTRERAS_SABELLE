/**
 * Página de Productos - Gestión Avanzada
 * Incluye filtros, búsqueda, paginación y ordenamiento
 * @version 2.0
 */

class ProductsPageManager {
    constructor() {
        this.currentPage = 1;
        this.itemsPerPage = 12;
        this.filteredProducts = [];
        this.allProducts = [];
        this.currentFilters = {
            category: '',
            priceRange: '',
            sort: 'name',
            stock: '',
            search: ''
        };
        
        this.init();
    }

    async init() {
        try {
            await this.loadProducts();
            this.setupEventListeners();
            this.setupFilters();
            this.renderProducts();
            this.updateStats();
        } catch (error) {
            console.error('Error inicializando productos:', error);
            this.showError('Error al cargar los productos');
        }
    }

    async loadProducts() {
        this.showLoading(true);
        
        try {
            // Simular carga desde base de datos
            await new Promise(resolve => setTimeout(resolve, 800));
            
            if (typeof PRODUCT_DATABASE !== 'undefined') {
                this.allProducts = Object.values(PRODUCT_DATABASE);
            } else {
                // Productos de respaldo si no está disponible la base de datos
                this.allProducts = await this.getProductsFromStorage();
            }
            
            this.filteredProducts = [...this.allProducts];
            
        } finally {
            this.showLoading(false);
        }
    }

    async getProductsFromStorage() {
        // Productos de respaldo con estructura completa
        return [
            {
                id: 'catan-clasico',
                name: 'Catan Clásico',
                category: 'jm',
                categoryName: 'Juegos de Mesa',
                price: 35000,
                originalPrice: 42000,
                description: 'El juego de estrategia más popular del mundo',
                image: '🏝️',
                rating: 4.8,
                reviews: 156,
                stock: 15,
                featured: true,
                isNew: false
            },
            {
                id: 'mouse-razer',
                name: 'Razer DeathAdder V3',
                category: 'mg',
                categoryName: 'Mouse Gaming',
                price: 89000,
                originalPrice: 110000,
                description: 'Mouse gaming de alta precisión con sensor óptico',
                image: '🖱️',
                rating: 4.7,
                reviews: 89,
                stock: 8,
                featured: false,
                isNew: true
            }
        ];
    }

    setupEventListeners() {
        // Filtros
        const categoryFilter = document.getElementById('categoryFilter');
        const priceFilter = document.getElementById('priceFilter');
        const sortFilter = document.getElementById('sortFilter');
        const stockFilter = document.getElementById('stockFilter');
        
        // Toggle de filtros en móvil
        const filtersToggle = document.getElementById('filtersToggle');
        const filtersContainer = document.getElementById('filtersContainer');

        if (filtersToggle && filtersContainer) {
            filtersToggle.addEventListener('click', () => {
                filtersContainer.classList.toggle('active');
                const icon = filtersToggle.querySelector('i');
                if (icon) {
                    icon.className = filtersContainer.classList.contains('active') 
                        ? 'fas fa-times' 
                        : 'fas fa-filter';
                }
            });
        }

        // Event listeners para filtros
        if (categoryFilter) {
            categoryFilter.addEventListener('change', (e) => {
                this.currentFilters.category = e.target.value;
                this.applyFilters();
            });
        }

        if (priceFilter) {
            priceFilter.addEventListener('change', (e) => {
                this.currentFilters.priceRange = e.target.value;
                this.applyFilters();
            });
        }

        if (sortFilter) {
            sortFilter.addEventListener('change', (e) => {
                this.currentFilters.sort = e.target.value;
                this.applyFilters();
            });
        }

        if (stockFilter) {
            stockFilter.addEventListener('change', (e) => {
                this.currentFilters.stock = e.target.value;
                this.applyFilters();
            });
        }

        // Botones de acción
        const clearFilters = document.getElementById('clearFilters');
        const resetFilters = document.getElementById('resetFilters');

        if (clearFilters) {
            clearFilters.addEventListener('click', () => this.clearAllFilters());
        }

        if (resetFilters) {
            resetFilters.addEventListener('click', () => this.clearAllFilters());
        }

        // Items per page
        const itemsPerPage = document.getElementById('itemsPerPage');
        if (itemsPerPage) {
            itemsPerPage.addEventListener('change', (e) => {
                this.itemsPerPage = parseInt(e.target.value);
                this.currentPage = 1;
                this.renderProducts();
                this.renderPagination();
            });
        }

        // Búsqueda integrada con el sistema global
        this.setupSearchIntegration();
    }

    setupSearchIntegration() {
        // Escuchar eventos de búsqueda del sistema global
        document.addEventListener('searchUpdated', (event) => {
            this.currentFilters.search = event.detail.query || '';
            this.applyFilters();
        });

        // También escuchar cambios en el input de búsqueda si existe
        const searchInput = document.querySelector('.search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.currentFilters.search = e.target.value;
                this.applyFilters();
            });
        }
    }

    setupFilters() {
        // Configurar valores iniciales
        const urlParams = new URLSearchParams(window.location.search);
        
        if (urlParams.get('category')) {
            this.currentFilters.category = urlParams.get('category');
            const categoryFilter = document.getElementById('categoryFilter');
            if (categoryFilter) categoryFilter.value = this.currentFilters.category;
        }

        if (urlParams.get('search')) {
            this.currentFilters.search = urlParams.get('search');
        }
    }

    applyFilters() {
        this.currentPage = 1;
        this.filteredProducts = this.allProducts.filter(product => {
            return this.passesFilters(product);
        });

        this.sortProducts();
        this.renderProducts();
        this.renderPagination();
        this.updateResultsCount();
        this.updateURL();
    }

    passesFilters(product) {
        // Filtro de categoría
        if (this.currentFilters.category && product.category !== this.currentFilters.category) {
            return false;
        }

        // Filtro de precio
        if (this.currentFilters.priceRange) {
            if (!this.passesIntegerRange(product.price, this.currentFilters.priceRange)) {
                return false;
            }
        }

        // Filtro de stock
        if (this.currentFilters.stock) {
            if (!this.passesStockFilter(product.stock, this.currentFilters.stock)) {
                return false;
            }
        }

        // Filtro de búsqueda
        if (this.currentFilters.search) {
            const searchTerm = this.currentFilters.search.toLowerCase();
            const searchFields = [
                product.name,
                product.description,
                product.categoryName
            ].join(' ').toLowerCase();

            if (!searchFields.includes(searchTerm)) {
                return false;
            }
        }

        return true;
    }

    passesIntegerRange(price, range) {
        if (range === '0-30000') return price <= 30000;
        if (range === '30000-100000') return price > 30000 && price <= 100000;
        if (range === '100000-300000') return price > 100000 && price <= 300000;
        if (range === '300000-600000') return price > 300000 && price <= 600000;
        if (range === '600000+') return price > 600000;
        return true;
    }

    passesStockFilter(stock, filter) {
        if (filter === 'in-stock') return stock > 10;
        if (filter === 'low-stock') return stock > 0 && stock <= 10;
        return true;
    }

    sortProducts() {
        this.filteredProducts.sort((a, b) => {
            switch (this.currentFilters.sort) {
                case 'name':
                    return a.name.localeCompare(b.name);
                case 'name-desc':
                    return b.name.localeCompare(a.name);
                case 'price-low':
                    return a.price - b.price;
                case 'price-high':
                    return b.price - a.price;
                case 'rating':
                    return (b.rating || 0) - (a.rating || 0);
                case 'newest':
                    return b.isNew ? 1 : -1;
                default:
                    return 0;
            }
        });
    }

    renderProducts() {
        const grid = document.getElementById('productsGrid');
        const emptyState = document.getElementById('emptyState');
        
        if (!grid) return;

        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const pageProducts = this.filteredProducts.slice(startIndex, endIndex);

        if (pageProducts.length === 0) {
            grid.style.display = 'none';
            if (emptyState) emptyState.style.display = 'block';
            return;
        }

        if (emptyState) emptyState.style.display = 'none';
        grid.style.display = 'grid';

        grid.innerHTML = pageProducts.map(product => this.createProductCard(product)).join('');

        // Configurar event listeners para las cards
        this.setupProductCardEvents();
    }

    createProductCard(product) {
        const stockClass = this.getStockClass(product.stock);
        const stockText = this.getStockText(product.stock);
        const hasDiscount = product.originalPrice && product.originalPrice > product.price;
        
        return `
            <article class="product-card" data-product-id="${product.id}">
                ${product.featured ? '<div class="product-badge featured">Destacado</div>' : ''}
                ${product.isNew ? '<div class="product-badge new">Nuevo</div>' : ''}
                
                <div class="product-image-container">
                    <div class="product-image">
                        ${product.image || '🎮'}
                    </div>
                </div>
                
                <div class="product-info">
                    <div class="product-category">${product.categoryName || 'Gaming'}</div>
                    <h3 class="product-title">${product.name}</h3>
                    <p class="product-description">${product.description}</p>
                    
                    ${product.rating ? this.createRatingStars(product.rating, product.reviews) : ''}
                    
                    <div class="product-price-container">
                        <div class="product-price">
                            <span class="current-price">$${this.formatPrice(product.price)}</span>
                            ${hasDiscount ? `<span class="product-old-price">$${this.formatPrice(product.originalPrice)}</span>` : ''}
                        </div>
                        <div class="product-stock ${stockClass}">${stockText}</div>
                    </div>
                    
                    <div class="product-actions">
                        <button class="btn-add-cart" data-product-id="${product.id}" ${product.stock <= 0 ? 'disabled' : ''}>
                            <i class="fas fa-shopping-cart"></i>
                            ${product.stock <= 0 ? 'Sin Stock' : 'Agregar'}
                        </button>
                        <button class="btn-details" data-product-id="${product.id}" title="Ver detalles">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                </div>
            </article>
        `;
    }

    getStockClass(stock) {
        if (stock <= 0) return 'out-of-stock';
        if (stock <= 10) return 'low-stock';
        return 'in-stock';
    }

    getStockText(stock) {
        if (stock <= 0) return 'Sin Stock';
        if (stock <= 10) return `Quedan ${stock}`;
        return 'Disponible';
    }

    createRatingStars(rating, reviews) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        let starsHTML = '';

        for (let i = 0; i < 5; i++) {
            if (i < fullStars) {
                starsHTML += '<i class="fas fa-star star"></i>';
            } else if (i === fullStars && hasHalfStar) {
                starsHTML += '<i class="fas fa-star-half-alt star"></i>';
            } else {
                starsHTML += '<i class="far fa-star star empty"></i>';
            }
        }

        return `
            <div class="product-rating">
                <div class="stars">${starsHTML}</div>
                <span class="rating-text">${rating} (${reviews || 0} reseñas)</span>
            </div>
        `;
    }

    setupProductCardEvents() {
        // Botones de agregar al carrito
        document.querySelectorAll('.btn-add-cart').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = e.currentTarget.dataset.productId;
                this.addToCart(productId);
            });
        });

        // Botones de ver detalles
        document.querySelectorAll('.btn-details').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = e.currentTarget.dataset.productId;
                this.viewProductDetails(productId);
            });
        });
    }

    addToCart(productId) {
        const product = this.allProducts.find(p => p.id === productId);
        if (!product || product.stock <= 0) return;

        // Integración con el sistema de carrito global
        if (typeof addToCart === 'function') {
            addToCart(product);
        } else {
            // Fallback local
            this.showNotification(`${product.name} agregado al carrito`, 'success');
        }
    }

    viewProductDetails(productId) {
        // Redirigir a página de detalles o abrir modal
        window.location.href = `detalle.html?id=${productId}`;
    }

    renderPagination() {
        const container = document.getElementById('pagination');
        if (!container) return;

        const totalPages = Math.ceil(this.filteredProducts.length / this.itemsPerPage);
        
        if (totalPages <= 1) {
            container.innerHTML = '';
            return;
        }

        let paginationHTML = '';

        // Botón anterior
        paginationHTML += `
            <button class="pagination-btn" ${this.currentPage === 1 ? 'disabled' : ''} 
                    onclick="productsManager.goToPage(${this.currentPage - 1})">
                <i class="fas fa-chevron-left"></i>
            </button>
        `;

        // Números de página
        const startPage = Math.max(1, this.currentPage - 2);
        const endPage = Math.min(totalPages, this.currentPage + 2);

        if (startPage > 1) {
            paginationHTML += `<button class="pagination-btn" onclick="productsManager.goToPage(1)">1</button>`;
            if (startPage > 2) {
                paginationHTML += `<span class="pagination-ellipsis">...</span>`;
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            paginationHTML += `
                <button class="pagination-btn ${i === this.currentPage ? 'active' : ''}" 
                        onclick="productsManager.goToPage(${i})">
                    ${i}
                </button>
            `;
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                paginationHTML += `<span class="pagination-ellipsis">...</span>`;
            }
            paginationHTML += `<button class="pagination-btn" onclick="productsManager.goToPage(${totalPages})">${totalPages}</button>`;
        }

        // Botón siguiente
        paginationHTML += `
            <button class="pagination-btn" ${this.currentPage === totalPages ? 'disabled' : ''} 
                    onclick="productsManager.goToPage(${this.currentPage + 1})">
                <i class="fas fa-chevron-right"></i>
            </button>
        `;

        container.innerHTML = paginationHTML;
    }

    goToPage(page) {
        const totalPages = Math.ceil(this.filteredProducts.length / this.itemsPerPage);
        if (page < 1 || page > totalPages) return;

        this.currentPage = page;
        this.renderProducts();
        this.renderPagination();
        
        // Scroll suave al inicio de la sección de productos
        document.querySelector('.products-section')?.scrollIntoView({ 
            behavior: 'smooth' 
        });
    }

    updateResultsCount() {
        const countElement = document.getElementById('currentCount');
        if (countElement) {
            countElement.textContent = this.filteredProducts.length;
        }
    }

    updateStats() {
        const totalProductsElement = document.getElementById('totalProducts');
        if (totalProductsElement) {
            totalProductsElement.textContent = `${this.allProducts.length}+`;
        }
    }

    clearAllFilters() {
        this.currentFilters = {
            category: '',
            priceRange: '',
            sort: 'name',
            stock: '',
            search: ''
        };

        // Resetear form controls
        const categoryFilter = document.getElementById('categoryFilter');
        const priceFilter = document.getElementById('priceFilter');
        const sortFilter = document.getElementById('sortFilter');
        const stockFilter = document.getElementById('stockFilter');

        if (categoryFilter) categoryFilter.value = '';
        if (priceFilter) priceFilter.value = '';
        if (sortFilter) sortFilter.value = 'name';
        if (stockFilter) stockFilter.value = '';

        this.applyFilters();
    }

    updateURL() {
        const params = new URLSearchParams();
        
        if (this.currentFilters.category) params.set('category', this.currentFilters.category);
        if (this.currentFilters.search) params.set('search', this.currentFilters.search);
        if (this.currentPage > 1) params.set('page', this.currentPage);

        const newURL = window.location.pathname + (params.toString() ? '?' + params.toString() : '');
        window.history.replaceState({}, '', newURL);
    }

    showLoading(show) {
        const loadingState = document.getElementById('loadingState');
        const productsGrid = document.getElementById('productsGrid');
        
        if (loadingState) {
            loadingState.style.display = show ? 'block' : 'none';
        }
        if (productsGrid) {
            productsGrid.style.display = show ? 'none' : 'grid';
        }
    }

    showError(message) {
        const grid = document.getElementById('productsGrid');
        if (grid) {
            grid.innerHTML = `
                <div class="error-state">
                    <div class="error-icon">
                        <i class="fas fa-exclamation-triangle"></i>
                    </div>
                    <h3>Error al cargar productos</h3>
                    <p>${message}</p>
                    <button class="btn-primary" onclick="location.reload()">
                        <i class="fas fa-refresh"></i> Intentar de nuevo
                    </button>
                </div>
            `;
        }
    }

    showNotification(message, type = 'info') {
        // Integración con sistema de notificaciones global
        if (typeof showNotification === 'function') {
            showNotification(message, type);
        } else {
            // Fallback simple
            console.log(`${type.toUpperCase()}: ${message}`);
        }
    }

    formatPrice(price) {
        return new Intl.NumberFormat('es-CL').format(price);
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.productsManager = new ProductsPageManager();
});

// Exponer funciones globales para uso en templates
window.goToPage = (page) => window.productsManager?.goToPage(page);
