// ====================================================
// BASE DE DATOS DE PRODUCTOS LEVEL-UP GAMER CON LOCALSTORAGE
// Sistema completo y funcional integrado con localStorage
// ====================================================

class ProductDatabase {
    constructor() {
        this.STORAGE_KEY = 'levelup_gamer_products';
        this.VERSION_KEY = 'levelup_gamer_db_version';
        this.CURRENT_VERSION = '2.0';
        
        this.initializeDatabase();
    }

    initializeDatabase() {
        console.log('🔄 Inicializando ProductDatabase...');
        
        // Verificar versión y cargar datos
        const storedVersion = localStorage.getItem(this.VERSION_KEY);
        const needsUpdate = !storedVersion || storedVersion !== this.CURRENT_VERSION;
        
        if (needsUpdate) {
            console.log('📦 Cargando productos frescos...');
            this.loadFreshData();
            this.saveToStorage();
        } else {
            console.log('✅ Cargando desde localStorage...');
            this.loadFromStorage();
        }
        
        // Hacer disponible globalmente
        window.PRODUCT_DATABASE = this.products;
        
        // Agregar imágenes faltantes
        this.addMissingImages();
        
        console.log(`🎮 Database lista: ${Object.keys(this.products).length} productos`);
        
        // Notificar que está lista
        window.dispatchEvent(new CustomEvent('productDatabaseReady'));
    }

    loadFreshData() {
        this.products = {
            // CONSOLAS
            "CONSOLE-PS5": {
                codigo: "CONSOLE-PS5",
                nombre: "PlayStation 5",
                categoria: "Consolas",
                precio: 599990,
                stock: 15,
                imagen: "assets/images/placeholder-product.svg",
                descripcion: "Consola next-gen con gráficos 4K",
                tags: ["sony", "playstation", "4k", "gaming"]
            },
            "CONSOLE-XBOX": {
                codigo: "CONSOLE-XBOX", 
                nombre: "Xbox Series X",
                categoria: "Consolas",
                precio: 549990,
                stock: 12,
                descripcion: "Consola Xbox más potente",
                tags: ["microsoft", "xbox", "4k", "gaming"]
            },
            "CONSOLE-NSW": {
                codigo: "CONSOLE-NSW",
                nombre: "Nintendo Switch OLED", 
                categoria: "Consolas",
                precio: 379990,
                stock: 20,
                descripcion: "Consola híbrida con OLED",
                tags: ["nintendo", "switch", "oled", "portátil"]
            },
            
            // PC GAMING
            "PC-RTX4090": {
                codigo: "PC-RTX4090",
                nombre: "PC Gamer RTX 4090 Ultra",
                categoria: "PC Gaming", 
                precio: 2999990,
                stock: 5,
                descripcion: "PC extremo RTX 4090",
                tags: ["nvidia", "rtx", "4090", "gaming", "ultra"]
            },
            "PC-RTX4070": {
                codigo: "PC-RTX4070",
                nombre: "PC Gamer RTX 4070 Pro",
                categoria: "PC Gaming",
                precio: 1599990, 
                stock: 10,
                descripcion: "PC balanceado RTX 4070",
                tags: ["nvidia", "rtx", "4070", "gaming", "pro"]
            },
            
            // PERIFÉRICOS
            "MOUSE-G502": {
                codigo: "MOUSE-G502",
                nombre: "Logitech G502 HERO",
                categoria: "Accesorios",
                precio: 79990,
                stock: 25,
                descripcion: "Mouse gaming HERO 25K",
                tags: ["logitech", "mouse", "gaming", "rgb", "hero"]
            },
            "KEYBOARD-G915": {
                codigo: "KEYBOARD-G915", 
                nombre: "Logitech G915 TKL",
                categoria: "Accesorios",
                precio: 199990,
                stock: 12,
                descripcion: "Teclado mecánico RGB inalámbrico",
                tags: ["logitech", "teclado", "mecánico", "rgb", "tkl"]
            },
            
            // AUDIO
            "HEADSET-ARCTIS": {
                codigo: "HEADSET-ARCTIS",
                nombre: "SteelSeries Arctis 7P", 
                categoria: "Accesorios",
                precio: 149990,
                stock: 20,
                descripcion: "Auriculares gaming inalámbricos",
                tags: ["steelseries", "auriculares", "gaming", "inalámbrico"]
            },
            "HEADSET-G733": {
                codigo: "HEADSET-G733",
                nombre: "Logitech G733 LIGHTSPEED",
                categoria: "Accesorios", 
                precio: 129990,
                stock: 22,
                descripcion: "Auriculares RGB ultraligeros",
                tags: ["logitech", "auriculares", "gaming", "rgb"]
            },
            
            // MONITORES
            "MONITOR-27G": {
                codigo: "MONITOR-27G",
                nombre: "ASUS ROG Swift PG27AQ",
                categoria: "Accesorios",
                precio: 599990,
                stock: 8, 
                descripcion: "Monitor 27\" 4K 144Hz G-SYNC",
                tags: ["asus", "monitor", "gaming", "4k", "144hz", "gsync"]
            },
            
            // VIDEOJUEGOS
            "GAME-SPIDERMAN2": {
                codigo: "GAME-SPIDERMAN2",
                nombre: "Marvel's Spider-Man 2",
                categoria: "Videojuegos",
                precio: 69990,
                stock: 30,
                descripcion: "Exclusivo PS5 Spider-Man",
                tags: ["sony", "ps5", "spiderman", "marvel", "exclusivo"]
            },
            "GAME-GOW": {
                codigo: "GAME-GOW", 
                nombre: "God of War Ragnarök",
                categoria: "Videojuegos",
                precio: 59990,
                stock: 25,
                descripcion: "Saga nórdica de Kratos",
                tags: ["sony", "ps5", "god-of-war", "kratos", "acción"]
            },
            "GAME-ZELDA": {
                codigo: "GAME-ZELDA",
                nombre: "Zelda: Tears of the Kingdom", 
                categoria: "Videojuegos",
                precio: 69990,
                stock: 35,
                descripcion: "Secuela de Breath of the Wild",
                tags: ["nintendo", "zelda", "aventura", "mundo-abierto"]
            },
            "GAME-MARIO": {
                codigo: "GAME-MARIO",
                nombre: "Super Mario Bros. Wonder",
                categoria: "Videojuegos",
                precio: 59990,
                stock: 40,
                descripcion: "Nueva aventura 2D de Mario", 
                tags: ["nintendo", "mario", "plataformas", "familia"]
            },
            
            // SILLAS Y ACCESORIOS
            "CHAIR-SECRETLAB": {
                codigo: "CHAIR-SECRETLAB",
                nombre: "Secretlab TITAN Evo 2022",
                categoria: "Accesorios",
                precio: 459990,
                stock: 10,
                descripcion: "Silla gaming premium",
                tags: ["secretlab", "silla", "gaming", "ergonómica"]
            },
            "CAM-C920": {
                codigo: "CAM-C920", 
                nombre: "Logitech C920S HD Pro",
                categoria: "Accesorios",
                precio: 89990,
                stock: 20,
                descripcion: "Webcam Full HD 1080p",
                tags: ["logitech", "webcam", "streaming", "1080p"]
            },
            
            // VR
            "VR-META": {
                codigo: "VR-META",
                nombre: "Meta Quest 3 128GB",
                categoria: "Consolas",
                precio: 549990,
                stock: 6,
                descripcion: "Casco VR standalone", 
                tags: ["meta", "quest", "vr", "realidad-virtual"]
            },
            
            // CONTROLES
            "PAD-XBOX": {
                codigo: "PAD-XBOX",
                nombre: "Controller Wireless Xbox", 
                categoria: "Accesorios",
                precio: 69990,
                stock: 25,
                descripcion: "Control inalámbrico Xbox",
                tags: ["microsoft", "xbox", "control", "inalámbrico"]
            },
            "PAD-PS5": {
                codigo: "PAD-PS5",
                nombre: "DualSense Wireless Controller",
                categoria: "Accesorios",
                precio: 79990,
                stock: 30,
                descripcion: "Control PS5 háptico",
                tags: ["sony", "ps5", "dualsense", "háptico"]
            }
        };
    }

