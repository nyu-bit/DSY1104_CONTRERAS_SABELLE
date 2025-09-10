// ================================
// LEVEL-UP GAMER - JAVASCRIPT PRINCIPAL
// Funcionalidades principales del sitio
// ================================

// Variables globales
let cart = JSON.parse(localStorage.getItem('levelup_cart')) || [];
let user = JSON.parse(localStorage.getItem('levelup_user')) || null;

// Productos de ejemplo
const PRODUCTS = {
    1: {
        id: 1,
        name: 'PlayStation 5',
        price: 499.99,
        image: '🎮',
        category: 'consolas',
        description: 'La consola de nueva generación de Sony con gráficos 4K y SSD ultra rápido.',
        features: ['4K Gaming', 'Ray Tracing', 'SSD Ultra Rápido', 'Compatibilidad PS4'],
        stock: 15,
        sku: 'PS5-001'
    },
    2: {
        id: 2,
        name: 'Xbox Series X',
        price: 499.99,
        image: '🎯',
        category: 'consolas',
        description: 'La consola más potente de Xbox con 12 teraflops de potencia gráfica.',
        features: ['12 Teraflops', '4K/120fps', 'Smart Delivery', 'Game Pass'],
        stock: 12,
        sku: 'XSX-001'
    },
    3: {
        id: 3,
        name: 'Nintendo Switch',
        price: 299.99,
        image: '🕹️',
        category: 'consolas',
        description: 'La consola híbrida que puedes llevar a cualquier parte.',
        features: ['Modo Portátil', 'Modo TV', 'Joy-Con Removibles', 'Exclusivos Nintendo'],
        stock: 25,
        sku: 'NSW-001'
    },
    4: {
        id: 4,
        name: 'Gaming Headset Pro',
        price: 89.99,
        image: '🎧',
        category: 'accesorios',
        description: 'Auriculares gaming con sonido surround 7.1 y micrófono profesional.',
        features: ['Sonido 7.1', 'Micrófono Noise-Cancelling', 'RGB', 'Compatibilidad Universal'],
        stock: 30,
        sku: 'GHS-001'
    },
    5: {
        id: 5,
        name: 'Mechanical Keyboard RGB',
        price: 129.99,
        image: '⌨️',
        category: 'accesorios',
        description: 'Teclado mecánico con switches Cherry MX y retroiluminación RGB.',
        features: ['Cherry MX Red', 'RGB Personalizable', 'Anti-ghosting', 'Software incluido'],
        stock: 20,
        sku: 'MKB-001'
    },
    6: {
        id: 6,
        name: 'Gaming Mouse Ultra',
        price: 79.99,
        image: '🖱️',
        category: 'accesorios',
        description: 'Ratón gaming de alta precisión con sensor de 16000 DPI.',
        features: ['16000 DPI', '8 Botones', 'RGB', 'Peso Ajustable'],
        stock: 35,
        sku: 'GMU-001'
    }
};

// ================================
// INICIALIZACIÓN
// ================================

document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    updateCartCounter();
    updateUserUI();
    setupEventListeners();
    loadPageContent();
}

// ================================
// GESTIÓN DEL CARRITO
// ================================

function updateCartCounter() {
    const counter = document.getElementById('cartCounter');
    if (counter) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        counter.textContent = totalItems;
        counter.style.display = totalItems > 0 ? 'flex' : 'none';
    }
}

function addToCart(productId, quantity = 1) {
    const product = PRODUCTS[productId];
    if (!product) {
        showNotification('Producto no encontrado', 'error');
        return;
    }

    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: productId,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: quantity
        });
    }

    localStorage.setItem('levelup_cart', JSON.stringify(cart));
    updateCartCounter();
    showNotification(`${product.name} agregado al carrito`, 'success');
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('levelup_cart', JSON.stringify(cart));
    updateCartCounter();
    showNotification('Producto eliminado del carrito', 'info');
}

function clearCart() {
    cart = [];
    localStorage.setItem('levelup_cart', JSON.stringify(cart));
    updateCartCounter();
    showNotification('Carrito vaciado', 'info');
}

function updateCartItemQuantity(productId, newQuantity) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        if (newQuantity <= 0) {
            removeFromCart(productId);
        } else {
            item.quantity = newQuantity;
            localStorage.setItem('levelup_cart', JSON.stringify(cart));
            updateCartCounter();
        }
    }
}

// ================================
// GESTIÓN DE USUARIO
// ================================

function updateUserUI() {
    const userAuth = document.getElementById('userAuth');
    const userDashboard = document.getElementById('userDashboard');
    const userName = document.getElementById('userName');

    if (user) {
        if (userAuth) userAuth.style.display = 'none';
        if (userDashboard) userDashboard.style.display = 'block';
        if (userName) userName.textContent = user.name;
    } else {
        if (userAuth) userAuth.style.display = 'block';
        if (userDashboard) userDashboard.style.display = 'none';
    }
}

function login(email, password) {
    // Simulación de login - en producción esto sería una llamada al servidor
    const users = {
        'admin@levelup.com': { name: 'Admin', email: 'admin@levelup.com', role: 'admin' },
        'user@levelup.com': { name: 'Usuario', email: 'user@levelup.com', role: 'user' },
        'gamer@levelup.com': { name: 'Pro Gamer', email: 'gamer@levelup.com', role: 'user' }
    };

    if (users[email] && (password === 'admin123' || password === 'user123' || password === 'gamer123')) {
        user = users[email];
        localStorage.setItem('levelup_user', JSON.stringify(user));
        updateUserUI();
        showNotification(`Bienvenido, ${user.name}!`, 'success');
        return true;
    }

    showNotification('Credenciales incorrectas', 'error');
    return false;
}

function logout() {
    user = null;
    localStorage.removeItem('levelup_user');
    updateUserUI();
    showNotification('Sesión cerrada correctamente', 'info');
    
    // Redireccionar a la página principal si estamos en área de usuario
    if (window.location.pathname.includes('/usuario/')) {
        window.location.href = '../index.html';
    }
}

function register(userData) {
    // Simulación de registro - en producción esto sería una llamada al servidor
    const newUser = {
        name: `${userData.firstName} ${userData.lastName}`,
        email: userData.email,
        role: 'user',
        gamertag: userData.gamertag || '',
        platform: userData.platform || '',
        genres: userData.genres || []
    };

    user = newUser;
    localStorage.setItem('levelup_user', JSON.stringify(user));
    updateUserUI();
    showNotification(`¡Bienvenido a Level-Up Gamer, ${user.name}!`, 'success');
    return true;
}

// ================================
// GESTIÓN DE PRODUCTOS
// ================================

function loadProducts(container, filters = {}) {
    if (!container) return;

    let productsList = Object.values(PRODUCTS);

    // Aplicar filtros
    if (filters.category) {
        productsList = productsList.filter(p => p.category === filters.category);
    }

    if (filters.priceRange) {
        const [min, max] = filters.priceRange.split('-').map(Number);
        productsList = productsList.filter(p => {
            if (max) return p.price >= min && p.price <= max;
            return p.price >= min;
        });
    }

    // Aplicar ordenamiento
    if (filters.sort) {
        switch (filters.sort) {
            case 'price-low':
                productsList.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                productsList.sort((a, b) => b.price - a.price);
                break;
            case 'name':
                productsList.sort((a, b) => a.name.localeCompare(b.name));
                break;
        }
    }

    // Renderizar productos
    container.innerHTML = productsList.map(product => `
        <article class="product-card" data-product-id="${product.id}">
            <div class="product-image">${product.image}</div>
            <h3 class="product-title">${product.name}</h3>
            <p class="product-price">$${product.price.toFixed(2)}</p>
            <button class="product-button" onclick="addToCart(${product.id})">
                Agregar al Carrito
            </button>
        </article>
    `).join('');
}

function getProduct(id) {
    return PRODUCTS[parseInt(id)];
}

// ================================
// MODAL DEL CARRITO
// ================================

function showCartModal() {
    const modal = document.getElementById('cartModal');
    if (!modal) return;

    updateCartModal();
    modal.style.display = 'block';
    modal.setAttribute('aria-hidden', 'false');
}

function hideCartModal() {
    const modal = document.getElementById('cartModal');
    if (modal) {
        modal.style.display = 'none';
        modal.setAttribute('aria-hidden', 'true');
    }
}

function updateCartModal() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');

    if (!cartItems || !cartTotal) return;

    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart-message">Tu carrito está vacío</p>';
        cartTotal.textContent = '0.00';
        return;
    }

    let total = 0;
    cartItems.innerHTML = cart.map(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        return `
            <div class="cart-item">
                <div class="item-image">${item.image}</div>
                <div class="item-info">
                    <h4>${item.name}</h4>
                    <p class="item-price">$${item.price.toFixed(2)}</p>
                </div>
                <div class="item-quantity">
                    <button onclick="updateCartItemQuantity(${item.id}, ${item.quantity - 1})">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="updateCartItemQuantity(${item.id}, ${item.quantity + 1})">+</button>
                </div>
                <div class="item-total">$${itemTotal.toFixed(2)}</div>
                <button class="remove-item" onclick="removeFromCart(${item.id})">×</button>
            </div>
        `;
    }).join('');

    cartTotal.textContent = total.toFixed(2);
}

// ================================
// NOTIFICACIONES
// ================================

function showNotification(message, type = 'info') {
    // Crear contenedor de notificaciones si no existe
    let container = document.getElementById('notifications');
    if (!container) {
        container = document.createElement('div');
        container.id = 'notifications';
        container.className = 'notifications-container';
        document.body.appendChild(container);
    }

    // Crear notificación
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span class="notification-message">${message}</span>
        <button class="notification-close">&times;</button>
    `;

    // Agregar event listeners
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => removeNotification(notification));

    // Agregar al contenedor
    container.appendChild(notification);

    // Auto-eliminar después de 5 segundos
    setTimeout(() => removeNotification(notification), 5000);
}

function removeNotification(notification) {
    if (notification && notification.parentNode) {
        notification.style.opacity = '0';
        setTimeout(() => {
            notification.parentNode.removeChild(notification);
        }, 300);
    }
}

// ================================
// EVENT LISTENERS
// ================================

function setupEventListeners() {
    // Event listeners para el carrito
    const cartToggle = document.getElementById('cartToggle');
    if (cartToggle) {
        cartToggle.addEventListener('click', showCartModal);
    }

    const cartModalClose = document.getElementById('cartModalClose');
    if (cartModalClose) {
        cartModalClose.addEventListener('click', hideCartModal);
    }

    // Cerrar modal al hacer clic fuera
    const cartModal = document.getElementById('cartModal');
    if (cartModal) {
        cartModal.addEventListener('click', (e) => {
            if (e.target === cartModal) {
                hideCartModal();
            }
        });
    }

    // Event listeners para navegación móvil
    const navToggle = document.querySelector('.nav-toggle');
    if (navToggle) {
        navToggle.addEventListener('click', toggleMobileNav);
    }
}

function toggleMobileNav() {
    const nav = document.querySelector('.nav');
    if (nav) {
        nav.classList.toggle('nav-open');
    }
}

// ================================
// CARGA DE CONTENIDO ESPECÍFICO
// ================================

function loadPageContent() {
    const path = window.location.pathname;

    if (path.includes('/productos/')) {
        loadProductsPage();
    } else if (path.includes('/carrito/')) {
        loadCartPage();
    } else if (path.includes('/usuario/')) {
        loadUserPage();
    } else {
        loadHomePage();
    }
}

function loadHomePage() {
    const productsGrid = document.getElementById('featured-grid');
    if (productsGrid) {
        loadProducts(productsGrid);
    }
    
    // Inicializar sección de ofertas destacadas
    const specialOffersSection = document.getElementById('special-offers');
    if (specialOffersSection) {
        initSpecialOffers();
    }
    
    // Inicializar comparador de productos
    const comparisonSection = document.getElementById('product-comparison');
    if (comparisonSection) {
        initProductComparison();
    }
}

function loadProductsPage() {
    const productsGrid = document.getElementById('productsGrid');
    if (productsGrid) {
        loadProducts(productsGrid);
        setupProductFilters();
    }
}

function loadCartPage() {
    updateCartPage();
}

function loadUserPage() {
    updateUserUI();
}

function setupProductFilters() {
    const categoryFilter = document.getElementById('categoryFilter');
    const priceFilter = document.getElementById('priceFilter');
    const sortFilter = document.getElementById('sortFilter');

    [categoryFilter, priceFilter, sortFilter].forEach(filter => {
        if (filter) {
            filter.addEventListener('change', applyProductFilters);
        }
    });
}

function applyProductFilters() {
    const category = document.getElementById('categoryFilter')?.value;
    const priceRange = document.getElementById('priceFilter')?.value;
    const sort = document.getElementById('sortFilter')?.value;

    const filters = {
        category: category || undefined,
        priceRange: priceRange || undefined,
        sort: sort || undefined
    };

    const productsGrid = document.getElementById('productsGrid');
    if (productsGrid) {
        loadProducts(productsGrid, filters);
    }
}

function updateCartPage() {
    const cartContainer = document.getElementById('cartContainer');
    const emptyCart = document.getElementById('emptyCart');

    if (cart.length === 0) {
        if (cartContainer) cartContainer.style.display = 'none';
        if (emptyCart) emptyCart.style.display = 'block';
        return;
    }

    if (cartContainer) cartContainer.style.display = 'block';
    if (emptyCart) emptyCart.style.display = 'none';

    updateCartItems();
    updateCartSummary();
}

function updateCartItems() {
    const cartItems = document.getElementById('cartItems');
    if (!cartItems) return;

    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item-full">
            <div class="item-image">${item.image}</div>
            <div class="item-details">
                <h3>${item.name}</h3>
                <p class="item-price">$${item.price.toFixed(2)}</p>
            </div>
            <div class="item-controls">
                <div class="quantity-controls">
                    <button onclick="updateCartItemQuantity(${item.id}, ${item.quantity - 1})">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button onclick="updateCartItemQuantity(${item.id}, ${item.quantity + 1})">+</button>
                </div>
                <button class="remove-button" onclick="removeFromCart(${item.id})">Eliminar</button>
            </div>
            <div class="item-total">$${(item.price * item.quantity).toFixed(2)}</div>
        </div>
    `).join('');
}

