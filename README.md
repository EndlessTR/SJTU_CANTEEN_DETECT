# 餐厅评价与人流量统计小程序

这是一个微信小程序，用于餐厅评价和人流量统计，用户可以查看各食堂的人流量情况，提交人流量反馈以及对餐厅进行评价。

## 项目结构

## 功能模块

### 1. 分食堂页面 (`pages/index/index`)
- 展示餐厅列表，包含餐厅名称、图片和描述。
- 用户可以选择餐厅，查看餐厅详情。
- 提供按钮跳转到人流量反馈页面和窗口评价页面。

### 2. 人流量反馈页面 (`pages/crowd/crowd`)
- 用户可以输入具体的人流量数值并提交。
- 也可以通过点击按钮快速反馈人流量等级（低、中、高）。
- 反馈信息会存储在本地缓存中。

### 3. 总人流量页面 (`pages/totalCrowd/totalCrowd`)
- 显示各食堂的人流量情况。

### 4. 窗口评价页面 (`pages/comment/comment`)
- 用户可以匿名填写对餐厅窗口的评价。
- 提交评价后，评价会显示在页面上。

### 5. 评论树洞页面 (`pages/treeHole/treeHole`)
- 展示餐厅的评论信息。

## 配置信息
在 `app.json` 中进行全局配置，包括页面路径、导航栏标题和底部导航栏信息。底部导航栏包含三个入口：评论树洞、分食堂和人流量，每个入口都配置了对应的图标。

```json:c%3A%5CUsers%5Cwangy%5CWeChatProjects%5Cminiprogram-6%5Capp.json
{
  "pages": [
    "pages/treeHole/treeHole",
    "pages/index/index",
    "pages/crowd/crowd",
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