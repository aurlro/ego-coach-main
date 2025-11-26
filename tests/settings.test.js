
// Mock localStorage
const localStorageMock = (() => {
    let store = {};
    return {
        getItem: (key) => store[key] || null,
        setItem: (key, value) => store[key] = value.toString(),
        clear: () => store = {}
    };
})();
global.localStorage = localStorageMock;

// Mock SupabaseAdapter
class MockSupabaseAdapter {
    constructor(url, key) {
        this.url = url;
        this.key = key;
    }
    isReady() { return true; }
}

// Mock Config
const SUPABASE = { URL: 'https://mock.supabase.co', ANON_KEY: 'mock-key' };

// Import modules (we need to mock imports or use a test runner, but for simple node script we can just copy relevant logic or try to import if they are pure JS)
// Since they use ES modules and imports, running this directly in node might be tricky without package.json "type": "module".
// The project has "type": "commonjs" in package.json? No, let's check.
// package.json says "type": "commonjs". But the files use "export".
// So I can't run them directly in Node without transpilation or changing extension to .mjs.
// I will create a .mjs file.

import { repository } from '../assets/js/data/repository.js';
import { aiService } from '../assets/js/services/aiService.js';

// Mock dependencies
// This is hard because repository imports SupabaseAdapter.
// I'll try to run a simple test by mocking the modules if possible, or just rely on code review since I can't easily run the full app environment here.

// Actually, I can use the existing test runner 'vitest' if I create a test file.
// The project has 'vitest'.
// I'll create `tests/settings.test.js`.

import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('Settings Logic', () => {
    beforeEach(() => {
        localStorage.clear();
        vi.resetModules();
        repository.useCloud = false;
        repository.adapter = null;
    });

    it('Repository should default to local mode', async () => {
        // We need to mock SupabaseAdapter to avoid real network calls
        vi.mock('../assets/js/services/supabaseAdapter.js', () => ({
            SupabaseAdapter: class {
                constructor() { }
                isReady() { return true; }
            }
        }));

        await repository.init();
        expect(repository.useCloud).toBe(false);
    });

    it('Repository should use cloud if storage_mode is cloud and keys exist', async () => {
        localStorage.setItem('storage_mode', 'cloud');
        localStorage.setItem('supabase_url', 'https://example.com');
        localStorage.setItem('supabase_key', 'key');

        await repository.init();
        expect(repository.useCloud).toBe(true);
    });

    it('Repository should use local if storage_mode is local even if keys exist', async () => {
        localStorage.setItem('storage_mode', 'local');
        localStorage.setItem('supabase_url', 'https://example.com');
        localStorage.setItem('supabase_key', 'key');

        await repository.init();
        expect(repository.useCloud).toBe(false);
    });
});
