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
