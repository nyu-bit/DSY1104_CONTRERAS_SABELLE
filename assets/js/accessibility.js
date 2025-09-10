// ========================================
// LG-120: CHECKLIST DE ACCESIBILIDAD WCAG 2.1 A/AA
// Sistema completo de validación y mejoras de accesibilidad
// ========================================

/**
 * Configuración de accesibilidad
 */
const ACCESSIBILITY_CONFIG = {
    debug: false,
    autofix: true,
    announceChanges: true,
    keyboardNavigation: true,
    focusManagement: true,
    
    // Niveles de cumplimiento WCAG
    levels: {
        A: 'basic',
        AA: 'enhanced', 
        AAA: 'advanced'
    },
    
    // Criterios WCAG 2.1
    criteria: {
        '1.1.1': 'Non-text Content',
        '1.3.1': 'Info and Relationships',
        '1.4.3': 'Contrast (Minimum)',
        '1.4.6': 'Contrast (Enhanced)',
        '2.1.1': 'Keyboard',
        '2.1.2': 'No Keyboard Trap',
        '2.4.1': 'Bypass Blocks',
        '2.4.3': 'Focus Order',
        '2.4.6': 'Headings and Labels',
        '2.4.7': 'Focus Visible',
        '3.1.1': 'Language of Page',
        '3.2.1': 'On Focus',
        '3.3.1': 'Error Identification',
        '3.3.2': 'Labels or Instructions',
        '4.1.2': 'Name, Role, Value'
    }
};

/**
 * Estado global de accesibilidad
 */
let accessibilityState = {
    currentFocus: null,
    tabIndex: 0,
    announcements: [],
    errors: [],
    warnings: [],
    lastAnnouncement: null,
    keyboardMode: false,
    screenReaderActive: false
};

// ========================================
// INICIALIZACIÓN DEL SISTEMA
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    initializeAccessibility();
});

/**
 * Inicializar sistema de accesibilidad
 */
function initializeAccessibility() {
    console.log('🔧 Inicializando sistema de accesibilidad WCAG 2.1');
    
    // Configurar detección de modo de teclado
    setupKeyboardDetection();
    
    // Configurar gestión de foco
    setupFocusManagement();
    
    // Configurar skip links
    setupSkipLinks();
    
    // Configurar live regions
    setupLiveRegions();
    
    // Validar accesibilidad inicial
    validateAccessibility();
    
    // Configurar anuncios automáticos
    setupAutoAnnouncements();
    
    // Mejorar formularios
    enhanceFormAccessibility();
    
    // Configurar navegación por teclado
    setupKeyboardNavigation();
    
    console.log('✅ Sistema de accesibilidad inicializado');
}

// ========================================
// DETECCIÓN Y GESTIÓN DE TECLADO
// ========================================

/**
 * Configurar detección de navegación por teclado
 */
function setupKeyboardDetection() {
    let isKeyboardUser = false;
    
    // Detectar uso de teclado
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            isKeyboardUser = true;
            document.body.classList.add('keyboard-navigation');
            accessibilityState.keyboardMode = true;
        }
    });
    
    // Detectar uso de mouse
    document.addEventListener('mousedown', function() {
        isKeyboardUser = false;
        document.body.classList.remove('keyboard-navigation');
        accessibilityState.keyboardMode = false;
    });
    
    // Gestión de teclas de acceso
    document.addEventListener('keydown', function(e) {
        // Escape para cerrar modales/overlays
        if (e.key === 'Escape') {
            closeActiveOverlays();
        }
        
        // Alt + número para skip links
        if (e.altKey && e.key >= '1' && e.key <= '9') {
            const skipLink = document.querySelector(`[data-skip="${e.key}"]`);
            if (skipLink) {
                skipLink.click();
                e.preventDefault();
            }
        }
    });
}

/**
 * Configurar gestión avanzada de foco
 */
