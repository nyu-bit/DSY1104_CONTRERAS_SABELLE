/**
 * LEVEL-UP GAMER - SISTEMA DE GAMIFICACIÓN
 * Sistema completo de puntos, niveles, logros y desafíos
 * @version 1.0
 * @author Level-Up Team
 */

class GamificationSystem {
    constructor() {
        this.storageKey = 'levelup_gamification';
        this.userStorageKey = 'levelup_user';
        
        // Configuración del sistema
        this.config = {
            levels: {
                bronze: { min: 0, max: 999, name: 'Bronze Gamer', color: '#CD7F32', benefits: ['Descuento 5%', 'Envío gratis $30k+'] },
                silver: { min: 1000, max: 2999, name: 'Silver Pro', color: '#C0C0C0', benefits: ['Descuento 10%', 'Envío gratis $20k+', 'Soporte prioritario'] },
                gold: { min: 3000, max: 6999, name: 'Gold Elite', color: '#FFD700', benefits: ['Descuento 15%', 'Envío gratis siempre', 'Acceso early access'] },
                platinum: { min: 7000, max: Infinity, name: 'Platinum Legend', color: '#E5E4E2', benefits: ['Descuento 20%', 'Productos exclusivos', 'Beta testing'] }
            },
            
            actions: {
                register: { points: 100, description: 'Registro en la plataforma' },
                first_purchase: { points: 200, description: 'Primera compra' },
                purchase: { points: 1, description: 'Por cada $1000 gastado' }, // 1 punto por cada $1000
                review: { points: 50, description: 'Escribir una reseña' },
                referral: { points: 500, description: 'Referir un amigo' },
                add_to_cart: { points: 10, description: 'Agregar producto al carrito' },
                social_share: { points: 25, description: 'Compartir en redes sociales' },
                daily_visit: { points: 5, description: 'Visita diaria' },
                complete_profile: { points: 150, description: 'Completar perfil al 100%' },
                newsletter: { points: 75, description: 'Suscribirse al newsletter' }
            },
            
            achievements: [
                { id: 'first_steps', name: 'Primeros Pasos', description: 'Completar registro', points: 0, icon: '👶', unlocked: false },
                { id: 'shopper', name: 'Comprador', description: 'Realizar primera compra', points: 100, icon: '🛒', unlocked: false },
                { id: 'reviewer', name: 'Crítico', description: 'Escribir 5 reseñas', points: 250, icon: '⭐', unlocked: false },
                { id: 'social_butterfly', name: 'Social Gamer', description: 'Compartir 10 veces', points: 250, icon: '🦋', unlocked: false },
                { id: 'loyal_customer', name: 'Cliente Leal', description: 'Comprar 5 veces', points: 500, icon: '💎', unlocked: false },
                { id: 'big_spender', name: 'Gran Comprador', description: 'Gastar $500.000', points: 1000, icon: '💰', unlocked: false },
                { id: 'influencer', name: 'Influencer', description: 'Referir 3 amigos', points: 1500, icon: '📢', unlocked: false },
                { id: 'level_master', name: 'Maestro Level-Up', description: 'Alcanzar nivel Platinum', points: 2000, icon: '🏆', unlocked: false }
            ],
            
            challenges: [
                { id: 'weekly_buyer', name: 'Comprador Semanal', description: 'Compra algo esta semana', reward: 100, type: 'weekly', progress: 0, target: 1, active: true },
                { id: 'review_master', name: 'Maestro de Reseñas', description: 'Escribe 3 reseñas este mes', reward: 200, type: 'monthly', progress: 0, target: 3, active: true },
                { id: 'social_warrior', name: 'Guerrero Social', description: 'Comparte 5 productos', reward: 150, type: 'continuous', progress: 0, target: 5, active: true },
                { id: 'cart_collector', name: 'Coleccionista', description: 'Agrega 10 productos al carrito', reward: 75, type: 'continuous', progress: 0, target: 10, active: true }
            ]
        };
        
        this.init();
    }

    init() {
        this.loadUserData();
        this.checkDailyVisit();
        this.updateUI();
        this.setupEventListeners();
    }

    // Cargar datos del usuario
    loadUserData() {
        try {
            const savedData = localStorage.getItem(this.storageKey);
            if (savedData) {
                this.userData = { ...this.getDefaultUserData(), ...JSON.parse(savedData) };
            } else {
                this.userData = this.getDefaultUserData();
                this.saveUserData();
            }
        } catch (error) {
            console.error('Error cargando datos de gamificación:', error);
            this.userData = this.getDefaultUserData();
        }
    }

