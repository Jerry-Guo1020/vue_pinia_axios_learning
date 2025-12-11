# 学员管理系统

这是一个基于 Vue 3 + Vite 构建的学员管理系统，实现了完整的 CRUD 功能。

## 技术栈

- Vue 3 (Composition API + `<script setup>`)
- Vite
- Element Plus
- Pinia (状态管理)
- Vue Router 4
- Axios
- json-server (Mock 数据)

## 功能特性

- 用户登录/登出
- 学员信息管理 (增删改查)
- 分页功能
- 搜索功能
- 响应式设计

## 安装与运行

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 启动 Mock 服务器
pnpm server

# 构建生产版本
pnpm build
```

## 项目结构

```
src/
├── api/          # API 接口封装
├── components/    # 组件
├── router/        # 路由配置
├── store/         # 状态管理
├── views/         # 页面视图
├── App.vue       # 根组件
└── main.js       # 入口文件
```

## 登录信息

- 用户名: jerry
- 密码: 123456

或者

- 用户名: tom
- 密码: 123456