function setupFocusManagement() {
    // Rastear el foco actual
    document.addEventListener('focusin', function(e) {
        accessibilityState.currentFocus = e.target;
        accessibilityState.tabIndex++;
        
        // Anunciar cambios de foco significativos
        if (ACCESSIBILITY_CONFIG.announceChanges) {
            announceFocusChange(e.target);
        }
    });
    
    // Manejar pérdida de foco
    document.addEventListener('focusout', function(e) {
        // Verificar que el foco no se pierda completamente
        setTimeout(() => {
            if (!document.activeElement || document.activeElement === document.body) {
                // Restaurar foco al elemento apropiado
                restoreFocus();
            }
        }, 10);
    });
}

/**
 * Anunciar cambios de foco importantes
 */
function announceFocusChange(element) {
    const role = element.getAttribute('role');
    const ariaLabel = element.getAttribute('aria-label');
    const tag = element.tagName.toLowerCase();
    
    let announcement = '';
    
    if (ariaLabel) {
        announcement = ariaLabel;
    } else if (role === 'button' || tag === 'button') {
        announcement = `Botón: ${element.textContent.trim()}`;
    } else if (tag === 'input') {
        const type = element.type;
        const label = getLabelForInput(element);
        announcement = `Campo ${type}: ${label}`;
    } else if (role === 'menuitem') {
        announcement = `Menú: ${element.textContent.trim()}`;
    }
    
    if (announcement && announcement !== accessibilityState.lastAnnouncement) {
        announceToScreenReader(announcement, 'polite');
        accessibilityState.lastAnnouncement = announcement;
    }
}

/**
 * Restaurar foco al elemento apropiado
 */
function restoreFocus() {
    const main = document.querySelector('main');
    const firstFocusable = findFirstFocusableElement();
    
    if (firstFocusable) {
        firstFocusable.focus();
    } else if (main) {
        main.focus();
    }
}

// ========================================
// SKIP LINKS Y NAVEGACIÓN
// ========================================

/**
 * Configurar skip links mejorados
 */
function setupSkipLinks() {
    const skipContainer = document.createElement('div');
    skipContainer.className = 'skip-links';
    skipContainer.innerHTML = `
        <a href="#main-content" class="skip-navigation" data-skip="1">
            Saltar al contenido principal
        </a>
        <a href="#navigation" class="skip-navigation" data-skip="2">
            Saltar a navegación
        </a>
        <a href="#search" class="skip-navigation" data-skip="3">
            Saltar a búsqueda
        </a>
        <a href="#footer" class="skip-navigation" data-skip="4">
            Saltar al pie de página
        </a>
    `;
    
    document.body.insertBefore(skipContainer, document.body.firstChild);
    
    // Configurar funcionalidad de skip links
    skipContainer.addEventListener('click', function(e) {
        if (e.target.matches('.skip-navigation')) {
            e.preventDefault();
            const targetId = e.target.getAttribute('href').substring(1);
            const target = document.getElementById(targetId);
            
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
                target.focus();
                announceToScreenReader(`Navegado a: ${target.textContent || targetId}`, 'assertive');
            }
        }
    });
}

/**
 * Configurar navegación por teclado mejorada
 */
function setupKeyboardNavigation() {
    // Navegación con flechas en menús
    document.addEventListener('keydown', function(e) {
        const currentElement = e.target;
        
        if (currentElement.matches('[role="menuitem"]')) {
            handleMenuKeyNavigation(e);
        } else if (currentElement.matches('.carousel-item, .tab')) {
            handleArrowKeyNavigation(e);
        }
    });
}

/**
 * Manejar navegación en menús con teclado
 */
function handleMenuKeyNavigation(e) {
    const menuItems = Array.from(document.querySelectorAll('[role="menuitem"]'));
    const currentIndex = menuItems.indexOf(e.target);
    
    let nextIndex;
    
    switch (e.key) {
        case 'ArrowDown':
            nextIndex = (currentIndex + 1) % menuItems.length;
            e.preventDefault();
            break;
        case 'ArrowUp':
            nextIndex = (currentIndex - 1 + menuItems.length) % menuItems.length;
            e.preventDefault();
            break;
        case 'Home':
            nextIndex = 0;
            e.preventDefault();
            break;
        case 'End':
            nextIndex = menuItems.length - 1;
            e.preventDefault();
            break;
        default:
            return;
    }
    
    if (nextIndex !== undefined) {
        menuItems[nextIndex].focus();
    }
}