function updateCartSummary() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 0 ? 5.99 : 0;
    const total = subtotal + shipping;

    const subtotalEl = document.getElementById('subtotal');
    const shippingEl = document.getElementById('shipping');
    const totalEl = document.getElementById('total');

    if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    if (shippingEl) shippingEl.textContent = `$${shipping.toFixed(2)}`;
    if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;
}

// ================================
// FUNCIONES UTILITARIAS
// ================================

function proceedToCheckout() {
    if (cart.length === 0) {
        showNotification('Tu carrito está vacío', 'error');
        return;
    }

    if (!user) {
        showNotification('Debes iniciar sesión para continuar', 'error');
        window.location.href = '../usuario/login.html';
        return;
    }

    showNotification('Redirigiendo al checkout...', 'info');
    // Aquí iría la lógica del checkout
}

function fillDemoUser(email, password) {
    const emailField = document.getElementById('email');
    const passwordField = document.getElementById('password');

    if (emailField) emailField.value = email;
    if (passwordField) passwordField.value = password;
}

// ================================
// FUNCIONES PARA MODALES INFORMATIVOS
// ================================

function showStudentInfo() {
    showModal('studentModal');
}

function showTermsModal() {
    showModal('termsModal');
}

function acceptTerms() {
    showNotification('¡Gracias por aceptar nuestros términos y condiciones!', 'success');
    closeModal('termsModal');
    
    // Guardar que el usuario aceptó los términos
    localStorage.setItem('levelup_terms_accepted', 'true');
    localStorage.setItem('levelup_terms_date', new Date().toISOString());
}

function showContactModal() {
    showNotification('📧 Contacto: soporte@levelup-gamer.com | 📞 +56 9 1234 5678', 'info');
}

function showShippingInfo() {
    showNotification('📦 Información de Envíos: Envío gratuito en compras +$50.000. Entrega 2-5 días hábiles.', 'info');
}

function showReturnPolicy() {
    showNotification('🔄 Política de Devoluciones: 30 días para devoluciones. Productos en estado original.', 'info');
}

function showFAQ() {
    showNotification('❓ FAQ: Visita nuestra sección de preguntas frecuentes para más información.', 'info');
}

function filterByCategory(category) {
    window.location.href = `productos/?category=${category}`;
}

function goToProducts() {
    window.location.href = 'productos/';
}

// ================================
// FUNCIONES PARA MODALES GENERALES
// ================================

function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'flex';
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = 'auto';
    }
}

// Cerrar modal al hacer clic fuera
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal')) {
        const modalId = e.target.id;
        closeModal(modalId);
    }
});

// Cerrar modal con tecla Escape
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const openModals = document.querySelectorAll('.modal[style*="flex"]');
        openModals.forEach(modal => {
            closeModal(modal.id);
        });
    }
});

// Exportar funciones para uso global
window.levelUpGamer = {
    addToCart,
    removeFromCart,
    clearCart,
    showCartModal,
    hideCartModal,
    login,
    logout,
    register,
    showNotification,
    fillDemoUser,
    proceedToCheckout,
    updateCartItemQuantity,
    
    // Modales informativos
    showStudentInfo,
    showTermsModal,
    acceptTerms,
    showContactModal,
    showShippingInfo,
    showReturnPolicy,
    showFAQ,
    showModal,
    closeModal,
    
    // Navegación
    filterByCategory,
    goToProducts
};

// ================================
// LG-010: FUNCIONALIDADES DEL NAVBAR
// ================================

// Inicializar navbar
function initNavbar() {
    const mobileToggle = document.getElementById('mobileToggle');
    const navLinks = document.getElementById('navLinks');
    const userToggle = document.getElementById('userToggle');
    const userDropdown = document.getElementById('userDropdown');
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const cartLink = document.getElementById('cartLink');
    const logoutBtn = document.getElementById('logoutBtn');
    const header = document.querySelector('.header');

    // Toggle menú móvil con accesibilidad mejorada
    if (mobileToggle && navLinks) {
        mobileToggle.addEventListener('click', function() {
            const isActive = navLinks.classList.contains('active');
            
            navLinks.classList.toggle('active');
            mobileToggle.classList.toggle('active');
            
            // Actualizar atributos ARIA
            mobileToggle.setAttribute('aria-expanded', !isActive);
            navLinks.setAttribute('aria-hidden', isActive);
            
            // Gestionar foco y navegación por teclado
            if (!isActive) {
                // Menú abierto - foco en primer enlace
                const firstLink = navLinks.querySelector('a');
                if (firstLink) firstLink.focus();
                
                // Trap focus en el menú móvil
                trapFocusInMobileMenu();
            } else {
                // Menú cerrado - devolver foco al toggle
                mobileToggle.focus();
            }
            
            // Animar hamburger
            animateHamburger(!isActive);
        });

        // Cerrar menú móvil con Escape
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && navLinks.classList.contains('active')) {
                closeMobileMenu();
            }
        });

        // Cerrar menú móvil al hacer clic fuera
        document.addEventListener('click', function(e) {
            if (!mobileToggle.contains(e.target) && !navLinks.contains(e.target)) {
                closeMobileMenu();
            }
        });
    }

    // Toggle menú de usuario con accesibilidad mejorada
    if (userToggle && userDropdown) {
        userToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            const isOpen = userDropdown.classList.contains('active');
            
            userDropdown.classList.toggle('active');
            userToggle.setAttribute('aria-expanded', !isOpen);
            userDropdown.setAttribute('aria-hidden', isOpen);
            
            // Gestionar foco
            if (!isOpen) {
                const firstItem = userDropdown.querySelector('a[role="menuitem"]');
                if (firstItem) {
                    firstItem.setAttribute('tabindex', '0');
                    firstItem.focus();
                }
            } else {
                userToggle.focus();
                resetUserDropdownTabindex();
            }
        });

        // Navegación por teclado en dropdown
        userDropdown.addEventListener('keydown', function(e) {
            handleDropdownKeyNavigation(e, userDropdown);
        });

        // Cerrar dropdown al hacer click fuera
        document.addEventListener('click', function(e) {
            if (!userToggle.contains(e.target) && !userDropdown.contains(e.target)) {
                closeUserDropdown();
            }
        });

        // Cerrar con Escape
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && userDropdown.classList.contains('active')) {
                closeUserDropdown();
            }
        });
    }

    // Funcionalidad de búsqueda mejorada
    if (searchInput && searchBtn) {
        // Búsqueda con Enter
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                performSearch(this.value.trim());
            }
        });

        // Búsqueda con botón
        searchBtn.addEventListener('click', function() {
            performSearch(searchInput.value.trim());
        });

        // Auto-sugerencias (implementación básica)
        let searchTimeout;
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                showSearchSuggestions(this.value.trim());
            }, 300);
        });
    }

    // Actualizar contador del carrito
    updateCartCounter();

    // Header scroll behavior
    if (header) {
        let lastScrollY = window.scrollY;
        
        window.addEventListener('scroll', function() {
            const currentScrollY = window.scrollY;
            
            // Agregar clase scrolled cuando se hace scroll
            if (currentScrollY > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            
            // Auto-hide en mobile cuando se hace scroll hacia abajo
            if (window.innerWidth <= 768) {
                if (currentScrollY > lastScrollY && currentScrollY > 200) {
                    header.classList.add('hidden');
                } else {
                    header.classList.remove('hidden');
                }
            }
            
            lastScrollY = currentScrollY;
        });
    }

    // Logout functionality
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            handleLogout();
        });
    }

    // Inicializar estado del usuario
    updateUserNavbar();
}

// Funciones auxiliares para el navbar
function animateHamburger(isActive) {
    const lines = document.querySelectorAll('.hamburger-line');
    lines.forEach((line, index) => {
        if (isActive) {
            if (index === 0) line.style.transform = 'rotate(45deg) translate(5px, 5px)';
            if (index === 1) line.style.opacity = '0';
            if (index === 2) line.style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
            line.style.transform = '';
            line.style.opacity = '';
        }
    });
}

function trapFocusInMobileMenu() {
    const navLinks = document.getElementById('navLinks');
    const focusableElements = navLinks.querySelectorAll('a[href]');
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    navLinks.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                }
            } else {
                if (document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        }
    });
}

function closeMobileMenu() {
    const mobileToggle = document.getElementById('mobileToggle');
    const navLinks = document.getElementById('navLinks');
    
    if (navLinks && navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        mobileToggle.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
        navLinks.setAttribute('aria-hidden', 'true');
        animateHamburger(false);
        mobileToggle.focus();
    }
}

function closeUserDropdown() {
    const userToggle = document.getElementById('userToggle');
    const userDropdown = document.getElementById('userDropdown');
    
    if (userDropdown && userDropdown.classList.contains('active')) {
        userDropdown.classList.remove('active');
        userToggle.setAttribute('aria-expanded', 'false');
        userDropdown.setAttribute('aria-hidden', 'true');
        resetUserDropdownTabindex();
        userToggle.focus();
    }
}

function resetUserDropdownTabindex() {
    const items = document.querySelectorAll('.user-dropdown a[role="menuitem"]');
    items.forEach(item => item.setAttribute('tabindex', '-1'));
}

function handleDropdownKeyNavigation(e, dropdown) {
    const items = dropdown.querySelectorAll('a[role="menuitem"]:not([style*="display: none"])');
    const currentIndex = Array.from(items).indexOf(document.activeElement);
    
    switch (e.key) {
        case 'ArrowDown':
            e.preventDefault();
            const nextIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
            items[nextIndex].focus();
            break;
        case 'ArrowUp':
            e.preventDefault();
            const prevIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
            items[prevIndex].focus();
            break;
        case 'Home':
            e.preventDefault();
            items[0].focus();
            break;
        case 'End':
            e.preventDefault();
            items[items.length - 1].focus();
            break;
    }
}

function showSearchSuggestions(query) {
    // Implementación básica de sugerencias
    if (query.length < 2) return;
    
    // Aquí se podría implementar una búsqueda en tiempo real
    // Por ahora, solo log para desarrollo
    console.log('Buscando sugerencias para:', query);
}

// Función de búsqueda unificada
function performSearch(query) {
    if (!query) {
        showNotification('Por favor ingresa un término de búsqueda', 'warning');
        return;
    }

    console.log('Buscando:', query);
    
    // Si estamos en la página de productos, filtrar directamente
    if (window.location.pathname.includes('productos')) {
        if (typeof filterProducts === 'function') {
            filterProducts(query);
        }
    } else {
        // Redirigir a la página de productos con el término de búsqueda
        window.location.href = `productos/?search=${encodeURIComponent(query)}`;
    }
}

// Función unificada de logout
function handleLogout() {
    if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
        user = null;
        localStorage.removeItem('levelup_user');
        updateUserNavbar();
        showNotification('Sesión cerrada exitosamente', 'success');
        
        // Redirigir a la página principal si estamos en una página de usuario
        if (window.location.pathname.includes('usuario')) {
            window.location.href = '../index.html';
        }
    }
}

// Función unificada para actualizar contador del carrito
function updateCartCounter() {
    const cartCountElement = document.getElementById('cartCount');
    const cartLink = document.getElementById('cartLink');
    
    if (cartCountElement) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCountElement.textContent = totalItems;
        
        // Actualizar aria-label del carrito
        if (cartLink) {
            cartLink.setAttribute('aria-label', `Ver carrito de compras - ${totalItems} productos`);
        }
        
        // Agregar animación si hay items
        if (totalItems > 0) {
            cartCountElement.classList.add('pulse');
            setTimeout(() => cartCountElement.classList.remove('pulse'), 1000);
        }
    }
}

// Actualizar estado del usuario en el navbar
function updateUserNavbar() {
    const userToggle = document.getElementById('userToggle');
    const userText = userToggle?.querySelector('.user-text');
    const userLoggedInElements = document.querySelectorAll('.user-logged-in');
    const userGuestElements = document.querySelectorAll('.user-dropdown a:not(.user-logged-in)');

    if (user) {
        // Usuario logueado
        if (userText) {
            userText.textContent = user.username || user.email || 'Usuario';
        }
        
        userLoggedInElements.forEach(el => el.style.display = 'block');
        userGuestElements.forEach(el => el.style.display = 'none');
    } else {
        // Usuario no logueado
        if (userText) {
            userText.textContent = 'Usuario';
        }
        
        userLoggedInElements.forEach(el => el.style.display = 'none');
        userGuestElements.forEach(el => el.style.display = 'block');
    }
}

