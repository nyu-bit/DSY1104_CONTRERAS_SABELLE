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
// (Implementación completa al final del archivo)


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

// Datos mock de productos y reseñas
const PRODUCTS_DATA = {
  'rtx-gpu': {
    name: 'RTX Gaming GPU',
    icon: '⚡',
    reviews: [
      {
        id: 1,
        user: 'ProGamer_01',
        rating: 5,
        title: 'Increíble rendimiento para 4K',
        content: 'Esta GPU ha superado todas mis expectativas. Puedo jugar todos los juegos en 4K con ray tracing activado y mantengo más de 60 FPS. La temperatura se mantiene bien con un buen sistema de refrigeración. Vale cada peso.',
        date: '2024-11-15',
        recommend: true,
        helpful: 23,
        userVoted: false
      },
      {
        id: 2,
        user: 'TechReviewer',
        rating: 5,
        title: 'Perfecta para streaming y gaming',
        content: 'Uso esta tarjeta para streaming en Twitch mientras juego y funciona perfecto. El encoder NVENC es excelente y no afecta el rendimiento en juegos. Muy recomendada para creadores de contenido.',
        date: '2024-11-10',
        recommend: true,
        helpful: 18,
        userVoted: false
      },
      {
        id: 3,
        user: 'CasualGamer',
        rating: 4,
        title: 'Excelente pero cara',
        content: 'El rendimiento es fantástico, pero el precio es bastante alto. Si tienes el presupuesto, definitivamente vale la pena. Solo asegúrate de tener una buena fuente de poder.',
        date: '2024-11-05',
        recommend: true,
        helpful: 12,
        userVoted: false
      },
      {
        id: 4,
        user: 'GamerChile',
        rating: 5,
        title: 'La mejor inversión gaming',
        content: 'Después de años con una GPU antigua, esto es un salto gigantesco. Los gráficos se ven espectaculares y finalmente puedo disfrutar los juegos como se supone que deben verse.',
        date: '2024-10-28',
        recommend: true,
        helpful: 15,
        userVoted: false
      }
    ]
  },
  'headset-gaming': {
    name: 'Headset Gaming 7.1',
    icon: '🎧',
    reviews: [
      {
        id: 5,
        user: 'AudioPhile',
        rating: 4,
        title: 'Buen sonido pero micrófono mejorable',
        content: 'Los auriculares suenan muy bien para gaming, el sonido envolvente es convincente. Sin embargo, el micrófono podría ser mejor para streaming profesional.',
        date: '2024-11-12',
        recommend: true,
        helpful: 14,
        userVoted: false
      },
      {
        id: 6,
        user: 'FPSMaster',
        rating: 5,
        title: 'Perfectos para FPS competitivos',
        content: 'Puedo escuchar exactamente de dónde vienen los pasos enemigos. La calidad del audio para gaming competitivo es excelente. Muy cómodos para sesiones largas.',
        date: '2024-11-08',
        recommend: true,
        helpful: 19,
        userVoted: false
      },
      {
        id: 7,
        user: 'StreamerPro',
        rating: 3,
        title: 'Decentes pero hay mejores opciones',
        content: 'Para el precio están bien, pero si tienes un poco más de presupuesto, hay opciones mejores en el mercado. La comodidad es buena.',
        date: '2024-10-30',
        recommend: false,
        helpful: 8,
        userVoted: false
      }
    ]
  },
  'keyboard-rgb': {
    name: 'Mechanical Keyboard RGB',
    icon: '⌨️',
    reviews: [
      {
        id: 8,
        user: 'MechKeyboard_Fan',
        rating: 5,
        title: 'Switches Cherry MX son lo mejor',
        content: 'La sensación de escribir es increíble. Los switches Cherry MX Blue son perfectos para quien le gusta el click. Las luces RGB se ven espectaculares y son muy personalizables.',
        date: '2024-11-14',
        recommend: true,
        helpful: 21,
        userVoted: false
      },
      {
        id: 9,
        user: 'OfficeWorker',
        rating: 4,
        title: 'Bueno para trabajo y gaming',
        content: 'Lo uso tanto para trabajar como para jugar. Es cómodo para escribir mucho texto y los switches responden bien para gaming. Solo es un poco ruidoso para oficina.',
        date: '2024-11-06',
        recommend: true,
        helpful: 11,
        userVoted: false
      },
      {
        id: 10,
        user: 'RGBLover',
        rating: 4,
        title: 'Las luces RGB son increíbles',
        content: 'Los efectos de iluminación son muy buenos y personalizables. La calidad de construcción se siente sólida. Algunos teclas comenzaron a fallar después de 6 meses.',
        date: '2024-10-25',
        recommend: true,
        helpful: 9,
        userVoted: false
      }
    ]
  },
  'mouse-ultra': {
    name: 'Gaming Mouse Ultra',
    icon: '🖱️',
    reviews: [
      {
        id: 11,
        user: 'PrecisionGamer',
        rating: 5,
        title: 'Precisión perfecta para FPS',
        content: 'Los 16000 DPI son más que suficientes y la precisión es excelente. Los 8 botones programables son muy útiles para MMORPGs. Muy recomendado.',
        date: '2024-11-13',
        recommend: true,
        helpful: 17,
        userVoted: false
      },
      {
        id: 12,
        user: 'MMOPlayer',
        rating: 4,
        title: 'Excelente para MMO',
        content: 'Los botones laterales son perfectos para asignar habilidades en MMOs. El sensor es muy preciso y no hay lag perceptible.',
        date: '2024-11-09',
        recommend: true,
        helpful: 13,
        userVoted: false
      },
      {
        id: 13,
        user: 'ErgonomicsFirst',
        rating: 4,
        title: 'Cómodo para sesiones largas',
        content: 'La forma se adapta bien a mi mano y no me cansa después de horas de uso. La calidad de construcción es buena.',
        date: '2024-11-01',
        recommend: true,
        helpful: 10,
        userVoted: false
      }
    ]
  },
  'monitor-144hz': {
    name: 'Gaming Monitor 144Hz',
    icon: '🖥️',
    reviews: [
      {
        id: 14,
        user: 'CompetitiveGamer',
        rating: 4,
        title: 'Gran diferencia con 144Hz',
        content: 'Venir de 60Hz a 144Hz es un cambio enorme. Los juegos se sienten mucho más fluidos y responsive. La curva ayuda con la inmersión.',
        date: '2024-11-11',
        recommend: true,
        helpful: 16,
        userVoted: false
      },
      {
        id: 15,
        user: 'GraphicsDesigner',
        rating: 3,
        title: 'Bueno para gaming, regular para diseño',
        content: 'Para gaming está perfecto, pero los colores no son tan precisos para trabajo de diseño profesional. FreeSync funciona bien.',
        date: '2024-11-07',
        recommend: true,
        helpful: 7,
        userVoted: false
      },
      {
        id: 16,
        user: 'BudgetGamer',
        rating: 4,
        title: 'Buena relación calidad-precio',
        content: 'Para el precio que tiene, ofrece muy buenas características. El 144Hz se nota mucho y la calidad de imagen es decente.',
        date: '2024-10-29',
        recommend: true,
        helpful: 12,
        userVoted: false
      }
    ]
  }
};

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

// ===================== SISTEMA DE RESEÑAS =====================

let currentProductId = null;
let currentReviews = [];
let currentPage = 1;
const reviewsPerPage = 5;

