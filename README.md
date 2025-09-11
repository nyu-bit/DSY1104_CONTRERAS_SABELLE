# Level-Up Gamer - E-commerce Gaming

## 📋 Descripción
Sitio web de e-commerce especializado en productos gaming con diseño profesional y sistema de gestión de carrito avanzado.

## 🎯 Características Principales

### ✅ Sistema de Diseño LG-001 a LG-009
- **LG-001**: Tipografía gamer (Orbitron + Roboto)
- **LG-002**: Paleta de colores gaming profesional
- **LG-003**: Espaciado y layout responsivo
- **LG-004**: Componentes de interfaz
- **LG-005**: Iconografía Font Awesome
- **LG-006**: Efectos visuales y animaciones
- **LG-007**: Carousel profesional informativo
- **LG-008**: Navegación coordinada con búsqueda
- **LG-009**: Sistema de carrito y usuario

### 🛍️ Funcionalidades E-commerce
- **Catálogo**: 10 productos gaming categorizados
- **Búsqueda**: Sistema de búsqueda extendida con sugerencias
- **Carrito**: Gestión completa de productos
- **Usuario**: Sistema de autenticación
- **Responsive**: Adaptado para todas las pantallas

## 📁 Estructura del Proyecto

```
# 🎮 LEVEL-UP GAMER - Tienda Gaming

## Descripción del Proyecto

**LEVEL-UP GAMER** es una tienda online especializada en productos gaming desarrollada como proyecto académico. Incluye un diseño moderno con estética cyber gamer, funcionalidades interactivas y una experiencia de usuario optimizada.

## 🚀 Características Principales

### ✅ Estructura HTML Semántica
- Uso completo de elementos semánticos (header, nav, main, section, article, footer)
- Navegación principal con logo y enlaces a todas las vistas
- Enlaces de navegación entre páginas internas

### ✅ Páginas Implementadas
- **HOME** - Hero, categorías, productos destacados
- **Productos** - Grid de productos con filtros y modal de detalle
- **Nosotros** - Presentación del equipo y caso de estudio
- **Blog/Noticias** - Artículos gaming con imágenes y descripciones
- **Contacto** - Formulario validado para comentarios
- **Registro/Login** - Autenticación con validación y persistencia

### ✅ Diseño y Estilos CSS
- **Paleta cyber gamer**: Fondo negro, verde neón (#39FF14), azul eléctrico (#00BFFF)
- **Tipografías**: Roboto (texto) y Orbitron (encabezados)
- **Responsive design**: Breakpoints para móvil, tablet y desktop
- **Variables CSS** en :root para colores, fuentes y breakpoints
- **Efectos visuales**: Bordes redondeados, sombras gamer, transiciones suaves
- **Accesibilidad**: Focus visible verde neón en todos los controles

### ✅ Funcionalidad JavaScript
- **Validación de formularios** en tiempo real con mensajes personalizados
- **Barra de búsqueda inteligente** con sugerencias dinámicas (LG-015)
- **Carrito de compras**: Añadir, eliminar, persistencia en localStorage
- **Navbar responsivo** con menú colapsable móvil
- **Notificaciones toast** al agregar productos
- **Modal de detalle** de productos
- **Animaciones** en hero, navbar y productos

### ✅ Características Avanzadas
- **Sistema de búsqueda LG-015**: Sugerencias a partir de 3 caracteres, debounce 250ms
- **Accesibilidad ARIA**: Roles, estados y propiedades para lectores de pantalla
- **LocalStorage**: Persistencia de carrito y usuarios simulados
- **Navegación por teclado**: Completa accesibilidad

## 📁 Estructura del Proyecto

```
LEVEL-UP-GAMER/
├── index.html                 # Página principal
├── README.md                  # Este archivo
├── assets/
│   ├── css/
│   │   ├── styles.css         # Estilos principales
│   │   └── search-gamer.css   # Estilos del buscador
│   ├── js/
│   │   ├── main.js           # Funcionalidad principal
│   │   ├── search-gamer.js   # Sistema de búsqueda
│   │   ├── cart.js           # Carrito de compras
│   │   ├── auth.js           # Autenticación
│   │   ├── navbar.js         # Navegación
│   │   ├── products.js       # Gestión de productos
│   │   └── products-database.js # Base de datos mock
│   └── images/               # Recursos gráficos
├── productos/
│   ├── index.html           # Catálogo de productos
│   └── detalle.html         # Detalle de producto
├── nosotros/
│   └── index.html           # Página Nosotros
├── blog/
│   └── index.html           # Blog/Noticias
├── contacto/
│   └── index.html           # Formulario de contacto
├── carrito/
│   └── index.html           # Carrito de compras
├── usuario/
│   ├── login.html           # Iniciar sesión
│   ├── register.html        # Registro
│   └── index.html           # Perfil de usuario
└── soporte/
    └── index.html           # Página de soporte
