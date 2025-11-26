# EgoCoach Phoenix 🦅

**EgoCoach Phoenix** est une application web conçue pour vous aider à analyser, comprendre et désamorcer les conflits interpersonnels. En agissant comme un "coach de poche", elle vous guide pour transformer vos réactions automatiques (Ego) en réponses conscientes et constructives.

![EgoCoach Dashboard](https://via.placeholder.com/800x400?text=EgoCoach+Phoenix+Dashboard)

## ✨ Fonctionnalités Clés

### 1. 🧠 Assistant de Résolution (Analyseur)
Un parcours guidé en 5 étapes pour décoder n'importe quelle situation conflictuelle :
- **Situation** : Décrivez les faits objectivement.
- **Diagnostic** : Évaluez le niveau de crise et identifiez les déclencheurs.
- **Décodage** : Comprenez les besoins cachés (les vôtres et ceux de l'autre).
- **Stratégie** : Recevez une recommandation de protocole (ex: SET, DEAR MAN).
- **Réponse** : Générez des scripts de réponse sur-mesure grâce à l'IA.

### 2. 📔 Journal & Tableau de Bord
- Sauvegardez vos analyses pour y revenir plus tard.
- Suivez votre progression avec des statistiques (Ego dominant, jours sans mode défensif).
- Rouvrez une ancienne analyse pour l'affiner.

### 3. 🥋 Le Dojo
- Entraînez-vous avec des scénarios réalistes.
- Identifiez les mécanismes de l'Ego (Juge, Victime, Sauveur, Défensif).
- Recevez un feedback immédiat sur vos choix de réponse.

### 4. 📚 Guide de Survie
- Une bibliothèque de concepts pour comprendre les mécanismes de l'Ego.
- Des "Antidotes" pratiques pour chaque posture défensive.

### 5. ⚙️ Paramètres Avancés
- **Mode Stockage** : Choisissez entre LocalStorage (privé, sur votre appareil) ou Supabase (Cloud, synchronisé).
- **IA Flexible** : Connectez votre propre clé API (Google Gemini, OpenAI) ou utilisez Ollama en local.
- **Thème** : Mode Clair / Sombre.

    ```

2.  **Lancer un serveur local** :
    Pour des raisons de sécurité (CORS, Modules ES6), l'application ne peut pas être ouverte directement via `file://`.

    **Avec Python :**
    ```bash
    python3 -m http.server 8000
    ```

    **Avec Node.js (npx) :**
    ```bash
    npx serve
    ```

3.  **Ouvrir l'application** :
    Rendez-vous sur `http://localhost:8000` dans votre navigateur.

## 🛠 Technologies

- **Frontend** : Vanilla JavaScript (ES6 Modules), HTML5.
- **Styling** : Tailwind CSS (via CDN).
- **Icônes** : Lucide Icons.
- **Backend (Optionnel)** : Supabase (Base de données & Auth).
- **IA** : Intégration API pour Google Gemini, OpenAI, et Ollama.

## 📂 Structure du Projet

```
ego-coach-main/
├── assets/
│   ├── css/            # Styles globaux
│   ├── js/
│   │   ├── components/ # Composants UI (Pages, Modales)
│   │   ├── core/       # Cœur de l'app (Router, Store, EventBus)
│   │   ├── data/       # Gestion des données (Repository, Adapters)
│   │   ├── modules/    # Logique métier (Analyzer, Journal, etc.)
│   │   └── services/   # Services externes (AI, Stats)
│   └── ...
├── index.html          # Point d'entrée unique
└── README.md           # Documentation
```

## 🤝 Contribuer

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une Issue ou une Pull Request.

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.
