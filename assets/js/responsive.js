/**
 * LG-121: SISTEMA RESPONSIVE CON 3 BREAKPOINTS
 * Mobile (320-480px), Tablet (481-768px), Desktop (769px+)
 * 
 * Funcionalidades:
 * - Mobile menu toggle
 * - Responsive image optimization
 * - Breakpoint detection
 * - Layout adaptativo
 * - Touch gesture support
 */

class ResponsiveSystem {
    constructor() {
        this.breakpoints = {
            mobile: 480,
            tablet: 768,
            desktop: 1024
        };
        
        this.currentBreakpoint = this.getCurrentBreakpoint();
        this.mobileMenuOpen = false;
        
        this.init();
    }
    
    init() {
        this.setupMobileMenu();
        this.setupResizeListener();
        this.setupTouchGestures();
        this.optimizeImages();
        this.handleInitialLayout();
        
        console.log('LG-121: Sistema Responsive inicializado');
    }
    
    // ================================================
    // DETECCIÓN DE BREAKPOINTS
    // ================================================
    
    getCurrentBreakpoint() {
        const width = window.innerWidth;
        
        if (width <= this.breakpoints.mobile) {
            return 'mobile';
        } else if (width <= this.breakpoints.tablet) {
            return 'tablet';
        } else {
            return 'desktop';
        }
    }
    
    onBreakpointChange(oldBreakpoint, newBreakpoint) {
        console.log(`Breakpoint changed: ${oldBreakpoint} → ${newBreakpoint}`);
        
        // Cerrar menu mobile cuando cambia de breakpoint
        if (newBreakpoint !== 'mobile' && this.mobileMenuOpen) {
            this.closeMobileMenu();
        }
        
        // Ajustar imágenes según el breakpoint
        this.optimizeImages();
        
        // Ajustar notificaciones
        this.adjustNotifications();
        
        // Anunciar cambio a lectores de pantalla
        if (window.accessibilityAPI) {
            window.accessibilityAPI.announceToScreenReader(
                `Vista cambiada a ${newBreakpoint === 'mobile' ? 'móvil' : 
                 newBreakpoint === 'tablet' ? 'tablet' : 'escritorio'}`
            );
        }
    }
    
    // ================================================
    // MENÚ MOBILE
    // ================================================
    
