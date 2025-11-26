/**
 * Theme Manager - Gère le thème clair/sombre
 */

export function createThemeManager() {
    const toggleBtn = document.getElementById('theme-toggle');
    const darkIcon = document.getElementById('theme-toggle-dark-icon');
    const lightIcon = document.getElementById('theme-toggle-light-icon');

    function init() {
        // Check local storage or system preference
        // Note: index.html already sets the initial class to avoid FOUC, but we sync here too
        if (localStorage.getItem('boite-outils-theme') === 'dark' || (!('boite-outils-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        updateIcons();

        if (toggleBtn) {
            toggleBtn.addEventListener('click', toggle);
        }
    }

    function toggle() {
        if (document.documentElement.classList.contains('dark')) {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('boite-outils-theme', 'light');
        } else {
            document.documentElement.classList.add('dark');
            localStorage.setItem('boite-outils-theme', 'dark');
        }
        updateIcons();
    }

    function updateIcons() {
        // Icons are inverted: Moon (darkIcon) visible in Light mode, Sun (lightIcon) visible in Dark mode
        if (!darkIcon || !lightIcon) return;

        if (document.documentElement.classList.contains('dark')) {
            // In Dark mode, show Sun (to switch to Light)
            lightIcon.classList.remove('hidden');
            darkIcon.classList.add('hidden');
        } else {
            // In Light mode, show Moon (to switch to Dark)
            darkIcon.classList.remove('hidden');
            lightIcon.classList.add('hidden');
        }
    }

    return { init, toggle };
}
