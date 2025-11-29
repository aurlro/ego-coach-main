import { repository } from '../../data/repository.js';
import { SupabaseAdapter } from '../../services/supabaseAdapter.js';
import { knowledgeBase } from '../../modules/knowledgeBase.js';

export class OnboardingModal {
    constructor(onComplete) {
        this.onComplete = onComplete;
        this.currentStep = 0;
        this.totalSteps = 5;
        this.container = null;
    }

    init() {
        this.createModal();
        this.showStep(0);
    }

    createModal() {
        const modal = document.createElement('div');
        modal.id = 'onboarding-modal';
        modal.className = 'fixed inset-0 z-[70] flex items-center justify-center p-4';
        modal.innerHTML = `
            <div class="absolute inset-0 bg-slate-900/80 backdrop-blur-sm"></div>
            <div class="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
                
                <!-- Header with Progress -->
                <div class="p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                    <div class="flex justify-between items-center mb-4">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
                                <i data-lucide="sparkles" class="w-6 h-6"></i>
                            </div>
                            <div>
                                <h2 class="text-xl font-bold text-slate-900 dark:text-white">Bienvenue sur EgoCoach</h2>
                                <p class="text-xs text-slate-500 font-medium uppercase tracking-wider">Configuration Initiale</p>
                            </div>
                        </div>
                        <div class="text-sm font-medium text-slate-400">
                            Étape <span id="step-indicator">1</span>/${this.totalSteps}
                        </div>
                    </div>
                    
                    <!-- Progress Bar -->
                    <div class="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5">
                        <div id="progress-bar" class="bg-blue-600 h-1.5 rounded-full transition-all duration-500 ease-out" style="width: 25%"></div>
                    </div>
                </div>

                <!-- Content Area -->
                <div class="p-8 overflow-y-auto custom-scrollbar flex-1" id="onboarding-content">
                    <!-- Steps will be injected here -->
                </div>

                <!-- Footer Actions -->
                <div class="p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex justify-between items-center">
                    <button id="prev-btn" class="px-6 py-2.5 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 font-medium transition-colors opacity-0 pointer-events-none">
                        Retour
                    </button>
                    <button id="next-btn" class="px-8 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 font-medium shadow-lg shadow-blue-600/20 transition-all transform hover:scale-105 flex items-center gap-2">
                        Suivant <i data-lucide="arrow-right" class="w-4 h-4"></i>
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        this.container = modal;

        // Event Listeners
        this.container.querySelector('#next-btn').addEventListener('click', () => this.nextStep());
        this.container.querySelector('#prev-btn').addEventListener('click', () => this.prevStep());
    }

    getStepContent(stepIndex) {
        switch (stepIndex) {
            case 0:
                return `
                    <div class="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                        <div class="text-center space-y-4 mb-8">
                            <h3 class="text-2xl font-bold text-slate-900 dark:text-white">Pourquoi ce projet ?</h3>
                            <p class="text-slate-600 dark:text-slate-300 leading-relaxed max-w-lg mx-auto">
                                EgoCoach est né d'un besoin personnel : transformer les réactions émotionnelles en réponses constructives.
                            </p>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div class="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50">
                                <div class="w-10 h-10 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400 mb-3">
                                    <i data-lucide="shield" class="w-5 h-5"></i>
                                </div>
                                <h4 class="font-semibold text-slate-900 dark:text-white mb-1">100% Privé</h4>
                                <p class="text-xs text-slate-600 dark:text-slate-400">Vos données restent sur votre machine. Rien ne part dans le cloud sans votre accord.</p>
                            </div>
                            <div class="p-4 rounded-xl bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800/50">
                                <div class="w-10 h-10 bg-purple-100 dark:bg-purple-900/50 rounded-lg flex items-center justify-center text-purple-600 dark:text-purple-400 mb-3">
                                    <i data-lucide="brain" class="w-5 h-5"></i>
                                </div>
                                <h4 class="font-semibold text-slate-900 dark:text-white mb-1">IA Locale</h4>
                                <p class="text-xs text-slate-600 dark:text-slate-400">Utilise Ollama pour une intelligence artificielle puissante et totalement déconnectée.</p>
                            </div>
                            <div class="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/50">
                                <div class="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/50 rounded-lg flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-3">
                                    <i data-lucide="target" class="w-5 h-5"></i>
                                </div>
                                <h4 class="font-semibold text-slate-900 dark:text-white mb-1">Pragmatique</h4>
                                <p class="text-xs text-slate-600 dark:text-slate-400">Des outils concrets pour les PO/BA : analyse de mails, simulation de conflits, etc.</p>
                            </div>
                        </div>
                    </div>
                `;
            case 1:
                return `
                    <div class="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                        <div class="text-center mb-6">
                            <h3 class="text-2xl font-bold text-slate-900 dark:text-white">Tour du Propriétaire</h3>
                            <p class="text-slate-600 dark:text-slate-300">Découvrez les outils à votre disposition.</p>
                        </div>

                        <div class="space-y-3">
                            <div class="flex gap-4 p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700">
                                <div class="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
                                    <i data-lucide="zap" class="w-6 h-6"></i>
                                </div>
                                <div>
                                    <h4 class="font-bold text-slate-900 dark:text-white">Analyseur</h4>
                                    <p class="text-sm text-slate-600 dark:text-slate-400">Collez un email ou une conversation Slack. L'IA analyse le ton, les non-dits et propose une réponse diplomatique.</p>
                                </div>
                            </div>

                            <div class="flex gap-4 p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700">
                                <div class="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center text-orange-600 dark:text-orange-400 shrink-0">
                                    <i data-lucide="swords" class="w-6 h-6"></i>
                                </div>
                                <div>
                                    <h4 class="font-bold text-slate-900 dark:text-white">Dojo</h4>
                                    <p class="text-sm text-slate-600 dark:text-slate-400">Simulez une conversation difficile avec un persona (ex: "Le Dev Senior Grincheux") pour vous entraîner sans risque.</p>
                                </div>
                            </div>

                            <div class="flex gap-4 p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700">
                                <div class="w-12 h-12 bg-pink-100 dark:bg-pink-900/30 rounded-xl flex items-center justify-center text-pink-600 dark:text-pink-400 shrink-0">
                                    <i data-lucide="book" class="w-6 h-6"></i>
                                </div>
                                <div>
                                    <h4 class="font-bold text-slate-900 dark:text-white">Journal</h4>
                                    <p class="text-sm text-slate-600 dark:text-slate-400">Gardez une trace de vos victoires et de vos leçons apprises. Tout est stocké localement.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            case 2:
                return `
                    <div class="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                        <div class="text-center mb-6">
                            <h3 class="text-2xl font-bold text-slate-900 dark:text-white">Configuration Technique</h3>
                            <p class="text-slate-600 dark:text-slate-300">Connectez vos services pour une expérience optimale.</p>
                        </div>

                        <!-- Ollama Check -->
                        <div class="bg-slate-50 dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700">
                            <div class="flex items-center gap-3 mb-3">
                                <div class="w-8 h-8 bg-white dark:bg-slate-700 rounded-lg flex items-center justify-center shadow-sm">
                                    <img src="https://ollama.com/public/ollama.png" class="w-5 h-5" alt="Ollama" onerror="this.style.display='none'">
                                    <i data-lucide="cpu" class="w-5 h-5 text-slate-700 dark:text-slate-300" style="display:none" onload="this.style.display='block'"></i>
                                </div>
                                <h4 class="font-semibold text-slate-900 dark:text-white">Ollama (IA Locale)</h4>
                            </div>
                            <p class="text-sm text-slate-600 dark:text-slate-400 mb-4">
                                Assurez-vous qu'Ollama tourne sur votre machine (` + '`ollama serve`' + `) pour utiliser les fonctionnalités d'IA.
                            </p>
                            <div class="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 dark:bg-amber-900/20 p-2 rounded-lg border border-amber-100 dark:border-amber-800/50">
                                <i data-lucide="alert-circle" class="w-4 h-4"></i>
                                <span>Requis pour l'Analyseur et le Dojo.</span>
                            </div>
                        </div>

                        <!-- Supabase Config -->
                        <div class="bg-slate-50 dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700">
                            <div class="flex items-center gap-3 mb-3">
                                <div class="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center text-emerald-600">
                                    <i data-lucide="database" class="w-5 h-5"></i>
                                </div>
                                <h4 class="font-semibold text-slate-900 dark:text-white">Supabase (Optionnel)</h4>
                            </div>
                            <p class="text-sm text-slate-600 dark:text-slate-400 mb-4">
                                Pour synchroniser vos données entre plusieurs appareils.
                            </p>
                            
                            <div class="space-y-3">
                                <label for="ob-supabase-url" class="sr-only">URL du projet Supabase</label>
                                <input type="text" id="ob-supabase-url" placeholder="Project URL (https://...)" class="w-full p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all">
                                <label for="ob-supabase-key" class="sr-only">Clé API Supabase (Anon Key)</label>
                                <input type="password" id="ob-supabase-key" placeholder="Anon Key" class="w-full p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all">
                                <button id="ob-test-connection" class="w-full py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors">
                                    Tester la connexion
                                </button>
                                <div id="ob-connection-status" class="hidden text-xs text-center font-medium p-2 rounded"></div>
                            </div>
                        </div>
                    </div>
                `;
            case 3:
                return `
                    <div class="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                        <div class="text-center mb-6">
                            <h3 class="text-2xl font-bold text-slate-900 dark:text-white">Personnalisation (RAG)</h3>
                            <p class="text-slate-600 dark:text-slate-300">Rendez l'IA plus intelligente avec vos propres documents.</p>
                        </div>

                        <div class="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-2xl border border-blue-100 dark:border-blue-800/50 text-center">
                            <div class="w-16 h-16 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 mx-auto mb-4">
                                <i data-lucide="file-up" class="w-8 h-8"></i>
                            </div>
                            <h4 class="font-bold text-slate-900 dark:text-white mb-2">Ajoutez du contexte</h4>
                            <p class="text-sm text-slate-600 dark:text-slate-400 mb-6 max-w-sm mx-auto">
                                Importez des chartes de projet, des personas ou des notes de réunion. L'IA les utilisera pour vous donner des réponses plus pertinentes.
                            </p>

                            <input type="file" id="ob-kb-upload" accept=".txt,.md" class="hidden">
                            <button onclick="document.getElementById('ob-kb-upload').click()" class="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium shadow-lg shadow-blue-600/20 transition-all transform hover:scale-105 inline-flex items-center gap-2">
                                <i data-lucide="plus" class="w-5 h-5"></i>
                                Importer un document
                            </button>

                            <!-- Progress -->
                            <div id="ob-kb-progress" class="hidden mt-4 max-w-xs mx-auto">
                                <div class="flex justify-between text-xs text-slate-500 mb-1">
                                    <span>Indexation...</span>
                                    <span id="ob-kb-percent">0%</span>
                                </div>
                                <div class="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5">
                                    <div id="ob-kb-bar" class="bg-blue-600 h-1.5 rounded-full" style="width: 0%"></div>
                                </div>
                            </div>

                            <div id="ob-kb-list" class="mt-6 space-y-2 text-left max-h-32 overflow-y-auto custom-scrollbar">
                                <!-- Uploaded files list -->
                            </div>
                        </div>
                    </div>
                `;
            case 4:
                return `
                    <div class="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                        <div class="text-center mb-6">
                            <h3 class="text-2xl font-bold text-slate-900 dark:text-white">Configuration SEO (Admin)</h3>
                            <p class="text-slate-600 dark:text-slate-300">Préparez votre site pour le déploiement.</p>
                        </div>

                        <div class="bg-slate-50 dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
                            <div class="mb-4">
                                <label for="ob-domain" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Votre Nom de Domaine</label>
                                <div class="flex gap-2">
                                    <input type="text" id="ob-domain" placeholder="https://mon-domaine.com" class="flex-1 p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm focus:ring-2 focus:ring-blue-500 outline-none">
                                    <button id="ob-generate-seo" class="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                                        Générer
                                    </button>
                                </div>
                                <p class="text-xs text-slate-500 mt-1">L'URL de base où sera hébergé le site.</p>
                            </div>

                            <div id="ob-seo-results" class="hidden space-y-4">
                                <div>
                                    <div class="flex justify-between items-center mb-1">
                                        <span class="text-xs font-semibold text-slate-500 uppercase">robots.txt</span>
                                        <button class="text-xs text-blue-600 hover:text-blue-700" onclick="navigator.clipboard.writeText(document.getElementById('ob-robots-content').textContent)">Copier</button>
                                    </div>
                                    <pre id="ob-robots-content" class="bg-slate-900 text-slate-300 p-3 rounded-lg text-xs font-mono overflow-x-auto"></pre>
                                </div>
                                <div>
                                    <div class="flex justify-between items-center mb-1">
                                        <span class="text-xs font-semibold text-slate-500 uppercase">sitemap.xml</span>
                                        <button class="text-xs text-blue-600 hover:text-blue-700" onclick="navigator.clipboard.writeText(document.getElementById('ob-sitemap-content').textContent)">Copier</button>
                                    </div>
                                    <pre id="ob-sitemap-content" class="bg-slate-900 text-slate-300 p-3 rounded-lg text-xs font-mono overflow-x-auto"></pre>
                                </div>
                                <div class="p-3 bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-200 text-xs rounded-lg border border-amber-100 dark:border-amber-800/50">
                                    <i data-lucide="alert-triangle" class="w-3 h-3 inline mr-1"></i>
                                    Copiez ces contenus dans les fichiers <code>robots.txt</code> et <code>sitemap.xml</code> à la racine de votre projet avant de déployer.
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            default:
                return '';
        }
    }

    showStep(index) {
        this.currentStep = index;
        const content = document.getElementById('onboarding-content');
        const indicator = document.getElementById('step-indicator');
        const progressBar = document.getElementById('progress-bar');
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');

        // Update Content
        content.innerHTML = this.getStepContent(index);

        // Update Header
        indicator.textContent = index + 1;
        progressBar.style.width = `${((index + 1) / this.totalSteps) * 100}%`;

        // Update Buttons
        if (index === 0) {
            prevBtn.classList.add('opacity-0', 'pointer-events-none');
        } else {
            prevBtn.classList.remove('opacity-0', 'pointer-events-none');
        }

        if (index === this.totalSteps - 1) {
            nextBtn.innerHTML = 'C\'est parti ! <i data-lucide="check" class="w-4 h-4"></i>';
            nextBtn.classList.add('bg-green-600', 'hover:bg-green-700', 'shadow-green-600/20');
            nextBtn.classList.remove('bg-blue-600', 'hover:bg-blue-700', 'shadow-blue-600/20');
        } else {
            nextBtn.innerHTML = 'Suivant <i data-lucide="arrow-right" class="w-4 h-4"></i>';
            nextBtn.classList.remove('bg-green-600', 'hover:bg-green-700', 'shadow-green-600/20');
            nextBtn.classList.add('bg-blue-600', 'hover:bg-blue-700', 'shadow-blue-600/20');
        }

        // Re-initialize icons
        if (window.lucide) window.lucide.createIcons();

        // Attach step-specific listeners
        this.attachStepListeners(index);
    }

    attachStepListeners(index) {
        if (index === 2) { // Configuration Step
            const testBtn = document.getElementById('ob-test-connection');
            const urlInput = document.getElementById('ob-supabase-url');
            const keyInput = document.getElementById('ob-supabase-key');

            // Pre-fill if exists
            const savedUrl = localStorage.getItem('supabase_url');
            const savedKey = localStorage.getItem('supabase_key');
            if (savedUrl) urlInput.value = savedUrl;
            if (savedKey) keyInput.value = savedKey;

            testBtn?.addEventListener('click', async () => {
                const url = urlInput.value.trim();
                const key = keyInput.value.trim();
                const statusEl = document.getElementById('ob-connection-status');

                if (!url || !key) return;

                testBtn.disabled = true;
                testBtn.innerHTML = '<i data-lucide="loader" class="animate-spin w-4 h-4 inline"></i> Test...';

                try {
                    const adapter = new SupabaseAdapter(url, key);
                    await adapter.getJournal(); // Simple ping

                    localStorage.setItem('supabase_url', url);
                    localStorage.setItem('supabase_key', key);

                    statusEl.textContent = 'Connexion réussie !';
                    statusEl.className = 'text-xs text-center font-medium p-2 rounded bg-green-100 text-green-700 block';
                } catch (e) {
                    statusEl.textContent = 'Échec de la connexion.';
                    statusEl.className = 'text-xs text-center font-medium p-2 rounded bg-red-100 text-red-700 block';
                } finally {
                    testBtn.disabled = false;
                    testBtn.textContent = 'Tester la connexion';
                }
            });
        }

        if (index === 3) { // RAG Step
            const fileInput = document.getElementById('ob-kb-upload');

            // Load existing docs
            this.loadStepDocumentsList();

            fileInput?.addEventListener('change', async (e) => {
                const file = e.target.files[0];
                if (!file) return;

                const progressDiv = document.getElementById('ob-kb-progress');
                const progressBar = document.getElementById('ob-kb-bar');
                const progressPercent = document.getElementById('ob-kb-percent');

                progressDiv.classList.remove('hidden');
                progressBar.style.width = '0%';
                progressPercent.textContent = '0%';

                try {
                    const text = await file.text();
                    await knowledgeBase.addDocument(file.name, text, (percent) => {
                        progressBar.style.width = `${percent}%`;
                        progressPercent.textContent = `${percent}%`;
                    });

                    this.loadStepDocumentsList();
                } catch (error) {
                    console.error(error);
                    alert('Erreur lors de l\'indexation. Vérifiez qu\'Ollama est lancé.');
                } finally {
                    setTimeout(() => {
                        progressDiv.classList.add('hidden');
                        fileInput.value = '';
                    }, 1000);
                }
            });
        }

        if (index === 4) { // SEO Step
            const generateBtn = document.getElementById('ob-generate-seo');
            const domainInput = document.getElementById('ob-domain');
            const resultsDiv = document.getElementById('ob-seo-results');
            const robotsContent = document.getElementById('ob-robots-content');
            const sitemapContent = document.getElementById('ob-sitemap-content');

            // Pre-fill with current origin if not localhost
            if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
                domainInput.value = window.location.origin;
            }

            generateBtn?.addEventListener('click', () => {
                let domain = domainInput.value.trim();
                if (!domain) return;

                // Ensure protocol
                if (!domain.startsWith('http')) {
                    domain = 'https://' + domain;
                }
                // Remove trailing slash
                domain = domain.replace(/\/$/, '');

                const robots = `User-agent: *\nAllow: /\n\nSitemap: ${domain}/sitemap.xml`;

                const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>${domain}/</loc>
        <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>1.0</priority>
    </url>
</urlset>`;

                robotsContent.textContent = robots;
                sitemapContent.textContent = sitemap;
                resultsDiv.classList.remove('hidden');
            });
        }
    }

    async loadStepDocumentsList() {
        const listEl = document.getElementById('ob-kb-list');
        if (!listEl) return;

        try {
            const docs = await knowledgeBase.getDocuments();
            if (docs.length === 0) {
                listEl.innerHTML = '<div class="text-xs text-slate-400 text-center italic">Aucun document</div>';
                return;
            }
            listEl.innerHTML = docs.map(doc => `
                <div class="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 p-2 rounded border border-slate-100 dark:border-slate-700">
                    <i data-lucide="file-check" class="w-4 h-4 text-green-500"></i>
                    <span class="truncate">${doc.title}</span>
                </div>
            `).join('');
            if (window.lucide) window.lucide.createIcons();
        } catch (e) {
            console.error(e);
        }
    }

    nextStep() {
        if (this.currentStep < this.totalSteps - 1) {
            this.showStep(this.currentStep + 1);
        } else {
            this.finish();
        }
    }

    prevStep() {
        if (this.currentStep > 0) {
            this.showStep(this.currentStep - 1);
        }
    }

    finish() {
        // Save completion flag
        localStorage.setItem('onboarding_completed', 'true');

        // Animate out
        this.container.querySelector('.relative').classList.add('scale-95', 'opacity-0', 'transition-all', 'duration-300');
        this.container.querySelector('.absolute').classList.add('opacity-0', 'transition-opacity', 'duration-300');

        setTimeout(() => {
            this.container.remove();
            if (this.onComplete) this.onComplete();
        }, 300);
    }
}
