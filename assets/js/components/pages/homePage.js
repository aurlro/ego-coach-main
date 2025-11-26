import { store } from '../../core/store.js';
import { statsService } from '../../services/statsService.js';

export class HomePage {
    async mount(container) {
        const { journal, user } = store.getState();
        const stats = statsService.calculateStats(journal);

        container.innerHTML = `
            <div class="w-full max-w-[1600px] mx-auto space-y-8 px-6">
                <!-- Welcome Section -->
                <div class="text-center py-8">
                    <h1 class="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                        Bonjour, <span class="text-blue-600">Conscient</span>
                    </h1>
                    <p class="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                        Prêt à transformer vos réactions en réponses ? Voici où vous en êtes aujourd'hui.
                    </p>
                </div>

                <!-- Stats Grid -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <!-- Stat 1: Total Entries -->
                    <div class="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center text-center hover:shadow-md transition-shadow">
                        <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4">
                            <i data-lucide="book" class="w-6 h-6"></i>
                        </div>
                        <span class="text-3xl font-bold text-slate-900 dark:text-white mb-1">${stats.totalEntries}</span>
                        <span class="text-sm text-slate-500 dark:text-slate-400">Analyses réalisées</span>
                    </div>

                    <!-- Stat 2: Top Ego -->
                    <div class="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center text-center hover:shadow-md transition-shadow">
                        <div class="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center text-purple-600 dark:text-purple-400 mb-4">
                            <i data-lucide="fingerprint" class="w-6 h-6"></i>
                        </div>
                        <span class="text-xl font-bold text-slate-900 dark:text-white mb-1 truncate w-full px-2">${stats.topEgo}</span>
                        <span class="text-sm text-slate-500 dark:text-slate-400">Ego dominant (${stats.topEgoPercentage}%)</span>
                    </div>

                    <!-- Stat 3: Days Since Defensive -->
                    <div class="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center text-center hover:shadow-md transition-shadow">
                        <div class="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600 dark:text-green-400 mb-4">
                            <i data-lucide="shield-check" class="w-6 h-6"></i>
                        </div>
                        <span class="text-3xl font-bold text-slate-900 dark:text-white mb-1">
                            ${stats.daysSinceDefensive !== null ? stats.daysSinceDefensive + 'j' : '-'}
                        </span>
                        <span class="text-sm text-slate-500 dark:text-slate-400">Sans "Défensive"</span>
                    </div>
                </div>

                <!-- Quick Actions -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <a href="#analyze" class="group relative overflow-hidden bg-gradient-to-br from-blue-600 to-blue-700 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
                        <div class="relative z-10">
                            <h3 class="text-2xl font-bold text-white mb-2">Nouvelle Analyse</h3>
                            <p class="text-blue-100 mb-6">Décortiquez une interaction difficile et trouvez les mots justes.</p>
                            <span class="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg font-medium group-hover:bg-white/30 transition-colors">
                                Commencer <i data-lucide="arrow-right" class="w-4 h-4"></i>
                            </span>
                        </div>
                        <div class="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                        <div class="absolute bottom-0 left-0 -mb-4 -ml-4 w-24 h-24 bg-black/10 rounded-full blur-xl"></div>
                    </a>

                    <a href="#dojo" class="group relative overflow-hidden bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 transition-all">
                        <div class="relative z-10">
                            <h3 class="text-2xl font-bold text-slate-900 dark:text-white mb-2">Le Dojo</h3>
                            <p class="text-slate-600 dark:text-slate-400 mb-6">Entraînez-vous à identifier les mécanismes de l'ego dans un environnement sûr.</p>
                            <span class="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 font-medium group-hover:translate-x-1 transition-transform">
                                S'entraîner <i data-lucide="swords" class="w-4 h-4"></i>
                            </span>
                        </div>
                    </a>
                </div>

                <!-- Recent Activity -->
                <div>
                    <h2 class="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                        <i data-lucide="clock" class="w-5 h-5 text-slate-400"></i> Activité Récente
                    </h2>
                    <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 divide-y divide-slate-100 dark:divide-slate-700">
                        ${stats.latestEntries.length > 0 ? stats.latestEntries.map(entry => `
                            <div class="p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                <div class="flex justify-between items-start gap-4">
                                    <div class="flex-1 min-w-0">
                                        <div class="flex items-center gap-2 mb-1">
                                            <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
                                                ${entry.egoFocus || 'Analyse'}
                                            </span>
                                            <span class="text-xs text-slate-400">
                                                ${new Date(entry.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <p class="text-sm text-slate-600 dark:text-slate-300 line-clamp-2">
                                            ${entry.summary || entry.context || 'Pas de contenu'}
                                        </p>
                                    </div>
                                    <a href="#journal" class="text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 p-2">
                                        <i data-lucide="chevron-right" class="w-5 h-5"></i>
                                    </a>
                                </div>
                            </div>
                        `).join('') : `
                            <div class="p-8 text-center text-slate-500 dark:text-slate-400">
                                Aucune activité récente. Commencez votre première analyse !
                            </div>
                        `}
                    </div>
                </div>
            </div>
        `;

        lucide.createIcons();
    }

    async unmount() { }
}
