'use strict';

function createGeminiService({ encryptor, toast }) {
    let cachedPayload;
    const listeners = new Set();

    function readPayload() {
        if (typeof cachedPayload !== 'undefined') return cachedPayload;
        try {
            const raw = localStorage.getItem(GEMINI_STORAGE_KEYS.encryptedKey);
            cachedPayload = raw ? JSON.parse(raw) : null;
        } catch (error) {
            console.debug('Clé Gemini illisible, purge en cours.', error);
            localStorage.removeItem(GEMINI_STORAGE_KEYS.encryptedKey);
            cachedPayload = null;
        }
        return cachedPayload;
    }

    function writePayload(payload) {
        try {
            localStorage.setItem(
                GEMINI_STORAGE_KEYS.encryptedKey,
                JSON.stringify(payload),
            );
            cachedPayload = payload;
        } catch (error) {
            console.debug('Impossible de stocker la clé Gemini.', error);
            cachedPayload = payload;
        }
        emit();
    }

    function clearPayload() {
        cachedPayload = null;
        try {
            localStorage.removeItem(GEMINI_STORAGE_KEYS.encryptedKey);
        } catch (error) {
            console.debug('Suppression clé Gemini impossible.', error);
        }
        emit();
    }

    function emit(change) {
        listeners.forEach((listener) => {
            try {
                listener(change);
            } catch (error) {
                console.debug('Listener Gemini', error);
            }
        });
    }

    function getCooldownTimestamp() {
        try {
            const raw = localStorage.getItem(GEMINI_STORAGE_KEYS.cooldown);
            if (!raw) return null;
            const value = Number.parseInt(raw, 10);
            if (Number.isNaN(value) || value <= Date.now()) {
                localStorage.removeItem(GEMINI_STORAGE_KEYS.cooldown);
                return null;
            }
            return value;
        } catch (error) {
            console.debug('Lecture cooldown Gemini impossible :', error);
            return null;
        }
    }

    function setCooldownTimestamp(timestamp) {
        if (!timestamp) {
            localStorage.removeItem(GEMINI_STORAGE_KEYS.cooldown);
            emit({ type: 'cooldown-cleared' });
            return;
        }
        try {
            localStorage.setItem(
                GEMINI_STORAGE_KEYS.cooldown,
                String(Math.max(timestamp, Date.now())),
            );
        } catch (error) {
            console.debug('Impossible de stocker le cooldown Gemini', error);
        }
        emit({ type: 'cooldown-set', until: timestamp });
    }

    function sanitizeApiKey(value) {
        return (value || '').replace(/\s/g, '');
    }

    function ensureConfiguredPayload() {
        const payload = readPayload();
        if (!payload) return null;
        if (!payload.cipher) {
            clearPayload();
            return null;
        }
        return payload;
    }

    async function decryptKey() {
        const payload = ensureConfiguredPayload();
        if (!payload) throw createError('NO_KEY', 'Aucune clé Gemini enregistrée.');
        try {
            return await encryptor.decrypt(payload);
        } catch (error) {
            console.error('Échec du déchiffrement de la clé Gemini.', error);
            throw createError('INVALID_KEY', 'Clé Gemini invalide ou corrompue.');
        }
    }

    function subscribe(listener) {
        if (typeof listener !== 'function') return () => { };
        listeners.add(listener);
        return () => {
            listeners.delete(listener);
        };
    }

    function buildGeminiRequest(prompt) {
        return {
            systemInstruction: {
                role: 'system',
                parts: [{ text: GEMINI_SYSTEM_PROMPT }],
            },
            contents: [
                {
                    role: 'user',
                    parts: [{ text: prompt }],
                },
            ],
            generationConfig: {
                temperature: 0.65,
                topP: 0.9,
                topK: 32,
                maxOutputTokens: 1024,
            },
        };
    }

    function parseGeminiResponse(data) {
        const candidates = data?.candidates;
        if (!Array.isArray(candidates) || candidates.length === 0) {
            throw new Error('Réponse Gemini vide.');
        }

        const parts = candidates
            .map((candidate) => candidate?.content?.parts || [])
            .flat()
            .map((part) => part?.text || '')
            .filter(Boolean);

        if (!parts.length) {
            throw new Error('Réponse Gemini sans texte.');
        }

        const rawText = parts.join('').trim();
        if (!rawText) {
            throw new Error('Texte Gemini vide.');
        }

        let parsed;
        try {
            parsed = JSON.parse(rawText);
        } catch (error) {
            throw new Error('Réponse Gemini non JSON.');
        }

        parsed.meta = typeof parsed.meta === 'string' ? parsed.meta : '';
        parsed.takeaways = Array.isArray(parsed.takeaways) ? parsed.takeaways : [];
        parsed.options = Array.isArray(parsed.options) ? parsed.options : [];
        return parsed;
    }

    return {
        isConfigured() {
            return Boolean(ensureConfiguredPayload());
        },

        getKeyStatus() {
            const payload = ensureConfiguredPayload();
            const cooldown = getCooldownTimestamp();
            return {
                configured: Boolean(payload),
                hint: payload?.hint || null,
                cooldown,
                isFallback: encryptor.isFallback || false,
            };
        },

        async saveKey(rawKey) {
            const sanitized = sanitizeApiKey(rawKey);
            if (!sanitized) throw new Error('Clé Gemini vide.');
            if (sanitized.length < 20) {
                throw new Error('La clé Gemini semble invalide.');
            }
            const payload = await encryptor.encrypt(sanitized);
            payload.version = 1;
            payload.hint = sanitized.slice(-4);
            writePayload(payload);
            setCooldownTimestamp(null);
            return payload;
        },

        async deleteKey() {
            clearPayload();
            setCooldownTimestamp(null);
        },

        async fetchAnalysis(prompt) {
            const text = (prompt || '').trim();
            if (!text) throw createError('EMPTY_PROMPT', 'Message vide.');

            // 🔴 SECURITY: Sanitize prompt before sending to Gemini API
            let sanitized;
            try {
                sanitized = sanitizePrompt(text);
            } catch (error) {
                throw createError('INVALID_PROMPT', `Validation du prompt échouée: ${error.message}`);
            }

            const cooldownUntil = getCooldownTimestamp();
            if (cooldownUntil) {
                throw createError('COOLDOWN', 'Quota Gemini en pause.', {
                    cooldownUntil,
                });
            }

            const apiKey = await decryptKey();
            const requestBody = buildGeminiRequest(sanitized);
            let response;
            try {
                response = await fetch(GEMINI_ENDPOINT, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${apiKey}`,
                    },
                    body: JSON.stringify(requestBody),
                });
            } catch (error) {
                throw createError('NETWORK', "L'appel Gemini a échoué.", { cause: error });
            }

            const quota = readQuotaHeaders(response.headers);
            if (!response.ok) {
                if (response.status === 401 || response.status === 403) {
                    throw createError(
                        'INVALID_KEY',
                        'Clé Gemini refusée. Vérifie la clé dans la configuration.',
                        { status: response.status },
                    );
                }
                if (response.status === 429) {
                    const retryAfterHeader =
                        response.headers.get('Retry-After') ||
                        response.headers.get('retry-after');
                    const retryAfterSeconds = retryAfterHeader
                        ? Number.parseInt(retryAfterHeader, 10)
                        : null;
                    const cooldown =
                        retryAfterSeconds && !Number.isNaN(retryAfterSeconds)
                            ? Date.now() + retryAfterSeconds * 1000
                            : Date.now() + COOLDOWN_DEFAULTS.defaultMs;
                    setCooldownTimestamp(cooldown);
                    throw createError(
                        'QUOTA',
                        'Quota Gemini atteint. Patiente avant de relancer.',
                        { cooldownUntil: cooldown, retryAfter: retryAfterSeconds },
                    );
                }

                let errorBody = null;
                try {
                    errorBody = await response.json();
                } catch (error) {
                    // ignore json parse
                }
                throw createError('API_ERROR', 'Réponse Gemini invalide.', {
                    status: response.status,
                    body: errorBody,
                });
            }

            try {
                const data = await response.json();
                const parsed = parseGeminiResponse(data);
                parsed.source = 'gemini';
                parsed.quota = quota;
                if (quota?.resetMs && quota.resetMs <= Date.now()) {
                    setCooldownTimestamp(null);
                }
                emit({ type: 'analysis-success', quota });
                return parsed;
            } catch (error) {
                throw createError('PARSE_ERROR', 'Impossible de lire la réponse Gemini.', {
                    cause: error,
                });
            }
        },

        subscribe,
    };
}
