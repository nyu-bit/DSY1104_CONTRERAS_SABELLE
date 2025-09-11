/**
 * LEVEL-UP GAMER - SISTEMA DE RESEÑAS
 * Sistema completo de reseñas y calificaciones por producto
 * @version 1.0
 * @author Level-Up Team
 */

class ReviewsSystem {
    constructor() {
        this.storageKey = 'levelup_reviews';
        this.userStorageKey = 'levelup_user';
        this.reviewsData = {};
        
        this.init();
    }

    init() {
        this.loadReviews();
        this.setupEventListeners();
    }

    loadReviews() {
        try {
            const savedReviews = localStorage.getItem(this.storageKey);
            if (savedReviews) {
                this.reviewsData = JSON.parse(savedReviews);
            }
        } catch (error) {
            console.error('Error cargando reseñas:', error);
            this.reviewsData = {};
        }
    }

    saveReviews() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.reviewsData));
        } catch (error) {
            console.error('Error guardando reseñas:', error);
        }
    }

    setupEventListeners() {
        // Escuchar clics en botones de reseña
        document.addEventListener('click', (e) => {
            if (e.target.matches('.btn-review, .btn-review *')) {
                const btn = e.target.closest('.btn-review');
                const productId = btn?.dataset.productId;
                if (productId) {
                    this.showReviewModal(productId);
                }
            }

            if (e.target.matches('.review-helpful-btn')) {
                const reviewId = e.target.dataset.reviewId;
                this.markReviewHelpful(reviewId);
            }
        });
    }

    // Crear reseña
    submitReview(productId, reviewData) {
        const user = this.getCurrentUser();
        if (!user) {
            this.showNotification('Debes iniciar sesión para escribir una reseña', 'warning');
            return false;
        }

        // Verificar si el usuario ya reseñó este producto
        if (this.hasUserReviewed(productId, user.email)) {
            this.showNotification('Ya has reseñado este producto', 'warning');
            return false;
        }

        const review = {
            id: this.generateReviewId(),
            productId: productId,
            userId: user.email,
            userName: user.firstName + ' ' + user.lastName,
            rating: reviewData.rating,
            title: reviewData.title,
            comment: reviewData.comment,
            date: new Date().toISOString(),
            helpful: 0,
            verified: user.hasPurchased ? true : false // Si el usuario ha comprado el producto
        };

        // Agregar reseña al producto
        if (!this.reviewsData[productId]) {
            this.reviewsData[productId] = [];
        }

        this.reviewsData[productId].push(review);
        this.saveReviews();

        // Dar puntos por reseña
        if (window.gamificationSystem) {
            window.gamificationSystem.addPoints('review');
        }

        // Disparar evento personalizado
        document.dispatchEvent(new CustomEvent('reviewSubmitted', {
            detail: { productId, review }
        }));

        this.showNotification('¡Reseña publicada exitosamente!', 'success');
        return true;
    }

    // Verificar si usuario ya reseñó
    hasUserReviewed(productId, userEmail) {
        const productReviews = this.reviewsData[productId] || [];
        return productReviews.some(review => review.userId === userEmail);
    }

    // Obtener reseñas de un producto
    getProductReviews(productId) {
        return this.reviewsData[productId] || [];
    }

    // Calcular promedio de calificaciones
    getProductRating(productId) {
        const reviews = this.getProductReviews(productId);
        if (reviews.length === 0) return { average: 0, count: 0 };

        const average = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
        return {
            average: Math.round(average * 10) / 10,
            count: reviews.length
        };
    }

    // Marcar reseña como útil
    markReviewHelpful(reviewId) {
        for (const productId in this.reviewsData) {
            const review = this.reviewsData[productId].find(r => r.id === reviewId);
            if (review) {
                review.helpful += 1;
                this.saveReviews();
                this.updateReviewDisplay(productId);
                break;
            }
        }
    }

    // Modal de reseña
    showReviewModal(productId) {
        const user = this.getCurrentUser();
        if (!user) {
            this.showNotification('Debes iniciar sesión para escribir una reseña', 'warning');
            return;
        }

        if (this.hasUserReviewed(productId, user.email)) {
            this.showNotification('Ya has reseñado este producto', 'info');
            return;
        }

        const product = this.getProduct(productId);
        if (!product) {
            this.showNotification('Producto no encontrado', 'error');
            return;
        }

        const modal = document.createElement('div');
        modal.className = 'modal-overlay review-modal-overlay';
        modal.innerHTML = `
            <div class="modal review-modal">
                <div class="modal-header">
                    <h2>📝 Escribir Reseña</h2>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="review-product-info">
                        <div class="product-image">${product.image || '🎮'}</div>
                        <div class="product-details">
                            <h3>${product.name}</h3>
                            <p class="product-category">${product.categoryName || 'Gaming'}</p>
                        </div>
                    </div>
                    
                    <form class="review-form" id="reviewForm">
                        <div class="form-group">
                            <label for="reviewRating">Calificación *</label>
                            <div class="rating-input" id="reviewRating">
                                <button type="button" class="star-btn" data-rating="1">⭐</button>
                                <button type="button" class="star-btn" data-rating="2">⭐</button>
                                <button type="button" class="star-btn" data-rating="3">⭐</button>
                                <button type="button" class="star-btn" data-rating="4">⭐</button>
                                <button type="button" class="star-btn" data-rating="5">⭐</button>
                            </div>
                            <span class="rating-text">Selecciona una calificación</span>
                            <input type="hidden" id="selectedRating" value="0">
                        </div>
                        
                        <div class="form-group">
                            <label for="reviewTitle">Título de la reseña *</label>
                            <input type="text" 
                                   id="reviewTitle" 
                                   placeholder="Ej: Excelente calidad y rendimiento"
                                   maxlength="100"
                                   required>
                            <div class="char-count">0/100</div>
                        </div>
                        
                        <div class="form-group">
                            <label for="reviewComment">Tu reseña *</label>
                            <textarea id="reviewComment" 
                                      placeholder="Comparte tu experiencia con este producto..."
                                      rows="4"
                                      maxlength="500"
                                      required></textarea>
                            <div class="char-count">0/500</div>
                        </div>
                        
                        <div class="review-guidelines">
                            <h4>💡 Consejos para una buena reseña:</h4>
                            <ul>
                                <li>Sé específico sobre lo que te gustó o no</li>
                                <li>Menciona cómo usas el producto</li>
                                <li>Incluye pros y contras</li>
                                <li>Sé honesto y constructivo</li>
                            </ul>
                        </div>
                        
                        <div class="modal-actions">
                            <button type="button" class="btn-secondary" onclick="this.closest('.modal-overlay').remove()">
                                Cancelar
                            </button>
                            <button type="submit" class="btn-primary" id="submitReview">
                                <i class="fas fa-paper-plane"></i> Publicar Reseña
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        this.setupReviewModalEvents(modal, productId);
    }

    setupReviewModalEvents(modal, productId) {
        const ratingButtons = modal.querySelectorAll('.star-btn');
        const ratingInput = modal.getElementById('selectedRating');
        const ratingText = modal.querySelector('.rating-text');
        const titleInput = modal.getElementById('reviewTitle');
        const commentInput = modal.getElementById('reviewComment');
        const form = modal.getElementById('reviewForm');

        // Rating stars
        ratingButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const rating = parseInt(btn.dataset.rating);
                ratingInput.value = rating;
                
                // Update visual feedback
                ratingButtons.forEach((star, index) => {
                    star.classList.toggle('active', index < rating);
                });
                
                const ratingTexts = ['', 'Malo', 'Regular', 'Bueno', 'Muy bueno', 'Excelente'];
                ratingText.textContent = ratingTexts[rating];
            });
        });

        // Character counters
        titleInput.addEventListener('input', () => {
            const count = titleInput.value.length;
            const counter = titleInput.nextElementSibling;
            counter.textContent = `${count}/100`;
            counter.style.color = count > 90 ? '#ff4444' : '#888';
        });

        commentInput.addEventListener('input', () => {
            const count = commentInput.value.length;
            const counter = commentInput.nextElementSibling;
            counter.textContent = `${count}/500`;
            counter.style.color = count > 450 ? '#ff4444' : '#888';
        });

        // Form submission
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const rating = parseInt(ratingInput.value);
            const title = titleInput.value.trim();
            const comment = commentInput.value.trim();

            // Validation
            if (rating === 0) {
                this.showNotification('Por favor selecciona una calificación', 'warning');
                return;
            }

            if (!title) {
                this.showNotification('Por favor ingresa un título', 'warning');
                return;
            }

            if (!comment) {
                this.showNotification('Por favor escribe tu reseña', 'warning');
                return;
            }

            // Submit review
            const success = this.submitReview(productId, {
                rating,
                title,
                comment
            });

            if (success) {
                modal.remove();
                this.updateReviewDisplay(productId);
            }
        });

        // Close modal
        modal.querySelector('.modal-close').addEventListener('click', () => {
            modal.remove();
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    // Renderizar reseñas en página de producto
    renderProductReviews(productId, container) {
        const reviews = this.getProductReviews(productId);
        const rating = this.getProductRating(productId);
        
        if (!container) return;

        container.innerHTML = `
            <div class="reviews-section">
                <div class="reviews-header">
                    <div class="reviews-summary">
                        <h3>📝 Reseñas y Calificaciones</h3>
                        <div class="rating-summary">
                            <div class="average-rating">
                                <span class="rating-number">${rating.average.toFixed(1)}</span>
                                <div class="rating-stars">
                                    ${this.renderStars(rating.average)}
                                </div>
                                <span class="review-count">(${rating.count} reseñas)</span>
                            </div>
                        </div>
                    </div>
                    
                    <button class="btn-primary btn-review" data-product-id="${productId}">
                        <i class="fas fa-edit"></i> Escribir Reseña
                    </button>
                </div>
                
                ${reviews.length > 0 ? this.renderReviewsList(reviews) : this.renderNoReviews()}
            </div>
        `;
    }

    renderReviewsList(reviews) {
        // Ordenar por fecha (más recientes primero) y luego por utilidad
        const sortedReviews = [...reviews].sort((a, b) => {
            return new Date(b.date) - new Date(a.date);
        });

        return `
            <div class="reviews-list">
                ${sortedReviews.map(review => this.renderReviewCard(review)).join('')}
            </div>
        `;
    }

    renderReviewCard(review) {
        const date = new Date(review.date).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        return `
            <div class="review-card">
                <div class="review-header">
                    <div class="reviewer-info">
                        <div class="reviewer-avatar">
                            ${review.userName.charAt(0).toUpperCase()}
                        </div>
                        <div class="reviewer-details">
                            <h4>${review.userName} ${review.verified ? '<span class="verified-badge">✅ Compra verificada</span>' : ''}</h4>
                            <p class="review-date">${date}</p>
                        </div>
                    </div>
                    <div class="review-rating">
                        ${this.renderStars(review.rating)}
                    </div>
                </div>
                
                <div class="review-content">
                    <h5 class="review-title">${review.title}</h5>
                    <p class="review-comment">${review.comment}</p>
                </div>
                
                <div class="review-actions">
                    <button class="review-helpful-btn" data-review-id="${review.id}">
                        <i class="fas fa-thumbs-up"></i>
                        Útil (${review.helpful})
                    </button>
                </div>
            </div>
        `;
    }

    renderNoReviews() {
        return `
            <div class="no-reviews">
                <div class="no-reviews-icon">📝</div>
                <h4>Aún no hay reseñas</h4>
                <p>Sé el primero en compartir tu experiencia con este producto</p>
            </div>
        `;
    }

    renderStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        let stars = '';

        for (let i = 0; i < 5; i++) {
            if (i < fullStars) {
                stars += '<i class="fas fa-star star filled"></i>';
            } else if (i === fullStars && hasHalfStar) {
                stars += '<i class="fas fa-star-half-alt star half"></i>';
            } else {
                stars += '<i class="far fa-star star empty"></i>';
            }
        }

        return stars;
    }

    updateReviewDisplay(productId) {
        const reviewsContainer = document.querySelector(`#reviews-${productId}, .reviews-container`);
        if (reviewsContainer) {
            this.renderProductReviews(productId, reviewsContainer);
        }

        // Actualizar rating en card de producto si existe
        this.updateProductCardRating(productId);
    }

    updateProductCardRating(productId) {
        const productCards = document.querySelectorAll(`[data-product-id="${productId}"]`);
        const rating = this.getProductRating(productId);

        productCards.forEach(card => {
            const ratingElement = card.querySelector('.product-rating');
            if (ratingElement) {
                ratingElement.innerHTML = `
                    <div class="stars">${this.renderStars(rating.average)}</div>
                    <span class="rating-text">${rating.average.toFixed(1)} (${rating.count} reseñas)</span>
                `;
            }
        });
    }

    // Utilidades
    getCurrentUser() {
        try {
            return JSON.parse(localStorage.getItem(this.userStorageKey));
        } catch {
            return null;
        }
    }

    getProduct(productId) {
        // Intentar obtener producto de la base de datos global
        if (window.PRODUCT_DATABASE && window.PRODUCT_DATABASE[productId]) {
            return window.PRODUCT_DATABASE[productId];
        }

        // Fallback: buscar en productos cargados
        const products = document.querySelectorAll('[data-product-id]');
        for (const productElement of products) {
            if (productElement.dataset.productId === productId) {
                return {
                    id: productId,
                    name: productElement.querySelector('.product-title, .product-name')?.textContent || 'Producto',
                    image: productElement.querySelector('.product-image')?.textContent || '🎮'
                };
            }
        }

        return null;
    }

    generateReviewId() {
        return 'review_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    showNotification(message, type = 'info') {
        if (window.showNotification) {
            window.showNotification(message, type);
        } else {
            console.log(`${type.toUpperCase()}: ${message}`);
        }
    }

    // API Pública
    getReviewStats() {
        let totalReviews = 0;
        let totalRating = 0;

        for (const productId in this.reviewsData) {
            const reviews = this.reviewsData[productId];
            totalReviews += reviews.length;
            totalRating += reviews.reduce((sum, review) => sum + review.rating, 0);
        }

        return {
            totalReviews,
            averageRating: totalReviews > 0 ? totalRating / totalReviews : 0
        };
    }

    getUserReviews(userEmail) {
        const userReviews = [];
        
        for (const productId in this.reviewsData) {
            const reviews = this.reviewsData[productId];
            const userProductReviews = reviews.filter(r => r.userId === userEmail);
            userReviews.push(...userProductReviews);
        }

        return userReviews.sort((a, b) => new Date(b.date) - new Date(a.date));
    }
}

// Inicializar sistema de reseñas
document.addEventListener('DOMContentLoaded', () => {
    window.reviewsSystem = new ReviewsSystem();
});

// Exponer API global
window.ReviewsSystem = ReviewsSystem;
