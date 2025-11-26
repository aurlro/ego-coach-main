import { escapeHTML } from '../security.js';
import { copyTextToClipboard } from '../utils.js';

// --- STORE (Logique de données) ---
export function createJournalStore({ dataStore, toast }) {
    const KEY = 'journal_entries';

    function getAll() {
        return dataStore.getData(KEY) || [];
    }

    function getById(id) {
        return getAll().find((e) => e.id === id);
    }

    function addEntry(entry) {
        if (!entry || !entry.summary) {
            return { success: false, message: 'Entrée invalide' };
        }
        const entries = getAll();
        const newEntry = {
            ...entry,
            id: entry.id || crypto.randomUUID(),
            createdAt: entry.createdAt || new Date().toISOString(),
        };
        entries.unshift(newEntry);

        try {
            dataStore.saveData(KEY, entries);
            return { success: true, entry: newEntry };
        } catch (error) {
            console.error('Save error:', error);
            return { success: false, message: 'Erreur de sauvegarde (quota ?)' };
        }
    }

    function deleteEntry(id) {
        const entries = getAll();
        const filtered = entries.filter((e) => e.id !== id);
        if (filtered.length === entries.length) {
            return { success: false, message: 'Entrée introuvable' };
        }
        dataStore.saveData(KEY, filtered);
        return { success: true };
    }

    function importEntries(newEntries) {
        if (!Array.isArray(newEntries)) {
            return { success: false, message: 'Format invalide' };
        }
        const current = getAll();
        const currentIds = new Set(current.map((e) => e.id));
        let added = 0;

        for (const entry of newEntries) {
            if (!entry.id || !entry.summary) continue;
            if (!currentIds.has(entry.id)) {
                current.push(entry);
                currentIds.add(entry.id);
                added++;
            }
        }

        // Tri par date décroissante
        current.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        try {
            dataStore.saveData(KEY, current);
            return { success: true, count: added };
        } catch (error) {
            return { success: false, message: 'Erreur sauvegarde import' };
        }
    }

    function clear() {
        dataStore.saveData(KEY, []);
    }

    return {
        getAll,
        getById,
        addEntry,
        deleteEntry,
        importEntries,
        clear,
    };
}

