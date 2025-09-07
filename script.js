// Carrusel Banner de Promociones
document.addEventListener('DOMContentLoaded', function() {
  const slides = document.querySelectorAll('.promo-slide');
  const leftBtn = document.querySelector('.promo-arrow.left');
  const rightBtn = document.querySelector('.promo-arrow.right');
  let current = 0;

  function showSlide(idx) {
    slides.forEach((slide, i) => {
      slide.style.display = (i === idx) ? 'flex' : 'none';
    });
  }

  leftBtn.addEventListener('click', () => {
    current = (current - 1 + slides.length) % slides.length;
    showSlide(current);
  });
  rightBtn.addEventListener('click', () => {
    current = (current + 1) % slides.length;
    showSlide(current);
  });

  // Auto-carrusel cada 6 segundos
  setInterval(() => {
    current = (current + 1) % slides.length;
    showSlide(current);
  }, 6000);

  showSlide(current);
});
// ===================== FUNCIONES BÁSICAS PARA EL TEMA GAMER =====================
document.addEventListener('DOMContentLoaded', function() {
  // Asegurar que el tema gamer esté aplicado
  document.documentElement.setAttribute('data-theme', 'gamer');
  
  // Inicializar funcionalidades
  initMobileMenu();
  initCart();
  initProductInteractions();
  initRegistration();
  initLogin();
  initProfile();
  initProductFiltersAndSearch();
  
  console.log('Tema Level-Up Gamer cargado correctamente');
});

// ===================== MENÚ MÓVIL =====================
function initMobileMenu() {
  const navToggle = document.querySelector('.nav-toggle');
  const drawer = document.querySelector('.drawer');
  
  if (navToggle && drawer) {
    navToggle.addEventListener('click', function() {
      drawer.classList.toggle('open');
    });
    
    // Cerrar drawer al hacer click fuera
    document.addEventListener('click', function(e) {
      if (!drawer.contains(e.target) && !navToggle.contains(e.target)) {
        drawer.classList.remove('open');
      }
    });
    
    // Cerrar drawer con tecla ESC
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && drawer.classList.contains('open')) {
        drawer.classList.remove('open');
      }
    });
  }
}

// ===================== CARRITO DE COMPRAS =====================
let cart = [];

function initCart() {
  updateCartCount();
  
  // Event listeners para botones de agregar al carrito
  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('card-button')) {
      const card = e.target.closest('.card');
      const product = {
        id: Date.now(), // ID simple para demo
        title: card.querySelector('.card-title').textContent,
        price: card.querySelector('.card-price').textContent,
        image: card.querySelector('.card-image').textContent
      };
      addToCart(product);
    }
  });
}

function addToCart(product) {
  cart.push(product);
  updateCartCount();
  showNotification(`${product.title} agregado al carrito`);
}

function updateCartCount() {
  const cartCount = document.getElementById('cart-count');
  if (cartCount) {
    cartCount.textContent = cart.length;
  }
}

function showNotification(message) {
  // Crear notificación temporal
  const notification = document.createElement('div');
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
    z-index: 1000;
    animation: slideIn 0.3s ease;
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.remove();
  }, 3000);
}

