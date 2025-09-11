// ================================================
// NUEVA NAVBAR LEVEL-UP GAMER - FUNCIONALIDAD
// ================================================

class GamerNavbar {
    constructor() {
        this.init();
        this.setupEventListeners();
        this.setupSearchFunctionality();
        this.setupUserMenu();
        this.setupMobileMenu();
    }

    init() {
        this.navbar = document.querySelector('.gamer-navbar');
        this.mobileMenuButton = document.querySelector('.mobile-menu-button');
        this.mobileNavigation = document.querySelector('.mobile-navigation');
        this.mobileOverlay = document.querySelector('.mobile-overlay');
        this.searchInput = document.querySelector('.search-field');
        this.searchSuggestions = document.querySelector('.search-suggestions');
        this.cartCounter = document.querySelector('.cart-counter');
        this.wishlistCounter = document.querySelector('.wishlist-counter');
        this.cartAmount = document.querySelector('.cart-amount');
        
        // Estado del menú móvil
        this.isMobileMenuOpen = false;
        
        // Configurar scroll behavior
        this.setupScrollBehavior();
        
        // Inicializar contadores
        this.updateCartCounter();
        this.updateWishlistCounter();
    }

    setupEventListeners() {
        // Manejo del scroll para efectos de navbar
        window.addEventListener('scroll', () => {
            this.handleScroll();
        });

        // Cerrar dropdowns al hacer click fuera
        document.addEventListener('click', (e) => {
            this.closeDropdowns(e);
        });

        // Navegación por teclado
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardNavigation(e);
        });

        // Redimensionamiento de ventana
        window.addEventListener('resize', () => {
            this.handleResize();
        });
    }

    setupScrollBehavior() {
        let lastScrollY = window.scrollY;
        
        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            const header = document.querySelector('.gamer-header');
            
            if (!header) return;
            
            if (currentScrollY > 100) {
                header.style.background = 'linear-gradient(135deg, rgba(0,0,0,0.95) 0%, rgba(26,26,26,0.95) 50%, rgba(0,0,0,0.95) 100%)';
                header.style.backdropFilter = 'blur(30px)';
                header.style.boxShadow = '0 8px 40px rgba(0, 0, 0, 0.9), 0 0 30px rgba(57, 255, 20, 0.15)';
            } else {
                header.style.background = 'linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #000000 100%)';
                header.style.backdropFilter = 'blur(20px)';
                header.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.8), 0 0 20px rgba(57, 255, 20, 0.1)';
            }
            
            // Auto-hide navbar en scroll hacia abajo
            if (currentScrollY > lastScrollY && currentScrollY > 200) {
                header.style.transform = 'translateY(-100%)';
            } else {
                header.style.transform = 'translateY(0)';
            }
            
            lastScrollY = currentScrollY;
        });
    }

    setupSearchFunctionality() {
        if (!this.searchInput) return;

        let searchTimeout;
        
        this.searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            const query = e.target.value.trim();
            
            if (query.length < 2) {
                this.hideSuggestions();
                return;
            }
            
            searchTimeout = setTimeout(() => {
                this.showSearchSuggestions(query);
            }, 300);
        });

        this.searchInput.addEventListener('focus', () => {
            if (this.searchInput.value.trim().length >= 2) {
                this.showSearchSuggestions(this.searchInput.value.trim());
            }
        });

        // Búsqueda móvil
        const mobileSearchInput = document.querySelector('.mobile-search-input');
        if (mobileSearchInput) {
            mobileSearchInput.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                const query = e.target.value.trim();
                
                if (query.length >= 2) {
                    searchTimeout = setTimeout(() => {
                        this.performSearch(query);
                    }, 300);
                }
            });
        }

        // Botones de búsqueda
        const searchButton = document.querySelector('.search-button');
        const mobileSearchBtn = document.querySelector('.mobile-search-btn');
        
        if (searchButton) {
            searchButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.performSearch(this.searchInput.value.trim());
            });
        }
        
        if (mobileSearchBtn) {
            mobileSearchBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const mobileInput = document.querySelector('.mobile-search-input');
                if (mobileInput) {
                    this.performSearch(mobileInput.value.trim());
                }
            });
        }
    }

    showSearchSuggestions(query) {
        if (!this.searchSuggestions) return;

        // Simulación de sugerencias (en producción vendría de una API)
        const suggestions = this.generateSuggestions(query);
        
        if (suggestions.length === 0) {
            this.hideSuggestions();
            return;
        }

        const suggestionsHTML = suggestions.map(suggestion => `
            <div class="search-suggestion-item" onclick="window.gamerNavbar.selectSuggestion('${suggestion.text}')">
                <i class="${suggestion.icon}"></i>
                <span class="suggestion-text">${suggestion.text}</span>
                <span class="suggestion-category">${suggestion.category}</span>
            </div>
        `).join('');

        this.searchSuggestions.innerHTML = suggestionsHTML;
        this.searchSuggestions.style.opacity = '1';
        this.searchSuggestions.style.visibility = 'visible';
        this.searchSuggestions.style.transform = 'translateY(0)';
    }

    generateSuggestions(query) {
        const products = [
            { text: 'PlayStation 5', category: 'Consolas', icon: 'fas fa-gamepad' },
            { text: 'Xbox Series X', category: 'Consolas', icon: 'fas fa-gamepad' },
            { text: 'Nintendo Switch', category: 'Consolas', icon: 'fas fa-gamepad' },
            { text: 'RTX 4080', category: 'PC Gaming', icon: 'fas fa-microchip' },
            { text: 'Gaming Chair', category: 'Accesorios', icon: 'fas fa-chair' },
            { text: 'Mechanical Keyboard', category: 'Accesorios', icon: 'fas fa-keyboard' },
            { text: 'Gaming Headset', category: 'Accesorios', icon: 'fas fa-headset' },
            { text: 'Call of Duty', category: 'Videojuegos', icon: 'fas fa-compact-disc' },
            { text: 'FIFA 24', category: 'Videojuegos', icon: 'fas fa-compact-disc' }
        ];

        return products.filter(product => 
            product.text.toLowerCase().includes(query.toLowerCase()) ||
            product.category.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 5);
    }

    selectSuggestion(suggestion) {
        this.searchInput.value = suggestion;
        this.hideSuggestions();
        this.performSearch(suggestion);
    }

    hideSuggestions() {
        if (!this.searchSuggestions) return;
        
        this.searchSuggestions.style.opacity = '0';
        this.searchSuggestions.style.visibility = 'hidden';
        this.searchSuggestions.style.transform = 'translateY(-10px)';
    }

    performSearch(query) {
        if (!query) return;
        
        console.log('Searching for:', query);
        // Aquí iría la lógica de búsqueda real
        // Por ahora, redirigir a la página de productos con el query
        window.location.href = `productos/?search=${encodeURIComponent(query)}`;
    }

    setupUserMenu() {
        const profileButton = document.querySelector('.profile-button');
        const profileDropdown = document.querySelector('.profile-dropdown');
        
        if (!profileButton || !profileDropdown) return;

        profileButton.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleUserMenu();
        });
    }

    toggleUserMenu() {
        const profileButton = document.querySelector('.profile-button');
        const profileDropdown = document.querySelector('.profile-dropdown');
        
        if (!profileButton || !profileDropdown) return;
        
        const isExpanded = profileButton.getAttribute('aria-expanded') === 'true';
        
        profileButton.setAttribute('aria-expanded', !isExpanded);
        
        if (!isExpanded) {
            profileDropdown.style.opacity = '1';
            profileDropdown.style.visibility = 'visible';
            profileDropdown.style.transform = 'translateY(0)';
        } else {
            profileDropdown.style.opacity = '0';
            profileDropdown.style.visibility = 'hidden';
            profileDropdown.style.transform = 'translateY(-10px)';
        }
    }

    setupMobileMenu() {
        if (!this.mobileMenuButton || !this.mobileNavigation || !this.mobileOverlay) return;

        this.mobileMenuButton.addEventListener('click', () => {
            this.toggleMobileMenu();
        });

        this.mobileOverlay.addEventListener('click', () => {
            this.closeMobileMenu();
        });

        // Botón de cerrar móvil
        const mobileCloseButton = document.querySelector('.mobile-close-button');
        if (mobileCloseButton) {
            mobileCloseButton.addEventListener('click', () => {
                this.closeMobileMenu();
            });
        }

        // Submenús móviles
        this.setupMobileSubmenus();
    }

    setupMobileSubmenus() {
        const mobileToggles = document.querySelectorAll('.mobile-nav-toggle');
        
        mobileToggles.forEach(toggle => {
            toggle.addEventListener('click', (e) => {
                e.preventDefault();
                const submenu = toggle.nextElementSibling;
                const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
                
                // Cerrar otros submenús
                mobileToggles.forEach(otherToggle => {
                    if (otherToggle !== toggle) {
                        otherToggle.setAttribute('aria-expanded', 'false');
                        const otherSubmenu = otherToggle.nextElementSibling;
                        if (otherSubmenu) {
                            otherSubmenu.classList.remove('active');
                        }
                        const otherChevron = otherToggle.querySelector('.fa-chevron-right');
                        if (otherChevron) {
                            otherChevron.style.transform = 'rotate(0deg)';
                        }
                    }
                });
                
                // Toggle el submenú actual
                toggle.setAttribute('aria-expanded', !isExpanded);
                
                if (submenu) {
                    submenu.classList.toggle('active');
                }
                
                // Rotar chevron
                const chevron = toggle.querySelector('.fa-chevron-right');
                if (chevron) {
                    chevron.style.transform = !isExpanded ? 'rotate(90deg)' : 'rotate(0deg)';
                }
            });
        });
    }

    toggleMobileMenu() {
        this.isMobileMenuOpen = !this.isMobileMenuOpen;
        
        this.mobileMenuButton.classList.toggle('active');
        this.mobileNavigation.classList.toggle('active');
        this.mobileOverlay.classList.toggle('active');
        
        // Actualizar atributos de accesibilidad
        this.mobileMenuButton.setAttribute('aria-expanded', this.isMobileMenuOpen);
        this.mobileNavigation.setAttribute('aria-hidden', !this.isMobileMenuOpen);
        
        // Prevenir scroll del body cuando el menú está abierto
        document.body.style.overflow = this.isMobileMenuOpen ? 'hidden' : '';
        
        // Focus management
        if (this.isMobileMenuOpen) {
            setTimeout(() => {
                this.mobileNavigation.focus();
            }, 100);
        }
    }

    closeMobileMenu() {
        this.isMobileMenuOpen = false;
        
        this.mobileMenuButton.classList.remove('active');
        this.mobileNavigation.classList.remove('active');
        this.mobileOverlay.classList.remove('active');
        
        this.mobileMenuButton.setAttribute('aria-expanded', 'false');
        this.mobileNavigation.setAttribute('aria-hidden', 'true');
        
        document.body.style.overflow = '';
        
        // Cerrar todos los submenús
        const submenus = document.querySelectorAll('.mobile-submenu');
        submenus.forEach(submenu => submenu.classList.remove('active'));
        
        const toggles = document.querySelectorAll('.mobile-nav-toggle');
        toggles.forEach(toggle => {
            toggle.setAttribute('aria-expanded', 'false');
            const chevron = toggle.querySelector('.fa-chevron-right');
            if (chevron) {
                chevron.style.transform = 'rotate(0deg)';
            }
        });
    }

    closeDropdowns(e) {
        // Cerrar search suggestions
        if (!e.target.closest('.navbar-search')) {
            this.hideSuggestions();
        }
        
        // Cerrar user dropdown
        if (!e.target.closest('.user-profile-menu')) {
            const profileButton = document.querySelector('.profile-button');
            const profileDropdown = document.querySelector('.profile-dropdown');
            
            if (profileButton && profileDropdown) {
                profileButton.setAttribute('aria-expanded', 'false');
                profileDropdown.style.opacity = '0';
                profileDropdown.style.visibility = 'hidden';
                profileDropdown.style.transform = 'translateY(-10px)';
            }
        }
        
        // Cerrar navigation dropdowns
        if (!e.target.closest('.nav-item.has-dropdown')) {
            const dropdowns = document.querySelectorAll('.nav-dropdown');
            dropdowns.forEach(dropdown => {
                dropdown.style.opacity = '0';
                dropdown.style.visibility = 'hidden';
                dropdown.style.transform = 'translateY(-10px)';
            });
        }
    }

    handleKeyboardNavigation(e) {
        // Escape para cerrar menús
        if (e.key === 'Escape') {
            this.hideSuggestions();
            this.closeMobileMenu();
            
            const profileButton = document.querySelector('.profile-button');
            if (profileButton && profileButton.getAttribute('aria-expanded') === 'true') {
                this.toggleUserMenu();
            }
        }
        
        // Enter en búsqueda
        if (e.key === 'Enter' && e.target.matches('.search-field, .mobile-search-input')) {
            e.preventDefault();
            this.performSearch(e.target.value.trim());
        }
    }

    handleResize() {
        // Cerrar menú móvil en resize a desktop
        if (window.innerWidth > 968 && this.isMobileMenuOpen) {
            this.closeMobileMenu();
        }
    }

    updateCartCounter() {
        // Obtener del localStorage o API
        const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
        const totalItems = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
        const totalAmount = cartItems.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 1)), 0);
        
        if (this.cartCounter) {
            this.cartCounter.textContent = totalItems;
            this.cartCounter.style.display = totalItems > 0 ? 'block' : 'none';
        }
        
        if (this.cartAmount) {
            this.cartAmount.textContent = `$${totalAmount.toLocaleString()}`;
        }
        
        // Actualizar contador móvil
        const mobileCounter = document.querySelector('.mobile-counter');
        if (mobileCounter) {
            mobileCounter.textContent = totalItems;
            mobileCounter.style.display = totalItems > 0 ? 'block' : 'none';
        }
    }

    updateWishlistCounter() {
        // Obtener del localStorage
        const wishlistItems = JSON.parse(localStorage.getItem('wishlistItems') || '[]');
        
        if (this.wishlistCounter) {
            this.wishlistCounter.textContent = wishlistItems.length;
            this.wishlistCounter.style.display = wishlistItems.length > 0 ? 'block' : 'none';
        }
    }

    // Método público para actualizar contadores desde otros scripts
    refreshCounters() {
        this.updateCartCounter();
        this.updateWishlistCounter();
    }

    handleScroll() {
        // Método para manejar efectos de scroll adicionales si es necesario
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.gamerNavbar = new GamerNavbar();
    console.log('🎮 Nueva Navbar Level-Up Gamer inicializada correctamente');
});

// ================================================
// FUNCIONES AUXILIARES PARA INTEGRACIÓN
// ================================================

// Función para actualizar contadores desde otros scripts
function updateNavbarCounters() {
    if (window.gamerNavbar) {
        window.gamerNavbar.refreshCounters();
    }
}

// Función para realizar búsqueda programáticamente
function triggerNavbarSearch(query) {
    if (window.gamerNavbar) {
        window.gamerNavbar.performSearch(query);
    }
}

// Función para abrir/cerrar menú móvil programáticamente
function toggleMobileNavigation() {
    if (window.gamerNavbar) {
        window.gamerNavbar.toggleMobileMenu();
    }
}

// Exportar para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GamerNavbar;
}
