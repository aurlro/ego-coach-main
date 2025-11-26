import { store } from '../../core/store.js';
import { repository } from '../../data/repository.js';
import { bus } from '../../core/eventBus.js';

export class JournalPage {
    async mount(container) {
        this.container = container;
        this.render();

        // Subscribe to state changes to re-render if journal updates
        this.unsubscribe = bus.on('state:journal', () => this.render());
    }

    async render() {
        const { journal } = store.getState();

        const entriesHtml = journal.length > 0
            ? `<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                ${journal.map(entry => `
                <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 hover:shadow-md transition-shadow group relative flex flex-col h-full">
                    <div class="flex justify-between items-start gap-4 mb-4">
                        <span class="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                            ${entry.egoFocus || 'Général'}
                        </span>
                        <button class="btn-reopen p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors opacity-0 group-hover:opacity-100" data-id="${entry.id}" title="Rouvrir / Editer">
                            <i data-lucide="edit-3" class="w-4 h-4"></i>
                        </button>
                        <button class="btn-delete p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors opacity-0 group-hover:opacity-100" data-id="${entry.id}" title="Supprimer">
                            <i data-lucide="trash-2" class="w-4 h-4"></i>
                        </button>
                    </div>
                    
                    <div class="flex-1">
                        <h3 class="text-lg font-semibold text-slate-900 dark:text-white mb-2 line-clamp-1" title="${entry.summary || 'Analyse sans titre'}">
                            ${entry.summary || 'Analyse sans titre'}
                        </h3>
                        <p class="text-slate-600 dark:text-slate-300 text-sm line-clamp-3 mb-4">
                            ${entry.context || 'Pas de contexte'}
                        </p>
                        
                        ${entry.insights && entry.insights.length > 0 ? `
                            <div class="flex flex-wrap gap-2 mb-4">
                                ${entry.insights.slice(0, 2).map(insight => `
                                    <span class="inline-flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                                        <i data-lucide="lightbulb" class="w-3 h-3 text-yellow-500"></i> ${insight.substring(0, 20)}...
                                    </span>
                                `).join('')}
                            </div>
                        ` : ''}
                    </div>

                    <div class="pt-4 mt-auto border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-xs text-slate-400">
                        <span class="flex items-center gap-1">
                            <i data-lucide="calendar" class="w-3 h-3"></i>
                            ${new Date(entry.createdAt).toLocaleDateString()}
                        </span>
                        <span class="flex items-center gap-1">
                            <i data-lucide="clock" class="w-3 h-3"></i>
                            ${new Date(entry.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    </div>
                </div>
            `).join('')}
            </div>`
            : `
                <div class="flex flex-col items-center justify-center py-16 text-center bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                    <div class="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                        <i data-lucide="book-open" class="w-8 h-8 text-slate-400"></i>
                    </div>
                    <h3 class="text-lg font-medium text-slate-900 dark:text-white mb-1">Journal vide</h3>
                    <p class="text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-6">
                        Vous n'avez pas encore enregistré d'analyses. Commencez par analyser une situation.
                    </p>
                    <a href="#analyze" class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                        <i data-lucide="plus" class="w-4 h-4"></i>
                        Nouvelle analyse
                    </a>
                </div>
            `;

        this.container.innerHTML = `
            <div class="w-full max-w-[1600px] mx-auto px-6">
                <div class="flex items-center justify-between mb-8">
                    <div>
                        <h1 class="text-2xl font-bold text-slate-900 dark:text-white">Mon Journal</h1>
                        <p class="text-slate-500 dark:text-slate-400">Historique de vos réflexions et analyses.</p>
                    </div>
                    <div class="flex gap-2">
                        <button id="new-entry-btn" class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm">
                            <i data-lucide="plus" class="w-4 h-4"></i>
                            Nouvelle Entrée
                        </button>
                    </div>
                </div>

                ${entriesHtml}
            </div>
        `;

        lucide.createIcons();
        this.attachListeners();
    }

    attachListeners() {
        this.container.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const id = e.currentTarget.dataset.id;

                import('../ui/confirmationModal.js').then(({ showConfirmationModal }) => {
                    showConfirmationModal({
                        title: 'Supprimer cette entrée ?',
                        message: 'Cette action est irréversible. Êtes-vous sûr de vouloir supprimer cette analyse de votre journal ?',
                        confirmText: 'Supprimer',
                        cancelText: 'Annuler',
                        onConfirm: async () => {
                            try {
                                await repository.deleteJournalEntry(id);
                                const updatedJournal = await repository.getJournal();
                                store.setState({ journal: updatedJournal });
                                console.log('Entry deleted');
                            } catch (error) {
                                console.error('Failed to delete:', error);
                            }
                        }
                    });
                });
            });
        });

        this.container.querySelectorAll('.btn-reopen').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.dataset.id;
                const entry = store.getState().journal.find(e => e.id === id);
                if (entry && entry.data) {
                    // Set current analysis in store to pre-fill wizard
                    store.setState({ currentAnalysis: entry.data });
                    // Navigate to analyzer
                    window.location.hash = 'analyze';
                } else {
                    console.warn('Cannot reopen entry: missing data', entry);
                }
            });
        });

        this.container.querySelector('#new-entry-btn')?.addEventListener('click', () => {
            window.location.hash = 'analyze';
        });
    }

    async unmount() {
        if (this.unsubscribe) this.unsubscribe();
    }
}
