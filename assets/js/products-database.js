// ================================
// LEVEL-UP GAMER - BASE DE DATOS DE PRODUCTOS
// Productos oficiales según especificaciones del proyecto
// ================================

const PRODUCT_DATABASE = {
    // JUEGOS DE MESA
    'JM001': {
        id: 'JM001',
        code: 'JM001',
        name: 'Catan',
        category: 'juegos-mesa',
        categoryName: 'Juegos de Mesa',
        price: 29990,
        originalPrice: 29990,
        currency: 'CLP',
        image: 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=400&h=400&fit=crop&crop=center',
        description: 'Un clásico juego de estrategia donde los jugadores compiten por colonizar y expandirse en la isla de Catan. Ideal para 3-4 jugadores y perfecto para noches de juego en familia o con amigos.',
        features: [
            '3-4 jugadores',
            'Tiempo: 60-90 minutos',
            'Edad: 10+ años',
            'Estrategia y negociación',
            'Expansiones disponibles'
        ],
        stock: 15,
        rating: 4.8,
        reviews: 124,
        manufacturer: 'Kosmos',
        origin: 'Alemania',
        tags: ['estrategia', 'familiar', 'multijugador'],
        featured: true
    },
    'JM002': {
        id: 'JM002',
        code: 'JM002',
        name: 'Carcassonne',
        category: 'juegos-mesa',
        categoryName: 'Juegos de Mesa',
        price: 24990,
        originalPrice: 24990,
        currency: 'CLP',
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop&crop=center',
        description: 'Un juego de colocación de fichas donde los jugadores construyen el paisaje alrededor de la fortaleza medieval de Carcassonne. Ideal para 2-5 jugadores y fácil de aprender.',
        features: [
            '2-5 jugadores',
            'Tiempo: 30-45 minutos',
            'Edad: 7+ años',
            'Fácil de aprender',
            'Múltiples expansiones'
        ],
        stock: 20,
        rating: 4.6,
        reviews: 89,
        manufacturer: 'Z-Man Games',
        origin: 'Francia',
        tags: ['fichas', 'territorial', 'familiar']
    },

    // ACCESORIOS
    'AC001': {
        id: 'AC001',
        code: 'AC001',
        name: 'Controlador Inalámbrico Xbox Series X',
        category: 'accesorios',
        categoryName: 'Accesorios',
        price: 59990,
        originalPrice: 59990,
        currency: 'CLP',
        image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=400&fit=crop&crop=center',
        description: 'Ofrece una experiencia de juego cómoda con botones mapeables y una respuesta táctil mejorada. Compatible con consolas Xbox y PC.',
        features: [
            'Conexión inalámbrica',
            'Botones mapeables',
            'Respuesta táctil',
            'Compatible Xbox/PC',
            'Batería de larga duración'
        ],
        stock: 25,
        rating: 4.7,
        reviews: 156,
        manufacturer: 'Microsoft',
        origin: 'Estados Unidos',
        tags: ['xbox', 'inalámbrico', 'pc-compatible'],
        featured: true
    },
    'AC002': {
        id: 'AC002',
        code: 'AC002',
        name: 'Auriculares Gamer HyperX Cloud II',
        category: 'accesorios',
        categoryName: 'Accesorios',
        price: 79990,
        originalPrice: 79990,
        currency: 'CLP',
        image: 'https://images.unsplash.com/photo-1599669454699-248893623440?w=400&h=400&fit=crop&crop=center',
        description: 'Proporcionan un sonido envolvente de calidad con un micrófono desmontable y almohadillas de espuma viscoelástica para mayor comodidad durante largas sesiones de juego.',
        features: [
            'Sonido envolvente 7.1',
            'Micrófono desmontable',
            'Espuma viscoelástica',
            'Compatible multiplataforma',
            'Cable trenzado'
        ],
        stock: 18,
        rating: 4.9,
        reviews: 203,
        manufacturer: 'HyperX',
        origin: 'Estados Unidos',
        tags: ['audio', 'micrófono', 'confort']
    },

    // CONSOLAS
    'CO001': {
        id: 'CO001',
        code: 'CO001',
        name: 'PlayStation 5',
        category: 'consolas',
        categoryName: 'Consolas',
        price: 549990,
        originalPrice: 549990,
        currency: 'CLP',
        image: 'https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=400&h=400&fit=crop&crop=center',
        description: 'La consola de última generación de Sony, que ofrece gráficos impresionantes y tiempos de carga ultrarrápidos para una experiencia de juego inmersiva.',
        features: [
            'Gráficos 4K',
            'Ray Tracing',
            'SSD ultra rápido',
            'Retrocompatibilidad PS4',
            'Control DualSense'
        ],
        stock: 8,
        rating: 4.9,
        reviews: 342,
        manufacturer: 'Sony',
        origin: 'Japón',
        tags: ['nueva-generación', '4k', 'exclusivos'],
        featured: true
    },

    // COMPUTADORES GAMERS
    'CG001': {
        id: 'CG001',
        code: 'CG001',
        name: 'PC Gamer ASUS ROG Strix',
        category: 'computadores',
        categoryName: 'Computadores Gamers',
        price: 1299990,
        originalPrice: 1299990,
        currency: 'CLP',
        image: 'https://images.unsplash.com/photo-1587831990711-23ca6441447b?w=400&h=400&fit=crop&crop=center',
        description: 'Un potente equipo diseñado para los gamers más exigentes, equipado con los últimos componentes para ofrecer un rendimiento excepcional en cualquier juego.',
        features: [
            'RTX 4070 Graphics',
            'Intel i7 13th Gen',
            '32GB DDR5 RAM',
            '1TB NVMe SSD',
            'RGB Lighting'
        ],
        stock: 5,
        rating: 4.8,
        reviews: 67,
        manufacturer: 'ASUS',
        origin: 'Taiwán',
        tags: ['alto-rendimiento', 'rtx', 'rgb']
    },

    // SILLAS GAMERS
    'SG001': {
        id: 'SG001',
        code: 'SG001',
        name: 'Silla Gamer Secretlab Titan',
        category: 'sillas',
        categoryName: 'Sillas Gamers',
        price: 349990,
        originalPrice: 349990,
        currency: 'CLP',
        image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop&crop=center',
        description: 'Diseñada para el máximo confort, esta silla ofrece un soporte ergonómico y personalización ajustable para sesiones de juego prolongadas.',
        features: [
            'Soporte lumbar ajustable',
            'Reposabrazos 4D',
            'Reclinación 165°',
            'Cuero PU premium',
            'Base de aluminio'
        ],
        stock: 12,
        rating: 4.7,
        reviews: 89,
        manufacturer: 'Secretlab',
        origin: 'Singapur',
        tags: ['ergonómica', 'premium', 'ajustable']
    },

    // MOUSE
    'MS001': {
        id: 'MS001',
        code: 'MS001',
        name: 'Mouse Gamer Logitech G502 HERO',
        category: 'mouse',
        categoryName: 'Mouse',
        price: 49990,
        originalPrice: 49990,
        currency: 'CLP',
        image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=400&h=400&fit=crop&crop=center',
        description: 'Con sensor de alta precisión y botones personalizables, este mouse es ideal para gamers que buscan un control preciso y personalización.',
        features: [
            'Sensor HERO 25K',
            '11 botones programables',
            'Pesas ajustables',
            'RGB LIGHTSYNC',
            'Cable POWERPLAY compatible'
        ],
        stock: 30,
        rating: 4.8,
        reviews: 178,
        manufacturer: 'Logitech',
        origin: 'Suiza',
        tags: ['precisión', 'personalizable', 'rgb']
    },

    // MOUSEPAD
    'MP001': {
        id: 'MP001',
        code: 'MP001',
        name: 'Mousepad Razer Goliathus Extended Chroma',
        category: 'mousepad',
        categoryName: 'Mousepad',
        price: 29990,
        originalPrice: 29990,
        currency: 'CLP',
        image: 'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=400&h=400&fit=crop&crop=center',
        description: 'Ofrece un área de juego amplia con iluminación RGB personalizable, asegurando una superficie suave y uniforme para el movimiento del mouse.',
        features: [
            'Superficie micro-texturizada',
            'RGB Chroma 16.8M colores',
            'Tamaño extendido',
            'Base antideslizante',
            'Compatible Razer Synapse'
        ],
        stock: 40,
        rating: 4.6,
        reviews: 134,
        manufacturer: 'Razer',
        origin: 'Estados Unidos',
        tags: ['rgb', 'extendido', 'gaming']
    },

    // POLERAS PERSONALIZADAS
    'PP001': {
        id: 'PP001',
        code: 'PP001',
        name: 'Polera Gamer Personalizada \'Level-Up\'',
        category: 'poleras',
        categoryName: 'Poleras Personalizadas',
        price: 14990,
        originalPrice: 14990,
        currency: 'CLP',
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&crop=center',
        description: 'Una camiseta cómoda y estilizada, con la posibilidad de personalizarla con tu gamer tag o diseño favorito.',
        features: [
            '100% Algodón',
            'Estampado de alta calidad',
            'Personalización incluida',
            'Tallas S a XXL',
            'Colores disponibles'
        ],
        stock: 50,
        rating: 4.5,
        reviews: 92,
        manufacturer: 'Level-Up Gamer',
        origin: 'Chile',
        tags: ['personalizable', 'cómoda', 'algodón'],
        customizable: true,
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        colors: ['Negro', 'Blanco', 'Gris', 'Verde Neón', 'Azul Eléctrico']
    },

    // PRODUCTOS DE OFERTAS ESPECIALES
    'offer-1': {
        id: 'offer-1',
        code: 'offer-1',
        name: 'NVIDIA RTX 4080 Gaming',
        category: 'componentes',
        categoryName: 'Componentes',
        price: 714995,
        originalPrice: 1299990,
        currency: 'CLP',
        image: 'assets/images/rtx-4080.webp',
        description: 'Tarjeta gráfica de última generación NVIDIA GeForce RTX 4080 para gaming extremo y trabajo profesional. Incluye tecnología ray tracing y DLSS 3.0.',
        features: [
            'Ray Tracing en tiempo real',
            'DLSS 3.0',
            '16GB GDDR6X',
            '4K Gaming',
            'Garantía extendida'
        ],
        stock: 8,
        rating: 4.9,
        reviews: 127,
        manufacturer: 'NVIDIA',
        origin: 'Estados Unidos',
        tags: ['gpu', 'gaming', '4k', 'ray-tracing'],
        featured: true,
        isOffer: true,
        discount: 45
    },
    'offer-2': {
        id: 'offer-2',
        code: 'offer-2',
        name: 'PlayStation 5 Console',
        category: 'consolas',
        categoryName: 'Consolas',
        price: 422494,
        originalPrice: 649990,
        currency: 'CLP',
        image: 'assets/images/ps5-console.webp',
        description: 'Console PlayStation 5 con tecnología SSD ultra-rápida, gráficos 4K, audio 3D Tempest y compatibilidad con juegos PS4. Incluye control DualSense.',
        features: [
            'SSD ultra-rápido',
            'Gráficos 4K 120fps',
            'Audio 3D Tempest',
            'Control DualSense',
            'Juego incluido'
        ],
        stock: 12,
        rating: 4.8,
        reviews: 89,
        manufacturer: 'Sony',
        origin: 'Japón',
        tags: ['consola', 'ps5', '4k', 'gaming'],
        featured: true,
        isOffer: true,
        discount: 35
    },
    'offer-3': {
        id: 'offer-3',
        code: 'offer-3',
        name: 'Silla Gaming Pro RGB',
        category: 'muebles',
        categoryName: 'Muebles Gaming',
        price: 199995,
        originalPrice: 399990,
        currency: 'CLP',
        image: 'assets/images/gaming-chair.webp',
        description: 'Silla gaming ergonómica con iluminación RGB personalizable, soporte lumbar ajustable y materiales premium para sesiones de gaming extendidas.',
        features: [
            'Iluminación RGB',
            'Soporte lumbar ajustable',
            'Material premium',
            'Reposabrazos 4D',
            'Base de acero'
        ],
        stock: 15,
        rating: 4.7,
        reviews: 156,
        manufacturer: 'GamerChair',
        origin: 'China',
        tags: ['silla', 'gaming', 'rgb', 'ergonómica'],
        featured: true,
        isOffer: true,
        discount: 50
    }
};

