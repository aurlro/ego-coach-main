/**
 * AI Service - Unified interface for LLM providers
 */
export const aiService = {
    async generateResponse(prompt, provider = 'gemini', config = {}) {
        // 1. RAG Enrichment (if enabled and not explicitly disabled)
        let finalPrompt = prompt;

        if (!config.disableRAG) {
            try {
                // Dynamic import to avoid circular dependency
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

        if (provider === 'gemini') {
            return this.callGemini(finalPrompt, config.apiKey);
        } else if (provider === 'ollama') {
            return this.callOllama(finalPrompt, config.model || 'mistral');
        } else {
            throw new Error('Unknown provider');
        }
    },

    async getEmbedding(text, provider = 'ollama') {
        if (provider === 'ollama') {
            return this.callOllamaEmbedding(text);
        }
        // Fallback or other providers could be added here
        return [];
    },

    async callGemini(prompt, apiKey) {
        if (!apiKey) throw new Error('Clé API Gemini manquante');

        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'Erreur Gemini');
        }

        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    },

    async callOllama(prompt, model) {
        const url = 'http://localhost:11434/api/generate';

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: model,
                prompt: prompt,
                stream: false
            })
        });

        if (!response.ok) {
            throw new Error('Erreur Ollama (Vérifiez que Ollama tourne)');
        }

        const data = await response.json();
        return data.response;
    },

    async callOllamaEmbedding(text) {
        const url = 'http://localhost:11434/api/embeddings';
        // Note: 'nomic-embed-text' is a good default, or 'llama2', 'mistral' etc.
        // We'll use 'nomic-embed-text' if available, or fall back to the user's default model in settings?
        // For now hardcode a common one or pass it. Let's use 'mistral' as it's likely installed if they use Ollama,
        // but 'nomic-embed-text' is better. I'll default to 'mistral' for safety unless configured.
        const model = 'mistral';

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: model,
                prompt: text
            })
        });

        if (!response.ok) {
            throw new Error('Erreur Embedding Ollama');
        }

        const data = await response.json();
        return data.embedding;
    },

    async checkHealth() {
        const status = {
            gemini: { status: 'unknown', message: '' },
            ollama: { status: 'unknown', message: '' }
        };

        // Check Gemini
        // We can't easily validate the key without making a request, but we can check if it exists
        // Ideally we would store the key in a better place than passing it around, but for now:
        // We'll rely on the UI to pass the config or check localStorage if we were using it there.
        // Since aiService is stateless regarding config in this implementation, we might just check if we can reach Ollama.

        // Check Ollama
        try {
            const response = await fetch('http://localhost:11434/api/tags');
            if (response.ok) {
                status.ollama = { status: 'online', message: 'Ollama est accessible' };
            } else {
                status.ollama = { status: 'error', message: `Erreur HTTP ${response.status}` };
            }
        } catch (e) {
            status.ollama = { status: 'offline', message: 'Non détecté (localhost:11434)' };
        }

        return status;
    }
};
