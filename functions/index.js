const functions = require('firebase-functions')
const admin = require('firebase-admin')

admin.initializeApp() 
const db = admin.firestore();

exports.saveBlueprintPart = functions.https.onCall(async (data, context) => {
  // TODO: вместо userId спользовать uid
  let { userId, id, part } = data
  part = JSON.parse(part)

  // const blueprintId = id || `${userId}_${new Date().getTime()}`

  if (!userId) return Promise.reject(new Error('doesn`t have userId'))
  if (!id) return Promise.reject(new Error(`uncorrect id ${id}`))
  if (!part) return Promise.reject(new Error('doesn`t have part'))
  if (
    !Array.isArray(part.added) ||
    !Array.isArray(part.changed) ||
    !Array.isArray(part.deleted)
  ) {
    return Promise.reject(new Error(`Uncorrect "part" data  ${part}`))
  }

  // const uid = context.auth.uid
  // const name = context.auth.token.name || null
  // const picture = context.auth.token.picture || null
  // const email = context.auth.token.email || null

  console.log('=======================================')
  console.log('userId = ', userId)
  console.log('id = ', id)
  console.log('part = ', JSON.stringify(part))
  console.log('=======================================')
  
  try {
    const doc = await db.collection(`blueprints/users/${userId}`).doc(id).get()
    if (!doc.exists) {
      return Promise.reject(new Error(`No such document! ${id}`))
    } else {
      let blueprint = doc.data();

      // changed
      if (part.changed.length) {
        for (let changedDetail of part.changed) {
          const index = blueprint.details.findIndex(detail => detail.id == changedDetail.id)
          if (index !== -1) {
            blueprint.details[index] = changedDetail
            console.log('changed ', JSON.stringify(changedDetail))
          }
        }
      }
      // deleted
      if (part.deleted.length) {
        for (let deletedDetail of part.deleted) {
          const index = blueprint.details.findIndex(detail => detail.id == deletedDetail.id)
          if (index !== -1) {
            blueprint.details.splice(index, 1)
            console.log('deleted ', JSON.stringify(deletedDetail))
          }
        }
      }
      // added
      if (part.added.length) {
        for (let addedDetail of part.added) {
          const index = blueprint.details.findIndex(detail => detail.id == addedDetail.id)
          if (index === -1) {
            blueprint.details.push(addedDetail)
            console.log('added ', JSON.stringify(addedDetail))
          }
        }
      }

      await db.collection(`blueprints/users/${userId}`).doc(id).set(blueprint)
      return Promise.resolve(JSON.stringify({ id }))
    }
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

    const snapshot2 = await db.collection(`blueprints/users/Ronaldo`)
      .orderBy('updatedAt', 'desc').get()

    const blueprints1 = snapshot.docs.map(doc => ({ 
      id: doc.id,
      userId,
    }))

    const blueprints2 = snapshot2.docs.map(doc => ({ 
      id: doc.id,
      userId: 'Ronaldo',
    }))

    const blueprints = [...blueprints1, ...blueprints2]

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
      blueprint.userId = userId;

      console.log('=======================================')
      console.log('BLUEPRINT = ', JSON.stringify(blueprint))
      console.log('=======================================')

      return Promise.resolve(JSON.stringify(blueprint))
    }
  } catch (e) {
    return Promise.reject(new Error(`can't load blueprint ${id} - ${e}`))
  }  
})
