export class DojoPage {
    constructor() {
        this.scenarios = [
            {
                id: 1,
                title: "Le collègue pressé",
                text: "« T'as toujours pas fini ce dossier ? Franchement, je vais devoir repasser derrière toi comme d'habitude... »",
                ego: "Le Juge",
                options: [
                    { text: "« Désolé, je fais de mon mieux, arrête de me mettre la pression ! »", type: "Défensif", feedback: "Aïe. Tu te justifies et tu contre-attaques. C'est de la Défensive." },
                    { text: "« Tu as raison, je suis nul, donne-le moi je vais le finir ce soir. »", type: "Martyr", feedback: "Tu te dévalorises. C'est du Martyr." },
                    { text: "« Je vois que tu es inquiet pour les délais. Le dossier sera prêt à 14h comme convenu. »", type: "Conscient", feedback: "Bravo ! Validation de l'émotion (inquiétude) + Limite factuelle." }
                ]
            },
            {
                id: 2,
                title: "La belle-mère critique",
                text: "« Tu devrais vraiment mettre un manteau au petit, il fait froid et il va encore tomber malade. »",
                ego: "Le Sauveur",
                options: [
                    { text: "« C'est bon, je sais m'occuper de mon fils merci. »", type: "Défensif", feedback: "Réactif. Tu fermes la porte." },
                    { text: "« Merci de t'inquiéter pour lui. Il a un pull chaud, ça ira pour le trajet. »", type: "Conscient", feedback: "Excellent. Tu accueilles l'intention (protection) sans te soumettre." },
                    { text: "« Oh là là oui tu as raison, je suis une mauvaise mère... »", type: "Martyr", feedback: "Dramatisation inutile." }
                ]
            }
        ];
        this.currentScenarioIndex = 0;
        this.score = 0;
    }

    async mount(container) {
        this.container = container;
        this.render();
    }

    render() {
        const scenario = this.scenarios[this.currentScenarioIndex];
        const isFinished = this.currentScenarioIndex >= this.scenarios.length;

        if (isFinished) {
            this.container.innerHTML = `
                <div class="space-y-8">
                    <div class="max-w-2xl mx-auto text-center p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
                        <div class="w-20 h-20 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mx-auto mb-6 text-yellow-600 dark:text-yellow-400">
                            <i data-lucide="trophy" class="w-10 h-10"></i>
                        </div>
                        <h2 class="text-3xl font-bold text-slate-900 dark:text-white mb-4">Entraînement terminé !</h2>
                        <p class="text-xl text-slate-600 dark:text-slate-400 mb-8">Score : <span class="font-bold text-blue-600">${this.score}/${this.scenarios.length}</span></p>
                        <button id="btn-restart" class="btn btn-primary px-6 py-2">
                            Recommencer
                        </button>
                    </div>
                </div>
            `;
            this.container.querySelector('#btn-restart')?.addEventListener('click', () => {
                this.currentScenarioIndex = 0;
                this.score = 0;
                this.render();
            });
            lucide.createIcons();
            return;
        }

        this.container.innerHTML = `
            <div class="space-y-8">
                <div class="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                    <div>
                        <h2 class="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                            Dojo : Salle d'entraînement
                        </h2>
                        <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
                            Scénario <span class="font-medium text-slate-900 dark:text-white">${this.currentScenarioIndex + 1}/${this.scenarios.length}</span>
                        </p>
                    </div>
                </div>

                <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                    <div class="p-8 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
                        <div class="flex items-center gap-2 mb-4">
                            <span class="px-2 py-1 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 text-xs font-bold rounded uppercase tracking-wide">Adversaire : ${scenario.ego}</span>
                        </div>
                        <p class="text-xl font-medium text-slate-800 dark:text-slate-200 italic">
                            "${scenario.text}"
                        </p>
                    </div>

                    <div class="p-6 space-y-3">
                        <p class="text-sm text-slate-500 dark:text-slate-400 mb-4">Quelle est la meilleure réponse ?</p>
                        ${scenario.options.map((opt, idx) => `
                            <button class="option-btn w-full text-left p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all group" data-idx="${idx}">
                                <div class="flex items-start gap-3">
                                    <div class="mt-0.5 w-5 h-5 rounded-full border border-slate-300 dark:border-slate-600 group-hover:border-blue-500 flex items-center justify-center">
                                        <div class="w-2.5 h-2.5 rounded-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    </div>
                                    <span class="text-slate-700 dark:text-slate-300">${opt.text}</span>
                                </div>
                            </button>
                        `).join('')}
                    </div>
                </div>
                
                <div id="feedback-area" class="hidden"></div>
            </div>
        `;

        this.attachListeners(scenario);
        lucide.createIcons();
    }

    attachListeners(scenario) {
        this.container.querySelectorAll('.option-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = parseInt(e.currentTarget.dataset.idx);
                const option = scenario.options[idx];
                this.showFeedback(option);
            });
        });
    }

    showFeedback(option) {
        const isCorrect = option.type === 'Conscient';
        if (isCorrect) this.score++;

        const feedbackArea = this.container.querySelector('#feedback-area');
        feedbackArea.innerHTML = `
            <div class="p-6 rounded-xl ${isCorrect ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800' : 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'} border">
                <div class="flex items-start gap-4">
                    <div class="p-2 rounded-full ${isCorrect ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}">
                        <i data-lucide="${isCorrect ? 'check' : 'x'}" class="w-6 h-6"></i>
                    </div>
                    <div>
                        <h3 class="font-bold ${isCorrect ? 'text-green-800 dark:text-green-300' : 'text-red-800 dark:text-red-300'} mb-1">
                            ${isCorrect ? 'Bien joué !' : 'Pas tout à fait...'}
                        </h3>
                        <p class="${isCorrect ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'} mb-4">
                            ${option.feedback}
                        </p>
                        <button id="btn-continue" class="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg font-medium hover:opacity-90 transition-opacity">
                            Continuer
                        </button>
                    </div>
                </div>
            </div>
        `;
        feedbackArea.classList.remove('hidden');
        lucide.createIcons();

        // Disable buttons
        this.container.querySelectorAll('.option-btn').forEach(btn => btn.disabled = true);

        this.container.querySelector('#btn-continue').addEventListener('click', () => {
            this.currentScenarioIndex++;
            this.render();
        });
    }

    async unmount() { }
}
