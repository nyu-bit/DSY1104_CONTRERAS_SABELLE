// ====================================================
// LG-022: SISTEMA DE BÚSQUEDA COMPLETO CON SUGERENCIAS
// Búsqueda + ordenamiento + debounce + normalización + sugerencias
// ====================================================

class SmartSearchManager {
    constructor() {
        console.log('🚀 Inicializando SmartSearchManager...');
        
        this.searchInput = document.getElementById('search-input');
        this.searchBtn = document.getElementById('search-btn');
        this.suggestionsContainer = document.getElementById('search-suggestions');
        this.mobileSearchInput = document.getElementById('mobile-search-input');
        this.mobileSuggestions = document.getElementById('mobile-search-suggestions');
        
        console.log('🔍 Elementos DOM encontrados:', {
            searchInput: !!this.searchInput,
            searchBtn: !!this.searchBtn,
            suggestionsContainer: !!this.suggestionsContainer,
            mobileSearchInput: !!this.mobileSearchInput,
            mobileSuggestions: !!this.mobileSuggestions
        });
        
        this.debounceTimer = null;
        this.debounceDelay = 250; // LG-022: Debounce 250ms
        this.minSearchLength = 3; // Sugerencias a partir del tercer carácter
        this.currentSuggestions = [];
        this.selectedSuggestionIndex = -1;
        this.isOpen = false;
        
        console.log('⚙️ Configuración:', {
            debounceDelay: this.debounceDelay,
            minSearchLength: this.minSearchLength
        });
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupKeyboardNavigation();
        console.log('✅ SmartSearchManager inicializado con debounce 250ms');
    }

    // Setup de todos los event listeners
    setupEventListeners() {
        // Desktop search
        if (this.searchInput) {
            this.searchInput.addEventListener('input', (e) => this.handleInput(e));
            this.searchInput.addEventListener('focus', (e) => this.handleFocus(e));
            this.searchInput.addEventListener('blur', (e) => this.handleBlur(e));
        }

        if (this.searchBtn) {
            this.searchBtn.addEventListener('click', (e) => this.executeSearch(e));
        }

        // Mobile search
        if (this.mobileSearchInput) {
            this.mobileSearchInput.addEventListener('input', (e) => this.handleInput(e, true));
            this.mobileSearchInput.addEventListener('focus', (e) => this.handleFocus(e, true));
            this.mobileSearchInput.addEventListener('blur', (e) => this.handleBlur(e, true));
        }

        // Click fuera para cerrar sugerencias
        document.addEventListener('click', (e) => this.handleOutsideClick(e));
        
        // Prevenir submit del form
        const searchForms = document.querySelectorAll('form');
        searchForms.forEach(form => {
            if (form.contains(this.searchInput) || form.contains(this.mobileSearchInput)) {
                form.addEventListener('submit', (e) => e.preventDefault());
            }
        });
    }

    // Manejo de input con debounce
    handleInput(event, isMobile = false) {
        const query = event.target.value.trim();
        
        // Limpiar timer anterior
        if (this.debounceTimer) {
            clearTimeout(this.debounceTimer);
        }

        // LG-022: Debounce de 250ms
        this.debounceTimer = setTimeout(() => {
            this.processSearch(query, isMobile);
        }, this.debounceDelay);
    }

    // Procesar búsqueda con normalización
    processSearch(query, isMobile = false) {
        console.log('🔍 processSearch llamado con:', { query, isMobile, length: query.length });
        
        if (query.length === 0) {
            console.log('❌ Query vacía, ocultando sugerencias');
            this.hideSuggestions(isMobile);
            return;
        }

        if (query.length >= this.minSearchLength) {
            console.log('✅ Query válida, buscando sugerencias...');
            // LG-022: Búsqueda con normalización de acentos
            const suggestions = this.findSuggestions(query);
            console.log('📋 Sugerencias encontradas:', suggestions.length, suggestions);
            this.showSuggestions(suggestions, isMobile);
        } else {
            console.log('⏳ Query muy corta, esperando más caracteres...');
            this.hideSuggestions(isMobile);
        }
    }