function openProductReviews(productId) {
  currentProductId = productId;
  const product = PRODUCTS_DATA[productId];
  
  if (!product) {
    showNotification('❌ Producto no encontrado');
    return;
  }
  
  // Cargar reseñas del localStorage (combinar con mock)
  const savedReviews = JSON.parse(localStorage.getItem(`reviews_${productId}`) || '[]');
  currentReviews = [...product.reviews, ...savedReviews];
  
  // Configurar modal
  setupReviewsModal(product);
  
  // Abrir modal
  const modal = document.getElementById('reviews-modal');
  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  
  // Cargar contenido
  loadReviewsContent();
  
  // Event listeners para este modal
  initReviewsModalListeners();
}

function setupReviewsModal(product) {
  // Información del producto
  document.getElementById('review-product-icon').textContent = product.icon;
  document.getElementById('review-product-name').textContent = product.name;
  
  // Estadísticas
  const stats = calculateReviewStats(currentReviews);
  renderProductRating(stats);
  renderRatingDistribution(stats);
}

function calculateReviewStats(reviews) {
  if (reviews.length === 0) {
    return {
      average: 0,
      count: 0,
      distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    };
  }
  
  const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  let total = 0;
  
  reviews.forEach(review => {
    distribution[review.rating]++;
    total += review.rating;
  });
  
  return {
    average: total / reviews.length,
    count: reviews.length,
    distribution
  };
}

function renderProductRating(stats) {
  // Renderizar estrellas
  const starsContainer = document.getElementById('review-product-stars');
  starsContainer.innerHTML = generateStarsHTML(stats.average);
  
  // Mostrar promedio y count
  document.getElementById('review-rating-average').textContent = stats.average.toFixed(1);
  document.getElementById('review-rating-count').textContent = stats.count;
}

function renderRatingDistribution(stats) {
  const maxCount = Math.max(...Object.values(stats.distribution));
  
  [5, 4, 3, 2, 1].forEach(stars => {
    const bar = document.querySelector(`[data-stars="${stars}"]`);
    const count = stats.distribution[stars];
    const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0;
    
    bar.querySelector('.bar-fill').style.width = `${percentage}%`;
    bar.querySelector('.bar-count').textContent = count;
  });
}

function generateStarsHTML(rating) {
  let html = '';
  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      html += '<span class="star filled">★</span>';
    } else if (i - 0.5 <= rating) {
      html += '<span class="star half">★</span>';
    } else {
      html += '<span class="star">★</span>';
    }
  }
  return html;
}

function loadReviewsContent() {
  // Aplicar filtros y ordenamiento
  const filter = document.getElementById('reviews-filter').value;
  const sort = document.getElementById('reviews-sort').value;
  
  let filteredReviews = filterReviews(currentReviews, filter);
  filteredReviews = sortReviews(filteredReviews, sort);
  
  // Paginación
  const totalPages = Math.ceil(filteredReviews.length / reviewsPerPage);
  const startIndex = (currentPage - 1) * reviewsPerPage;
  const endIndex = startIndex + reviewsPerPage;
  const pageReviews = filteredReviews.slice(startIndex, endIndex);
  
  // Renderizar reseñas
  renderReviewsList(pageReviews);
  
  // Renderizar paginación
  renderPagination(totalPages);
}

function filterReviews(reviews, filter) {
  if (filter === 'all') return reviews;
  const rating = parseInt(filter);
  return reviews.filter(review => review.rating === rating);
}

function sortReviews(reviews, sort) {
  const sorted = [...reviews];
  
  switch (sort) {
    case 'newest':
      return sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
    case 'oldest':
      return sorted.sort((a, b) => new Date(a.date) - new Date(b.date));
    case 'highest':
      return sorted.sort((a, b) => b.rating - a.rating);
    case 'lowest':
      return sorted.sort((a, b) => a.rating - b.rating);
    case 'helpful':
      return sorted.sort((a, b) => b.helpful - a.helpful);
    default:
      return sorted;
  }
}

function renderReviewsList(reviews) {
  const container = document.getElementById('reviews-list');
  
  if (reviews.length === 0) {
    container.innerHTML = `
      <div class="no-reviews">
        <p>😔 No hay reseñas que coincidan con los filtros seleccionados.</p>
      </div>
    `;
    return;
  }
  
  container.innerHTML = reviews.map(review => `
    <div class="review-item" data-review-id="${review.id}">
      <div class="review-header">
        <div class="review-user">
          <div class="review-avatar">${review.user.charAt(0).toUpperCase()}</div>
          <div class="review-user-info">
            <div class="review-username">${review.user}</div>
            <div class="review-date">${formatDate(review.date)}</div>
          </div>
        </div>
        <div class="review-rating">
          ${generateStarsHTML(review.rating)}
        </div>
      </div>
      
      <div class="review-content">
        <div class="review-title">${review.title}</div>
        <div class="review-text">${review.content}</div>
        <div class="review-recommendation">
          ${review.recommend ? '👍 Recomenda este producto' : '👎 No recomienda este producto'}
        </div>
      </div>
      
      <div class="review-actions">
        <button class="review-helpful ${review.userVoted ? 'voted' : ''}" 
                onclick="toggleHelpful(${review.id})">
          👍 Útil (${review.helpful})
        </button>
      </div>
    </div>
  `).join('');
}

function renderPagination(totalPages) {
  const pagination = document.getElementById('reviews-pagination');
  
  if (totalPages <= 1) {
    pagination.style.display = 'none';
    return;
  }
  
  pagination.style.display = 'flex';
  document.getElementById('current-page').textContent = currentPage;
  document.getElementById('total-pages').textContent = totalPages;
  
  const prevBtn = document.getElementById('prev-reviews');
  const nextBtn = document.getElementById('next-reviews');
  
  prevBtn.disabled = currentPage === 1;
  nextBtn.disabled = currentPage === totalPages;
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-CL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

function toggleHelpful(reviewId) {
  const userData = JSON.parse(localStorage.getItem('levelup_user') || '{}');
  
  if (!userData.email) {
    showNotification('🔑 Inicia sesión para votar por la utilidad de las reseñas');
    return;
  }
  
  // Encontrar la reseña
  const review = currentReviews.find(r => r.id === reviewId);
  if (!review) return;
  
  // Toggle voto
  if (review.userVoted) {
    review.helpful--;
    review.userVoted = false;
    showNotification('❌ Voto removido');
  } else {
    review.helpful++;
    review.userVoted = true;
    showNotification('👍 ¡Gracias por tu voto!');
  }
  
  // Guardar en localStorage si es una reseña de usuario
  if (review.id > 1000) {
    saveUserReviews();
  }
  
  // Recargar contenido
  loadReviewsContent();
}

function initReviewsModalListeners() {
  // Filtros
  document.getElementById('reviews-filter').addEventListener('change', () => {
    currentPage = 1;
    loadReviewsContent();
  });
  
  document.getElementById('reviews-sort').addEventListener('change', () => {
    currentPage = 1;
    loadReviewsContent();
  });
  
  // Paginación
  document.getElementById('prev-reviews').addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      loadReviewsContent();
    }
  });
  
  document.getElementById('next-reviews').addEventListener('click', () => {
    const totalPages = Math.ceil(currentReviews.length / reviewsPerPage);
    if (currentPage < totalPages) {
      currentPage++;
      loadReviewsContent();
    }
  });
  
  // Escribir reseña
  document.getElementById('write-review-btn').addEventListener('click', openWriteReviewModal);
  
  // Cerrar modal
  const closeButtons = document.querySelectorAll('#reviews-modal .modal-close');
  closeButtons.forEach(btn => {
    btn.addEventListener('click', closeReviewsModal);
  });
  
  // Cerrar con ESC
  document.addEventListener('keydown', handleReviewsModalEsc);
  
  // Cerrar al hacer click fuera
  document.getElementById('reviews-modal').addEventListener('click', handleReviewsModalOutsideClick);
}