    getDefaultUserData() {
        return {
            points: 0,
            totalPoints: 0,
            level: 'bronze',
            achievements: this.config.achievements.map(a => ({ ...a })),
            challenges: this.config.challenges.map(c => ({ ...c })),
            purchases: [],
            reviews: [],
            referrals: [],
            lastVisit: null,
            profileCompletion: 0,
            statistics: {
                totalPurchases: 0,
                totalSpent: 0,
                reviewsWritten: 0,
                socialShares: 0,
                referralsSent: 0,
                cartAdditions: 0
            }
        };
    }

    saveUserData() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.userData));
        } catch (error) {
            console.error('Error guardando datos de gamificación:', error);
        }
    }

    // Agregar puntos por acción
    addPoints(action, customAmount = null) {
        const actionConfig = this.config.actions[action];
        if (!actionConfig) {
            console.warn(`Acción de gamificación no encontrada: ${action}`);
            return;
        }

        let pointsToAdd = customAmount || actionConfig.points;
        
        // Lógica especial para compras (1 punto por cada $1000)
        if (action === 'purchase' && customAmount) {
            pointsToAdd = Math.floor(customAmount / 1000);
        }

        const oldLevel = this.userData.level;
        this.userData.points += pointsToAdd;
        this.userData.totalPoints += pointsToAdd;

        // Actualizar estadísticas
        this.updateStatistics(action, customAmount);

        // Verificar cambio de nivel
        const newLevel = this.calculateLevel();
        if (newLevel !== oldLevel) {
            this.userData.level = newLevel;
            this.onLevelUp(oldLevel, newLevel);
        }

        // Verificar logros
        this.checkAchievements();

        // Actualizar desafíos
        this.updateChallenges(action);

        this.saveUserData();
        this.updateUI();

        // Mostrar notificación
        this.showPointsNotification(pointsToAdd, actionConfig.description);

        return pointsToAdd;
    }

    updateStatistics(action, amount = 1) {
        switch (action) {
            case 'purchase':
                this.userData.statistics.totalPurchases++;
                if (amount) this.userData.statistics.totalSpent += amount;
                break;
            case 'review':
                this.userData.statistics.reviewsWritten++;
                break;
            case 'social_share':
                this.userData.statistics.socialShares++;
                break;
            case 'referral':
                this.userData.statistics.referralsSent++;
                break;
            case 'add_to_cart':
                this.userData.statistics.cartAdditions++;
                break;
        }
    }

    calculateLevel() {
        const points = this.userData.points;
        for (const [levelKey, levelConfig] of Object.entries(this.config.levels)) {
            if (points >= levelConfig.min && points <= levelConfig.max) {
                return levelKey;
            }
        }
        return 'bronze';
    }

    onLevelUp(oldLevel, newLevel) {
        const newLevelConfig = this.config.levels[newLevel];
        
        // Mostrar notificación de level up
        this.showLevelUpNotification(oldLevel, newLevel);
        
        // Dar puntos bonus por level up
        const bonusPoints = this.getLevelUpBonus(newLevel);
        if (bonusPoints > 0) {
            this.userData.points += bonusPoints;
            this.userData.totalPoints += bonusPoints;
        }

        // Desbloquear logro si llega a Platinum
        if (newLevel === 'platinum') {
            this.unlockAchievement('level_master');
        }
    }

    getLevelUpBonus(level) {
        const bonuses = {
            silver: 200,
            gold: 500,
            platinum: 1000
        };
        return bonuses[level] || 0;
    }

    // Sistema de logros
    checkAchievements() {
        this.userData.achievements.forEach(achievement => {
            if (!achievement.unlocked) {
                if (this.checkAchievementCondition(achievement.id)) {
                    this.unlockAchievement(achievement.id);
                }
            }
        });
    }

    checkAchievementCondition(achievementId) {
        const stats = this.userData.statistics;
        
        switch (achievementId) {
            case 'first_steps':
                return true; // Se desbloquea al registrarse
            case 'shopper':
                return stats.totalPurchases >= 1;
            case 'reviewer':
                return stats.reviewsWritten >= 5;
            case 'social_butterfly':
                return stats.socialShares >= 10;
            case 'loyal_customer':
                return stats.totalPurchases >= 5;
            case 'big_spender':
                return stats.totalSpent >= 500000;
            case 'influencer':
                return stats.referralsSent >= 3;
            case 'level_master':
                return this.userData.level === 'platinum';
            default:
                return false;
        }
    }

    unlockAchievement(achievementId) {
        const achievement = this.userData.achievements.find(a => a.id === achievementId);
        if (achievement && !achievement.unlocked) {
            achievement.unlocked = true;
            
            // Dar puntos del logro
            if (achievement.points > 0) {
                this.userData.points += achievement.points;
                this.userData.totalPoints += achievement.points;
            }

            this.showAchievementNotification(achievement);
            this.saveUserData();
        }
    }

    // Sistema de desafíos
    updateChallenges(action) {
        this.userData.challenges.forEach(challenge => {
            if (challenge.active && this.challengeAppliesToAction(challenge, action)) {
                challenge.progress++;
                
                if (challenge.progress >= challenge.target) {
                    this.completeChallenge(challenge.id);
                }
            }
        });
    }

    challengeAppliesToAction(challenge, action) {
        const actionMap = {
            weekly_buyer: 'purchase',
            review_master: 'review',
            social_warrior: 'social_share',
            cart_collector: 'add_to_cart'
        };
        
        return actionMap[challenge.id] === action;
    }

    completeChallenge(challengeId) {
        const challenge = this.userData.challenges.find(c => c.id === challengeId);
        if (challenge && challenge.active) {
            challenge.active = false;
            
            // Dar recompensa
            this.userData.points += challenge.reward;
            this.userData.totalPoints += challenge.reward;
            
            this.showChallengeCompleteNotification(challenge);
            
            // Reactivar desafío si es continuo
            if (challenge.type === 'continuous') {
                setTimeout(() => {
                    challenge.progress = 0;
                    challenge.active = true;
                }, 1000);
            }
        }
    }

    // Verificar visita diaria
    checkDailyVisit() {
        const today = new Date().toDateString();
        const lastVisit = this.userData.lastVisit;
        
        if (lastVisit !== today) {
            this.addPoints('daily_visit');
            this.userData.lastVisit = today;
            this.saveUserData();
        }
    }

    // UI y Notificaciones
    updateUI() {
        this.updateNavbarLevel();
        this.updateProfileProgress();
        this.updateLevelProgress();
    }

    updateNavbarLevel() {
        const levelIndicator = document.querySelector('.user-level-indicator');
        if (levelIndicator) {
            const levelConfig = this.config.levels[this.userData.level];
            levelIndicator.innerHTML = `
                <span class="level-badge" style="background: ${levelConfig.color}">
                    ${levelConfig.name}
                </span>
                <span class="points-count">${this.userData.points}pts</span>
            `;
        }
    }

    updateProfileProgress() {
        const progressBar = document.querySelector('.level-progress-bar');
        if (progressBar) {
            const currentLevel = this.config.levels[this.userData.level];
            const progress = this.calculateLevelProgress();
            
            progressBar.style.width = `${progress}%`;
            progressBar.style.background = currentLevel.color;
        }
    }

    calculateLevelProgress() {
        const currentLevel = this.config.levels[this.userData.level];
        const points = this.userData.points;
        
        if (currentLevel.max === Infinity) return 100;
        
        const levelRange = currentLevel.max - currentLevel.min + 1;
        const pointsInLevel = points - currentLevel.min;
        
        return Math.min(100, (pointsInLevel / levelRange) * 100);
    }

    updateLevelProgress() {
        const levelInfo = document.querySelector('.level-info');
        if (levelInfo) {
            const currentLevel = this.config.levels[this.userData.level];
            const nextLevel = this.getNextLevel();
            const progress = this.calculateLevelProgress();
            
            levelInfo.innerHTML = `
                <div class="current-level">
                    <h3 style="color: ${currentLevel.color}">${currentLevel.name}</h3>
                    <p>${this.userData.points} puntos</p>
                </div>
                <div class="progress-container">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${progress}%; background: ${currentLevel.color}"></div>
                    </div>
                    <p class="progress-text">
                        ${nextLevel ? `${nextLevel.min - this.userData.points} puntos para ${nextLevel.name}` : 'Nivel máximo alcanzado'}
                    </p>
                </div>
            `;
        }
    }

    getNextLevel() {
        const levels = Object.entries(this.config.levels);
        const currentLevelIndex = levels.findIndex(([key]) => key === this.userData.level);
        
        if (currentLevelIndex < levels.length - 1) {
            const [nextLevelKey, nextLevelConfig] = levels[currentLevelIndex + 1];
            return { key: nextLevelKey, ...nextLevelConfig };
        }
        
        return null;
    }

    // Notificaciones
    showPointsNotification(points, action) {
        this.showNotification(`+${points} puntos por ${action}`, 'success', '🎮');
    }

    showLevelUpNotification(oldLevel, newLevel) {
        const newLevelConfig = this.config.levels[newLevel];
        this.showNotification(
            `¡LEVEL UP! Ahora eres ${newLevelConfig.name}`, 
            'level-up', 
            '🎉'
        );
    }

    showAchievementNotification(achievement) {
        this.showNotification(
            `¡Logro desbloqueado! ${achievement.icon} ${achievement.name}`, 
            'achievement', 
            '🏆'
        );
    }

    showChallengeCompleteNotification(challenge) {
        this.showNotification(
            `¡Desafío completado! +${challenge.reward} puntos`, 
            'challenge', 
            '⭐'
        );
    }

    showNotification(message, type = 'info', icon = '🎮') {
        // Usar sistema de notificaciones global si está disponible
        if (window.showNotification) {
            window.showNotification(message, type);
            return;
        }

        // Crear notificación propia
        const notification = document.createElement('div');
        notification.className = `gamification-notification ${type}`;
        notification.innerHTML = `
            <span class="notification-icon">${icon}</span>
            <span class="notification-message">${message}</span>
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Event Listeners
    setupEventListeners() {
        // Escuchar eventos del carrito
        document.addEventListener('productAddedToCart', () => {
            this.addPoints('add_to_cart');
        });

        // Escuchar eventos de compra
        document.addEventListener('purchaseCompleted', (event) => {
            const amount = event.detail?.total || 0;
            this.addPoints('purchase', amount);
            
            if (this.userData.statistics.totalPurchases === 0) {
                this.addPoints('first_purchase');
            }
        });

        // Escuchar eventos de reseñas
        document.addEventListener('reviewSubmitted', () => {
            this.addPoints('review');
        });

        // Escuchar eventos de compartir
        document.addEventListener('socialShare', () => {
            this.addPoints('social_share');
        });
    }

    // API Pública
    getCurrentLevel() {
        return this.userData.level;
    }

    getCurrentLevelInfo() {
        return this.config.levels[this.userData.level];
    }

    getPoints() {
        return this.userData.points;
    }

    getTotalPoints() {
        return this.userData.totalPoints;
    }

    getAchievements() {
        return this.userData.achievements;
    }

    getActiveChallenges() {
        return this.userData.challenges.filter(c => c.active);
    }

    getStatistics() {
        return this.userData.statistics;
    }

    // Modal de canje (informativo)
    showRedemptionModal() {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal gamification-modal">
                <div class="modal-header">
                    <h2>🎁 Canje de Puntos</h2>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="current-points">
                        <h3>Tus Puntos: <span class="highlight">${this.userData.points}</span></h3>
                    </div>
                    
                    <div class="redemption-items">
                        <div class="redemption-item ${this.userData.points >= 500 ? '' : 'locked'}">
                            <div class="item-icon">🎮</div>
                            <div class="item-info">
                                <h4>Descuento 10%</h4>
                                <p>Válido por 30 días</p>
                            </div>
                            <div class="item-cost">500 pts</div>
                        </div>
                        
                        <div class="redemption-item ${this.userData.points >= 1000 ? '' : 'locked'}">
                            <div class="item-icon">🚚</div>
                            <div class="item-info">
                                <h4>Envío Gratis</h4>
                                <p>En tu próxima compra</p>
                            </div>
                            <div class="item-cost">1000 pts</div>
                        </div>
                        
                        <div class="redemption-item ${this.userData.points >= 2000 ? '' : 'locked'}">
                            <div class="item-icon">🎁</div>
                            <div class="item-info">
                                <h4>Mystery Box</h4>
                                <p>Accesorios gaming sorpresa</p>
                            </div>
                            <div class="item-cost">2000 pts</div>
                        </div>
                        
                        <div class="redemption-item ${this.userData.points >= 5000 ? '' : 'locked'}">
                            <div class="item-icon">🏆</div>
                            <div class="item-info">
                                <h4>Producto Exclusivo</h4>
                                <p>Edición limitada Level-Up</p>
                            </div>
                            <div class="item-cost">5000 pts</div>
                        </div>
                    </div>
                    
                    <div class="modal-note">
                        <p><i class="fas fa-info-circle"></i> Sistema de canje próximamente disponible</p>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Event listeners del modal
        modal.querySelector('.modal-close').addEventListener('click', () => {
            modal.remove();
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }
}

// Inicializar sistema de gamificación
document.addEventListener('DOMContentLoaded', () => {
    window.gamificationSystem = new GamificationSystem();
    
    // Dar puntos de bienvenida si es usuario nuevo
    const user = JSON.parse(localStorage.getItem('levelup_user') || 'null');
    const hasWelcomePoints = localStorage.getItem('levelup_welcome_points');
    
    if (user && !hasWelcomePoints) {
        setTimeout(() => {
            window.gamificationSystem.addPoints('register');
            window.gamificationSystem.unlockAchievement('first_steps');
            localStorage.setItem('levelup_welcome_points', 'true');
        }, 1000);
    }
});

// Exponer API global
window.GamificationSystem = GamificationSystem;
