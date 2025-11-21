# Implementation Plan: Gemini Integration

**Branch**: `[plan-gemini-integration]` | **Date**: 2025-11-18 | **Spec**: `specs/constitution.md`
**Input**: Feature specification from `/specs/gemini-integration/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Brancher les appels Gemini réels pour l’analyse IA tout en sécurisant l’onboarding de la clé côté client : collecte locale (formulaire), stockage chiffré dans `localStorage`, appels fetch vers l’API Gemini avec fallback heuristique existant.

## Technical Context

**Language/Version**: JavaScript (ES2020+)  
**Primary Dependencies**: Gemini Generative Language API (REST), Tailwind CDN, Vanilla JS modules  
**Storage**: `localStorage` (clé API + journal)  
**Testing**: Manual end-to-end validation (aucune suite automatisée)  
**Target Platform**: Navigateurs modernes (Chrome ≥ 115, Edge ≥ 115)  
**Project Type**: Single Page Application (client only)  
**Performance Goals**: Réponse IA sous 2 secondes hors latence réseau, fallback instantané si échec API  
**Constraints**: Entièrement offline sans clé, ne jamais exposer la clé dans le code source, maintenir compatibilité offline  
**Scale/Scope**: Utilisateur individuel, usage intensif pendant les crises, volume journal limité (<500 entrées)

## Constitution Check

| Gate | Statut | Commentaire |
|------|--------|-------------|
| Autonomie locale | ✅ | La clé reste locale, fallback heuristique actif. |
| Validation émotionnelle | ✅ | Les scripts IA continueront d’imposer la validation initiale. |
| Langage produit | ✅ | Les réponses Gemini seront formatées selon les conventions MVP/backlog. |
| Confidentialité | ⚠️ | Risque d’exposer la clé si mal géré. Action : stockage chiffré + jamais commit. |

## Project Structure

### Documentation (this feature)

```text
specs/gemini-integration/
├── plan.md              # Ce document
├── research.md          # Phase 0 (analyse API, limites quotas)
├── data-model.md        # Phase 1 (schéma stockage clé + réponses IA)
├── quickstart.md        # Phase 1 (guide config clé Gemini)
├── contracts/           # Phase 1 (schémas d’échange API, JSON samples)
└── tasks.md             # Phase 2 (liste d’issues détaillées)
```

### Source Code (repository root)

```text
assets/
├── css/
│   └── styles.css
└── js/
    └── app.js          # Point d’intégration Gemini (modules IA, onboarding clé)

specs/
├── constitution.md
└── gemini-integration/
    └── ...             # docs de feature

resources/
└── ...                 # inchangé

index.html               # injection UI (modale capture clé)
```

**Structure Decision**: Le projet reste une SPA mono-codebase ; seul `assets/js/app.js` est modifié pour intégrer les appels Gemini et la gestion de clé. La documentation spécifique vit dans `specs/gemini-integration/`.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Stockage chiffré local | Sécuriser la clé Gemini côté client | Stockage en clair = fuite potentielle si import/export partagé |
| Module de service API | Mutualiser appels + gestion fallback | Appels inline dans le module IA complexifieraient la maintenance |