// ===================== INTERACCIONES DE PRODUCTOS =====================
// ===================== FILTROS Y BÚSQUEDA DE PRODUCTOS =====================
function initProductFiltersAndSearch() {
  const productos = [
    {
      id: 1,
      icon: '🎮',
      nombre: 'Gaming Controller Pro',
      precio: '$89.99',
      descripcion: 'Control inalámbrico premium con retroalimentación háptica avanzada',
      disponibilidad: 'stock',
      retiro: ['tienda', 'envio']
    },
    {
      id: 2,
      icon: '⚡',
      nombre: 'RTX Gaming GPU',
      precio: '$599.99',
      descripcion: 'Tarjeta gráfica de última generación para gaming en 4K',
      disponibilidad: 'stock',
      retiro: ['tienda', 'envio']
    },
    {
      id: 3,
      icon: '🎧',
      nombre: 'Headset Gaming 7.1',
      precio: '$149.99',
      descripcion: 'Auriculares con sonido envolvente y micrófono de calidad profesional',
      disponibilidad: 'stock',
      retiro: ['tienda', 'envio']
    },
    {
      id: 4,
      icon: '⌨️',
      nombre: 'Mechanical Keyboard RGB',
      precio: '$129.99',
      descripcion: 'Teclado mecánico con switches Cherry MX e iluminación RGB personalizable',
      disponibilidad: 'stock',
      retiro: ['tienda', 'envio']
    },
    {
      id: 5,
      icon: '🖱️',
      nombre: 'Gaming Mouse Ultra',
      precio: '$79.99',
      descripcion: 'Ratón de alta precisión con 16000 DPI y 8 botones programables',
      disponibilidad: 'stock',
      retiro: ['tienda', 'envio']
    },
    {
      id: 6,
      icon: '🖥️',
      nombre: 'Gaming Monitor 144Hz',
      precio: '$299.99',
      descripcion: 'Monitor curvo de 27" con 144Hz y tecnología FreeSync para gaming fluido',
      disponibilidad: 'stock',
      retiro: ['tienda', 'envio']
    }
  ];

  const grid = document.getElementById('featured-grid');
  const filtersPanel = document.getElementById('filters-panel');
  const searchInput = document.getElementById('quick-search');

  function renderProductos(list) {
      if (list.length === 0) {
        grid.innerHTML = `<div class="no-results"><span class="no-results-icon">😢</span><span class="no-results-text">No se encontraron productos</span></div>`;
      } else {
        grid.innerHTML = list.map(prod => `
          <article class="card producto" data-id="${prod.id}" style="animation:fadeIn .5s;">
            <div class="card-image">${prod.icon}</div>
            <div class="card-content">
              <h3 class="card-title producto-nombre">${prod.nombre}</h3>
              <div class="card-price">${prod.precio}</div>
              <p class="card-description">${prod.descripcion}</p>
              <button class="card-button">Agregar al Carrito</button>
              <label class="compare-checkbox">
                <input type="checkbox" class="compare-input" data-id="${prod.id}"> Comparar
              </label>
            </div>
          </article>
        `).join('');
      }
  }

  function getFiltros() {
    const disponibilidad = filtersPanel.querySelector('input[name="disponibilidad"]:checked').value;
    const retiro = Array.from(filtersPanel.querySelectorAll('input[name="retiro"]:checked')).map(cb => cb.value);
    return { disponibilidad, retiro };
  }

  function filtrarProductos() {
    const { disponibilidad, retiro } = getFiltros();
    const search = (searchInput.value || '').toLowerCase();
    let filtrados = productos.filter(prod => {
      // Filtro disponibilidad
      if (disponibilidad !== 'todos' && prod.disponibilidad !== disponibilidad) return false;
      // Filtro retiro
      if (!prod.retiro.some(r => retiro.includes(r))) return false;
      // Filtro búsqueda
      if (search && !prod.nombre.toLowerCase().includes(search) && !prod.descripcion.toLowerCase().includes(search)) return false;
      return true;
    });
    renderProductos(filtrados);
  }

  filtersPanel.addEventListener('change', filtrarProductos);
  searchInput.addEventListener('input', filtrarProductos);

  renderProductos(productos);
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
  container.innerHTML = categorias.map(cat => `
    <div class="tile" tabindex="0" aria-label="${cat.nombre}">
      <div class="tile-icon">${cat.icon}</div>
      <h3>${cat.nombre}</h3>
      <p>${cat.desc}</p>
    </div>
  `).join('');
  // Efectos y accesibilidad
  const tiles = container.querySelectorAll('.tile');
  tiles.forEach(tile => {
    tile.addEventListener('click', function() {
      const category = this.querySelector('h3').textContent;
      showNotification(`Navegando a ${category}`);
    });
    tile.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.click();
      }
    });
  });
}

function initProductInteractions() {
  // Efectos hover mejorados para las cards
  const cards = document.querySelectorAll('.card');
  cards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-8px) scale(1.02)';
    });
    card.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0) scale(1)';
    });
  });
  // Render dinámico de tiles de categorías
  renderCategoryTiles();
}

