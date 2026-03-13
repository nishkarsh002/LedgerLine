import admin from 'firebase-admin';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const serviceAccount = require('./serviceAccountKey.json');

const initializeFirebase = () => {
    try {
        if (admin.apps.length === 0) {
            // Robustly prepare the service account object
            const sa = { ...serviceAccount };
            if (sa.private_key) {
                // Handle both literal \n string and actual newlines, and remove carriage returns
                sa.private_key = sa.private_key
                    .replace(/\\n/g, '\n')
                    .replace(/\r/g, '')
                    .trim() + '\n';
            }

            admin.initializeApp({
                credential: admin.credential.cert(sa),
                storageBucket: "itr-project-9be2b.firebasestorage.app"
            });
            console.log('Firebase Admin Initialized Successfully');
        }
    } catch (error) {
        console.error('Firebase Admin Initialization Failed:', error);
    }
};

initializeFirebase();

const bucket = admin.storage().bucket();

export { bucket };
