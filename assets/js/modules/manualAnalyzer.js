import { autoResizeTextarea, copyTextToClipboard } from '../utils.js';
import { aiService } from '../services/aiService.js';
import { escapeHTML } from '../security.js';

export function createManualAnalyzer({ rootId, rootElement, store, toast, onSaved, initialData = null }) {
    const root = rootElement || document.getElementById(rootId);
    if (!root) {
        console.warn(`Racine manuelle "${rootId}" introuvable.`);
        return { render: () => { } };
    }

    // --- Configuration ---
    const STEPS = {
        SITUATION: 0,
        DIAGNOSTIC: 1,
        DECODING: 2,
        STRATEGY: 3,
        RESPONSE: 4
    };

    const state = {
        step: initialData ? STEPS.RESPONSE : STEPS.SITUATION, // If data exists, go to end or maybe first step? Let's say Situation for now, or check completeness.
        // Actually if we reopen, we probably want to see the result (Response) or the last step.
        // Let's default to SITUATION if no data, otherwise RESPONSE (to see result) or allow navigation.
        // Better: if initialData, populate data and set step to RESPONSE (so user sees full analysis).
        isLoading: false,
        data: initialData || {
            context: '',
            partnerSignal: '',
            crisisLevel: 1,
            triggers: [],
            needs: { self: '', partner: '' },
            protocol: '',
            responses: []
        }
    };

    if (initialData) {
        // Ensure step is set to RESPONSE to show the full result, 
        // but user can navigate back to edit.
        state.step = STEPS.RESPONSE;
    }

    // --- Prompts (Internal) ---
    const PROMPTS = {
        diagnostic: (ctx, signal) => `
            Analyse cette situation de conflit :
            Contexte : "${ctx}"
            Signal/Déclencheur : "${signal}"
            
            Tâche :
            1. Évalue le niveau de crise de 1 (Calme) à 5 (Rupture imminente).
            2. Identifie les déclencheurs émotionnels (ex: Rejet, Injustice, Contrôle).
            3. Vérifie les faits vs les interprétations.
            
            Réponds au format JSON uniquement :
            {
                "level": number,
                "triggers": ["string"],
                "factCheck": "string"
            }
        `,
        decoding: (ctx, signal) => `
            Agis comme un expert en empathie (CNV).
            Contexte : "${ctx}"
            Signal : "${signal}"
            
            Tâche :
            1. Quel est le besoin caché de l'utilisateur (Self) ?
            2. Quel est le besoin caché du partenaire (Partner) ?
            
            Réponds au format JSON uniquement :
            {
                "selfNeed": "string",
                "partnerNeed": "string",
                "explanation": "string"
            }
        `,
        strategy: (level, needs) => `
            Situation : Crise niveau ${level}.
            Besoin Moi : ${needs.self}
            Besoin Autre : ${needs.partner}
            
            Recommande 3 protocoles de communication adaptés (ex: SET, DEAR MAN, GIVE, FAST, STOP).
            Pour le meilleur, explique pourquoi.
            
            Réponds au format JSON uniquement :
            {
                "recommended": "string",
                "options": [
                    {"name": "string", "description": "string"}
                ]
            }
        `,
        response: (ctx, protocol, needs) => `
            Génère 3 scripts de réponse basés sur le protocole "${protocol}".
            Contexte : "${ctx}"
            Besoins : ${JSON.stringify(needs)}
            
            Options :
            1. Empathique (Focus lien)
            2. Assertif (Focus limites)
            3. Désamorçage (Focus calme)
            
            Réponds au format JSON uniquement :
            {
                "scripts": [
                    {"type": "Empathique", "text": "string"},
                    {"type": "Assertif", "text": "string"},
                    {"type": "Désamorçage", "text": "string"}
                ]
            }
        `
    };

    // --- Core Logic ---

    async function runAIAnalysis(promptType) {
        state.isLoading = true;
        render();

        try {
            let prompt = '';
            let result = null;

            switch (promptType) {
                case 'diagnostic':
                    prompt = PROMPTS.diagnostic(state.data.context, state.data.partnerSignal);
                    break;
                case 'decoding':
                    prompt = PROMPTS.decoding(state.data.context, state.data.partnerSignal);
                    break;
                case 'strategy':
                    prompt = PROMPTS.strategy(state.data.crisisLevel, state.data.needs);
                    break;
                case 'response':
                    prompt = PROMPTS.response(state.data.context, state.data.protocol, state.data.needs);
                    break;
            }

            const rawResponse = await aiService.generateResponse(prompt, null, { model: 'mistral' });
            // Basic JSON extraction cleanup
            const jsonStr = rawResponse.replace(/```json/g, '').replace(/```/g, '').trim();
            result = JSON.parse(jsonStr);

            // Update State based on result
            switch (promptType) {
                case 'diagnostic':
                    state.data.crisisLevel = result.level;
                    state.data.triggers = result.triggers;
                    state.data.factCheck = result.factCheck;
                    state.step = STEPS.DIAGNOSTIC;
                    break;
                case 'decoding':
                    state.data.needs = { self: result.selfNeed, partner: result.partnerNeed };
                    state.data.decodingExplanation = result.explanation;
                    state.step = STEPS.DECODING;
                    break;
                case 'strategy':
                    state.data.protocol = result.recommended;
                    state.data.protocolOptions = result.options;
                    state.step = STEPS.STRATEGY;
                    break;
                case 'response':
                    state.data.responses = result.scripts;
                    state.step = STEPS.RESPONSE;
                    break;
            }

        } catch (error) {
            console.error("AI Error:", error);
            toast.error("Erreur de l'IA. Vérifiez la configuration.");
        } finally {
            state.isLoading = false;
            render();
        }
    }

    // --- Renderers ---

    function renderTooltip(text) {
        return `
            <div class="group relative inline-block ml-2 align-middle">
                <i data-lucide="help-circle" class="w-4 h-4 text-slate-400 cursor-help"></i>
                <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-slate-800 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                    ${text}
                    <div class="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
                </div>
            </div>
        `;
    }

    function render() {
        root.innerHTML = `
            <div class="max-w-3xl mx-auto space-y-8 animate-fade-in">
                ${renderHeader()}
                ${renderStepper()}
                
                <div class="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 min-h-[400px]">
                    ${state.isLoading ? renderLoading() : renderStepContent()}
                </div>

                ${renderActions()}
            </div>
        `;

        attachListeners();
        // Auto-resize textareas
        root.querySelectorAll('textarea').forEach(autoResizeTextarea);
        if (window.lucide) window.lucide.createIcons();
    }

    function renderHeader() {
        return `
            <header class="text-center space-y-2">
                <h2 class="text-2xl font-bold text-slate-900 dark:text-white">Assistant de Résolution</h2>
                <p class="text-slate-500 dark:text-slate-400">Transforme le conflit en connexion en 5 étapes.</p>
            </header>
        `;
    }

    function renderStepper() {
        const steps = ['Situation', 'Diagnostic', 'Décodage', 'Stratégie', 'Réponse'];
        return `
            <div class="flex justify-between items-center relative">
                <div class="absolute left-0 top-1/2 w-full h-0.5 bg-slate-200 dark:bg-slate-800 -z-10"></div>
                ${steps.map((label, idx) => {
            const active = idx === state.step;
            const completed = idx < state.step;
            return `
                        <div class="flex flex-col items-center gap-2 bg-slate-50 dark:bg-slate-950 px-2">
                            <div class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors
                                ${active ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' :
                    completed ? 'bg-green-500 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'}">
                                ${completed ? '✓' : idx + 1}
                            </div>
                            <span class="text-xs font-medium ${active ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500'}">${label}</span>
                        </div>
                    `;
        }).join('')}
            </div>
        `;
    }

    function renderLoading() {
        return `
            <div class="flex flex-col items-center justify-center h-full py-12 space-y-4">
                <div class="relative w-16 h-16">
                    <div class="absolute inset-0 border-4 border-slate-200 dark:border-slate-700 rounded-full"></div>
                    <div class="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                </div>
                <p class="text-slate-600 dark:text-slate-300 font-medium animate-pulse">L'IA analyse la situation...</p>
            </div>
        `;
    }

    function renderStepContent() {
        switch (state.step) {
            case STEPS.SITUATION:
                return `
                    <div class="space-y-6">
                        <div class="space-y-4">
                            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                Que s'est-il passé ? (Contexte)
                                ${renderTooltip('Décris la situation objectivement, comme si une caméra filmait la scène. Évite les jugements.')}
                            </label>
                            <textarea id="input-context" class="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border-0 ring-1 ring-slate-200 dark:ring-slate-700 focus:ring-2 focus:ring-blue-500 transition-all" 
                                rows="3" placeholder="Ex: Réunion d'équipe, mon collègue m'a coupé la parole...">${state.data.context}</textarea>
                        </div>
                        <div class="space-y-4">
                            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                Quel a été le déclencheur ? (Phrase, geste...)
                                ${renderTooltip('Le moment précis qui t\'a fait réagir. Un mot, un ton, un geste spécifique.')}
                            </label>
                            <textarea id="input-signal" class="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border-0 ring-1 ring-slate-200 dark:ring-slate-700 focus:ring-2 focus:ring-blue-500 transition-all" 
                                rows="2" placeholder="Ex: Il a dit 'Ce n'est pas important' avec un soupir.">${state.data.partnerSignal}</textarea>
                        </div>
                    </div>
                `;

            case STEPS.DIAGNOSTIC:
                const levelColor = state.data.crisisLevel >= 4 ? 'text-red-600 bg-red-50 border-red-200' :
                    state.data.crisisLevel === 3 ? 'text-orange-600 bg-orange-50 border-orange-200' : 'text-green-600 bg-green-50 border-green-200';
                return `
                    <div class="space-y-6">
                        <div class="flex items-center gap-4 p-4 rounded-xl border ${levelColor} dark:bg-opacity-10">
                            <div class="text-3xl font-bold">Niveau ${state.data.crisisLevel}</div>
                            <div class="flex-1">
                                <h3 class="font-bold">Diagnostic de Crise ${renderTooltip('Évaluation de l\'urgence émotionnelle de 1 (Calme) à 5 (Danger).')}</h3>
                                <div class="mt-1">
                                    <label class="text-xs font-semibold text-slate-500 uppercase">Fact Check (Editable)</label>
                                    <textarea id="input-factcheck" class="w-full p-2 text-sm bg-transparent border-b border-dashed border-slate-300 focus:border-blue-500 focus:ring-0 transition-colors" rows="2">${state.data.factCheck}</textarea>
                                </div>
                            </div>
                        </div>
                        
                        <div>
                            <h4 class="text-sm font-semibold mb-3">Déclencheurs identifiés :</h4>
                            <div class="flex flex-wrap gap-2">
                                ${state.data.triggers.map(t => `
                                    <span class="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-sm border border-slate-200 dark:border-slate-700">
                                        ${t}
                                    </span>
                                `).join('')}
                            </div>
                            <p class="text-xs text-slate-400 mt-2 italic">Si le diagnostic semble incorrect, tu peux le régénérer.</p>
                        </div>
                    </div>
                `;

            case STEPS.DECODING:
                return `
                    <div class="grid md:grid-cols-2 gap-6">
                        <div class="p-5 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800">
                            <h3 class="font-bold text-blue-700 dark:text-blue-300 mb-2">Ton Besoin (Self) ${renderTooltip('Ce qui te manque vraiment en ce moment (ex: Écoute, Respect, Sécurité).')}</h3>
                            <textarea id="input-need-self" class="w-full p-2 bg-white/50 dark:bg-black/20 rounded border border-blue-200 dark:border-blue-800 text-lg font-medium text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500" rows="2">${state.data.needs.self}</textarea>
                        </div>
                        <div class="p-5 rounded-xl bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800">
                            <h3 class="font-bold text-purple-700 dark:text-purple-300 mb-2">Son Besoin (Partner) ${renderTooltip('Ce qu\'il/elle essaie probablement de dire maladroitement.')}</h3>
                            <textarea id="input-need-partner" class="w-full p-2 bg-white/50 dark:bg-black/20 rounded border border-purple-200 dark:border-purple-800 text-lg font-medium text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-purple-500" rows="2">${state.data.needs.partner}</textarea>
                        </div>
                    </div>
                    <div class="mt-6 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg text-sm text-slate-600 dark:text-slate-400 italic">
                        "${state.data.decodingExplanation}"
                    </div>
                `;

            case STEPS.STRATEGY:
                return `
                    <div class="space-y-6">
                        <div class="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
                            <h3 class="font-bold text-emerald-800 dark:text-emerald-200 mb-1">Recommandation : ${state.data.protocol}</h3>
                            <p class="text-sm text-emerald-700 dark:text-emerald-300">Ce protocole est le mieux adapté à la situation actuelle.</p>
                        </div>

                        <div class="space-y-3">
                            <p class="text-sm font-semibold text-slate-500">Autres options :</p>
                            ${state.data.protocolOptions.map(opt => `
                                <label class="flex items-start gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-700 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                    <input type="radio" name="protocol" value="${opt.name}" ${opt.name === state.data.protocol ? 'checked' : ''} class="mt-1">
                                    <div>
                                        <div class="font-semibold">${opt.name}</div>
                                        <div class="text-sm text-slate-500">${opt.description}</div>
                                    </div>
                                </label>
                            `).join('')}
                        </div>
                    </div>
                `;

            case STEPS.RESPONSE:
                return `
                    <div class="space-y-6">
                        <div class="grid gap-4">
                            ${state.data.responses.map((resp, idx) => `
                                <div class="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-400 transition-colors group relative">
                                    <div class="flex justify-between items-center mb-2">
                                        <span class="px-2 py-1 rounded text-xs font-bold bg-slate-100 dark:bg-slate-700 uppercase tracking-wider">${resp.type}</span>
                                        <div class="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button class="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded" onclick="navigator.clipboard.writeText('${escapeHTML(resp.text)}')">
                                                <i data-lucide="copy" class="w-4 h-4 text-slate-400"></i>
                                            </button>
                                        </div>
                                    </div>
                                    <textarea class="w-full bg-transparent border-0 focus:ring-0 p-0 text-slate-700 dark:text-slate-300 leading-relaxed resize-none" rows="3" readonly>${escapeHTML(resp.text)}</textarea>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;
        }
    }

    function renderActions() {
        if (state.isLoading) return '';

        const backBtn = state.step > 0 ? `
            <button class="px-6 py-3 rounded-xl font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors" data-action="back">
                Retour
            </button>
        ` : '<div></div>';

        let nextBtn = '';
        let regenBtn = `<button class="text-slate-400 hover:text-blue-600 text-sm flex items-center gap-1 mr-auto" data-action="regenerate">
                            <i data-lucide="refresh-cw" class="w-3 h-3"></i> Régénérer
                        </button>`;

        switch (state.step) {
            case STEPS.SITUATION:
                nextBtn = `<button class="btn btn-md btn-primary" data-action="analyze">Lancer le Diagnostic →</button>`;
                regenBtn = ''; // No regen for input step
                break;
            case STEPS.DIAGNOSTIC:
                nextBtn = `<button class="btn-primary" data-action="decode">Décoder les Besoins →</button>`;
                break;
            case STEPS.DECODING:
                nextBtn = `<button class="btn-primary" data-action="strategize">Trouver une Stratégie →</button>`;
                break;
            case STEPS.STRATEGY:
                nextBtn = `<button class="btn-primary" data-action="generate">Générer les Réponses →</button>`;
                break;
            case STEPS.RESPONSE:
                nextBtn = `<button class="btn-success" data-action="save">Sauvegarder au Journal</button>`;
                break;
        }

        return `
            <div class="flex justify-between items-center pt-4 border-t border-slate-200 dark:border-slate-800">
                <div class="flex gap-4">
                    ${backBtn}
                    ${regenBtn}
                </div>
                ${nextBtn}
            </div>
        `;
    }

    function attachListeners() {
        // Inputs
        if (state.step === STEPS.SITUATION) {
            const ctxInput = root.querySelector('#input-context');
            const sigInput = root.querySelector('#input-signal');
            if (ctxInput) ctxInput.addEventListener('input', e => state.data.context = e.target.value);
            if (sigInput) sigInput.addEventListener('input', e => state.data.partnerSignal = e.target.value);
        }

        // Editable Diagnostic
        if (state.step === STEPS.DIAGNOSTIC) {
            const factInput = root.querySelector('#input-factcheck');
            if (factInput) factInput.addEventListener('input', e => state.data.factCheck = e.target.value);
        }

        // Editable Needs
        if (state.step === STEPS.DECODING) {
            const selfInput = root.querySelector('#input-need-self');
            const partnerInput = root.querySelector('#input-need-partner');
            if (selfInput) selfInput.addEventListener('input', e => state.data.needs.self = e.target.value);
            if (partnerInput) partnerInput.addEventListener('input', e => state.data.needs.partner = e.target.value);
        }

        // Protocol Selection
        if (state.step === STEPS.STRATEGY) {
            root.querySelectorAll('input[name="protocol"]').forEach(radio => {
                radio.addEventListener('change', e => state.data.protocol = e.target.value);
            });
        }

        // Actions
        root.querySelectorAll('[data-action]').forEach(btn => {
            btn.addEventListener('click', e => {
                const action = e.target.closest('[data-action]').dataset.action;
                handleAction(action);
            });
        });
    }

    function handleAction(action) {
        switch (action) {
            case 'back':
                state.step--;
                render();
                break;
            case 'regenerate':
                // Regenerate current step
                const stepMap = {
                    [STEPS.DIAGNOSTIC]: 'diagnostic',
                    [STEPS.DECODING]: 'decoding',
                    [STEPS.STRATEGY]: 'strategy',
                    [STEPS.RESPONSE]: 'response'
                };
                if (stepMap[state.step]) {
                    runAIAnalysis(stepMap[state.step]);
                }
                break;
            case 'analyze':
                if (!state.data.context || !state.data.partnerSignal) {
                    toast.error("Remplis les champs pour continuer.");
                    // Visual shake feedback
                    const ctxInput = document.getElementById('input-context');
                    const sigInput = document.getElementById('input-signal');
                    if (!state.data.context && ctxInput) {
                        ctxInput.classList.add('ring-2', 'ring-red-500', 'animate-pulse');
                        setTimeout(() => ctxInput.classList.remove('ring-2', 'ring-red-500', 'animate-pulse'), 1000);
                    }
                    if (!state.data.partnerSignal && sigInput) {
                        sigInput.classList.add('ring-2', 'ring-red-500', 'animate-pulse');
                        setTimeout(() => sigInput.classList.remove('ring-2', 'ring-red-500', 'animate-pulse'), 1000);
                    }
                    return;
                }
                runAIAnalysis('diagnostic');
                break;
            case 'decode':
                runAIAnalysis('decoding');
                break;
            case 'strategize':
                runAIAnalysis('strategy');
                break;
            case 'generate':
                runAIAnalysis('response');
                break;
            case 'save':
                saveEntry();
                break;
        }
    }

    function saveEntry() {
        const entry = {
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
            type: 'wizard-analysis',
            summary: `Analyse: ${state.data.context.substring(0, 50)}...`,
            data: state.data
        };
        store.saveEntry(entry);
        toast.success("Analyse sauvegardée !");
        if (onSaved) onSaved(entry);
    }

    return { render };
}
