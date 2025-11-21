/**
 * 📚 CONCEPT LIBRARY
 * Comprehensive reference for psychological frameworks
 * Status: Foundation for Phase 1 implementation
 *
 * Frameworks covered:
 * - Karpman Triangle (Drama Triangle)
 * - Gottman's 4 Horsemen
 * - Attachment Theory (Bowlby, Ainsworth)
 * - Defense Mechanisms
 * - CNV (Non-Violent Communication)
 * - Relationship Stages
 */

function createConceptLibrary() {
    // ============================================================
    // KARPMAN TRIANGLE (DRAMA TRIANGLE)
    // ============================================================
    const karpmanTriangle = {
        id: 'karpman-triangle',
        name: 'Triangle de Karpman',
        subtitle: 'Le Triangle du Drame',
        description: 'Modèle montrant trois rôles toxiques dans les relations: Victime, Sauveur, Persécuteur',

        roles: {
            victim: {
                name: 'Victime',
                emoji: '😔',
                description: 'Celui qui se sent sans pouvoir, blâme les autres, cherche du secours',
                keyBehaviors: [
                    'Culpabilise les autres pour les faits',
                    'Se dit impuissant ("Je ne peux rien faire")',
                    'Cherche de la sympathie/du secours',
                    'Ignore sa responsabilité',
                ],
                emotionalState: 'Résignation, despoir, passivité',
                inCouples: 'Partenaire qui se sent toujours lésé, qui attend que l\'autre "répare" les choses',
                coupleExample: 'Elle: "Tu ne m\'écoutes jamais. C\'est toujours ta faute si on se dispute."',
                howToEscape: [
                    'Reconnaître sa part de responsabilité',
                    'Identifier les choix qu\'on a (même petits)',
                    'Passer à l\'action plutôt que d\'attendre',
                    'Exprimer ses besoins directement',
                ],
            },

            rescuer: {
                name: 'Sauveur',
                emoji: '🦸',
                description: 'Celui qui aide pour fuir son propre problème, donne sans qu\'on demande, contrôle par l\'aide',
                keyBehaviors: [
                    'Aide sans être demandé',
                    'Ignore les limites de l\'autre',
                    'Utilise l\'aide pour se sentir utile/important',
                    'Se sacrifie puis ressent de la rancœur',
                ],
                emotionalState: 'Besoin de se sentir nécessaire, anxiété',
                inCouples: 'Partenaire qui "gère tout", qui prend en charge, puis se sent non-apprécié',
                coupleExample: 'Lui: "Je sais ce qui est mieux pour toi. Laisse-moi faire." [Puis:] "Après tout ce que j\'ai fait pour toi..."',
                howToEscape: [
                    'Attendre d\'être demandé avant d\'aider',
                    'Respecter l\'autonomie de l\'autre',
                    'Traiter des frontières claires',
                    'Travailler sur son propre besoin d\'être nécessaire',
                ],
            },

            persecutor: {
                name: 'Persécuteur',
                emoji: '🛡️',
                description: 'Celui qui attaque, contrôle par la peur, blâme et juge',
                keyBehaviors: [
                    'Critique et juge durement',
                    'Utilise le blâme comme arme',
                    'Maintient le contrôle par la menace/punishment',
                    'Justifie l\'agression comme "c\'est de ta faute"',
                ],
                emotionalState: 'Colère, besoin de contrôle, frustration',
                inCouples: 'Partenaire critique, controlant, qui utilise la culpabilité',
                coupleExample: 'Lui: "C\'est encore ta faute. Tu es toujours en retard. Tu es vraiment irresponsable."',
                howToEscape: [
                    'Reconnaître la culpabilité de l\'autre n\'est pas ta responsabilité',
                    'Exprimer de la frustration sans attaquer le caractère',
                    'Chercher des solutions plutôt que de blâmer',
                    'Lâcher prise sur le contrôle',
                ],
            },
        },

        theCycle: {
            description: 'Comment les trois rôles s\'entrelacent dans une relation',
            pattern: [
                '1. Persécuteur attaque → Victime se ferme',
                '2. Sauveur intervient ("Ne sois pas dur avec elle")',
                '3. Persécuteur se sent blâmé → devient Victime',
                '4. Sauveur aide Persécuteur → Victime se sent abandonnée',
                '5. Victime attaque Persécuteur → devient Persécuteur elle-même',
                '6. La roue tourne... Le cycle recommence',
            ],
            duration: 'Peut durer des années si non interrompu',
        },

        escapeStrategies: [
            'Reconnaître le rôle qu\'on joue',
            'Identifier le cycle avec le partenaire',
            'Créer des accord pour interrompre le cycle',
            'Passer aux rôles sains: Créateur, Coach, Allié',
        ],
    };

    // ============================================================
    // GOTTMAN'S 4 HORSEMEN OF THE APOCALYPSE
    // ============================================================
    const gottmanHorsemen = {
        id: 'gottman-horsemen',
        name: 'Les 4 Cavaliers de l\'Apocalypse',
        subtitle: 'Predicteurs de rupture relationnelle',
        description: 'John Gottman a identifié 4 patterns de communication qui prédisent la rupture avec 93% d\'exactitude',

        research: {
            accuracy: '93% de précision pour prédire le divorce',
            timeframe: 'Peut prédire dans 5-6 ans',
            hopeful: 'Les antidotes à chaque cavalier peuvent inverser la trajectoire',
        },

        horsemen: {
            criticism: {
                name: 'Critique',
                emoji: '💬',
                rank: '1st Horseman',
                definition: 'Attaquer le CARACTÈRE de son partenaire, pas le COMPORTEMENT',

                examples: {
                    harshCriticism: '"Tu es toujours en retard. Tu es tellement irresponsable et égoïste."',
                    keyDifference: 'La critique = "Tu ES comme ça". La plainte = "Tu AS fait ça"',
                    complaint: '[SAIN] "Tu es arrivé 20 min en retard. J\'étais stressée d\'attendre."',
                },

                consequences: [
                    'Le partenaire se met en défense immédiatement',
                    'Accumulation de ressentiment',
                    'Détérioration de l\'image de soi du partenaire',
                    'Ouverture à la porte du 2e cavalier (Mépris)',
                ],

                antidote: {
                    principle: 'Utilise "I" (Je) + plainte douce + demande',
                    example: 'Je me suis sentie abandonnée quand tu es arrivé en retard. C\'est important pour moi d\'être une priorité. Peux-tu essayer d\'arriver à l\'heure?',
                    steps: [
                        '1. Fais une observation sans jugement',
                        '2. Exprime ton sentiment',
                        '3. Partage ton besoin',
                        '4. Fais une demande spécifique',
                    ],
                },
            },

            contempt: {
                name: 'Mépris',
                emoji: '😒',
                rank: '2nd Horseman (MOST DANGEROUS)',
                definition: 'Communiquer le dégoût, l\'irrespect, la supériorité morale envers le partenaire',

                warningSigns: [
                    'Sarcasme douloureux',
                    'Rouler des yeux',
                    'Voix méchante/méprisante',
                    'Insultes déguisées en humour',
                    'Comparaisons défavorables ("Pourquoi tu es pas comme X?")',
                ],

                examples: {
                    sadSarcasm: '"Oh oui, c\'est genial. Un autre projet que tu ne finiras pas." [Eye roll]',
                    insult: '"Tu es vraiment stupide si tu penses ça."',
                    comparision: '"Mon ex était bien plus organisée que toi."',
                },

                whyDangerous: [
                    'Le seul horseman corrélé avec l\'infection bactérienne (stress physical)',
                    'Crée du dégoût réciproque',
                    'Détruit le respect fond de la relation',
                    'Presque impossible à réparer une fois établi',
                ],

                antidote: {
                    principle: 'Cultiver le respect. Se souvenir pourquoi tu aimais ce personne',
                    steps: [
                        '1. Pause - reconnaître le mépris',
                        '2. Prends un break (15+ min)',
                        '3. Pense aux qualités positives du partenaire',
                        '4. Exprime avec douceur et respect',
                    ],
                    example: '[After break] Je suis frustrée par cette situation, mais je respect ta volonté. Peux-on trouver une solution ensemble?',
                },
            },

            defensiveness: {
                name: 'Défense',
                emoji: '🛡️',
                rank: '3rd Horseman',
                definition: 'Se protéger contre la critique par la contre-attaque, la justification, ou le blâme-inversion',

                examples: {
                    counterAttack: 'Elle: "Tu ne m\'écoutes pas." Lui: "Et toi, tu es toujours en train de te plaindre!"',
                    justification: '"Ce n\'est pas ma faute. C\'est parce que TU..."',
                    blameShifting: '"Je ne suis pas le problème. TU l\'es."',
                },

                consequences: [
                    'Aucune écoute mutuelle ne se produit',
                    'Le problème original n\'est jamais résolu',
                    'Escalade de l\'intensité',
                    'Ouverture au 4e cavalier (Stonewalling)',
                ],

                antidote: {
                    principle: 'Accepter l\'influence du partenaire. Écouter d\'abord',
                    steps: [
                        '1. PAUSE - resiste l\'impulsion de te défendre',
                        '2. Écoute vraiment: "Dit-moi plus"',
                        '3. Reconnais sa perspective (même si tu ne suis pas)',
                        '4. Assume ta part (même 5%)',
                        '5. Cherche une solution ensemble',
                    ],
                    example: '[Pause] Tu as raison. Je ne t\'écoute pas toujours. Dis-moi ce que tu ressentais.',
                },
            },

            stonewalling: {
                name: 'Retrait/Stonewalling',
                emoji: '🧊',
                rank: '4th Horseman (FINAL STAGE)',
                definition: 'Se fermer complètement. Refuser de communiquer. Se retirer émotionnellement',

                examples: [
                    'Silence prolongé (heures, jours)',
                    'Refuser de regarder le partenaire',
                    'Laisser converser sans réponse',
                    'Quitter la pièce sans explication',
                    'Donner des réponses monosyllabiques ("Ok", "Oui", "Non")',
                ],

                whyItHappens: [
                    'Dépassement émotionnel (système nerveux bloqué)',
                    'Tentative de "gagner" en se retirant',
                    'Peur de dire quelque chose d\'encore plus dommageable',
                    'Hopelessness que communiquer ne changera rien',
                ],

                danger: 'C\'est le dernier stade avant la séparation/divorce',

                antidote: {
                    principle: 'Reconnaître l\'overload émotionnel. Prendre un break STRUCTURÉ',
                    steps: [
                        '1. RECONNAIS: "Je suis overload. Je ne peux pas bien communiquer en ce moment."',
                        '2. COMMUNIQUE: "J\'ai besoin d\'une pause de 20 min"',
                        '3. PRENDS UN BREAK: Respire, marche, écoute de la musique',
                        '4. REVIENS: "Je suis prêt à continuer maintenant"',
                        '5. ÉCOUTE: Vraiment écoute cette fois',
                    ],
                    example: 'Je dois prendre une pause. Je me sens dépassé. Dans 20 minutes, j\'aurai la tête plus claire et on pourra en parler.',
                },

                differentFromBreak: 'Un break structuré (avec communication) ≠ Stonewalling (sans communication)',
            },
        },

        theHorsemenCycle: {
            description: 'Comment ils s\'enchaînent généralement',
            progression: [
                '1. Critique fréquente → 2. Mépris se développe',
                '2. Mépris établi → 3. Partner se défend',
                '3. Défense répétée → 4. Stonewalling commence',
                '4. Stonewalling chronique → Séparation/divorce',
            ],
            timeframe: '5-6 ans en moyenne avant rupture',
            hopeful: 'Peut être inversé à n\'importe quel stade avec les antidotes',
        },
    };

    // ============================================================
    // ATTACHMENT THEORY (Bowlby, Ainsworth)
    // ============================================================
    const attachmentTheory = {
        id: 'attachment-theory',
        name: 'Théorie de l\'Attachement',
        subtitle: 'Comment la première relation façonne les relations futures',
        description: 'Modèle développé par John Bowlby & Mary Ainsworth expliquant comment nos premières relations avec les parents façonnent nos relations amoureuses',

        foundation: 'Les enfants développent des patterns d\'attachement qui persiste à l\'âge adulte',

        styles: {
            secure: {
                name: 'Attachement Sécurisé',
                emoji: '💚',
                percentage: '~50% de la population',

                characteristics: [
                    'Confiance en soi et en le partenaire',
                    'Capable d\'intimité ET d\'indépendance',
                    'Communique directement ses besoins',
                    'Gère les conflits sans peur',
                    'Peut soutenir le partenaire sans se perdre',
                ],

                inRelationships: 'Relation équilibrée, flexible, capable d\'adaptation',

                stressResponse: 'Calme, communique, cherche des solutions',

                partnerCompatibility: {
                    secureWithSecure: 'Excellent - le match idéal',
                    secureWithAnxious: 'Très bon - le sécurisé rassure l\'anxieux',
                    secureWithAvoidant: 'Bon - le sécurisé laisse de l\'espace',
                },
            },

            anxious: {
                name: 'Attachement Anxieux',
                emoji: '💛',
                percentage: '~20% de la population',

                characteristics: [
                    'Besoin fréquent de réassurance',
                    'Peur du rejet/abandon',
                    'Clinging behaviors',
                    'Hypervigilance aux signaux du partenaire',
                    'Difficult to self-soothe',
                    'Peut être jealous/controlling',
                ],

                triggers: [
                    'Partenaire distant/occupé',
                    'Manque de communication',
                    'Critique ou rejet perçu',
                    'Partenaire avec autres amis',
                ],

                stressResponse: 'Pursue, demand reassurance, escalate to get attention',

                couplePattern: 'Pursue-Withdraw (when with avoidant partner)',

                healingPath: [
                    'Développer la confiance en soi indépendamment',
                    'Pratiquer l\'auto-apaisement (self-soothing)',
                    'Communiquer les besoins de manière claire (non clinging)',
                    'Construire la sécurité interne',
                ],
            },

            avoidant: {
                name: 'Attachement Évitant',
                emoji: '💙',
                percentage: '~25% de la population',

                characteristics: [
                    'Valeur exagérée de l\'indépendance',
                    'Inconfortable avec intimité profonde',
                    'Minimise les besoins émotionnels',
                    'Se retire quand trop d\'émotion',
                    'Peut avoir du mal à exprimer les sentiments',
                    'Distance émotionnelle',
                ],

                triggers: [
                    'Demandes d\'intimité émotionnelle',
                    'Conflit direct',
                    'Besoin du partenaire',
                    'Vulnérabilité attendue',
                ],

                stressResponse: 'Withdraw, shutdown, stay rational/logical',

                couplePattern: 'Withdraw-Pursue (when with anxious partner)',

                healingPath: [
                    'Pratiquer la vulnérabilité graduellement',
                    'Identifier pourquoi l\'intimité est menaçante',
                    'Construire la sécurité émotionnelle',
                    'Apprendre à exprimer les émotions',
                ],
            },

            fearfulAvoidant: {
                name: 'Attachement Peur-Évitant (Désorganisé)',
                emoji: '💜',
                percentage: '~5% de la population',

                characteristics: [
                    'Conflit: veut l\'intimité + a peur d\'elle',
                    'Alternates between pursuing and withdrawing',
                    'Peut être passif-agressif',
                    'Difficultés à maintenir des relations stables',
                    'Tend vers les relations chaotiques',
                ],

                triggers: 'Situations d\'intimité + conflict',

                stressResponse: 'Push-Pull (approach then withdraw then approach)',

                healingPath: [
                    'Thérapie fortement recommandée',
                    'Identifier les blessures sources',
                    'Construire une relation sûre d\'abord avec un partenaire sécurisé',
                    'Apprendre à réguler les émotions',
                ],
            },
        },

        coupleCompatibilities: {
            description: 'Comment les styles interagissent en couple',

            pairings: [
                {
                    pair: 'Anxious + Avoidant',
                    pattern: 'Pursue-Withdraw Dance',
                    dynamic: 'L\'anxieux poursuit, l\'évitant se retire, la poursuite s\'intensifie, le retrait s\'intensifie',
                    difficulty: 'TRÈS difficile sans travail conscient',
                    resolution: 'Chacun doit comprendre les besoins de l\'autre + s\'adapter graduellement',
                },
                {
                    pair: 'Secure + Any',
                    pattern: 'Stabilisateur',
                    dynamic: 'Le sécurisé fournit la stabilité nécessaire',
                    difficulty: 'Plus facile - le sécurisé peut adapter',
                    resolution: 'Le partenaire non-sécurisé peut graduellement "upregulate" vers la sécurité',
                },
                {
                    pair: 'Anxious + Anxious',
                    pattern: 'Mutual Chase',
                    dynamic: 'Tous les deux ont besoin de réassurance, personne ne peut la fournir',
                    difficulty: 'Volatile - bonne passion mais peu de stabilité',
                    resolution: 'Besoin d\'apprendre l\'auto-apaisement ensemble',
                },
            ],
        },
    };

    // ============================================================
    // DEFENSE MECHANISMS
    // ============================================================
    const defensesMechanisms = {
        id: 'defense-mechanisms',
        name: 'Mécanismes de Défense Inconscients',
        subtitle: 'Comment nous nous protégeons émotionnellement',
        description: 'Stratégies inconscientes que nous utilisons pour nous protéger de l\'anxiété, de la douleur ou de la vérité inconfortable',

        mechanisms: {
            projection: {
                name: 'Projection',
                description: 'Attribuer tes propres sentiments/intentions au partenaire',

                example: 'Toi: "Tu ne m\'aimes pas" (quand en réalité TU as peur que personne ne t\'aime)',

                inCouples: [
                    'Accuser le partenaire de faire ce que TU fais',
                    '"Tu me trompes" (quand toi tu es tenté)',
                    '"Tu ne m\'écoutes pas" (quand toi tu ne veux pas écouter)',
                ],

                recognition: 'Tu dis à ton partenaire quelque chose qui te décrit toi-même',

                whatToDo: [
                    'Pause - demande-toi: "Est-ce que c\'est vraiment lui/elle?"',
                    'Regarde ta propre responsabilité',
                    'Communique avec curiosité, pas accusation',
                ],
            },

            denial: {
                name: 'Déni',
                description: 'Refuser d\'accepter une vérité inconfortable',

                examples: [
                    'Partenaire infidèle mais tu refuses de le voir',
                    'Relation abusive mais tu dis "c\'est normal"',
                    'Problème d\'alcool chez le partenaire mais tu l\'ignores',
                ],

                inCouples: 'Ne pas reconnaître les patterns problématiques, rester dans une situation mauvaise',

                recognition: 'Tu ignores des preuves évidentes d\'un problème',

                whatToDo: [
                    'Cherche du support externe (amis, thérapeute)',
                    'Reconnais les faits, pas les sentiments',
                    'Prends la responsabilité de tes choix',
                ],
            },

            rationalization: {
                name: 'Rationalisation',
                description: 'Expliquer ton comportement problématique de manière logique/acceptable',

                examples: [
                    '"Je l\'ai fait pour son bien" (quand ce n\'était pas vrai)',
                    '"C\'est normal de flirter avec d\'autres" (justifier l\'infidélité)',
                    '"Je devais mentir pour le protéger" (justifier le mensonge)',
                ],

                inCouples: 'Tu te justifies continuellement au lieu d\'accepter ton erreur',

                recognition: 'Tu as une explication logique-sounding pour chaque erreur',

                whatToDo: [
                    'Demande à un ami honnête: "Est-ce que c\'est vraiment une bonne raison?"',
                    'Accepte la responsabilité sans explication',
                    'Dis: "J\'ai eu tort, et voici ce que je vais faire différemment"',
                ],
            },

            displacement: {
                name: 'Déplacement',
                description: 'Rediriger ta colère/frustration d\'une source à une cible "sûre"',

                examples: [
                    'Fâché au travail, tu cries après le partenaire à la maison',
                    'Contrarié par ton patron, tu critiques ton partenaire',
                    'Rejeté par quelqu\'un, tu punishis ton partenaire',
                ],

                inCouples: 'Ton partenaire devient le "punching bag" pour d\'autres frustrations',

                recognition: 'Tes réactions semblent disproportionnées à la situation',

                whatToDo: [
                    'Pause - reconnaître que ce n\'est pas juste ta situation actuelle',
                    'Nomme la vraie source de ta frustration',
                    'Dis au partenaire: "Je suis fâché(e), mais ce n\'est pas à cause de toi"',
                ],
            },

            regression: {
                name: 'Régression',
                description: 'Revenir à des comportements enfantins quand tu es stressé',

                examples: [
                    'Bouder au lieu de communiquer',
                    'Avoir une crise de larmes au lieu de parler',
                    'Agir de manière puérile pour éviter un problème',
                    'Demander au partenaire de te "materner"',
                ],

                inCouples: 'Le partenaire se sent parent plutôt que partenaire',

                recognition: 'Tu comportement change radicalement avec le stress',

                whatToDo: [
                    'Reconnais: "Je suis en mode enfant maintenant"',
                    'Prends un break, reviens à l\'adulte en toi',
                    'Communique à partir de ton "adult self"',
                ],
            },

            passiveAggression: {
                name: 'Agression Passive',
                description: 'Exprimer la colère indirectement plutôt que directement',

                examples: [
                    '"D\'accord, tout va bien" (mais clairement rien ne va)',
                    'Oublier intentionnellement de faire quelque chose',
                    'Faire lentement/mal une tâche que tu as acceptée',
                    'Silence prolongé quand tu es fâché(e)',
                    'Sourire jaune face au critique',
                ],

                inCouples: 'Le partenaire ne sait jamais ce que tu ressens vraiment',

                recognition: 'Tu dis oui mais tu agis non',

                whatToDo: [
                    'Sois honnête: "Je suis fâché(e) à propos de..."',
                    'Exprime directement plutôt que indirectement',
                    'Dis non clairement si tu ne veux pas',
                ],
            },
        },

        inConflict: {
            description: 'Reconnaître quand tu utilises un mécanisme de défense',
            signs: [
                'Tu ne prends jamais la responsabilité',
                'Tu as toujours une explication',
                'Tu blâmes toujours le partenaire',
                'Tu n\'entends jamais le partenaire',
                'Tu utilises l\'humour pour éviter les émotions',
                'Tu intellectualizes au lieu de ressentir',
            ],

            breakingThePattern: [
                '1. PAUSE - Reconnaître que c\'est un mécanisme',
                '2. RESPIRE - Reprendre le contrôle émotionnel',
                '3. RECONNAIS - "Je défends maintenant"',
                '4. LÂCHE - Lâche prise sur le besoin de te défendre',
                '5. COMMUNIQUE - Fais connaitre ce que tu ressens vraiment',
            ],
        },
    };

    // ============================================================
    // CNV - NON-VIOLENT COMMUNICATION
    // ============================================================
    const cnv = {
        id: 'cnv',
        name: 'Communication Non-Violente (CNV)',
        subtitle: 'Le modèle de Rosenberg',
        description: 'Un framework pour exprimer tes besoins et résoudre des conflits sans attaquer ou blesser',

        structure: [
            '1. OBSERVATION - Ce qui s\'est réellement passé (sans jugement)',
            '2. SENTIMENT - Comment ça t\'a fait se sentir (l\'émotion)',
            '3. BESOIN - Quel besoin n\'a pas été satisfait',
            '4. DEMANDE - Ce que tu veux qui se passe maintenant (spécifique)',
        ],

        example: {
            aggressive: '"Tu ne m\'écoutes JAMAIS! Tu es tellement égoïste!"',
            cnv: '"Quand tu regardes ton téléphone pendant que je parle [OBSERVATION], je me sens non-entendue [SENTIMENT] parce que j\'ai besoin de connexion et d\'attention [BESOIN]. Pourrais-tu ranger ton téléphone quand je parle? [DEMANDE]"',
        },

        keyPrinciples: [
            'Pas de blâme ou jugement',
            'Centré sur TON expérience, pas sur leur défaut',
            'Clé: exprimer les besoins plutôt que les demandes',
            'L\'autre a aussi des besoins - CNV fonctionne mieux en dialogue',
        ],

        feelings: {
            description: 'Vocabulaire pour exprimer tes sentiments',
            list: [
                'Heureux(se), joyeux(se), content(e)',
                'Triste, découragé(e), déçu(e)',
                'Fâché(e), frustré(e), irrité(e)',
                'Apeuré(e), anxieux(se), nerveux(se)',
                'Blessé(e), touché(e), vulnérable',
                'Confus(e), perdu(e), insécurisé(e)',
            ],
        },

        needs: {
            description: 'Vocabulaire pour exprimer tes besoins',
            categories: [
                'Connexion, attention, compréhension',
                'Respect, autonomie, liberté',
                'Sécurité, confiance, stabilité',
                'Sens de l\'objectif, croissance, apprentissage',
                'Beauté, créativité, plaisir',
                'Honnêteté, intégrité, authenticité',
            ],
        },

        whenItWorks: [
            'Quand les deux personnes veulent vraiment comprendre',
            'Quand tu exprimes TON expérience (pas l\'accusation)',
            'Quand tu écoutes aussi les besoins du partenaire',
            'Quand il y a de la bonne volonté de résoudre',
        ],

        whenItDoesnt: [
            'Si le partenaire n\'écoute pas',
            'Si c\'est manipulé pour contrôler',
            'Si utilisé comme "technique" plutôt que authentique',
            'Si les besoins de base ne sont pas respectés (sécurité physique)',
        ],
    };

    // ============================================================
    // RELATIONSHIP STAGES
    // ============================================================
    const relationshipStages = {
        id: 'relationship-stages',
        name: 'Les Étapes de la Relation',
        subtitle: 'La relation change avec le temps',
        description: 'Toute relation passe par des étapes prévisibles. Comprendre où vous êtes est clé',

        stages: [
            {
                name: 'Lune de Miel',
                duration: '6-24 mois',
                characteristics: [
                    'Chimie intense, attraction',
                    'Tout semble parfait',
                    'Beaucoup de passion et d\'optimisme',
                    'Les défauts du partenaire sont ignorés/minimisés',
                ],
                needs: 'Profite - construis la fondation du respect et de la confiance',
                dangers: 'Ne pas construire de vraies structures (communication, limites)',
            },
            {
                name: 'Complacence / Réalité',
                duration: '2-5 ans',
                characteristics: [
                    'La chimie diminue',
                    'Les défauts deviennent visibles',
                    'Les incompatibilités émergent',
                    'Les premiers conflits sérieux',
                ],
                needs: 'Gérer les attentes, communiquer sur les différences',
                dangers: 'Déception, critique, possible infidélité',
            },
            {
                name: 'Crise',
                duration: 'Variable (peut être une situation unique ou chronique)',
                characteristics: [
                    'Grand conflit ou accumulation de conflits',
                    'Sentiment d\'éloignement',
                    'Doute sur la relation',
                    'Moments de intimité rares',
                ],
                needs: 'Communication honnête, possiblement thérapie, clarifier les valeurs communes',
                dangers: 'Infidélité, séparation si non-addressée',
            },
            {
                name: 'Réévaluation',
                duration: '6-12 mois',
                characteristics: [
                    'Décision consciente: rester ou partir?',
                    'Si rester: "Je choisis cette personne ET ce travail"',
                    'Clarification des valeurs communes',
                    'Nouvelle compréhension du partenaire',
                ],
                needs: 'Accepter le choix activement, lâcher les attentes de "lune de miel"',
                dangers: 'Fuir sans résoudre les patterns',
            },
            {
                name: 'Croissance / Intimité Profonde',
                duration: 'Peut être des années',
                characteristics: [
                    'Acceptation réelle du partenaire (pas parfait)',
                    'Intimité plus profonde et significative',
                    'Equipe plutôt que concurrents',
                    'Capable de traverser les tempêtes ensemble',
                ],
                needs: 'Continuer d\'investir dans la relation',
                dangers: 'Routine devient stagnation si pas conscients',
            },
        ],

        whichStageAreYou: {
            description: 'Identifier votre stage permet de savoir quel travail est nécessaire',
            questions: [
                'Voir les défauts du partenaire ou les ignorer encore?',
                'Avez-vous des conflits réguliers?',
                'Pensez-vous à la séparation?',
                'Avez-vous une intimité profonde ou vous sentez déconnectés?',
                'Êtes-vous une équipe ou des compétiteurs?',
            ],
        },
    };

    // ============================================================
    // PUBLIC API
    // ============================================================
    return {
        // Access frameworks
        getFramework: (id) => {
            const frameworks = {
                'karpman-triangle': karpmanTriangle,
                'gottman-horsemen': gottmanHorsemen,
                'attachment-theory': attachmentTheory,
                'defense-mechanisms': defensesMechanisms,
                'cnv': cnv,
                'relationship-stages': relationshipStages,
            };
            return frameworks[id] || null;
        },

        getAllFrameworks: () => ({
            karpmanTriangle,
            gottmanHorsemen,
            attachmentTheory,
            defensesMechanisms,
            cnv,
            relationshipStages,
        }),

        // Get specific role/style/mechanism
        getKarpmanRole: (role) => karpmanTriangle.roles[role],
        getHorseman: (name) => {
            const horsemenMap = {
                'criticism': gottmanHorsemen.horsemen.criticism,
                'contempt': gottmanHorsemen.horsemen.contempt,
                'defensiveness': gottmanHorsemen.horsemen.defensiveness,
                'stonewalling': gottmanHorsemen.horsemen.stonewalling,
            };
            return horsemenMap[name];
        },
        getAttachmentStyle: (style) => attachmentTheory.styles[style],
        getDefenseMechanism: (mechanism) => defensesMechanisms.mechanisms[mechanism],

        // Search
        search: (query) => {
            const lowerQuery = query.toLowerCase();
            const results = [];

            // Simple search across frameworks
            Object.values({
                karpmanTriangle,
                gottmanHorsemen,
                attachmentTheory,
                defensesMechanisms,
                cnv,
                relationshipStages,
            }).forEach(framework => {
                if (framework.name.toLowerCase().includes(lowerQuery) ||
                    framework.description.toLowerCase().includes(lowerQuery)) {
                    results.push({
                        type: 'framework',
                        framework: framework.name,
                        id: framework.id,
                    });
                }
            });

            return results;
        },
    };
}

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = createConceptLibrary;
}
