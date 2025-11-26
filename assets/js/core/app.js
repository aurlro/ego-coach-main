import { Router } from './router.js';
import { store } from './store.js';
import { repository } from '../data/repository.js';
import { bus } from './eventBus.js';
import { SettingsModal } from '../components/settingsModal.js';

// Import Pages (will be created later)
// For now we'll use placeholders or dynamic imports in the router config

class App {
    constructor() {
        this.router = null;
        this.settingsModal = new SettingsModal();
    }

    async init() {
        console.log('🚀 Phoenix App Initializing...');

        // 1. Initialize Data Layer
        try {
            await repository.init();
            const data = await repository.getAllData();
            store.init(data);
            console.log('📦 Data loaded');
        } catch (error) {
            console.error('Failed to load data:', error);
        }

        // Initialize Settings Modal
        this.settingsModal.init();

        // 2. Setup Router
        const routes = {
            'home': {
                component: async () => {
                    const { HomePage } = await import('../components/pages/homePage.js');
                    return new HomePage();
                }
            },
            'journal': {
                component: async () => {
                    const { JournalPage } = await import('../components/pages/journalPage.js');
                    return new JournalPage();
                }
            },
            'analyzer-manual': {
                component: async () => {
                    const { AnalyzerPage } = await import('../components/pages/analyzerPage.js');
                    return new AnalyzerPage();
                }
            },
            'analyzer-ai': {
                component: async () => {
                    const { AIAnalyzerPage } = await import('../components/pages/aiAnalyzerPage.js');
                    return new AIAnalyzerPage();
                }
            },
            'analyzer-quick': {
                component: async () => {
                    const { AIAnalyzerPage } = await import('../components/pages/aiAnalyzerPage.js');
                    return new AIAnalyzerPage();
                }
            },
            'analyze': { // Fallback/Alias
                component: async () => {
                    const { AnalyzerPage } = await import('../components/pages/analyzerPage.js');
                    return new AnalyzerPage();
                }
            },
            'dojo': {
                component: async () => {
                    const { DojoPage } = await import('../components/pages/dojoPage.js');
                    return new DojoPage();
                }
            },
            'guide': {
                component: async () => {
                    const { GuidePage } = await import('../components/pages/guidePage.js');
                    return new GuidePage();
                }
            }
        };

        this.router = new Router(routes, 'app-root');
        this.router.init();

        // 3. Global Event Listeners
        this.attachGlobalListeners();

        console.log('✅ App Ready');
    }

    attachGlobalListeners() {
        // Theme toggling
        bus.on('theme:toggle', () => {
            const current = store.getState().theme;
            const next = current === 'dark' ? 'light' : 'dark';
            store.setState({ theme: next });
            document.documentElement.classList.toggle('dark', next === 'dark');
            localStorage.setItem('theme', next);

            // Refresh icons after theme change to ensure correct visibility
            if (window.lucide) window.lucide.createIcons();
        });

        // Initialize theme from storage
        const savedTheme = localStorage.getItem('theme') || 'light';
        store.setState({ theme: savedTheme });
        document.documentElement.classList.toggle('dark', savedTheme === 'dark');

        // Mobile Sidebar Logic
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebar-overlay');
        const toggleBtn = document.getElementById('sidebar-toggle');
        const links = document.querySelectorAll('#sidebar a');

        function toggleSidebar() {
            const isClosed = sidebar.classList.contains('-translate-x-full');
            if (isClosed) {
                sidebar.classList.remove('-translate-x-full');
                overlay.classList.remove('hidden');
                // Small delay to allow display:block to apply before opacity transition
                setTimeout(() => overlay.classList.remove('opacity-0'), 10);
            } else {
                sidebar.classList.add('-translate-x-full');
                overlay.classList.add('opacity-0');
                setTimeout(() => overlay.classList.add('hidden'), 300);
            }
        }

        toggleBtn?.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleSidebar();
        });

        overlay?.addEventListener('click', toggleSidebar);

        // Close sidebar on link click (mobile)
        links.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth < 1024 && !sidebar.classList.contains('-translate-x-full')) {
                    toggleSidebar();
                }
            });
        });

        // Settings Button Logic
        const settingsBtn = document.getElementById('open-settings-btn');
        settingsBtn?.addEventListener('click', () => {
            this.settingsModal.open();
            if (window.innerWidth < 1024 && !sidebar.classList.contains('-translate-x-full')) {
                toggleSidebar();
            }
        });

        // Theme Toggle Button Logic
        const themeBtn = document.getElementById('theme-toggle');
        themeBtn?.addEventListener('click', () => {
            bus.emit('theme:toggle');
        });
    }
}

// Start the app
const app = new App();
document.addEventListener('DOMContentLoaded', () => {
    app.init().catch(err => {
        console.error('CRITICAL APP ERROR:', err);
        document.body.innerHTML = `<div style="color:red; padding:20px;">
            <h1>Erreur Critique</h1>
            <p>L'application n'a pas pu démarrer.</p>
            <pre>${err.message}</pre>
        </div>`;
    });
});
