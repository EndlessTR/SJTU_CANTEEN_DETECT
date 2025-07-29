// cloud functions/updateFilePermission/index.js
const cloud = require('wx-server-sdk');
cloud.init({
  // 指定当前环境 ID，如果不填则使用默认环境
  env: 'cloud1-1gzvikze20087bea'
});

exports.main = async (event, context) => {
  const fileID = event.fileID;
  try {
    await cloud.storage.updateFilePermission({
      fileID,
      access: 'public'  // 设置为公开
    });
    return { success: true };
  } catch (err) {
    return { success: false, errMsg: err.message };
  }
};