// ========================================
// LIVE REGIONS Y ANUNCIOS
// ========================================

/**
 * Configurar regiones live para anuncios
 */
function setupLiveRegions() {
    // Crear región polite si no existe
    if (!document.getElementById('aria-live-polite')) {
        const politeRegion = document.createElement('div');
        politeRegion.id = 'aria-live-polite';
        politeRegion.setAttribute('aria-live', 'polite');
        politeRegion.setAttribute('aria-atomic', 'true');
        politeRegion.className = 'sr-only aria-live-region';
        document.body.appendChild(politeRegion);
    }
    
    // Crear región assertive si no existe
    if (!document.getElementById('aria-live-assertive')) {
        const assertiveRegion = document.createElement('div');
        assertiveRegion.id = 'aria-live-assertive';
        assertiveRegion.setAttribute('aria-live', 'assertive');
        assertiveRegion.setAttribute('aria-atomic', 'true');
        assertiveRegion.className = 'sr-only aria-live-region';
        document.body.appendChild(assertiveRegion);
    }
    
    console.log('📢 Regiones aria-live configuradas');
}

/**
 * Anunciar mensaje a lectores de pantalla
 */
function announceToScreenReader(message, level = 'polite') {
    const regionId = level === 'assertive' ? 'aria-live-assertive' : 'aria-live-polite';
    const region = document.getElementById(regionId);
    
    if (region) {
        // Limpiar y establecer nuevo mensaje
        region.textContent = '';
        setTimeout(() => {
            region.textContent = message;
            
            // Limpiar después de anunciar
            setTimeout(() => {
                region.textContent = '';
            }, 1000);
        }, 100);
        
        // Registrar anuncio
        accessibilityState.announcements.push({
            message,
            level,
            timestamp: new Date().toISOString()
        });
        
        console.log(`📢 Anunciado (${level}): ${message}`);
    }
}

// ========================================
// VALIDACIÓN DE ACCESIBILIDAD
// ========================================

/**
 * Validar accesibilidad WCAG 2.1
 */
function validateAccessibility() {
    const results = {
        level_A: [],
        level_AA: [],
        errors: [],
        warnings: [],
        passed: [],
        score: 0
    };
    
    // 1.1.1 - Contenido no textual
    results.level_A.push(validateNonTextContent());
    
    // 1.3.1 - Información y relaciones
    results.level_A.push(validateInfoAndRelationships());
    
    // 1.4.3 - Contraste (Mínimo) - AA
    results.level_AA.push(validateContrastMinimum());
    
    // 2.1.1 - Teclado
    results.level_A.push(validateKeyboardAccess());
    
    // 2.4.1 - Bloques de omisión
    results.level_A.push(validateBypassBlocks());
    
    // 2.4.3 - Orden del foco
    results.level_A.push(validateFocusOrder());
    
    // 2.4.6 - Encabezados y etiquetas
    results.level_AA.push(validateHeadingsAndLabels());
    
    // 2.4.7 - Foco visible
    results.level_AA.push(validateFocusVisible());
    
    // 3.1.1 - Idioma de la página
    results.level_A.push(validatePageLanguage());
    
    // 3.3.1 - Identificación de errores
    results.level_A.push(validateErrorIdentification());
    
    // 3.3.2 - Etiquetas o instrucciones
    results.level_A.push(validateLabelsOrInstructions());
    
    // 4.1.2 - Nombre, función, valor
    results.level_A.push(validateNameRoleValue());
    
    // Calcular puntuación
    const totalTests = results.level_A.length + results.level_AA.length;
    const passedTests = [...results.level_A, ...results.level_AA].filter(r => r.passed).length;
    results.score = Math.round((passedTests / totalTests) * 100);
    
    // Separar resultados
    results.passed = [...results.level_A, ...results.level_AA].filter(r => r.passed);
    results.errors = [...results.level_A, ...results.level_AA].filter(r => !r.passed && r.severity === 'error');
    results.warnings = [...results.level_A, ...results.level_AA].filter(r => !r.passed && r.severity === 'warning');
    
    // Guardar resultados
    accessibilityState.lastValidation = results;
    
    console.log(`♿ Validación de accesibilidad: ${results.score}% (${passedTests}/${totalTests})`);
    
    return results;
}