// Hacer navbar sticky en scroll
function initStickyNavbar() {
    const header = document.querySelector('.header');
    if (!header) return;

    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Ocultar/mostrar navbar en scroll
        if (currentScrollY > lastScrollY && currentScrollY > 200) {
            header.classList.add('hidden');
        } else {
            header.classList.remove('hidden');
        }
        
        lastScrollY = currentScrollY;
    });
}

// Inicializar todas las funcionalidades cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    initNavbar();
    initStickyNavbar();
    updateCartCounter();
    initHero();
});

// ================================
// LG-011: FUNCIONALIDADES DEL HERO
// ================================

// Inicializar funcionalidades del hero
function initHero() {
    // Agregar event listeners para el scroll indicator
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                scrollToFeatured();
            }
        });
    }
    
    // Inicializar animaciones de entrada si AOS está disponible
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            once: true,
            offset: 100
        });
    }
}

// Función principal para scroll suave a productos destacados
function scrollToFeatured() {
    const featuredSection = document.getElementById('featured');
    const exploreCatalogBtn = document.getElementById('exploreCatalogBtn');
    
    if (!featuredSection) {
        console.error('Sección de productos destacados no encontrada');
        showNotification('Error: No se pudo encontrar la sección de productos', 'error');
        return;
    }
    
    // Agregar efecto visual al botón
    if (exploreCatalogBtn) {
        exploreCatalogBtn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            exploreCatalogBtn.style.transform = '';
        }, 150);
    }
    
    // Calcular posición considerando el navbar fijo
    const navbar = document.querySelector('.header');
    const navbarHeight = navbar ? navbar.offsetHeight : 80;
    const targetPosition = featuredSection.offsetTop - navbarHeight - 20;
    
    // Scroll suave con animación personalizada
    smoothScrollTo(targetPosition, 1000);
    
    // Feedback visual en la sección de destino
    setTimeout(() => {
        highlightFeaturedSection();
    }, 1000);
    
    // Analytics/tracking (opcional)
    trackCTAClick('explore_catalog', 'hero_section');
}

// Función de scroll suave personalizada
function smoothScrollTo(targetPosition, duration) {
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;
    
    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        
        // Easing function (ease-in-out)
        const easeInOutCubic = progress < 0.5 
            ? 4 * progress * progress * progress 
            : 1 - Math.pow(-2 * progress + 2, 3) / 2;
        
        window.scrollTo(0, startPosition + distance * easeInOutCubic);
        
        if (timeElapsed < duration) {
            requestAnimationFrame(animation);
        }
    }
    
    requestAnimationFrame(animation);
}

// Destacar visualmente la sección de productos cuando se llega
function highlightFeaturedSection() {
    const featuredSection = document.getElementById('featured');
    const sectionTitle = featuredSection?.querySelector('.section-title');
    
    if (sectionTitle) {
        // Agregar clase de animación
        sectionTitle.classList.add('highlight-animation');
        
        // Remover la clase después de la animación
        setTimeout(() => {
            sectionTitle.classList.remove('highlight-animation');
        }, 2000);
    }
    
    // Mostrar notificación de llegada
    showNotification('¡Explora nuestros productos destacados! 🎮', 'success');
}

// Función de tracking para analytics (implementación básica)
function trackCTAClick(action, section) {
    // Aquí se podría integrar con Google Analytics, Adobe Analytics, etc.
    console.log('CTA Click Tracked:', {
        action: action,
        section: section,
        timestamp: new Date().toISOString(),
        page: window.location.pathname
    });
    
    // Ejemplo de integración con Google Analytics
    if (typeof gtag !== 'undefined') {
        gtag('event', action, {
            'event_category': 'CTA',
            'event_label': section,
            'value': 1
        });
    }
}

// Función auxiliar para mostrar el scroll indicator solo cuando sea relevante
function initScrollIndicator() {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    const featuredSection = document.getElementById('featured');
    
    if (!scrollIndicator || !featuredSection) return;
    
    function updateScrollIndicatorVisibility() {
        const scrollPosition = window.pageYOffset;
        const featuredPosition = featuredSection.offsetTop;
        const windowHeight = window.innerHeight;
        
        // Ocultar el indicador si ya estamos cerca de la sección featured
        if (scrollPosition + windowHeight > featuredPosition - 200) {
            scrollIndicator.style.opacity = '0';
            scrollIndicator.style.pointerEvents = 'none';
        } else {
            scrollIndicator.style.opacity = '1';
            scrollIndicator.style.pointerEvents = 'auto';
        }
    }
    
    // Verificar visibilidad en scroll
    window.addEventListener('scroll', updateScrollIndicatorVisibility);
    
    // Verificar inicialmente
    updateScrollIndicatorVisibility();
}

// ================================================
// LG-012: CATEGORÍAS DESTACADAS - INTERACCIONES
// ================================================

/**
 * Inicializa las funcionalidades de las categorías destacadas
 */
function initCategoriesTiles() {
    const categoryTiles = document.querySelectorAll('.category-tile');
    
    if (!categoryTiles.length) return;
    
    categoryTiles.forEach(tile => {
        // Click handler para navegación
        tile.addEventListener('click', handleCategoryClick);
        
        // Soporte para teclado
        tile.addEventListener('keydown', handleCategoryKeydown);
        
        // Efectos de hover mejorados
        tile.addEventListener('mouseenter', handleCategoryHover);
        tile.addEventListener('mouseleave', handleCategoryLeave);
    });
}

/**
 * Maneja el click en una categoría
 * @param {Event} event - Evento de click
 */
function handleCategoryClick(event) {
    const tile = event.currentTarget;
    const category = tile.dataset.category;
    
    // Efecto visual de click
    tile.style.transform = 'translateY(-4px) scale(1.01)';
    
    setTimeout(() => {
        tile.style.transform = '';
    }, 150);
    
    // Navegación a productos de la categoría
    if (category) {
        // Analytics tracking
        trackCategoryClick(category);
        
        // Navegación (puedes personalizar según tu estructura)
        window.location.href = `productos/?categoria=${category}`;
    }
}

/**
 * Maneja la navegación por teclado
 * @param {KeyboardEvent} event - Evento de teclado
 */
function handleCategoryKeydown(event) {
    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        event.currentTarget.click();
    }
}

/**
 * Efectos de hover para categorías
 * @param {Event} event - Evento de mouse enter
 */
function handleCategoryHover(event) {
    const tile = event.currentTarget;
    const glow = tile.querySelector('.category-glow');
    
    // Animación del glow
    if (glow) {
        glow.style.transition = 'all 0.3s ease';
    }
    
    // Sonido hover (opcional - descomenta si tienes audio)
    // playHoverSound();
}

/**
 * Limpia efectos de hover
 * @param {Event} event - Evento de mouse leave
 */
function handleCategoryLeave(event) {
    const tile = event.currentTarget;
    // Los efectos de CSS se encargan del resto
}

/**
 * Tracking de analytics para categorías
 * @param {string} category - Nombre de la categoría
 */
function trackCategoryClick(category) {
    // Google Analytics / tracking personalizado
    if (typeof gtag !== 'undefined') {
        gtag('event', 'category_click', {
            'category_name': category,
            'location': 'categories_tiles'
        });
    }
    
    // Tracking local para estadísticas
    const categoryStats = JSON.parse(localStorage.getItem('categoryStats') || '{}');
    categoryStats[category] = (categoryStats[category] || 0) + 1;
    localStorage.setItem('categoryStats', JSON.stringify(categoryStats));
}

/**
 * Animación de entrada para las categorías
 */
function animateCategoriesEntrance() {
    const categoryTiles = document.querySelectorAll('.category-tile');
    
    categoryTiles.forEach((tile, index) => {
        // Animación escalonada
        setTimeout(() => {
            tile.style.opacity = '1';
            tile.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// Inicialización cuando el DOM está listo
document.addEventListener('DOMContentLoaded', () => {
    initCategoriesTiles();
    initPromoCarousel();
    initQuickAccessPanel();
    initQuickSearch();
    
    // Animar entrada de categorías con delay
    setTimeout(animateCategoriesEntrance, 500);
});

// ================================================
// LG-013: CARRUSEL DE PROMOCIONES GAMER
// ================================================

/**
 * Inicializa el carrusel de promociones con controles accesibles
 */
function initPromoCarousel() {
    const carousel = document.querySelector('.promo-carousel');
    const slides = document.querySelectorAll('.promo-slide');
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    const indicators = document.querySelectorAll('.carousel-indicator');
    const statusElement = document.getElementById('carousel-status');
    
    if (!carousel || !slides.length) return;
    
    let currentSlide = 0;
    let autoPlayInterval;
    let isUserInteracting = false;
    
    // Configuración del carrusel
    const config = {
        autoPlayDelay: 5000,
        animationDuration: 600,
        pauseOnHover: true,
        pauseOnFocus: true
    };
    
    // Datos de los slides para accesibilidad
    const slideData = [
        { title: 'Bundle PS5 Ultimate', description: 'PlayStation 5 con accesorios' },
        { title: 'PC Gamer RTX 4070', description: 'Computador gaming de alta gama' },
        { title: 'Setup Gaming Pro', description: 'Kit completo de accesorios' },
        { title: 'Juegos Triple-A', description: 'Títulos más vendidos con descuento' }
    ];
    
    /**
     * Cambia al slide especificado
     * @param {number} index - Índice del slide
     * @param {string} source - Origen del cambio (auto, manual, keyboard)
     */
    function goToSlide(index, source = 'manual') {
        if (index === currentSlide) return;
        
        // Validar índice
        if (index < 0) index = slides.length - 1;
        if (index >= slides.length) index = 0;
        
        // Actualizar slides
        slides[currentSlide].classList.remove('active');
        slides[index].classList.add('active');
        
        // Actualizar indicadores
        indicators[currentSlide].classList.remove('active');
        indicators[currentSlide].setAttribute('aria-selected', 'false');
        indicators[index].classList.add('active');
        indicators[index].setAttribute('aria-selected', 'true');
        
        // Actualizar estado para lectores de pantalla
        const slideInfo = slideData[index];
        if (statusElement) {
            statusElement.textContent = `Mostrando promoción ${index + 1} de ${slides.length}: ${slideInfo.title}`;
        }
        
        // Actualizar aria-live del carrusel
        carousel.setAttribute('aria-label', `Promoción ${index + 1} de ${slides.length}: ${slideInfo.description}`);
        
        currentSlide = index;
        
        // Tracking de analytics
        trackCarouselSlide(index, source);
        
        // Resetear auto-play si es interacción manual
        if (source === 'manual' || source === 'keyboard') {
            isUserInteracting = true;
            clearAutoPlay();
            setTimeout(() => {
                isUserInteracting = false;
                startAutoPlay();
            }, 10000); // Pausa 10s después de interacción manual
        }
    }
    
    /**
     * Ir al slide anterior
     */
    function prevSlide() {
        goToSlide(currentSlide - 1, 'manual');
    }
    
    /**
     * Ir al slide siguiente
     */
    function nextSlide() {
        goToSlide(currentSlide + 1, 'manual');
    }
    
    /**
     * Inicia el auto-play
     */
    function startAutoPlay() {
        if (!config.autoPlayDelay || isUserInteracting) return;
        
        clearAutoPlay();
        autoPlayInterval = setInterval(() => {
            goToSlide(currentSlide + 1, 'auto');
        }, config.autoPlayDelay);
    }
    
    /**
     * Detiene el auto-play
     */
    function clearAutoPlay() {
        if (autoPlayInterval) {
            clearInterval(autoPlayInterval);
            autoPlayInterval = null;
        }
    }
    
    /**
     * Maneja la navegación por teclado
     * @param {KeyboardEvent} event
     */
    function handleKeyboardNavigation(event) {
        switch (event.key) {
            case 'ArrowLeft':
                event.preventDefault();
                prevSlide();
                break;
            case 'ArrowRight':
                event.preventDefault();
                nextSlide();
                break;
            case 'Home':
                event.preventDefault();
                goToSlide(0, 'keyboard');
                break;
            case 'End':
                event.preventDefault();
                goToSlide(slides.length - 1, 'keyboard');
                break;
        }
    }
    
    /**
     * Tracking de analytics para carrusel
     * @param {number} index - Índice del slide
     * @param {string} source - Origen del cambio
     */
    function trackCarouselSlide(index, source) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'carousel_slide_view', {
                'slide_index': index,
                'slide_title': slideData[index].title,
                'interaction_source': source,
                'carousel_section': 'promo_carousel'
            });
        }
        
        // Tracking local
        const carouselStats = JSON.parse(localStorage.getItem('carouselStats') || '{}');
        const slideKey = `slide_${index}`;
        carouselStats[slideKey] = (carouselStats[slideKey] || 0) + 1;
        carouselStats.lastViewed = Date.now();
        localStorage.setItem('carouselStats', JSON.stringify(carouselStats));
    }
    
    // Event Listeners
    
    // Botones de navegación
    if (prevBtn) {
        prevBtn.addEventListener('click', prevSlide);
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', nextSlide);
    }
    
    // Indicadores
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            goToSlide(index, 'manual');
        });
        
        // Navegación por teclado en indicadores
        indicator.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                goToSlide(index, 'keyboard');
            }
        });
    });
    
    // Navegación por teclado en el carrusel
    carousel.addEventListener('keydown', handleKeyboardNavigation);
    
    // Pausar auto-play en hover/focus
    if (config.pauseOnHover) {
        carousel.addEventListener('mouseenter', clearAutoPlay);
        carousel.addEventListener('mouseleave', () => {
            if (!isUserInteracting) startAutoPlay();
        });
    }
    
    if (config.pauseOnFocus) {
        carousel.addEventListener('focusin', clearAutoPlay);
        carousel.addEventListener('focusout', () => {
            if (!isUserInteracting) {
                setTimeout(() => startAutoPlay(), 1000);
            }
        });
    }
    
    // CTAs de los slides
    const promoCTAs = document.querySelectorAll('.promo-cta');
    promoCTAs.forEach((cta, index) => {
        cta.addEventListener('click', () => {
            // Tracking de CTA click
            if (typeof gtag !== 'undefined') {
                gtag('event', 'promo_cta_click', {
                    'slide_index': index,
                    'slide_title': slideData[index].title,
                    'cta_location': 'carousel_slide'
                });
            }
            
            // Aquí puedes agregar la lógica de navegación específica
            // Por ejemplo: window.location.href = getPromoURL(index);
        });
    });
    
    // Swipe/Touch para móvil
    let touchStartX = 0;
    let touchEndX = 0;
    
    carousel.addEventListener('touchstart', (event) => {
        touchStartX = event.changedTouches[0].screenX;
    });
    
    carousel.addEventListener('touchend', (event) => {
        touchEndX = event.changedTouches[0].screenX;
        handleSwipe();
    });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                nextSlide(); // Swipe left = next
            } else {
                prevSlide(); // Swipe right = prev
            }
        }
    }
    
    // Inicialización
    goToSlide(0, 'auto');
    
    // Iniciar auto-play después de un delay
    setTimeout(() => {
        startAutoPlay();
    }, 2000);
    
    // Pausar cuando la página no está visible
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            clearAutoPlay();
        } else if (!isUserInteracting) {
            setTimeout(() => startAutoPlay(), 1000);
        }
    });
}

