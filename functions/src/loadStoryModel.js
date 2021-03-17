const { functions, db } = require('./common')

const loadStoryModel = functions.https.onCall(async (data, context) => {
  const { userId, id } = data

  if (!userId) return Promise.reject(new Error('doesn`t have userId'))
  if (!id) return Promise.reject(new Error('doesn`t have id'))

  try {
    const doc = await db.collection(`models/users/${userId}`).doc(id).get()

    if (!doc.exists) {
      return Promise.reject(new Error(`No such document! ${id}`))
    } else {
      const model = doc.data();
      model.userId = userId;

      console.log('=======================================')
      console.log('BLUEPRINT = ', JSON.stringify(model))
      console.log('=======================================')

      return Promise.resolve(JSON.stringify(model))
    }
  } catch (e) {
    return Promise.reject(new Error(`can't load model ${id} - ${e}`))
  }  
})

module.exports = loadStoryModel