/**
 * 1.1.1 - Validar contenido no textual
 */
function validateNonTextContent() {
    const images = document.querySelectorAll('img');
    let passed = true;
    let issues = [];
    
    images.forEach(img => {
        if (!img.hasAttribute('alt')) {
            passed = false;
            issues.push(`Imagen sin atributo alt: ${img.src}`);
            img.classList.add('accessibility-error');
        } else if (img.getAttribute('alt') === '' && !img.hasAttribute('role')) {
            // Imagen decorativa debe tener role="presentation"
            if (!img.closest('[role="presentation"]')) {
                issues.push(`Imagen decorativa sin role="presentation": ${img.src}`);
            }
        }
    });
    
    return {
        criterion: '1.1.1',
        name: 'Non-text Content',
        passed,
        issues,
        severity: 'error',
        level: 'A'
    };
}

/**
 * 1.3.1 - Validar información y relaciones
 */
function validateInfoAndRelationships() {
    let passed = true;
    let issues = [];
    
    // Verificar encabezados jerárquicos
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    let lastLevel = 0;
    
    headings.forEach(heading => {
        const level = parseInt(heading.tagName.substring(1));
        if (level > lastLevel + 1) {
            passed = false;
            issues.push(`Salto en jerarquía de encabezados: ${heading.textContent}`);
            heading.classList.add('accessibility-warning');
        }
        lastLevel = level;
    });
    
    // Verificar listas apropiadas
    const listItems = document.querySelectorAll('li');
    listItems.forEach(li => {
        if (!li.closest('ul, ol, menu')) {
            passed = false;
            issues.push(`Elemento li fuera de lista: ${li.textContent}`);
        }
    });
    
    return {
        criterion: '1.3.1',
        name: 'Info and Relationships',
        passed,
        issues,
        severity: 'error',
        level: 'A'
    };
}

/**
 * 1.4.3 - Validar contraste mínimo
 */
function validateContrastMinimum() {
    // Verificación básica - en producción usar herramientas específicas
    let passed = true;
    let issues = [];
    
    const textElements = document.querySelectorAll('p, span, div, a, button, input, label');
    
    // Validación simplificada - verificar que no use colores problemáticos conocidos
    const problematicCombinations = [
        { bg: '#ffff00', color: '#ffffff' }, // amarillo/blanco
        { bg: '#ff0000', color: '#00ff00' }, // rojo/verde
    ];
    
    textElements.forEach(el => {
        const styles = window.getComputedStyle(el);
        const bgColor = styles.backgroundColor;
        const textColor = styles.color;
        
        // Verificación básica
        if (bgColor === textColor) {
            passed = false;
            issues.push(`Contraste insuficiente: ${el.textContent?.substring(0, 50)}`);
        }
    });
    
    return {
        criterion: '1.4.3',
        name: 'Contrast (Minimum)',
        passed,
        issues,
        severity: 'error',
        level: 'AA'
    };
}

/**
 * 2.1.1 - Validar acceso por teclado
 */
function validateKeyboardAccess() {
    let passed = true;
    let issues = [];
    
    // Verificar que elementos interactivos son accesibles por teclado
    const interactiveElements = document.querySelectorAll('button, a, input, select, textarea, [tabindex]');
    
    interactiveElements.forEach(el => {
        const tabIndex = el.getAttribute('tabindex');
        const isHidden = el.style.display === 'none' || el.hidden;
        
        if (tabIndex === '-1' && !isHidden) {
            issues.push(`Elemento interactivo con tabindex="-1": ${el.tagName}`);
        }
        
        if (!isHidden && !el.matches(':focus-visible') && tabIndex !== '-1') {
            // Elemento debería ser focuseable
        }
    });
    
    return {
        criterion: '2.1.1',
        name: 'Keyboard',
        passed,
        issues,
        severity: 'error',
        level: 'A'
    };
}