function openWriteReviewModal() {
  const userData = JSON.parse(localStorage.getItem('levelup_user') || '{}');
  
  if (!userData.email) {
    showNotification('🔑 Inicia sesión para escribir una reseña');
    return;
  }
  
  const product = PRODUCTS_DATA[currentProductId];
  if (!product) return;
  
  // Configurar modal
  document.getElementById('write-review-product-icon').textContent = product.icon;
  document.getElementById('write-review-product-name').textContent = product.name;
  
  // Limpiar formulario
  resetWriteReviewForm();
  
  // Abrir modal
  const modal = document.getElementById('write-review-modal');
  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');
  
  // Enfocar primera entrada
  document.getElementById('review-title').focus();
  
  // Event listeners
  initWriteReviewModalListeners();
}

function resetWriteReviewForm() {
  document.getElementById('review-form').reset();
  
  // Limpiar rating
  document.querySelectorAll('.star-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  document.getElementById('rating-label').textContent = 'Selecciona una calificación';
  
  // Limpiar contador de caracteres
  document.getElementById('char-count').textContent = '0';
  
  // Limpiar errores
  clearWriteReviewErrors();
}

function initWriteReviewModalListeners() {
  // Rating interactivo
  const starBtns = document.querySelectorAll('.star-btn');
  starBtns.forEach(btn => {
    btn.addEventListener('click', () => setRating(parseInt(btn.dataset.rating)));
    btn.addEventListener('mouseenter', () => previewRating(parseInt(btn.dataset.rating)));
  });
  
  document.getElementById('review-rating').addEventListener('mouseleave', resetRatingPreview);
  
  // Contador de caracteres
  document.getElementById('review-content').addEventListener('input', updateCharCount);
  
  // Envío del formulario
  document.getElementById('review-form').addEventListener('submit', handleSubmitReview);
  
  // Cancelar
  document.getElementById('cancel-review').addEventListener('click', closeWriteReviewModal);
  
  // Cerrar modal
  const closeButtons = document.querySelectorAll('#write-review-modal .modal-close');
  closeButtons.forEach(btn => {
    btn.addEventListener('click', closeWriteReviewModal);
  });
}

function setRating(rating) {
  // Actualizar visual
  const starBtns = document.querySelectorAll('.star-btn');
  starBtns.forEach((btn, index) => {
    btn.classList.toggle('active', index < rating);
  });
  
  // Actualizar label
  const labels = ['', 'Muy malo', 'Malo', 'Regular', 'Bueno', 'Excelente'];
  document.getElementById('rating-label').textContent = labels[rating];
  
  // Guardar valor
  document.getElementById('review-rating').dataset.rating = rating;
}

function previewRating(rating) {
  const starBtns = document.querySelectorAll('.star-btn');
  starBtns.forEach((btn, index) => {
    btn.style.color = index < rating ? '#ffd700' : '#666';
  });
}

function resetRatingPreview() {
  const currentRating = parseInt(document.getElementById('review-rating').dataset.rating || '0');
  const starBtns = document.querySelectorAll('.star-btn');
  starBtns.forEach((btn, index) => {
    btn.style.color = index < currentRating ? '#ffd700' : '#666';
  });
}

function updateCharCount() {
  const textarea = document.getElementById('review-content');
  const counter = document.getElementById('char-count');
  counter.textContent = textarea.value.length;
  
  if (textarea.value.length > 900) {
    counter.style.color = '#ef4444';
  } else {
    counter.style.color = 'var(--muted)';
  }
}

function handleSubmitReview(e) {
  e.preventDefault();
  
  if (!validateReviewForm()) {
    return;
  }
  
  // Mostrar loading
  const submitBtn = document.getElementById('submit-review');
  submitBtn.classList.add('loading');
  submitBtn.disabled = true;
  
  // Simular envío
  setTimeout(() => {
    const review = createReviewFromForm();
    saveReview(review);
    
    // Cerrar modal
    closeWriteReviewModal();
    
    // Actualizar lista de reseñas
    setupReviewsModal(PRODUCTS_DATA[currentProductId]);
    loadReviewsContent();
    
    // Notificación de éxito
    showNotification('✅ ¡Reseña publicada exitosamente!');
    
    // Otorgar puntos por escribir reseña
    addPoints(15, 'Reseña publicada');
    
    // Verificar logro de reseñas
    updateChallenge('review_challenge', 1);
    checkReviewAchievements();
    
    submitBtn.classList.remove('loading');
    submitBtn.disabled = false;
  }, 2000);
}

function validateReviewForm() {
  let isValid = true;
  clearWriteReviewErrors();
  
  // Validar rating
  const rating = parseInt(document.getElementById('review-rating').dataset.rating || '0');
  if (rating === 0) {
    showWriteReviewError('rating-error', 'Selecciona una calificación');
    isValid = false;
  }
  
  // Validar título
  const title = document.getElementById('review-title').value.trim();
  if (!title) {
    showWriteReviewError('title-error', 'El título es requerido');
    isValid = false;
  } else if (title.length < 5) {
    showWriteReviewError('title-error', 'El título debe tener al menos 5 caracteres');
    isValid = false;
  }
  
  // Validar contenido
  const content = document.getElementById('review-content').value.trim();
  if (!content) {
    showWriteReviewError('content-error', 'La reseña detallada es requerida');
    isValid = false;
  } else if (content.length < 20) {
    showWriteReviewError('content-error', 'La reseña debe tener al menos 20 caracteres');
    isValid = false;
  }
  
  return isValid;
}

function createReviewFromForm() {
  const userData = JSON.parse(localStorage.getItem('levelup_user') || '{}');
  
  return {
    id: Date.now(), // ID único basado en timestamp
    user: userData.name || 'Usuario Anónimo',
    rating: parseInt(document.getElementById('review-rating').dataset.rating),
    title: document.getElementById('review-title').value.trim(),
    content: document.getElementById('review-content').value.trim(),
    date: new Date().toISOString().split('T')[0], // Formato YYYY-MM-DD
    recommend: document.querySelector('input[name="recommend"]:checked').value === 'yes',
    helpful: 0,
    userVoted: false
  };
}

function saveReview(review) {
  // Agregar a la lista actual
  currentReviews.unshift(review); // Agregar al principio
  
  // Guardar en localStorage
  saveUserReviews();
}

function saveUserReviews() {
  // Guardar solo las reseñas de usuarios (ID > 1000)
  const userReviews = currentReviews.filter(review => review.id > 1000);
  localStorage.setItem(`reviews_${currentProductId}`, JSON.stringify(userReviews));
}

function checkReviewAchievements() {
  // Contar total de reseñas del usuario
  let totalUserReviews = 0;
  Object.keys(PRODUCTS_DATA).forEach(productId => {
    const reviews = JSON.parse(localStorage.getItem(`reviews_${productId}`) || '[]');
    totalUserReviews += reviews.length;
  });
  
  // Verificar logro de 10 reseñas
  if (totalUserReviews >= 10) {
    unlockAchievement('review_writer');
  }
}

function showWriteReviewError(elementId, message) {
  const errorElement = document.getElementById(elementId);
  errorElement.textContent = message;
}

function clearWriteReviewErrors() {
  const errorElements = document.querySelectorAll('#write-review-modal .error-message');
  errorElements.forEach(element => {
    element.textContent = '';
  });
}

function closeReviewsModal() {
  const modal = document.getElementById('reviews-modal');
  modal.classList.remove('active');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  
  // Limpiar listeners específicos
  document.removeEventListener('keydown', handleReviewsModalEsc);
}

function closeWriteReviewModal() {
  const modal = document.getElementById('write-review-modal');
  modal.classList.remove('active');
  modal.setAttribute('aria-hidden', 'true');
  resetWriteReviewForm();
}

function handleReviewsModalEsc(e) {
  if (e.key === 'Escape') {
    if (document.getElementById('write-review-modal').classList.contains('active')) {
      closeWriteReviewModal();
    } else if (document.getElementById('reviews-modal').classList.contains('active')) {
      closeReviewsModal();
    }
  }
}

function handleReviewsModalOutsideClick(e) {
  if (e.target === e.currentTarget) {
    closeReviewsModal();
  }
}

// ===== Sistema de Carrito de Compras =====
let cart = JSON.parse(localStorage.getItem('levelUpCart')) || [];

// Definición de productos disponibles
const products = [
    { id: 1, name: 'Gaming Controller Pro', price: 89990, icon: '🎮', available: true },
    { id: 2, name: 'RTX Gaming GPU', price: 599990, icon: '⚡', available: true },
    { id: 3, name: 'Mechanical Keyboard RGB', price: 129990, icon: '⌨️', available: true },
    { id: 4, name: 'Gaming Mouse Pro', price: 79990, icon: '🖱️', available: true },
    { id: 5, name: 'Gaming Headset 7.1', price: 149990, icon: '🎧', available: true },
    { id: 6, name: 'Curved Gaming Monitor', price: 299990, icon: '🖥️', available: true }
];

// Cargar datos del carrito al iniciar
function initCart() {
    updateCartDisplay();
    updateCartBadge();
}

// Agregar producto al carrito
function addToCart(productId) {
    if (!isLoggedIn()) {
        showNotification('Debes iniciar sesión para agregar productos al carrito', 'error');
        showLogin();
        return;
    }

    // Buscar el producto
    const product = products.find(p => p.id === productId);
    if (!product || !product.available) {
        showNotification('Producto no disponible', 'error');
        return;
    }

    // Verificar si ya está en el carrito
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: productId,
            name: product.name,
            price: product.price,
            quantity: 1,
            icon: product.icon
        });
    }

    saveCart();
    updateCartDisplay();
    updateCartBadge();
    showNotification(`${product.name} agregado al carrito`, 'success');
}

