Page({
  data: {
    post: {},  // 帖子详情
    imageList: [],  // 帖子的图片列表
    isLoading: true,  // 是否正在加载
  },

  onLoad: function (options) {
    const postId = options.id;  // 获取帖子ID
    if (!postId) {
      wx.showToast({ title: '帖子ID无效', icon: 'none' });
      this.setData({ isLoading: false });
      return;
    }
  
    console.log('加载帖子ID: ', postId);  // 调试：输出帖子ID
    this.loadPostDetail(postId);  // 加载帖子详情
  },

  // 加载帖子详情
  loadPostDetail: function (postId) {
    const db = wx.cloud.database();
    db.collection('ShareComments').doc(postId).get({
      success: res => {
        console.log('帖子详情加载成功: ', res);  // 调试：输出帖子详情
        const post = res.data || {};
        this.setData({ post });

        // 检查是否有图片，并获取临时链接
        if (Array.isArray(post.imageURLs) && post.imageURLs.length > 0) {
          console.log('获取到图片 fileID:', post.imageURLs);  // 调试：输出图片 fileID
          wx.cloud.getTempFileURL({
            fileList: post.imageURLs,  // 获取每个帖子的图片 fileID
            success: (result) => {
              console.log('图片临时链接获取成功: ', result);  // 调试：输出图片临时链接
              const imageURLs = result.fileList.map(file => file.tempFileURL);
              this.setData({
                imageList: imageURLs,
                isLoading: false,  // 加载完成
              });
            },
            fail: err => {
              console.error('获取图片临时链接失败', err);
              wx.showToast({ title: '获取图片失败', icon: 'none' });
              this.setData({ isLoading: false });
            },
          });
        } else {
          console.log('没有图片文件，使用默认图片');  // 调试：没有图片时输出
          this.setData({
            imageList: ['/images/default_cover.png'],
            isLoading: false,  // 无图片时也标记加载完成
          });
        }
      },
      fail: err => {
        console.error('获取帖子详情失败', err);
        wx.showToast({ title: '获取详情失败', icon: 'none' });
        this.setData({ isLoading: false });
      }
    });
  },
});

