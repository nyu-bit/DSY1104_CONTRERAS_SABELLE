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
  
  // Verificar si hay código de referido en la URL
  checkReferralCode();
  
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
    
    // Auto-llenar código de referido si hay uno pendiente
    const pendingCode = sessionStorage.getItem('pending_referral_code');
    if (pendingCode) {
      const referralInput = document.getElementById('register-referral-code');
      referralInput.value = pendingCode;
      validateReferralCode();
      sessionStorage.removeItem('pending_referral_code');
    }
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
  const referralCodeInput = document.getElementById('register-referral-code');
  
  emailInput.addEventListener('input', validateEmail);
  birthdateInput.addEventListener('change', validateAge);
  referralCodeInput.addEventListener('input', validateReferralCode);
  
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

function validateReferralCode() {
  const referralInput = document.getElementById('register-referral-code');
  const successElement = document.getElementById('referral-code-success');
  const errorElement = document.getElementById('referral-code-error');
  const code = referralInput.value.trim().toUpperCase();
  
  // Limpiar mensajes previos
  successElement.style.display = 'none';
  successElement.textContent = '';
  clearError('referral-code-error');
  referralInput.classList.remove('error', 'success');
  
  // Si no hay código, no mostrar nada
  if (!code) {
    return true;
  }
  
  // Lista de códigos válidos (en una app real vendría de la API)
  const validCodes = [
    { code: 'GAMER2024', points: 50, referrer: 'ProGamer_01' },
    { code: 'LEVELUP50', points: 50, referrer: 'ElitePlayer' },
    { code: 'NEWBIE', points: 25, referrer: 'StarterKit' },
    { code: 'ESPORTS', points: 75, referrer: 'ESports_Master' },
    { code: 'DUOCGAMER', points: 60, referrer: 'DuocUC_Gaming' }
  ];
  
  const validCode = validCodes.find(vc => vc.code === code);
  
  if (validCode) {
    // Código válido
    successElement.textContent = `¡Código válido! Recibirás ${validCode.points} puntos LevelUp de bienvenida`;
    successElement.style.display = 'block';
    referralInput.classList.add('success');
    
    // Guardar el código válido para usar en el registro
    referralInput.dataset.validCode = JSON.stringify(validCode);
    return true;
  } else {
    // Código inválido
    showError('referral-code-error', 'Código de referido no válido');
    referralInput.classList.add('error');
    referralInput.removeAttribute('data-valid-code');
    return false;
  }
}

