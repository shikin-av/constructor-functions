const { functions, db } = require('./common')
const sizeof = require('object-sizeof')

const saveMyModel = functions.https.onCall(async (data, context) => {
  // TODO: вместо userId спользовать uid
  let { userId, id, details } = data
  details = JSON.parse(details)

  if (!userId) return Promise.reject(new Error('doesn`t have userId'))
  if (!id) return Promise.reject(new Error('doesn`t have id'))
  if (!details) return Promise.reject(new Error('doesn`t have details'))
  if (!Array.isArray(details)) {
    return Promise.reject(new Error(`"details" must be an array - ${details}`))
  }

  // const uid = context.auth.uid
  // const name = context.auth.token.name || null
  // const picture = context.auth.token.picture || null
  // const email = context.auth.token.email || null

  console.log('=======================================')
  // console.log(data)
  // console.log(context)
  console.log('SIZE data', sizeof(data))
  console.log('SIZE context', sizeof(context))
  console.log('=======================================')
  
  let model = {}

  //   /* TODO: проверка - если bl с таким id уже есть 
  //   * => сгенерить новый id и вернуть на клиент
  //   * return Promise.resolve(JSON.stringify({ id }))
  //   */

  try {
    const doc = await db.collection(`models/users/${userId}`).doc(id).get()
    if (!doc.exists) {  // new
      model = {
        details: [],
        userId,
      }
    } else {
      model = doc.data();
    }
  } catch(e) {
    return Promise.reject(new Error(`can't get model ${userId} ${id} - ${e}`))
  }

  model.updatedAt = new Date().getTime()
  model.details = details.sort((d1, d2) => d1.q - d2.q)

  try {
    await db.collection(`models/users/${userId}`).doc(id).set(model)
    return Promise.resolve(JSON.stringify({ id }))
  } catch (e) {
    return Promise.reject(new Error(`can't save model ${id} - ${e}`))
  }
})

module.exports = saveMyModel
