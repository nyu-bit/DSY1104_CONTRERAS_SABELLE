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
// ===================== FUNCIONES PARA MANEJO DE MODALES =====================
function showModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // Prevenir scroll
    console.log(`✅ Modal abierto: ${modalId}`);
  } else {
    console.error(`❌ Modal no encontrado: ${modalId}`);
  }
}

function hideModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = ''; // Restaurar scroll
    console.log(`✅ Modal cerrado: ${modalId}`);
  } else {
    console.error(`❌ Modal no encontrado: ${modalId}`);
  }
}

// ===================== FUNCIONES BÁSICAS PARA EL TEMA GAMER =====================
document.addEventListener('DOMContentLoaded', function() {
  console.log('🚀 DOM Content Loaded - Iniciando aplicación...');
  
  // Asegurar que el tema gamer esté aplicado
  document.documentElement.setAttribute('data-theme', 'gamer');
  
  // SOLUCION DIRECTA PARA BOTONES DE CERRAR MODALES
  setTimeout(() => {
    console.log('🔧 Configurando botones de cerrar modales...');
    
    // Buscar todos los botones de cerrar
    const closeButtons = document.querySelectorAll('.modal-close');
    console.log(`🔍 Encontrados ${closeButtons.length} botones de cerrar`);
    
    closeButtons.forEach((button, index) => {
      console.log(`🎯 Configurando botón de cerrar ${index + 1}:`, button);
      
      // Función para cerrar el modal
      function closeModal(e) {
        console.log('🚪 Cerrando modal...', e);
        e.preventDefault();
        e.stopPropagation();
        
        // Encontrar el modal padre
        const modal = button.closest('.modal-overlay');
        if (modal) {
          hideModal(modal.id); // Usar la nueva función universal
          
          // Limpiar formularios si existen
          const forms = modal.querySelectorAll('form');
          forms.forEach(form => form.reset());
          
          console.log('✅ Modal cerrado correctamente');
        }
      }
      
      // Limpiar listeners existentes clonando el botón
      const newButton = button.cloneNode(true);
      button.parentNode.replaceChild(newButton, button);
      
      // Agregar múltiples tipos de eventos
      newButton.addEventListener('click', closeModal);
      newButton.addEventListener('touchstart', closeModal);
      newButton.addEventListener('mousedown', closeModal);
      
      // Forzar estilos para asegurar funcionalidad
      newButton.style.cursor = 'pointer';
      newButton.style.pointerEvents = 'auto';
      newButton.style.zIndex = '10001';
      newButton.style.background = 'transparent';
      newButton.style.border = 'none';
      
      console.log(`✅ Botón de cerrar ${index + 1} configurado correctamente`);
    });
  }, 300);
  
  // PRUEBA DIRECTA DEL BOTÓN DE LOGIN
  setTimeout(() => {
    const loginButton = document.getElementById('login-button');
    const modal = document.getElementById('login-modal');
    
    console.log('🔍 TEST DIRECTO LOGIN:', {
      loginButton: !!loginButton,
      modal: !!modal,
      buttonDisplay: loginButton ? window.getComputedStyle(loginButton).display : 'N/A',
      buttonVisibility: loginButton ? window.getComputedStyle(loginButton).visibility : 'N/A'
    });
    
    if (loginButton && modal) {
      // Agregar event listener directo
      loginButton.addEventListener('click', function(e) {
        console.log('🎯 ¡CLICK DIRECTO DETECTADO EN LOGIN!');
        e.preventDefault();
        e.stopPropagation();
        
        showModal('login-modal'); // Usar la nueva función universal
        
        console.log('✅ Modal de login abierto directamente');
      });
      
      console.log('🎯 Event listener directo agregado al botón de login');
    }
  }, 500);
  
  // PRUEBA DIRECTA DEL BOTÓN DE REGISTRO
  setTimeout(() => {
    const registerButton = document.getElementById('register-button');
    const modal = document.getElementById('register-modal');
    
    console.log('🔍 TEST DIRECTO REGISTRO:', {
      registerButton: !!registerButton,
      modal: !!modal,
      buttonDisplay: registerButton ? window.getComputedStyle(registerButton).display : 'N/A',
      buttonVisibility: registerButton ? window.getComputedStyle(registerButton).visibility : 'N/A'
    });
    
    if (registerButton && modal) {
      // Agregar event listener directo
      registerButton.addEventListener('click', function(e) {
        console.log('🎯 ¡CLICK DIRECTO DETECTADO EN REGISTRO!');
        e.preventDefault();
        e.stopPropagation();
        
        showModal('register-modal'); // Usar la nueva función universal
        
        // Enfocar el primer campo
        setTimeout(() => {
          const nameInput = document.getElementById('register-name');
          if (nameInput) nameInput.focus();
        }, 100);
        
        // CONFIGURAR BOTÓN DE CERRAR INMEDIATAMENTE DESPUÉS DE ABRIR
        setTimeout(() => {
          console.log('🔧 Configurando botón de cerrar después de abrir modal...');
          const closeButton = modal.querySelector('.modal-close');
          if (closeButton) {
            // Función de cierre específica
            function closeThisModal(e) {
              console.log('🚪 Cerrando modal de registro...', e);
              e.preventDefault();
              e.stopPropagation();
              
              modal.classList.remove('active');
              modal.setAttribute('aria-hidden', 'true');
              document.body.style.overflow = '';
              
              const form = modal.querySelector('form');
              if (form) form.reset();
              
              console.log('✅ Modal de registro cerrado');
            }
            
            // Limpiar y agregar nuevo listener
            const newCloseButton = closeButton.cloneNode(true);
            closeButton.parentNode.replaceChild(newCloseButton, closeButton);
            
            newCloseButton.addEventListener('click', closeThisModal, true);
            newCloseButton.addEventListener('mousedown', closeThisModal, true);
            newCloseButton.addEventListener('touchstart', closeThisModal, true);
            
            console.log('✅ Botón de cerrar configurado para este modal');
          }
        }, 200);
        
        console.log('✅ Modal de registro abierto directamente');
      });
      
      console.log('🎯 Event listener directo agregado al botón de registro');
    }
  }, 600);
  
  // CONFIGURACIÓN INMEDIATA DE BOTONES DE CERRAR
  setTimeout(() => {
    console.log('🔧 Configuración INMEDIATA de botones de cerrar...');
    
    // Función universal de cierre
    function universalCloseModal(e) {
      console.log('🚪 Cerrando modal universalmente...', e);
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      
      // Encontrar el modal padre
      const button = e.target;
      const modal = button.closest('.modal-overlay') || button.closest('.modal');
      
      if (modal) {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        
        // Limpiar formularios
        const forms = modal.querySelectorAll('form');
        forms.forEach(form => form.reset());
        
        console.log('✅ Modal cerrado exitosamente');
      }
    }
    
    // Configurar TODOS los botones de cerrar existentes
    const allCloseButtons = document.querySelectorAll('.modal-close, [aria-label="Cerrar modal"], .close');
    console.log(`🔍 Encontrados ${allCloseButtons.length} botones de cerrar para configurar`);
    
    allCloseButtons.forEach((button, index) => {
      console.log(`🎯 Configurando botón ${index + 1}:`, button);
      
      // Limpiar listeners existentes
      const newButton = button.cloneNode(true);
      button.parentNode.replaceChild(newButton, button);
      
      // Agregar event listeners robustos
      newButton.addEventListener('click', universalCloseModal, true);
      newButton.addEventListener('mousedown', universalCloseModal, true);
      newButton.addEventListener('touchstart', universalCloseModal, true);
      
      // Forzar estilos
      newButton.style.cursor = 'pointer';
      newButton.style.pointerEvents = 'auto';
      newButton.style.zIndex = '99999';
      newButton.style.position = 'relative';
      
      console.log(`✅ Botón ${index + 1} configurado con event listeners universales`);
    });
    
    console.log('🎉 Configuración de botones de cerrar COMPLETADA');
  }, 800);
  
  // Inicializar funcionalidades
  initMobileMenu();
  initCart();
  initProductInteractions();
  initRegistration();
  
  // Inicializar chat WhatsApp
  if (typeof initWhatsAppChat === 'function') {
    initWhatsAppChat();
  }
  
  // Inicializar sistema de semillas de productos
  if (typeof showCatalogControls === 'function') {
    setTimeout(() => {
      showCatalogControls();
      displayCatalogProducts();
    }, 1000);
  }
  
  // Inicializar banner promocional
  if (typeof initPromotionalBanner === 'function') {
    setTimeout(() => {
      initPromotionalBanner();
      checkExpiredDiscounts();
    }, 500);
  }
  
  // Inicializar sistema de reseñas
  if (typeof initReviewSystem === 'function') {
    initReviewSystem();
  }
  initLogin();
  
  // Verificar sesión activa después de inicializar el login
  checkActiveSession();
  
  initProfile();
  initProductFiltersAndSearch();
  
  // Verificar si hay código de referido en la URL
  checkReferralCode();
  
  console.log('✅ Tema Level-Up Gamer cargado correctamente');
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
// ===================== SISTEMA DE REGISTRO MEJORADO =====================
function initRegistration() {
  console.log('🔧 Iniciando sistema de registro...');
  
  const registerButton = document.getElementById('register-button');
  const modal = document.getElementById('register-modal');
  const form = document.getElementById('register-form');
  
  // Buscar botones de cerrar con múltiples selectores
  let closeButton = null;
  if (modal) {
    closeButton = modal.querySelector('.modal-close') || 
                  modal.querySelector('[aria-label="Cerrar modal"]') ||
                  modal.querySelector('.close') ||
                  modal.querySelector('button[type="button"]');
  }
  
  const cancelButton = document.getElementById('cancel-register');
  
  console.log('🔍 Elementos de registro encontrados:', {
    registerButton: !!registerButton,
    modal: !!modal,
    form: !!form,
    closeButton: !!closeButton,
    cancelButton: !!cancelButton
  });
  
  if (!registerButton || !modal || !form) {
    console.error('❌ Error: Elementos esenciales del registro no encontrados');
    console.error('registerButton:', registerButton);
    console.error('modal:', modal);
    console.error('form:', form);
    return;
  }
  
  // Forzar que el botón sea visible y clickeable
  registerButton.style.display = 'inline-flex';
  registerButton.style.pointerEvents = 'auto';
  registerButton.style.visibility = 'visible';
  
  // Función para abrir el modal
  function openRegisterModal(e) {
    console.log('👤 ¡CLICK DETECTADO! Abriendo modal de registro...', e);
    
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    
    setTimeout(() => {
      const nameInput = document.getElementById('register-name');
      if (nameInput) {
        nameInput.focus();
      }
    }, 100);
    
    // Auto-llenar código de referido si hay uno pendiente
    const pendingCode = sessionStorage.getItem('pending_referral_code');
    if (pendingCode) {
      const referralInput = document.getElementById('register-referral-code');
      if (referralInput) {
        referralInput.value = pendingCode;
        if (typeof validateReferralCode === 'function') {
          validateReferralCode();
        }
        sessionStorage.removeItem('pending_referral_code');
      }
    }
  }
  
  // Agregar múltiples tipos de eventos
  registerButton.addEventListener('click', openRegisterModal);
  registerButton.addEventListener('touchstart', openRegisterModal);
  registerButton.addEventListener('mousedown', openRegisterModal);
  
  console.log('✅ Event listeners agregados al botón de registro');
  
  // Configurar cierre del modal
  function closeModal() {
    console.log('🚪 Cerrando modal de registro...');
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    form.reset();
    
    // Llamar funciones de limpieza si existen
    if (typeof clearErrors === 'function') {
      clearErrors();
    }
    if (typeof hideDiscountPreview === 'function') {
      hideDiscountPreview();
    }
  }
  
  // Event listeners para cerrar - con verificación
  if (closeButton) {
    closeButton.addEventListener('click', closeModal);
    console.log('✅ Event listener agregado al botón de cerrar (X)');
  } else {
    console.error('❌ Botón de cerrar (X) no encontrado en modal de registro');
  }
  
  if (cancelButton) {
    cancelButton.addEventListener('click', closeModal);
    console.log('✅ Event listener agregado al botón de cancelar');
  }
  
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
// ===================== SISTEMA DE LOGIN SIMPLIFICADO =====================
// Variable para evitar múltiples inicializaciones del login
let loginInitialized = false;

function initLogin() {
  console.log('🔧 Iniciando sistema de login simplificado...');
  
  // Limpiar cualquier listener previo
  if (loginInitialized) {
    console.log('⚠️ Login ya inicializado, saltando...');
    return;
  }
  
  const loginButton = document.getElementById('login-button');
  const modal = document.getElementById('login-modal');
  
  console.log('🔍 Elementos encontrados:', {
    loginButton: !!loginButton,
    modal: !!modal,
    loginButtonVisible: loginButton ? window.getComputedStyle(loginButton).display !== 'none' : false
  });
  
  if (!loginButton) {
    console.error('❌ Error: Botón de login no encontrado');
    return;
  }
  
  if (!modal) {
    console.error('❌ Error: Modal de login no encontrado');
    return;
  }
  
  // Forzar que el botón sea visible y clickeable
  loginButton.style.display = 'inline-flex';
  loginButton.style.pointerEvents = 'auto';
  loginButton.style.visibility = 'visible';
  
  console.log('📌 Agregando event listener al botón de login...');
  
  // Función para abrir el modal
  function openLoginModal(e) {
    console.log('🎮 ¡CLICK DETECTADO! Abriendo modal de login...', e);
    
    // Prevenir cualquier comportamiento por defecto
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    // Abrir modal
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    
    // Enfocar el primer campo
    setTimeout(() => {
      const emailInput = document.getElementById('login-email');
      if (emailInput) {
        emailInput.focus();
      }
    }, 100);
    
    // Mostrar credenciales de prueba en consola
    console.log('🎮 Credenciales de prueba disponibles:');
    console.log('📧 angel@levelupgamer.cl | 🔑 123456');
    console.log('📧 pro@levelupgamer.cl | 🔑 gamer123');
    console.log('📧 test@duocuc.cl | 🔑 test123');
  }
  
  // Agregar múltiples tipos de eventos para asegurar que funcione
  loginButton.addEventListener('click', openLoginModal);
  loginButton.addEventListener('touchstart', openLoginModal);
  loginButton.addEventListener('mousedown', openLoginModal);
  
  console.log('✅ Event listeners agregados al botón de login');
  
  // Configurar cierre del modal
  setupModalClose(modal);
  
  // Configurar el formulario de login
  setupLoginForm();
  
  // Marcar como inicializado
  loginInitialized = true;
  console.log('✅ Sistema de login inicializado completamente');
}

function setupModalClose(modal) {
  const closeButton = modal.querySelector('.modal-close');
  const cancelButton = document.getElementById('cancel-login');
  
  function closeModal() {
    console.log('🚪 Cerrando modal de login...');
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    
    // Limpiar formulario
    const form = document.getElementById('login-form');
    if (form) {
      form.reset();
    }
  }
  
  // Event listeners para cerrar
  if (closeButton) {
    closeButton.addEventListener('click', closeModal);
  }
  
  if (cancelButton) {
    cancelButton.addEventListener('click', closeModal);
  }
  
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
}

function setupLoginForm() {
  const form = document.getElementById('login-form');
  if (!form) {
    console.error('❌ Formulario de login no encontrado');
    return;
  }
  
  form.addEventListener('submit', handleLogin);
  console.log('✅ Formulario de login configurado');
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
  
  // Mostrar texto de carga
  const btnText = submitButton.querySelector('.btn-text');
  const btnLoading = submitButton.querySelector('.btn-loading');
  btnText.style.display = 'none';
  btnLoading.style.display = 'inline';
  
  // Usuarios de prueba predefinidos
  const testUsers = [
    {
      name: 'Angel Sabelle',
      email: 'angel@levelupgamer.cl',
      password: '123456',
      level: 25,
      coins: 2500,
      avatar: '🎮',
      joinDate: '2024-01-15',
      preferences: { theme: 'gaming', notifications: true }
    },
    {
      name: 'Gaming Pro',
      email: 'pro@levelupgamer.cl', 
      password: 'gamer123',
      level: 50,
      coins: 5000,
      avatar: '👾',
      joinDate: '2023-12-01',
      preferences: { theme: 'dark', notifications: true }
    },
    {
      name: 'Test User',
      email: 'test@duocuc.cl',
      password: 'test123',
      level: 10,
      coins: 1000,
      avatar: '🎯',
      joinDate: '2024-02-01',
      preferences: { theme: 'gaming', notifications: false }
    }
  ];
  
  // Simular verificación de login
  setTimeout(() => {
    let loginSuccess = false;
    let userData = null;
    
    // Verificar usuarios de prueba primero
    const testUser = testUsers.find(user => 
      user.email.toLowerCase() === email && user.password === password
    );
    
    if (testUser) {
      loginSuccess = true;
      userData = testUser;
    } else {
      // Verificar usuario registrado en localStorage
      const existingUser = localStorage.getItem('levelup_user');
      
      if (existingUser) {
        const storedUser = JSON.parse(existingUser);
        
        if (storedUser.email.toLowerCase() === email && storedUser.password === password) {
          loginSuccess = true;
          userData = storedUser;
        }
      }
    }
    
    if (loginSuccess && userData) {
      // Login exitoso
      const sessionData = {
        ...userData,
        loginTime: new Date().toISOString(),
        lastLogin: new Date().toLocaleString('es-CL'),
        rememberMe: rememberMe,
        sessionExpiry: rememberMe 
          ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 días
          : new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 1 día
      };
      
      // Guardar sesión
      localStorage.setItem('levelup_session', JSON.stringify(sessionData));
      
      // Guardar usuario si es de prueba
      if (testUser) {
        localStorage.setItem('levelup_user', JSON.stringify(userData));
      }
      
      // Mostrar mensaje de éxito
      const message = `¡Bienvenido de vuelta, ${userData.name}! 🎮\n+10 GamerCoins por iniciar sesión`;
      showNotification(message, 'success');
      
      // Agregar coins por login
      addGamerCoins(10, 'daily-login');
      
      // Cerrar modal
      document.getElementById('login-modal').classList.remove('active');
      document.body.style.overflow = '';
      
      // Actualizar UI
      updateLoginInterface(sessionData);
      
      // Limpiar formulario
      document.getElementById('login-form').reset();
      clearLoginErrors();
      
    } else {
      // Credenciales incorrectas
      if (email) {
        // Si hay email, problema con contraseña
        showLoginError('login-password-error', 'Contraseña incorrecta. Intenta de nuevo.');
        document.getElementById('login-password').classList.add('error');
        document.getElementById('login-password').focus();
      } else {
        // Problema con email
        showLoginError('login-email-error', 'Email no válido o no encontrado.');
        document.getElementById('login-email').classList.add('error');
        document.getElementById('login-email').focus();
      }
      
      // Mostrar credenciales de prueba en consola
      console.log('🎮 Credenciales de prueba disponibles:');
      testUsers.forEach(user => {
        console.log(`📧 ${user.email} | 🔑 ${user.password} | 👤 ${user.name}`);
      });
      
      showNotification('❌ Credenciales incorrectas. Revisa la consola para ver usuarios de prueba.', 'error');
    }
    
    // Restaurar botón
    submitButton.classList.remove('loading');
    submitButton.disabled = false;
    btnText.style.display = 'inline';
    btnLoading.style.display = 'none';
  }, 1500);
}

function updateLoginInterface(sessionData) {
  const loginButton = document.getElementById('login-button');
  const registerButton = document.getElementById('register-button');
  
  // Cambiar el botón de login a mostrar perfil/logout
  loginButton.textContent = `👤 ${sessionData.name}`;
  loginButton.title = sessionData.isDuocUser 
    ? 'Usuario Duoc UC - 20% descuento - Click para perfil' 
    : 'Usuario Level-Up Gamer - Click para perfil';
  
  // Remover el event listener anterior y agregar nuevo para perfil
  const newLoginButton = loginButton.cloneNode(true);
  loginButton.parentNode.replaceChild(newLoginButton, loginButton);
  
  // Cambiar funcionalidad del botón login a mostrar perfil/logout
  newLoginButton.addEventListener('click', () => showUserMenu(sessionData));
  
  // Ocultar botón de registro cuando hay sesión activa
  registerButton.style.display = 'none';
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
  const modal = document.getElementById('login-modal');
  
  // Restaurar botón de login
  loginButton.textContent = '🔑 Iniciar Sesión';
  loginButton.title = '';
  
  // Remover event listener de perfil y restaurar el de login
  const newLoginButton = loginButton.cloneNode(true);
  loginButton.parentNode.replaceChild(newLoginButton, loginButton);
  
  // Agregar el event listener de login
  newLoginButton.addEventListener('click', (e) => {
    console.log('🎮 ¡Click detectado en botón de login tras logout!', e);
    console.log('🎮 Abriendo modal de login...');
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    
    // Enfocar el primer campo
    setTimeout(() => {
      document.getElementById('login-email')?.focus();
    }, 100);
    
    // Mostrar credenciales de prueba en consola
    console.log('🎮 Credenciales de prueba disponibles:');
    console.log('📧 angel@levelupgamer.cl | 🔑 123456');
    console.log('📧 pro@levelupgamer.cl | 🔑 gamer123');
    console.log('📧 test@duocuc.cl | 🔑 test123');
  });
  
  // Restaurar botón de registro
  registerButton.style.display = 'inline-flex';
  registerButton.textContent = '👤 Registrarse';
  registerButton.title = '';
  
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

// ===== Sistema de Semillas de Productos Avanzados =====

// Base de datos extendida de productos gaming
const detailedProducts = [
  {
    id: 101,
    name: 'GeForce RTX 4090',
    price: 2500000,
    category: 'Tarjetas Gráficas',
    brand: 'NVIDIA',
    icon: '🔥',
    description: 'La tarjeta gráfica más potente del mercado para gaming en 4K',
    image: 'https://via.placeholder.com/300x200?text=RTX+4090',
    stock: 15,
    rating: 4.9,
    reviews: 127,
    featured: true,
    available: true,
    specifications: {
      memory: '24GB GDDR6X',
      coreClock: '2230 MHz',
      memorySpeed: '21 Gbps',
      powerConsumption: '450W'
    }
  },
  {
    id: 102,
    name: 'AMD Ryzen 9 7950X',
    price: 800000,
    category: 'Procesadores',
    brand: 'AMD',
    icon: '⚡',
    description: 'Procesador de alto rendimiento para gaming extremo y creación de contenido',
    image: 'https://via.placeholder.com/300x200?text=Ryzen+9',
    stock: 8,
    rating: 4.8,
    reviews: 89,
    featured: true,
    available: true,
    specifications: {
      cores: '16 cores / 32 threads',
      baseClock: '4.5 GHz',
      boostClock: '5.7 GHz',
      cache: '80MB'
    }
  },
  {
    id: 103,
    name: 'Corsair Vengeance RGB Pro',
    price: 180000,
    category: 'Memoria RAM',
    brand: 'Corsair',
    icon: '💾',
    description: 'Memoria RAM DDR4 con RGB personalizable y perfiles XMP',
    image: 'https://via.placeholder.com/300x200?text=RAM+RGB',
    stock: 25,
    rating: 4.7,
    reviews: 156,
    featured: true,
    available: true,
    specifications: {
      capacity: '32GB (2x16GB)',
      speed: 'DDR4-3600',
      timing: 'CL18',
      voltage: '1.35V'
    }
  },
  {
    id: 104,
    name: 'Samsung 980 PRO SSD',
    price: 250000,
    category: 'Almacenamiento',
    brand: 'Samsung',
    icon: '💿',
    description: 'SSD NVMe de alta velocidad para carga instantánea de juegos',
    image: 'https://via.placeholder.com/300x200?text=SSD+PRO',
    stock: 20,
    rating: 4.8,
    reviews: 203,
    featured: true,
    available: true,
    specifications: {
      capacity: '2TB',
      interface: 'PCIe 4.0 NVMe',
      readSpeed: '7,000 MB/s',
      writeSpeed: '6,900 MB/s'
    }
  },
  {
    id: 105,
    name: 'Logitech G Pro X Superlight',
    price: 150000,
    category: 'Periféricos',
    brand: 'Logitech',
    icon: '🖱️',
    description: 'Mouse gaming ultraliviano para competición profesional',
    image: 'https://via.placeholder.com/300x200?text=Mouse+Pro',
    stock: 30,
    rating: 4.9,
    reviews: 312,
    featured: true,
    available: true,
    specifications: {
      weight: '63g',
      sensor: 'HERO 25K',
      battery: '70+ horas',
      connectivity: 'LIGHTSPEED Wireless'
    }
  },
  {
    id: 106,
    name: 'HyperX Alloy Elite RGB',
    price: 120000,
    category: 'Periféricos',
    brand: 'HyperX',
    icon: '⌨️',
    description: 'Teclado mecánico con switches Cherry MX y RGB per-key',
    image: 'https://via.placeholder.com/300x200?text=Keyboard+RGB',
    stock: 18,
    rating: 4.6,
    reviews: 98,
    featured: true,
    available: true,
    specifications: {
      switches: 'Cherry MX Red',
      backlight: 'RGB personalizable',
      layout: 'Full size',
      connectivity: 'USB-C'
    }
  }
];

// Semillas de productos para expandir el catálogo
const productSeeds = {
  tarjetasGraficas: [
    {
      name: 'GeForce RTX 4080',
      brand: 'NVIDIA',
      price: 1800000,
      icon: '🔥',
      description: 'Tarjeta gráfica de alto rendimiento para gaming 4K',
      specifications: {
        memory: '16GB GDDR6X',
        coreClock: '2205 MHz',
        memorySpeed: '22.4 Gbps',
        powerConsumption: '320W'
      }
    },
    {
      name: 'Radeon RX 7900 XTX',
      brand: 'AMD',
      price: 1600000,
      icon: '🔥',
      description: 'GPU AMD de última generación con arquitectura RDNA 3',
      specifications: {
        memory: '24GB GDDR6',
        coreClock: '2300 MHz',
        memorySpeed: '20 Gbps',
        powerConsumption: '355W'
      }
    },
    {
      name: 'GeForce RTX 4070 Ti',
      brand: 'NVIDIA',
      price: 1200000,
      icon: '🔥',
      description: 'Tarjeta gráfica equilibrada para gaming 1440p',
      specifications: {
        memory: '12GB GDDR6X',
        coreClock: '2310 MHz',
        memorySpeed: '21 Gbps',
        powerConsumption: '285W'
      }
    }
  ],
  
  procesadores: [
    {
      name: 'Intel Core i9-13900K',
      brand: 'Intel',
      price: 750000,
      icon: '⚡',
      description: 'Procesador Intel de 13va generación para gaming extremo',
      specifications: {
        cores: '24 cores (8P+16E)',
        baseClock: '3.0 GHz',
        boostClock: '5.8 GHz',
        cache: '36MB'
      }
    },
    {
      name: 'AMD Ryzen 7 7800X3D',
      brand: 'AMD',
      price: 650000,
      icon: '⚡',
      description: 'Procesador gaming con tecnología 3D V-Cache',
      specifications: {
        cores: '8 cores / 16 threads',
        baseClock: '4.2 GHz',
        boostClock: '5.0 GHz',
        cache: '104MB (3D V-Cache)'
      }
    },
    {
      name: 'Intel Core i7-13700K',
      brand: 'Intel',
      price: 550000,
      icon: '⚡',
      description: 'Procesador Intel balanceado para gaming y productividad',
      specifications: {
        cores: '16 cores (8P+8E)',
        baseClock: '3.4 GHz',
        boostClock: '5.4 GHz',
        cache: '30MB'
      }
    }
  ],
  
  memoriaRAM: [
    {
      name: 'G.SKILL Trident Z5 RGB',
      brand: 'G.SKILL',
      price: 220000,
      icon: '💾',
      description: 'Memoria DDR5 premium con RGB y overclock',
      specifications: {
        capacity: '32GB (2x16GB)',
        speed: 'DDR5-6000',
        timing: 'CL36',
        voltage: '1.35V'
      }
    },
    {
      name: 'Corsair Dominator Platinum',
      brand: 'Corsair',
      price: 280000,
      icon: '💾',
      description: 'Memoria RAM premium para entusiastas',
      specifications: {
        capacity: '64GB (2x32GB)',
        speed: 'DDR5-5600',
        timing: 'CL40',
        voltage: '1.25V'
      }
    },
    {
      name: 'Kingston Fury Beast RGB',
      brand: 'Kingston',
      price: 150000,
      icon: '💾',
      description: 'Memoria gaming con RGB y perfil XMP',
      specifications: {
        capacity: '16GB (2x8GB)',
        speed: 'DDR4-3200',
        timing: 'CL16',
        voltage: '1.35V'
      }
    }
  ],
  
  almacenamiento: [
    {
      name: 'WD Black SN850X',
      brand: 'Western Digital',
      price: 180000,
      icon: '💿',
      description: 'SSD gaming de alta velocidad con heatsink',
      specifications: {
        capacity: '1TB',
        interface: 'PCIe 4.0 NVMe',
        readSpeed: '7,300 MB/s',
        writeSpeed: '6,600 MB/s'
      }
    },
    {
      name: 'Crucial P5 Plus',
      brand: 'Crucial',
      price: 200000,
      icon: '💿',
      description: 'SSD NVMe con tecnología 3D NAND',
      specifications: {
        capacity: '2TB',
        interface: 'PCIe 4.0 NVMe',
        readSpeed: '6,600 MB/s',
        writeSpeed: '5,000 MB/s'
      }
    },
    {
      name: 'Seagate FireCuda 530',
      brand: 'Seagate',
      price: 350000,
      icon: '💿',
      description: 'SSD premium para gaming y creación de contenido',
      specifications: {
        capacity: '4TB',
        interface: 'PCIe 4.0 NVMe',
        readSpeed: '7,300 MB/s',
        writeSpeed: '6,900 MB/s'
      }
    }
  ],
  
  perifericos: [
    {
      name: 'Razer DeathAdder V3 Pro',
      brand: 'Razer',
      price: 180000,
      icon: '🖱️',
      description: 'Mouse gaming inalámbrico con sensor Focus Pro 30K',
      specifications: {
        weight: '63g',
        sensor: 'Focus Pro 30K',
        battery: '90 horas',
        connectivity: 'HyperSpeed Wireless'
      }
    },
    {
      name: 'SteelSeries Apex Pro TKL',
      brand: 'SteelSeries',
      price: 250000,
      icon: '⌨️',
      description: 'Teclado mecánico con switches ajustables OmniPoint',
      specifications: {
        switches: 'OmniPoint 2.0',
        backlight: 'RGB per-key',
        layout: 'Tenkeyless',
        connectivity: 'USB-C + Wireless'
      }
    },
    {
      name: 'HyperX Cloud Alpha S',
      brand: 'HyperX',
      price: 120000,
      icon: '🎧',
      description: 'Audífonos gaming con sonido surround 7.1',
      specifications: {
        drivers: '50mm neodymium',
        frequency: '13Hz-27kHz',
        microphone: 'Desmontable',
        connectivity: '3.5mm + USB'
      }
    }
  ],
  
  monitores: [
    {
      name: 'ASUS ROG Swift PG279QM',
      brand: 'ASUS',
      price: 800000,
      icon: '🖥️',
      description: 'Monitor gaming 1440p 240Hz con G-SYNC',
      specifications: {
        size: '27 pulgadas',
        resolution: '2560x1440',
        refreshRate: '240Hz',
        panel: 'Fast IPS'
      }
    },
    {
      name: 'Samsung Odyssey G7',
      brand: 'Samsung',
      price: 650000,
      icon: '🖥️',
      description: 'Monitor curvo gaming con HDR y QLED',
      specifications: {
        size: '32 pulgadas',
        resolution: '2560x1440',
        refreshRate: '240Hz',
        panel: 'VA Curvo'
      }
    },
    {
      name: 'LG UltraGear 27GP950',
      brand: 'LG',
      price: 900000,
      icon: '🖥️',
      description: 'Monitor 4K gaming con Nano IPS y HDR600',
      specifications: {
        size: '27 pulgadas',
        resolution: '3840x2160',
        refreshRate: '144Hz',
        panel: 'Nano IPS'
      }
    }
  ]
};

// Función para generar productos desde semillas
function generateProductsFromSeeds() {
    let newProducts = [...detailedProducts]; // Incluir productos base
    let productId = 200; // ID inicial para productos generados
    
    Object.keys(productSeeds).forEach(categoryKey => {
        const categoryName = getCategoryDisplayName(categoryKey);
        
        productSeeds[categoryKey].forEach(seed => {
            const newProduct = {
                id: productId++,
                name: seed.name,
                price: seed.price,
                category: categoryName,
                brand: seed.brand,
                icon: seed.icon,
                description: seed.description,
                image: `https://via.placeholder.com/300x200?text=${encodeURIComponent(seed.name)}`,
                stock: Math.floor(Math.random() * 30) + 5,
                rating: (Math.random() * 1.5 + 3.5).toFixed(1),
                reviews: Math.floor(Math.random() * 200) + 20,
                featured: Math.random() > 0.6, // 40% chance de ser destacado
                available: true,
                specifications: seed.specifications
            };
            
            newProducts.push(newProduct);
        });
    });
    
    return newProducts;
}

// Función auxiliar para obtener nombre de categoría
function getCategoryDisplayName(categoryKey) {
    const categoryMap = {
        'tarjetasGraficas': 'Tarjetas Gráficas',
        'procesadores': 'Procesadores',
        'memoriaRAM': 'Memoria RAM',
        'almacenamiento': 'Almacenamiento',
        'perifericos': 'Periféricos',
        'monitores': 'Monitores'
    };
    
    return categoryMap[categoryKey] || categoryKey;
}

// Variable global para productos expandidos
let expandedProducts = [...detailedProducts];

// Función para activar el sistema de semillas
function activateProductSeeds() {
    expandedProducts = generateProductsFromSeeds();
    
    // Actualizar localStorage
    if (typeof(Storage) !== "undefined") {
        localStorage.setItem('levelup_expanded_products', JSON.stringify(expandedProducts));
    }
    
    // Actualizar productos básicos para compatibilidad con carrito
    const basicProducts = expandedProducts.slice(0, 6).map((product, index) => ({
        id: index + 1,
        name: product.name.substring(0, 20) + (product.name.length > 20 ? '...' : ''),
        price: Math.min(product.price, 999990), // Limitar precio para carrito básico
        icon: product.icon,
        available: true
    }));
    
    // Reemplazar productos básicos
    products.splice(0, products.length, ...basicProducts);
    
    showNotification(`¡Catálogo expandido! ${expandedProducts.length} productos disponibles`, 'success');
    
    // Dar puntos por activar catálogo expandido
    if (isLoggedIn()) {
        const user = getCurrentUser();
        user.points += 10;
        updateUserInStorage(user);
        updateUserInfo();
        showNotification('¡Has ganado 10 puntos por expandir el catálogo!', 'info');
    }
    
    return expandedProducts.length;
}

// Función para obtener productos por categoría
function getProductsByCategory(categoryName) {
    return expandedProducts.filter(product => 
        product.category.toLowerCase() === categoryName.toLowerCase()
    );
}

// Función para obtener productos destacados
function getFeaturedProducts() {
    return expandedProducts.filter(product => product.featured);
}

// Función para buscar productos
function searchProducts(query) {
    const searchTerm = query.toLowerCase();
    return expandedProducts.filter(product => 
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.brand.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm)
    );
}

// Función para obtener productos por rango de precio
function getProductsByPriceRange(minPrice, maxPrice) {
    return expandedProducts.filter(product => 
        product.price >= minPrice && product.price <= maxPrice
    );
}

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

// ===== Sistema de Compartir Productos =====

// Función para compartir productos
function shareProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) {
        showNotification('Producto no encontrado', 'error');
        return;
    }
    
    const shareData = {
        title: `🎮 ${product.name} - Level-Up Gamer`,
        text: `¡Mira este increíble producto gaming! ${product.name} por solo $${product.price.toLocaleString()} 🚀`,
        url: `${window.location.origin}${window.location.pathname}#product-${productId}`
    };
    
    // Verificar si el navegador soporta Web Share API
    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        navigator.share(shareData)
            .then(() => {
                showNotification('¡Producto compartido exitosamente!', 'success');
                
                // Dar puntos por compartir (si está logueado)
                if (isLoggedIn()) {
                    const user = getCurrentUser();
                    user.points += 5; // 5 puntos por compartir
                    updateUserInStorage(user);
                    updateUserInfo();
                    showNotification('¡Has ganado 5 puntos por compartir!', 'info');
                }
            })
            .catch((error) => {
                console.log('Error compartiendo:', error);
                fallbackShare(product, shareData);
            });
    } else {
        // Fallback para navegadores que no soportan Web Share API
        fallbackShare(product, shareData);
    }
}