function generateUserReferralCode(name) {
  // Generar código único basado en el nombre del usuario
  const nameCode = name.replace(/\s+/g, '').substring(0, 4).toUpperCase();
  const randomNum = Math.floor(Math.random() * 999) + 1;
  const paddedNum = randomNum.toString().padStart(3, '0');
  return `${nameCode}${paddedNum}`;
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
    const referralInput = document.getElementById('register-referral-code');
    
    // Procesar código de referido si es válido
    let referralBonus = null;
    if (referralInput.dataset.validCode) {
      referralBonus = JSON.parse(referralInput.dataset.validCode);
    }
    
    // Guardar usuario en localStorage (simulación)
    const userData = {
      name: name,
      email: email,
      isDuocUser: isDuocUser,
      discount: isDuocUser ? 20 : 0,
      levelUpPoints: referralBonus ? referralBonus.points : 0,
      referredBy: referralBonus ? referralBonus.referrer : null,
      referralCode: generateUserReferralCode(name),
      registeredAt: new Date().toISOString()
    };
    
    localStorage.setItem('levelup_user', JSON.stringify(userData));
    
    // Inicializar gamificación para nuevo usuario
    initializeUserGamification(userData);
    
    // Mostrar mensaje de éxito
    let message = `¡Bienvenido ${name}! Tu cuenta ha sido creada exitosamente 🎮`;
    
    if (isDuocUser && referralBonus) {
      message = `¡Bienvenido ${name}! Tienes 20% de descuento de por vida + ${referralBonus.points} puntos LevelUp 🎉🎁`;
    } else if (isDuocUser) {
      message = `¡Bienvenido ${name}! Tu cuenta ha sido creada con 20% de descuento de por vida 🎉`;
    } else if (referralBonus) {
      message = `¡Bienvenido ${name}! Has recibido ${referralBonus.points} puntos LevelUp de bienvenida �`;
    }
    
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
  
  // Actualizar indicador de nivel en navegación
  updateLevelDisplay(userData);
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
  
  // Funcionalidad de referidos
  initReferralFunctionality();
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
  
  // Cargar datos de referidos
  loadReferralData(userData);
  
  // Cargar datos de gamificación
  loadGamificationData(userData);
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

// ===================== FUNCIONALIDAD DE REFERIDOS =====================

function initReferralFunctionality() {
  // Event listeners para los botones de compartir
  document.getElementById('copy-referral-code').addEventListener('click', copyReferralCode);
  document.getElementById('share-whatsapp').addEventListener('click', shareViaWhatsApp);
  document.getElementById('share-email').addEventListener('click', shareViaEmail);
  document.getElementById('share-copy').addEventListener('click', copyReferralLink);
}

function loadReferralData(userData) {
  // Mostrar código de referido del usuario
  const referralCodeElement = document.getElementById('user-referral-code');
  referralCodeElement.textContent = userData.referralCode || 'ERROR';
  
  // Cargar estadísticas desde localStorage
  const referralStats = JSON.parse(localStorage.getItem('levelup_referral_stats') || '{}');
  const userEmail = userData.email;
  const userStats = referralStats[userEmail] || { totalReferrals: 0, earnedPoints: 0 };
  
  // Mostrar estadísticas
  document.getElementById('total-referrals').textContent = userStats.totalReferrals;
  document.getElementById('earned-points').textContent = userStats.earnedPoints;
  document.getElementById('current-points').textContent = userData.levelUpPoints || 0;
}

function copyReferralCode() {
  const codeElement = document.getElementById('user-referral-code');
  const code = codeElement.textContent;
  
  navigator.clipboard.writeText(code).then(() => {
    showNotification('¡Código copiado al portapapeles! 📋');
    
    // Efecto visual
    const button = document.getElementById('copy-referral-code');
    button.textContent = '✅';
    setTimeout(() => {
      button.textContent = '📋';
    }, 2000);
  }).catch(() => {
    // Fallback para navegadores que no soportan clipboard API
    const textArea = document.createElement('textarea');
    textArea.value = code;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    showNotification('¡Código copiado! 📋');
  });
}

function shareViaWhatsApp() {
  const code = document.getElementById('user-referral-code').textContent;
  const message = `¡Únete a Level-Up Gamer con mi código de referido! 🎮\n\nCódigo: ${code}\n\n¡Obtendrás 50 puntos LevelUp gratis al registrarte! 🎁\n\nEnlace: ${window.location.origin}`;
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
  window.open(whatsappUrl, '_blank');
}

function shareViaEmail() {
  const code = document.getElementById('user-referral-code').textContent;
  const subject = '¡Únete a Level-Up Gamer y gana puntos gratis! 🎮';
  const body = `¡Hola!

Te invito a unirte a Level-Up Gamer, la mejor tienda online para gamers 🎮

Usa mi código de referido: ${code}

🎁 Beneficios al registrarte:
- 50 puntos LevelUp gratis
- Acceso a ofertas exclusivas
- Si eres de Duoc UC: ¡20% de descuento de por vida!

👇 Regístrate aquí:
${window.location.origin}

¡Nos vemos en el gaming! 🚀`;

  const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.location.href = mailtoUrl;
}

function copyReferralLink() {
  const code = document.getElementById('user-referral-code').textContent;
  const link = `${window.location.origin}?ref=${code}`;
  
  navigator.clipboard.writeText(link).then(() => {
    showNotification('¡Enlace de referido copiado! 🔗');
    
    // Efecto visual
    const button = document.getElementById('share-copy');
    const originalText = button.textContent;
    button.textContent = '✅ Copiado';
    setTimeout(() => {
      button.textContent = originalText;
    }, 2000);
  }).catch(() => {
    // Fallback
    const textArea = document.createElement('textarea');
    textArea.value = link;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    showNotification('¡Enlace copiado! 🔗');
  });
}

// ===================== SISTEMA DE GAMIFICACIÓN =====================

// Definición de niveles
const LEVELS = [
  {
    level: 1,
    name: "Novato",
    icon: "🥉",
    pointsRequired: 0,
    pointsToNext: 100,
    benefits: [
      { icon: "🎮", title: "Bienvenida", description: "Acceso básico a la tienda" },
      { icon: "📧", title: "Newsletter", description: "Noticias y ofertas por email" }
    ]
  },
  {
    level: 2,
    name: "Explorador",
    icon: "🥈",
    pointsRequired: 100,
    pointsToNext: 250,
    benefits: [
      { icon: "💰", title: "Descuento 5%", description: "5% de descuento en compras" },
      { icon: "🚚", title: "Envío Express", description: "Envío prioritario gratis" },
      { icon: "🔔", title: "Alertas", description: "Notificaciones de ofertas flash" }
    ]
  },
  {
    level: 3,
    name: "Aventurero",
    icon: "🏅",
    pointsRequired: 350,
    pointsToNext: 500,
    benefits: [
      { icon: "💰", title: "Descuento 10%", description: "10% de descuento en compras" },
      { icon: "🎁", title: "Productos Exclusivos", description: "Acceso a productos beta" },
      { icon: "🏆", title: "Soporte VIP", description: "Chat prioritario 24/7" }
    ]
  },
  {
    level: 4,
    name: "Veterano",
    icon: "🎖️",
    pointsRequired: 850,
    pointsToNext: 1000,
    benefits: [
      { icon: "💰", title: "Descuento 15%", description: "15% de descuento en compras" },
      { icon: "🎮", title: "Early Access", description: "Acceso anticipado a lanzamientos" },
      { icon: "🛡️", title: "Garantía Extendida", description: "Garantía extendida gratis" },
      { icon: "🎫", title: "Eventos Exclusivos", description: "Invitaciones a eventos VIP" }
    ]
  },
  {
    level: 5,
    name: "Maestro",
    icon: "👑",
    pointsRequired: 1850,
    pointsToNext: 1500,
    benefits: [
      { icon: "💰", title: "Descuento 20%", description: "20% de descuento en compras" },
      { icon: "🌟", title: "Asesor Personal", description: "Asesor gaming personal" },
      { icon: "🎯", title: "Productos Personalizados", description: "Configuraciones a medida" },
      { icon: "🏆", title: "Comunidad Elite", description: "Acceso a foro exclusivo" }
    ]
  },
  {
    level: 6,
    name: "Leyenda",
    icon: "💎",
    pointsRequired: 3350,
    pointsToNext: null,
    benefits: [
      { icon: "💰", title: "Descuento 25%", description: "25% de descuento permanente" },
      { icon: "🎮", title: "Gaming Setup Gratis", description: "Setup gaming anual gratis" },
      { icon: "🌍", title: "Embajador", description: "Programa de embajadores" },
      { icon: "♾️", title: "Beneficios Ilimitados", description: "Acceso a todos los beneficios" }
    ]
  }
];

// Definición de logros
const ACHIEVEMENTS = [
  {
    id: "first_purchase",
    title: "Primera Compra",
    description: "Realiza tu primera compra",
    icon: "🛒",
    points: 25,
    unlocked: false
  },
  {
    id: "referral_master",
    title: "Maestro Referidor",
    description: "Refiere a 5 amigos",
    icon: "👥",
    points: 100,
    unlocked: false
  },
  {
    id: "big_spender",
    title: "Gran Comprador",
    description: "Gasta más de $500.000",
    icon: "💸",
    points: 200,
    unlocked: false
  },
  {
    id: "loyalty_champion",
    title: "Campeón de Lealtad",
    description: "6 meses como cliente activo",
    icon: "🏆",
    points: 150,
    unlocked: false
  },
  {
    id: "review_writer",
    title: "Crítico Experto",
    description: "Escribe 10 reseñas",
    icon: "✍️",
    points: 75,
    unlocked: false
  },
  {
    id: "social_sharer",
    title: "Influencer Social",
    description: "Comparte 20 productos",
    icon: "📱",
    points: 50,
    unlocked: false
  }
];

// Definición de desafíos
const CHALLENGES = [
  {
    id: "weekly_login",
    title: "Conexión Semanal",
    description: "Inicia sesión 7 días seguidos",
    icon: "📅",
    reward: 50,
    progress: 0,
    target: 7,
    active: true
  },
  {
    id: "monthly_purchase",
    title: "Comprador Mensual",
    description: "Realiza 3 compras este mes",
    icon: "🛍️",
    reward: 100,
    progress: 0,
    target: 3,
    active: true
  },
  {
    id: "review_challenge",
    title: "Desafío de Reseñas",
    description: "Escribe 5 reseñas esta semana",
    icon: "⭐",
    reward: 75,
    progress: 0,
    target: 5,
    active: true
  }
];

function checkReferralCode() {
  const urlParams = new URLSearchParams(window.location.search);
  const refCode = urlParams.get('ref');
  
  if (refCode) {
    // Guardar el código de referido en sessionStorage para usar durante el registro
    sessionStorage.setItem('pending_referral_code', refCode.toUpperCase());
    
    // Mostrar notificación
    showNotification(`¡Tienes un código de referido! Regístrate para obtener puntos gratis 🎁`);
    
    // Pre-llenar el campo de código de referido si el modal está abierto
    setTimeout(() => {
      const referralInput = document.getElementById('register-referral-code');
      if (referralInput) {
        referralInput.value = refCode.toUpperCase();
        validateReferralCode();
      }
    }, 500);
    
    // Limpiar la URL sin recargar la página
    const newUrl = window.location.origin + window.location.pathname;
    window.history.replaceState(null, '', newUrl);
  }
}

// ===================== FUNCIONES DE GAMIFICACIÓN =====================

function getUserLevel(points) {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (points >= LEVELS[i].pointsRequired) {
      return LEVELS[i];
    }
  }
  return LEVELS[0];
}

