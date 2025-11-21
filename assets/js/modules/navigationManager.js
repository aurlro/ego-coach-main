/**
 * Navigation Manager - Nouvelle structure avec Sidebar
 * Gère la navigation entre pages et la sidebar
 */

function createNavigationManager() {
    const pageMap = {
        'home': { id: 'page-home', breadcrumb: 'Tableau de bord', icon: '🏠' },
        'journal': { id: 'page-journal', breadcrumb: 'Mon Journal', icon: '📔' },
        'analyzer-quick': { id: 'page-analyzer-quick', breadcrumb: 'Analyse Rapide', icon: '⚡' },
        'analyzer-manual': { id: 'page-analyzer-manual', breadcrumb: 'Analyse Guidée', icon: '📝' },
        'analyzer-ai': { id: 'page-analyzer-ai', breadcrumb: 'Analyse IA', icon: '🤖' },
        'guide': { id: 'page-guide', breadcrumb: 'Guide & Concepts', icon: '🧭' },
        'insights': { id: 'page-insights', breadcrumb: 'Mes Insights', icon: '📊' },
    };

    let currentPage = 'home';

    function navigateTo(pageKey, options = {}) {
        if (!pageMap[pageKey]) {
            console.warn(`Page ${pageKey} non trouvée`);
            return;
        }

        const pageInfo = pageMap[pageKey];

        // Masquer toutes les pages
        document.querySelectorAll('.page-content').forEach(el => {
            el.classList.add('hidden');
        });

        // Afficher la page actuelle
        const pageEl = document.getElementById(pageInfo.id);
        if (pageEl) {
            pageEl.classList.remove('hidden');
        }

        // Mettre à jour le breadcrumb
        const breadcrumb = document.getElementById('current-page-breadcrumb');
        if (breadcrumb) {
            breadcrumb.textContent = pageInfo.breadcrumb;
        }

        // Mettre à jour le nav item actif
        document.querySelectorAll('[data-page]').forEach(el => {
            el.classList.toggle('active', el.getAttribute('data-page') === pageKey);
        });

        // Fermer sidebar sur mobile après navigation
        const sidebar = document.getElementById('sidebar');
        if (sidebar && window.innerWidth < 1024) {
            sidebar.classList.remove('open');
        }

        currentPage = pageKey;

        // Callback personnalisé
        if (options.onNavigate) {
            options.onNavigate(pageKey);
        }

        // Persister si demandé
        if (options.persist !== false) {
            try {
                localStorage.setItem('last-page', pageKey);
            } catch (e) {
                console.debug('Impossible de persister page:', e);
            }
        }
    }

    function getCurrentPage() {
        return currentPage;
    }

    function restoreLastPage() {
        try {
            const lastPage = localStorage.getItem('last-page') || 'home';
            navigateTo(lastPage, { persist: false });
        } catch (e) {
            navigateTo('home', { persist: false });
        }
    }

    return {
        navigateTo,
        getCurrentPage,
        restoreLastPage,
        pageMap,
    };
}