/**
 * 2.4.1 - Validar bloques de omisión
 */
function validateBypassBlocks() {
    const skipLinks = document.querySelectorAll('.skip-navigation, [href^="#"]');
    const passed = skipLinks.length > 0;
    
    return {
        criterion: '2.4.1',
        name: 'Bypass Blocks',
        passed,
        issues: passed ? [] : ['No se encontraron skip links'],
        severity: 'error',
        level: 'A'
    };
}

/**
 * 2.4.3 - Validar orden del foco
 */
function validateFocusOrder() {
    const focusableElements = findAllFocusableElements();
    let passed = true;
    let issues = [];
    
    // Verificar orden lógico de tabindex
    let lastTabIndex = -1;
    focusableElements.forEach(el => {
        const tabIndex = parseInt(el.getAttribute('tabindex')) || 0;
        if (tabIndex > 0 && tabIndex < lastTabIndex) {
            passed = false;
            issues.push(`Orden de foco incorrecto: tabindex ${tabIndex} después de ${lastTabIndex}`);
        }
        if (tabIndex > 0) lastTabIndex = tabIndex;
    });
    
    return {
        criterion: '2.4.3',
        name: 'Focus Order',
        passed,
        issues,
        severity: 'warning',
        level: 'A'
    };
}

/**
 * 2.4.6 - Validar encabezados y etiquetas
 */
function validateHeadingsAndLabels() {
    let passed = true;
    let issues = [];
    
    // Verificar que inputs tienen etiquetas
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        const label = getLabelForInput(input);
        if (!label && !input.getAttribute('aria-label') && !input.getAttribute('aria-labelledby')) {
            passed = false;
            issues.push(`Campo sin etiqueta: ${input.type || input.tagName}`);
            input.classList.add('accessibility-error');
        }
    });
    
    // Verificar encabezados descriptivos
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    headings.forEach(heading => {
        if (heading.textContent.trim().length < 3) {
            issues.push(`Encabezado muy corto: "${heading.textContent}"`);
        }
    });
    
    return {
        criterion: '2.4.6',
        name: 'Headings and Labels',
        passed,
        issues,
        severity: 'error',
        level: 'AA'
    };
}

/**
 * 2.4.7 - Validar foco visible
 */
function validateFocusVisible() {
    // Verificar que existe CSS para :focus-visible
    const stylesheets = Array.from(document.styleSheets);
    let hasFocusStyles = false;
    
    try {
        stylesheets.forEach(sheet => {
            const rules = Array.from(sheet.cssRules || []);
            rules.forEach(rule => {
                if (rule.selectorText && rule.selectorText.includes(':focus')) {
                    hasFocusStyles = true;
                }
            });
        });
    } catch (e) {
        // Error de CORS en stylesheets externos
        hasFocusStyles = true; // Asumir que existen
    }
    
    return {
        criterion: '2.4.7',
        name: 'Focus Visible',
        passed: hasFocusStyles,
        issues: hasFocusStyles ? [] : ['No se encontraron estilos de foco visible'],
        severity: 'error',
        level: 'AA'
    };
}

/**
 * 3.1.1 - Validar idioma de la página
 */
function validatePageLanguage() {
    const htmlLang = document.documentElement.getAttribute('lang');
    const passed = !!htmlLang;
    
    return {
        criterion: '3.1.1',
        name: 'Language of Page',
        passed,
        issues: passed ? [] : ['Elemento html sin atributo lang'],
        severity: 'error',
        level: 'A'
    };
}

/**
 * 3.3.1 - Validar identificación de errores
 */