// ================================================
// LG-014: PANEL DE ACCESO RÁPIDO FLOTANTE
// ================================================

/**
 * Inicializa el panel de acceso rápido
 */
function initQuickAccessPanel() {
    const panel = document.getElementById('quickAccessPanel');
    const toggle = document.getElementById('quickAccessToggle');
    const menu = document.getElementById('quickAccessMenu');
    const overlay = document.getElementById('quickAccessOverlay');
    const items = document.querySelectorAll('.quick-access-item');
    
    if (!panel || !toggle || !menu) return;
    
    let isOpen = false;
    let hideTimeout;
    
    /**
     * Abre el panel de acceso rápido
     */
    function openPanel() {
        isOpen = true;
        toggle.setAttribute('aria-expanded', 'true');
        toggle.setAttribute('aria-label', 'Cerrar panel de acceso rápido');
        menu.setAttribute('aria-hidden', 'false');
        overlay.setAttribute('aria-hidden', 'false');
        
        // Foco en el primer item
        const firstItem = menu.querySelector('.quick-access-item:not(.quick-access-secondary)');
        if (firstItem) {
            setTimeout(() => firstItem.focus(), 100);
        }
        
        // Actualizar tabindex
        items.forEach(item => item.setAttribute('tabindex', '0'));
        
        // Tracking
        trackQuickAccessAction('panel_opened');
        
        // Auto-close después de 10s sin interacción
        resetAutoClose();
    }
    
    /**
     * Cierra el panel de acceso rápido
     */
    function closePanel() {
        isOpen = false;
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Abrir panel de acceso rápido');
        menu.setAttribute('aria-hidden', 'true');
        overlay.setAttribute('aria-hidden', 'true');
        
        // Restaurar tabindex
        items.forEach(item => item.setAttribute('tabindex', '-1'));
        
        // Limpiar timeout
        clearTimeout(hideTimeout);
        
        // Foco de vuelta al toggle
        toggle.focus();
        
        // Tracking
        trackQuickAccessAction('panel_closed');
    }
    
    /**
     * Toggle del panel
     */
    function togglePanel() {
        if (isOpen) {
            closePanel();
        } else {
            openPanel();
        }
    }
    
    /**
     * Resetea el auto-close timer
     */
    function resetAutoClose() {
        clearTimeout(hideTimeout);
        hideTimeout = setTimeout(() => {
            if (isOpen) closePanel();
        }, 10000);
    }
    
    /**
     * Maneja las acciones de los items del menú
     * @param {string} action - Acción a ejecutar
     */
    function handleQuickAction(action) {
        // Tracking de la acción
        trackQuickAccessAction('item_clicked', action);
        
        // Cerrar panel después de acción
        setTimeout(() => closePanel(), 150);
        
        switch (action) {
            case 'cart':
                openCart();
                break;
            case 'profile':
                navigateToProfile();
                break;
            case 'categories':
                scrollToCategories();
                break;
            case 'offers':
                scrollToOffers();
                break;
            case 'support':
                openSupport();
                break;
            case 'favorites':
                showFavorites();
                break;
            default:
                console.warn('Acción no reconocida:', action);
        }
    }
    
    /**
     * Funciones de navegación específicas
     */
    function openCart() {
        const cartButton = document.querySelector('.cart-button');
        if (cartButton) {
            cartButton.click();
        } else {
            window.location.href = 'carrito/';
        }
    }
    
    function navigateToProfile() {
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        if (isLoggedIn) {
            window.location.href = 'usuario/';
        } else {
            window.location.href = 'usuario/login.html';
        }
    }
    
    function scrollToCategories() {
        const categoriesSection = document.getElementById('categories');
        if (categoriesSection) {
            const navbar = document.querySelector('.header');
            const navbarHeight = navbar ? navbar.offsetHeight : 80;
            const targetPosition = categoriesSection.offsetTop - navbarHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }
    
    function scrollToOffers() {
        const offersSection = document.getElementById('promociones');
        if (offersSection) {
            const navbar = document.querySelector('.header');
            const navbarHeight = navbar ? navbar.offsetHeight : 80;
            const targetPosition = offersSection.offsetTop - navbarHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        } else {
            // Si no hay sección de ofertas, ir a productos con filtro
            window.location.href = 'productos/?filter=ofertas';
        }
    }
    
    function openSupport() {
        window.location.href = 'soporte/';
    }
    
    function showFavorites() {
        // Mostrar modal de favoritos o navegar a página
        const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        if (favorites.length > 0) {
            window.location.href = 'productos/?filter=favoritos';
        } else {
            alert('No tienes productos favoritos aún. ¡Explora nuestro catálogo!');
        }
    }
    
    /**
     * Actualiza los contadores del panel
     */
    function updatePanelCounters() {
        // Actualizar badge del carrito
        const cartBadge = document.getElementById('cartBadge');
        const cartCount = getCartItemCount();
        if (cartBadge) {
            cartBadge.textContent = cartCount;
            cartBadge.setAttribute('data-count', cartCount);
        }
        
        // Actualizar contador de favoritos
        const favoritesCount = document.getElementById('favoritesCount');
        const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        if (favoritesCount) {
            favoritesCount.textContent = favorites.length;
            favoritesCount.setAttribute('data-count', favorites.length);
        }
        
        // Marcar items activos según el contexto
        updateActiveStates();
    }
    
    /**
     * Actualiza estados activos de los items
     */
    function updateActiveStates() {
        const currentPage = window.location.pathname;
        
        items.forEach(item => {
            const action = item.dataset.action;
            let isActive = false;
            
            switch (action) {
                case 'cart':
                    isActive = currentPage.includes('carrito');
                    break;
                case 'profile':
                    isActive = currentPage.includes('usuario');
                    break;
                case 'categories':
                    // Activo si estamos en la sección de categorías
                    isActive = window.location.hash === '#categories';
                    break;
                case 'offers':
                    isActive = currentPage.includes('ofertas') || window.location.hash === '#promociones';
                    break;
                case 'support':
                    isActive = currentPage.includes('soporte');
                    break;
            }
            
            item.setAttribute('data-active', isActive);
        });
    }
    
    /**
     * Obtiene el número de items en el carrito
     */
    function getCartItemCount() {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        return cart.reduce((total, item) => total + (item.quantity || 1), 0);
    }
    
    /**
     * Tracking de analytics para el panel
     */
    function trackQuickAccessAction(action, detail = null) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'quick_access_interaction', {
                'action': action,
                'detail': detail,
                'location': 'quick_access_panel'
            });
        }
        
        // Tracking local
        const quickStats = JSON.parse(localStorage.getItem('quickAccessStats') || '{}');
        const key = detail ? `${action}_${detail}` : action;
        quickStats[key] = (quickStats[key] || 0) + 1;
        quickStats.lastUsed = Date.now();
        localStorage.setItem('quickAccessStats', JSON.stringify(quickStats));
    }
    
    /**
     * Manejo de teclado
     */
    function handleKeyboard(event) {
        if (!isOpen) return;
        
        switch (event.key) {
            case 'Escape':
                event.preventDefault();
                closePanel();
                break;
            case 'Tab':
                // Mantener foco dentro del panel
                if (event.shiftKey) {
                    // Tab hacia atrás
                    if (document.activeElement === items[0]) {
                        event.preventDefault();
                        toggle.focus();
                    }
                } else {
                    // Tab hacia adelante
                    if (document.activeElement === toggle) {
                        event.preventDefault();
                        items[0].focus();
                    }
                }
                break;
            case 'ArrowDown':
                event.preventDefault();
                focusNextItem();
                break;
            case 'ArrowUp':
                event.preventDefault();
                focusPrevItem();
                break;
        }
    }
    
    function focusNextItem() {
        const current = document.activeElement;
        const currentIndex = Array.from(items).indexOf(current);
        const nextIndex = (currentIndex + 1) % items.length;
        items[nextIndex].focus();
    }
    
    function focusPrevItem() {
        const current = document.activeElement;
        const currentIndex = Array.from(items).indexOf(current);
        const prevIndex = (currentIndex - 1 + items.length) % items.length;
        items[prevIndex].focus();
    }
    
    // Event Listeners
    
    // Toggle del panel
    toggle.addEventListener('click', togglePanel);
    
    // Items del menú
    items.forEach(item => {
        item.addEventListener('click', () => {
            const action = item.dataset.action;
            handleQuickAction(action);
        });
        
        // Enter/Space en items
        item.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                const action = item.dataset.action;
                handleQuickAction(action);
            }
        });
    });
    
    // Overlay para cerrar
    if (overlay) {
        overlay.addEventListener('click', closePanel);
    }
    
    // Teclado global
    document.addEventListener('keydown', handleKeyboard);
    
    // Cerrar al hacer click fuera
    document.addEventListener('click', (event) => {
        if (isOpen && !panel.contains(event.target)) {
            closePanel();
        }
    });
    
    // Resetear auto-close en interacción
    panel.addEventListener('mouseenter', () => {
        if (isOpen) resetAutoClose();
    });
    
    panel.addEventListener('mouseleave', () => {
        if (isOpen) resetAutoClose();
    });
    
    // Actualizar contadores periódicamente
    updatePanelCounters();
    setInterval(updatePanelCounters, 2000);
    
    // Actualizar estados en cambios de hash
    window.addEventListener('hashchange', updateActiveStates);
    
    // Inicialización
    updateActiveStates();
}

// ================================================
// LG-015: BUSCADOR RÁPIDO CON SUGERENCIAS DINÁMICAS
// ================================================

/**
 * Inicializa el buscador rápido con sugerencias
 */
function initQuickSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const searchClear = document.getElementById('searchClear');
    const searchLoading = document.getElementById('searchLoading');
    const searchSuggestions = document.getElementById('searchSuggestions');
    
    if (!searchInput || !searchSuggestions) return;
    
    let searchTimeout;
    let currentQuery = '';
    let selectedIndex = -1;
    let suggestionItems = [];
    let isOpen = false;
    
    // Datos de muestra para sugerencias (en una app real vendría de una API)
    const sampleProducts = [
        { id: 1, name: 'PlayStation 5 Console', category: 'Consolas', price: '$699.990', image: 'ps5.jpg' },
        { id: 2, name: 'Xbox Series X', category: 'Consolas', price: '$599.990', image: 'xbox.jpg' },
        { id: 3, name: 'Nintendo Switch OLED', category: 'Consolas', price: '$399.990', image: 'switch.jpg' },
        { id: 4, name: 'RTX 4090 Graphics Card', category: 'PC Gaming', price: '$1.999.990', image: 'rtx4090.jpg' },
        { id: 5, name: 'Gaming Mechanical Keyboard', category: 'Accesorios', price: '$149.990', image: 'keyboard.jpg' },
        { id: 6, name: 'Gaming Mouse RGB', category: 'Accesorios', price: '$89.990', image: 'mouse.jpg' },
        { id: 7, name: 'Gaming Headset 7.1', category: 'Accesorios', price: '$199.990', image: 'headset.jpg' },
        { id: 8, name: 'Call of Duty MW3', category: 'Videojuegos', price: '$69.990', image: 'cod.jpg' },
        { id: 9, name: 'FIFA 24', category: 'Videojuegos', price: '$59.990', image: 'fifa.jpg' },
        { id: 10, name: 'Cyberpunk 2077', category: 'Videojuegos', price: '$39.990', image: 'cyberpunk.jpg' }
    ];
    
    const categories = [
        { name: 'Consolas', count: 15, slug: 'consolas' },
        { name: 'PC Gaming', count: 25, slug: 'pc-gaming' },
        { name: 'Accesorios', count: 30, slug: 'accesorios' },
        { name: 'Videojuegos', count: 50, slug: 'videojuegos' }
    ];
    
    const popularSearches = [
        'PlayStation 5', 'RTX 4090', 'Gaming Setup', 'Cyberpunk 2077',
        'Xbox Series X', 'Nintendo Switch', 'Mechanical Keyboard', 'Gaming Chair'
    ];
    
    /**
     * Realiza búsqueda y muestra sugerencias
     * @param {string} query - Término de búsqueda
     */
    function performSearch(query) {
        if (query.length < 3) {
            hideSuggestions();
            return;
        }
        
        // Mostrar loading
        showLoading(true);
        currentQuery = query;
        
        // Simular delay de API
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            const results = getSearchResults(query);
            displaySuggestions(results, query);
            showLoading(false);
        }, 300);
    }
    
    /**
     * Obtiene resultados de búsqueda
     * @param {string} query - Término de búsqueda
     * @returns {Object} Resultados organizados
     */
    function getSearchResults(query) {
        const queryLower = query.toLowerCase();
        
        // Filtrar productos
        const products = sampleProducts.filter(product =>
            product.name.toLowerCase().includes(queryLower) ||
            product.category.toLowerCase().includes(queryLower)
        ).slice(0, 5);
        
        // Filtrar categorías
        const matchedCategories = categories.filter(category =>
            category.name.toLowerCase().includes(queryLower)
        );
        
        // Filtrar búsquedas populares
        const popular = popularSearches.filter(search =>
            search.toLowerCase().includes(queryLower)
        ).slice(0, 3);
        
        return {
            products,
            categories: matchedCategories,
            popular,
            total: products.length + matchedCategories.length + popular.length
        };
    }
    
    /**
     * Muestra las sugerencias en el panel
     * @param {Object} results - Resultados de búsqueda
     * @param {string} query - Término de búsqueda
     */
    function displaySuggestions(results, query) {
        const productSection = document.getElementById('productSuggestions');
        const categorySection = document.getElementById('categorySuggestions');
        const popularSection = document.getElementById('popularSuggestions');
        const noResults = document.getElementById('noResults');
        const viewAllBtn = document.getElementById('searchViewAll');
        
        // Limpiar contenido anterior
        productSection.querySelector('.suggestions-list').innerHTML = '';
        categorySection.querySelector('.suggestions-list').innerHTML = '';
        popularSection.querySelector('.suggestions-list').innerHTML = '';
        
        let hasResults = false;
        
        // Mostrar productos
        if (results.products.length > 0) {
            hasResults = true;
            productSection.style.display = 'block';
            results.products.forEach(product => {
                const item = createProductSuggestion(product, query);
                productSection.querySelector('.suggestions-list').appendChild(item);
            });
        } else {
            productSection.style.display = 'none';
        }
        
        // Mostrar categorías
        if (results.categories.length > 0) {
            hasResults = true;
            categorySection.style.display = 'block';
            results.categories.forEach(category => {
                const item = createCategorySuggestion(category, query);
                categorySection.querySelector('.suggestions-list').appendChild(item);
            });
        } else {
            categorySection.style.display = 'none';
        }
        
        // Mostrar búsquedas populares
        if (results.popular.length > 0) {
            hasResults = true;
            popularSection.style.display = 'block';
            results.popular.forEach(search => {
                const item = createPopularSuggestion(search, query);
                popularSection.querySelector('.suggestions-list').appendChild(item);
            });
        } else {
            popularSection.style.display = 'none';
        }
        
        // Mostrar/ocultar estados
        if (hasResults) {
            noResults.style.display = 'none';
            viewAllBtn.querySelector('span').textContent = `Ver todos los resultados (${results.total})`;
        } else {
            noResults.style.display = 'block';
        }
        
        // Actualizar lista de items para navegación
        suggestionItems = searchSuggestions.querySelectorAll('.suggestion-item');
        selectedIndex = -1;
        
        // Mostrar panel
        showSuggestions();
        
        // Tracking
        trackSearchQuery(query, results.total);
    }
    
    /**
     * Crea elemento de sugerencia de producto
     * @param {Object} product - Datos del producto
     * @param {string} query - Término de búsqueda
     * @returns {HTMLElement} Elemento DOM
     */
    function createProductSuggestion(product, query) {
        const item = document.createElement('button');
        item.className = 'suggestion-item';
        item.setAttribute('role', 'option');
        item.setAttribute('data-type', 'product');
        item.setAttribute('data-id', product.id);
        
        const highlightedName = highlightMatch(product.name, query);
        
        item.innerHTML = `
            <div class="suggestion-icon">
                <i class="fas fa-box"></i>
            </div>
            <div class="suggestion-content">
                <div class="suggestion-title">${highlightedName}</div>
                <div class="suggestion-meta">
                    <span>${product.category}</span>
                    <span class="suggestion-price">${product.price}</span>
                </div>
            </div>
        `;
        
        item.addEventListener('click', () => selectSuggestion('product', product));
        
        return item;
    }
    
    /**
     * Crea elemento de sugerencia de categoría
     * @param {Object} category - Datos de la categoría
     * @param {string} query - Término de búsqueda
     * @returns {HTMLElement} Elemento DOM
     */
    function createCategorySuggestion(category, query) {
        const item = document.createElement('button');
        item.className = 'suggestion-item';
        item.setAttribute('role', 'option');
        item.setAttribute('data-type', 'category');
        item.setAttribute('data-slug', category.slug);
        
        const highlightedName = highlightMatch(category.name, query);
        
        item.innerHTML = `
            <div class="suggestion-icon">
                <i class="fas fa-th-large"></i>
            </div>
            <div class="suggestion-content">
                <div class="suggestion-title">${highlightedName}</div>
                <div class="suggestion-meta">
                    <span>${category.count} productos</span>
                </div>
            </div>
        `;
        
        item.addEventListener('click', () => selectSuggestion('category', category));
        
        return item;
    }
    
    /**
     * Crea elemento de sugerencia popular
     * @param {string} search - Término popular
     * @param {string} query - Término de búsqueda
     * @returns {HTMLElement} Elemento DOM
     */
    function createPopularSuggestion(search, query) {
        const item = document.createElement('button');
        item.className = 'suggestion-item';
        item.setAttribute('role', 'option');
        item.setAttribute('data-type', 'popular');
        item.setAttribute('data-search', search);
        
        const highlightedSearch = highlightMatch(search, query);
        
        item.innerHTML = `
            <div class="suggestion-icon">
                <i class="fas fa-fire"></i>
            </div>
            <div class="suggestion-content">
                <div class="suggestion-title">${highlightedSearch}</div>
                <div class="suggestion-meta">
                    <span>Búsqueda popular</span>
                </div>
            </div>
        `;
        
        item.addEventListener('click', () => selectSuggestion('popular', { search }));
        
        return item;
    }
    
    /**
     * Resalta coincidencias en el texto
     * @param {string} text - Texto original
     * @param {string} query - Término a resaltar
     * @returns {string} Texto con marcado HTML
     */
    function highlightMatch(text, query) {
        const regex = new RegExp(`(${escapeRegex(query)})`, 'gi');
        return text.replace(regex, '<span class="suggestion-highlight">$1</span>');
    }
    
    /**
     * Escapa caracteres especiales para regex
     * @param {string} string - Cadena a escapar
     * @returns {string} Cadena escapada
     */
    function escapeRegex(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
    
    /**
     * Maneja la selección de una sugerencia
     * @param {string} type - Tipo de sugerencia
     * @param {Object} data - Datos del item
     */
    function selectSuggestion(type, data) {
        hideSuggestions();
        
        switch (type) {
            case 'product':
                searchInput.value = data.name;
                navigateToProduct(data.id);
                break;
            case 'category':
                searchInput.value = data.name;
                navigateToCategory(data.slug);
                break;
            case 'popular':
                searchInput.value = data.search;
                performFullSearch(data.search);
                break;
        }
        
        // Tracking
        trackSuggestionClick(type, data);
    }
    
    /**
     * Funciones de navegación
     */
    function navigateToProduct(productId) {
        window.location.href = `productos/detalle.html?id=${productId}`;
    }
    
    function navigateToCategory(categorySlug) {
        window.location.href = `productos/?categoria=${categorySlug}`;
    }
    
    function performFullSearch(query) {
        window.location.href = `productos/?buscar=${encodeURIComponent(query)}`;
    }
    
    /**
     * Muestra el panel de sugerencias
     */
    function showSuggestions() {
        isOpen = true;
        searchSuggestions.setAttribute('aria-hidden', 'false');
        searchInput.setAttribute('aria-expanded', 'true');
        searchInput.setAttribute('data-search-active', 'true');
    }
    
    /**
     * Oculta el panel de sugerencias
     */
    function hideSuggestions() {
        isOpen = false;
        searchSuggestions.setAttribute('aria-hidden', 'true');
        searchInput.setAttribute('aria-expanded', 'false');
        searchInput.setAttribute('data-search-active', 'false');
        selectedIndex = -1;
        updateSelection();
    }
    
    /**
     * Muestra/oculta el indicador de carga
     * @param {boolean} show - Mostrar o no
     */
    function showLoading(show) {
        searchLoading.setAttribute('aria-hidden', !show);
        searchBtn.setAttribute('data-searching', show);
    }
    
    /**
     * Actualiza la selección visual
     */
    function updateSelection() {
        suggestionItems.forEach((item, index) => {
            item.setAttribute('aria-selected', index === selectedIndex);
        });
    }
    
    /**
     * Navega por las sugerencias con teclado
     * @param {number} direction - Dirección (-1 arriba, 1 abajo)
     */
    function navigateSuggestions(direction) {
        if (!isOpen || suggestionItems.length === 0) return;
        
        selectedIndex += direction;
        
        if (selectedIndex < -1) {
            selectedIndex = suggestionItems.length - 1;
        } else if (selectedIndex >= suggestionItems.length) {
            selectedIndex = -1;
        }
        
        updateSelection();
        
        // Scroll al elemento si es necesario
        if (selectedIndex >= 0) {
            suggestionItems[selectedIndex].scrollIntoView({
                block: 'nearest',
                behavior: 'smooth'
            });
        }
    }
    
    /**
     * Limpia la búsqueda
     */
    function clearSearch() {
        searchInput.value = '';
        searchInput.focus();
        hideSuggestions();
        updateClearButton();
        
        // Tracking
        trackSearchAction('clear');
    }
    
    /**
     * Actualiza la visibilidad del botón limpiar
     */
    function updateClearButton() {
        const hasValue = searchInput.value.length > 0;
        searchClear.style.display = hasValue ? 'block' : 'none';
    }
    
    /**
     * Tracking de analytics
     */
    function trackSearchQuery(query, resultCount) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'search', {
                'search_term': query,
                'result_count': resultCount,
                'location': 'navbar_search'
            });
        }
        
        // Guardar en historial local
        const searchHistory = JSON.parse(localStorage.getItem('searchHistory') || '[]');
        searchHistory.unshift({ query, timestamp: Date.now(), results: resultCount });
        // Mantener solo los últimos 10
        localStorage.setItem('searchHistory', JSON.stringify(searchHistory.slice(0, 10)));
    }
    
    function trackSuggestionClick(type, data) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'suggestion_click', {
                'suggestion_type': type,
                'suggestion_data': JSON.stringify(data),
                'location': 'navbar_search'
            });
        }
    }
    
    function trackSearchAction(action) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'search_action', {
                'action': action,
                'location': 'navbar_search'
            });
        }
    }
    
    // Event Listeners
    
    // Input de búsqueda
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.trim();
        performSearch(query);
        updateClearButton();
    });
    
    // Navegación por teclado
    searchInput.addEventListener('keydown', (e) => {
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                navigateSuggestions(1);
                break;
            case 'ArrowUp':
                e.preventDefault();
                navigateSuggestions(-1);
                break;
            case 'Enter':
                e.preventDefault();
                if (selectedIndex >= 0 && suggestionItems[selectedIndex]) {
                    suggestionItems[selectedIndex].click();
                } else {
                    const query = searchInput.value.trim();
                    if (query.length >= 3) {
                        performFullSearch(query);
                    }
                }
                break;
            case 'Escape':
                hideSuggestions();
                searchInput.blur();
                break;
        }
    });
    
    // Botón de búsqueda
    searchBtn.addEventListener('click', () => {
        const query = searchInput.value.trim();
        if (query.length >= 3) {
            performFullSearch(query);
        } else {
            searchInput.focus();
        }
    });
    
    // Botón limpiar
    searchClear.addEventListener('click', clearSearch);
    
    // Ver todos los resultados
    document.getElementById('searchViewAll').addEventListener('click', () => {
        const query = searchInput.value.trim();
        if (query.length >= 3) {
            performFullSearch(query);
        }
    });
    
    // Cerrar al hacer click fuera
    document.addEventListener('click', (e) => {
        if (!searchInput.closest('.search-container').contains(e.target)) {
            hideSuggestions();
        }
    });
    
    // Inicialización
    updateClearButton();
}

// ================================================
// LG-016: SECCIÓN DE OFERTAS DESTACADAS
// ================================================

/**
 * Inicializa la funcionalidad de ofertas destacadas
 */
function initSpecialOffers() {
    console.log('🔥 Inicializando sección de ofertas destacadas...');
    
    // Iniciar contadores de tiempo
    initOfferTimers();
    
    // Configurar interacciones de productos
    setupOfferProductInteractions();
    
    // Cargar datos dinámicos de ofertas
    loadOfferData();
    
    console.log('✅ Ofertas destacadas inicializadas correctamente');
}

/**
 * Inicializa los contadores de tiempo para las ofertas
 */
