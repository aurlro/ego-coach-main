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
