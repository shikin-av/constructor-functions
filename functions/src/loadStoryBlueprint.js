const { functions, db } = require('./common')

const loadStoryBlueprint = functions.https.onCall(async (data, context) => {
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

module.exports = loadStoryBlueprint
