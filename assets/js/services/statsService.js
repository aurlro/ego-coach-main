/**
 * Stats Service - Domain logic for dashboard statistics
 */
export const statsService = {
    calculateStats(entries) {
        const totalEntries = entries.length;
        const lastEntry = entries[0] || null;

        // Count Ego types
        const egoCounts = entries.reduce((map, entry) => {
            const key = entry.egoFocus || 'Indéfini';
            map[key] = (map[key] || 0) + 1;
            return map;
        }, {});

        // Find top Ego
        let topEgo = 'Aucun';
        let topCount = 0;
        Object.entries(egoCounts).forEach(([ego, count]) => {
            if (count > topCount) {
                topEgo = ego;
                topCount = count;
            }
        });

        // Calculate defensive streak/days since
        const defensiveEntries = entries.filter(
            (entry) => (entry.egoFocus || '').toLowerCase().includes('défensif'),
        );
        const lastDefensive = defensiveEntries[0] || null;
        const daysSinceDefensive = lastDefensive
            ? Math.max(
                0,
                Math.round(
                    (Date.now() - new Date(lastDefensive.createdAt).getTime()) /
                    (1000 * 60 * 60 * 24),
                ),
            )
            : null;

        return {
            totalEntries,
            lastEntry,
            topEgo,
            topEgoPercentage: totalEntries > 0 ? Math.round((topCount / totalEntries) * 100) : 0,
            daysSinceDefensive,
            latestEntries: entries.slice(0, 3),
        };
    },

    checkHealth() {
        return { status: 'online', message: 'Service actif' };
    }
};
