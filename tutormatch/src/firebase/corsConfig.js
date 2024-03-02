const functions = require('firebase-functions')
const admin = require('firebase-admin');

if (admin.apps.length === 0) {
  admin.initializeApp();
}

const db = admin.firestore();
const auth = admin.auth();

exports.findUserByEmail = functions.https.onCall(async (data, context) => {
    if (context.auth) {
        try {
            const userRecord = await admin.auth().getUserByEmail(email);
            return userRecord.uid;
        }
        catch(error) {
            throw new functions.https.HttpsError('not-found', 'No user found with the provided email.'); 
        }
    }
    else{
        throw new functions.https.HttpsError('unauthenticated', 'The function must be called while authenticated.');
    }

});