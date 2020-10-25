const functions = require('firebase-functions')
const admin = require('firebase-admin')

admin.initializeApp() 
const db = admin.firestore();

exports.saveBlueprint = functions.https.onCall(async (data, context) => {
  // TODO: вместо userId спользовать uid
  const { userId, id, blueprint } = data

  const blueprintId = id || `${userId}:${new Date().getTime()}`

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
  
  // TODO: set(JSON.parse({ blueprint, imageUrl })
  try {
    await db.collection(`blueprints/users/${userId}`).doc(blueprintId).set(JSON.parse(blueprint))
    return Promise.resolve(JSON.stringify({ blueprintId }))
  } catch(e) {
    return Promise.reject(new Error(`can't save blueprint ${id} - ${e}`))
  }
})

exports.loadBlueprintsPage = functions.https.onCall(async (data, context) => {
  // TODO: вместо userId спользовать uid
  const { userId, startAt, limit } = data

  if (!userId) return Promise.reject(new Error('doesn`t have userId'))
  if (isNaN(startAt)) return Promise.reject(new Error('startAt is NaN'))
  if (isNaN(limit)) return Promise.reject(new Error('limit is NaN'))

  try {
    const snapshot = await db.collection(`blueprints/users/${userId}`)
      .orderBy('updatedAt', 'desc').get()

    const blueprints = snapshot.docs.map(doc => ({ 
      id: doc.id,
    }))

    // TODO - вернуть мобилке только id-шники и только стартуя с startAt с количеством limit
    // TODO - вместе с id возвращать doc.data().imageUrl

    console.log('=======================================')
    console.log('BLUEPRINTS = ', JSON.stringify({ blueprints }))
    console.log('=======================================')

    return Promise.resolve(JSON.stringify({ blueprints }))
  } catch(e) {
    return Promise.reject(new Error(`can't load blueprint page with userId:${userId}, startAt:${startAt}, limit:${limit} - ${e}`))
  }
})

exports.loadBlueprint = functions.https.onCall(async (data, context) => {
  const { userId, id } = data

  if (!userId) return Promise.reject(new Error('doesn`t have userId'))
  if (!id) return Promise.reject(new Error('doesn`t have id'))

  try {
    const doc = await db.collection(`blueprints/users/${userId}`).doc(id).get()

    if (!doc.exists) {
      return Promise.reject(new Error(`No such document! ${id}`))
    } else {
      const blueprint = doc.data();

      console.log('=======================================')
      console.log('BLUEPRINT = ', JSON.stringify(blueprint))
      console.log('=======================================')

      return Promise.resolve(JSON.stringify(blueprint))
    }
  } catch (e) {
    return Promise.reject(new Error(`can't load blueprint ${id} - ${e}`))
  }  
})
