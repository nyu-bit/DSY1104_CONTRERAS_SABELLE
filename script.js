// ===================== CARRUSEL BANNER =====================
document.addEventListener('DOMContentLoaded', function() {
  const slides = document.querySelectorAll('.promo-slide');
  const leftBtn = document.querySelector('.promo-arrow.left');
  const rightBtn = document.querySelector('.promo-arrow.right');
  let current = 0;

  if (slides.length > 0) {
    function showSlide(idx) {
      slides.forEach((slide, i) => {
        slide.style.display = (i === idx) ? 'flex' : 'none';
      });
    }

    if (leftBtn) {
      leftBtn.addEventListener('click', () => {
        current = (current - 1 + slides.length) % slides.length;
        showSlide(current);
      });
    }

    if (rightBtn) {
      rightBtn.addEventListener('click', () => {
        current = (current + 1) % slides.length;
        showSlide(current);
      });
    }

    // Auto-carrusel cada 6 segundos
    setInterval(() => {
      current = (current + 1) % slides.length;
      showSlide(current);
    }, 6000);

    showSlide(current);
  }
});

// ===================== INICIALIZACIÓN PRINCIPAL =====================
document.addEventListener('DOMContentLoaded', function() {
  console.log('🚀 Iniciando aplicación Level-Up Gamer...');
  
  // Configurar tema
  document.documentElement.setAttribute('data-theme', 'gamer');
  
  // Inicializar módulos
  initMobileMenu();
  initCart();
  initProductInteractions();
  initLogin();
  initRegistration();
  
  console.log('✅ Aplicación inicializada correctamente');
});

// ===================== MENÚ MÓVIL =====================
function initMobileMenu() {
  const navToggle = document.querySelector('.nav-toggle');
  const drawer = document.querySelector('.drawer');
  
  if (navToggle && drawer) {
    navToggle.addEventListener('click', function() {
      drawer.classList.toggle('open');
    });
    
    document.addEventListener('click', function(e) {
      if (!drawer.contains(e.target) && !navToggle.contains(e.target)) {
        drawer.classList.remove('open');
      }
    });
    
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && drawer.classList.contains('open')) {
        drawer.classList.remove('open');
      }
    });
  }
}

// ===================== CARRITO DE COMPRAS FUNCIONAL =====================
let cart = [];

function initCart() {
  loadCartFromStorage();
  updateCartCount();
  setupCartEventListeners();
  setupCartModal();
}

function loadCartFromStorage() {
  const savedCart = localStorage.getItem('levelUpCart');
  cart = savedCart ? JSON.parse(savedCart) : [];
}

function saveCartToStorage() {
  localStorage.setItem('levelUpCart', JSON.stringify(cart));
}

function setupCartEventListeners() {
  // Event listeners para botones de agregar al carrito
  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('card-button')) {
      const onclickAttr = e.target.getAttribute('onclick');
      if (onclickAttr) {
        const match = onclickAttr.match(/addToCart\((\d+)\)/);
        if (match) {
          const productId = parseInt(match[1]);
          addToCartById(productId);
        }
      }
    }
    
    // Control de cantidad en modal
    if (e.target.classList.contains('quantity-btn')) {
      const productId = parseInt(e.target.dataset.id);
      const action = e.target.dataset.action;
      updateQuantity(productId, action);
    }
    
    // Remover item
    if (e.target.classList.contains('remove-item')) {
      const productId = parseInt(e.target.dataset.id);
      removeFromCart(productId);
    }
  });
}

function setupCartModal() {
  const modal = document.getElementById('cart-modal');
  if (modal) {
    // Cerrar modal con botón X
    const closeButton = modal.querySelector('.modal-close');
    if (closeButton) {
      closeButton.addEventListener('click', closeCartModal);
    }
    
    // Cerrar modal clickeando fuera
    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        closeCartModal();
      }
    });
    
    // Cerrar con ESC
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeCartModal();
      }
    });
  }
}

function addToCartById(productId) {
  const product = getProductById(productId);
  if (!product) {
    showNotification('❌ Producto no encontrado', 'error');
    return;
  }
  
  addToCart(product);
}