function initOfferTimers() {
    const timers = document.querySelectorAll('.offer-timer');
    
    timers.forEach(timer => {
        const duration = parseInt(timer.dataset.timer) || 86400; // Default 24 horas
        startOfferCountdown(timer, duration);
    });
}

/**
 * Inicia un countdown para una oferta específica
 * @param {Element} timerElement - Elemento del timer
 * @param {number} duration - Duración en segundos
 */
function startOfferCountdown(timerElement, duration) {
    const timerValue = timerElement.querySelector('.timer-value');
    let remainingTime = duration;
    
    function updateTimer() {
        const hours = Math.floor(remainingTime / 3600);
        const minutes = Math.floor((remainingTime % 3600) / 60);
        const seconds = remainingTime % 60;
        
        const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        timerValue.textContent = formattedTime;
        
        // Cambiar color cuando quede poco tiempo
        if (remainingTime <= 3600) { // Menos de 1 hora
            timerValue.style.color = '#ff4444';
            timerValue.classList.add('urgent');
        } else if (remainingTime <= 10800) { // Menos de 3 horas
            timerValue.style.color = '#ffa500';
            timerValue.classList.add('warning');
        }
        
        remainingTime--;
        
        if (remainingTime < 0) {
            timerValue.textContent = 'EXPIRADO';
            timerValue.style.color = '#ff4444';
            clearInterval(interval);
            
            // Marcar producto como expirado
            const productCard = timerElement.closest('.offer-product-card');
            if (productCard) {
                productCard.classList.add('expired');
                const addToCartBtn = productCard.querySelector('.add-to-cart-btn');
                if (addToCartBtn) {
                    addToCartBtn.disabled = true;
                    addToCartBtn.textContent = '⏰ Oferta Expirada';
                }
            }
        }
    }
    
    updateTimer(); // Llamada inicial
    const interval = setInterval(updateTimer, 1000);
}

/**
 * Configura las interacciones de los productos en oferta
 */
function setupOfferProductInteractions() {
    const productCards = document.querySelectorAll('.offer-product-card');
    
    productCards.forEach(card => {
        // Hover effect con tracking
        card.addEventListener('mouseenter', () => {
            trackEvent('special_offer_hover', {
                product_id: card.dataset.productId,
                section: 'special-offers'
            });
        });
        
        // Click tracking en la tarjeta
        card.addEventListener('click', (e) => {
            if (!e.target.closest('button')) {
                const productId = card.dataset.productId;
                quickViewOffer(productId);
            }
        });
    });
}

/**
 * Carga datos dinámicos de ofertas desde la base de datos
 */
function loadOfferData() {
    // Aquí se conectaría con la base de datos real
    // Por ahora usamos datos mock
    const offerData = {
        'offer-1': {
            views: 1247,
            purchases: 89,
            stock: 12
        },
        'offer-2': {
            views: 956,
            purchases: 67,
            stock: 5
        },
        'offer-3': {
            views: 2103,
            purchases: 156,
            stock: 23
        }
    };
    
    // Actualizar contadores dinámicos
    Object.keys(offerData).forEach(productId => {
        updateOfferStats(productId, offerData[productId]);
    });
}

/**
 * Actualiza las estadísticas de una oferta específica
 * @param {string} productId - ID del producto
 * @param {Object} stats - Estadísticas del producto
 */
function updateOfferStats(productId, stats) {
    const productCard = document.querySelector(`[data-product-id="${productId}"]`);
    if (!productCard) return;
    
    // Agregar indicador de stock bajo si es necesario
    if (stats.stock <= 5) {
        const stockIndicator = document.createElement('div');
        stockIndicator.className = 'stock-warning';
        stockIndicator.innerHTML = `⚠️ ¡Solo quedan ${stats.stock} unidades!`;
        
        const productInfo = productCard.querySelector('.product-info');
        productInfo.appendChild(stockIndicator);
    }
    
    // Agregar badge de "Más Vendido" si tiene muchas compras
    if (stats.purchases > 150) {
        const bestSellerBadge = document.createElement('span');
        bestSellerBadge.className = 'best-seller-badge';
        bestSellerBadge.innerHTML = '🏆 Más Vendido';
        
        const badgeWrapper = productCard.querySelector('.offer-badge-wrapper');
        badgeWrapper.appendChild(bestSellerBadge);
    }
}

/**
 * Maneja el clic en "Agregar al Carrito" para ofertas
 * @param {string} productId - ID del producto en oferta
 */
function addToCartOffer(productId) {
    console.log(`🛒 Agregando oferta ${productId} al carrito...`);
    
    // Tracking del evento
    trackEvent('add_to_cart_offer', {
        product_id: productId,
        section: 'special-offers',
        offer_type: 'special_discount'
    });
    
    // Obtener datos del producto
    const productCard = document.querySelector(`[data-product-id="${productId}"]`);
    if (!productCard) {
        console.error('Producto no encontrado');
        return;
    }
    
    const productData = {
        id: productId,
        name: productCard.querySelector('.product-title').textContent,
        price: productCard.querySelector('.price-offer').textContent,
        originalPrice: productCard.querySelector('.price-original').textContent,
        image: productCard.querySelector('.product-image img').src,
        isOffer: true,
        discount: productCard.querySelector('.discount-badge').textContent
    };
    
    // Simular agregado al carrito
    addToCart(productData);
    
    // Feedback visual
    showOfferAddedFeedback(productCard);
    
    // Actualizar contador de carrito
    updateCartCounter();
}

/**
 * Muestra feedback visual cuando se agrega una oferta al carrito
 * @param {Element} productCard - Tarjeta del producto
 */
function showOfferAddedFeedback(productCard) {
    const addButton = productCard.querySelector('.add-to-cart-btn');
    const originalText = addButton.textContent;
    
    // Cambiar texto temporalmente
    addButton.textContent = '✅ ¡Agregado!';
    addButton.style.background = 'linear-gradient(45deg, #4ade80, #22c55e)';
    addButton.disabled = true;
    
    // Efecto de pulso
    productCard.style.animation = 'offerAdded 0.6s ease';
    
    // Restaurar después de 2 segundos
    setTimeout(() => {
        addButton.textContent = originalText;
        addButton.style.background = '';
        addButton.disabled = false;
        productCard.style.animation = '';
    }, 2000);
}

/**
 * Muestra vista rápida de una oferta
 * @param {string} productId - ID del producto en oferta
 */
function quickViewOffer(productId) {
    console.log(`👁️ Vista rápida de oferta ${productId}`);
    
    // Tracking del evento
    trackEvent('quick_view_offer', {
        product_id: productId,
        section: 'special-offers'
    });
    
    // Aquí se implementaría un modal de vista rápida
    showQuickViewModal(productId);
}

/**
 * Muestra un modal de vista rápida para el producto
 * @param {string} productId - ID del producto
 */
function showQuickViewModal(productId) {
    const productCard = document.querySelector(`[data-product-id="${productId}"]`);
    if (!productCard) return;
    
    // Crear modal
    const modal = document.createElement('div');
    modal.className = 'quick-view-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <button class="modal-close" onclick="closeQuickViewModal()">&times;</button>
            <div class="modal-product">
                <div class="modal-image">
                    <img src="${productCard.querySelector('.product-image img').src}" 
                         alt="${productCard.querySelector('.product-title').textContent}">
                </div>
                <div class="modal-info">
                    <h3>${productCard.querySelector('.product-title').textContent}</h3>
                    <div class="modal-prices">
                        <span class="price-original">${productCard.querySelector('.price-original').textContent}</span>
                        <span class="price-offer">${productCard.querySelector('.price-offer').textContent}</span>
                    </div>
                    <div class="modal-features">
                        ${productCard.querySelector('.offer-features').innerHTML}
                    </div>
                    <div class="modal-actions">
                        <button class="add-to-cart-btn" onclick="addToCartOffer('${productId}')">
                            🛒 Agregar al Carrito
                        </button>
                        <button class="view-details-btn" onclick="viewProductDetails('${productId}')">
                            Ver Detalles Completos
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Agregar estilos del modal si no existen
    if (!document.getElementById('quick-view-styles')) {
        const styles = document.createElement('style');
        styles.id = 'quick-view-styles';
        styles.textContent = `
            .quick-view-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 10000;
                backdrop-filter: blur(5px);
            }
            .modal-content {
                background: linear-gradient(145deg, rgba(20, 20, 35, 0.95), rgba(30, 30, 50, 0.95));
                border: 1px solid rgba(57, 255, 20, 0.3);
                border-radius: var(--border-radius-lg);
                padding: var(--spacing-xl);
                max-width: 600px;
                width: 90%;
                position: relative;
            }
            .modal-close {
                position: absolute;
                top: var(--spacing-md);
                right: var(--spacing-md);
                background: none;
                border: none;
                color: white;
                font-size: 2rem;
                cursor: pointer;
            }
            .modal-product {
                display: flex;
                gap: var(--spacing-lg);
            }
            .modal-image img {
                width: 200px;
                height: 200px;
                object-fit: cover;
                border-radius: var(--border-radius-md);
            }
            .modal-info h3 {
                color: white;
                font-size: 1.5rem;
                margin-bottom: var(--spacing-md);
            }
            .modal-actions {
                display: flex;
                gap: var(--spacing-sm);
                margin-top: var(--spacing-lg);
            }
        `;
        document.head.appendChild(styles);
    }
    
    // Animación de entrada
    setTimeout(() => {
        modal.style.opacity = '1';
    }, 10);
}

/**
 * Cierra el modal de vista rápida
 */
function closeQuickViewModal() {
    const modal = document.querySelector('.quick-view-modal');
    if (modal) {
        modal.remove();
    }
}

/**
 * Navega a todas las ofertas
 */
function viewAllOffers() {
    console.log('📋 Navegando a todas las ofertas...');
    
    // Tracking del evento
    trackEvent('view_all_offers', {
        section: 'special-offers',
        source: 'offers_button'
    });
    
    // Redirigir a página de ofertas o filtrar productos
    window.location.href = 'productos/?filter=ofertas';
}

/**
 * Navega a los detalles completos del producto
 * @param {string} productId - ID del producto
 */
function viewProductDetails(productId) {
    console.log(`📱 Navegando a detalles del producto ${productId}`);
    
    // Tracking del evento
    trackEvent('view_product_details', {
        product_id: productId,
        section: 'special-offers',
        source: 'quick_view'
    });
    
    // Cerrar modal si está abierto
    closeQuickViewModal();
    
    // Redirigir a página de detalles
    window.location.href = `productos/detalle.html?id=${productId}`;
}

// CSS para animaciones específicas de ofertas
const offerStyles = document.createElement('style');
offerStyles.textContent = `
    @keyframes offerAdded {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
    }
    
    .stock-warning {
        background: linear-gradient(45deg, #ff4444, #ff6666);
        color: white;
        padding: var(--spacing-xs);
        border-radius: var(--border-radius-sm);
        font-size: 0.8rem;
        font-weight: bold;
        text-align: center;
        margin-top: var(--spacing-xs);
        animation: pulseWarning 2s infinite;
    }
    
    .best-seller-badge {
        background: linear-gradient(45deg, #ffd700, #ffed4e);
        color: #000;
        padding: var(--spacing-xs);
        border-radius: var(--border-radius-sm);
        font-size: 0.75rem;
        font-weight: bold;
        text-align: center;
    }
    
    .urgent {
        animation: urgentBlink 1s infinite;
    }
    
    .warning {
        animation: warningPulse 2s infinite;
    }
    
    @keyframes pulseWarning {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.7; }
    }
    
    @keyframes urgentBlink {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.3; }
    }
    
    @keyframes warningPulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.8; }
    }
    
    .offer-product-card.expired {
        opacity: 0.6;
        filter: grayscale(0.5);
    }
    
    .offer-product-card.expired .offer-badge.primary {
        background: #666;
        animation: none;
    }
`;

document.head.appendChild(offerStyles);

// ================================================
// LG-017: COMPARADOR DE PRODUCTOS
// ================================================

/**
 * Inicializa el comparador de productos
 */
function initProductComparison() {
    console.log('⚖️ Inicializando comparador de productos...');
    
    // Variables globales del comparador
    window.comparisonProducts = [];
    window.maxComparisonProducts = 4;
    
    // Configurar event listeners
    setupComparisonEventListeners();
    
    // Cargar datos de productos para comparación
    loadComparisonProductData();
    
    console.log('✅ Comparador de productos inicializado correctamente');
}

/**
 * Configura los event listeners del comparador
 */
