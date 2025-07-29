# 餐厅评价与人流量统计小程序

- 这是一个微信小程序，用于餐厅评价和人流量统计，用户可以查看各食堂的人流量情况，提交人流量反馈以及对餐厅进行评价。
- 同时也是2025春的SJTU工导课小组大作业QAQ，这个入花了很大的力气从零自学小程序相关语言最终做出来的。

## 功能模块

### 1. 分食堂页面 (`pages/index/index`)
- 展示餐厅列表，包含餐厅名称、图片和描述，并且有腾讯地图的定位显示。
- 用户可以选择餐厅，查看餐厅详情。
- 食堂列表采用排行榜模式，平均评论评分靠前的排列靠上，并且在食堂名字旁显示评分。
- 提供按钮跳转到食堂窗口评价页面。

### 2. 总人流量页面 (`pages/totalCrowd/totalCrowd`)
- 显示各食堂的人流量情况。
- 数据来源于【交我办】食堂人流量界面，实时抓取数据后在本小程序界面绘制折线图可视化。

### 3. 窗口评价页面 (`pages/comment/comment`)
- 用户可以匿名填写对餐厅窗口的评价与评分。
- 提交评价后，评价会显示在页面上。

### 4. 评论树洞页面 (`pages/treeHole/treeHole`)
- 展示用户分享的和食物相关的信息。
- 可以发送纯文字或者带标题的图文。

## 配置信息
在 `app.json` 中进行全局配置，包括页面路径、导航栏标题和底部导航栏信息。底部导航栏包含三个入口：评论树洞、分食堂和人流量，每个入口都配置了对应的图标。

```json:c%3A%5CUsers%5Cwangy%5CWeChatProjects%5Cminiprogram-6%5Capp.json
{
  "pages": [
    "pages/treeHole/treeHole",
    "pages/index/index",
    "pages/comment/comment",
    "pages/totalCrowd/totalCrowd"
  ],
  "window": {
    "navigationBarTitleText": "餐厅评价与人流量统计"
  },
  "tabBar": {
    "list": [
      {
        "pagePath": "pages/treeHole/treeHole",
        "text": "评论树洞",
        "iconPath": "images/shudong.png",
        "selectedIconPath": "images/shudong.png"
      },
      {
        "pagePath": "pages/index/index",
        "text": "分食堂",
        "iconPath": "images/shitang.png",
        "selectedIconPath": "images/shitang.png"
      },
      {
        "pagePath": "pages/crowd/crowd",
        "text": "人流量",
        "iconPath": "images/renliuliang.png",
        "selectedIconPath": "images/renliuliang.png"
      }
    ]
  }
}