    saveToStorage() {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.products));
            localStorage.setItem(this.VERSION_KEY, this.CURRENT_VERSION);
            console.log('💾 Productos guardados en localStorage');
        } catch (error) {
            console.error('❌ Error guardando:', error);
        }
    }

    loadFromStorage() {
        try {
            const stored = localStorage.getItem(this.STORAGE_KEY);
            if (stored) {
                this.products = JSON.parse(stored);
                console.log('📂 Productos desde localStorage');
            } else {
                this.loadFreshData();
                this.saveToStorage();
            }
        } catch (error) {
            console.error('❌ Error cargando:', error);
            this.loadFreshData();
            this.saveToStorage();
        }
    }

    // Buscar productos
    searchProducts(query, category = null) {
        if (!query || query.length < 2) return [];
        
        const normalizedQuery = query.toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');
        
        return Object.values(this.products)
            .filter(product => {
                const matchesCategory = !category || product.categoria.toLowerCase() === category.toLowerCase();
                const normalizedName = product.nombre.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
                const normalizedCode = product.codigo.toLowerCase();
                const normalizedCategory = product.categoria.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
                
                const matchesQuery = normalizedName.includes(normalizedQuery) ||
                                   normalizedCode.includes(normalizedQuery) ||
                                   normalizedCategory.includes(normalizedQuery) ||
                                   (product.tags && product.tags.some(tag => 
                                       tag.toLowerCase().includes(normalizedQuery)));
                
                return matchesCategory && matchesQuery;
            })
            .sort((a, b) => a.nombre.localeCompare(b.nombre));
    }

    getProduct(codigo) {
        return this.products[codigo] || null;
    }

    getProductsByCategory(category) {
        return Object.values(this.products)
            .filter(product => product.categoria.toLowerCase() === category.toLowerCase())
            .sort((a, b) => a.nombre.localeCompare(b.nombre));
    }

    getCategories() {
        const categories = [...new Set(Object.values(this.products).map(p => p.categoria))];
        return categories.sort();
    }
    
    addMissingImages() {
        const defaultImage = "assets/images/placeholder-product.svg";
        
        Object.keys(this.products).forEach(codigo => {
            if (!this.products[codigo].imagen) {
                this.products[codigo].imagen = defaultImage;
            }
        });
        
        console.log('🖼️ Imágenes placeholder agregadas a productos faltantes');
    }
}

// Inicializar inmediatamente
console.log('🚀 Creando ProductDatabase...');
window.productDB = new ProductDatabase();

// Funciones globales para compatibilidad
window.searchProducts = (query, category) => {
    console.log('🔍 searchProducts llamado:', query);
    return window.productDB ? window.productDB.searchProducts(query, category) : [];
};

window.getProduct = (codigo) => window.productDB ? window.productDB.getProduct(codigo) : null;
window.getProductsByCategory = (category) => window.productDB ? window.productDB.getProductsByCategory(category) : [];
window.getCategories = () => window.productDB ? window.productDB.getCategories() : [];

console.log('✅ ProductDatabase sistema completo inicializado');