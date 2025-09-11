// ================================================
// LG-015: BUSCADOR RÁPIDO CON AUTOCOMPLETADO - LEVEL-UP GAMER
// Sugerencias dinámicas y búsqueda inteligente
// ================================================

class AdvancedSearchSystem {
  constructor() {
    this.searchInput = document.getElementById('search-input');
    this.searchBtn = document.getElementById('search-btn');
    this.suggestionsPanel = document.getElementById('search-suggestions');
    
    this.searchTimeout = null;
    this.currentIndex = -1;
    this.suggestions = [];
  this.minLength = 3; // Mostrar sugerencias desde el tercer carácter (LG-015)
    this.searchHistory = this.loadSearchHistory();
    this.isTyping = false;
    
    // Dataset expandido de productos y categorías con etiquetas para búsqueda
    this.products = [
      // Consolas
      { id: 'ps5', name: 'PlayStation 5', category: 'Consolas', price: '$649.990', tags: ['sony', 'ps5', 'playstation', 'consola', 'gaming'], type: 'product', popular: true },
      { id: 'ps5-digital', name: 'PlayStation 5 Digital', category: 'Consolas', price: '$549.990', tags: ['sony', 'ps5', 'digital', 'playstation', 'consola'], type: 'product' },
      { id: 'xbox-series-x', name: 'Xbox Series X', category: 'Consolas', price: '$599.990', tags: ['microsoft', 'xbox', 'series x', 'consola', 'gaming'], type: 'product', popular: true },
      { id: 'xbox-series-s', name: 'Xbox Series S', category: 'Consolas', price: '$399.990', tags: ['microsoft', 'xbox', 'series s', 'consola', 'blanca'], type: 'product' },
      { id: 'switch-oled', name: 'Nintendo Switch OLED', category: 'Consolas', price: '$399.990', tags: ['nintendo', 'switch', 'oled', 'portátil', 'hybrid'], type: 'product', popular: true },
      { id: 'switch-lite', name: 'Nintendo Switch Lite', category: 'Consolas', price: '$249.990', tags: ['nintendo', 'switch lite', 'portátil', 'compact'], type: 'product' },
      
      // PC Gaming
      { id: 'rtx4090', name: 'NVIDIA RTX 4090', category: 'PC Gaming', price: '$1.899.990', tags: ['nvidia', 'rtx', '4090', 'gpu', 'gráfica', 'high-end'], type: 'product', popular: true },
      { id: 'rtx4080', name: 'NVIDIA RTX 4080', category: 'PC Gaming', price: '$1.299.990', tags: ['nvidia', 'rtx', '4080', 'gpu', 'gráfica'], type: 'product' },
      { id: 'rtx4070', name: 'NVIDIA RTX 4070', category: 'PC Gaming', price: '$899.990', tags: ['nvidia', 'rtx', '4070', 'gpu', 'gráfica'], type: 'product', popular: true },
      { id: 'rx7900xt', name: 'AMD Radeon RX 7900 XT', category: 'PC Gaming', price: '$1.199.990', tags: ['amd', 'radeon', 'rx', '7900', 'gpu'], type: 'product' },
      { id: 'ryzen9', name: 'AMD Ryzen 9 7900X', category: 'PC Gaming', price: '$549.990', tags: ['amd', 'ryzen', 'cpu', 'procesador', '7900x'], type: 'product' },
      { id: 'intel-i9', name: 'Intel Core i9-13900K', category: 'PC Gaming', price: '$599.990', tags: ['intel', 'core', 'i9', 'cpu', 'procesador'], type: 'product' },
      
      // Accesorios Gaming
      { id: 'headset-rgb', name: 'Auriculares Gaming RGB 7.1', category: 'Accesorios', price: '$199.990', tags: ['auriculares', 'headset', 'rgb', '7.1', 'surround'], type: 'product', popular: true },
      { id: 'keyboard-mech', name: 'Teclado Mecánico RGB', category: 'Accesorios', price: '$149.990', tags: ['teclado', 'mecánico', 'rgb', 'switches', 'gaming'], type: 'product' },
      { id: 'mouse-gaming', name: 'Mouse Gaming 12000 DPI', category: 'Accesorios', price: '$89.990', tags: ['mouse', 'gaming', 'dpi', 'rgb', 'precisión'], type: 'product', popular: true },
      { id: 'chair-gaming', name: 'Silla Gaming RGB', category: 'Accesorios', price: '$399.990', tags: ['silla', 'gaming', 'rgb', 'ergonómica', 'cómoda'], type: 'product' },
      { id: 'webcam-4k', name: 'Webcam 4K Gaming', category: 'Accesorios', price: '$179.990', tags: ['webcam', '4k', 'streaming', 'cámara'], type: 'product' },
      { id: 'microfono', name: 'Micrófono Gaming USB', category: 'Accesorios', price: '$129.990', tags: ['micrófono', 'usb', 'streaming', 'audio'], type: 'product' },
      
      // Videojuegos
      { id: 'fifa24', name: 'FIFA 24', category: 'Videojuegos', price: '$59.990', tags: ['fifa', 'futbol', 'deportes', 'ea'], type: 'product', popular: true },
      { id: 'cod-mw3', name: 'Call of Duty: MW III', category: 'Videojuegos', price: '$69.990', tags: ['call of duty', 'cod', 'mw3', 'shooter', 'acción'], type: 'product', popular: true },
      { id: 'cyberpunk', name: 'Cyberpunk 2077', category: 'Videojuegos', price: '$49.990', tags: ['cyberpunk', 'rpg', 'futuro', 'cd projekt'], type: 'product' },
      { id: 'elden-ring', name: 'Elden Ring', category: 'Videojuegos', price: '$59.990', tags: ['elden ring', 'rpg', 'fromsoft', 'souls'], type: 'product', popular: true },
      { id: 'spider-man', name: 'Marvel\'s Spider-Man 2', category: 'Videojuegos', price: '$69.990', tags: ['spider-man', 'marvel', 'acción', 'aventura'], type: 'product' },
      { id: 'gta6', name: 'Grand Theft Auto VI', category: 'Videojuegos', price: '$79.990', tags: ['gta', 'grand theft auto', 'rockstar', 'mundo abierto'], type: 'product' },
      
      // Juegos de Mesa Gaming (agregados para el ejemplo LG-015)
      { id: 'catan', name: 'Catan', category: 'Juegos de Mesa', price: '$39.990', tags: ['catan', 'mesa', 'estrategia', 'colonos'], type: 'product', popular: true },
      { id: 'carcassonne', name: 'Carcassonne', category: 'Juegos de Mesa', price: '$29.990', tags: ['carcassonne', 'mesa', 'estrategia', 'tiles'], type: 'product', popular: true }
    ];
    
    this.categories = [
      { id: 'consolas', name: 'Consolas', count: '15+ productos', type: 'category', icon: 'fas fa-gamepad' },
      { id: 'pc-gaming', name: 'PC Gaming', count: '25+ productos', type: 'category', icon: 'fas fa-desktop' },
      { id: 'accesorios', name: 'Accesorios', count: '30+ productos', type: 'category', icon: 'fas fa-headphones' },
      { id: 'videojuegos', name: 'Videojuegos', count: '50+ productos', type: 'category', icon: 'fas fa-compact-disc' },
      { id: 'juegos-mesa', name: 'Juegos de Mesa', count: '10+ productos', type: 'category', icon: 'fas fa-dice' }
    ];
    
    // Términos populares y trending
    this.popularSearches = [
      'PlayStation 5', 'RTX 4090', 'FIFA 24', 'Xbox Series X', 
      'Call of Duty', 'Nintendo Switch', 'RGB', 'Gaming'
    ];
    
    this.init();
  }
  
