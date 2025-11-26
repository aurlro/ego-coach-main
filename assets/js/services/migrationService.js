import { repository } from '../data/repository.js';

/**
 * Migration Service
 * Handles data migration from LocalStorage to Supabase.
 */
export const migrationService = {
    /**
     * Migrates all journal entries from LocalStorage to Supabase.
     * @param {SupabaseAdapter} adapter - The initialized Supabase adapter.
     * @returns {Promise<{success: number, failed: number, errors: Array}>}
     */
    async migrateToCloud(adapter) {
        if (!adapter || !adapter.isReady()) {
            throw new Error('Supabase adapter is not ready.');
        }

        console.log('🚀 Starting migration to cloud...');
        const localJournal = this._getLocalJournal();
        const results = {
            success: 0,
            failed: 0,
            errors: []
        };

        for (const entry of localJournal) {
            try {
                // Ensure required fields are present
                const cleanEntry = {
                    ...entry,
                    updatedAt: entry.updatedAt || new Date().toISOString()
                };

                await adapter.saveJournalEntry(cleanEntry);
                results.success++;
            } catch (error) {
                console.error(`Failed to migrate entry ${entry.id}:`, error);
                results.failed++;
                results.errors.push({ id: entry.id, error: error.message });
            }
        }

        console.log('✅ Migration complete:', results);
        return results;
    },

    /**
     * Reads journal entries directly from LocalStorage to bypass repository abstraction
     * (which might be pointing to cloud already).
     */
    _getLocalJournal() {
        try {
            const data = localStorage.getItem('journal_entries');
            return data ? JSON.parse(data) : [];
        } catch (e) {
            console.error('Error reading local journal for migration:', e);
            return [];
        }
    }
};