// Función de respaldo para compartir
function fallbackShare(product, shareData) {
    // Crear modal de compartir
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
        <div class="modal-content share-modal">
            <div class="modal-header">
                <h2>📤 Compartir Producto</h2>
                <button class="close-btn" onclick="closeShareModal(this)">&times;</button>
            </div>
            <div class="modal-body">
                <div class="product-share-info">
                    <div class="product-share-icon">${product.icon}</div>
                    <div class="product-share-details">
                        <h3>${product.name}</h3>
                        <p class="product-share-price">$${product.price.toLocaleString()}</p>
                    </div>
                </div>
                
                <div class="share-options">
                    <h4>Compartir en:</h4>
                    <div class="share-buttons">
                        <button class="share-option whatsapp" onclick="shareToWhatsApp('${encodeURIComponent(shareData.text)}', '${encodeURIComponent(shareData.url)}')">
                            <span class="share-icon">📱</span>
                            <span>WhatsApp</span>
                        </button>
                        
                        <button class="share-option facebook" onclick="shareToFacebook('${encodeURIComponent(shareData.url)}')">
                            <span class="share-icon">📘</span>
                            <span>Facebook</span>
                        </button>
                        
                        <button class="share-option twitter" onclick="shareToTwitter('${encodeURIComponent(shareData.text)}', '${encodeURIComponent(shareData.url)}')">
                            <span class="share-icon">🐦</span>
                            <span>Twitter</span>
                        </button>
                        
                        <button class="share-option email" onclick="shareByEmail('${encodeURIComponent(shareData.title)}', '${encodeURIComponent(shareData.text + ' ' + shareData.url)}')">
                            <span class="share-icon">📧</span>
                            <span>Email</span>
                        </button>
                        
                        <button class="share-option copy" onclick="copyProductLink('${shareData.url}')">
                            <span class="share-icon">📋</span>
                            <span>Copiar enlace</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

// Funciones para compartir en diferentes plataformas
function shareToWhatsApp(text, url) {
    const whatsappUrl = `https://wa.me/?text=${text}%20${url}`;
    window.open(whatsappUrl, '_blank');
    closeShareModal(document.querySelector('.share-modal .close-btn'));
    showNotification('Abriendo WhatsApp...', 'info');
}

function shareToFacebook(url) {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
    window.open(facebookUrl, '_blank', 'width=600,height=400');
    closeShareModal(document.querySelector('.share-modal .close-btn'));
    showNotification('Abriendo Facebook...', 'info');
}

function shareToTwitter(text, url) {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
    window.open(twitterUrl, '_blank', 'width=600,height=400');
    closeShareModal(document.querySelector('.share-modal .close-btn'));
    showNotification('Abriendo Twitter...', 'info');
}

function shareByEmail(subject, body) {
    const emailUrl = `mailto:?subject=${subject}&body=${body}`;
    window.location.href = emailUrl;
    closeShareModal(document.querySelector('.share-modal .close-btn'));
    showNotification('Abriendo cliente de email...', 'info');
}

function copyProductLink(url) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(url).then(() => {
            showNotification('¡Enlace copiado al portapapeles!', 'success');
            closeShareModal(document.querySelector('.share-modal .close-btn'));
            
            // Dar puntos por compartir
            if (isLoggedIn()) {
                const user = getCurrentUser();
                user.points += 5;
                updateUserInStorage(user);
                updateUserInfo();
                showNotification('¡Has ganado 5 puntos por compartir!', 'info');
            }
        }).catch(() => {
            fallbackCopyLink(url);
        });
    } else {
        fallbackCopyLink(url);
    }
}