function setupComparisonEventListeners() {
    // Checkboxes de selección de productos
    const checkboxes = document.querySelectorAll('.product-selector-checkbox');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', handleProductSelection);
    });
    
    // Labels de productos para navegación por teclado
    const labels = document.querySelectorAll('.selector-card-content');
    labels.forEach(label => {
        // Soporte para navegación por teclado
        label.addEventListener('keydown', handleLabelKeydown);
        
        // Actualizar aria-pressed cuando cambia el checkbox
        const checkbox = label.previousElementSibling;
        if (checkbox) {
            checkbox.addEventListener('change', () => {
                label.setAttribute('aria-pressed', checkbox.checked.toString());
            });
        }
    });
    
    // Botón de limpiar comparación
    const clearBtn = document.getElementById('clearComparisonBtn');
    if (clearBtn) {
        clearBtn.addEventListener('click', clearComparison);
    }
    
    // Botón de iniciar comparación
    const startBtn = document.getElementById('startComparisonBtn');
    if (startBtn) {
        startBtn.addEventListener('click', startComparison);
    }
    
    // Botón de cerrar comparación
    const closeBtn = document.getElementById('closeComparisonBtn');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeComparison);
    }
    
    // Búsqueda de productos
    const searchInput = document.getElementById('comparisonSearch');
    const searchBtn = document.getElementById('comparisonSearchBtn');
    
    if (searchInput) {
        searchInput.addEventListener('input', handleComparisonSearch);
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                handleComparisonSearch();
            }
        });
    }
    
    if (searchBtn) {
        searchBtn.addEventListener('click', handleComparisonSearch);
    }
    
    // Botones de acciones de la tabla
    const addAllBtn = document.getElementById('addAllToCartBtn');
    const printBtn = document.getElementById('printComparisonBtn');
    const shareBtn = document.getElementById('shareComparisonBtn');
    
    if (addAllBtn) addAllBtn.addEventListener('click', addAllComparedToCart);
    if (printBtn) printBtn.addEventListener('click', printComparison);
    if (shareBtn) shareBtn.addEventListener('click', shareComparison);
    
    // Configurar navegación por teclado en la tabla
    setupTableKeyboardNavigation();
}

/**
 * Maneja la selección/deselección de productos
 * @param {Event} event - Evento del checkbox
 */
function handleProductSelection(event) {
    const checkbox = event.target;
    const productId = checkbox.id.replace('select-', '');
    const productCard = checkbox.closest('.selector-product-card');
    
    if (checkbox.checked) {
        // Verificar límite máximo
        if (window.comparisonProducts.length >= window.maxComparisonProducts) {
            checkbox.checked = false;
            showComparisonAlert(`Máximo ${window.maxComparisonProducts} productos para comparar`);
            return;
        }
        
        // Agregar producto a la comparación
        addProductToComparison(productId, productCard);
    } else {
        // Remover producto de la comparación
        removeProductFromComparison(productId);
    }
    
    updateComparisonCounter();
    updateComparisonButtons();
    
    // Tracking del evento
    trackEvent('product_comparison_selection', {
        product_id: productId,
        action: checkbox.checked ? 'add' : 'remove',
        total_selected: window.comparisonProducts.length
    });
}

/**
 * Agrega un producto a la lista de comparación
 * @param {string} productId - ID del producto
 * @param {Element} productCard - Elemento de la tarjeta del producto
 */
function addProductToComparison(productId, productCard) {
    const productData = {
        id: productId,
        name: productCard.querySelector('.selector-title').textContent,
        price: productCard.querySelector('.selector-price').textContent,
        category: productCard.querySelector('.selector-category').textContent,
        image: productCard.querySelector('.selector-image img').src,
        // Datos adicionales para comparación
        ...getProductComparisonData(productId)
    };
    
    window.comparisonProducts.push(productData);
    
    // Efecto visual
    productCard.classList.add('selected');
    
    console.log(`✅ Producto ${productData.name} agregado a comparación`);
}

/**
 * Remueve un producto de la lista de comparación
 * @param {string} productId - ID del producto
 */
function removeProductFromComparison(productId) {
    const index = window.comparisonProducts.findIndex(p => p.id === productId);
    if (index > -1) {
        const removedProduct = window.comparisonProducts.splice(index, 1)[0];
        console.log(`❌ Producto ${removedProduct.name} removido de comparación`);
    }
    
    // Remover efecto visual
    const productCard = document.querySelector(`[data-product-id="${productId}"]`);
    if (productCard) {
        productCard.classList.remove('selected');
    }
}

/**
 * Obtiene datos específicos para comparación de un producto
 * @param {string} productId - ID del producto
 * @returns {Object} Datos del producto para comparación
 */
function getProductComparisonData(productId) {
    const comparisonData = {
        'comp-1': {
            brand: 'NVIDIA',
            model: 'RTX 4080',
            memory: '16GB GDDR6X',
            coreClock: '2.2 GHz',
            memorySpeed: '22.4 Gbps',
            powerConsumption: '320W',
            rayTracing: 'Sí',
            dlss: 'DLSS 3',
            warranty: '3 años',
            connectivity: 'HDMI 2.1, DisplayPort 1.4a'
        },
        'comp-2': {
            brand: 'NVIDIA',
            model: 'RTX 4070 Super',
            memory: '12GB GDDR6X',
            coreClock: '2.0 GHz',
            memorySpeed: '21 Gbps',
            powerConsumption: '220W',
            rayTracing: 'Sí',
            dlss: 'DLSS 3',
            warranty: '3 años',
            connectivity: 'HDMI 2.1, DisplayPort 1.4a'
        },
        'comp-3': {
            brand: 'Sony',
            model: 'PlayStation 5',
            cpu: 'AMD Zen 2 8-core',
            gpu: 'AMD RDNA 2',
            memory: '16GB GDDR6',
            storage: '825GB SSD',
            rayTracing: 'Sí',
            resolution: '4K @ 120fps',
            warranty: '1 año',
            connectivity: 'HDMI 2.1, USB, Ethernet'
        },
        'comp-4': {
            brand: 'Microsoft',
            model: 'Xbox Series X',
            cpu: 'AMD Zen 2 8-core',
            gpu: 'AMD RDNA 2',
            memory: '16GB GDDR6',
            storage: '1TB SSD',
            rayTracing: 'Sí',
            resolution: '4K @ 120fps',
            warranty: '1 año',
            connectivity: 'HDMI 2.1, USB, Ethernet'
        },
        'comp-5': {
            brand: 'Gaming Pro',
            model: 'RGB Chair',
            material: 'Cuero PU + Malla',
            adjustment: 'Altura, respaldo, reposabrazos',
            lighting: 'RGB personalizable',
            maxWeight: '150kg',
            wheels: 'Ruedas silenciosas 360°',
            ergonomics: 'Soporte lumbar ajustable',
            warranty: '2 años',
            connectivity: 'USB para RGB'
        },
        'comp-6': {
            brand: 'Gaming Pro',
            model: '32" 4K Monitor',
            size: '32 pulgadas',
            resolution: '3840x2160 (4K)',
            refreshRate: '144Hz',
            panelType: 'IPS',
            hdr: 'HDR10',
            connectivity: 'HDMI 2.1, DisplayPort, USB-C',
            warranty: '3 años',
            features: 'G-Sync Compatible, FreeSync'
        }
    };
    
    return comparisonData[productId] || {};
}

/**
 * Actualiza el contador de productos seleccionados
 */
function updateComparisonCounter() {
    const counter = document.getElementById('comparisonCounter');
    if (counter) {
        const count = window.comparisonProducts.length;
        const message = `${count} producto${count !== 1 ? 's' : ''} seleccionado${count !== 1 ? 's' : ''}`;
        counter.textContent = message;
        
        // Cambiar color según la cantidad
        if (count === 0) {
            counter.style.color = 'rgba(255, 255, 255, 0.7)';
        } else if (count < window.maxComparisonProducts) {
            counter.style.color = '#818cf8';
        } else {
            counter.style.color = '#10b981';
        }
        
        // El aria-live="polite" del contador anunciará automáticamente el cambio
    }
}

/**
 * Actualiza el estado de los botones de comparación
 */
function updateComparisonButtons() {
    const clearBtn = document.getElementById('clearComparisonBtn');
    const startBtn = document.getElementById('startComparisonBtn');
    const count = window.comparisonProducts.length;
    
    if (clearBtn) {
        clearBtn.disabled = count === 0;
    }
    
    if (startBtn) {
        startBtn.disabled = count < 2;
        if (count >= 2) {
            startBtn.textContent = `⚖️ Comparar (${count})`;
        } else {
            startBtn.textContent = '⚖️ Comparar';
        }
    }
}

/**
 * Limpia toda la selección de comparación
 */
function clearComparison() {
    const previousCount = window.comparisonProducts.length;
    
    // Desmarcar todos los checkboxes
    const checkboxes = document.querySelectorAll('.product-selector-checkbox');
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
        // Actualizar aria-pressed de los labels
        const label = checkbox.nextElementSibling;
        if (label) {
            label.setAttribute('aria-pressed', 'false');
        }
    });
    
    // Remover efectos visuales
    const selectedCards = document.querySelectorAll('.selector-product-card.selected');
    selectedCards.forEach(card => {
        card.classList.remove('selected');
    });
    
    // Limpiar array de productos
    window.comparisonProducts = [];
    
    // Actualizar UI
    updateComparisonCounter();
    updateComparisonButtons();
    
    // Ocultar tabla si está visible
    closeComparison();
    
    // Anunciar cambio
    if (previousCount > 0) {
        announceToScreenReader(`Se eliminaron ${previousCount} productos de la comparación`);
    }
    
    // Tracking del evento
    trackEvent('comparison_cleared', {
        products_cleared: previousCount
    });
    
    console.log('🗑️ Comparación limpiada');
}

/**
 * Inicia la comparación mostrando la tabla
 */
