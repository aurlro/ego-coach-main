/**
 * 🐴 GOTTMAN PATTERNS DETECTOR
 * Detects the 4 Horsemen of the Apocalypse in communication
 *
 * Provides:
 * - Pattern detection from text
 * - Severity scoring
 * - Antidotes
 * - Educational insights
 */

function createGottmanPatternDetector() {
    // ============================================================
    // PATTERN MARKERS (Keywords, phrases, tone indicators)
    // ============================================================

    const patternMarkers = {
        // CRITICISM - Attacking CHARACTER not behavior
        criticism: {
            keywords: [
                'always', 'never', 'you\'re', 'you are', 'so', 'such',
                'stupid', 'idiot', 'incompetent', 'irresponsible',
                'selfish', 'lazy', 'terrible', 'horrible',
            ],
            patterns: [
                /you (always|never|constantly)/i,
                /you('re|are) (so|such).*(bad|terrible|horrible|lazy|stupid|selfish)/i,
                /you (always|never) .*(do|make|forget|mess)/i,
            ],
            signatures: [
                'character attack (not behavior)',
                'generalization across time',
                'negative trait assignment',
            ],
        },

        // CONTEMPT - Toxic disrespect & superiority
        contempt: {
            keywords: [
                'pathetic', 'disgusting', 'ridiculous', 'loser', 'idiot',
                'moron', 'jerk', 'bitch', 'asshole', 'fool',
            ],
            patterns: [
                /you('re|are) (pathetic|disgusting|ridiculous|a loser|an idiot)/i,
                /\[sarcasm\]/i,
                /obviously you/i,
                /of course you/i,
                /typical you/i,
            ],
            signatures: [
                'disdain & disgust tone',
                'mocking/sarcastic',
                'superiority',
                'dehumanizing language',
            ],
        },

        // DEFENSIVENESS - Counter-attack instead of listening
        defensiveness: {
            keywords: [
                'but', 'yet', 'however', 'it\'s not my fault',
                'you\'re the one', 'what about you', 'at least i',
                'excuse me', 'that\'s not fair', 'that\'s not true',
            ],
            patterns: [
                /but (you|she|he|they)/i,
                /it('s not my fault|'s not my problem)/i,
                /you('re|are) the one (who|that)/i,
                /what about you\?|what about me\?/i,
                /at least i/i,
            ],
            signatures: [
                'counter-attack',
                'blame-reversal',
                'justification without listening',
                'whataboutism',
            ],
        },

        // STONEWALLING - Emotional withdrawal
        stonewalling: {
            keywords: [
                'whatever', 'fine', 'i don\'t care', 'i\'m done',
                'leave me alone', 'not talking about this',
                'not going to discuss', 'end of discussion',
            ],
            patterns: [
                /^(whatever|fine|i don't care)$/i,
                /i'm (done|out|leaving)/i,
                /(leave|stop) (me|it)/i,
                /not (talking|discussing|going to|dealing)/i,
            ],
            signatures: [
                'communication shutdown',
                'emotional withdrawal',
                'refusal to engage',
                'dismissal',
            ],
        },
    };

    // ============================================================
    // DETECTION ENGINE
    // ============================================================

    function detectPatterns(text) {
        if (!text || typeof text !== 'string' || text.trim().length === 0) {
            return {
                detected: [],
                severity: 0,
                isConcerning: false,
            };
        }

        const lowerText = text.toLowerCase();
        const detected = [];
        let totalScore = 0;

        // Check each pattern type
        for (const [patternName, markers] of Object.entries(patternMarkers)) {
            let score = 0;

            // Check regex patterns
            for (const pattern of markers.patterns) {
                if (pattern.test(text)) {
                    score += 25;
                }
            }

            // Check keywords
            for (const keyword of markers.keywords) {
                if (lowerText.includes(keyword.toLowerCase())) {
                    score += 10;
                }
            }

            // Normalize score to 0-100
            score = Math.min(score, 100);

            if (score > 0) {
                detected.push({
                    type: patternName,
                    score: score,
                    confidence: score > 50 ? 'high' : score > 25 ? 'medium' : 'low',
                    signatures: markers.signatures,
                });
                totalScore += score;
            }
        }

        // Normalize total severity
        const avgSeverity = detected.length > 0 ? Math.round(totalScore / detected.length) : 0;

        return {
            detected: detected.sort((a, b) => b.score - a.score),
            severity: avgSeverity,
            isConcerning: avgSeverity > 50 || detected.length > 1,
        };
    }

    // ============================================================
    // ANTIDOTE PROVIDER
    // ============================================================

    const antidotes = {
        criticism: {
            principle: 'Replace character attack with specific behavior complaint',
            template: 'I felt [FEELING] when [SPECIFIC BEHAVIOR]. What I\'d like is [SPECIFIC REQUEST]',
            examples: [
                {
                    harsh: '"You\'re always late. You\'re so irresponsible!"',
                    antidote: '"You were 20 minutes late today. I felt frustrated because I was waiting. Can you try to arrive on time?"',
                    why: 'Focuses on behavior (specific & changeable) not character (global & unchangeable)',
                },
                {
                    harsh: '"You never listen to me. You\'re so selfish."',
                    antidote: '"I didn\'t feel heard during our conversation. I need you to look at me and repeat what I said. Can you do that?"',
                    why: 'Specific behavior + clear request vs. global judgment',
                },
            ],

            steps: [
                '1. Observe: What specific behavior bothered you?',
                '2. Feel: What emotion did it trigger?',
                '3. Request: What do you want them to do instead?',
                '4. Communicate: "When you [behavior], I feel [emotion]. I need [request]"',
            ],
        },

        contempt: {
            principle: 'Cultivate respect. Remember why you loved this person.',
            template: 'Pause. Remember the positive qualities. Express with respect.',
            examples: [
                {
                    harsh: '"You\'re pathetic. I\'m so disgusted by you."',
                    antidote: '[Take a 15-minute break] "I\'m frustrated, but I respect you and your intentions. Can we talk about what\'s wrong?"',
                    why: 'Breaks the disdain cycle. Reframes with respect.',
                },
                {
                    harsh: '"That\'s ridiculous. Obviously you don\'t understand anything."',
                    antidote: '[Pause] "I see this differently. Help me understand your perspective?"',
                    why: 'Curiosity instead of judgment. Assumes best intent.',
                },
            ],

            steps: [
                '1. STOP: Recognize the contempt',
                '2. BREAK: Take 15+ minutes away',
                '3. REMEMBER: Think of 3 positive things about your partner',
                '4. RESET: Come back and communicate with respect',
                '5. TALK: "I\'m frustrated, but I care about you and us"',
            ],

            warning: 'Contempt is the most dangerous horseman. If you feel it regularly, professional help is recommended.',
        },

        defensiveness: {
            principle: 'Accept influence. Listen first. Assume good intent.',
            template: 'Pause. Really listen. Find what\'s true in what they said.',
            examples: [
                {
                    harsh: 'She: "You never listen to me." Him: "That\'s not true! You\'re always complaining!"',
                    antidote: 'He: [Pause] "You\'re right. I wasn\'t really listening just now. Tell me again what you meant?"',
                    why: 'Accepts feedback instead of defending. Shows willingness to change.',
                },
                {
                    harsh: '"It\'s not my fault! You\'re the one who always brings up the past!"',
                    antidote: '"I hear you. I also hear that you\'re upset. What do you need from me right now?"',
                    why: 'Acknowledges their feeling. Takes ownership.',
                },
            ],

            steps: [
                '1. RESIST: Don\'t counter-attack',
                '2. LISTEN: Really hear what they\'re saying',
                '3. ACCEPT: Find what\'s true (even 5%)',
                '4. ASSUME: They\'re not trying to hurt you',
                '5. RESPOND: "You\'re right about [X]. I can do better with [Y]"',
            ],
        },

        stonewalling: {
            principle: 'Communicate your overwhelm. Take a structured break.',
            template: 'I\'m overloaded. I need a break. I\'ll come back at [TIME] when I can think clearly.',
            examples: [
                {
                    harsh: '[Silence. Refusing to engage. Leaving the room without explanation.]',
                    antidote: '"I\'m feeling overloaded right now. I need to take a 20-minute break. Let\'s talk at 8pm when I can think clearly."',
                    why: 'Communicates the overwhelm instead of shutting down. Commits to returning.',
                },
                {
                    harsh: '"Whatever. I don\'t care. Leave me alone."',
                    antidote: '"I care about this, but I can\'t talk about it right now. I\'m too upset. Can we revisit in 30 minutes?"',
                    why: 'Shows you care while respecting your emotional limits. Creates safety for both.',
                },
            ],

            steps: [
                '1. RECOGNIZE: My system is overwhelmed',
                '2. COMMUNICATE: "I need a break. Not shutting down, but I need space."',
                '3. TAKE BREAK: 20-30 minutes. Breathe, walk, listen to music.',
                '4. RETURN: "I\'m back. Let\'s try again."',
                '5. LISTEN: Really listen to them this time',
            ],

            keyDifference: 'Structured break (with communication) ≠ Stonewalling (complete shutdown)',
        },
    };

    function getAntidote(patternType) {
        return antidotes[patternType] || null;
    }

    // ============================================================
    // EDUCATION MODE
    // ============================================================

    function educateOnPattern(patternType) {
        const conceptLib = createConceptLibrary();
        const horseman = conceptLib.getHorseman(patternType);
        return horseman;
    }

    // ============================================================
    // ANALYSIS REPORT
    // ============================================================

    function analyzeAndExplain(text) {
        const detection = detectPatterns(text);

        if (detection.detected.length === 0) {
            return {
                status: 'healthy',
                message: 'No Gottman patterns detected. This is healthy communication.',
                severity: 0,
            };
        }

        const primaryPattern = detection.detected[0];
        const antidote = getAntidote(primaryPattern.type);

        return {
            status: detection.isConcerning ? 'concerning' : 'minor',
            severity: detection.severity,
            patterns: detection.detected,
            primaryPattern: primaryPattern.type,
            analysis: {
                type: primaryPattern.type,
                severity: primaryPattern.score,
                confidence: primaryPattern.confidence,
                description: `This communication shows signs of "${primaryPattern.type}".`,
                whyProblematic: antidote.whyProblematic || antidote.principle,
            },
            antidote: antidote,
            education: educateOnPattern(primaryPattern.type),
        };
    }

    // ============================================================
    // PATTERN PROGRESSION (Tracking if getting worse)
    // ============================================================

    function detectEscalationPattern(texts) {
        if (!Array.isArray(texts) || texts.length < 2) {
            return { escalating: false };
        }

        const severities = texts.map(text => {
            const detection = detectPatterns(text);
            return detection.severity;
        });

        // Check if severity is increasing
        let escalating = true;
        for (let i = 1; i < severities.length; i++) {
            if (severities[i] < severities[i - 1]) {
                escalating = false;
                break;
            }
        }

        return {
            escalating,
            severities,
            trend: escalating ? 'getting worse' : 'improving or stable',
            recommendation: escalating ? 'Consider professional help soon' : 'Pattern seems manageable',
        };
    }

    // ============================================================
    // COUPLE SCENARIO ANALYSIS
    // ============================================================

    function analyzeCoupleExchange(partnerA_text, partnerB_text) {
        const analysisA = detectPatterns(partnerA_text);
        const analysisB = detectPatterns(partnerB_text);

        const totalConcern = (analysisA.severity + analysisB.severity) / 2;

        // Detect if it's a pursue-withdraw pattern
        const A_Pursues = analysisA.detected.some(p => p.type === 'criticism' || p.type === 'defensiveness');
        const B_Withdraws = analysisB.detected.some(p => p.type === 'stonewalling');

        const pattern = A_Pursues && B_Withdraws ? 'pursue-withdraw' : 'mixed';

        return {
            severity: totalConcern,
            partnerA: analysisA,
            partnerB: analysisB,
            pattern,
            cycle: A_Pursues && B_Withdraws ? 'Classic Pursue-Withdraw cycle detected' : 'Pattern varies',
            recommendation: totalConcern > 70 ? 'Professional support recommended' : 'Can be managed with awareness',
        };
    }

    // ============================================================
    // PUBLIC API
    // ============================================================

    return {
        detect: detectPatterns,
        analyze: analyzeAndExplain,
        getAntidote: getAntidote,
        educate: educateOnPattern,
        detectEscalation: detectEscalationPattern,
        analyzeCoupleExchange: analyzeCoupleExchange,

        // Utilities
        getMarkers: () => patternMarkers,
        getAntidotes: () => antidotes,

        // Test/demo
        demo: () => {
            console.log('=== GOTTMAN PATTERNS DEMO ===\n');

            const testTexts = [
                'You always forget everything. You\'re so irresponsible!',
                'You\'re pathetic. I\'m disgusted by you.',
                'That\'s not true! You\'re the one who never listens!',
                'Whatever. I don\'t care anymore. Leave me alone.',
                'I felt frustrated when you forgot again. I need you to write it down.',
            ];

            testTexts.forEach(text => {
                const result = analyzeAndExplain(text);
                console.log(`Text: "${text}"`);
                console.log(`Status: ${result.status}`);
                console.log(`Severity: ${result.severity}/100`);
                console.log(`Primary Pattern: ${result.primaryPattern}\n`);
            });
        },
    };
}

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = createGottmanPatternDetector;
}