// Remover producto del carrito
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartDisplay();
    updateCartBadge();
    showNotification('Producto removido del carrito', 'info');
}

// Actualizar cantidad de producto
function updateCartQuantity(productId, quantity) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        if (quantity <= 0) {
            removeFromCart(productId);
        } else {
            item.quantity = Math.min(quantity, 99); // Máximo 99
            saveCart();
            updateCartDisplay();
            updateCartBadge();
        }
    }
}

// Calcular descuentos aplicables
function calculateDiscounts() {
    if (!isLoggedIn()) return [];
    
    const user = getCurrentUser();
    const discounts = [];
    
    // Descuento por nivel
    const levelDiscount = Math.floor(user.level / 2) * 5; // 5% cada 2 niveles
    if (levelDiscount > 0) {
        discounts.push({
            type: 'level',
            label: `Descuento Nivel ${user.level}`,
            percentage: Math.min(levelDiscount, 25), // Máximo 25%
            icon: '🏆'
        });
    }
    
    // Descuento Duoc UC
    if (user.duocDiscount) {
        discounts.push({
            type: 'duoc',
            label: 'Descuento Duoc UC',
            percentage: 10,
            icon: '🎓'
        });
    }
    
    // Descuento por primera compra
    if (!user.hasPurchased) {
        discounts.push({
            type: 'first',
            label: 'Primera Compra',
            percentage: 5,
            icon: '🎉'
        });
    }
    
    return discounts;
}

// Calcular totales del carrito
function calculateCartTotals() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discounts = calculateDiscounts();
    
    let totalDiscount = 0;
    discounts.forEach(discount => {
        totalDiscount += (subtotal * discount.percentage / 100);
    });
    
    const total = Math.max(subtotal - totalDiscount, 0);
    const pointsToEarn = Math.floor(total / 1000); // 1 punto por cada $1000
    
    return {
        subtotal,
        discounts,
        totalDiscount,
        total,
        pointsToEarn
    };
}

// Actualizar visualización del carrito
function updateCartDisplay() {
    const cartModal = document.getElementById('cart-modal');
    const emptyCart = cartModal.querySelector('.empty-cart');
    const cartContent = cartModal.querySelector('.cart-content');
    
    if (cart.length === 0) {
        emptyCart.style.display = 'block';
        cartContent.style.display = 'none';
        return;
    }
    
    emptyCart.style.display = 'none';
    cartContent.style.display = 'block';
    
    // Actualizar items del carrito
    const cartItems = cartModal.querySelector('.cart-items');
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-icon">${item.icon}</div>
            <div class="cart-item-details">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">$${item.price.toLocaleString()}</div>
            </div>
            <div class="cart-item-controls">
                <div class="quantity-controls">
                    <button class="quantity-btn" onclick="updateCartQuantity(${item.id}, ${item.quantity - 1})" ${item.quantity <= 1 ? 'disabled' : ''}>-</button>
                    <input type="number" class="quantity-input" value="${item.quantity}" min="1" max="99" onchange="updateCartQuantity(${item.id}, parseInt(this.value))">
                    <button class="quantity-btn" onclick="updateCartQuantity(${item.id}, ${item.quantity + 1})" ${item.quantity >= 99 ? 'disabled' : ''}>+</button>
                </div>
                <button class="remove-item-btn" onclick="removeFromCart(${item.id})" title="Remover producto">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
    
    // Actualizar descuentos
    const totals = calculateCartTotals();
    const discountsSection = cartModal.querySelector('.cart-discounts');
    const discountList = discountsSection.querySelector('.discount-list');
    
    if (totals.discounts.length > 0) {
        discountsSection.style.display = 'block';
        discountList.innerHTML = totals.discounts.map(discount => `
            <div class="discount-item">
                <div class="discount-label">
                    <span>${discount.icon}</span>
                    <span>${discount.label} (${discount.percentage}%)</span>
                </div>
                <div class="discount-amount">-$${(totals.subtotal * discount.percentage / 100).toLocaleString()}</div>
            </div>
        `).join('');
    } else {
        discountsSection.style.display = 'none';
    }
    
    // Actualizar resumen
    const summary = cartModal.querySelector('.cart-summary');
    summary.innerHTML = `
        <div class="summary-row">
            <span>Subtotal:</span>
            <span>$${totals.subtotal.toLocaleString()}</span>
        </div>
        ${totals.totalDiscount > 0 ? `
        <div class="summary-row discount">
            <span>Descuentos:</span>
            <span>-$${totals.totalDiscount.toLocaleString()}</span>
        </div>
        ` : ''}
        <div class="summary-row total">
            <span>Total:</span>
            <span>$${totals.total.toLocaleString()}</span>
        </div>
        ${totals.pointsToEarn > 0 ? `
        <div class="points-earned">
            🌟 Ganarás ${totals.pointsToEarn} puntos con esta compra
        </div>
        ` : ''}
    `;
}

// Actualizar badge del carrito
function updateCartBadge() {
    const badge = document.querySelector('.cart-icon .badge');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    if (totalItems > 0) {
        badge.textContent = totalItems;
        badge.classList.remove('empty');
    } else {
        badge.classList.add('empty');
    }
}

// Mostrar carrito
function showCart() {
    updateCartDisplay();
    showModal('cart-modal');
}

