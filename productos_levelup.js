// ================================
// LEVEL-UP GAMER - PRODUCTOS BASE
// Array PRODUCTS_LG con estructura específica del proyecto
// ================================

export const PRODUCTS_LG = [
  // JUEGOS DE MESA (JM)
  {
    code: "JM001",
    nombre: "Catan",
    categoriaId: "JM",
    precioCLP: 29990,
    stock: 25,
    marca: "Kosmos",
    rating: 4.8,
    specs: ["3-4 jugadores", "60-90 min", "Edad: 10+", "Estrategia"],
    descripcion: "Clásico de estrategia de colonización y comercio. Perfecto para noches en familia.",
    tags: ["familiar", "estrategia", "multijugador"],
    imagen: "assets/products/jm001.jpg"
  },

  // ACCESORIOS (AC)
  {
    code: "AC001",
    nombre: "Auriculares Gaming HyperX Cloud II",
    categoriaId: "AC",
    precioCLP: 89990,
    stock: 18,
    marca: "HyperX",
    rating: 4.7,
    specs: ["7.1 Surround", "Micrófono desmontable", "3.5mm + USB", "Memory foam"],
    descripcion: "Auriculares gaming premium con sonido envolvente 7.1. Comodidad para sesiones largas.",
    tags: ["gaming", "audio", "profesional", "competitivo"],
    imagen: "assets/products/ac001.jpg"
  },

  // CONSOLAS (CO)
  {
    code: "CO001",
    nombre: "PlayStation 5",
    categoriaId: "CO",
    precioCLP: 599990,
    stock: 8,
    marca: "Sony",
    rating: 4.9,
    specs: ["AMD Zen 2", "16GB GDDR6", "825GB SSD", "Ray Tracing", "4K 120fps"],
    descripcion: "La consola de nueva generación con gráficos ultra realistas y carga instantánea.",
    tags: ["next-gen", "4k", "exclusivos", "ray-tracing"],
    imagen: "assets/products/co001.jpg"
  },

  // COMPUTADORES GAMERS (CG)
  {
    code: "CG001",
    nombre: "PC Gamer RTX 4070 - Intel i7",
    categoriaId: "CG",
    precioCLP: 1299990,
    stock: 12,
    marca: "ASUS ROG",
    rating: 4.6,
    specs: ["Intel i7-13700F", "RTX 4070", "32GB DDR5", "1TB NVMe SSD", "650W 80+ Gold"],
    descripcion: "PC gaming de alto rendimiento para 1440p ultra settings. Ideal para streaming y competitivo.",
    tags: ["high-end", "rtx", "gaming", "streaming"],
    imagen: "assets/products/cg001.jpg"
  },

  // SILLAS GAMERS (SG)
  {
    code: "SG001",
    nombre: "Silla Gamer DXRacer Formula Series",
    categoriaId: "SG",
    precioCLP: 349990,
    stock: 15,
    marca: "DXRacer",
    rating: 4.5,
    specs: ["Cuero PU", "Soporte lumbar", "Reposabrazos 4D", "Reclinable 135°", "Hasta 90kg"],
    descripcion: "Silla ergonómica de competición con diseño racing. Máximo confort para sesiones intensas.",
    tags: ["ergonomica", "racing", "profesional", "confort"],
    imagen: "assets/products/sg001.jpg"
  },

  // MOUSE (MS)
  {
    code: "MS001",
    nombre: "Mouse Gaming Logitech G Pro X Superlight",
    categoriaId: "MS",
    precioCLP: 129990,
    stock: 22,
    marca: "Logitech G",
    rating: 4.8,
    specs: ["25600 DPI", "63g ultraliviano", "HERO 25K sensor", "70hrs batería", "Wireless"],
    descripcion: "Mouse inalámbrico ultra liviano diseñado para profesionales. Precisión absoluta en esports.",
    tags: ["profesional", "wireless", "ultraliviano", "esports"],
    imagen: "assets/products/ms001.jpg"
  },

  // MOUSEPAD (MP)
  {
    code: "MP001",
    nombre: "Mousepad Steelseries QcK XXL",
    categoriaId: "MP",
    precioCLP: 39990,
    stock: 35,
    marca: "SteelSeries",
    rating: 4.6,
    specs: ["900x400x4mm", "Superficie de tela", "Base antideslizante", "Bordes cosidos", "Lavable"],
    descripcion: "Mousepad XXL para teclado y mouse. Superficie optimizada para sensores ópticos y láser.",
    tags: ["xxl", "tela", "precision", "duradero"],
    imagen: "assets/products/mp001.jpg"
  },

  // POLERAS PERSONALIZADAS (PP)
  {
    code: "PP001",
    nombre: "Polera Level-Up Gamer - Logo Neon",
    categoriaId: "PP",
    precioCLP: 19990,
    stock: 42,
    marca: "Level-Up",
    rating: 4.4,
    specs: ["100% Algodón", "Tallas S-XXL", "Estampado DTG", "Lavable 40°", "Unisex"],
    descripcion: "Polera oficial Level-Up con logo neon brillante. Diseño exclusivo para gamers auténticos.",
    tags: ["oficial", "neon", "algodon", "unisex"],
    imagen: "assets/products/pp001.jpg"
  },

  // POLERONES PERSONALIZADOS (PN)
  {
    code: "PN001",
    nombre: "Polerón Level-Up Gaming Hood - RGB Edition",
    categoriaId: "PN",
    precioCLP: 45990,
    stock: 28,
    marca: "Level-Up",
    rating: 4.7,
    specs: ["65% Algodón 35% Poliéster", "Capucha ajustable", "Bolsillo canguro", "Tallas S-XXL", "Estampado reflectante"],
    descripcion: "Polerón gaming con capucha y estampado RGB reflectante. Comodidad y estilo gamer auténtico.",
    tags: ["capucha", "rgb", "reflectante", "gaming"],
    imagen: "assets/products/pn001.jpg"
  },

  // SERVICIO TÉCNICO (ST)
  {
    code: "ST001",
    nombre: "Servicio Técnico PC Gaming - Diagnóstico",
    categoriaId: "ST",
    precioCLP: 25000,
    stock: 99,
    marca: "Level-Up Tech",
    rating: 4.9,
    specs: ["Diagnóstico completo", "Reporte detallado", "30 min máximo", "Incluye limpieza básica", "Garantía servicio"],
    descripcion: "Diagnóstico profesional para PC gaming. Detectamos problemas de hardware y software.",
    tags: ["diagnostico", "profesional", "rapido", "garantia"],
    imagen: "assets/products/st001.jpg"
  }
];