function getNextLevel(currentLevel) {
  const currentIndex = LEVELS.findIndex(level => level.level === currentLevel.level);
  return currentIndex < LEVELS.length - 1 ? LEVELS[currentIndex + 1] : null;
}

function calculateProgress(points, currentLevel, nextLevel) {
  if (!nextLevel) return { current: points, needed: points, percentage: 100 };
  
  const pointsInLevel = points - currentLevel.pointsRequired;
  const pointsNeededForNext = nextLevel.pointsRequired - currentLevel.pointsRequired;
  const percentage = Math.min((pointsInLevel / pointsNeededForNext) * 100, 100);
  
  return {
    current: pointsInLevel,
    needed: pointsNeededForNext,
    percentage: percentage
  };
}

function updateLevelDisplay(userData) {
  const points = userData.levelUpPoints || 0;
  const currentLevel = getUserLevel(points);
  const nextLevel = getNextLevel(currentLevel);
  const progress = calculateProgress(points, currentLevel, nextLevel);
  
  // Actualizar elementos del perfil
  document.getElementById('current-level-icon').textContent = currentLevel.icon;
  document.getElementById('current-level-name').textContent = currentLevel.name;
  document.getElementById('current-level-number').textContent = currentLevel.level;
  document.getElementById('current-points').textContent = points;
  
  // Actualizar progreso
  document.getElementById('progress-current').textContent = progress.current;
  document.getElementById('progress-needed').textContent = progress.needed;
  document.getElementById('progress-fill').style.width = `${progress.percentage}%`;
  
  if (nextLevel) {
    document.getElementById('next-level-icon').textContent = nextLevel.icon;
    document.getElementById('next-level-name').textContent = nextLevel.name;
  } else {
    document.getElementById('next-level-icon').textContent = '👑';
    document.getElementById('next-level-name').textContent = 'Nivel Máximo';
  }
  
  // Actualizar indicador de navegación
  const levelIndicator = document.getElementById('level-indicator');
  const navLevelIcon = document.getElementById('nav-level-icon');
  const navLevelNumber = document.getElementById('nav-level-number');
  const navLevelPoints = document.getElementById('nav-level-points');
  
  if (levelIndicator && navLevelIcon && navLevelNumber && navLevelPoints) {
    navLevelIcon.textContent = currentLevel.icon;
    navLevelNumber.textContent = currentLevel.level;
    navLevelPoints.textContent = `${points} pts`;
    levelIndicator.style.display = 'flex';
  }
}