function addToCart(product) {
  const existingItem = cart.find(item => item.id === product.id);
  
  if (existingItem) {
    existingItem.quantity += 1;
    showNotification(`${product.name} cantidad actualizada (${existingItem.quantity})`, 'success');
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice || null,
      image: product.image || '🎮',
      quantity: 1
    });
    showNotification(`${product.name} agregado al carrito`, 'success');
  }
  
  saveCartToStorage();
  updateCartCount();
  updateCartDisplay();
}

function removeFromCart(productId) {
  const itemIndex = cart.findIndex(item => item.id === productId);
  if (itemIndex > -1) {
    const removedItem = cart.splice(itemIndex, 1)[0];
    showNotification(`${removedItem.name} removido del carrito`, 'info');
    saveCartToStorage();
    updateCartCount();
    updateCartDisplay();
  }
}

function updateQuantity(productId, action) {
  const item = cart.find(item => item.id === productId);
  if (!item) return;
  
  if (action === 'increase') {
    item.quantity += 1;
  } else if (action === 'decrease') {
    item.quantity -= 1;
    if (item.quantity <= 0) {
      removeFromCart(productId);
      return;
    }
  }
  
  saveCartToStorage();
  updateCartCount();
  updateCartDisplay();
}

function updateCartCount() {
  const cartCount = document.getElementById('cart-count');
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  
  if (cartCount) {
    cartCount.textContent = totalItems;
    cartCount.style.display = totalItems > 0 ? 'inline' : 'none';
  }
}

function calculateSubtotal() {
  return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

function calculateDiscounts() {
  const sessionData = localStorage.getItem('levelup_session');
  if (!sessionData) return 0;
  
  const user = JSON.parse(sessionData);
  const subtotal = calculateSubtotal();
  let totalDiscount = 0;
  
  // Descuento Duoc UC (20%)
  if (user.email && user.email.includes('@duocuc.cl')) {
    totalDiscount += subtotal * 0.20;
  }
  
  // Descuento por nivel (5% cada 5 niveles, máximo 25%)
  if (user.level) {
    const levelDiscount = Math.floor(user.level / 5) * 0.05;
    totalDiscount += subtotal * Math.min(levelDiscount, 0.25);
  }
  
  return totalDiscount;
}

function calculateShipping() {
  const subtotal = calculateSubtotal();
  return subtotal >= 50000 ? 0 : 5000; // Envío gratis sobre $50,000
}

function calculateTotal() {
  const subtotal = calculateSubtotal();
  const discounts = calculateDiscounts();
  const shipping = calculateShipping();
  return Math.max(0, subtotal - discounts + shipping);
}

function updateCartDisplay() {
  updateCartItems();
  updateCartSummary();
}

function updateCartItems() {
  const cartItemsContainer = document.getElementById('cart-items');
  if (!cartItemsContainer) return;
  
  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `
      <div class="empty-cart-message" style="text-align: center; padding: 2rem;">
        <div style="font-size: 3rem; margin-bottom: 1rem;">🛒</div>
        <h3>Tu carrito está vacío</h3>
        <p>¡Agrega algunos productos increíbles!</p>
      </div>
    `;
    return;
  }
  
  cartItemsContainer.innerHTML = cart.map(item => `
    <div class="cart-item" data-id="${item.id}" style="display: flex; align-items: center; padding: 1rem; border-bottom: 1px solid var(--border); gap: 1rem;">
      <div class="cart-item-image" style="font-size: 2rem; width: 50px; text-align: center;">
        🎮
      </div>
      <div class="cart-item-details" style="flex: 1;">
        <h4 class="cart-item-name" style="margin: 0 0 0.5rem 0; color: var(--text);">${item.name}</h4>
        <div class="cart-item-price" style="margin-bottom: 0.5rem;">
          ${item.originalPrice && item.originalPrice > item.price ? 
            `<span style="text-decoration: line-through; color: var(--muted); margin-right: 0.5rem;">$${item.originalPrice.toLocaleString()}</span>` : ''}
          <span style="color: var(--accent); font-weight: bold;">$${item.price.toLocaleString()}</span>
        </div>
        <div class="cart-item-controls" style="display: flex; align-items: center; gap: 0.5rem;">
          <button class="quantity-btn" data-id="${item.id}" data-action="decrease" style="background: var(--primary); color: white; border: none; width: 30px; height: 30px; border-radius: 4px; cursor: pointer;">-</button>
          <span class="quantity-display" style="min-width: 30px; text-align: center; font-weight: bold;">${item.quantity}</span>
          <button class="quantity-btn" data-id="${item.id}" data-action="increase" style="background: var(--primary); color: white; border: none; width: 30px; height: 30px; border-radius: 4px; cursor: pointer;">+</button>
          <button class="remove-item" data-id="${item.id}" style="background: var(--danger, #ff0062); color: white; border: none; padding: 0.25rem 0.5rem; border-radius: 4px; cursor: pointer; margin-left: 1rem;">🗑️</button>
        </div>
      </div>
      <div class="cart-item-total" style="font-weight: bold; color: var(--accent);">
        $${(item.price * item.quantity).toLocaleString()}
      </div>
    </div>
  `).join('');
}

