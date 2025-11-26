import { aiService } from '../../services/aiService.js';
import { repository } from '../../data/repository.js';
import { store } from '../../core/store.js';

export class AIAnalyzerPage {
    constructor() {
        this.isLoading = false;
        this.result = null;
    }

    async mount(container) {
        this.container = container;
        this.render();
    }

    render() {
        const apiKey = localStorage.getItem('gemini_api_key') || '';
        const provider = localStorage.getItem('ai_provider') || 'gemini';

        this.container.innerHTML = `
            <div class="max-w-3xl mx-auto">
                <h1 class="text-2xl font-bold text-slate-900 dark:text-white mb-6">Analyse IA</h1>

                <!-- Configuration (Collapsible) -->
                <div class="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 mb-6">
                    <details ${!apiKey ? 'open' : ''}>
                        <summary class="cursor-pointer font-medium text-slate-700 dark:text-slate-300">Configuration IA</summary>
                        <div class="mt-4 space-y-4">
                            <div>
                                <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Fournisseur</label>
                                <select id="provider-select" class="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                                    <option value="gemini" ${provider === 'gemini' ? 'selected' : ''}>Google Gemini</option>
                                    <option value="ollama" ${provider === 'ollama' ? 'selected' : ''}>Ollama (Local)</option>
                                </select>
                            </div>
                            <div id="api-key-container" class="${provider === 'ollama' ? 'hidden' : ''}">
                                <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Clé API Gemini</label>
                                <input type="password" id="api-key-input" value="${apiKey}" class="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700" placeholder="AIza...">
                            </div>
                            <button id="save-config" class="text-sm text-blue-600 hover:underline">Sauvegarder la configuration</button>
                        </div>
                    </details>
                </div>

                <!-- Input Area -->
                <div class="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 mb-6">
                    <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Décrivez la situation</label>
                    <textarea id="prompt-input" class="w-full h-40 p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border-0 focus:ring-2 focus:ring-blue-500 dark:text-white resize-none" placeholder="Copiez-collez la conversation ou décrivez le conflit..."></textarea>
                    
                    <div class="mt-4 flex justify-end">
                        <button id="btn-analyze" class="btn-primary px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2" ${this.isLoading ? 'disabled' : ''}>
                            ${this.isLoading ? '<i data-lucide="loader" class="animate-spin w-4 h-4"></i> Analyse en cours...' : '<i data-lucide="sparkles" class="w-4 h-4"></i> Analyser'}
                        </button>
                    </div>
                </div>

                <!-- Results Area -->
                <div id="result-area" class="${this.result ? '' : 'hidden'} bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
                    <h3 class="font-bold text-lg mb-4 text-slate-900 dark:text-white">Analyse</h3>
                    <div id="result-content" class="prose dark:prose-invert max-w-none mb-6 text-slate-600 dark:text-slate-300 whitespace-pre-wrap">${this.result || ''}</div>
                    
                    <div class="flex justify-end gap-2">
                        <button id="btn-save-result" class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm">
                            Enregistrer dans le Journal
                        </button>
                    </div>
                </div>
            </div>
        `;

        this.attachListeners();
        lucide.createIcons();
    }

    attachListeners() {
        // Config
        const providerSelect = this.container.querySelector('#provider-select');
        const apiKeyContainer = this.container.querySelector('#api-key-container');

        providerSelect?.addEventListener('change', (e) => {
            if (e.target.value === 'ollama') {
                apiKeyContainer.classList.add('hidden');
            } else {
                apiKeyContainer.classList.remove('hidden');
            }
        });

        this.container.querySelector('#save-config')?.addEventListener('click', () => {
            const provider = providerSelect.value;
            const key = this.container.querySelector('#api-key-input').value;
            localStorage.setItem('ai_provider', provider);
            if (key) localStorage.setItem('gemini_api_key', key);
            alert('Configuration sauvegardée');
        });

        // Analyze
        this.container.querySelector('#btn-analyze')?.addEventListener('click', async () => {
            const prompt = this.container.querySelector('#prompt-input').value;
            if (!prompt) return;

            this.isLoading = true;
            this.render(); // Re-render to show loading state

            try {
                const provider = localStorage.getItem('ai_provider') || 'gemini';
                const apiKey = localStorage.getItem('gemini_api_key');

                const systemPrompt = "Tu es un coach en communication expert en Ego. Analyse cette situation, identifie l'ego en jeu (Défensif, Sauveur, Martyr, Juge) et propose une réponse MVP (Minimum Viable Response) pour désamorcer le conflit.";
                const fullPrompt = `${systemPrompt}\n\nSituation:\n${prompt}`;

                const response = await aiService.generateResponse(fullPrompt, provider, { apiKey });
                this.result = response;
            } catch (error) {
                alert(`Erreur: ${error.message}`);
            } finally {
                this.isLoading = false;
                this.render();
            }
        });

        // Save
        this.container.querySelector('#btn-save-result')?.addEventListener('click', async () => {
            if (!this.result) return;

            const entry = {
                context: "Analyse IA",
                summary: "Analyse IA générée",
                egoFocus: "IA",
                insights: [this.result],
                source: 'ai'
            };

            await repository.saveJournalEntry(entry);
            const updatedJournal = await repository.getJournal();
            store.setState({ journal: updatedJournal });
            window.location.hash = 'journal';
        });
    }

    async unmount() { }
}
