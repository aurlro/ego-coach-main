/**
 * Quality Guards - Validation et détection de pertinence des réponses IA
 * Vérifie que les réponses ne sont pas automatiques/vides mais vraiment pertinentes
 */

/**
 * Vérifie la validité générale d'une réponse
 */
function isValidResponse(response) {
    if (!response || typeof response !== 'object') return false;

    // Vérifier qu'il y a du contenu
    const hasContent = response.takeaways?.length > 0 || response.options?.length > 0;
    const hasText = response.meta || response.summary;

    return hasContent && hasText;
}

/**
 * Détecte si la réponse est pertinente (pas une réponse automatique/vide)
 * Compare avec patterns de réponses génériques
 */
function isRelevantResponse(response, originalPrompt) {
    if (!isValidResponse(response)) return false;

    // Patterns de réponses non pertinentes/génériques
    const genericPatterns = [
        /aucune information|pas de contexte|impossible à analyser/i,
        /veuillez fournir|merci de préciser|besoin de plus/i,
        /hello|bonjour|bienvenue|welcome/i,
        /erreur|une erreur|oops|pas disponible/i,
        /^[\s]*\.{3}[\s]*$/,  // Juste des points de suspension
        /^\s*$/, // Vide
    ];

    const metaText = (response.meta || '').toLowerCase();
    const summaryText = (response.summary || '').toLowerCase();
    const combinedText = metaText + ' ' + summaryText;

    // Vérifier si c'est un pattern générique
    for (const pattern of genericPatterns) {
        if (pattern.test(combinedText)) {
            return false;
        }
    }

    // Vérifier la longueur minimale du contenu
    if (combinedText.length < 20) return false;

    // Vérifier que le contenu est lié au prompt
    if (originalPrompt && combinedText.length > 0) {
        const promptWords = originalPrompt
            .toLowerCase()
            .split(/\s+/)
            .filter(w => w.length > 3); // Mots de plus de 3 caractères

        // Au moins 20% des mots clés du prompt doivent être dans la réponse
        const matchingWords = promptWords.filter(word => combinedText.includes(word));
        const relevanceScore = matchingWords.length / Math.max(promptWords.length, 1);

        if (relevanceScore < 0.15 && promptWords.length > 5) {
            return false; // Trop peu de pertinence
        }
    }

    return true;
}

/**
 * Calcule un score de qualité (0-100) pour une réponse
 */
function calculateQualityScore(response, originalPrompt) {
    let score = 0;

    // Validité de base (+20)
    if (isValidResponse(response)) score += 20;

    // Pertinence (+30)
    if (isRelevantResponse(response, originalPrompt)) score += 30;

    // Nombre de takeaways (+15)
    if (response.takeaways?.length >= 3) score += 15;
    else if (response.takeaways?.length >= 1) score += 7;

    // Nombre d'options (+20)
    if (response.options?.length >= 2) score += 20;
    else if (response.options?.length >= 1) score += 10;

    // Longueur du meta/summary (+15)
    const textLength = (response.meta || '').length + (response.summary || '').length;
    if (textLength >= 100) score += 15;
    else if (textLength >= 50) score += 8;

    return Math.min(score, 100);
}

/**
 * Vérifie que les options proposées ont du contenu pertinent
 */
function validateOptions(options) {
    if (!Array.isArray(options)) return false;

    return options.every(opt => {
        return opt.objective &&
               opt.objective.trim().length > 5 &&
               opt.script &&
               opt.script.trim().length > 10;
    });
}

/**
 * Détecte si la réponse provient vraiment d'une IA (pas un mock/erreur)
 */
function isAIGenerated(response) {
    // Les vraies réponses IA ont une structure complexe et variable
    const hasComplexStructure =
        response.takeaways?.some(t => t.length > 30) &&
        response.options?.some(o => o.script?.length > 50);

    // Les réponses génériques ont souvent exactement le même format
    const isGeneric =
        response.takeaways?.length === 1 &&
        response.options?.length === 1;

    // Les vraies réponses varient en longueur
    const lengthVariation =
        response.takeaways?.some(t => t.length < 20) &&
        response.takeaways?.some(t => t.length > 40);

    return hasComplexStructure || (isGeneric === false && lengthVariation);
}

/**
 * Effectue une vérification complète d'une réponse
 * Retourne {valid, score, issues, confidence}
 */
