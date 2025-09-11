// ===================== CARRUSEL HERO FUNCIONAL =====================
class HeroCarousel {
  constructor() {
    this.currentSlide = 0;
    this.slides = document.querySelectorAll('.carousel-slide');
    this.indicators = document.querySelectorAll('.indicator');
    this.progressBar = document.querySelector('.progress-bar');
    this.autoSlideInterval = null;
    this.autoSlideDelay = 6000; // 6 segundos
    
    this.init();
  }

  init() {
    if (this.slides.length === 0) return;
    
    // Ocultar todos los slides excepto el primero
    this.slides.forEach((slide, index) => {
      if (index === 0) {
        slide.classList.add('active');
      } else {
        slide.classList.remove('active');
        slide.style.opacity = '0';
        slide.style.transform = 'translateX(100%)';
      }
    });
    
    // Configurar indicadores
    this.indicators.forEach((indicator, index) => {
      indicator.addEventListener('click', () => {
        this.goToSlide(index);
      });
    });
    
    // Iniciar auto-slide
    this.startAutoSlide();
    
    // Pausar en hover
    const carouselContainer = document.querySelector('.banner-carousel-pro');
    if (carouselContainer) {
      carouselContainer.addEventListener('mouseenter', () => {
        this.stopAutoSlide();
      });
      
      carouselContainer.addEventListener('mouseleave', () => {
        this.startAutoSlide();
      });
    }
  }

  goToSlide(index) {
    if (index === this.currentSlide) return;
    
    const currentSlideElement = this.slides[this.currentSlide];
    const nextSlideElement = this.slides[index];
    
    // Remover clase active del slide actual
    currentSlideElement.classList.remove('active');
    currentSlideElement.style.opacity = '0';
    currentSlideElement.style.transform = 'translateX(-100%)';
    
    // Activar el nuevo slide
    setTimeout(() => {
      nextSlideElement.classList.add('active');
      nextSlideElement.style.opacity = '1';
      nextSlideElement.style.transform = 'translateX(0)';
    }, 100);
    
    // Actualizar indicadores
    this.indicators[this.currentSlide].classList.remove('active');
    this.indicators[index].classList.add('active');
    
    // Actualizar slide actual
    this.currentSlide = index;
    
    // Reiniciar barra de progreso
    this.resetProgressBar();
  }

  nextSlide() {
    const nextIndex = (this.currentSlide + 1) % this.slides.length;
    this.goToSlide(nextIndex);
  }

  prevSlide() {
    const prevIndex = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
    this.goToSlide(prevIndex);
  }

  startAutoSlide() {
    this.stopAutoSlide(); // Limpiar cualquier intervalo existente
    
    this.autoSlideInterval = setInterval(() => {
      this.nextSlide();
    }, this.autoSlideDelay);
    
    // Iniciar animación de barra de progreso
    this.animateProgressBar();
  }

  stopAutoSlide() {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
      this.autoSlideInterval = null;
    }
    
    // Pausar barra de progreso
    if (this.progressBar) {
      this.progressBar.style.animationPlayState = 'paused';
    }
  }

  resetProgressBar() {
    if (this.progressBar) {
      this.progressBar.style.animation = 'none';
      this.progressBar.offsetHeight; // Trigger reflow
      this.progressBar.style.animation = null;
    }
  }

  animateProgressBar() {
    if (this.progressBar) {
      this.progressBar.style.animation = `carousel-progress ${this.autoSlideDelay}ms linear infinite`;
    }
  }
}

// Inicializar carrusel cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
  const heroCarousel = new HeroCarousel();
  
  // Hacer accesible globalmente para debugging
  window.heroCarousel = heroCarousel;
});

// Agregar estilos CSS para la animación de la barra de progreso
const progressStyle = document.createElement('style');
progressStyle.textContent = `
  @keyframes carousel-progress {
    from { width: 0%; }
    to { width: 100%; }
  }
`;
document.head.appendChild(progressStyle);
