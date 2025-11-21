---

description: "Task list template for feature implementation"
---

# Tasks: Gemini Integration

**Input**: Design documents from `/specs/gemini-integration/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: No automated tests required; rely on manual validation steps outlined per user story.

**Organization**: Tasks sont groupées par user story pour permettre des validations indépendantes.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Peut s’exécuter en parallèle (fichiers distincts, pas de dépendances)
- **[Story]**: US1, US2, US3…
- Inclure les chemins exacts dans les descriptions

## Phase 1: Setup (Shared Infrastructure)

- [ ] T001 [US1] Ajouter entrée « Gemini Integration » dans `specs/gemini-integration/research.md` (analyse API, quotas, endpoints).
- [ ] T002 [US1] Documenter stockage chiffré dans `specs/gemini-integration/data-model.md`.
- [ ] T003 [US1] Mettre à jour `specs/gemini-integration/quickstart.md` avec les étapes de configuration de la clé.

## Phase 2: Foundational (Blocking Prerequisites)

- [ ] T010 [US1] Implémenter utilitaire de chiffrement symétrique dans `assets/js/app.js` (ou module dédié).
- [ ] T011 [US1] Créer service `geminiService` (gestion clé + appels API) dans `assets/js/app.js`.
- [ ] T012 [US1] Ajouter hooks UI pour ouvrir la modale de configuration clé (mettre en place squelette HTML).

**Checkpoint**: chiffrement + service API prêts → histoires implémentables.

---

## Phase 3: User Story 1 - Activer l’assistant IA avec clé locale (Priority: P1) 🎯 MVP

**Goal**: Saisie, chiffrement, stockage et gestion de la clé Gemini via l’UI.
**Independent Test**: Saisir clé, confirmer stockage chiffré, masquer/mettre à jour, supprimer.

### Implementation

- [ ] T100 [US1] Implémenter modale de configuration (`index.html` + gestion DOM dans `app.js`).
- [ ] T101 [US1] Stocker clé chiffrée dans `localStorage` via `geminiService`.
- [ ] T102 [US1] Ajouter toasts de succès/erreur lors des opérations (sauvegarde, suppression).
- [ ] T103 [US1] Empêcher export JSON (`journal`) d’inclure la clé (vérifier `journalStore`).
- [ ] T104 [US1] Documenter dans `specs/gemini-integration/quickstart.md` : comment saisir/supprimer la clé.

**Checkpoint**: Onboarding clé opérationnel, aucune fuite dans exports.

---

## Phase 4: User Story 2 - Analyser un message via l’API Gemini (Priority: P1)

**Goal**: Utiliser la clé pour appeler Gemini, afficher résultats, fallback heuristique.
**Independent Test**: Message analysé → scripts Gemini (ou heuristique si erreur).

### Implementation

- [ ] T200 [US2] Intégrer `geminiService` au module IA (remplacer heuristique principale).
- [ ] T201 [US2] Mapper la réponse Gemini vers la structure UI (insights, scripts).
- [ ] T202 [US2] Gestion des erreurs réseau (timeouts, status !== 200) avec fallback et toasts.
- [ ] T203 [US2] Logger en console les erreurs détaillées pour debug (sans clé).
- [ ] T204 [US2] Mettre à jour `specs/gemini-integration/contracts/` avec réponse JSON Gemini.

**Checkpoint**: Analyse IA délivre des résultats réels ou fallback fiable.

---

## Phase 5: User Story 3 - Gérer les quotas et erreurs Gemini (Priority: P2)

**Goal**: Feedback quotas, erreurs 401/429, cooldown local.
**Independent Test**: Simuler réponses d’erreurs et vérifier toasts/états.

### Implementation

- [ ] T300 [US3] Ajouter parsing des headers `x-ratelimit-*` et afficher une section informative.
- [ ] T301 [US3] Implémenter cooldown local après 429 (désactivation bouton + timer).
- [ ] T302 [US3] Détecter 401/403 → forcer modale clé + toast rouge.
- [ ] T303 [US3] Ajouter note de troubleshooting dans `quickstart.md`.

**Checkpoint**: L’utilisateur comprend l’état de sa clé/quotas ; erreurs gérées proprement.

---

## Phase N: Polish & Cross-Cutting Concerns

- [ ] T900 [P] Mettre à jour `specs/fonctionnel.md` + `specs/décisions.md` avec la nouvelle architecture Gemini.
- [ ] T901 Vérifier que `specs/constitution.md` reste alignée (section IA).
- [ ] T902 Audit final : confirmer absence de clé dans exports et logs.

---

## Dependencies & Execution Order

- Phases 1 & 2 obligatoires avant US1.
- US1 et US2 sont prioritaires (P1) ; US3 peut suivre en fonction du temps.
- Traitement en parallèle possible : doc (Phase 1) et code (Phase 2) par personnes différentes ; US2 dépend de US1 (service + stockage).

---

## Notes

- Les tâches marquées `[P]` peuvent être exécutées en parallèle.
- Chaque user story doit rester testable indépendamment (modale clé, analyse API, gestion quotas).
- Les tests sont manuels (documentation dans quickstart + toasts).

