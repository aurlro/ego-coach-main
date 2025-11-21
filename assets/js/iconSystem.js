/**
 * Icon System - Icônes Lucide dynamiques
 * Wrapper autour de la bibliothèque Lucide Icons
 */

const ICON_MAPPING = {
    // Navigation & Actions
    home: 'layout-dashboard',
    journal: 'book',
    analyzeManual: 'clipboard-list',
    analyzeAI: 'sparkles',
    analyzeQuick: 'zap',
    guide: 'book-open',
    insights: 'lightbulb',

    // Actions communes
    save: 'save',
    delete: 'trash-2',
    copy: 'copy',
    edit: 'edit-2',
    refresh: 'refresh-cw',
    settings: 'settings',
    close: 'x',

    // Statuts
    success: 'check-circle',
    error: 'alert-circle',
    warning: 'alert-triangle',
    info: 'info',
    loading: 'loader-2', // spin class added manually if needed, but usually handled by caller or mapped

    // AI & Tech
    gemini: 'sparkles',
    ollama: 'box', // ou 'server', 'cpu'
    heuristic: 'brain-circuit',

    // Utility
    export: 'upload',
    import: 'download',
    upload: 'upload',
    download: 'download',
    filter: 'filter',

    // Ego types (psychology)
    ego_defensive: 'shield',
    ego_savior: 'heart-handshake', // or life-buoy
    ego_martyr: 'thermometer', // Metaphor for "sick/suffering"
    ego_lastword: 'gavel', // Judge/Verdict
    ego_refusal: 'ban',

    // Theme
    moon: 'moon',
    sun: 'sun',

    // Menu
    menu: 'menu',
    chevronRight: 'chevron-right',
    arrowRight: 'arrow-right',
    arrowLeft: 'arrow-left',

    // Validation specific
    checkCircle: 'check-circle',
    alertCircle: 'alert-circle',
    helpCircle: 'help-circle'
};

/**
 * Récupère le markup HTML pour une icône Lucide
 * @param {string} iconKey - Clé de l'icône (interne) ou nom direct Lucide
 * @param {object} options - Options {size, class}
 * @returns {string} HTML string (<i data-lucide="..."></i>)
 */
function getIcon(iconKey, options = {}) {
    const lucideName = ICON_MAPPING[iconKey] || iconKey; // Fallback to key if not mapped

    let className = options.class || '';

    // Gestion de la taille (si size est fourni, on suppose que c'est une classe Tailwind genre "w-5 h-5" ou juste un chiffre "5")
    if (options.size) {
        // Si c'est juste un chiffre, on convertit en classes Tailwind
        if (!isNaN(options.size)) {
             className += ` w-${options.size} h-${options.size}`;
        } else {
             // Sinon on ajoute tel quel (ex: "w-6 h-6")
             // Mais attention, l'ancien système faisait un replace regex.
             // Ici on concatène.
        }
    }

    // Cas spécial pour loading qui doit tourner
    if (iconKey === 'loading' || lucideName === 'loader-2') {
        if (!className.includes('animate-spin')) {
            className += ' animate-spin';
        }
    }

    return `<i data-lucide="${lucideName}" class="${className}"></i>`;
}

/**
 * Crée un élément d'icône avec options
 */
function createIconElement(iconKey, options = {}) {
    const div = document.createElement('span');
    div.innerHTML = getIcon(iconKey, options);
    if (options.containerClass) {
        div.className = options.containerClass;
    }
    // Important: On ne peut pas appeler lucide.createIcons() ici car l'élément n'est pas encore dans le DOM
    // Le caller doit appeler refreshIcons() après insertion.
    return div.firstChild;
}

/**
 * Rafraîchit les icônes Lucide dans toute la page ou un conteneur spécifique
 */
function refreshIcons(root = document) {
    if (window.lucide) {
        window.lucide.createIcons({
            root: root,
            attrs: {
                class: "lucide-icon" // Classe de base optionnelle
            }
        });
    }
}

/**
 * Retourne l'icône appropriée pour un ego
 */
function getEgoIcon(egoType) {
    const egoIcons = {
        'La Défensive': 'ego_defensive',
        'Le Sauveur': 'ego_savior',
        'Le Martyr': 'ego_martyr',
        'Le Dernier Mot': 'ego_lastword',
        "Refus d'influence": 'ego_refusal',
        'Inconnu': 'info'
    };

    return egoIcons[egoType] || 'info';
}

/**
 * Retourne l'icône pour un provider IA
 */
function getProviderIcon(provider) {
    const icons = {
        'gemini': 'gemini',
        'ollama': 'ollama',
        'heuristic': 'heuristic',
        'local': 'heuristic'
    };

    return icons[provider] || 'info';
}

/**
 * Retourne l'icône de statut
 */
function getStatusIcon(status) {
    const icons = {
        'success': 'success',
        'error': 'error',
        'warning': 'warning',
        'info': 'info',
        'loading': 'loading'
    };

    return icons[status] || 'info';
}

// Expose refreshIcons globally so other modules can use it
window.refreshIcons = refreshIcons;
