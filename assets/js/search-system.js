// ================================================
// LEVEL-UP GAMER - SISTEMA DE BÚSQUEDA CON SUGERENCIAS
// ================================================

class GamerSearchSystem {
  constructor() {
    // Elementos del DOM
    this.searchInput = document.getElementById('search-input');
    this.searchBtn = document.getElementById('search-btn');
    this.searchSuggestions = document.getElementById('search-suggestions');
    this.mobileSearchInput = document.getElementById('mobile-search-input');
    this.mobileSearchBtn = document.getElementById('mobile-search-btn');
    this.mobileSuggestions = document.getElementById('mobile-search-suggestions');
    
    // Estado del sistema
    this.searchTimeout = null;
    this.currentSuggestions = [];
    this.selectedIndex = -1;
    this.minSearchLength = 3;
    this.debounceDelay = 250;
    this.isLoading = false;
    
    // Dataset de productos y categorías para búsqueda
    this.searchData = this.initializeSearchData();
    
    this.init();
  }

  init() {
    this.bindEvents();
    this.initAccessibility();
  }

  // Inicializar dataset de búsqueda
  initializeSearchData() {
    return {
      products: [
        // Consolas
        { id: 'co001', name: 'PlayStation 5', category: 'Consolas', type: 'product', price: '$649.990', tags: ['ps5', 'sony', 'consola', 'gaming'] },
        { id: 'co002', name: 'Xbox Series X', category: 'Consolas', type: 'product', price: '$599.990', tags: ['xbox', 'microsoft', 'consola', 'gaming'] },
        { id: 'co003', name: 'Nintendo Switch OLED', category: 'Consolas', type: 'product', price: '$399.990', tags: ['switch', 'nintendo', 'portable', 'oled'] },
        { id: 'co004', name: 'PlayStation 5 Digital', category: 'Consolas', type: 'product', price: '$549.990', tags: ['ps5', 'digital', 'sony'] },
        
        // PC Gaming
        { id: 'pc001', name: 'NVIDIA RTX 4080 Gaming', category: 'PC Gaming', type: 'product', price: '$1.299.990', tags: ['nvidia', 'rtx', 'tarjeta', 'grafica', '4080'] },
        { id: 'pc002', name: 'NVIDIA RTX 4070 Super', category: 'PC Gaming', type: 'product', price: '$899.990', tags: ['nvidia', 'rtx', 'tarjeta', 'grafica', '4070'] },
        { id: 'pc003', name: 'AMD Ryzen 9 7900X', category: 'PC Gaming', type: 'product', price: '$549.990', tags: ['amd', 'ryzen', 'procesador', 'cpu'] },
        { id: 'pc004', name: 'Intel Core i9-13900K', category: 'PC Gaming', type: 'product', price: '$649.990', tags: ['intel', 'core', 'procesador', 'cpu'] },
        { id: 'pc005', name: 'PC Gaming RTX 4080 Build', category: 'PC Gaming', type: 'product', price: '$2.199.990', tags: ['pc', 'completo', 'rtx', 'gaming'] },
        
        // Accesorios
        { id: 'ac001', name: 'Auriculares Gaming RGB Pro', category: 'Accesorios', type: 'product', price: '$199.990', tags: ['auriculares', 'headset', 'rgb', 'gaming'] },
        { id: 'ac002', name: 'Teclado Mecánico RGB', category: 'Accesorios', type: 'product', price: '$149.990', tags: ['teclado', 'mecanico', 'rgb', 'gaming'] },
        { id: 'ac003', name: 'Mouse Gaming RGB 12000 DPI', category: 'Accesorios', type: 'product', price: '$89.990', tags: ['mouse', 'gaming', 'rgb', 'dpi'] },
        { id: 'ac004', name: 'Silla Gaming Pro RGB', category: 'Accesorios', type: 'product', price: '$399.990', tags: ['silla', 'gaming', 'rgb', 'ergonomica'] },
        { id: 'ac005', name: 'Monitor Gaming 27" 144Hz', category: 'Accesorios', type: 'product', price: '$299.990', tags: ['monitor', 'gaming', '144hz', '27'] },
        
        // Videojuegos
        { id: 'vj001', name: 'FIFA 24', category: 'Videojuegos', type: 'product', price: '$59.990', tags: ['fifa', 'futbol', 'deportes', 'ea'] },
        { id: 'vj002', name: 'Call of Duty: Modern Warfare III', category: 'Videojuegos', type: 'product', price: '$69.990', tags: ['cod', 'call', 'duty', 'shooter', 'fps'] },
        { id: 'vj003', name: 'Cyberpunk 2077', category: 'Videojuegos', type: 'product', price: '$49.990', tags: ['cyberpunk', 'rpg', 'cdpr'] },
        { id: 'vj004', name: 'The Last of Us Part II', category: 'Videojuegos', type: 'product', price: '$39.990', tags: ['last', 'us', 'naughty', 'dog', 'zombie'] },
        { id: 'vj005', name: 'Spider-Man 2', category: 'Videojuegos', type: 'product', price: '$69.990', tags: ['spider', 'man', 'marvel', 'superhero'] }
      ],
      categories: [
        { id: 'cat-consolas', name: 'Consolas', type: 'category', count: '15+ productos', tags: ['consola', 'gaming', 'ps5', 'xbox', 'nintendo'] },
        { id: 'cat-pc', name: 'PC Gaming', type: 'category', count: '25+ productos', tags: ['pc', 'gaming', 'componentes', 'tarjeta', 'procesador'] },
        { id: 'cat-accesorios', name: 'Accesorios', type: 'category', count: '30+ productos', tags: ['accesorios', 'perifericos', 'mouse', 'teclado', 'auriculares'] },
        { id: 'cat-videojuegos', name: 'Videojuegos', type: 'category', count: '50+ productos', tags: ['juegos', 'videojuegos', 'gaming'] }
      ]
    };
  }