function renderLevelsGrid() {
  const levelsGrid = document.getElementById('levels-grid');
  if (!levelsGrid) return;
  
  const userData = JSON.parse(localStorage.getItem('levelup_user') || '{}');
  const userPoints = userData.levelUpPoints || 0;
  const currentLevel = getUserLevel(userPoints);
  
  levelsGrid.innerHTML = '';
  
  LEVELS.forEach(level => {
    const isUnlocked = userPoints >= level.pointsRequired;
    const isCurrent = level.level === currentLevel.level;
    
    const levelElement = document.createElement('div');
    levelElement.className = `level-item ${isCurrent ? 'current' : isUnlocked ? 'unlocked' : 'locked'}`;
    
    const benefitsList = level.benefits.map(benefit => 
      `<li>${benefit.title}</li>`
    ).join('');
    
    levelElement.innerHTML = `
      <div class="level-item-header">
        <span class="level-item-icon">${level.icon}</span>
        <div class="level-item-info">
          <h5>${level.name}</h5>
          <div class="level-item-points">
            ${level.pointsRequired === 0 ? 'Inicial' : `${level.pointsRequired} puntos`}
          </div>
        </div>
      </div>
      <ul class="level-item-benefits">
        ${benefitsList}
      </ul>
    `;
    
    levelsGrid.appendChild(levelElement);
  });
}

