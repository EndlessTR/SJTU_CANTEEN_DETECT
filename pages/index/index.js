Page({
  data: {
    restaurants: [
      { 
        name: '哈乐餐厅', 
        description: '晚餐特色菜推荐', 
        image: 'https://map.sjtu.edu.cn/markerimages/12_zh.png',
        longitude: 121.432371,
        latitude: 31.020724,
        ratings: [],
        floorInfo: '1楼：中原美食、素食主义、韩式料理、面面俱到' // 添加楼层窗口信息
      },
      { 
        name: '玉兰苑', //finished
        description: '好多好多好吃的…！', 
        image: 'https://map.sjtu.edu.cn/markerimages/7_zh.png',
        longitude: 121.431263,
        latitude: 31.023488,
        // 新增评论评分数组
        ratings: [] ,
        floorInfo:'1F：统禾餐饮（木桶饭、麻辣烫、鱼粉、铁板烧、东北水饺等）\n2F：一等茶餐厅（周一至周日10:30-21:30提供餐食）\n其他：串府、饼家、餐堡、巴比馒头、厝内小眷村、时光咖啡'
      },
      { 
        name: '第一餐饮大楼', //finshed
        description: '早餐丰富，午餐多样', 
        image: 'https://map.sjtu.edu.cn/markerimages/1_zh.png',
        longitude: 121.431821,
        latitude: 31.022094,
        // 新增评论评分数组
        ratings: [] ,
        floorInfo:'	1F：淮扬餐厅、陕西面食（biangbiang面、臊子面）、超霖美食（肠粉、掉渣饼、瓦锅饭、中式点心 （面条糕点、铁板、养生锅）、五芳斋（江南点心）、麦当劳\n2F：教工餐厅、自选餐厅（农家菜、酸辣粉、烤鱼）清真餐厅'

      },
      
      { 
        name: '第二餐饮大楼', //finished
        description: '令人眼花缭乱的三层选择', 
        image: 'https://map.sjtu.edu.cn/markerimages/2_zh.png',
        longitude: 121.436254,
        latitude: 31.022935,
        // 新增评论评分数组
        ratings: [] ,
        floorInfo:'	1F：上海快餐（提供各类自选快餐）、秋林阁牛百碗、西餐厅\n2F：教工餐厅、陈香贵牛肉面、大众餐厅（提供各类自选餐食）\n3F：绿园餐厅'
      },
      { 
        name: '第三餐饮大楼', 
        description: '有牛肉米线和糖葫芦！', 
        image: 'https://map.sjtu.edu.cn/markerimages/3_zh.png',
        longitude: 121.433076,
        latitude: 31.026819,
        // 新增评论评分数组
        ratings: [] ,
        // 修正语法错误，使用冒号 :
        floorInfo: '1F：学生餐厅（快餐、木桶饭、面食等）\n2F：外婆桥（干锅类、面条、铁板烧、快餐等）、清真餐厅'
      },
      { 
        name: '第四餐饮大楼', 
        description: '金课御用食堂', 
        image: 'https://map.sjtu.edu.cn/markerimages/4_zh.png',
        longitude: 121.427239,
        latitude:31.02525,
        // 新增评论评分数组
        ratings: [] ,
        floorInfo: '1F：风味小吃（烤鸭饭、铁板、兰州拉面、麻辣香锅、米粉、武汉热干面、各类蒸菜等）甜魔烘焙（面包、蛋糕等） \n2F：学生餐厅（各类自选快餐、特色农家菜）教工餐厅（各类自选快餐）麻辣烫+老鸭粉丝 吉姆丽德西餐厅（周一至周日09:30-21:30供应餐食）'
      },
      { 
        name: '第五餐饮大楼', 
        description: '电院经常来吃', 
        image: 'https://map.sjtu.edu.cn/markerimages/5_zh.png',
        longitude: 121.441146,
        latitude:31.023708,
        ratings: [] ,
        floorInfo: '1F：东湖面馆（苏州汤包）学生餐厅、特色小吃（麻辣烫、猪肚鸡、石锅）\n 2F：教工餐厅、学生餐厅、无田有果（盖浇饭、牛肉汤）\n3F：吉姆丽德西餐厅（周一至周日09:30-21:30供应餐食） '
      },
      { 
        name: '第六餐饮大楼', 
        description: '第一个有智慧餐厅的食堂！', 
        image: 'https://map.sjtu.edu.cn/markerimages/6_zh.png',
        longitude: 121.444491,
        latitude:31.029356,
        ratings: [] ,
        floorInfo: '1F: 学生餐厅（面食、自选快餐等）\n2F: 教工餐厅（周一至周五供应午餐） 伊诺咖啡（手工牛肉汉堡，美式奶昔，美式猪肋排，原切牛排、炙火BBQ）'
      },
      { 
        name: '第七餐饮大楼', 
        description: '你在哪里呢？', 
        image: 'https://map.sjtu.edu.cn/markerimages/454_zh.png',
        longitude: 121.441147,
        latitude:31.029675,
        ratings: [] ,
        floorInfo: '1F：学生餐厅（提供各类自选快餐）赛文西餐厅（特色推荐：寿喜锅、炸鸡、炸鱼薯条）'
      },

    ],
    isFilterOpen: false,
    selectedRestaurant: null,
    selectedLongitude: 121.4321,
    selectedLatitude: 31.2345,
    markers: []
  },

  toggleFilter() {
    this.setData({
      isFilterOpen: !this.data.isFilterOpen
    });
  },

  selectRestaurant(e) {
    const { name, description, image, longitude, latitude } = e.currentTarget.dataset;
    // 找到对应的餐厅对象
    const selected = this.data.restaurants.find(restaurant => restaurant.name === name);
    const floorInfo = selected ? selected.floorInfo : '';
    const db = wx.cloud.database();
    // 调用云函数计算平均评分，并指定环境 ID
    wx.cloud.callFunction({
        name: 'calculateAverageRating',
        data: {
            restaurant: name
        },
        env: 'cloud1-1gzvikze20087bea', // 指定环境 ID
        success: res => {
            if (res.result.success) {
                let averageRating = res.result.averageRating;
                // 保留两位小数
                averageRating = parseFloat(averageRating).toFixed(2);
                this.setData({
                    selectedRestaurant: {
                        name,
                        description,
                        image,
                        longitude,
                        latitude,
                        averageRating,
                        floorInfo // 添加 floorInfo
                    },
                    selectedLongitude: longitude,
                    selectedLatitude: latitude,
                    isFilterOpen: false
                });
            } else {
                console.error('计算平均星数失败:', res.result.error);
            }
        },
        fail: err => {
            console.error('调用云函数失败:', err);
        }
    });
},

  goToComment() {
    if (this.data.selectedRestaurant) {
      wx.navigateTo({
        url: `/pages/comment/comment?restaurantName=${encodeURIComponent(this.data.selectedRestaurant.name)}`
      });
    } else {
      wx.showToast({
        title: '请先选择食堂',
        icon: 'none'
      });
    }
  },

  navigateToTreeHole() {
    wx.navigateTo({
      url: '/pages/treeHole/treeHole'
    });
  },
  onLoad() {
    this.getAverageRatings();
  },
  onShow() {
    this.getAverageRatings();
  },
  async getAverageRatings() {
    const { restaurants } = this.data;
    try {
      const promises = restaurants.map(r => wx.cloud.callFunction({
        name: 'calculateAverageRating',
        data: { restaurant: r.name },
        env: 'cloud1-1gzvikze20087bea'
      }));
      const results = await Promise.all(promises);
      const updated = restaurants.map((r, i) => {
        const res = results[i];
        const avg = res.result.success
          ? parseFloat(res.result.averageRating).toFixed(2)
          : '0.00';
        return { ...r, averageRating: avg };
      });
      updated.sort((a, b) => parseFloat(b.averageRating) - parseFloat(a.averageRating));
      this.setData({ restaurants: updated });
    } catch (err) {
      console.error('获取平均评分失败', err);
    }
  }
});
