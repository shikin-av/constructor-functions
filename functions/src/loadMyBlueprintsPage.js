const { functions, db } = require('./common')

const loadMyBlueprintsPage = functions.https.onCall(async (data, context) => {
  // TODO: вместо userId спользовать uid
  const { userId, startAt, limit } = data

  if (!userId) return Promise.reject(new Error('doesn`t have userId'))
  if (isNaN(startAt)) return Promise.reject(new Error('startAt is NaN'))
  if (isNaN(limit)) return Promise.reject(new Error('limit is NaN'))

  try {
    const snapshot = await db.collection(`blueprints/users/${userId}`)
      .orderBy('updatedAt', 'desc').get()

      const blueprints = snapshot.docs.map(doc => {
        // const { errors } = doc.data()
        return {
          id: doc.id,
          userId,
          // errors: errors ? JSON.parse(errors) : false,
        }
      })

    // TODO - стартуя с startAt с количеством limit

    console.log('=======================================')
    console.log('BLUEPRINTS = ', JSON.stringify({ blueprints }))
    console.log('=======================================')

    return Promise.resolve(JSON.stringify({ blueprints }))
  } catch(e) {
    return Promise.reject(new Error(`can't load blueprint page with userId:${userId}, startAt:${startAt}, limit:${limit} - ${e}`))
  }
})

module.exports = loadMyBlueprintsPage
