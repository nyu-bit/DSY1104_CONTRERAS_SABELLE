/**
 * Banner Carrusel Profesional JavaScript
 * Funcionalidad completa para el carrusel con navegación y auto-play
 */

class CarouselProfessional {
    constructor() {
        this.currentSlide = 0;
        this.totalSlides = 4;
        this.autoPlayInterval = 5000; // 5 segundos
        this.autoPlayTimer = null;
        this.progressTimer = null;
        this.isPlaying = true;
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.startAutoPlay();
        this.updateProgress();
    }
    
    bindEvents() {
        // Indicadores
        const indicators = document.querySelectorAll('.indicator');
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => this.goToSlide(index));
        });
        
        // Pausar en hover
        const carousel = document.querySelector('.banner-carousel-pro');
        if (carousel) {
            carousel.addEventListener('mouseenter', () => this.pauseAutoPlay());
            carousel.addEventListener('mouseleave', () => this.resumeAutoPlay());
        }
        
        // Navegación por teclado
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.prevSlide();
            if (e.key === 'ArrowRight') this.nextSlide();
        });
        
        // Touch/Swipe para móviles
        this.setupTouchEvents();
    }
    
    setupTouchEvents() {
        const carousel = document.querySelector('.carousel-slides');
        if (!carousel) return;
        
        let startX = 0;
        let endX = 0;
        
        carousel.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });
        
        carousel.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            this.handleSwipe(startX, endX);
        });
    }
    
    handleSwipe(startX, endX) {
        const threshold = 50; // píxeles mínimos para considerar swipe
        const diff = startX - endX;
        
        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                this.nextSlide(); // Swipe izquierda = siguiente
            } else {
                this.prevSlide(); // Swipe derecha = anterior
            }
        }
    }
    
    goToSlide(slideIndex) {
        // Remover clase active de slide actual
        const currentSlideEl = document.querySelector('.carousel-slide.active');
        if (currentSlideEl) {
            currentSlideEl.classList.remove('active');
        }
        
        // Remover clase active del indicador actual
        const currentIndicator = document.querySelector('.indicator.active');
        if (currentIndicator) {
            currentIndicator.classList.remove('active');
        }
        
        // Actualizar índice
        this.currentSlide = slideIndex;
        
        // Activar nuevo slide
        const newSlide = document.querySelector(`[data-slide="${slideIndex}"]`);
        if (newSlide) {
            newSlide.classList.add('active');
        }
        
        // Activar nuevo indicador
        const newIndicator = document.querySelectorAll('.indicator')[slideIndex];
        if (newIndicator) {
            newIndicator.classList.add('active');
        }
        
        // Reiniciar progreso
        this.resetProgress();
    }
    
    nextSlide() {
        const nextIndex = (this.currentSlide + 1) % this.totalSlides;
        this.goToSlide(nextIndex);
    }
    
    prevSlide() {
        const prevIndex = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
        this.goToSlide(prevIndex);
    }
    
    startAutoPlay() {
        if (!this.isPlaying) return;
        
        this.autoPlayTimer = setInterval(() => {
            this.nextSlide();
        }, this.autoPlayInterval);
    }
    
    stopAutoPlay() {
        if (this.autoPlayTimer) {
            clearInterval(this.autoPlayTimer);
            this.autoPlayTimer = null;
        }
        
        if (this.progressTimer) {
            clearInterval(this.progressTimer);
            this.progressTimer = null;
        }
    }
    
    pauseAutoPlay() {
        this.isPlaying = false;
        this.stopAutoPlay();
    }
    
    resumeAutoPlay() {
        this.isPlaying = true;
        this.startAutoPlay();
        this.updateProgress();
    }
    
    updateProgress() {
        if (!this.isPlaying) return;
        
        const progressBar = document.querySelector('.progress-bar');
        if (!progressBar) return;
        
        let progress = 0;
        const increment = 100 / (this.autoPlayInterval / 100); // Actualizar cada 100ms
        
        this.progressTimer = setInterval(() => {
            progress += increment;
            progressBar.style.width = `${progress}%`;
            
            if (progress >= 100) {
                progress = 0;
                progressBar.style.width = '0%';
            }
        }, 100);
    }
    
    resetProgress() {
        const progressBar = document.querySelector('.progress-bar');
        if (progressBar) {
            progressBar.style.width = '0%';
        }
        
        if (this.progressTimer) {
            clearInterval(this.progressTimer);
        }
        
        if (this.isPlaying) {
            this.updateProgress();
        }
    }
    
    // Método público para controlar desde fuera
    play() {
        this.isPlaying = true;
        this.startAutoPlay();
        this.updateProgress();
    }
    
    pause() {
        this.isPlaying = false;
        this.stopAutoPlay();
    }
    
    destroy() {
        this.stopAutoPlay();
        // Remover event listeners si es necesario
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    // Solo inicializar si existe el carrusel
    if (document.querySelector('.banner-carousel-pro')) {
        window.carouselPro = new CarouselProfessional();
        
        // Debugging en desarrollo
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            console.log('✅ Carrusel Profesional inicializado correctamente');
        }
    }
});

// Pausar carrusel cuando la página no está visible
document.addEventListener('visibilitychange', () => {
    if (window.carouselPro) {
        if (document.hidden) {
            window.carouselPro.pause();
        } else {
            window.carouselPro.play();
        }
    }
});

// Exportar para uso global si es necesario
window.CarouselProfessional = CarouselProfessional;
