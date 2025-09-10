// ================================
// LEVEL-UP GAMER - SISTEMA DE GAMIFICACIÓN
// Puntos LevelUp, Niveles y Programa de Referidos
// ================================

// Configuración del sistema de niveles
const LEVEL_SYSTEM = {
    levels: [
        { level: 1, name: 'Noob', minPoints: 0, maxPoints: 99, benefits: ['Descuento 5%'], color: '#888888' },
        { level: 2, name: 'Casual Gamer', minPoints: 100, maxPoints: 249, benefits: ['Descuento 8%', 'Envío gratis +$30.000'], color: '#39FF14' },
        { level: 3, name: 'Pro Gamer', minPoints: 250, maxPoints: 499, benefits: ['Descuento 12%', 'Envío gratis +$25.000', 'Acceso anticipado'], color: '#1E90FF' },
        { level: 4, name: 'Elite Gamer', minPoints: 500, maxPoints: 999, benefits: ['Descuento 15%', 'Envío gratis +$20.000', 'Productos exclusivos'], color: '#FF6B35' },
        { level: 5, name: 'Legend', minPoints: 1000, maxPoints: 1999, benefits: ['Descuento 20%', 'Envío siempre gratis', 'Soporte prioritario'], color: '#FFD700' },
        { level: 6, name: 'Master Gamer', minPoints: 2000, maxPoints: 4999, benefits: ['Descuento 25%', 'Productos únicos', 'Eventos exclusivos'], color: '#FF1493' },
        { level: 7, name: 'Gaming God', minPoints: 5000, maxPoints: Infinity, benefits: ['Descuento 30%', 'Todo gratis', 'Beta tester oficial'], color: '#8A2BE2' }
    ],
    
    pointsActions: {
        register: 50,
        purchase: 1, // 1 punto por cada $1000 gastados
        review: 25,
        referral: 100,
        social_share: 10,
        birthday: 100,
        event_participation: 75
    }
};

// Estado del usuario con gamificación
let gamificationState = {
    currentUser: null,
    userPoints: 0,
    userLevel: 1,
    referralCode: null,
    referredUsers: [],
    achievements: [],
    pointsHistory: []
};

// ================================
// INICIALIZACIÓN
// ================================

document.addEventListener('DOMContentLoaded', function() {
    initializeGamification();
});

function initializeGamification() {
    loadUserGamificationData();
    updateGamificationUI();
    generateReferralCode();
}

function loadUserGamificationData() {
    const savedData = localStorage.getItem('levelup_gamification');
    if (savedData) {
        gamificationState = { ...gamificationState, ...JSON.parse(savedData) };
    }
    
    // Cargar datos del usuario actual
    const currentUser = window.authManager?.getCurrentUser();
    if (currentUser) {
        gamificationState.currentUser = currentUser;
        // Si es estudiante Duoc, dar puntos bonus
        if (currentUser.email.includes('@duocuc.cl')) {
            addPoints(100, 'Bonus estudiante Duoc UC');
        }
    }
}

function saveGamificationData() {
    localStorage.setItem('levelup_gamification', JSON.stringify(gamificationState));
}

// ================================
// GESTIÓN DE PUNTOS
// ================================

function addPoints(points, reason = '') {
    gamificationState.userPoints += points;
    
    // Registrar en historial
    const pointEntry = {
        points: points,
        reason: reason,
        date: new Date().toISOString(),
        type: 'earn'
    };
    gamificationState.pointsHistory.push(pointEntry);
    
    // Verificar si subió de nivel
    const newLevel = calculateUserLevel(gamificationState.userPoints);
    if (newLevel > gamificationState.userLevel) {
        levelUp(newLevel);
    }
    
    gamificationState.userLevel = newLevel;
    saveGamificationData();
    updateGamificationUI();
    
    // Mostrar notificación
    if (window.levelUpGamer?.showNotification) {
        window.levelUpGamer.showNotification(
            `¡+${points} puntos LevelUp! ${reason}`, 
            'success'
        );
    }
}

function subtractPoints(points, reason = '') {
    const previousPoints = gamificationState.userPoints;
    gamificationState.userPoints = Math.max(0, gamificationState.userPoints - points);
    
    // Registrar en historial
    const pointEntry = {
        points: -points,
        reason: reason,
        date: new Date().toISOString(),
        type: 'spend'
    };
    gamificationState.pointsHistory.push(pointEntry);
    
    // Verificar si bajó de nivel
    const newLevel = calculateUserLevel(gamificationState.userPoints);
    gamificationState.userLevel = newLevel;
    
    saveGamificationData();
    updateGamificationUI();
    
    return previousPoints - gamificationState.userPoints;
}

function calculateUserLevel(points) {
    for (let i = LEVEL_SYSTEM.levels.length - 1; i >= 0; i--) {
        const level = LEVEL_SYSTEM.levels[i];
        if (points >= level.minPoints) {
            return level.level;
        }
    }
    return 1;
}

