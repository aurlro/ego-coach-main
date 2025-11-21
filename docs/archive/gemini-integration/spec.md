# Feature Specification: Gemini Integration

**Feature Branch**: `[plan-gemini-integration]`  
**Created**: 2025-11-18  
**Status**: Draft  
**Input**: User description: "Wire real Gemini calls and API-key onboarding (hide key locally) in assets/js/app.js."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Activer l’assistant IA avec clé locale (Priority: P1)

En tant qu’utilisateur, je veux saisir ma clé Gemini dans l’app afin d’activer l’analyse IA réelle sans exposer la clé.

**Why this priority**: Sans onboarding de clé, impossible d’appeler Gemini ; blocage total de la fonctionnalité.

**Independent Test**: Lancer l’app, saisir une clé factice, vérifier que la clé est stockée localement, masquée, et que les appels utilisent la clé.

**Acceptance Scenarios**:

1. **Given** l’utilisateur ouvre l’app pour la première fois, **When** il choisit « Configurer Gemini » et colle sa clé, **Then** la clé est stockée localement de façon chiffrée et confirmée via toast.
2. **Given** une clé est déjà enregistrée, **When** l’utilisateur revient sur la modale, **Then** la clé apparaît masquée avec option de mise à jour ou suppression.

---

### User Story 2 - Analyser un message via l’API Gemini (Priority: P1)

En tant qu’utilisateur, je veux qu’un message texte soit analysé par Gemini pour obtenir insights et scripts, en conservant le fallback heuristique si l’API échoue.

**Why this priority**: Cœur de la valeur de l’intégration (remplace l’heuristique actuelle).

**Independent Test**: Saisir un message, lancer l’analyse ; confirmer que la requête part vers Gemini et que la réponse se traduit en scripts (ou fallback si erreur).

**Acceptance Scenarios**:

1. **Given** une clé valide, **When** j’analyse un message, **Then** les insights proviennent de Gemini et sont affichés dans l’UI avec toasts de succès.
2. **Given** une erreur API (quota, réseau), **When** j’analyse un message, **Then** l’heuristique locale produit la réponse et un toast info signale le fallback.

---

### User Story 3 - Gérer les quotas et erreurs Gemini (Priority: P2)

En tant qu’utilisateur, je veux être informé des quotas restants ou erreurs critiques pour ajuster ma stratégie (pause, drainer la clé).

**Why this priority**: Permet d’anticiper les interruptions et soutient la confidentialité en évitant les retries inutiles.

**Independent Test**: Simuler réponses d’erreur (429, 401) et vérifier les toasts et la désactivation temporaire.

**Acceptance Scenarios**:

1. **Given** l’API retourne 429, **When** j’analyse, **Then** l’app m’informe du quota et active un cooldown local.
2. **Given** la clé est invalide, **When** j’analyse, **Then** un toast d’erreur rouge propose de reconfigurer la clé.

---

### Edge Cases

- Que se passe-t-il si la clé est supprimée pendant une session ? → Forcer un fallback et afficher la modale de configuration.
- Comment gérer une réponse Gemini vide ou mal formatée ? → Utiliser heuristique + log console débogage.
- Clé collée avec espaces ou `gemini-` manquant ? → Validation côté client avant stockage.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Le système DOIT permettre de saisir, mettre à jour et supprimer la clé API Gemini via l’interface.
- **FR-002**: Le système DOIT chiffrer la clé avant de la stocker dans `localStorage`.
- **FR-003**: Le système DOIT appeler l’endpoint Gemini texte → texte (multimodal future) avec la clé de l’utilisateur.
- **FR-004**: Le système DOIT afficher insights et scripts retournés par Gemini dans le module IA.
- **FR-005**: Le système DOIT basculer automatiquement vers l’heuristique locale si l’appel Gemini échoue ou si aucune clé.
- **FR-006**: Le système DOIT notifier l’utilisateur en cas d’erreur 401/403 (clé invalide) et proposer la reconfiguration.
- **FR-007**: Le système DOIT respecter un cooldown configurable après une erreur 429 (quota).
- **FR-008**: Le système DOIT permettre de télécharger/supprimer la clé (export JSON ne doit **pas** inclure la clé) — NEEDS CLARIFICATION : doit-on empêcher totalement l’export ?

### Key Entities

- **APIKey**: valeur chiffrée, date d’enregistrement, statut (valide, à vérifier), éventuellement hash pour vérification.
- **GeminiResponse**: insights (`takeaways`), scripts (`options`), métadonnées (latence, tokens).
- **FallbackLog**: trace des bascules heuristiques (raison, timestamp) — optionnel pour metrics.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: L’utilisateur peut activer/désactiver Gemini en < 30 secondes sans recharger la page.
- **SC-002**: 100% des appels sans clé utilisent le fallback heuristique avec toast informatif.
- **SC-003**: 95% des réponses Gemini valides sont rendues dans l’UI en < 2 s (hors latence réseau > 1 s).
- **SC-004**: 0 fuite de clé dans les exports JSON ou logs console (audits manuels).
