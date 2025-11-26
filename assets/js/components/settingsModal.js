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
                    
                    <div class="p-6 space-y-6 overflow-y-auto custom-scrollbar">
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
                                <!-- Health items will be injected here -->
                                <div class="animate-pulse flex space-x-4">
                                    <div class="flex-1 space-y-2 py-1">
                                        <div class="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <hr class="border-slate-200 dark:border-slate-800">

                        <!-- Knowledge Base (Offline) -->
                        <div class="space-y-4">
                            <h3 class="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider">
                                <i data-lucide="brain-circuit" class="w-4 h-4 inline mr-1"></i>
                                Base de Connaissances (Offline)
                            </h3>
                            
                            <div class="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                                <p class="text-sm text-slate-600 dark:text-slate-400 mb-3">
                                    Importez vos propres textes pour enrichir les réponses de l'IA, même sans internet.
                                </p>
                                
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

                                <div id="kb-list" class="space-y-2 max-h-40 overflow-y-auto">
                                    <!-- Documents will be listed here -->
                                    <div class="text-xs text-slate-400 text-center italic">Aucun document importé</div>
                                </div>
                            </div>
                        </div>

                        <hr class="border-slate-200 dark:border-slate-800">

                        <!-- Supabase Config -->
                        <div class="space-y-4">
                            <h3 class="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider">Connexion Cloud (Supabase)</h3>
                            
                            <div>
                                <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Project URL</label>
                                <input type="text" id="supabase-url" class="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm" placeholder="https://xyz.supabase.co">
                            </div>
                            
                            <div>
                                <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Anon Key</label>
                                <input type="password" id="supabase-key" class="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm" placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...">
                            </div>

                            <div class="flex gap-2">
                                <button id="save-connection" class="flex-1 btn-primary bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors">
                                    Connecter
                                </button>
                            </div>
                            
                            <div id="connection-status" class="hidden p-3 rounded-lg text-sm"></div>
                        </div>

                        <hr class="border-slate-200 dark:border-slate-800">

                        <!-- Data Management -->
                        <div class="space-y-4">
                            <h3 class="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider">Données</h3>
                            
                            <div class="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                                <p class="text-sm text-slate-600 dark:text-slate-400 mb-3">
                                    Transférez vos données locales vers le cloud pour y accéder depuis tous vos appareils.
                                </p>
                                <button id="migrate-data" class="w-full py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed" disabled>
                                    <i data-lucide="cloud-upload" class="w-4 h-4 inline mr-2"></i>
                                    Migrer vers le Cloud
                                </button>
                                <div id="migration-status" class="mt-2 text-xs text-center hidden"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        this.container = modal;

        // Load saved values
        const savedUrl = localStorage.getItem('supabase_url');
        const savedKey = localStorage.getItem('supabase_key');
        if (savedUrl) document.getElementById('supabase-url').value = savedUrl;
        if (savedKey) document.getElementById('supabase-key').value = savedKey;

        this.checkConnectionState();
        this.loadDocumentsList();
        this.checkServicesHealth();
    }

    attachListeners() {
        const closeBtn = this.container.querySelector('#close-settings');
        const backdrop = this.container.querySelector('#settings-backdrop');
        const saveBtn = this.container.querySelector('#save-connection');
        const migrateBtn = this.container.querySelector('#migrate-data');
        const fileInput = this.container.querySelector('#kb-upload');
        const refreshHealthBtn = this.container.querySelector('#refresh-health');

        const close = () => this.close();

        closeBtn.addEventListener('click', close);
        backdrop.addEventListener('click', close);

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

                this.showStatus('Document ajouté et indexé !', 'success');
                this.loadDocumentsList();

            } catch (error) {
                console.error(error);
                this.showStatus('Erreur lors de l\'indexation (Ollama est-il lancé ?)', 'error');
            } finally {
                setTimeout(() => {
                    progressDiv.classList.add('hidden');
                    fileInput.value = ''; // Reset
                }, 2000);
            }
        });

        saveBtn.addEventListener('click', async () => {
            const url = document.getElementById('supabase-url').value.trim();
            const key = document.getElementById('supabase-key').value.trim();

            if (!url || !key) {
                this.showStatus('Veuillez remplir tous les champs.', 'error');
                return;
            }

            saveBtn.disabled = true;
            saveBtn.innerHTML = '<i data-lucide="loader" class="animate-spin w-4 h-4 inline"></i> Connexion...';

            try {
                // Test connection
                const adapter = new SupabaseAdapter(url, key);
                // Simple ping check (try to list 1 item)
                await adapter.getJournal();

                // Save credentials
                localStorage.setItem('supabase_url', url);
                localStorage.setItem('supabase_key', key);

                // Update repository
                // We need a way to update the repo config dynamically
                // For now, we can reload the page or expose a reconfigure method
                // Let's try to update the config object if possible, or just reload for simplicity

                this.showStatus('Connexion réussie ! Rechargement...', 'success');
                setTimeout(() => window.location.reload(), 1000);

            } catch (error) {
                console.error(error);
                this.showStatus('Échec de la connexion. Vérifiez vos identifiants.', 'error');
                saveBtn.disabled = false;
                saveBtn.textContent = 'Connecter';
            }
        });

        migrateBtn.addEventListener('click', async () => {
            const url = localStorage.getItem('supabase_url');
            const key = localStorage.getItem('supabase_key');

            if (!url || !key) return;

            migrateBtn.disabled = true;
            migrateBtn.innerHTML = '<i data-lucide="loader" class="animate-spin w-4 h-4 inline"></i> Migration...';
            const statusDiv = document.getElementById('migration-status');
            statusDiv.classList.remove('hidden');
            statusDiv.className = 'mt-2 text-xs text-center text-blue-600';
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
                migrateBtn.textContent = 'Réessayer la migration';
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

            // Re-render icons if needed (lucide)
            if (window.lucide) window.lucide.createIcons();

        } catch (e) {
            console.error("Failed to load documents", e);
        }
    }

    checkConnectionState() {
        const url = localStorage.getItem('supabase_url');
        const key = localStorage.getItem('supabase_key');
        const migrateBtn = document.getElementById('migrate-data');

        if (url && key) {
            migrateBtn.disabled = false;
        } else {
            migrateBtn.disabled = true;
        }
    }

    showStatus(message, type) {
        const el = document.getElementById('connection-status');
        el.classList.remove('hidden', 'bg-green-100', 'text-green-700', 'bg-red-100', 'text-red-700');

        if (type === 'success') {
            el.classList.add('bg-green-100', 'text-green-700');
        } else {
            el.classList.add('bg-red-100', 'text-red-700');
        }

        el.textContent = message;
        el.classList.remove('hidden');
    }

    open() {
        this.isVisible = true;
        const modal = document.getElementById('settings-modal');
        const backdrop = document.getElementById('settings-backdrop');
        const content = document.getElementById('settings-content');

        modal.classList.remove('hidden');
        // Trigger reflow
        void modal.offsetWidth;

        backdrop.classList.remove('opacity-0');
        content.classList.remove('scale-95', 'opacity-0');
        content.classList.add('scale-100', 'opacity-100');

        // Refresh list on open
        this.loadDocumentsList();
    }

    close() {
        this.isVisible = false;
        const modal = document.getElementById('settings-modal');
        const backdrop = document.getElementById('settings-backdrop');
        const content = document.getElementById('settings-content');

        backdrop.classList.add('opacity-0');
        content.classList.remove('scale-100', 'opacity-100');
        content.classList.add('scale-95', 'opacity-0');

        setTimeout(() => {
            modal.classList.add('hidden');
        }, 200);
    }
    async checkServicesHealth() {
        const grid = document.getElementById('health-grid');
        if (!grid) return;

        // Get Supabase credentials for the check
        const url = localStorage.getItem('supabase_url');
        const key = localStorage.getItem('supabase_key');
        const supabaseAdapter = new SupabaseAdapter(url, key);

        const services = [
            { name: 'IA (Ollama)', check: () => aiService.checkHealth().then(s => s.ollama) },
            { name: 'Base de Données', check: () => supabaseAdapter.checkHealth() },
            { name: 'Statistiques', check: () => Promise.resolve(statsService.checkHealth()) }
        ];

        grid.innerHTML = '';

        for (const service of services) {
            const item = document.createElement('div');
            item.className = 'flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700';

            // Loading state
            item.innerHTML = `
                <span class="text-sm font-medium text-slate-700 dark:text-slate-300">${service.name}</span>
                <span class="text-xs text-slate-500 flex items-center">
                    <i data-lucide="loader" class="w-3 h-3 animate-spin mr-1"></i> Vérification...
                </span>
            `;
            grid.appendChild(item);

            try {
                const status = await service.check();
                const isOnline = status.status === 'online';
                const colorClass = isOnline ? 'text-green-600 bg-green-50 dark:bg-green-900/20' : 'text-red-600 bg-red-50 dark:bg-red-900/20';
                const icon = isOnline ? 'check-circle-2' : 'alert-circle';

                item.innerHTML = `
                    <span class="text-sm font-medium text-slate-700 dark:text-slate-300">${service.name}</span>
                    <div class="flex items-center">
                        <span class="text-xs mr-2 ${isOnline ? 'text-green-600' : 'text-red-500'} font-medium">
                            ${status.message}
                        </span>
                        <i data-lucide="${icon}" class="w-4 h-4 ${isOnline ? 'text-green-500' : 'text-red-500'}"></i>
                    </div>
                `;
            } catch (e) {
                item.innerHTML = `
                    <span class="text-sm font-medium text-slate-700 dark:text-slate-300">${service.name}</span>
                    <div class="flex items-center">
                        <span class="text-xs mr-2 text-red-500 font-medium">Erreur</span>
                        <i data-lucide="x-circle" class="w-4 h-4 text-red-500"></i>
                    </div>
                `;
            }
        }

        if (window.lucide) window.lucide.createIcons();
    }
}