// Proceder al checkout
function proceedToCheckout() {
    if (cart.length === 0) {
        showNotification('El carrito está vacío', 'error');
        return;
    }
    
    if (!isLoggedIn()) {
        showNotification('Debes iniciar sesión para continuar', 'error');
        showLogin();
        return;
    }
    
    // Actualizar resumen de la orden
    updateOrderSummary();
    hideModal('cart-modal');
    showModal('checkout-modal');
}

// Actualizar resumen de la orden en checkout
function updateOrderSummary() {
    const orderItems = document.querySelector('.order-items');
    const totals = calculateCartTotals();
    
    orderItems.innerHTML = cart.map(item => `
        <div class="order-item">
            <div class="order-item-info">
                <div class="order-item-icon">${item.icon}</div>
                <div class="order-item-details">
                    <div class="order-item-name">${item.name}</div>
                    <div class="order-item-quantity">Cantidad: ${item.quantity}</div>
                </div>
            </div>
            <div class="order-item-price">$${(item.price * item.quantity).toLocaleString()}</div>
        </div>
    `).join('');
    
    // Actualizar totales en checkout
    const checkoutSummary = document.querySelector('.checkout-summary');
    checkoutSummary.innerHTML = `
        <div class="summary-row">
            <span>Subtotal:</span>
            <span>$${totals.subtotal.toLocaleString()}</span>
        </div>
        ${totals.totalDiscount > 0 ? `
        <div class="summary-row discount">
            <span>Descuentos:</span>
            <span>-$${totals.totalDiscount.toLocaleString()}</span>
        </div>
        ` : ''}
        <div class="summary-row">
            <span>Envío:</span>
            <span id="shipping-cost">$0</span>
        </div>
        <div class="summary-row total">
            <span>Total:</span>
            <span id="final-total">$${totals.total.toLocaleString()}</span>
        </div>
    `;
}

// Manejar cambio de método de envío
function handleShippingChange() {
    const shippingMethod = document.querySelector('input[name="shipping"]:checked');
    const shippingCost = shippingMethod ? parseInt(shippingMethod.value) : 0;
    const totals = calculateCartTotals();
    const finalTotal = totals.total + shippingCost;
    
    document.getElementById('shipping-cost').textContent = shippingCost > 0 ? `$${shippingCost.toLocaleString()}` : 'Gratis';
    document.getElementById('final-total').textContent = `$${finalTotal.toLocaleString()}`;
}

// Manejar cambio de método de pago
function handlePaymentMethodChange() {
    const paymentMethod = document.querySelector('input[name="payment"]:checked');
    const cardDetails = document.getElementById('card-details');
    
    if (paymentMethod && paymentMethod.value === 'credit') {
        cardDetails.classList.remove('hidden');
        // Hacer campos requeridos
        cardDetails.querySelectorAll('input').forEach(input => {
            input.required = true;
        });
    } else {
        cardDetails.classList.add('hidden');
        // Quitar requerido
        cardDetails.querySelectorAll('input').forEach(input => {
            input.required = false;
        });
    }
}

// Validar formulario de checkout
function validateCheckoutForm() {
    const form = document.getElementById('checkout-form');
    const formData = new FormData(form);
    const errors = [];
    
    // Validar datos de envío
    if (!formData.get('full-name')) errors.push('Nombre completo es requerido');
    if (!formData.get('phone')) errors.push('Teléfono es requerido');
    if (!formData.get('address')) errors.push('Dirección es requerida');
    if (!formData.get('city')) errors.push('Ciudad es requerida');
    if (!formData.get('shipping')) errors.push('Método de envío es requerido');
    if (!formData.get('payment')) errors.push('Método de pago es requerido');
    
    // Validar datos de tarjeta si es pago con tarjeta
    if (formData.get('payment') === 'credit') {
        const cardNumber = formData.get('card-number');
        const cardExpiry = formData.get('card-expiry');
        const cardCvv = formData.get('card-cvv');
        
        if (!cardNumber || cardNumber.length < 16) errors.push('Número de tarjeta inválido');
        if (!cardExpiry || !/^\d{2}\/\d{2}$/.test(cardExpiry)) errors.push('Fecha de vencimiento inválida');
        if (!cardCvv || cardCvv.length < 3) errors.push('CVV inválido');
    }
    
    return errors;
}

// Procesar orden
async function processOrder() {
    const errors = validateCheckoutForm();
    if (errors.length > 0) {
        showNotification(errors.join('\n'), 'error');
        return;
    }
    
    const processBtn = document.getElementById('process-order-btn');
    const btnText = processBtn.querySelector('.btn-text');
    const btnLoading = processBtn.querySelector('.btn-loading');
    
    // Mostrar estado de carga
    processBtn.classList.add('loading');
    processBtn.disabled = true;
    
    try {
        // Simular procesamiento de pago
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Calcular totales finales
        const totals = calculateCartTotals();
        const shippingCost = parseInt(document.querySelector('input[name="shipping"]:checked').value) || 0;
        const finalTotal = totals.total + shippingCost;
        
        // Actualizar usuario
        const user = getCurrentUser();
        user.points += totals.pointsToEarn;
        user.hasPurchased = true;
        user.totalSpent = (user.totalSpent || 0) + finalTotal;
        
        // Subir de nivel si corresponde
        checkLevelUp(user);
        
        // Guardar usuario actualizado
        updateUserInStorage(user);
        
        // Limpiar carrito
        cart = [];
        saveCart();
        updateCartDisplay();
        updateCartBadge();
        
        // Cerrar modal
        hideModal('checkout-modal');
        
        // Mostrar confirmación
        showNotification(`¡Compra realizada con éxito! Has ganado ${totals.pointsToEarn} puntos`, 'success');
        
        // Actualizar interfaz de usuario
        updateUserInfo();
        
    } catch (error) {
        showNotification('Error al procesar el pago. Intenta nuevamente.', 'error');
    } finally {
        // Quitar estado de carga
        processBtn.classList.remove('loading');
        processBtn.disabled = false;
    }
}

// Limpiar carrito completo
function clearCart() {
    if (cart.length === 0) {
        showNotification('El carrito ya está vacío', 'info');
        return;
    }
    
    cart = [];
    saveCart();
    updateCartDisplay();
    updateCartBadge();
    showNotification('Carrito vaciado', 'info');
}

// Guardar carrito en localStorage
function saveCart() {
    localStorage.setItem('levelUpCart', JSON.stringify(cart));
}

// Cerrar modal de checkout
function closeCheckoutModal() {
    hideModal('checkout-modal');
}

// Formatear número de tarjeta
function formatCardNumber(input) {
    let value = input.value.replace(/\s/g, '').replace(/[^0-9]/gi, '');
    let formattedValue = value.match(/.{1,4}/g)?.join(' ') || '';
    input.value = formattedValue;
}

