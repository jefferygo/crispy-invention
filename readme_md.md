# 个人工作辅助面板

一个集成番茄钟、日程提醒和项目管理的现代化工作效率工具。采用响应式设计，支持PWA安装，提供流畅的用户体验。

## ✨ 功能特性

### 🍅 番茄钟
- **可视化圆形进度条**：直观显示工作/休息进度
- **自定义时长**：支持1-120分钟工作时间，1-60分钟休息时间
- **自动切换**：工作/休息时间自动切换
- **统计功能**：记录每日完成的番茄钟数量
- **音频提醒**：时间结束时播放提醒音
- **桌面通知**：支持浏览器原生通知
- **快捷键支持**：Ctrl/Cmd + 空格开始/暂停，Ctrl/Cmd + R重置

### 📅 日程提醒
- **灵活时间设置**：支持精确到分钟的时间安排
- **详细描述**：可添加标题和详细描述
- **实时提醒**：到达设定时间自动提醒
- **视觉反馈**：过期日程高亮显示
- **数据持久化**：自动保存到本地存储

### 📊 项目时间线（甘特图）
- **可视化项目进度**：直观的时间线展示
- **拖拽调整**：支持鼠标拖拽调整任务时间
- **多任务管理**：同时管理多个项目任务
- **自动计算**：显示任务持续天数
- **交互式操作**：悬停显示详细信息

## 🎨 设计特色

- **现代化UI**：采用毛玻璃效果和渐变背景
- **响应式设计**：完美适配桌面、平板和手机
- **暗色模式支持**：自动适应系统主题偏好
- **流畅动画**：丰富的交互动效和过渡效果
- **无障碍访问**：良好的键盘导航和屏幕阅读器支持

## 🚀 快速开始

### 在线体验
访问部署的网站即可直接使用，无需安装任何软件。

### 本地运行
1. 下载所有文件到本地目录
2. 使用任意Web服务器打开`index.html`
3. 或直接双击`index.html`在浏览器中打开

### PWA安装
在支持PWA的浏览器中：
1. 访问网站
2. 点击地址栏的"安装"图标
3. 确认安装到桌面/主屏幕

## 📱 浏览器支持

支持所有现代浏览器的近两年版本：
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

主要功能兼容性：
- **Web Audio API**：音频提醒功能
- **Notifications API**：桌面通知
- **localStorage**：数据持久化
- **CSS Grid/Flexbox**：布局系统
- **CSS Custom Properties**：主题系统

## 🛠️ 技术栈

- **HTML5**：语义化标记
- **CSS3**：现代化样式（Grid、Flexbox、Custom Properties）
- **原生JavaScript**：无框架依赖
- **PWA**：渐进式Web应用支持
- **Web APIs**：Audio Context、Notifications、localStorage

## 📂 项目结构

```
work-assistant-dashboard/
├── index.html          # 主页面
├── styles.css          # 样式文件
├── script.js           # 主要功能脚本
├── manifest.json       # PWA配置文件
├── README.md           # 项目说明
├── favicon.ico         # 网站图标
├── favicon-16x16.png   # 16x16图标
├── favicon-32x32.png   # 32x32图标
├── apple-touch-icon.png # Apple设备图标
├── icon-192x192.png    # PWA图标
└── icon-512x512.png    # PWA图标
```

## 🎯 核心功能说明

### 番茄钟模块
采用经典的番茄工作法，默认25分钟工作时间和5分钟休息时间。支持自定义时长，提供视觉和听觉双重提醒。

### 日程提醒模块
基于浏览器的定时检查机制，每秒检查一次是否有到期的日程。支持富文本描述和灵活的时间设置。

### 甘特图模块
简化版的项目管理工具，支持任务的创建、编辑和可视化展示。通过拖拽操作可快速调整任务时间。

## 🔧 自定义配置

### 修改默认设置
在`script.js`中可以修改以下默认值：
```javascript
let currentTime = 25 * 60; // 默认工作时间（秒）
let completedPomodoros = 0; // 每日完成计数
```

### 自定义样式
在`styles.css`中可以修改：
- 主题颜色
- 字体大小
- 动画效果
- 响应式断点

### 添加新功能
项目采用模块化设计，可以轻松扩展新功能：
1. 在HTML中添加新的面板
2. 在CSS中添加对应样式
3. 在JavaScript中实现功能逻辑

## 📈 部署指南

### Netlify部署
1. 将所有文件上传到Netlify
2. 设置构建命令为空（静态站点）
3. 发布目录设置为根目录

### GitHub Pages部署
1. 创建GitHub仓库
2. 上传所有文件到仓库
3. 在设置中启用GitHub Pages
4. 选择主分支作为源

### 其他平台
支持任何静态网站托管服务：
- Vercel
- Surge.sh
- Firebase Hosting
- AWS S3

## 🐛 问题反馈

如果遇到任何问题或有改进建议，欢迎：
1. 提交Issue
2. 发起Pull Request
3. 联系开发者

## 📄 许可证

本项目采用MIT许可证，可自由使用、修改和分发。

## 🙏 致谢

感谢所有开源项目的启发和社区的支持。

---

**开始使用**：立即访问工作辅助面板，提升你的工作效率！