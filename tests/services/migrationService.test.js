import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { migrationService } from '../../assets/js/services/migrationService.js';

describe('migrationService', () => {
    const mockAdapter = {
        isReady: vi.fn(() => true),
        saveJournalEntry: vi.fn(() => Promise.resolve())
    };

    beforeEach(() => {
        vi.clearAllMocks();
        // Mock localStorage
        const localStorageMock = (function () {
            let store = {};
            return {
                getItem: vi.fn((key) => store[key] || null),
                setItem: vi.fn((key, value) => { store[key] = value.toString(); }),
                clear: vi.fn(() => { store = {}; })
            };
        })();
        Object.defineProperty(window, 'localStorage', { value: localStorageMock });
    });

    it('should throw error if adapter is not ready', async () => {
        const notReadyAdapter = { isReady: () => false };
        await expect(migrationService.migrateToCloud(notReadyAdapter))
            .rejects.toThrow('Supabase adapter is not ready.');
    });

    it('should migrate entries successfully', async () => {
        const mockData = [
            { id: '1', content: 'Test 1' },
            { id: '2', content: 'Test 2' }
        ];
        window.localStorage.setItem('journal_entries', JSON.stringify(mockData));

        const result = await migrationService.migrateToCloud(mockAdapter);

        expect(result.success).toBe(2);
        expect(result.failed).toBe(0);
        expect(mockAdapter.saveJournalEntry).toHaveBeenCalledTimes(2);
    });

    it('should handle migration errors for individual entries', async () => {
        const mockData = [
            { id: '1', content: 'Success' },
            { id: '2', content: 'Fail' }
        ];
        window.localStorage.setItem('journal_entries', JSON.stringify(mockData));

        // Mock saveJournalEntry to fail for the second item
        mockAdapter.saveJournalEntry.mockImplementationOnce(() => Promise.resolve())
            .mockImplementationOnce(() => Promise.reject(new Error('Network error')));

        const result = await migrationService.migrateToCloud(mockAdapter);

        expect(result.success).toBe(1);
        expect(result.failed).toBe(1);
        expect(result.errors.length).toBe(1);
        expect(result.errors[0].id).toBe('2');
    });
});
