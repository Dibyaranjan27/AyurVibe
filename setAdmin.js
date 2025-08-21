// setAdmin.js
import admin from 'firebase-admin';
import { createRequire } from 'module';

// Helper to allow importing a JSON file in ES Modules
const require = createRequire(import.meta.url);
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const email = process.argv[2];

if (!email) {
  console.log("Please provide an email address.");
  process.exit(1);
}

try {
  const user = await admin.auth().getUserByEmail(email);
  await admin.auth().setCustomUserClaims(user.uid, { admin: true });
  console.log(`Success! ${email} has been made an admin.`);
} catch (error) {
  console.error('Error setting custom claim:', error);
}