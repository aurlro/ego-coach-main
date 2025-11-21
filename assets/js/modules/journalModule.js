'use strict';

// --- STORE (Logique de données) ---
function createJournalStore({ dataStore, toast }) {
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
function createJournalModule({ rootId, store, toast, modal, onChange }) {
    const root = document.getElementById(rootId);
    if (!root) {
        console.warn(`Racine journal "${rootId}" introuvable.`);
        return { render: () => { } };
    }

    const egoFilters = [
        { id: 'all', label: 'Tous' },
        { id: "La Défensive", label: 'Défensive' },
        { id: 'Le Sauveur', label: 'Sauveur' },
        { id: 'Le Martyr', label: 'Martyr' },
        { id: 'Le Dernier Mot', label: 'Dernier Mot' },
        { id: "Le Refus d'influence", label: "Refus d'influence" },
    ];

    const BATCH_SIZE = 20;
    const state = {
        filter: 'all',
        visibleCount: BATCH_SIZE,
    };

    let eventsBound = false;

    function render() {
        // Reset visible count on full render
        state.visibleCount = BATCH_SIZE;
        const entries = store.getAll();
        
        const filteredEntries = state.filter === 'all'
                ? entries
                : entries.filter((entry) => entry.egoFocus === state.filter);

        const visibleEntries = filteredEntries.slice(0, state.visibleCount);
        const remainingCount = filteredEntries.length - state.visibleCount;

        // HTML Construction
        root.innerHTML = `
            <div class="space-y-6 fade-in-up">
                 <header class="flex flex-col md:flex-row md:items-end md:justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
                    <div>
                        <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-100">Mon Journal</h2>
                        <p class="text-slate-500 dark:text-slate-400 text-sm mt-1">
                            Archive de tes analyses (${entries.length} entrées).
                        </p>
                    </div>
                    
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
                </header>

                <div class="flex flex-wrap gap-2">
                    ${egoFilters.map((filter) => {
                        const isActive = state.filter === filter.id;
                        // Styles conditionnels pour les "Pills"
                        const activeClass = "bg-blue-600 text-white shadow-md shadow-blue-500/20 border-blue-600";
                        const inactiveClass = "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400";
                        
                        return `
                            <button
                                type="button"
                                class="px-4 py-1.5 rounded-full text-sm font-medium border transition-all duration-200 ${isActive ? activeClass : inactiveClass}"
                                data-action="filter"
                                data-filter="${filter.id}"
                            >
                                ${filter.label}
                            </button>
                        `;
                    }).join('')}
                </div>

                <div id="journal-list" class="space-y-3">
                    ${visibleEntries.length === 0
                        ? renderEmptyState(entries.length, state.filter) // Correction A & C
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
            </div>
        `;

        if (!eventsBound) {
            attachEvents();
            eventsBound = true;
        }
        
        // Important: Recharger les icônes
        if (window.lucide) window.lucide.createIcons();
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
            case 'filter':
                state.filter = button.getAttribute('data-filter') || 'all';
                render();
                break;
            case 'load-more':
                loadMoreEntries();
                break;
            case 'view':
                viewEntry(entryId);
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
                // Utilise le système de navigation global si disponible, sinon fallback click
                if (window.app && window.app.navigateTo) {
                    window.app.navigateTo('analyzer-quick');
                } else {
                    document.querySelector('[data-navigate="analyzer-quick"]')?.click();
                }
                break;
        }
    }

    // --- Logique d'affichage ---

    function loadMoreEntries() {
        const entries = store.getAll();
        const filteredEntries = state.filter === 'all' 
            ? entries 
            : entries.filter((entry) => entry.egoFocus === state.filter);

        const currentCount = state.visibleCount;
        const nextCount = currentCount + BATCH_SIZE;
        state.visibleCount = nextCount;

        const nextEntries = filteredEntries.slice(currentCount, nextCount);
        const listElement = document.getElementById('journal-list');
        const footerElement = document.getElementById('journal-footer');

        if (!listElement || !footerElement) return;

        // Ajout des nouvelles cartes
        if (nextEntries.length > 0) {
            const fragment = document.createDocumentFragment();
            nextEntries.forEach(entry => {
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = renderEntryCard(entry);
                while (tempDiv.firstChild) fragment.appendChild(tempDiv.firstChild);
            });
            listElement.appendChild(fragment);
            if (window.lucide) window.lucide.createIcons();
        }

        // Mise à jour du bouton
        const remaining = filteredEntries.length - nextCount;
        if (remaining > 0) {
            footerElement.innerHTML = `
                <div class="text-center mt-8 pt-4 border-t border-slate-200 dark:border-slate-800">
                    <button type="button" class="btn btn-secondary btn-sm" data-action="load-more">
                        Charger les suivantes (${remaining})
                    </button>
                </div>`;
        } else {
            footerElement.innerHTML = '';
        }
    }

    // --- Rendu des composants ---

    function renderEmptyState(totalEntries, currentFilter) {
        // Cas 1: Le journal est complètement vide
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

        // Cas 2: Le filtre ne donne aucun résultat
        return `
            <div class="flex flex-col items-center justify-center py-12 text-center">
                <div class="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-3">
                    <i data-lucide="filter-x" class="w-6 h-6 text-slate-400"></i>
                </div>
                <p class="text-slate-900 dark:text-white font-medium">Aucun résultat pour "${currentFilter}"</p>
                <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">Essaie un autre filtre ou "Tous".</p>
            </div>
        `;
    }

    function renderEntryCard(entry) {
        // Fallback sécurisé pour la date
        const dateStr = entry.createdAt ? new Date(entry.createdAt).toLocaleDateString('fr-FR', {
            day: 'numeric', month: 'short'
        }) : 'Date inconnue';
        
        const preview = entry.summary ? entry.summary.split('\n')[0] : 'Pas de résumé disponible.';

        return `
            <article class="group bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 transition-all duration-200">
                <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div class="flex-1 space-y-2">
                        <div class="flex items-center gap-2 flex-wrap">
                            <span class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                ${dateStr}
                            </span>
                            <span class="px-2 py-0.5 rounded text-xs font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800">
                                ${entry.egoFocus || 'Général'}
                            </span>
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
                        <button type="button" class="btn btn-ghost btn-icon btn-sm text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20" 
                                data-action="delete" data-entry-id="${entry.id}" title="Supprimer">
                            <i data-lucide="trash-2" class="w-4 h-4"></i>
                        </button>
                    </div>
                </div>
            </article>
        `;
    }

    // --- Utilitaires et Modals ---

    function confirmClearJournal() {
        modal.show({
            targetId: 'journal-modal', // Utilise la modale générique
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
                    // Pas de variant "danger" natif dans le système de modal montré, 
                    // donc on peut gérer la classe via le CSS ou un paramètre custom si le modalManager le supporte.
                    // Ici je simule l'action standard.
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

        modal.show({
            targetId: 'journal-modal',
            title: `Analyse du ${dateStr}`,
            html: `
                <div class="space-y-4">
                    <div class="flex items-center gap-2">
                        <span class="px-2 py-1 rounded text-xs font-bold bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                            ${entry.egoFocus}
                        </span>
                    </div>
                    <div class="prose dark:prose-invert max-w-none text-sm bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                        ${entry.summary.split('\n').map(p => p.trim() ? `<p class="mb-2">${escapeHTML(p)}</p>` : '').join('')}
                    </div>
                </div>
            `,
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

    // Fonction helper interne si utils.js n'est pas chargé (sécurité)
    function escapeHTML(str) {
        if (!str) return '';
        return str.replace(/[&<>'"]/g, 
            tag => ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                "'": '&#39;',
                '"': '&quot;'
            }[tag]));
    }
    
    // Fonctions d'export/import conservées mais simplifiées visuellement
    function handleImport(event) {
        const file = event.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            try {
                const parsed = JSON.parse(reader.result);
                // Validation basique
                if(!Array.isArray(parsed)) throw new Error("Format JSON invalide (doit être un tableau)");
                
                const result = store.importEntries(parsed);
                if (result.success) {
                    toast.success(`Import: ${result.count} entrées ajoutées.`);
                    render();
                    if (onChange) onChange();
                } else {
                    toast.error(result.message);
                }
            } catch (error) {
                toast.error('Erreur lecture fichier : ' + error.message);
            }
            event.target.value = '';
        };
        reader.readAsText(file);
    }

    function exportJournal() {
        const entries = store.getAll();
        if (entries.length === 0) return toast.info('Rien à exporter.');
        const blob = new Blob([JSON.stringify(entries, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `egocoach-journal-${new Date().toISOString().slice(0,10)}.json`;
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
        if(confirm("Supprimer cette entrée ?")) {
             store.deleteEntry(entryId);
             toast.success("Entrée supprimée");
             render();
             if(onChange) onChange();
        }
    }

    return { render };
}