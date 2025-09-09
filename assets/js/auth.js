// ================================
// LEVEL-UP GAMER - AUTENTICACIÓN
// Gestión de login, registro y usuarios
// ================================

// Estado de autenticación
let authState = {
    isLoggedIn: false,
    currentUser: null,
    loginAttempts: 0,
    maxAttempts: 3,
    lockoutTime: 300000 // 5 minutos en ms
};

// Usuarios de prueba
const DEMO_USERS = {
    'admin@levelup.com': {
        password: 'admin123',
        user: {
            id: 1,
            name: 'Admin Gamer',
            email: 'admin@levelup.com',
            role: 'admin',
            gamertag: 'AdminMaster',
            platform: 'pc',
            level: 10,
            points: 5000,
            joinDate: '2020-01-01'
        }
    },
    'user@levelup.com': {
        password: 'user123',
        user: {
            id: 2,
            name: 'Usuario Gaming',
            email: 'user@levelup.com',
            role: 'user',
            gamertag: 'CasualGamer',
            platform: 'playstation',
            level: 5,
            points: 1250,
            joinDate: '2022-06-15'
        }
    },
    'gamer@levelup.com': {
        password: 'gamer123',
        user: {
            id: 3,
            name: 'Pro Gamer Elite',
            email: 'gamer@levelup.com',
            role: 'user',
            gamertag: 'ProElite2025',
            platform: 'pc',
            level: 8,
            points: 3200,
            joinDate: '2021-03-20'
        }
    },
    'test@duocuc.cl': {
        password: 'test123',
        user: {
            id: 4,
            name: 'Estudiante Duoc',
            email: 'test@duocuc.cl',
            role: 'student',
            gamertag: 'DuocGamer',
            platform: 'nintendo',
            level: 3,
            points: 750,
            joinDate: '2024-09-01',
            discount: 20 // Descuento especial Duoc UC
        }
    }
};

// ================================
// INICIALIZACIÓN
// ================================

document.addEventListener('DOMContentLoaded', function() {
    initializeAuth();
    setupAuthEventListeners();
    checkAuthPages();
});

function initializeAuth() {
    loadUserSession();
    updateAuthUI();
}

function loadUserSession() {
    const savedUser = localStorage.getItem('levelup_user');
    const sessionExpiry = localStorage.getItem('levelup_session_expiry');
    
    if (savedUser && sessionExpiry) {
        const now = new Date().getTime();
        if (now < parseInt(sessionExpiry)) {
            authState.currentUser = JSON.parse(savedUser);
            authState.isLoggedIn = true;
        } else {
            // Sesión expirada
            clearUserSession();
        }
    }
}

function checkAuthPages() {
    const path = window.location.pathname;
    
    // Si ya está logueado y trata de acceder a login/register, redirigir
    if (authState.isLoggedIn && (path.includes('login.html') || path.includes('register.html'))) {
        window.location.href = 'index.html';
    }
}

// ================================
// EVENT LISTENERS
// ================================

function setupAuthEventListeners() {
    // Formulario de login
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Formulario de registro
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }

    // Validación en tiempo real
    setupRealTimeValidation();
}

function setupRealTimeValidation() {
    // Email validation
    const emailInputs = document.querySelectorAll('input[type="email"]');
    emailInputs.forEach(input => {
        input.addEventListener('blur', validateEmail);
        input.addEventListener('input', clearError);
    });

    // Password validation
    const passwordInputs = document.querySelectorAll('input[type="password"]');
    passwordInputs.forEach(input => {
        input.addEventListener('blur', validatePassword);
        input.addEventListener('input', clearError);
    });

    // Confirm password validation
    const confirmPasswordInput = document.getElementById('confirmPassword');
    if (confirmPasswordInput) {
        confirmPasswordInput.addEventListener('blur', validatePasswordMatch);
        confirmPasswordInput.addEventListener('input', clearError);
    }

    // Birth date validation
    const birthDateInput = document.getElementById('birthDate');
    if (birthDateInput) {
        birthDateInput.addEventListener('blur', validateBirthDate);
        birthDateInput.addEventListener('input', clearError);
    }
}

// ================================
// LOGIN
// ================================

