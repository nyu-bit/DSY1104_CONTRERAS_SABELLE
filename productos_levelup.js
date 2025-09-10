// productos_levelup.js - Base de datos de productos LevelUp Gaming
// Estructura EXACTA requerida por el profesor para evaluación

export const PRODUCTS_LG = [
  // Juegos de Mesa (JM)
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

  // Accesorios (AC)
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

  // Consolas (CO)
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

  // Computadores Gamers (CG)
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

  // Sillas Gamers (SG)
  {
    code: "SG001",
    nombre: "Silla Gamer Secretlab Titan",
    categoriaId: "SG",
    precioCLP: 349990,
    stock: 15,
    marca: "Secretlab",
    rating: 4.8,
    specs: ["Ergonómica", "Personalización ajustable", "Máximo confort"],
    descripcion: "Diseñada para el máximo confort, esta silla ofrece un soporte ergonómico y personalización ajustable para sesiones de juego prolongadas.",
    tags: ["silla", "secretlab", "ergonomica"],
    imagen: "assets/products/sg001.jpg"
  },

  // Mouse (MS)
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

  // Mousepad (MP)
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

  // Poleras Personalizadas (PP)
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

// Funciones auxiliares para manejo de productos
export const getProductByCode = (code) => {
  return PRODUCTS_LG.find(product => product.code === code);
};

export const getProductsByCategory = (categoriaId) => {
  return PRODUCTS_LG.filter(product => product.categoriaId === categoriaId);
};

export const searchProducts = (query) => {
  const searchTerm = query.toLowerCase();
  return PRODUCTS_LG.filter(product => 
    product.nombre.toLowerCase().includes(searchTerm) ||
    product.descripcion.toLowerCase().includes(searchTerm) ||
    product.tags.some(tag => tag.toLowerCase().includes(searchTerm))
  );
};

export const getFeaturedProducts = (limit = 6) => {
  return PRODUCTS_LG
    .filter(product => product.rating >= 4.5)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit);
};

// Validación de productos
export const validateProducts = () => {
  const errors = [];
  
  PRODUCTS_LG.forEach(product => {
    // Validar precio mínimo
    if (product.precioCLP < 5000) {
      errors.push(`${product.code}: Precio menor a 5.000 CLP`);
    }
    
    // Validar stock mínimo
    if (product.stock < 5) {
      errors.push(`${product.code}: Stock menor a 5 unidades`);
    }
    
    // Validar imagen
    if (!product.imagen || !product.imagen.includes('assets/products/')) {
      errors.push(`${product.code}: Ruta de imagen incorrecta`);
    }
  });
  
  return errors;
};

// Para uso con localStorage
export const saveToLocalStorage = () => {
  try {
    localStorage.setItem('levelup_products', JSON.stringify(PRODUCTS_LG));
    console.log('✅ Productos guardados en localStorage');
    return true;
  } catch (error) {
    console.error('❌ Error guardando productos:', error);
    return false;
  }
};

export const loadFromLocalStorage = () => {
  try {
    const stored = localStorage.getItem('levelup_products');
    if (stored) {
      const products = JSON.parse(stored);
      console.log('✅ Productos cargados desde localStorage');
      return products;
    }
    return PRODUCTS_LG;
  } catch (error) {
    console.error('❌ Error cargando productos:', error);
    return PRODUCTS_LG;
  }
};

// Inicialización automática para localStorage
if (typeof window !== 'undefined') {
  // Solo ejecutar en el navegador
  saveToLocalStorage();
}
