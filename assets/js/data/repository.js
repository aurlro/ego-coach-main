/**
 * Repository - Data Access Layer
 * Abstracts LocalStorage for now, ready for Supabase later.
 */

import { SupabaseAdapter } from '../services/supabaseAdapter.js';
import { SUPABASE } from '../config.js';

const STORAGE_KEYS = {
    JOURNAL: 'journal_entries',
    THEME: 'boite-outils-theme',
    USER_PREFS: 'user_prefs'
};

export const repository = {
    adapter: null,
    useCloud: false,

    async init() {
        // Check for credentials in LocalStorage (set by SettingsModal)
        const storedUrl = localStorage.getItem('supabase_url');
        const storedKey = localStorage.getItem('supabase_key');

        // Initialize Supabase if credentials exist (either from config or storage)
        const url = storedUrl || SUPABASE.URL;
        const key = storedKey || SUPABASE.ANON_KEY;

        if (url && key && !url.includes('YOUR_SUPABASE_URL')) {
            this.adapter = new SupabaseAdapter(url, key);
            if (this.adapter.isReady()) {
                this.useCloud = true;
                console.log('☁️ Connected to Supabase');
            }
        }

        if (!this.useCloud) {
            console.log('💾 Using LocalStorage');
        }
        return true;
    },

    async getAllData() {
        return {
            journal: await this.getJournal(),
            theme: localStorage.getItem(STORAGE_KEYS.THEME) || 'light',
            userPrefs: JSON.parse(localStorage.getItem(STORAGE_KEYS.USER_PREFS) || '{}')
        };
    },

    async getJournal() {
        if (this.useCloud) {
            try {
                return await this.adapter.getJournal();
            } catch (e) {
                console.error('Cloud fetch failed, falling back to local:', e);
                // Fallback to local? Or just return empty/error?
                // For now, let's fallback to local to show something
            }
        }

        try {
            const data = localStorage.getItem(STORAGE_KEYS.JOURNAL);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            console.error('Error reading journal:', e);
            return [];
        }
    },

    async saveJournalEntry(entry) {
        const newEntry = {
            ...entry,
            id: entry.id || crypto.randomUUID(),
            createdAt: entry.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        if (this.useCloud) {
            try {
                await this.adapter.saveJournalEntry(newEntry);
            } catch (e) {
                console.error('Cloud save failed:', e);
                // Optionally save to local as backup queue
            }
        }

        // Always save to local for now as cache/backup
        const entries = this._getLocalJournal();
        entries.unshift(newEntry);
        localStorage.setItem(STORAGE_KEYS.JOURNAL, JSON.stringify(entries));

        return newEntry;
    },

    async deleteJournalEntry(id) {
        if (this.useCloud) {
            try {
                await this.adapter.deleteJournalEntry(id);
            } catch (e) {
                console.error('Cloud delete failed:', e);
            }
        }

        const entries = this._getLocalJournal();
        const filtered = entries.filter(e => e.id !== id);
        localStorage.setItem(STORAGE_KEYS.JOURNAL, JSON.stringify(filtered));
        return true;
    },

    async updateJournalEntry(id, updates) {
        // Update local first for optimistic UI
        const entries = this._getLocalJournal();
        const index = entries.findIndex(e => e.id === id);
        if (index === -1) throw new Error('Entry not found');

        const updatedEntry = { ...entries[index], ...updates, updatedAt: new Date().toISOString() };
        entries[index] = updatedEntry;
        localStorage.setItem(STORAGE_KEYS.JOURNAL, JSON.stringify(entries));

        if (this.useCloud) {
            try {
                await this.adapter.saveJournalEntry(updatedEntry);
            } catch (e) {
                console.error('Cloud update failed:', e);
            }
        }

        return updatedEntry;
    },

    _getLocalJournal() {
        try {
            const data = localStorage.getItem(STORAGE_KEYS.JOURNAL);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            return [];
        }
    }
};
