import { escapeHTML } from '../security.js';

export function createGuideModule({ rootId, toast, dojo, modal }) {
    const root = document.getElementById(rootId);
    if (!root) {
        console.warn(`Racine guide "${rootId}" introuvable.`);
        return { render: () => { } };
    }

    function renderDebugPanel() {
        const isDevMode = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        if (isDevMode) {
            return '';
        }

        return `
            <section class="debug-panel card">
                <h3 class="card-title">Debug Tools</h3>
                <div class="form-group">
                    <label for="debug-ollama-endpoint" class="form-label">Ollama Endpoint</label>
                    <input type="text" id="debug-ollama-endpoint" class="form-input" value="${localStorage.getItem('ollama.endpoint.v1') || ''}">
                </div>
                <div class="form-group">
                    <label for="debug-ollama-model" class="form-label">Ollama Model</label>
                    <input type="text" id="debug-ollama-model" class="form-input" value="${localStorage.getItem('ollama.model.v1') || ''}">
                </div>
            </section>
        `;
    }

    function render() {
        root.innerHTML = `
            <div class="space-y-6">
                <header>
                    <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-100">Playbook & Entraînement</h2>
                    <p class="text-slate-600 dark:text-slate-400 text-sm">
                        Les fondamentaux + ton simulateur de vol : Dojo d'entraînement pour les egos.
                    </p>
                </header>

                <!-- DOJO BUTTON -->
                <div class="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-2 border-purple-200 dark:border-purple-800 rounded-xl p-6">
                    <div class="flex items-center gap-4">
                        <div class="text-4xl">🧗</div>
                        <div class="flex-1">
                            <h3 class="text-xl font-bold text-slate-900 dark:text-slate-100 mb-1">Démarrer le Dojo</h3>
                            <p class="text-sm text-slate-600 dark:text-slate-400">
                                Entraîne-toi sur 5 scénarios réels. Vois ta réponse sous ego, puis l'antidote.
                            </p>
                        </div>
                        <button type="button" class="primary-button" id="dojo-button">
                            Démarrer →
                        </button>
                    </div>
                </div>

                <section class="dashboard-card space-y-4">
                    <header>
                        <h3 class="text-lg font-semibold text-slate-800 dark:text-slate-100">System Prompt (Persona IA)</h3>
                        <p class="text-sm text-slate-500 dark:text-slate-400">
                            Brief initial pour garder la même dynamique lors d’un échange avec ton IA préférée.
                        </p>
                    </header>
                    <pre class="bg-slate-900 dark:bg-slate-950 text-slate-100 rounded-xl p-4 text-xs overflow-x-auto whitespace-pre-wrap leading-relaxed">${escapeHTML(
            getSystemPromptExcerpt(),
        )}</pre>
                    <button type="button" class="primary-button self-start" data-copy-text="${escapeHTML(
            getSystemPromptExcerpt(),
        )}" data-toast-success="Persona copié.">
                        📋 Copier la persona
                    </button>
                </section>

                <section class="dashboard-card space-y-4">
                    <h3 class="text-lg font-semibold text-slate-800 dark:text-slate-100">Glossaire Ego Radar</h3>
                    <div class="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                        ${renderGlossary()}
                    </div>
                </section>

                <section class="dashboard-card space-y-4">
                    <h3 class="text-lg font-semibold text-slate-800 dark:text-slate-100">Framework de réponse MVP</h3>
                    <ol class="list-decimal pl-5 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                        <li>Pause et respiration (30s) pour recharger ton cortex.</li>
                        <li>Valide explicitement la frustration ou la peur exprimée.</li>
                        <li>Réponds au besoin métier (User Story) en une proposition concrète.</li>
                        <li>Propose la suite : MVP livré + itération planifiée.</li>
                    </ol>
                </section>
                ${renderDebugPanel()}
            </div>
        `;
    }

    function getSystemPromptExcerpt() {
        return `Tu es un Coach & Analyste en communication de crise interpersonnelle. Ta méthodologie : 
1. Valider l'émotion.
2. Diagnostiquer l'ego (Défensive, Sauveur, Martyr, Dernier Mot, Refus d'influence).
3. Identifier le besoin caché.
4. Proposer 2-3 scripts de réponse (objectif : désescalade, limite, alignement).`;
    }

    function renderGlossary() {
        const items = [
            {
                label: 'La Défensive',
                description:
                    "Réflexe de justification instantanée. Antidote : accepter le feedback sans contre-attaque, 2 phrases maximum.",
            },
            {
                label: 'Le Sauveur',
                description:
                    "Tu veux réparer au lieu d'écouter. Antidote : active la validation radicale avant de proposer un plan.",
            },
            {
                label: 'Le Martyr',
                description:
                    'Tu fais la comptabilité de tes efforts. Antidote : traite chaque sujet comme une user story indépendante.',
            },
            {
                label: 'Le Dernier Mot',
                description:
                    'Besoin de gagner le débat logique. Antidote : silence stratégique, puis question ouverte.',
            },
            {
                label: "Refus d'influence",
                description:
                    "Tu rejètes la méthode de l'autre par principe. Antidote : tester sa proposition 24h en mode MVP.",
            },
        ];

        return items
            .map(
                (item) => `
                    <div>
                        <strong class="text-slate-800 dark:text-slate-100">${item.label}</strong>
                        <p>${item.description}</p>
                    </div>
                `,
            )
            .join('');
    }

    // Setup event listeners after render
    function attachListeners() {
        const dojoButton = root?.querySelector('#dojo-button');
        if (dojoButton) {
            dojoButton.addEventListener('click', () => {
                if (dojo) dojo.open();
            });
        }
    }

    const originalRender = render;
    render = function () {
        originalRender();
        attachListeners();
    };

    return { render };
}