  // Cargar historial de búsquedas del localStorage
  loadSearchHistory() {
    try {
      return JSON.parse(localStorage.getItem('searchHistory')) || [];
    } catch {
      return [];
    }
  }
  
  // Guardar búsqueda en historial
  saveToHistory(query) {
    if (!query || query.length < 2) return;
    
    // Evitar duplicados y mantener solo los últimos 10
    this.searchHistory = this.searchHistory.filter(item => item !== query);
    this.searchHistory.unshift(query);
    this.searchHistory = this.searchHistory.slice(0, 10);
    
    localStorage.setItem('searchHistory', JSON.stringify(this.searchHistory));
  }
  
  init() {
    if (!this.searchInput || !this.suggestionsPanel) return;
    
    // Configurar atributos ARIA para accesibilidad
    this.setupAccessibility();
    
    // Eventos del input
    this.searchInput.addEventListener('input', (e) => this.handleInput(e));
    this.searchInput.addEventListener('keydown', (e) => this.handleKeydown(e));
    this.searchInput.addEventListener('focus', () => this.handleFocus());
    this.searchInput.addEventListener('blur', () => this.handleBlur());
    
    // Evento del botón
    if (this.searchBtn) {
      this.searchBtn.addEventListener('click', () => this.executeSearch());
    }
    
    // Cerrar con clic fuera
    document.addEventListener('click', (e) => this.handleOutsideClick(e));
  }
  
