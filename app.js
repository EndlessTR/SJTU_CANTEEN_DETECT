// app.js
App({
  onLaunch() {
    wx.cloud.init({
      env: 'cloud1-1gzvikze20087bea', // 替换为你的云开发环境 ID
      traceUser: true
    });
  }
});

// 展示本地存储能力
const logs = wx.getStorageSync('logs') || []
logs.unshift(Date.now())
wx.setStorageSync('logs', logs)

// 登录
wx.login({
  success: res => {
    // 发送 res.code 到后台换取 openId, sessionKey, unionId
  }
})