// ===================== ANIMACIONES CSS DINÁMICAS =====================
// Agregar estilos de animación al DOM
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  @keyframes fadeIn {
    from { opacity: 0; transform: scale(0.98); }
    to { opacity: 1; transform: scale(1); }
  }
  .card {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    animation: fadeIn .5s;
  }
  .tile {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .btn-icon {
    transition: all 0.2s ease;
  }
  .btn-icon:active {
    transform: scale(0.95);
  }
  .no-results {
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    background: linear-gradient(90deg, #181825 60%, #0f3460 100%);
    color: #39FF14; border-radius: 16px; min-height: 180px; font-size: 1.3rem;
    box-shadow: 0 0 24px #1E90FF33; margin: 2rem 0;
    animation: fadeIn .6s;
  }
  .no-results-icon {
    font-size: 3rem; margin-bottom: 1rem; text-shadow: 0 0 8px #1E90FF;
  }
  .no-results-text {
    font-family: 'Orbitron', 'Roboto', Arial, sans-serif;
    font-size: 1.2rem;
    color: #FFD700;
    text-shadow: 0 0 8px #39FF14;
  }
`;
document.head.appendChild(style);

// ===================== UTILIDADES =====================
function getCart() {
  return cart;
}

function clearCart() {
  cart = [];
  updateCartCount();
  showNotification('Carrito vaciado');
}

// Exponer funciones globalmente para uso en otros scripts
window.GameStore = {
  addToCart,
  getCart,
  clearCart,
  updateCartCount
};

// ===================== SISTEMA DE REGISTRO =====================
function initRegistration() {
  const registerButton = document.getElementById('register-button');
  const modal = document.getElementById('register-modal');
  const closeButton = modal.querySelector('.modal-close');
  const cancelButton = document.getElementById('cancel-register');
  const form = document.getElementById('register-form');
  
  // Abrir modal
  registerButton.addEventListener('click', () => {
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    document.getElementById('register-name').focus();
  });
  
  // Cerrar modal
  function closeModal() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    form.reset();
    clearErrors();
    hideDiscountPreview();
  }
  
  closeButton.addEventListener('click', closeModal);
  cancelButton.addEventListener('click', closeModal);
  
  // Cerrar con ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
  
  // Cerrar al hacer click fuera del modal
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });
  
  // Validación en tiempo real
  const emailInput = document.getElementById('register-email');
  const birthdateInput = document.getElementById('register-birthdate');
  
  emailInput.addEventListener('input', validateEmail);
  birthdateInput.addEventListener('change', validateAge);
  
  // Submit del formulario
  form.addEventListener('submit', handleRegistration);
}

function validateEmail() {
  const emailInput = document.getElementById('register-email');
  const email = emailInput.value.toLowerCase().trim();
  const discountPreview = document.getElementById('discount-preview');
  
  if (email.includes('@duocuc.cl')) {
    showDiscountPreview();
  } else {
    hideDiscountPreview();
  }
}

function validateAge() {
  const birthdateInput = document.getElementById('register-birthdate');
  const errorElement = document.getElementById('birthdate-error');
  const birthdate = new Date(birthdateInput.value);
  const today = new Date();
  const age = today.getFullYear() - birthdate.getFullYear();
  const monthDiff = today.getMonth() - birthdate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthdate.getDate())) {
    age--;
  }
  
  if (age < 18) {
    showError('birthdate-error', 'Debes ser mayor de 18 años para registrarte');
    birthdateInput.classList.add('error');
    return false;
  } else {
    clearError('birthdate-error');
    birthdateInput.classList.remove('error');
    return true;
  }
}

function showDiscountPreview() {
  const discountPreview = document.getElementById('discount-preview');
  discountPreview.style.display = 'block';
}

function hideDiscountPreview() {
  const discountPreview = document.getElementById('discount-preview');
  discountPreview.style.display = 'none';
}

function validateForm() {
  let isValid = true;
  clearErrors();
  
  // Validar nombre
  const name = document.getElementById('register-name').value.trim();
  if (!name) {
    showError('name-error', 'El nombre es requerido');
    document.getElementById('register-name').classList.add('error');
    isValid = false;
  } else if (name.length < 2) {
    showError('name-error', 'El nombre debe tener al menos 2 caracteres');
    document.getElementById('register-name').classList.add('error');
    isValid = false;
  }
  
  // Validar email
  const email = document.getElementById('register-email').value.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    showError('email-error', 'El correo electrónico es requerido');
    document.getElementById('register-email').classList.add('error');
    isValid = false;
  } else if (!emailRegex.test(email)) {
    showError('email-error', 'Ingresa un correo electrónico válido');
    document.getElementById('register-email').classList.add('error');
    isValid = false;
  }
  
  // Validar edad
  if (!validateAge()) {
    isValid = false;
  }
  
  // Validar contraseña
  const password = document.getElementById('register-password').value;
  if (!password) {
    showError('password-error', 'La contraseña es requerida');
    document.getElementById('register-password').classList.add('error');
    isValid = false;
  } else if (password.length < 8) {
    showError('password-error', 'La contraseña debe tener al menos 8 caracteres');
    document.getElementById('register-password').classList.add('error');
    isValid = false;
  }
  
  // Validar confirmación de contraseña
  const confirmPassword = document.getElementById('register-confirm-password').value;
  if (!confirmPassword) {
    showError('confirm-password-error', 'Confirma tu contraseña');
    document.getElementById('register-confirm-password').classList.add('error');
    isValid = false;
  } else if (password !== confirmPassword) {
    showError('confirm-password-error', 'Las contraseñas no coinciden');
    document.getElementById('register-confirm-password').classList.add('error');
    isValid = false;
  }
  
  // Validar términos
  const terms = document.getElementById('register-terms').checked;
  if (!terms) {
    showError('terms-error', 'Debes aceptar los términos y condiciones');
    isValid = false;
  }
  
  return isValid;
}

function handleRegistration(e) {
  e.preventDefault();
  
  if (!validateForm()) {
    return;
  }
  
  const submitButton = document.getElementById('submit-register');
  submitButton.classList.add('loading');
  submitButton.disabled = true;
  
  // Simular registro (en una aplicación real, esto sería una llamada a la API)
  setTimeout(() => {
    const email = document.getElementById('register-email').value.toLowerCase();
    const name = document.getElementById('register-name').value.trim();
    const isDuocUser = email.includes('@duocuc.cl');
    
    // Guardar usuario en localStorage (simulación)
    const userData = {
      name: name,
      email: email,
      isDuocUser: isDuocUser,
      discount: isDuocUser ? 20 : 0,
      registeredAt: new Date().toISOString()
    };
    
    localStorage.setItem('levelup_user', JSON.stringify(userData));
    
    // Mostrar mensaje de éxito
    const message = isDuocUser 
      ? `¡Bienvenido ${name}! Tu cuenta ha sido creada con 20% de descuento de por vida 🎉`
      : `¡Bienvenido ${name}! Tu cuenta ha sido creada exitosamente 🎮`;
    
    showNotification(message);
    
    // Cerrar modal
    document.getElementById('register-modal').classList.remove('active');
    document.body.style.overflow = '';
    
    // Actualizar UI
    updateUserInterface(userData);
    
    submitButton.classList.remove('loading');
    submitButton.disabled = false;
  }, 2000);
}

function updateUserInterface(userData) {
  const registerButton = document.getElementById('register-button');
  registerButton.textContent = `👤 ${userData.name}`;
  registerButton.title = userData.isDuocUser ? 'Usuario Duoc UC - 20% descuento' : 'Usuario registrado';
}

function showError(elementId, message) {
  const errorElement = document.getElementById(elementId);
  errorElement.textContent = message;
}

function clearError(elementId) {
  const errorElement = document.getElementById(elementId);
  errorElement.textContent = '';
  const inputElement = document.querySelector(`[aria-describedby*="${elementId}"]`);
  if (inputElement) {
    inputElement.classList.remove('error');
  }
}

function clearErrors() {
  const errorElements = document.querySelectorAll('.error-message');
  errorElements.forEach(element => {
    element.textContent = '';
  });
  const inputElements = document.querySelectorAll('input.error');
  inputElements.forEach(input => {
    input.classList.remove('error');
  });
}

// Verificar si hay usuario logueado al cargar la página
function checkExistingUser() {
  const userData = localStorage.getItem('levelup_user');
  if (userData) {
    const user = JSON.parse(userData);
    updateUserInterface(user);
    updateLoginInterface(user);
  }
}

// Llamar al verificar usuario existente
document.addEventListener('DOMContentLoaded', checkExistingUser);

// ===================== SISTEMA DE LOGIN =====================
function initLogin() {
  const loginButton = document.getElementById('login-button');
  const modal = document.getElementById('login-modal');
  const closeButton = modal.querySelector('.modal-close');
  const cancelButton = document.getElementById('cancel-login');
  const form = document.getElementById('login-form');
  const switchToRegister = document.getElementById('switch-to-register');
  
  // Abrir modal de login
  loginButton.addEventListener('click', () => {
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    document.getElementById('login-email').focus();
  });
  
  // Cerrar modal
  function closeLoginModal() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    form.reset();
    clearLoginErrors();
    hideUserPreview();
  }
  
  closeButton.addEventListener('click', closeLoginModal);
  cancelButton.addEventListener('click', closeLoginModal);
  
  // Cerrar con ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeLoginModal();
    }
  });
  
  // Cerrar al hacer click fuera del modal
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeLoginModal();
    }
  });
  
  // Cambiar a registro
  switchToRegister.addEventListener('click', (e) => {
    e.preventDefault();
    closeLoginModal();
    document.getElementById('register-button').click();
  });
  
  // Validación en tiempo real
  const emailInput = document.getElementById('login-email');
  emailInput.addEventListener('input', checkUserExists);
  
  // Submit del formulario
  form.addEventListener('submit', handleLogin);
}

function checkUserExists() {
  const emailInput = document.getElementById('login-email');
  const email = emailInput.value.toLowerCase().trim();
  const userPreview = document.getElementById('user-preview');
  
  if (email.length > 3) {
    // Simular verificación de usuario existente
    const existingUser = localStorage.getItem('levelup_user');
    if (existingUser) {
      const userData = JSON.parse(existingUser);
      if (userData.email.toLowerCase() === email) {
        showUserPreview(userData);
        return;
      }
    }
  }
  hideUserPreview();
}

function showUserPreview(userData) {
  const userPreview = document.getElementById('user-preview');
  const userName = userPreview.querySelector('.user-name');
  const userBenefits = userPreview.querySelector('.user-benefits');
  
  userName.textContent = userData.name;
  userBenefits.textContent = userData.isDuocUser 
    ? '🎉 Usuario Duoc UC - 20% descuento'
    : '🎮 Usuario Level-Up Gamer';
  
  userPreview.style.display = 'block';
}

function hideUserPreview() {
  const userPreview = document.getElementById('user-preview');
  userPreview.style.display = 'none';
}

function validateLoginForm() {
  let isValid = true;
  clearLoginErrors();
  
  // Validar email
  const email = document.getElementById('login-email').value.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    showLoginError('login-email-error', 'El correo electrónico es requerido');
    document.getElementById('login-email').classList.add('error');
    isValid = false;
  } else if (!emailRegex.test(email)) {
    showLoginError('login-email-error', 'Ingresa un correo electrónico válido');
    document.getElementById('login-email').classList.add('error');
    isValid = false;
  }
  
  // Validar contraseña
  const password = document.getElementById('login-password').value;
  if (!password) {
    showLoginError('login-password-error', 'La contraseña es requerida');
    document.getElementById('login-password').classList.add('error');
    isValid = false;
  }
  
  return isValid;
}

function handleLogin(e) {
  e.preventDefault();
  
  if (!validateLoginForm()) {
    return;
  }
  
  const submitButton = document.getElementById('submit-login');
  const email = document.getElementById('login-email').value.toLowerCase().trim();
  const password = document.getElementById('login-password').value;
  const rememberMe = document.getElementById('remember-me').checked;
  
  submitButton.classList.add('loading');
  submitButton.disabled = true;
  
  // Simular verificación de login (en una aplicación real sería una llamada a la API)
  setTimeout(() => {
    // Verificar si existe un usuario registrado
    const existingUser = localStorage.getItem('levelup_user');
    
    if (existingUser) {
      const userData = JSON.parse(existingUser);
      
      if (userData.email.toLowerCase() === email) {
        // Login exitoso
        const sessionData = {
          ...userData,
          loginTime: new Date().toISOString(),
          rememberMe: rememberMe,
          sessionExpiry: rememberMe 
            ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 días
            : new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 1 día
        };
        
        // Guardar sesión
        localStorage.setItem('levelup_session', JSON.stringify(sessionData));
        
        // Mostrar mensaje de éxito
        const message = `¡Bienvenido de vuelta, ${userData.name}! 🎮`;
        showNotification(message);
        
        // Cerrar modal
        document.getElementById('login-modal').classList.remove('active');
        document.body.style.overflow = '';
        
        // Actualizar UI
        updateLoginInterface(sessionData);
        
      } else {
        // Credenciales incorrectas
        showLoginError('login-password-error', 'Credenciales incorrectas');
        document.getElementById('login-password').classList.add('error');
      }
    } else {
      // Usuario no encontrado
      showLoginError('login-email-error', 'Usuario no encontrado. ¿Quieres registrarte?');
      document.getElementById('login-email').classList.add('error');
    }
    
    submitButton.classList.remove('loading');
    submitButton.disabled = false;
  }, 1500);
}

function updateLoginInterface(sessionData) {
  const loginButton = document.getElementById('login-button');
  const registerButton = document.getElementById('register-button');
  
  // Ocultar botones de login/registro y mostrar usuario logueado
  loginButton.style.display = 'none';
  registerButton.textContent = `👤 ${sessionData.name}`;
  registerButton.title = sessionData.isDuocUser 
    ? 'Usuario Duoc UC - 20% descuento' 
    : 'Usuario Level-Up Gamer';
  
  // Cambiar funcionalidad del botón a logout/perfil
  registerButton.onclick = () => showUserMenu(sessionData);
}

function showUserMenu(sessionData) {
  const options = [
    '🎮 Mi Perfil',
    '🛒 Mis Pedidos', 
    '🎯 Mis Puntos LevelUp',
    '⚙️ Configuración',
    '🚪 Cerrar Sesión'
  ];
  
  // Simulación simple con confirm (en una app real sería un dropdown)
  const choice = prompt(`Hola ${sessionData.name}!\n\nSelecciona una opción:\n1. Mi Perfil\n2. Mis Pedidos\n3. Mis Puntos\n4. Configuración\n5. Cerrar Sesión\n\nIngresa el número (1-5):`);
  
  switch(choice) {
    case '1':
      openProfileModal();
      break;
    case '5':
      logout();
      break;
    case '2':
      showNotification('🛒 Función Mis Pedidos - Próximamente'); 
      break;
    case '3':
      showNotification('🎯 Función Mis Puntos - Próximamente');
      break;
    case '4':
      showNotification('⚙️ Función Configuración - Próximamente');
      break;
    default:
      break;
  }
}

function logout() {
  localStorage.removeItem('levelup_session');
  localStorage.removeItem('levelup_user');
  
  // Restaurar interfaz original
  const loginButton = document.getElementById('login-button');
  const registerButton = document.getElementById('register-button');
  
  loginButton.style.display = 'inline-flex';
  registerButton.textContent = '👤 Registrarse';
  registerButton.title = '';
  registerButton.onclick = null;
  
  showNotification('🚪 Sesión cerrada correctamente');
}

function showLoginError(elementId, message) {
  const errorElement = document.getElementById(elementId);
  errorElement.textContent = message;
}

function clearLoginErrors() {
  const errorElements = document.querySelectorAll('#login-modal .error-message');
  errorElements.forEach(element => {
    element.textContent = '';
  });
  const inputElements = document.querySelectorAll('#login-modal input.error');
  inputElements.forEach(input => {
    input.classList.remove('error');
  });
}

// Verificar sesión activa al cargar
function checkActiveSession() {
  const sessionData = localStorage.getItem('levelup_session');
  if (sessionData) {
    const session = JSON.parse(sessionData);
    const now = new Date();
    const expiry = new Date(session.sessionExpiry);
    
    if (now < expiry) {
      // Sesión válida
      updateLoginInterface(session);
    } else {
      // Sesión expirada
      localStorage.removeItem('levelup_session');
    }
  }
}

// Verificar sesión al cargar la página
document.addEventListener('DOMContentLoaded', checkActiveSession);

// ===================== GESTIÓN DE PERFIL =====================
function initProfile() {
  const modal = document.getElementById('profile-modal');
  const closeButton = modal.querySelector('.modal-close');
  const cancelButton = document.getElementById('cancel-profile');
  const saveButton = document.getElementById('save-profile');
  const tabButtons = document.querySelectorAll('.tab-button');
  const forms = {
    profile: document.getElementById('profile-form'),
    preferences: document.getElementById('preferences-form'),
    security: document.getElementById('security-form')
  };
  
  // Cerrar modal
  function closeProfileModal() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    clearProfileErrors();
  }
  
  closeButton.addEventListener('click', closeProfileModal);
  cancelButton.addEventListener('click', closeProfileModal);
  
  // Cerrar con ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeProfileModal();
    }
  });
  
  // Cerrar al hacer click fuera del modal
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeProfileModal();
    }
  });
  
  // Gestión de pestañas
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const targetTab = button.dataset.tab;
      switchTab(targetTab);
    });
  });
  
  // Guardar cambios
  saveButton.addEventListener('click', saveProfile);
  
  // Cambio de contraseña
  forms.security.addEventListener('submit', handlePasswordChange);
  
  // Cerrar todas las sesiones
  document.getElementById('logout-all-sessions').addEventListener('click', logoutAllSessions);
}

function openProfileModal() {
  const modal = document.getElementById('profile-modal');
  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  
  // Cargar datos del usuario
  loadUserProfile();
  
  // Enfocar en el primer campo
  document.getElementById('profile-name').focus();
}

function switchTab(tabName) {
  // Actualizar botones
  document.querySelectorAll('.tab-button').forEach(btn => {
    btn.classList.remove('active');
  });
  document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
  
  // Actualizar contenido
  document.querySelectorAll('.tab-pane').forEach(pane => {
    pane.classList.remove('active');
  });
  document.getElementById(`${tabName}-tab`).classList.add('active');
}

function loadUserProfile() {
  const sessionData = JSON.parse(localStorage.getItem('levelup_session') || '{}');
  const userData = JSON.parse(localStorage.getItem('levelup_user') || '{}');
  const profileData = JSON.parse(localStorage.getItem('levelup_profile') || '{}');
  
  // Cargar datos básicos
  document.getElementById('profile-name').value = userData.name || '';
  document.getElementById('profile-email').value = userData.email || '';
  document.getElementById('profile-phone').value = profileData.phone || '';
  document.getElementById('profile-birthdate').value = profileData.birthdate || '';
  document.getElementById('profile-address').value = profileData.address || '';
  
  // Cargar datos gamer
  document.getElementById('profile-gamertag').value = profileData.gamertag || '';
  document.getElementById('profile-platform').value = profileData.platform || '';
  
  // Cargar géneros favoritos
  const genres = profileData.genres || [];
  document.querySelectorAll('input[name="genres"]').forEach(checkbox => {
    checkbox.checked = genres.includes(checkbox.value);
  });
  
  // Cargar preferencias
  document.getElementById('currency-preference').value = profileData.currency || 'CLP';
  document.getElementById('budget-range').value = profileData.budget || '';
  document.getElementById('auto-recommendations').checked = profileData.autoRecommendations !== false;
  
  // Cargar preferencias de notificaciones
  document.getElementById('email-offers').checked = profileData.emailOffers !== false;
  document.getElementById('new-products').checked = profileData.newProducts !== false;
  document.getElementById('events-notifications').checked = profileData.events !== false;
  document.getElementById('order-updates').checked = profileData.orderUpdates !== false;
  
  // Cargar info de seguridad
  document.getElementById('two-factor').checked = profileData.twoFactor || false;
  document.getElementById('last-login').textContent = sessionData.loginTime ? 
    new Date(sessionData.loginTime).toLocaleDateString('es-CL') : 'Hoy';
}

function saveProfile() {
  const saveButton = document.getElementById('save-profile');
  saveButton.classList.add('loading');
  saveButton.disabled = true;
  
  // Recopilar datos del formulario
  const profileData = {
    // Datos básicos
    name: document.getElementById('profile-name').value.trim(),
    phone: document.getElementById('profile-phone').value.trim(),
    address: document.getElementById('profile-address').value.trim(),
    
    // Datos gamer
    gamertag: document.getElementById('profile-gamertag').value.trim(),
    platform: document.getElementById('profile-platform').value,
    genres: Array.from(document.querySelectorAll('input[name="genres"]:checked')).map(cb => cb.value),
    
    // Preferencias
    currency: document.getElementById('currency-preference').value,
    budget: document.getElementById('budget-range').value,
    autoRecommendations: document.getElementById('auto-recommendations').checked,
    
    // Notificaciones
    emailOffers: document.getElementById('email-offers').checked,
    newProducts: document.getElementById('new-products').checked,
    events: document.getElementById('events-notifications').checked,
    orderUpdates: document.getElementById('order-updates').checked,
    
    // Seguridad
    twoFactor: document.getElementById('two-factor').checked,
    
    // Metadata
    lastUpdated: new Date().toISOString()
  };
  
  // Validar datos básicos
  if (!profileData.name) {
    showProfileError('profile-name-error', 'El nombre es requerido');
    document.getElementById('profile-name').classList.add('error');
    saveButton.classList.remove('loading');
    saveButton.disabled = false;
    switchTab('personal');
    return;
  }
  
  // Simular guardado
  setTimeout(() => {
    // Actualizar datos del usuario
    const userData = JSON.parse(localStorage.getItem('levelup_user') || '{}');
    userData.name = profileData.name;
    localStorage.setItem('levelup_user', JSON.stringify(userData));
    
    // Guardar perfil
    localStorage.setItem('levelup_profile', JSON.stringify(profileData));
    
    // Actualizar interfaz
    updateUserInterface(userData);
    updateLoginInterface(userData);
    
    showNotification('✅ Perfil actualizado correctamente');
    
    // Cerrar modal
    document.getElementById('profile-modal').classList.remove('active');
    document.body.style.overflow = '';
    
    saveButton.classList.remove('loading');
    saveButton.disabled = false;
  }, 1500);
}

function handlePasswordChange(e) {
  e.preventDefault();
  
  const currentPassword = document.getElementById('current-password').value;
  const newPassword = document.getElementById('new-password').value;
  const confirmNewPassword = document.getElementById('confirm-new-password').value;
  const changeButton = document.getElementById('change-password-btn');
  
  // Validar campos
  clearProfileErrors();
  let isValid = true;
  
  if (!currentPassword) {
    showProfileError('current-password-error', 'Ingresa tu contraseña actual');
    isValid = false;
  }
  
  if (!newPassword) {
    showProfileError('new-password-error', 'Ingresa una nueva contraseña');
    isValid = false;
  } else if (newPassword.length < 8) {
    showProfileError('new-password-error', 'La contraseña debe tener al menos 8 caracteres');
    isValid = false;
  }
  
  if (!confirmNewPassword) {
    showProfileError('confirm-new-password-error', 'Confirma tu nueva contraseña');
    isValid = false;
  } else if (newPassword !== confirmNewPassword) {
    showProfileError('confirm-new-password-error', 'Las contraseñas no coinciden');
    isValid = false;
  }
  
  if (!isValid) return;
  
  changeButton.classList.add('loading');
  changeButton.disabled = true;
  
  // Simular cambio de contraseña
  setTimeout(() => {
    showNotification('🔒 Contraseña actualizada correctamente');
    
    // Limpiar campos
    document.getElementById('current-password').value = '';
    document.getElementById('new-password').value = '';
    document.getElementById('confirm-new-password').value = '';
    
    changeButton.classList.remove('loading');
    changeButton.disabled = false;
  }, 2000);
}

function logoutAllSessions() {
  if (confirm('¿Estás seguro de que quieres cerrar todas las sesiones? Tendrás que iniciar sesión nuevamente.')) {
    logout();
    showNotification('🚪 Todas las sesiones han sido cerradas');
  }
}

function showProfileError(elementId, message) {
  const errorElement = document.getElementById(elementId);
  if (errorElement) {
    errorElement.textContent = message;
  }
}

function clearProfileErrors() {
  const errorElements = document.querySelectorAll('#profile-modal .error-message');
  errorElements.forEach(element => {
    element.textContent = '';
  });
  const inputElements = document.querySelectorAll('#profile-modal input.error');
  inputElements.forEach(input => {
    input.classList.remove('error');
  });
}

// Widget FAQ flotante
const faqBtn = document.getElementById('faq-widget-btn');
const faqPanel = document.getElementById('faq-panel');
const faqClose = document.getElementById('faq-close');
const faqSearch = document.getElementById('faq-search');

if (faqBtn && faqPanel && faqClose) {
  faqBtn.addEventListener('click', function() {
    faqPanel.style.display = 'flex';
    faqPanel.style.animation = 'faq-slide-in 0.35s cubic-bezier(.68,-0.55,.27,1.55)';
    setTimeout(() => faqPanel.focus(), 200);
  });
  faqClose.addEventListener('click', function() {
    faqPanel.style.display = 'none';
    faqBtn.focus();
  });
  faqPanel.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      faqPanel.style.display = 'none';
      faqBtn.focus();
    }
  });
}

if (faqSearch) {
  faqSearch.addEventListener('input', function(e) {
    const query = e.target.value.toLowerCase();
    document.querySelectorAll('.faq-item').forEach(item => {
      const question = item.querySelector('.faq-question').textContent.toLowerCase();
      if (question.includes(query)) {
        item.style.display = '';
      } else {
        item.style.display = 'none';
      }
    });
  });
}

document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', function() {
    const answer = btn.nextElementSibling;
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', !expanded);
    if (expanded) {
      answer.hidden = true;
    } else {
      answer.hidden = false;
    }
  });
});