// Categorías principales
const CATEGORIES = {
    'juegos-mesa': {
        id: 'juegos-mesa',
        name: 'Juegos de Mesa',
        icon: '🎲',
        description: 'Diversión analógica para toda la familia'
    },
    'accesorios': {
        id: 'accesorios',
        name: 'Accesorios',
        icon: '🎮',
        description: 'Complementa tu setup gaming'
    },
    'consolas': {
        id: 'consolas',
        name: 'Consolas',
        icon: '🕹️',
        description: 'Las mejores consolas del mercado'
    },
    'computadores': {
        id: 'computadores',
        name: 'Computadores Gamers',
        icon: '💻',
        description: 'PCs de alto rendimiento'
    },
    'sillas': {
        id: 'sillas',
        name: 'Sillas Gamers',
        icon: '🪑',
        description: 'Confort para largas sesiones'
    },
    'mouse': {
        id: 'mouse',
        name: 'Mouse',
        icon: '🖱️',
        description: 'Precisión en cada click'
    },
    'mousepad': {
        id: 'mousepad',
        name: 'Mousepad',
        icon: '🟫',
        description: 'La superficie perfecta'
    },
    'poleras': {
        id: 'poleras',
        name: 'Poleras Personalizadas',
        icon: '👕',
        description: 'Expresa tu estilo gamer'
    },
    'muebles': {
        id: 'muebles',
        name: 'Muebles Gaming',
        icon: '🪑',
        description: 'Mobiliario ergonómico para gamers'
    },
    'componentes': {
        id: 'componentes',
        name: 'Componentes PC',
        icon: '🖥️',
        description: 'Hardware de última generación'
    }
};

