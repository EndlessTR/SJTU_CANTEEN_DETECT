const cloud = require('wx-server-sdk');
cloud.init({
  env: 'cloud1-1gzvikze20087bea' 
});
const db = cloud.database();
const _ = db.command;

exports.main = async (event, context) => {
  const { serialNumber, likeCount } = event;
  try {
    if (!serialNumber || typeof likeCount !== 'number') {
      throw new Error('缺少必要参数或参数类型错误');
    }
    // 使用 serialNumber 查询并更新数据
    await db.collection('comments').where({
      serialNumber: serialNumber
    }).update({
      data: {
        likeCount: likeCount
      }
    });
    return {
      success: true
    };
  } catch (err) {
    console.error('更新点赞数失败:', err);
    return {
      success: false,
      error: err.toString()
    };
  }
};