const { functions, db, bucket } = require('./common')

const deleteMyModel = functions.https.onCall(async (data, context) => {
  const { userId, id } = data

  if (!userId) return Promise.reject(new Error('doesn`t have userId'))
  if (!id) return Promise.reject(new Error('doesn`t have id'))

  // Delete model
  try {
    await db.collection(`models/users/${userId}`).doc(id).delete();

    console.log('=======================================')
    console.log('Delete model = ', id)
    
  } catch (e) {
    return Promise.reject(new Error(`can't delete model ${id} - ${e}`))
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

module.exports = deleteMyModel
