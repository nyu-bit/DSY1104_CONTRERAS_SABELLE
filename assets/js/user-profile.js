/**
 * Sistema de Gestión del Perfil de Usuario
 * Level-Up Gamer - Plataforma E-commerce Gaming
 * 
 * Este módulo gestiona toda la funcionalidad del perfil de usuario incluyendo:
 * - Autenticación y autorización
 * - Gestión de datos personales
 * - Sistema de preferencias gaming
 * - Integración con gamificación
 * - Sistema de referidos
 * - Gestión de reseñas del usuario
 */

class UserProfileManager {
    constructor() {
        this.currentUser = null;
        this.isLoading = false;
        this.tabs = {};
        
        // Configuración
        this.config = {
            localStorageKeys: {
                user: 'levelup_user',
                preferences: 'levelup_user_preferences',
                referrals: 'levelup_user_referrals'
            },
            defaultAvatar: '../assets/images/default-avatar.png'
        };

        this.init();
    }

    async init() {
        console.log('🚀 Inicializando Sistema de Perfil de Usuario...');
        
        this.setupEventListeners();
        this.initializeTabs();
        await this.checkAuthStatus();
        this.loadUserProfile();
        
        console.log('✅ Sistema de Perfil de Usuario inicializado correctamente');
    }

    setupEventListeners() {
        // Tabs navigation
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tabId = e.target.dataset.tab;
                this.switchTab(tabId);
            });
        });

        // Formulario de datos personales
        const personalForm = document.getElementById('personalForm');
        if (personalForm) {
            personalForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.savePersonalData();
            });
        }

        // Avatar edit button
        const avatarEditBtn = document.querySelector('.avatar-edit-btn');
        if (avatarEditBtn) {
            avatarEditBtn.addEventListener('click', () => this.changeAvatar());
        }
    }

    initializeTabs() {
        this.tabs = {
            dashboard: () => this.loadDashboard(),
            personal: () => this.loadPersonalData(),
            preferences: () => this.loadPreferences(),
            gamification: () => this.loadGamification(),
            referrals: () => this.loadReferrals(),
            reviews: () => this.loadUserReviews()
        };
    }

    async checkAuthStatus() {
        const userData = localStorage.getItem(this.config.localStorageKeys.user);
        
        if (userData) {
            try {
                this.currentUser = JSON.parse(userData);
                this.showProfileSection();
            } catch (error) {
                console.error('Error parsing user data:', error);
                this.showAuthRequired();
            }
        } else {
            this.showAuthRequired();
        }
    }

    showAuthRequired() {
        const authRequired = document.getElementById('authRequired');
        const profileSection = document.getElementById('profileSection');
        
        if (authRequired) authRequired.style.display = 'block';
        if (profileSection) profileSection.style.display = 'none';
    }

    showProfileSection() {
        const authRequired = document.getElementById('authRequired');
        const profileSection = document.getElementById('profileSection');
        
        if (authRequired) authRequired.style.display = 'none';
        if (profileSection) profileSection.style.display = 'block';
    }

    switchTab(tabId) {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');

        // Update tab panels
        document.querySelectorAll('.tab-panel').forEach(panel => {
            panel.classList.remove('active');
        });
        document.getElementById(`${tabId}Tab`).classList.add('active');

        // Load tab content
        if (this.tabs[tabId]) {
            this.tabs[tabId]();
        }
    }

    loadUserProfile() {
        if (!this.currentUser) return;

        // Update profile header
        const userName = document.getElementById('userName');
        const userEmail = document.getElementById('userEmail');
        const joinDate = document.getElementById('joinDate');

        if (userName) userName.textContent = this.currentUser.name || 'Usuario Gamer';
        if (userEmail) userEmail.textContent = this.currentUser.email || '';
        
        if (joinDate) {
            const date = this.currentUser.joinDate ? 
                new Date(this.currentUser.joinDate).getFullYear() : 
                new Date().getFullYear();
            joinDate.textContent = date;
        }

        // Load level information
        this.updateLevelInfo();
        
        // Load default tab
        this.loadDashboard();
    }

    updateLevelInfo() {
        if (!window.gamificationSystem) return;

        const levelInfo = document.getElementById('levelInfo');
        const detailedLevelInfo = document.getElementById('detailedLevelInfo');
        
        const userLevel = window.gamificationSystem.getUserLevel();
        const levelData = window.gamificationSystem.levels[userLevel.level];
        
        const levelHTML = `
            <div class="level-badge ${userLevel.level}">
                <span class="level-icon">${levelData.icon}</span>
                <span class="level-name">${levelData.name}</span>
            </div>
            <div class="level-progress">
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${userLevel.progressPercentage}%"></div>
                </div>
                <span class="progress-text">${userLevel.currentPoints}/${userLevel.nextLevelPoints} pts</span>
            </div>
        `;

        if (levelInfo) levelInfo.innerHTML = levelHTML;
        if (detailedLevelInfo) detailedLevelInfo.innerHTML = levelHTML;
    }

    loadDashboard() {
        this.loadUserStats();
        this.loadActivityList();
        this.loadActiveChallenges();
    }

    loadUserStats() {
        const userStats = document.getElementById('userStats');
        if (!userStats) return;

        const totalPurchases = this.getUserPurchases().length;
        const totalReviews = this.getUserReviews().length;
        const totalPoints = window.gamificationSystem?.getUserData()?.points || 0;
        const totalReferrals = this.getReferralStats().total;

        userStats.innerHTML = `
            <div class="stat-item">
                <span class="stat-icon">🛒</span>
                <span class="stat-value">${totalPurchases}</span>
                <span class="stat-label">Compras</span>
            </div>
            <div class="stat-item">
                <span class="stat-icon">⭐</span>
                <span class="stat-value">${totalReviews}</span>
                <span class="stat-label">Reseñas</span>
            </div>
            <div class="stat-item">
                <span class="stat-icon">🎯</span>
                <span class="stat-value">${totalPoints}</span>
                <span class="stat-label">Puntos</span>
            </div>
            <div class="stat-item">
                <span class="stat-icon">👥</span>
                <span class="stat-value">${totalReferrals}</span>
                <span class="stat-label">Referidos</span>
            </div>
        `;
    }

    loadActivityList() {
        const activityList = document.getElementById('activityList');
        if (!activityList) return;

        // Get recent activities (purchases, reviews, achievements)
        const activities = this.getRecentActivities();
        
        if (activities.length === 0) {
            activityList.innerHTML = `
                <div class="empty-state">
                    <p>🎮 ¡Empieza tu aventura gaming!</p>
                    <p>Explora productos y gana puntos</p>
                </div>
            `;
            return;
        }

        activityList.innerHTML = activities.map(activity => `
            <div class="activity-item">
                <span class="activity-icon">${activity.icon}</span>
                <div class="activity-content">
                    <p class="activity-text">${activity.text}</p>
                    <span class="activity-time">${activity.timeAgo}</span>
                </div>
                ${activity.points ? `<span class="activity-points">+${activity.points} pts</span>` : ''}
            </div>
        `).join('');
    }

    loadActiveChallenges() {
        const activeChallenges = document.getElementById('activeChallenges');
        if (!activeChallenges || !window.gamificationSystem) return;

        const challenges = window.gamificationSystem.getActiveChallenges();
        
        if (challenges.length === 0) {
            activeChallenges.innerHTML = `
                <div class="empty-state">
                    <p>🏆 ¡Nuevos desafíos próximamente!</p>
                </div>
            `;
            return;
        }

        activeChallenges.innerHTML = challenges.map(challenge => `
            <div class="challenge-card mini">
                <h4>${challenge.name}</h4>
                <p>${challenge.description}</p>
                <div class="challenge-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${(challenge.progress / challenge.target) * 100}%"></div>
                    </div>
                    <span>${challenge.progress}/${challenge.target}</span>
                </div>
                <div class="challenge-reward">🎁 ${challenge.reward} pts</div>
            </div>
        `).join('');
    }

    loadPersonalData() {
        if (!this.currentUser) return;

        // Populate form with current user data
        const fields = ['firstName', 'lastName', 'email', 'phone', 'birthDate', 'address'];
        
        fields.forEach(field => {
            const element = document.getElementById(field);
            if (element && this.currentUser[field]) {
                element.value = this.currentUser[field];
            }
        });
    }

    savePersonalData() {
        const formData = new FormData(document.getElementById('personalForm'));
        const updatedData = {};
        
        for (let [key, value] of formData.entries()) {
            updatedData[key] = value;
        }

        // Update current user data
        this.currentUser = { ...this.currentUser, ...updatedData };
        
        // Save to localStorage
        localStorage.setItem(this.config.localStorageKeys.user, JSON.stringify(this.currentUser));
        
        // Update profile display
        this.loadUserProfile();
        
        // Show success notification
        if (window.gamificationSystem) {
            window.gamificationSystem.showNotification('✅ Datos personales actualizados correctamente');
        }
    }

    loadPreferences() {
        const preferences = this.getUserPreferences();
        
        // Load platform preferences
        if (preferences.platforms) {
            preferences.platforms.forEach(platform => {
                const checkbox = document.querySelector(`#platformsGroup input[value="${platform}"]`);
                if (checkbox) checkbox.checked = true;
            });
        }

        // Load genre preferences
        if (preferences.genres) {
            preferences.genres.forEach(genre => {
                const checkbox = document.querySelector(`#genresGroup input[value="${genre}"]`);
                if (checkbox) checkbox.checked = true;
            });
        }

        // Load other preferences
        const fields = ['currency', 'budget', 'emailNotifications', 'promoNotifications', 'newProductNotifications'];
        fields.forEach(field => {
            const element = document.getElementById(field);
            if (element && preferences[field] !== undefined) {
                if (element.type === 'checkbox') {
                    element.checked = preferences[field];
                } else {
                    element.value = preferences[field];
                }
            }
        });
    }

    loadGamification() {
        if (!window.gamificationSystem) return;

        // Load achievements
        const achievementsGrid = document.getElementById('achievementsGrid');
        if (achievementsGrid) {
            const achievements = window.gamificationSystem.getAllAchievements();
            achievementsGrid.innerHTML = achievements.map(achievement => `
                <div class="achievement-card ${achievement.unlocked ? 'unlocked' : 'locked'}">
                    <div class="achievement-icon">${achievement.icon}</div>
                    <h4>${achievement.name}</h4>
                    <p>${achievement.description}</p>
                    <div class="achievement-reward">🎁 ${achievement.reward} pts</div>
                    ${achievement.unlocked ? '<div class="achievement-status">✅ Desbloqueado</div>' : ''}
                </div>
            `).join('');
        }

        // Load challenges
        const challengesList = document.getElementById('challengesList');
        if (challengesList) {
            const challenges = window.gamificationSystem.getAllChallenges();
            challengesList.innerHTML = challenges.map(challenge => `
                <div class="challenge-card">
                    <h4>${challenge.name}</h4>
                    <p>${challenge.description}</p>
                    <div class="challenge-progress">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${(challenge.progress / challenge.target) * 100}%"></div>
                        </div>
                        <span>${challenge.progress}/${challenge.target}</span>
                    </div>
                    <div class="challenge-reward">🎁 ${challenge.reward} pts</div>
                    <div class="challenge-time">⏰ ${challenge.timeLeft || 'Sin límite'}</div>
                </div>
            `).join('');
        }
    }

    loadReferrals() {
        this.generateReferralCode();
        this.loadReferralStats();
    }

    generateReferralCode() {
        const referralCode = document.getElementById('referralCode');
        if (!referralCode || !this.currentUser) return;

        // Generate or retrieve existing referral code
        let code = this.currentUser.referralCode;
        if (!code) {
            code = 'LUG' + this.currentUser.id.toString().padStart(4, '0') + Math.random().toString(36).substr(2, 4).toUpperCase();
            this.currentUser.referralCode = code;
            localStorage.setItem(this.config.localStorageKeys.user, JSON.stringify(this.currentUser));
        }

        referralCode.textContent = code;
    }

    loadReferralStats() {
        const stats = this.getReferralStats();
        
        // Update stats display
        const totalReferrals = document.getElementById('totalReferrals');
        const activeReferrals = document.getElementById('activeReferrals');
        const referralPoints = document.getElementById('referralPoints');

        if (totalReferrals) totalReferrals.textContent = stats.total;
        if (activeReferrals) activeReferrals.textContent = stats.active;
        if (referralPoints) referralPoints.textContent = stats.points;
    }

    loadUserReviews() {
        const userReviews = this.getUserReviews();
        const userReviewsList = document.getElementById('userReviewsList');
        const totalReviews = document.getElementById('totalReviews');
        const averageRating = document.getElementById('averageRating');

        if (totalReviews) totalReviews.textContent = userReviews.length;
        
        if (averageRating) {
            const avg = userReviews.length > 0 ? 
                (userReviews.reduce((sum, review) => sum + review.rating, 0) / userReviews.length).toFixed(1) : 
                '0.0';
            averageRating.textContent = avg;
        }

        if (!userReviewsList) return;

        if (userReviews.length === 0) {
            userReviewsList.innerHTML = `
                <div class="empty-state">
                    <p>📝 ¡Aún no has escrito reseñas!</p>
                    <p>Compra productos y comparte tu experiencia</p>
                    <a href="../productos/" class="btn-primary">Explorar Productos</a>
                </div>
            `;
            return;
        }

        userReviewsList.innerHTML = userReviews.map(review => `
            <div class="user-review-card">
                <div class="review-header">
                    <h4>${review.productName}</h4>
                    <div class="review-rating">
                        ${this.generateStars(review.rating)}
                        <span class="rating-value">${review.rating}/5</span>
                    </div>
                </div>
                <p class="review-comment">${review.comment}</p>
                <div class="review-meta">
                    <span class="review-date">${this.formatDate(review.date)}</span>
                    <span class="review-helpful">👍 ${review.helpful || 0} personas encontraron esto útil</span>
                </div>
                <div class="review-actions">
                    <button class="btn-small" onclick="userProfile.editReview('${review.id}')">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                    <button class="btn-small btn-danger" onclick="userProfile.deleteReview('${review.id}')">
                        <i class="fas fa-trash"></i> Eliminar
                    </button>
                </div>
            </div>
        `).join('');
    }

    // Utility Methods
    getUserPreferences() {
        const saved = localStorage.getItem(this.config.localStorageKeys.preferences);
        return saved ? JSON.parse(saved) : {
            platforms: [],
            genres: [],
            currency: 'CLP',
            budget: '0-50000',
            emailNotifications: true,
            promoNotifications: true,
            newProductNotifications: false
        };
    }

    getUserPurchases() {
        // This would typically come from a backend API
        const purchases = localStorage.getItem('levelup_user_purchases');
        return purchases ? JSON.parse(purchases) : [];
    }

    getUserReviews() {
        if (!window.reviewsSystem) return [];
        return window.reviewsSystem.getReviewsByUser(this.currentUser?.id) || [];
    }

    getReferralStats() {
        const referrals = localStorage.getItem(this.config.localStorageKeys.referrals);
        const data = referrals ? JSON.parse(referrals) : { total: 0, active: 0, points: 0 };
        return data;
    }

    getRecentActivities() {
        const activities = [];
        
        // Get recent purchases
        const purchases = this.getUserPurchases().slice(-3);
        purchases.forEach(purchase => {
            activities.push({
                icon: '🛒',
                text: `Compraste ${purchase.productName}`,
                timeAgo: this.getTimeAgo(purchase.date),
                points: purchase.points
            });
        });

        // Get recent reviews
        const reviews = this.getUserReviews().slice(-2);
        reviews.forEach(review => {
            activities.push({
                icon: '⭐',
                text: `Reseñaste ${review.productName}`,
                timeAgo: this.getTimeAgo(review.date),
                points: 50
            });
        });

        // Sort by date
        return activities.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    generateStars(rating) {
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            stars += `<i class="fas fa-star ${i <= rating ? 'active' : ''}"></i>`;
        }
        return stars;
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-CL', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    getTimeAgo(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);
        
        if (diffInSeconds < 60) return 'Hace unos segundos';
        if (diffInSeconds < 3600) return `Hace ${Math.floor(diffInSeconds / 60)} minutos`;
        if (diffInSeconds < 86400) return `Hace ${Math.floor(diffInSeconds / 3600)} horas`;
        return `Hace ${Math.floor(diffInSeconds / 86400)} días`;
    }

    changeAvatar() {
        // This would typically open a file picker or avatar selection modal
        if (window.gamificationSystem) {
            window.gamificationSystem.showNotification('📸 Función de cambio de avatar próximamente disponible');
        }
    }

    editReview(reviewId) {
        if (window.reviewsSystem) {
            window.reviewsSystem.editReview(reviewId);
        }
    }

    deleteReview(reviewId) {
        if (confirm('¿Estás seguro de que quieres eliminar esta reseña?')) {
            if (window.reviewsSystem) {
                window.reviewsSystem.deleteReview(reviewId);
                this.loadUserReviews(); // Refresh the reviews list
            }
        }
    }
}

