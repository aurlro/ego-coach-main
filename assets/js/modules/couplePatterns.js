/**
 * 💑 COUPLE CONFLICT PATTERNS LIBRARY
 * Recognition and intervention strategies for common couple dynamics
 *
 * Provides:
 * - 15+ documented couple patterns
 * - Warning signs for each
 * - How/why they develop
 * - Intervention points
 * - Recovery strategies
 */

function createCouplePatternLibrary() {
    // ============================================================
    // CORE COUPLE PATTERNS
    // ============================================================

    const patterns = {
        // Pattern 1: Pursue-Withdraw
        pursueWithdraw: {
            id: 'pursue-withdraw',
            name: 'Poursuite-Retrait',
            emoji: '🏃‍♀️🏃‍♂️',
            frequency: 'MOST COMMON - 80% of couples experience this',

            description: 'One partner pursues closeness/resolution while the other withdraws from conflict',

            dynamics: {
                pursuer: {
                    role: 'Pursuer (often Anxious Attachment)',
                    behaviors: [
                        'Demands conversation ("We need to talk NOW")',
                        'Escalates intensity to get response',
                        'Interprets withdrawal as rejection',
                        'Becomes more demanding as other withdraws more',
                    ],
                    feelings: 'Desperate, panicked, rejected, unheard',
                    triggers: 'Partner\'s distance, lack of response, perceived indifference',
                },
                withdrawer: {
                    role: 'Withdrawer (often Avoidant Attachment)',
                    behaviors: [
                        'Avoids conversation ("I\'m not talking about this now")',
                        'Leaves the room or goes silent',
                        'Minimizes the issue ("It\'s not a big deal")',
                        'Appears calm/rational (actually overwhelmed)',
                    ],
                    feelings: 'Overwhelmed, invaded, controlled, defensive',
                    triggers: 'Intensity, emotional demand, feeling trapped, pressure',
                },
            },

            theReinforcingCycle: [
                '1. Pursuer brings up issue → Withdrawer steps back',
                '2. Withdrawer retreats → Pursuer feels rejected',
                '3. Pursuer escalates to be heard → Withdrawer retreats more',
                '4. Withdrawer shuts down completely → Pursuer panics',
                '5. Pursuer attacks with criticism → Withdrawer stonewalls',
                '6. Cycle reinforces: "They never want to talk" vs "They\'re always attacking"',
            ],

            consequences: [
                'Nothing ever gets resolved',
                'Resentment builds on both sides',
                'Disconnection deepens',
                'Eventually: infidelity or separation',
            ],

            interventionPoints: [
                '**PURSUER\'S ROLE:** Slow down. Take a break. Invite, don\'t demand.',
                '**WITHDRAWER\'S ROLE:** Don\'t abandon. Communicate availability: "I\'m overwhelmed now. Let\'s talk at 8pm."',
                '**BOTH:** Name the pattern: "We\'re doing the pursue-withdraw thing again."',
                '**BOTH:** Agree on structure: When/how will you talk?',
            ],

            repairScript: [
                'WITHDRAWER (soft restart): "I need a break, but I care about resolving this. Can we talk in 30 min?"',
                'PURSUER (accepts): "Okay. That helps me. I\'ll wait. Thank you for committing to talk."',
                '[30 min later]',
                'PURSUER (gentler): "I want to understand your perspective. What am I missing?"',
                'WITHDRAWER (opens up): "I felt attacked. I wasn\'t trying to avoid you..."',
            ],

            howLongBefore: 'Can last years if unaddressed. Can be interrupted immediately with awareness.',
        },

        // Pattern 2: Critic-Defended
        criticDefended: {
            id: 'critic-defended',
            name: 'Critique-Défense',
            emoji: '⚔️',
            frequency: 'VERY COMMON - The Gottman "First Two Horsemen" pattern',

            description: 'One partner chronically criticizes while the other chronically defends',

            dynamics: {
                critic: {
                    role: 'Critic',
                    behaviors: [
                        'Finds what\'s wrong constantly',
                        'Attacks character, not behavior ("You\'re lazy, not "You left the dishes")',
                        'Feels morally superior ("I have to manage everything")',
                        'No appreciation for what works',
                    ],
                    feelings: 'Frustrated, burdened, unappreciated, superior',
                    underlyingNeed: 'Respect and partnership (just expressing it wrong)',
                },
                defended: {
                    role: 'Defended',
                    behaviors: [
                        'Immediately counter-attacks ("Well you always...")',
                        'Makes excuses without listening',
                        'Never admits fault ("That\'s not fair")',
                        'Becomes increasingly shut down',
                    ],
                    feelings: 'Attacked, blamed, inadequate, resentful',
                    underlyingNeed: 'To be accepted and valued as-is',
                },
            },

            theCycle: [
                '1. Critic points out failure → Defended feels attacked',
                '2. Defended defends → Critic feels not heard',
                '3. Critic escalates criticism → Defended escalates defense',
                '4. Relationship becomes adversarial ("You vs Me")',
                '5. Connection is lost. Both feel right. Neither feels heard.',
            ],

            consequences: [
                'Constant conflict',
                'Defended increasingly shuts down or becomes passively aggressive',
                'Critic\'s needs never get met (because they\'re asking wrong)',
                'Eventually: contempt develops',
            ],

            interventionPoints: [
                '**CRITIC\'S ROLE:** Shift from judgment to request. "I feel stressed when X. I need Y."',
                '**DEFENDED\'S ROLE:** Don\'t defend. Listen. Find what\'s true (even 5%).',
                '**BOTH:** Remember: You\'re on the same team. The problem is the pattern, not the person.',
                '**BOTH:** Use "we" language: "We have a communication pattern we\'re stuck in."',
            ],

            repairScript: [
                'CRITIC (reframe): "I realize I\'ve been criticizing a lot. What I really need is to feel like a team. Can we work together?"',
                'DEFENDED (opens): "I hear you. I haven\'t felt like we\'re a team either. What would help?"',
                'CRITIC: "When you forget things, I feel like I have to control everything. I need your partnership."',
                'DEFENDED (listens): "I get that. I want to be a partner. Tell me specifically what would help?"',
            ],

            prevention: 'Notice criticism EARLY. Switch to complaint format: "When X happens, I feel Y, I need Z."',
        },

        // Pattern 3: Victim-Rescuer-Persecutor (Karpman Triangle)
        karpmanCycle: {
            id: 'karpman-cycle',
            name: 'Cycle Victime-Sauveur-Persécuteur',
            emoji: '🔄',
            frequency: 'COMMON in certain couples (esp. codependent dynamics)',

            description: 'Partners rotate through Karpman Triangle roles: Victim → Rescuer → Persecutor',

            example: {
                setup: 'Wife is stressed (Victim). Husband swoops in (Rescuer). Wife resents being "managed" (becomes Persecutor). Husband feels betrayed (becomes Victim). Wife becomes frustrated with his sadness (becomes Persecutor/Critic). Cycle restarts.',

                pattern: [
                    'Wife: "I\'m so stressed. I can\'t handle this." (VICTIM)',
                    'Husband: "Don\'t worry, I\'ll fix it." Takes over. (RESCUER)',
                    'Wife: "You always take over! You don\'t respect my ability." (PERSECUTOR)',
                    'Husband: "I was just trying to help! You\'re so ungrateful." (becomes VICTIM)',
                    'Wife: "You\'re so weak. Why can\'t you handle criticism?" (PERSECUTOR)',
                    '[Cycle repeats]',
                ],
            },

            consequences: [
                'Neither partner feels truly heard',
                'Respect is lost (rescuer sees victim as weak, victim sees rescuer as controlling)',
                'Power dynamics become unhealthy',
                'Eventually: role-reversal can create confusion and resentment',
            ],

            interventionPoints: [
                '**VICTIM:** Stop seeking rescue. Develop self-agency. "I can handle this. I\'ll ask if I need help."',
                '**RESCUER:** Stop rescuing. Let them struggle. Respect their competence.',
                '**BOTH:** Name when it\'s happening. "We\'re in the triangle right now."',
                '**BOTH:** Agree: No unsolicited help. Ask before helping.',
            ],

            escapeStrategy: [
                'Victim becomes Creator (takes ownership + asks for help when needed)',
                'Rescuer becomes Coach (supports without taking over)',
                'Persecutor becomes Leader (takes responsibility for their part)',
            ],
        },

        // Pattern 4: Dismissive-Pursuer (Anxious-Avoidant Attachment)
        dismissiveIssuer: {
            id: 'dismissive-pursuer',
            name: 'Indifférent-Poursuivant',
            emoji: '😶‍🌫️',
            frequency: 'COMMON in later-stage relationships where connection is lost',

            description: 'One partner dismisses concerns while the other pursues validation and connection',

            dynamics: [
                'Partner A: "I\'m worried about us. I feel disconnected." (Pursuer)',
                'Partner B: "You\'re overthinking. We\'re fine." (Dismisser)',
                'Partner A: "But I need more connection!" (Pursues harder)',
                'Partner B: "You\'re too needy. Just let it be." (More dismissive)',
                'Partner A (hurt): "You don\'t care about me!" (Accusation)',
                'Partner B (defensive): "That\'s not true. You\'re being dramatic." (Shutdown)',
            ],

            consequences: [
                'Pursuer feels unseen and unimportant',
                'Dismisser feels controlled and pressured',
                'Connection erodes',
                'Pursuer may seek connection elsewhere',
            ],

            interventionPoints: [
                '**PURSUER:** Express needs without pressure. "I need to feel connected. What\'s realistic for you?"',
                '**DISMISSER:** Listen to the feeling beneath the complaint. "I hear you. I care about you."',
                '**BOTH:** Schedule connection time. Make it predictable so both can relax.',
            ],
        },

        // Pattern 5: Conflict Avoidant Both
        conflictAvoidantBoth: {
            id: 'conflict-avoidant-both',
            name: 'Les Deux Évitent le Conflit',
            emoji: '🤫',
            frequency: 'COMMON but often hidden - couples don\'t realize it\'s a problem',

            description: 'Neither partner addresses issues. Problems accumulate silently.',

            characteristics: [
                'No visible conflict',
                'Partners are "nice" to each other',
                'But nothing real gets discussed',
                'Resentment builds invisibly',
                'Until one day: explosion or quiet separation',
            ],

            danger: 'Looks healthy but is actually disconnected. Issues never get resolved.',

            interventionPoints: [
                'Create "safe structure" for conversations',
                'Start small with low-stakes topics',
                'Build tolerance for minor disagreement',
                'Realize: Some conflict is HEALTHY',
            ],

            repair: [
                'Set a "state of the union" meeting monthly',
                'Start with: "Something I appreciate about us is..."',
                'Then: "Something I\'d like to discuss is..."',
                'Not attacking. Just naming.',
            ],
        },

        // Pattern 6: Combative-Withdrawn
        combativeWithdrawn: {
            id: 'combative-withdrawn',
            name: 'Combattif-Retiré',
            emoji: '😠🤐',
            frequency: 'DANGEROUS - Often leads to separation',

            description: 'One partner attacks while the other withdraws. Both feel victimized.',

            dynamics: [
                'Combative: Attacks, criticizes, pursues',
                'Withdrawn: Shuts down, stonewalls, refuses engagement',
                'Combative: Escalates because no response',
                'Withdrawn: More shut down because more pressure',
                'Result: Complete disconnection',
            ],

            consequences: [
                'No communication possible',
                'Both feel unheard',
                'No resolution ever happens',
                'Often leads to separation',
            ],

            interventionPoints: [
                'Professional help usually needed',
                'Both must recognize the pattern',
                'Both must commit to stopping (even if temporary)',
                'Use structured time to talk (therapist-assisted)',
            ],

            criticalWarning: 'This pattern is associated with relationship dissolution',
        },

        // Pattern 7: Emotional Enmeshment
        emotionalEnmeshment: {
            id: 'emotional-enmeshment',
            name: 'Fusion Émotionnelle',
            emoji: '🔗',
            frequency: 'COMMON in early-stage relationships or codependent couples',

            description: 'Partners lose sense of individual identity. Everything is "we" and no space for "me".',

            characteristics: [
                'No separate friends or interests',
                'Panic if apart',
                'Difficulty knowing own feelings vs partner\'s',
                'Codependency dynamics',
                'Lack of healthy boundaries',
            ],

            longTermConsequence: 'When merged partners eventually differentiate, it feels like betrayal',

            interventionPoints: [
                'Maintain individual friendships',
                'Have separate hobbies/interests',
                'Practice: "What do I want?" separately from partner',
                'Create intentional alone time',
            ],
        },

        // Pattern 8: Power & Control
        powerControl: {
            id: 'power-control',
            name: 'Pouvoir et Contrôle',
            emoji: '👑',
            frequency: 'CONCERNING - Often precursor to abuse',

            description: 'One partner dominates decisions, finances, social connections, or information',

            warningFlags: [
                'One person always decides for both',
                'Other person has to ask for money/permission',
                'One controls who other can see',
                'Information is withheld',
                'Decisions are made unilaterally',
            ],

            redFlag: 'This can escalate to emotional or physical abuse',

            interventionPoints: [
                'Must be addressed immediately',
                'Both need to agree: partnership means shared power',
                'If not willing, professional help or separation needed',
            ],

            hopeful: 'If partner recognizes and wants to change, it\'s possible. If they don\'t see issue, leave.',
        },

        // Pattern 9: Perfectionist-Relaxed
        perfectionistRelaxed: {
            id: 'perfectionist-relaxed',
            name: 'Perfectionniste-Décontracté',
            emoji: '⚙️😌',
            frequency: 'COMMON and often not recognized as a problem',

            description: 'One partner has high standards while other is more relaxed. Constant friction over "right way".',

            dynamics: [
                'Perfectionist: "The kitchen is a mess!"',
                'Relaxed: "It\'s fine. We\'ll get to it."',
                'Perfectionist: "It\'s NOT fine. It bothers me!"',
                'Relaxed: "You\'re too uptight. Learn to relax."',
                'Neither understands the other\'s perspective',
            ],

            realIssue: 'Not about dishes. It\'s about: respect, standards, control, self-worth',

            interventionPoints: [
                '**PERFECTIONIST:** Examine: Why do standards matter so much? Is it really the dishes or is it control?',
                '**RELAXED:** Show respect for their values: "I know this matters to you."',
                '**BOTH:** Compromise zones: "We\'ll do it your way 3x/week, my way 2x/week"',
                '**BOTH:** Separate spaces: "This is your domain, that\'s mine"',
            ],
        },

        // Pattern 10: Provider-Dependent
        providerDependent: {
            id: 'provider-dependent',
            name: 'Pourvoyeur-Dépendant',
            emoji: '💼👶',
            frequency: 'COMMON especially in traditional dynamics',

            description: 'One partner is breadwinner/provider while other is dependent (financially, emotionally, or both)',

            imbalances: [
                'Financial control by provider',
                'Emotional dependence on provider',
                'Lack of individual agency by dependent',
                'Provider feeling burdened',
                'Dependent feeling infantilized',
            ],

            longTermIssue: 'Resentment builds on both sides as autonomy suffers',

            interventionPoints: [
                'Dependent: Develop financial literacy and independence',
                'Provider: Share decision-making power',
                'Both: Value both contributions (earning + homemaking/caregiving)',
                'Both: Move toward interdependence, not dependence',
            ],
        },

        // Pattern 11: Infidelity Recovery Stalemate
        infidelityStalemate: {
            id: 'infidelity-stalemate',
            name: 'Impasse Infidélité',
            emoji: '💔',
            frequency: 'DEVASTATING when it occurs',

            description: 'After infidelity, couple is stuck: one wants to move past it, other can\'t trust',

            dynamics: [
                'Betrayed: "How can I trust you again?" (repeatedly)',
                'Betrayer: "I\'ve said I\'m sorry 100 times! Move on!" (frustrated)',
                'Betrayed: "You don\'t understand my pain!" (escalates)',
                'Betrayer: "You\'ll never forgive me." (gives up)',
                'Result: Stuck in blame/shame cycle or separation',
            ],

            realIssue: 'Not about forgiveness. It\'s about: rebuilding trust, addressing why it happened, re-commitment',

            interventionPoints: [
                'Betrayer: Must accept long recovery time (12-24 months or more)',
                'Betrayer: Must be willing to be transparent',
                'Betrayer: Must address root cause (insecurity, selfishness, etc.)',
                'Betrayed: Must decide: Can I forgive? Do I want to rebuild?',
                'Both: Professional help almost always needed',
            ],

            question: 'Is this relationship worth saving? Both must truly choose yes.',
        },

        // Pattern 12: Parent-Child Dynamics
        parentChild: {
            id: 'parent-child',
            name: 'Dynamique Parent-Enfant',
            emoji: '👨‍👧',
            frequency: 'COMMON and often unconscious',

            description: 'One partner takes parent role (controlling, managing) while other takes child role (passive, dependent)',

            manifestations: [
                'One decides what\'s "best" for other',
                'Other follows direction without question',
                'One corrects/criticizes the other',
                'Other seeks approval',
                'Lack of equality and partnership',
            ],

            consequence: 'No passion/intimacy. Can become resentful.',

            interventionPoints: [
                'Parent: Release control. Respect autonomy.',
                'Child: Make own decisions. Advocate for self.',
                'Both: Recognize it. Choose equality.',
            ],
        },

        // Pattern 13: Unfinished Business
        unfinishedBusiness: {
            id: 'unfinished-business',
            name: 'Affaires Non Réglées',
            emoji: '🧳',
            frequency: 'VERY COMMON - Often invisible',

            description: 'Unresolved issues from past (past relationships, family, trauma) play out in current relationship',

            examples: [
                'He had an unavailable parent → abandonment fear → pursues frantically',
                'She had controlling parent → rebels against any guidance → defensive',
                'He was cheated on before → sees infidelity everywhere → suspicious',
                'She was abandoned → afraid to speak needs → bottled up',
            ],

            consequence: 'Partners react to ghosts, not to each other',

            interventionPoints: [
                'Personal therapy recommended',
                'Recognize: This pattern belongs to my past, not my partner',
                'Partner: Don\'t take it personally. Support healing.',
                'Both: Communicate: "When you X, I react as if Y from my past"',
            ],
        },

        // Pattern 14: Sexual Mismatch
        sexualMismatch: {
            id: 'sexual-mismatch',
            name: 'Désaccord Sexuel',
            emoji: '💕',
            frequency: 'COMMON but often not discussed',

            description: 'Partners have different sexual needs, frequency desires, or preferences',

            manifestations: [
                'One wants sex daily, other wants weekly',
                'One wants emotional connection first, other wants physical',
                'One has fetishes other doesn\'t share',
                'One initiated a lot, other is passive',
                'One feels rejected, other feels pressured',
            ],

            consequence: 'Resentment. Either pursuing or withdrawing sexually.',

            interventionPoints: [
                'Talk about it (even though uncomfortable)',
                'Explore: Is it mismatched desire or fear/shame?',
                'Find middle ground that works for both',
                'Consider: Sex therapist if serious mismatch',
                'Remember: Intimacy is not just sex',
            ],
        },

        // Pattern 15: Unequal Household/Emotional Labor
        unequalLabor: {
            id: 'unequal-labor',
            name: 'Travail Inégal',
            emoji: '⚖️',
            frequency: 'EXTREMELY COMMON - Especially affects women',

            description: 'One partner (usually woman) does majority of household and emotional labor while other (usually man) is oblivious',

            manifestations: [
                'One plans, organizes, remembers everything',
                'Other does tasks if asked but never initiates',
                'One manages kids, school, doctor, etc.',
                'Other just "helps" occasionally',
                'One person carries mental load',
                'Other person is "free"',
            ],

            consequence: [
                'Resentment from overburdened partner',
                'Guilt from guilt-free partner (or no guilt)',
                'Relationship feels unequal/unfair',
                'Often precursor to separation',
            ],

            interventionPoints: [
                'Name the invisible labor',
                'Equal partnership means equal household responsibility',
                'Divide explicitly: Who owns what?',
                'Both must initiate, not wait to be asked',
                'Emotional labor counts (planning, remembering, managing)',
            ],

            criticalPoint: 'This is correlated with infidelity and divorce',
        },
    };

    // ============================================================
    // PATTERN MATCHER (Identify which pattern you\'re in)
    // ============================================================

    function identifyPattern(description) {
        const keywords = {
            'pursue-withdraw': ['pursuing', 'withdrawing', 'distance', 'chase', 'space', 'pressure', 'pulling away'],
            'critic-defended': ['criticism', 'defended', 'attack', 'counter-attack', 'blame', 'defensive'],
            'karpman-cycle': ['victim', 'rescuer', 'saved', 'victim-blaming', 'martyr', 'savior'],
            'dismissive-pursuer': ['dismissed', 'invalid', 'needy', 'you\'re overthinking', 'connection'],
            'conflict-avoidant-both': ['never fight', 'silent', 'passive-aggressive', 'no conflict'],
            'combative-withdrawn': ['attacks', 'stonewalls', 'shuts down', 'explosive', 'cold'],
            'emotional-enmeshment': ['no space', 'merged', 'dependent', 'codependent', 'lost myself'],
            'power-control': ['control', 'decides', 'permission', 'financial', 'isolates'],
            'perfectionist-relaxed': ['standards', 'messy', 'uptight', 'lazy', 'organize'],
            'provider-dependent': ['breadwinner', 'dependent', 'support', 'financial'],
            'infidelity-stalemate': ['cheating', 'infidelity', 'trust', 'affair'],
            'parent-child': ['parent', 'child', 'manage', 'decide', 'correct'],
            'unfinished-business': ['fear', 'abandonment', 'trust', 'control', 'past'],
            'sexual-mismatch': ['sex', 'intimacy', 'frequency', 'desire'],
            'unequal-labor': ['housework', 'labor', 'mental load', 'fair', 'tasks'],
        };

        const matches = {};
        const lowerDesc = description.toLowerCase();

        for (const [patternId, keywords_list] of Object.entries(keywords)) {
            const matchCount = keywords_list.filter(keyword =>
                lowerDesc.includes(keyword)
            ).length;

            if (matchCount > 0) {
                matches[patternId] = {
                    patternId,
                    pattern: patterns[patternId],
                    matchScore: matchCount,
                };
            }
        }

        // Sort by match score
        const sorted = Object.values(matches)
            .sort((a, b) => b.matchScore - a.matchScore)
            .slice(0, 3);

        return sorted;
    }

    // ============================================================
    // PATTERN PROGRESSION (Is it getting worse?)
    // ============================================================

    function assessPatternSeverity(pattern, frequencyEstimate) {
        /*
        frequencyEstimate: "daily", "weekly", "monthly", "rarely"
        Returns: severity score 0-100 + recommendation
        */

        const frequencies = {
            'daily': 90,
            'several-times-week': 75,
            'weekly': 60,
            'monthly': 40,
            'rarely': 20,
        };

        const severity = frequencies[frequencyEstimate] || 50;

        return {
            severity,
            recommendation: severity > 70 ? 'Urgent: Professional help recommended' :
                severity > 50 ? 'Concerning: Address this pattern soon' :
                'Minor: Can be addressed with awareness',
            trajectory: 'If not addressed, will likely worsen',
        };
    }

    // ============================================================
    // PUBLIC API
    // ============================================================

    return {
        getPattern: (patternId) => patterns[patternId],
        getAllPatterns: () => patterns,
        listPatternNames: () => Object.entries(patterns).map(([id, p]) => ({
            id,
            name: p.name,
            emoji: p.emoji,
            frequency: p.frequency,
        })),

        identify: identifyPattern,
        assessSeverity: assessPatternSeverity,

        // Search/filter
        findByFrequency: (keyword) => {
            return Object.entries(patterns)
                .filter(([id, p]) => p.frequency.includes(keyword))
                .map(([id, p]) => ({ id, ...p }));
        },

        demo: () => {
            console.log('=== COUPLE PATTERNS LIBRARY DEMO ===\n');
            console.log('Available patterns:');
            Object.entries(patterns).forEach(([id, p]) => {
                console.log(`${p.emoji} ${p.name} (${id})`);
            });
        },
    };
}

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = createCouplePatternLibrary;
}