    setupMobileMenu() {
        // Crear botón de menú mobile si no existe
        this.createMobileMenuButton();
        
        // Event listeners
        const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
        if (mobileMenuToggle) {
            mobileMenuToggle.addEventListener('click', () => this.toggleMobileMenu());
            
            // Accesibilidad: Enter y Space
            mobileMenuToggle.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.toggleMobileMenu();
                }
            });
        }
        
        // Cerrar menú al hacer clic fuera
        document.addEventListener('click', (e) => {
            if (this.mobileMenuOpen && !e.target.closest('.navbar')) {
                this.closeMobileMenu();
            }
        });
        
        // Cerrar menú con Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.mobileMenuOpen) {
                this.closeMobileMenu();
            }
        });
    }
    
    createMobileMenuButton() {
        const navbar = document.querySelector('.navbar');
        if (!navbar || document.querySelector('.mobile-menu-toggle')) return;
        
        const menuButton = document.createElement('button');
        menuButton.className = 'mobile-menu-toggle';
        menuButton.setAttribute('aria-label', 'Abrir menú de navegación');
        menuButton.setAttribute('aria-expanded', 'false');
        menuButton.setAttribute('type', 'button');
        
        // Crear líneas del icono hamburguesa
        for (let i = 0; i < 3; i++) {
            const span = document.createElement('span');
            menuButton.appendChild(span);
        }
        
        // Insertar antes de los nav-links
        const navLinks = document.querySelector('.nav-links');
        if (navLinks) {
            navbar.insertBefore(menuButton, navLinks);
        }
    }
    
    toggleMobileMenu() {
        if (this.mobileMenuOpen) {
            this.closeMobileMenu();
        } else {
            this.openMobileMenu();
        }
    }
    
    openMobileMenu() {
        const navLinks = document.querySelector('.nav-links');
        const menuToggle = document.querySelector('.mobile-menu-toggle');
        
        if (!navLinks || !menuToggle) return;
        
        navLinks.classList.add('mobile-open');
        menuToggle.classList.add('active');
        menuToggle.setAttribute('aria-expanded', 'true');
        menuToggle.setAttribute('aria-label', 'Cerrar menú de navegación');
        
        this.mobileMenuOpen = true;
        
        // Focus en el primer enlace
        const firstLink = navLinks.querySelector('a');
        if (firstLink) {
            setTimeout(() => firstLink.focus(), 100);
        }
        
        // Anunciar apertura
        if (window.accessibilityAPI) {
            window.accessibilityAPI.announceToScreenReader('Menú de navegación abierto');
        }
    }
    
    closeMobileMenu() {
        const navLinks = document.querySelector('.nav-links');
        const menuToggle = document.querySelector('.mobile-menu-toggle');
        
        if (!navLinks || !menuToggle) return;
        
        navLinks.classList.remove('mobile-open');
        menuToggle.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-label', 'Abrir menú de navegación');
        
        this.mobileMenuOpen = false;
        
        // Volver focus al botón
        menuToggle.focus();
        
        // Anunciar cierre
        if (window.accessibilityAPI) {
            window.accessibilityAPI.announceToScreenReader('Menú de navegación cerrado');
        }
    }
    
    // ================================================
    // OPTIMIZACIÓN DE IMÁGENES
    // ================================================
    
    optimizeImages() {
        const images = document.querySelectorAll('img[data-responsive]');
        
        images.forEach(img => {
            const breakpoint = this.getCurrentBreakpoint();
            const baseSrc = img.dataset.responsive;
            
            // Diferentes tamaños por breakpoint
            let suffix = '';
            switch (breakpoint) {
                case 'mobile':
                    suffix = '_mobile';
                    break;
                case 'tablet':
                    suffix = '_tablet';
                    break;
                case 'desktop':
                    suffix = '_desktop';
                    break;
            }
            
            // Construir nueva URL
            const extension = baseSrc.split('.').pop();
            const basename = baseSrc.replace(`.${extension}`, '');
            const newSrc = `${basename}${suffix}.${extension}`;
            
            // Verificar si existe la imagen antes de cambiar
            this.preloadImage(newSrc).then(() => {
                img.src = newSrc;
            }).catch(() => {
                // Fallback a imagen original
                img.src = baseSrc;
            });
        });
    }
    
    preloadImage(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = resolve;
            img.onerror = reject;
            img.src = src;
        });
    }
    
    // ================================================
    // GESTOS TÁCTILES
    // ================================================
    
    setupTouchGestures() {
        if (!('ontouchstart' in window)) return;
        
        let startX = 0;
        let startY = 0;
        let endX = 0;
        let endY = 0;
        
        document.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        }, { passive: true });
        
        document.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            endY = e.changedTouches[0].clientY;
            
            this.handleSwipeGesture(startX, startY, endX, endY);
        }, { passive: true });
    }
    
    handleSwipeGesture(startX, startY, endX, endY) {
        const deltaX = endX - startX;
        const deltaY = endY - startY;
        const minSwipeDistance = 100;
        
        // Swipe horizontal más pronunciado que vertical
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
            if (deltaX > 0) {
                // Swipe derecha - abrir menú mobile
                if (this.getCurrentBreakpoint() === 'mobile' && !this.mobileMenuOpen) {
                    this.openMobileMenu();
                }
            } else {
                // Swipe izquierda - cerrar menú mobile
                if (this.getCurrentBreakpoint() === 'mobile' && this.mobileMenuOpen) {
                    this.closeMobileMenu();
                }
            }
        }
    }
    
    // ================================================
    // LAYOUT ADAPTATIVO
    // ================================================
    
    handleInitialLayout() {
        // Ajustar elementos según el breakpoint inicial
        this.adjustLayoutElements();
        this.adjustFormElements();
        this.adjustTableElements();
    }
    
    adjustLayoutElements() {
        const breakpoint = this.getCurrentBreakpoint();
        
        // Ajustar grids
        const grids = document.querySelectorAll('.grid-responsive');
        grids.forEach(grid => {
            grid.dataset.breakpoint = breakpoint;
        });
        
        // Ajustar contenedores
        const containers = document.querySelectorAll('.container');
        containers.forEach(container => {
            container.dataset.breakpoint = breakpoint;
        });
    }
    
    adjustFormElements() {
        const breakpoint = this.getCurrentBreakpoint();
        
        if (breakpoint === 'mobile') {
            // En mobile, hacer inputs más grandes para evitar zoom
            const inputs = document.querySelectorAll('input, select, textarea');
            inputs.forEach(input => {
                if (!input.style.fontSize) {
                    input.style.fontSize = '16px';
                }
            });
        }
    }
    
    adjustTableElements() {
        const breakpoint = this.getCurrentBreakpoint();
        const tables = document.querySelectorAll('table');
        
        tables.forEach(table => {
            const wrapper = table.parentElement;
            
            if (breakpoint === 'mobile') {
                // Hacer tabla scrolleable en mobile
                if (!wrapper.classList.contains('table-responsive')) {
                    const tableWrapper = document.createElement('div');
                    tableWrapper.className = 'table-responsive';
                    table.parentNode.insertBefore(tableWrapper, table);
                    tableWrapper.appendChild(table);
                }
            }
        });
    }
    
    adjustNotifications() {
        const notifications = document.querySelector('.notifications-container');
        if (!notifications) return;
        
        const breakpoint = this.getCurrentBreakpoint();
        notifications.dataset.breakpoint = breakpoint;
    }
    
    // ================================================
    // RESIZE LISTENER
    // ================================================
    
    setupResizeListener() {
        let resizeTimeout;
        
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                const newBreakpoint = this.getCurrentBreakpoint();
                
                if (newBreakpoint !== this.currentBreakpoint) {
                    const oldBreakpoint = this.currentBreakpoint;
                    this.currentBreakpoint = newBreakpoint;
                    this.onBreakpointChange(oldBreakpoint, newBreakpoint);
                }
                
                // Re-ajustar layout
                this.adjustLayoutElements();
                this.adjustFormElements();
                this.adjustTableElements();
                
            }, 150); // Debounce de 150ms
        });
    }
    
    // ================================================
    // API PÚBLICA
    // ================================================
    
    // Obtener breakpoint actual
    getBreakpoint() {
        return this.currentBreakpoint;
    }
    
    // Verificar si está en mobile
    isMobile() {
        return this.currentBreakpoint === 'mobile';
    }
    
    // Verificar si está en tablet
    isTablet() {
        return this.currentBreakpoint === 'tablet';
    }
    
    // Verificar si está en desktop
    isDesktop() {
        return this.currentBreakpoint === 'desktop';
    }
    
    // Forzar actualización de layout
    updateLayout() {
        this.currentBreakpoint = this.getCurrentBreakpoint();
        this.optimizeImages();
        this.adjustLayoutElements();
        this.adjustFormElements();
        this.adjustTableElements();
        this.adjustNotifications();
    }
}

