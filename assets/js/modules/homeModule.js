import { escapeHTML } from '../security.js';

export function createHomeModule({ rootId, store, toast, navigate }) {
    const root = document.getElementById(rootId);

    // Sécurité : on vérifie si la racine existe
    if (!root) {
        console.warn(`Racine home "${rootId}" introuvable.`);
        return { render: () => { } };
    }

    // Variable pour éviter de multiplier les écouteurs d'événements
    let eventsBound = false;

    function render() {
        // 1. Récupération et Calcul des données (On garde ta logique)
        const entries = store.getAll();

        // Sécurité si calculateJournalStats n'est pas encore chargé
        // Stats calculation logic will be moved to statsService
        const stats = (typeof window.calculateJournalStats === 'function')
            ? window.calculateJournalStats(entries)
            : { totalEntries: entries.length, topEgo: '—', daysSinceDefensive: 0, latestEntries: [] };

        // 2. Construction du HTML
        root.innerHTML = `
            <div class="space-y-8 fade-in-up">
                
                <div class="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mt-2">
                    <div>
                        <h2 class="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                            Pilotage émotionnel
                        </h2>
                        <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
                            Tu as <span class="font-medium text-slate-900 dark:text-white">${stats.totalEntries} analyses</span> sauvegardées.
                        </p>
                    </div>
                    <div class="flex gap-3">
                        <button type="button" class="btn btn-primary btn-sm shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all" data-navigate="analyzer-quick">
                            <i data-lucide="zap" class="w-4 h-4 mr-2"></i>
                            Nouvelle analyse
                        </button>
                        <button type="button" class="btn btn-secondary btn-sm" data-navigate="analyzer-ai">
                            <i data-lucide="sparkles" class="w-4 h-4 mr-2"></i>
                            IA
                        </button>
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div class="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                        <p class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Entrées Totales</p>
                        <p class="text-3xl font-bold text-blue-600 dark:text-blue-400">${stats.totalEntries}</p>
                        <p class="text-xs text-slate-400 mt-1">Ton backlog émotionnel</p>
                    </div>
                    
                    <div class="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                        <p class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Ego Dominant</p>
                        <p class="text-xl font-bold text-slate-800 dark:text-slate-100 truncate">${stats.topEgo || '—'}</p>
                        <p class="text-xs text-slate-400 mt-1">
                             ${stats.topEgo ? `${stats.topEgoPercentage}% de tes analyses` : 'Données insuffisantes'}
                        </p>
                    </div>

                    <div class="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                        <p class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Streak Défensive</p>
                        <div class="flex items-baseline gap-2">
                            <p class="text-3xl font-bold text-emerald-500">${stats.daysSinceDefensive ?? 0}</p>
                            <span class="text-sm text-emerald-600/80">jours</span>
                        </div>
                        <p class="text-xs text-slate-400 mt-1">Sans réflexe défensif</p>
                    </div>
                </div>

                <hr class="border-slate-200 dark:border-slate-800">

                <div class="space-y-4">
                    <div class="flex justify-between items-center">
                        <h3 class="text-lg font-semibold text-slate-800 dark:text-slate-200">Dernières synthèses</h3>
                        <button class="text-xs text-blue-600 hover:underline" data-navigate="journal">Voir tout</button>
                    </div>
                    
                    ${stats.latestEntries.length === 0 ? `
                    <div class="flex flex-col items-center justify-center py-10 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 text-center">
                        <div class="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-3">
                            <i data-lucide="clipboard-list" class="text-slate-400 w-6 h-6"></i>
                        </div>
                        <p class="text-slate-900 dark:text-white font-medium">Aucune analyse pour le moment</p>
                        <p class="text-sm text-slate-500 dark:text-slate-400 mb-4">Commence par une analyse pour voir tes synthèses.</p>
                        <button class="btn btn-secondary btn-sm" data-navigate="analyzer-manual">Lancer une analyse</button>
                    </div>
                    ` : `
                    <div class="grid gap-3">
                        ${stats.latestEntries.map(entry => `
                            <div class="p-4 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-400 transition-colors cursor-pointer group" data-navigate="journal">
                                <div class="flex justify-between items-start mb-1">
                                    <span class="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-full">
                                        ${entry.egoFocus || 'Général'}
                                    </span>
                                    <span class="text-xs text-slate-400">
                                        ${typeof formatRelativeTime === 'function' ? formatRelativeTime(entry.createdAt) : 'Récemment'}
                                    </span>
                                </div>
                                <p class="text-sm text-slate-700 dark:text-slate-300 line-clamp-2 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                                    ${escapeHTML(extractInsight(entry))}
                                </p>
                            </div>
                        `).join('')}
                    </div>
                    `}
                </div>

                <div class="space-y-4 pb-8">
                    <h3 class="text-lg font-semibold text-slate-800 dark:text-slate-200">Raccourcis d'intervention</h3>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        ${getShortcuts().map(item => `
                            <button type="button" 
                                class="group relative p-5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 
                                       text-left w-full flex items-start gap-4
                                       hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/10 
                                       transition-all duration-300 ease-out transform hover:-translate-y-1"
                                data-navigate="${item.target}"
                                ${item.toast ? `data-toast="${item.toast}"` : ''}>
                                
                                <div class="p-3 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 
                                            group-hover:bg-blue-500 group-hover:text-white transition-colors duration-300 shrink-0">
                                    <i data-lucide="${item.icon}" class="w-6 h-6"></i>
                                </div>
                                
                                <div>
                                    <h4 class="font-bold text-slate-800 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                        ${item.label}
                                    </h4>
                                    <p class="text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                                        ${item.body}
                                    </p>
                                </div>
                                
                                <div class="absolute top-5 right-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                                    <i data-lucide="arrow-right" class="w-5 h-5 text-blue-500"></i>
                                </div>
                            </button>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;

        // 3. Attachement des événements (Une seule fois via délégation)
        if (!eventsBound) {
            attachGlobalEvents();
            eventsBound = true;
        }

        // Rechargement des icônes Lucide
        if (window.lucide) window.lucide.createIcons();
    }

    // Helper pour les données des raccourcis
    function getShortcuts() {
        return [
            {
                label: 'Plan d\'urgence (Pause)',
                body: 'Respiration, cadrage, script radicaux de validation.',
                target: 'home', // Pour l'instant reste sur home, déclenche le toast
                toast: 'Astuce : fabrique ton kit de crise dans le Dojo.',
                icon: 'pause-circle'
            },
            {
                label: 'Relire ton dernier MVP',
                body: 'Rejoue la réponse idéale pour préparer le prochain sprint.',
                target: 'journal',
                toast: null,
                icon: 'rotate-ccw'
            },
            {
                label: 'Booster ton Intégration',
                body: 'Utilise l\'IA pour analyser un message chaud.',
                target: 'analyzer-ai',
                toast: null,
                icon: 'zap'
            },
            {
                label: 'Revoir les concepts clés',
                body: 'Glossaire Ego, Double Contrainte, Validation.',
                target: 'guide',
                toast: null,
                icon: 'book-open'
            }
        ];
    }

    // Helper pour extraire le texte des insights
    function extractInsight(entry) {
        if (entry.insight) return entry.insight;
        // Fallback sécurisé si summary n'existe pas
        if (!entry.summary) return 'Analyse enregistrée sans résumé.';
        const lastParagraph = entry.summary.split('\n\n').pop();
        return lastParagraph || 'Analyse enregistrée.';
    }

    // --- CORRECTION D : Gestionnaire d'événements unifié ---
    function attachGlobalEvents() {
        root.addEventListener('click', (event) => {
            // 1. Gestion des boutons avec data-toast
            const toastTrigger = event.target.closest('[data-toast]');
            if (toastTrigger) {
                const message = toastTrigger.getAttribute('data-toast');
                if (message && toast) toast.info(message);
            }

            // 2. Gestion de la NAVIGATION (C'était l'erreur manquante)
            const navTrigger = event.target.closest('[data-navigate]');
            if (navTrigger) {
                const page = navTrigger.getAttribute('data-navigate');
                if (page && navigate) {
                    navigate(page);
                }
            }
        });
    }

    return { render };
}