function getCurrentLevelInfo() {
    const levelIndex = gamificationState.userLevel - 1;
    return LEVEL_SYSTEM.levels[levelIndex] || LEVEL_SYSTEM.levels[0];
}

function getNextLevelInfo() {
    const nextLevelIndex = gamificationState.userLevel;
    return LEVEL_SYSTEM.levels[nextLevelIndex] || null;
}

function levelUp(newLevel) {
    const levelInfo = LEVEL_SYSTEM.levels[newLevel - 1];
    
    // Mostrar modal de level up
    showLevelUpModal(levelInfo);
    
    // Agregar achievement
    addAchievement({
        id: `level_${newLevel}`,
        name: `Nivel ${newLevel}: ${levelInfo.name}`,
        description: `Has alcanzado el nivel ${levelInfo.name}`,
        icon: '🏆',
        date: new Date().toISOString()
    });
}

// ================================
// SISTEMA DE REFERIDOS
// ================================

function generateReferralCode() {
    if (!gamificationState.referralCode) {
        const user = gamificationState.currentUser;
        if (user) {
            const baseCode = user.name.replace(/\s+/g, '').substring(0, 5).toUpperCase();
            const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
            gamificationState.referralCode = `${baseCode}${randomNum}`;
            saveGamificationData();
        }
    }
    return gamificationState.referralCode;
}

function validateReferralCode(code) {
    // En un sistema real, esto verificaría en la base de datos
    // Por ahora simulamos códigos válidos
    const validCodes = ['ADMIN123', 'GAMER456', 'ELITE789', 'PRO999'];
    return validCodes.includes(code.toUpperCase()) || code.length === 8;
}

function useReferralCode(code) {
    if (!validateReferralCode(code)) {
        throw new Error('Código de referido inválido');
    }
    
    // Agregar puntos al usuario actual
    addPoints(LEVEL_SYSTEM.pointsActions.referral, `Código de referido: ${code}`);
    
    // Simular agregar puntos al referidor (en sistema real)
    if (window.levelUpGamer?.showNotification) {
        window.levelUpGamer.showNotification(
            `¡Código de referido aplicado! +${LEVEL_SYSTEM.pointsActions.referral} puntos LevelUp`,
            'success'
        );
    }
    
    return true;
}

function shareReferralCode() {
    const code = generateReferralCode();
    const message = `¡Únete a Level-Up Gamer con mi código de referido ${code} y obtén puntos LevelUp gratis! 🎮`;
    
    if (navigator.share) {
        navigator.share({
            title: 'Level-Up Gamer - Código de Referido',
            text: message,
            url: window.location.origin
        });
    } else {
        // Fallback: copiar al portapapeles
        navigator.clipboard.writeText(message).then(() => {
            if (window.levelUpGamer?.showNotification) {
                window.levelUpGamer.showNotification('Código copiado al portapapeles', 'success');
            }
        });
    }
}

// ================================
// SISTEMA DE ACHIEVEMENTS
// ================================

function addAchievement(achievement) {
    // Verificar si ya tiene este achievement
    const existingAchievement = gamificationState.achievements.find(a => a.id === achievement.id);
    if (existingAchievement) return;
    
    gamificationState.achievements.push(achievement);
    saveGamificationData();
    
    // Mostrar notificación de achievement
    showAchievementNotification(achievement);
}

function showAchievementNotification(achievement) {
    if (window.levelUpGamer?.showNotification) {
        window.levelUpGamer.showNotification(
            `🏆 ¡Achievement desbloqueado! ${achievement.name}`,
            'success'
        );
    }
}

// ================================
// EVENTOS DE GAMIFICACIÓN
// ================================

function onPurchaseComplete(totalAmount) {
    const pointsEarned = Math.floor(totalAmount / 1000) * LEVEL_SYSTEM.pointsActions.purchase;
    addPoints(pointsEarned, `Compra realizada ($${totalAmount.toLocaleString()})`);
    
    // Achievement por primera compra
    if (gamificationState.pointsHistory.filter(p => p.reason.includes('Compra')).length === 1) {
        addAchievement({
            id: 'first_purchase',
            name: 'Primera Compra',
            description: 'Has realizado tu primera compra en Level-Up Gamer',
            icon: '🛒',
            date: new Date().toISOString()
        });
    }
}

function onReviewSubmitted() {
    addPoints(LEVEL_SYSTEM.pointsActions.review, 'Reseña de producto');
    
    // Achievement por primera reseña
    const reviewCount = gamificationState.pointsHistory.filter(p => p.reason.includes('Reseña')).length;
    if (reviewCount === 1) {
        addAchievement({
            id: 'first_review',
            name: 'Crítico Gamer',
            description: 'Has escrito tu primera reseña',
            icon: '📝',
            date: new Date().toISOString()
        });
    }
}

function onSocialShare() {
    addPoints(LEVEL_SYSTEM.pointsActions.social_share, 'Compartir en redes sociales');
}

