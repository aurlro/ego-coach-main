/**
 * Footer Enhancements - Amélioration des boutons theme et settings
 * Icônes claires, labels, et meilleure accessibilité
 */

function initializeFooterEnhancements() {
    const themeToggle = document.querySelector('[data-toggle="theme"]') ||
                        document.querySelector('button[data-action="toggle-theme"]') ||
                        document.querySelector('.theme-toggle');

    const settingsToggle = document.querySelector('[data-toggle="settings"]') ||
                           document.querySelector('button[data-action="settings"]') ||
                           document.querySelector('.settings-toggle');

    // Améliorer le bouton theme si trouvé
    if (themeToggle) {
        enhanceThemeButton(themeToggle);
    }

    // Améliorer le bouton settings si trouvé
    if (settingsToggle) {
        enhanceSettingsButton(settingsToggle);
    }

    // Observer pour créer les améliorations si les boutons sont ajoutés dynamiquement
    createFooterButtonObserver();
}

function enhanceThemeButton(button) {
    // Ajouter les attributs d'accessibilité
    button.setAttribute('aria-label', 'Basculer le thème sombre/clair');
    button.setAttribute('title', 'Mode sombre (Ctrl+Shift+L)');
    button.classList.add('theme-toggle', 'button-tooltip');
    button.setAttribute('data-tooltip', 'Mode sombre');

    // Ajouter des styles améliorés
    const isDark = document.documentElement.classList.contains('dark');

    // Remplacer le contenu par une icône claire
    if (!button.innerHTML.includes('svg')) {
        button.innerHTML = isDark
            ? getIcon('sun')
            : getIcon('moon');
    }

    // Gérer le changement de theme
    button.addEventListener('click', (e) => {
        e.preventDefault();
        const newDark = !document.documentElement.classList.contains('dark');

        // Animer l'icône
        button.style.transform = 'rotate(180deg)';
        setTimeout(() => {
            button.style.transform = 'rotate(0deg)';
        }, 300);

        // Mettre à jour l'icône et le tooltip
        setTimeout(() => {
            button.innerHTML = newDark ? getIcon('sun') : getIcon('moon');
            button.setAttribute('data-tooltip', newDark ? 'Mode clair' : 'Mode sombre');
            button.setAttribute('title', newDark ? 'Mode clair' : 'Mode sombre');
        }, 150);
    });
}

function enhanceSettingsButton(button) {
    // Ajouter les attributs d'accessibilité
    button.setAttribute('aria-label', 'Paramètres de l\'application');
    button.setAttribute('title', 'Paramètres');
    button.classList.add('settings-toggle', 'button-tooltip');
    button.setAttribute('data-tooltip', 'Paramètres');

    // Ajouter l'icône settings si pas présente
    if (!button.innerHTML.includes('svg')) {
        button.innerHTML = getIcon('settings');
    }

    // Ajouter feedback au clic
    button.addEventListener('click', () => {
        button.style.transform = 'rotate(180deg)';
        setTimeout(() => {
            button.style.transform = 'rotate(0deg)';
        }, 600);
    });
}

function createFooterButtonObserver() {
    // Observer les mutations dans le sidebar pour détecter les nouveaux boutons
    const sidebar = document.getElementById('sidebar');
    if (!sidebar) return;

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length) {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) { // Element node
                        const themeBtn = node.querySelector?.('[data-toggle="theme"]') ||
                                        (node.matches?.('[data-toggle="theme"]') ? node : null);
                        const settingsBtn = node.querySelector?.('[data-toggle="settings"]') ||
                                           (node.matches?.('[data-toggle="settings"]') ? node : null);

                        if (themeBtn) enhanceThemeButton(themeBtn);
                        if (settingsBtn) enhanceSettingsButton(settingsBtn);
                    }
                });
            }
        });
    });

    observer.observe(sidebar, {
        childList: true,
        subtree: true,
        attributes: false,
        characterData: false
    });
}

// Initialiser au chargement du document
document.addEventListener('DOMContentLoaded', () => {
    // Attendre que les autres modules soient chargés
    setTimeout(() => {
        initializeFooterEnhancements();
    }, 100);
});