function renderCurrentBenefits() {
  const benefitsContainer = document.getElementById('current-benefits');
  if (!benefitsContainer) return;
  
  const userData = JSON.parse(localStorage.getItem('levelup_user') || '{}');
  const userPoints = userData.levelUpPoints || 0;
  const currentLevel = getUserLevel(userPoints);
  
  benefitsContainer.innerHTML = '';
  
  currentLevel.benefits.forEach(benefit => {
    const benefitElement = document.createElement('div');
    benefitElement.className = 'benefit-card';
    benefitElement.innerHTML = `
      <span class="benefit-icon">${benefit.icon}</span>
      <div class="benefit-title">${benefit.title}</div>
      <div class="benefit-description">${benefit.description}</div>
    `;
    benefitsContainer.appendChild(benefitElement);
  });
}

function renderAchievements() {
  const achievementsGrid = document.getElementById('achievements-grid');
  if (!achievementsGrid) return;
  
  const userAchievements = JSON.parse(localStorage.getItem('levelup_achievements') || '[]');
  
  achievementsGrid.innerHTML = '';
  
  ACHIEVEMENTS.forEach(achievement => {
    const isUnlocked = userAchievements.includes(achievement.id);
    
    const achievementElement = document.createElement('div');
    achievementElement.className = `achievement-card ${isUnlocked ? 'unlocked' : 'locked'}`;
    achievementElement.innerHTML = `
      <span class="achievement-icon">${achievement.icon}</span>
      <div class="achievement-title">${achievement.title}</div>
      <div class="achievement-description">${achievement.description}</div>
    `;
    
    achievementsGrid.appendChild(achievementElement);
  });
}

function renderChallenges() {
  const challengesList = document.getElementById('challenges-list');
  if (!challengesList) return;
  
  const userChallenges = JSON.parse(localStorage.getItem('levelup_challenges') || '[]');
  
  challengesList.innerHTML = '';
  
  CHALLENGES.forEach(challenge => {
    const userChallenge = userChallenges.find(uc => uc.id === challenge.id) || challenge;
    const progressPercentage = (userChallenge.progress / userChallenge.target) * 100;
    
    const challengeElement = document.createElement('div');
    challengeElement.className = 'challenge-card';
    challengeElement.innerHTML = `
      <div class="challenge-header">
        <div class="challenge-info">
          <span class="challenge-icon">${challenge.icon}</span>
          <div>
            <div class="challenge-title">${challenge.title}</div>
            <div class="challenge-description">${challenge.description}</div>
          </div>
        </div>
        <div class="challenge-reward">+${challenge.reward} pts</div>
      </div>
      <div class="challenge-progress">
        <div class="challenge-progress-bar">
          <div class="challenge-progress-fill" style="width: ${progressPercentage}%"></div>
        </div>
        <div class="challenge-progress-text">
          ${userChallenge.progress} / ${userChallenge.target}
        </div>
      </div>
    `;
    
    challengesList.appendChild(challengeElement);
  });
}

function loadGamificationData(userData) {
  updateLevelDisplay(userData);
  renderLevelsGrid();
  renderCurrentBenefits();
  renderAchievements();
  renderChallenges();
}

