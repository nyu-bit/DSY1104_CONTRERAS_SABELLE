// ====================================================
// SISTEMA DE CARRITO DE COMPRAS LEVEL-UP GAMER
// Sistema completo con LocalStorage, notificaciones y persistencia
// ====================================================

class ShoppingCartManager {
    constructor() {
        this.storageKey = 'levelup_gamer_cart';
        this.cart = this.loadCart();
        this.cartCount = 0;
        
        console.log('🛒 Inicializando ShoppingCartManager...');
        this.init();
    }

    init() {
        this.updateCartDisplay();
        this.setupEventListeners();
        this.updateCartCount();
        console.log('✅ ShoppingCartManager inicializado correctamente');
    }

    // Cargar carrito desde LocalStorage
    loadCart() {
        try {
            const savedCart = localStorage.getItem(this.storageKey);
            return savedCart ? JSON.parse(savedCart) : {};
        } catch (error) {
            console.error('❌ Error al cargar carrito desde LocalStorage:', error);
            return {};
        }
    }

    // Guardar carrito en LocalStorage
    saveCart() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.cart));
            console.log('💾 Carrito guardado en LocalStorage');
        } catch (error) {
            console.error('❌ Error al guardar carrito:', error);
        }
    }

    // Agregar producto al carrito
    addToCart(productId, quantity = 1) {
        console.log('🛒 Agregando al carrito:', { productId, quantity });
        
        // Verificar que el producto existe en la base de datos
        if (!window.PRODUCT_DATABASE || !window.PRODUCT_DATABASE[productId]) {
            console.error('❌ Producto no encontrado en la base de datos:', productId);
            this.showNotification('Producto no encontrado', 'error');
            return false;
        }

        const product = window.PRODUCT_DATABASE[productId];
        
        // Verificar stock disponible
        if (product.stock <= 0) {
            this.showNotification(`${product.nombre} no está disponible`, 'warning');
            return false;
        }

        // Verificar si ya existe en el carrito
        if (this.cart[productId]) {
            const newQuantity = this.cart[productId].quantity + quantity;
            
            // Verificar que no exceda el stock
            if (newQuantity > product.stock) {
                this.showNotification(`Solo quedan ${product.stock} unidades de ${product.nombre}`, 'warning');
                return false;
            }
            
            this.cart[productId].quantity = newQuantity;
            console.log(`📦 Cantidad actualizada: ${product.nombre} x${newQuantity}`);
        } else {
            // Agregar nuevo producto
            this.cart[productId] = {
                ...product,
                quantity: quantity,
                addedAt: new Date().toISOString()
            };
            console.log(`🆕 Producto agregado: ${product.nombre} x${quantity}`);
        }

        this.saveCart();
        this.updateCartDisplay();
        this.updateCartCount();
        this.showNotification(`${product.nombre} agregado al carrito`, 'success');
        
        // Efecto visual en el botón
        this.animateAddToCart(productId);
        
        return true;
    }

    // Remover producto del carrito
    removeFromCart(productId) {
        if (this.cart[productId]) {
            const productName = this.cart[productId].nombre;
            delete this.cart[productId];
            this.saveCart();
            this.updateCartDisplay();
            this.updateCartCount();
            this.showNotification(`${productName} eliminado del carrito`, 'info');
            console.log('🗑️ Producto eliminado del carrito:', productName);
            return true;
        }
        return false;
    }

    // Actualizar cantidad de un producto
    updateQuantity(productId, newQuantity) {
        if (newQuantity <= 0) {
            return this.removeFromCart(productId);
        }

        if (this.cart[productId]) {
            const product = window.PRODUCT_DATABASE[productId];
            
            if (newQuantity > product.stock) {
                this.showNotification(`Solo quedan ${product.stock} unidades`, 'warning');
                return false;
            }

            this.cart[productId].quantity = newQuantity;
            this.saveCart();
            this.updateCartDisplay();
            this.updateCartCount();
            console.log(`📝 Cantidad actualizada: ${product.nombre} x${newQuantity}`);
            return true;
        }
        return false;
    }

    // Vaciar carrito completamente
    clearCart() {
        this.cart = {};
        this.saveCart();
        this.updateCartDisplay();
        this.updateCartCount();
        this.showNotification('Carrito vaciado', 'info');
        console.log('🧹 Carrito vaciado completamente');
    }

    // Obtener total de productos
    getTotalItems() {
        return Object.values(this.cart).reduce((total, item) => total + item.quantity, 0);
    }

    // Obtener total del precio
    getTotalPrice() {
        return Object.values(this.cart).reduce((total, item) => total + (item.precio * item.quantity), 0);
    }

    // Obtener productos del carrito
    getCartItems() {
        return Object.values(this.cart);
    }

    // Actualizar contador del carrito en navbar
    updateCartCount() {
        const totalItems = this.getTotalItems();
        this.cartCount = totalItems;
        
        // Actualizar todos los elementos de contador de carrito
        const cartCounters = document.querySelectorAll('.cart-count, #cartCount, .mobile-cart-count');
        cartCounters.forEach(counter => {
            if (counter) {
                counter.textContent = totalItems;
                
                // Agregar animación si cambió
                if (totalItems > 0) {
                    counter.style.display = 'inline-block';
                    counter.classList.add('cart-updated');
                    setTimeout(() => {
                        counter.classList.remove('cart-updated');
                    }, 600);
                } else {
                    counter.style.display = totalItems > 0 ? 'inline-block' : 'none';
                }
            }
        });

        console.log(`🔢 Contador de carrito actualizado: ${totalItems} items`);
    }

    // Actualizar display completo del carrito
    updateCartDisplay() {
        this.updateCartCount();
        
        // Si hay un elemento de resumen del carrito, actualizarlo
        const cartSummary = document.getElementById('cart-summary');
        if (cartSummary) {
            const totalItems = this.getTotalItems();
            const totalPrice = this.getTotalPrice();
            
            cartSummary.innerHTML = `
                <div class="cart-summary-content">
                    <div class="cart-items-count">
                        <i class="fas fa-shopping-bag"></i>
                        ${totalItems} producto${totalItems !== 1 ? 's' : ''}
                    </div>
                    <div class="cart-total-price">
                        Total: ${this.formatPrice(totalPrice)}
                    </div>
                </div>
            `;
        }
    }

    // Setup de event listeners
    setupEventListeners() {
        // Botones "Agregar al carrito"
        document.addEventListener('click', (e) => {
            if (e.target.matches('.add-to-cart-btn') || e.target.closest('.add-to-cart-btn')) {
                e.preventDefault();
                
                const button = e.target.matches('.add-to-cart-btn') ? e.target : e.target.closest('.add-to-cart-btn');
                const productId = button.dataset.productId;
                const quantity = parseInt(button.dataset.quantity) || 1;
                
                if (productId) {
                    this.addToCart(productId, quantity);
                } else {
                    console.error('❌ No se encontró product-id en el botón');
                }
            }

            // Botón de vaciar carrito
            if (e.target.matches('.clear-cart-btn')) {
                e.preventDefault();
                if (confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
                    this.clearCart();
                }
            }

            // Botones de incrementar/decrementar cantidad
            if (e.target.matches('.cart-quantity-btn')) {
                e.preventDefault();
                const productId = e.target.dataset.productId;
                const action = e.target.dataset.action;
                const currentQuantity = this.cart[productId]?.quantity || 0;
                
                if (action === 'increase') {
                    this.updateQuantity(productId, currentQuantity + 1);
                } else if (action === 'decrease') {
                    this.updateQuantity(productId, currentQuantity - 1);
                }
            }
        });

        // Input de cantidad directa
        document.addEventListener('change', (e) => {
            if (e.target.matches('.cart-quantity-input')) {
                const productId = e.target.dataset.productId;
                const newQuantity = parseInt(e.target.value) || 0;
                this.updateQuantity(productId, newQuantity);
            }
        });

        console.log('🎯 Event listeners del carrito configurados');
    }

    // Animación visual al agregar producto
    animateAddToCart(productId) {
        const button = document.querySelector(`[data-product-id="${productId}"]`);
        if (button) {
            button.classList.add('adding-to-cart');
            button.disabled = true;
            
            const originalText = button.innerHTML;
            button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Agregando...';
            
            setTimeout(() => {
                button.innerHTML = '<i class="fas fa-check"></i> Agregado!';
                button.classList.remove('adding-to-cart');
                button.classList.add('added-to-cart');
                
                setTimeout(() => {
                    button.innerHTML = originalText;
                    button.classList.remove('added-to-cart');
                    button.disabled = false;
                }, 1500);
            }, 500);
        }
    }

    // Mostrar notificación
    showNotification(message, type = 'info') {
        // Crear elemento de notificación
        const notification = document.createElement('div');
        notification.className = `cart-notification ${type}`;
        
        const icon = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            warning: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle'
        }[type] || 'fas fa-info-circle';

        notification.innerHTML = `
            <div class="notification-content">
                <i class="${icon}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;

        // Agregar al DOM
        document.body.appendChild(notification);

        // Mostrar con animación
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);

        // Auto-remover después de 4 segundos
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.remove();
                }
            }, 300);
        }, 4000);
    }

    // Formatear precio
    formatPrice(price) {
        return new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: 'CLP',
            minimumFractionDigits: 0
        }).format(price);
    }

    // Métodos públicos para uso externo
    getCartSummary() {
        return {
            items: this.getCartItems(),
            totalItems: this.getTotalItems(),
            totalPrice: this.getTotalPrice(),
            isEmpty: Object.keys(this.cart).length === 0
        };
    }

    // Exportar carrito (para debugging o backup)
    exportCart() {
        return {
            cart: this.cart,
            summary: this.getCartSummary(),
            timestamp: new Date().toISOString()
        };
    }
}

// Estilos CSS para las notificaciones y animaciones del carrito
const cartStyles = `
/* Notificaciones del carrito */
.cart-notification {
    position: fixed;
    top: 20px;
    right: 20px;
    background: var(--color-surface);
    border: 2px solid var(--color-accent);
    border-radius: 8px;
    padding: 1rem;
    color: var(--color-text-primary);
    font-weight: 500;
    z-index: 10000;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    transform: translateX(100%);
    opacity: 0;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: var(--shadow-glow);
    max-width: 350px;
    min-width: 280px;
}