// Formatear fecha de vencimiento
function formatCardExpiry(input) {
    let value = input.value.replace(/\D/g, '');
    if (value.length >= 2) {
        value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    input.value = value;
}

// Event listeners para carrito
document.addEventListener('DOMContentLoaded', function() {
    // Métodos de envío
    document.querySelectorAll('input[name="shipping"]').forEach(radio => {
        radio.addEventListener('change', handleShippingChange);
    });
    
    // Métodos de pago
    document.querySelectorAll('input[name="payment"]').forEach(radio => {
        radio.addEventListener('change', handlePaymentMethodChange);
    });
    
    // Formateo de tarjeta
    const cardNumber = document.getElementById('card-number');
    if (cardNumber) {
        cardNumber.addEventListener('input', function() {
            formatCardNumber(this);
        });
    }
    
    const cardExpiry = document.getElementById('card-expiry');
    if (cardExpiry) {
        cardExpiry.addEventListener('input', function() {
            formatCardExpiry(this);
        });
    }
    
    // Inicializar carrito
    initCart();
    
    // Inicializar sistema existente
    updateUserInfo();
    updateLevelDisplay();
    loadReviews();
    updateProductDisplays();
    loadNews();
    initEvents();
});

// ===== Sistema de Noticias Gaming =====

// Datos de noticias
const newsData = [
    {
        id: 1,
        title: "Nuevo RTX 5090 revoluciona el gaming en 8K",
        excerpt: "NVIDIA presenta su nueva arquitectura Blackwell con capacidades nunca antes vistas para gaming en resoluciones extremas y ray tracing avanzado.",
        content: `<p>NVIDIA ha presentado oficialmente su nueva tarjeta gráfica RTX 5090, que promete revolucionar el mundo del gaming con capacidades nunca antes vistas para jugar en resoluciones 8K.</p>
        
        <h3>Características principales:</h3>
        <ul>
            <li><strong>Arquitectura Blackwell:</strong> Nueva arquitectura de 3nm con 24,576 núcleos CUDA</li>
            <li><strong>Memoria GDDR7:</strong> 32GB de VRAM con ancho de banda de 1.5TB/s</li>
            <li><strong>Ray Tracing 4.0:</strong> Nueva generación de ray tracing en tiempo real</li>
            <li><strong>DLSS 4.0:</strong> IA mejorada para upscaling hasta 8K nativos</li>
        </ul>
        
        <p>Los benchmarks iniciales muestran un rendimiento 85% superior al RTX 4090 en resoluciones 4K, y es la primera GPU capaz de mantener 60 FPS estables en 8K con ray tracing activado.</p>
        
        <p>El precio de lanzamiento será de $1,999 USD y estará disponible a partir del 15 de octubre de 2025.</p>`,
        category: "LANZAMIENTOS",
        date: "2025-09-05",
        image: "🚀",
        views: 2500,
        likes: 342,
        featured: true
    },
    {
        id: 2,
        title: "Campeonato Mundial de LoL Chile 2025",
        excerpt: "Se anuncian las fechas oficiales del torneo más importante de esports en Chile con premio de $100.000 USD.",
        content: `<p>Riot Games Chile ha anunciado oficialmente las fechas del Campeonato Mundial de League of Legends Chile 2025, el torneo de esports más importante del país.</p>
        
        <h3>Detalles del torneo:</h3>
        <ul>
            <li><strong>Fechas:</strong> Del 15 de noviembre al 8 de diciembre de 2025</li>
            <li><strong>Sede:</strong> Movistar Arena, Santiago</li>
            <li><strong>Premio total:</strong> $100.000 USD</li>
            <li><strong>Equipos participantes:</strong> 16 equipos clasificatorios</li>
        </ul>
        
        <p>Las inscripciones ya están abiertas y se realizarán clasificatorias regionales en Valparaíso, Concepción y Antofagasta.</p>`,
        category: "ESPORTS",
        date: "2025-09-04",
        image: "🎮",
        views: 1800,
        likes: 256,
        featured: false
    },
    {
        id: 3,
        title: "AMD Ryzen 8000: El futuro del gaming",
        excerpt: "Nuevos procesadores prometen 40% más rendimiento en juegos con arquitectura de 3nm y soporte DDR6.",
        content: `<p>AMD ha revelado su nueva línea de procesadores Ryzen 8000, construidos con arquitectura Zen 5+ en proceso de 3nm, prometiendo un salto generacional en rendimiento gaming.</p>
        
        <h3>Innovaciones principales:</h3>
        <ul>
            <li><strong>Arquitectura Zen 5+:</strong> Nuevo diseño de núcleos con IPC mejorado en 25%</li>
            <li><strong>Soporte DDR6:</strong> Primera plataforma en soportar memoria DDR6-6400</li>
            <li><strong>Cache 3D V-Cache Gen 3:</strong> Hasta 192MB de cache L3</li>
            <li><strong>Eficiencia energética:</strong> 40% menos consumo que generación anterior</li>
        </ul>
        
        <p>El modelo tope de gama Ryzen 9 8950X3D promete superar al Intel Core i9-14900K en un 40% en gaming y 30% en productividad.</p>`,
        category: "HARDWARE",
        date: "2025-09-03",
        image: "⚡",
        views: 3100,
        likes: 445,
        featured: false
    },
    {
        id: 4,
        title: "Review: Steam Deck OLED 2025",
        excerpt: "Analizamos la nueva versión de la consola portátil de Valve con pantalla OLED y mejor rendimiento.",
        content: `<p>Valve ha lanzado la versión 2025 del Steam Deck con importantes mejoras, siendo la pantalla OLED su característica más destacada.</p>
        
        <h3>Mejoras principales:</h3>
        <ul>
            <li><strong>Pantalla OLED 7.4":</strong> 1200p con 120Hz y HDR10</li>
            <li><strong>APU personalizada:</strong> Zen 4 + RDNA 3 con 50% más rendimiento</li>
            <li><strong>Batería mejorada:</strong> 8-12 horas de autonomía</li>
            <li><strong>Almacenamiento rápido:</strong> SSD NVMe de hasta 2TB</li>
        </ul>
        
        <p>En nuestras pruebas, pudimos ejecutar Cyberpunk 2077 en configuración alta a 45-50 FPS estables, una mejora significativa respecto al modelo anterior.</p>
        
        <p><strong>Veredicto:</strong> 9/10 - La mejor consola portátil del mercado.</p>`,
        category: "REVIEWS",
        date: "2025-09-02",
        image: "🎯",
        views: 4200,
        likes: 678,
        featured: false
    },
    {
        id: 5,
        title: "Mega Sale Gaming: Hasta 70% descuento",
        excerpt: "Steam, Epic y GOG se unen en la mayor venta del año con descuentos históricos en los mejores juegos.",
        content: `<p>Las tres plataformas de gaming más importantes se han unido para ofrecer la mayor venta del año con descuentos de hasta 70% en miles de títulos.</p>
        
        <h3>Ofertas destacadas:</h3>
        <ul>
            <li><strong>Cyberpunk 2077:</strong> 60% descuento - $23.990</li>
            <li><strong>Red Dead Redemption 2:</strong> 67% descuento - $19.990</li>
            <li><strong>The Witcher 3 Complete:</strong> 70% descuento - $14.990</li>
            <li><strong>Grand Theft Auto V:</strong> 65% descuento - $13.990</li>
        </ul>
        
        <p>La venta estará disponible hasta el 15 de septiembre y incluye más de 5,000 títulos con descuentos especiales.</p>`,
        category: "OFERTAS",
        date: "2025-09-01",
        image: "🔥",
        views: 5700,
        likes: 892,
        featured: false
    },
    {
        id: 6,
        title: "The International 2025: Record de audiencia",
        excerpt: "El torneo de Dota 2 supera los 3 millones de espectadores simultáneos y establece nuevo récord mundial.",
        content: `<p>The International 2025, el torneo más importante de Dota 2, ha establecido un nuevo récord mundial de audiencia con más de 3.2 millones de espectadores simultáneos durante la gran final.</p>
        
        <h3>Datos del torneo:</h3>
        <ul>
            <li><strong>Prize pool:</strong> $47.8 millones USD</li>
            <li><strong>Audiencia pico:</strong> 3.2 millones de espectadores</li>
            <li><strong>Duración final:</strong> 5 horas y 23 minutos</li>
            <li><strong>Campeón:</strong> Team Spirit (segundo título)</li>
        </ul>
        
        <p>El evento superó todas las expectativas y consolida a Dota 2 como uno de los esports más importantes del mundo.</p>`,
        category: "COMPETITIVO",
        date: "2025-08-31",
        image: "🏆",
        views: 2900,
        likes: 534,
        featured: false
    }
];

let currentNewsPage = 1;
const newsPerPage = 6;

// Cargar noticias
function loadNews() {
    displayNews();
}

// Mostrar noticias en la página
function displayNews() {
    const newsGrid = document.getElementById('news-grid');
    if (!newsGrid) return;
    
    const startIndex = 0;
    const endIndex = currentNewsPage * newsPerPage;
    const newsToShow = newsData.slice(startIndex, endIndex);
    
    newsGrid.innerHTML = newsToShow.map(news => `
        <article class="news-card ${news.featured ? 'featured-news' : ''}" onclick="openNewsDetail(${news.id})">
            <div class="news-image">${news.image}</div>
            <div class="news-content">
                <div class="news-meta">
                    <span class="news-category">${news.category}</span>
                    <span class="news-date">${formatNewsDate(news.date)}</span>
                </div>
                <h3 class="news-title">${news.title}</h3>
                <p class="news-excerpt">${news.excerpt}</p>
                <div class="news-actions">
                    <button class="read-more-btn" onclick="event.stopPropagation(); openNewsDetail(${news.id})">Leer más</button>
                    <div class="news-stats">
                        <span>👁️ ${formatNumber(news.views)}</span>
                        <span>❤️ ${news.likes}</span>
                    </div>
                </div>
            </div>
        </article>
    `).join('');
    
    // Mostrar/ocultar botón "Cargar más"
    const loadMoreBtn = document.getElementById('load-more-news');
    if (loadMoreBtn) {
        loadMoreBtn.style.display = endIndex >= newsData.length ? 'none' : 'block';
    }
}

// Cargar más noticias
function loadMoreNews() {
    currentNewsPage++;
    displayNews();
    
    // Scroll suave a las nuevas noticias
    const lastNewsCard = document.querySelector('.news-card:last-child');
    if (lastNewsCard) {
        lastNewsCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Abrir detalle de noticia
function openNewsDetail(newsId) {
    const news = newsData.find(n => n.id === newsId);
    if (!news) return;
    
    // Crear modal de detalle de noticia
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
        <div class="modal-content news-detail-modal">
            <div class="modal-header">
                <h2>${news.title}</h2>
                <button class="close-btn" onclick="closeNewsDetail(this)">&times;</button>
            </div>
            <div class="modal-body">
                <div class="news-detail-meta">
                    <span class="news-category">${news.category}</span>
                    <span class="news-date">${formatNewsDate(news.date)}</span>
                    <div class="news-stats">
                        <span>👁️ ${formatNumber(news.views)}</span>
                        <span>❤️ ${news.likes}</span>
                    </div>
                </div>
                <div class="news-detail-image">${news.image}</div>
                <div class="news-detail-content">
                    ${news.content}
                </div>
                <div class="news-detail-actions">
                    <button class="btn-primary" onclick="likeNews(${news.id})">
                        ❤️ Me gusta (${news.likes})
                    </button>
                    <button class="btn-secondary" onclick="shareNews(${news.id})">
                        📤 Compartir
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Incrementar vistas
    news.views++;
    displayNews();
}

// Cerrar detalle de noticia
function closeNewsDetail(btn) {
    const modal = btn.closest('.modal');
    modal.remove();
}

// Dar like a noticia
function likeNews(newsId) {
    const news = newsData.find(n => n.id === newsId);
    if (!news) return;
    
    news.likes++;
    
    // Actualizar contador en el modal
    const likeBtn = document.querySelector(`button[onclick="likeNews(${newsId})"]`);
    if (likeBtn) {
        likeBtn.innerHTML = `❤️ Me gusta (${news.likes})`;
    }
    
    // Actualizar vista principal
    displayNews();
    
    showNotification('¡Te gusta esta noticia!', 'success');
}

// Compartir noticia
function shareNews(newsId) {
    const news = newsData.find(n => n.id === newsId);
    if (!news) return;
    
    if (navigator.share) {
        navigator.share({
            title: news.title,
            text: news.excerpt,
            url: window.location.href + `#news-${newsId}`
        });
    } else {
        // Fallback: copiar al portapapeles
        const url = window.location.href + `#news-${newsId}`;
        navigator.clipboard.writeText(url).then(() => {
            showNotification('Enlace copiado al portapapeles', 'success');
        });
    }
}

// Formatear fecha de noticia
function formatNewsDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CL', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });
}

// Formatear números grandes
function formatNumber(num) {
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

// ===== Sistema de Eventos Gaming =====

// Datos de eventos
const eventsData = [
    {
        id: 1,
        title: "Championship Gaming Santiago",
        description: "El torneo de esports más grande de Chile con múltiples categorías",
        type: "tournament",
        date: "2025-11-15",
        endDate: "2025-11-17",
        location: "Movistar Arena, Santiago",
        prize: "$50.000 USD",
        icon: "🏆",
        details: "Torneo con categorías de LoL, CS2, Valorant y FIFA. Transmisión en vivo y premios para los primeros 3 lugares de cada categoría."
    },
    {
        id: 2,
        title: "GameCon Chile 2025",
        description: "La convención de videojuegos más grande del país",
        type: "convention",
        date: "2025-11-22",
        endDate: "2025-11-24",
        location: "Centro de Convenciones, Valparaíso",
        attendees: "5,000+ asistentes esperados",
        icon: "🎮",
        details: "Exposición de los últimos videojuegos, competencias, stands de marcas, cosplay contest y charlas con desarrolladores."
    },
    {
        id: 3,
        title: "Tekken 8 Regional Cup",
        description: "Torneo regional de Tekken 8 con los mejores luchadores",
        type: "tournament",
        date: "2025-11-29",
        location: "UC Gaming Center, Santiago",
        prize: "$15.000 USD",
        icon: "⚔️",
        details: "Torneo eliminatorio con 64 participantes. Sistema de doble eliminación y transmisión profesional."
    },
    {
        id: 4,
        title: "Workshop: Desarrollo en Unity",
        description: "Aprende a crear videojuegos desde cero con Unity",
        type: "workshop",
        date: "2025-12-05",
        location: "Duoc UC, Viña del Mar",
        duration: "8 horas académicas",
        icon: "🎓",
        details: "Taller práctico donde aprenderás los fundamentos de Unity, programación en C# y desarrollo de mecánicas básicas de juego."
    },
    {
        id: 5,
        title: "Retro Gaming Meetup",
        description: "Encuentro de amantes de los videojuegos retro",
        type: "meetup",
        date: "2025-12-12",
        location: "Café Gamer, Concepción",
        attendees: "50 gamers máximo",
        icon: "🤝",
        details: "Tarde de juegos retro, intercambio de cartuchos, torneos de arcade y charlas sobre la historia del gaming."
    },
    {
        id: 6,
        title: "Anime & Gaming Expo Sur",
        description: "La convención de anime y gaming del sur de Chile",
        type: "convention",
        date: "2025-12-20",
        endDate: "2025-12-22",
        location: "Centro de Eventos, Temuco",
        special: "Invitados especiales de Japón",
        icon: "🌟",
        details: "Convención que combina anime y gaming con invitados especiales, concursos de cosplay, torneos y merchandise exclusivo."
    }
];

// Inicializar eventos
function initEvents() {
    setupEventFilters();
    setupViewToggle();
    setupMapInteraction();
}

// Configurar filtros de eventos
function setupEventFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remover active de todos los botones
            filterBtns.forEach(b => b.classList.remove('active'));
            // Agregar active al botón clickeado
            btn.classList.add('active');
            
            const filter = btn.getAttribute('data-filter');
            filterEvents(filter);
        });
    });
}