  // Configurar atributos ARIA para accesibilidad (LG-015)
  setupAccessibility() {
    // Configurar input
    this.searchInput.setAttribute('role', 'combobox');
    this.searchInput.setAttribute('aria-expanded', 'false');
    this.searchInput.setAttribute('aria-haspopup', 'listbox');
    this.searchInput.setAttribute('aria-autocomplete', 'list');
    this.searchInput.setAttribute('aria-controls', 'search-suggestions');
    
    // Configurar panel de sugerencias
    this.suggestionsPanel.setAttribute('role', 'listbox');
    this.suggestionsPanel.setAttribute('aria-hidden', 'true');
    this.suggestionsPanel.setAttribute('aria-label', 'Sugerencias de búsqueda');
  }
  
  handleInput(e) {
    const query = e.target.value.trim();
    this.isTyping = true;
    
    // Limpiar timeout anterior
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
    
    // No mostrar sugerencias si menos de la longitud mínima
    if (query.length < this.minLength) {
      this.hideSuggestions();
      return;
    }

    // Debounce para evitar consultas excesivas (mínimo 250ms según LG-015)
    this.searchTimeout = setTimeout(() => {
      this.searchSuggestions(query);
      this.isTyping = false;
    }, 250);
  }
  
  // Mostrar sugerencias por defecto (historial + populares)
  showDefaultSuggestions() {
    const suggestions = [];
    
    // Añadir historial de búsquedas
    if (this.searchHistory.length > 0) {
      this.searchHistory.slice(0, 4).forEach(term => {
        suggestions.push({
          id: `history-${term}`,
          name: term,
          type: 'history',
          category: 'Búsqueda reciente'
        });
      });
    }
    
    // Añadir búsquedas populares
    this.popularSearches.slice(0, 4).forEach(term => {
      if (!suggestions.some(s => s.name.toLowerCase() === term.toLowerCase())) {
        suggestions.push({
          id: `popular-${term}`,
          name: term,
          type: 'popular',
          category: 'Búsqueda popular'
        });
      }
    });
    
    this.suggestions = suggestions.slice(0, 6);
    this.currentIndex = -1;
    this.displaySuggestions();
  }
  
  // Algoritmo de búsqueda inteligente mejorado
  searchSuggestions(query) {
    const normalizedQuery = this.normalizeText(query);
    const results = [];
    const exactMatches = [];
    const partialMatches = [];
    
    // Buscar productos con scoring inteligente
    this.products.forEach(product => {
      let score = 0;
      let matchType = '';
      
      // Coincidencia exacta en nombre (máxima prioridad)
      if (this.normalizeText(product.name).startsWith(normalizedQuery)) {
        score += 100;
        matchType = 'name-start';
      } else if (this.normalizeText(product.name).includes(normalizedQuery)) {
        score += 80;
        matchType = 'name-partial';
      }
      
      // Coincidencia en tags
      if (product.tags) {
        product.tags.forEach(tag => {
          if (this.normalizeText(tag).includes(normalizedQuery)) {
            score += 60;
            matchType = matchType || 'tag';
          }
        });
      }
      
      // Coincidencia en categoría
      if (this.normalizeText(product.category).includes(normalizedQuery)) {
        score += 40;
        matchType = matchType || 'category';
      }
      
      // Boost para productos populares
      if (product.popular) {
        score += 20;
      }
      
      if (score > 0) {
        const result = { ...product, score, matchType };
        if (score >= 80) {
          exactMatches.push(result);
        } else {
          partialMatches.push(result);
        }
      }
    });
    
    // Buscar categorías
    this.categories.forEach(category => {
      if (this.normalizeText(category.name).includes(normalizedQuery)) {
        const score = this.normalizeText(category.name).startsWith(normalizedQuery) ? 90 : 70;
        results.push({ ...category, score, matchType: 'category' });
      }
    });
    
    // Ordenar por score y combinar resultados
    exactMatches.sort((a, b) => b.score - a.score);
    partialMatches.sort((a, b) => b.score - a.score);
    results.push(...exactMatches, ...partialMatches);
    
    this.suggestions = results.slice(0, 8); // Máximo 8 resultados
    this.currentIndex = -1;
    this.displaySuggestions(query);
  }
  