    // LG-022: Normalización de acentos para búsqueda
    normalizeText(text) {
        return text
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '') // Eliminar acentos
            .replace(/[^\w\s]/g, '') // Eliminar caracteres especiales
            .trim();
    }

    // Encontrar sugerencias basadas en productos
    findSuggestions(query) {
        console.log('🔎 findSuggestions llamado con query:', query);
        
        if (!window.PRODUCT_DATABASE) {
            console.error('❌ PRODUCT_DATABASE no disponible');
            return [];
        }

        console.log('✅ PRODUCT_DATABASE disponible con', Object.keys(window.PRODUCT_DATABASE).length, 'productos');

        const normalizedQuery = this.normalizeText(query);
        console.log('🔤 Query normalizada:', normalizedQuery);
        const suggestions = [];

        // Buscar en todos los productos
        Object.values(window.PRODUCT_DATABASE).forEach((product, index) => {
            const normalizedName = this.normalizeText(product.nombre);
            const normalizedCode = this.normalizeText(product.codigo);
            const normalizedCategory = this.normalizeText(product.categoria);
            
            let relevanceScore = 0;
            let matchType = '';

            // Coincidencia exacta en nombre (mayor relevancia)
            if (normalizedName.includes(normalizedQuery)) {
                relevanceScore = 100;
                if (normalizedName.startsWith(normalizedQuery)) {
                    relevanceScore = 150; // Coincidencia al inicio
                }
                matchType = 'name';
                console.log(`🎯 Match en nombre: ${product.nombre} (score: ${relevanceScore})`);
            }
            // Coincidencia en código
            else if (normalizedCode.includes(normalizedQuery)) {
                relevanceScore = 80;
                if (normalizedCode.startsWith(normalizedQuery)) {
                    relevanceScore = 120;
                }
                matchType = 'code';
                console.log(`🔢 Match en código: ${product.codigo} (score: ${relevanceScore})`);
            }
            // Coincidencia en categoría
            else if (normalizedCategory.includes(normalizedQuery)) {
                relevanceScore = 60;
                matchType = 'category';
                console.log(`📂 Match en categoría: ${product.categoria} (score: ${relevanceScore})`);
            }
            // Búsqueda en tags si existen
            else if (product.tags && product.tags.some(tag => 
                this.normalizeText(tag).includes(normalizedQuery))) {
                relevanceScore = 40;
                matchType = 'tag';
                console.log(`🏷️ Match en tags: ${product.tags} (score: ${relevanceScore})`);
            }

            if (relevanceScore > 0) {
                suggestions.push({
                    ...product,
                    relevanceScore,
                    matchType,
                    displayText: this.getDisplayText(product, matchType, query)
                });
            }
        });

        console.log('📊 Total sugerencias encontradas:', suggestions.length);

        // LG-022: Ordenamiento por relevancia y luego alfabético
        const sortedSuggestions = suggestions
            .sort((a, b) => {
                if (b.relevanceScore !== a.relevanceScore) {
                    return b.relevanceScore - a.relevanceScore;
                }
                return a.nombre.localeCompare(b.nombre);
            })
            .slice(0, 8); // Máximo 8 sugerencias
            
        console.log('🎯 Sugerencias finales:', sortedSuggestions.map(s => s.nombre));
        return sortedSuggestions;
    }

    // Obtener texto de display para la sugerencia
    getDisplayText(product, matchType, query) {
        switch (matchType) {
            case 'code':
                return `${product.codigo} - ${product.nombre}`;
            case 'category':
                return `${product.nombre} (${product.categoria})`;
            default:
                return product.nombre;
        }
    }

    // Mostrar sugerencias
    showSuggestions(suggestions, isMobile = false) {
        const container = isMobile ? this.mobileSuggestions : this.suggestionsContainer;
        console.log('🎨 showSuggestions llamado:', {
            suggestions: suggestions.length,
            isMobile,
            container: !!container
        });
        
        if (!container) {
            console.error('❌ Contenedor de sugerencias no encontrado');
            return;
        }

        this.currentSuggestions = suggestions;
        this.selectedSuggestionIndex = -1;

        if (suggestions.length === 0) {
            console.log('📝 Mostrando mensaje "no encontrados"');
            container.innerHTML = `
                <div class="no-suggestions">
                    <i class="fas fa-search"></i>
                    <span>No se encontraron productos</span>
                </div>`;
        } else {
            console.log('📝 Generando HTML para', suggestions.length, 'sugerencias');
            container.innerHTML = suggestions.map((suggestion, index) => `
                <div class="suggestion-item" 
                     data-index="${index}"
                     data-product-id="${suggestion.codigo}"
                     role="option"
                     aria-selected="false">
                    <div class="suggestion-icon">
                        <i class="fas fa-cube"></i>
                    </div>
                    <div class="suggestion-content">
                        <div class="suggestion-name">${this.highlightMatch(suggestion.displayText, this.getSearchQuery(isMobile))}</div>
                        <div class="suggestion-details">
                            <span class="suggestion-price">${this.formatPrice(suggestion.precio)}</span>
                            <span class="suggestion-category">${suggestion.categoria}</span>
                            ${suggestion.stock > 0 ? 
                                `<span class="suggestion-stock">Stock: ${suggestion.stock}</span>` : 
                                '<span class="suggestion-out-stock">Agotado</span>'
                            }
                        </div>
                    </div>
                    <div class="suggestion-action">
                        <i class="fas fa-arrow-right"></i>
                    </div>
                </div>
            `).join('');

            // Agregar eventos de click a las sugerencias
            container.querySelectorAll('.suggestion-item').forEach(item => {
                item.addEventListener('mousedown', (e) => this.selectSuggestion(e));
                item.addEventListener('mouseenter', (e) => this.highlightSuggestion(e));
            });
        }

        console.log('👀 Mostrando contenedor de sugerencias');
        container.style.display = 'block';
        container.setAttribute('aria-expanded', 'true');
        this.isOpen = true;
        
        console.log('✅ Sugerencias mostradas exitosamente');
    }

    // Resaltar coincidencias en el texto
    highlightMatch(text, query) {
        if (!query || query.length < 2) return text;
        
        const normalizedText = this.normalizeText(text);
        const normalizedQuery = this.normalizeText(query);
        
        const index = normalizedText.indexOf(normalizedQuery);
        if (index === -1) return text;
        
        // Encontrar la posición real en el texto original
        const beforeMatch = text.substring(0, index);
        const match = text.substring(index, index + query.length);
        const afterMatch = text.substring(index + query.length);
        
        return `${beforeMatch}<mark class="search-highlight">${match}</mark>${afterMatch}`;
    }

    // Ocultar sugerencias
    hideSuggestions(isMobile = false) {
        const container = isMobile ? this.mobileSuggestions : this.suggestionsContainer;
        if (!container) return;

        setTimeout(() => {
            container.style.display = 'none';
            container.setAttribute('aria-expanded', 'false');
            this.isOpen = false;
            this.selectedSuggestionIndex = -1;
        }, 150); // Pequeño delay para permitir clicks
    }

    // Setup navegación por teclado (LG-022: Accesibilidad)
    setupKeyboardNavigation() {
        const inputs = [this.searchInput, this.mobileSearchInput].filter(Boolean);
        
        inputs.forEach(input => {
            input.addEventListener('keydown', (e) => this.handleKeydown(e, input === this.mobileSearchInput));
        });
    }

    // Manejo de teclas para navegación
    handleKeydown(event, isMobile = false) {
        const container = isMobile ? this.mobileSuggestions : this.suggestionsContainer;
        
        switch (event.key) {
            case 'ArrowDown':
                event.preventDefault();
                this.navigateSuggestions(1, container);
                break;
            case 'ArrowUp':
                event.preventDefault();
                this.navigateSuggestions(-1, container);
                break;
            case 'Enter':
                event.preventDefault();
                this.handleEnterKey(isMobile);
                break;
            case 'Escape':
                this.hideSuggestions(isMobile);
                event.target.blur();
                break;
            case 'Tab':
                this.hideSuggestions(isMobile);
                break;
        }
    }

    // Navegación con flechas
    navigateSuggestions(direction, container) {
        if (!this.isOpen || this.currentSuggestions.length === 0) return;

        const previousIndex = this.selectedSuggestionIndex;
        this.selectedSuggestionIndex += direction;

        // Wrap around
        if (this.selectedSuggestionIndex < -1) {
            this.selectedSuggestionIndex = this.currentSuggestions.length - 1;
        } else if (this.selectedSuggestionIndex >= this.currentSuggestions.length) {
            this.selectedSuggestionIndex = -1;
        }

        // Actualizar visual
        this.updateSelectedSuggestion(container, previousIndex);
    }

    // Actualizar sugerencia seleccionada visualmente
    updateSelectedSuggestion(container, previousIndex) {
        const items = container.querySelectorAll('.suggestion-item');
        
        // Remover selección anterior
        if (previousIndex >= 0 && items[previousIndex]) {
            items[previousIndex].classList.remove('selected');
            items[previousIndex].setAttribute('aria-selected', 'false');
        }

        // Agregar nueva selección
        if (this.selectedSuggestionIndex >= 0 && items[this.selectedSuggestionIndex]) {
            items[this.selectedSuggestionIndex].classList.add('selected');
            items[this.selectedSuggestionIndex].setAttribute('aria-selected', 'true');
            items[this.selectedSuggestionIndex].scrollIntoView({ block: 'nearest' });
        }
    }

    // Manejo de Enter
    handleEnterKey(isMobile = false) {
        if (this.selectedSuggestionIndex >= 0 && this.currentSuggestions[this.selectedSuggestionIndex]) {
            // Seleccionar sugerencia destacada
            const suggestion = this.currentSuggestions[this.selectedSuggestionIndex];
            this.goToProduct(suggestion.codigo);
        } else {
            // Ejecutar búsqueda normal
            this.executeSearch(null, isMobile);
        }
    }

    // Seleccionar sugerencia con click/tap
    selectSuggestion(event) {
        event.preventDefault();
        const index = parseInt(event.currentTarget.dataset.index);
        const productId = event.currentTarget.dataset.productId;
        
        if (productId) {
            this.goToProduct(productId);
        }
    }

    // Resaltar sugerencia con hover
    highlightSuggestion(event) {
        const container = event.currentTarget.parentElement;
        const items = container.querySelectorAll('.suggestion-item');
        
        items.forEach((item, index) => {
            if (item === event.currentTarget) {
                this.selectedSuggestionIndex = index;
                item.classList.add('selected');
                item.setAttribute('aria-selected', 'true');
            } else {
                item.classList.remove('selected');
                item.setAttribute('aria-selected', 'false');
            }
        });
    }

    // Ir a página de producto
    goToProduct(productId) {
        this.hideSuggestions();
        this.hideSuggestions(true);
        window.location.href = `/productos/detalle.html?id=${productId}`;
    }

    // Ejecutar búsqueda completa
    executeSearch(event, isMobile = false) {
        if (event) event.preventDefault();
        
        const query = this.getSearchQuery(isMobile);
        
        if (query.trim().length === 0) {
            this.showNotification('Ingrese un término de búsqueda', 'warning');
            return;
        }

        this.hideSuggestions(isMobile);
        
        // Ir a página de productos con búsqueda
        const searchParams = new URLSearchParams();
        searchParams.set('search', query.trim());
        window.location.href = `/productos/?${searchParams.toString()}`;
    }

    // Obtener query actual
    getSearchQuery(isMobile = false) {
        const input = isMobile ? this.mobileSearchInput : this.searchInput;
        return input ? input.value : '';
    }

    // Event handlers para focus/blur
    handleFocus(event, isMobile = false) {
        const query = event.target.value.trim();
        if (query.length >= this.minSearchLength) {
            this.processSearch(query, isMobile);
        }
    }

    handleBlur(event, isMobile = false) {
        // Delay para permitir clicks en sugerencias
        setTimeout(() => {
            this.hideSuggestions(isMobile);
        }, 150);
    }

    handleOutsideClick(event) {
        const isInsideSearch = event.target.closest('.search-container') || 
                              event.target.closest('.mobile-search') ||
                              event.target.closest('.search-suggestions');
        
        if (!isInsideSearch) {
            this.hideSuggestions();
            this.hideSuggestions(true);
        }
    }

    // Formatear precio
    formatPrice(price) {
        return new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: 'CLP',
            minimumFractionDigits: 0
        }).format(price);
    }

    // Mostrar notificación
    showNotification(message, type = 'info') {
        // Crear notificación temporal
        const notification = document.createElement('div');
        notification.className = `search-notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
}

// Estilos CSS para las sugerencias de búsqueda
const searchStyles = `
/* LG-022: Estilos para sistema de búsqueda con sugerencias */
.search-suggestions {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: var(--color-surface);
    border: 2px solid var(--color-secondary);
    border-top: none;
    border-radius: 0 0 12px 12px;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
    z-index: 1000;
    display: none;
    max-height: 400px;
    overflow-y: auto;
    backdrop-filter: blur(10px);
}

.search-suggestions::-webkit-scrollbar {
    width: 6px;
}

.search-suggestions::-webkit-scrollbar-track {
    background: var(--color-surface-variant);
    border-radius: 3px;
}

.search-suggestions::-webkit-scrollbar-thumb {
    background: var(--color-secondary);
    border-radius: 3px;
}

.suggestion-item {
    display: flex;
    align-items: center;
    padding: 1rem;
    border-bottom: 1px solid var(--color-surface-variant);
    cursor: pointer;
    transition: all 0.3s ease;
    gap: 1rem;
}

.suggestion-item:last-child {
    border-bottom: none;
    border-radius: 0 0 10px 10px;
}

.suggestion-item:hover,
.suggestion-item.selected {
    background: var(--color-surface-variant);
    transform: translateX(4px);
}

.suggestion-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    background: var(--gradient-primary);
    border-radius: 8px;
    color: var(--color-background);
    flex-shrink: 0;
}

