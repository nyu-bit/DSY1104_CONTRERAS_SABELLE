// ====================================================
// SISTEMA DE AUTENTICACIÓN LEVEL-UP GAMER
// Manejo básico de sesiones y usuarios
// ====================================================

class AuthManager {
    constructor() {
        this.storageKey = 'levelup_gamer_user';
        this.currentUser = this.loadUser();
        this.init();
    }

    init() {
        this.updateUIState();
        console.log('🔐 AuthManager inicializado');
    }

    // Cargar usuario desde localStorage
    loadUser() {
        try {
            const savedUser = localStorage.getItem(this.storageKey);
            return savedUser ? JSON.parse(savedUser) : null;
        } catch (error) {
            console.error('❌ Error al cargar usuario:', error);
            return null;
        }
    }

    // Guardar usuario en localStorage
    saveUser(user) {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(user));
            this.currentUser = user;
            this.updateUIState();
        } catch (error) {
            console.error('❌ Error al guardar usuario:', error);
        }
    }

    // Simular login (para desarrollo)
    login(email, password) {
        // En un entorno real, esto haría una llamada al servidor
        console.log('🔑 Intento de login:', email);
        
        const user = {
            id: Date.now(),
            email: email,
            name: email.split('@')[0],
            loginTime: new Date().toISOString(),
            isGuest: false
        };
        
        this.saveUser(user);
        window.showNotification && window.showNotification(`Bienvenido ${user.name}!`, 'success');
        return true;
    }

    // Logout
    logout() {
        localStorage.removeItem(this.storageKey);
        this.currentUser = null;
        this.updateUIState();
        window.showNotification && window.showNotification('Sesión cerrada', 'info');
        console.log('👋 Usuario desconectado');
    }

    // Verificar si está logueado
    isLoggedIn() {
        return !!this.currentUser;
    }

    // Obtener usuario actual
    getCurrentUser() {
        return this.currentUser;
    }

    // Actualizar UI según estado de autenticación
    updateUIState() {
        const userMenus = document.querySelectorAll('.user-dropdown');
        const userButtons = document.querySelectorAll('.user-btn');
        
        userMenus.forEach(menu => {
            if (this.isLoggedIn()) {
                // Usuario logueado
                menu.innerHTML = `
                    <span class="user-name">Hola, ${this.currentUser.name}</span>
                    <a href="usuario/">Mi Perfil</a>
                    <a href="usuario/orders.html">Mis Pedidos</a>
                    <a href="#" id="logoutBtn">Cerrar Sesión</a>
                `;
            } else {
                // Usuario no logueado
                menu.innerHTML = `
                    <a href="usuario/login.html">Iniciar Sesión</a>
                    <a href="usuario/register.html">Registrarse</a>
                `;
            }
        });

        // Actualizar evento de logout
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.logout();
            });
        }
    }
}

// Inicializar cuando esté listo
function initializeAuth() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.authManager = new AuthManager();
        });
    } else {
        window.authManager = new AuthManager();
    }
}

initializeAuth();

console.log('🔐 Auth.js cargado correctamente');