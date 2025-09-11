// ====================================================
// LG-100: SOCIAL SHARING - Botones para compartir productos
// LG-101: SOPORTE WHATSAPP - Botón chat flotante
// ====================================================

class SocialShareManager {
    constructor() {
        this.init();
    }

    init() {
        this.createWhatsAppButton();
        this.setupShareButtons();
        console.log('✅ Sistema social inicializado');
    }

    // LG-101: Crear botón flotante de WhatsApp
    createWhatsAppButton() {
        const whatsappButton = document.createElement('div');
        whatsappButton.id = 'whatsapp-float';
        whatsappButton.className = 'whatsapp-float-btn';
        whatsappButton.innerHTML = `
            <a href="https://wa.me/56912345678?text=Hola!%20Necesito%20ayuda%20con%20productos%20gaming%20de%20Level-Up%20Gamer" 
               target="_blank" 
               rel="noopener noreferrer"
               aria-label="Chatear por WhatsApp - Soporte técnico Level-Up Gamer"
               class="whatsapp-link">
                <i class="fab fa-whatsapp" aria-hidden="true"></i>
                <span class="whatsapp-text">Chat</span>
            </a>
            <div class="whatsapp-tooltip">
                ¿Necesitas ayuda? ¡Chatea con nosotros!
            </div>
        `;

        document.body.appendChild(whatsappButton);

        // Animación de entrada
        setTimeout(() => {
            whatsappButton.classList.add('whatsapp-visible');
        }, 2000);
    }

    // LG-100: Setup de botones compartir
    setupShareButtons() {
        // Agregar botones de compartir a productos existentes
        this.addShareButtonsToProducts();
        
        // Event listener para compartir
        document.addEventListener('click', (e) => {
            if (e.target.matches('.share-btn, .share-btn *')) {
                e.preventDefault();
                const button = e.target.closest('.share-btn');
                const productId = button?.dataset.productId;
                const productName = button?.dataset.productName || 'Producto gaming';
                
                this.shareProduct(productId, productName);
            }
        });
    }

    // Agregar botones compartir a cards de productos
    addShareButtonsToProducts() {
        const productCards = document.querySelectorAll('.product-card, .offer-product-card');
        
        productCards.forEach(card => {
            if (card.querySelector('.share-btn')) return; // Ya tiene botón
            
            const productId = card.dataset.productId || 'unknown';
            const productName = card.querySelector('.product-title')?.textContent || 'Producto gaming';
            
            const shareButton = document.createElement('button');
            shareButton.className = 'share-btn';
            shareButton.dataset.productId = productId;
            shareButton.dataset.productName = productName;
            shareButton.innerHTML = `
                <i class="fas fa-share-alt" aria-hidden="true"></i>
                <span>Compartir</span>
            `;
            shareButton.setAttribute('aria-label', `Compartir ${productName}`);

            // Insertar en actions del producto
            const actions = card.querySelector('.product-actions');
            if (actions) {
                actions.appendChild(shareButton);
            }
        });
    }

    // Compartir producto usando Web Share API o fallback
    async shareProduct(productId, productName) {
        const shareData = {
            title: `${productName} - Level-Up Gamer`,
            text: `¡Mira este increíble producto gaming! ${productName}`,
            url: `${window.location.origin}/productos/detalle.html?id=${productId}`
        };

        try {
            // Intentar usar Web Share API nativa
            if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
                await navigator.share(shareData);
                this.showShareSuccess('Compartido exitosamente');
                return;
            }
        } catch (error) {
            console.log('Web Share API no disponible, usando fallback');
        }

