# FakeTencentTianqi_AliPay

天气查询支付宝小程序，移植自[腾讯天气](https://xw.tianqi.qq.com/)移动端 h5 页面

# 简介

学习支付宝小程序开发的练手项目。  
这是一个天气查询支付宝小程序，前后端分离，使用原生支付宝小程序框架和 js 开发，不含任何库。也没使用 ui 库，css 纯手搓。  
实现了显示城市基本天气信息和搜索某城市并显示天气信息的功能（点击顶部城市字样进入搜索）  
ui 布局和功能基本 1:1 还原[腾讯天气](https://xw.tianqi.qq.com/)移动端

后端天气数据来自于[和风天气 API](https://dev.qweather.com/)

### 扫码体验此小程序 demo

<img src="https://gcore.jsdelivr.net/gh/9WiSHao/AnythingStorage/img/weather_alipay.jpg" alt="alipay" width="200">

# 下载使用

以下是在电脑端小程序开发者工具中打开调试的方式

clone 此仓库到本地

```bash
git clone https://github.com/9WiSHao/FakeTencentTianqi_AliPay.git
```

然后打开支付宝小程序开发者工具，右上角打开项目，选择刚 clone 到本地的文件夹，项目类型支付宝小程序，完成

### 注意

目前使用的是我自己注册的免费和风天气 api 的 key，目前（23 年 11 月）可正常使用，之后不保证能正常。  
建议自行注册账号获取 key,详见[和风天气文档](https://dev.qweather.com/docs/configuration/project-and-key/)。  
获取 key 后，在 utils --> apis.js 里替换 qweatherKey 字符串为自己的 key

# 功能

| 完成功能                         | 完成情况 |
| -------------------------------- | -------- |
| 首页基础样式                     | ✅       |
| 搜索页样式                       | ✅       |
| 渲染首页数据                     | ✅       |
| 搜索功能                         | ✅       |
| 热门城市推荐                     | ✅       |
| 搜索记录                         | ✅       |
| 生活指数提示                     | ✅       |
| 空气质量                         | ✅       |
| 天气预警                         | ✅       |
| 7 日天气曲线图表                 | ✅       |
| 昨日天气                         | ❌       |
| 根据用户定位，渲染所在地天气信息 | ✅       |

昨日天气由于和风天气没有接口，获取不到。天气时光机里有，但是是付费 api，穷逼买不起，所以没做

# 相关项目

- [FakeTencentTianqi](https://github.com/9WiSHao/FakeTencentTianqi) - 这是相同功能相同后端的原生 h5 页面腾讯天气仿写

# License

[MIT](./LICENSE) © 9WiSHao
