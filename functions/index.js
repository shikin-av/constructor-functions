const functions = require('firebase-functions')
const admin = require('firebase-admin')

admin.initializeApp() 
const db = admin.firestore();

exports.saveBlueprint = functions.https.onCall(async (data, context) => {
  const { userId, id, blueprint } = data  // TODO: вместо userId спользовать uid

  if (!userId) return Promise.reject(new Error('doesn`t have userId'))
  if (!blueprint) return Promise.reject(new Error('doesn`t have blueprint'))  

  // const uid = context.auth.uid
  // const name = context.auth.token.name || null
  // const picture = context.auth.token.picture || null
  // const email = context.auth.token.email || null

  console.log('=======================================')
  console.log('userId = ', userId)
  console.log('id = ', id)
  console.log('blueprint = ', blueprint)
  console.log('=======================================')

  const blueprintId = id || new Date().toISOString()
  
  await db.collection(`blueprints/users/${userId}`).doc(blueprintId).set(JSON.parse(blueprint))   // TODO: вместо userId спользовать uid

  return Promise.resolve(JSON.stringify({ blueprintId }))
})