// Validación automática de productos
export const validateProducts = () => {
  const errors = [];
  
  PRODUCTS_LG.forEach(product => {
    // Validar estructura requerida
    const requiredFields = ['code', 'nombre', 'categoriaId', 'precioCLP', 'stock', 'marca', 'rating', 'specs', 'descripcion', 'tags', 'imagen'];
    requiredFields.forEach(field => {
      if (!product[field]) {
        errors.push(`Producto ${product.code}: Campo '${field}' faltante`);
      }
    });
    
    // Validar precio mínimo
    if (product.precioCLP < 5000) {
      errors.push(`Producto ${product.code}: Precio debe ser ≥ 5.000 CLP`);
    }
    
    // Validar stock mínimo
    if (product.stock < 5) {
      errors.push(`Producto ${product.code}: Stock debe ser ≥ 5`);
    }
    
    // Validar formato de imagen
    if (!product.imagen.startsWith('assets/products/') || !product.imagen.endsWith('.jpg')) {
      errors.push(`Producto ${product.code}: Imagen debe tener formato assets/products/{code}.jpg`);
    }
    
    // Validar formato de código
    if (!/^[A-Z]{2}\d{3}$/.test(product.code)) {
      errors.push(`Producto ${product.code}: Código debe tener formato XX### (ej: JM001)`);
    }
  });
  
  return errors;
};

// Utilidades para trabajar con productos
export const getProductsByCategory = (categoryId) => {
  return PRODUCTS_LG.filter(product => product.categoriaId === categoryId);
};

export const getProductByCode = (code) => {
  return PRODUCTS_LG.find(product => product.code === code);
};

export const getFeaturedProducts = (limit = 5) => {
  return PRODUCTS_LG
    .filter(product => product.rating >= 4.5)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit);
};

export const searchProducts = (query) => {
  const searchTerm = query.toLowerCase();
  return PRODUCTS_LG.filter(product => 
    product.nombre.toLowerCase().includes(searchTerm) ||
    product.descripcion.toLowerCase().includes(searchTerm) ||
    product.tags.some(tag => tag.toLowerCase().includes(searchTerm))
  );
};

// Categorías disponibles
export const CATEGORIES_LG = {
  JM: "Juegos de Mesa",
  AC: "Accesorios",
  CO: "Consolas", 
  CG: "Computadores Gamers",
  SG: "Sillas Gamers",
  MS: "Mouse",
  MP: "Mousepad",
  PP: "Poleras Personalizadas",
  PN: "Polerones Personalizados",
  ST: "Servicio Técnico"
};

console.log('✅ PRODUCTS_LG cargado:', PRODUCTS_LG.length, 'productos');
console.log('📋 Validación:', validateProducts().length === 0 ? 'PASSED' : 'FAILED');
