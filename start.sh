#!/bin/bash

# Script de lancement de la Boîte à Outils de Communication
# Ce script lance un serveur web local pour éviter les problèmes de CORS

echo "🚀 Lancement de la Boîte à Outils de Communication..."
echo ""

# Vérifier si Ollama est lancé
if ! curl -s http://localhost:11434/api/tags > /dev/null 2>&1; then
    echo "⚠️  Ollama n'est pas lancé."
    echo "   Pour utiliser Ollama, exécute dans un autre terminal :"
    echo "   ollama serve"
    echo ""
fi

# Trouver un port disponible
PORT=8080
while lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null 2>&1 ; do
    PORT=$((PORT+1))
done

echo "📡 Serveur web lancé sur : http://localhost:$PORT"
echo ""
echo "✨ L'application va s'ouvrir dans ton navigateur..."
echo ""
echo "Pour arrêter le serveur : Ctrl+C"
echo ""

# Lancer le serveur en arrière-plan et ouvrir le navigateur
python3 -m http.server $PORT > /dev/null 2>&1 &
SERVER_PID=$!

# Attendre un peu que le serveur démarre
sleep 1

# Ouvrir dans le navigateur
open "http://localhost:$PORT"

# Attendre que l'utilisateur appuie sur Ctrl+C
trap "echo ''; echo '👋 Arrêt du serveur...'; kill $SERVER_PID 2>/dev/null; exit 0" INT

# Garder le script actif
wait $SERVER_PID
