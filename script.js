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
  
  // Efectos para las categorías
  const tiles = document.querySelectorAll('.tile');
  tiles.forEach(tile => {
    tile.addEventListener('click', function() {
      const category = this.querySelector('h3').textContent;
      showNotification(`Navegando a ${category}`);
    });
  });
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
  
  .card {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
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
    case '5':
      logout();
      break;
    case '1':
      showNotification('🎮 Función Mi Perfil - Próximamente');
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
