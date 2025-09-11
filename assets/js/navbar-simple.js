// ================================================
// LEVEL-UP GAMER - NAVBAR SIMPLE
// ================================================

class SimpleGamerNavbar {
  constructor() {
    this.mobileToggle = document.getElementById('mobile-toggle');
    this.mobileMenu = document.getElementById('mobile-menu');
    this.searchInput = document.getElementById('search-input');
    this.searchBtn = document.getElementById('search-btn');
    this.cartCount = document.getElementById('cart-count');
    
    this.init();
  }

  init() {
    this.initMobileMenu();
    this.initSearch();
    this.initScrollEffect();
    this.updateCartCount();
  }

  // Menú móvil
  initMobileMenu() {
    if (this.mobileToggle && this.mobileMenu) {
      this.mobileToggle.addEventListener('click', () => {
        this.toggleMobileMenu();
      });

      // Cerrar menú al hacer clic en un enlace
      this.mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          this.closeMobileMenu();
        });
      });

      // Cerrar menú al hacer clic fuera
      document.addEventListener('click', (e) => {
        if (!this.mobileToggle.contains(e.target) && !this.mobileMenu.contains(e.target)) {
          this.closeMobileMenu();
        }
      });
    }
  }

  toggleMobileMenu() {
    this.mobileToggle.classList.toggle('active');
    this.mobileMenu.classList.toggle('active');
  }

  closeMobileMenu() {
    this.mobileToggle.classList.remove('active');
    this.mobileMenu.classList.remove('active');
  }

  // Búsqueda
  initSearch() {
    if (this.searchInput && this.searchBtn) {
      // Búsqueda al hacer clic en el botón
      this.searchBtn.addEventListener('click', () => {
        this.performSearch();
      });

      // Búsqueda al presionar Enter
      this.searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          this.performSearch();
        }
      });
    }
  }

  performSearch() {
    const query = this.searchInput.value.trim();
    if (query) {
      // Aquí iría la lógica de búsqueda
      console.log('Buscando:', query);
      // Ejemplo: redirigir a página de resultados
      // window.location.href = `/productos/?buscar=${encodeURIComponent(query)}`;
    }
  }

  // Efecto de scroll
  initScrollEffect() {
    let lastScrollTop = 0;
    const header = document.querySelector('.main-header');
    
    if (header) {
      window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Cambiar opacidad según el scroll
        if (scrollTop > 100) {
          header.style.background = 'rgba(0, 0, 0, 0.95)';
        } else {
          header.style.background = '#000000';
        }
        
        lastScrollTop = scrollTop;
      }, { passive: true });
    }
  }

  // Actualizar contador del carrito
  updateCartCount() {
    if (this.cartCount) {
      // Obtener cantidad del carrito desde localStorage o API
      const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
      const totalItems = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
      
      if (totalItems > 0) {
        this.cartCount.textContent = totalItems;
        this.cartCount.style.display = 'flex';
      } else {
        this.cartCount.style.display = 'none';
      }
    }
  }

  // Métodos públicos para actualizar desde otras partes de la app
  refreshCartCount() {
    this.updateCartCount();
  }

  highlightCurrentPage() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === currentPath) {
        link.classList.add('active');
      }
    });
  }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  window.gamerNavbar = new SimpleGamerNavbar();
  
  // Resaltar página actual
  window.gamerNavbar.highlightCurrentPage();
});

// Actualizar carrito cuando cambie
window.addEventListener('storage', (e) => {
  if (e.key === 'cart') {
    window.gamerNavbar.refreshCartCount();
  }
});

// Función global para actualizar carrito desde otras páginas
window.updateNavbarCart = () => {
  if (window.gamerNavbar) {
    window.gamerNavbar.refreshCartCount();
  }
};
