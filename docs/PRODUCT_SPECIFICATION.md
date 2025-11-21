# Spécifications Produit Complètes d'EgoCoach

Ce document sert de source de vérité unique pour la vision, les fonctionnalités, l'architecture et la roadmap du projet EgoCoach.

## 1. Mission & Vision

-   **Mission** : Transformer les conflits interpersonnels en opportunités d'alignement en fournissant un processus d'analyse guidé, rapide et entièrement local.
-   **Problème Ciblé** : Aider les professionnels (Product Owners, Business Analysts) à dépasser les réactions défensives face à des reproches liés à "l'ego" en comprenant les schémas émotionnels sous-jacents.
-   **Vision** : Un copilote de communication qui transforme un incident en un backlog actionnable, grâce à une pause immédiate, une analyse structurée, des perspectives IA et un suivi des progrès.

## 2. Principes Directeurs

1.  **Valider avant d'agir** : La communication doit toujours commencer par la reconnaissance de l'émotion de l'autre.
2.  **Parler le Langage Produit** : Utiliser un vocabulaire familier (bugs, user stories, MVP) pour rester dans un cadre analytique.
3.  **Autonomie et Confidentialité** : L'outil doit fonctionner hors ligne, sans serveur, avec des sauvegardes exportables.
4.  **Clarté et Action** : Chaque écran doit fournir des options ou des aperçus concrets et exploitables.
5.  **Modularité Technique** : Une architecture simple en JavaScript "vanilla" pour permettre des itérations rapides.

## 3. Vocabulaire du Projet

-   **Bugs de communication** : Problèmes relationnels.
-   **User stories** : Besoins cachés derrière les reproches.
-   **MVP (Minimum Viable Product)** : La première réponse minimale et validée à une situation.
-   **Ego Radar** : Une typologie des réactions instinctives (Défensive, Sauveur, Martyr, etc.).

## 4. Fonctionnalités (Scope V1)

-   **Analyseur Manuel** : Un wizard en 4 étapes pour guider la réflexion (Constat → Ego Radar → Réponse MVP → Plan d’action).
-   **Journal de Bord** : Historique des analyses, triées par date, avec des filtres par type d'ego et des actions rapides (voir, copier, supprimer).
-   **Import/Export JSON** : Pour la sauvegarde et la portabilité des données du journal.
-   **Tableau de Bord** : Métriques clés (ego le plus fréquent, jours sans réaction défensive) et aperçus des dernières analyses.
-   **Analyse IA (Mode Heuristique)** : Un moteur local qui détecte la tension et génère des scripts de réponse sans nécessiter de clé API.
-   **Guide Rapide** : Un glossaire de l'Ego Radar et un rappel du framework de réponse MVP.

## 5. Architecture Technique

-   **Approche** : Application web statique (Single-Page Application) sans build.
-   **Technologies** : JavaScript "vanilla" (ES2020+), Tailwind CSS via CDN.
-   **Structure du Code** :
    -   Modules encapsulés suivant un modèle de fabrique (`createXModule`) dans `assets/js/app.js`.
    -   Gestion des données centralisée dans `assets/js/data-store.js` (utilisant `localStorage`).
-   **Dépendances** : Aucune, à l'exception du chargement initial de Tailwind CSS et de Google Fonts.

## 6. Roadmap Future (Post-V1)

1.  **Sécurité de l'API Gemini** : Mettre en place un système de gestion sécurisé pour la clé API de l'utilisateur.
2.  **Intégration de Gemini** : Activer les appels réels à l'API Gemini pour une analyse IA avancée.
3.  **Synchronisation Cloud** : Migrer le stockage vers une solution comme Firestore pour permettre une utilisation sur plusieurs appareils.
4.  **Améliorations de l'UX** : Ajouter des animations et des transitions pour une expérience plus fluide.
5.  **Visualisations de Données** : Créer des graphiques pour suivre l'évolution de la communication dans le temps.

## 7. Métriques de Succès

-   Temps moyen pour compléter une analyse : inférieur à 5 minutes.
-   Réduction mesurable des analyses marquées comme "Défensive" sur une période de 30 jours.
-   Adoption de l'IA : Utilisation des scripts générés par l'IA dans plus de 50% des analyses de messages externes.
