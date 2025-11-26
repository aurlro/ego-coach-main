/**
 * Quick Analyzer - Mode d'analyse express
 * Interface minimaliste pour analyser rapidement une situation
 */
import { STORAGE_KEYS } from '../config.js';
import { autoResizeTextarea, copyTextToClipboard, runLocalHeuristics } from '../utils.js';
import { escapeHTML } from '../security.js';

export function createQuickAnalyzer({ rootId, store, toast, gemini, ollama, modal }) {
    const root = document.getElementById(rootId);
    if (!root) {
        console.warn(`Racine Quick Analyzer "${rootId}" introuvable`);
        return { render: () => { } };
    }

    const state = {
        isLoading: false,
        lastResult: null,
    };

    function getAIProvider() {
        try {
            return localStorage.getItem(STORAGE_KEYS.aiProvider) || 'heuristic';
        } catch {
            return 'heuristic';
        }
    }

    function render() {
        root.innerHTML = `
            <div class="quick-analyzer-container">
                <header class="quick-analyzer-header">
                    <div>
                        <h2 class="text-2xl font-bold">Analyse Rapide</h2>
                        <p class="text-sm text-slate-600 dark:text-slate-400 mt-1">
                            Décris ta situation et obtiens des conseils immédiatement
                        </p>
                    </div>
                </header>

                <div class="quick-analyzer-content">
                    <!-- Input Section -->
                    <div class="quick-input-section p-6">
                        <textarea
                            id="quick-input"
                            placeholder="Décris rapidement la situation... (ex: Mon manager m'a critiqué pendant la réunion, j'ai senti ma défensive s'activer)"
                            class="form-textarea"
                            rows="5"
                        ></textarea>
                        <div class="quick-actions mt-4 flex gap-3">
                            <button type="button" class="btn btn-primary" id="quick-analyze-btn">
                                <i data-lucide="zap" class="w-4 h-4"></i>
                                Analyser maintenant
                            </button>
                            <button type="button" class="btn btn-secondary" id="quick-clear-btn">
                                <i data-lucide="x" class="w-4 h-4"></i>
                                Effacer
                            </button>
                        </div>
                    </div>

                    <!-- Results Section -->
                    <div id="quick-results" class="quick-results-section hidden mt-6 p-6">
                        <!-- Results will be rendered here -->
                    </div>
                </div>
            </div>
        `;

        // Event listeners
        const textarea = root.querySelector('#quick-input');
        const analyzeBtn = root.querySelector('#quick-analyze-btn');
        const clearBtn = root.querySelector('#quick-clear-btn');
        const resultsDiv = root.querySelector('#quick-results');

        // Auto-resize textarea
        if (textarea) {
            autoResizeTextarea(textarea);
            textarea.addEventListener('input', () => autoResizeTextarea(textarea));
        }

        analyzeBtn?.addEventListener('click', () => analyze(textarea.value));
        clearBtn?.addEventListener('click', () => {
            textarea.value = '';
            autoResizeTextarea(textarea);
            resultsDiv.classList.add('hidden');
            textarea.focus();
        });

        // Restore last result if exists
        if (state.lastResult) {
            renderResults(state.lastResult);
        }
    }

    async function analyze(text) {
        const cleanText = (text || '').trim();
        if (!cleanText) {
            toast.error('Décris une situation avant de continuer');
            return;
        }

        if (state.isLoading) return;

        state.isLoading = true;
        const analyzeBtn = root.querySelector('#quick-analyze-btn');
        const originalText = analyzeBtn ? analyzeBtn.innerHTML : '';

        if (analyzeBtn) {
            analyzeBtn.disabled = true;
            analyzeBtn.innerHTML = `
                <i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i>
                Analyse en cours...
            `;
            if (window.refreshIcons) window.refreshIcons(analyzeBtn);
        }

        const provider = getAIProvider();

        // Artificial delay to ensure loading state is visible and interaction feels substantial
        await new Promise(resolve => setTimeout(resolve, 600));

        try {
            let result;

            if (provider === 'gemini') {
                const status = gemini.getKeyStatus();
                if (!status.configured) {
                    toast.warning('Gemini non configuré. Utilisation du mode heuristique.');
                    result = runLocalHeuristics(cleanText);
                } else if (status.cooldown) {
                    toast.warning('Gemini en cooldown. Fallback local.');
                    result = runLocalHeuristics(cleanText);
                } else {
                    toast.info('Analyse Gemini en cours...');
                    result = await gemini.fetchAnalysis(cleanText);
                    result.source = 'gemini';
                    toast.success('Analyse réussie !');
                }
            } else if (provider === 'ollama') {
                toast.info('Analyse Ollama en cours...');
                try {
                    result = await ollama.fetchAnalysis(cleanText);
                    toast.success('Analyse réussie !');
                } catch (error) {
                    console.error('Ollama error:', error);
                    toast.error('Ollama indisponible. Utilisation du mode local.');
                    result = runLocalHeuristics(cleanText);
                    result.source = 'heuristic';
                }
            } else {
                result = runLocalHeuristics(cleanText);
                result.source = 'heuristic';
            }

            state.lastResult = result;
            renderResults(result);

            // Optionnel: sauvegarder immédiatement
            saveAnalysis(cleanText, result);

        } catch (error) {
            console.error('Quick analysis error:', error);
            toast.error('Erreur lors de l\'analyse');
        } finally {
            state.isLoading = false;
            if (analyzeBtn) {
                analyzeBtn.disabled = false;
                analyzeBtn.innerHTML = originalText;
                if (window.refreshIcons) window.refreshIcons(analyzeBtn);
            }
        }
    }

    function saveAnalysis(text, result) {
        try {
            const entry = {
                id: `analysis-${Date.now()}`,
                createdAt: new Date().toISOString(),
                context: text.substring(0, 100),
                summary: result.meta || 'Analyse rapide',
                ego: result.ego || 'Inconnu',
                insights: result.takeaways || [],
                source: result.source || 'heuristic',
            };
            store.saveEntry(entry);
        } catch (error) {
            console.debug('Sauvegarde auto échouée:', error);
        }
    }

    function renderResults(result) {
        const resultsDiv = root.querySelector('#quick-results');
        if (!resultsDiv) return;

        const provider = result.source === 'gemini' ? 'Gemini' : result.source === 'ollama' ? `Ollama (${result.model})` : 'Analyse locale';
        const badgeColor = result.source === 'gemini' ? 'bg-emerald-100 text-emerald-700' : result.source === 'ollama' ? 'bg-blue-100 text-blue-700' : 'bg-slate-200 text-slate-700';

        resultsDiv.innerHTML = `
            <div class="card">
                <div class="card-header">
                    <div>
                        <h3 class="card-title">Résultat de l'analyse</h3>
                        <p class="text-sm text-slate-600 dark:text-slate-400 mt-1">${escapeHTML(result.meta || 'Analyse complétée')}</p>
                    </div>
                    <span class="inline-block px-3 py-1 rounded-full text-xs font-semibold ${badgeColor}">
                        ${provider}
                    </span>
                </div>

                <div class="card-body space-y-4">
                    <!-- Takeaways -->
                    ${result.takeaways && result.takeaways.length > 0 ? `
                        <div>
                            <h4 class="font-semibold text-sm mb-2">Insights clés :</h4>
                            <ul class="space-y-2">
                                ${result.takeaways.map(t => `
                                    <li class="flex gap-2 text-sm">
                                        <span class="text-accent-primary flex-shrink-0">✓</span>
                                        <span>${escapeHTML(t)}</span>
                                    </li>
                                `).join('')}
                            </ul>
                        </div>
                    ` : ''}

                    <!-- Options/Scripts -->
                    ${result.options && result.options.length > 0 ? `
                        <div>
                            <h4 class="font-semibold text-sm mb-2">Réponses suggérées :</h4>
                            <div class="space-y-3">
                                ${result.options.map((opt, idx) => `
                                    <div class="bg-slate-50 dark:bg-slate-900 p-3 rounded-lg">
                                        <p class="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">${escapeHTML(opt.objective || `Option ${idx + 1}`)}</p>
                                        <p class="text-sm italic text-slate-700 dark:text-slate-300">
                                            "${escapeHTML(opt.script || '')}"
                                        </p>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    ` : ''}
                </div>

                <div class="mt-4 flex gap-2 pt-4 border-t border-slate-200 dark:border-slate-700">
                    <button class="btn btn-secondary text-sm" id="quick-save-btn">
                        <i data-lucide="save" class="w-4 h-4"></i>
                        Sauvegarder
                    </button>
                    <button class="btn btn-ghost text-sm" id="quick-copy-btn">
                        <i data-lucide="copy" class="w-4 h-4"></i>
                        Copier
                    </button>
                </div>
            </div>
        `;

        resultsDiv.classList.remove('hidden');

        // Événements
        root.querySelector('#quick-save-btn')?.addEventListener('click', () => {
            toast.success('Analyse sauvegardée dans votre journal');
        });

        root.querySelector('#quick-copy-btn')?.addEventListener('click', () => {
            const text = result.options?.map(o => `${o.objective}: "${o.script}"`).join('\n\n') || '';
            copyTextToClipboard(text)
                .then(() => {
                    toast.success('Copié dans le presse-papiers');
                })
                .catch(() => {
                    toast.error('Erreur lors de la copie');
                });
        });
    }

    render();

    return { render };
}