function handleLogin(e) {
    e.preventDefault();
    
    if (isAccountLocked()) {
        showAuthError('Cuenta bloqueada temporalmente. Intenta más tarde.');
        return;
    }

    const formData = new FormData(e.target);
    const email = formData.get('email').trim().toLowerCase();
    const password = formData.get('password');
    const rememberMe = formData.get('rememberMe');

    // Validar campos
    if (!validateLoginFields(email, password)) {
        return;
    }

    // Simular delay de autenticación
    showLoginLoading(true);

    setTimeout(() => {
        const loginResult = authenticateUser(email, password);
        
        if (loginResult.success) {
            authState.currentUser = loginResult.user;
            authState.isLoggedIn = true;
            authState.loginAttempts = 0;
            
            saveUserSession(loginResult.user, rememberMe);
            showAuthSuccess(`¡Bienvenido, ${loginResult.user.name}!`);
            
            setTimeout(() => {
                redirectAfterLogin();
            }, 1500);
        } else {
            authState.loginAttempts++;
            
            if (authState.loginAttempts >= authState.maxAttempts) {
                lockAccount();
                showAuthError('Demasiados intentos fallidos. Cuenta bloqueada por 5 minutos.');
            } else {
                const remaining = authState.maxAttempts - authState.loginAttempts;
                showAuthError(`Credenciales incorrectas. ${remaining} intentos restantes.`);
            }
        }
        
        showLoginLoading(false);
    }, 1000);
}

function authenticateUser(email, password) {
    const userAuth = DEMO_USERS[email];
    
    if (userAuth && userAuth.password === password) {
        return {
            success: true,
            user: { ...userAuth.user }
        };
    }
    
    return { success: false };
}

function validateLoginFields(email, password) {
    let isValid = true;

    if (!email) {
        showFieldError('email', 'El email es requerido');
        isValid = false;
    } else if (!isValidEmail(email)) {
        showFieldError('email', 'Email inválido');
        isValid = false;
    }

    if (!password) {
        showFieldError('password', 'La contraseña es requerida');
        isValid = false;
    }

    return isValid;
}

// ================================
// REGISTRO
// ================================

function handleRegister(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const userData = {
        firstName: formData.get('firstName')?.trim(),
        lastName: formData.get('lastName')?.trim(),
        email: formData.get('email')?.trim().toLowerCase(),
        phone: formData.get('phone')?.trim(),
        birthDate: formData.get('birthDate'),
        password: formData.get('password'),
        confirmPassword: formData.get('confirmPassword'),
        gamertag: formData.get('gamertag')?.trim(),
        platform: formData.get('platform'),
        genres: Array.from(formData.getAll('genres')),
        acceptTerms: formData.get('acceptTerms'),
        acceptNewsletter: formData.get('acceptNewsletter')
    };

    // Validar todos los campos
    if (!validateRegistrationFields(userData)) {
        return;
    }

    // Simular registro
    showRegisterLoading(true);

    setTimeout(() => {
        const newUser = createUser(userData);
        
        authState.currentUser = newUser;
        authState.isLoggedIn = true;
        
        saveUserSession(newUser, true);
        showAuthSuccess(`¡Bienvenido a Level-Up Gamer, ${newUser.name}!`);
        
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
        
        showRegisterLoading(false);
    }, 1500);
}

function validateRegistrationFields(userData) {
    let isValid = true;

    // Nombre
    if (!userData.firstName) {
        showFieldError('firstName', 'El nombre es requerido');
        isValid = false;
    }

    // Apellido
    if (!userData.lastName) {
        showFieldError('lastName', 'El apellido es requerido');
        isValid = false;
    }

    // Email
    if (!userData.email) {
        showFieldError('email', 'El email es requerido');
        isValid = false;
    } else if (!isValidEmail(userData.email)) {
        showFieldError('email', 'Email inválido');
        isValid = false;
    } else if (emailExists(userData.email)) {
        showFieldError('email', 'Este email ya está registrado');
        isValid = false;
    }

    // Fecha de nacimiento
    if (!userData.birthDate) {
        showFieldError('birthDate', 'La fecha de nacimiento es requerida');
        isValid = false;
    } else if (!isOfAge(userData.birthDate)) {
        showFieldError('birthDate', 'Debes ser mayor de 18 años');
        isValid = false;
    }

    // Contraseña
    if (!userData.password) {
        showFieldError('password', 'La contraseña es requerida');
        isValid = false;
    } else if (!isValidPassword(userData.password)) {
        showFieldError('password', 'La contraseña debe tener al menos 8 caracteres');
        isValid = false;
    }

    // Confirmar contraseña
    if (userData.password !== userData.confirmPassword) {
        showFieldError('confirmPassword', 'Las contraseñas no coinciden');
        isValid = false;
    }

    // Términos y condiciones
    if (!userData.acceptTerms) {
        showFieldError('acceptTerms', 'Debes aceptar los términos y condiciones');
        isValid = false;
    }

    return isValid;
}

