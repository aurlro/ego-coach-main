export function createToastManager(rootId = 'toast-root') {
    const root = document.getElementById(rootId);
    if (!root) {
        console.warn(`Toast root "${rootId}" introuvable.`);
        return {
            show: (message) => console.log('Toast:', message),
            success: (message) => console.log('Toast success:', message),
            error: (message) => console.error('Toast error:', message),
            info: (message) => console.info('Toast info:', message),
            warning: (message) => console.warn('Toast warning:', message),
        };
    }

    const DEFAULT_DURATION = 3200;
    const toasts = new Set();

    function show(message, options = {}) {
        const { type = 'info', duration = DEFAULT_DURATION } = options;
        const toastElement = document.createElement('div');
        toastElement.className = `toast toast-${type}`;

        const iconSpan = document.createElement('span');
        iconSpan.className = 'toast-icon';
        iconSpan.textContent = resolveIcon(type);

        const messageSpan = document.createElement('span');
        messageSpan.className = 'toast-message';
        messageSpan.textContent = message;

        const closeButton = document.createElement('button');
        closeButton.className = 'toast-close';
        closeButton.type = 'button';
        closeButton.setAttribute('aria-label', 'Fermer la notification');
        closeButton.innerHTML = '&times;';

        toastElement.append(iconSpan, messageSpan, closeButton);
        root.appendChild(toastElement);

        requestAnimationFrame(() => {
            toastElement.classList.add('show');
        });

        const hide = () => {
            if (toasts.has(toastElement)) {
                toastElement.classList.add('hide');
                setTimeout(() => {
                    root.removeChild(toastElement);
                    toasts.delete(toastElement);
                }, 220);
            }
        };

        closeButton.addEventListener('click', hide);
        toasts.add(toastElement);

        if (duration !== Infinity) {
            setTimeout(hide, duration);
        }

        return hide;
    }

    function resolveIcon(type) {
        switch (type) {
            case 'success':
                return '✅';
            case 'error':
                return '⚠️';
            case 'warning':
                return '⚡';
            default:
                return '💬';
        }
    }

    return {
        show,
        success: (message, options = {}) => show(message, { ...options, type: 'success' }),
        error: (message, options = {}) => show(message, { ...options, type: 'error' }),
        info: (message, options = {}) => show(message, { ...options, type: 'info' }),
        warning: (message, options = {}) => show(message, { ...options, type: 'warning' }),
    };
}

export function createModalManager() {
    const active = new Map();

    document.addEventListener('click', (event) => {
        if (event.target.matches('[data-modal-backdrop]')) {
            const modalId = event.target.getAttribute('data-modal-target');
            if (modalId) hide(modalId);
        }
        if (event.target.matches('[data-modal-close]')) {
            const modalId = event.target.getAttribute('data-modal-target');
            if (modalId) hide(modalId);
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            const [last] = Array.from(active.keys()).slice(-1);
            if (last) hide(last);
        }
    });

    function show({ targetId = 'journal-modal', title = '', html = '', actions = [] }) {
        const root = document.getElementById(targetId);
        if (!root) {
            console.warn(`Modal "${targetId}" introuvable.`);
            return;
        }

        const actionButtons = actions
            .map(
                (action, index) => `
                    <button type="button"
                        class="${action.variant === 'primary' ? 'btn btn-primary btn-md' : 'btn btn-secondary btn-md'}"
                        data-modal-action="${index}"
                        data-modal-target="${targetId}"
                    >
                        ${action.label}
                    </button>
                `,
            )
            .join('');

        root.innerHTML = `
            <div class="modal-backdrop" data-modal-backdrop data-modal-target="${targetId}"></div>
            <div class="modal-panel" role="dialog" aria-modal="true" aria-labelledby="${targetId}-title">
                <div class="flex justify-between items-start gap-4 mb-4">
                    <h3 id="${targetId}-title" class="text-xl font-semibold text-slate-800 dark:text-slate-100">${title}</h3>
                    <button type="button" class="toast-close text-2xl leading-none" data-modal-close data-modal-target="${targetId}">×</button>
                </div>
                <div class="space-y-4 text-sm text-slate-700 dark:text-slate-300">${html}</div>
                ${actions.length > 0
                ? `<div class="flex justify-end gap-3 mt-6">${actionButtons}</div>`
                : ''
            }
            </div>
        `;
        root.classList.remove('hidden');
        active.set(targetId, { root, actions });

        root.querySelectorAll('[data-modal-action]').forEach((button) => {
            const actionIndex = Number.parseInt(
                button.getAttribute('data-modal-action'),
                10,
            );
            const config = actions[actionIndex];
            if (!config) return;
            button.addEventListener('click', () => {
                config.onClick?.();
            });
        });
    }

    function hide(targetId = 'journal-modal') {
        const entry = active.get(targetId);
        if (!entry) return;
        entry.root.classList.add('hidden');
        entry.root.innerHTML = '';
        active.delete(targetId);
    }

    return { show, hide };
}

export const toast = createToastManager();