// Global Functions for UI interactions
function savePreferences() {
    const platforms = Array.from(document.querySelectorAll('#platformsGroup input:checked')).map(cb => cb.value);
    const genres = Array.from(document.querySelectorAll('#genresGroup input:checked')).map(cb => cb.value);
    
    const preferences = {
        platforms,
        genres,
        currency: document.getElementById('currency')?.value || 'CLP',
        budget: document.getElementById('budget')?.value || '0-50000',
        emailNotifications: document.getElementById('emailNotifications')?.checked || false,
        promoNotifications: document.getElementById('promoNotifications')?.checked || false,
        newProductNotifications: document.getElementById('newProductNotifications')?.checked || false,
        lastUpdated: new Date().toISOString()
    };

    localStorage.setItem('levelup_user_preferences', JSON.stringify(preferences));
    
    if (window.gamificationSystem) {
        window.gamificationSystem.showNotification('✅ Preferencias guardadas correctamente');
    }
}

function copyReferralCode() {
    const referralCode = document.getElementById('referralCode');
    if (referralCode) {
        navigator.clipboard.writeText(referralCode.textContent).then(() => {
            if (window.gamificationSystem) {
                window.gamificationSystem.showNotification('📋 Código copiado al portapapeles');
            }
        });
    }
}

function shareReferralCode() {
    const referralCode = document.getElementById('referralCode')?.textContent;
    if (!referralCode) return;

    const shareText = `🎮 ¡Únete a Level-Up Gamer con mi código de referido ${referralCode} y obtén puntos de bonificación! 🎁`;
    const shareUrl = `${window.location.origin}/?ref=${referralCode}`;

    if (navigator.share) {
        navigator.share({
            title: 'Level-Up Gamer - Código de Referido',
            text: shareText,
            url: shareUrl
        });
    } else {
        // Fallback to copy to clipboard
        navigator.clipboard.writeText(`${shareText} ${shareUrl}`).then(() => {
            if (window.gamificationSystem) {
                window.gamificationSystem.showNotification('📋 Enlace de referido copiado al portapapeles');
            }
        });
    }
}

