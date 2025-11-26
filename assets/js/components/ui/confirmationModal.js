/**
 * Confirmation Modal Component
 * Replaces native window.confirm with a styled modal.
 */
export function showConfirmationModal({ title, message, confirmText = 'Confirmer', cancelText = 'Annuler', onConfirm, onCancel }) {
    // Create modal container
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal-backdrop flex items-center justify-center';

    // Modal HTML
    modalOverlay.innerHTML = `
        <div class="modal-panel bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-xl rounded-xl p-6 max-w-md w-full mx-4 relative">
            <div class="flex items-center gap-3 mb-4 text-slate-900 dark:text-white">
                <div class="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400">
                    <i data-lucide="alert-triangle" class="w-5 h-5"></i>
                </div>
                <h3 class="text-lg font-bold">${title}</h3>
            </div>
            
            <p class="text-slate-600 dark:text-slate-300 mb-6">
                ${message}
            </p>
            
            <div class="flex justify-end gap-3">
                <button id="modal-cancel-btn" class="px-4 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors font-medium text-sm">
                    ${cancelText}
                </button>
                <button id="modal-confirm-btn" class="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors font-medium text-sm shadow-sm">
                    ${confirmText}
                </button>
            </div>
        </div>
    `;

    // Append to body
    document.body.appendChild(modalOverlay);

    // Initialize icons
    if (window.lucide) lucide.createIcons({ root: modalOverlay });

    // Event Handlers
    const close = () => {
        modalOverlay.remove();
    };

    const handleConfirm = () => {
        if (onConfirm) onConfirm();
        close();
    };

    const handleCancel = () => {
        if (onCancel) onCancel();
        close();
    };

    modalOverlay.querySelector('#modal-confirm-btn').addEventListener('click', handleConfirm);
    modalOverlay.querySelector('#modal-cancel-btn').addEventListener('click', handleCancel);

    // Close on click outside
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) handleCancel();
    });

    // Close on Escape
    const handleEsc = (e) => {
        if (e.key === 'Escape') {
            handleCancel();
            document.removeEventListener('keydown', handleEsc);
        }
    };
    document.addEventListener('keydown', handleEsc);
}