function startComparison() {
    if (window.comparisonProducts.length < 2) {
        showComparisonAlert('Selecciona al menos 2 productos para comparar');
        return;
    }
    
    console.log('⚖️ Iniciando comparación de productos...');
    
    // Generar tabla de comparación
    generateComparisonTable();
    
    // Mostrar contenedor de tabla
    const tableContainer = document.getElementById('comparisonTableContainer');
    if (tableContainer) {
        tableContainer.style.display = 'block';
        tableContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    
    // Tracking del evento
    trackEvent('comparison_started', {
        products_count: window.comparisonProducts.length,
        product_ids: window.comparisonProducts.map(p => p.id)
    });
}

/**
 * Genera la tabla de comparación
 */
function generateComparisonTable() {
    const table = document.getElementById('comparisonTable');
    const header = document.getElementById('comparisonTableHeader');
    const body = document.getElementById('comparisonTableBody');
    
    if (!table || !header || !body) return;
    
    // Limpiar contenido existente
    header.innerHTML = '<th class="feature-column" role="columnheader" scope="col" aria-label="Columna de características">Características</th>';
    body.innerHTML = '';
    
    // Generar headers de productos
    window.comparisonProducts.forEach((product, index) => {
        const th = document.createElement('th');
        th.setAttribute('role', 'columnheader');
        th.setAttribute('scope', 'col');
        th.setAttribute('aria-label', `Producto ${index + 1}: ${product.name}`);
        th.innerHTML = `
            <div class="comparison-product-header">
                <img src="${product.image}" 
                     alt="Imagen de ${product.name}" 
                     class="comparison-product-image">
                <div class="comparison-product-name">${product.name}</div>
                <div class="comparison-product-price" aria-label="Precio: ${product.price}">${product.price}</div>
            </div>
        `;
        header.appendChild(th);
    });
    
    // Generar filas de características
    const features = getComparisonFeatures();
    features.forEach((feature, rowIndex) => {
        const tr = document.createElement('tr');
        tr.setAttribute('role', 'row');
        
        // Celda de característica
        const featureTd = document.createElement('td');
        featureTd.className = 'feature-cell';
        featureTd.setAttribute('role', 'rowheader');
        featureTd.setAttribute('scope', 'row');
        featureTd.setAttribute('aria-label', `Característica: ${feature.label}`);
        featureTd.textContent = feature.label;
        tr.appendChild(featureTd);
        
        // Celdas de valores para cada producto
        window.comparisonProducts.forEach((product, colIndex) => {
            const valueTd = document.createElement('td');
            valueTd.setAttribute('role', 'cell');
            const value = product[feature.key] || 'No especificado';
            valueTd.textContent = value;
            
            // Aria-label descriptivo
            valueTd.setAttribute('aria-label', 
                `${feature.label} de ${product.name}: ${value}`);
            
            // Agregar clase especial para valores destacados
            if (feature.highlight && value !== 'No especificado') {
                valueTd.classList.add('highlight-value');
                valueTd.setAttribute('aria-describedby', 'highlight-explanation');
            }
            
            tr.appendChild(valueTd);
        });
        
        body.appendChild(tr);
    });
    
    // Agregar explicación oculta para valores destacados
    if (!document.getElementById('highlight-explanation')) {
        const explanation = document.createElement('div');
        explanation.id = 'highlight-explanation';
        explanation.className = 'visually-hidden';
        explanation.textContent = 'Característica destacada importante para la comparación';
        body.appendChild(explanation);
    }
    
    // Anunciar que la tabla fue generada
    announceToScreenReader('Tabla de comparación generada con ' + window.comparisonProducts.length + ' productos');
    
    console.log('📊 Tabla de comparación generada con accesibilidad completa');
}

/**
 * Define las características a comparar
 * @returns {Array} Array de características
 */
function getComparisonFeatures() {
    return [
        { key: 'category', label: 'Categoría', highlight: false },
        { key: 'brand', label: 'Marca', highlight: false },
        { key: 'model', label: 'Modelo', highlight: false },
        { key: 'price', label: 'Precio', highlight: true },
        { key: 'memory', label: 'Memoria', highlight: true },
        { key: 'cpu', label: 'Procesador', highlight: true },
        { key: 'gpu', label: 'Tarjeta Gráfica', highlight: true },
        { key: 'storage', label: 'Almacenamiento', highlight: true },
        { key: 'coreClock', label: 'Frecuencia Base', highlight: true },
        { key: 'memorySpeed', label: 'Velocidad Memoria', highlight: true },
        { key: 'powerConsumption', label: 'Consumo Energía', highlight: false },
        { key: 'rayTracing', label: 'Ray Tracing', highlight: true },
        { key: 'dlss', label: 'DLSS', highlight: true },
        { key: 'resolution', label: 'Resolución', highlight: true },
        { key: 'refreshRate', label: 'Frecuencia Actualización', highlight: true },
        { key: 'panelType', label: 'Tipo Panel', highlight: false },
        { key: 'size', label: 'Tamaño', highlight: false },
        { key: 'material', label: 'Material', highlight: false },
        { key: 'adjustment', label: 'Ajustes', highlight: false },
        { key: 'lighting', label: 'Iluminación', highlight: true },
        { key: 'connectivity', label: 'Conectividad', highlight: false },
        { key: 'warranty', label: 'Garantía', highlight: false }
    ];
}

/**
 * Cierra la tabla de comparación
 */
function closeComparison() {
    const tableContainer = document.getElementById('comparisonTableContainer');
    if (tableContainer) {
        tableContainer.style.display = 'none';
    }
    
    // Tracking del evento
    trackEvent('comparison_closed', {
        products_count: window.comparisonProducts.length
    });
}

/**
 * Maneja la búsqueda de productos para comparar
 */
function handleComparisonSearch() {
    const searchInput = document.getElementById('comparisonSearch');
    if (!searchInput) return;
    
    const query = searchInput.value.trim().toLowerCase();
    const productCards = document.querySelectorAll('.selector-product-card');
    
    if (query === '') {
        // Mostrar todos los productos
        productCards.forEach(card => {
            card.style.display = 'block';
        });
        return;
    }
    
    // Filtrar productos
    productCards.forEach(card => {
        const title = card.querySelector('.selector-title').textContent.toLowerCase();
        const category = card.querySelector('.selector-category').textContent.toLowerCase();
        
        if (title.includes(query) || category.includes(query)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
    
    // Tracking del evento
    trackEvent('comparison_search', {
        query: query,
        results_count: document.querySelectorAll('.selector-product-card[style*="block"]').length
    });
}

/**
 * Agrega todos los productos comparados al carrito
 */
function addAllComparedToCart() {
    if (window.comparisonProducts.length === 0) {
        showComparisonAlert('No hay productos seleccionados');
        return;
    }
    
    console.log('🛒 Agregando todos los productos comparados al carrito...');
    
    window.comparisonProducts.forEach(product => {
        addToCart(product);
    });
    
    // Mostrar feedback
    showComparisonSuccess(`${window.comparisonProducts.length} productos agregados al carrito`);
    
    // Actualizar contador del carrito
    updateCartCounter();
    
    // Tracking del evento
    trackEvent('add_all_compared_to_cart', {
        products_count: window.comparisonProducts.length,
        product_ids: window.comparisonProducts.map(p => p.id)
    });
}

/**
 * Imprime la comparación
 */
function printComparison() {
    if (window.comparisonProducts.length === 0) {
        showComparisonAlert('No hay productos para imprimir');
        return;
    }
    
    // Crear ventana de impresión
    const printWindow = window.open('', '_blank');
    const printContent = generatePrintableComparison();
    
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
    
    // Tracking del evento
    trackEvent('comparison_printed', {
        products_count: window.comparisonProducts.length
    });
    
    console.log('🖨️ Comparación enviada a imprimir');
}

/**
 * Genera contenido imprimible de la comparación
 * @returns {string} HTML para imprimir
 */
function generatePrintableComparison() {
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Comparación de Productos - Level-Up Gamer</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
                th { background-color: #f2f2f2; font-weight: bold; }
                .header { text-align: center; margin-bottom: 30px; }
                .product-image { width: 60px; height: 60px; object-fit: cover; }
                @media print { body { margin: 0; } }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>🎮 Level-Up Gamer</h1>
                <h2>Comparación de Productos</h2>
                <p>Generado el: ${new Date().toLocaleString()}</p>
            </div>
            ${document.getElementById('comparisonTable').outerHTML}
        </body>
        </html>
    `;
}

/**
 * Comparte la comparación
 */
function shareComparison() {
    if (window.comparisonProducts.length === 0) {
        showComparisonAlert('No hay productos para compartir');
        return;
    }
    
    // Generar URL de compartir
    const productIds = window.comparisonProducts.map(p => p.id).join(',');
    const shareUrl = `${window.location.origin}${window.location.pathname}?compare=${productIds}`;
    
    // Copiar al portapapeles si es posible
    if (navigator.clipboard) {
        navigator.clipboard.writeText(shareUrl).then(() => {
            showComparisonSuccess('Enlace copiado al portapapeles');
        }).catch(() => {
            showShareModal(shareUrl);
        });
    } else {
        showShareModal(shareUrl);
    }
    
    // Tracking del evento
    trackEvent('comparison_shared', {
        products_count: window.comparisonProducts.length,
        share_method: 'url'
    });
}

/**
 * Muestra modal para compartir
 * @param {string} url - URL para compartir
 */
function showShareModal(url) {
    const modal = document.createElement('div');
    modal.className = 'share-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h3>📤 Compartir Comparación</h3>
            <p>Copia este enlace para compartir tu comparación:</p>
            <input type="text" value="${url}" readonly class="share-url-input">
            <div class="modal-actions">
                <button onclick="copyShareUrl(this)" class="copy-btn">📋 Copiar</button>
                <button onclick="closeShareModal()" class="close-btn">✕ Cerrar</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

/**
 * Carga datos de productos para comparación
 */
function loadComparisonProductData() {
    // Aquí se cargarían datos reales desde la base de datos
    console.log('📊 Datos de productos para comparación cargados');
}

/**
 * Carga comparación popular predefinida
 * @param {string} type - Tipo de comparación
 */
function loadPopularComparison(type) {
    console.log(`🔥 Cargando comparación popular: ${type}`);
    
    // Limpiar selección actual
    clearComparison();
    
    // Seleccionar productos según el tipo
    let productIds = [];
    
    switch (type) {
        case 'consoles':
            productIds = ['comp-3', 'comp-4']; // PS5 vs Xbox
            break;
        case 'graphics':
            productIds = ['comp-1', 'comp-2']; // RTX 4080 vs 4070
            break;
        case 'setup':
            productIds = ['comp-5', 'comp-6']; // Silla + Monitor
            break;
    }
    
    // Marcar checkboxes
    productIds.forEach(id => {
        const checkbox = document.getElementById(`select-${id}`);
        if (checkbox) {
            checkbox.checked = true;
            handleProductSelection({ target: checkbox });
        }
    });
    
    // Tracking del evento
    trackEvent('popular_comparison_loaded', {
        comparison_type: type,
        products_selected: productIds
    });
    
    // Iniciar comparación automáticamente
    setTimeout(() => {
        startComparison();
    }, 500);
}

/**
 * Muestra alerta de comparación
 * @param {string} message - Mensaje a mostrar
 */
function showComparisonAlert(message) {
    // Crear alerta temporal
    const alert = document.createElement('div');
    alert.className = 'comparison-alert alert-warning';
    alert.textContent = message;
    alert.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(239, 68, 68, 0.9);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        z-index: 10000;
        font-weight: bold;
        animation: slideInAlert 0.3s ease;
    `;
    
    document.body.appendChild(alert);
    
    // Remover después de 3 segundos
    setTimeout(() => {
        alert.style.animation = 'slideOutAlert 0.3s ease';
        setTimeout(() => alert.remove(), 300);
    }, 3000);
}

/**
 * Muestra mensaje de éxito
 * @param {string} message - Mensaje a mostrar
 */
function showComparisonSuccess(message) {
    // Crear mensaje de éxito temporal
    const success = document.createElement('div');
    success.className = 'comparison-alert alert-success';
    success.textContent = message;
    success.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(16, 185, 129, 0.9);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        z-index: 10000;
        font-weight: bold;
        animation: slideInAlert 0.3s ease;
    `;
    
    document.body.appendChild(success);
    
    // Remover después de 3 segundos
    setTimeout(() => {
        success.style.animation = 'slideOutAlert 0.3s ease';
        setTimeout(() => success.remove(), 300);
    }, 3000);
}

// CSS para alertas y modales del comparador
const comparisonStyles = document.createElement('style');
comparisonStyles.textContent = `
    @keyframes slideInAlert {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutAlert {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .share-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
    }
    
    .share-modal .modal-content {
        background: rgba(20, 20, 35, 0.95);
        border: 1px solid rgba(129, 140, 248, 0.3);
        border-radius: 1rem;
        padding: 2rem;
        max-width: 500px;
        width: 90%;
        text-align: center;
    }
    
    .share-modal h3 {
        color: white;
        margin-bottom: 1rem;
    }
    
    .share-modal p {
        color: rgba(255, 255, 255, 0.8);
        margin-bottom: 1rem;
    }
    
    .share-url-input {
        width: 100%;
        padding: 0.75rem;
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(129, 140, 248, 0.3);
        border-radius: 0.5rem;
        color: white;
        margin-bottom: 1.5rem;
        font-family: monospace;
    }
    
    .modal-actions {
        display: flex;
        gap: 1rem;
        justify-content: center;
    }
    
    .copy-btn, .close-btn {
        padding: 0.75rem 1.5rem;
        border: none;
        border-radius: 0.5rem;
        cursor: pointer;
        font-weight: bold;
        transition: all 0.3s ease;
    }
    
    .copy-btn {
        background: linear-gradient(45deg, #10b981, #34d399);
        color: white;
    }
    
    .close-btn {
        background: rgba(239, 68, 68, 0.2);
        color: #ef4444;
        border: 1px solid rgba(239, 68, 68, 0.3);
    }
    
    .copy-btn:hover, .close-btn:hover {
        transform: translateY(-2px);
    }
    
    .highlight-value {
        background: rgba(129, 140, 248, 0.1);
        font-weight: bold;
        color: #818cf8;
    }
`;

document.head.appendChild(comparisonStyles);

/**
 * Copia la URL de compartir al portapapeles
 * @param {Element} button - Botón de copiar
 */
function copyShareUrl(button) {
    const input = button.closest('.modal-content').querySelector('.share-url-input');
    input.select();
    document.execCommand('copy');
    
    // Cambiar texto del botón temporalmente
    const originalText = button.textContent;
    button.textContent = '✅ Copiado!';
    
    setTimeout(() => {
        button.textContent = originalText;
    }, 2000);
}

/**
 * Cierra el modal de compartir
 */
function closeShareModal() {
    const modal = document.querySelector('.share-modal');
    if (modal) {
        modal.remove();
    }
}

/**
 * Maneja la navegación por teclado en los labels de productos
 * @param {KeyboardEvent} event - Evento de teclado
 */
function handleLabelKeydown(event) {
    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        const checkbox = event.target.previousElementSibling;
        if (checkbox && checkbox.type === 'checkbox') {
            checkbox.checked = !checkbox.checked;
            checkbox.dispatchEvent(new Event('change'));
        }
    }
}

/**
 * Configura la navegación por teclado en la tabla de comparación
 */
function setupTableKeyboardNavigation() {
    // Esta función se llamará cuando se genere la tabla
    const setupTableNavigation = () => {
        const table = document.getElementById('comparisonTable');
        if (!table) return;
        
        const cells = table.querySelectorAll('td, th');
        cells.forEach((cell, index) => {
            cell.setAttribute('tabindex', index === 0 ? '0' : '-1');
            cell.addEventListener('keydown', handleTableKeydown);
        });
    };
    
    // Observar cuando se muestre la tabla
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                const tableContainer = document.getElementById('comparisonTableContainer');
                if (tableContainer && tableContainer.style.display !== 'none') {
                    setupTableNavigation();
                }
            }
        });
    });
    
    const tableContainer = document.getElementById('comparisonTableContainer');
    if (tableContainer) {
        observer.observe(tableContainer, { attributes: true });
    }
}

/**
 * Maneja la navegación por teclado en la tabla
 * @param {KeyboardEvent} event - Evento de teclado
 */
function handleTableKeydown(event) {
    const currentCell = event.target;
    const table = currentCell.closest('table');
    const cells = Array.from(table.querySelectorAll('td, th'));
    const currentIndex = cells.indexOf(currentCell);
    const columnsCount = table.querySelector('tr').children.length;
    
    let nextIndex = currentIndex;
    
    switch (event.key) {
        case 'ArrowRight':
            event.preventDefault();
            nextIndex = currentIndex + 1;
            if (nextIndex >= cells.length) nextIndex = currentIndex;
            break;
        case 'ArrowLeft':
            event.preventDefault();
            nextIndex = currentIndex - 1;
            if (nextIndex < 0) nextIndex = currentIndex;
            break;
        case 'ArrowDown':
            event.preventDefault();
            nextIndex = currentIndex + columnsCount;
            if (nextIndex >= cells.length) nextIndex = currentIndex;
            break;
        case 'ArrowUp':
            event.preventDefault();
            nextIndex = currentIndex - columnsCount;
            if (nextIndex < 0) nextIndex = currentIndex;
            break;
        case 'Home':
            event.preventDefault();
            nextIndex = 0;
            break;
        case 'End':
            event.preventDefault();
            nextIndex = cells.length - 1;
            break;
    }
    
    if (nextIndex !== currentIndex) {
        currentCell.setAttribute('tabindex', '-1');
        cells[nextIndex].setAttribute('tabindex', '0');
        cells[nextIndex].focus();
    }
}

/**
 * Anuncia mensajes a lectores de pantalla
 * @param {string} message - Mensaje a anunciar
 */
function announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'visually-hidden';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    // Remover después de un momento
    setTimeout(() => {
        document.body.removeChild(announcement);
    }, 1000);
}