function shareOnWhatsApp() {
    const referralCode = document.getElementById('referralCode')?.textContent;
    const text = encodeURIComponent(`🎮 ¡Únete a Level-Up Gamer con mi código ${referralCode} y obtén puntos! ${window.location.origin}/?ref=${referralCode}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
}

function shareOnFacebook() {
    const shareUrl = `${window.location.origin}/?ref=${document.getElementById('referralCode')?.textContent}`;
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
}

function shareOnTwitter() {
    const referralCode = document.getElementById('referralCode')?.textContent;
    const text = encodeURIComponent(`🎮 Únete a Level-Up Gamer con mi código ${referralCode} #Gaming #LevelUpGamer`);
    const url = encodeURIComponent(`${window.location.origin}/?ref=${referralCode}`);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
}

function shareOnInstagram() {
    // Instagram doesn't support direct sharing via URL, so we copy the text
    const referralCode = document.getElementById('referralCode')?.textContent;
    const text = `🎮 ¡Únete a Level-Up Gamer con mi código ${referralCode}! 🎁 #Gaming #LevelUpGamer`;
    
    navigator.clipboard.writeText(text).then(() => {
        if (window.gamificationSystem) {
            window.gamificationSystem.showNotification('📋 Texto copiado para compartir en Instagram');
        }
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.userProfile = new UserProfileManager();
});

console.log('📄 user-profile.js cargado correctamente');