.suggestion-content {
    flex: 1;
    min-width: 0;
}

.suggestion-name {
    font-weight: 600;
    color: var(--color-text-primary);
    margin-bottom: 0.25rem;
    line-height: 1.3;
}

.search-highlight {
    background: var(--color-secondary);
    color: var(--color-background);
    padding: 0 2px;
    border-radius: 2px;
    font-weight: 700;
}

.suggestion-details {
    display: flex;
    gap: 1rem;
    font-size: 0.85rem;
    color: var(--color-text-secondary);
    flex-wrap: wrap;
}

.suggestion-price {
    font-weight: 600;
    color: var(--color-accent);
}

.suggestion-category {
    color: var(--color-text-muted);
}

.suggestion-stock {
    color: var(--color-success);
}

.suggestion-out-stock {
    color: var(--color-error);
}

.suggestion-action {
    display: flex;
    align-items: center;
    color: var(--color-secondary);
    font-size: 0.9rem;
    opacity: 0;
    transition: opacity 0.3s ease;
}

.suggestion-item:hover .suggestion-action,
.suggestion-item.selected .suggestion-action {
    opacity: 1;
}

.no-suggestions {
    display: flex;
    align-items: center;
    gap: 0.8rem;
    padding: 1.5rem;
    color: var(--color-text-secondary);
    font-style: italic;
    justify-content: center;
}