function validateResponse(response, originalPrompt = '') {
    const issues = [];

    // Vérifications basiques
    if (!response) {
        issues.push('Réponse vide ou null');
        return { valid: false, score: 0, issues, confidence: 0 };
    }

    if (typeof response !== 'object') {
        issues.push('Format de réponse invalide (pas un objet)');
        return { valid: false, score: 0, issues, confidence: 0 };
    }

    // Vérifier la structure JSON attendue
    if (!response.meta && !response.summary) {
        issues.push('Pas de résumé de la situation (meta ou summary)');
    }

    if (!response.takeaways || !Array.isArray(response.takeaways)) {
        issues.push('Takeaways manquants ou format invalide');
    } else if (response.takeaways.length === 0) {
        issues.push('Aucun insight actionnable (takeaways vides)');
    }

    if (!response.options || !Array.isArray(response.options)) {
        issues.push('Options manquantes ou format invalide');
    } else if (response.options.length === 0) {
        issues.push('Aucune option proposée');
    } else if (!validateOptions(response.options)) {
        issues.push('Options mal formées (objectif ou script manquants)');
    }

    // Vérifier la pertinence
    const relevant = isRelevantResponse(response, originalPrompt);
    if (!relevant && originalPrompt) {
        issues.push('Réponse peu pertinente par rapport à la question');
    }

    // Vérifier que ce n'est pas une réponse automatique/template
    const isGenerated = isAIGenerated(response);
    if (!isGenerated) {
        issues.push('Réponse possiblement générée par template (non IA)');
    }

    // Calculer le score
    const score = calculateQualityScore(response, originalPrompt);

    // Seuil de validation: 40/100 minimum
    const valid = score >= 40 && issues.length < 3;

    // Confiance: basée sur le score (0-1)
    const confidence = Math.min(score / 100, 1);

    return {
        valid,
        score,
        issues,
        confidence,
        isGenerated,
        isRelevant: relevant
    };
}

/**
 * Formatte les problèmes pour l'utilisateur
 */
function formatValidationIssues(validation) {
    if (validation.valid) {
        return {
            icon: '✓',
            message: `Réponse validée (score: ${validation.score}/100)`,
            type: 'success'
        };
    }

    if (!validation.isGenerated) {
        return {
            icon: '⚠️',
            message: 'Réponse possiblement automatique/non générée - Réessaye',
            type: 'warning'
        };
    }

    if (!validation.isRelevant) {
        return {
            icon: '❌',
            message: 'Réponse peu pertinente - Reformule ta question',
            type: 'error'
        };
    }

    return {
        icon: '⚠️',
        message: `Qualité insuffisante (score: ${validation.score}/100)`,
        type: 'warning',
        details: validation.issues
    };
}

/**
 * Vérifie la santé générale du système
 */
function performHealthCheck() {
    const checks = {
        geminiConfigured: false,
        ollamaAvailable: false,
        localStorageWorking: false,
        webCryptoAvailable: false,
        encryptionSecure: false
    };

    try {
        checks.localStorageWorking = Boolean(localStorage.getItem('test') || true);
    } catch (e) {
        checks.localStorageWorking = false;
    }

    checks.webCryptoAvailable = Boolean(window.crypto?.subtle);
    checks.encryptionSecure = Boolean(window.crypto?.subtle) && (window.isSecureContext ?? true);

    // Vérifier Gemini (si une clé est configurée)
    try {
        const hasGeminiKey = Boolean(localStorage.getItem('gemini_key_encrypted_v1'));
        checks.geminiConfigured = hasGeminiKey;
    } catch (e) {
        checks.geminiConfigured = false;
    }

    // Vérifier Ollama
    try {
        const ollamaEndpoint = localStorage.getItem('ollama.endpoint.v1') || 'http://localhost:11434';
        checks.ollamaAvailable = ollamaEndpoint ? 'À vérifier' : false;
    } catch (e) {
        checks.ollamaAvailable = false;
    }

    return checks;
}

/**
 * Génère un rapport d'état du système
 */
function getSystemHealthStatus() {
    const checks = performHealthCheck();

    let status = 'healthy';
    let issues = [];

    if (!checks.encryptionSecure) {
        status = 'warning';
        issues.push('Chiffrement non disponible - HTTPS recommandé');
    }

    if (!checks.localStorageWorking) {
        status = 'error';
        issues.push('localStorage indisponible - Persistance impossible');
    }

    if (!checks.geminiConfigured && !checks.ollamaAvailable) {
        status = 'warning';
        issues.push('Aucune IA externe configurée - Mode local uniquement');
    }

    return { status, checks, issues };
}
