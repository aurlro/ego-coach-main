# Décisions & Principes

## Choix Techniques
- **Vanilla JS + Tailwind CDN** : privilégie la légèreté, zéro build et une mise en place instantanée sur n’importe quel poste.
- **Modules usines (`createXModule`)** : chaque fonctionnalité reste encapsulée, testable isolément et injectable dans la navigation centrale.
- **Système de toasts maison** : feedback unifié pour éviter `alert()` et conserver une UX moderne.

## Données & Confidentialité
- **Stockage local prioritaire** pour garantir la confidentialité des analyses sensibles.
- **Export/Import JSON** ajouté pour pallier les limites du cache navigateur et préparer la migration cloud.
- **Aucune dépendance réseau obligatoire** : l’application reste fonctionnelle hors connexion (hors chargement initial du CDN).

## IA & Coaching
- **Persona IA** inspiré des approches Gottman/Karpman/CNV, orienté langage produit (bug, MVP, backlog).
- **Analyse heuristique** actuelle : fournit des scripts cohérents sans API externe ; base pour brancher Gemini lorsque la clé est disponible.

### Prompt Système (copier-coller)
```
Vous êtes un "Coach & Analyste" en communication de crise interpersonnelle.
Votre utilisateur est un Product Owner / Business Analyst en crise personnelle.
Méthode :
1. Valider l'émotion avant tout jugement.
2. Diagnostiquer l'ego actif (Défensive, Sauveur, Martyr, Dernier Mot, Refus d'influence).
3. Identifier la user story derrière le reproche.
4. Proposer plusieurs scripts de réponse : préciser l'objectif (désescalade, poser une limite, alignement) et la logique.
Cadre : outil local "Boîte à Outils" + documents projet (rapport, backlog).
```

## UX & Accessibilité
- **Step wizard** choisi pour limiter la surcharge cognitive et guider la réflexion.
- **Badges colorés** et **toasts accessibles** assurent un repérage rapide des états (succès, alerte, info).
- **Modales** réutilisables via le `modalManager` pour éviter la duplication des composants.

## Orientations Futures Validées
- **Migration Firestore** priorisée pour la synchronisation multi-appareils.
- **Mode PWA** envisagé une fois la persistance cloud en place.
- **Intégration IA avancée** : sauvegarde des réponses générées et analyse globale du journal par lot.
