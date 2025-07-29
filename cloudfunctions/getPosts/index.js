const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()

exports.main = async (event, context) => {
  try {
    const res = await db.collection('comments')
      .orderBy('time', 'desc')
      .get()
    return {
      success: true,
      data: res.data
    }
  } catch (err) {
    return {
      success: false,
      errMsg: err.message
    }
  }
}