// Keyboard Shortcuts Module
import { bus } from './eventBus.js';

export class KeyboardShortcuts {
    constructor() {
        this.shortcuts = {
            'k': { // Ctrl+K
                ctrl: true,
                description: 'Ouvrir recherche/commande palette',
                action: () => this.openCommandPalette()
            },
            'n': { // Ctrl+N  
                ctrl: true,
                description: 'Nouvelle analyse',
                action: () => window.location.hash = 'analyze'
            },
            'j': { // Ctrl+J
                ctrl: true,
                description: 'Aller au Journal',
                action: () => window.location.hash = 'journal'
            },
            'h': { // Ctrl+H
                ctrl: true,
                description: 'Aller au Dashboard',
                action: () => window.location.hash = 'home'
            },
            'd': { // Ctrl+D
                ctrl: true,
                description: 'Aller au Dojo',
                action: () => window.location.hash = 'dojo'
            },
            'g': { // Ctrl+G
                ctrl: true,
                description: 'Aller au Guide',
                action: () => window.location.hash = 'guide'
            },
            ',': { // Ctrl+,
                ctrl: true,
                description: 'Ouvrir Paramètres',
                action: () => bus.emit('settings:open')
            },
            '?': { // ? (shift+/)
                description: 'Afficher aide shortcuts',
                action: () => this.showHelp()
            }
        };

        this.helpModalVisible = false;
    }

    init() {
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
    }

    handleKeyPress(e) {
        const key = e.key.toLowerCase();
        const shortcut = this.shortcuts[key];

        if (!shortcut) return;

        // Check modifiers
        if (shortcut.ctrl && !e.ctrlKey && !e.metaKey) return;

        // Prevent default for our shortcuts
        const targetTag = e.target.tagName.toLowerCase();
        const isInput = ['input', 'textarea', 'select'].includes(targetTag);

        // Allow shortcuts in inputs only for specific combos
        if (isInput && key !== '?') {
            // Only allow Ctrl combos in inputs
            if (!shortcut.ctrl) return;
        }

        e.preventDefault();
        shortcut.action();
    }

    openCommandPalette() {
        // Import and open command palette
        import('./commandPalette.js').then(({ commandPalette }) => {
            commandPalette.open();
        });
    }

    showHelp() {
        if (this.helpModalVisible) {
            this.hideHelp();
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'shortcuts-modal';
        modal.className = 'shortcuts-modal';
        modal.innerHTML = `
            <div class="shortcuts-content">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-xl font-bold text-slate-900 dark:text-white">Raccourcis Clavier</h3>
                    <button id="close-shortcuts" class="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
                        <i data-lucide="x" class="w-5 h-5"></i>
                    </button>
                </div>
                <div class="shortcuts-list">
                    ${Object.entries(this.shortcuts).map(([key, shortcut]) => `
                        <div class="shortcut-item">
                            <span class="text-sm text-slate-600 dark:text-slate-400">${shortcut.description}</span>
                            <div class="shortcut-keys">
                                ${shortcut.ctrl ? '<span class="shortcut-key">Ctrl</span> <span class="text-slate-400">+</span> ' : ''}
                                <span class="shortcut-key">${key.toUpperCase()}</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        this.helpModalVisible = true;

        // Refresh lucide icons
        if (window.lucide) window.lucide.createIcons();

        // Close on backdrop or button click
        modal.addEventListener('click', (e) => {
            if (e.target === modal || e.target.closest('#close-shortcuts')) {
                this.hideHelp();
            }
        });

        // Close on Escape
        const escapeHandler = (e) => {
            if (e.key === 'Escape') {
                this.hideHelp();
                document.removeEventListener('keydown', escapeHandler);
            }
        };
        document.addEventListener('keydown', escapeHandler);
    }

    hideHelp() {
        const modal = document.getElementById('shortcuts-modal');
        if (modal) {
            modal.remove();
            this.helpModalVisible = false;
        }
    }
}

export const keyboardShortcuts = new KeyboardShortcuts();
