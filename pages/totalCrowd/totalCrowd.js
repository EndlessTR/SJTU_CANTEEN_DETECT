Page({
  data: {
    restaurants: [
      { id: 100, name: '第一餐饮大楼' },
      { id: 200, name: '第二餐饮大楼' },
      { id: 300, name: '第三餐饮大楼' },
      { id: 400, name: '第四餐厅大楼' },
      { id: 500, name: '第五餐厅大楼' },
      { id: 600, name: '第六餐厅大楼' },
      { id: 700, name: '第七餐厅大楼' },
      { id: 800, name: '哈乐餐厅' },
    ],
    pickerIndex: -1,
    scheduleDesc: '',
    selectedCrowdData: [],
    isLoadingFlow: false,
  },

  chartCtx: null,

  onReady() {
    this.initializeCanvas();
  },

  initializeCanvas() {
    const query = wx.createSelectorQuery().in(this);
    query.select('#crowdChart').boundingClientRect((rect) => {
      if (rect && rect.height > 0) {
        this.chartCtx = wx.createCanvasContext('crowdChart', this);
        console.log('Canvas context initialized');
      } else {
        console.log('Canvas尚未渲染，稍后重试');
        setTimeout(() => {
          this.initializeCanvas();
        }, 500);
      }
    }).exec();
  },

  bindPickerChange(e) {
    const idx = e.detail.value;
    this.setData({
      pickerIndex: idx,
      isLoadingFlow: true,
      selectedCrowdData: [],
      scheduleDesc: ''
    });
    this.loadCrowdData(this.data.restaurants[idx].id);
  },

  formatTime(humanTime) {
    try {
      const date = new Date(humanTime.replace(' ', 'T'));
      const hh = String(date.getHours()).padStart(2, '0');
      const mm = String(date.getMinutes()).padStart(2, '0');
      return `${hh}:${mm}`;
    } catch (error) {
      console.error("时间格式化失败:", error);
      return '';
    }
  },

  loadCrowdData(restaurantId) {
    console.log('开始加载人流量数据，传入餐厅ID:', restaurantId);
    wx.cloud.callFunction({
      name: 'getRestaurantFlow',
      data: { restaurantId },
      success: (res) => {
        console.log('云函数返回数据:', res);
        try {
          if (res.result.success) {
            const subs = res.result.data.subs;
            if (!subs || !Array.isArray(subs) || subs.length === 0) {
              throw new Error('数据格式异常');
            }
            const firstSub = subs[0];
            let rates = firstSub.curRates;
            if (!rates || rates.length === 0) {
              rates = firstSub.ydaRates;
            }
            if (!rates || rates.length === 0) {
              throw new Error('没有数据');
            }
            const formattedData = rates.map(item => ({
              time: this.formatTime(item.time),
              crowd: item.rate
            }));
            this.setData({
              selectedCrowdData: formattedData,
              isLoadingFlow: false,
              scheduleDesc: `已加载 ${formattedData.length} 条记录`
            }, () => {
              this.renderChart();
            });
          } else {
            throw new Error('获取数据失败');
          }
        } catch (error) {
          console.error('数据处理失败:', error);
          this.setData({
            isLoadingFlow: false,
            scheduleDesc: '数据处理失败'
          });
        }
      },
      fail: (err) => {
        console.error('调用云函数失败:', err);
        this.setData({
          isLoadingFlow: false,
          scheduleDesc: '调用云函数失败'
        });
      }
    });
  },

  renderChart() {
    if (!this.chartCtx) {
      console.error('Canvas context 未初始化');
      return;
    }
    const selectedCrowdData = this.data.selectedCrowdData;
    if (!selectedCrowdData.length) {
      console.log('没有数据可以绘制');
      return;
    }

    const query = wx.createSelectorQuery().in(this);
    query.select('#crowdChart').boundingClientRect((rect) => {
      if (!rect) {
        console.error('Canvas 尚未渲染');
        return;
      }
      const width = rect.width;
      const height = rect.height;
      const padding = 40; // 增加内边距以容纳坐标轴标签
      const maxCrowd = Math.max(...selectedCrowdData.map(item => item.crowd));
      const minCrowd = Math.min(...selectedCrowdData.map(item => item.crowd));

      this.chartCtx.clearRect(0, 0, width, height);

      // 绘制坐标轴
      this.chartCtx.setStrokeStyle('#000');
      this.chartCtx.setLineWidth(2);
      this.chartCtx.beginPath();
      this.chartCtx.moveTo(padding, height - padding);
      this.chartCtx.lineTo(width - padding, height - padding); // X轴
      this.chartCtx.moveTo(padding, padding);
      this.chartCtx.lineTo(padding, height - padding); // Y轴
      this.chartCtx.stroke();

      // 绘制X轴刻度和标签
      const xStep = (width - 2 * padding) / selectedCrowdData.length;
      const labelStep = Math.max(1, Math.floor(selectedCrowdData.length / 5)); // 每隔一定数量的数据点显示一个标签
      selectedCrowdData.forEach((item, index) => {
        if (index % labelStep !== 0) return; // 跳过部分标签
        const x = padding + xStep * index;
        this.chartCtx.beginPath();
        this.chartCtx.moveTo(x, height - padding);
        this.chartCtx.lineTo(x, height - padding + 5);
        this.chartCtx.stroke();
        this.chartCtx.setFontSize(12);
        this.chartCtx.setFillStyle('#666');
        this.chartCtx.fillText(item.time, x - 15, height - padding + 20);
      });

      // 绘制Y轴刻度和标签
      const yStep = (height - 2 * padding) / 3; // 3个刻度
      for (let i = 0; i <= 3; i++) {
        const y = height - padding - yStep * i;
        const label = Math.round(minCrowd + (maxCrowd - minCrowd) * (i / 3));
        this.chartCtx.beginPath();
        this.chartCtx.moveTo(padding - 5, y);
        this.chartCtx.lineTo(padding, y);
        this.chartCtx.stroke();
        this.chartCtx.setFontSize(12);
        this.chartCtx.setFillStyle('#666');
        this.chartCtx.fillText(label, padding - 30, y + 5);
      }

      // 绘制折线
      this.chartCtx.setStrokeStyle('#D1500F');
      this.chartCtx.setLineWidth(2);
      selectedCrowdData.forEach((item, index) => {
        const x = padding + xStep * index;
        const y = height - padding - ((item.crowd - minCrowd) / (maxCrowd - minCrowd)) * (height - 2 * padding);
        if (index === 0) {
          this.chartCtx.moveTo(x, y);
        } else {
          this.chartCtx.lineTo(x, y);
        }
      });
      this.chartCtx.stroke();

      // 绘制数据点
      selectedCrowdData.forEach((item, index) => {
        const x = padding + xStep * index;
        const y = height - padding - ((item.crowd - minCrowd) / (maxCrowd - minCrowd)) * (height - 2 * padding);
        this.chartCtx.beginPath();
        this.chartCtx.arc(x, y, 3, 0, 2 * Math.PI);
        this.chartCtx.setFillStyle('#D1500F');
        this.chartCtx.fill();
      });
      this.chartCtx.setFontSize(14);
      this.chartCtx.setFillStyle('#D1500F');
      this.chartCtx.fillText('', width - padding, padding);

      this.chartCtx.draw();

     
    
    }).exec();
  }
});





























