const functions = require('firebase-functions')
const admin = require('firebase-admin')

admin.initializeApp() 
const db = admin.firestore();

exports.saveBlueprint = functions.https.onCall(async (data, context) => {
  // TODO: вместо userId спользовать uid
  const { userId, id, blueprint } = data

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
  
  // TODO: set(JSON.parse({ blueprint, imageUrl })
  await db.collection(`blueprints/users/${userId}`).doc(blueprintId).set(JSON.parse(blueprint))

  return Promise.resolve(JSON.stringify({ blueprintId }))
})

exports.loadBlueprintsPage = functions.https.onCall(async (data, context) => {
  // TODO: вместо userId спользовать uid
  const { userId, startAt, limit } = data

  if (isNaN(startAt)) return Promise.reject(new Error('startAt is NaN'))
  if (isNaN(limit)) return Promise.reject(new Error('limit is NaN'))

  const snapshot = await db.collection(`blueprints/users/${userId}`).get()
  const blueprints = snapshot.docs.map(doc => ({ 
    id: doc.id,
  }))
  // TODO - вернуть мобилке только id-шники и только стартуя с startAt с количеством limit
  // TODO - вместе с id возвращать doc.data().imageUrl

  console.log('=======================================')
  console.log('BLUEPRINTS = ', JSON.stringify({ blueprints }))
  console.log('=======================================')

  return Promise.resolve(JSON.stringify({ blueprints }))
})
