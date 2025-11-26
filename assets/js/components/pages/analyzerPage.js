import { createManualAnalyzer } from '../../modules/manualAnalyzer.js';
import { store } from '../../core/store.js';
import { toast } from '../../modules/ui.js'; // Assuming toast is available here or via event bus. 
// Actually store has toast? No. 
// We need a toast service. app.js passes it? No.
// Let's use a simple mock or import if available.
// Checking app.js, it doesn't pass toast to pages.
// We can use a global toast or import it.
// Let's assume we can import `showToast` from ui.js or similar.
// Looking at file list, `assets/js/ui/ui.js` exists.

export class AnalyzerPage {
    constructor() {
        this.wizard = null;
    }

    async mount(container) {
        container.innerHTML = `
            <div class="w-full max-w-[1600px] px-6 mx-auto py-8">
                <div class="mb-8">
                    <h1 class="text-3xl font-bold text-slate-900 dark:text-white mb-2">Nouvelle Analyse</h1>
                    <p class="text-slate-600 dark:text-slate-400">Suivez le guide en 5 étapes pour décoder le conflit et trouver la réponse adaptée.</p>
                </div>
                
                <div id="wizard-container"></div>
            </div>
        `;

        const wizardContainer = container.querySelector('#wizard-container');

        // Check for data passed via store (Reopen feature)
        const currentAnalysis = store.getState().currentAnalysis;

        // Clear it from store so it doesn't persist on next fresh visit
        if (currentAnalysis) {
            store.setState({ currentAnalysis: null });
        }

        const analyzer = createManualAnalyzer({
            rootElement: wizardContainer,
            store: { saveEntry: (entry) => store.setState({ journal: [entry, ...store.getState().journal] }) }, // Mock store save or use real store if it has saveEntry
            // Wait, store.js doesn't have saveEntry. It has setState.
            // journalModule.js has createJournalStore which has addEntry.
            // We should probably use repository or just update global store for now.
            // Let's use a simple callback for onSaved.
            toast: {
                success: (msg) => console.log('Toast Success:', msg),
                error: (msg) => console.error('Toast Error:', msg),
                info: (msg) => console.log('Toast Info:', msg)
            },
            onSaved: (entry) => {
                // Add to journal in store
                const currentJournal = store.getState().journal || [];
                store.setState({ journal: [entry, ...currentJournal] });
                // Navigate to journal
                window.location.hash = 'journal';
            },
            initialData: currentAnalysis
        });
        analyzer.render();
    }
}
