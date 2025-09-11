/**
 * Sistema de Búsqueda Inteligente
 * Proporciona funcionalidad de búsqueda con sugerencias dinámicas
 */

class SearchSystem {
    constructor() {
        this.searchInput = null;
        this.searchSuggestions = null;
        this.searchBtn = null;
        this.searchClear = null;
        this.searchLoading = null;
        this.isSearchActive = false;
        this.searchTimeout = null;
        this.minSearchLength = 3;
        
        this.init();
    }
    
    init() {
        this.bindElements();
        this.bindEvents();
        this.setupPopularSearches();
    }
    
    bindElements() {
        this.searchInput = document.getElementById('searchInput');
        this.searchSuggestions = document.getElementById('searchSuggestions');
        this.searchBtn = document.getElementById('searchBtn');
        this.searchClear = document.getElementById('searchClear');
        this.searchLoading = document.getElementById('searchLoading');
        
        if (!this.searchInput) {
            console.warn('Search input not found');
            return;
        }
    }
    
    bindEvents() {
        if (!this.searchInput) return;
        
        // Evento de input para búsqueda en tiempo real
        this.searchInput.addEventListener('input', (e) => {
            this.handleSearchInput(e.target.value);
        });
        
        // Eventos de focus y blur
        this.searchInput.addEventListener('focus', () => {
            this.showSuggestions();
        });
        
        this.searchInput.addEventListener('blur', () => {
            // Delay para permitir clicks en sugerencias
            setTimeout(() => this.hideSuggestions(), 150);
        });
        
        // Botón de búsqueda
        if (this.searchBtn) {
            this.searchBtn.addEventListener('click', () => {
                this.performSearch(this.searchInput.value);
            });
        }
        
        // Botón de limpiar
        if (this.searchClear) {
            this.searchClear.addEventListener('click', () => {
                this.clearSearch();
            });
        }
        
        // Enter para buscar
        this.searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.performSearch(this.searchInput.value);
            }
        });
        
        // Click fuera para cerrar
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-container')) {
                this.hideSuggestions();
            }
        });
    }
    
    handleSearchInput(query) {
        // Limpiar timeout anterior
        if (this.searchTimeout) {
            clearTimeout(this.searchTimeout);
        }
        
        // Mostrar/ocultar botón de limpiar
        if (this.searchClear) {
            this.searchClear.style.display = query.length > 0 ? 'flex' : 'none';
        }
        
        // Si la query es muy corta, ocultar sugerencias
        if (query.length < this.minSearchLength) {
            this.hideSuggestions();
            return;
        }
        
        // Delay para evitar demasiadas búsquedas
        this.searchTimeout = setTimeout(() => {
            this.searchProducts(query);
        }, 300);
    }
    
    async searchProducts(query) {
        if (!query || query.length < this.minSearchLength) return;
        
        this.showLoading(true);
        
        try {
            // Obtener productos de la base de datos
            const products = window.PRODUCT_DATABASE || [];
            
            // Filtrar productos que coincidan con la búsqueda
            const filteredProducts = products.filter(product => {
                const searchTerm = query.toLowerCase();
                return (
                    product.name.toLowerCase().includes(searchTerm) ||
                    product.description.toLowerCase().includes(searchTerm) ||
                    product.category.toLowerCase().includes(searchTerm) ||
                    (product.tags && product.tags.some(tag => 
                        tag.toLowerCase().includes(searchTerm)
                    ))
                );
            });
            
            // Filtrar categorías
            const categories = this.getUniqueCategories(filteredProducts);
            
            this.showSearchResults(filteredProducts, categories, query);
            
        } catch (error) {
            console.error('Error en búsqueda:', error);
            this.showErrorMessage();
        } finally {
            this.showLoading(false);
        }
    }
    
    getUniqueCategories(products) {
        const categories = [...new Set(products.map(p => p.category))];
        return categories.map(cat => ({
            name: cat,
            count: products.filter(p => p.category === cat).length
        }));
    }
    
    showSearchResults(products, categories, query) {
        if (!this.searchSuggestions) return;
        
        // Usar las secciones existentes del HTML
        const productSection = document.getElementById('productSuggestions');
        const categorySection = document.getElementById('categorySuggestions');
        const noResults = document.getElementById('noResults');
        
        // Limpiar contenido anterior
        if (productSection) {
            const productsList = productSection.querySelector('.suggestions-list');
            if (productsList) productsList.innerHTML = '';
        }
        
        if (categorySection) {
            const categoriesList = categorySection.querySelector('.suggestions-list');
            if (categoriesList) categoriesList.innerHTML = '';
        }
        
        // Mostrar productos
        if (products.length > 0 && productSection) {
            const productsList = productSection.querySelector('.suggestions-list');
            const header = productSection.querySelector('.suggestions-header span');
            
            if (header) header.textContent = `Productos (${products.length})`;
            
            if (productsList) {
                products.slice(0, 5).forEach(product => {
                    const item = document.createElement('div');
                    item.className = 'suggestion-item';
                    item.setAttribute('role', 'option');
                    item.onclick = () => SearchSystem.selectProduct(product.id);
                    
                    item.innerHTML = `
                        <img src="${product.image}" alt="${product.name}" 
                             class="suggestion-image" loading="lazy">
                        <div class="suggestion-content">
                            <span class="suggestion-title">${product.name}</span>
                            <span class="suggestion-price">$${product.price.toLocaleString()}</span>
                            <span class="suggestion-category">${product.category}</span>
                        </div>
                    `;
                    
                    productsList.appendChild(item);
                });
                
                productSection.style.display = 'block';
            }
        } else if (productSection) {
            productSection.style.display = 'none';
        }
        
        // Mostrar categorías
        if (categories.length > 0 && categorySection) {
            const categoriesList = categorySection.querySelector('.suggestions-list');
            
            if (categoriesList) {
                categories.forEach(category => {
                    const item = document.createElement('div');
                    item.className = 'suggestion-item category-item';
                    item.setAttribute('role', 'option');
                    item.onclick = () => SearchSystem.selectCategory(category.name);
                    
                    item.innerHTML = `
                        <div class="suggestion-content">
                            <span class="suggestion-title">${category.name}</span>
                            <span class="suggestion-count">${category.count} productos</span>
                        </div>
                    `;
                    
                    categoriesList.appendChild(item);
                });
                
                categorySection.style.display = 'block';
            }
        } else if (categorySection) {
            categorySection.style.display = 'none';
        }
        
        // Manejar "sin resultados"
        if (products.length === 0 && categories.length === 0) {
            if (noResults) {
                noResults.querySelector('p').textContent = `No se encontraron resultados para "${query}"`;
                noResults.style.display = 'block';
            }
        } else if (noResults) {
            noResults.style.display = 'none';
        }
        
        this.showSuggestions();
    }
    
    showPopularSearches() {
        if (!this.searchSuggestions) return;
        
        const popularSearches = [
            'PlayStation 5',
            'RTX 4070',
            'Gaming chair',
            'Mechanical keyboard',
            'Gaming mouse',
            'Monitor 4K'
        ];
        
        let html = `
            <div class="suggestions-section" id="popularSuggestions">
                <div class="suggestions-header">
                    <i class="fas fa-fire" aria-hidden="true"></i>
                    <span>Búsquedas populares</span>
                </div>
                <div class="suggestions-list" role="group">
        `;
        
        popularSearches.forEach(search => {
            html += `
                <div class="suggestion-item popular-item" 
                     onclick="SearchSystem.selectPopularSearch('${search}')"
                     role="option">
                    <i class="fas fa-search suggestion-icon"></i>
                    <div class="suggestion-content">
                        <span class="suggestion-title">${search}</span>
                    </div>
                </div>
            `;
        });
        
        html += `
                </div>
            </div>
        `;
        
        this.searchSuggestions.innerHTML = html;
        this.showSuggestions();
    }
    
    showSuggestions() {
        if (!this.searchSuggestions) return;
        
        this.searchSuggestions.style.display = 'block';
        this.searchSuggestions.setAttribute('aria-hidden', 'false');
        this.searchInput.setAttribute('data-search-active', 'true');
        this.searchInput.setAttribute('aria-expanded', 'true');
        this.isSearchActive = true;
    }
    
    hideSuggestions() {
        if (!this.searchSuggestions) return;
        
        this.searchSuggestions.style.display = 'none';
        this.searchSuggestions.setAttribute('aria-hidden', 'true');
        this.searchInput.setAttribute('data-search-active', 'false');
        this.searchInput.setAttribute('aria-expanded', 'false');
        this.isSearchActive = false;
    }
    
    showLoading(show) {
        if (!this.searchLoading) return;
        
        this.searchLoading.setAttribute('aria-hidden', show ? 'false' : 'true');
        this.searchLoading.style.opacity = show ? '1' : '0';
    }
    
    clearSearch() {
        if (!this.searchInput) return;
        
        this.searchInput.value = '';
        this.searchInput.focus();
        this.hideSuggestions();
        
        if (this.searchClear) {
            this.searchClear.style.display = 'none';
        }
    }
    
    performSearch(query) {
        if (!query || query.length < this.minSearchLength) {
            this.showNotification('Ingresa al menos 3 caracteres para buscar', 'warning');
            return;
        }
        
        // Redirigir a página de productos con query
        const url = new URL('/productos/', window.location.origin);
        url.searchParams.set('search', query);
        
        this.hideSuggestions();
        window.location.href = url.toString();
    }
    
    showErrorMessage() {
        if (!this.searchSuggestions) return;
        
        this.searchSuggestions.innerHTML = `
            <div class="suggestions-empty">
                <i class="fas fa-exclamation-triangle" aria-hidden="true"></i>
                <p>Error al realizar la búsqueda</p>
                <small>Inténtalo de nuevo en unos momentos</small>
            </div>
        `;
        
        this.showSuggestions();
    }
    
    showNotification(message, type = 'info') {
        // Crear notificación temporal
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-info-circle"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        // Mostrar animación
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Remover después de 3 segundos
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
    
    // Métodos estáticos para callbacks
    static selectProduct(productId) {
        window.location.href = `/productos/detalle.html?id=${productId}`;
    }
    
    static selectCategory(categoryName) {
        window.location.href = `/productos/?category=${encodeURIComponent(categoryName)}`;
    }
    
    static selectPopularSearch(searchTerm) {
        const searchSystem = window.searchSystem;
        if (searchSystem && searchSystem.searchInput) {
            searchSystem.searchInput.value = searchTerm;
            searchSystem.performSearch(searchTerm);
        }
    }
    
    static viewAllResults(query) {
        window.location.href = `/productos/?search=${encodeURIComponent(query)}`;
    }
    
    setupPopularSearches() {
        // Mostrar búsquedas populares al hacer focus sin escribir
        setTimeout(() => {
            if (this.searchInput && this.searchInput.value.length === 0) {
                this.showPopularSearches();
            }
        }, 100);
    }
}

// Inicializar sistema de búsqueda cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.searchSystem = new SearchSystem();
});

// Exportar para uso global
window.SearchSystem = SearchSystem;