function updateCartSummary() {
  const subtotal = calculateSubtotal();
  const discounts = calculateDiscounts();
  const shipping = calculateShipping();
  const total = calculateTotal();
  
  // Actualizar elementos del resumen
  const subtotalElement = document.getElementById('cart-subtotal');
  const discountElement = document.getElementById('cart-discount');
  const discountRow = document.getElementById('discount-row');
  const discountPercentage = document.getElementById('discount-percentage');
  const shippingElement = document.getElementById('cart-shipping');
  const totalElement = document.getElementById('cart-total');
  
  if (subtotalElement) subtotalElement.textContent = `$${subtotal.toLocaleString()}`;
  if (shippingElement) shippingElement.textContent = shipping === 0 ? 'GRATIS' : `$${shipping.toLocaleString()}`;
  if (totalElement) totalElement.textContent = `$${total.toLocaleString()}`;
  
  // Mostrar/ocultar descuentos
  if (discounts > 0) {
    if (discountElement) discountElement.textContent = `-$${Math.round(discounts).toLocaleString()}`;
    if (discountPercentage) discountPercentage.textContent = Math.round((discounts / subtotal) * 100);
    if (discountRow) discountRow.style.display = 'flex';
  } else {
    if (discountRow) discountRow.style.display = 'none';
  }
  
  // Actualizar estado del carrito
  const emptyCart = document.getElementById('empty-cart');
  const cartContent = document.getElementById('cart-content');
  
  if (cart.length === 0) {
    if (emptyCart) emptyCart.style.display = 'block';
    if (cartContent) cartContent.style.display = 'none';
  } else {
    if (emptyCart) emptyCart.style.display = 'none';
    if (cartContent) cartContent.style.display = 'block';
  }
}

function clearCart() {
  if (confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
    cart = [];
    saveCartToStorage();
    updateCartCount();
    updateCartDisplay();
    showNotification('🗑️ Carrito vaciado', 'info');
  }
}

function showCart() {
  const modal = document.getElementById('cart-modal');
  if (modal) {
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    updateCartDisplay();
  }
}

