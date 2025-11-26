import { bus } from './eventBus.js';

/**
 * Store - Centralized State Management
 */
export class Store {
    constructor() {
        this.state = {
            user: null,
            theme: 'light',
            journal: [],
            currentAnalysis: null,
            isLoading: false,
            notifications: []
        };
    }

    /**
     * Get current state (read-only copy)
     */
    getState() {
        return { ...this.state };
    }

    /**
     * Update state and emit change event
     * @param {Object} newState - Partial state to update
     */
    setState(newState) {
        const prevState = { ...this.state };
        this.state = { ...this.state, ...newState };

        // Emit specific changes
        Object.keys(newState).forEach(key => {
            if (prevState[key] !== this.state[key]) {
                bus.emit(`state:${key}`, this.state[key]);
            }
        });

        // Emit global change
        bus.emit('state:changed', this.state);
    }

    /**
     * Initialize store with data
     * @param {Object} initialData 
     */
    init(initialData = {}) {
        this.state = { ...this.state, ...initialData };
    }
}

export const store = new Store();
