/**
 * 💚 ATTACHMENT STYLES MODULE
 * Assessment, understanding, and compatibility analysis for attachment styles
 *
 * Provides:
 * - Attachment style assessment
 * - Detailed profiles for each style
 * - Compatibility matrix (which styles work well together)
 * - Trigger identification
 * - Healing pathways
 */

function createAttachmentStylesModule() {
    // ============================================================
    // ATTACHMENT QUIZ
    // ============================================================

    const assessmentQuestions = [
        {
            id: 'q1',
            question: 'When your partner is distant or seems busy, you typically...',
            answers: [
                {
                    text: 'Feel secure in the relationship and give them space',
                    style: 'secure',
                    score: 0,
                },
                {
                    text: 'Feel anxious and want immediate reassurance',
                    style: 'anxious',
                    score: 1,
                },
                {
                    text: 'Withdraw and give them even more space',
                    style: 'avoidant',
                    score: 1,
                },
                {
                    text: 'Feel confused and uncertain how to respond',
                    style: 'fearful',
                    score: 1,
                },
            ],
        },
        {
            id: 'q2',
            question: 'In conflicts, you usually...',
            answers: [
                {
                    text: 'Try to understand their perspective and find solutions',
                    style: 'secure',
                    score: 0,
                },
                {
                    text: 'Get very upset and fear the relationship is ending',
                    style: 'anxious',
                    score: 1,
                },
                {
                    text: 'Want to be left alone and avoid discussion',
                    style: 'avoidant',
                    score: 1,
                },
                {
                    text: 'Get defensive but then withdraw',
                    style: 'fearful',
                    score: 1,
                },
            ],
        },
        {
            id: 'q3',
            question: 'When your partner expresses a need for space or alone time, you...',
            answers: [
                {
                    text: 'Respect it and do your own thing',
                    style: 'secure',
                    score: 0,
                },
                {
                    text: 'Feel hurt and wonder if they still love you',
                    style: 'anxious',
                    score: 1,
                },
                {
                    text: 'Feel relieved and actually prefer it',
                    style: 'avoidant',
                    score: 1,
                },
                {
                    text: 'Feel confused about whether to support it or worry',
                    style: 'fearful',
                    score: 1,
                },
            ],
        },
        {
            id: 'q4',
            question: 'How do you feel about deep emotional conversations?',
            answers: [
                {
                    text: 'Comfortable and able to share authentically',
                    style: 'secure',
                    score: 0,
                },
                {
                    text: 'Eager to share but worry about being judged',
                    style: 'anxious',
                    score: 1,
                },
                {
                    text: 'Uncomfortable and prefer to keep things light',
                    style: 'avoidant',
                    score: 1,
                },
                {
                    text: 'Want to but also feel scared and defensive',
                    style: 'fearful',
                    score: 1,
                },
            ],
        },
        {
            id: 'q5',
            question: 'If your partner forgot your birthday, you would...',
            answers: [
                {
                    text: 'Assume it was an honest mistake and talk about it calmly',
                    style: 'secure',
                    score: 0,
                },
                {
                    text: 'Feel devastated and question if they love you',
                    style: 'anxious',
                    score: 1,
                },
                {
                    text: 'Not really care and act like it doesn\'t matter',
                    style: 'avoidant',
                    score: 1,
                },
                {
                    text: 'Feel hurt but hide it, then bring it up later in an accusatory way',
                    style: 'fearful',
                    score: 1,
                },
            ],
        },
    ];

    function calculateAttachmentStyle(answers) {
        const styleScores = {
            secure: 0,
            anxious: 0,
            avoidant: 0,
            fearful: 0,
        };

        answers.forEach(answer => {
            styleScores[answer.style] += answer.score;
        });

        // Determine primary style
        let primaryStyle = 'secure';
        let maxScore = styleScores.secure;

        Object.entries(styleScores).forEach(([style, score]) => {
            if (score > maxScore) {
                maxScore = score;
                primaryStyle = style;
            }
        });

        return {
            primary: primaryStyle,
            scores: styleScores,
            breakdown: Object.entries(styleScores).map(([style, score]) => ({
                style,
                percentage: Math.round((score / Math.max(...Object.values(styleScores), 1)) * 100),
            })),
        };
    }

    // ============================================================
    // DETAILED STYLE PROFILES
    // ============================================================

    const styleProfiles = {
        secure: {
            name: 'Attachement Sécurisé',
            emoji: '💚',
            percentage: '50% of population',
            color: '#10b981',

            overview: 'You feel comfortable with both intimacy and independence. You can communicate your needs directly and handle relationship challenges with flexibility.',

            coreBeliefs: [
                'I\'m worthy of love',
                'Others are generally trustworthy',
                'Relationships are safe places',
                'I can handle conflicts',
                'Both closeness and independence are okay',
            ],

            strengths: [
                'Healthy communication skills',
                'Can regulate own emotions',
                'Comfortable with intimacy',
                'Can support partner without losing self',
                'Views conflict as resolvable',
                'Seeks solutions, not blame',
                'Can be vulnerable without shame',
            ],

            inConflict: 'You listen, consider other perspective, admit your part, seek solutions',

            inIntimacy: 'You\'re present, open, and can maintain sense of self',

            triggers: [
                'Persistent betrayal or dishonesty',
                'Chronic emotional unavailability',
                'Abuse or disrespect',
            ],

            underStress: [
                'May become slightly anxious (normal)',
                'May need a bit more reassurance (understandable)',
                'Still able to communicate and seek connection',
            ],

            healtPathPath: 'You\'re already there! Maintain awareness and continue healthy patterns.',

            parentingBackground: 'Likely had responsive, consistent caregivers who validated emotions',

            relationshipPatterns: 'Typically choose secure or anxious partners (can help anxious heal)',

            commonCoupleType: 'Secure-Secure (best match) or Secure-Anxious (very good)',
        },

        anxious: {
            name: 'Attachement Anxieux',
            emoji: '💛',
            percentage: '20% of population',
            color: '#f59e0b',

            overview: 'You crave closeness and reassurance. You may worry about your partner\'s feelings toward you and can be hypervigilant to signs of rejection.',

            coreBeliefs: [
                'Others will eventually leave me',
                'I\'m not enough on my own',
                'I need to be loved to be worthy',
                'Closeness is urgent (now, not later)',
                'If I\'m not careful, I\'ll lose them',
            ],

            triggers: [
                'Partner working late',
                'Phone not answered immediately',
                'Partner spending time with friends',
                'Perceived emotional distance',
                'Changes in communication patterns',
                'Partner needing space',
            ],

            stressResponse: [
                'Pursue (demand reassurance)',
                'Escalate (make situation more intense)',
                'Test (create conflict to see if they\'ll stay)',
                'Cling (become more dependent)',
            ],

            inConflict: 'You get very emotional, escalate to get response, may threaten separation',

            inIntimacy: 'You crave constant contact, need frequent reassurance, may feel incomplete without partner',

            strengths: [
                'Deeply caring about relationship',
                'Good at expressing emotions (though sometimes intensely)',
                'Committed and loyal',
                'Quick to notice relationship issues',
                'Desire for deep connection',
                'Willing to work on relationship',
            ],

            challenges: [
                'Hypervigilance to rejection signals',
                'Difficulty self-soothing',
                'Pursuing behavior pushes partners away',
                'Black-and-white thinking ("They don\'t love me" vs "They love me perfectly")',
                'May attract avoidant partners (who trigger more anxiety)',
            ],

            healingPath: [
                '1. SELF-SOOTHING: Learn to calm yourself without partner validation',
                '2. SELF-WORTH: Build identity independent of relationship',
                '3. COMMUNICATE NEEDS: Ask directly instead of pursuing/testing',
                '4. TRUST: Practice believing partner cares even when not in contact',
                '5. SPACE: Enjoy time with friends, alone, doing hobbies',
                '6. THERAPY: Work on childhood attachment wounds',
            ],

            parentingBackground: 'Often had inconsistent or anxious caregivers. Sometimes overbearing, sometimes neglectful.',

            relationshipPatterns: 'Often attract avoidant partners (anxiety + avoidance = pursue-withdraw cycle)',

            compatibilityAdvice: 'Best with Secure (who can provide reassurance) or another Anxious (mutual understanding)',

            avoidPartners: 'Avoidant partners will make your anxiety WORSE. The pattern will be devastating.',

            redFlag: 'If you find yourself constantly pursuing an avoidant partner, it\'s worth questioning',
        },

        avoidant: {
            name: 'Attachement Évitant',
            emoji: '💙',
            percentage: '25% of population',
            color: '#3b82f6',

            overview: 'You\'re comfortable with independence and uncomfortable with emotional intimacy. You may withdraw when things get too close or intense.',

            coreBeliefs: [
                'I\'m fine on my own',
                'Relationships are suffocating',
                'Emotions are inconvenient',
                'Independence is safety',
                'Intimacy = loss of control',
                'Others will make demands on me',
            ],

            triggers: [
                'Partner wanting emotional conversation',
                'Pressure for more time together',
                'Emotional expression or vulnerability',
                'Discussion of future/commitment',
                'Partner\'s neediness',
                'Feeling "pinned down"',
            ],

            stressResponse: [
                'Withdraw emotionally',
                'Become logical/rational',
                'Minimize importance',
                'Create distance (literally or emotionally)',
                'Get critical to push away',
            ],

            inConflict: 'You shut down, minimize the issue, refuse to engage emotionally',

            inIntimacy: 'You may feel uncomfortable, need lots of space, may seem emotionally distant',

            strengths: [
                'Self-reliant and independent',
                'Good at problem-solving alone',
                'Can stay calm under pressure',
                'Often successful (put energy into work/hobbies instead of relationship)',
                'Can be rational and logical',
            ],

            challenges: [
                'Difficulty expressing emotions',
                'Withdrawing when partner needs support',
                'Appearing cold or indifferent',
                'Difficulty with commitment or planning future',
                'May attract anxious partners (who trigger more avoidance)',
                'Relationships feel hollow to partner even if "peaceful"',
            ],

            healingPath: [
                '1. EMOTIONAL AWARENESS: Start noticing your feelings (not just thoughts)',
                '2. GRADUAL VULNERABILITY: Practice small acts of vulnerability',
                '3. SLOW OPENING: Share feelings with safe people first',
                '4. REDEFINE INTIMACY: Closeness doesn\'t equal loss of self',
                '5. PRACTICE PRESENCE: Stay present even when uncomfortable',
                '6. THERAPY: Work on childhood attachment wounds (why connection feels unsafe)',
            ],

            parentingBackground: 'Often had distant, critical, or emotionally unavailable caregivers',

            relationshipPatterns: 'Often attract anxious partners (avoidance triggers their pursuit)',

            compatibilityAdvice: 'Best with Secure (who doesn\'t demand intimacy but invites it gently)',

            avoidPartners: 'Two avoidants together = no connection (peaceful but lonely)',

            criticalRealization: 'Your withdrawal isn\'t protecting you - it\'s isolating you',
        },

        fearful: {
            name: 'Attachement Peur-Évitant (Désorganisé)',
            emoji: '💜',
            percentage: '5% of population',
            color: '#a855f7',

            overview: 'You want closeness but are afraid of it. You alternate between pursuing and withdrawing, creating confusion for you and your partner.',

            coreBeliefs: [
                'I want connection but it\'s not safe',
                'People will hurt me if I let them close',
                'I can\'t handle being vulnerable',
                'Love is dangerous',
                'I\'m unlovable and dangerous to others',
            ],

            triggers: [
                'Moments of real intimacy',
                'Conflict (especially after closeness)',
                'Partner trying to get close',
                'Feeling controlled OR feeling abandoned',
                'Any trigger that activates anxiety or avoidance',
            ],

            stressResponse: [
                'Push-pull (approach then withdraw then approach)',
                'Passive-aggressive behavior',
                'Sabotage when things go well',
                'Create drama to regain control',
                'Blame-shame cycles',
            ],

            inConflict: 'You might attack, then shut down, then pursue, then attack again (chaotic)',

            inIntimacy: 'You desire it but freeze, withdraw, or act distant after getting it',

            strengths: [
                'Deep desire for connection (not jaded)',
                'Can recognize patterns better than others',
                'Often highly sensitive and intuitive',
                'Passionate about relationships',
            ],

            challenges: [
                'Relationships feel chaotic to both partners',
                'Difficult to maintain stability',
                'Hard for partners to understand your needs',
                'Often ends in dramatic separations',
                'High risk of substance abuse or self-harm',
                'May cycle between relationships quickly',
                'Often appears "crazy" to outside observers',
            ],

            healingPath: [
                '1. PROFESSIONAL SUPPORT: Therapy is highly recommended (not optional)',
                '2. UNDERSTAND WOUNDS: Work on childhood trauma (where fear came from)',
                '3. SAFETY FIRST: Build sense of safety before pursuing intimate relationships',
                '4. PATTERN RECOGNITION: Learn to recognize when you\'re about to sabotage',
                '5. SELF-COMPASSION: Stop judging yourself for the push-pull',
                '6. STABILITY: Create stable routines and support systems',
                '7. RELATIONSHIPS: Only pursue with secure or understanding partner (not fearful or avoidant)',
            ],

            parentingBackground: 'Usually had chaotic, unpredictable, or traumatic caregiving. Sometimes abuse present.',

            relationshipPatterns: 'Often attract drama, toxicity, or other fearful partners',

            compatibilityAdvice: 'Best with Secure (if secure partner has patience) or with therapist support',

            avoidPartners: 'Other fearful-avoidants = chaos. Avoidants = withdraw too much. Anxious = make worse.',

            hopefulMessage: 'This is the most challenging attachment style, but healing is absolutely possible with professional support',
        },
    };

    // ============================================================
    // COMPATIBILITY MATRIX
    // ============================================================

    const compatibilityMatrix = {
        'secure-secure': {
            compatibility: 'EXCELLENT',
            description: 'The ideal match. Both partners can communicate, handle conflicts, and maintain healthy balance.',
            pros: [
                'Natural communication',
                'Both can self-soothe',
                'Balanced closeness/independence',
                'Conflicts are manageable',
                'Mutual respect and trust',
            ],
            challenges: 'Rarely any significant issues',
            likelihood: 'High success rate',
            advice: 'Maintain the foundation. Keep communicating. Don\'t take security for granted.',
        },

        'secure-anxious': {
            compatibility: 'VERY GOOD',
            description: 'The secure partner provides stability while the anxious partner learns that reassurance is consistently available.',
            pros: [
                'Secure can provide reassurance without feeling controlled',
                'Anxious can learn security from stable partner',
                'Secure partner\\\'s calmness helps anxious regulate',
                'Relationship can be deeply connected',
            ],
            challenges: [
                'Secure may feel like they\'re managing emotions',
                'Secure may eventually tire of reassuring',
                'Anxious may not believe reassurance (needs to work on trust)',
            ],
            likelihood: 'Good success rate if secure partner is patient',
            advice: 'Anxious: Work on self-soothing. Secure: Be consistent with reassurance but set boundaries.',
        },

        'secure-avoidant': {
            compatibility: 'GOOD',
            description: 'The secure partner respects independence while gently inviting connection. Avoidant can learn that closeness is safe.',
            pros: [
                'Secure doesn\'t demand more than avoidant can give',
                'Avoidant has space but also connection',
                'Secure can provide model of healthy relating',
                'Often works well long-term',
            ],
            challenges: [
                'Secure may eventually want more emotional intimacy',
                'Avoidant may never fully open up',
                'Risk of relationship feeling "peaceful but empty"',
            ],
            likelihood: 'Can work well if both commit',
            advice: 'Avoidant: Gradually practice vulnerability. Secure: Keep inviting connection gently.',
        },

        'anxious-avoidant': {
            compatibility: 'VERY DIFFICULT',
            description: 'This is the classic "Pursue-Withdraw" cycle. Anxious\'s pursuit triggers avoidant\'s withdrawal, which triggers more anxiety.',
            pros: [
                'Initial attraction can be intense',
                'Passion can be high early on',
            ],
            challenges: [
                'The more anxious pursues, the more avoidant withdraws',
                'Never resolves (each person\'s coping makes it worse)',
                'Cycle usually ends in separation',
                'Both feel misunderstood and hurt',
                'Rarely ends in healthy connection',
            ],
            likelihood: 'High failure rate without professional intervention',
            advice: 'Only pursue this if BOTH are willing to work with a therapist. The pattern is deeply reinforcing.',
            warning: 'This is the most common "toxic" couple pairing.',
        },

        'anxious-anxious': {
            compatibility: 'VOLATILE',
            description: 'Two anxiously attached people who both need reassurance but can\'t fully provide it to each other.',
            pros: [
                'Mutual understanding of need for reassurance',
                'High emotional connection',
                'Passionate relationship',
                'Both invest heavily in relationship',
            ],
            challenges: [
                'Both need reassurance, neither can truly give it',
                'Conflicts can be very intense and emotional',
                'Codependency risk',
                'Either explosive fights or enmeshment',
                'Can spiral into blame and shame',
            ],
            likelihood: 'Unpredictable - can be very good or very bad',
            advice: 'Both must learn self-soothing. Consider couples therapy for stability.',
        },

        'avoidant-avoidant': {
            compatibility: 'DISCONNECTED',
            description: 'Two avoidantly attached people who both want space, resulting in a peaceful but emotionally empty relationship.',
            pros: [
                'No drama or conflict',
                'Both respect independence',
                'Can be very stable',
                'Low emotional demands',
            ],
            challenges: [
                'Lack of emotional intimacy',
                'Can feel very lonely while "together"',
                'No vulnerability or deep connection',
                'Relationship feels hollow',
                'Often end not with conflict but with quiet separation',
            ],
            likelihood: 'Stable but unfulfilling',
            advice: 'Both should work on opening up. Consider whether you want more emotional connection.',
        },

        'fearful-secure': {
            compatibility: 'CHALLENGING BUT POSSIBLE',
            description: 'Can work if secure partner has patience and understanding. Fearful partner needs to be working on healing.',
            pros: [
                'Secure can provide stability for fearful partner',
                'Fearful can feel safe to heal',
                'Possible for deep growth',
            ],
            challenges: [
                'Secure may get hurt by fearful\'s push-pull',
                'Secure must not enable self-sabotage',
                'Requires massive patience from secure partner',
            ],
            likelihood: 'Good if fearful is committed to healing',
            advice: 'Fearful: Get professional support. Secure: Set boundaries on behavior.',
        },

        'fearful-other': {
            compatibility: 'VERY DIFFICULT',
            description: 'Fearful with any other style tends to create chaos or reinforces dysfunction.',
            general: 'Fearful works best with Secure (if they\'re willing). With Anxious = too much emotion. With Avoidant = too much confusion. With Fearful = chaos.',
            advice: 'If you\'re fearful-avoidant, prioritize personal healing before pursuing relationships. Work with a therapist.',
        },
    };

    // ============================================================
    // TRIGGER IDENTIFICATION
    // ============================================================

    function identifyTriggers(style) {
        return styleProfiles[style].triggers;
    }

    // ============================================================
    // PUBLIC API
    // ============================================================

    return {
        // Assessment
        getQuestions: () => assessmentQuestions,
        calculateStyle: calculateAttachmentStyle,

        // Profiles
        getProfile: (style) => styleProfiles[style],
        getAllProfiles: () => styleProfiles,

        // Compatibility
        getCompatibility: (style1, style2) => {
            const key1 = `${style1}-${style2}`;
            const key2 = `${style2}-${style1}`;
            return compatibilityMatrix[key1] || compatibilityMatrix[key2] || null;
        },
        getCompatibilityMatrix: () => compatibilityMatrix,

        // Triggers
        getTriggers: identifyTriggers,

        // Utilities
        getStyleColor: (style) => styleProfiles[style].color,
        getStyleEmoji: (style) => styleProfiles[style].emoji,
        getStyleName: (style) => styleProfiles[style].name,

        // Demo
        demo: () => {
            console.log('=== ATTACHMENT STYLES DEMO ===\n');
            console.log('Sample assessment:');
            const answers = assessmentQuestions.map(q => q.answers[0]);
            const result = calculateAttachmentStyle(answers);
            console.log(`Result: ${result.primary}`);
            console.log(`Scores:`, result.scores);
        },
    };
}

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = createAttachmentStylesModule;
}
