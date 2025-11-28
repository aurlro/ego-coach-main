// Empty States Component
export const EmptyState = {
    journal: () => `
        <div class="empty-state">
            <div class="empty-icon">📔</div>
            <h3>Ton journal est vide</h3>
            <p>Commence par analyser une situation pour voir tes insights ici.</p>
            <button onclick="window.location.hash='analyze'" class="btn btn-primary inline-flex items-center gap-2">
                <i data-lucide="plus" class="w-4 h-4"></i>
                Créer ma première analyse
            </button>
        </div>
    `,

    dojo: () => `
        <div class="empty-state">
            <div class="empty-icon">🥋</div>
            <h3>Aucun scénario disponible</h3>
            <p>Les scénarios d'entraînement arrivent bientôt !</p>
        </div>
    `,

    search: () => `
        <div class="empty-state">
            <div class="empty-icon">🔍</div>
            <h3>Aucun résultat trouvé</h3>
            <p>Essaie avec d'autres mots-clés ou vérifie l'orthographe.</p>
        </div>
    `,

    stats: () => `
        <div class="empty-state">
            <div class="empty-icon">📊</div>
            <h3>Pas encore de statistiques</h3>
            <p>Continue à utiliser l'app pour voir tes progrès ici.</p>
        </div>
    `,

    generic: (icon = '🌀', title = 'Rien à afficher', message = '') => `
        <div class="empty-state">
            <div class="empty-icon">${icon}</div>
            <h3>${title}</h3>
            ${message ? `<p>${message}</p>` : ''}
        </div>
    `
};