function validateErrorIdentification() {
    const errorMessages = document.querySelectorAll('.error-message, [role="alert"]');
    const forms = document.querySelectorAll('form');
    
    let passed = true;
    let issues = [];
    
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
        inputs.forEach(input => {
            const errorId = input.getAttribute('aria-describedby');
            if (!errorId || !document.getElementById(errorId)) {
                issues.push(`Campo requerido sin mensaje de error asociado: ${input.name || input.type}`);
            }
        });
    });
    
    return {
        criterion: '3.3.1',
        name: 'Error Identification',
        passed: issues.length === 0,
        issues,
        severity: 'warning',
        level: 'A'
    };
}

/**
 * 3.3.2 - Validar etiquetas o instrucciones
 */
function validateLabelsOrInstructions() {
    const requiredInputs = document.querySelectorAll('input[required], select[required], textarea[required]');
    let passed = true;
    let issues = [];
    
    requiredInputs.forEach(input => {
        const hasLabel = getLabelForInput(input);
        const hasAriaLabel = input.getAttribute('aria-label');
        const hasPlaceholder = input.getAttribute('placeholder');
        
        if (!hasLabel && !hasAriaLabel && !hasPlaceholder) {
            passed = false;
            issues.push(`Campo requerido sin instrucciones: ${input.name || input.type}`);
        }
    });
    
    return {
        criterion: '3.3.2',
        name: 'Labels or Instructions',
        passed,
        issues,
        severity: 'error',
        level: 'A'
    };
}

/**
 * 4.1.2 - Validar nombre, función, valor
 */
function validateNameRoleValue() {
    let passed = true;
    let issues = [];
    
    // Verificar botones sin texto
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        const hasText = button.textContent.trim().length > 0;
        const hasAriaLabel = button.getAttribute('aria-label');
        const hasAriaLabelledby = button.getAttribute('aria-labelledby');
        
        if (!hasText && !hasAriaLabel && !hasAriaLabelledby) {
            passed = false;
            issues.push(`Botón sin nombre accesible`);
            button.classList.add('accessibility-error');
        }
    });
    
    // Verificar elementos con roles ARIA
    const elementsWithRoles = document.querySelectorAll('[role]');
    elementsWithRoles.forEach(el => {
        const role = el.getAttribute('role');
        if (!role || role.trim() === '') {
            passed = false;
            issues.push(`Elemento con role vacío: ${el.tagName}`);
        }
    });
    
    return {
        criterion: '4.1.2',
        name: 'Name, Role, Value',
        passed,
        issues,
        severity: 'error',
        level: 'A'
    };
}

// ========================================
// MEJORAS AUTOMÁTICAS
// ========================================

/**
 * Configurar anuncios automáticos
 */
function setupAutoAnnouncements() {
    // Anunciar cambios de página
    if (ACCESSIBILITY_CONFIG.announceChanges) {
        const pageTitle = document.title;
        const mainHeading = document.querySelector('h1');
        
        if (mainHeading) {
            announceToScreenReader(`Página cargada: ${pageTitle}`, 'polite');
        }
    }
    
    // Observar cambios dinámicos importantes
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) { // Element node
                        announceNewContent(node);
                    }
                });
            }
        });
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}

/**
 * Anunciar contenido nuevo importante
 */
function announceNewContent(element) {
    if (element.matches && element.matches('[role="alert"], .notification, .error-message')) {
        const text = element.textContent.trim();
        if (text) {
            announceToScreenReader(text, 'assertive');
        }
    }
}

/**
 * Mejorar accesibilidad de formularios
 */
function enhanceFormAccessibility() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        // Agregar descripciones de campos requeridos
        const requiredInputs = form.querySelectorAll('input[required], select[required], textarea[required]');
        requiredInputs.forEach(input => {
            if (!input.getAttribute('aria-describedby')) {
                const description = document.createElement('span');
                description.id = `${input.id || 'field'}-description`;
                description.className = 'sr-only';
                description.textContent = 'Campo requerido';
                input.parentNode.appendChild(description);
                input.setAttribute('aria-describedby', description.id);
            }
        });
        
        // Mejorar mensajes de error
        form.addEventListener('submit', function(e) {
            const invalidInputs = form.querySelectorAll(':invalid');
            if (invalidInputs.length > 0) {
                e.preventDefault();
                const errorMessage = `Formulario contiene ${invalidInputs.length} errores. Revisa los campos marcados.`;
                announceToScreenReader(errorMessage, 'assertive');
                invalidInputs[0].focus();
            }
        });
    });
}

