# 🧰 Boîte à Outils de Communication

Application web pour analyser et améliorer tes communications interpersonnelles difficiles. Transforme les crises relationnelles en apprentissages actionnables avec des scripts de réponse prêts à l'emploi.

## 🚀 Démarrage rapide

### 1. Lancer l'application

**Méthode recommandée** (évite les erreurs CORS) :
```bash
./start.sh
```

Ou manuellement :
```bash
python3 -m http.server 8080
# Puis ouvre http://localhost:8080 dans ton navigateur
```

⚠️ **Ne double-clique PAS sur index.html** directement, ça ne fonctionnera pas avec Ollama à cause des restrictions CORS.

### 2. Choisir ton provider IA

L'application supporte 3 modes d'analyse :

- **🔍 Analyse locale (gratuit)** - Heuristique simple, pas d'IA externe
- **🤖 Ollama (LLM local)** - IA puissante locale, gratuit, privé ⭐ **Recommandé**
- **✨ Gemini API** - IA cloud performante, nécessite une clé API (payant)

## 🤖 Configuration Ollama (Recommandé)

Ollama te permet d'utiliser des LLMs localement **sans frais et en privé**.

### Installation

1. **Installer Ollama** :
   ```bash
   brew install ollama  # macOS
   # ou télécharge depuis https://ollama.com
   ```

2. **Télécharger un modèle** :
   ```bash
   ollama pull llama3.2  # Recommandé : bon équilibre
   # ou
   ollama pull mistral   # Excellent pour le français
   ```

3. **Lancer Ollama** :
   ```bash
   ollama serve
   # Ou simplement : ollama run llama3.2
   ```

4. **Dans l'application** :
   - Sélectionne "🤖 Ollama (LLM local)"
   - Configure si besoin (⚙️ Config Ollama)
   - C'est parti !

📖 Guide complet : [OLLAMA_GUIDE.md](OLLAMA_GUIDE.md)

## ✨ Fonctionnalités

### 📝 Analyse Manuelle
Un assistant pas-à-pas en 4 étapes pour décortiquer une situation difficile :
1. **Constat** - Capture le contexte brut
2. **Ego Radar** - Identifie l'ego dominant activé
3. **MVP de réponse** - Dessine ta réponse idéale
4. **Action & Insight** - Plan d'action et leçon clé

### 🤖 Analyse IA
Parse un message ou une situation avec l'IA de ton choix et obtiens :
- Une évaluation du niveau de tension
- Des insights actionnables
- 2-3 scripts de réponse prêts à l'emploi

### 📔 Journal
Toutes tes analyses sauvegardées localement :
- Filtre par type d'ego
- Export/Import JSON
- Historique complet

### 🏠 Dashboard
Vue d'ensemble de ton évolution :
- Nombre d'analyses
- Ego dominant identifié
- Streak sans "Défensive"
- Derniers insights

### 🧭 Guide (Playbook)
- Glossaire des 5 types d'ego
- Framework de réponse MVP
- Persona IA pour tes propres conversations

## 🔒 Confidentialité

- **Données 100% locales** : Tout est stocké dans ton navigateur (localStorage)
- **Avec Ollama** : Aucune donnée ne sort de ta machine
- **Avec Gemini** : Clé API chiffrée localement (AES-GCM)

## 🛠️ Stack technique

- **Frontend** : HTML, CSS (Tailwind CDN), JavaScript vanilla
- **Storage** : localStorage (navigateur)
- **IA** :
  - Ollama (API locale)
  - Google Gemini API (optionnel)
  - Heuristique locale (fallback)

## 📂 Structure

```
.
├── index.html              # Page principale
├── start.sh               # Script de lancement (recommandé)
├── assets/
│   ├── css/styles.css     # Styles personnalisés
│   └── js/app.js          # Application JavaScript
├── README.md              # Ce fichier
└── OLLAMA_GUIDE.md        # Guide Ollama détaillé
```

## 🐛 Dépannage

### Erreur CORS avec Ollama
➡️ **Solution** : Lance l'app via `./start.sh` au lieu d'ouvrir `index.html` directement.

### Ollama ne répond pas
```bash
# Vérifie qu'Ollama tourne
curl http://localhost:11434/api/tags

# Si pas de réponse, lance-le :
ollama serve
```

### Les modèles Ollama sont lents
➡️ Utilise un modèle plus petit :
```bash
ollama pull llama3.2:1b  # Version 1 milliard de paramètres
```

## 📜 Licence

Usage personnel libre. Pour usage commercial, contacte l'auteur.

## 🙏 Crédits

Inspiré des approches de communication bienveillante et de résolution de conflits interpersonnels.
