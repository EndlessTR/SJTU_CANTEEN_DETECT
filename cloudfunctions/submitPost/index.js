const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()

exports.main = async (event, context) => {
  const { title, content, imageFileIDs } = event
  if (!title || !content) {
    return {
      success: false,
      errMsg: '???????????????'
    }
  }

  const timeStamp = Date.now()
  try {
    const res = await db.collection('comments').add({
      data: {
        title,
        content,
        imageFileIDs: imageFileIDs || [],
        serialNumber: timeStamp,
        createTime: db.serverDate(),
        time: db.serverDate()
      }
    })
    return {
      success: true,
      _id: res._id
    }
  } catch (err) {
    return {
      success: false,
      errMsg: err.message
    }
  }
}