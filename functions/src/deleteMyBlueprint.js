const { functions, db, bucket } = require('./common')

const deleteMyBlueprint = functions.https.onCall(async (data, context) => {
  const { userId, id } = data

  if (!userId) return Promise.reject(new Error('doesn`t have userId'))
  if (!id) return Promise.reject(new Error('doesn`t have id'))

  // Delete blueprint
  try {
    await db.collection(`blueprints/users/${userId}`).doc(id).delete();

    console.log('=======================================')
    console.log('Delete blueprint = ', id)
    
  } catch (e) {
    return Promise.reject(new Error(`can't delete blueprint ${id} - ${e}`))
  }

  // Delete image
  try {
    const imagePath = `${userId}/${id}.png`
    const image = bucket.file(imagePath)
    image.delete();

    console.log('Delete image = ', imagePath)
    console.log('=======================================')
    
  } catch (e) {
    return Promise.reject(new Error(`can't delete image ${imagePath} - ${e}`))
  }

  return Promise.resolve(JSON.stringify({ id }))
})

module.exports = deleteMyBlueprint
