/**
 * Command Palette - Recherche et actions rapides (⌘K)
 * Inspiré par Linear et Vercel
 */

function createCommandPalette({ navigation, toast }) {
    const palette = document.getElementById('command-palette');
    const input = document.getElementById('command-input');
    const results = document.getElementById('command-results');
    let selectedIndex = -1;
    let commands = [];

    // Registre des commandes disponibles
    const commandRegistry = [
        // Navigation
        {
            id: 'nav-home',
            label: 'Tableau de bord',
            description: 'Aller au tableau de bord',
            category: 'Navigation',
            icon: '🏠',
            action: () => navigation.navigateTo('home'),
        },
        {
            id: 'nav-journal',
            label: 'Mon Journal',
            description: 'Voir mes analyses sauvegardées',
            category: 'Navigation',
            icon: '📔',
            action: () => navigation.navigateTo('journal'),
        },
        {
            id: 'nav-quick',
            label: 'Nouvelle Analyse Rapide',
            description: 'Démarrer une analyse express',
            category: 'Navigation',
            icon: '⚡',
            action: () => navigation.navigateTo('analyzer-quick'),
        },
        {
            id: 'nav-manual',
            label: 'Analyse Guidée',
            description: 'Analyse pas à pas détaillée',
            category: 'Navigation',
            icon: '📝',
            action: () => navigation.navigateTo('analyzer-manual'),
        },
        {
            id: 'nav-ai',
            label: 'Analyse IA',
            description: 'Utiliser l\'IA pour analyser',
            category: 'Navigation',
            icon: '🤖',
            action: () => navigation.navigateTo('analyzer-ai'),
        },
        {
            id: 'nav-guide',
            label: 'Guide & Concepts',
            description: 'Apprendre les concepts clés',
            category: 'Navigation',
            icon: '🧭',
            action: () => navigation.navigateTo('guide'),
        },
        {
            id: 'nav-insights',
            label: 'Mes Insights',
            description: 'Voir vos insights personnels',
            category: 'Navigation',
            icon: '📊',
            action: () => navigation.navigateTo('insights'),
        },
        // Actions
        {
            id: 'action-new-quick',
            label: 'Nouvelle analyse rapide',
            description: 'Démarrer une analyse express immédiate',
            category: 'Actions',
            icon: '✨',
            keywords: ['quick', 'nouveau', 'create'],
            action: () => {
                close();
                navigation.navigateTo('analyzer-quick');
                // Scroll vers textarea
                setTimeout(() => {
                    const textarea = document.querySelector('#quick-root textarea');
                    if (textarea) textarea.focus();
                }, 100);
            },
        },
        {
            id: 'action-theme',
            label: 'Changer le thème',
            description: 'Basculer entre mode clair et sombre',
            category: 'Actions',
            icon: '🌙',
            keywords: ['theme', 'dark', 'light'],
            action: () => {
                document.getElementById('theme-toggle')?.click();
                close();
                toast.success('Thème changé');
            },
        },
    ];

    function filterCommands(query) {
        if (!query.trim()) {
            return commandRegistry;
        }

        const q = query.toLowerCase();
        return commandRegistry.filter(cmd => {
            const searchFields = [
                cmd.label,
                cmd.description,
                cmd.category,
                ...(cmd.keywords || []),
            ].join(' ').toLowerCase();

            return searchFields.includes(q);
        });
    }

    function renderResults(cmds) {
        results.innerHTML = '';
        commands = cmds;
        selectedIndex = -1;

        if (commands.length === 0) {
            results.innerHTML = `
                <div style="padding: 32px 24px; text-align: center; color: var(--text-tertiary);">
                    <p style="font-size: 14px;">Aucune commande trouvée</p>
                </div>
            `;
            return;
        }

        commands.forEach((cmd, index) => {
            const div = document.createElement('div');
            div.className = 'command-item';
            div.innerHTML = `
                <span class="command-icon">${cmd.icon}</span>
                <div class="command-text">
                    <div class="command-label">${escapeHTML(cmd.label)}</div>
                    <div class="command-description">${escapeHTML(cmd.description)}</div>
                </div>
            `;
            div.addEventListener('click', () => executeCommand(index));
            div.addEventListener('mouseenter', () => {
                document.querySelectorAll('.command-item').forEach((el, i) => {
                    el.classList.toggle('active', i === index);
                });
                selectedIndex = index;
            });
            results.appendChild(div);
        });
    }

    function executeCommand(index) {
        if (commands[index]) {
            try {
                commands[index].action();
                close();
            } catch (error) {
                console.error('Erreur exécution commande:', error);
                toast.error('Erreur lors de l\'exécution');
            }
        }
    }

    function updateSelection(direction) {
        const newIndex = selectedIndex + direction;
        if (newIndex >= -1 && newIndex < commands.length) {
            selectedIndex = newIndex;
            const items = document.querySelectorAll('.command-item');
            items.forEach((el, i) => {
                el.classList.toggle('active', i === selectedIndex);
            });
            if (selectedIndex >= 0) {
                items[selectedIndex]?.scrollIntoView({ block: 'nearest' });
            }
        }
    }

    function open() {
        palette.classList.remove('hidden');
        input.focus();
        input.value = '';
        renderResults(commandRegistry);
    }

    function close() {
        palette.classList.add('hidden');
        input.value = '';
    }

    function init() {
        // Événements clavier
        document.addEventListener('keydown', (e) => {
            // Ouvrir avec ⌘K ou Ctrl+K
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                palette.classList.contains('hidden') ? open() : close();
            }

            if (palette.classList.contains('hidden')) return;

            switch (e.key) {
                case 'Escape':
                    e.preventDefault();
                    close();
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    updateSelection(1);
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    updateSelection(-1);
                    break;
                case 'Enter':
                    e.preventDefault();
                    if (selectedIndex >= 0) {
                        executeCommand(selectedIndex);
                    }
                    break;
            }
        });

        // Filtrer sur entrée
        input.addEventListener('input', () => {
            const filtered = filterCommands(input.value);
            renderResults(filtered);
        });

        // Fermer au clic sur le backdrop
        document.querySelector('.command-palette-backdrop')?.addEventListener('click', close);
    }

    init();

    return {
        open,
        close,
        registerCommand: (cmd) => commandRegistry.push(cmd),
    };
}
