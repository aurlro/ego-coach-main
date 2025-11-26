/**
 * Dojo Simulator - Interactive Training for Ego-Aware Communication
 * Simulates real scenarios and provides immediate feedback
 */
import { escapeHTML } from '../security.js';

export function createDojoSimulator({ modal, toast }) {
    let currentScenario = null;
    let scenarioProgress = {
        completed: [],
        scores: {},
    };

    let SCENARIOS = [];

    async function loadScenarios() {
        try {
            const response = await fetch('assets/js/data/questions.json');
            if (!response.ok) throw new Error('Failed to load scenarios');
            SCENARIOS = await response.json();
        } catch (error) {
            console.error('Error loading scenarios:', error);
            toast.error('Erreur lors du chargement des scénarios');
        }
    }

    // Load scenarios on initialization
    loadScenarios();

    /**
     * Démarre un scénario
     */
    function startScenario(scenarioId) {
        currentScenario = SCENARIOS.find((s) => s.id === scenarioId);
        if (!currentScenario) return;

        renderScenarioModal();
    }

    /**
     * Rend la modal du scénario
     */
    function renderScenarioModal() {
        if (!currentScenario) return;

        const {
            ego, egoEmoji,
            pattern, patternEmoji,
            category,
            title, situation, context, instinctiveResponse, feedback, betterResponses, keyLearning
        } = currentScenario;

        // Determine if this is couple or individual scenario
        const isCoupleScenario = category === 'Couple';
        const label = isCoupleScenario ? 'Pattern relationnel :' : 'L\'ego actif :';
        const displayName = isCoupleScenario ? pattern : ego;
        const emoji = isCoupleScenario ? patternEmoji : egoEmoji;

        const html = `
            <div class="dojo-scenario space-y-6">
                <!-- Ego/Pattern Badge -->
                <div class="dojo-ego-badge" style="border-left: 4px solid var(--accent-warning);">
                    <span class="dojo-ego-emoji">${emoji}</span>
                    <div>
                        <p class="text-sm font-semibold text-slate-700 dark:text-slate-300">${label}</p>
                        <p class="text-lg font-bold text-slate-900 dark:text-slate-100">${displayName}</p>
                    </div>
                </div>

                <!-- Scenario Setup -->
                <div class="dojo-scenario-setup space-y-3">
                    <h3 class="text-xl font-bold text-slate-900 dark:text-slate-100">${title}</h3>
                    <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                        <p class="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">📍 La situation :</p>
                        <p class="text-blue-800 dark:text-blue-200">${situation}</p>
                    </div>
                    <div class="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
                        <p class="text-sm font-semibold text-purple-900 dark:text-purple-100 mb-2">🎭 Contexte émotionnel :</p>
                        <p class="text-purple-800 dark:text-purple-200">${context}</p>
                    </div>
                </div>

                <!-- Instinctive Response -->
                <div class="dojo-instinctive space-y-3">
                    <h4 class="text-lg font-bold text-slate-900 dark:text-slate-100">
                        🤖 Ta réponse instinctive (sous ego) :
                    </h4>
                    <div class="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded">
                        <p class="italic text-red-800 dark:text-red-200">
                            "${instinctiveResponse}"
                        </p>
                    </div>
                </div>

                <!-- Feedback Section -->
                <div class="dojo-feedback space-y-3">
                    <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                        <p class="font-bold text-red-900 dark:text-red-100 mb-2">
                            <i class="fas fa-search mr-2"></i>Analyse de l'erreur : ${feedback.title}
                        </p>
                        <ul class="space-y-1 text-sm text-red-800 dark:text-red-200 list-disc list-inside">
                            ${feedback.analysis.map((item) => `<li>${item}</li>`).join('')}
                        </ul>
                    </div>

                    <div class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                        <p class="font-bold text-yellow-900 dark:text-yellow-100 mb-2">💊 L'antidote :</p>
                        <p class="text-yellow-800 dark:text-yellow-200">"${feedback.antidote}"</p>
                    </div>
                </div>

                <!-- Better Responses -->
                <div class="dojo-better-responses space-y-3">
                    <h4 class="text-lg font-bold text-slate-900 dark:text-slate-100">
                        ✨ Réponses plus alignées (sans ego) :
                    </h4>
                    ${betterResponses
                .map(
                    (resp, idx) => `
                        <div class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                            <div class="flex justify-between items-start gap-2 mb-2">
                                <p class="text-sm font-bold text-green-900 dark:text-green-100">
                                    Option ${idx + 1} (Score: ${resp.score}/100)
                                </p>
                                <span class="text-lg">${Array(Math.floor(resp.score / 20))
                            .fill('⭐')
                            .join('')}</span>
                            </div>
                            <p class="italic text-green-800 dark:text-green-200 mb-2">
                                "${resp.response}"
                            </p>
                            <p class="text-xs text-green-700 dark:text-green-300">
                                💡 Pourquoi : ${resp.reason}
                            </p>
                        </div>
                    `,
                )
                .join('')}
                </div>

                <!-- Key Learning -->
                <div class="bg-slate-100 dark:bg-slate-800 rounded-lg p-4 border-l-4 border-accent-primary">
                    <p class="font-bold text-slate-900 dark:text-slate-100 mb-2">🎯 Clé d'apprentissage :</p>
                    <p class="text-sm text-slate-700 dark:text-slate-300">
                        ${keyLearning}
                    </p>
                </div>
            </div>
        `;

        modal.show({
            targetId: 'dojo-modal',
            title: `🧗 Dojo : ${isCoupleScenario ? 'Couple' : 'Ego'} ${emoji}`,
            html,
            actions: [
                {
                    label: 'Scénario suivant',
                    variant: 'primary',
                    onClick: () => {
                        const currentIndex = SCENARIOS.findIndex((s) => s.id === currentScenario.id);
                        if (currentIndex < SCENARIOS.length - 1) {
                            startScenario(SCENARIOS[currentIndex + 1].id);
                        } else {
                            showProgressSummary();
                        }
                    },
                },
                {
                    label: 'Menu Dojo',
                    onClick: () => showDojoMenu(),
                },
            ],
        });
    }

    /**
     * Affiche le menu principal du dojo
     */
    function showDojoMenu() {
        const scenariosList = SCENARIOS.map(
            (scenario) => {
                const isCouple = scenario.category === 'Couple';
                const emoji = isCouple ? scenario.patternEmoji : scenario.egoEmoji;
                const name = isCouple ? scenario.pattern : scenario.ego;
                return `
                <button type="button" class="dojo-scenario-button" data-scenario-id="${scenario.id}">
                    <span class="dojo-scenario-emoji">${emoji}</span>
                    <div class="dojo-scenario-info">
                        <p class="font-semibold">${name}</p>
                        <p class="text-sm text-slate-600 dark:text-slate-400">${scenario.title}</p>
                    </div>
                </button>
            `;
            }
        ).join('');

        const html = `
            <div class="space-y-4">
                <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <p class="text-sm text-blue-900 dark:text-blue-100">
                        <strong>Bienvenue au Dojo ! 🧗</strong><br>
                        Ici, tu peux t'entraîner dans des situations réelles sans risque.
                        Chaque scénario te montre ta réponse instinctive (sous ego),
                        puis te propose des alternatives plus alignées.
                    </p>
                </div>

                <div class="dojo-menu space-y-3">
                    ${scenariosList}
                </div>

                <p class="text-xs text-slate-500 dark:text-slate-400 italic">
                    Tip: Complète tous les scénarios pour renforcer tes nouveaux automatismes 🚀
                </p>
            </div>
        `;

        modal.show({
            targetId: 'dojo-modal',
            title: '🧗 Dojo : Choisir un scénario d\'entraînement',
            html,
            actions: [
                {
                    label: 'Fermer',
                    onClick: () => modal.hide('dojo-modal'),
                },
            ],
        });

        // Attach event listeners
        setTimeout(() => {
            document.querySelectorAll('[data-scenario-id]').forEach((btn) => {
                btn.addEventListener('click', () => {
                    startScenario(btn.getAttribute('data-scenario-id'));
                });
            });
        }, 0);
    }

    /**
     * Affiche un résumé de progression
     */
    function showProgressSummary() {
        const completed = SCENARIOS.length;
        const html = `
            <div class="space-y-4">
                <div class="text-center space-y-2">
                    <p class="text-4xl">🎉</p>
                    <h3 class="text-2xl font-bold text-slate-900 dark:text-slate-100">
                        Dojo complété !
                    </h3>
                    <p class="text-slate-600 dark:text-slate-400">
                        Tu as traversé les 5 egos principaux. C'est un excellent entraînement !
                    </p>
                </div>

                <div class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 space-y-2">
                    <p class="font-bold text-green-900 dark:text-green-100">✅ Scénarios complétés: ${completed}/5</p>
                    <p class="text-sm text-green-800 dark:text-green-200">
                        Chaque ego a été rencontré. Ton cerveau a maintenant de nouveaux patterns à utiliser.
                    </p>
                </div>
                
                <div class="text-center mt-4">
                     <button id="dojo-restart-btn" class="btn btn-primary">Recommencer</button>
                </div>
            </div>
        `;

        modal.show({
            targetId: 'dojo-modal',
            title: '🎉 Félicitations !',
            html,
            actions: [
                {
                    label: 'Fermer',
                    onClick: () => modal.hide('dojo-modal'),
                },
            ],
        });

        setTimeout(() => {
            document.getElementById('dojo-restart-btn')?.addEventListener('click', () => {
                showDojoMenu();
            });
        }, 100);
    }

    return {
        showDojoMenu,
        startScenario,
    };
}
