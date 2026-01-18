const admin = require('firebase-admin');

// Parse FIREBASE_CONFIG from environment variable
const serviceAccount = JSON.parse(process.env.FIREBASE_CONFIG);

// Fix the private key by replacing escaped newlines with actual newlines
serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');

// Initialize Firebase
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

module.exports = admin;
