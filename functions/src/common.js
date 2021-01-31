const functions = require('firebase-functions')
const admin = require('firebase-admin')

const BUCKET_NAME = 'gs://constructor-2de11.appspot.com'

admin.initializeApp() 
const db = admin.firestore();
const storage = admin.storage();
const bucket = storage.bucket(BUCKET_NAME)

module.exports = {
    functions,
    db,
    bucket,
}