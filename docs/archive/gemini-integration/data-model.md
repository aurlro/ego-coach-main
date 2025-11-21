# Gemini Integration — Data Model

## 1. Storage Keys

| Key | Description | Structure | Notes |
|-----|-------------|-----------|-------|
| `communicationJournal` | Journal d’analyses (existante) | `Array<JournalEntry>` | inchangé |
| `boite-outils-theme` | Préférence de thème | `'light' | 'dark'` | inchangé |
| `boite-outils-last-page` | Onglet actif | `string` | inchangé |
| `gemini.key.v1` | Clé API chiffrée + méta | `EncryptedKeyPayload` | **nouveau** |
| `gemini.cooldown.v1` | Timestamp fin de cooldown quotas | `number` (epoch ms) | **nouveau** |

## 2. Types

```ts
type JournalEntry = {
  id: string;
  createdAt: string;
  context: string;
  partnerSignal: string;
  egoFocus: string;
  triggerNeed: string;
  alternativeResponse: string;
  validation: string;
  actionPlan: string;
  insight?: string;
  summary: string;
};

type EncryptedKeyPayload = {
  cipher: string;        // base64 AES-GCM cipherText
  iv: string;            // base64 initialisation vector
  createdAt: string;     // ISO timestamp
  hint?: string;         // 4 derniers chars pour affichage masque
  version: 1;            // permet migrations futures
};

type GeminiRequest = {
  contents: Array<{
    role: 'user' | 'system';
    parts: Array<{ text: string }>;
  }>;
  generationConfig?: {
    temperature?: number;
    topP?: number;
    maxOutputTokens?: number;
  };
};

type GeminiResponse = {
  meta: string; // résumé status
  takeaways: string[];
  options: Array<{
    objective: string;
    script: string;
  }>;
  quota?: {
    limit?: number;
    remaining?: number;
    resetMs?: number;
  };
  raw?: unknown; // réponse brute pour debug (non persistée)
};
```

## 3. Services

### 3.1 `geminiService`

```ts
const geminiService = {
  isConfigured(): boolean;
  getKeyStatus(): { configured: boolean; hint?: string };
  saveKey(plainKey: string): Promise<void>;
  deleteKey(): Promise<void>;
  fetchAnalysis(prompt: string, options?: AnalysisOptions): Promise<GeminiResponse>;
};
```

- **Encryption** : `saveKey` dérive une clé AES-GCM depuis un secret généré au premier usage (stocké en mémoire) et chiffre la clé API.  
- **Fallback** : `fetchAnalysis` -> si pas de clé ou erreur, renvoie `runLocalHeuristics(prompt)` avec flag `meta` = `"Fallback heuristique"`.  
- **Cooldown** : après 429, `gemini.cooldown.v1` stocke `Date.now() + retryAfterMs`. `isConfigured` disable si cooldown actif.

### 3.2 `localEncryptor`

```ts
const localEncryptor = {
  encrypt(plainText: string): Promise<EncryptedKeyPayload>;
  decrypt(payload: EncryptedKeyPayload): Promise<string>;
};
```

- Utilise `window.crypto.subtle` (AES-GCM).  
- Fallback minimal (XOR) si indisponible (navigateur legacy) + avertissement console.  

## 4. Interaction Flow

1. **Configuration clé**  
   - UI -> `geminiService.saveKey(key)` -> chiffrement -> stockage `gemini.key.v1`.
2. **Analyse IA**  
   - UI -> `geminiService.fetchAnalysis(prompt)`  
     - Vérifie cooldown (`gemini.cooldown.v1`) → si actif, renvoie erreur UX.  
     - Déchiffre la clé, construit `GeminiRequest`, effectue `fetch`.  
     - Parse réponse → `GeminiResponse`.  
     - Met à jour quotas (headers) → `quota`.  
     - Renvoyer structure standard à l’UI.
3. **Supprimer clé**  
   - UI -> `geminiService.deleteKey()` -> supprime `gemini.key.v1` & `gemini.cooldown.v1`.

## 5. Export / Import

- **Export journal** : ne doit inclure que `communicationJournal`.  
- **Import journal** : ignore `gemini.*`.  
- **Purge** : bouton « Réinitialiser IA » supprime clés + cooldown.

## 6. Logging

- `console.info` pour succès (sans clé).  
- `console.warn` pour fallback / quotas.  
- `console.error` pour erreurs API (avec status).  
- Jamais logguer la clé ni payload chiffré.
