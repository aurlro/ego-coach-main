'use strict';

function createAIModule({ rootId, toast, gemini, ollama, modal }) {
    const root = document.getElementById(rootId);
    if (!root) {
        console.warn(`Racine IA "${rootId}" introuvable.`);
        return { render: () => { } };
    }

    const state = {
        isLoading: false,
        lastResult: null,
    };
    let unsubscribeGemini = null;
    let eventsBound = false;

    function getAIProvider() {
        try {
            return localStorage.getItem(STORAGE_KEYS.aiProvider) || 'heuristic';
        } catch (error) {
            return 'heuristic';
        }
    }

    function setAIProvider(provider) {
        try {
            localStorage.setItem(STORAGE_KEYS.aiProvider, provider);
        } catch (error) {
            console.debug('Impossible de sauvegarder le provider IA');
        }
    }

    function ensureSubscription() {
        if (unsubscribeGemini) return;
        unsubscribeGemini = gemini.subscribe(() => {
            if (!state.isLoading) render();
        });
    }

    function render() {
        ensureSubscription();
        const currentProvider = getAIProvider();
        const geminiStatus = gemini.getKeyStatus();
        const ollamaConfig = ollama.getConfig();

        let statusInfo = '';
        let configButtons = '';

        // Construire le status selon le provider sélectionné
        if (currentProvider === 'gemini') {
            const statusBadge = geminiStatus.configured
                ? `<span class="inline-flex items-center gap-2 rounded-full bg-emerald-100 text-emerald-700 px-3 py-1 text-xs font-semibold">
                        ✓ Gemini actif${geminiStatus.hint ? ` • ****${geminiStatus.hint}` : ''}
                   </span>`
                : `<span class="inline-flex items-center gap-2 rounded-full bg-amber-100 text-amber-700 px-3 py-1 text-xs font-semibold">
                        ⚠ Gemini non configuré
                   </span>`;
            const cooldownInfo = geminiStatus.cooldown
                ? `<p class="text-xs text-amber-500">Pause jusqu'à ${formatCountdown(geminiStatus.cooldown)}</p>`
                : '';
            statusInfo = `${statusBadge}${cooldownInfo}`;
            configButtons = '<button type="button" class="secondary-button text-sm" data-action="configure-gemini">⚙️ Config Gemini</button>';
        } else if (currentProvider === 'ollama') {
            statusInfo = `<span class="inline-flex items-center gap-2 rounded-full bg-blue-100 text-blue-700 px-3 py-1 text-xs font-semibold">
                    🤖 Ollama • ${ollamaConfig.model}
               </span>
               <p class="text-xs text-slate-500">${ollamaConfig.endpoint}</p>`;
            configButtons = '<button type="button" class="secondary-button text-sm" data-action="configure-ollama">⚙️ Config Ollama</button>';
        } else {
            statusInfo = `<span class="inline-flex items-center gap-2 rounded-full bg-slate-100 text-slate-700 px-3 py-1 text-xs font-semibold">
                    📊 Analyse locale (heuristique)
               </span>
               <p class="text-xs text-slate-500">Aucune IA externe • Gratuit</p>`;
        }

        root.innerHTML = `
            <div class="space-y-6">
                <header class="space-y-3">
                    <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-100">Analyse IA</h2>
                    <p class="text-slate-600 dark:text-slate-400 text-sm">
                        Parse un message ou une situation pour obtenir des scripts prêts à l'emploi.
                    </p>

                    <div class="form-group">
                        <label for="ai-provider-select">Provider IA</label>
                        <select id="ai-provider-select" class="w-full sm:w-auto">
                            <option value="heuristic" ${currentProvider === 'heuristic' ? 'selected' : ''}>🔍 Analyse locale (gratuit)</option>
                            <option value="ollama" ${currentProvider === 'ollama' ? 'selected' : ''}>🤖 Ollama (LLM local)</option>
                            <option value="gemini" ${currentProvider === 'gemini' ? 'selected' : ''}>✨ Gemini API</option>
                        </select>
                    </div>

                    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div class="space-y-1">
                            ${statusInfo}
                        </div>
                        <div class="flex gap-2">
                            <button type="button" class="secondary-button text-sm" data-action="test-provider" title="Tester si ce provider fonctionne">
                                🧪 Tester
                            </button>
                            ${configButtons}
                        </div>
                    </div>
                </header>

                <section class="ai-panel">
                    <div class="form-group">
                        <label for="ai-input">Message ou situation</label>
                        <textarea id="ai-input" rows="6" placeholder="Ex: Mon collègue m'a dit 'Tu n'as toujours pas fini ça ?' devant toute l'équipe. J'ai senti la colère monter..."></textarea>
                    </div>

                    <div class="ai-dropzone" data-dropzone>
                        <p class="text-sm text-slate-500 dark:text-slate-400">
                            Glisse-dépose une capture (optionnel) — la fonctionnalité multimodale arrive avec l’API Gemini.
                        </p>
                        <input type="file" accept="image/*" data-file-input class="hidden" multiple>
                        <button type="button" class="journal-card-button mt-3" data-action="trigger-file">
                            📎 Ajouter des images
                        </button>
                        <div data-thumbnails class="flex gap-3 flex-wrap mt-3"></div>
                    </div>

                    <div class="flex flex-wrap gap-3">
                        <button type="button" class="primary-button" data-action="analyze">
                            <span class="analyze-label">Analyser la situation</span>
                        </button>
                        <button type="button" class="secondary-button" data-action="reset">
                            Réinitialiser
                        </button>
                    </div>
                </section>

                <section id="ai-results" class="ai-results hidden p-6"></section>
            </div>
        `;

        const textarea = root.querySelector('#ai-input');
        autoResizeTextarea(textarea);

        // 🟠 MEMORY LEAK FIX: Attach event listeners once using delegation
        if (!eventsBound) {
            // Provider selector
            root.addEventListener('change', (event) => {
                if (event.target.id === 'ai-provider-select') {
                    setAIProvider(event.target.value);
                    render();
                }
            });

            // Textarea input with delegation
            root.addEventListener('input', (event) => {
                if (event.target.id === 'ai-input') {
                    autoResizeTextarea(event.target);
                }
            });

            const dropzone = root.querySelector('[data-dropzone]');

            dropzone?.addEventListener('dragover', (event) => {
                event.preventDefault();
                dropzone.classList.add('drag');
            });
            dropzone?.addEventListener('dragleave', () => {
                dropzone.classList.remove('drag');
            });
            dropzone?.addEventListener('drop', (event) => {
                event.preventDefault();
                dropzone.classList.remove('drag');
                const files = Array.from(event.dataTransfer.files || []);
                previewFiles(files);
            });

            root.addEventListener('click', (event) => {
                const button = event.target.closest('[data-action]');
                if (!button) return;
                const action = button.getAttribute('data-action');

                switch (action) {
                    case 'trigger-file':
                        root.querySelector('[data-file-input]')?.click();
                        break;
                    case 'analyze':
                        analyze();
                        break;
                    case 'reset':
                        // 🔴 CRITICAL: Ask for confirmation if textarea has content
                        if (textarea.value.trim()) {
                            modal.open({
                                title: '⚠️ Réinitialiser l\'analyse ?',
                                body: `<p>Tu vas perdre ton message en cours.</p>
                                       <p class="mt-2 text-sm text-slate-500">Les images seront aussi supprimées.</p>`,
                                buttons: [
                                    { label: 'Annuler', variant: 'secondary', action: 'cancel' },
                                    { label: 'Réinitialiser', variant: 'danger', action: 'confirm' }
                                ]
                            }).then((result) => {
                                if (result === 'confirm') {
                                    reset();
                                    toast.info('Analyse réinitialisée.');
                                }
                            });
                        } else {
                            reset();
                        }
                        break;
                    case 'configure-gemini':
                        openGeminiModal();
                        break;
                    case 'configure-ollama':
                        openOllamaModal();
                        break;
                    case 'test-provider':
                        testProvider();
                        break;
                    default:
                        break;
                }
            });

            root.querySelector('[data-file-input]')?.addEventListener('change', (event) => {
                const files = Array.from(event.target.files || []);
                previewFiles(files);
            });

            eventsBound = true;
        }

        const thumbnails = root.querySelector('[data-thumbnails]');
        const fileInput = root.querySelector('[data-file-input]');

        function previewFiles(files) {
            if (!files.length) return;
            thumbnails.innerHTML = files
                .slice(0, 4)
                .map(
                    (file) => `
                        <span class="badge">${escapeHTML(file.name)}</span>
                    `,
                )
                .join('');
            toast.info('Images attachées (prévisualisation).');
        }

        function reset() {
            textarea.value = '';
            autoResizeTextarea(textarea);
            thumbnails.innerHTML = '';
            fileInput.value = '';
            state.lastResult = null;
            root.querySelector('#ai-results').classList.add('hidden');
            root.querySelector('#ai-results').innerHTML = '';
        }

        function analyze() {
            const text = textarea.value.trim();
            if (!text) {
                toast.error('Ajoute un message ou une description à analyser.');
                return;
            }
            if (state.isLoading) return;

            const provider = getAIProvider();
            setLoading(true);

            (async () => {
                let result;
                let errorHandled = false;

                if (provider === 'gemini') {
                    const status = gemini.getKeyStatus();
                    if (!status.configured) {
                        toast.warning('Gemini non configuré. Configure-le ou change de provider.');
                        openGeminiModal();
                        result = runLocalHeuristics(text);
                        result.source = 'heuristic';
                    } else if (status.cooldown) {
                        toast.warning(`Gemini en cooldown. Fallback local.`);
                        result = runLocalHeuristics(text);
                        result.source = 'heuristic';
                    } else {
                        toast.info('Analyse Gemini en cours...');
                        try {
                            result = await gemini.fetchAnalysis(text);
                            result.meta = result.meta || "Analyse Gemini";
                            result.source = 'gemini';
                            toast.success('Analyse Gemini générée.');
                        } catch (error) {
                            result = handleGeminiError(error, text);
                        }
                    }
                } else if (provider === 'ollama') {
                    toast.info('Analyse Ollama en cours...');
                    try {
                        result = await ollama.fetchAnalysis(text);
                        toast.success(`Analyse générée par ${result.model}`);
                    } catch (error) {
                        console.error('Ollama error:', error);
                        if (error.message.includes('Impossible de contacter Ollama')) {
                            const container = root.querySelector('#ai-results');
                            container.classList.remove('hidden');
                            container.innerHTML = `
                                <div class="alert-warning" data-testid="ollama-connection-error">
                                    <div class="flex items-start gap-3">
                                        <span class="text-xl mt-0.5">⚠️</span>
                                        <div>
                                            <p class="font-semibold">IA non disponible</p>
                                            <p class="mt-1">
                                                Impossible de se connecter au moteur d'IA local. Vérifiez qu'Ollama est bien lancé.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            `;
                            errorHandled = true;
                        } else {
                            toast.error(error.message || 'Erreur Ollama. Fallback local.');
                            result = runLocalHeuristics(text);
                            result.source = 'heuristic';
                        }
                    }
                } else {
                    // Heuristic
                    toast.info('Analyse heuristique locale...');
                    result = runLocalHeuristics(text);
                    result.source = 'heuristic';
                }

                if (!errorHandled) {
                    setResult(result, text);
                }
            })()
                .catch((error) => {
                    console.error('Analyse IA', error);
                    toast.error('Analyse impossible pour le moment.');
                })
                .finally(() => {
                    if (!errorHandled) {
                        setLoading(false);
                    }
                });
        }

        function handleGeminiError(error, promptText) {
            console.debug('Gemini error', error);
            switch (error.code) {
                case 'NO_KEY':
                    toast.info('Configure la clé Gemini pour activer l’IA.');
                    openGeminiModal();
                    break;
                case 'INVALID_KEY':
                    toast.error('Clé Gemini invalide. Mets-la à jour.');
                    openGeminiModal();
                    break;
                case 'COOLDOWN':
                case 'QUOTA': {
                    const until = error.cooldownUntil || Date.now() + COOLDOWN_DEFAULTS.defaultMs;
                    toast.warning(
                        `Quota Gemini atteint. Fallback local (${formatCountdown(until)}).`,
                    );
                    break;
                }
                case 'PARSE_ERROR':
                    toast.warning('Réponse Gemini inattendue. Utilisation de l’heuristique.');
                    break;
                case 'NETWORK':
                case 'API_ERROR':
                    toast.warning('API Gemini indisponible. Analyse locale utilisée.');
                    break;
                default:
                    toast.warning("Analyse Gemini interrompue. Fallback heuristique.");
            }
            const fallback = runLocalHeuristics(promptText);
            fallback.source = 'heuristic';
            return fallback;
        }

        async function testProvider() {
            const currentProvider = getAIProvider();
            const testButton = root.querySelector('[data-action="test-provider"]');
            if (!testButton) return;

            // Save button state
            const originalText = testButton.textContent;
            const wasDisabled = testButton.disabled;

            // Disable button and show loading state
            testButton.disabled = true;
            testButton.textContent = '⏳ Test en cours...';

            try {
                if (currentProvider === 'gemini') {
                    const status = gemini.getKeyStatus();
                    if (!status.configured) {
                        toast.error('❌ Gemini non configuré. Configure-le d\'abord.');
                        return;
                    }
                    if (status.cooldown) {
                        const until = formatCountdown(status.cooldown);
                        toast.warning(`⏸️ Gemini en cooldown jusqu'à ${until}`);
                        return;
                    }

                    // Test avec un prompt simple
                    try {
                        const testPrompt = 'Test rapide: dis moi juste "ok" si tu reçois ce message.';
                        const result = await gemini.fetchAnalysis(testPrompt);
                        toast.success('✅ Gemini fonctionne ! Prêt à l\'utiliser.');
                    } catch (error) {
                        const errorMsg = error.message || error.code || 'Erreur inconnue';
                        let userMessage = '❌ Erreur Gemini: ';

                        if (error.code === 'INVALID_KEY') {
                            userMessage += 'Clé API invalide. Vérifie ta clé dans les paramètres.';
                        } else if (error.code === 'QUOTA') {
                            userMessage += `Quota atteint. ${errorMsg}`;
                        } else if (error.code === 'NETWORK') {
                            userMessage += 'Pas de connexion Internet.';
                        } else if (error.code === 'API_ERROR') {
                            userMessage += 'L\'API Gemini ne répond pas.';
                        } else {
                            userMessage += errorMsg;
                        }
                        toast.error(userMessage);
                    }
                } else if (currentProvider === 'ollama') {
                    try {
                        const config = ollama.getConfig();
                        const testPrompt = 'Test rapide: dis moi juste "ok" si tu reçois ce message.';
                        const result = await ollama.fetchAnalysis(testPrompt);
                        toast.success(`✅ Ollama fonctionne ! Modèle: ${config.model}`);
                    } catch (error) {
                        const errorMsg = error.message || 'Erreur inconnue';
                        let userMessage = '❌ Erreur Ollama: ';

                        if (errorMsg.includes('contacter Ollama')) {
                            const config = ollama.getConfig();
                            userMessage += `Ollama ne répond pas sur ${config.endpoint}. Lance Ollama en local.`;
                        } else if (errorMsg.includes('429')) {
                            userMessage += 'Trop de requêtes. Patiente avant de relancer.';
                        } else if (errorMsg.includes('401') || errorMsg.includes('403')) {
                            userMessage += 'Authentification refusée.';
                        } else {
                            userMessage += errorMsg;
                        }
                        toast.error(userMessage);
                    }
                } else {
                    // Heuristic
                    const result = runLocalHeuristics('test');
                    toast.success('✅ Analyse locale (heuristique) fonctionne.');
                }
            } catch (error) {
                console.error('Test provider error:', error);
                toast.error('❌ Erreur lors du test du provider.');
            } finally {
                // Restore button state
                testButton.disabled = wasDisabled;
                testButton.textContent = originalText;
            }
        }

        function setResult(result, originalPrompt = '') {
            if (!result) return;
            state.lastResult = result;
            const container = root.querySelector('#ai-results');
            if (!container) return;
            container.classList.remove('hidden');

            // 🔴 QUALITY GUARD: Validate response quality
            const validation = validateResponse(result, originalPrompt);
            let validationBadge = '';

            if (!validation.valid) {
                const issues = formatValidationIssues(validation);
                validationBadge = `
                    <div class="mb-3 p-3 rounded-lg ${issues.type === 'error' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-200' :
                        issues.type === 'warning' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-200' :
                            'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-200'
                    }">
                        <div class="flex items-center gap-2 font-medium">
                            <span>${issues.icon}</span>
                            <span>${issues.message}</span>
                        </div>
                        ${issues.details ? `<ul class="text-xs mt-2 space-y-1 ml-6">
                            ${issues.details.map(d => `<li>• ${d}</li>`).join('')}
                        </ul>` : ''}
                    </div>
                `;
            }

            const safeTakeaways =
                Array.isArray(result.takeaways) && result.takeaways.length > 0
                    ? result.takeaways
                    : ['Analyse locale : reprends la validation émotionnelle avant de répondre.'];
            const safeOptions =
                Array.isArray(result.options) && result.options.length > 0
                    ? result.options
                    : [
                        {
                            objective: 'Désescalade',
                            script:
                                "Je t'entends, je veux qu'on reprenne calmement. Donne-moi 15 minutes et je reviens avec un plan clair.",
                        },
                    ];

            let title = 'Analyse locale';
            let badgeClass = 'bg-slate-200 text-slate-700 dark:bg-slate-700/80 dark:text-slate-200';
            let badgeLabel = 'Heuristique';

            if (result.source === 'gemini') {
                title = 'Analyse Gemini';
                badgeClass = 'bg-emerald-100 text-emerald-700';
                badgeLabel = 'Gemini';
            } else if (result.source === 'ollama') {
                title = `Analyse Ollama (${result.model || 'LLM'})`;
                badgeClass = 'bg-blue-100 text-blue-700';
                badgeLabel = 'Ollama';
            }
            const quotaInfo = result.quota
                ? `<div class="text-xs text-slate-500 dark:text-slate-400 flex gap-2">
                        <span>Quota restant : ${typeof result.quota.remaining === 'number'
                    ? result.quota.remaining
                    : '—'
                }/${result.quota.limit ?? '—'}</span>
                        ${result.quota.resetMs
                    ? `<span>Reset ${formatCountdown(result.quota.resetMs)
                    }</span>`
                    : ''
                }
                   </div>`
                : '';

            container.innerHTML = `
                <div class="space-y-4">
                    ${validationBadge}
                    <header class="space-y-2">
                        <div class="flex items-center gap-2">
                            <h3 class="text-lg font-semibold text-slate-800 dark:text-slate-100">${title}</h3>
                            <span class="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full ${badgeClass}">
                                ${badgeLabel}
                            </span>
                        </div>
                        <p class="text-sm text-slate-500 dark:text-slate-400">${escapeHTML(
                result.meta || '',
            )}</p>
                        ${quotaInfo}
                    </header>
                    <article class="space-y-3">
                        <h4 class="text-sm font-semibold uppercase tracking-wide text-slate-500">Insights clés</h4>
                        <ul class="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-300">
                            ${safeTakeaways
                    .map((item) => `<li>${escapeHTML(item)}</li>`)
                    .join('')}
                        </ul>
                    </article>
                    <article class="space-y-3">
                        <h4 class="text-sm font-semibold uppercase tracking-wide text-slate-500">Scripts proposés</h4>
                        <div class="space-y-3">
                            ${safeOptions
                    .map(
                        (option) => `
                                        <div class="journal-card">
                                            <div class="flex justify-between items-center mb-2">
                                                <span class="badge">${escapeHTML(
                            option.objective || 'Option',
                        )}</span>
                                                <button type="button" class="journal-card-button" data-copy-text="${escapeHTML(
                            option.script || '',
                        )}" data-toast-success="Script copié.">
                                                    📋 Copier
                                                </button>
                                            </div>
                                            <p class="text-sm text-slate-600 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                                                ${escapeHTML(option.script || '')}
                                            </p>
                                        </div>
                                    `,
                    )
                    .join('')}
                        </div>
                    </article>
                </div>
            `;
        }

        function setLoading(isLoading) {
            state.isLoading = isLoading;
            const button = root.querySelector('[data-action="analyze"]');
            if (!button) return;
            button.disabled = isLoading;
            button.classList.toggle('opacity-70', isLoading);
            const label = button.querySelector('.analyze-label');
            if (label) {
                if (isLoading) {
                    button.classList.add('flex', 'items-center', 'justify-center');
                    label.innerHTML = `
                        <i data-lucide="loader-2" class="animate-spin -ml-1 mr-3 h-5 w-5"></i>
                        Analyse en cours...
                    `;
                    refreshIcons(button);
                } else {
                    button.classList.remove('flex', 'items-center', 'justify-center');
                    label.innerHTML = 'Analyser la situation';
                }
            }
        }

        function openGeminiModal() {
            const status = gemini.getKeyStatus();
            const html = `
                <form id="gemini-config-form" class="space-y-4">
                    <div class="form-group">
                        <label for="gemini-key">Clé API Gemini</label>
                        <input type="password" id="gemini-key" name="gemini-key" class="form-input" placeholder="AIza..." autocomplete="off">
                        <p class="form-helper">
                            La clé est stockée chiffrée sur cet appareil${status.hint ? ` (actuelle : ****${status.hint})` : ''
                }.
                        </p>
                    </div>
                </form>
            `;

            const actions = [
                {
                    label: status.configured ? 'Mettre à jour' : 'Enregistrer',
                    variant: 'primary',
                    onClick: async () => {
                        const form = document.getElementById('gemini-config-form');
                        const input = form?.querySelector('#gemini-key');
                        const value = input?.value.trim();
                        if (!value) {
                            toast.error('Colle ta clé Gemini avant de valider.');
                            input?.focus();
                            return;
                        }
                        try {
                            await gemini.saveKey(value);
                            toast.success('Clé Gemini enregistrée.');
                            modal.hide('gemini-modal');
                        } catch (error) {
                            toast.error(error.message || 'Impossible de sauvegarder la clé.');
                        }
                    },
                },
            ];

            if (status.configured) {
                actions.push({
                    label: 'Supprimer la clé',
                    variant: 'secondary',
                    onClick: async () => {
                        await gemini.deleteKey();
                        toast.info('Clé Gemini supprimée.');
                        modal.hide('gemini-modal');
                    },
                });
            }

            actions.push({
                label: 'Fermer',
                onClick: () => modal.hide('gemini-modal'),
            });

            modal.show({
                targetId: 'gemini-modal',
                title: 'Configuration Gemini',
                html,
                actions,
            });
        }

        function openOllamaModal() {
            const config = ollama.getConfig();
            const html = `
                <form id="ollama-config-form" class="space-y-4">
                    <div class="form-group">
                        <label for="ollama-endpoint">Endpoint Ollama</label>
                        <input type="text" id="ollama-endpoint" name="ollama-endpoint" value="${escapeHTML(config.endpoint)}" class="form-input" placeholder="http://localhost:11434">
                        <p class="form-helper">
                            URL de ton serveur Ollama local (par défaut http://localhost:11434)
                        </p>
                    </div>
                    <div class="form-group">
                        <label for="ollama-model">Modèle</label>
                        <input type="text" id="ollama-model" name="ollama-model" value="${escapeHTML(config.model)}" class="form-input" placeholder="llama3.2">
                        <p class="form-helper">
                            Nom du modèle Ollama à utiliser (ex: llama3.2, mistral, qwen2.5:7b)
                        </p>
                    </div>
                    <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 text-sm">
                        <p class="text-blue-900 dark:text-blue-100 font-semibold mb-2">💡 Installation Ollama</p>
                        <p class="text-blue-700 dark:text-blue-300 text-xs leading-relaxed">
                            Pour installer : <code class="bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded font-mono">brew install ollama</code><br>
                            Puis lancer : <code class="bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded font-mono">ollama run llama3.2</code>
                        </p>
                    </div>
                </form>
            `;

            const actions = [
                {
                    label: 'Enregistrer',
                    variant: 'primary',
                    onClick: () => {
                        const form = document.getElementById('ollama-config-form');
                        const endpointInput = form?.querySelector('#ollama-endpoint');
                        const modelInput = form?.querySelector('#ollama-model');
                        const endpoint = endpointInput?.value.trim() || OLLAMA_DEFAULTS.endpoint;
                        const model = modelInput?.value.trim() || OLLAMA_DEFAULTS.model;

                        ollama.saveConfig(endpoint, model);
                        toast.success('Configuration Ollama sauvegardée.');
                        modal.hide('ollama-modal');
                        render();
                    },
                },
                {
                    label: 'Fermer',
                    onClick: () => modal.hide('ollama-modal'),
                },
            ];

            modal.show({
                targetId: 'ollama-modal',
                title: 'Configuration Ollama',
                html,
                actions,
            });
        }
    }

    return { render };
}
