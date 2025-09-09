// ================================
// LEVEL-UP GAMER - SISTEMA DE RESEÑAS
// Calificaciones y comentarios de productos
// ================================

// Estado del sistema de reseñas
let reviewsState = {
    reviews: {},
    userReviews: []
};

// Reseñas de ejemplo
const SAMPLE_REVIEWS = {
    'JM001': [
        {
            id: 'r1',
            productId: 'JM001',
            userId: 'user1',
            userName: 'ProGamer2024',
            userLevel: 'Elite Gamer',
            rating: 5,
            title: 'Excelente juego de estrategia',
            comment: 'Catan es un clásico que nunca decepciona. Perfecto para noches de juego con amigos.',
            date: '2024-08-15',
            helpful: 23,
            verified: true
        },
        {
            id: 'r2',
            productId: 'JM001',
            userId: 'user2',
            userName: 'CasualGamer88',
            userLevel: 'Pro Gamer',
            rating: 4,
            title: 'Muy entretenido',
            comment: 'Gran juego aunque puede ser un poco lento al principio. Vale la pena.',
            date: '2024-08-10',
            helpful: 15,
            verified: true
        }
    ],
    'AC001': [
        {
            id: 'r3',
            productId: 'AC001',
            userId: 'user3',
            userName: 'XboxMaster',
            userLevel: 'Legend',
            rating: 5,
            title: 'El mejor control que he tenido',
            comment: 'Respuesta perfecta, batería duradera y muy cómodo. Recomendado 100%.',
            date: '2024-08-20',
            helpful: 31,
            verified: true
        }
    ],
    'CO001': [
        {
            id: 'r4',
            productId: 'CO001',
            userId: 'user4',
            userName: 'PS5Lover',
            userLevel: 'Master Gamer',
            rating: 5,
            title: '¡Vale cada peso!',
            comment: 'Los gráficos son increíbles y la velocidad de carga es impresionante. Nueva generación real.',
            date: '2024-08-25',
            helpful: 45,
            verified: true
        }
    ]
};

// ================================
// INICIALIZACIÓN
// ================================

document.addEventListener('DOMContentLoaded', function() {
    initializeReviews();
});

function initializeReviews() {
    loadReviewsData();
    setupReviewEventListeners();
}

function loadReviewsData() {
    const savedReviews = localStorage.getItem('levelup_reviews');
    if (savedReviews) {
        reviewsState.reviews = JSON.parse(savedReviews);
    } else {
        reviewsState.reviews = SAMPLE_REVIEWS;
        saveReviewsData();
    }

    const savedUserReviews = localStorage.getItem('levelup_user_reviews');
    if (savedUserReviews) {
        reviewsState.userReviews = JSON.parse(savedUserReviews);
    }
}

function saveReviewsData() {
    localStorage.setItem('levelup_reviews', JSON.stringify(reviewsState.reviews));
    localStorage.setItem('levelup_user_reviews', JSON.stringify(reviewsState.userReviews));
}

// ================================
// GESTIÓN DE RESEÑAS
// ================================

function submitReview(productId, reviewData) {
    const currentUser = window.authManager?.getCurrentUser();
    if (!currentUser) {
        throw new Error('Debes iniciar sesión para escribir una reseña');
    }

    // Verificar si el usuario ya escribió una reseña para este producto
    const existingReview = reviewsState.userReviews.find(r => 
        r.productId === productId && r.userId === currentUser.id
    );
    
    if (existingReview) {
        throw new Error('Ya has escrito una reseña para este producto');
    }

    // Crear nueva reseña
    const review = {
        id: generateReviewId(),
        productId: productId,
        userId: currentUser.id,
        userName: currentUser.gamertag || currentUser.name,
        userLevel: getUserLevelName(currentUser),
        rating: parseInt(reviewData.rating),
        title: reviewData.title.trim(),
        comment: reviewData.comment.trim(),
        date: new Date().toISOString().split('T')[0],
        helpful: 0,
        verified: currentUser.verified || false
    };

    // Agregar a las reseñas del producto
    if (!reviewsState.reviews[productId]) {
        reviewsState.reviews[productId] = [];
    }
    reviewsState.reviews[productId].push(review);

    // Agregar a las reseñas del usuario
    reviewsState.userReviews.push(review);

    saveReviewsData();

    // Otorgar puntos LevelUp por escribir reseña
    if (window.gamificationSystem) {
        window.gamificationSystem.onReviewSubmitted();
    }

    return review;
}

