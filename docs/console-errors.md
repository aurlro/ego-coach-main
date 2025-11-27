# Console Errors - Documentation Externe

## Erreurs Hors de Notre Contrôle

Cette documentation explique certaines erreurs qui apparaissent dans la console du navigateur mais qui sont **hors du contrôle de l'application Ego Coach**.

### 1. Erreur `content.js`

```
Uncaught (in promise) TypeError: Cannot read properties of undefined (reading 'checkoutUrls')
    at Ys (content.js:2:2336325)
```

**Source** : Extension de navigateur (probablement une extension de shopping comme Honey, Rakuten, Capital One Shopping, etc.)

**Impact** : Aucun sur l'application Ego Coach

**Action** : Aucune action requise. Ces erreurs proviennent d'extensions tierces installées dans votre navigateur et n'affectent pas le fonctionnement de l'application.

**Solution (optionnelle)** : Si cela dérange, vous pouvez :
- Désactiver temporairement les extensions lors de l'utilisation de l'app
- Ouvrir l'app en navigation privée (où les extensions sont généralement désactivées)

---

### 2. Permissions-Policy Warning

```
Error with Permissions-Policy header: Unrecognized feature: 'browsing-topics'.
```

**Source** : Headers HTTP envoyés par des services tiers (publicités, analytics, CDN, etc.)

**Impact** : Aucun sur l'application

**Explication** : 
- La feature `browsing-topics` fait partie de la Privacy Sandbox de Google (remplaçant des cookies tiers)
- Certains navigateurs ne reconnaissent pas encore cette feature
- L'avertissement apparaît quand un service tiers (comme les CDN utilisés pour Tailwind, Lucide, Supabase) envoie ce header

**Action** : Aucune action requise. C'est un avertissement bénin qui n'affecte pas la sécurité ou le fonctionnement de l'application.

---

### 3. Preload Warning - rokt-icons.woff (RÉSOLU)

```
The resource https://apps.rokt.com/icons/rokt-icons.woff was preloaded using link preload but not used
```

**Source** : Ancienne référence à des icônes tierces (potentiellement liée à une extension ou un ancien code)

**Status** : ✅ Résolu - Les références ont été nettoyées de `index.html`

---

## Erreurs Liées à l'Architecture de l'Application

### Ollama - Erreurs CORS et 404

Les erreurs suivantes sont **normales** selon le contexte d'utilisation :

```
Access to fetch at 'http://localhost:11434/api/tags' from origin 'https://ego-coach.aurelien-rodier.fr' 
has been blocked by CORS policy

POST http://localhost:11434/api/embeddings 404 (Not Found)
POST http://localhost:11434/api/generate 404 (Not Found)
```

**Explication** :
- Ollama est un service **local** qui tourne sur `localhost:11434`
- Lorsque l'application est hébergée sur un domaine distant (https://ego-coach.aurelien-rodier.fr), le navigateur **bloque** les requêtes vers localhost pour des raisons de sécurité (CORS)
- C'est une limitation inhérente à l'architecture web pour protéger les utilisateurs

**Solutions** :
1. **Utiliser l'application en local** : `http://localhost:8000`
2. **Utiliser un autre provider IA** : Gemini ou OpenAI (voir Paramètres)
3. **Lancer Ollama avec CORS** : `OLLAMA_ORIGINS=* ollama serve` (non recommandé en production)

**Améliorations apportées** :
- ✅ Messages d'erreur explicites dans l'interface
- ✅ Détection automatique du contexte (local vs distant)
- ✅ Suggestions claires pour l'utilisateur

---

## Résumé

| Erreur | Source | Impact | Status |
|--------|--------|--------|--------|
| content.js | Extension navigateur | Aucun | Externe |
| Permissions-Policy | Services tiers (CDN) | Aucun | Externe |
| rokt-icons.woff | Ancien preload | Aucun | ✅ Résolu |
| Ollama CORS | Architecture web | Attendu (app distante) | ✅ Documenté |
| Favicon 404 | Ressource manquante | Visuel mineur | ✅ Résolu |
| Inter fonts 404 | Configuration | Visuel mineur | ✅ Résolu (CDN) |
| Tailwind CDN warning | Dev vs Prod | Aucun | ✅ Supprimé |
