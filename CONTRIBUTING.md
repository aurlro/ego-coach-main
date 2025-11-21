# Guide de Contribution à EgoCoach

Nous sommes ravis que vous souhaitiez contribuer à EgoCoach ! Ce guide a pour but de vous fournir toutes les informations nécessaires pour que votre contribution se déroule de la meilleure manière possible.

##  Philosophie du Projet

-   **Léger et Accessible** : Le projet utilise du JavaScript "vanilla" et Tailwind CSS (via CDN) pour éviter toute complexité liée au build. L'objectif est qu'un développeur puisse cloner le dépôt et lancer l'application en moins d'une minute.
-   **Modularité** : Chaque fonctionnalité majeure est encapsulée dans son propre module (ex: `createJournalModule`), en suivant un modèle de fabrique (`factory pattern`). Cela garantit que le code reste organisé, testable et facile à maintenir.
-   **Confidentialité d'Abord** : L'application fonctionne entièrement côté client, en utilisant `localStorage` pour la persistance des données. Aucune information sensible n'est envoyée sur un serveur.

## 🏗️ Structure du Projet

-   `index.html`: Le point d'entrée de l'application. Il charge les scripts et les styles.
-   `assets/js/app.js`: Le cœur de l'application, où tous les modules sont initialisés et orchestrés.
-   `assets/js/data-store.js`: Une couche d'abstraction qui gère la lecture et l'écriture des données. C'est le seul endroit à modifier si l'on souhaite changer le système de stockage (ex: passer de `localStorage` à une base de données).
-   `assets/css/styles.css`: Contient les styles personnalisés qui étendent les classes utilitaires de Tailwind CSS.
-   `docs/`: Contient la documentation détaillée du produit, le changelog et les archives.

## ✍️ Conventions de Style

-   **JavaScript** : Utilisez la norme ES2020+ en mode strict. Privilégiez `const` et `let`, et assurez-vous que vos modules ne dépendent pas de variables globales (injectez les dépendances).
-   **CSS** : Respectez la palette de couleurs de Tailwind déjà en place. Groupez les classes CSS par composant et évitez les sélecteurs trop imbriqués.
-   **HTML** : Utilisez les `data-*` attributs (ex: `data-action`, `data-navigate`) pour lier les éléments du DOM à des actions JavaScript.

## ✅ Qualité et Tests

Avant de soumettre une contribution, veuillez vous assurer de respecter les standards de qualité suivants.

### Tests Manuels

Puisqu'il n'y a pas encore de suite de tests automatisés, les tests manuels sont cruciaux. Veuillez suivre ces scénarios :

1.  **Scénario de Crise** : Vérifiez que le bouton "Pause d’urgence" fonctionne et que la modale s'affiche correctement.
2.  **Scénario du Journal** : Complétez une analyse, sauvegardez-la, et assurez-vous qu'elle apparaît bien dans le journal, même après avoir rechargé la page.
3.  **Scénario de l'IA** : Assurez-vous que le mode de simulation de l'IA se déclenche correctement et fournit une réponse heuristique.

### Check-list de Non-Régression

-   [ ] **Persistance des Données** : Le `localStorage` n'est pas corrompu.
-   [ ] **Thème Sombre** : L'interface est fonctionnelle et lisible en mode clair et sombre.
-   [ ] **Responsive Design** : L'application s'affiche correctement sur mobile.
-   [ ] **Console Propre** : Aucune erreur ne s'affiche dans la console du navigateur.

## 🚀 Soumettre une Contribution

1.  **Forkez le dépôt** et créez une nouvelle branche pour votre fonctionnalité ou votre correctif.
2.  **Développez** votre contribution en respectant les conventions de style et de qualité.
3.  **Mettez à jour la documentation** si nécessaire (en particulier `docs/PRODUCT_SPECIFICATION.md` et `docs/CHANGELOG.md`).
4.  **Ouvrez une Pull Request** en fournissant les informations suivantes :
    -   Un résumé clair des changements.
    -   Les étapes de validation manuelle que vous avez suivies.
    -   Des captures d'écran ou des GIFs pour les changements d'interface.

Nous examinerons votre proposition dans les meilleurs délais. Merci de contribuer à rendre EgoCoach encore meilleur !