function createUser(userData) {
    const isDuocUser = userData.email.includes('@duocuc.cl');
    
    return {
        id: Date.now(),
        name: `${userData.firstName} ${userData.lastName}`,
        email: userData.email,
        phone: userData.phone || '',
        birthDate: userData.birthDate,
        gamertag: userData.gamertag || generateRandomGamertag(),
        platform: userData.platform || 'pc',
        genres: userData.genres,
        role: isDuocUser ? 'student' : 'user',
        level: 1,
        points: isDuocUser ? 100 : 50, // Bonus para estudiantes
        joinDate: new Date().toISOString().split('T')[0],
        discount: isDuocUser ? 20 : 0,
        newsletter: userData.acceptNewsletter === 'on'
    };
}

// ================================
// VALIDACIONES
// ================================

function validateEmail(e) {
    const email = e.target.value.trim();
    const fieldName = e.target.name;
    
    if (email && !isValidEmail(email)) {
        showFieldError(fieldName, 'Email inválido');
    } else {
        clearFieldError(fieldName);
    }
}

function validatePassword(e) {
    const password = e.target.value;
    const fieldName = e.target.name;
    
    if (password && !isValidPassword(password)) {
        showFieldError(fieldName, 'Mínimo 8 caracteres');
    } else {
        clearFieldError(fieldName);
    }
}

function validatePasswordMatch(e) {
    const confirmPassword = e.target.value;
    const password = document.getElementById('password')?.value;
    
    if (confirmPassword && password && confirmPassword !== password) {
        showFieldError('confirmPassword', 'Las contraseñas no coinciden');
    } else {
        clearFieldError('confirmPassword');
    }
}

function validateBirthDate(e) {
    const birthDate = e.target.value;
    
    if (birthDate && !isOfAge(birthDate)) {
        showFieldError('birthDate', 'Debes ser mayor de 18 años');
    } else {
        clearFieldError('birthDate');
    }
}

// ================================
// UTILIDADES DE VALIDACIÓN
// ================================

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPassword(password) {
    return password && password.length >= 8;
}

function isOfAge(birthDate) {
    const birth = new Date(birthDate);
    const today = new Date();
    const age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        return age - 1 >= 18;
    }
    
    return age >= 18;
}

function emailExists(email) {
    return DEMO_USERS.hasOwnProperty(email);
}

// ================================
// GESTIÓN DE SESIÓN
// ================================

function saveUserSession(user, rememberMe) {
    localStorage.setItem('levelup_user', JSON.stringify(user));
    
    // Configurar expiración de sesión
    const expiryTime = new Date().getTime() + (rememberMe ? 2592000000 : 86400000); // 30 días o 1 día
    localStorage.setItem('levelup_session_expiry', expiryTime.toString());
}

function clearUserSession() {
    localStorage.removeItem('levelup_user');
    localStorage.removeItem('levelup_session_expiry');
    authState.currentUser = null;
    authState.isLoggedIn = false;
}

function logout() {
    clearUserSession();
    showAuthSuccess('Sesión cerrada correctamente');
    
    setTimeout(() => {
        window.location.href = '../index.html';
    }, 1000);
}

// ================================
// BLOQUEO DE CUENTA
// ================================

function isAccountLocked() {
    const lockTime = localStorage.getItem('levelup_account_locked');
    if (lockTime) {
        const now = new Date().getTime();
        const lockExpiry = parseInt(lockTime);
        
        if (now < lockExpiry) {
            return true;
        } else {
            localStorage.removeItem('levelup_account_locked');
            authState.loginAttempts = 0;
        }
    }
    return false;
}

function lockAccount() {
    const lockExpiry = new Date().getTime() + authState.lockoutTime;
    localStorage.setItem('levelup_account_locked', lockExpiry.toString());
}

