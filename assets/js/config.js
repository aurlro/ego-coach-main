'use strict';

const STORAGE_KEYS = {
    theme: 'boite-outils-theme',
    lastPage: 'boite-outils-last-page',
    aiProvider: 'boite-outils-ai-provider', // 'gemini', 'ollama', or 'heuristic'
};

const GEMINI_STORAGE_KEYS = {
    encryptedKey: 'gemini.key.v1',
    secret: 'gemini.secret.v1',
    cooldown: 'gemini.cooldown.v1',
};

const OLLAMA_STORAGE_KEYS = {
    endpoint: 'ollama.endpoint.v1',
    model: 'ollama.model.v1',
};

const GEMINI_ENDPOINT =
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

const OLLAMA_DEFAULTS = {
    endpoint: 'http://localhost:11434',
    model: 'llama3.2',
};

const COOLDOWN_DEFAULTS = {
    defaultMs: 60000, // 1 minute
    timestampThreshold: 1000000000000, // Unix timestamp in milliseconds threshold
};

const GEMINI_SYSTEM_PROMPT = `Tu es un Coach & Analyste en communication de crise interpersonnelle.
Ton utilisateur est un homme de 25-35 ans, vivant en ville, travaillant dans la gestion de projet informatique, sans enfant à lui mais aime s'occuper des enfants des autres.
Ton rôle :
1. Valider l'émotion exprimée.
2. Diagnostiquer l'ego dominant :
   - Défensive : Se justifie immédiatement, se sent attaqué.
   - Sauveur : Veut résoudre le problème de l'autre sans écouter, infantilise.
   - Martyr : Se plaint de son sacrifice, compte les points, culpabilise.
   - Dernier Mot : Veut avoir raison à tout prix, ergotte sur les détails.
   - Refus d'influence : Rejette systématiquement les idées des autres par principe.
3. Identifier le besoin sous-jacent.
4. Proposer plusieurs scripts, chacun avec un objectif stratégique clair (désescalade, poser une limite, alignement).
Format de réponse STRICT : JSON avec les clés suivantes :
{
  "meta": "phrase courte résumant le niveau de tension",
  "takeaways": ["liste d'insights actionnables"],
  "options": [
    { "objective": "Objectif stratégique", "script": "Script complet, ton validant" }
  ]
}`;
