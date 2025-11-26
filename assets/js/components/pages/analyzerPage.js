import { repository } from '../../data/repository.js';
import { store } from '../../core/store.js';
import { bus } from '../../core/eventBus.js';

export class AnalyzerPage {
    constructor() {
        this.step = 1;
        this.data = {
            context: '',
            egoFocus: '',
            intensity: 5,
            needs: []
        };
    }

    async mount(container) {
        this.container = container;
        this.render();
    }

    render() {
        this.container.innerHTML = `
            <div class="max-w-2xl mx-auto">
                <!-- Progress Bar -->
                <div class="mb-8">
                    <div class="flex justify-between text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">
                        <span>Contexte</span>
                        <span>Identification</span>
                        <span>Stratégie</span>
                    </div>
                    <div class="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div class="h-full bg-blue-600 transition-all duration-500 ease-out" style="width: ${((this.step - 1) / 2) * 100}%"></div>
                    </div>
                </div>

                <!-- Step Content -->
                <div class="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-8">
                    ${this.getStepContent()}
                </div>
            </div>
        `;

        this.attachListeners();
        lucide.createIcons();
    }

    getStepContent() {
        switch (this.step) {
            case 1:
                return `
                    <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-4">Que s'est-il passé ?</h2>
                    <p class="text-slate-600 dark:text-slate-400 mb-6">Décrivez la situation factuellement, sans jugement.</p>
                    
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">La situation</label>
                            <textarea id="input-context" class="w-full h-32 p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border-0 focus:ring-2 focus:ring-blue-500 dark:text-white resize-none" placeholder="Ex: Mon collègue m'a coupé la parole en réunion...">${this.data.context}</textarea>
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Intensité émotionnelle (1-10)</label>
                            <input type="range" id="input-intensity" min="1" max="10" value="${this.data.intensity}" class="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700">
                            <div class="flex justify-between text-xs text-slate-500 mt-1">
                                <span>Calme</span>
                                <span>Explosif</span>
                            </div>
                        </div>
                    </div>

                    <div class="mt-8 flex justify-end">
                        <button id="btn-next" class="btn-primary px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                            Suivant
                        </button>
                    </div>
                `;
            case 2:
                return `
                    <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-4">Qui réagit en vous ?</h2>
                    <p class="text-slate-600 dark:text-slate-400 mb-6">Identifiez la partie de votre ego qui a été touchée.</p>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        ${this.renderEgoOption('La Défensive', 'shield', 'Se sent attaqué, se justifie, contre-attaque.')}
                        ${this.renderEgoOption('Le Sauveur', 'heart-handshake', 'Veut aider sans qu\'on lui demande, s\'épuise.')}
                        ${this.renderEgoOption('Le Martyr', 'frown', 'Se plaint, subit, attend qu\'on devine ses besoins.')}
                        ${this.renderEgoOption('Le Juge', 'gavel', 'Critique, sait mieux que les autres, moralise.')}
                    </div>

                    <div class="mt-8 flex justify-between">
                        <button id="btn-back" class="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">Retour</button>
                        <button id="btn-next" class="btn-primary px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" ${!this.data.egoFocus ? 'disabled' : ''}>
                            Suivant
                        </button>
                    </div>
                `;
            case 3:
                return `
                    <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-4">Plan d'action</h2>
                    <p class="text-slate-600 dark:text-slate-400 mb-6">Voici une proposition de stratégie basée sur votre analyse.</p>
                    
                    <div class="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border border-blue-100 dark:border-blue-800 mb-6">
                        <h3 class="font-bold text-blue-800 dark:text-blue-300 mb-2">Antidote : ${this.getAntidote(this.data.egoFocus)}</h3>
                        <p class="text-blue-700 dark:text-blue-200 text-sm">
                            Pour calmer "${this.data.egoFocus}", essayez de valider l'émotion de l'autre avant de proposer une solution.
                        </p>
                    </div>

                    <div class="space-y-4 mb-8">
                        <label class="block text-sm font-medium text-slate-700 dark:text-slate-300">Votre réponse (MVP)</label>
                        <textarea id="input-response" class="w-full h-32 p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border-0 focus:ring-2 focus:ring-blue-500 dark:text-white resize-none" placeholder="Je comprends que..."></textarea>
                    </div>

                    <div class="flex justify-between">
                        <button id="btn-back" class="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">Retour</button>
                        <button id="btn-save" class="btn-primary px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                            Enregistrer dans le Journal
                        </button>
                    </div>
                `;
        }
    }

    renderEgoOption(name, icon, description) {
        const isSelected = this.data.egoFocus === name;
        return `
            <div class="ego-option cursor-pointer p-4 rounded-xl border-2 transition-all ${isSelected ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20' : 'border-slate-200 dark:border-slate-700 hover:border-blue-300'}" data-value="${name}">
                <div class="flex items-center gap-3 mb-2">
                    <i data-lucide="${icon}" class="w-5 h-5 ${isSelected ? 'text-blue-600' : 'text-slate-400'}"></i>
                    <span class="font-bold ${isSelected ? 'text-blue-900 dark:text-blue-300' : 'text-slate-700 dark:text-slate-300'}">${name}</span>
                </div>
                <p class="text-xs text-slate-500 dark:text-slate-400">${description}</p>
            </div>
        `;
    }

    getAntidote(ego) {
        const antidotes = {
            'La Défensive': 'Écoute active + Pause',
            'Le Sauveur': 'Demander : "De quoi as-tu besoin ?"',
            'Le Martyr': 'Exprimer son besoin clairement',
            'Le Juge': 'Curiosité bienveillante'
        };
        return antidotes[ego] || 'Respiration consciente';
    }

    attachListeners() {
        // Inputs
        const contextInput = this.container.querySelector('#input-context');
        if (contextInput) {
            contextInput.addEventListener('input', (e) => this.data.context = e.target.value);
        }

        const intensityInput = this.container.querySelector('#input-intensity');
        if (intensityInput) {
            intensityInput.addEventListener('input', (e) => this.data.intensity = e.target.value);
        }

        // Ego Selection
        this.container.querySelectorAll('.ego-option').forEach(opt => {
            opt.addEventListener('click', () => {
                this.data.egoFocus = opt.dataset.value;
                this.render();
            });
        });

        // Navigation
        const btnNext = this.container.querySelector('#btn-next');
        if (btnNext) {
            btnNext.addEventListener('click', () => {
                this.step++;
                this.render();
            });
        }

        const btnBack = this.container.querySelector('#btn-back');
        if (btnBack) {
            btnBack.addEventListener('click', () => {
                this.step--;
                this.render();
            });
        }

        // Save
        const btnSave = this.container.querySelector('#btn-save');
        if (btnSave) {
            btnSave.addEventListener('click', async () => {
                const response = this.container.querySelector('#input-response')?.value || '';

                const entry = {
                    context: this.data.context,
                    egoFocus: this.data.egoFocus,
                    intensity: this.data.intensity,
                    summary: `Analyse : ${this.data.egoFocus}`,
                    insights: [`Antidote utilisé : ${this.getAntidote(this.data.egoFocus)}`, `Réponse MVP : ${response}`],
                    source: 'manual'
                };

                try {
                    await repository.saveJournalEntry(entry);

                    // Update store
                    const updatedJournal = await repository.getJournal();
                    store.setState({ journal: updatedJournal });

                    // Redirect to Journal
                    window.location.hash = 'journal';
                } catch (error) {
                    console.error('Error saving:', error);
                    alert('Erreur lors de la sauvegarde');
                }
            });
        }
    }

    async unmount() { }
}