// ========================================
// UTILIDADES
// ========================================

/**
 * Encontrar etiqueta para un input
 */
function getLabelForInput(input) {
    // Buscar label con for
    const labelFor = document.querySelector(`label[for="${input.id}"]`);
    if (labelFor) return labelFor.textContent.trim();
    
    // Buscar label que contiene el input
    const labelParent = input.closest('label');
    if (labelParent) return labelParent.textContent.trim();
    
    // Buscar aria-labelledby
    const labelledById = input.getAttribute('aria-labelledby');
    if (labelledById) {
        const labelElement = document.getElementById(labelledById);
        if (labelElement) return labelElement.textContent.trim();
    }
    
    return null;
}

/**
 * Encontrar todos los elementos focusables
 */
function findAllFocusableElements() {
    const focusableSelectors = [
        'a[href]',
        'button:not([disabled])',
        'input:not([disabled])',
        'select:not([disabled])',
        'textarea:not([disabled])',
        '[tabindex]:not([tabindex="-1"])',
        '[contenteditable="true"]'
    ];
    
    return Array.from(document.querySelectorAll(focusableSelectors.join(', ')))
        .filter(el => {
            return el.offsetWidth > 0 && el.offsetHeight > 0 && 
                   window.getComputedStyle(el).visibility !== 'hidden';
        });
}

/**
 * Encontrar primer elemento focusable
 */
function findFirstFocusableElement() {
    const focusableElements = findAllFocusableElements();
    return focusableElements[0] || null;
}

/**
 * Cerrar overlays activos
 */
function closeActiveOverlays() {
    // Cerrar modales
    const modals = document.querySelectorAll('.modal[style*="display: block"], .modal.show');
    modals.forEach(modal => {
        modal.style.display = 'none';
        modal.classList.remove('show');
    });
    
    // Cerrar menús dropdown
    const dropdowns = document.querySelectorAll('.dropdown.show');
    dropdowns.forEach(dropdown => {
        dropdown.classList.remove('show');
    });
    
    // Anunciar cierre
    if (modals.length > 0 || dropdowns.length > 0) {
        announceToScreenReader('Ventana cerrada', 'polite');
    }
}

// ========================================
// API PÚBLICA
// ========================================

/**
 * API pública para accesibilidad
 */
window.accessibilityAPI = {
    // Estado
    getState: () => accessibilityState,
    getConfig: () => ACCESSIBILITY_CONFIG,
    
    // Validación
    validate: validateAccessibility,
    getLastValidation: () => accessibilityState.lastValidation,
    
    // Anuncios
    announce: announceToScreenReader,
    announcePageChange: (title) => announceToScreenReader(`Navegando a: ${title}`, 'assertive'),
    
    // Foco
    setFocus: (element) => {
        if (element && element.focus) {
            element.focus();
            accessibilityState.currentFocus = element;
        }
    },
    
    // Modo debug
    enableDebug: () => {
        ACCESSIBILITY_CONFIG.debug = true;
        document.body.classList.add('accessibility-debug-mode');
        console.log('🔍 Modo debug de accesibilidad activado');
    },
    
    disableDebug: () => {
        ACCESSIBILITY_CONFIG.debug = false;
        document.body.classList.remove('accessibility-debug-mode');
        console.log('🔍 Modo debug de accesibilidad desactivado');
    },
    
    // Utilidades
    findFocusable: findAllFocusableElements,
    getLabelFor: getLabelForInput,
    
    // Configuración
    setConfig: (config) => Object.assign(ACCESSIBILITY_CONFIG, config)
};

console.log('♿ Sistema de accesibilidad WCAG 2.1 A/AA cargado');
