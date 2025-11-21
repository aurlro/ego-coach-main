'use strict';

function createLocalEncryptor() {
    const subtle = window.crypto?.subtle;
    const isSecureContext = window.isSecureContext ?? true;
    const hasSubtle = Boolean(subtle);

    // 🔴 CRITICAL: Refuse to proceed without proper WebCrypto support
    if (!hasSubtle || !isSecureContext) {
        const errorMsg = !hasSubtle
            ? 'WebCrypto API non disponible - Chiffrement AES-GCM requis'
            : 'Contexte non sécurisé (HTTPS requis) - Chiffrement impossibilisé';

        SecureLogger.error('SECURITY: ' + errorMsg, {
            hasSubtle,
            isSecureContext,
            isHTTPS: window.location.protocol === 'https:',
            isLocalhost: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1',
        });

        // Provide helpful message to user
        console.warn(
            '%c⚠️ SÉCURITÉ',
            'color: #ff6b6b; font-weight: bold; font-size: 14px;',
            errorMsg
        );

        if (!isSecureContext && window.location.protocol !== 'file:') {
            console.warn('💡 Pour développement local: Utilisez http://localhost:8080 au lieu de file://');
        }

        // Return stub that throws on usage
        return {
            isFallback: false,
            async encrypt() {
                throw new Error('Chiffrement AES-GCM obligatoire - Contexte non sécurisé');
            },
            async decrypt() {
                throw new Error('Déchiffrement AES-GCM obligatoire - Contexte non sécurisé');
            },
        };
    }

    const encoder = new TextEncoder();
    const decoder = new TextDecoder();
    let cryptoKeyPromise = null;

    async function getCryptoKey() {
        if (cryptoKeyPromise) return cryptoKeyPromise;
        cryptoKeyPromise = (async () => {
            try {
                const stored = localStorage.getItem(GEMINI_STORAGE_KEYS.secret);
                if (stored) {
                    const raw = fromBase64(stored);
                    return await subtle.importKey(
                        'raw',
                        raw,
                        { name: 'AES-GCM' },
                        false,
                        ['encrypt', 'decrypt'],
                    );
                }
            } catch (error) {
                console.debug('Lecture clé AES échouée.', error);
            }
            const rawKey = window.crypto.getRandomValues(new Uint8Array(32));
            try {
                localStorage.setItem(GEMINI_STORAGE_KEYS.secret, toBase64(rawKey.buffer));
            } catch (error) {
                console.debug('Impossible de stocker la clé AES.', error);
            }
            return subtle.importKey('raw', rawKey, { name: 'AES-GCM' }, false, [
                'encrypt',
                'decrypt',
            ]);
        })();
        return cryptoKeyPromise;
    }

    return {
        isFallback: false,
        async encrypt(plainText) {
            const key = await getCryptoKey();
            const iv = window.crypto.getRandomValues(new Uint8Array(12));
            const cipherBuffer = await subtle.encrypt(
                {
                    name: 'AES-GCM',
                    iv,
                },
                key,
                encoder.encode(plainText),
            );
            return {
                cipher: toBase64(cipherBuffer),
                iv: toBase64(iv.buffer),
                createdAt: new Date().toISOString(),
            };
        },
        async decrypt(payload) {
            const key = await getCryptoKey();
            const cipher = fromBase64(payload.cipher || '');
            const iv = payload.iv ? fromBase64(payload.iv) : new Uint8Array(12);
            const plainBuffer = await subtle.decrypt(
                {
                    name: 'AES-GCM',
                    iv,
                },
                key,
                cipher.buffer,
            );
            return decoder.decode(plainBuffer);
        },
    };
}
