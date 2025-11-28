// PWA Install Module
import { bus } from './eventBus.js';

export class PWAInstaller {
    constructor() {
        this.deferredPrompt = null;
        this.isInstalled = false;
        this.isStandalone = false;
    }

    init() {
        // Check if already installed
        this.isStandalone = window.matchMedia('(display-mode: standalone)').matches
            || window.navigator.standalone
            || document.referrer.includes('android-app://');

        if (this.isStandalone) {
            this.isInstalled = true;
            console.log('[PWA] Running as installed app');
            return;
        }

        // Register service worker
        this.registerServiceWorker();

        // Listen for install prompt
        window.addEventListener('beforeinstallprompt', (e) => {
            console.log('[PWA] Install prompt available');
            e.preventDefault();
            this.deferredPrompt = e;
            this.showInstallButton();
        });

        // Listen for app installed
        window.addEventListener('appinstalled', () => {
            console.log('[PWA] App installed successfully');
            this.isInstalled = true;
            this.deferredPrompt = null;
            this.hideInstallButton();
        });
    }

    async registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.register('/sw.js');
                console.log('[PWA] Service Worker registered:', registration.scope);

                // Listen for updates
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            this.showUpdateNotification();
                        }
                    });
                });
            } catch (error) {
                console.error('[PWA] Service Worker registration failed:', error);
            }
        }
    }

    showInstallButton() {
        // Add install button to settings or create popup
        bus.emit('pwa:installable', { canInstall: true });

        // Auto-show install banner after 3 visits
        const visitCount = parseInt(localStorage.getItem('visit_count') || '0') + 1;
        localStorage.setItem('visit_count', visitCount.toString());

        if (visitCount >= 3 && !localStorage.getItem('install_banner_dismissed')) {
            setTimeout(() => this.showInstallBanner(), 3000);
        }
    }

    hideInstallButton() {
        bus.emit('pwa:installable', { canInstall: false });
    }

    async install() {
        if (!this.deferredPrompt) {
            console.log('[PWA] No install prompt available');
            return false;
        }

        this.deferredPrompt.prompt();
        const { outcome } = await this.deferredPrompt.userChoice;

        console.log(`[PWA] User response: ${outcome}`);
        this.deferredPrompt = null;

        return outcome === 'accepted';
    }

    showInstallBanner() {
        const banner = document.createElement('div');
        banner.id = 'pwa-install-banner';
        banner.className = 'fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 p-4 z-50 animate-slideInUp';
        banner.innerHTML = `
            <div class="flex items-start gap-3">
                <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center shrink-0">
                    <i data-lucide="download" class="w-6 h-6 text-blue-600 dark:text-blue-400"></i>
                </div>
                <div class="flex-1">
                    <h4 class="font-bold text-slate-900 dark:text-white mb-1">Installer EgoCoach</h4>
                    <p class="text-sm text-slate-600 dark:text-slate-400 mb-3">Accède plus rapidement avec l'app installée !</p>
                    <div class="flex gap-2">
                        <button id="pwa-install-btn" class="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                            Installer
                        </button>
                        <button id="pwa-dismiss-btn" class="px-4 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-sm transition-colors">
                            Plus tard
                        </button>
                    </div>
                </div>
                <button id="pwa-close-btn" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                    <i data-lucide="x" class="w-5 h-5"></i>
                </button>
            </div>
        `;

        document.body.appendChild(banner);
        if (window.lucide) window.lucide.createIcons();

        // Event listeners
        banner.querySelector('#pwa-install-btn').addEventListener('click', async () => {
            const installed = await this.install();
            if (installed) {
                banner.remove();
            }
        });

        banner.querySelector('#pwa-dismiss-btn').addEventListener('click', () => {
            banner.remove();
        });

        banner.querySelector('#pwa-close-btn').addEventListener('click', () => {
            localStorage.setItem('install_banner_dismissed', 'true');
            banner.remove();
        });
    }

    showUpdateNotification() {
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-6 py-3 rounded-xl shadow-lg z-50 flex items-center gap-3';
        notification.innerHTML = `
            <i data-lucide="refresh-cw" class="w-5 h-5"></i>
            <span>Nouvelle version disponible !</span>
            <button id="pwa-update-btn" class="px-3 py-1 bg-white text-blue-600 rounded-lg text-sm font-medium ml-2">
                Actualiser
            </button>
        `;

        document.body.appendChild(notification);
        if (window.lucide) window.lucide.createIcons();

        notification.querySelector('#pwa-update-btn').addEventListener('click', () => {
            window.location.reload();
        });
    }
}

export const pwaInstaller = new PWAInstaller();