  // Eventos del sistema
  bindEvents() {
    // Búsqueda desktop
    if (this.searchInput) {
      this.searchInput.addEventListener('input', (e) => this.handleSearchInput(e, false));
      this.searchInput.addEventListener('keydown', (e) => this.handleKeyNavigation(e, false));
      this.searchInput.addEventListener('focus', () => this.handleFocus(false));
      this.searchInput.addEventListener('blur', () => this.handleBlur(false));
    }

    if (this.searchBtn) {
      this.searchBtn.addEventListener('click', () => this.executeSearch(false));
    }

    // Búsqueda móvil
    if (this.mobileSearchInput) {
      this.mobileSearchInput.addEventListener('input', (e) => this.handleSearchInput(e, true));
      this.mobileSearchInput.addEventListener('keydown', (e) => this.handleKeyNavigation(e, true));
      this.mobileSearchInput.addEventListener('focus', () => this.handleFocus(true));
      this.mobileSearchInput.addEventListener('blur', () => this.handleBlur(true));
    }

    if (this.mobileSearchBtn) {
      this.mobileSearchBtn.addEventListener('click', () => this.executeSearch(true));
    }

    // Eventos globales
    document.addEventListener('click', (e) => this.handleGlobalClick(e));
    document.addEventListener('keydown', (e) => this.handleGlobalKeydown(e));
  }

  // Manejar entrada de texto con debounce
  handleSearchInput(e, isMobile = false) {
    const query = e.target.value.trim();
    
    // Limpiar timeout anterior
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }

    // Si hay menos de 3 caracteres, ocultar sugerencias
    if (query.length < this.minSearchLength) {
      this.hideSuggestions(isMobile);
      return;
    }

    // Mostrar loading
    this.showLoading(isMobile);