  normalizeText(text) {
    return text.toLowerCase()
               .normalize('NFD')
               .replace(/[\u0300-\u036f]/g, '');
  }
  
  displaySuggestions(query = '') {
    if (this.suggestions.length === 0) {
      this.suggestionsPanel.innerHTML = '<div class="no-results"><i class="fas fa-search"></i> No se encontraron resultados' + (query ? ` para "${query}"` : '') + '</div>';
      this.showSuggestions();
      return;
    }
    
    let html = '';
    
    this.suggestions.forEach((item, index) => {
      let icon = '';
      let title = item.name;
      let subtitle = '';
      let price = item.price || '';
      let typeClass = '';
      
      // Configurar según tipo de sugerencia
      switch(item.type) {
        case 'product':
          icon = this.getProductIcon(item.category);
          subtitle = item.category;
          typeClass = 'product-suggestion';
          // Resaltar texto coincidente
          if (query) {
            title = this.highlightText(title, query);
          }
          break;
          
        case 'category':
          icon = item.icon || 'fas fa-th-large';
          subtitle = item.count;
          typeClass = 'category-suggestion';
          if (query) {
            title = this.highlightText(title, query);
          }
          break;
          
        case 'history':
          icon = 'fas fa-history';
          subtitle = 'Búsqueda reciente';
          typeClass = 'history-suggestion';
          break;
          
        case 'popular':
          icon = 'fas fa-fire';
          subtitle = 'Búsqueda popular';
          typeClass = 'popular-suggestion';
          break;
          
        default:
          icon = 'fas fa-search';
          typeClass = 'default-suggestion';
      }
      
      html += `
        <div class="suggestion-item ${typeClass}" 
             data-index="${index}" 
             data-id="${item.id}"
             data-type="${item.type}"
             id="search-suggestion-${index}"
             tabindex="-1"
             role="option"
             aria-selected="false">
          <div class="suggestion-icon">
            <i class="${icon}"></i>
          </div>
          <div class="suggestion-content">
            <div class="suggestion-title">${title}</div>
            ${subtitle ? `<div class="suggestion-category">${subtitle}</div>` : ''}
          </div>
          ${price ? `<div class="suggestion-price">${price}</div>` : ''}
          ${item.popular ? '<div class="popular-badge"><i class="fas fa-star"></i></div>' : ''}
        </div>
      `;
    });
    
    this.suggestionsPanel.innerHTML = html;
    this.addSuggestionEvents();
    this.showSuggestions();
  }
  
  // Obtener icono según categoría de producto
  getProductIcon(category) {
    const icons = {
      'Consolas': 'fas fa-gamepad',
      'PC Gaming': 'fas fa-desktop',
      'Accesorios': 'fas fa-headphones',
      'Videojuegos': 'fas fa-compact-disc',
      'Juegos de Mesa': 'fas fa-dice'
    };
    return icons[category] || 'fas fa-box';
  }
  
  highlightText(text, query) {
    const regex = new RegExp(`(${this.escapeRegex(query)})`, 'gi');
    return text.replace(regex, '<span class="highlight">$1</span>');
  }
  
  escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
  
  addSuggestionEvents() {
    const items = this.suggestionsPanel.querySelectorAll('.suggestion-item');
    items.forEach((item, index) => {
      item.addEventListener('click', () => this.selectSuggestion(index));
      item.addEventListener('mouseenter', () => this.highlightSuggestion(index));
      
      // Agregar animación al hover
      item.addEventListener('mouseenter', () => {
        item.style.transform = 'translateX(3px)';
      });
      item.addEventListener('mouseleave', () => {
        item.style.transform = 'translateX(0)';
      });
    });
  }
  
  handleFocus() {
    const query = this.searchInput.value.trim();
    if (query.length === 0) {
      this.showDefaultSuggestions();
    } else if (query.length >= this.minLength) {
      this.searchSuggestions(query);
    }
  }
  