function addPoints(points, reason = '') {
  const userData = JSON.parse(localStorage.getItem('levelup_user') || '{}');
  const currentPoints = userData.levelUpPoints || 0;
  const newPoints = currentPoints + points;
  
  // Verificar si subió de nivel
  const oldLevel = getUserLevel(currentPoints);
  const newLevel = getUserLevel(newPoints);
  
  // Actualizar puntos del usuario
  userData.levelUpPoints = newPoints;
  localStorage.setItem('levelup_user', JSON.stringify(userData));
  
  // Mostrar notificación
  if (newLevel.level > oldLevel.level) {
    showNotification(`🎉 ¡Felicidades! Has subido al nivel ${newLevel.level}: ${newLevel.name} ${newLevel.icon}`, 5000);
  } else if (points > 0) {
    showNotification(`+${points} puntos LevelUp${reason ? ` (${reason})` : ''} 🎁`);
  }
  
  // Actualizar display si está visible
  if (document.getElementById('profile-modal').classList.contains('active')) {
    loadGamificationData(userData);
  }
  
  // Actualizar indicador de navegación
  updateLevelDisplay(userData);
  
  return newLevel.level > oldLevel.level;
}

function unlockAchievement(achievementId) {
  const userAchievements = JSON.parse(localStorage.getItem('levelup_achievements') || '[]');
  
  if (!userAchievements.includes(achievementId)) {
    userAchievements.push(achievementId);
    localStorage.setItem('levelup_achievements', JSON.stringify(userAchievements));
    
    const achievement = ACHIEVEMENTS.find(a => a.id === achievementId);
    if (achievement) {
      showNotification(`🏅 ¡Logro desbloqueado! ${achievement.title}`, 4000);
      addPoints(achievement.points, 'Logro desbloqueado');
      return true;
    }
  }
  return false;
}

function updateChallenge(challengeId, increment = 1) {
  const userChallenges = JSON.parse(localStorage.getItem('levelup_challenges') || '[]');
  let challenge = userChallenges.find(c => c.id === challengeId);
  
  if (!challenge) {
    const defaultChallenge = CHALLENGES.find(c => c.id === challengeId);
    if (defaultChallenge) {
      challenge = { ...defaultChallenge, progress: 0 };
      userChallenges.push(challenge);
    } else {
      return false;
    }
  }
  
  challenge.progress = Math.min(challenge.progress + increment, challenge.target);
  
  // Verificar si completó el desafío
  if (challenge.progress >= challenge.target && challenge.active) {
    challenge.active = false;
    showNotification(`⚔️ ¡Desafío completado! ${challenge.title}`, 4000);
    addPoints(challenge.reward, 'Desafío completado');
  }
  
  localStorage.setItem('levelup_challenges', JSON.stringify(userChallenges));
  return true;
}

function initializeUserGamification(userData) {
  // Puntos de bienvenida base (25 puntos)
  const welcomePoints = 25;
  userData.levelUpPoints = (userData.levelUpPoints || 0) + welcomePoints;
  
  // Puntos adicionales si es usuario Duoc UC
  if (userData.isDuocUser) {
    userData.levelUpPoints += 25; // 25 puntos extra por ser de Duoc UC
  }
  
  // Actualizar localStorage
  localStorage.setItem('levelup_user', JSON.stringify(userData));
  
  // Desbloquear logro de primer registro (simulado)
  setTimeout(() => {
    unlockAchievement('first_purchase'); // Este se desbloqueará más tarde
    // Por ahora solo enviamos notificación de puntos de bienvenida
    const totalWelcomePoints = welcomePoints + (userData.isDuocUser ? 25 : 0);
    showNotification(`🎁 ¡${totalWelcomePoints} puntos LevelUp de bienvenida!`);
  }, 1000);
  
  // Inicializar desafíos activos
  const initialChallenges = CHALLENGES.map(challenge => ({
    ...challenge,
    progress: 0,
    active: true
  }));
  localStorage.setItem('levelup_challenges', JSON.stringify(initialChallenges));
  
  // Actualizar display si el perfil está abierto
  if (document.getElementById('profile-modal').classList.contains('active')) {
    loadGamificationData(userData);
  }
}
