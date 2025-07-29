const cloud = require('wx-server-sdk')
cloud.init()

exports.main = async (event, context) => {
  const { filePath } = event
  const ext = filePath.match(/\.(\w+)$/)[1]
  const cloudPath = `posts/${Date.now()}.${ext}`

  try {
    const result = await cloud.uploadFile({
      cloudPath,
      filePath
    })
    return {
      success: true,
      fileID: result.fileID
    }
  } catch (err) {
    return {
      success: false,
      errMsg: err.message
    }
  }
}