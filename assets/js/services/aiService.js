/**
 * AI Service - Unified interface for LLM providers
 */
export const aiService = {
    async generateResponse(prompt, provider = null, config = {}) {
        // Load defaults from storage if not provided
        const storedProvider = localStorage.getItem('ai_provider') || 'ollama';
        const storedKey = localStorage.getItem('ai_api_key');

        const activeProvider = provider || storedProvider;
        const apiKey = config.apiKey || storedKey;

        // 1. RAG Enrichment
        let finalPrompt = prompt;
        if (!config.disableRAG) {
            try {
                const { knowledgeBase } = await import('../modules/knowledgeBase.js');
                const results = await knowledgeBase.search(prompt);
                if (results && results.length > 0) {
                    const context = results.map(r => r.text).join('\n\n');
                    console.log(`[RAG] Found ${results.length} relevant chunks.`);
                    finalPrompt = `Voici des informations contextuelles issues de ma documentation personnelle :\n\n${context}\n\nEn utilisant ce contexte (si pertinent) et tes connaissances, réponds à la question suivante :\n${prompt}`;
                }
            } catch (e) {
                console.warn("[RAG] Enrichment failed or skipped:", e);
            }
        }

        if (activeProvider === 'gemini') {
            return this.callGemini(finalPrompt, apiKey);
        } else if (activeProvider === 'openai') {
            return this.callOpenAI(finalPrompt, apiKey);
        } else if (activeProvider === 'ollama') {
            return this.callOllama(finalPrompt, config.model || 'mistral');
        } else {
            throw new Error(`Unknown provider: ${activeProvider}`);
        }
    },

    async getEmbedding(text, provider = 'ollama') {
        if (provider === 'ollama') {
            return this.callOllamaEmbedding(text);
        }
        return [];
    },

    async callGemini(prompt, apiKey) {
        if (!apiKey) throw new Error('Clé API Gemini manquante (voir Paramètres)');
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'Erreur Gemini');
        }
        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    },

    async callOpenAI(prompt, apiKey) {
        if (!apiKey) throw new Error('Clé API OpenAI manquante (voir Paramètres)');
        const url = 'https://api.openai.com/v1/chat/completions';
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-4',
                messages: [{ role: 'user', content: prompt }]
            })
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'Erreur OpenAI');
        }
        const data = await response.json();
        return data.choices[0].message.content;
    },

    async getOllamaModels() {
        try {
            const response = await fetch('http://localhost:11434/api/tags');
            if (!response.ok) return [];
            const data = await response.json();
            return data.models?.map(m => m.name) || [];
        } catch (e) {
            console.warn("Failed to fetch Ollama models:", e);
            return [];
        }
    },

    async callOllama(prompt, model) {
        const url = 'http://localhost:11434/api/generate';

        // Dynamic model resolution
        let targetModel = model;
        if (!targetModel || targetModel === 'mistral') {
            const models = await this.getOllamaModels();
            if (models.length > 0) {
                targetModel = models[0]; // Use first available model
                console.log(`[Ollama] Using auto-detected model: ${targetModel}`);
            } else {
                targetModel = 'mistral'; // Fallback
            }
        }

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ model: targetModel, prompt: prompt, stream: false })
            });

            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error(`Modèle '${targetModel}' non trouvé. Lancez 'ollama pull ${targetModel}' ou vérifiez vos modèles.`);
                }
                throw new Error('Erreur Ollama (Vérifiez que Ollama tourne)');
            }
            const data = await response.json();
            return data.response;
        } catch (error) {
            console.error("Ollama Call Error:", error);
            throw error;
        }
    },

    async callOllamaEmbedding(text) {
        const url = 'http://localhost:11434/api/embeddings';

        // Dynamic model resolution for embeddings
        let targetModel = 'mistral';
        const models = await this.getOllamaModels();
        if (models.length > 0) {
            // Prefer nomic-embed-text if available, otherwise first model
            const embedModel = models.find(m => m.includes('embed'));
            targetModel = embedModel || models[0];
        }

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ model: targetModel, prompt: text })
            });

            if (!response.ok) {
                if (response.status === 404) {
                    console.warn(`[Embedding] Modèle '${targetModel}' non trouvé.`);
                    return [];
                }
                throw new Error('Erreur Embedding Ollama');
            }
            const data = await response.json();
            return data.embedding;
        } catch (error) {
            console.warn("[Embedding] Error:", error);
            return [];
        }
    },

    async checkHealth() {
        const status = {
            ollama: { status: 'unknown', message: '' }
        };

        try {
            const response = await fetch('http://localhost:11434/api/tags');
            if (response.ok) {
                const data = await response.json();
                const models = data.models?.map(m => m.name).join(', ') || 'Aucun modèle';
                status.ollama = { status: 'online', message: `En ligne (${models})` };
            } else {
                status.ollama = { status: 'error', message: `Erreur HTTP ${response.status}` };
            }
        } catch (e) {
            status.ollama = { status: 'offline', message: 'Non détecté (localhost:11434)' };
        }

        return status;
    }
};
