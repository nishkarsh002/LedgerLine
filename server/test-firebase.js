import admin from 'firebase-admin';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const serviceAccount = require('c:/Users/pawan.saini/Documents/GitHub/LedgerLine/server/config/serviceAccountKey.json');

const test = async () => {
    try {
        let pKey = serviceAccount.private_key || serviceAccount.privateKey;
        // Aggressively clean the key: remove headers, strip all whitespace, then rebuild
        const rawContent = pKey
            .replace('-----BEGIN PRIVATE KEY-----', '')
            .replace('-----END PRIVATE KEY-----', '')
            .replace(/\\n/g, '') // Remove literal \n
            .replace(/\s/g, ''); // Remove all whitespace (real newlines, spaces, etc)
        
        const formattedKey = `-----BEGIN PRIVATE KEY-----\n${rawContent}\n-----END PRIVATE KEY-----\n`;

        if (admin.apps.length > 0) {
            await Promise.all(admin.apps.map(app => app.delete()));
        }

        // Standard way: pass the whole object but ensure private_key is formatted
        const sa = { ...serviceAccount };
        sa.private_key = formattedKey;

        const app = admin.initializeApp({
            credential: admin.credential.cert(sa)
        });
        
        console.log("App initialized");
        const token = await credential.getAccessToken();
        console.log("Access token retrieved Success!");
        process.exit(0);
    } catch (err) {
        console.error("Test failed:", err.message);
        process.exit(1);
    }
};

test();