```

## 🛠️ Tecnologías Utilizadas

- **HTML5** - Estructura semántica
- **CSS3** - Diseño responsivo y animaciones
- **JavaScript ES6+** - Funcionalidad interactiva
- **LocalStorage** - Persistencia de datos
- **Font Awesome** - Iconografía
- **Google Fonts** - Tipografías Roboto y Orbitron

## 🎨 Paleta de Colores

- **Negro**: #000000 (Fondo principal)
- **Verde Neón**: #39FF14 (Acentos principales)
- **Azul Eléctrico**: #00BFFF (Acentos secundarios)
- **Blanco**: #FFFFFF (Texto principal)
- **Gris**: #888888 (Texto secundario)

## 📱 Responsive Design

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## ⚡ Características de Rendimiento

- **Debounce** en búsqueda (250ms)
- **Lazy loading** de imágenes
- **Optimización CSS** con variables
- **JavaScript modular** y reutilizable

## 🧪 Testing y Validación

- ✅ Validación HTML5
- ✅ Accesibilidad WCAG 2.1
- ✅ Responsive testing
- ✅ Compatibilidad cross-browser
- ✅ Performance testing

## 👥 Equipo de Desarrollo

- **Desarrollador Frontend**: Contreras Sabelle
- **Proyecto**: DSY1104 - Desarrollo de Sitios Web
- **Institución**: Académica
- **Fecha**: Septiembre 2025

## 🚀 Instalación y Uso

1. **Clonar el repositorio**:
   ```bash
   git clone https://github.com/nyu-bit/DSY1104_CONTRERAS_SABELLE.git
   ```

2. **Abrir el proyecto**:
   - Abrir `index.html` en un navegador web
   - O usar un servidor local como Live Server

3. **Explorar funcionalidades**:
   - Navegar entre páginas
   - Probar la búsqueda escribiendo 3+ caracteres
   - Añadir productos al carrito
   - Registrarse/iniciar sesión
   - Completar formularios

## 📋 Requerimientos Cumplidos

### Evaluación 1 - Completado ✅

- ✅ Estructura HTML semántica
- ✅ Navegación principal completa
- ✅ Elementos visuales e interactivos
- ✅ Diseño CSS con paleta cyber gamer
- ✅ Funcionalidad JavaScript avanzada
- ✅ Todas las vistas/páginas requeridas
- ✅ Accesibilidad implementada
- ✅ Usabilidad y experiencia optimizada
- ✅ Control de versiones con Git

## 🔧 Funcionalidades Destacadas

### Sistema de Búsqueda LG-015
- Sugerencias dinámicas inteligentes
- Búsqueda por nombre, código y tags
- Navegación por teclado completa
- Accesibilidad ARIA implementada

### Carrito de Compras
- Persistencia en localStorage
- Contador dinámico de ítems
- Notificaciones toast
- Interfaz intuitiva

### Autenticación Mock
- Validación en tiempo real
- Reglas de negocio (edad, email)
- Persistencia de sesión
- Feedback visual

## 📞 Contacto

- **Proyecto**: LEVEL-UP GAMER
- **Repositorio**: [GitHub](https://github.com/nyu-bit/DSY1104_CONTRERAS_SABELLE)
- **Curso**: DSY1104 - Desarrollo de Sitios Web
- **Año**: 2025

---

**🎮 ¡Disfruta explorando LEVEL-UP GAMER! 🎮**
├── index.html                 # Página principal
├── assets/
│   ├── css/
│   │   └── styles.css         # Estilos principales LG
│   ├── js/
│   │   ├── products-database.js    # Base de datos de productos
│   │   ├── carousel-pro.js         # Carousel profesional
│   │   ├── search.js              # Sistema de búsqueda
│   │   ├── cart.js                # Gestión del carrito
│   │   ├── ui-components.js       # Componentes UI
│   │   ├── main.js                # Funcionalidad principal
│   │   ├── auth.js                # Autenticación
│   │   ├── accessibility.js       # Accesibilidad
│   │   └── responsive.js          # Responsive
│   └── products/              # Imágenes de productos
├── productos/                 # Páginas de productos
├── carrito/                   # Página del carrito
├── usuario/                   # Páginas de usuario
└── soporte/                   # Página de soporte
```

## 🚀 Tecnologías Utilizadas
- **HTML5**: Estructura semántica
- **CSS3**: Grid, Flexbox, Custom Properties
- **JavaScript ES6+**: Módulos, Classes, LocalStorage
- **Font Awesome**: Iconografía
- **Google Fonts**: Tipografía Orbitron y Roboto

## 📱 Responsive Design
- **Desktop**: Layout completo con navbar de 4 columnas
- **Tablet**: Diseño adaptado y compacto
- **Móvil**: Layout apilado optimizado

## 🎮 Tema Gaming
Diseño inspirado en la estética gaming moderna con:
- Colores neón y gradientes
- Efectos de glow y animaciones
- Tipografía futurista
- Interfaz intuitiva y profesional

## 👥 Autores
- **María Contreras**
- **Angel Sabelle**

## 📚 Curso
**DSY1104** - Desarrollo Web Frontend