function fallbackCopyLink(url) {
    // Crear input temporal para copiar
    const tempInput = document.createElement('input');
    tempInput.value = url;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
    
    showNotification('¡Enlace copiado al portapapeles!', 'success');
    closeShareModal(document.querySelector('.share-modal .close-btn'));
    
    if (isLoggedIn()) {
        const user = getCurrentUser();
        user.points += 5;
        updateUserInStorage(user);
        updateUserInfo();
        showNotification('¡Has ganado 5 puntos por compartir!', 'info');
    }
}

// Cerrar modal de compartir
function closeShareModal(btn) {
    const modal = btn.closest('.modal');
    modal.remove();
}

// ===== Sistema de Chat WhatsApp =====

// Estado del chat
let chatOpen = false;
let chatMessages = [];

// Inicializar chat
function initWhatsAppChat() {
    // Ocultar notificación después de 5 segundos
    setTimeout(() => {
        const notification = document.getElementById('whatsapp-notification');
        if (notification) {
            notification.style.display = 'none';
        }
    }, 5000);
    
    // Agregar mensaje de bienvenida después de 3 segundos
    setTimeout(() => {
        if (!chatOpen) {
            showChatNotification();
        }
    }, 3000);
}

// Mostrar notificación de chat
function showChatNotification() {
    const notification = document.getElementById('whatsapp-notification');
    if (notification) {
        notification.style.display = 'flex';
        notification.textContent = '1';
    }
}

// Toggle del chat
function toggleWhatsAppChat() {
    const modal = document.getElementById('whatsapp-chat-modal');
    const notification = document.getElementById('whatsapp-notification');
    
    chatOpen = !chatOpen;
    
    if (chatOpen) {
        modal.classList.add('active');
        notification.style.display = 'none';
    } else {
        modal.classList.remove('active');
    }
}

// Enviar respuesta rápida
function sendQuickResponse(message) {
    addMessageToChat(message, 'sent');
    
    // Simular respuesta automática
    setTimeout(() => {
        let response = '';
        
        switch(message) {
            case '💰 Consultar precios':
                response = 'Perfecto! Todos nuestros productos tienen precios competitivos. ¿Hay algún producto específico que te interese? 🎮';
                break;
            case '📦 Estado de mi pedido':
                response = 'Para consultar el estado de tu pedido, necesito tu número de orden. También puedes revisarlo en tu perfil si estás registrado. 📋';
                break;
            case '🎮 Recomendaciones':
                response = 'Excelente! Te recomiendo revisar nuestros productos destacados. ¿Qué tipo de gaming te gusta más? PC, consolas, o accesorios? 🚀';
                break;
            case '🛠️ Soporte técnico':
                response = 'Estoy aquí para ayudarte con cualquier problema técnico. ¿Podrías contarme más detalles sobre el inconveniente? 🔧';
                break;
            default:
                response = 'Gracias por tu mensaje. Un agente se contactará contigo pronto. ¿Hay algo más en lo que pueda ayudarte? 😊';
        }
        
        addMessageToChat(response, 'received');
    }, 1000);
}

// Manejar Enter en input
function handleWhatsAppEnter(event) {
    if (event.key === 'Enter') {
        sendWhatsAppMessage();
    }
}

// Enviar mensaje personalizado
function sendWhatsAppMessage() {
    const input = document.getElementById('whatsapp-input');
    const message = input.value.trim();
    
    if (message) {
        addMessageToChat(message, 'sent');
        input.value = '';
        
        // Simular respuesta automática
        setTimeout(() => {
            const responses = [
                'Gracias por tu mensaje. Un agente se contactará contigo en breve. 👍',
                'He recibido tu consulta. Te responderemos lo antes posible. 🚀',
                'Mensaje recibido! Nuestro equipo te ayudará pronto. 💪',
                'Perfecto! Un especialista revisará tu consulta y te responderá. ⚡'
            ];
            
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            addMessageToChat(randomResponse, 'received');
        }, 1500);
    }
}

