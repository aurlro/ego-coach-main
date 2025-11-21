/**
 * Notification Manager - Gère les notifications système
 * Centralise la logique des notifications avec persistence locale
 */

function createNotificationManager() {
    const STORAGE_KEY = 'boite-outils-notifications';
    let notifications = [];

    /**
     * Types de notifications disponibles
     */
    const NOTIFICATION_TYPES = {
        SYSTEM: 'system',         // Mises à jour système
        FEATURE: 'feature',       // Nouvelles fonctionnalités
        TIP: 'tip',              // Conseils et astuces
        WARNING: 'warning',      // Avertissements
        SUCCESS: 'success',      // Confirmations
    };

    /**
     * Notifications par défaut (demo)
     */
    const DEFAULT_NOTIFICATIONS = [
        {
            id: 'demo-1',
            type: NOTIFICATION_TYPES.TIP,
            title: '💡 Astuce : Recherche rapide',
            message: 'Utilise ⌘K pour ouvrir la recherche et naviguer rapidement',
            timestamp: Date.now() - 3600000,
            read: false,
            dismissible: true,
        },
        {
            id: 'demo-2',
            type: NOTIFICATION_TYPES.FEATURE,
            title: '✨ Nouvelle : Test des providers IA',
            message: 'Tu peux maintenant tester si Gemini ou Ollama fonctionnent avant d\'analyser',
            timestamp: Date.now() - 7200000,
            read: false,
            dismissible: true,
        },
    ];

    /**
     * Initialise le gestionnaire
     */
    function init() {
        loadFromStorage();
    }

    /**
     * Charge les notifications du localStorage
     */
    function loadFromStorage() {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            notifications = stored ? JSON.parse(stored) : [...DEFAULT_NOTIFICATIONS];
        } catch (error) {
            console.error('Erreur chargement notifications:', error);
            notifications = [...DEFAULT_NOTIFICATIONS];
        }
    }

    /**
     * Sauvegarde les notifications dans le localStorage
     */
    function saveToStorage() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
        } catch (error) {
            console.error('Erreur sauvegarde notifications:', error);
        }
    }

    /**
     * Ajoute une notification
     */
    function add(notification) {
        const newNotification = {
            id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            type: notification.type || NOTIFICATION_TYPES.SYSTEM,
            title: notification.title || '',
            message: notification.message || '',
            timestamp: Date.now(),
            read: false,
            dismissible: notification.dismissible !== false,
            action: notification.action || null,
        };

        notifications.unshift(newNotification);
        saveToStorage();
        updateBadge();

        return newNotification;
    }

    /**
     * Récupère toutes les notifications
     */
    function getAll() {
        return [...notifications];
    }

    /**
     * Récupère les notifications non lues
     */
    function getUnread() {
        return notifications.filter(n => !n.read);
    }

    /**
     * Récupère le nombre de notifications non lues
     */
    function getUnreadCount() {
        return getUnread().length;
    }

    /**
     * Marque une notification comme lue
     */
    function markAsRead(notificationId) {
        const notification = notifications.find(n => n.id === notificationId);
        if (notification && !notification.read) {
            notification.read = true;
            saveToStorage();
            updateBadge();
        }
    }

    /**
     * Marque toutes les notifications comme lues
     */
    function markAllAsRead() {
        notifications.forEach(n => {
            n.read = true;
        });
        saveToStorage();
        updateBadge();
    }

    /**
     * Supprime une notification
     */
    function dismiss(notificationId) {
        const index = notifications.findIndex(n => n.id === notificationId);
        if (index >= 0) {
            notifications.splice(index, 1);
            saveToStorage();
            updateBadge();
        }
    }

    /**
     * Réinitialise les notifications (démo)
     */
    function resetToDefaults() {
        notifications = [...DEFAULT_NOTIFICATIONS];
        saveToStorage();
        updateBadge();
    }

    /**
     * Met à jour le badge du bouton de notifications
     */
    function updateBadge() {
        const badge = document.querySelector('.notification-badge');
        if (badge) {
            const count = getUnreadCount();
            badge.textContent = count;
            badge.style.display = count > 0 ? 'inline-flex' : 'none';
        }
    }

    /**
     * Obtient l'icône pour un type de notification
     */
    function getIcon(type) {
        switch (type) {
            case NOTIFICATION_TYPES.SYSTEM:
                return '⚙️';
            case NOTIFICATION_TYPES.FEATURE:
                return '✨';
            case NOTIFICATION_TYPES.TIP:
                return '💡';
            case NOTIFICATION_TYPES.WARNING:
                return '⚠️';
            case NOTIFICATION_TYPES.SUCCESS:
                return '✅';
            default:
                return '📢';
        }
    }

    /**
     * Formate une date de notification
     */
    function formatTime(timestamp) {
        const now = Date.now();
        const diff = now - timestamp;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return 'À l\'instant';
        if (minutes < 60) return `il y a ${minutes}m`;
        if (hours < 24) return `il y a ${hours}h`;
        if (days < 7) return `il y a ${days}j`;

        const date = new Date(timestamp);
        return date.toLocaleDateString('fr-FR');
    }

    // Initialiser au chargement
    init();

    return {
        add,
        getAll,
        getUnread,
        getUnreadCount,
        markAsRead,
        markAllAsRead,
        dismiss,
        resetToDefaults,
        updateBadge,
        getIcon,
        formatTime,
        TYPES: NOTIFICATION_TYPES,
    };
}