function closeCartModal() {
  const modal = document.getElementById('cart-modal');
  if (modal) {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
}

function getProductById(id) {
  // Base de datos de productos de ejemplo
  const productDatabase = {
    1: { 
      id: 1, 
      name: "PlayStation 5", 
      price: 599990, 
      originalPrice: 649990, 
      image: "🎮",
      description: "Consola de nueva generación con gráficos 4K"
    },
    2: { 
      id: 2, 
      name: "Xbox Series X", 
      price: 549990, 
      image: "🎮",
      description: "La consola Xbox más potente jamás creada"
    },
    3: { 
      id: 3, 
      name: "Nintendo Switch OLED", 
      price: 399990, 
      originalPrice: 429990, 
      image: "🎮",
      description: "Consola híbrida con pantalla OLED"
    },
    4: { 
      id: 4, 
      name: "Gaming Headset Pro", 
      price: 89990, 
      image: "🎧",
      description: "Auriculares gaming con sonido envolvente"
    },
    5: { 
      id: 5, 
      name: "Mechanical Keyboard RGB", 
      price: 129990, 
      image: "⌨️",
      description: "Teclado mecánico con iluminación RGB"
    },
    6: { 
      id: 6, 
      name: "Gaming Mouse Ultra", 
      price: 79990, 
      image: "🖱️",
      description: "Mouse gaming de alta precisión"
    }
  };
  
  return productDatabase[id] || null;
}

function initiateCheckout() {
  if (cart.length === 0) {
    showNotification('❌ El carrito está vacío', 'error');
    return;
  }
  
  // Verificar si está logueado
  const sessionData = localStorage.getItem('levelup_session');
  if (!sessionData) {
    showNotification('⚠️ Debes iniciar sesión para continuar', 'error');
    // Abrir modal de login
    setTimeout(() => {
      const loginModal = document.getElementById('login-modal');
      if (loginModal) {
        loginModal.classList.add('active');
        loginModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
      }
    }, 1000);
    return;
  }
  
  // Cerrar modal del carrito
  closeCartModal();
  
  // Abrir modal de checkout
  const checkoutModal = document.getElementById('checkout-modal');
  if (checkoutModal) {
    checkoutModal.classList.add('active');
    checkoutModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  
  showNotification('🛒 Iniciando proceso de compra...', 'success');
}

// ===================== INTERACCIONES DE PRODUCTOS =====================
function initProductInteractions() {
  const cards = document.querySelectorAll('.card');
  cards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-8px) scale(1.02)';
    });
    card.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0) scale(1)';
    });
  });
  
  renderCategoryTiles();
}

function renderCategoryTiles() {
  const categorias = [
    {
      icon: '🎮',
      nombre: 'Videojuegos',
      desc: 'Los últimos lanzamientos y clásicos'
    },
    {
      icon: '⚡',
      nombre: 'Hardware',
      desc: 'PCs, componentes y periféricos'
    },
    {
      icon: '🎧',
      nombre: 'Accesorios',
      desc: 'Auriculares, teclados y ratones'
    },
    {
      icon: '🏆',
      nombre: 'eSports',
      desc: 'Equipamiento profesional'
    }
  ];
  
  const container = document.getElementById('tiles-categorias');
  if (!container) return;
  
  container.innerHTML = "";
  categorias.forEach(cat => {
    const tile = document.createElement('div');
    tile.className = 'tile';
    tile.tabIndex = 0;
    tile.setAttribute('aria-label', cat.nombre);
    
    const iconDiv = document.createElement('div');
    iconDiv.className = 'tile-icon';
    iconDiv.textContent = cat.icon;
    
    const h3 = document.createElement('h3');
    h3.textContent = cat.nombre;
    
    const p = document.createElement('p');
    p.textContent = cat.desc;
    
    tile.appendChild(iconDiv);
    tile.appendChild(h3);
    tile.appendChild(p);
    
    tile.addEventListener('click', function() {
      const category = this.querySelector('h3').textContent;
      showNotification('Navegando a ' + category);
    });
    
    tile.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.click();
      }
    });
    
    container.appendChild(tile);
  });
}

// ===================== SISTEMA DE LOGIN =====================
function initLogin() {
  const loginButton = document.getElementById('login-button');
  const modal = document.getElementById('login-modal');
  const form = document.getElementById('login-form');
  
  if (!loginButton || !modal || !form) return;
  
  // Configurar botón de login
  loginButton.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    
    setTimeout(() => {
      const emailInput = document.getElementById('login-email');
      if (emailInput) emailInput.focus();
    }, 100);
  });
  
  // Configurar cierre del modal
  setupModalClose(modal, 'login');
  
  // Configurar formulario
  form.addEventListener('submit', handleLogin);
  
  // Verificar sesión activa
  checkActiveSession();
}

function setupModalClose(modal, type) {
  const closeButton = modal.querySelector('.modal-close');
  const cancelButton = modal.querySelector(`#cancel-${type}`);
  
  function closeModal() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    
    const form = modal.querySelector('form');
    if (form) form.reset();
  }
  
  if (closeButton) closeButton.addEventListener('click', closeModal);
  if (cancelButton) cancelButton.addEventListener('click', closeModal);
  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
  
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });
}

