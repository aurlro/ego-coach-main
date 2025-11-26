import { OLLAMA_STORAGE_KEYS, OLLAMA_DEFAULTS, GEMINI_SYSTEM_PROMPT } from '../config.js';
import { sanitizePrompt } from '../security.js';

export function createOllamaService({ toast }) {
    function getConfig() {
        try {
            const endpoint = localStorage.getItem(OLLAMA_STORAGE_KEYS.endpoint) || OLLAMA_DEFAULTS.endpoint;
            const model = localStorage.getItem(OLLAMA_STORAGE_KEYS.model) || OLLAMA_DEFAULTS.model;
            return { endpoint, model };
        } catch (error) {
            console.debug('Lecture config Ollama impossible :', error);
            return { endpoint: OLLAMA_DEFAULTS.endpoint, model: OLLAMA_DEFAULTS.model };
        }
    }

    function saveConfig(endpoint, model) {
        try {
            localStorage.setItem(OLLAMA_STORAGE_KEYS.endpoint, endpoint);
            localStorage.setItem(OLLAMA_STORAGE_KEYS.model, model);
            return true;
        } catch (error) {
            console.debug('Impossible de sauvegarder la config Ollama.', error);
            return false;
        }
    }

    async function fetchAnalysis(prompt) {
        const text = (prompt || '').trim();
        if (!text) throw new Error('Message vide.');

        // 🔴 SECURITY: Sanitize prompt before sending to API
        let sanitized;
        try {
            sanitized = sanitizePrompt(text);
        } catch (error) {
            throw new Error(`Validation du prompt échouée: ${error.message}`);
        }

        const config = getConfig();
        const url = `${config.endpoint}/api/generate`;

        const requestBody = {
            model: config.model,
            prompt: `${GEMINI_SYSTEM_PROMPT}\n\nUtilisateur: ${sanitized}`,
            stream: false,
            options: {
                temperature: 0.7,
                top_p: 0.9,
            },
        };

        let response;
        try {
            response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });
        } catch (error) {
            throw new Error(`Impossible de contacter Ollama sur ${config.endpoint}. Assure-toi qu'Ollama est lancé.`);
        }

        if (!response.ok) {
            const errorText = await response.text().catch(() => 'Erreur inconnue');
            throw new Error(`Ollama erreur ${response.status}: ${errorText}`);
        }

        let data;
        try {
            data = await response.json();
        } catch (error) {
            throw new Error('Réponse Ollama invalide (pas du JSON).');
        }

        if (!data.response) {
            throw new Error('Réponse Ollama vide.');
        }

        // Essayer de parser le JSON de la réponse
        let parsed;
        try {
            // Chercher du JSON dans la réponse
            const jsonMatch = data.response.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                parsed = JSON.parse(jsonMatch[0]);
            } else {
                throw new Error('Pas de JSON trouvé');
            }
        } catch (error) {
            // Si pas de JSON valide, créer une réponse structurée à partir du texte
            console.debug('Ollama réponse non-JSON, fallback structuré :', error);
            parsed = {
                meta: 'Analyse Ollama (format libre)',
                takeaways: [
                    'Prends le temps de valider les émotions exprimées',
                    'Identifie le besoin sous-jacent avant de proposer une solution',
                ],
                options: [
                    {
                        objective: 'Réponse proposée',
                        script: data.response.substring(0, 500), // Limiter la longueur
                    },
                ],
            };
        }

        parsed.meta = parsed.meta || 'Analyse Ollama';
        parsed.takeaways = Array.isArray(parsed.takeaways) ? parsed.takeaways : [];
        parsed.options = Array.isArray(parsed.options) ? parsed.options : [];
        parsed.source = 'ollama';
        parsed.model = config.model;

        return parsed;
    }

    return {
        getConfig,
        saveConfig,
        fetchAnalysis,
        isConfigured() {
            return true; // Ollama est toujours "configuré" (même avec valeurs par défaut)
        },
    };
}
