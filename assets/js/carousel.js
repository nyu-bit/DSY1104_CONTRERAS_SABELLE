/**
 * ===================== CARRUSEL HERO FUNCIONAL =====================
 * Sistema de carrusel automático para el banner principal
 * Level-Up Gamer Store
 * ================================================================
 */

class HeroCarousel {
    constructor() {
        this.slides = document.querySelectorAll('.carousel-slide');
        this.indicators = document.querySelectorAll('.carousel-indicators .indicator');
        this.progressBar = document.querySelector('.carousel-progress .progress-bar');
        this.currentSlide = 0;
        this.slideInterval = null;
        this.slideTime = 6000; // 6 segundos por slide
        this.isPlaying = true;
        
        this.init();
    }

    init() {
        if (this.slides.length === 0) return;
        
        this.bindEvents();
        this.startAutoplay();
        this.updateProgress();
        
        console.log('🎠 Hero Carousel inicializado con', this.slides.length, 'slides');
    }

    bindEvents() {
        // Event listeners para indicadores
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                this.goToSlide(index);
            });
        });

        // Pause on hover
        const carouselContainer = document.querySelector('.banner-carousel-pro');
        if (carouselContainer) {
            carouselContainer.addEventListener('mouseenter', () => {
                this.pauseAutoplay();
            });
            
            carouselContainer.addEventListener('mouseleave', () => {
                this.resumeAutoplay();
            });
        }

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                this.previousSlide();
            } else if (e.key === 'ArrowRight') {
                this.nextSlide();
            }
        });

        // Touch/swipe support
        let startX = 0;
        let endX = 0;

        carouselContainer?.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });

        carouselContainer?.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            this.handleSwipe(startX, endX);
        });
    }

    handleSwipe(startX, endX) {
        const threshold = 50;
        const diff = startX - endX;

        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                this.nextSlide();
            } else {
                this.previousSlide();
            }
        }
    }

    goToSlide(slideIndex) {
        // Remove active class from current slide and indicator
        this.slides[this.currentSlide]?.classList.remove('active');
        this.indicators[this.currentSlide]?.classList.remove('active');

        // Update current slide index
        this.currentSlide = slideIndex;

        // Add active class to new slide and indicator
        this.slides[this.currentSlide]?.classList.add('active');
        this.indicators[this.currentSlide]?.classList.add('active');

        // Trigger slide transition animation
        this.animateSlide();
        
        // Reset and restart autoplay
        this.resetAutoplay();
        
        console.log('🎯 Slide cambiado a:', this.currentSlide);
    }

    nextSlide() {
        const nextIndex = (this.currentSlide + 1) % this.slides.length;
        this.goToSlide(nextIndex);
    }

    previousSlide() {
        const prevIndex = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
        this.goToSlide(prevIndex);
    }

    animateSlide() {
        const currentSlideElement = this.slides[this.currentSlide];
        
        if (currentSlideElement) {
            // Add entrance animation
            currentSlideElement.style.opacity = '0';
            currentSlideElement.style.transform = 'translateX(30px)';
            
            setTimeout(() => {
                currentSlideElement.style.transition = 'all 0.6s ease-out';
                currentSlideElement.style.opacity = '1';
                currentSlideElement.style.transform = 'translateX(0)';
            }, 50);

            // Animate slide content
            const slideText = currentSlideElement.querySelector('.slide-text');
            const slideImage = currentSlideElement.querySelector('.slide-image');
            
            if (slideText) {
                slideText.style.transform = 'translateY(20px)';
                slideText.style.opacity = '0';
                
                setTimeout(() => {
                    slideText.style.transition = 'all 0.8s ease-out';
                    slideText.style.transform = 'translateY(0)';
                    slideText.style.opacity = '1';
                }, 200);
            }
            
            if (slideImage) {
                slideImage.style.transform = 'scale(1.1)';
                
                setTimeout(() => {
                    slideImage.style.transition = 'transform 0.8s ease-out';
                    slideImage.style.transform = 'scale(1)';
                }, 200);
            }
        }
    }

    startAutoplay() {
        if (!this.isPlaying) return;
        
        this.slideInterval = setInterval(() => {
            this.nextSlide();
        }, this.slideTime);
        
        console.log('▶️ Autoplay iniciado');
    }

    pauseAutoplay() {
        this.isPlaying = false;
        if (this.slideInterval) {
            clearInterval(this.slideInterval);
            this.slideInterval = null;
        }
        
        // Pause progress animation
        if (this.progressBar) {
            this.progressBar.style.animationPlayState = 'paused';
        }
        
        console.log('⏸️ Autoplay pausado');
    }

    resumeAutoplay() {
        this.isPlaying = true;
        this.startAutoplay();
        
        // Resume progress animation
        if (this.progressBar) {
            this.progressBar.style.animationPlayState = 'running';
        }
        
        console.log('▶️ Autoplay reanudado');
    }

    resetAutoplay() {
        if (this.slideInterval) {
            clearInterval(this.slideInterval);
        }
        this.startAutoplay();
        this.updateProgress();
    }

    updateProgress() {
        if (this.progressBar) {
            // Reset animation
            this.progressBar.style.animation = 'none';
            this.progressBar.offsetHeight; // Trigger reflow
            
            // Start new animation
            this.progressBar.style.animation = `progressSlide ${this.slideTime}ms linear infinite`;
        }
    }

    // Public methods for external control
    play() {
        this.resumeAutoplay();
    }

    pause() {
        this.pauseAutoplay();
    }

    getCurrentSlide() {
        return this.currentSlide;
    }

    getTotalSlides() {
        return this.slides.length;
    }
}

// CSS Animation for progress bar
const style = document.createElement('style');
style.textContent = `
    @keyframes progressSlide {
        0% { width: 0%; }
        100% { width: 100%; }
    }
    
    .carousel-slide {
        transition: opacity 0.6s ease-out, transform 0.6s ease-out;
    }
    
    .carousel-slide:not(.active) {
        opacity: 0;
        transform: translateX(-20px);
    }
    
    .carousel-slide.active {
        opacity: 1;
        transform: translateX(0);
    }
    
    .slide-text {
        transition: all 0.8s ease-out;
    }
    
    .slide-image {
        transition: transform 0.8s ease-out;
        overflow: hidden;
    }
    
    .carousel-indicators .indicator {
        transition: all 0.3s ease;
        cursor: pointer;
    }
    
    .carousel-indicators .indicator:hover {
        transform: scale(1.2);
    }
    
    .carousel-indicators .indicator.active {
        transform: scale(1.3);
    }
`;
document.head.appendChild(style);

// Initialize carousel when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const heroCarousel = new HeroCarousel();
    
    // Make it globally accessible for debugging
    window.heroCarousel = heroCarousel;
    
    console.log('🎮 Level-Up Gamer Hero Carousel loaded successfully!');
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HeroCarousel;
}
