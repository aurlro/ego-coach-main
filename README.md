# EgoCoach : Votre Boîte à Outils de Communication Stratégique

EgoCoach est une application web locale conçue pour aider les professionnels, en particulier les Product Owners et Business Analysts, à gérer les conflits interpersonnels. L'objectif est de transformer des réactions instinctives en réponses structurées grâce à des outils d'auto-analyse, un tableau de bord de suivi et une assistance par IA, le tout en garantissant une confidentialité totale (aucune donnée n'est envoyée sur un serveur).

## ✨ Fonctionnalités Principales

-   **Analyse Manuelle Guidée** : Un wizard en quatre étapes (Constat, Ego, MVP, Action) pour décortiquer chaque situation, identifier les schémas émotionnels et préparer des réponses constructives.
-   **Journal de Bord & Tableau de Bord** : Conservez un historique de vos analyses, filtrez-les par type d'ego, et suivez vos progrès grâce à des métriques clés (ego dominant, série sans réaction défensive).
-   **Assistance par IA** : Obtenez des propositions de scripts et des analyses de situation grâce à une IA entraînée à la communication de crise (mode heuristique local, prêt pour une intégration avec Gemini).
-   **Guide de Ressources** : Accédez rapidement à un glossaire des concepts clés (`Ego Radar`) et à des frameworks de communication pour vous aider en temps réel.
-   **Confidentialité Totale** : Toutes les données sont stockées localement dans votre navigateur (`localStorage`). Vous pouvez exporter et importer votre journal au format JSON pour une portabilité maximale.

## 🚀 Démarrage Rapide

Ce projet est une application web statique qui ne nécessite aucun processus de build complexe.

### Prérequis

-   Un navigateur web moderne (Chrome, Firefox, Edge).
-   Python 3 (pour le serveur de développement recommandé).

### Étapes d'installation

1.  **Clonez le dépôt :**
    ```bash
    git clone https://github.com/votre-repo/ego-coach.git
    cd ego-coach
    ```

2.  **Lancez un serveur de développement :**
    La manière la plus simple de lancer un serveur local est d'utiliser le module `http.server` de Python.
    ```bash
    python3 -m http.server 8000
    ```
    Si vous préférez, vous pouvez aussi utiliser `npx` :
    ```bash
    npx serve .
    ```

4. **Lancez le script `start.sh` (macOS) :**
```bash
chmod +x start.sh && ./start.sh
```
3.  **Ouvrez l'application :**
    Ouvrez votre navigateur et rendez-vous à l'adresse `http://localhost:8000`.

## 🤝 Contribuer

Les contributions sont les bienvenues ! Si vous souhaitez améliorer EgoCoach, veuillez consulter notre guide de contribution (`CONTRIBUTING.md`) pour connaître les standards de code, les procédures de test et l'architecture du projet.

## 📄 Licence

Ce projet est distribué sous la licence MIT.