function handleLogin(e) {
  e.preventDefault();
  
  const email = document.getElementById('login-email').value.toLowerCase().trim();
  const password = document.getElementById('login-password').value;
  const rememberMe = document.getElementById('remember-me').checked;
  const submitButton = document.getElementById('submit-login');
  
  if (!email || !password) {
    showNotification('❌ Por favor completa todos los campos', 'error');
    return;
  }
  
  submitButton.disabled = true;
  submitButton.textContent = 'Iniciando sesión...';
  
  // Usuarios de prueba
  const testUsers = [
    {
      name: 'Angel Sabelle',
      email: 'angel@levelupgamer.cl',
      password: '123456',
      level: 25,
      coins: 2500,
      isDuocUser: false
    },
    {
      name: 'Gaming Pro',
      email: 'pro@levelupgamer.cl', 
      password: 'gamer123',
      level: 50,
      coins: 5000,
      isDuocUser: false
    },
    {
      name: 'Test User',
      email: 'test@duocuc.cl',
      password: 'test123',
      level: 10,
      coins: 1000,
      isDuocUser: true
    }
  ];
  
  setTimeout(() => {
    const user = testUsers.find(u => u.email === email && u.password === password);
    
    if (user) {
      // Login exitoso
      const sessionData = {
        ...user,
        loginTime: new Date().toISOString(),
        lastLogin: new Date().toLocaleString('es-CL'),
        rememberMe: rememberMe,
        sessionExpiry: rememberMe 
          ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
          : new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      };
      
      localStorage.setItem('levelup_session', JSON.stringify(sessionData));
      localStorage.setItem('levelup_user', JSON.stringify(user));
      
      showNotification(`¡Bienvenido de vuelta, ${user.name}! 🎮`, 'success');
      
      // Cerrar modal
      document.getElementById('login-modal').classList.remove('active');
      document.body.style.overflow = '';
      
      // Actualizar UI
      updateLoginInterface(sessionData);
      
    } else {
      showNotification('❌ Credenciales incorrectas', 'error');
    }
    
    submitButton.disabled = false;
    submitButton.textContent = 'Iniciar Sesión';
  }, 1500);
}

function updateLoginInterface(sessionData) {
  const loginButton = document.getElementById('login-button');
  const registerButton = document.getElementById('register-button');
  
  if (loginButton) {
    loginButton.textContent = `👤 ${sessionData.name}`;
    loginButton.title = sessionData.isDuocUser 
      ? 'Usuario Duoc UC - 20% descuento - Click para perfil' 
      : 'Usuario Level-Up Gamer - Click para perfil';
    
    // Cambiar funcionalidad a mostrar menú de usuario
    const newLoginButton = loginButton.cloneNode(true);
    loginButton.parentNode.replaceChild(newLoginButton, loginButton);
    
    newLoginButton.addEventListener('click', () => showUserMenu(sessionData));
  }
  
  if (registerButton) {
    registerButton.style.display = 'none';
  }
}

function showUserMenu(sessionData) {
  const choice = prompt(`Hola ${sessionData.name}!\n\nSelecciona una opción:\n1. Mi Perfil\n2. Mis Pedidos\n3. Mis Puntos (${sessionData.coins})\n4. Configuración\n5. Cerrar Sesión\n\nIngresa el número (1-5):`);
  
  switch(choice) {
    case '1':
      showNotification('🎯 Función Mi Perfil - Próximamente');
      break;
    case '2':
      showNotification('🛒 Función Mis Pedidos - Próximamente'); 
      break;
    case '3':
      showNotification(`🎯 Tienes ${sessionData.coins} GamerCoins`);
      break;
    case '4':
      showNotification('⚙️ Función Configuración - Próximamente');
      break;
    case '5':
      logout();
      break;
  }
}

function logout() {
  localStorage.removeItem('levelup_session');
  localStorage.removeItem('levelup_user');
  
  const loginButton = document.getElementById('login-button');
  const registerButton = document.getElementById('register-button');
  
  if (loginButton) {
    loginButton.textContent = '🔑 Iniciar Sesión';
    loginButton.title = '';
    
    // Restaurar funcionalidad de login
    const newLoginButton = loginButton.cloneNode(true);
    loginButton.parentNode.replaceChild(newLoginButton, loginButton);
    
    newLoginButton.addEventListener('click', function(e) {
      e.preventDefault();
      const modal = document.getElementById('login-modal');
      if (modal) {
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        
        setTimeout(() => {
          document.getElementById('login-email')?.focus();
        }, 100);
      }
    });
  }
  
  if (registerButton) {
    registerButton.style.display = 'inline-flex';
    registerButton.textContent = '👤 Registrarse';
    registerButton.title = '';
  }
  
  showNotification('🚪 Sesión cerrada correctamente', 'info');
}

