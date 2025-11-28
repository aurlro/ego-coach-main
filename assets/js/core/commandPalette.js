// Command Palette - Upgraded Ctrl+K
import { bus } from '../core/eventBus.js';

export class CommandPalette {
    constructor() {
        this.isOpen = false;
        this.commands = [
            {
                id: 'new-analysis',
                title: 'Nouvelle Analyse',
                description: 'Lancer une nouvelle analyse de conflit',
                icon: 'zap',
                action: () => window.location.hash = 'analyze',
                keywords: ['analyse', 'nouveau', 'créer']
            },
            {
                id: 'journal',
                title: 'Voir le Journal',
                description: 'Consulter mes analyses passées',
                icon: 'book',
                action: () => window.location.hash = 'journal',
                keywords: ['journal', 'historique', 'analyses']
            },
            {
                id: 'dashboard',
                title: 'Dashboard',
                description: 'Retour au tableau de bord',
                icon: 'home',
                action: () => window.location.hash = 'home',
                keywords: ['accueil', 'home', 'dashboard']
            },
            {
                id: 'dojo',
                title: 'Dojo d\'Entraînement',
                description: 'Pratiquer avec des scénarios',
                icon: 'swords',
                action: () => window.location.hash = 'dojo',
                keywords: ['dojo', 'entraînement', 'pratique']
            },
            {
                id: 'guide',
                title: 'Guide des Techniques',
                description: 'Consulter les méthodes de communication',
                icon: 'compass',
                action: () => window.location.hash = 'guide',
                keywords: ['guide', 'aide', 'techniques']
            },
            {
                id: 'settings',
                title: 'Paramètres',
                description: 'Configurer l\'application',
                icon: 'settings',
                action: () => bus.emit('settings:open'),
                keywords: ['paramètres', 'config', 'settings']
            },
            {
                id: 'toggle-theme',
                title: 'Changer le thème',
                description: 'Basculer entre mode clair et sombre',
                icon: 'moon',
                action: () => bus.emit('theme:toggle'),
                keywords: ['thème', 'dark', 'mode', 'sombre']
            }
        ];
        this.filteredCommands = [...this.commands];
        this.selectedIndex = 0;
    }

    open() {
        if (this.isOpen) return;

        this.isOpen = true;
        this.selectedIndex = 0;
        this.filteredCommands = [...this.commands];

        const palette = document.createElement('div');
        palette.id = 'command-palette';
        palette.className = 'fixed inset-0 z-[100] flex items-start justify-center pt-[20vh] bg-black/50 backdrop-blur-sm animate-fadeIn';
        palette.innerHTML = `
            <div class="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-slideInUp">
                <!-- Search Input -->
                <div class="p-4 border-b border-slate-200 dark:border-slate-700">
                    <div class="relative">
                        <i data-lucide="search" class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"></i>
                        <input 
                            type="text" 
                            id="command-search" 
                            placeholder="Taper une commande ou rechercher..."
                            class="w-full pl-10 pr-4 py-3 bg-transparent text-slate-900 dark:text-white placeholder-slate-400 outline-none text-lg"
                            autocomplete="off"
                        >
                    </div>
                </div>
                
                <!-- Commands List -->
                <div id="commands-list" class="max-h-96 overflow-y-auto custom-scrollbar">
                    ${this.renderCommands()}
                </div>
                
                <!-- Footer -->
                <div class="p-3 bg-slate-50 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs text-slate-500">
                    <div class="flex gap-4">
                        <div><kbd class="px-2 py-1 bg-white dark:bg-slate-700 rounded border border-slate-200 dark:border-slate-600 font-mono">↑↓</kbd> Naviguer</div>
                        <div><kbd class="px-2 py-1 bg-white dark:bg-slate-700 rounded border border-slate-200 dark:border-slate-600 font-mono">↵</kbd> Sélectionner</div>
                        <div><kbd class="px-2 py-1 bg-white dark:bg-slate-700 rounded border border-slate-200 dark:border-slate-600 font-mono">Esc</kbd> Fermer</div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(palette);
        if (window.lucide) window.lucide.createIcons();

        // Focus input
        const input = document.getElementById('command-search');
        input.focus();

        // Event listeners
        this.attachPaletteListeners(palette, input);
    }

    renderCommands() {
        if (this.filteredCommands.length === 0) {
            return `
                <div class="p-8 text-center text-slate-500">
                    <i data-lucide="search-x" class="w-12 h-12 mx-auto mb-2 opacity-50"></i>
                    <p>Aucune commande trouvée</p>
                </div>
            `;
        }

        return this.filteredCommands.map((cmd, index) => `
            <div 
                class="command-item flex items-center gap-4 p-4 cursor-pointer transition-colors ${index === this.selectedIndex ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-600' : 'hover:bg-slate-50 dark:hover:bg-slate-800 border-l-4 border-transparent'}"
                data-command-id="${cmd.id}"
                data-index="${index}"
            >
                <div class="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center shrink-0">
                    <i data-lucide="${cmd.icon}" class="w-5 h-5 text-slate-600 dark:text-slate-300"></i>
                </div>
                <div class="flex-1 min-w-0">
                    <div class="font-medium text-slate-900 dark:text-white">${cmd.title}</div>
                    <div class="text-sm text-slate-500 truncate">${cmd.description}</div>
                </div>
            </div>
        `).join('');
    }

    attachPaletteListeners(palette, input) {
        // Search
        input.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            this.filteredCommands = this.commands.filter(cmd =>
                cmd.title.toLowerCase().includes(query) ||
                cmd.description.toLowerCase().includes(query) ||
                cmd.keywords.some(k => k.toLowerCase().includes(query))
            );
            this.selectedIndex = 0;
            this.updateCommandsList();
        });

        // Keyboard navigation
        input.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                this.selectedIndex = Math.min(this.selectedIndex + 1, this.filteredCommands.length - 1);
                this.updateCommandsList();
                this.scrollToSelected();
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                this.selectedIndex = Math.max(this.selectedIndex - 1, 0);
                this.updateCommandsList();
                this.scrollToSelected();
            } else if (e.key === 'Enter') {
                e.preventDefault();
                this.executeCommand(this.filteredCommands[this.selectedIndex]);
            } else if (e.key === 'Escape') {
                this.close();
            }
        });

        // Click on command
        palette.addEventListener('click', (e) => {
            const commandItem = e.target.closest('.command-item');
            if (commandItem) {
                const commandId = commandItem.dataset.commandId;
                const command = this.commands.find(c => c.id === commandId);
                if (command) this.executeCommand(command);
            }

            // Close on backdrop click
            if (e.target === palette) {
                this.close();
            }
        });
    }

    updateCommandsList() {
        const list = document.getElementById('commands-list');
        if (list) {
            list.innerHTML = this.renderCommands();
            if (window.lucide) window.lucide.createIcons();
        }
    }

    scrollToSelected() {
        const list = document.getElementById('commands-list');
        const selected = list?.querySelector(`[data-index="${this.selectedIndex}"]`);
        if (selected) {
            selected.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        }
    }

    executeCommand(command) {
        if (!command) return;
        this.close();
        setTimeout(() => command.action(), 100);
    }

    close() {
        const palette = document.getElementById('command-palette');
        if (palette) {
            palette.classList.add('opacity-0');
            setTimeout(() => palette.remove(), 200);
        }
        this.isOpen = false;
    }
}

export const commandPalette = new CommandPalette();