    // Aplicar debounce
    this.searchTimeout = setTimeout(() => {
      this.performSearch(query, isMobile);
    }, this.debounceDelay);
  }

  // Realizar búsqueda y mostrar sugerencias
  performSearch(query, isMobile = false) {
    const normalizedQuery = this.normalizeString(query);
    const suggestions = this.findSuggestions(normalizedQuery);
    
    this.currentSuggestions = suggestions;
    this.selectedIndex = -1;
    this.displaySuggestions(suggestions, isMobile);
  }

  // Normalizar string para búsqueda (acentos, mayúsculas)
  normalizeString(str) {
    return str.toLowerCase()
              .normalize('NFD')
              .replace(/[\u0300-\u036f]/g, '');
  }

  // Encontrar sugerencias basadas en la consulta
  findSuggestions(query) {
    const suggestions = [];
    const maxSuggestions = 8;

    // Buscar en productos
    this.searchData.products.forEach(product => {
      const score = this.calculateRelevanceScore(query, product);
      if (score > 0) {
        suggestions.push({ ...product, score, displayType: 'product' });
      }
    });

    // Buscar en categorías
    this.searchData.categories.forEach(category => {
      const score = this.calculateRelevanceScore(query, category);
      if (score > 0) {
        suggestions.push({ ...category, score, displayType: 'category' });
      }
    });

    // Ordenar por relevancia y limitar resultados
    return suggestions
      .sort((a, b) => b.score - a.score)
      .slice(0, maxSuggestions);
  }

  // Calcular puntuación de relevancia
  calculateRelevanceScore(query, item) {
    let score = 0;
    const normalizedName = this.normalizeString(item.name);
    const normalizedCategory = this.normalizeString(item.category || '');

    // Coincidencia exacta en nombre (puntuación alta)
    if (normalizedName.includes(query)) {
      score += normalizedName.startsWith(query) ? 100 : 80;
    }

    // Coincidencia en categoría
    if (normalizedCategory.includes(query)) {
      score += 60;
    }

    // Coincidencia en tags
    if (item.tags) {
      item.tags.forEach(tag => {
        const normalizedTag = this.normalizeString(tag);
        if (normalizedTag.includes(query)) {
          score += normalizedTag.startsWith(query) ? 50 : 30;
        }
      });
    }

    // Coincidencia en ID
    if (item.id && this.normalizeString(item.id).includes(query)) {
      score += 40;
    }

    return score;
  }

  // Mostrar sugerencias en el DOM
  displaySuggestions(suggestions, isMobile = false) {
    const container = isMobile ? this.mobileSuggestions : this.searchSuggestions;
    
    if (!container) return;

    container.innerHTML = '';
    
    if (suggestions.length === 0) {
      container.innerHTML = '<div class="no-suggestions">No se encontraron sugerencias</div>';
      container.style.display = 'block';
      return;
    }

    suggestions.forEach((item, index) => {
      const suggestionElement = this.createSuggestionElement(item, index);
      container.appendChild(suggestionElement);
    });

    container.style.display = 'block';
    this.isLoading = false;
  }

  // Crear elemento de sugerencia
  createSuggestionElement(item, index) {
    const div = document.createElement('div');
    div.className = `suggestion-item suggestion-${item.displayType}`;
    div.setAttribute('role', 'option');
    div.setAttribute('data-index', index);
    div.setAttribute('tabindex', '-1');

    const icon = item.displayType === 'category' ? 'fas fa-folder' : 'fas fa-gamepad';
    const price = item.price || item.count || '';

    div.innerHTML = `
      <i class="${icon} suggestion-icon" aria-hidden="true"></i>
      <div class="suggestion-text">
        <div class="suggestion-title">${this.highlightMatch(item.name, this.getCurrentQuery())}</div>
        ${item.category ? `<div class="suggestion-category">${item.category}</div>` : ''}
      </div>
      ${price ? `<div class="suggestion-price">${price}</div>` : ''}
    `;

    // Eventos de interacción
    div.addEventListener('click', () => this.selectSuggestion(item));
    div.addEventListener('mouseenter', () => this.highlightSuggestion(index));

    return div;
  }

  // Resaltar coincidencias en el texto
  highlightMatch(text, query) {
    if (!query) return text;
    
    const regex = new RegExp(`(${this.escapeRegex(query)})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  }

  // Escapar caracteres especiales para regex
  escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  // Obtener consulta actual
  getCurrentQuery() {
    const input = document.activeElement;
    if (input === this.searchInput || input === this.mobileSearchInput) {
      return input.value.trim();
    }
    return '';
  }

  // Navegación por teclado
  handleKeyNavigation(e, isMobile = false) {
    const container = isMobile ? this.mobileSuggestions : this.searchSuggestions;
    
    if (!container || container.style.display === 'none') return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        this.moveSelection(1, isMobile);
        break;
      case 'ArrowUp':
        e.preventDefault();
        this.moveSelection(-1, isMobile);
        break;
      case 'Enter':
        e.preventDefault();
        if (this.selectedIndex >= 0) {
          this.selectSuggestion(this.currentSuggestions[this.selectedIndex]);
        } else {
          this.executeSearch(isMobile);
        }
        break;
      case 'Escape':
        this.hideSuggestions(isMobile);
        break;
    }
  }

  // Mover selección en sugerencias
  moveSelection(direction, isMobile = false) {
    const container = isMobile ? this.mobileSuggestions : this.searchSuggestions;
    const suggestions = container.querySelectorAll('.suggestion-item');
    
    if (suggestions.length === 0) return;

    // Remover highlight anterior
    if (this.selectedIndex >= 0) {
      suggestions[this.selectedIndex].classList.remove('highlighted');
    }

    // Calcular nuevo índice
    this.selectedIndex += direction;
    
    if (this.selectedIndex < -1) {
      this.selectedIndex = suggestions.length - 1;
    } else if (this.selectedIndex >= suggestions.length) {
      this.selectedIndex = -1;
    }

    // Aplicar nuevo highlight
    if (this.selectedIndex >= 0) {
      suggestions[this.selectedIndex].classList.add('highlighted');
      suggestions[this.selectedIndex].scrollIntoView({ block: 'nearest' });
    }
  }

  // Resaltar sugerencia con mouse
  highlightSuggestion(index) {
    const containers = [this.searchSuggestions, this.mobileSuggestions];
    
    containers.forEach(container => {
      if (!container) return;
      
      container.querySelectorAll('.suggestion-item').forEach((item, i) => {
        item.classList.toggle('highlighted', i === index);
      });
    });
    
    this.selectedIndex = index;
  }

  // Seleccionar sugerencia
  selectSuggestion(item) {
    if (item.displayType === 'product') {
      // Navegar al producto
      window.location.href = `productos/detalle.html?id=${item.id}`;
    } else if (item.displayType === 'category') {
      // Navegar a la categoría
      const categoryMap = {
        'cat-consolas': 'consolas',
        'cat-pc': 'pc-gaming',
        'cat-accesorios': 'accesorios',
        'cat-videojuegos': 'videojuegos'
      };
      const categorySlug = categoryMap[item.id];
      window.location.href = `productos/?category=${categorySlug}`;
    }
    
    this.hideSuggestions();
  }

  // Ejecutar búsqueda general
  executeSearch(isMobile = false) {
    const input = isMobile ? this.mobileSearchInput : this.searchInput;
    const query = input.value.trim();
    
    if (query.length >= this.minSearchLength) {
      // Redirigir a página de resultados de búsqueda
      window.location.href = `productos/?search=${encodeURIComponent(query)}`;
    }
  }

  // Manejar focus en input
  handleFocus(isMobile = false) {
    const input = isMobile ? this.mobileSearchInput : this.searchInput;
    
    if (input.value.trim().length >= this.minSearchLength) {
      this.performSearch(input.value.trim(), isMobile);
    }
  }

  // Manejar blur en input
  handleBlur(isMobile = false) {
    // Delay para permitir clics en sugerencias
    setTimeout(() => {
      this.hideSuggestions(isMobile);
    }, 150);
  }

  // Mostrar loading
  showLoading(isMobile = false) {
    const container = isMobile ? this.mobileSuggestions : this.searchSuggestions;
    
    if (!container) return;

    container.innerHTML = '<div class="search-loading"><i class="fas fa-spinner"></i> Buscando...</div>';
    container.style.display = 'block';
    container.classList.add('loading');
    this.isLoading = true;
  }

  // Ocultar sugerencias
  hideSuggestions(isMobile = false) {
    const container = isMobile ? this.mobileSuggestions : this.searchSuggestions;
    
    if (container) {
      container.style.display = 'none';
      container.classList.remove('loading');
    }
    
    this.currentSuggestions = [];
    this.selectedIndex = -1;
    this.isLoading = false;
  }

  // Manejar clics globales
  handleGlobalClick(e) {
    const searchContainers = [
      this.searchInput?.parentElement,
      this.mobileSearchInput?.parentElement
    ];

    const clickedInSearch = searchContainers.some(container => 
      container && container.contains(e.target)
    );

    if (!clickedInSearch) {
      this.hideSuggestions();
    }
  }

  // Manejar teclas globales
  handleGlobalKeydown(e) {
    if (e.key === 'Escape') {
      this.hideSuggestions();
    }
  }

  // Inicializar accesibilidad
  initAccessibility() {
    // Configurar ARIA live regions
    [this.searchSuggestions, this.mobileSuggestions].forEach(container => {
      if (container) {
        container.setAttribute('aria-live', 'polite');
        container.setAttribute('aria-atomic', 'false');
      }
    });
  }

  // API pública
  updateSearchData(newData) {
    this.searchData = { ...this.searchData, ...newData };
  }

  clearSearch(isMobile = false) {
    const input = isMobile ? this.mobileSearchInput : this.searchInput;
    if (input) {
      input.value = '';
      this.hideSuggestions(isMobile);
    }
  }

  focusSearch(isMobile = false) {
    const input = isMobile ? this.mobileSearchInput : this.searchInput;
    if (input) {
      input.focus();
    }
  }
}

// Inicializar sistema de búsqueda
document.addEventListener('DOMContentLoaded', () => {
  window.gamerSearch = new GamerSearchSystem();
  
  // Exponer funciones globales
  window.searchProduct = (query) => {
    window.gamerSearch.clearSearch();
    window.gamerSearch.searchInput.value = query;
    window.gamerSearch.performSearch(query);
  };
  
  window.focusSearch = () => window.gamerSearch.focusSearch();
});

// Estilos CSS adicionales para highlighting
const searchStyles = `
  mark {
    background: #39FF14;
    color: #000000;
    padding: 0 2px;
    border-radius: 2px;
  }
  
  .suggestion-item.highlighted mark {
    background: #000000;
    color: #39FF14;
  }
  
  .search-suggestions::-webkit-scrollbar {
    width: 8px;
  }
  
  .search-suggestions::-webkit-scrollbar-track {
    background: #1a1a1a;
  }
  
  .search-suggestions::-webkit-scrollbar-thumb {
    background: #39FF14;
    border-radius: 4px;
  }
  
  .search-suggestions::-webkit-scrollbar-thumb:hover {
    background: #2de00f;
  }
`;

// Inyectar estilos
const styleSheet = document.createElement('style');
styleSheet.textContent = searchStyles;
document.head.appendChild(styleSheet);
