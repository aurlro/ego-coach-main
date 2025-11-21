/**
 * Dojo Simulator - Interactive Training for Ego-Aware Communication
 * Simulates real scenarios and provides immediate feedback
 */

function createDojoSimulator({ modal, toast }) {
    let currentScenario = null;
    let scenarioProgress = {
        completed: [],
        scores: {},
    };

    const SCENARIOS = [
        {
            id: 'defensive-1',
            ego: 'La Défensive',
            egoEmoji: '🛡️',
            title: 'Ton boss critique ton travail',
            situation:
                'Lors du standup, ton lead dit : "Ce code n\'est pas clean. Il y a trop de répétitions."',
            context:
                "Tu as passé 6h sur cette feature et tu le savais - c'est ton premier refactoring major.",
            instinctiveResponse:
                'Tu dis : "C\'est normal que ce soit un peu brouillon au premier pass. Et de toute façon, c\'est juste des refactoring, ça marche quand même."',
            feedback: {
                color: 'danger',
                title: '❌ La Défensive a pris les rênes',
                analysis: [
                    'Tu justifies au lieu d\'écouter (premier signe)',
                    '"C\'est normal" = minimisation du feedback',
                    '"de toute façon" = contre-attaque passive',
                    'Résultat : Lead pense que tu refuses le feedback',
                ],
                antidote:
                    'Pause. Respire. Puis : "Je vois. Tu me dis que le code a des répétitions à refactorer. Tu peux me montrer ce que tu veux dire ?"',
                score: 20,
            },
            betterResponses: [
                {
                    response:
                        'Tu dis : "Entendu. Merci pour le feedback. Tu veux que je refactorise avant de merger ou après ?"',
                    score: 85,
                    reason: 'Accepte le feedback, demande clarification, agis.',
                },
                {
                    response:
                        'Tu dis : "D\'accord. Combien de temps tu penses que c\'est ?"',
                    score: 75,
                    reason: 'Écoutes et cherches à comprendre sans te défendre.',
                },
            ],
        },
        {
            id: 'savior-1',
            ego: 'Le Sauveur',
            egoEmoji: '🦸',
            title: 'Ton pote a un problème relationnel',
            situation:
                'Ton pote texte : "J\'ai un problème avec mon appart. Mon coloc me stresse, y a des trucs pas clairs..."',
            context:
                "Vous vous connaissez depuis longtemps. D'habitude, tu lui donnes toujours des conseils et ça le soulage.",
            instinctiveResponse:
                'Tu dis : "Écoute, voici ce que tu dois faire : (1) parle-lui demain soir, (2) dis-lui que ça doit changer, (3) si ça marche pas, tu cherches un autre appart. Crois-moi, c\'est comme ça qu\'on gère."',
            feedback: {
                color: 'danger',
                title: '❌ Le Sauveur a volé la vedette',
                analysis: [
                    'Tu proposes une solution avant d\'écouter',
                    'Pas de question, pas de curiosité',
                    'Il n\'a pas besoin de tes solutions - il a besoin d\'être écouté',
                    'Résultat : Il se sent pas vraiment entendu',
                ],
                antidote:
                    'Pause. Puis : "Dis-moi plus. Que sont ces trucs pas clairs ? Comment ça te met le stress ?"',
                score: 25,
            },
            betterResponses: [
                {
                    response:
                        'Tu dis : "Je t\'écoute. C\'est quoi exactement le problème avec ton coloc ?"',
                    score: 90,
                    reason: 'Validation + curiosité. Laissse-le parler en premier.',
                },
                {
                    response:
                        'Tu dis : "Okay, ça a l\'air compliqué. Qu\'est-ce que tu aimerais faire ?"',
                    score: 80,
                    reason: 'Montres que tu comprends, puis demandes son point de vue.',
                },
            ],
        },
        {
            id: 'martyr-1',
            ego: 'Le Martyr',
            egoEmoji: '😔',
            title: 'Ta team dit "non" à ta suggestion',
            situation:
                'En réunion, tu proposes une optimisation. Un collègue dit : "C\'est trop complexe pour le gain. On passe."',
            context:
                "Tu as passé le week-end à l'analyser. Personne n'apprécie jamais tes efforts.",
            instinctiveResponse:
                'Tu dis : "D\'accord. De toute façon, j\'ai déjà donné mon max. C\'est bon, je vais m\'en aller. Mais regardez, dans 3 mois, on aura des problèmes de performance et là vous allez comprendre."',
            feedback: {
                color: 'danger',
                title: '❌ Le Martyr fait du théâtre',
                analysis: [
                    'Tu dramatises : "j\'ai déjà donné mon max"',
                    'Menace voilée : "dans 3 mois..."',
                    'Pas d\'écoute du rejet - seulement de la victimisation',
                    'Résultat : Les gens se sentent culpabilisés, pas convaincus',
                ],
                antidote:
                    'Respire. Puis : "D\'accord. Mais aide-moi à comprendre : pourquoi tu penses que c\'est trop complexe ? Quel gain te semblerait suffisant ?"',
                score: 20,
            },
            betterResponses: [
                {
                    response:
                        'Tu dis : "Entendu. Tu penses que le gain ne vaut pas la complexité. On verra dans 3 mois si les problèmes arrivent."',
                    score: 85,
                    reason: 'Acceptes la décision sans jouer la victime.',
                },
                {
                    response:
                        'Tu dis : "D\'accord. Qu\'est-ce que ça prendrait pour que vous soyez d\'accord ?"',
                    score: 75,
                    reason: 'Cherches les vraies conditions, pas le pity.',
                },
            ],
        },
        {
            id: 'lastword-1',
            ego: 'Le Dernier Mot',
            egoEmoji: '🎤',
            title: 'Débat sur la techno à choisir',
            situation:
                'En standup, le tech lead dit : "On va utiliser React pour le nouveau projet." Tu réponds tout de suite :',
            context:
                "Tu penses que Vue serait mieux. C'est une conviction que tu as depuis longtemps.",
            instinctiveResponse:
                'Tu dis : "Non, React c\'est dead. Vue c\'est clairement mieux. Les chiffres le montrent. Je suis sûr que tu vas le regretter."',
            feedback: {
                color: 'danger',
                title: '❌ Le Dernier Mot veut gagner',
                analysis: [
                    'Tu contredis directement, pas de dialogue',
                    '"c\'est dead" = jugement, pas argument',
                    '"Je suis sûr" = ton autoritaire, pas collaboratif',
                    'Résultat : Le lead se sent dévalué publiquement',
                ],
                antidote:
                    'Pause. Puis : "J\'ai une inquiétude : comment tu vois la courbe d\'apprentissage ? Est-ce qu\'on a du temps ?"',
                score: 15,
            },
            betterResponses: [
                {
                    response:
                        'Tu dis : "Pourquoi tu as choisi React plutôt que Vue ? Je suis curieux de ta logique."',
                    score: 90,
                    reason: 'Curiosité avant conviction. Comprendre avant convaincre.',
                },
                {
                    response:
                        'Tu dis : "D\'accord. Après le standup, j\'aimerais te montrer quelques benchmarks si ça te dit."',
                    score: 80,
                    reason: 'Respectes la décision, proposes une conversation privée.',
                },
            ],
        },
        {
            id: 'resistance-1',
            ego: "Le Refus d'influence",
            egoEmoji: '🚫',
            title: 'Un ami te fait une suggestion',
            situation:
                'Tu dis à ton ami que tu veux changer de job. Il te dit : "Tu devrais essayer la mentalité de startup plutôt que de sauter ship."',
            context:
                "Tu en as déjà parlé 10 fois. C'est TON choix, pas le sien.",
            instinctiveResponse:
                'Tu dis : "Ça ne te regarde pas. J\'ai pas besoin de ton avis. Je sais ce que je fais."',
            feedback: {
                color: 'danger',
                title: '❌ Le Refus bloque tout',
                analysis: [
                    'Tu fermes la porte au dialogue',
                    '"Ça ne te regarde pas" = tu le rejettes',
                    'Tu assumes qu\'il veut te contrôler (peut-être pas vrai)',
                    'Résultat : Relation devient adversaire',
                ],
                antidote:
                    'Prends une pause. Puis : "J\'apprécie que tu penses à moi. Mais là, j\'ai besoin de tester ma façon. On reverra ensemble dans 6 mois ?"',
                score: 25,
            },
            betterResponses: [
                {
                    response:
                        'Tu dis : "Je comprends ton avis. Mais je veux vraiment tester cette approche. Donne-moi 6 mois, après on peut en reparler."',
                    score: 85,
                    reason: 'Respectes son intention, firmes sur ta décision.',
                },
                {
                    response:
                        'Tu dis : "Cool perspective. Pour moi, là c\'est important d\'essayer la startup. On verra comment ça va."',
                    score: 80,
                    reason: 'Acceptes l\'avis sans le rejeter, ni te soumettre.',
                },
            ],
        },

        // ============================================================
        // COUPLE-SPECIFIC SCENARIOS (15 new scenarios)
        // ============================================================

        // Pattern 1: Pursue-Withdraw (Anxious-Avoidant)
        {
            id: 'couple-pursue-withdraw-1',
            category: 'Couple',
            pattern: 'Poursuite-Retrait',
            patternEmoji: '🏃‍♀️🏃‍♂️',
            title: 'Elle poursuit, il se retire',
            situation:
                'Tu remarques que vous êtes distants depuis 2 semaines. Tu dis à ton partenaire : "On se parle jamais. On a un problème ?"',
            context:
                'Tu as besoin de connexion. Son silence te rend anxieuse. Tu escalades : "Pourquoi tu ne veux pas en parler ? Est-ce que tu m\'aimes encore ?"',
            instinctiveResponse:
                'Tu dis : "POURQUOI TU NE VEUX JAMAIS PARLER ?! Tu me repousses TOUJOURS quand ça devient sérieux ! Tu ne m\'aimes pas, c\'est ça ?"',
            feedback: {
                color: 'danger',
                title: '❌ Poursuite intensifiée',
                analysis: [
                    'Tu escalades avec accusation et menace (CRITIQUE + PERSÉCUTION)',
                    'Tu interprètes son silence comme rejet personnel',
                    'Tu forces une conversation quand il est déjà overwhelmed',
                    'Résultat : Il se retire ENCORE PLUS',
                ],
                antidote:
                    '[PAUSE] Respire. Puis : "Je sens qu\'on est distant. Ça m\'inquiète. Quand tu serais prêt(e) à en parler, on pourrait en discuter ?"',
                score: 15,
            },
            betterResponses: [
                {
                    response:
                        'Tu dis : "Je remarque qu\'on se parle moins. Je me sens éloignée. Peux-on prendre 30 min ce soir pour vraiment se parler ?"',
                    score: 80,
                    reason: 'Expresses ta peur sans attaque. Proposes une structure. Respecte son timing.',
                },
                {
                    response:
                        'Tu dis : "Je sais que tu trouves les conversations intenses difficiles. Mais ça compte pour moi. Qu\'est-ce qui te rendrait à l\'aise d\'en parler ?"',
                    score: 75,
                    reason: 'Empathie + fermeté. Cherches ce qui marche pour LUI.',
                },
            ],
            keyLearning:
                'Poursuite = peur du rejet. Retrait = peur de l\'intimité. Tous les deux ont peur. Poursuite intensifiée détruit tout. Pause + invitation douce = seule chose qui fonctionne.',
        },

        // Pattern 2: Criticism Loop (Gottman)
        {
            id: 'couple-criticism-1',
            category: 'Couple',
            pattern: 'Boucle Critique-Défense',
            patternEmoji: '⚔️',
            title: 'Critique du ménage',
            situation:
                'La cuisine est un peu désordonnée. Tu dis à ton partenaire : "La cuisine est toujours un désastre. Tu ne fais jamais attention à rien."',
            context:
                'Tu gères 80% des tâches ménagères. Tu es fatigué(e) et frustré(e). Sa "négligence" te rend folle.',
            instinctiveResponse:
                'Tu dis : "C\'est toujours pareil ! Tu es tellement paresseux(se). C\'est normal que je me sente seul(e) - tu ne fais rien pour cette relation !"',
            feedback: {
                color: 'danger',
                title: '❌ CRITIQUE Gottman #1',
                analysis: [
                    'Tu attaques CHARACTER, pas le comportement spécifique',
                    '"Tu ne fais jamais rien" = généralisation toxique',
                    'Tu escalades à "cette relation" - ça devient existentiel',
                    'Son cerveau entend : "Je suis mauvaise personne" (pas "il y a des assiettes")',
                    'Résultat : DÉFENSE (escalade) ou RETRAIT (shutdown)',
                ],
                antidote:
                    'Pause. Respire. Puis : "Il y a des assiettes depuis hier. Je me sens seule(e) quand je gère tout. Peux-tu les laver ?"',
                score: 20,
            },
            betterResponses: [
                {
                    response:
                        'Tu dis : "J\'ai besoin d\'aide avec le ménage. Je suis overwhelmée. Peux-on diviser les tâches autrement ?"',
                    score: 85,
                    reason: 'Complaint doux (not critique). Expresse ton besoin. Propose une solution.',
                },
                {
                    response:
                        'Tu dis : "Quand la cuisine est désordonnée, je me sens stressée. Pourrais-tu ranger tes trucs ?"',
                    score: 80,
                    reason: 'Behavior-specific. Non-attacking. Direct request.',
                },
            ],
            keyLearning:
                'La critique attaque CHARACTER. La plainte doux attaque LE PROBLÈME. Une tue la relation. L\'autre peut être résolue.',
        },

        // Pattern 3: Dismissive Partner
        {
            id: 'couple-dismissive-1',
            category: 'Couple',
            pattern: 'Partenaire Indifférent',
            patternEmoji: '😶‍🌫️',
            title: 'Ton besoin d\'intimité est rejeté',
            situation:
                'Tu dis à ton partenaire : "J\'aimerais plus d\'intimité entre nous. Je me sens déconnecté(e)."',
            context:
                'Tu as essayé plusieurs fois. À chaque fois, il/elle minimise : "On va bien. Tu overthinks."',
            instinctiveResponse:
                'Tu dis : "Tu ne m\'écoutes JAMAIS ! Tu me fais toujours sentir que mes besoins n\'importent pas. C\'est comme si je n\'existais pas pour toi !"',
            feedback: {
                color: 'danger',
                title: '❌ ESCALADE de poursuite',
                analysis: [
                    'Tu escalades la douleur (attacking, accusing)',
                    'Il/elle se ferme davantage (le cycle)',
                    'Tu demandes validation qu\'il/elle peut pas donner',
                    'Vous êtes tous les deux dans la peur',
                ],
                antidote:
                    '[PAUSE] "Je sais que c\'est difficile à entendre. Mais j\'ai vraiment besoin que tu m\'entendes sur ce point. Peux-on en parler sans "tu overthinks" ?"',
                score: 25,
            },
            betterResponses: [
                {
                    response:
                        'Tu dis : "J\'entends que tu penses que tout va bien. Mais pour moi, c\'est différent. Pourrais-tu écouter ce que c\'est que de ma perspective - même si c\'est pas vrai pour toi ?"',
                    score: 85,
                    reason: 'Acceptes sa perspective. Cherches vraiment d\'être entendu(e). Pas d\'attaque.',
                },
                {
                    response:
                        'Tu dis : "J\'ai besoin de temps pour vraiment parler de ça. C\'est important pour moi. Quand pourrais-tu être présent(e) vraiment ?"',
                    score: 75,
                    reason: 'Demandes sa présence. Pas accusation. Respectueuse.',
                },
            ],
            keyLearning:
                'Dismissal est de la peur. Escalade de poursuite crée plus de peur. Seule une communication calme et douce peut ouvrir la porte.',
        },

        // Pattern 4: Stonewalling & Shutdown
        {
            id: 'couple-stonewalling-1',
            category: 'Couple',
            pattern: 'Retrait Émotionnel',
            patternEmoji: '🧊',
            title: 'Il/elle se ferme complètement',
            situation:
                'Vous avez un désaccord. Tu dis quelque chose qui le/la blesse. Il/elle dit : "Je ne veux pas en parler. Laisse-moi tranquille."',
            context:
                'Il/elle est souvent overwhelmée par les émotions. Ton ton peut être intense. Il/elle se ferme pour "se protéger".',
            instinctiveResponse:
                'Tu dis : "ARRÊTE ! Tu fais ça à chaque fois ! Tu ne veux jamais résoudre les choses ! C\'est comme être en relation avec un mur ! Je ne peux pas vivre comme ça !"',
            feedback: {
                color: 'danger',
                title: '❌ STONEWALLING & COUNTER-ATTACK',
                analysis: [
                    'Il/elle a dit: "Je ne peux pas" (overwhelm)',
                    'Tu entends: "Je ne veux pas" (rejection)',
                    'Tu attaques plus fort (CRITIQUE + PERSÉCUTION)',
                    'Il/elle se ferme DAVANTAGE (STONEWALLING)',
                    'Cycle devient inévitable',
                ],
                antidote:
                    '[PAUSE] "Je sais que c\'est beaucoup. Je vais te laisser de l\'espace. Mais on en parle plus tard, d\'accord ? Je veux vraiment résoudre ça avec toi."',
                score: 18,
            },
            betterResponses: [
                {
                    response:
                        'Tu dis : "Je vois que tu es overwhelmée(e). Je pense pas qu\'on peut en parler maintenant. Prends ton temps. On essaiera dans une heure ?"',
                    score: 85,
                    reason: 'Validates l\'overwhelm. Respecte le besoin d\'espace. Commit à revenir.',
                },
                {
                    response:
                        'Tu dis : "D\'accord. Je vais faire un truc à côté. Quand tu serais prêt(e), dis-moi et on pourra vraiment se parler."',
                    score: 80,
                    reason: 'Acceptes le break. Donne du contrôle. Montre que tu n\'abandonnes pas.',
                },
            ],
            keyLearning:
                'Stonewalling n\'est pas rejet. C\'est OVERWHELM. Attaquer le shutdown = créer du shutdown chronique. Respecter le break = la seule way it opens.',
        },

        // Pattern 5: Power Imbalance
        {
            id: 'couple-power-1',
            category: 'Couple',
            pattern: 'Déséquilibre de Pouvoir',
            patternEmoji: '👑',
            title: 'Un partenaire décide pour deux',
            situation:
                'Ton partenaire dit : "Je veux qu\'on dîne chez mes parents ce week-end. C\'est décidé." Toi, tu voulais du temps seul(e).',
            context:
                'Il/elle décide souvent unilatéralement. Finances, sorties, amis. Tu te sens contrôlée(é).',
            instinctiveResponse:
                'Tu dis : "Tu décides TOUJOURS tout ! Tu ne me respectes pas. Je n\'en peux plus. Je veux partir !"',
            feedback: {
                color: 'danger',
                title: '❌ POWERPLAY escaladé',
                analysis: [
                    'Il/elle a montré du pouvoir',
                    'Tu as réagi avec accusation + menace (séparation)',
                    'Ça crée plus de contrôle vs plus de rébellion',
                    'Pattern devient chronique : "Contrôle pour protéger le contrôle"',
                ],
                antidote:
                    '[PAUSE] "J\'apprécie ta famille, mais ça compte pas pour moi d\'être consultée. Je veux du temps seul(e) ce week-end. Comment on peut trouver un équilibre ?"',
                score: 20,
            },
            betterResponses: [
                {
                    response:
                        'Tu dis : "Je vois que tu veux voir ta famille. Mais moi, j\'ai besoin de dire oui ou non. Parlons et trouvons un timing qui marche pour nous deux."',
                    score: 85,
                    reason: 'Acceptes son désir. Redéfinis le process. Cherches vraiment l\'équilibre.',
                },
                {
                    response:
                        'Tu dis : "Je sais que ta famille compte pour toi. Mais quand des décisions sont unilatérales, je me sens pas respectée. Peux-on revenir au process ?"',
                    score: 80,
                    reason: 'Adresse le système, pas la personne. Cherches du changement.',
                },
            ],
            keyLearning:
                'Pouvoir seul = contrôle = resentment. Pouvoir partagé = partenariat. Partnership requiert que les deux voix comptent dans CHAQUE décision.',
        },

        // Pattern 6: Attachment Mismatch (Anxious pursuing Secure/Avoidant)
        {
            id: 'couple-attachment-1',
            category: 'Couple',
            pattern: 'Choc Attachement',
            patternEmoji: '💛💙',
            title: 'Besoin d\'affection vs Besoin d\'espace',
            situation:
                'Tu veux du temps ensemble le week-end. Ton partenaire dit : "J\'ai besoin d\'espace. Je veux voir mes amis."',
            context:
                'Tu as l\'attachement anxieux. Il/elle a l\'avoidant. Cette tension existe depuis le début.',
            instinctiveResponse:
                'Tu dis : "Pourquoi tu veux TOUJOURS me repousser ? C\'est clair - tu ne veux pas de moi. Tu n\'es jamais là pour moi !"',
            feedback: {
                color: 'danger',
                title: '❌ Attachement Anxieux en escalade',
                analysis: [
                    'Il/elle a dit "J\'ai besoin d\'espace" (avoidant norm)',
                    'Tu l\'interprètes comme rejet personnel',
                    'Tu escalades : "Tu ne m\'aimes pas"',
                    'Il/elle se ferme davantage (confirme ta peur)',
                    'Cycle parfait du pursue-withdraw',
                ],
                antidote:
                    '[PAUSE] "Je sais que tu aimes avoir du temps seul. Et moi, j\'aime qu\'on passe du temps ensemble. Tous les deux sont vrais. Comment on balance ça ?"',
                score: 22,
            },
            betterResponses: [
                {
                    response:
                        'Tu dis : "C\'est pas sur moi, c\'est sur toi - j\'entends. Donc je te propose : samedi on passe du temps ensemble, dimanche tu as de l\'espace. Ça te va ?"',
                    score: 85,
                    reason: 'Acceptes sa nature. Trouves un compromise. Pas d\'accusation.',
                },
                {
                    response:
                        'Tu dis : "Je crois pas que ce soit sur moi. C\'est juste nos styles différents. Aide-moi à comprendre - combien de temps seul(e) te faut ?"',
                    score: 80,
                    reason: 'Reformulates le problème. Cherches vraiment l\'info. Curieuse, pas accusatrice.',
                },
            ],
            keyLearning:
                'Attachement anxieux interprète l\'indépendance du partenaire comme rejet. Mais c\'est pas rejet. C\'est besoin. Respecter les deux besoins = partnership.',
        },

        // Pattern 7: Contempt (Gottman #2 - Most Dangerous)
        {
            id: 'couple-contempt-1',
            category: 'Couple',
            pattern: 'Mépris (Le Cavalier Dangereux)',
            patternEmoji: '😒',
            title: 'Ton partenaire te regarde de haut',
            situation:
                'Tu fais une erreur. Ton partenaire dit avec un sourire sardonique : "Wow. C\'est tellement comme toi. Évidemment. À quoi j\'attendais ?"',
            context:
                'Il/elle utilise souvent le sarcasme douloureux. Des petits coups. Tu sens du dégoût quand il/elle te regarde.',
            instinctiveResponse:
                'Tu dis : "Tu me méprises. Je le vois dans tes yeux. Comment tu peux me traiter comme ça ? Je ne peux pas rester avec quelqu\'un qui me regarde comme si j\'étais infecte !"',
            feedback: {
                color: 'danger',
                title: '❌ CONTEMPT DETECTED (Horseman #2)',
                analysis: [
                    'Il/elle a montré du MÉPRIS (ton sardonique, regard)',
                    'Tu as raison - c\'est un danger Gottman',
                    'Mais attaquer le mépris crée plus de distance',
                    'Le mépris est le plus difficile à corriger',
                    'Cela requiert une intervention sérieuse et consciente',
                ],
                antidote:
                    '[PAUSE longue - 20min] Puis, calmement, sans accusation: "Tu as regardée de haut avec ce commentaire. Ça m\'a blessée. Je veux qu\'on en parle quand on est pas en colère."',
                score: 15,
            },
            betterResponses: [
                {
                    response:
                        'Demain, quand vous êtes calmes: "Hier, j\'ai senti du mépris. C\'est un problème pour moi dans la relation. On peut en parler ? Je veux comprendre ce qui se passe."',
                    score: 85,
                    reason: 'Nomme le pattern. Pas d\'accusation. Cherches vraiment l\'insight.',
                },
                {
                    response:
                        '[Se taire sur le moment. Prendre soin de soi.] Plus tard: "Quand tu utilises ce ton, je me ferme. Je ne peux pas entendre le message. Peut-on essayer autrement ?"',
                    score: 80,
                    reason: 'Nomme l\'impact. Donne de l\'espace. Propose l\'amélioration.',
                },
            ],
            keyLearning:
                'Contempt est le plus destructeur. Il tue le respect. Si c\'est chronique, sans thérapie, c\'est très difficile à réparer. Mais si c\'est rare et reconnu, on peut en parler.',
        },

        // Pattern 8: Repair Attempts (Recognition & Acceptance)
        {
            id: 'couple-repair-1',
            category: 'Couple',
            pattern: 'Tentatives de Réparation',
            patternEmoji: '🔧',
            title: 'Ton partenaire essaie de réparer après un conflit',
            situation:
                'Après un gros conflit, ton partenaire dit : "Je suis désolé(e). Je n\'aurais pas dû être dur(e). Viens ici ?" et essaie de faire l\'amour.',
            context:
                'Toi, tu es encore blessée(é). Tu ne sais pas si c\'est une vrai réparation ou juste du "patch over it".',
            instinctiveResponse:
                'Tu dis : "NON. Tu crois que tu peux juste dire sorry et tout aller bien ? Il y a encore du truc qui traîne. C\'est pas résolu juste par le sexe."',
            feedback: {
                color: 'danger',
                title: '❌ Rejette la tentative de réparation',
                analysis: [
                    'Il/elle a tenté une réparation',
                    'C\'est maladroit mais c\'est une tentative',
                    'Tu rejettes la tentative (correctement, mais dur)',
                    'Issue: Les deux cessent d\'essayer',
                    'Dans 48h vous êtes de nouveau en conflit',
                ],
                antidote:
                    '[RESPIRE] "Merci de vouloir réparer. Et j\'apprécie. Mais j\'ai besoin qu\'on parle d\'abord. Peux-on s\'asseoir et vraiment parler ? Ensuite on peut être proches."',
                score: 35,
            },
            betterResponses: [
                {
                    response:
                        'Tu dis : "Merci d\'essayer. Je sentais que tu voulais me reconnecter avec moi. Mais j\'ai besoin qu\'on parle du conflit d\'abord. Après, oui, je veux être proche."',
                    score: 90,
                    reason: 'Acceptes la tentative. Clarifies ce qu\'il faut. Offres la réparation qu\'il faut.',
                },
                {
                    response:
                        'Tu dis : "Je sais que tu essaies. Et c\'est bon pour moi. Parlons 30 min d\'abord, puis on peut être ensemble ?"',
                    score: 85,
                    reason: 'Acceptes + guides. Donne une structure.',
                },
            ],
            keyLearning:
                'Repair attempts matter MORE than the conflict itself (Gottman). Ils peuvent être maladroits. Accepter la maladresse + guider vers une meilleure réparation = relation sauvée.',
        },
    ];

    /**
     * Démarre un scénario
     */
    function startScenario(scenarioId) {
        currentScenario = SCENARIOS.find((s) => s.id === scenarioId);
        if (!currentScenario) return;

        renderScenarioModal();
    }

    /**
     * Rend la modal du scénario
     */
    function renderScenarioModal() {
        if (!currentScenario) return;

        const {
            ego, egoEmoji,
            pattern, patternEmoji,
            category,
            title, situation, context, instinctiveResponse, feedback, betterResponses, keyLearning
        } = currentScenario;

        // Determine if this is couple or individual scenario
        const isCoupleScenario = category === 'Couple';
        const label = isCoupleScenario ? 'Pattern relationnel :' : 'L\'ego actif :';
        const displayName = isCoupleScenario ? pattern : ego;
        const emoji = isCoupleScenario ? patternEmoji : egoEmoji;

        const html = `
            <div class="dojo-scenario space-y-6">
                <!-- Ego/Pattern Badge -->
                <div class="dojo-ego-badge" style="border-left: 4px solid var(--accent-warning);">
                    <span class="dojo-ego-emoji">${emoji}</span>
                    <div>
                        <p class="text-sm font-semibold text-slate-700 dark:text-slate-300">${label}</p>
                        <p class="text-lg font-bold text-slate-900 dark:text-slate-100">${displayName}</p>
                    </div>
                </div>

                <!-- Scenario Setup -->
                <div class="dojo-scenario-setup space-y-3">
                    <h3 class="text-xl font-bold text-slate-900 dark:text-slate-100">${title}</h3>
                    <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                        <p class="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">📍 La situation :</p>
                        <p class="text-blue-800 dark:text-blue-200">${situation}</p>
                    </div>
                    <div class="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
                        <p class="text-sm font-semibold text-purple-900 dark:text-purple-100 mb-2">🎭 Contexte émotionnel :</p>
                        <p class="text-purple-800 dark:text-purple-200">${context}</p>
                    </div>
                </div>

                <!-- Instinctive Response -->
                <div class="dojo-instinctive space-y-3">
                    <h4 class="text-lg font-bold text-slate-900 dark:text-slate-100">
                        🤖 Ta réponse instinctive (sous ego) :
                    </h4>
                    <div class="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded">
                        <p class="italic text-red-800 dark:text-red-200">
                            "${instinctiveResponse}"
                        </p>
                    </div>
                </div>

                <!-- Feedback Section -->
                <div class="dojo-feedback space-y-3">
                    <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                        <p class="font-bold text-red-900 dark:text-red-100 mb-2">${feedback.title}</p>
                        <ul class="space-y-1 text-sm text-red-800 dark:text-red-200">
                            ${feedback.analysis.map((item) => `<li>• ${item}</li>`).join('')}
                        </ul>
                    </div>

                    <div class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                        <p class="font-bold text-yellow-900 dark:text-yellow-100 mb-2">💊 L'antidote :</p>
                        <p class="text-yellow-800 dark:text-yellow-200">"${feedback.antidote}"</p>
                    </div>
                </div>

                <!-- Better Responses -->
                <div class="dojo-better-responses space-y-3">
                    <h4 class="text-lg font-bold text-slate-900 dark:text-slate-100">
                        ✨ Réponses plus alignées (sans ego) :
                    </h4>
                    ${betterResponses
                        .map(
                            (resp, idx) => `
                        <div class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                            <div class="flex justify-between items-start gap-2 mb-2">
                                <p class="text-sm font-bold text-green-900 dark:text-green-100">
                                    Option ${idx + 1} (Score: ${resp.score}/100)
                                </p>
                                <span class="text-lg">${Array(Math.floor(resp.score / 20))
                                    .fill('⭐')
                                    .join('')}</span>
                            </div>
                            <p class="italic text-green-800 dark:text-green-200 mb-2">
                                "${resp.response}"
                            </p>
                            <p class="text-xs text-green-700 dark:text-green-300">
                                💡 Pourquoi : ${resp.reason}
                            </p>
                        </div>
                    `,
                        )
                        .join('')}
                </div>

                <!-- Key Learning -->
                <div class="bg-slate-100 dark:bg-slate-800 rounded-lg p-4 border-l-4 border-accent-primary">
                    <p class="font-bold text-slate-900 dark:text-slate-100 mb-2">🎯 Clé d'apprentissage :</p>
                    <p class="text-sm text-slate-700 dark:text-slate-300">
                        ${keyLearning || getKeyLearning(displayName)}
                    </p>
                </div>
            </div>
        `;

        modal.show({
            targetId: 'dojo-modal',
            title: `🧗 Dojo : ${isCoupleScenario ? 'Couple' : 'Ego'} ${emoji}`,
            html,
            actions: [
                {
                    label: 'Scénario suivant',
                    variant: 'primary',
                    onClick: () => {
                        const currentIndex = SCENARIOS.findIndex((s) => s.id === currentScenario.id);
                        if (currentIndex < SCENARIOS.length - 1) {
                            startScenario(SCENARIOS[currentIndex + 1].id);
                        } else {
                            showProgressSummary();
                        }
                    },
                },
                {
                    label: 'Menu Dojo',
                    onClick: () => showDojoMenu(),
                },
            ],
        });
    }

    /**
     * Affiche le menu principal du dojo
     */
    function showDojoMenu() {
        const scenariosList = SCENARIOS.map(
            (scenario) => {
                const isCouple = scenario.category === 'Couple';
                const emoji = isCouple ? scenario.patternEmoji : scenario.egoEmoji;
                const name = isCouple ? scenario.pattern : scenario.ego;
                return `
                <button type="button" class="dojo-scenario-button" data-scenario-id="${scenario.id}">
                    <span class="dojo-scenario-emoji">${emoji}</span>
                    <div class="dojo-scenario-info">
                        <p class="font-semibold">${name}</p>
                        <p class="text-sm text-slate-600 dark:text-slate-400">${scenario.title}</p>
                    </div>
                </button>
            `;
            }
        ).join('');

        const html = `
            <div class="space-y-4">
                <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <p class="text-sm text-blue-900 dark:text-blue-100">
                        <strong>Bienvenue au Dojo ! 🧗</strong><br>
                        Ici, tu peux t'entraîner dans des situations réelles sans risque.
                        Chaque scénario te montre ta réponse instinctive (sous ego),
                        puis te propose des alternatives plus alignées.
                    </p>
                </div>

                <div class="dojo-menu space-y-3">
                    ${scenariosList}
                </div>

                <p class="text-xs text-slate-500 dark:text-slate-400 italic">
                    Tip: Complète tous les scénarios pour renforcer tes nouveaux automatismes 🚀
                </p>
            </div>
        `;

        modal.show({
            targetId: 'dojo-modal',
            title: '🧗 Dojo : Choisir un scénario d\'entraînement',
            html,
            actions: [
                {
                    label: 'Fermer',
                    onClick: () => modal.hide('dojo-modal'),
                },
            ],
        });

        // Attach event listeners
        setTimeout(() => {
            document.querySelectorAll('[data-scenario-id]').forEach((btn) => {
                btn.addEventListener('click', () => {
                    startScenario(btn.getAttribute('data-scenario-id'));
                });
            });
        }, 0);
    }

    /**
     * Affiche un résumé de progression
     */
    function showProgressSummary() {
        const completed = SCENARIOS.length;
        const html = `
            <div class="space-y-4">
                <div class="text-center space-y-2">
                    <p class="text-4xl">🎉</p>
                    <h3 class="text-2xl font-bold text-slate-900 dark:text-slate-100">
                        Dojo complété !
                    </h3>
                    <p class="text-slate-600 dark:text-slate-400">
                        Tu as traversé les 5 egos principaux. C'est un excellent entraînement !
                    </p>
                </div>

                <div class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 space-y-2">
                    <p class="font-bold text-green-900 dark:text-green-100">✅ Scénarios complétés: ${completed}/5</p>
                    <p class="text-sm text-green-800 dark:text-green-200">
                        Chaque ego a été rencontré. Ton cerveau a maintenant de nouveaux patterns à utiliser.
                    </p>
                </div>

                <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <p class="font-bold text-blue-900 dark:text-blue-100 mb-2">💡 Prochaines étapes :</p>
                    <ul class="space-y-1 text-sm text-blue-800 dark:text-blue-200">
                        <li>✓ Réfléchis aux scénarios de ta vie réelle</li>
                        <li>✓ Prépare tes réponses AVANT les situations stressantes</li>
                        <li>✓ Reviens au Dojo si tu as besoin d'un refresh</li>
                        <li>✓ Enregistre tes analyses dans le journal</li>
                    </ul>
                </div>
            </div>
        `;

        modal.show({
            targetId: 'dojo-modal',
            title: '🏁 Bravo !',
            html,
            actions: [
                {
                    label: 'Recommencer le Dojo',
                    variant: 'primary',
                    onClick: () => showDojoMenu(),
                },
                {
                    label: 'Fermer',
                    onClick: () => modal.hide('dojo-modal'),
                },
            ],
        });
    }

    /**
     * Retourne un apprentissage clé par ego ou pattern
     */
    function getKeyLearning(egoOrPattern) {
        const learnings = {
            // Individual egos
            'La Défensive':
                'Quand tu te défends, tu bloques l\'écoute. Plutôt : accepte le feedback d\'abord, puis demande clarification.',
            'Le Sauveur':
                'Donner des solutions avant d\'écouter, c\'est ignorer le vrai besoin. D\'abord valider, ensuite co-construire.',
            'Le Martyr':
                'Se sacrifier n\'est pas vertu - c\'est controlant. Traite chaque sujet indépendamment, sans comptabilité.',
            'Le Dernier Mot':
                'Gagner le débat perd la relation. Curiosité avant conviction. Comprendre avant convaincre.',
            "Refus d'influence":
                'Rejeter tout conseil crée l\'isolement. Respecte ta décision ET la sagesse des autres. C\'est possible.',
            // Couple patterns
            'Poursuite-Retrait':
                'Poursuite = peur du rejet. Retrait = peur de l\'intimité. Poursuite intensifiée détruit tout. Pause + invitation douce = seul solution.',
            'Boucle Critique-Défense':
                'La critique attaque CHARACTER. La plainte doux attaque LE PROBLÈME. Une tue la relation. L\'autre peut être résolue.',
            'Partenaire Indifférent':
                'Dismissal est de la peur. Escalade de poursuite crée plus de peur. Seule communication calme et douce peut ouvrir la porte.',
            'Retrait Émotionnel':
                'Stonewalling n\'est pas rejet. C\'est OVERWHELM. Attaquer le shutdown = créer du shutdown chronique. Respecter le break = la seule way.',
            'Déséquilibre de Pouvoir':
                'Pouvoir seul = contrôle = resentment. Pouvoir partagé = partenariat. Partnership requiert que les deux voix comptent.',
            'Choc Attachement':
                'Attachement anxieux interprète l\'indépendance comme rejet. Mais c\'est pas rejet. C\'est besoin. Respecter les deux = partnership.',
            'Mépris (Le Cavalier Dangereux)':
                'Contempt est le plus destructeur. Il tue le respect. Si chronique, sans thérapie, très difficile à réparer. Si rare, on peut parler.',
            'Tentatives de Réparation':
                'Repair attempts matter MORE que le conflit lui-même. Ils peuvent être maladroits. Accepter + guider vers une meilleure réparation = sauvé.',
        };
        return learnings[egoOrPattern] || 'Continue à pratiquer !';
    }

    // Public API
    return {
        open: showDojoMenu,
        startScenario,
    };
}
