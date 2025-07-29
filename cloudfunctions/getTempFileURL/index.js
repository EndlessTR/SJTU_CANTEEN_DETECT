// 云函数入口文件
const cloud = require('wx-server-sdk');
cloud.init();

exports.main = async (event, context) => {
  const { fileIDs } = event;
  if (!Array.isArray(fileIDs) || fileIDs.length === 0) {
    return {
      success: false,
      message: 'fileIDs 参数无效'
    };
  }

  try {
    // 确保 fileList 中的每个元素都包含 fileID 和 maxAge
    const fileList = fileIDs.map(id => ({
      fileID: id,
      maxAge: 86400 // 临时链接的有效期（秒）
    }));

    const result = await cloud.getTempFileURL({ fileList });
    return {
      success: true,
      fileList: result.fileList
    };
  } catch (err) {
    console.error('获取临时链接失败', err);
    return {
      success: false,
      message: '获取临时链接失败',
      error: err
    };
  }
};