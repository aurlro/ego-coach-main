import { describe, it, expect, beforeEach } from 'vitest';
import { store } from '../../assets/js/core/store.js';
import { bus } from '../../assets/js/core/eventBus.js';

describe('Store', () => {
    beforeEach(() => {
        // Reset store state if possible, or just init with default
        store.init({ journal: [], theme: 'light' });
    });

    it('should initialize with provided data', () => {
        store.init({ journal: [{ id: 1 }], theme: 'dark' });
        const state = store.getState();
        expect(state.journal.length).toBe(1);
        expect(state.theme).toBe('dark');
    });

    it('should update state and emit events', () => {
        let eventEmitted = false;
        bus.on('state:theme', (theme) => {
            eventEmitted = true;
            expect(theme).toBe('dark');
        });

        store.setState({ theme: 'dark' });

        const state = store.getState();
        expect(state.theme).toBe('dark');
        expect(eventEmitted).toBe(true);
    });

    it('should retrieve all entries', () => {
        store.setState({ journal: [{ id: 1 }, { id: 2 }] });
        const entries = store.getState().journal;
        expect(entries.length).toBe(2);
    });
});