function getProductReviews(productId) {
    return reviewsState.reviews[productId] || [];
}

function getUserReviews(userId) {
    return reviewsState.userReviews.filter(r => r.userId === userId);
}

function calculateProductRating(productId) {
    const reviews = getProductReviews(productId);
    if (reviews.length === 0) return 0;

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (totalRating / reviews.length).toFixed(1);
}

function getReviewsCount(productId) {
    return getProductReviews(productId).length;
}

function markReviewHelpful(reviewId) {
    const currentUser = window.authManager?.getCurrentUser();
    if (!currentUser) return false;

    // Buscar la reseña en todos los productos
    for (const productId in reviewsState.reviews) {
        const review = reviewsState.reviews[productId].find(r => r.id === reviewId);
        if (review) {
            review.helpful += 1;
            saveReviewsData();
            return true;
        }
    }
    return false;
}

// ================================
// UI DE RESEÑAS
// ================================

function renderProductReviews(productId, container) {
    if (!container) return;

    const reviews = getProductReviews(productId);
    const averageRating = calculateProductRating(productId);
    const reviewsCount = reviews.length;

    container.innerHTML = `
        <div class="reviews-section">
            <div class="reviews-header">
                <h3>📝 Reseñas de Clientes</h3>
                <div class="reviews-summary">
                    <div class="average-rating">
                        <span class="rating-number">${averageRating}</span>
                        <div class="stars">${renderStars(averageRating)}</div>
                        <span class="reviews-count">(${reviewsCount} reseñas)</span>
                    </div>
                    <button class="btn-write-review" onclick="showReviewModal('${productId}')">
                        Escribir Reseña
                    </button>
                </div>
            </div>

            <div class="reviews-list">
                ${reviews.length > 0 ? reviews.map(review => renderReview(review)).join('') : 
                  '<p class="no-reviews">Sé el primero en escribir una reseña para este producto</p>'}
            </div>
        </div>
    `;
}

function renderReview(review) {
    return `
        <div class="review-card" data-review-id="${review.id}">
            <div class="review-header">
                <div class="reviewer-info">
                    <span class="reviewer-name">${review.userName}</span>
                    <span class="reviewer-level">${review.userLevel}</span>
                    ${review.verified ? '<span class="verified-badge">✅ Compra verificada</span>' : ''}
                </div>
                <div class="review-rating">
                    ${renderStars(review.rating)}
                    <span class="review-date">${formatDate(review.date)}</span>
                </div>
            </div>
            <div class="review-content">
                <h4 class="review-title">${review.title}</h4>
                <p class="review-comment">${review.comment}</p>
            </div>
            <div class="review-actions">
                <button class="helpful-btn" onclick="markReviewHelpful('${review.id}')">
                    👍 Útil (${review.helpful})
                </button>
            </div>
        </div>
    `;
}

function renderStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return '⭐'.repeat(fullStars) + 
           (hasHalfStar ? '✨' : '') + 
           '☆'.repeat(emptyStars);
}