// Configurar toggle de vista
function setupViewToggle() {
    const viewBtns = document.querySelectorAll('.view-btn');
    
    viewBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remover active de todos los botones
            viewBtns.forEach(b => b.classList.remove('active'));
            // Agregar active al botón clickeado
            btn.classList.add('active');
            
            const view = btn.getAttribute('data-view');
            toggleEventView(view);
        });
    });
}

// Configurar interacción del mapa
function setupMapInteraction() {
    const eventMarkers = document.querySelectorAll('.event-marker');
    const tooltip = document.getElementById('tooltip');
    
    eventMarkers.forEach(marker => {
        marker.addEventListener('mouseenter', (e) => {
            const eventId = parseInt(marker.getAttribute('data-event'));
            const event = eventsData.find(ev => ev.id === eventId);
            
            if (event) {
                showEventTooltip(e, event, tooltip);
            }
        });
        
        marker.addEventListener('mouseleave', () => {
            hideEventTooltip(tooltip);
        });
        
        marker.addEventListener('click', () => {
            const eventId = parseInt(marker.getAttribute('data-event'));
            showEventDetail(eventId);
        });
    });
}

// Filtrar eventos
function filterEvents(filter) {
    const eventCards = document.querySelectorAll('.event-card');
    const eventMarkers = document.querySelectorAll('.event-marker');
    
    eventCards.forEach(card => {
        if (filter === 'all' || card.classList.contains(filter)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
    
    eventMarkers.forEach(marker => {
        if (filter === 'all' || marker.classList.contains(filter)) {
            marker.style.display = 'block';
        } else {
            marker.style.display = 'none';
        }
    });
}

// Cambiar vista (mapa/lista)
function toggleEventView(view) {
    const mapView = document.getElementById('map-view');
    const listView = document.getElementById('list-view');
    
    if (view === 'map') {
        mapView.style.display = 'block';
        listView.style.display = 'none';
    } else {
        mapView.style.display = 'none';
        listView.style.display = 'block';
    }
}

// Mostrar tooltip del evento en el mapa
function showEventTooltip(e, event, tooltip) {
    const titleEl = tooltip.querySelector('.tooltip-title');
    const dateEl = tooltip.querySelector('.tooltip-date');
    const locationEl = tooltip.querySelector('.tooltip-location');
    
    titleEl.textContent = event.title;
    dateEl.textContent = formatEventDate(event.date, event.endDate);
    locationEl.textContent = event.location;
    
    tooltip.style.left = e.pageX + 10 + 'px';
    tooltip.style.top = e.pageY - 10 + 'px';
    tooltip.classList.add('show');
}

// Ocultar tooltip
function hideEventTooltip(tooltip) {
    tooltip.classList.remove('show');
}

// Mostrar detalle del evento
function showEventDetail(eventId) {
    const event = eventsData.find(e => e.id === eventId);
    if (!event) return;
    
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
        <div class="modal-content event-detail-modal">
            <div class="modal-header">
                <h2>${event.icon} ${event.title}</h2>
                <button class="close-btn" onclick="closeEventDetail(this)">&times;</button>
            </div>
            <div class="modal-body">
                <div class="event-detail-meta">
                    <span class="event-type ${event.type}">${event.type.toUpperCase()}</span>
                    <span class="event-date">${formatEventDate(event.date, event.endDate)}</span>
                </div>
                <div class="event-detail-content">
                    <p><strong>📍 Ubicación:</strong> ${event.location}</p>
                    ${event.prize ? `<p><strong>💰 Premio:</strong> ${event.prize}</p>` : ''}
                    ${event.attendees ? `<p><strong>👥 Asistentes:</strong> ${event.attendees}</p>` : ''}
                    ${event.duration ? `<p><strong>⏱️ Duración:</strong> ${event.duration}</p>` : ''}
                    ${event.special ? `<p><strong>✨ Especial:</strong> ${event.special}</p>` : ''}
                    
                    <h3>Descripción</h3>
                    <p>${event.description}</p>
                    
                    <h3>Detalles</h3>
                    <p>${event.details}</p>
                </div>
                <div class="event-detail-actions">
                    <button class="btn-primary" onclick="registerForEvent(${event.id})">
                        ${getEventActionText(event.type)}
                    </button>
                    <button class="btn-secondary" onclick="shareEvent(${event.id})">
                        📤 Compartir evento
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

// Cerrar detalle del evento
function closeEventDetail(btn) {
    const modal = btn.closest('.modal');
    modal.remove();
}

// Obtener texto del botón según tipo de evento
function getEventActionText(type) {
    switch(type) {
        case 'tournament': return '🏆 Inscribirse al torneo';
        case 'convention': return '🎫 Comprar entrada';
        case 'workshop': return '📚 Inscribirse al taller';
        case 'meetup': return '🤝 Unirse al meetup';
        default: return 'Participar';
    }
}

// Formatear fecha de evento
function formatEventDate(startDate, endDate) {
    const start = new Date(startDate);
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    
    if (endDate) {
        const end = new Date(endDate);
        if (start.getMonth() === end.getMonth()) {
            return `${start.getDate()}-${end.getDate()} ${start.toLocaleDateString('es-CL', { month: 'short', year: 'numeric' })}`;
        } else {
            return `${start.toLocaleDateString('es-CL', options)} - ${end.toLocaleDateString('es-CL', options)}`;
        }
    }
    
    return start.toLocaleDateString('es-CL', options);
}

// Funciones para acciones de eventos
function registerEvent(eventId) {
    if (!isLoggedIn()) {
        showNotification('Debes iniciar sesión para inscribirte', 'error');
        showLogin();
        return;
    }
    
    showNotification('¡Inscripción exitosa! Te contactaremos pronto', 'success');
    closeEventDetail(document.querySelector('.event-detail-modal .close-btn'));
}

function buyTicket(eventId) {
    if (!isLoggedIn()) {
        showNotification('Debes iniciar sesión para comprar entradas', 'error');
        showLogin();
        return;
    }
    
    showNotification('Redirigiendo a la compra de entradas...', 'info');
    closeEventDetail(document.querySelector('.event-detail-modal .close-btn'));
}

function registerWorkshop(eventId) {
    if (!isLoggedIn()) {
        showNotification('Debes iniciar sesión para inscribirte', 'error');
        showLogin();
        return;
    }
    
    showNotification('¡Inscripción al workshop exitosa!', 'success');
    closeEventDetail(document.querySelector('.event-detail-modal .close-btn'));
}

function joinMeetup(eventId) {
    if (!isLoggedIn()) {
        showNotification('Debes iniciar sesión para unirte', 'error');
        showLogin();
        return;
    }
    
    showNotification('¡Te has unido al meetup!', 'success');
    closeEventDetail(document.querySelector('.event-detail-modal .close-btn'));
}

function registerForEvent(eventId) {
    const event = eventsData.find(e => e.id === eventId);
    if (!event) return;
    
    switch(event.type) {
        case 'tournament':
            registerEvent(eventId);
            break;
        case 'convention':
            buyTicket(eventId);
            break;
        case 'workshop':
            registerWorkshop(eventId);
            break;
        case 'meetup':
            joinMeetup(eventId);
            break;
    }
}

function shareEvent(eventId) {
    const event = eventsData.find(e => e.id === eventId);
    if (!event) return;
    
    if (navigator.share) {
        navigator.share({
            title: event.title,
            text: event.description,
            url: window.location.href + `#event-${eventId}`
        });
    } else {
        const url = window.location.href + `#event-${eventId}`;
        navigator.clipboard.writeText(url).then(() => {
            showNotification('Enlace del evento copiado al portapapeles', 'success');
        });
    }
}