// --- UI MODULE (Interface) ---
export function createJournalModule({ rootId, store, toast, modal, onChange }) {
    const root = document.getElementById(rootId);
    if (!root) {
        console.warn(`Racine journal "${rootId}" introuvable.`);
        return { render: () => { } };
    }

    const BATCH_SIZE = 20;
    const state = {
        view: 'list', // 'list' | 'dashboard'
        filter: 'all',
        visibleCount: BATCH_SIZE,
    };

    let eventsBound = false;

    function render() {
        const entries = store.getAll();

        // Header & Tabs
        const headerHtml = `
            <header class="flex flex-col md:flex-row md:items-end md:justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
                <div>
                    <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-100">Mon Journal</h2>
                    <p class="text-slate-500 dark:text-slate-400 text-sm mt-1">
                        Archive de tes analyses (${entries.length} entrées).
                    </p>
                </div>
                
                <div class="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                    <button class="px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${state.view === 'list' ? 'bg-white dark:bg-slate-700 shadow text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}" data-action="view-list">
                        <i data-lucide="list" class="w-4 h-4 inline mr-2"></i>Liste
                    </button>
                    <button class="px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${state.view === 'dashboard' ? 'bg-white dark:bg-slate-700 shadow text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}" data-action="view-dashboard">
                        <i data-lucide="bar-chart-2" class="w-4 h-4 inline mr-2"></i>Dashboard
                    </button>
                </div>
            </header>
        `;

        let contentHtml = '';

        if (state.view === 'dashboard') {
            contentHtml = renderDashboard(entries);
        } else {
            contentHtml = renderList(entries);
        }

        root.innerHTML = `
            <div class="space-y-6 fade-in-up">
                ${headerHtml}
                ${contentHtml}
            </div>
        `;

        if (!eventsBound) {
            attachEvents();
            eventsBound = true;
        }

        if (window.lucide) window.lucide.createIcons();
    }

    function renderDashboard(entries) {
        if (entries.length === 0) return renderEmptyState(0, 'all');

        const stats = calculateStats(entries);

        return `
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <!-- Stat Cards -->
                <div class="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <div class="text-sm text-slate-500 dark:text-slate-400 mb-1">Total Analyses</div>
                    <div class="text-2xl font-bold text-slate-900 dark:text-white">${stats.total}</div>
                </div>
                <div class="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <div class="text-sm text-slate-500 dark:text-slate-400 mb-1">Niveau Crise Moyen</div>
                    <div class="text-2xl font-bold ${stats.avgCrisis > 3 ? 'text-red-500' : 'text-green-500'}">
                        ${stats.avgCrisis} <span class="text-sm text-slate-400 font-normal">/ 5</span>
                    </div>
                </div>
                <div class="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <div class="text-sm text-slate-500 dark:text-slate-400 mb-1">Top Déclencheur</div>
                    <div class="text-lg font-bold text-blue-600 dark:text-blue-400 truncate" title="${stats.topTrigger}">
                        ${stats.topTrigger}
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                <!-- Recent Activity Chart (Mocked with CSS bars) -->
                <div class="p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                    <h3 class="font-bold text-slate-900 dark:text-white mb-4">Intensité des Derniers Conflits</h3>
                    <div class="flex items-end gap-2 h-40 mt-4">
                        ${stats.recentLevels.map(level => `
                            <div class="flex-1 bg-blue-100 dark:bg-blue-900/30 rounded-t-lg relative group">
                                <div class="absolute bottom-0 w-full bg-blue-500 rounded-t-lg transition-all duration-500" style="height: ${level * 20}%"></div>
                                <div class="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs py-1 px-2 rounded pointer-events-none">
                                    Niveau ${level}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                    <div class="flex justify-between mt-2 text-xs text-slate-400">
                        <span>Plus ancien</span>
                        <span>Plus récent</span>
                    </div>
                </div>

                <!-- Top Triggers List -->
                <div class="p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                    <h3 class="font-bold text-slate-900 dark:text-white mb-4">Déclencheurs Fréquents</h3>
                    <div class="space-y-3">
                        ${stats.triggerCounts.slice(0, 5).map(t => `
                            <div class="flex items-center justify-between">
                                <span class="text-sm text-slate-600 dark:text-slate-300">${t.name}</span>
                                <div class="flex items-center gap-2">
                                    <div class="w-24 h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                        <div class="h-full bg-purple-500" style="width: ${(t.count / stats.total) * 100}%"></div>
                                    </div>
                                    <span class="text-xs font-medium text-slate-500">${t.count}</span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    function renderList(entries) {
        const filteredEntries = state.filter === 'all'
            ? entries
            : entries.filter((entry) => entry.egoFocus === state.filter);

        const visibleEntries = filteredEntries.slice(0, state.visibleCount);
        const remainingCount = filteredEntries.length - state.visibleCount;

        return `
            <div class="flex justify-end gap-2 mb-4">
                 <div class="flex items-center gap-2">
                    <button type="button" class="btn btn-ghost btn-sm text-slate-600 dark:text-slate-300" data-action="export" title="Exporter en JSON">
                        <i data-lucide="download" class="w-4 h-4 mr-2"></i>
                        Exporter
                    </button>
                    <label class="btn btn-ghost btn-sm text-slate-600 dark:text-slate-300 cursor-pointer" title="Importer un JSON">
                        <i data-lucide="upload" class="w-4 h-4 mr-2"></i>
                        Importer
                        <input type="file" accept="application/json" data-import-input class="hidden">
                    </label>
                    ${entries.length > 0 ? `
                    <div class="h-4 w-px bg-slate-300 dark:bg-slate-700 mx-1"></div>
                    <button type="button" class="btn btn-ghost btn-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 dark:text-red-400" data-action="clear" title="Tout supprimer">
                        <i data-lucide="trash-2" class="w-4 h-4"></i>
                    </button>
                    ` : ''}
                </div>
            </div>

            <div id="journal-list" class="space-y-3">
                ${visibleEntries.length === 0
                ? renderEmptyState(entries.length, state.filter)
                : visibleEntries.map(renderEntryCard).join('')
            }
            </div>

            <div id="journal-footer">
                ${remainingCount > 0 ? `
                <div class="text-center mt-8 pt-4 border-t border-slate-200 dark:border-slate-800">
                    <button type="button" class="btn btn-secondary btn-sm" data-action="load-more">
                        Charger les suivantes (${remainingCount})
                    </button>
                </div>` : ''}
            </div>
        `;
    }

    function renderEntryCard(entry) {
        const dateStr = entry.createdAt ? new Date(entry.createdAt).toLocaleDateString('fr-FR', {
            day: 'numeric', month: 'short'
        }) : 'Date inconnue';

        const isWizard = entry.type === 'wizard-analysis';
        const preview = entry.summary ? entry.summary.split('\n')[0] : 'Pas de résumé disponible.';

        let badgesHtml = '';
        if (isWizard && entry.data) {
            const level = entry.data.crisisLevel || 1;
            const levelColor = level >= 4 ? 'bg-red-100 text-red-700' : level === 3 ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700';
            badgesHtml += `<span class="px-2 py-0.5 rounded text-xs font-bold ${levelColor} mr-2">Niveau ${level}</span>`;

            if (entry.data.triggers && entry.data.triggers.length > 0) {
                badgesHtml += `<span class="px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300">${entry.data.triggers[0]}</span>`;
            }
        } else {
            badgesHtml = `<span class="px-2 py-0.5 rounded text-xs font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800">${entry.egoFocus || 'Général'}</span>`;
        }

        return `
            <article class="group bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 transition-all duration-200">
                <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div class="flex-1 space-y-2">
                        <div class="flex items-center gap-2 flex-wrap">
                            <span class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                ${dateStr}
                            </span>
                            ${badgesHtml}
                        </div>
                        
                        <p class="text-slate-700 dark:text-slate-300 text-sm leading-relaxed line-clamp-2 group-hover:text-slate-900 dark:group-hover:text-slate-200 transition-colors">
                            ${escapeHTML(preview)}
                        </p>
                    </div>

                    <div class="flex sm:flex-col gap-2 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                        <button type="button" class="btn btn-ghost btn-icon btn-sm text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-700" 
                                data-action="view" data-entry-id="${entry.id}" title="Lire">
                            <i data-lucide="eye" class="w-4 h-4"></i>
                        </button>
                         <button type="button" class="btn btn-ghost btn-icon btn-sm text-slate-400 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20" 
                                data-action="reopen" data-entry-id="${entry.id}" title="Rouvrir">
                            <i data-lucide="edit-3" class="w-4 h-4"></i>
                        </button>
                        <button type="button" class="btn btn-ghost btn-icon btn-sm text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20" 
                                data-action="delete" data-entry-id="${entry.id}" title="Supprimer">
                            <i data-lucide="trash-2" class="w-4 h-4"></i>
                        </button>
                    </div>
                </div>
            </article>
        `;
    }

    function renderEmptyState(totalEntries, currentFilter) {
        if (totalEntries === 0) {
            return `
                <div class="flex flex-col items-center justify-center py-16 px-4 text-center bg-slate-50 dark:bg-slate-900/50 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700">
                    <div class="w-16 h-16 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center shadow-sm mb-4">
                        <i data-lucide="book" class="w-8 h-8 text-slate-400"></i>
                    </div>
                    <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-2">Ton journal est vide</h3>
                    <p class="text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6">
                        Capture ta prochaine dispute ou situation tendue pour transformer l’ego en insight exploitable.
                    </p>
                    <button type="button" class="btn btn-primary" data-action="start-analysis">
                        <i data-lucide="plus" class="w-4 h-4 mr-2"></i>
                        Commencer une analyse
                    </button>
                </div>
            `;
        }
        return `
            <div class="flex flex-col items-center justify-center py-12 text-center">
                <div class="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-3">
                    <i data-lucide="filter-x" class="w-6 h-6 text-slate-400"></i>
                </div>
                <p class="text-slate-900 dark:text-white font-medium">Aucun résultat</p>
            </div>
        `;
    }

    function calculateStats(entries) {
        const stats = {
            total: entries.length,
            avgCrisis: 0,
            topTrigger: 'N/A',
            recentLevels: [],
            triggerCounts: []
        };

        let totalCrisis = 0;
        let crisisCount = 0;
        const triggers = {};

        entries.forEach(e => {
            if (e.type === 'wizard-analysis' && e.data) {
                const lvl = e.data.crisisLevel || 0;
                if (lvl > 0) {
                    totalCrisis += lvl;
                    crisisCount++;
                    if (stats.recentLevels.length < 10) stats.recentLevels.unshift(lvl);
                }
                if (e.data.triggers) {
                    e.data.triggers.forEach(t => {
                        triggers[t] = (triggers[t] || 0) + 1;
                    });
                }
            }
        });

        if (crisisCount > 0) stats.avgCrisis = (totalCrisis / crisisCount).toFixed(1);

        const sortedTriggers = Object.entries(triggers)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count);

        stats.triggerCounts = sortedTriggers;
        if (sortedTriggers.length > 0) stats.topTrigger = sortedTriggers[0].name;

        return stats;
    }

    // --- Gestionnaires d'événements ---

    function attachEvents() {
        root.addEventListener('click', handleAction);
        root.querySelector('[data-import-input]')?.addEventListener('change', handleImport);
    }

    function handleAction(event) {
        const button = event.target.closest('[data-action]');
        if (!button) return;

        const action = button.getAttribute('data-action');
        const entryId = button.getAttribute('data-entry-id');

        switch (action) {
            case 'view-list':
                state.view = 'list';
                render();
                break;
            case 'view-dashboard':
                state.view = 'dashboard';
                render();
                break;
            case 'load-more':
                loadMoreEntries();
                break;
            case 'view':
                viewEntry(entryId);
                break;
            case 'reopen':
                toast.info("Fonctionnalité 'Rouvrir' à venir !");
                break;
            case 'copy':
                copyEntry(entryId);
                break;
            case 'delete':
                deleteEntry(entryId);
                break;
            case 'export':
                exportJournal();
                break;
            case 'clear':
                confirmClearJournal();
                break;
            case 'start-analysis':
                if (window.app && window.app.navigateTo) {
                    window.app.navigateTo('analyzer');
                } else {
                    document.querySelector('[data-navigate="analyzer"]')?.click();
                }
                break;
        }
    }

    // --- Logique d'affichage ---

    function loadMoreEntries() {
        state.visibleCount += BATCH_SIZE;
        render();
    }

    // --- Utilitaires et Modals ---

    function confirmClearJournal() {
        modal.show({
            targetId: 'journal-modal',
            title: '⚠️ Vider le journal ?',
            html: `
                <div class="text-center">
                    <div class="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i data-lucide="alert-triangle" class="w-6 h-6"></i>
                    </div>
                    <p class="text-slate-700 dark:text-slate-300 mb-2">Tu es sur le point de supprimer <strong>${store.getAll().length} entrées</strong>.</p>
                    <p class="text-sm text-slate-500">Cette action est irréversible.</p>
                </div>
            `,
            actions: [
                {
                    label: 'Annuler',
                    onClick: () => modal.hide('journal-modal')
                },
                {
                    label: 'Tout supprimer',
                    onClick: () => {
                        store.clear();
                        toast.success('Journal vidé entièrement.');
                        modal.hide('journal-modal');
                        render();
                        if (onChange) onChange();
                    }
                }
            ]
        });
    }

    function viewEntry(entryId) {
        const entry = store.getById(entryId);
        if (!entry) return toast.error('Entrée introuvable.');

        const dateStr = new Date(entry.createdAt).toLocaleDateString('fr-FR', {
            weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
        });

        // Custom view for Wizard Analysis
        let contentHtml = '';
        if (entry.type === 'wizard-analysis' && entry.data) {
            const d = entry.data;
            contentHtml = `
                <div class="space-y-4">
                    <div class="p-3 bg-slate-100 dark:bg-slate-700 rounded-lg">
                        <div class="font-bold text-sm text-slate-500 uppercase">Contexte</div>
                        <p>${escapeHTML(d.context)}</p>
                        <p class="mt-2 text-sm italic text-slate-600">"${escapeHTML(d.partnerSignal)}"</p>
                    </div>
                    
                    <div class="grid grid-cols-2 gap-4">
                        <div class="p-3 border border-slate-200 dark:border-slate-700 rounded-lg">
                            <div class="font-bold text-sm text-slate-500 uppercase">Diagnostic</div>
                            <div class="text-xl font-bold text-red-500">Niveau ${d.crisisLevel}</div>
                            <div class="text-xs text-slate-400">${(d.triggers || []).join(', ')}</div>
                        </div>
                        <div class="p-3 border border-slate-200 dark:border-slate-700 rounded-lg">
                            <div class="font-bold text-sm text-slate-500 uppercase">Stratégie</div>
                            <div class="font-bold text-emerald-600">${d.protocol}</div>
                        </div>
                    </div>

                    <div class="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <div class="font-bold text-sm text-blue-500 uppercase">Besoins</div>
                        <div class="grid grid-cols-2 gap-2 text-sm">
                            <div><strong>Moi:</strong> ${d.needs?.self}</div>
                            <div><strong>Autre:</strong> ${d.needs?.partner}</div>
                        </div>
                    </div>
                </div>
            `;
        } else {
            contentHtml = `
                <div class="prose dark:prose-invert max-w-none text-sm bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                    ${entry.summary.split('\n').map(p => p.trim() ? `<p class="mb-2">${escapeHTML(p)}</p>` : '').join('')}
                </div>
            `;
        }

        modal.show({
            targetId: 'journal-modal',
            title: `Analyse du ${dateStr}`,
            html: contentHtml,
            actions: [
                {
                    label: 'Copier texte',
                    onClick: () => {
                        copyTextToClipboard(entry.summary)
                            .then(() => toast.success('Copié !'))
                            .catch(() => toast.error('Erreur copie'));
                    }
                },
                {
                    label: 'Fermer',
                    onClick: () => modal.hide('journal-modal')
                }
            ]
        });
    }

    function exportJournal() {
        const entries = store.getAll();
        if (entries.length === 0) return toast.info('Rien à exporter.');
        const blob = new Blob([JSON.stringify(entries, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `egocoach-journal-${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    function copyEntry(entryId) {
        const entry = store.getById(entryId);
        if (entry) {
            copyTextToClipboard(entry.summary)
                .then(() => toast.success('Résumé copié !'))
                .catch(() => toast.error('Erreur copie'));
        }
    }

    function deleteEntry(entryId) {
        if (confirm("Supprimer cette entrée ?")) {
            store.deleteEntry(entryId);
            toast.success("Entrée supprimée");
            render();
            if (onChange) onChange();
        }
    }

    return { render };
}