'use strict';

document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    refreshIcons(); // Initial icon render
    const toast = createToastManager();
    const modal = createModalManager();

    // 🟢 SYSTEM HEALTH CHECK: Vérifier la santé du système au démarrage
    const healthStatus = getSystemHealthStatus();
    if (healthStatus.status === 'error') {
        console.error('❌ Système critique:', healthStatus.issues);
        healthStatus.issues.forEach(issue => {
            toast.error(issue);
        });
    } else if (healthStatus.status === 'warning') {
        console.warn('⚠️ Avertissements système:', healthStatus.issues);
        healthStatus.issues.forEach(issue => {
            toast.warning(issue);
        });
    }

    const encryptor = createLocalEncryptor();
    const gemini = createGeminiService({ encryptor, toast });
    const ollama = createOllamaService({ toast });
    const dataStore = createDataStore({ defaultUser: 'default' });
    const journalStore = createJournalStore({ dataStore, toast });
    // Correction: createJournalStore was also in app.js. I need to extract it or keep it.
    // It was at line 2722. I missed extracting it. I should extract it to journalModule.js or a separate store file.
    // In journalModule.js I used `store` as dependency.
    // So I need `createJournalStore`.
    // I'll add it to journalModule.js or create journalStore.js.
    // For now, I'll assume I need to fix this.

    const notifications = createNotificationManager();

    // --- NOUVELLE UI: Initialisation de la Navigation Sidebar ---
    // --- NOUVELLE UI: Initialisation de la Navigation Sidebar ---
    const themeManager = createThemeManager();
    themeManager.init();
    const navManager = createNavigationManager();
    const commandPalette = createCommandPalette({ navigation: navManager, toast });

    // --- Gestion Sidebar Mobile ---
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebarCloseBtn = document.getElementById('sidebar-close');
    const sidebar = document.getElementById('sidebar');
    const fab = document.getElementById('fab');

    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', () => {
            sidebar?.classList.toggle('open');
        });
    }

    if (sidebarCloseBtn) {
        sidebarCloseBtn.addEventListener('click', () => {
            sidebar?.classList.remove('open');
        });
    }

    // Navigation items
    document.querySelectorAll('[data-page]').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const page = item.getAttribute('data-page');
            navManager.navigateTo(page);
        });
    });

    // FAB (Mobile) - Nouvelle analyse rapide
    if (fab) {
        fab.addEventListener('click', () => {
            navManager.navigateTo('analyzer-quick');
        });
    }

    // Bouton "Nouvelle Analyse" dans sidebar
    const quickAnalyzeBtn = document.querySelector('.quick-action-btn');
    if (quickAnalyzeBtn) {
        quickAnalyzeBtn.addEventListener('click', () => {
            navManager.navigateTo('analyzer-quick');
        });
    }

    // --- Page Header Buttons: Search & Notifications ---
    // Search button (opens Command Palette)
    const searchButton = document.querySelector('.page-actions button:nth-of-type(1)');
    if (searchButton) {
        searchButton.addEventListener('click', () => {
            commandPalette.open();
        });
    }

    // Notifications button - Opens Notifications Panel
    const notificationsButton = document.querySelector('.page-actions button:nth-of-type(2)');
    if (notificationsButton) {
        // Update badge on init
        notifications.updateBadge();

        notificationsButton.addEventListener('click', () => {
            openNotificationsPanel();
        });
    }

    // Notifications Panel Modal
    function openNotificationsPanel() {
        const allNotifications = notifications.getAll();
        const unreadCount = notifications.getUnreadCount();

        if (allNotifications.length === 0) {
            toast.info('📬 Aucune notification pour le moment.');
            return;
        }

        const notificationsList = allNotifications
            .map(
                (notif) => `
                    <div class="notification-item ${notif.read ? 'read' : 'unread'}" data-notif-id="${notif.id}">
                        <div class="notification-header">
                            <span class="notification-icon">${notifications.getIcon(notif.type)}</span>
                            <div class="notification-meta">
                                <h4 class="notification-title">${escapeHTML(notif.title)}</h4>
                                <span class="notification-time">${notifications.formatTime(notif.timestamp)}</span>
                            </div>
                            ${notif.dismissible
                        ? `<button type="button" class="notification-dismiss" data-notif-id="${notif.id}" title="Supprimer">×</button>`
                        : ''
                    }
                        </div>
                        <p class="notification-message">${escapeHTML(notif.message)}</p>
                    </div>
                `,
            )
            .join('');

        const html = `
            <div class="space-y-2">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-lg font-semibold">Notifications (${unreadCount} non lues)</h3>
                    ${unreadCount > 0
                ? '<button type="button" class="text-xs text-blue-600 dark:text-blue-400 hover:underline" id="mark-all-read">Tout marquer comme lu</button>'
                : ''
            }
                </div>
                <div class="notifications-list space-y-2 max-h-96 overflow-y-auto">
                    ${notificationsList}
                </div>
            </div>
        `;

        modal.show({
            targetId: 'journal-modal',
            title: '🔔 Notifications',
            html,
            actions: [
                {
                    label: 'Réinitialiser démo',
                    onClick: () => {
                        notifications.resetToDefaults();
                        modal.hide('journal-modal');
                        toast.info('Notifications réinitialisées.');
                        setTimeout(() => openNotificationsPanel(), 300);
                    },
                },
                {
                    label: 'Fermer',
                    onClick: () => modal.hide('journal-modal'),
                },
            ],
        });

        // Event listeners for notification actions
        setTimeout(() => {
            document.querySelectorAll('.notification-dismiss').forEach((btn) => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const notifId = btn.getAttribute('data-notif-id');
                    notifications.dismiss(notifId);
                    btn.closest('.notification-item').style.opacity = '0.5';
                    btn.closest('.notification-item').style.pointerEvents = 'none';
                });
            });

            document.getElementById('mark-all-read')?.addEventListener('click', () => {
                notifications.markAllAsRead();
                setTimeout(() => openNotificationsPanel(), 200);
            });

            document.querySelectorAll('.notification-item').forEach((item) => {
                item.addEventListener('click', (e) => {
                    if (e.target.closest('.notification-dismiss')) return;
                    const notifId = item.getAttribute('data-notif-id');
                    notifications.markAsRead(notifId);
                    item.classList.remove('unread');
                    item.classList.add('read');
                });
            });
        }, 0);
    }

    // --- ANCIENNE NAVIGATION: Compatibilité ---
    const navigation = {
        navigateTo: (page) => navManager.navigateTo(page),
    };

    // --- Modules ---
    document.addEventListener('click', (event) => {
        const trigger = event.target.closest('[data-copy-text]');
        if (!trigger) return;
        const text = trigger.getAttribute('data-copy-text');
        if (!text) return;

        event.preventDefault();

        const successMessage =
            trigger.getAttribute('data-toast-success') ||
            'Copié dans le presse-papiers.';
        const errorMessage =
            trigger.getAttribute('data-toast-error') ||
            'Impossible de copier ce contenu.';

        copyTextToClipboard(text)
            .then(() => toast.success(successMessage))
            .catch(() => toast.error(errorMessage));
    });

    const homeModule = createHomeModule({
        rootId: 'home-root',
        store: journalStore,
        toast,
        navigate: navigation.navigateTo,
    });

    const journalModule = createJournalModule({
        rootId: 'journal-root',
        store: journalStore,
        toast,
        modal,
        onChange: () => {
            homeModule.render();
            refreshIcons();
        },
    });

    const quickAnalyzerModule = createQuickAnalyzer({
        rootId: 'quick-root',
        store: journalStore,
        toast,
        gemini,
        ollama,
        modal,
    });

    const manualModule = createManualAnalyzer({
        rootId: 'manual-root',
        store: journalStore,
        toast,
        onSaved: () => {
            homeModule.render();
            journalModule.render();
            refreshIcons();
        },
    });

    const aiModule = createAIModule({
        rootId: 'ai-root',
        toast,
        gemini,
        ollama,
        modal,
    });

    const dojo = createDojoSimulator({ modal, toast });
    const guideModule = createGuideModule({
        rootId: 'guide-root',
        toast,
        dojo,
        modal,
    });

    // Module Insights (stub - à développer)
    const insightsModule = {
        render: () => {
            const root = document.getElementById('insights-root');
            if (!root) return;
            root.innerHTML = `
                <div class="space-y-6">
                    <h2 class="text-2xl font-bold">Mes Insights</h2>
                    <div class="card">
                        <p class="text-slate-600 dark:text-slate-400">
                            Agrégation de tes insights personnels à venir...
                        </p>
                    </div>
                </div>
            `;
        },
    };

    // Render initial pages (lazy load sur sidebar click)
    homeModule.render();
    manualModule.render();
    journalModule.render();
    quickAnalyzerModule.render();
    aiModule.render();
    guideModule.render();
    insightsModule.render();
    refreshIcons();

    // Restaurer la dernière page visitée
    navManager.restoreLastPage();

    // --- Settings Modal ---
    const settingsBtn = document.getElementById('settings-btn');

    if (settingsBtn) {
        settingsBtn.addEventListener('click', () => {
            openSettingsModal();
        });
    }

    function openSettingsModal() {
        const currentUser = dataStore.getCurrentUser();

        const html = `
            <div class="space-y-6">
                <div class="settings-section">
                    <h4 class="text-sm font-semibold text-slate-900 dark:text-white mb-3 uppercase tracking-wider">Simulation Utilisateur</h4>
                    <div class="flex items-center gap-2">
                        <input type="text" id="modal-user-input" placeholder="Nom d'utilisateur" value="${currentUser}"
                            class="form-input text-sm">
                        <button id="modal-user-btn" class="btn btn-primary btn-sm">
                            Changer
                        </button>
                    </div>
                    <p class="text-xs text-slate-500 mt-2">
                        Simulez l'expérience d'un autre utilisateur pour tester la persistance des données.
                    </p>
                </div>
                
                <div class="settings-section pt-4 border-t border-slate-200 dark:border-slate-700">
                    <h4 class="text-sm font-semibold text-slate-900 dark:text-white mb-3 uppercase tracking-wider">Apparence</h4>
                    <div class="flex items-center justify-between">
                        <span class="text-sm text-slate-700 dark:text-slate-300">Thème sombre</span>
                        <!-- Theme toggle is handled globally, but we could add a switch here if needed -->
                        <span class="text-xs text-slate-500">Utilisez le bouton dans la barre latérale</span>
                    </div>
                </div>
            </div>
        `;

        modal.show({
            targetId: 'settings-modal',
            title: 'Paramètres',
            html,
            actions: [
                {
                    label: 'Fermer',
                    onClick: () => modal.hide('settings-modal'),
                },
            ],
        });

        // Attach event listeners for the modal content
        setTimeout(() => {
            const input = document.getElementById('modal-user-input');
            const btn = document.getElementById('modal-user-btn');

            const handleUserChange = () => {
                const newUser = input.value.trim();
                if (newUser) {
                    dataStore.setCurrentUser(newUser);
                    toast.success(`Utilisateur changé pour : ${newUser}`);

                    // Re-render modules
                    homeModule.render();
                    journalModule.render();

                    // Close modal
                    modal.hide('settings-modal');
                }
            };

            if (btn) btn.addEventListener('click', handleUserChange);
            if (input) {
                input.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') handleUserChange();
                });
            }
        }, 100);
    }
    // --- Fin Settings Modal ---

    const fallbackPage = 'home';
    let initialPage = fallbackPage;
    try {
        const storedPage = localStorage.getItem(STORAGE_KEYS.lastPage);
        if (storedPage && document.getElementById(`page-${storedPage}`)) {
            initialPage = storedPage;
        }
    } catch (error) {
        console.debug('Lecture de la page précédente impossible :', error);
    }

    navigation.navigateTo(initialPage, { persist: false });

    window.app = {
        navigateTo: navigation.navigateTo,
        toast,
        copyText: (text, options = {}) =>
            copyTextToClipboard(text)
                .then(() => {
                    if (options.successMessage) toast.success(options.successMessage);
                    return true;
                })
                .catch((error) => {
                    if (options.errorMessage) toast.error(options.errorMessage);
                    return false;
                }),
    };
});
