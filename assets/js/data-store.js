'use strict';

/**
 * Crée un data store pour gérer les données de l'application.
 * Pour l'instant, il utilise le localStorage du navigateur, mais il est conçu
 * pour être facilement adaptable à une base de données distante.
 *
 * @param {object} options - Les options de configuration.
 * @param {string} options.defaultUser - L'utilisateur par défaut si aucun n'est défini.
 * @returns {object} L'instance du data store.
 */
function createDataStore({ defaultUser = 'default' } = {}) {
    let currentUser = defaultUser;

    /**
     * Récupère l'utilisateur actuellement connecté.
     * @returns {string} L'identifiant de l'utilisateur actuel.
     */
    function getCurrentUser() {
        return currentUser;
    }

    /**
     * Change l'utilisateur actuel.
     * @param {string} newUser - Le nouvel identifiant de l'utilisateur.
     */
    function setCurrentUser(newUser) {
        if (typeof newUser === 'string' && newUser.trim()) {
            currentUser = newUser.trim();
        } else {
            currentUser = defaultUser;
        }
    }

    /**
     * Génère la clé de stockage pour l'utilisateur actuel.
     * @param {string} key - La clé de la donnée (ex: 'journal').
     * @returns {string} La clé complète pour le localStorage.
     */
    function getUserStorageKey(key) {
        return `ego-coach-data::${currentUser}::${key}`;
    }

    /**
     * Récupère les données pour une clé donnée.
     * @param {string} key - La clé des données à récupérer.
     * @param {*} [fallback=[]] - La valeur par défaut si rien n'est trouvé.
     * @returns {*} Les données parsées.
     */
    function getData(key, fallback = []) {
        try {
            const storageKey = getUserStorageKey(key);
            const raw = localStorage.getItem(storageKey);
            if (!raw) return fallback;
            const parsed = JSON.parse(raw);
            return parsed;
        } catch (error) {
            console.error(`Impossible de lire les données pour la clé "${key}":`, error);
            return fallback;
        }
    }

    /**
     * Sauvegarde les données pour une clé donnée.
     * @param {string} key - La clé sous laquelle sauvegarder les données.
     * @param {*} data - Les données à sauvegarder (sera sérialisé en JSON).
     * @returns {boolean} `true` si la sauvegarde a réussi, sinon `false`.
     */
    function saveData(key, data) {
        try {
            const storageKey = getUserStorageKey(key);
            localStorage.setItem(storageKey, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error(`Impossible de sauvegarder les données pour la clé "${key}":`, error);
            return false;
        }
    }

    /**
     * Supprime toutes les données pour l'utilisateur actuel.
     * @returns {void}
     */
    function clearAllUserData() {
        // Attention: cette méthode est un peu "brute" et pourrait supprimer
        // des clés d'autres versions de l'application si le préfixe est partagé.
        // Pour une application de production, une gestion plus fine serait nécessaire.
        const prefix = `ego-coach-data::${currentUser}::`;
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith(prefix)) {
                localStorage.removeItem(key);
            }
        });
    }

    return {
        getCurrentUser,
        setCurrentUser,
        getData,
        saveData,
        clearAllUserData,
    };
}