// Agregar mensaje al chat
function addMessageToChat(message, type) {
    const messagesContainer = document.getElementById('whatsapp-messages');
    const time = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    
    const messageElement = document.createElement('div');
    messageElement.className = `whatsapp-message ${type}`;
    messageElement.innerHTML = `
        <div class="message-content">${message}</div>
        <div class="message-time">${time}</div>
    `;
    
    messagesContainer.appendChild(messageElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    // Guardar mensaje
    chatMessages.push({
        message: message,
        type: type,
        time: time
    });
    
    // Dar puntos por interactuar con el chat (solo la primera vez)
    if (chatMessages.length === 1 && isLoggedIn()) {
        const user = getCurrentUser();
        user.points += 3; // 3 puntos por usar el chat
        updateUserInStorage(user);
        updateUserInfo();
        showNotification('¡Has ganado 3 puntos por usar el chat!', 'info');
    }
}

// Abrir WhatsApp directo
function openWhatsAppDirect() {
    const phoneNumber = '+56912345678'; // Número de ejemplo
    const message = '¡Hola! Vengo desde Level-Up Gamer y me gustaría hacer una consulta. 🎮';
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    
    window.open(whatsappUrl, '_blank');
    showNotification('Abriendo WhatsApp...', 'info');
    
    // Cerrar chat modal
    toggleWhatsAppChat();
}

// Llamar a soporte
function callSupport() {
    const phoneNumber = '+56912345678'; // Número de ejemplo
    window.location.href = `tel:${phoneNumber}`;
    showNotification('Iniciando llamada...', 'info');
}

// ===== Integración del Sistema de Semillas con la Interfaz =====

// Función para mostrar productos en el catálogo
function displayCatalogProducts(productsToShow = null) {
    const productGrid = document.querySelector('#featured-grid') || document.querySelector('.products-grid');
    if (!productGrid) return;
    
    const products = productsToShow || expandedProducts.slice(0, 12); // Mostrar primeros 12
    
    productGrid.innerHTML = products.map(product => {
        const reviews = productReviews[product.id] || { averageRating: 0, totalReviews: 0 };
        
        return `
            <div class="product-card" data-product-id="${product.id}">
                <div class="product-icon">${product.icon}</div>
                <div class="product-info">
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-description">${product.description}</p>
                    <div class="product-specs">
                        <span class="product-brand">${product.brand}</span>
                        <span class="product-category">${product.category}</span>
                    </div>
                    <div class="product-rating">
                        <span class="stars">${generateStarRating(reviews.averageRating || 0)}</span>
                        <span class="rating-value">${reviews.averageRating || 0}</span>
                        <span class="reviews-count">(${reviews.totalReviews || 0} reseñas)</span>
                    </div>
                    <div class="product-price">$${product.price.toLocaleString()}</div>
                    <div class="product-stock ${product.stock < 10 ? 'low-stock' : ''}">
                        ${product.stock < 10 ? '⚠️ ' : '✅ '}${product.stock} disponibles
                    </div>
                </div>
                <div class="product-actions">
                    <button class="btn-primary add-to-cart" onclick="addAdvancedToCart(${product.id})">
                        🛒 Agregar al Carrito
                    </button>
                    <button class="btn-secondary view-details" onclick="viewProductDetails(${product.id})">
                        👁️ Ver Detalles
                    </button>
                    <button class="btn-secondary reviews-btn" onclick="openReviewsModal(${product.id})">
                        📝 Reseñas (${reviews.totalReviews || 0})
                    </button>
                    <button class="btn-secondary compare-btn" onclick="addToComparison(${product.id})" title="Agregar a comparación">
                        ⚖️ Comparar
                    </button>
                    <button class="share-btn" onclick="shareProduct(${product.id})">
                        📤 Compartir
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// Función para agregar productos avanzados al carrito
function addAdvancedToCart(productId) {
    const product = expandedProducts.find(p => p.id === productId);
    if (!product) {
        showNotification('Producto no encontrado', 'error');
        return;
    }
    
    if (product.stock <= 0) {
        showNotification('Producto sin stock', 'warning');
        return;
    }
    
    // Adaptar para carrito básico
    const cartItem = {
        id: productId,
        name: product.name,
        price: product.price,
        icon: product.icon,
        quantity: 1
    };
    
    // Verificar si ya existe en el carrito
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
        showNotification(`${product.name} (cantidad: ${existingItem.quantity})`, 'info');
    } else {
        cart.push(cartItem);
        showNotification(`${product.name} agregado al carrito`, 'success');
    }
    
    // Reducir stock
    product.stock -= 1;
    
    // Actualizar localStorage
    localStorage.setItem('levelUpCart', JSON.stringify(cart));
    localStorage.setItem('levelup_expanded_products', JSON.stringify(expandedProducts));
    
    updateCartDisplay();
    updateCartBadge();
    
    // Dar puntos por agregar al carrito
    if (isLoggedIn()) {
        const user = getCurrentUser();
        user.points += 2;
        updateUserInStorage(user);
        updateUserInfo();
    }
}

// Función para ver detalles del producto
function viewProductDetails(productId) {
    const product = expandedProducts.find(p => p.id === productId);
    if (!product) {
        showNotification('Producto no encontrado', 'error');
        return;
    }
    
    // Obtener reseñas del producto
    const reviews = productReviews[productId] || { reviews: [], averageRating: 0, totalReviews: 0 };
    
    // Crear modal de detalles
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
        <div class="modal-content product-details-modal">
            <div class="modal-header">
                <h2>${product.icon} ${product.name}</h2>
                <button class="close-btn" onclick="closeModal(this)">&times;</button>
            </div>
            <div class="modal-body">
                <div class="product-detail-grid">
                    <div class="product-main-info">
                        <img src="${product.image}" alt="${product.name}" class="product-detail-image">
                        <div class="product-detail-price">$${product.price.toLocaleString()}</div>
                        <div class="product-detail-stock ${product.stock < 10 ? 'low-stock' : ''}">
                            ${product.stock < 10 ? '⚠️ ' : '✅ '}${product.stock} en stock
                        </div>
                        <div class="product-rating-detailed">
                            <div class="stars-large">${generateStarRating(reviews.averageRating || 0)}</div>
                            <span class="rating-large">${reviews.averageRating || 0}/5.0</span>
                            <span class="reviews-large">(${reviews.totalReviews || 0} reseñas)</span>
                            <button class="view-reviews-btn" onclick="openReviewsModal(${productId})">
                                📝 Ver todas las reseñas
                            </button>
                        </div>
                    </div>
                    
                    <div class="product-specifications">
                        <h3>📋 Especificaciones</h3>
                        <ul class="specs-list">
                            ${Object.entries(product.specifications).map(([key, value]) => `
                                <li><strong>${key}:</strong> ${value}</li>
                            `).join('')}
                        </ul>
                        
                        <div class="product-meta">
                            <p><strong>Marca:</strong> ${product.brand}</p>
                            <p><strong>Categoría:</strong> ${product.category}</p>
                            <p><strong>Descripción:</strong> ${product.description}</p>
                        </div>
                        
                        <div class="recent-reviews-preview">
                            <h4>📝 Reseñas Recientes</h4>
                            ${reviews.reviews.length > 0 ? 
                                reviews.reviews.slice(0, 2).map(review => `
                                    <div class="mini-review">
                                        <div class="mini-review-header">
                                            <span class="mini-reviewer">${review.username}</span>
                                            <span class="mini-rating">${generateStarRating(review.rating)}</span>
                                        </div>
                                        <p class="mini-review-comment">"${review.comment.substring(0, 100)}${review.comment.length > 100 ? '...' : ''}"</p>
                                    </div>
                                `).join('') :
                                '<p class="no-reviews-mini">Aún no hay reseñas para este producto.</p>'
                            }
                        </div>
                    </div>
                </div>
                
                <div class="product-detail-actions">
                    <button class="btn-primary btn-large" onclick="addAdvancedToCart(${product.id}); closeModal(this)">
                        🛒 Agregar al Carrito - $${product.price.toLocaleString()}
                    </button>
                    <button class="btn-secondary" onclick="shareProduct(${product.id})">
                        📤 Compartir Producto
                    </button>
                    <button class="btn-secondary" onclick="addToWishlist(${product.id})">
                        💝 Agregar a Favoritos
                    </button>
                    <button class="btn-secondary" onclick="openWriteReviewModal(${product.id})">
                        ✍️ Escribir Reseña
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

// Función para cerrar modal genérico
function closeModal(btn) {
    const modal = btn.closest('.modal');
    modal.remove();
}

// Función para filtrar productos por categoría
function filterProductsByCategory(category) {
    if (category === 'all') {
        displayCatalogProducts();
    } else {
        const filteredProducts = getProductsByCategory(category);
        displayCatalogProducts(filteredProducts);
    }
    
    // Actualizar botones de filtro
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    const activeBtn = document.querySelector(`[data-category="${category}"]`);
    if (activeBtn) {
        activeBtn.classList.add('active');
    }
}

// Función para agregar a lista de deseos
function addToWishlist(productId) {
    let wishlist = JSON.parse(localStorage.getItem('levelup_wishlist')) || [];
    
    if (wishlist.includes(productId)) {
        showNotification('El producto ya está en tu lista de deseos', 'info');
        return;
    }
    
    wishlist.push(productId);
    localStorage.setItem('levelup_wishlist', JSON.stringify(wishlist));
    
    showNotification('Producto agregado a favoritos', 'success');
    
    if (isLoggedIn()) {
        const user = getCurrentUser();
        user.points += 1;
        updateUserInStorage(user);
        updateUserInfo();
    }
}

// Función para mostrar controles del catálogo
function showCatalogControls() {
    const controlsContainer = document.querySelector('.catalog-controls') || createCatalogControls();
    
    controlsContainer.innerHTML = `
        <div class="catalog-header">
            <h2>🎮 Catálogo Gaming Level-Up</h2>
            <div class="catalog-stats">
                <span>${expandedProducts.length} productos disponibles</span>
                <button class="btn-secondary" onclick="activateProductSeeds()">
                    🌱 Expandir Catálogo
                </button>
            </div>
        </div>
        
        <div class="catalog-filters">
            <button class="filter-btn active" data-category="all" onclick="filterProductsByCategory('all')">
                🏠 Todos
            </button>
            <button class="filter-btn" data-category="Tarjetas Gráficas" onclick="filterProductsByCategory('Tarjetas Gráficas')">
                🔥 GPUs
            </button>
            <button class="filter-btn" data-category="Procesadores" onclick="filterProductsByCategory('Procesadores')">
                ⚡ CPUs
            </button>
            <button class="filter-btn" data-category="Memoria RAM" onclick="filterProductsByCategory('Memoria RAM')">
                💾 RAM
            </button>
            <button class="filter-btn" data-category="Almacenamiento" onclick="filterProductsByCategory('Almacenamiento')">
                💿 Storage
            </button>
            <button class="filter-btn" data-category="Periféricos" onclick="filterProductsByCategory('Periféricos')">
                🖱️ Periféricos
            </button>
            <button class="filter-btn" data-category="Monitores" onclick="filterProductsByCategory('Monitores')">
                🖥️ Monitores
            </button>
        </div>
        
        <div class="catalog-search">
            <input type="text" id="product-search" placeholder="Buscar productos..." onkeyup="searchProductsCatalog(this.value)">
            <button class="btn-primary" onclick="searchProductsCatalog(document.getElementById('product-search').value)">
                🔍 Buscar
            </button>
        </div>
    `;
}

function createCatalogControls() {
    const container = document.createElement('div');
    container.className = 'catalog-controls';
    
    const mainContent = document.querySelector('main') || document.body;
    mainContent.insertBefore(container, mainContent.firstChild);
    
    return container;
}

// Función de búsqueda en tiempo real
function searchProductsCatalog(query) {
    if (query.trim() === '') {
        displayCatalogProducts();
        return;
    }
    
    const results = searchProducts(query);
    displayCatalogProducts(results);
    
    if (results.length === 0) {
        document.querySelector('#featured-grid').innerHTML = `
            <div class="no-results">
                <h3>😔 No se encontraron productos</h3>
                <p>Intenta con otros términos de búsqueda</p>
            </div>
        `;
    }
}

// ===== Sistema de Banner Promocional Dinámico =====

// Estado del banner
let currentBannerSlide = 0;
const totalBannerSlides = 4;
let bannerInterval;
let bannerTimers = {};

// Datos de promociones
const promotions = {
    1: {
        title: '¡BLACK FRIDAY GAMER!',
        discount: 50,
        endTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 horas
        products: [101, 102], // IDs de productos en oferta
        points: 20
    },
    2: {
        title: 'SETUP GAMER COMPLETO',
        discount: 30,
        endTime: new Date(Date.now() + 48 * 60 * 60 * 1000), // 48 horas
        products: [101, 103, 105, 106],
        points: 50
    },
    3: {
        title: 'COMPRA Y GANA PUNTOS',
        bonusPoints: 500,
        minPurchase: 100000,
        endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 días
        points: 10
    },
    4: {
        title: 'RTX 4090 DISPONIBLE',
        newProduct: true,
        products: [101],
        stock: 15,
        points: 15
    }
};

// Inicializar banner promocional
function initPromotionalBanner() {
    startBannerRotation();
    initBannerTimers();
    showRandomNotification();
    
    // Mostrar notificaciones aleatorias cada 10 segundos
    setInterval(showRandomNotification, 10000);
}

// Iniciar rotación automática del banner
function startBannerRotation() {
    bannerInterval = setInterval(() => {
        nextBanner();
    }, 8000); // Cambiar cada 8 segundos
}

// Función para siguiente banner
function nextBanner() {
    currentBannerSlide = (currentBannerSlide + 1) % totalBannerSlides;
    showBannerSlide(currentBannerSlide);
}

// Función para banner anterior
function previousBanner() {
    currentBannerSlide = (currentBannerSlide - 1 + totalBannerSlides) % totalBannerSlides;
    showBannerSlide(currentBannerSlide);
}

// Ir a banner específico
function goToBanner(slideIndex) {
    currentBannerSlide = slideIndex;
    showBannerSlide(currentBannerSlide);
    
    // Reiniciar rotación automática
    clearInterval(bannerInterval);
    startBannerRotation();
}

// Mostrar slide específico
function showBannerSlide(index) {
    const slides = document.querySelectorAll('.banner-slide');
    const indicators = document.querySelectorAll('.indicator');
    
    // Ocultar todos los slides
    slides.forEach(slide => {
        slide.classList.remove('active');
    });
    
    // Remover active de todos los indicadores
    indicators.forEach(indicator => {
        indicator.classList.remove('active');
    });
    
    // Mostrar slide actual
    if (slides[index]) {
        slides[index].classList.add('active');
    }
    
    // Activar indicador actual
    if (indicators[index]) {
        indicators[index].classList.add('active');
    }
}

// Inicializar timers de promociones
function initBannerTimers() {
    Object.keys(promotions).forEach(promoId => {
        const promo = promotions[promoId];
        if (promo.endTime) {
            updateBannerTimer(promoId, promo.endTime);
            bannerTimers[promoId] = setInterval(() => {
                updateBannerTimer(promoId, promo.endTime);
            }, 1000);
        }
    });
}

// Actualizar timer de banner
function updateBannerTimer(promoId, endTime) {
    const timerElement = document.getElementById(`timer-${promoId}`);
    if (!timerElement) return;
    
    const now = new Date().getTime();
    const distance = endTime.getTime() - now;
    
    if (distance < 0) {
        timerElement.querySelector('.timer-value').textContent = 'EXPIRADO';
        clearInterval(bannerTimers[promoId]);
        return;
    }
    
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
    let timeString = '';
    if (days > 0) {
        timeString = `${days}d ${hours}h ${minutes}m`;
    } else {
        timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    timerElement.querySelector('.timer-value').textContent = timeString;
}

// Reclamar promoción
function claimPromotion(promoId) {
    const promo = promotions[promoId];
    if (!promo) {
        showNotification('Promoción no encontrada', 'error');
        return;
    }
    
    // Verificar si el usuario está logueado
    if (!isLoggedIn()) {
        showNotification('Debes iniciar sesión para reclamar promociones', 'warning');
        openModal('login-modal');
        return;
    }
    
    const user = getCurrentUser();
    
    // Verificar si ya reclamó esta promoción
    if (!user.claimedPromotions) {
        user.claimedPromotions = [];
    }
    
    if (user.claimedPromotions.includes(promoId)) {
        showNotification('Ya has reclamado esta promoción', 'info');
        return;
    }
    
    // Aplicar promoción según el tipo
    let message = '';
    let pointsEarned = promo.points || 0;
    
    switch(promoId) {
        case 1: // Black Friday
            message = `¡Promoción activada! Descuento del ${promo.discount}% en productos seleccionados`;
            applyDiscountToProducts(promo.products, promo.discount);
            break;
            
        case 2: // Bundle completo
            message = `¡Bundle activado! Descuento del ${promo.discount}% en setup completo`;
            applyDiscountToProducts(promo.products, promo.discount);
            break;
            
        case 3: // Bonus puntos
            message = `¡Bonus activado! Ganarás ${promo.bonusPoints} puntos extra por compras sobre $${promo.minPurchase.toLocaleString()}`;
            user.bonusActive = {
                type: 'points',
                bonus: promo.bonusPoints,
                minPurchase: promo.minPurchase,
                endTime: promo.endTime
            };
            break;
            
        case 4: // Nuevo producto
            message = `¡Acceso prioritario activado! Puedes pre-ordenar el ${promo.title}`;
            break;
    }
    
    // Marcar promoción como reclamada
    user.claimedPromotions.push(promoId);
    
    // Dar puntos
    user.points += pointsEarned;
    
    // Guardar cambios
    updateUserInStorage(user);
    updateUserInfo();
    
    showNotification(message, 'success');
    
    if (pointsEarned > 0) {
        setTimeout(() => {
            showNotification(`¡Has ganado ${pointsEarned} puntos por reclamar la promoción!`, 'info');
        }, 1500);
    }
}

// Aplicar descuento a productos
function applyDiscountToProducts(productIds, discountPercent) {
    productIds.forEach(productId => {
        const product = expandedProducts.find(p => p.id === productId);
        if (product && !product.discountApplied) {
            product.originalPrice = product.price;
            product.price = Math.floor(product.price * (1 - discountPercent / 100));
            product.discountApplied = discountPercent;
            product.discountExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 horas
        }
    });
    
    // Actualizar localStorage
    localStorage.setItem('levelup_expanded_products', JSON.stringify(expandedProducts));
    
    // Refrescar catálogo si está visible
    if (document.querySelector('#featured-grid')) {
        displayCatalogProducts();
    }
}

// Mostrar notificaciones aleatorias de compras
function showRandomNotification() {
    const notifications = [
        { icon: '🛒', text: 'María compró RTX 4080 hace 3 min' },
        { icon: '⚡', text: 'Carlos agregó Ryzen 9 al carrito' },
        { icon: '🎮', text: 'Ana completó su setup gaming' },
        { icon: '🏆', text: 'Luis ganó 500 puntos por su compra' },
        { icon: '💎', text: 'Sofía activó membership premium' },
        { icon: '🔥', text: 'Pedro reclamó descuento Black Friday' },
        { icon: '🎁', text: 'Alguien ganó un juego gratis' },
        { icon: '⭐', text: 'Nueva reseña 5⭐ para SSD Samsung' }
    ];
    
    const randomNotification = notifications[Math.floor(Math.random() * notifications.length)];
    const notificationContainer = document.getElementById('banner-notifications');
    
    if (notificationContainer) {
        // Limpiar notificación anterior
        notificationContainer.innerHTML = '';
        
        // Crear nueva notificación
        const notificationElement = document.createElement('div');
        notificationElement.className = 'notification-item';
        notificationElement.innerHTML = `
            <span class="notification-icon">${randomNotification.icon}</span>
            <span class="notification-text">${randomNotification.text}</span>
        `;
        
        notificationContainer.appendChild(notificationElement);
        
        // Remover después de 8 segundos
        setTimeout(() => {
            if (notificationElement.parentNode) {
                notificationElement.style.animation = 'slideOutRight 0.5s ease';
                setTimeout(() => {
                    notificationContainer.removeChild(notificationElement);
                }, 500);
            }
        }, 8000);
    }
}

// Verificar y limpiar descuentos expirados
function checkExpiredDiscounts() {
    const now = new Date();
    let discountsRemoved = false;
    
    expandedProducts.forEach(product => {
        if (product.discountApplied && product.discountExpiry && now > product.discountExpiry) {
            product.price = product.originalPrice;
            delete product.discountApplied;
            delete product.discountExpiry;
            delete product.originalPrice;
            discountsRemoved = true;
        }
    });
    
    if (discountsRemoved) {
        localStorage.setItem('levelup_expanded_products', JSON.stringify(expandedProducts));
        showNotification('Algunos descuentos han expirado', 'info');
    }
}

// ===== Sistema de Reseñas Avanzado =====

// Base de datos de reseñas
let productReviews = JSON.parse(localStorage.getItem('levelup_reviews')) || {};

// Estructura de reseña
// {
//   productId: {
//     reviews: [
//       {
//         id: uniqueId,
//         userId: userId,
//         username: username,
//         rating: 1-5,
//         title: string,
//         comment: string,
//         date: timestamp,
//         helpful: number,
//         verified: boolean,
//         images: [urls]
//       }
//     ],
//     averageRating: number,
//     totalReviews: number
//   }
// }

// Inicializar sistema de reseñas
function initReviewSystem() {
    // Cargar reseñas desde localStorage
    loadReviewsFromStorage();
    
    // Generar reseñas de ejemplo si no existen
    if (Object.keys(productReviews).length === 0) {
        generateSampleReviews();
    }
}

// Cargar reseñas desde localStorage
function loadReviewsFromStorage() {
    const stored = localStorage.getItem('levelup_reviews');
    if (stored) {
        productReviews = JSON.parse(stored);
    }
}

// Guardar reseñas en localStorage
function saveReviewsToStorage() {
    localStorage.setItem('levelup_reviews', JSON.stringify(productReviews));
}

// Generar reseñas de ejemplo
function generateSampleReviews() {
    const sampleReviews = {
        101: { // RTX 4090
            reviews: [
                {
                    id: 'review_101_1',
                    userId: 'user_sample_1',
                    username: 'GamerPro2023',
                    rating: 5,
                    title: '¡Increíble rendimiento en 4K!',
                    comment: 'Esta GPU es simplemente espectacular. Puedo jugar todos los juegos en 4K a 120fps sin problemas. La inversión vale totalmente la pena para gamers serios.',
                    date: Date.now() - 7 * 24 * 60 * 60 * 1000, // 7 días atrás
                    helpful: 23,
                    verified: true,
                    images: []
                },
                {
                    id: 'review_101_2',
                    userId: 'user_sample_2',
                    username: 'TechReviewer',
                    rating: 4,
                    title: 'Potente pero costosa',
                    comment: 'Excelente para gaming y trabajo profesional. El consumo de energía es alto, asegúrate de tener una fuente adecuada. Temperaturas controladas con buen cooling.',
                    date: Date.now() - 3 * 24 * 60 * 60 * 1000,
                    helpful: 15,
                    verified: true,
                    images: []
                },
                {
                    id: 'review_101_3',
                    userId: 'user_sample_3',
                    username: 'CyberGamer',
                    rating: 5,
                    title: 'La mejor inversión gaming',
                    comment: 'Después de 2 meses de uso intensivo, puedo confirmar que es la mejor GPU del mercado. Ray tracing perfecto, DLSS increíble.',
                    date: Date.now() - 1 * 24 * 60 * 60 * 1000,
                    helpful: 8,
                    verified: true,
                    images: []
                }
            ]
        },
        102: { // Ryzen 9 7950X
            reviews: [
                {
                    id: 'review_102_1',
                    userId: 'user_sample_4',
                    username: 'ProcessorExpert',
                    rating: 5,
                    title: 'Bestia de procesador',
                    comment: 'Para gaming y streaming es perfecto. Los 16 cores manejan todo sin problemas. Temperaturas bajo control con buen cooler.',
                    date: Date.now() - 5 * 24 * 60 * 60 * 1000,
                    helpful: 19,
                    verified: true,
                    images: []
                },
                {
                    id: 'review_102_2',
                    userId: 'user_sample_5',
                    username: 'ContentCreator',
                    rating: 5,
                    title: 'Perfecto para creación de contenido',
                    comment: 'Renderizo videos 4K en tiempo récord. Para gaming va de lujo, pero donde realmente brilla es en productividad.',
                    date: Date.now() - 2 * 24 * 60 * 60 * 1000,
                    helpful: 12,
                    verified: true,
                    images: []
                }
            ]
        },
        105: { // Mouse Logitech
            reviews: [
                {
                    id: 'review_105_1',
                    userId: 'user_sample_6',
                    username: 'ProPlayer',
                    rating: 5,
                    title: 'Mouse perfecto para esports',
                    comment: 'Llevo 6 meses usándolo en competencias. La precisión es increíble, cero delay, batería dura muchísimo. Lo recomiendo 100%.',
                    date: Date.now() - 4 * 24 * 60 * 60 * 1000,
                    helpful: 31,
                    verified: true,
                    images: []
                },
                {
                    id: 'review_105_2',
                    userId: 'user_sample_7',
                    username: 'CasualGamer',
                    rating: 4,
                    title: 'Muy bueno, pero caro',
                    comment: 'Excelente calidad y performance. Para usuarios casuales quizás sea mucho, pero si juegas en serio vale la pena.',
                    date: Date.now() - 1 * 24 * 60 * 60 * 1000,
                    helpful: 7,
                    verified: false,
                    images: []
                }
            ]
        }
    };
    
    // Calcular estadísticas para cada producto
    Object.keys(sampleReviews).forEach(productId => {
        const reviews = sampleReviews[productId].reviews;
        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        const averageRating = (totalRating / reviews.length).toFixed(1);
        
        sampleReviews[productId].averageRating = parseFloat(averageRating);
        sampleReviews[productId].totalReviews = reviews.length;
    });
    
    productReviews = sampleReviews;
    saveReviewsToStorage();
}

// Abrir modal de reseñas para un producto
function openReviewsModal(productId) {
    const product = expandedProducts.find(p => p.id === productId);
    if (!product) {
        showNotification('Producto no encontrado', 'error');
        return;
    }
    
    const reviews = productReviews[productId] || { reviews: [], averageRating: 0, totalReviews: 0 };
    
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
        <div class="modal-content reviews-modal">
            <div class="modal-header">
                <h2>📝 Reseñas: ${product.name}</h2>
                <button class="close-btn" onclick="closeModal(this)">&times;</button>
            </div>
            <div class="modal-body">
                <div class="reviews-summary">
                    <div class="rating-overview">
                        <div class="average-rating">
                            <span class="rating-number">${reviews.averageRating || 0}</span>
                            <div class="rating-stars">
                                ${generateStarRating(reviews.averageRating || 0)}
                            </div>
                            <span class="total-reviews">${reviews.totalReviews || 0} reseñas</span>
                        </div>
                        <div class="rating-breakdown">
                            ${generateRatingBreakdown(reviews.reviews || [])}
                        </div>
                    </div>
                    
                    <div class="review-actions">
                        <button class="btn-primary" onclick="openWriteReviewModal(${productId})">
                            ✍️ Escribir Reseña
                        </button>
                        <button class="btn-secondary" onclick="filterReviews(${productId}, 'helpful')">
                            👍 Más Útiles
                        </button>
                        <button class="btn-secondary" onclick="filterReviews(${productId}, 'recent')">
                            🕒 Más Recientes
                        </button>
                    </div>
                </div>
                
                <div class="reviews-list" id="reviews-list-${productId}">
                    ${generateReviewsList(reviews.reviews || [])}
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

// Generar estrellas de calificación
function generateStarRating(rating, interactive = false, size = 'normal') {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    let stars = '';
    
    // Estrellas llenas
    for (let i = 0; i < fullStars; i++) {
        stars += interactive ? 
            `<span class="star ${size} full" data-rating="${i + 1}" onclick="setRating(${i + 1})">⭐</span>` :
            `<span class="star ${size} full">⭐</span>`;
    }
    
    // Media estrella
    if (hasHalfStar) {
        stars += `<span class="star ${size} half">⭐</span>`;
    }
    
    // Estrellas vacías
    for (let i = 0; i < emptyStars; i++) {
        const starIndex = fullStars + (hasHalfStar ? 1 : 0) + i + 1;
        stars += interactive ? 
            `<span class="star ${size} empty" data-rating="${starIndex}" onclick="setRating(${starIndex})">☆</span>` :
            `<span class="star ${size} empty">☆</span>`;
    }
    
    return stars;
}

// Generar desglose de calificaciones
function generateRatingBreakdown(reviews) {
    const ratingCounts = [0, 0, 0, 0, 0]; // índices 0-4 para estrellas 1-5
    
    reviews.forEach(review => {
        if (review.rating >= 1 && review.rating <= 5) {
            ratingCounts[review.rating - 1]++;
        }
    });
    
    const totalReviews = reviews.length;
    
    let breakdown = '';
    for (let i = 4; i >= 0; i--) { // 5 estrellas a 1 estrella
        const count = ratingCounts[i];
        const percentage = totalReviews > 0 ? (count / totalReviews * 100).toFixed(0) : 0;
        
        breakdown += `
            <div class="rating-bar">
                <span class="rating-label">${i + 1} ⭐</span>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${percentage}%"></div>
                </div>
                <span class="rating-count">${count}</span>
            </div>
        `;
    }
    
    return breakdown;
}

// Generar lista de reseñas
function generateReviewsList(reviews) {
    if (reviews.length === 0) {
        return `
            <div class="no-reviews">
                <h3>🤔 Aún no hay reseñas</h3>
                <p>¡Sé el primero en escribir una reseña!</p>
            </div>
        `;
    }
    
    return reviews.map(review => `
        <div class="review-item" data-review-id="${review.id}">
            <div class="review-header">
                <div class="reviewer-info">
                    <div class="reviewer-avatar">${getAvatarIcon(review.username)}</div>
                    <div class="reviewer-details">
                        <span class="reviewer-name">${review.username}</span>
                        ${review.verified ? '<span class="verified-badge">✅ Compra verificada</span>' : ''}
                    </div>
                </div>
                <div class="review-rating">
                    ${generateStarRating(review.rating)}
                    <span class="review-date">${formatReviewDate(review.date)}</span>
                </div>
            </div>
            
            <div class="review-content">
                <h4 class="review-title">${review.title}</h4>
                <p class="review-comment">${review.comment}</p>
                
                ${review.images && review.images.length > 0 ? `
                    <div class="review-images">
                        ${review.images.map(img => `<img src="${img}" alt="Imagen de reseña" class="review-image">`).join('')}
                    </div>
                ` : ''}
            </div>
            
            <div class="review-actions">
                <button class="review-action-btn helpful" onclick="markReviewHelpful('${review.id}')">
                    👍 Útil (${review.helpful || 0})
                </button>
                <button class="review-action-btn reply" onclick="replyToReview('${review.id}')">
                    💬 Responder
                </button>
                <button class="review-action-btn report" onclick="reportReview('${review.id}')">
                    🚨 Reportar
                </button>
            </div>
        </div>
    `).join('');
}

// Obtener ícono de avatar basado en username
function getAvatarIcon(username) {
    const avatars = ['👨‍💻', '👩‍💻', '🎮', '👨‍🎓', '👩‍🎓', '🕹️', '👾', '🤖'];
    const index = username.length % avatars.length;
    return avatars[index];
}

// Formatear fecha de reseña
function formatReviewDate(timestamp) {
    const now = new Date();
    const reviewDate = new Date(timestamp);
    const diffTime = Math.abs(now - reviewDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Hace 1 día';
    if (diffDays < 7) return `Hace ${diffDays} días`;
    if (diffDays < 30) return `Hace ${Math.floor(diffDays / 7)} semanas`;
    if (diffDays < 365) return `Hace ${Math.floor(diffDays / 30)} meses`;
    return `Hace ${Math.floor(diffDays / 365)} años`;
}

// Abrir modal para escribir reseña
function openWriteReviewModal(productId) {
    if (!isLoggedIn()) {
        showNotification('Debes iniciar sesión para escribir una reseña', 'warning');
        return;
    }
    
    const product = expandedProducts.find(p => p.id === productId);
    const user = getCurrentUser();
    
    // Verificar si ya escribió una reseña
    const existingReview = productReviews[productId]?.reviews?.find(r => r.userId === user.username);
    if (existingReview) {
        showNotification('Ya has escrito una reseña para este producto', 'info');
        return;
    }
    
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
        <div class="modal-content write-review-modal">
            <div class="modal-header">
                <h2>✍️ Escribir Reseña: ${product.name}</h2>
                <button class="close-btn" onclick="closeModal(this)">&times;</button>
            </div>
            <div class="modal-body">
                <form id="review-form" onsubmit="submitReview(event, ${productId})">
                    <div class="review-form-group">
                        <label>Calificación *</label>
                        <div class="rating-input" id="rating-input">
                            ${generateStarRating(0, true, 'large')}
                        </div>
                        <input type="hidden" id="review-rating" name="rating" value="0" required>
                    </div>
                    
                    <div class="review-form-group">
                        <label for="review-title">Título de tu reseña *</label>
                        <input 
                            type="text" 
                            id="review-title" 
                            name="title" 
                            placeholder="Ej: Excelente producto para gaming"
                            maxlength="100"
                            required
                        >
                    </div>
                    
                    <div class="review-form-group">
                        <label for="review-comment">Tu opinión *</label>
                        <textarea 
                            id="review-comment" 
                            name="comment" 
                            placeholder="Comparte tu experiencia con este producto..."
                            rows="6"
                            maxlength="1000"
                            required
                        ></textarea>
                        <div class="char-counter">
                            <span id="char-count">0</span>/1000 caracteres
                        </div>
                    </div>
                    
                    <div class="review-form-group">
                        <label>¿Recomendarías este producto?</label>
                        <div class="recommendation-input">
                            <label class="radio-label">
                                <input type="radio" name="recommend" value="yes" checked>
                                <span>👍 Sí, lo recomiendo</span>
                            </label>
                            <label class="radio-label">
                                <input type="radio" name="recommend" value="no">
                                <span>👎 No lo recomiendo</span>
                            </label>
                        </div>
                    </div>
                    
                    <div class="review-form-actions">
                        <button type="button" class="btn-secondary" onclick="closeModal(this)">
                            Cancelar
                        </button>
                        <button type="submit" class="btn-primary">
                            📝 Publicar Reseña
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Agregar contador de caracteres
    const commentTextarea = document.getElementById('review-comment');
    const charCount = document.getElementById('char-count');
    
    commentTextarea.addEventListener('input', function() {
        charCount.textContent = this.value.length;
    });
}

// Establecer calificación en el formulario
let currentRating = 0;

function setRating(rating) {
    currentRating = rating;
    document.getElementById('review-rating').value = rating;
    
    // Actualizar visualización de estrellas
    const stars = document.querySelectorAll('#rating-input .star');
    stars.forEach((star, index) => {
        if (index < rating) {
            star.className = star.className.replace('empty', 'full');
            star.textContent = '⭐';
        } else {
            star.className = star.className.replace('full', 'empty');
            star.textContent = '☆';
        }
    });
}

// Enviar reseña
function submitReview(event, productId) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const rating = parseInt(formData.get('rating'));
    const title = formData.get('title').trim();
    const comment = formData.get('comment').trim();
    const recommend = formData.get('recommend');
    
    // Validaciones
    if (rating === 0) {
        showNotification('Debes seleccionar una calificación', 'warning');
        return;
    }
    
    if (title.length < 10) {
        showNotification('El título debe tener al menos 10 caracteres', 'warning');
        return;
    }
    
    if (comment.length < 20) {
        showNotification('El comentario debe tener al menos 20 caracteres', 'warning');
        return;
    }
    
    const user = getCurrentUser();
    
    // Crear reseña
    const newReview = {
        id: `review_${productId}_${Date.now()}`,
        userId: user.username,
        username: user.username,
        rating: rating,
        title: title,
        comment: comment,
        date: Date.now(),
        helpful: 0,
        verified: hasUserPurchasedProduct(user.username, productId),
        recommend: recommend === 'yes',
        images: []
    };
    
    // Agregar a la base de datos
    if (!productReviews[productId]) {
        productReviews[productId] = {
            reviews: [],
            averageRating: 0,
            totalReviews: 0
        };
    }
    
    productReviews[productId].reviews.unshift(newReview); // Agregar al inicio
    
    // Recalcular estadísticas
    const reviews = productReviews[productId].reviews;
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    productReviews[productId].averageRating = parseFloat((totalRating / reviews.length).toFixed(1));
    productReviews[productId].totalReviews = reviews.length;
    
    // Guardar en localStorage
    saveReviewsToStorage();
    
    // Dar puntos al usuario
    user.points += 15; // 15 puntos por escribir reseña
    if (newReview.verified) {
        user.points += 10; // 10 puntos extra por compra verificada
    }
    updateUserInStorage(user);
    updateUserInfo();
    
    // Cerrar modal y mostrar notificación
    closeModal(event.target);
    showNotification('¡Reseña publicada exitosamente!', 'success');
    
    // Actualizar modal de reseñas si está abierto
    const reviewsModal = document.querySelector('.reviews-modal');
    if (reviewsModal) {
        closeModal(reviewsModal.querySelector('.close-btn'));
        setTimeout(() => openReviewsModal(productId), 500);
    }
    
    // Mostrar puntos ganados
    setTimeout(() => {
        const pointsEarned = newReview.verified ? 25 : 15;
        showNotification(`¡Has ganado ${pointsEarned} puntos por tu reseña!`, 'info');
    }, 1500);
}

// Verificar si el usuario compró el producto
function hasUserPurchasedProduct(username, productId) {
    // Verificar en historial de compras (simulado)
    const purchaseHistory = JSON.parse(localStorage.getItem(`purchase_history_${username}`)) || [];
    return purchaseHistory.some(purchase => 
        purchase.items && purchase.items.some(item => item.id === productId)
    );
}

// Marcar reseña como útil
function markReviewHelpful(reviewId) {
    if (!isLoggedIn()) {
        showNotification('Debes iniciar sesión para marcar reseñas como útiles', 'warning');
        return;
    }
    
    const user = getCurrentUser();
    
    // Verificar si ya marcó esta reseña
    if (!user.helpfulReviews) {
        user.helpfulReviews = [];
    }
    
    if (user.helpfulReviews.includes(reviewId)) {
        showNotification('Ya marcaste esta reseña como útil', 'info');
        return;
    }
    
    // Encontrar y actualizar la reseña
    let reviewFound = false;
    Object.keys(productReviews).forEach(productId => {
        const review = productReviews[productId].reviews.find(r => r.id === reviewId);
        if (review) {
            review.helpful = (review.helpful || 0) + 1;
            reviewFound = true;
        }
    });
    
    if (reviewFound) {
        user.helpfulReviews.push(reviewId);
        user.points += 1; // 1 punto por marcar como útil
        
        updateUserInStorage(user);
        updateUserInfo();
        saveReviewsToStorage();
        
        showNotification('¡Marcado como útil!', 'success');
        
        // Actualizar visualización
        const reviewElement = document.querySelector(`[data-review-id="${reviewId}"]`);
        if (reviewElement) {
            const helpfulBtn = reviewElement.querySelector('.helpful');
            const currentCount = parseInt(helpfulBtn.textContent.match(/\d+/)[0]);
            helpfulBtn.innerHTML = `👍 Útil (${currentCount + 1})`;
            helpfulBtn.disabled = true;
            helpfulBtn.style.opacity = '0.6';
        }
    }
}

// Filtrar reseñas
function filterReviews(productId, filterType) {
    const reviews = productReviews[productId]?.reviews || [];
    let sortedReviews = [...reviews];
    
    switch(filterType) {
        case 'helpful':
            sortedReviews.sort((a, b) => (b.helpful || 0) - (a.helpful || 0));
            break;
        case 'recent':
            sortedReviews.sort((a, b) => b.date - a.date);
            break;
        case 'rating_high':
            sortedReviews.sort((a, b) => b.rating - a.rating);
            break;
        case 'rating_low':
            sortedReviews.sort((a, b) => a.rating - b.rating);
            break;
    }
    
    const reviewsList = document.getElementById(`reviews-list-${productId}`);
    if (reviewsList) {
        reviewsList.innerHTML = generateReviewsList(sortedReviews);
    }
}

// Responder a reseña (función placeholder)
function replyToReview(reviewId) {
    showNotification('Función de respuesta próximamente disponible', 'info');
}

// Reportar reseña (función placeholder)
function reportReview(reviewId) {
    if (!isLoggedIn()) {
        showNotification('Debes iniciar sesión para reportar reseñas', 'warning');
        return;
    }
    
    showNotification('Reseña reportada. Será revisada por nuestro equipo.', 'info');
}

// ===================== WIDGET DE AYUDA/FAQ AVANZADO =====================

let helpSearchTimeout;
let currentHelpCategory = 'faq';

const faqDatabase = {
    shopping: [
        {
            id: 1,
            question: "¿Cómo puedo comprar un producto?",
            answer: "Selecciona el producto deseado, haz clic en 'Agregar al Carrito', revisa tu carrito y procede con el checkout. Puedes pagar con tarjeta, transferencia o efectivo.",
            category: "shopping",
            tags: ["comprar", "carrito", "pago", "checkout"]
        },
        {
            id: 2,
            question: "¿Qué métodos de pago aceptan?",
            answer: "Aceptamos tarjetas de crédito/débito (Visa, MasterCard), transferencias bancarias, WebPay Plus y pago en efectivo en tienda.",
            category: "shopping",
            tags: ["pago", "tarjeta", "transferencia", "efectivo"]
        },
        {
            id: 3,
            question: "¿Puedo cancelar mi pedido?",
            answer: "Sí, puedes cancelar tu pedido antes de que sea procesado. Contacta a nuestro equipo de soporte lo antes posible.",
            category: "shopping",
            tags: ["cancelar", "pedido", "orden"]
        }
    ],
    technical: [
        {
            id: 4,
            question: "¿Ofrecen instalación de componentes?",
            answer: "Sí, ofrecemos servicio de instalación por $25.000. Nuestros técnicos especializados pueden instalar y configurar tus componentes.",
            category: "technical",
            tags: ["instalación", "técnico", "componentes", "servicio"]
        },
        {
            id: 5,
            question: "¿Cómo sé si los componentes son compatibles?",
            answer: "Usa nuestro comparador de productos o consulta con nuestro equipo técnico. También puedes verificar las especificaciones en cada producto.",
            category: "technical",
            tags: ["compatibilidad", "componentes", "comparador"]
        },
        {
            id: 6,
            question: "¿Qué garantía tienen los productos?",
            answer: "Todos nuestros productos incluyen garantía del fabricante. Componentes gaming tienen entre 1-5 años según la marca.",
            category: "technical",
            tags: ["garantía", "warranty", "defectos"]
        }
    ],
    gaming: [
        {
            id: 7,
            question: "¿Qué configuración necesito para gaming 4K?",
            answer: "Para gaming 4K recomendamos RTX 4080/4090, CPU Intel i7/i9 o AMD Ryzen 7/9, 32GB RAM DDR4/DDR5 y SSD NVMe.",
            category: "gaming",
            tags: ["4K", "gaming", "configuración", "RTX", "specs"]
        },
        {
            id: 8,
            question: "¿Cuál es la diferencia entre gaming y streaming?",
            answer: "Para streaming necesitas más CPU y RAM. Recomendamos dual-PC setup o configuraciones con i9/Ryzen 9 y 32GB+ RAM.",
            category: "gaming",
            tags: ["streaming", "gaming", "CPU", "setup"]
        },
        {
            id: 9,
            question: "¿Qué periféricos gaming recomiendan?",
            answer: "Para esports: mouse gaming de alta precisión, teclado mecánico, headset gaming y monitor 144Hz+. Revisa nuestras recomendaciones por juego.",
            category: "gaming",
            tags: ["periféricos", "esports", "mouse", "teclado", "monitor"]
        }
    ]
};

// Inicializar widget de ayuda
function initHelpWidget() {
    setupHelpEventListeners();
    populateFAQList();
    updateFAQCount();
}

// Configurar event listeners para ayuda
function setupHelpEventListeners() {
    const helpBtn = document.getElementById('help-widget-btn');
    const helpClose = document.getElementById('help-close');
    const helpSearch = document.getElementById('help-search');
    
    if (helpBtn) {
        helpBtn.addEventListener('click', toggleHelpPanel);
    }
    
    if (helpClose) {
        helpClose.addEventListener('click', closeHelpPanel);
    }
    
    if (helpSearch) {
        helpSearch.addEventListener('input', debounce(searchHelp, 300));
        helpSearch.addEventListener('focus', showSearchSuggestions);
    }
    
    // Click outside to close
    document.addEventListener('click', (e) => {
        const helpPanel = document.getElementById('help-panel');
        const helpBtn = document.getElementById('help-widget-btn');
        
        if (helpPanel && helpPanel.style.display !== 'none') {
            if (!helpPanel.contains(e.target) && !helpBtn.contains(e.target)) {
                closeHelpPanel();
            }
        }
    });
}

// Toggle panel de ayuda
function toggleHelpPanel() {
    const panel = document.getElementById('help-panel');
    if (panel) {
        if (panel.style.display === 'none') {
            openHelpPanel();
        } else {
            closeHelpPanel();
        }
    }
}

// Abrir panel de ayuda
function openHelpPanel() {
    const panel = document.getElementById('help-panel');
    const notification = document.getElementById('help-notification');
    
    if (panel) {
        panel.style.display = 'block';
        panel.classList.add('active');
        addGamerCoins(3, 'help-panel-opened');
        
        // Ocultar notificación
        if (notification) {
            notification.style.display = 'none';
        }
        
        // Animación de entrada
        setTimeout(() => {
            panel.classList.add('animate-in');
        }, 10);
    }
}

// Cerrar panel de ayuda
function closeHelpPanel() {
    const panel = document.getElementById('help-panel');
    if (panel) {
        panel.classList.remove('animate-in');
        setTimeout(() => {
            panel.style.display = 'none';
            panel.classList.remove('active');
        }, 300);
    }
}

// Mostrar categoría de ayuda
function showHelpCategory(category) {
    currentHelpCategory = category;
    
    // Actualizar navegación
    document.querySelectorAll('.help-nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-category="${category}"]`).classList.add('active');
    
    // Mostrar sección correspondiente
    document.querySelectorAll('.help-section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(`${category}-section`).classList.add('active');
    
    addGamerCoins(2, `help-category-${category}`);
}

// Poblar lista de FAQ
function populateFAQList() {
    const faqList = document.getElementById('faq-list');
    if (!faqList) return;
    
    const allFAQs = Object.values(faqDatabase).flat();
    
    faqList.innerHTML = allFAQs.map(faq => `
        <div class="faq-item" data-category="${faq.category}" data-tags="${faq.tags.join(' ')}">
            <button class="faq-question" onclick="toggleFAQAnswer(${faq.id})" aria-expanded="false">
                <span class="question-text">${faq.question}</span>
                <span class="question-icon">➕</span>
            </button>
            <div class="faq-answer" id="faq-answer-${faq.id}" style="display: none;">
                <p>${faq.answer}</p>
                <div class="faq-actions">
                    <button class="faq-action-btn helpful" onclick="markHelpful(${faq.id}, true)">
                        👍 Útil
                    </button>
                    <button class="faq-action-btn not-helpful" onclick="markHelpful(${faq.id}, false)">
                        👎 No útil
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Toggle respuesta FAQ
function toggleFAQAnswer(faqId) {
    const answer = document.getElementById(`faq-answer-${faqId}`);
    const question = answer.previousElementSibling;
    const icon = question.querySelector('.question-icon');
    
    if (answer.style.display === 'none') {
        answer.style.display = 'block';
        question.setAttribute('aria-expanded', 'true');
        icon.textContent = '➖';
        addGamerCoins(1, 'faq-answer-viewed');
    } else {
        answer.style.display = 'none';
        question.setAttribute('aria-expanded', 'false');
        icon.textContent = '➕';
    }
}

// Filtrar FAQ por categoría
function filterFAQ(category) {
    const faqItems = document.querySelectorAll('.faq-item');
    
    // Actualizar botones de categoría
    document.querySelectorAll('.faq-category-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Filtrar items
    faqItems.forEach(item => {
        if (category === 'all' || item.dataset.category === category) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
    
    addGamerCoins(2, `faq-filtered-${category}`);
}

// Buscar en ayuda
function searchHelp() {
    const query = document.getElementById('help-search').value.toLowerCase().trim();
    const faqItems = document.querySelectorAll('.faq-item');
    
    if (!query) {
        faqItems.forEach(item => item.style.display = 'block');
        hideSuggestions();
        return;
    }
    
    let visibleCount = 0;
    faqItems.forEach(item => {
        const question = item.querySelector('.question-text').textContent.toLowerCase();
        const answer = item.querySelector('.faq-answer p').textContent.toLowerCase();
        const tags = item.dataset.tags.toLowerCase();
        
        if (question.includes(query) || answer.includes(query) || tags.includes(query)) {
            item.style.display = 'block';
            visibleCount++;
        } else {
            item.style.display = 'none';
        }
    });
    
    // Mostrar sugerencias si no hay resultados
    if (visibleCount === 0) {
        showNoResultsSuggestions(query);
    } else {
        hideSuggestions();
    }
    
    addGamerCoins(2, 'help-search-performed');
}

// Mostrar sugerencias de búsqueda
function showSearchSuggestions() {
    const suggestions = document.getElementById('search-suggestions');
    if (!suggestions) return;
    
    const commonQueries = [
        "¿Cómo comprar?",
        "Métodos de pago",
        "Gaming 4K",
        "Garantía productos",
        "Instalación componentes"
    ];
    
    suggestions.innerHTML = `
        <div class="suggestions-header">Búsquedas populares:</div>
        ${commonQueries.map(query => `
            <button class="suggestion-item" onclick="selectSuggestion('${query}')">
                ${query}
            </button>
        `).join('')}
    `;
    suggestions.style.display = 'block';
}

// Seleccionar sugerencia
function selectSuggestion(query) {
    document.getElementById('help-search').value = query;
    searchHelp();
    hideSuggestions();
}

// Ocultar sugerencias
function hideSuggestions() {
    const suggestions = document.getElementById('search-suggestions');
    if (suggestions) {
        suggestions.style.display = 'none';
    }
}

// Mostrar sugerencias cuando no hay resultados
function showNoResultsSuggestions(query) {
    const suggestions = document.getElementById('search-suggestions');
    if (!suggestions) return;
    
    suggestions.innerHTML = `
        <div class="no-results-help">
            <p>No encontramos resultados para "${query}"</p>
            <div class="help-alternatives">
                <button class="alternative-btn" onclick="requestCustomHelp('${query}')">
                    💬 Contactar Soporte
                </button>
                <button class="alternative-btn" onclick="suggestQuestion('${query}')">
                    ✍️ Sugerir Pregunta
                </button>
            </div>
        </div>
    `;
    suggestions.style.display = 'block';
}

// Marcar FAQ como útil
function markHelpful(faqId, isHelpful) {
    const action = isHelpful ? 'útil' : 'no útil';
    showNotification(`📝 Marcado como ${action}. ¡Gracias por tu feedback!`);
    addGamerCoins(2, 'faq-feedback-given');
}

// Actualizar contador de FAQ
function updateFAQCount() {
    const faqCount = document.getElementById('faq-count');
    if (faqCount) {
        const totalFAQs = Object.values(faqDatabase).flat().length;
        faqCount.textContent = `${totalFAQs} preguntas`;
    }
}

// Abrir tutorial
function openTutorial(tutorialType) {
    const tutorials = {
        'pc-building': {
            title: 'Cómo Armar tu PC Gaming',
            content: 'Tutorial completo para ensamblar tu primera PC gaming paso a paso...'
        },
        'optimization': {
            title: 'Optimización para Gaming',
            content: 'Configura tu sistema para obtener el máximo rendimiento...'
        },
        'components': {
            title: 'Guía de Componentes',
            content: 'Aprende a elegir los mejores componentes para tu presupuesto...'
        }
    };
    
    const tutorial = tutorials[tutorialType];
    if (tutorial) {
        showNotification(`📚 Abriendo: ${tutorial.title}`, 'info');
        addGamerCoins(5, `tutorial-${tutorialType}-opened`);
    }
}

// Abrir chat en vivo
function openLiveChat() {
    showNotification('💬 Conectando con soporte en vivo...', 'info');
    addGamerCoins(5, 'live-chat-opened');
    
    // Simular conexión
    setTimeout(() => {
        showNotification('✅ Conectado con Alex - Especialista Gaming', 'success');
    }, 2000);
}

// Hacer llamada telefónica
function makePhoneCall() {
    if (navigator.userAgent.match(/iPhone|Android/i)) {
        window.location.href = 'tel:+56228004263';
    } else {
        showNotification('📞 Llama al +56 2 2800 GAME (4263)', 'info');
    }
    addGamerCoins(3, 'phone-call-initiated');
}

// Abrir formulario de email
function openEmailForm() {
    const subject = encodeURIComponent('Consulta Level-Up Gamer');
    const body = encodeURIComponent('Hola,\n\nTengo una consulta sobre...\n\nGracias.');
    window.location.href = `mailto:soporte@levelupgamer.cl?subject=${subject}&body=${body}`;
    addGamerCoins(3, 'email-form-opened');
}

// Solicitar callback
function requestCallback() {
    showNotification('📞 Solicitud de llamada registrada. Te contactaremos en 15 minutos.', 'success');
    addGamerCoins(5, 'callback-requested');
}

// Reportar problema
function reportIssue() {
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>🐛 Reportar Problema</h2>
                <button class="modal-close" onclick="this.closest('.modal').remove()">✕</button>
            </div>
            <form class="issue-form">
                <textarea placeholder="Describe el problema que encontraste..." rows="4"></textarea>
                <button type="submit" class="btn-primary">Enviar Reporte</button>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
    addGamerCoins(3, 'issue-reported');
}

// Dar feedback
function giveFeedback() {
    showNotification('⭐ ¡Gracias por usar nuestro centro de ayuda!', 'success');
    addGamerCoins(5, 'feedback-given');
}

// Solicitar ayuda personalizada
function requestCustomHelp(query) {
    showNotification(`💬 Enviando consulta sobre "${query}" a nuestro equipo de soporte`, 'info');
    addGamerCoins(5, 'custom-help-requested');
}

// Sugerir nueva pregunta
function suggestQuestion(query) {
    showNotification(`✍️ Sugerencia registrada: "${query}". La revisaremos para futuros FAQ.`, 'success');
    addGamerCoins(3, 'question-suggested');
}

// ===================== FILTROS DE DISPONIBILIDAD Y RETIRO =====================

let activeFilters = {
    availability: 'all',
    delivery: ['store-pickup', 'home-delivery'],
    priceRange: { min: null, max: null },
    location: ''
};

// Inicializar filtros avanzados
function initAdvancedFilters() {
    updateFilterCounts();
    setupFilterEventListeners();
    updateFilterResults();
}

// Configurar event listeners para filtros
function setupFilterEventListeners() {
    // Filtros de disponibilidad
    document.querySelectorAll('input[name="availability"]').forEach(input => {
        input.addEventListener('change', handleAvailabilityFilter);
    });
    
    // Filtros de entrega
    document.querySelectorAll('input[name="delivery"]').forEach(input => {
        input.addEventListener('change', handleDeliveryFilter);
    });
    
    // Filtros de precio
    const minPrice = document.getElementById('min-price');
    const maxPrice = document.getElementById('max-price');
    
    if (minPrice) {
        minPrice.addEventListener('input', debounce(handlePriceFilter, 500));
    }
    if (maxPrice) {
        maxPrice.addEventListener('input', debounce(handlePriceFilter, 500));
    }
    
    // Filtro de ubicación
    const locationSelect = document.getElementById('store-location');
    if (locationSelect) {
        locationSelect.addEventListener('change', handleLocationFilter);
    }
}

// Manejar filtro de disponibilidad
function handleAvailabilityFilter(e) {
    activeFilters.availability = e.target.value;
    applyFilters();
    addGamerCoins(2, 'availability-filter-used');
}

// Manejar filtros de entrega
function handleDeliveryFilter(e) {
    const value = e.target.value;
    
    if (e.target.checked) {
        if (!activeFilters.delivery.includes(value)) {
            activeFilters.delivery.push(value);
        }
    } else {
        activeFilters.delivery = activeFilters.delivery.filter(d => d !== value);
    }
    
    applyFilters();
    addGamerCoins(2, 'delivery-filter-used');
}

// Manejar filtro de precio
function handlePriceFilter() {
    const minPrice = document.getElementById('min-price').value;
    const maxPrice = document.getElementById('max-price').value;
    
    activeFilters.priceRange = {
        min: minPrice ? parseInt(minPrice) : null,
        max: maxPrice ? parseInt(maxPrice) : null
    };
    
    applyFilters();
    addGamerCoins(3, 'price-filter-used');
}

// Manejar filtro de ubicación
function handleLocationFilter(e) {
    activeFilters.location = e.target.value;
    updateLocationInfo(e.target.value);
    applyFilters();
    addGamerCoins(2, 'location-filter-used');
}

// Aplicar todos los filtros
function applyFilters() {
    let filteredProducts = [...expandedProducts];
    
    // Filtro de disponibilidad
    switch (activeFilters.availability) {
        case 'in-stock':
            filteredProducts = filteredProducts.filter(p => p.stock > 10);
            break;
        case 'low-stock':
            filteredProducts = filteredProducts.filter(p => p.stock > 0 && p.stock <= 10);
            break;
        case 'out-of-stock':
            filteredProducts = filteredProducts.filter(p => p.stock === 0);
            break;
        // 'all' no filtra nada
    }
    
    // Filtro de precio
    if (activeFilters.priceRange.min !== null) {
        filteredProducts = filteredProducts.filter(p => p.price >= activeFilters.priceRange.min);
    }
    if (activeFilters.priceRange.max !== null) {
        filteredProducts = filteredProducts.filter(p => p.price <= activeFilters.priceRange.max);
    }
    
    // Mostrar productos filtrados
    displayFilteredProducts(filteredProducts);
    updateFilterResults(filteredProducts.length);
}

// Mostrar productos filtrados
function displayFilteredProducts(products) {
    if (products.length === 0) {
        displayNoResultsMessage();
    } else {
        displayCatalogProducts(products);
    }
}

// Mostrar mensaje sin resultados
function displayNoResultsMessage() {
    const productGrid = document.querySelector('#featured-grid') || document.querySelector('.products-grid');
    if (!productGrid) return;
    
    productGrid.innerHTML = `
        <div class="no-results-advanced">
            <div class="no-results-icon">🔍</div>
            <h3>No encontramos productos con estos filtros</h3>
            <p>Intenta ajustar los criterios de búsqueda:</p>
            <ul class="filter-suggestions">
                <li>• Amplía el rango de precios</li>
                <li>• Cambia los filtros de disponibilidad</li>
                <li>• Selecciona más opciones de entrega</li>
                <li>• Prueba con otra ubicación</li>
            </ul>
            <button class="btn-primary" onclick="resetAllFilters()">
                🔄 Resetear Filtros
            </button>
        </div>
    `;
}

// Actualizar contadores de filtros
function updateFilterCounts() {
    const allCount = expandedProducts.length;
    const inStockCount = expandedProducts.filter(p => p.stock > 10).length;
    const lowStockCount = expandedProducts.filter(p => p.stock > 0 && p.stock <= 10).length;
    const outStockCount = expandedProducts.filter(p => p.stock === 0).length;
    
    // Actualizar UI
    const updateCounter = (id, count) => {
        const element = document.getElementById(id);
        if (element) element.textContent = `(${count})`;
    };
    
    updateCounter('all-count', allCount);
    updateCounter('in-stock-count', inStockCount);
    updateCounter('low-stock-count', lowStockCount);
    updateCounter('out-stock-count', outStockCount);
}

// Actualizar resultados de filtros
function updateFilterResults(count = expandedProducts.length) {
    const resultsElement = document.getElementById('filtered-results-count');
    if (resultsElement) {
        if (count === expandedProducts.length) {
            resultsElement.textContent = 'Mostrando todos los productos';
        } else {
            resultsElement.textContent = `Mostrando ${count} de ${expandedProducts.length} productos`;
        }
    }
}

// Establecer rango de precio predefinido
function setPriceRange(min, max) {
    document.getElementById('min-price').value = min;
    document.getElementById('max-price').value = max === 999999999 ? '' : max;
    
    activeFilters.priceRange = {
        min: min,
        max: max === 999999999 ? null : max
    };
    
    applyFilters();
    addGamerCoins(2, 'price-preset-used');
}

// Actualizar información de ubicación
function updateLocationInfo(location) {
    const locationInfo = document.getElementById('location-info');
    if (!locationInfo) return;
    
    const storeInfo = {
        'santiago-centro': {
            name: 'Santiago Centro',
            address: 'Av. Libertador Bernardo O\'Higgins 1234',
            status: 'Abierto hasta las 20:00',
            availability: 'Stock completo disponible'
        },
        'las-condes': {
            name: 'Las Condes',
            address: 'Av. Apoquindo 5678',
            status: 'Abierto hasta las 21:00',
            availability: 'Stock limitado en algunos productos'
        },
        'providencia': {
            name: 'Providencia',
            address: 'Av. Providencia 2345',
            status: 'Abierto hasta las 19:30',
            availability: 'Stock completo disponible'
        },
        'maipu': {
            name: 'Maipú',
            address: 'Av. Pajaritos 1567',
            status: 'Abierto hasta las 20:30',
            availability: 'Stock completo disponible'
        },
        'puente-alto': {
            name: 'Puente Alto',
            address: 'Av. Concha y Toro 890',
            status: 'Abierto hasta las 20:00',
            availability: 'Stock limitado en algunos productos'
        }
    };
    
    if (location && storeInfo[location]) {
        const store = storeInfo[location];
        locationInfo.innerHTML = `
            <div class="store-details">
                <div class="store-name">📍 ${store.name}</div>
                <div class="store-address">${store.address}</div>
                <div class="store-status">🕐 ${store.status}</div>
                <div class="store-availability">📦 ${store.availability}</div>
            </div>
        `;
    } else {
        locationInfo.innerHTML = '<span class="location-status">📍 Selecciona una tienda para ver disponibilidad</span>';
    }
}

// Resetear todos los filtros
function resetAllFilters() {
    // Resetear filtros activos
    activeFilters = {
        availability: 'all',
        delivery: ['store-pickup', 'home-delivery'],
        priceRange: { min: null, max: null },
        location: ''
    };
    
    // Resetear UI
    document.querySelector('input[name="availability"][value="all"]').checked = true;
    
    document.querySelectorAll('input[name="delivery"]').forEach(input => {
        input.checked = ['store-pickup', 'home-delivery'].includes(input.value);
    });
    
    document.getElementById('min-price').value = '';
    document.getElementById('max-price').value = '';
    document.getElementById('store-location').value = '';
    
    updateLocationInfo('');
    applyFilters();
    
    showNotification('🔄 Filtros reseteados', 'info');
    addGamerCoins(1, 'filters-reset');
}

// Mostrar mapa de tiendas
function showStoreMap() {
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
        <div class="modal-content store-map-modal">
            <div class="modal-header">
                <h2>🗺️ Mapa de Tiendas Level-Up Gamer</h2>
                <button class="modal-close" onclick="this.closest('.modal').remove()">✕</button>
            </div>
            <div class="map-content">
                <div class="map-placeholder">
                    <div class="map-icon">🗺️</div>
                    <p>Mapa interactivo próximamente disponible</p>
                    <div class="stores-list">
                        <h3>📍 Nuestras Tiendas:</h3>
                        <div class="store-item">
                            <strong>Santiago Centro</strong><br>
                            Av. Libertador Bernardo O'Higgins 1234<br>
                            📞 +56 2 2234 5678
                        </div>
                        <div class="store-item">
                            <strong>Las Condes</strong><br>
                            Av. Apoquindo 5678<br>
                            📞 +56 2 2345 6789
                        </div>
                        <div class="store-item">
                            <strong>Providencia</strong><br>
                            Av. Providencia 2345<br>
                            📞 +56 2 2456 7890
                        </div>
                        <div class="store-item">
                            <strong>Maipú</strong><br>
                            Av. Pajaritos 1567<br>
                            📞 +56 2 2567 8901
                        </div>
                        <div class="store-item">
                            <strong>Puente Alto</strong><br>
                            Av. Concha y Toro 890<br>
                            📞 +56 2 2678 9012
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    addGamerCoins(3, 'store-map-viewed');
}

// Función debounce para optimizar performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ===================== COMPARADOR DE PRODUCTOS =====================

let comparisonList = [];
const MAX_COMPARISON_ITEMS = 4;

// Agregar producto a comparación
function addToComparison(productId) {
    const product = expandedProducts.find(p => p.id === productId);
    if (!product) return;
    
    // Verificar si ya está en la lista
    if (comparisonList.find(p => p.id === productId)) {
        showNotification('📦 Este producto ya está en la comparación', 'info');
        return;
    }
    
    // Verificar límite máximo
    if (comparisonList.length >= MAX_COMPARISON_ITEMS) {
        showNotification(`⚠️ Máximo ${MAX_COMPARISON_ITEMS} productos para comparar`, 'warning');
        return;
    }
    
    // Agregar a la lista
    comparisonList.push(product);
    updateComparisonUI();
    addGamerCoins(3, 'product-added-to-comparison');
    
    // Mostrar notificación
    showNotification(`✅ ${product.name} agregado a comparación (${comparisonList.length}/${MAX_COMPARISON_ITEMS})`);
    
    // Efecto visual en el botón
    const compareBtn = document.querySelector(`[onclick="addToComparison(${productId})"]`);
    if (compareBtn) {
        compareBtn.classList.add('added-to-comparison');
        compareBtn.innerHTML = '✅ Agregado';
        setTimeout(() => {
            compareBtn.classList.remove('added-to-comparison');
            compareBtn.innerHTML = '⚖️ Comparar';
        }, 2000);
    }
}

// Actualizar UI de comparación
function updateComparisonUI() {
    // Actualizar contador
    const countElement = document.getElementById('comparison-count');
    if (countElement) {
        countElement.textContent = comparisonList.length;
    }
    
    // Actualizar grid de comparación
    const grid = document.getElementById('comparison-grid');
    if (grid) {
        grid.innerHTML = comparisonList.map(product => `
            <div class="comparison-item">
                <div class="comparison-item-header">
                    <div class="product-icon">${product.icon}</div>
                    <button class="remove-from-comparison" onclick="removeFromComparison(${product.id})" title="Quitar de comparación">
                        ✕
                    </button>
                </div>
                <div class="comparison-item-content">
                    <h4 class="comparison-product-name">${product.name}</h4>
                    <p class="comparison-product-brand">${product.brand}</p>
                    <div class="comparison-price">$${product.price.toLocaleString()}</div>
                </div>
            </div>
        `).join('');
        
        // Agregar slots vacíos
        for (let i = comparisonList.length; i < MAX_COMPARISON_ITEMS; i++) {
            grid.innerHTML += `
                <div class="comparison-slot-empty">
                    <div class="empty-slot-icon">➕</div>
                    <p>Agregar Producto</p>
                </div>
            `;
        }
    }
    
    // Habilitar/deshabilitar botón de comparación
    const startBtn = document.querySelector('.start-comparison');
    if (startBtn) {
        startBtn.disabled = comparisonList.length < 2;
        startBtn.textContent = comparisonList.length < 2 
            ? `🔍 Selecciona ${2 - comparisonList.length} producto(s) más`
            : '🔍 Iniciar Comparación';
    }
}

// Quitar producto de comparación
function removeFromComparison(productId) {
    comparisonList = comparisonList.filter(p => p.id !== productId);
    updateComparisonUI();
    showNotification('🗑️ Producto removido de la comparación');
}

// Limpiar toda la comparación
function clearComparison() {
    comparisonList = [];
    updateComparisonUI();
    showNotification('🧹 Comparación limpiada');
}

// Abrir modal de comparador
function openComparator() {
    const modal = document.getElementById('product-comparator-modal');
    if (modal) {
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        updateComparisonUI();
        addGamerCoins(5, 'comparator-opened');
    }
}

// Cerrar modal de comparador
function closeComparator() {
    const modal = document.getElementById('product-comparator-modal');
    if (modal) {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }
}

// Mostrar selector de productos
function showProductSelector() {
    const modal = document.getElementById('product-selector-modal');
    if (modal) {
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        populateProductSelector();
        addGamerCoins(3, 'product-selector-opened');
    }
}

// Cerrar selector de productos
function closeProductSelector() {
    const modal = document.getElementById('product-selector-modal');
    if (modal) {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
    }
}

// Poblar selector de productos
function populateProductSelector() {
    // Poblar categorías
    const categorySelect = document.getElementById('selector-category');
    if (categorySelect) {
        const categories = [...new Set(expandedProducts.map(p => p.category))];
        categorySelect.innerHTML = '<option value="">Todas las categorías</option>' +
            categories.map(cat => `<option value="${cat}">${cat}</option>`).join('');
    }
    
    // Mostrar productos
    renderSelectorProducts(expandedProducts);
    
    // Event listeners para filtros
    const searchInput = document.getElementById('selector-search');
    if (searchInput) {
        searchInput.addEventListener('input', filterSelectorProducts);
    }
    
    if (categorySelect) {
        categorySelect.addEventListener('change', filterSelectorProducts);
    }
}

// Renderizar productos en selector
function renderSelectorProducts(products) {
    const grid = document.getElementById('selector-grid');
    if (!grid) return;
    
    grid.innerHTML = products.map(product => {
        const isSelected = comparisonList.find(p => p.id === product.id);
        const isDisabled = comparisonList.length >= MAX_COMPARISON_ITEMS && !isSelected;
        
        return `
            <div class="selector-product ${isSelected ? 'selected' : ''} ${isDisabled ? 'disabled' : ''}"
                 onclick="${!isDisabled ? `selectProductForComparison(${product.id})` : ''}">
                <div class="selector-product-icon">${product.icon}</div>
                <div class="selector-product-info">
                    <h4>${product.name}</h4>
                    <p>${product.brand}</p>
                    <div class="selector-price">$${product.price.toLocaleString()}</div>
                </div>
                <div class="selector-product-action">
                    ${isSelected ? '✅' : isDisabled ? '🚫' : '➕'}
                </div>
            </div>
        `;
    }).join('');
}

// Filtrar productos en selector
function filterSelectorProducts() {
    const searchTerm = document.getElementById('selector-search').value.toLowerCase();
    const categoryFilter = document.getElementById('selector-category').value;
    
    let filtered = expandedProducts;
    
    if (searchTerm) {
        filtered = filtered.filter(p => 
            p.name.toLowerCase().includes(searchTerm) ||
            p.brand.toLowerCase().includes(searchTerm)
        );
    }
    
    if (categoryFilter) {
        filtered = filtered.filter(p => p.category === categoryFilter);
    }
    
    renderSelectorProducts(filtered);
}

// Seleccionar producto para comparación
function selectProductForComparison(productId) {
    const isSelected = comparisonList.find(p => p.id === productId);
    
    if (isSelected) {
        removeFromComparison(productId);
    } else {
        addToComparison(productId);
    }
    
    // Actualizar selector
    const searchTerm = document.getElementById('selector-search').value.toLowerCase();
    const categoryFilter = document.getElementById('selector-category').value;
    filterSelectorProducts();
}

// Iniciar comparación
function startComparison() {
    if (comparisonList.length < 2) {
        showNotification('⚠️ Necesitas al menos 2 productos para comparar', 'warning');
        return;
    }
    
    generateComparisonTable();
    generateComparisonInsights();
    openComparisonResults();
    addGamerCoins(10, 'comparison-started');
}

// Generar tabla de comparación
function generateComparisonTable() {
    const table = document.getElementById('comparison-table');
    if (!table) return;
    
    // Características a comparar
    const features = [
        { key: 'name', label: 'Producto', type: 'text' },
        { key: 'brand', label: 'Marca', type: 'text' },
        { key: 'price', label: 'Precio', type: 'currency' },
        { key: 'category', label: 'Categoría', type: 'text' },
        { key: 'rating', label: 'Calificación', type: 'rating' },
        { key: 'stock', label: 'Disponibilidad', type: 'stock' }
    ];
    
    // Generar encabezados
    const headerRow = `
        <thead>
            <tr>
                <th>Características</th>
                ${comparisonList.map(product => `
                    <th class="product-header">
                        <div class="product-header-content">
                            <div class="product-icon">${product.icon}</div>
                            <div class="product-name">${product.name}</div>
                        </div>
                    </th>
                `).join('')}
            </tr>
        </thead>
    `;
    
    // Generar filas de características
    const bodyRows = features.map(feature => `
        <tr class="feature-row">
            <td class="feature-label">${feature.label}</td>
            ${comparisonList.map(product => {
                let value = product[feature.key];
                let cellClass = '';
                
                switch (feature.type) {
                    case 'currency':
                        value = `$${value.toLocaleString()}`;
                        // Highlight mejor precio
                        const prices = comparisonList.map(p => p.price);
                        if (value === `$${Math.min(...prices).toLocaleString()}`) {
                            cellClass = 'best-value';
                        }
                        break;
                    case 'rating':
                        value = `${'⭐'.repeat(Math.floor(value))} ${value}`;
                        // Highlight mejor rating
                        const ratings = comparisonList.map(p => p.rating);
                        if (product.rating === Math.max(...ratings)) {
                            cellClass = 'best-value';
                        }
                        break;
                    case 'stock':
                        value = `${value} disponibles`;
                        cellClass = value < 10 ? 'low-stock' : 'in-stock';
                        break;
                }
                
                return `<td class="feature-value ${cellClass}">${value}</td>`;
            }).join('')}
        </tr>
    `).join('');
    
    table.innerHTML = headerRow + '<tbody>' + bodyRows + '</tbody>';
}

// Generar insights de comparación
function generateComparisonInsights() {
    const insightsGrid = document.getElementById('insights-grid');
    if (!insightsGrid) return;
    
    const insights = [];
    
    // Mejor precio
    const prices = comparisonList.map(p => ({ name: p.name, price: p.price }));
    const cheapest = prices.reduce((min, p) => p.price < min.price ? p : min);
    insights.push({
        icon: '💰',
        title: 'Mejor Precio',
        description: `${cheapest.name} con $${cheapest.price.toLocaleString()}`,
        type: 'success'
    });
    
    // Mejor calificación
    const ratings = comparisonList.map(p => ({ name: p.name, rating: p.rating }));
    const topRated = ratings.reduce((max, p) => p.rating > max.rating ? p : max);
    insights.push({
        icon: '⭐',
        title: 'Mejor Calificado',
        description: `${topRated.name} con ${topRated.rating} estrellas`,
        type: 'info'
    });
    
    // Diferencia de precio
    const maxPrice = Math.max(...prices.map(p => p.price));
    const minPrice = Math.min(...prices.map(p => p.price));
    const difference = maxPrice - minPrice;
    insights.push({
        icon: '📊',
        title: 'Diferencia de Precio',
        description: `Hasta $${difference.toLocaleString()} de diferencia`,
        type: 'warning'
    });
    
    // Recomendación
    insights.push({
        icon: '🎯',
        title: 'Recomendación Gaming',
        description: `Para gaming, recomendamos ${topRated.name} por su excelente balance precio-calidad`,
        type: 'primary'
    });
    
    insightsGrid.innerHTML = insights.map(insight => `
        <div class="insight-card ${insight.type}">
            <div class="insight-icon">${insight.icon}</div>
            <div class="insight-content">
                <h4>${insight.title}</h4>
                <p>${insight.description}</p>
            </div>
        </div>
    `).join('');
}

// Abrir resultados de comparación
function openComparisonResults() {
    const modal = document.getElementById('comparison-results-modal');
    if (modal) {
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
    }
}

// Cerrar resultados de comparación
function closeComparisonResults() {
    const modal = document.getElementById('comparison-results-modal');
    if (modal) {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
    }
}

// Función para mostrar comparador rápido desde panel de acceso
function showQuickCompare() {
    if (comparisonList.length === 0) {
        showProductSelector();
    } else {
        openComparator();
    }
}

// ===================== SEPARADOR DE CATEGORÍAS =====================

// Categorías organizadas por grupos
const categoryGroups = {
    mainComponents: ['Procesadores', 'Tarjetas Gráficas', 'Memorias RAM', 'Almacenamiento', 'Placas Madre', 'Fuentes de Poder'],
    peripherals: ['Periféricos', 'Audio', 'Monitores', 'Gabinetes', 'Refrigeración'],
    specials: ['Especiales']
};

// Inicializar categorías separadas
function initAdvancedCategories() {
    renderMainComponents();
    renderPeripherals();
    renderSpecials();
    updateCategoryCounts();
}

// Renderizar componentes principales
function renderMainComponents() {
    const container = document.getElementById('main-components-tiles');
    if (!container) return;
    
    const mainCategories = categoryGroups.mainComponents;
    const categoryTiles = mainCategories.map(category => {
        const products = expandedProducts.filter(p => p.category === category);
        const icon = getCategoryIcon(category);
        
        return `
            <div class="tile main-component-tile" 
                 data-category="${category}"
                 onclick="filterByAdvancedCategory('${category}')"
                 role="button" 
                 tabindex="0"
                 aria-label="Categoría ${category}, ${products.length} productos">
                <div class="tile-icon">${icon}</div>
                <div class="tile-content">
                    <h3 class="tile-title">${category}</h3>
                    <p class="tile-description">${products.length} productos disponibles</p>
                    <div class="tile-stats">
                        <span class="price-range">
                            $${Math.min(...products.map(p => p.price)).toLocaleString()} - 
                            $${Math.max(...products.map(p => p.price)).toLocaleString()}
                        </span>
                    </div>
                </div>
                <div class="tile-badge">${products.length}</div>
            </div>
        `;
    }).join('');
    
    container.innerHTML = categoryTiles;
}

// Renderizar periféricos
function renderPeripherals() {
    const container = document.getElementById('peripherals-tiles');
    if (!container) return;
    
    const peripheralCategories = categoryGroups.peripherals;
    const categoryTiles = peripheralCategories.map(category => {
        const products = expandedProducts.filter(p => p.category === category);
        const icon = getCategoryIcon(category);
        
        return `
            <div class="tile peripheral-tile" 
                 data-category="${category}"
                 onclick="filterByAdvancedCategory('${category}')"
                 role="button" 
                 tabindex="0"
                 aria-label="Categoría ${category}, ${products.length} productos">
                <div class="tile-icon">${icon}</div>
                <div class="tile-content">
                    <h3 class="tile-title">${category}</h3>
                    <p class="tile-description">${products.length} productos gaming</p>
                    <div class="tile-features">
                        <span class="feature-tag">Gaming Ready</span>
                        <span class="feature-tag">RGB Available</span>
                    </div>
                </div>
                <div class="tile-badge peripheral">${products.length}</div>
            </div>
        `;
    }).join('');
    
    container.innerHTML = categoryTiles;
}

// Renderizar categorías especiales
function renderSpecials() {
    const container = document.getElementById('specials-tiles');
    if (!container) return;
    
    const specialCategories = categoryGroups.specials;
    const categoryTiles = specialCategories.map(category => {
        const products = expandedProducts.filter(p => p.category === category);
        const icon = getCategoryIcon(category);
        
        return `
            <div class="tile special-tile" 
                 data-category="${category}"
                 onclick="filterByAdvancedCategory('${category}')"
                 role="button" 
                 tabindex="0"
                 aria-label="Categoría ${category}, ${products.length} productos especiales">
                <div class="tile-icon special">${icon}</div>
                <div class="tile-content">
                    <h3 class="tile-title">${category}</h3>
                    <p class="tile-description">Ediciones limitadas y exclusivas</p>
                    <div class="special-features">
                        <span class="special-tag">Limitado</span>
                        <span class="special-tag">Exclusivo</span>
                        <span class="special-tag">Premium</span>
                    </div>
                </div>
                <div class="tile-badge special">${products.length}</div>
            </div>
        `;
    }).join('');
    
    container.innerHTML = categoryTiles;
}

// Actualizar contadores de categorías
function updateCategoryCounts() {
    // Componentes principales
    const mainCount = categoryGroups.mainComponents.reduce((total, cat) => {
        return total + expandedProducts.filter(p => p.category === cat).length;
    }, 0);
    const mainCounter = document.getElementById('main-components-count');
    if (mainCounter) mainCounter.textContent = `${mainCount} productos`;
    
    // Periféricos
    const peripheralCount = categoryGroups.peripherals.reduce((total, cat) => {
        return total + expandedProducts.filter(p => p.category === cat).length;
    }, 0);
    const peripheralCounter = document.getElementById('peripherals-count');
    if (peripheralCounter) peripheralCounter.textContent = `${peripheralCount} productos`;
    
    // Especiales
    const specialCount = categoryGroups.specials.reduce((total, cat) => {
        return total + expandedProducts.filter(p => p.category === cat).length;
    }, 0);
    const specialCounter = document.getElementById('specials-count');
    if (specialCounter) specialCounter.textContent = `${specialCount} productos`;
}

// Filtrar por categoría avanzada
function filterByAdvancedCategory(category) {
    const filtered = expandedProducts.filter(p => p.category === category);
    displaySearchResults(filtered, `Categoría: ${category}`);
    addGamerCoins(5, 'advanced-category-filtered');
    
    // Scroll a resultados
    const catalogSection = document.getElementById('catalogo');
    if (catalogSection) {
        catalogSection.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Efecto visual en la tile seleccionada
    const tiles = document.querySelectorAll('.tile');
    tiles.forEach(tile => tile.classList.remove('selected'));
    
    const selectedTile = document.querySelector(`[data-category="${category}"]`);
    if (selectedTile) {
        selectedTile.classList.add('selected');
        setTimeout(() => selectedTile.classList.remove('selected'), 2000);
    }
}

// ===================== PANEL DE ACCESO RÁPIDO =====================

let quickSearchTimeout;

// Inicializar panel de acceso rápido
function initQuickAccessPanel() {
    const quickSearch = document.getElementById('quick-search');
    const searchBtn = document.querySelector('.search-btn');
    
    if (quickSearch) {
        // Atajo de teclado Ctrl+K para enfocar búsqueda
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'k') {
                e.preventDefault();
                quickSearch.focus();
                addGamerCoins(2, 'quick-search-focus');
            }
        });
        
        // Búsqueda en tiempo real
        quickSearch.addEventListener('input', (e) => {
            clearTimeout(quickSearchTimeout);
            quickSearchTimeout = setTimeout(() => {
                performQuickSearch(e.target.value);
            }, 300);
        });
        
        // Búsqueda al presionar Enter
        quickSearch.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                performQuickSearch(e.target.value);
            }
        });
    }
    
    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            const query = quickSearch.value.trim();
            if (query) {
                performQuickSearch(query);
            }
        });
    }
}

// Realizar búsqueda rápida
function performQuickSearch(query) {
    if (!query.trim()) return;
    
    const searchResults = expandedProducts.filter(product => 
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase()) ||
        product.brand.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase())
    );
    
    // Mostrar resultados
    displaySearchResults(searchResults, query);
    
    // Gamificación
    addGamerCoins(5, 'quick-search-performed');
    
    // Scroll a resultados
    const catalogSection = document.getElementById('catalogo');
    if (catalogSection) {
        catalogSection.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Notificación
    showNotification(`🔍 Encontrados ${searchResults.length} resultados para "${query}"`);
}

// Mostrar resultados de búsqueda
function displaySearchResults(results, query) {
    const productGrid = document.querySelector('#featured-grid') || document.querySelector('.products-grid');
    if (!productGrid) return;
    
    if (results.length === 0) {
        productGrid.innerHTML = `
            <div class="no-results-gamer">
                <div class="no-results-icon">🎮</div>
                <h3>¡Ups! No hay power-ups aquí</h3>
                <p>No encontramos productos para "<strong>${query}</strong>"</p>
                <p>💡 Intenta con términos como: Gaming, RTX, Ryzen, PlayStation...</p>
                <button class="btn-primary" onclick="displayCatalogProducts()">
                    🔄 Ver Todos los Productos
                </button>
            </div>
        `;
        return;
    }
    
    // Actualizar título de la sección
    const catalogTitle = document.querySelector('.catalog-header h2');
    if (catalogTitle) {
        catalogTitle.innerHTML = `🔍 Resultados para "${query}" (${results.length})`;
    }
    
    // Mostrar productos encontrados
    displayCatalogProducts(results);
}

// Mostrar categorías rápidas
function showQuickCategories() {
    const categories = [...new Set(expandedProducts.map(p => p.category))];
    
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
        <div class="modal-content quick-categories-modal">
            <div class="modal-header">
                <h2>📂 Categorías Rápidas</h2>
                <button class="modal-close" onclick="this.closest('.modal').remove()">✕</button>
            </div>
            <div class="categories-grid">
                ${categories.map(category => {
                    const count = expandedProducts.filter(p => p.category === category).length;
                    const icon = getCategoryIcon(category);
                    return `
                        <button class="category-quick-btn" onclick="filterByCategory('${category}'); this.closest('.modal').remove();">
                            <span class="category-icon">${icon}</span>
                            <span class="category-name">${category}</span>
                            <span class="category-count">${count} productos</span>
                        </button>
                    `;
                }).join('')}
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    addGamerCoins(3, 'quick-categories-opened');
}

// Mostrar ofertas rápidas
function showQuickOffers() {
    const offerProducts = expandedProducts.filter(p => p.price < 500000 || p.category.includes('Especial'));
    
    displaySearchResults(offerProducts, 'Ofertas Especiales');
    addGamerCoins(5, 'quick-offers-viewed');
    
    // Scroll a resultados
    const catalogSection = document.getElementById('catalogo');
    if (catalogSection) {
        catalogSection.scrollIntoView({ behavior: 'smooth' });
    }
}

// Mostrar comparador rápido
function showQuickCompare() {
    showNotification('🚀 Comparador próximamente disponible', 'info');
    addGamerCoins(2, 'quick-compare-interest');
}

// Mostrar ayuda rápida
function showQuickHelp() {
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
        <div class="modal-content quick-help-modal">
            <div class="modal-header">
                <h2>❓ Ayuda Rápida</h2>
                <button class="modal-close" onclick="this.closest('.modal').remove()">✕</button>
            </div>
            <div class="help-content">
                <div class="help-section">
                    <h3>🔍 Búsqueda</h3>
                    <ul>
                        <li><kbd>Ctrl + K</kbd> - Enfocar búsqueda rápida</li>
                        <li>Busca por nombre, marca o categoría</li>
                        <li>Resultados en tiempo real</li>
                    </ul>
                </div>
                <div class="help-section">
                    <h3>🎮 Gamificación</h3>
                    <ul>
                        <li>Gana Gamer Coins por cada acción</li>
                        <li>Sube de nivel con puntos</li>
                        <li>Desbloquea logros especiales</li>
                    </ul>
                </div>
                <div class="help-section">
                    <h3>🛒 Compras</h3>
                    <ul>
                        <li>Agrega productos al carrito</li>
                        <li>Descuentos por nivel de usuario</li>
                        <li>Reseñas y calificaciones</li>
                    </ul>
                </div>
                <div class="help-section">
                    <h3>📞 Soporte</h3>
                    <ul>
                        <li>Chat WhatsApp integrado</li>
                        <li>Soporte en tiempo real</li>
                        <li>Asesoría personalizada</li>
                    </ul>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    addGamerCoins(3, 'quick-help-opened');
}

// Obtener icono de categoría
function getCategoryIcon(category) {
    const icons = {
        'Procesadores': '🔥',
        'Tarjetas Gráficas': '🎮',
        'Memorias RAM': '⚡',
        'Almacenamiento': '💾',
        'Placas Madre': '🔧',
        'Fuentes de Poder': '🔋',
        'Gabinetes': '🏠',
        'Refrigeración': '❄️',
        'Periféricos': '🖱️',
        'Audio': '🎧',
        'Monitores': '🖥️',
        'Especiales': '⭐'
    };
    return icons[category] || '📦';
}

// Filtrar por categoría
function filterByCategory(category) {
    const filtered = expandedProducts.filter(p => p.category === category);
    displaySearchResults(filtered, `Categoría: ${category}`);
    addGamerCoins(3, 'category-filtered');
}

// ===================== EVENT LISTENERS =====================
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar panel de acceso rápido
    initQuickAccessPanel();
    
    // Inicializar categorías avanzadas
    initAdvancedCategories();
    
    // Inicializar filtros avanzados
    initAdvancedFilters();
    
    // Inicializar widget de ayuda
    initHelpWidget();
    
    // Event listeners para reseñas
    const closeReviewsBtn = document.querySelector('.close-reviews');
    const closeWriteReviewBtn = document.querySelector('.close-write-review');
    const writeReviewBtn = document.querySelector('.write-review-btn');
    const submitReviewBtn = document.querySelector('.submit-review');
    
    if (closeReviewsBtn) {
        closeReviewsBtn.addEventListener('click', closeReviewsModal);
    }
    
    if (closeWriteReviewBtn) {
        closeWriteReviewBtn.addEventListener('click', closeWriteReviewModal);
    }
    
    if (writeReviewBtn) {
        writeReviewBtn.addEventListener('click', openWriteReviewModal);
    }
    
    if (submitReviewBtn) {
        submitReviewBtn.addEventListener('click', submitReview);
    }

    // Event listeners para chat de WhatsApp
    const whatsappWidget = document.querySelector('.whatsapp-widget');
    const whatsappChat = document.querySelector('.whatsapp-chat');
    const closeWhatsappBtn = document.querySelector('.close-whatsapp');
    const whatsappSendBtn = document.querySelector('.whatsapp-send');
    const whatsappInput = document.querySelector('.whatsapp-input');
    
    if (whatsappWidget) {
        whatsappWidget.addEventListener('click', () => {
            whatsappChat.style.display = 'flex';
            whatsappWidget.style.display = 'none';
            playNotificationSound();
            addGamerCoins(5, 'chat-opened');
        });
    }
    
    if (closeWhatsappBtn) {
        closeWhatsappBtn.addEventListener('click', () => {
            whatsappChat.style.display = 'none';
            whatsappWidget.style.display = 'flex';
        });
    }
    
    if (whatsappSendBtn) {
        whatsappSendBtn.addEventListener('click', () => {
            const message = whatsappInput.value.trim();
            if (message) {
                sendWhatsAppMessage(message);
                whatsappInput.value = '';
            }
        });
    }
    
    if (whatsappInput) {
        whatsappInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const message = whatsappInput.value.trim();
                if (message) {
                    sendWhatsAppMessage(message);
                    whatsappInput.value = '';
                }
            }
        });
    }
});

// ===================== FUNCIÓN DE TEST DE EMERGENCIA =====================
// Puedes ejecutar esta función desde la consola del navegador
function testLoginButton() {
  console.log('🧪 EJECUTANDO TEST DE EMERGENCIA DEL BOTÓN DE LOGIN...');
  
  const loginButton = document.getElementById('login-button');
  const modal = document.getElementById('login-modal');
  
  console.log('📋 Estado actual LOGIN:');
  console.log('- Botón encontrado:', !!loginButton);
  console.log('- Modal encontrado:', !!modal);
  
  if (loginButton) {
    const styles = window.getComputedStyle(loginButton);
    console.log('- Display:', styles.display);
    console.log('- Visibility:', styles.visibility);
    console.log('- Pointer-events:', styles.pointerEvents);
    console.log('- Z-index:', styles.zIndex);
    console.log('- Position:', styles.position);
    console.log('- Coordenadas:', loginButton.getBoundingClientRect());
  }
  
  if (loginButton && modal) {
    // Forzar estilos
    loginButton.style.display = 'inline-flex';
    loginButton.style.visibility = 'visible';
    loginButton.style.pointerEvents = 'auto';
    loginButton.style.zIndex = '9999';
    
    // Agregar event listener de emergencia
    function emergencyLogin() {
      console.log('🚨 CLICK DE EMERGENCIA DETECTADO EN LOGIN!');
      modal.classList.add('active');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      
      setTimeout(() => {
        const emailInput = document.getElementById('login-email');
        if (emailInput) emailInput.focus();
      }, 100);
    }
    
    // Remover listeners existentes y agregar el nuevo
    const newButton = loginButton.cloneNode(true);
    loginButton.parentNode.replaceChild(newButton, loginButton);
    
    newButton.addEventListener('click', emergencyLogin);
    newButton.addEventListener('touchstart', emergencyLogin);
    
    console.log('✅ Test LOGIN completado - Botón debería funcionar ahora');
    
    return true;
  } else {
    console.error('❌ No se encontraron los elementos de LOGIN');
    return false;
  }
}

function testRegisterButton() {
  console.log('🧪 EJECUTANDO TEST DE EMERGENCIA DEL BOTÓN DE REGISTRO...');
  
  const registerButton = document.getElementById('register-button');
  const modal = document.getElementById('register-modal');
  
  console.log('� Estado actual REGISTRO:');
  console.log('- Botón encontrado:', !!registerButton);
  console.log('- Modal encontrado:', !!modal);
  
  if (registerButton) {
    const styles = window.getComputedStyle(registerButton);
    console.log('- Display:', styles.display);
    console.log('- Visibility:', styles.visibility);
    console.log('- Pointer-events:', styles.pointerEvents);
    console.log('- Z-index:', styles.zIndex);
    console.log('- Position:', styles.position);
    console.log('- Coordenadas:', registerButton.getBoundingClientRect());
  }
  
  if (registerButton && modal) {
    // Forzar estilos
    registerButton.style.display = 'inline-flex';
    registerButton.style.visibility = 'visible';
    registerButton.style.pointerEvents = 'auto';
    registerButton.style.zIndex = '9999';
    
    // Agregar event listener de emergencia
    function emergencyRegister() {
      console.log('🚨 CLICK DE EMERGENCIA DETECTADO EN REGISTRO!');
      modal.classList.add('active');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      
      setTimeout(() => {
        const nameInput = document.getElementById('register-name');
        if (nameInput) nameInput.focus();
      }, 100);
    }
    
    // Remover listeners existentes y agregar el nuevo
    const newButton = registerButton.cloneNode(true);
    registerButton.parentNode.replaceChild(newButton, registerButton);
    
    newButton.addEventListener('click', emergencyRegister);
    newButton.addEventListener('touchstart', emergencyRegister);
    
    console.log('✅ Test REGISTRO completado - Botón debería funcionar ahora');
    
    return true;
  } else {
    console.error('❌ No se encontraron los elementos de REGISTRO');
    return false;
  }
}

function testAllButtons() {
  console.log('🧪 EJECUTANDO TEST COMPLETO DE TODOS LOS BOTONES...');
  const loginResult = testLoginButton();
  const registerResult = testRegisterButton();
  
  console.log('📊 RESULTADOS:');
  console.log('- Login funcionando:', loginResult);
  console.log('- Registro funcionando:', registerResult);
  
  return { login: loginResult, register: registerResult };
}

// Hacer las funciones disponibles globalmente para testing
window.testLoginButton = testLoginButton;
window.testRegisterButton = testRegisterButton;
window.testAllButtons = testAllButtons;

// ===================== TEST ESPECÍFICO PARA BOTÓN DE CERRAR =====================
function testCloseButton() {
  console.log('🧪 EJECUTANDO TEST DEL BOTÓN DE CERRAR REGISTRO...');
  
  const modal = document.getElementById('register-modal');
  if (!modal) {
    console.error('❌ Modal de registro no encontrado');
    return false;
  }
  
  // Buscar el botón de cerrar con múltiples métodos
  let closeButton = modal.querySelector('.modal-close');
  
  console.log('🔍 Información del botón de cerrar:');
  console.log('- Botón encontrado:', !!closeButton);
  
  if (closeButton) {
    console.log('- Texto:', closeButton.textContent);
    console.log('- HTML:', closeButton.outerHTML);
    console.log('- Clases:', closeButton.className);
    console.log('- Atributos:', Array.from(closeButton.attributes).map(a => `${a.name}="${a.value}"`));
    
    const styles = window.getComputedStyle(closeButton);
    console.log('- Display:', styles.display);
    console.log('- Visibility:', styles.visibility);
    console.log('- Pointer-events:', styles.pointerEvents);
    console.log('- Coordenadas:', closeButton.getBoundingClientRect());
    
    // Función de cierre de emergencia
    function emergencyClose(e) {
      console.log('🚨 CIERRE DE EMERGENCIA ACTIVADO!', e);
      modal.classList.remove('active');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      console.log('✅ Modal cerrado exitosamente');
    }
    
    // Limpiar listeners existentes y agregar nuevo
    const newCloseButton = closeButton.cloneNode(true);
    closeButton.parentNode.replaceChild(newCloseButton, closeButton);
    
    // Agregar múltiples tipos de eventos
    newCloseButton.addEventListener('click', emergencyClose);
    newCloseButton.addEventListener('touchstart', emergencyClose);
    newCloseButton.addEventListener('mousedown', emergencyClose);
    
    // Forzar estilos para asegurar que sea clickeable
    newCloseButton.style.pointerEvents = 'auto';
    newCloseButton.style.cursor = 'pointer';
    newCloseButton.style.zIndex = '10000';
    
    console.log('✅ Botón de cerrar reparado y listo para usar');
    return true;
  } else {
    console.error('❌ No se pudo encontrar el botón de cerrar');
    console.log('🔍 Elementos encontrados en el modal:');
    const allButtons = modal.querySelectorAll('button');
    allButtons.forEach((btn, index) => {
      console.log(`- Botón ${index + 1}:`, btn.outerHTML);
    });
    return false;
  }
}

// Hacer la función disponible globalmente
window.testCloseButton = testCloseButton;

// ===================== FUNCIÓN DE EMERGENCIA SIMPLE =====================
function fixCloseButtons() {
  console.log('🚨 REPARACIÓN DE EMERGENCIA - Configurando todos los botones de cerrar...');
  
  // Buscar todos los modales y sus botones de cerrar
  const modals = document.querySelectorAll('.modal-overlay, .modal');
  let buttonsFixed = 0;
  
  // Función universal de cierre mejorada
  function universalClose(e) {
    console.log('� CIERRE DE EMERGENCIA EJECUTADO', e);
    e.preventDefault();
    e.stopPropagation();
    
    const button = e.currentTarget;
    let modal = button.closest('.modal-overlay');
    if (!modal) {
      modal = button.closest('.modal');
    }
    if (!modal) {
      // Buscar modal activo si no se encuentra el padre
      modal = document.querySelector('.modal-overlay.active, .modal.active');
    }
    
    if (modal) {
      modal.classList.remove('active');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      
      // Limpiar formularios
      const forms = modal.querySelectorAll('form');
      forms.forEach(form => form.reset());
      
      console.log('✅ Modal cerrado exitosamente:', modal.id || 'modal sin id');
    } else {
      console.error('❌ No se pudo encontrar el modal para cerrar');
    }
  }
  
  modals.forEach((modal, modalIndex) => {
    console.log(`🔍 Procesando modal ${modalIndex + 1}:`, modal.id || modal.className);
    
    // Buscar botones de cerrar en este modal con más selectores
    const closeButtons = modal.querySelectorAll(
      '.modal-close, [aria-label="Cerrar modal"], .close, ' +
      'button[class*="close"], button[class*="cerrar"], ' +
      'button:contains("×"), button:contains("✕")'
    );
    
    // También buscar por contenido
    const allButtons = modal.querySelectorAll('button');
    allButtons.forEach(btn => {
      const text = btn.textContent.trim();
      if (text === '×' || text === '✕' || text === 'X' || text.toLowerCase().includes('cerrar')) {
        closeButtons.push(btn);
      }
    });
    
    console.log(`🔍 Encontrados ${closeButtons.length} botones de cerrar en modal ${modalIndex + 1}`);
    
    closeButtons.forEach((button, buttonIndex) => {
      console.log(`🎯 Arreglando botón ${buttonIndex + 1} en modal ${modalIndex + 1}:`, button.outerHTML);
      
      // Remover todos los listeners existentes clonando
      const newButton = button.cloneNode(true);
      button.parentNode.replaceChild(newButton, button);
      
      // Agregar event listeners de emergencia con alta prioridad
      newButton.addEventListener('click', universalClose, true);
      newButton.addEventListener('mousedown', universalClose, true);
      newButton.addEventListener('touchstart', universalClose, true);
      
      // Forzar estilos para asegurar funcionalidad
      newButton.style.cursor = 'pointer';
      newButton.style.pointerEvents = 'auto';
      newButton.style.zIndex = '999999';
      newButton.style.position = 'relative';
      newButton.style.display = 'inline-block';
      newButton.style.visibility = 'visible';
      newButton.style.opacity = '1';
      newButton.style.background = 'transparent';
      newButton.style.border = 'none';
      
      buttonsFixed++;
      console.log(`✅ Botón ${buttonIndex + 1} reparado completamente`);
    });
  });
  
  console.log(`🎉 REPARACIÓN COMPLETADA: ${buttonsFixed} botones configurados`);
  
  // Test inmediato
  console.log('🧪 Realizando test inmediato...');
  const testModal = document.querySelector('.modal-overlay.active, .modal.active');
  if (testModal) {
    const testButton = testModal.querySelector('.modal-close, button');
    if (testButton) {
      console.log('🎯 Botón de test encontrado:', testButton.outerHTML);
      console.log('✅ Listo para probar - haz clic en el botón X');
    }
  }
  
  return buttonsFixed;
}

// Hacer la función disponible globalmente
window.fixCloseButtons = fixCloseButtons;

// Llamar a soporte
