# 幸运抽奖网站

这是一个基于HTML、CSS和JavaScript开发的在线抽奖网站，包含用户抽奖页面和管理员后台两大模块。

## 功能特点

### 用户抽奖页面

- 转盘抽奖界面，支持动画效果
- 显示奖项设置和中奖结果
- 响应式设计，适配各种设备

### 管理员后台

- 安全的登录系统
- 奖项管理（添加、编辑、删除）
- 中奖概率设置
- 数据统计和可视化展示

## 使用说明

### 用户抽奖页面

1. 打开 `frontend/index.html` 访问抽奖页面
2. 点击"开始抽奖"按钮进行抽奖
3. 抽奖结束后会显示中奖结果

### 管理员后台

1. 点击抽奖页面底部的"管理员登录"链接，或直接访问 `frontend/admin/login.html`
2. 使用默认账号登录（用户名：admin，密码：admin123）
3. 在后台可以管理奖项和设置抽奖概率

## 技术实现

- **前端**：HTML5, CSS3, JavaScript
- **数据存储**：使用浏览器的 localStorage 进行数据持久化
- **图表**：使用 CSS3 和 JavaScript 实现动态图表效果
- **动画**：使用 CSS3 transitions 和 animations 实现流畅动画效果

## 目录结构

```
frontend/
  ├── index.html        # 用户抽奖页面
  ├── styles.css        # 主样式文件
  ├── script.js         # 主脚本文件
  ├── admin/            # 管理后台目录
  │   ├── login.html    # 管理员登录页面
  │   ├── dashboard.html # 仪表盘页面
  │   ├── prizes.html   # 奖项管理页面
  │   ├── probability.html # 概率设置页面
  │   ├── admin-styles.css # 后台样式文件
  │   ├── login.js      # 登录脚本
  │   ├── dashboard.js  # 仪表盘脚本
  │   ├── prizes.js     # 奖项管理脚本
  │   └── probability.js # 概率设置脚本
```

## 注意事项

- 本项目使用浏览器的 localStorage 存储数据，清除浏览器缓存会导致数据丢失
- 为保证最佳体验，建议使用现代浏览器（Chrome、Firefox、Edge、Safari等）
- 默认的管理员账号为：admin，密码：admin123 #   t e s t 1  
 #   t e s t 1  
 