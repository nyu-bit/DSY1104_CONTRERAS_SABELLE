// Base de datos de productos LevelUp Gaming
// Productos EXACTOS según requerimientos de evaluación del profesor

var PRODUCTS_LG = [
  // Juegos de Mesa
  {
    code: "JM001",
    nombre: "Catan",
    categoriaId: "JM",
    precioCLP: 29990,
    stock: 25,
    marca: "Kosmos",
    rating: 4.8,
    specs: ["3-4 jugadores", "60-90 min", "Estrategia"],
    descripcion: "Un clásico juego de estrategia donde los jugadores compiten por colonizar y expandirse en la isla de Catan. Ideal para 3-4 jugadores y perfecto para noches de juego en familia o con amigos.",
    tags: ["familiar", "estrategia", "clasico"],
    imagen: "assets/products/jm001.jpg"
  },
  {
    code: "JM002",
    nombre: "Carcassonne",
    categoriaId: "JM",
    precioCLP: 24990,
    stock: 20,
    marca: "Z-Man Games",
    rating: 4.6,
    specs: ["2-5 jugadores", "30-45 min", "Estrategia"],
    descripcion: "Un juego de colocación de fichas donde los jugadores construyen el paisaje alrededor de la fortaleza medieval de Carcassonne. Ideal para 2-5 jugadores y fácil de aprender.",
    tags: ["medieval", "estrategia", "familia"],
    imagen: "assets/products/jm002.jpg"
  },
  // Accesorios
  {
    code: "AC001",
    nombre: "Controlador Inalámbrico Xbox Series X",
    categoriaId: "AC",
    precioCLP: 59990,
    stock: 30,
    marca: "Microsoft",
    rating: 4.7,
    specs: ["Inalámbrico", "Botones mapeables", "Respuesta táctil"],
    descripcion: "Ofrece una experiencia de juego cómoda con botones mapeables y una respuesta táctil mejorada. Compatible con consolas Xbox y PC.",
    tags: ["xbox", "controlador", "inalambrico"],
    imagen: "assets/products/ac001.jpg"
  },
  {
    code: "AC002",
    nombre: "Auriculares Gamer HyperX Cloud II",
    categoriaId: "AC",
    precioCLP: 79990,
    stock: 25,
    marca: "HyperX",
    rating: 4.8,
    specs: ["7.1 Surround", "Micrófono desmontable", "Espuma viscoelástica"],
    descripcion: "Proporcionan un sonido envolvente de calidad con un micrófono desmontable y almohadillas de espuma viscoelástica para mayor comodidad durante largas sesiones de juego.",
    tags: ["audio", "gaming", "hyperx"],
    imagen: "assets/products/ac002.jpg"
  },
  // Consolas
  {
    code: "CO001",
    nombre: "PlayStation 5",
    categoriaId: "CO",
    precioCLP: 549990,
    stock: 8,
    marca: "Sony",
    rating: 4.9,
    specs: ["SSD 825GB", "Ray Tracing", "4K/120fps", "DualSense"],
    descripcion: "La consola de última generación de Sony, que ofrece gráficos impresionantes y tiempos de carga ultrarrápidos para una experiencia de juego inmersiva.",
    tags: ["consola", "sony", "next-gen"],
    imagen: "assets/products/co001.jpg"
  },
  // Computadores Gamers
  {
    code: "CG001",
    nombre: "PC Gamer ASUS ROG Strix",
    categoriaId: "CG",
    precioCLP: 1299990,
    stock: 5,
    marca: "ASUS",
    rating: 4.7,
    specs: ["ROG Strix", "Componentes gaming", "Alto rendimiento"],
    descripcion: "Un potente equipo diseñado para los gamers más exigentes, equipado con los últimos componentes para ofrecer un rendimiento excepcional en cualquier juego.",
    tags: ["pc", "asus", "rog"],
    imagen: "assets/products/cg001.jpg"
  },
  // Mouse Gaming
  {
    code: "MG001",
    nombre: "Mouse Gaming Logitech G502",
    categoriaId: "MG",
    precioCLP: 49990,
    stock: 35,
    marca: "Logitech",
    rating: 4.6,
    specs: ["12000 DPI", "RGB personalizable", "11 botones programables"],
    descripcion: "Mouse gaming de alta precisión con sensor avanzado, RGB personalizable y botones programables para una experiencia gaming superior.",
    tags: ["mouse", "logitech", "rgb"],
    imagen: "assets/products/mg001.jpg"
  },
  {
    code: "MG002",
    nombre: "Mouse Gaming Razer DeathAdder V3",
    categoriaId: "MG",
    precioCLP: 59990,
    stock: 28,
    marca: "Razer",
    rating: 4.7,
    specs: ["30000 DPI", "Sensor Focus Pro", "Switches ópticos"],
    descripcion: "El mouse gaming más preciso de Razer con sensor Focus Pro de 30000 DPI y switches ópticos para una respuesta ultrarrápida.",
    tags: ["mouse", "razer", "precision"],
    imagen: "assets/products/mg002.jpg"
  },
  // Merchandise
  {
    code: "ME001",
    nombre: "Camiseta Gaming Level-Up",
    categoriaId: "ME",
    precioCLP: 19990,
    stock: 50,
    marca: "Level-Up",
    rating: 4.3,
    specs: ["100% Algodón", "Diseño exclusivo", "Tallas S-XXL"],
    descripcion: "Camiseta oficial Level-Up Gaming con diseño exclusivo y materiales de alta calidad. Perfecta para cualquier gamer.",
    tags: ["camiseta", "merchandise", "algodon"],
    imagen: "assets/products/me001.jpg"
  },
  {
    code: "ME002",
    nombre: "Taza Gaming RGB (Cambia de Color)",
    categoriaId: "ME",
    precioCLP: 14990,
    stock: 40,
    marca: "Level-Up",
    rating: 4.5,
    specs: ["Cerámica", "Cambia de color", "350ml"],
    descripcion: "Taza mágica que cambia de color al agregar líquidos calientes. Diseño gaming exclusivo para verdaderos gamers.",
    tags: ["taza", "magica", "gaming"],
    imagen: "assets/products/me002.jpg"
  },
  // Servicios Técnicos
  {
    code: "ST001",
    nombre: "Optimización PC Gaming",
    categoriaId: "ST",
    precioCLP: 39990,
    stock: 100,
    marca: "Level-Up Tech",
    rating: 4.8,
    specs: ["Limpieza", "Optimización", "Actualización drivers"],
    descripcion: "Servicio técnico especializado en optimización de PCs gaming. Incluye limpieza, optimización de sistema y actualización de drivers.",
    tags: ["servicio", "optimizacion", "mantenimiento"],
    imagen: "assets/products/st001.jpg"
  },
  {
    code: "ST002",
    nombre: "Instalación Setup Gaming Completo",
    categoriaId: "ST",
    precioCLP: 79990,
    stock: 50,
    marca: "Level-Up Tech",
    rating: 4.9,
    specs: ["Instalación completa", "Configuración", "Cable management"],
    descripcion: "Servicio completo de instalación y configuración de setup gaming. Incluye cable management y optimización de rendimiento.",
    tags: ["instalacion", "setup", "configuracion"],
    imagen: "assets/products/st002.jpg"
  },
  // Más Consolas
  {
    code: "CO002",
    nombre: "Xbox Series X",
    categoriaId: "CO",
    precioCLP: 499990,
    stock: 12,
    marca: "Microsoft",
    rating: 4.8,
    specs: ["SSD 1TB", "4K/120fps", "Quick Resume", "Smart Delivery"],
    descripcion: "La consola más potente de Xbox con gráficos 4K, tiempos de carga ultrarrápidos y compatibilidad con miles de juegos.",
    tags: ["xbox", "consola", "4k"],
    imagen: "assets/products/co002.jpg"
  },
  {
    code: "CO003",
    nombre: "Nintendo Switch OLED",
    categoriaId: "CO",
    precioCLP: 349990,
    stock: 20,
    marca: "Nintendo",
    rating: 4.7,
    specs: ["Pantalla OLED 7\"", "64GB almacenamiento", "Dock incluido"],
    descripcion: "Nintendo Switch con pantalla OLED de 7 pulgadas para una experiencia visual mejorada en modo portátil.",
    tags: ["nintendo", "switch", "oled"],
    imagen: "assets/products/co003.jpg"
  },
  // Mouse
  {
    code: "MS001",
    nombre: "Mouse Gamer Logitech G502 HERO",
    categoriaId: "MS",
    precioCLP: 49990,
    stock: 40,
    marca: "Logitech",
    rating: 4.8,
    specs: ["Sensor HERO", "Botones personalizables", "Alta precisión"],
    descripcion: "Con sensor de alta precisión y botones personalizables, este mouse es ideal para gamers que buscan un control preciso y personalización.",
    tags: ["mouse", "logitech", "precision"],
    imagen: "assets/products/ms001.jpg"
  },
  // Mousepad
  {
    code: "MP001",
    nombre: "Mousepad Razer Goliathus Extended Chroma",
    categoriaId: "MP",
    precioCLP: 29990,
    stock: 50,
    marca: "Razer",
    rating: 4.6,
    specs: ["Área extendida", "RGB Chroma", "Superficie suave"],
    descripcion: "Ofrece un área de juego amplia con iluminación RGB personalizable, asegurando una superficie suave y uniforme para el movimiento del mouse.",
    tags: ["mousepad", "razer", "rgb"],
    imagen: "assets/products/mp001.jpg"
  },
  // Poleras Personalizadas
  {
    code: "PP001",
    nombre: "Polera Gamer Personalizada 'Level-Up'",
    categoriaId: "PP",
    precioCLP: 14990,
    stock: 60,
    marca: "Level-Up",
    rating: 4.4,
    specs: ["100% Algodón", "Personalizable", "Gamer tag"],
    descripcion: "Una camiseta cómoda y estilizada, con la posibilidad de personalizarla con tu gamer tag o diseño favorito.",
    tags: ["polera", "personalizada", "levelup"],
    imagen: "assets/products/pp001.jpg"
  }
];

