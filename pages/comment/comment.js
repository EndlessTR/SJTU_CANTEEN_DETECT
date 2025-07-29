Page({
  data: {
    restaurant: '',
    comment: '',
    starRating: 0,
    historyComments: [],
    windowName: ''
  },
  onLoad(options) {
    if (options && options.restaurantName) {
      this.setData({
        restaurant: decodeURIComponent(options.restaurantName)
      });
    }
    
    const db = wx.cloud.database();
    // 修改排序规则，按 serialNumber 倒序排列
    db.collection('comments').where({
      restaurant: this.data.restaurant
    }).orderBy('serialNumber', 'desc').get({
      success: res => {
        console.log('历史评论加载成功', res.data);
        this.setData({
          historyComments: res.data
        });
      },
      fail: err => {
        console.error('获取评论失败，错误信息：', err);
        wx.showToast({
          title: `数据加载失败：${err.errMsg}`,
          icon: 'none'
        });
      }
    });
  },
  inputComment(e) {
    this.setData({
      comment: e.detail.value
    });
  },
  rateStar(e) {
    this.setData({
      starRating: e.currentTarget.dataset.rating
    });
  },
  // 新增窗口名称输入处理函数
  inputWindowName(e) {
    this.setData({
      windowName: e.detail.value
    });
  },
  submitComment() {
    if (!this.data.restaurant) {
      wx.showToast({
        title: '餐厅名称未获取到',
        icon: 'none'
      });
      return;
    }
    if (!this.data.comment || this.data.starRating === 0) {
      wx.showToast({
        title: '请输入评论内容并打星',
        icon: 'none'
      });
      return;
    }

    wx.cloud.callFunction({
      name: 'submitComment',
      data: {
        restaurant: this.data.restaurant,
        comment: this.data.comment,
        starRating: this.data.starRating,
        windowName: this.data.windowName
      },
      env: 'cloud1-1gzvikze20087bea',
      // 延长超时时间，例如设置为 10 秒
      timeout: 10000, 
      success: res => {
        if (res.result.success) {
          wx.showToast({
            title: '评论提交成功',
            icon: 'success'
          });
          // 重置评论内容和打星
          this.setData({
            comment: '', // 清空评论内容
            starRating: 0, // 清空打星
            windowName: '' // 清空窗口名称
          });
          // 刷新历史评论
          this.onLoad();
        } else {
          console.error('提交评论失败，错误信息：', res.result.errMsg);
          wx.showToast({
            title: `评论提交失败：${res.result.errMsg}`,
            icon: 'none'
          });
        }
      },
      fail: err => {
        console.error('调用云函数失败，错误信息：', err);
        wx.showToast({
          title: `调用云函数失败：${err.errMsg}`,
          icon: 'none'
        });
      }
    });
  },
  likeComment(e) {
    const index = e.currentTarget.dataset.index;
    const historyComments = [...this.data.historyComments];
    if (historyComments[index]) {
      const serialNumber = historyComments[index].serialNumber; // 获取 serialNumber
      const newLikeCount = historyComments[index].likeCount + 1;
      wx.cloud.callFunction({
        name: 'updateLikeCount',
        data: {
          serialNumber: serialNumber, // 传递 serialNumber
          likeCount: newLikeCount
        },
        env: 'cloud1-1gzvikze20087bea',
        timeout: 10000, 
        success: res => {
          if (res.result.success) {
            historyComments[index].likeCount = newLikeCount;
            this.setData({
              historyComments
            });
          }
        },
        fail: err => {
          console.error('更新点赞数失败', err);
        }
      });
    }
  }
});