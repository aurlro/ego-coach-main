'use strict';

// --- Error Handling ---

function createError(code, message, extra = {}) {
    const error = new Error(message);
    error.code = code;
    Object.assign(error, extra);
    return error;
}

// --- Formatting & UI Helpers ---

function formatCountdown(timestamp) {
    const diff = Math.max(0, timestamp - Date.now());
    const seconds = Math.round(diff / 1000);
    if (seconds <= 1) return 'dans 1 seconde';
    if (seconds < 60) return `dans ${seconds}s`;
    const minutes = Math.round(seconds / 60);
    if (minutes < 60) return `dans ${minutes} min`;
    const hours = Math.round(minutes / 60);
    if (hours < 48) return `dans ${hours} h`;
    const days = Math.round(hours / 24);
    return `dans ${days} j`;
}

function autoResizeTextarea(textarea) {
    if (!textarea) return;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
}

function copyTextToClipboard(text) {
    const value = text ?? '';
    if (!value) {
        return Promise.reject(new Error('Texte vide'));
    }

    if (navigator.clipboard?.writeText) {
        return navigator.clipboard.writeText(value);
    }

    return new Promise((resolve, reject) => {
        const textarea = document.createElement('textarea');
        textarea.value = value;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        textarea.style.pointerEvents = 'none';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();

        try {
            const success = document.execCommand('copy');
            if (!success) throw new Error('execCommand a échoué');
            resolve(true);
        } catch (error) {
            reject(error);
        } finally {
            document.body.removeChild(textarea);
        }
    });
}

// --- Date Formatting ---

function formatDateShort(date) {
    const d = new Date(date);
    if (Number.isNaN(d.getTime())) return 'Date inconnue';
    return d.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
}

function formatRelativeTime(date) {
    const d = new Date(date);
    if (Number.isNaN(d.getTime())) return 'Date inconnue';
    const diffMs = Date.now() - d.getTime();
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Aujourd'hui";
    if (diffDays === 1) return 'Hier';
    if (diffDays < 7) return `Il y a ${diffDays} jours`;
    const diffWeeks = Math.round(diffDays / 7);
    if (diffWeeks < 5) return `Il y a ${diffWeeks} semaine${diffWeeks > 1 ? 's' : ''}`;
    return formatDateShort(d);
}

function formatFullDate(date) {
    const d = new Date(date);
    if (Number.isNaN(d.getTime())) return 'Date inconnue';
    return d.toLocaleString('fr-FR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

// --- Encoding ---

function toBase64(buffer) {
    const uint8Array = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
    let binary = '';
    uint8Array.forEach((byte) => {
        binary += String.fromCharCode(byte);
    });
    return btoa(binary);
}

function fromBase64(value) {
    const binary = atob(value);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i += 1) {
        bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
}

// --- Domain Logic Helpers ---

function readQuotaHeaders(headers) {
    if (!headers?.get) return null;
    const limitHeader = headers.get('x-ratelimit-limit');
    const remainingHeader = headers.get('x-ratelimit-remaining');
    const limit = limitHeader != null ? Number.parseInt(limitHeader, 10) : null;
    const remaining = remainingHeader != null ? Number.parseInt(remainingHeader, 10) : null;
    const resetHeader = headers.get('x-ratelimit-reset') || headers.get('x-ratelimit-reset-ms');
    let resetMs = null;
    if (resetHeader) {
        const resetValue = Number.parseInt(resetHeader, 10);
        if (!Number.isNaN(resetValue)) {
            resetMs = resetValue > COOLDOWN_DEFAULTS.timestampThreshold ? resetValue : resetValue * 1000;
        }
    }
    const hasLimit = limit != null && !Number.isNaN(limit);
    const hasRemaining = remaining != null && !Number.isNaN(remaining);
    const hasReset = resetMs != null && !Number.isNaN(resetMs);
    if (!hasLimit && !hasRemaining && !hasReset) {
        return null;
    }
    return {
        limit: hasLimit ? limit : null,
        remaining: hasRemaining ? remaining : null,
        resetMs,
    };
}

function calculateJournalStats(entries) {
    const totalEntries = entries.length;
    const lastEntry = entries[0] || null;
    const egoCounts = entries.reduce((map, entry) => {
        const key = entry.egoFocus || 'Indéfini';
        map[key] = (map[key] || 0) + 1;
        return map;
    }, {});

    let topEgo = null;
    let topCount = 0;
    Object.entries(egoCounts).forEach(([ego, count]) => {
        if (count > topCount) {
            topEgo = ego;
            topCount = count;
        }
    });

    const defensiveEntries = entries.filter(
        (entry) => (entry.egoFocus || '').toLowerCase().includes('défensive'),
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
        topEgoPercentage:
            totalEntries > 0 ? Math.round((topCount / totalEntries) * 100) : 0,
        daysSinceDefensive,
        latestEntries: entries.slice(0, 3),
    };
}

function runLocalHeuristics(text) {
    const lower = text.toLowerCase();
    const tensionIndicators = ['tu ne', 'toujours', 'encore', 'pourquoi', 'fais'];
    const validationNeed = ['écoute', 'compris', 'soutiens', 'présent', 'merci'];
    const limitNeed = ['stop', 'limite', 'respecte', 'ne peux pas'];

    const tensionScore = tensionIndicators.reduce(
        (score, word) => score + (lower.includes(word) ? 1 : 0),
        0,
    );

    const meta =
        tensionScore >= 3
            ? 'Chaleur élevée : privilégie une réponse courte, validante, avec option pause.'
            : tensionScore === 2
                ? 'Tension modérée : une validation claire + proposition de plan peut suffire.'
                : 'Tension faible : opportunité de co-construction.';

    const needsValidation = validationNeed.some((word) => lower.includes(word));
    const needsBoundaries = limitNeed.some((word) => lower.includes(word));

    const takeaways = [
        tensionScore >= 3
            ? "Ton ego Défensif risque de réagir. Ralentis avant de dérouler ton script."
            : "Continue de valider avant de proposer la moindre solution.",
        needsBoundaries
            ? 'Une limite claire semble nécessaire. Prépare-la en mode MVP.'
            : 'Propose un plan d’action concret pour la suite.',
        needsValidation
            ? "La validation émotionnelle doit être la première brique de ta réponse."
            : "Ressors la user story cachée pour faire redescendre la tension.",
    ];

    const options = [
        {
            objective: 'Désescalade immédiate',
            script:
                "Je t'entends. Ce que tu décris est fatigant/ blessant et c'est normal que ça te prenne autant de place. Je propose qu'on fasse une pause de 15 minutes pour que je revienne vers toi avec un plan plus clair, ok ?",
        },
        {
            objective: needsBoundaries ? 'Poser une limite' : 'Clarifier le besoin',
            script: needsBoundaries
                ? "Je veux vraiment qu'on avance, et j'ai besoin qu'on évite les généralités type “toujours/jamais”. Ce soir, j'ai l'énergie pour écouter et poser une limite claire : si on dépasse ce ton, je stoppe la discussion et on reprend demain calmement."
                : "Ce que je comprends : tu as besoin de sentir que je m'implique autant que toi. Voici ce que je te propose : [action concrète], et on fait un point dimanche pour mesurer si ça te soulage.",
        },
        {
            objective: 'Alignement produit',
            script:
                "Scenario 1 : je fais [action], scenario 2 : on pose ensemble une autre manière de gérer [sujet]. Donne-moi ton feedback : quel MVP te semble le plus aligné avec ton besoin là tout de suite ?",
        },
    ];

    return {
        meta,
        takeaways,
        options,
    };
}
