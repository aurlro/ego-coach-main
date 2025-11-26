/**
 * Knowledge Base Module
 * Handles storage and retrieval of documents for RAG (Retrieval-Augmented Generation).
 * Uses IndexedDB for storage and Cosine Similarity for vector search.
 */
import { aiService } from '../services/aiService.js';

export const knowledgeBase = {
    dbName: 'EgoCoachKB',
    dbVersion: 1,
    db: null,

    // Configuration
    chunkSize: 500, // characters approx
    overlap: 50,

    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.dbVersion);

            request.onerror = (event) => {
                console.error("KnowledgeBase DB error:", event.target.error);
                reject(event.target.error);
            };

            request.onsuccess = (event) => {
                this.db = event.target.result;
                console.log("KnowledgeBase DB initialized");
                resolve(this.db);
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                // Store raw documents
                if (!db.objectStoreNames.contains('documents')) {
                    db.createObjectStore('documents', { keyPath: 'id', autoIncrement: true });
                }
                // Store chunks with vectors
                if (!db.objectStoreNames.contains('chunks')) {
                    const chunkStore = db.createObjectStore('chunks', { keyPath: 'id', autoIncrement: true });
                    chunkStore.createIndex('docId', 'docId', { unique: false });
                }
            };
        });
    },

    /**
     * Add a document to the knowledge base
     * @param {string} title - Document title
     * @param {string} content - Full text content
     * @param {function} onProgress - Callback for progress updates (0-100)
     */
    async addDocument(title, content, onProgress = () => { }) {
        if (!this.db) await this.init();

        // 1. Store the full document
        const docId = await this._storeDocument(title, content);

        // 2. Chunk the content
        const chunks = this._chunkText(content);
        const totalChunks = chunks.length;

        // 3. Generate embeddings and store chunks
        for (let i = 0; i < totalChunks; i++) {
            const chunkText = chunks[i];
            try {
                // Get embedding from AI Service (Ollama)
                const embedding = await aiService.getEmbedding(chunkText);

                await this._storeChunk({
                    docId: docId,
                    text: chunkText,
                    embedding: embedding,
                    index: i
                });

                // Update progress
                const percent = Math.round(((i + 1) / totalChunks) * 100);
                onProgress(percent);

            } catch (error) {
                console.error(`Error processing chunk ${i}:`, error);
                // Continue with other chunks or throw? 
                // For now, we log and continue to try to save partial doc
            }
        }

        return docId;
    },

    /**
     * Search for relevant context
     * @param {string} query - User query
     * @param {number} limit - Max results
     */
    async search(query, limit = 3) {
        if (!this.db) await this.init();

        try {
            // 1. Vectorize query
            const queryEmbedding = await aiService.getEmbedding(query);

            // 2. Fetch all chunks (Naive approach for now - scalable enough for personal docs)
            // For larger datasets, we'd need a vector index or pre-filtering
            const allChunks = await this._getAllChunks();

            // 3. Calculate similarity
            const scoredChunks = allChunks.map(chunk => ({
                ...chunk,
                score: this._cosineSimilarity(queryEmbedding, chunk.embedding)
            }));

            // 4. Sort and slice
            scoredChunks.sort((a, b) => b.score - a.score);

            return scoredChunks.slice(0, limit);

        } catch (error) {
            console.error("Search failed:", error);
            return []; // Fallback to empty results
        }
    },

    async getDocuments() {
        if (!this.db) await this.init();
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['documents'], 'readonly');
            const store = transaction.objectStore('documents');
            const request = store.getAll();

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    },

    async deleteDocument(id) {
        if (!this.db) await this.init();
        // Delete doc and its chunks
        // Implementation omitted for brevity, but needed for full CRUD
        // TODO: Implement delete
    },

    // ============================================================
    // PRIVATE HELPERS
    // ============================================================

    _storeDocument(title, content) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['documents'], 'readwrite');
            const store = transaction.objectStore('documents');
            const request = store.add({
                title,
                content,
                dateAdded: new Date().toISOString()
            });

            request.onsuccess = (e) => resolve(e.target.result);
            request.onerror = () => reject(request.error);
        });
    },

    _storeChunk(chunkData) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['chunks'], 'readwrite');
            const store = transaction.objectStore('chunks');
            const request = store.add(chunkData);

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    },

    _getAllChunks() {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['chunks'], 'readonly');
            const store = transaction.objectStore('chunks');
            const request = store.getAll();

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    },

    _chunkText(text) {
        const chunks = [];
        let start = 0;

        while (start < text.length) {
            let end = start + this.chunkSize;

            // Try to find a sentence break near the end
            if (end < text.length) {
                const lookAhead = text.substring(end - 50, end + 50);
                const sentenceBreak = lookAhead.lastIndexOf('.');
                if (sentenceBreak !== -1) {
                    end = (end - 50) + sentenceBreak + 1;
                }
            }

            chunks.push(text.substring(start, end).trim());
            start = end - this.overlap;
        }

        return chunks;
    },

    _cosineSimilarity(vecA, vecB) {
        if (!vecA || !vecB || vecA.length !== vecB.length) return 0;

        let dotProduct = 0;
        let normA = 0;
        let normB = 0;

        for (let i = 0; i < vecA.length; i++) {
            dotProduct += vecA[i] * vecB[i];
            normA += vecA[i] * vecA[i];
            normB += vecB[i] * vecB[i];
        }

        return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
    }
};
