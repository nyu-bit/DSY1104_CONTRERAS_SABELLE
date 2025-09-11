class ShoppingCartManager {
    constructor() {
        this.cart = {};
        this.storageKey = 'levelup_gamer_cart';
        console.log('🛒 ShoppingCartManager inicializado');
        this.init();
    }
    
    init() {
        this.loadCart();
        this.updateCartCount();
        this.injectCSS();
    }
    
    loadCart() {
        try {
            const savedCart = localStorage.getItem(this.storageKey);
            if (savedCart) {
                this.cart = JSON.parse(savedCart);
                console.log('✅ Carrito cargado:', Object.keys(this.cart).length, 'productos');
            }
        } catch (error) {
            console.error('❌ Error al cargar carrito:', error);
            this.cart = {};
        }
    }
    
    saveCart() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.cart));
            console.log('💾 Carrito guardado');
        } catch (error) {
            console.error('❌ Error al guardar carrito:', error);
        }
    }
    
    addToCart(productId, quantity = 1) {
        console.log('🛒 Agregando:', productId, 'cantidad:', quantity);
        
        if (!window.PRODUCT_DATABASE) {
            console.error('❌ Base de datos no disponible');
            this.showNotification('Error: Base de datos no disponible', 'error');
            return false;
        }
        
        if (!window.PRODUCT_DATABASE[productId]) {
            console.error('❌ Producto no encontrado:', productId);
            this.showNotification('Producto no encontrado', 'error');
            return false;
        }

        const product = window.PRODUCT_DATABASE[productId];
        
        if (product.stock <= 0) {
            this.showNotification(product.nombre + ' no disponible', 'warning');
            return false;
        }

        if (this.cart[productId]) {
            this.cart[productId].quantity += quantity;
        } else {
            this.cart[productId] = Object.assign({}, product, {quantity: quantity});
        }

        this.saveCart();
        this.updateCartCount();
        this.showNotification(product.nombre + ' agregado al carrito', 'success');
        
        return true;
    }

    updateQuantity(productId, newQuantity) {
        if (!this.cart[productId]) {
            console.error('❌ Producto no encontrado en el carrito:', productId);
            return false;
        }
        
        if (newQuantity <= 0) {
            this.removeFromCart(productId);
            return true;
        }
        
        // Verificar stock disponible
        const product = window.PRODUCT_DATABASE[productId];
        if (product && newQuantity > product.stock) {
            this.showNotification('Stock insuficiente para ' + product.nombre, 'warning');
            return false;
        }
        
        this.cart[productId].quantity = newQuantity;
        this.saveCart();
        this.updateCartCount();
        console.log('📦 Cantidad actualizada:', productId, 'nueva cantidad:', newQuantity);
        
        return true;
    }

    removeFromCart(productId) {
        if (this.cart[productId]) {
            const productName = this.cart[productId].nombre;
            delete this.cart[productId];
            this.saveCart();
            this.updateCartCount();
            this.showNotification(productName + ' eliminado del carrito', 'info');
            console.log('🗑️ Producto eliminado:', productId);
        }
    }

    clearCart() {
        const itemCount = Object.keys(this.cart).length;
        this.cart = {};
        this.saveCart();
        this.updateCartCount();
        this.showNotification('Carrito vaciado (' + itemCount + ' productos eliminados)', 'info');
        console.log('🧹 Carrito vaciado');
    }

    updateCartCount() {
        const totalItems = Object.values(this.cart).reduce((sum, item) => sum + item.quantity, 0);
        const cartCountElements = document.querySelectorAll('.cart-count');
        
        cartCountElements.forEach(element => {
            element.textContent = totalItems;
            element.style.display = totalItems > 0 ? 'inline' : 'none';
        });
    }

    getCartSummary() {
        const items = Object.values(this.cart);
        const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
        const totalPrice = items.reduce((sum, item) => sum + (item.precio * item.quantity), 0);
        
        return { items: items, totalItems: totalItems, totalPrice: totalPrice };
    }

    showNotification(message, type) {
        type = type || 'info';
        const existing = document.querySelector('.cart-notification');
        if (existing) existing.remove();

        const notification = document.createElement('div');
        notification.className = 'cart-notification ' + type;
        notification.innerHTML = '<span>' + message + '</span>';

        document.body.appendChild(notification);

        setTimeout(function() { notification.classList.add('show'); }, 100);
        setTimeout(function() {
            notification.classList.remove('show');
            setTimeout(function() { notification.remove(); }, 300);
        }, 3000);
    }

    injectCSS() {
        const styleId = 'shopping-cart-styles';
        if (document.getElementById(styleId)) return;

        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = '.cart-notification { position: fixed; top: 100px; right: 20px; z-index: 10000; background: #1a1a1a; color: white; padding: 1rem; border-radius: 8px; transform: translateX(120%); transition: all 0.3s ease; } .cart-notification.show { transform: translateX(0); } .cart-notification.success { border-left: 4px solid #00ff88; } .cart-notification.error { border-left: 4px solid #ff4444; } .cart-notification.warning { border-left: 4px solid #ffaa00; } .cart-count { background: #00ff88; color: #000; border-radius: 50%; padding: 0.25rem 0.5rem; font-size: 0.75rem; font-weight: bold; display: none; }';
        document.head.appendChild(style);
    }
}

function initializeShoppingCart() {
    console.log('🔄 Inicializando ShoppingCart...');
    
    if (!window.shoppingCart) {
        window.shoppingCart = new ShoppingCartManager();
        console.log('✅ ShoppingCartManager inicializado');
        window.dispatchEvent(new Event('shoppingCartReady'));
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeShoppingCart);
} else {
    initializeShoppingCart();
}

window.ShoppingCartManager = ShoppingCartManager;
console.log('🛒 Cart.js cargado completamente');