.no-suggestions i {
    color: var(--color-text-muted);
}

/* Notificaciones de búsqueda */
.search-notification {
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 1rem 1.5rem;
    background: var(--color-surface);
    border: 2px solid var(--color-accent);
    border-radius: 8px;
    color: var(--color-text-primary);
    font-weight: 500;
    z-index: 10000;
    display: flex;
    align-items: center;
    gap: 0.8rem;
    transform: translateX(100%);
    opacity: 0;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: var(--shadow-glow);
}

.search-notification.show {
    transform: translateX(0);
    opacity: 1;
}

.search-notification.warning {
    border-color: var(--color-warning, #ffa500);
    color: var(--color-warning, #ffa500);
}

/* Responsive */
@media (max-width: 768px) {
    .search-suggestions {
        max-height: 300px;
        border-radius: 0 0 8px 8px;
    }
    
    .suggestion-item {
        padding: 0.8rem;
        gap: 0.8rem;
    }
    
    .suggestion-icon {
        width: 35px;
        height: 35px;
    }
    
    .suggestion-details {
        gap: 0.8rem;
        font-size: 0.8rem;
    }
    
    .search-notification {
        right: 10px;
        left: 10px;
        transform: translateY(-100%);
    }
    
    .search-notification.show {
        transform: translateY(0);
    }
}

@media (max-width: 480px) {
    .suggestion-details {
        flex-direction: column;
        gap: 0.3rem;
    }
}
`;

// Inyectar estilos
const styleSheet = document.createElement('style');
styleSheet.textContent = searchStyles;
document.head.appendChild(styleSheet);

// Inicializar cuando el DOM esté listo Y la base de datos esté disponible
function initializeSmartSearch() {
    console.log('🔄 Intentando inicializar SmartSearch...');
    
    if (window.PRODUCT_DATABASE) {
        console.log('✅ Base de datos disponible, inicializando SmartSearchManager');
        window.smartSearchManager = new SmartSearchManager();
        return true;
    } else {
        console.log('⏳ Base de datos no disponible aún...');
        return false;
    }
}

// Escuchar evento de base de datos lista
window.addEventListener('productDatabaseReady', () => {
    console.log('🎯 Evento productDatabaseReady recibido');
    if (!window.smartSearchManager) {
        initializeSmartSearch();
    }
});

// Estrategia de inicialización robusta
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        console.log('📄 DOM cargado, verificando base de datos...');
        
        // Intentar inicializar inmediatamente
        if (!initializeSmartSearch()) {
            // Si no está lista, esperar el evento
            console.log('⏳ Esperando evento productDatabaseReady...');
        }
    });
} else {
    console.log('� DOM ya listo, inicializando...');
    
    // Intentar inicializar inmediatamente
    if (!initializeSmartSearch()) {
        // Si no está lista, esperar el evento o reintentar
        console.log('⏳ Esperando base de datos...');
        
        // Reintentar después de un delay como backup
        setTimeout(() => {
            if (!window.smartSearchManager) {
                console.log('🔄 Reintento de inicialización...');
                initializeSmartSearch();
            }
        }, 500);
    }
}

// Exportar para uso global
window.SmartSearchManager = SmartSearchManager;