function checkActiveSession() {
  const sessionData = localStorage.getItem('levelup_session');
  if (sessionData) {
    const session = JSON.parse(sessionData);
    const now = new Date();
    const expiry = new Date(session.sessionExpiry);
    
    if (now < expiry) {
      updateLoginInterface(session);
    } else {
      localStorage.removeItem('levelup_session');
    }
  }
}

// ===================== SISTEMA DE REGISTRO =====================
function initRegistration() {
  const registerButton = document.getElementById('register-button');
  const modal = document.getElementById('register-modal');
  const form = document.getElementById('register-form');
  
  if (!registerButton || !modal || !form) return;
  
  registerButton.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    
    setTimeout(() => {
      const nameInput = document.getElementById('register-name');
      if (nameInput) nameInput.focus();
    }, 100);
  });
  
  setupModalClose(modal, 'register');
  form.addEventListener('submit', handleRegistration);
}

function handleRegistration(e) {
  e.preventDefault();
  
  const name = document.getElementById('register-name').value.trim();
  const email = document.getElementById('register-email').value.toLowerCase().trim();
  const password = document.getElementById('register-password').value;
  const confirmPassword = document.getElementById('register-confirm-password').value;
  const terms = document.getElementById('register-terms').checked;
  
  // Validaciones básicas
  if (!name || !email || !password || !confirmPassword || !terms) {
    showNotification('❌ Por favor completa todos los campos', 'error');
    return;
  }
  
  if (password !== confirmPassword) {
    showNotification('❌ Las contraseñas no coinciden', 'error');
    return;
  }
  
  if (password.length < 6) {
    showNotification('❌ La contraseña debe tener al menos 6 caracteres', 'error');
    return;
  }
  
  const submitButton = document.getElementById('submit-register');
  submitButton.disabled = true;
  submitButton.textContent = 'Registrando...';
  
  setTimeout(() => {
    const isDuocUser = email.includes('@duocuc.cl');
    
    const userData = {
      name: name,
      email: email,
      password: password,
      isDuocUser: isDuocUser,
      level: 1,
      coins: 100,
      registeredAt: new Date().toISOString()
    };
    
    localStorage.setItem('levelup_user', JSON.stringify(userData));
    
    const message = isDuocUser 
      ? `¡Bienvenido ${name}! Tu cuenta ha sido creada con 20% de descuento Duoc UC 🎉`
      : `¡Bienvenido ${name}! Tu cuenta ha sido creada exitosamente 🎮`;
    
    showNotification(message, 'success');
    
    // Cerrar modal
    document.getElementById('register-modal').classList.remove('active');
    document.body.style.overflow = '';
    
    submitButton.disabled = false;
    submitButton.textContent = 'Crear Cuenta';
  }, 2000);
}

// ===================== NOTIFICACIONES =====================
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: var(--accent);
    color: #000;
    padding: 1rem 1.5rem;
    border-radius: 8px;
    font-weight: 600;
    z-index: 10000;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    transform: translateX(400px);
    transition: transform 0.3s ease;
    max-width: 300px;
    word-wrap: break-word;
  `;
  
  // Colores según tipo
  if (type === 'success') {
    notification.style.background = '#00ff88';
    notification.style.color = '#000';
  } else if (type === 'error') {
    notification.style.background = '#ff0062';
    notification.style.color = '#fff';
  } else if (type === 'info') {
    notification.style.background = '#00d4ff';
    notification.style.color = '#000';
  }
  
  document.body.appendChild(notification);
  
  // Animar entrada
  setTimeout(() => {
    notification.style.transform = 'translateX(0)';
  }, 100);
  
  // Remover después de 3 segundos
  setTimeout(() => {
    notification.style.transform = 'translateX(400px)';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 3000);
}

// ===================== UTILIDADES GLOBALES =====================
window.GameStore = {
  addToCart,
  showCart,
  clearCart,
  updateCartCount
};

console.log('🎮 Script Level-Up Gamer cargado correctamente');
