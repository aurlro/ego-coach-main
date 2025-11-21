/**
 * Security Module - Fonctions de sécurité centralisées
 * XSS Prevention, Input Validation, Content Security
 */

/**
 * Échappe les caractères HTML pour prévenir les injections XSS
 * @param {string} text - Texte à échapper
 * @returns {string} - Texte échappé
 */
function escapeHTML(text) {
    if (typeof text !== 'string') {
        return '';
    }
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Crée un élément texte sécurisé (pas de HTML)
 * @param {string} text - Texte à afficher
 * @returns {Text} - Text node sécurisé
 */
function createSafeTextNode(text) {
    return document.createTextNode(typeof text === 'string' ? text : '');
}

/**
 * Valide et nettoie les données JSON importées
 * @param {any} data - Données à valider
 * @returns {Object|Array} - Données validées ou null
 */
function validateImportedData(data) {
    if (!Array.isArray(data)) {
        throw new Error('Format JSON invalide : doit être un tableau');
    }

    if (data.length === 0) {
        return [];
    }

    if (data.length > 1000) {
        throw new Error('Trop d\'entrées (max 1000)');
    }

    // Valider chaque entrée
    return data.map((entry, index) => {
        if (typeof entry !== 'object' || entry === null) {
            throw new Error(`Entrée ${index} invalide : doit être un objet`);
        }

        const validated = {};

        // ID validation
        if (typeof entry.id !== 'string' || !/^[a-zA-Z0-9_-]{10,}$/.test(entry.id)) {
            throw new Error(`Entrée ${index} : ID invalide`);
        }
        validated.id = entry.id;

        // CreatedAt validation (ISO 8601)
        if (typeof entry.createdAt !== 'string' || !isValidISO8601(entry.createdAt)) {
            throw new Error(`Entrée ${index} : Date invalide`);
        }
        validated.createdAt = entry.createdAt;

        // Context (max 5000 caractères)
        if (typeof entry.context === 'string') {
            validated.context = entry.context.substring(0, 5000);
        } else {
            throw new Error(`Entrée ${index} : Context invalide`);
        }

        // Summary (max 10000 caractères)
        if (typeof entry.summary === 'string') {
            validated.summary = entry.summary.substring(0, 10000);
        }

        // Ego (liste autorisée)
        const allowedEgos = [
            'La Défensive',
            'Le Sauveur',
            'Le Martyr',
            'Le Dernier Mot',
            'Le Refus d\'influence',
            'Inconnu'
        ];
        validated.ego = allowedEgos.includes(entry.ego) ? entry.ego : 'Inconnu';

        // Insights (array de strings)
        if (Array.isArray(entry.insights)) {
            validated.insights = entry.insights
                .filter(s => typeof s === 'string')
                .map(s => s.substring(0, 500))
                .slice(0, 20);
        }

        // Source (liste autorisée)
        const allowedSources = ['gemini', 'ollama', 'heuristic', 'manual'];
        validated.source = allowedSources.includes(entry.source) ? entry.source : 'manual';

        return validated;
    });
}

/**
 * Valide une date ISO 8601
 * @param {string} date - Date à valider
 * @returns {boolean}
 */
function isValidISO8601(date) {
    if (typeof date !== 'string') return false;
    const iso8601Regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z?$/;
    if (!iso8601Regex.test(date)) return false;
    const timestamp = Date.parse(date);
    return !Number.isNaN(timestamp);
}

/**
 * Sanitise un prompt avant envoi à l'API
 * Limite la longueur et échappe les caractères dangereux
 * @param {string} prompt - Prompt utilisateur
 * @returns {string} - Prompt nettoyé
 */
function sanitizePrompt(prompt) {
    if (typeof prompt !== 'string') {
        throw new Error('Prompt doit être une chaîne');
    }

    // Limiter la longueur
    let cleaned = prompt.substring(0, 5000).trim();

    if (cleaned.length === 0) {
        throw new Error('Prompt vide');
    }

    // Supprimer les séquences de contrôle dangereuses
    cleaned = cleaned.replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/g, '');

    // Prévenir l'injection de newlines excessives (max 10)
    const lineCount = (cleaned.match(/\n/g) || []).length;
    if (lineCount > 50) {
        cleaned = cleaned.split('\n').slice(0, 50).join('\n');
    }

    return cleaned;
}

/**
 * Valide une clé API Gemini
 * Format strict : commence par AIza
 * @param {string} key - Clé API
 * @returns {boolean}
 */
