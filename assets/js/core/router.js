import { bus } from './eventBus.js';

/**
 * Router - Hash-based navigation
 */
export class Router {
    constructor(routes, mountPointId = 'app') {
        this.routes = routes;
        this.mountPoint = document.getElementById(mountPointId);
        this.currentComponent = null;
    }

    init() {
        window.addEventListener('hashchange', () => this.handleRoute());
        this.handleRoute(); // Initial load
    }

    async handleRoute() {
        const hash = window.location.hash.slice(1) || 'home';
        console.log(`[Router] Navigating to: ${hash}`);

        const route = this.routes[hash] || this.routes['home'];

        if (!route) {
            console.error(`No route found for hash: ${hash}`);
            return;
        }

        // Unmount current component
        if (this.currentComponent && typeof this.currentComponent.unmount === 'function') {
            this.currentComponent.unmount();
        }

        // Clear container
        if (this.mountPoint) {
            this.mountPoint.innerHTML = '';
        } else {
            console.error('Mount point not found!');
            return;
        }

        // Initialize new component
        try {
            // Dynamic import if route is a function (lazy loading) or use directly
            const componentFactory = route.component;
            this.currentComponent = await componentFactory();

            if (this.currentComponent && typeof this.currentComponent.mount === 'function') {
                await this.currentComponent.mount(this.mountPoint);
                console.log(`[Router] Mounted component for ${hash}`);
            }

            bus.emit('route:changed', hash);

            // Update active state in sidebar/menu
            this.updateActiveLinks(hash);

        } catch (error) {
            console.error(`Error mounting component for route ${hash}:`, error);
            this.mountPoint.innerHTML = `<div class="p-4 text-red-500">Error loading page: ${error.message}</div>`;
            throw error; // Re-throw to be caught by global handler
        }
    }

    updateActiveLinks(hash) {
        document.querySelectorAll('[data-link]').forEach(link => {
            const href = link.getAttribute('href');
            if (href === `#${hash}`) {
                link.classList.add('active', 'bg-blue-50', 'text-blue-600', 'dark:bg-blue-900/20', 'dark:text-blue-400');
                link.classList.remove('text-slate-600', 'dark:text-slate-400');
            } else {
                link.classList.remove('active', 'bg-blue-50', 'text-blue-600', 'dark:bg-blue-900/20', 'dark:text-blue-400');
                link.classList.add('text-slate-600', 'dark:text-slate-400');
            }
        });
    }

    navigateTo(hash) {
        window.location.hash = hash;
    }
}
