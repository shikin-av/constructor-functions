const functions = require('firebase-functions')
const admin = require('firebase-admin')

admin.initializeApp() 
const db = admin.firestore();

exports.saveBlueprint = functions.https.onCall(async (data, context) => {
  const { userId, id, details } = data  // TODO: вместо userId спользовать uid

  if (!userId) return Promise.reject(new Error('doesn`t have userId'))
  if (!details) return Promise.reject(new Error('doesn`t have details'))  

  // const uid = context.auth.uid
  // const name = context.auth.token.name || null
  // const picture = context.auth.token.picture || null
  // const email = context.auth.token.email || null

  console.log('=======================================')
  console.log('DATA = ', data)
  console.log('=======================================')

  const blueprintId = id || new Date().toISOString()
  const blueprintData = { details }

  await db.collection(`blueprints/users/${userId}`).doc(blueprintId).set(blueprintData)   // TODO: вместо userId спользовать uid

  return Promise.resolve(JSON.stringify({ blueprintId }))
})
