# QA Checklist: Gemini Integration

**Purpose**: Vérifier la bonne intégration des appels Gemini, la gestion de la clé locale et le fallback heuristique.  
**Created**: 2025-11-18  
**Feature**: `specs/gemini-integration/spec.md`

## Configuration & Sécurité

- [ ] CHK001 La modale de configuration affiche un champ clé masqué, obligatoire, avec validation de format.
- [ ] CHK002 La clé est chiffrée avant stockage (`localStorage`) et jamais visible en clair dans DevTools.
- [ ] CHK003 Le bouton « Supprimer la clé » efface la clé, affiche un toast de confirmation et le fallback se réactive.
- [ ] CHK004 Export JSON du journal ne contient aucune clé ou métadonnée sensible.

## Appels API Gemini

- [ ] CHK010 L’analyse IA envoie bien une requête vers l’endpoint Gemini avec headers appropriés (`Authorization: Bearer ...`).
- [ ] CHK011 La réponse Gemini est parsée pour générer insights + scripts selon la structure UI.
- [ ] CHK012 En cas d’erreur réseau ou timeout, l’heuristique locale prend le relais et un toast info l’indique.
- [ ] CHK013 Les erreurs 401/403 déclenchent la réouverture de la modale clé et un toast rouge explicite.
- [ ] CHK014 Les erreurs 429 activent un cooldown (bouton désactivé) et affichent le délai restant.

## UX & Feedback

- [ ] CHK020 Toast succès après enregistrement de la clé ; toast info/erreur pour chaque état critique.
- [ ] CHK021 Indicateur visuel de clé active (ex : badge ou message dans l’onglet IA).
- [ ] CHK022 Le quickstart documente la configuration, la rotation de clé, et les erreurs fréquentes.
- [ ] CHK023 Console logs n’exposent jamais la clé ; seuls des messages de debug anonymes sont présents.

## Notes

- Cocher `[x]` lorsque vérifié.  
- Logguer toute anomalie et mettre à jour `specs/gemini-integration/quickstart.md` si nécessaire.
