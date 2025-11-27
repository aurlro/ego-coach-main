export class GuidePage {
    async mount(container) {
        container.innerHTML = `
            <div class="space-y-8">
                <div class="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                    <div>
                        <h2 class="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                            Guide de Survie de l'Ego
                        </h2>
                        <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
                            Les 4 postures égotiques et leurs antidotes.
                        </p>
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- Card 1: La Défensive -->
                    <div class="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
                        <div class="flex items-center gap-3 mb-4">
                            <div class="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center text-blue-600">
                                <i data-lucide="shield" class="w-6 h-6"></i>
                            </div>
                            <h2 class="text-xl font-bold text-slate-900 dark:text-white">La Défensive</h2>
                        </div>
                        <p class="text-slate-600 dark:text-slate-400 mb-4 text-sm">
                            Se sent attaqué personnellement. Réagit par la justification, le déni ou la contre-attaque.
                        </p>
                        <div class="bg-slate-50 dark:bg-slate-900 p-3 rounded-lg text-sm">
                            <span class="font-bold text-slate-700 dark:text-slate-300">Antidote :</span>
                            <span class="text-slate-600 dark:text-slate-400">Pause + "Qu'est-ce qui est touché chez moi ?"</span>
                        </div>
                    </div>

                    <!-- Card 2: Le Sauveur -->
                    <div class="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
                        <div class="flex items-center gap-3 mb-4">
                            <div class="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center text-green-600">
                                <i data-lucide="heart-handshake" class="w-6 h-6"></i>
                            </div>
                            <h2 class="text-xl font-bold text-slate-900 dark:text-white">Le Sauveur</h2>
                        </div>
                        <p class="text-slate-600 dark:text-slate-400 mb-4 text-sm">
                            Veut aider à tout prix, même sans demande. S'épuise et attend de la reconnaissance.
                        </p>
                        <div class="bg-slate-50 dark:bg-slate-900 p-3 rounded-lg text-sm">
                            <span class="font-bold text-slate-700 dark:text-slate-300">Antidote :</span>
                            <span class="text-slate-600 dark:text-slate-400">Demander : "De quoi as-tu besoin ?"</span>
                        </div>
                    </div>

                    <!-- Card 3: Le Martyr -->
                    <div class="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
                        <div class="flex items-center gap-3 mb-4">
                            <div class="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center text-purple-600">
                                <i data-lucide="frown" class="w-6 h-6"></i>
                            </div>
                            <h2 class="text-xl font-bold text-slate-900 dark:text-white">Le Martyr</h2>
                        </div>
                        <p class="text-slate-600 dark:text-slate-400 mb-4 text-sm">
                            Subit la situation, se plaint, attend qu'on devine ses besoins. Culpabilise les autres.
                        </p>
                        <div class="bg-slate-50 dark:bg-slate-900 p-3 rounded-lg text-sm">
                            <span class="font-bold text-slate-700 dark:text-slate-300">Antidote :</span>
                            <span class="text-slate-600 dark:text-slate-400">Exprimer clairement sa demande.</span>
                        </div>
                    </div>

                    <!-- Card 4: Le Juge -->
                    <div class="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
                        <div class="flex items-center gap-3 mb-4">
                            <div class="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center text-red-600">
                                <i data-lucide="gavel" class="w-6 h-6"></i>
                            </div>
                            <h2 class="text-xl font-bold text-slate-900 dark:text-white">Le Juge</h2>
                        </div>
                        <p class="text-slate-600 dark:text-slate-400 mb-4 text-sm">
                            Critique, sait mieux que tout le monde, impose sa vision. Manque d'empathie.
                        </p>
                        <div class="bg-slate-50 dark:bg-slate-900 p-3 rounded-lg text-sm">
                            <span class="font-bold text-slate-700 dark:text-slate-300">Antidote :</span>
                            <span class="text-slate-600 dark:text-slate-400">Curiosité : "Comment vois-tu les choses ?"</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
        lucide.createIcons();
    }

    async unmount() { }
}
