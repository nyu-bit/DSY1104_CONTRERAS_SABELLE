// ================================
// LEVEL-UP GAMER - JAVASCRIPT PRINCIPAL (LIMPIO)
// Funcionalidades principales del sitio
// ================================

// Variables globales
let cart = JSON.parse(localStorage.getItem('levelup_cart')) || [];
let user = JSON.parse(localStorage.getItem('levelup_user')) || null;

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
// GESTIÓN DEL CARRITO (BÁSICA)
// ================================

function updateCartCounter() {
    const counter = document.getElementById('cartCounter');
    const cartCount = document.getElementById('cartCount');
    const cartCounters = document.querySelectorAll('.cart-count');
    
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    if (counter) counter.textContent = totalItems;
    if (cartCount) cartCount.textContent = totalItems;
    
    cartCounters.forEach(c => {
        c.textContent = totalItems;
        c.style.display = totalItems > 0 ? 'inline' : 'none';
    });
}

// ================================
// GESTIÓN DE USUARIO
// ================================

function updateUserUI() {
    const userDisplay = document.getElementById('userDisplay');
    if (userDisplay) {
        if (user) {
            userDisplay.innerHTML = `
                <span>Hola, ${user.name}</span>
                <button onclick="logout()">Cerrar Sesión</button>
            `;
        } else {
            userDisplay.innerHTML = `
                <a href="usuario/login.html">Iniciar Sesión</a>
                <a href="usuario/register.html">Registrarse</a>
            `;
        }
    }
}

function logout() {
    localStorage.removeItem('levelup_user');
    user = null;
    updateUserUI();
    window.location.href = 'index.html';
}

// ================================
// EVENT LISTENERS
// ================================

function setupEventListeners() {
    // Event listeners básicos que no están en otros módulos
    
    // Mobile menu toggle (fallback si no está responsive.js)
    const mobileToggle = document.getElementById('mobileToggle');
    if (mobileToggle) {
        mobileToggle.addEventListener('click', function() {
            const navLinks = document.getElementById('navLinks');
            if (navLinks) {
                navLinks.classList.toggle('active');
            }
        });
    }
    
    // Scroll suave para enlaces internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ================================
// CARGA DE CONTENIDO POR PÁGINA
// ================================

function loadPageContent() {
    const path = window.location.pathname;
    
    if (path.includes('index.html') || path === '/') {
        loadHomePage();
    } else if (path.includes('productos')) {
        loadProductsPage();
    } else if (path.includes('carrito')) {
        loadCartPage();
    } else if (path.includes('usuario')) {
        loadUserPage();
    }
}

function loadHomePage() {
    loadHeroContent();
    loadFeaturedProducts();
    loadCategories();
}

function loadHeroContent() {
    const heroContent = document.querySelector('.hero-content');
    if (heroContent && !heroContent.innerHTML.trim()) {
        heroContent.innerHTML = `
            <h1 class="hero-title">
                🎮 LEVEL-UP <span class="text-glow">GAMER</span>
            </h1>
            <p class="hero-subtitle">
                La tienda gaming definitiva con los mejores productos y precios increíbles
            </p>
            <div class="hero-actions">
                <a href="productos/" class="cta-button">
                    Explorar Catálogo
                </a>
            </div>
        `;
    }
}

function loadFeaturedProducts() {
    const featuredGrid = document.getElementById('featured-grid');
    if (featuredGrid && window.PRODUCT_DATABASE) {
        const featured = Object.values(window.PRODUCT_DATABASE).slice(0, 6);
        featuredGrid.innerHTML = featured.map(product => `
            <div class="product-card">
                <div class="product-card-image">
                    <span class="product-emoji">${product.emoji}</span>
                </div>
                <div class="product-card-content">
                    <h3>${product.name}</h3>
                    <p class="product-price">$${product.price.toLocaleString()}</p>
                    <button class="btn btn-primary" onclick="addToCart(${product.id})">
                        Agregar al Carrito
                    </button>
                </div>
            </div>
        `).join('');
    }
}

function loadCategories() {
    const categoriesGrid = document.querySelector('.categories-grid');
    if (categoriesGrid && !categoriesGrid.innerHTML.trim()) {
        const categories = [
            { id: 'consolas', name: 'Consolas', icon: '🎮', count: 8 },
            { id: 'juegos', name: 'Videojuegos', icon: '🕹️', count: 12 },
            { id: 'accesorios', name: 'Accesorios', icon: '🎧', count: 15 },
            { id: 'pc', name: 'PC Gaming', icon: '💻', count: 6 }
        ];
        
        categoriesGrid.innerHTML = categories.map(cat => `
            <div class="category-tile" onclick="goToCategory('${cat.id}')">
                <div class="category-icon">${cat.icon}</div>
                <h3 class="category-title">${cat.name}</h3>
                <p class="category-count">${cat.count} productos</p>
            </div>
        `).join('');
    }
}

function loadProductsPage() {
    if (window.loadProducts) {
        window.loadProducts();
    }
}

function loadCartPage() {
    if (window.displayCart) {
        window.displayCart();
    }
}

function loadUserPage() {
    const userAuth = document.getElementById('userAuth');
    const userDashboard = document.getElementById('userDashboard');
    
    if (user) {
        if (userAuth) userAuth.style.display = 'none';
        if (userDashboard) {
            userDashboard.style.display = 'block';
            document.getElementById('userName').textContent = user.name;
        }
    } else {
        if (userAuth) userAuth.style.display = 'block';
        if (userDashboard) userDashboard.style.display = 'none';
    }
}

// ================================
// FUNCIONES DE NAVEGACIÓN
// ================================

function goToCategory(categoryId) {
    window.location.href = `productos/?category=${categoryId}`;
}

function addToCart(productId) {
    if (window.cartManager && window.cartManager.addItem) {
        window.cartManager.addItem(productId);
    } else {
        // Fallback básico
        console.log(`Agregando producto ${productId} al carrito`);
    }
}

// ================================
// MODALES
// ================================

function showStudentModal() {
    const modal = document.getElementById('studentModal');
    if (modal) {
        modal.style.display = 'flex';
    }
}

function closeStudentModal() {
    const modal = document.getElementById('studentModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function showTermsModal() {
    const modal = document.getElementById('termsModal');
    if (modal) {
        modal.style.display = 'flex';
    }
}

function closeTermsModal() {
    const modal = document.getElementById('termsModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Cerrar modales al hacer clic fuera
window.addEventListener('click', function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
});

// ================================
// UTILIDADES
// ================================

function formatPrice(price) {
    return `$${price.toLocaleString()}`;
}

function showNotification(message, type = 'info') {
    if (window.cartManager && window.cartManager.showCartNotification) {
        window.cartManager.showCartNotification(message, type);
    } else {
        console.log(`${type.toUpperCase()}: ${message}`);
    }
}

// ================================
// EXPORTAR FUNCIONES GLOBALES
// ================================

window.addToCart = addToCart;
window.logout = logout;
window.showStudentModal = showStudentModal;
window.closeStudentModal = closeStudentModal;
window.showTermsModal = showTermsModal;
window.closeTermsModal = closeTermsModal;
window.goToCategory = goToCategory;