        // Fallback: Modal con opciones de redes sociales
        this.showShareModal(shareData);
    }

    // Modal de compartir (fallback)
    showShareModal(shareData) {
        const modal = document.createElement('div');
        modal.className = 'share-modal-overlay';
        modal.innerHTML = `
            <div class="share-modal" role="dialog" aria-modal="true" aria-labelledby="share-modal-title">
                <div class="share-modal-header">
                    <h3 id="share-modal-title">Compartir Producto</h3>
                    <button class="share-modal-close" aria-label="Cerrar modal">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="share-modal-content">
                    <p class="share-modal-text">${shareData.text}</p>
                    <div class="share-buttons-grid">
                        <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareData.url)}" 
                           target="_blank" rel="noopener noreferrer" class="share-btn-social facebook">
                            <i class="fab fa-facebook-f"></i>
                            <span>Facebook</span>
                        </a>
                        <a href="https://twitter.com/intent/tweet?text=${encodeURIComponent(shareData.text)}&url=${encodeURIComponent(shareData.url)}" 
                           target="_blank" rel="noopener noreferrer" class="share-btn-social twitter">
                            <i class="fab fa-twitter"></i>
                            <span>Twitter</span>
                        </a>
                        <a href="https://wa.me/?text=${encodeURIComponent(shareData.text + ' ' + shareData.url)}" 
                           target="_blank" rel="noopener noreferrer" class="share-btn-social whatsapp">
                            <i class="fab fa-whatsapp"></i>
                            <span>WhatsApp</span>
                        </a>
                        <button class="share-btn-social copy-link" data-url="${shareData.url}">
                            <i class="fas fa-copy"></i>
                            <span>Copiar Link</span>
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        
        // Focus trap y accesibilidad
        setTimeout(() => {
            modal.classList.add('share-modal-visible');
            modal.querySelector('.share-modal-close').focus();
        }, 10);

        // Event listeners del modal
        modal.addEventListener('click', (e) => {
            if (e.target === modal || e.target.matches('.share-modal-close, .share-modal-close *')) {
                this.closeShareModal(modal);
            }
            
            if (e.target.matches('.copy-link')) {
                e.preventDefault();
                this.copyToClipboard(e.target.dataset.url);
                this.closeShareModal(modal);
            }
        });

        // Cerrar con Escape
        const escapeHandler = (e) => {
            if (e.key === 'Escape') {
                this.closeShareModal(modal);
                document.removeEventListener('keydown', escapeHandler);
            }
        };
        document.addEventListener('keydown', escapeHandler);
    }

    // Cerrar modal de compartir
    closeShareModal(modal) {
        modal.classList.add('share-modal-closing');
        setTimeout(() => {
            modal.remove();
        }, 300);
    }

    // Copiar al portapapeles
    async copyToClipboard(url) {
        try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(url);
                this.showShareSuccess('Link copiado al portapapeles');
            } else {
                // Fallback para navegadores antiguos
                const textArea = document.createElement('textarea');
                textArea.value = url;
                textArea.style.position = 'fixed';
                textArea.style.opacity = '0';
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                this.showShareSuccess('Link copiado');
            }
        } catch (error) {
            this.showShareError('Error al copiar link');
        }
    }

    // Mostrar mensaje de éxito
    showShareSuccess(message) {
        this.showShareNotification(message, 'success');
    }

    // Mostrar mensaje de error
    showShareError(message) {
        this.showShareNotification(message, 'error');
    }

    // Sistema de notificaciones para compartir
    showShareNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `share-notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
                <span>${message}</span>
            </div>
        `;

        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('notification-visible');
        }, 10);

        setTimeout(() => {
            notification.classList.add('notification-closing');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
}

// Estilos CSS para el sistema social
const socialStyles = `
/* LG-101: Botón flotante WhatsApp */
.whatsapp-float-btn {
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 1000;
    opacity: 0;
    transform: translateY(100px);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.whatsapp-float-btn.whatsapp-visible {
    opacity: 1;
    transform: translateY(0);
}

.whatsapp-link {
    display: flex;
    align-items: center;
    gap: 8px;
    background: #25D366;
    color: white;
    padding: 12px 16px;
    border-radius: 50px;
    text-decoration: none;
    box-shadow: 0 4px 12px rgba(37, 211, 102, 0.3);
    transition: all 0.3s ease;
    font-weight: 500;
}

.whatsapp-link:hover {
    background: #20ba5a;
    transform: scale(1.05);
    box-shadow: 0 6px 20px rgba(37, 211, 102, 0.4);
    color: white;
}

.whatsapp-link i {
    font-size: 20px;
}

.whatsapp-text {
    font-size: 14px;
    font-weight: 600;
}

.whatsapp-tooltip {
    position: absolute;
    bottom: 100%;
    right: 0;
    background: var(--color-surface);
    color: var(--color-text-primary);
    padding: 8px 12px;
    border-radius: 8px;
    font-size: 12px;
    white-space: nowrap;
    opacity: 0;
    pointer-events: none;
    transform: translateY(10px);
    transition: all 0.3s ease;
    border: 1px solid var(--color-secondary);
}

.whatsapp-float-btn:hover .whatsapp-tooltip {
    opacity: 1;
    transform: translateY(0);
}

/* LG-100: Botones de compartir */
.share-btn {
    background: var(--color-accent);
    border: none;
    padding: 8px 12px;
    border-radius: 6px;
    color: var(--color-text-primary);
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    transition: all 0.3s ease;
}

.share-btn:hover {
    background: var(--color-secondary);
    transform: translateY(-2px);
}

/* Modal de compartir */
.share-modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    z-index: 10000;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.3s ease;
}

.share-modal-overlay.share-modal-visible {
    opacity: 1;
}

.share-modal {
    background: var(--color-surface);
    border-radius: 12px;
    border: 2px solid var(--color-secondary);
    max-width: 400px;
    width: 90%;
    transform: scale(0.9);
    transition: transform 0.3s ease;
}

.share-modal-overlay.share-modal-visible .share-modal {
    transform: scale(1);
}

.share-modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px;
    border-bottom: 1px solid var(--color-surface-variant);
}

