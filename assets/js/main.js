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
