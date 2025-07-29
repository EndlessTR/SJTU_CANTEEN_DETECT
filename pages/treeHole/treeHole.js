Page({
  data: {
    posts: [],           // 帖子列表
    newTitle: '',        // 新标题
    newContent: '',      // 新内容
    newImages: [],       // 新图片
    isPosting: false,    // 防止重复发帖
    scrollTop: 0,        // 当前滚动位置
    showBackToTop: false, // 是否显示返回顶部按钮
  },

  onLoad: function () {
    this.loadPostsFromCloud();  // 页面加载时获取帖子数据
  },

  // 获取帖子列表
  loadPostsFromCloud: function () {
    const db = wx.cloud.database();
    db.collection('ShareComments')
      .orderBy('createdAt', 'desc')
      .get({
        success: res => {
          // 获取到的帖子数据
          const posts = res.data;

          // 使用 fileID 获取图片的临时链接
          const promises = posts.map(post => {
            if (post.imageURLs && post.imageURLs.length > 0) {
              return new Promise(resolve => {
                wx.cloud.getTempFileURL({
                  fileList: post.imageURLs,
                  success: (result) => {
                    post.imageURLs = result.fileList.map(file => file.tempFileURL);
                    resolve(post);
                  },
                  fail: (err) => {
                    console.error('获取图片链接失败', err);
                    resolve(post);
                  },
                });
              });
            }
            return Promise.resolve(post);
          });

          Promise.all(promises).then(processedPosts => {
            this.setData({
              posts: processedPosts,
            });
          });
        },
        fail: err => {
          console.error('加载帖子失败', err);
        },
      });
  },
  inputTitle: function (e) {
    const value = e.detail.value;
    if (value.length > 10) {
      wx.showToast({
        title: '标题不能超过十个字',
        icon: 'none'
      });
      return;
    }
    this.setData({
      newTitle: value,
    });
  },

  // 输入内容
  inputContent: function (e) {
    this.setData({
      newContent: e.detail.value,
    });
  },

  // 图片选择
  chooseImage: function () {
    wx.chooseMedia({
      count: 9 - this.data.newImages.length,  // 限制最多上传9张图片
      success: (res) => {
        const tempFilePaths = res.tempFiles.map(file => file.tempFilePath);
        this.setData({
          newImages: this.data.newImages.concat(tempFilePaths),
        });
      },
    });
  },

  // 移除图片
  removeImage: function (e) {
    const index = e.currentTarget.dataset.index;
    const newImages = [...this.data.newImages];
    newImages.splice(index, 1);
    this.setData({
      newImages: newImages,
    });
  },

  // 发帖
  submitPost: function () {
    if (this.data.isPosting) return;  // 防止重复提交
    if (this.data.newTitle.length > 10) {
      wx.showToast({
        title: '标题不能超过十个字',
        icon: 'none'
      });
      return;
    }
    this.setData({
      isPosting: true,
    });

    const db = wx.cloud.database();
    const promiseArr = [];

    // 上传图片
    const uploadImages = this.data.newImages.map((image) => {
      return new Promise((resolve, reject) => {
        wx.cloud.uploadFile({
          cloudPath: `posts/${Date.now()}_${Math.floor(Math.random() * 1000)}.jpg`,  // 设置云存储路径
          filePath: image,  // 图片路径
          success: (res) => resolve(res.fileID),  // 成功返回 fileID
          fail: (err) => reject(err),
        });
      });
    });

    Promise.all(uploadImages).then((fileIDs) => {
      db.collection('ShareComments').add({
        data: {
          title: this.data.newTitle,
          content: this.data.newContent,
          imageURLs: fileIDs, // 储存图片的 fileID 数组
          likeCount: 0,
          createdAt: new Date(),
          username: '匿名用户', // 可以替换为用户信息
          avatar: '/images/default_avatar.png',
          like: false,
        },
        success: () => {
          this.setData({
            newTitle: '',
            newContent: '',
            newImages: [],
            isPosting: false,
          });
          wx.showToast({
            title: '发帖成功',
            icon: 'success',
          });
          this.loadPostsFromCloud();  // 刷新帖子列表
        },
        fail: (err) => {
          console.error('发帖失败', err);
          this.setData({
            isPosting: false,
          });
          wx.showToast({
            title: '发帖失败',
            icon: 'none',
          });
        },
      });
    });
  },

  // 监听页面滚动
  onPageScroll: function (e) {
    const scrollTop = e.scrollTop;
    const showBackToTop = scrollTop > 300;  // 滚动超过300px显示返回顶部按钮

    // 更新状态
    this.setData({
      scrollTop,
      showBackToTop,
    });
  },

  // 返回页面顶部
  backToTop: function () {
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300
    });
  },

  // 刷新页面
  refreshPage: function () {
    this.loadPostsFromCloud();
  },

  // 刷新并返回顶部
  refreshAndBackToTop: function () {
    this.loadPostsFromCloud();
    this.backToTop();
  },
  likePost: function (e) {
    const postId = e.currentTarget.dataset.id;
    const isLiked = e.currentTarget.dataset.isliked;
    const db = wx.cloud.database();

    // 更新点赞状态
    db.collection('ShareComments').doc(postId).update({
      data: {
        like: !isLiked,
        likeCount: db.command.inc(isLiked ? -1 : 1),
      },
      success: () => {
        this.loadPostsFromCloud();  // 更新帖子列表
        // 增加点赞成功提示动画
        wx.showToast({
          title: isLiked ? '取消点赞' : '点赞成功',
          icon: 'success',
          duration: 1500
        });
      },
      fail: (err) => {
        console.error('点赞失败', err);
      },
    });
  },
  goDetail: function (e) {
    const postId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/detail/detail?id=${postId}`,  // 跳转到帖子详情页
    });
  },
});












