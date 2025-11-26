/**
 * Models - Data Validation
 */

export const JournalEntrySchema = {
    validate(data) {
        const errors = [];
        if (!data.summary && !data.context) errors.push('Summary or Context is required');
        if (data.egoFocus && typeof data.egoFocus !== 'string') errors.push('Invalid Ego Type');
        return errors;
    }
};

export const AnalysisSchema = {
    createEmpty() {
        return {
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
            step1: {
                rawContent: '',
                inputSource: 'TEXT',
                contextTags: []
            },
            step2: {
                crisisLevel: null, // { level: 'NIVEAU_1', label: '...' }
                observedTriggers: [],
                factCheck: { userReality: '', partnerDistortion: '' }
            },
            step3: {
                surfaceEmotion: '',
                underlyingNeed: '',
                translation: ''
            },
            step4: {
                recommendedMethod: '',
                objective: '',
                safetyWarning: false
            },
            step5: {
                options: [] // [{ id, type, script, rationale }]
            },
            feedback: null // { rating: 1-5, comment: '' }
        };
    }
};