  selectSuggestion(index) {
    if (index < 0 || index >= this.suggestions.length) return;
    
    const suggestion = this.suggestions[index];
    
    // Completar input con el nombre seleccionado
    this.searchInput.value = suggestion.name;
    
    // Guardar en historial si no es del historial
    if (suggestion.type !== 'history') {
      this.saveToHistory(suggestion.name);
    }
    
    // Ejecutar búsqueda según tipo
    if (suggestion.type === 'category') {
      window.location.href = `productos/?category=${suggestion.id}`;
    } else if (suggestion.type === 'product') {
      window.location.href = `productos/detalle.html?id=${suggestion.id}`;
    } else {
      // Para historial y populares, ejecutar búsqueda general
      this.executeSearch(suggestion.name);
    }
    
    this.hideSuggestions();
  }
  
  executeSearch(query = null) {
    const searchQuery = query || this.searchInput.value.trim();
    
    if (searchQuery.length === 0) return;
    
    // Guardar en historial
    this.saveToHistory(searchQuery);
    
    // Redirigir a página de resultados
    window.location.href = `productos/?search=${encodeURIComponent(searchQuery)}`;
  }
  
  handleKeydown(e) {
    if (!this.suggestionsPanel.classList.contains('show')) return;
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        this.moveSelection(1);
        break;
      case 'ArrowUp':
        e.preventDefault();
        this.moveSelection(-1);
        break;
      case 'Enter':
        e.preventDefault();
        if (this.currentIndex >= 0) {
          this.selectSuggestion(this.currentIndex);
        } else {
          this.executeSearch();
        }
        break;
      case 'Escape':
        this.hideSuggestions();
        break;
    }
  }
  
  moveSelection(direction) {
    const items = this.suggestionsPanel.querySelectorAll('.suggestion-item');
    if (items.length === 0) return;
    
    // Remover highlight anterior
    if (this.currentIndex >= 0) {
      items[this.currentIndex].classList.remove('highlighted');
      items[this.currentIndex].setAttribute('aria-selected', 'false');
    }
    
    // Calcular nuevo índice
    this.currentIndex += direction;
    
    if (this.currentIndex < 0) {
      this.currentIndex = items.length - 1;
    } else if (this.currentIndex >= items.length) {
      this.currentIndex = 0;
    }
    
    // Aplicar nuevo highlight y configurar ARIA
    const activeItem = items[this.currentIndex];
    activeItem.classList.add('highlighted');
    activeItem.setAttribute('aria-selected', 'true');
    activeItem.scrollIntoView({ block: 'nearest' });
    
    // Actualizar aria-activedescendant en el input
    this.searchInput.setAttribute('aria-activedescendant', activeItem.id);
  }
  
  highlightSuggestion(index) {
    const items = this.suggestionsPanel.querySelectorAll('.suggestion-item');
    items.forEach((item, i) => {
      item.classList.toggle('highlighted', i === index);
      item.setAttribute('aria-selected', i === index ? 'true' : 'false');
    });
    this.currentIndex = index;

    // Actualizar aria-activedescendant en el input
    const activeItem = items[index];
    if (activeItem && activeItem.id) {
      this.searchInput.setAttribute('aria-activedescendant', activeItem.id);
    } else {
      this.searchInput.removeAttribute('aria-activedescendant');
    }
  }
  
  // API pública
  clearSearch() {
    this.searchInput.value = '';
    this.hideSuggestions();
  }
  
  focusSearch() {
    this.searchInput.focus();
  }
  
  // Eventos de manejo adicionales
  handleFocus() {
    const query = this.searchInput.value.trim();
    if (query.length === 0) {
      this.showDefaultSuggestions();
    } else if (query.length >= this.minLength) {
      this.searchSuggestions(query);
    }
  }
  
  handleBlur() {
    // Delay para permitir clics en sugerencias
    setTimeout(() => {
      this.hideSuggestions();
    }, 150);
  }
  
  handleOutsideClick(e) {
    if (!this.searchInput.parentElement.contains(e.target)) {
      this.hideSuggestions();
    }
  }
}

// ================================================
// INICIALIZACIÓN DEL SISTEMA DE BÚSQUEDA LG-015
// ================================================

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  window.advancedSearch = new AdvancedSearchSystem();
  
  // Funciones globales para acceso externo
  window.clearSearch = () => {
    if (window.advancedSearch) {
      window.advancedSearch.searchInput.value = '';
      window.advancedSearch.hideSuggestions();
    }
  };

  window.focusSearch = () => {
    if (window.advancedSearch) {
      window.advancedSearch.searchInput.focus();
    }
  };
  
  // Atajo de teclado Ctrl/Cmd + K para enfocar búsqueda
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      window.focusSearch();
    }
  });
  
  console.log('🔍 LG-015: Sistema de búsqueda avanzado inicializado');
});
