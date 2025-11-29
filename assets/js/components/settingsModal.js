import { repository } from '../data/repository.js';
import { migrationService } from '../services/migrationService.js';
import { SupabaseAdapter } from '../services/supabaseAdapter.js';
import { aiService } from '../services/aiService.js';
import { statsService } from '../services/statsService.js';
import { knowledgeBase } from '../modules/knowledgeBase.js';

export class SettingsModal {
    constructor() {
        this.isVisible = false;
        this.container = null;
    }

    init() {
        this.createModal();
        this.attachListeners();
    }

    createModal() {
        const modal = document.createElement('div');
        modal.id = 'settings-modal';
        modal.className = 'fixed inset-0 z-[60] hidden';
        modal.innerHTML = `
            <div class="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity opacity-0" id="settings-backdrop"></div>
            <div class="absolute inset-0 flex items-center justify-center p-4">
                <div class="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md transform scale-95 opacity-0 transition-all duration-200 flex flex-col max-h-[90vh]" id="settings-content">
                    <div class="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center shrink-0">
                        <h2 class="text-xl font-bold text-slate-900 dark:text-white">Paramètres</h2>
                        <button id="close-settings" class="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
                            <i data-lucide="x" class="w-6 h-6"></i>
                        </button>
                    </div>
                    
                    <div class="p-6 space-y-8 overflow-y-auto custom-scrollbar">
                       <div class="space-y-6">
                        <!-- Storage Mode Section -->
                        <div class="space-y-4">
                            <h3 class="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider">
                                <i data-lucide="hard-drive" class="w-4 h-4 inline mr-1"></i>
                                Stockage
                            </h3>
                            
                            <!-- Theme Settings -->
                            <div class="mb-6 pb-6 border-b border-slate-200 dark:border-slate-700">
                                <h4 class="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
                                    <i data-lucide="moon" class="w-4 h-4"></i>
                                    Thème
                                </h4>
                                <label class="flex items-center gap-3 cursor-pointer">
                                    <input type="checkbox" id="auto-theme-toggle" class="sr-only peer">
                                    <div class="relative w-11 h-6 bg-slate-200 dark:bg-slate-700 rounded-full peer peer-checked:bg-blue-600 transition-colors">
                                        <div class="absolute top-0.5 left-0.5 bg-white w-5 h-5 rounded-full transition-transform peer-checked:translate-x-5"></div>
                                    </div>
                                    <div>
                                        <div class="text-sm font-medium text-slate-900 dark:text-white">Mode sombre automatique</div>
                                        <div class="text-xs text-slate-500">Active entre 19h et 7h</div>
                                    </div>
                                </label>
                            </div>
                            <div class="grid grid-cols-2 gap-3">
                                <label class="cursor-pointer relative">
                                    <input type="radio" name="storage_mode" value="local" class="peer sr-only">
                                    <div class="p-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 hover:border-blue-500 peer-checked:border-blue-600 peer-checked:bg-blue-50 dark:peer-checked:bg-blue-900/20 transition-all text-center">
                                        <i data-lucide="hard-drive" class="w-6 h-6 mx-auto mb-2 text-slate-500 peer-checked:text-blue-600 dark:text-slate-400 dark:peer-checked:text-blue-400"></i>
                                        <span class="block text-sm font-semibold text-slate-900 dark:text-white">Local</span>
                                        <span class="block text-xs text-slate-500 mt-1">Privé & Hors-ligne</span>
                                    </div>
                                </label>
                                <label class="cursor-pointer relative">
                                    <input type="radio" name="storage_mode" value="cloud" class="peer sr-only">
                                    <div class="p-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 hover:border-purple-500 peer-checked:border-purple-600 peer-checked:bg-purple-50 dark:peer-checked:bg-purple-900/20 transition-all text-center">
                                        <i data-lucide="cloud" class="w-6 h-6 mx-auto mb-2 text-slate-500 peer-checked:text-purple-600 dark:text-slate-400 dark:peer-checked:text-purple-400"></i>
                                        <span class="block text-sm font-semibold text-slate-900 dark:text-white">Cloud</span>
                                        <span class="block text-xs text-slate-500 mt-1">Sync & Multi-device</span>
                                    </div>
                                </label>
                            </div>
                        </div>

                        <!-- Supabase Config (Conditional) -->
                        <div id="supabase-config" class="space-y-4 hidden">
                            <div class="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                                <h4 class="text-sm font-medium text-slate-900 dark:text-white mb-3">Configuration Supabase</h4>
                                <div class="space-y-3">
                                    <div>
                                        <label for="supabase-url" class="block text-xs font-medium text-slate-500 mb-1">Project URL</label>
                                        <input type="text" id="supabase-url" class="w-full p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm" placeholder="https://xyz.supabase.co">
                                    </div>
                                    <div>
                                        <label for="supabase-key" class="block text-xs font-medium text-slate-500 mb-1">Anon Key</label>
                                        <input type="password" id="supabase-key" class="w-full p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm" placeholder="eyJhbGciOiJIUzI1Ni...">
                                    </div>
                                    <button id="save-connection" class="w-full btn-primary bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 text-sm font-medium transition-colors">
                                        Connecter & Sauvegarder
                                    </button>
                                    <div id="connection-status" class="hidden p-2 rounded text-xs text-center"></div>
                                </div>
                            </div>
                        </div>

                        <hr class="border-slate-200 dark:border-slate-800">

                        <!-- AI Configuration -->
                        <div class="space-y-4">
                            <h3 class="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider">
                                <i data-lucide="bot" class="w-4 h-4 inline mr-1"></i>
                                Intelligence Artificielle
                            </h3>
                            
                            <div>
                                <label for="ai-provider" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Fournisseur IA</label>
                                <select id="ai-provider" class="w-full p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white">
                                    <option value="ollama">Ollama (Local / Gratuit)</option>
                                    <option value="gemini">Google Gemini (Clé API)</option>
                                    <option value="openai">OpenAI GPT-4 (Clé API)</option>
                                </select>
                            </div>

                            <div id="ai-key-container" class="hidden">
                                <label for="ai-api-key" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Clé API</label>
                                <input type="password" id="ai-api-key" class="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm" placeholder="sk-...">
                                <p class="text-xs text-slate-500 mt-1">Votre clé est stockée localement dans votre navigateur.</p>
                            </div>
                            
                            <button id="save-ai-config" class="w-full py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-sm font-medium transition-colors">
                                Sauvegarder la configuration IA
                            </button>
                        </div>

                        <hr class="border-slate-200 dark:border-slate-800">

                        <!-- Service Monitoring -->
                        <div class="space-y-4">
                            <div class="flex justify-between items-center">
                                <h3 class="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider">
                                    <i data-lucide="activity" class="w-4 h-4 inline mr-1"></i>
                                    État des Services
                                </h3>
                                <button id="refresh-health" class="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium">
                                    <i data-lucide="refresh-cw" class="w-3 h-3 inline mr-1"></i>
                                    Actualiser
                                </button>
                            </div>
                            
                            <div class="grid grid-cols-1 gap-3" id="health-grid">
                                <!-- Health items injected via JS -->
                            </div>
                        </div>

                        <hr class="border-slate-200 dark:border-slate-800">

                        <!-- Knowledge Base -->
                        <div class="space-y-4">
                            <h3 class="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider">
                                <i data-lucide="brain-circuit" class="w-4 h-4 inline mr-1"></i>
                                Base de Connaissances
                            </h3>
                            
                            <div class="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                                <div class="flex gap-2 mb-4">
                                    <input type="file" id="kb-upload" accept=".txt,.md" class="hidden">
                                    <button onclick="document.getElementById('kb-upload').click()" class="flex-1 py-2 border border-dashed border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-sm transition-colors">
                                        <i data-lucide="plus" class="w-4 h-4 inline mr-1"></i>
                                        Ajouter un document
                                    </button>
                                </div>

                                <div id="kb-progress" class="hidden mb-4">
                                    <div class="flex justify-between text-xs text-slate-500 mb-1">
                                        <span>Indexation...</span>
                                        <span id="kb-percent">0%</span>
                                    </div>
                                    <div class="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5">
                                        <div id="kb-bar" class="bg-blue-600 h-1.5 rounded-full" style="width: 0%"></div>
                                    </div>
                                </div>

                                <div id="kb-list" class="space-y-2 max-h-40 overflow-y-auto custom-scrollbar">
                                    <div class="text-xs text-slate-400 text-center italic">Aucun document importé</div>
                                </div>
                            </div>
                        </div>

                        <!-- Data Migration (Only if Cloud) -->
                        <div id="migration-section" class="space-y-4 hidden">
                            <hr class="border-slate-200 dark:border-slate-800">
                            <h3 class="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider">Migration</h3>
                            <button id="migrate-data" class="w-full py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-sm font-medium transition-colors">
                                <i data-lucide="arrow-up-right" class="w-4 h-4 inline mr-2"></i>
                                Migrer Local vers Cloud
                            </button>
                            <div id="migration-status" class="mt-2 text-xs text-center hidden"></div>
                        </div>

                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        this.container = modal;

        // Load saved values
        this.loadSettings();
    }

    loadSettings() {
        // Storage Mode
        const storageMode = localStorage.getItem('storage_mode') || 'local';
        const radio = this.container.querySelector(`input[name="storage_mode"][value="${storageMode}"]`);
        if (radio) radio.checked = true;
        this.toggleSupabaseConfig(storageMode === 'cloud');

        // Supabase Config
        const savedUrl = localStorage.getItem('supabase_url');
        const savedKey = localStorage.getItem('supabase_key');
        if (savedUrl) document.getElementById('supabase-url').value = savedUrl;
        if (savedKey) document.getElementById('supabase-key').value = savedKey;

        // AI Config
        const aiProvider = localStorage.getItem('ai_provider') || 'ollama';
        const aiKey = localStorage.getItem('ai_api_key') || '';
        document.getElementById('ai-provider').value = aiProvider;
        document.getElementById('ai-api-key').value = aiKey;
        this.toggleAiKeyInput(aiProvider);

        this.checkServicesHealth();
        this.loadDocumentsList();
    }

    toggleSupabaseConfig(show) {
        const configDiv = document.getElementById('supabase-config');
        const migrationDiv = document.getElementById('migration-section');
        if (show) {
            configDiv.classList.remove('hidden');
            migrationDiv.classList.remove('hidden');
        } else {
            configDiv.classList.add('hidden');
            migrationDiv.classList.add('hidden');
        }
    }

    toggleAiKeyInput(provider) {
        const container = document.getElementById('ai-key-container');
        if (provider === 'ollama') {
            container.classList.add('hidden');
        } else {
            container.classList.remove('hidden');
        }
    }

    attachListeners() {
        const closeBtn = this.container.querySelector('#close-settings');
        const backdrop = this.container.querySelector('#settings-backdrop');
        const saveSupabaseBtn = this.container.querySelector('#save-connection');
        const saveAiBtn = this.container.querySelector('#save-ai-config');
        const migrateBtn = this.container.querySelector('#migrate-data');
        const fileInput = this.container.querySelector('#kb-upload');
        const refreshHealthBtn = this.container.querySelector('#refresh-health');
        const aiProviderSelect = document.getElementById('ai-provider');
        const storageRadios = this.container.querySelectorAll('input[name="storage_mode"]');

        const close = () => this.close();

        closeBtn.addEventListener('click', close);
        backdrop.addEventListener('click', close);

        // Storage Mode Toggle
        storageRadios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                const mode = e.target.value;
                localStorage.setItem('storage_mode', mode);
                this.toggleSupabaseConfig(mode === 'cloud');

                // Reload to apply storage changes (Repository init needs to run again)
                if (confirm('Le changement de mode de stockage nécessite un rechargement de la page. Recharger maintenant ?')) {
                    window.location.reload();
                }
            });
        });

        // AI Provider Change
        aiProviderSelect.addEventListener('change', (e) => {
            this.toggleAiKeyInput(e.target.value);
        });

        // Save AI Config
        saveAiBtn.addEventListener('click', () => {
            const provider = aiProviderSelect.value;
            const key = document.getElementById('ai-api-key').value.trim();

            localStorage.setItem('ai_provider', provider);
            localStorage.setItem('ai_api_key', key);

            // Visual feedback
            const originalText = saveAiBtn.textContent;
            saveAiBtn.textContent = 'Sauvegardé !';
            saveAiBtn.classList.add('bg-green-50', 'text-green-600', 'border-green-200');
            setTimeout(() => {
                saveAiBtn.textContent = originalText;
                saveAiBtn.classList.remove('bg-green-50', 'text-green-600', 'border-green-200');
            }, 2000);
        });

        // Auto Theme Toggle
        const autoThemeToggle = document.getElementById('auto-theme-toggle');
        const currentAutoTheme = localStorage.getItem('auto_theme') === 'true';
        autoThemeToggle.checked = currentAutoTheme;

        autoThemeToggle.addEventListener('change', (e) => {
            const enabled = e.target.checked;
            localStorage.setItem('auto_theme', enabled.toString());

            // Apply theme immediately if auto mode is on
            if (enabled) {
                const hour = new Date().getHours();
                const isDarkHours = hour >= 19 || hour < 7;
                const newTheme = isDarkHours ? 'dark' : 'light';

                store.setState({ theme: newTheme });
                localStorage.setItem('theme', newTheme);
                document.documentElement.classList.toggle('dark', newTheme === 'dark');

                // Refresh icons
                if (window.lucide) {
                    window.lucide.createIcons();
                    const darkIcon = document.getElementById('theme-toggle-dark-icon');
                    const lightIcon = document.getElementById('theme-toggle-light-icon');
                    if (newTheme === 'dark') {
                        darkIcon?.classList.add('hidden');
                        lightIcon?.classList.remove('hidden');
                    } else {
                        darkIcon?.classList.remove('hidden');
                        lightIcon?.classList.add('hidden');
                    }
                }
            }
        });

        // Save Supabase Config
        saveSupabaseBtn.addEventListener('click', async () => {
            const url = document.getElementById('supabase-url').value.trim();
            const key = document.getElementById('supabase-key').value.trim();

            if (!url || !key) {
                this.showStatus('Veuillez remplir tous les champs.', 'error');
                return;
            }

            saveSupabaseBtn.disabled = true;
            saveSupabaseBtn.innerHTML = '<i data-lucide="loader" class="animate-spin w-4 h-4 inline"></i> Connexion...';

            try {
                const adapter = new SupabaseAdapter(url, key);
                await adapter.getJournal(); // Ping

                localStorage.setItem('supabase_url', url);
                localStorage.setItem('supabase_key', key);

                this.showStatus('Connexion réussie ! Rechargement...', 'success');
                setTimeout(() => window.location.reload(), 1000);

            } catch (error) {
                console.error(error);
                this.showStatus('Échec de la connexion.', 'error');
                saveSupabaseBtn.disabled = false;
                saveSupabaseBtn.textContent = 'Connecter & Sauvegarder';
            }
        });

        refreshHealthBtn.addEventListener('click', () => {
            const icon = refreshHealthBtn.querySelector('i');
            icon.classList.add('animate-spin');
            this.checkServicesHealth().finally(() => {
                setTimeout(() => icon.classList.remove('animate-spin'), 500);
            });
        });

        // Knowledge Base Upload
        fileInput.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const progressDiv = document.getElementById('kb-progress');
            const progressBar = document.getElementById('kb-bar');
            const progressPercent = document.getElementById('kb-percent');

            progressDiv.classList.remove('hidden');
            progressBar.style.width = '0%';
            progressPercent.textContent = '0%';

            try {
                const text = await file.text();
                await knowledgeBase.addDocument(file.name, text, (percent) => {
                    progressBar.style.width = `${percent}%`;
                    progressPercent.textContent = `${percent}%`;
                });
                this.loadDocumentsList();
            } catch (error) {
                console.error(error);
                alert('Erreur lors de l\'indexation');
            } finally {
                setTimeout(() => {
                    progressDiv.classList.add('hidden');
                    fileInput.value = '';
                }, 2000);
            }
        });

        // Migration
        migrateBtn.addEventListener('click', async () => {
            const url = localStorage.getItem('supabase_url');
            const key = localStorage.getItem('supabase_key');
            if (!url || !key) return;

            migrateBtn.disabled = true;
            migrateBtn.innerHTML = '<i data-lucide="loader" class="animate-spin w-4 h-4 inline"></i> Migration...';
            const statusDiv = document.getElementById('migration-status');
            statusDiv.classList.remove('hidden');
            statusDiv.textContent = 'Envoi des données...';

            try {
                const adapter = new SupabaseAdapter(url, key);
                const result = await migrationService.migrateToCloud(adapter);
                statusDiv.className = 'mt-2 text-xs text-center text-green-600';
                statusDiv.textContent = `Succès: ${result.success}, Échecs: ${result.failed}`;
                setTimeout(() => {
                    migrateBtn.disabled = false;
                    migrateBtn.innerHTML = '<i data-lucide="check" class="w-4 h-4 inline mr-2"></i> Terminé';
                }, 2000);
            } catch (error) {
                statusDiv.className = 'mt-2 text-xs text-center text-red-600';
                statusDiv.textContent = 'Erreur de migration';
                migrateBtn.disabled = false;
                migrateBtn.textContent = 'Réessayer';
            }
        });
    }

    async loadDocumentsList() {
        const listEl = document.getElementById('kb-list');
        if (!listEl) return;
        try {
            const docs = await knowledgeBase.getDocuments();
            if (docs.length === 0) {
                listEl.innerHTML = '<div class="text-xs text-slate-400 text-center italic">Aucun document importé</div>';
                return;
            }
            listEl.innerHTML = docs.map(doc => `
                <div class="flex items-center justify-between p-2 bg-slate-100 dark:bg-slate-700/50 rounded text-sm">
                    <div class="flex items-center overflow-hidden">
                        <i data-lucide="file-text" class="w-3 h-3 text-slate-400 mr-2 shrink-0"></i>
                        <span class="truncate text-slate-700 dark:text-slate-300">${doc.title}</span>
                    </div>
                    <span class="text-xs text-slate-400 ml-2">${new Date(doc.dateAdded).toLocaleDateString()}</span>
                </div>
            `).join('');
            if (window.lucide) window.lucide.createIcons({ root: listEl });
        } catch (e) {
            console.error("Failed to load documents", e);
        }
    }

    async checkServicesHealth() {
        const grid = document.getElementById('health-grid');
        if (!grid) return;

        const url = localStorage.getItem('supabase_url');
        const key = localStorage.getItem('supabase_key');
        const supabaseAdapter = new SupabaseAdapter(url, key);

        const services = [
            { name: 'IA (Ollama)', check: () => aiService.checkHealth().then(s => s.ollama) },
            { name: 'Base de Données', check: () => repository.useCloud ? supabaseAdapter.checkHealth() : Promise.resolve({ status: 'online', message: 'Local Storage' }) },
            { name: 'Statistiques', check: () => Promise.resolve(statsService.checkHealth()) }
        ];

        grid.innerHTML = '';
        for (const service of services) {
            const item = document.createElement('div');
            item.className = 'flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700';
            item.innerHTML = `
                <span class="text-sm font-medium text-slate-700 dark:text-slate-300">${service.name}</span>
                <span class="text-xs text-slate-500 flex items-center"><i data-lucide="loader" class="w-3 h-3 animate-spin mr-1"></i> ...</span>
            `;
            grid.appendChild(item);

            try {
                const status = await service.check();
                const isOnline = status.status === 'online';
                const icon = isOnline ? 'check-circle-2' : 'alert-circle';
                const color = isOnline ? 'text-green-600' : 'text-red-500';

                item.innerHTML = `
                    <span class="text-sm font-medium text-slate-700 dark:text-slate-300">${service.name}</span>
                    <div class="flex items-center">
                        <span class="text-xs mr-2 ${color} font-medium">${status.message}</span>
                        <i data-lucide="${icon}" class="w-4 h-4 ${color}"></i>
                    </div>
                `;
            } catch (e) {
                item.innerHTML = `...Error...`;
            }
        }
        if (window.lucide) window.lucide.createIcons({ root: grid });
    }

    showStatus(message, type) {
        const el = document.getElementById('connection-status');
        el.className = `p-2 rounded text-xs text-center ${type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`;
        el.textContent = message;
        el.classList.remove('hidden');
    }

    open() {
        this.isVisible = true;
        const modal = document.getElementById('settings-modal');
        const backdrop = document.getElementById('settings-backdrop');
        const content = document.getElementById('settings-content');
        modal.classList.remove('hidden');
        void modal.offsetWidth;
        backdrop.classList.remove('opacity-0');
        content.classList.remove('scale-95', 'opacity-0');
        content.classList.add('scale-100', 'opacity-100');
        this.loadSettings();
    }

    close() {
        this.isVisible = false;
        const modal = document.getElementById('settings-modal');
        const backdrop = document.getElementById('settings-backdrop');
        const content = document.getElementById('settings-content');
        backdrop.classList.add('opacity-0');
        content.classList.remove('scale-100', 'opacity-100');
        content.classList.add('scale-95', 'opacity-0');
        setTimeout(() => modal.classList.add('hidden'), 200);
    }
}