// Crear PRODUCT_DATABASE compatible con el código existente
var PRODUCT_DATABASE = {};

// Llenar PRODUCT_DATABASE con formato compatible
PRODUCTS_LG.forEach(function(producto) {
  PRODUCT_DATABASE[producto.code] = {
    id: producto.code,
    name: producto.nombre,
    price: producto.precioCLP,
    category: producto.categoriaId.toLowerCase(),
    categoryName: getCategoryName(producto.categoriaId),
    brand: producto.marca,
    rating: producto.rating,
    image: producto.imagen,
    inStock: producto.stock > 0,
    stock: producto.stock,
    description: producto.descripcion,
    specs: producto.specs,
    tags: producto.tags,
    featured: producto.rating >= 4.5,
    reviews: Math.floor(Math.random() * 100) + 20, // Simular reviews
    features: producto.specs || []
  };
});

// Función para obtener nombre de categoría
function getCategoryName(categoriaId) {
  const categorias = {
    'JM': 'Juegos de Mesa',
    'AC': 'Accesorios',
    'CO': 'Consolas',
    'CG': 'Computadores Gaming',
    'SG': 'Sillas Gaming',
    'MG': 'Mouse Gaming',
    'ME': 'Merchandise',
    'ST': 'Servicios Técnicos'
  };
  return categorias[categoriaId] || 'Productos';
}