.cart-notification.show {
    transform: translateX(0);
    opacity: 1;
}

.cart-notification.success {
    border-color: var(--color-success, #2ecc71);
}

.cart-notification.error {
    border-color: var(--color-error, #e74c3c);
}

.cart-notification.warning {
    border-color: var(--color-warning, #f39c12);
}

.cart-notification.info {
    border-color: var(--color-info, #3498db);
}

.notification-content {
    display: flex;
    align-items: center;
    gap: 0.8rem;
    flex: 1;
}

.notification-close {
    background: transparent;
    border: none;
    color: var(--color-text-secondary);
    cursor: pointer;
    padding: 0.25rem;
    border-radius: 4px;
    transition: all 0.2s ease;
}

.notification-close:hover {
    background: var(--color-surface-variant);
    color: var(--color-text-primary);
}

/* Animaciones de botones del carrito */
.add-to-cart-btn {
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
}

.add-to-cart-btn.adding-to-cart {
    background: var(--color-warning, #f39c12);
    transform: scale(0.95);
}

.add-to-cart-btn.added-to-cart {
    background: var(--color-success, #2ecc71);
    transform: scale(1.05);
}

/* Contador del carrito */
.cart-count, #cartCount, .mobile-cart-count {
    background: var(--color-accent);
    color: var(--color-background);
    border-radius: 50%;
    padding: 0.25rem 0.5rem;
    font-size: 0.8rem;
    font-weight: 700;
    min-width: 1.5rem;
    height: 1.5rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin-left: 0.5rem;
    transition: all 0.3s ease;
}

.cart-count.cart-updated,
#cartCount.cart-updated,
.mobile-cart-count.cart-updated {
    animation: cartPulse 0.6s ease;
}

@keyframes cartPulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.3); }
    100% { transform: scale(1); }
}

/* Resumen del carrito */
.cart-summary-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    background: var(--color-surface-variant);
    border-radius: 8px;
    margin: 1rem 0;
}

.cart-items-count {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 600;
}

.cart-total-price {
    font-weight: 700;
    color: var(--color-accent);
    font-size: 1.1rem;
}

/* Responsive */
@media (max-width: 768px) {
    .cart-notification {
        right: 10px;
        left: 10px;
        max-width: none;
        transform: translateY(-100%);
    }
    
    .cart-notification.show {
        transform: translateY(0);
    }
}
`;

// Inyectar estilos
const styleSheet = document.createElement('style');
styleSheet.textContent = cartStyles;
document.head.appendChild(styleSheet);

// Función para inicializar el carrito cuando la página esté lista
function initializeShoppingCart() {
    console.log('🔄 Intentando inicializar ShoppingCart...');
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.shoppingCart = new ShoppingCartManager();
        });
    } else {
        window.shoppingCart = new ShoppingCartManager();
    }
}

// Inicializar
initializeShoppingCart();

// Exportar para uso global
window.ShoppingCartManager = ShoppingCartManager;

console.log('🛒 Cart.js cargado completamente');