# 🎮 Level-Up Gamer - E-commerce Gamer

## 🚀 Descripción del Proyecto

**Level-Up Gamer** es una plataforma de e-commerce especializada en productos gaming con un diseño cyber futurista. El proyecto implementa una arquitectura modular y separada por secciones, con una interfaz moderna y funcionalidades completas de comercio electrónico.

### ✨ Características Principales

- **🎨 Diseño Cyber Gamer**: Tema futurista con colores neón (#39FF14, #1E90FF)
- **📱 Responsive Design**: Adaptable a todos los dispositivos
- **🔐 Sistema de Autenticación**: Login, registro y gestión de usuarios
- **🛒 Carrito de Compras**: Funcionalidad completa con persistencia
- **🎯 Gestión de Productos**: Catálogo dinámico con filtros y categorías
- **♿ Accesibilidad**: Cumple con estándares WCAG 2.1
- **🌐 Semantic HTML**: Estructura semántica con HTML5
- **⚡ Modularidad**: Arquitectura separada por secciones

## 📁 Estructura del Proyecto

```
/workspaces/DSY1104_CONTRERAS_SABELLE/
├── index.html                 # Página principal
├── assets/                    # Recursos estáticos
│   ├── css/
│   │   └── styles.css        # Estilos principales (Cyber Theme)
│   ├── js/
│   │   ├── main.js           # Funcionalidades principales
│   │   ├── cart.js           # Gestión del carrito
│   │   ├── products.js       # Gestión de productos
│   │   └── auth.js           # Sistema de autenticación
│   └── images/               # Imágenes y recursos gráficos
├── carrito/                  # Sección del carrito
│   └── index.html           # Página del carrito
├── productos/               # Sección de productos
│   ├── index.html          # Catálogo de productos
│   └── detalle.html        # Detalle del producto
└── usuario/                 # Sección de usuario
    ├── index.html          # Dashboard del usuario
    ├── login.html          # Página de login
    └── register.html       # Página de registro
```

## 🎨 Tema de Diseño

### Paleta de Colores
- **Fondo Principal**: `#0a0a0a` (Negro profundo)
- **Texto Principal**: `#ffffff` (Blanco)
- **Primario (Neón Verde)**: `#39FF14`
- **Secundario (Azul Eléctrico)**: `#1E90FF`
- **Superficie**: `#1a1a1a` (Gris oscuro)
- **Bordes**: `#333333`

### Tipografía
- **Títulos**: `Orbitron` (Futurista)
- **Texto General**: `Roboto` (Legible)

### Efectos Visuales
- ✨ Efectos de glow y neón
- 🎭 Transiciones suaves
- 💫 Animaciones de hover
- 🌟 Blur effects para modales

## 🔧 Funcionalidades Técnicas

### 📋 Sistema de Autenticación
- **Usuarios Demo Incluidos**:
  - `admin@levelup.com` / `admin123` (Administrador)
  - `user@levelup.com` / `user123` (Usuario estándar)
  - `gamer@levelup.com` / `gamer123` (Gamer pro)
  - `test@duocuc.cl` / `test123` (Estudiante con descuento)

- **Características**:
  - ✅ Validación en tiempo real
  - 🔒 Bloqueo por intentos fallidos
  - 💾 Persistencia de sesión
  - 🎓 Descuentos especiales para estudiantes Duoc UC

### 🛒 Sistema de Carrito
- **Funcionalidades**:
  - ➕ Agregar/quitar productos
  - 📊 Cálculo automático de totales
  - 💾 Persistencia local
  - 🎯 Gestión de cantidades
  - 💰 Aplicación de descuentos

### 🎮 Catálogo de Productos
- **Base de Datos de Productos**:
  - 🎮 Consolas (PlayStation, Xbox, Nintendo)
  - 🕹️ Videojuegos populares
  - 🎧 Accesorios gaming
  - ⌨️ Periféricos especializados

- **Características**:
  - 🔍 Sistema de filtros
  - 🏷️ Categorización automática
  - ⭐ Sistema de valoraciones
  - 💸 Gestión de precios y ofertas

### 🎯 Interfaz de Usuario
- **Componentes**:
  - 📋 Modales responsivos
  - 🔔 Sistema de notificaciones
  - 📱 Navegación mobile-first
  - 🎨 Formularios estilizados
  - 📊 Grids adaptativos

## 🚀 Instalación y Uso

### Requisitos Previos
- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Servidor local opcional (Live Server, Python SimpleHTTPServer, etc.)

### Instalación
1. **Clonar o descargar** el proyecto
2. **Abrir** `index.html` en un navegador
3. **Opcional**: Usar un servidor local para mejor experiencia

```bash
# Ejemplo con Python
cd /workspaces/DSY1104_CONTRERAS_SABELLE
python -m http.server 8000

# Ejemplo con Node.js (live-server)
npx live-server
```

### Navegación
1. **Página Principal** (`/index.html`): Landing page con productos destacados
2. **Productos** (`/productos/`): Catálogo completo con filtros
3. **Carrito** (`/carrito/`): Gestión de compras
4. **Usuario** (`/usuario/`): Login, registro y dashboard

## 🧪 Testing

### Usuarios de Prueba
```javascript
// Administrador
Email: admin@levelup.com
Password: admin123

// Usuario estándar
Email: user@levelup.com
Password: user123

// Gamer pro
Email: gamer@levelup.com
Password: gamer123

// Estudiante Duoc UC (con descuento 20%)
Email: test@duocuc.cl
Password: test123
```

### Flujos de Prueba
1. **Registro de usuario** → Validaciones → Dashboard
2. **Login** → Navegación → Logout
3. **Agregar productos** → Carrito → Checkout
4. **Filtros de productos** → Búsqueda → Detalle
5. **Responsive** → Mobile → Tablet → Desktop

## 📱 Responsive Design

### Breakpoints
- **Mobile**: `< 768px`
- **Tablet**: `768px - 1024px`
- **Desktop**: `> 1024px`

### Características Responsive
- 📱 Navegación mobile con hamburger menu
- 📊 Grids adaptativos (1-2-3-4 columnas)
- 🎯 Touch-friendly buttons
- 📝 Formularios optimizados
- 🖼️ Imágenes responsive

## ♿ Accesibilidad

### Implementaciones WCAG 2.1
- ✅ **Contraste de colores** adecuado
- ✅ **Navegación por teclado** completa
- ✅ **ARIA labels** en elementos interactivos
- ✅ **Estructura semántica** HTML5
- ✅ **Alt text** en imágenes
- ✅ **Focus indicators** visibles

### Elementos Semánticos
```html
<header>, <nav>, <main>, <section>, <article>, <aside>, <footer>
```

## 🔮 Tecnologías Utilizadas

### Frontend
- **HTML5**: Estructura semántica
- **CSS3**: Variables, Grid, Flexbox, Animations
- **JavaScript (ES6+)**: Módulos, Async/Await, LocalStorage
- **Google Fonts**: Roboto + Orbitron

### Características Avanzadas
- 🎨 **CSS Custom Properties** (Variables)
- 📱 **CSS Grid & Flexbox**
- ✨ **CSS Animations & Transitions**
- 🔧 **JavaScript Modules**
- 💾 **LocalStorage API**
- 🎯 **Event Delegation**

## 📊 Métricas del Proyecto

### Archivos de Código
- **HTML**: 6 archivos (Estructura completa)
- **CSS**: 1 archivo principal (1000+ líneas)
- **JavaScript**: 4 módulos especializados
- **Total LOC**: ~3000+ líneas

### Componentes Implementados
- ✅ 15+ Componentes UI
- ✅ 50+ Productos en BD
- ✅ 4 Tipos de usuario
- ✅ 6+ Categorías de productos
- ✅ 20+ Funciones JavaScript

## 🎯 Características Destacadas

### 🎮 Experiencia Gamer
- **Tema futurista** con efectos cyber
- **Productos gaming** especializados
- **Gamertags** y perfiles de jugador
- **Sistema de niveles** y puntos

### 💼 E-commerce Profesional
- **Carrito persistente** con LocalStorage
- **Sistema de descuentos** automático
- **Gestión de stock** simulada
- **Checkout process** completo

### 🔧 Arquitectura Moderna
- **Separación de responsabilidades**
- **Código modular** y reutilizable
- **Patrones de diseño** aplicados
- **Best practices** de desarrollo

## 🚀 Próximas Mejoras

### Funcionalidades Planeadas
- 🔔 **Web Push Notifications**
- 💳 **Integración de pagos** (Stripe/PayPal)
- 🔍 **Búsqueda avanzada** con filtros
- ⭐ **Sistema de reviews** y ratings
- 📱 **PWA** (Progressive Web App)
- 🌐 **Multi-idioma** (i18n)

### Optimizaciones Técnicas
- ⚡ **Code splitting** y lazy loading
- 🗜️ **Minificación** de assets
- 📊 **Analytics** integration
- 🔧 **Service Workers**
- 🎯 **Performance optimization**

## 👥 Información del Desarrollador

**Proyecto Académico - Duoc UC**
- **Asignatura**: DSY1104
- **Estudiante**: Contreras Sabelle
- **Institución**: Duoc UC
- **Año**: 2024

## 📄 Licencia

Este proyecto es de uso académico y fue desarrollado como parte del programa de estudios de Duoc UC.

---

**🎮 ¡Disfruta explorando Level-Up Gamer! 🚀**

*Desarrollado con 💚 para la comunidad gamer*