.share-modal-header h3 {
    color: var(--color-secondary);
    margin: 0;
    font-size: 18px;
}

.share-modal-close {
    background: none;
    border: none;
    color: var(--color-text-secondary);
    cursor: pointer;
    padding: 8px;
    border-radius: 4px;
    transition: all 0.3s ease;
}

.share-modal-close:hover {
    background: var(--color-surface-variant);
    color: var(--color-text-primary);
}

.share-modal-content {
    padding: 20px;
}

.share-modal-text {
    color: var(--color-text-secondary);
    margin-bottom: 20px;
    font-size: 14px;
    line-height: 1.5;
}

.share-buttons-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
}

.share-btn-social {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px;
    border-radius: 8px;
    text-decoration: none;
    color: var(--color-text-primary);
    background: var(--color-surface-variant);
    border: none;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 14px;
}

.share-btn-social:hover {
    transform: translateY(-2px);
    color: var(--color-text-primary);
}

.share-btn-social.facebook:hover { background: #1877F2; }
.share-btn-social.twitter:hover { background: #1DA1F2; }
.share-btn-social.whatsapp:hover { background: #25D366; }
.share-btn-social.copy-link:hover { background: var(--color-secondary); }

/* Notificaciones */
.share-notification {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 10001;
    padding: 12px 20px;
    border-radius: 8px;
    color: white;
    font-weight: 500;
    opacity: 0;
    transform: translateX(100px);
    transition: all 0.3s ease;
}

.share-notification.success {
    background: var(--color-success);
}

.share-notification.error {
    background: var(--color-error);
}

.share-notification.notification-visible {
    opacity: 1;
    transform: translateX(0);
}

.notification-content {
    display: flex;
    align-items: center;
    gap: 8px;
}

/* Responsive */
@media (max-width: 480px) {
    .whatsapp-text {
        display: none;
    }
    
    .whatsapp-link {
        width: 48px;
        height: 48px;
        padding: 12px;
        justify-content: center;
    }
    
    .share-buttons-grid {
        grid-template-columns: 1fr;
    }
}
`;

// Inyectar estilos
const styleSheet = document.createElement('style');
styleSheet.textContent = socialStyles;
document.head.appendChild(styleSheet);

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.socialShareManager = new SocialShareManager();
    });
} else {
    window.socialShareManager = new SocialShareManager();
}

// Exportar para uso global
window.SocialShareManager = SocialShareManager;
