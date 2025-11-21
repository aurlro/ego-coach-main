# Gemini Integration — Phase 0 Research

## 1. API Overview
- **Service** : Google Gemini Generative Language API (v1beta à date).  
- **Endpoint ciblé** : `POST https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent` (texte uniquement) ; future extension `gemini-pro-vision` pour multimodal.  
- **Payload** : JSON contenant `contents` (liste de messages) et éventuellement `generationConfig` (température, topP, maxOutputTokens).  
- **Réponse** : objet `GenerateContentResponse` avec `candidates[].content.parts[].text`.  
- **Auth** : Header `Authorization: Bearer <API_KEY>` + `Content-Type: application/json`. Clé côté client obtenue via console Google AI Studio.

## 2. Quotas & Limitations
- **Par défaut** : ~60 requêtes/minute, 32k tokens entrée + sortie (varie selon modèle).  
- **Headers retour** : `x-ratelimit-limit`, `x-ratelimit-remaining`, `x-ratelimit-reset`.  
- **Erreurs classiques** :  
  - `401/403` : clé invalide ou désactivée.  
  - `429` : quota atteint, inclut `Retry-After`.  
  - `503` : instabilité service → backoff exponentiel.  
- Prévoir un cooldown client pour 429 et log technique (sans clé).  

## 3. Sécurité & Stockage
- Ne jamais commit la clé.  
- Stockage local chiffré dans le navigateur (AES via `crypto.subtle` ou fallback XOR).  
- Export JSON du journal doit exclure la clé.  
- Option de purge clé + toutes les traces (clear storage).  

## 4. UX & Onboarding
- Modale dédiée (bouton « Configurer Gemini » dans Analyse IA).  
- Champ avec masque + bouton « Afficher » optionnel.  
- Toast réussite/erreur.  
- Section statut (clé active + quotas restants).  

## 5. Fallback & Résilience
- Heuristique actuelle (`runLocalHeuristics`) reste en place : utilisée si absence de clé, erreur réseau, quota.  
- Appels Gemini enveloppés dans `geminiService.fetchAnalysis()` qui renvoie la même structure que l’heuristique.  
- Journal des bascules (console) pour debug, sans traces sensibles.

## 6. Questions Ouvertes
- Chiffrement client : utiliser Web Crypto (AES-GCM) avec secret dérivé d’un salt local ?  
- Gestion multi-instances navigateur : prévoir un event `storage` pour réagir aux modifications de clé.  
- Support multimodal (images) : API `gemini-pro-vision` nécessite encodage base64 → hors scope immédiat.

## 7. Références
- [Gemini API Docs](https://ai.google.dev/gemini-api/docs)  
- [Generate Content (REST)](https://ai.google.dev/api/rest/v1beta/models/generateContent)  
- [Rate Limits & Errors](https://ai.google.dev/gemini-api/docs/rate-limit)  
- [Google AI Studio Console](https://aistudio.google.com/)
