import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { statsService } from '../../assets/js/services/statsService.js';

describe('statsService', () => {
    beforeEach(() => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date('2023-01-01T12:00:00Z'));
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    const mockEntries = [
        {
            id: '1',
            createdAt: '2023-01-01T10:00:00Z', // 2 hours ago
            egoFocus: 'Défensif',
            intensity: 8
        },
        {
            id: '2',
            createdAt: '2022-12-31T12:00:00Z', // Yesterday
            egoFocus: 'Narcissique',
            intensity: 5
        },
        {
            id: '3',
            createdAt: '2022-12-30T12:00:00Z', // 2 days ago
            egoFocus: 'Défensif',
            intensity: 7
        }
    ];

    it('should calculate total entries correctly', () => {
        const stats = statsService.calculateStats(mockEntries);
        expect(stats.totalEntries).toBe(3);
    });

    it('should identify the top ego type', () => {
        const stats = statsService.calculateStats(mockEntries);
        expect(stats.topEgo).toBe('Défensif');
    });

    it('should calculate days since last defensive entry correctly', () => {
        // The last defensive entry is "today" (2 hours ago)
        const stats = statsService.calculateStats(mockEntries);
        expect(stats.daysSinceDefensive).toBe(0);
    });

    it('should handle empty entries gracefully', () => {
        const stats = statsService.calculateStats([]);
        expect(stats.totalEntries).toBe(0);
        expect(stats.topEgo).toBe('Aucun');
        expect(stats.daysSinceDefensive).toBe(null);
    });
});
