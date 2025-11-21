# Quickstart — Activer l’analyse Gemini

## Prérequis
1. Navigateur moderne (Chrome/Edge ≥ 115).  
2. Compte Google AI Studio avec clé API Gemini (modèle `gemini-pro`).  
3. Application ouverte via `index.html` (Live Server ou `python3 -m http.server 8000`).

## 1. Récupérer la clé Gemini
1. Aller sur <https://aistudio.google.com/> → `Get API Key`.  
2. Choisir le projet et copier la clé (format `AIza...`).  
3. Ne pas partager cette clé ; elle est liée à votre quota personnel.

## 2. Configurer la clé dans l’application
1. Ouvrir l’onglet `Analyse IA`.  
2. Cliquer sur `Configurer Gemini` (bouton en haut du panneau).  
3. Coller la clé dans le champ prévu, vérifier qu’elle est masquée.  
4. Valider : un toast vert confirme l’enregistrement.  
   - Les 4 derniers caractères sont montrés en indice (ex: `****9X2B`).  
5. Pour supprimer la clé, retourner dans la modale et cliquer `Supprimer`.

## 3. Lancer une analyse IA
1. Saisir le message ou la situation dans le textarea.  
2. (Optionnel) Ajouter des images — elles seront stockées pour une future intégration vision.  
3. Cliquer `Analyser la situation`.  
   - Toast bleu = requête en cours ; annulez si besoin.  
   - Résultats affichés : `Insights` + `Scripts`.  
4. Copier un script via l’icône clipboard : toast succès attendu.

## 4. Comprendre les retours API
- **Succès** : message `Analyse Gemini` + quotas restants affichés.  
- **Erreur 401/403** : clé invalide → la modale se ré-ouvre pour mise à jour.  
- **Erreur 429** : quota dépassé → cooldown (durée basée sur header `Retry-After`).  
- **Erreur réseau** : fallback heuristique activé, toast orange `Analyse locale`.

## 5. Fallback & Réinitialisation
- Sans clé, ou en cas d’erreur, l’heuristique locale continue de fournir des scripts.  
- Pour revenir à zéro : `Configurer Gemini` → `Supprimer la clé`.  
- Débogage : consulter la console (F12) — aucune clé n’est loggée.

## 6. Bonnes pratiques
- Régénérer la clé en cas de fuite ou de quotas épuisés de manière suspecte.  
- Documenter vos tests (`specs/gemini-integration/checklist.md`).  
- Mettre à jour les sections pertinentes dans `specs/fonctionnel.md` et `specs/décisions.md` après déploiement.
