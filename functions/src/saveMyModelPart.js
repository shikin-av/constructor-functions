const { functions, db } = require('./common')

const saveMyModelPart = functions.https.onCall(async (data, context) => {
  // TODO: вместо userId спользовать uid
  let { userId, id, part, /*errors*/ } = data
  part = JSON.parse(part)

  if (!userId) return Promise.reject(new Error('doesn`t have userId'))
  if (!id) return Promise.reject(new Error('doesn`t have id'))
  if (!part) return Promise.reject(new Error('doesn`t have part'))
  if (!Array.isArray(part)) {
    return Promise.reject(new Error(`"part" must be an array - ${part}`))
  }

  // const uid = context.auth.uid
  // const name = context.auth.token.name || null
  // const picture = context.auth.token.picture || null
  // const email = context.auth.token.email || null

  console.log('=======================================')
  console.log('userId = ', userId)
  console.log('id = ', id)
  console.log('part = ', JSON.stringify(part))
  // console.log('errors = ', errors)
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
  // model.errors = JSON.parse(errors)

  for (let partDetail of part) {
    const type = partDetail.t
    delete partDetail.t
    const index = model.details.findIndex(detail => detail.id == partDetail.id)

    if (type == 'a') {
      if (index >= 0) {
        model.details.splice(index, 1)
      }
      model.details.push(partDetail)
    }
    else 
    if (type == 'c') {
      if (index >= 0) {
        model.details[index] = partDetail
      } else {
        model.details.push(partDetail)
      }
    }
    else 
    if (type === 'd') {
      if (index >= 0) {
        model.details.splice(index, 1)
      }
    } 
  }

  try {
    await db.collection(`models/users/${userId}`).doc(id).set(model)
    return Promise.resolve(JSON.stringify({ id }))
  } catch (e) {
    return Promise.reject(new Error(`can't save model ${id} - ${e}`))
  }
})

module.exports = saveMyModelPart
