const cloud = require('wx-server-sdk')
const axios = require('axios')

cloud.init({
  env: 'cloud1-1gzvikze20087bea'
})

const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  const { restaurant, comment, starRating, windowName } = event
  let formattedTime;

  try {
    // 调用网络时间 API
    const response = await axios.get('http://worldtimeapi.org/api/timezone/Asia/Shanghai');
    const apiTime = new Date(response.data.datetime);
    const timeOptions = { 
      hour12: false, 
      year: 'numeric', 
      month: 'numeric', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit',
      timeZone: 'Asia/Shanghai'
    };
    formattedTime = new Intl.DateTimeFormat('zh-CN', timeOptions).format(apiTime);
  } catch (apiErr) {
    console.error('获取网络时间失败，使用本地时间：', apiErr);
    const now = new Date();
    const timeOptions = { 
      hour12: false, 
      year: 'numeric', 
      month: 'numeric', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit',
      timeZone: 'Asia/Shanghai'
    };
    formattedTime = new Intl.DateTimeFormat('zh-CN', timeOptions).format(now);
  }

  try {
    // 原子性地增加计数器的值并获取新值
    const counterRes = await db.collection('counters').doc('commentCounter').update({
      data: {
        currentNumber: _.inc(1)
      }
    });

    if (counterRes.stats.updated === 0) {
      // 若文档不存在，创建文档并初始化计数器
      await db.collection('counters').doc('commentCounter').set({
        data: {
          currentNumber: 1
        }
      });
      var newSerialNumber = 1;
    } else {
      // 获取更新后的计数器值
      const counterDoc = await db.collection('counters').doc('commentCounter').get();
      var newSerialNumber = counterDoc.data.currentNumber;
    }

    // 插入新评论
    const addRes = await db.collection('comments').add({
      data: {
        restaurant,
        content: comment,
        starRating,
        time: formattedTime,
        likeCount: 0,
        windowName,
        serialNumber: newSerialNumber
      }
    });

    return { success: true, newSerialNumber, commentId: addRes._id };
  } catch (err) {
    console.error('提交评论失败，错误信息：', err)
    return { success: false, errMsg: err.errMsg }
  }
}