function isValidGeminiKey(key) {
    if (typeof key !== 'string') return false;
    // Gemini API keys start with AIza
    return /^AIza[0-9A-Za-z_-]{35}$/.test(key.trim());
}

/**
 * Crée un élément DOM de manière sécurisée (textContent au lieu de innerHTML)
 * @param {string} tagName - Nom de la balise
 * @param {Object} options - Options {className, textContent, dataset, ...}
 * @returns {HTMLElement}
 */
function createSafeElement(tagName, options = {}) {
    const element = document.createElement(tagName);

    // Ajouter les classes
    if (options.className) {
        if (typeof options.className === 'string') {
            element.className = options.className;
        } else if (Array.isArray(options.className)) {
            element.classList.add(...options.className);
        }
    }

    // Ajouter le texte de manière sécurisée
    if (options.textContent) {
        element.textContent = options.textContent;
    }

    // Ajouter les attributs data
    if (options.dataset) {
        Object.entries(options.dataset).forEach(([key, value]) => {
            element.dataset[key] = value;
        });
    }

    // Ajouter d'autres propriétés
    Object.entries(options).forEach(([key, value]) => {
        if (['className', 'textContent', 'dataset'].includes(key)) return;
        if (typeof value !== 'function') {
            try {
                element[key] = value;
            } catch (e) {
                // Silencieusement ignorer les propriétés en lecture seule
            }
        }
    });

    return element;
}

/**
 * Valide les paramètres des requêtes API
 * Prévient l'injection de headers
 * @param {string} apiKey - Clé API
 * @returns {boolean}
 */
function isValidAPIKey(apiKey) {
    if (typeof apiKey !== 'string') return false;
    // Aucun caractère de contrôle, newlines, tabs
    return !/[\x00-\x1F\x7F]|\n|\r|\t/.test(apiKey);
}

/**
 * Rate limiting côté client
 * Prévient les attaques par brute force
 */
class RateLimiter {
    constructor(maxRequests = 10, windowMs = 60000) {
        this.maxRequests = maxRequests;
        this.windowMs = windowMs;
        this.requests = [];
    }

    isAllowed() {
        const now = Date.now();
        // Supprimer les requêtes expirées
        this.requests = this.requests.filter(time => now - time < this.windowMs);

        if (this.requests.length < this.maxRequests) {
            this.requests.push(now);
            return true;
        }

        return false;
    }

    getWaitTime() {
        if (this.requests.length === 0) return 0;
        return Math.ceil((this.requests[0] + this.windowMs - Date.now()) / 1000);
    }
}

/**
 * Content Security Policy - Défend contre les injections
 * À utiliser dans le header HTTP idéalement
 */
function getCSPHeader() {
    return [
        "default-src 'self'",
        "script-src 'self' https://cdn.tailwindcss.com",
        "style-src 'self' https://fonts.googleapis.com https://cdn.tailwindcss.com 'unsafe-inline'",
        "font-src https://fonts.gstatic.com",
        "img-src 'self' data: https:",
        "connect-src 'self' http://localhost:11434 https://generativelanguage.googleapis.com",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
        "frame-ancestors 'none'",
    ].join('; ');
}

/**
 * Valide l'intégrité d'une réponse Gemini
 */
function validateGeminiResponse(response) {
    if (typeof response !== 'object' || response === null) {
        throw new Error('Réponse invalide');
    }

    // Vérifier la structure
    if (!Array.isArray(response.candidates) || response.candidates.length === 0) {
        throw new Error('Pas de contenu dans la réponse');
    }

    const candidate = response.candidates[0];
    if (!candidate.content || !Array.isArray(candidate.content.parts)) {
        throw new Error('Structure de contenu invalide');
    }

    return candidate.content.parts;
}

/**
 * Logs sécurisés - sans données sensibles
 */
class SecureLogger {
    static log(level, message, data = {}) {
        const timestamp = new Date().toISOString();
        const sanitizedData = { ...data };

        // Supprimer les données sensibles
        delete sanitizedData.apiKey;
        delete sanitizedData.secret;
        delete sanitizedData.password;
        delete sanitizedData.token;

        const logEntry = { timestamp, level, message, data: sanitizedData };

        if (level === 'error') {
            console.error(logEntry);
        } else if (level === 'warning') {
            console.warn(logEntry);
        } else {
            console.log(logEntry);
        }
    }

    static error(message, data) {
        this.log('error', message, data);
    }

    static warning(message, data) {
        this.log('warning', message, data);
    }

    static info(message, data) {
        this.log('info', message, data);
    }
}