function showReviewModal(productId) {
    const currentUser = window.authManager?.getCurrentUser();
    if (!currentUser) {
        if (window.levelUpGamer?.showNotification) {
            window.levelUpGamer.showNotification('Debes iniciar sesión para escribir una reseña', 'error');
        }
        return;
    }

    const product = window.productsDatabase?.getProductById(productId);
    if (!product) return;

    const modal = document.createElement('div');
    modal.className = 'modal review-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>✍️ Escribir Reseña</h3>
                <button class="modal-close" onclick="closeReviewModal()">&times;</button>
            </div>
            <div class="modal-body">
                <div class="product-info">
                    <span class="product-emoji">${product.image}</span>
                    <div>
                        <h4>${product.name}</h4>
                        <p>${product.category}</p>
                    </div>
                </div>

                <form id="reviewForm" onsubmit="handleReviewSubmit(event, '${productId}')">
                    <div class="form-group">
                        <label>Calificación *</label>
                        <div class="rating-input">
                            ${[5,4,3,2,1].map(star => `
                                <input type="radio" id="star${star}" name="rating" value="${star}" required>
                                <label for="star${star}" class="star-label">⭐</label>
                            `).join('')}
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="reviewTitle">Título de la reseña *</label>
                        <input type="text" id="reviewTitle" name="title" required maxlength="100"
                               placeholder="Resumen de tu experiencia">
                    </div>

                    <div class="form-group">
                        <label for="reviewComment">Tu reseña *</label>
                        <textarea id="reviewComment" name="comment" required maxlength="1000"
                                  placeholder="Comparte tu experiencia con este producto..."></textarea>
                        <small class="char-count">0/1000 caracteres</small>
                    </div>

                    <div class="modal-actions">
                        <button type="button" class="product-button" onclick="closeReviewModal()">
                            Cancelar
                        </button>
                        <button type="submit" class="cta-button">
                            Publicar Reseña
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    modal.style.display = 'flex';

    // Setup character counter
    const textarea = modal.querySelector('#reviewComment');
    const charCount = modal.querySelector('.char-count');
    textarea.addEventListener('input', function() {
        charCount.textContent = `${this.value.length}/1000 caracteres`;
    });
}

function closeReviewModal() {
    const modal = document.querySelector('.review-modal');
    if (modal) {
        modal.remove();
    }
}

function handleReviewSubmit(event, productId) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const reviewData = {
        rating: formData.get('rating'),
        title: formData.get('title'),
        comment: formData.get('comment')
    };

    try {
        const review = submitReview(productId, reviewData);
        
        if (window.levelUpGamer?.showNotification) {
            window.levelUpGamer.showNotification('¡Reseña publicada exitosamente! +25 puntos LevelUp', 'success');
        }

        closeReviewModal();
        
        // Actualizar la visualización de reseñas
        const reviewsContainer = document.querySelector(`[data-product-id="${productId}"] .reviews-container`);
        if (reviewsContainer) {
            renderProductReviews(productId, reviewsContainer);
        }

    } catch (error) {
        if (window.levelUpGamer?.showNotification) {
            window.levelUpGamer.showNotification(error.message, 'error');
        }
    }
}

// ================================
// EVENT LISTENERS
// ================================

function setupReviewEventListeners() {
    // Event listener para botones de "útil"
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('helpful-btn')) {
            const reviewId = e.target.getAttribute('onclick').match(/'([^']+)'/)[1];
            if (markReviewHelpful(reviewId)) {
                const currentCount = parseInt(e.target.textContent.match(/\d+/)[0]);
                e.target.innerHTML = `👍 Útil (${currentCount + 1})`;
                e.target.disabled = true;
                e.target.style.opacity = '0.6';
            }
        }
    });
}

// ================================
// UTILIDADES
// ================================

function generateReviewId() {
    return 'r' + Date.now() + Math.random().toString(36).substr(2, 9);
}

function getUserLevelName(user) {
    if (window.gamificationSystem) {
        const levelInfo = window.gamificationSystem.getCurrentLevelInfo();
        return levelInfo ? levelInfo.name : 'Noob';
    }
    return 'Gamer';
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CL');
}

// ================================
// EXPORTAR FUNCIONES
// ================================

window.reviewsSystem = {
    submitReview,
    getProductReviews,
    getUserReviews,
    calculateProductRating,
    getReviewsCount,
    renderProductReviews,
    showReviewModal,
    markReviewHelpful
};
