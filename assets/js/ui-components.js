/**
 * UI Components JavaScript - LG-008 y LG-009
 * Funcionalidad para botón "Volver Arriba" y Widget de Ayuda
 */

// ================================================
// LG-008: BOTÓN "VOLVER ARRIBA"
// ================================================
class BackToTopButton {
    constructor() {
        this.createButton();
        this.bindEvents();
    }

    createButton() {
        // Crear el botón si no existe
        if (!document.querySelector('.back-to-top')) {
            const button = document.createElement('a');
            button.href = '#top';
            button.className = 'back-to-top';
            button.setAttribute('aria-label', 'Volver al inicio de la página');
            button.setAttribute('title', 'Volver arriba');
            document.body.appendChild(button);
        }
        
        this.button = document.querySelector('.back-to-top');
    }

    bindEvents() {
        // Mostrar/ocultar botón según scroll
        window.addEventListener('scroll', this.handleScroll.bind(this));
        
        // Click en el botón
        this.button.addEventListener('click', this.scrollToTop.bind(this));
    }

    handleScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 300) {
            this.button.classList.add('visible');
        } else {
            this.button.classList.remove('visible');
        }
    }

    scrollToTop(e) {
        e.preventDefault();
        
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
}

// ================================================
// LG-009: WIDGET DE AYUDA/FAQ
// ================================================
class HelpWidget {
    constructor() {
        this.isOpen = false;
        this.createWidget();
        this.bindEvents();
    }

    createWidget() {
        // Crear el widget si no existe
        if (!document.querySelector('.help-widget')) {
            const widget = document.createElement('div');
            widget.className = 'help-widget';
            widget.innerHTML = this.getWidgetHTML();
            document.body.appendChild(widget);
        }
        
        this.widget = document.querySelector('.help-widget');
        this.button = this.widget.querySelector('.help-button');
        this.panel = this.widget.querySelector('.help-panel');
    }

    getWidgetHTML() {
        return `
            <button class="help-button" aria-expanded="false" aria-label="Abrir widget de ayuda">
            </button>
            <div class="help-panel" aria-hidden="true">
                <h3>¿Necesitas ayuda?</h3>
                <div class="faq-item">
                    <div class="faq-question">¿Cómo puedo buscar productos?</div>
                    <div class="faq-answer">Usa el filtro por categorías en la página de productos o la barra de búsqueda.</div>
                </div>
                <div class="faq-item">
                    <div class="faq-question">¿Cómo agregar al carrito?</div>
                    <div class="faq-answer">Haz clic en "Agregar al carrito" en cualquier producto que te interese.</div>
                </div>
                <div class="faq-item">
                    <div class="faq-question">¿Hay envío gratis?</div>
                    <div class="faq-answer">Sí, ofrecemos envío gratis en compras sobre $50.000.</div>
                </div>
                <div class="faq-item">
                    <div class="faq-question">¿Puedo devolver productos?</div>
                    <div class="faq-answer">Tienes 30 días para devolver productos en su estado original.</div>
                </div>
                <div class="faq-item">
                    <div class="faq-question">¿Cómo contactar soporte?</div>
                    <div class="faq-answer">Visita nuestra sección de soporte o escríbenos a soporte@levelup.cl</div>
                </div>
            </div>
        `;
    }

    bindEvents() {
        this.button.addEventListener('click', this.togglePanel.bind(this));
        
        // Cerrar al hacer clic fuera
        document.addEventListener('click', (e) => {
            if (!this.widget.contains(e.target) && this.isOpen) {
                this.closePanel();
            }
        });

        // Cerrar con Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closePanel();
            }
        });
    }

    togglePanel() {
        if (this.isOpen) {
            this.closePanel();
        } else {
            this.openPanel();
        }
    }

    openPanel() {
        this.isOpen = true;
        this.panel.classList.add('visible');
        this.button.setAttribute('aria-expanded', 'true');
        this.panel.setAttribute('aria-hidden', 'false');
    }

    closePanel() {
        this.isOpen = false;
        this.panel.classList.remove('visible');
        this.button.setAttribute('aria-expanded', 'false');
        this.panel.setAttribute('aria-hidden', 'true');
    }
}

// ================================================
// INICIALIZACIÓN
// ================================================
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar componentes
    new BackToTopButton();
    new HelpWidget();
    
    // Agregar ID al body para el ancla del botón volver arriba
    if (!document.body.id) {
        document.body.id = 'top';
    }
});

// ================================================
// UTILIDADES PARA ICONOGRAFÍA LG-004
// ================================================
class IconManager {
    static addIconsToNavigation() {
        // Agregar iconos a elementos de navegación existentes
        const cartLinks = document.querySelectorAll('a[href*="carrito"]');
        cartLinks.forEach(link => {
            if (!link.querySelector('.icon-cart')) {
                link.classList.add('icon-cart', 'icon-gamer');
                link.setAttribute('role', 'img');
                link.setAttribute('aria-label', 'Ir al carrito de compras');
            }
        });

        const userLinks = document.querySelectorAll('a[href*="usuario"], a[href*="login"]');
        userLinks.forEach(link => {
            if (!link.querySelector('.icon-user')) {
                link.classList.add('icon-user', 'icon-gamer');
                link.setAttribute('role', 'img');
                link.setAttribute('aria-label', 'Acceder a área de usuario');
            }
        });

        const productLinks = document.querySelectorAll('a[href*="productos"]');
        productLinks.forEach(link => {
            if (!link.querySelector('.icon-gaming')) {
                link.classList.add('icon-gaming', 'icon-gamer');
                link.setAttribute('role', 'img');
                link.setAttribute('aria-label', 'Ver catálogo de productos gaming');
            }
        });
    }
}

// Aplicar iconos cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    IconManager.addIconsToNavigation();
});
