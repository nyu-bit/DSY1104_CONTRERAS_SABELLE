// ====================================================
// NAVBAR INTERACTIVO LEVEL-UP GAMER
// Manejo del menú móvil y interacciones
// ====================================================

class NavbarManager {
    constructor() {
        this.mobileToggle = document.querySelector('.mobile-toggle');
        this.mobileMenu = document.querySelector('.mobile-menu');
        this.userBtn = document.querySelector('.user-btn');
        this.userDropdown = document.querySelector('.user-dropdown');
        this.dropdowns = document.querySelectorAll('.dropdown');
        
        this.init();
    }

    init() {
        this.setupMobileMenu();
        this.setupUserMenu();
        this.setupDropdowns();
        console.log('🧭 NavbarManager inicializado');
    }

    setupMobileMenu() {
        if (this.mobileToggle && this.mobileMenu) {
            this.mobileToggle.addEventListener('click', () => {
                this.mobileMenu.classList.toggle('active');
                this.mobileToggle.classList.toggle('active');
            });

            // Cerrar menú al hacer click fuera
            document.addEventListener('click', (e) => {
                if (!e.target.closest('.mobile-toggle') && !e.target.closest('.mobile-menu')) {
                    this.mobileMenu.classList.remove('active');
                    this.mobileToggle.classList.remove('active');
                }
            });
        }
    }

    setupUserMenu() {
        if (this.userBtn && this.userDropdown) {
            this.userBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.userDropdown.classList.toggle('active');
            });

            // Cerrar menú al hacer click fuera
            document.addEventListener('click', (e) => {
                if (!e.target.closest('.user-menu')) {
                    this.userDropdown.classList.remove('active');
                }
            });
        }
    }

    setupDropdowns() {
        this.dropdowns.forEach(dropdown => {
            const menu = dropdown.querySelector('.dropdown-menu');
            
            dropdown.addEventListener('mouseenter', () => {
                menu.style.display = 'block';
            });
            
            dropdown.addEventListener('mouseleave', () => {
                menu.style.display = 'none';
            });
        });
    }
}

// Inicializar navbar
document.addEventListener('DOMContentLoaded', () => {
    window.navbarManager = new NavbarManager();
});

console.log('🧭 Navbar-simple.js cargado correctamente');