// Función para obtener productos destacados
function getFeaturedProducts() {
    return Object.values(PRODUCT_DATABASE).filter(product => product.featured === true);
}

// Función para obtener productos por categoría
function getProductsByCategory(categoryId) {
    return Object.values(PRODUCT_DATABASE).filter(product => product.category === categoryId);
}

// Función para buscar productos
function searchProducts(query) {
    const searchTerm = query.toLowerCase();
    return Object.values(PRODUCT_DATABASE).filter(product => 
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );
}

// Función para filtrar productos
function filterProducts(filters) {
    let products = Object.values(PRODUCT_DATABASE);
    
    if (filters.category) {
        products = products.filter(p => p.category === filters.category);
    }
    
    if (filters.priceRange) {
        const [min, max] = filters.priceRange;
        products = products.filter(p => p.price >= min && p.price <= max);
    }
    
    if (filters.rating) {
        products = products.filter(p => p.rating >= filters.rating);
    }
    
    if (filters.manufacturer) {
        products = products.filter(p => p.manufacturer === filters.manufacturer);
    }
    
    return products;
}

// Función para obtener producto por ID
function getProductById(id) {
    return PRODUCT_DATABASE[id];
}

// Función para formatear precio
function formatPrice(price, currency = 'CLP') {
    return new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: currency
    }).format(price);
}

// Exportar funciones y datos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        PRODUCT_DATABASE,
        CATEGORIES,
        getFeaturedProducts,
        getProductsByCategory,
        searchProducts,
        filterProducts,
        getProductById,
        formatPrice
    };
}

// Hacer disponible globalmente
window.PRODUCT_DATABASE = PRODUCT_DATABASE;
window.CATEGORIES = CATEGORIES;
window.getFeaturedProducts = getFeaturedProducts;
window.getProductsByCategory = getProductsByCategory;
window.searchProducts = searchProducts;
window.filterProducts = filterProducts;
window.getProductById = getProductById;
window.formatPrice = formatPrice;
