const { functions, db } = require('./common')

const saveMyBlueprintPart = functions.https.onCall(async (data, context) => {
  // TODO: вместо userId спользовать uid
  let { userId, id, part, errors } = data
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
  console.log('errors = ', errors)
  console.log('=======================================')
  
  let blueprint = {}

  //   /* TODO: проверка - если bl с таким id уже есть 
  //   * => сгенерить новый id и вернуть на клиент
  //   * return Promise.resolve(JSON.stringify({ id }))
  //   */

  try {
    const doc = await db.collection(`blueprints/users/${userId}`).doc(id).get()
    if (!doc.exists) {  // new
      blueprint = {
        details: [],
        userId,
      }
    } else {
      blueprint = doc.data();
    }
  } catch(e) {
    return Promise.reject(new Error(`can't get blueprint ${userId} ${id} - ${e}`))
  }

  blueprint.updatedAt = new Date().getTime()
  blueprint.errors = JSON.parse(errors)

  for (let partDetail of part) {
    const type = partDetail.t
    delete partDetail.t
    const index = blueprint.details.findIndex(detail => detail.id == partDetail.id)

    if (type == 'a') {
      if (index >= 0) {
        blueprint.details.splice(index, 1)
      }
      blueprint.details.push(partDetail)
    }
    else 
    if (type == 'c') {
      if (index >= 0) {
        blueprint.details[index] = partDetail
      } else {
        blueprint.details.push(partDetail)
      }
    }
    else 
    if (type === 'd') {
      if (index >= 0) {
        blueprint.details.splice(index, 1)
      }
    } 
  }

  try {
    await db.collection(`blueprints/users/${userId}`).doc(id).set(blueprint)
    return Promise.resolve(JSON.stringify({ id }))
  } catch (e) {
    return Promise.reject(new Error(`can't save blueprint ${id} - ${e}`))
  }
})

module.exports = saveMyBlueprintPart