// ================================================
// INICIALIZACIÓN
// ================================================

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.responsiveSystem = new ResponsiveSystem();
    });
} else {
    window.responsiveSystem = new ResponsiveSystem();
}

// CSS adicional para elementos que requieren JS
const additionalCSS = `
/* Tabla responsive */
.table-responsive {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    margin-bottom: 1rem;
}

.table-responsive table {
    min-width: 600px;
}

/* Smooth scrolling para navegación */
html {
    scroll-behavior: smooth;
}

/* Prevenir zoom en iOS */
@media screen and (-webkit-min-device-pixel-ratio: 0) {
    select,
    textarea,
    input[type="text"],
    input[type="password"],
    input[type="datetime"],
    input[type="datetime-local"],
    input[type="date"],
    input[type="month"],
    input[type="time"],
    input[type="week"],
    input[type="number"],
    input[type="email"],
    input[type="url"],
    input[type="search"],
    input[type="tel"],
    input[type="color"] {
        font-size: 16px !important;
    }
}

/* Indicador de breakpoint para debugging */
body::before {
    content: "mobile";
    position: fixed;
    top: 0;
    left: 0;
    background: var(--color-secondary);
    color: var(--color-primary);
    padding: 4px 8px;
    font-size: 12px;
    z-index: 9999;
    pointer-events: none;
    display: none;
}

@media (min-width: 481px) and (max-width: 768px) {
    body::before {
        content: "tablet";
    }
}

@media (min-width: 769px) {
    body::before {
        content: "desktop";
    }
}

/* Mostrar indicador en modo debug */
body.debug-responsive::before {
    display: block;
}
`;

// Inyectar CSS adicional
const style = document.createElement('style');
style.textContent = additionalCSS;
document.head.appendChild(style);

// Exportar para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ResponsiveSystem;
}
