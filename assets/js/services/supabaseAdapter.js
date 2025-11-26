/**
 * Supabase Adapter
 * Handles communication with Supabase for data persistence.
 */
export class SupabaseAdapter {
    constructor(url, key) {
        this.client = null;
        if (url && key && window.supabase) {
            this.client = window.supabase.createClient(url, key);
        } else {
            console.warn('Supabase credentials missing or client not loaded. Falling back to local mode.');
        }
    }

    isReady() {
        return !!this.client;
    }

    async getJournal() {
        if (!this.isReady()) return [];
        const { data, error } = await this.client
            .from('journal_entries')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Supabase error:', error);
            throw error;
        }
        return data || [];
    }

    async saveJournalEntry(entry) {
        if (!this.isReady()) return null;

        // Map camelCase to snake_case if needed, or assume table matches
        const dbEntry = {
            id: entry.id,
            content: entry.content,
            mood: entry.mood,
            tags: entry.tags,
            created_at: entry.createdAt,
            updated_at: entry.updatedAt
        };

        const { data, error } = await this.client
            .from('journal_entries')
            .upsert(dbEntry)
            .select()
            .single();

        if (error) {
            console.error('Supabase save error:', error);
            throw error;
        }
        return data;
    }

    async deleteJournalEntry(id) {
        if (!this.isReady()) return false;
        const { error } = await this.client
            .from('journal_entries')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Supabase delete error:', error);
            throw error;
        }
        return true;
    }
    async checkHealth() {
        if (!this.isReady()) {
            return { status: 'offline', message: 'Non configuré' };
        }

        try {
            // Lightweight check: just get the count of entries (head request)
            const { count, error } = await this.client
                .from('journal_entries')
                .select('*', { count: 'exact', head: true });

            if (error) throw error;

            return { status: 'online', message: 'Connecté' };
        } catch (e) {
            return { status: 'error', message: e.message || 'Erreur de connexion' };
        }
    }
}