// Funciones de utilidad
function getAllProducts() {
  return PRODUCTS_LG;
}

function getProductById(id) {
  return PRODUCT_DATABASE[id] || null;
}

function getProductByCode(code) {
  for (var i = 0; i < PRODUCTS_LG.length; i++) {
    if (PRODUCTS_LG[i].code === code) {
      return PRODUCTS_LG[i];
    }
  }
  return null;
}

function getFeaturedProducts(limit) {
  limit = limit || 6;
  var featured = [];
  for (var i = 0; i < PRODUCTS_LG.length; i++) {
    if (PRODUCTS_LG[i].rating >= 4.5) {
      featured.push(PRODUCTS_LG[i]);
    }
  }
  return featured.slice(0, limit);
}

function searchProducts(query) {
  var results = [];
  var searchTerm = query.toLowerCase();
  for (var i = 0; i < PRODUCTS_LG.length; i++) {
    var producto = PRODUCTS_LG[i];
    if (producto.nombre.toLowerCase().indexOf(searchTerm) !== -1 ||
        producto.descripcion.toLowerCase().indexOf(searchTerm) !== -1) {
      results.push(producto);
    }
  }
  return results;
}

// Guardar en localStorage
try {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('levelup_products', JSON.stringify(PRODUCTS_LG));
  }
} catch (e) {
  console.warn('No se pudo guardar en localStorage:', e);
}

// Log para debug
console.log('✅ Productos cargados:', PRODUCTS_LG.length, 'productos');
console.log('✅ PRODUCT_DATABASE creado:', Object.keys(PRODUCT_DATABASE).length, 'productos');
