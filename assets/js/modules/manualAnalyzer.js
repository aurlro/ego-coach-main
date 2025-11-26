import { autoResizeTextarea } from '../utils.js';

export function createManualAnalyzer({ rootId, store, toast, onSaved }) {
    const root = document.getElementById(rootId);
    if (!root) {
        console.warn(`Racine manuelle "${rootId}" introuvable.`);
        return { render: () => { } };
    }

    const egoOptions = [
        "La Défensive",
        "Le Sauveur",
        "Le Martyr",
        "Le Dernier Mot",
        "Le Refus d'influence",
    ];

    const steps = [
        {
            id: 'context',
            title: '1. Constat',
            description: 'Capture le contexte brut avant de le re-écrire ou le juger.',
            fields: [
                {
                    name: 'context',
                    label: 'Qu’est-ce qui s’est passé ?',
                    type: 'textarea',
                    placeholder:
                        "Décris la scène telle qu'elle s'est déroulée, sans interprétation.",
                    required: true,
                },
                {
                    name: 'partnerSignal',
                    label: 'Quel a été le signal / trigger de ton partenaire ?',
                    type: 'textarea',
                    placeholder:
                        'Phrase, regard, ton de voix, silence... Note ce qui t’a percuté.',
                    required: true,
                },
            ],
        },
        {
            id: 'ego',
            title: '2. Ego Radar',
            description:
                "Identifie l'ego dominant pour pouvoir le désamorcer lors de la prochaine itération.",
            fields: [
                {
                    name: 'egoFocus',
                    label: "Quel type d'ego s'est activé ?",
                    type: 'select',
                    options: egoOptions,
                    required: true,
                },
                {
                    name: 'triggerNeed',
                    label: 'Quel besoin personnel n’a pas été nourri ?',
                    type: 'textarea',
                    placeholder:
                        'Reconnaissance, soutien, sécurité, clarté... note-le en mode backlog.',
                    required: true,
                },
            ],
        },
        {
            id: 'response',
            title: '3. MVP de réponse',
            description:
                'Dessine la réponse que tu aurais aimé livrer, validation comprise.',
            fields: [
                {
                    name: 'alternativeResponse',
                    label: 'Quelle réponse MVP veux-tu tester ?',
                    type: 'textarea',
                    placeholder:
                        'Rédige la réponse idéale (ton, structure, validation, plan).',
                    required: true,
                },
                {
                    name: 'validation',
                    label: 'Comment valider sa frustration en une phrase ?',
                    type: 'textarea',
                    placeholder:
                        "Ex: “Je comprends que tu... et c'est logique que ça te...”",
                    required: true,
                },
            ],
        },
        {
            id: 'action',
            title: '4. Action & Insight',
            description: 'Programme la suite et capture l’enseignement clé.',
            fields: [
                {
                    name: 'actionPlan',
                    label: 'Quel est ton plan d’action concret ?',
                    type: 'textarea',
                    placeholder:
                        'Roadmap courte : message à envoyer, rituel à planifier, limite à poser...',
                    required: true,
                },
                {
                    name: 'insight',
                    label: 'Insight clé à retenir pour la prochaine fois ?',
                    type: 'textarea',
                    placeholder:
                        'Le bug racine, l’alerte à surveiller, la ressource qui t’a aidé...',
                    required: false,
                },
            ],
        },
    ];

    const state = {
        stepIndex: 0,
        values: {
            context: '',
            partnerSignal: '',
            egoFocus: '',
            triggerNeed: '',
            alternativeResponse: '',
            validation: '',
            actionPlan: '',
            insight: '',
        },
    };

    let delegatedListenerAttached = false;

    function attachDelegatedListeners() {
        // 🟠 MEMORY LEAK FIX: Attach event listeners once, use event delegation
        if (delegatedListenerAttached) return;
        delegatedListenerAttached = true;

        // Delegate form input changes
        root.addEventListener('input', (event) => {
            const target = event.target;
            if (!target.name) return;
            state.values[target.name] = target.value;

            // Auto-resize textareas on input
            if (target.tagName === 'TEXTAREA') {
                autoResizeTextarea(target);
            }
        });

        // Delegate button clicks using event.target.dataset.action
        root.addEventListener('click', (event) => {
            const button = event.target.closest('button[data-action]');
            if (!button) return;

            const action = button.getAttribute('data-action');
            switch (action) {
                case 'prev':
                    if (state.stepIndex > 0) {
                        state.stepIndex -= 1;
                        render();
                    }
                    break;
                case 'next':
                    if (!validateCurrentStep()) return;
                    if (state.stepIndex < steps.length - 1) {
                        state.stepIndex += 1;
                        render();
                    }
                    break;
                case 'save':
                    if (!validateAllSteps()) return;
                    saveEntry();
                    break;
            }
        });
    }

    function render() {
        const currentStep = steps[state.stepIndex];
        if (!currentStep) return;

        root.innerHTML = `
            <div class="space-y-8">
                <header class="space-y-2">
                    <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-100">Analyse Manuelle</h2>
                    <p class="text-slate-600 dark:text-slate-400">
                        Transforme ta dernière crise en métrique actionnable. 4 étapes, zero juge, 100% introspection produit.
                    </p>
                </header>

                <div class="stepper">
                    ${steps
                .map((step, index) => {
                    const isActive = index === state.stepIndex;
                    return `
                                <div class="stepper-item ${isActive ? 'active' : ''}">
                                    <span class="stepper-index">${index + 1}</span>
                                    <div class="font-semibold">${step.title}</div>
                                    <p class="text-sm text-slate-500 dark:text-slate-400">${step.description}</p>
                                </div>
                            `;
                })
                .join('')}
                </div>

                <form id="manual-form" class="space-y-6">
                    ${currentStep.fields
                .map((field) => renderField(field, state.values[field.name] || ''))
                .join('')}
                </form>

                <div class="wizard-actions">
                    <button type="button" class="secondary-button" data-action="prev" ${state.stepIndex === 0 ? 'disabled' : ''}>
                        ← Retour
                    </button>
                    <div class="flex gap-3">
                        ${state.stepIndex < steps.length - 1
                ? `<button type="button" class="primary-button" data-action="next">
                                        Étape suivante →
                                   </button>`
                : `<button type="button" class="primary-button" data-action="save">
                                        Sauvegarder l'analyse
                                   </button>`
            }
                    </div>
                </div>
            </div>
        `;

        // Initial textarea auto-resize
        root.querySelectorAll('textarea').forEach((textarea) => {
            autoResizeTextarea(textarea);
        });

        attachDelegatedListeners();
    }

    function renderField(field, value) {
        if (field.type === 'select') {
            return `
                <div class="form-group">
                    <label for="${field.name}">${field.label}${field.required ? ' *' : ''}</label>
                    <select id="${field.name}" name="${field.name}">
                        <option value="">Sélectionne une option</option>
                        ${field.options
                    .map(
                        (option) =>
                            `<option value="${option}" ${option === value ? 'selected' : ''
                            }>${option}</option>`,
                    )
                    .join('')}
                    </select>
                    ${field.helper
                    ? `<p class="helper-text">${field.helper}</p>`
                    : ''
                }
                </div>
            `;
        }

        return `
            <div class="form-group">
                <label for="${field.name}">${field.label}${field.required ? ' *' : ''}</label>
                <textarea id="${field.name}" name="${field.name}" placeholder="${field.placeholder || ''}">${value || ''}</textarea>
                ${field.helper
                ? `<p class="helper-text">${field.helper}</p>`
                : ''
            }
            </div>
        `;
    }

    function validateCurrentStep() {
        const currentStep = steps[state.stepIndex];
        let hasError = false;
        const form = root.querySelector('#manual-form');

        // Clear all previous errors
        form.querySelectorAll('.error-message').forEach(el => el.remove());
        form.querySelectorAll('.border-red-500').forEach(el => {
            el.classList.remove('border-red-500', 'ring-1', 'ring-red-500');
        });

        // Check fields and add errors
        currentStep.fields.forEach(field => {
            if (field.required && !state.values[field.name]?.trim()) {
                hasError = true;
                const inputEl = form.querySelector(`[name="${field.name}"]`);
                if (inputEl) {
                    inputEl.classList.add('border-red-500', 'ring-1', 'ring-red-500');
                    const errorEl = document.createElement('p');
                    errorEl.className = 'text-xs text-red-500 mt-1 error-message';
                    errorEl.textContent = "Ce champ est requis pour l'analyse.";
                    inputEl.insertAdjacentElement('afterend', errorEl);
                }
            }
        });

        if (hasError) {
            toast.error('Complète les champs en rouge avant de continuer.');
            return false;
        }

        return true;
    }

    function validateAllSteps() {
        const missing = steps.flatMap((step) =>
            step.fields.filter(
                (field) => field.required && !state.values[field.name]?.trim(),
            ),
        );
        if (missing.length > 0) {
            toast.error('Remplis les champs critiques avant de sauvegarder.');
            return false;
        }
        return true;
    }

    function saveEntry() {
        const now = new Date();
        const entry = {
            id: crypto.randomUUID ? crypto.randomUUID() : `entry-${now.getTime()}`,
            createdAt: now.toISOString(),
            ...state.values,
            summary: buildSummary(state.values),
        };

        const result = store.saveEntry(entry);
        if (result.success) {
            toast.success('Analyse sauvegardée dans ton journal.');
            resetState();
            render();
            onSaved?.(entry);
        } else {
            toast.error(result.message || 'Sauvegarde impossible.');
        }
    }

    function resetState() {
        state.stepIndex = 0;
        Object.keys(state.values).forEach((key) => {
            state.values[key] = '';
        });
    }

    function buildSummary(values) {
        return [
            `Contexte : ${values.context}`,
            `Signal perçu : ${values.partnerSignal}`,
            `Ego activé : ${values.egoFocus}`,
            `Besoin associé : ${values.triggerNeed}`,
            `Réponse MVP : ${values.alternativeResponse}`,
            `Validation : ${values.validation}`,
            `Plan d'action : ${values.actionPlan}`,
            values.insight ? `Insight : ${values.insight}` : null,
        ]
            .filter(Boolean)
            .join('\n\n');
    }

    return { render };
}