// ================================
// UI HELPERS
// ================================

function updateAuthUI() {
    // Actualizar elementos de UI según el estado de autenticación
    const userNameElements = document.querySelectorAll('[data-user-name]');
    const userEmailElements = document.querySelectorAll('[data-user-email]');
    const authButtons = document.querySelectorAll('[data-auth-required]');

    if (authState.isLoggedIn && authState.currentUser) {
        userNameElements.forEach(el => el.textContent = authState.currentUser.name);
        userEmailElements.forEach(el => el.textContent = authState.currentUser.email);
        authButtons.forEach(el => el.style.display = 'block');
    }
}

function showFieldError(fieldName, message) {
    const errorElement = document.getElementById(`${fieldName}Error`);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }

    const field = document.getElementById(fieldName) || document.querySelector(`[name="${fieldName}"]`);
    if (field) {
        field.style.borderColor = '#ff4444';
    }
}

function clearFieldError(fieldName) {
    const errorElement = document.getElementById(`${fieldName}Error`);
    if (errorElement) {
        errorElement.classList.remove('show');
    }

    const field = document.getElementById(fieldName) || document.querySelector(`[name="${fieldName}"]`);
    if (field) {
        field.style.borderColor = '';
    }
}

function clearError(e) {
    clearFieldError(e.target.name || e.target.id);
}

function showAuthError(message) {
    if (window.levelUpGamer && window.levelUpGamer.showNotification) {
        window.levelUpGamer.showNotification(message, 'error');
    } else {
        alert(`Error: ${message}`);
    }
}

function showAuthSuccess(message) {
    if (window.levelUpGamer && window.levelUpGamer.showNotification) {
        window.levelUpGamer.showNotification(message, 'success');
    } else {
        alert(`Éxito: ${message}`);
    }
}

function showLoginLoading(show) {
    const submitBtn = document.querySelector('#loginForm button[type="submit"]');
    const loadingText = submitBtn?.querySelector('.btn-loading');
    const normalText = submitBtn?.querySelector('.btn-text');

    if (show) {
        if (normalText) normalText.style.display = 'none';
        if (loadingText) loadingText.style.display = 'inline';
        if (submitBtn) submitBtn.disabled = true;
    } else {
        if (normalText) normalText.style.display = 'inline';
        if (loadingText) loadingText.style.display = 'none';
        if (submitBtn) submitBtn.disabled = false;
    }
}

function showRegisterLoading(show) {
    const submitBtn = document.querySelector('#registerForm button[type="submit"]');
    const loadingText = submitBtn?.querySelector('.btn-loading');
    const normalText = submitBtn?.querySelector('.btn-text');

    if (show) {
        if (normalText) normalText.style.display = 'none';
        if (loadingText) loadingText.style.display = 'inline';
        if (submitBtn) submitBtn.disabled = true;
    } else {
        if (normalText) normalText.style.display = 'inline';
        if (loadingText) loadingText.style.display = 'none';
        if (submitBtn) submitBtn.disabled = false;
    }
}

function redirectAfterLogin() {
    const urlParams = new URLSearchParams(window.location.search);
    const returnTo = urlParams.get('returnTo');
    
    if (returnTo) {
        window.location.href = decodeURIComponent(returnTo);
    } else {
        window.location.href = 'index.html';
    }
}

// ================================
// FUNCIONES AUXILIARES
// ================================

function generateRandomGamertag() {
    const adjectives = ['Epic', 'Pro', 'Master', 'Elite', 'Legendary', 'Ultimate'];
    const nouns = ['Gamer', 'Player', 'Hero', 'Champion', 'Warrior', 'Legend'];
    const randomNum = Math.floor(Math.random() * 1000);
    
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    
    return `${adj}${noun}${randomNum}`;
}

function fillDemoUser(email, password) {
    const emailField = document.getElementById('email');
    const passwordField = document.getElementById('password');

    if (emailField) emailField.value = email;
    if (passwordField) passwordField.value = password;
}

// Exponer funciones para uso global
window.authManager = {
    login: handleLogin,
    register: handleRegister,
    logout,
    fillDemoUser,
    getCurrentUser: () => authState.currentUser,
    isLoggedIn: () => authState.isLoggedIn
};
