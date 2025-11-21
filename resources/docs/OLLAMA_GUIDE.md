# Guide d'utilisation d'Ollama avec Boîte à Outils

## ⚠️ Important : Lancer l'application correctement

Pour éviter les erreurs CORS, **ne double-clique PAS sur index.html** !

À la place, lance l'application avec :
```bash
./start.sh
```

Ou manuellement :
```bash
python3 -m http.server 8080
# Puis ouvre http://localhost:8080 dans ton navigateur
```

## Pourquoi Ollama ?

Ollama vous permet d'utiliser des LLMs (Large Language Models) **localement sur votre machine**, sans envoyer vos données à des services externes et **sans coûts d'API**. C'est une excellente alternative à Gemini pour :

- 💰 **Économiser des tokens** - Aucun coût d'API
- 🔒 **Confidentialité** - Vos données restent sur votre machine
- ⚡ **Pas de quota** - Utilisez autant que vous voulez
- 🌐 **Hors ligne** - Fonctionne sans connexion internet

## Installation d'Ollama

### 1. Installer Ollama

**Sur macOS** :
```bash
brew install ollama
```

**Sur Linux** :
```bash
curl -fsSL https://ollama.com/install.sh | sh
```

**Sur Windows** :
Téléchargez l'installeur depuis https://ollama.com/download

### 2. Télécharger un modèle

Ollama propose plusieurs modèles. Voici les recommandations :

**Modèles recommandés** :
- `llama3.2` (7B) - Bon équilibre performance/taille
- `llama3.2:1b` - Très rapide, moins précis
- `mistral` (7B) - Excellent pour le français
- `qwen2.5:7b` - Très bon modèle général
- `gemma2:9b` - Bon pour les tâches complexes

Pour télécharger un modèle :
```bash
ollama pull llama3.2
```

### 3. Lancer Ollama

Ollama doit être en cours d'exécution pour que l'application puisse l'utiliser :

```bash
ollama serve
```

Ou lancez simplement un modèle (qui démarre automatiquement le serveur) :
```bash
ollama run llama3.2
```

## Configuration dans Boîte à Outils

1. Ouvrez l'application dans votre navigateur
2. Allez dans **Analyse IA**
3. Sélectionnez **🤖 Ollama (LLM local)** dans le menu déroulant
4. Cliquez sur **⚙️ Config Ollama**
5. Vérifiez les paramètres :
   - **Endpoint** : `http://localhost:11434` (par défaut)
   - **Modèle** : Le nom du modèle que vous avez téléchargé (ex: `llama3.2`)

## Utilisation

Une fois configuré, utilisez simplement l'interface **Analyse IA** comme d'habitude. Vos requêtes seront traitées localement par Ollama !

## Dépannage

### Erreur "Impossible de contacter Ollama"
- Assurez-vous qu'Ollama est lancé : `ollama serve`
- Vérifiez que l'endpoint est correct : `http://localhost:11434`

### Le modèle n'est pas trouvé
- Téléchargez-le : `ollama pull <nom-du-modèle>`
- Vérifiez le nom exact du modèle avec : `ollama list`

### Réponses lentes
- Utilisez un modèle plus petit (ex: `llama3.2:1b` au lieu de `llama3.2`)
- Vérifiez que votre machine a assez de RAM disponible

## Commandes utiles

```bash
# Lister les modèles installés
ollama list

# Supprimer un modèle
ollama rm <nom-du-modèle>

# Tester un modèle en ligne de commande
ollama run llama3.2 "Bonjour, comment vas-tu ?"

# Voir les logs d'Ollama
journalctl -u ollama  # Linux
# ou chercher dans Console.app sur macOS
```

## Recommandations

- Pour les **analyses rapides** : `llama3.2:1b` ou `mistral:7b-instruct`
- Pour la **meilleure qualité** : `qwen2.5:14b` ou `llama3.1:70b` (nécessite beaucoup de RAM)
- Pour le **français** : `mistral` ou `vigogne`

## Ressources

- Site officiel : https://ollama.com
- Liste des modèles : https://ollama.com/library
- Documentation : https://github.com/ollama/ollama/blob/main/docs/README.md