function onEventParticipation(eventName) {
    addPoints(LEVEL_SYSTEM.pointsActions.event_participation, `Participación en evento: ${eventName}`);
}

// ================================
// UI UPDATES
// ================================

function updateGamificationUI() {
    updatePointsDisplay();
    updateLevelDisplay();
    updateProgressBar();
    updateBenefitsDisplay();
}

function updatePointsDisplay() {
    const pointsElements = document.querySelectorAll('.user-points');
    pointsElements.forEach(el => {
        el.textContent = gamificationState.userPoints.toLocaleString();
    });
}

function updateLevelDisplay() {
    const levelInfo = getCurrentLevelInfo();
    
    const levelElements = document.querySelectorAll('.user-level');
    levelElements.forEach(el => {
        el.textContent = `Nivel ${levelInfo.level}: ${levelInfo.name}`;
        el.style.color = levelInfo.color;
    });
}

function updateProgressBar() {
    const currentLevel = getCurrentLevelInfo();
    const nextLevel = getNextLevelInfo();
    
    if (!nextLevel) return; // Usuario en nivel máximo
    
    const currentPoints = gamificationState.userPoints - currentLevel.minPoints;
    const pointsNeeded = nextLevel.minPoints - currentLevel.minPoints;
    const progress = (currentPoints / pointsNeeded) * 100;
    
    const progressBars = document.querySelectorAll('.level-progress-bar');
    progressBars.forEach(bar => {
        bar.style.width = `${Math.min(progress, 100)}%`;
    });
    
    const progressTexts = document.querySelectorAll('.progress-text');
    progressTexts.forEach(text => {
        text.textContent = `${currentPoints}/${pointsNeeded} puntos para próximo nivel`;
    });
}

function updateBenefitsDisplay() {
    const levelInfo = getCurrentLevelInfo();
    const benefitsElements = document.querySelectorAll('.user-benefits');
    
    benefitsElements.forEach(el => {
        el.innerHTML = levelInfo.benefits.map(benefit => 
            `<span class="benefit-tag">${benefit}</span>`
        ).join('');
    });
}

// ================================
// MODALES
// ================================

function showLevelUpModal(levelInfo) {
    const modal = document.createElement('div');
    modal.className = 'modal level-up-modal';
    modal.innerHTML = `
        <div class="modal-content level-up-content">
            <div class="level-up-header">
                <div class="level-up-icon">🎉</div>
                <h2>¡LEVEL UP!</h2>
                <div class="level-up-badge" style="background: ${levelInfo.color}">
                    Nivel ${levelInfo.level}
                </div>
                <h3>${levelInfo.name}</h3>
            </div>
            <div class="level-up-benefits">
                <h4>Nuevos Beneficios Desbloqueados:</h4>
                <ul>
                    ${levelInfo.benefits.map(benefit => `<li>✨ ${benefit}</li>`).join('')}
                </ul>
            </div>
            <button class="cta-button" onclick="closeLevelUpModal()">¡Continuar Gaming!</button>
        </div>
    `;
    
    document.body.appendChild(modal);
    modal.style.display = 'flex';
    
    // Auto-cerrar después de 8 segundos
    setTimeout(() => closeLevelUpModal(), 8000);
}

function closeLevelUpModal() {
    const modal = document.querySelector('.level-up-modal');
    if (modal) {
        modal.remove();
    }
}

function showPointsHistoryModal() {
    const modal = document.createElement('div');
    modal.className = 'modal points-history-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>📊 Historial de Puntos LevelUp</h3>
                <button class="modal-close" onclick="closePointsHistoryModal()">&times;</button>
            </div>
            <div class="modal-body">
                <div class="points-summary">
                    <div class="points-total">
                        <span class="points-number">${gamificationState.userPoints}</span>
                        <span class="points-label">Puntos Totales</span>
                    </div>
                </div>
                <div class="points-history">
                    ${gamificationState.pointsHistory.slice(-20).reverse().map(entry => `
                        <div class="points-entry ${entry.type}">
                            <div class="points-info">
                                <span class="points-reason">${entry.reason}</span>
                                <span class="points-date">${new Date(entry.date).toLocaleDateString()}</span>
                            </div>
                            <span class="points-amount ${entry.type}">
                                ${entry.points > 0 ? '+' : ''}${entry.points}
                            </span>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    modal.style.display = 'flex';
}

function closePointsHistoryModal() {
    const modal = document.querySelector('.points-history-modal');
    if (modal) {
        modal.remove();
    }
}

// ================================
// EXPORTAR FUNCIONES
// ================================

window.gamificationSystem = {
    addPoints,
    subtractPoints,
    getCurrentLevelInfo,
    getNextLevelInfo,
    generateReferralCode,
    useReferralCode,
    shareReferralCode,
    onPurchaseComplete,
    onReviewSubmitted,
    onSocialShare,
    onEventParticipation,
    showPointsHistoryModal,
    updateGamificationUI,
    getUserPoints: () => gamificationState.userPoints,
    getUserLevel: () => gamificationState.userLevel
};
