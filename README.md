# AI 三国

AI驱动的三国策略游戏，所有核心逻辑（数值、任务、经济、武力、战斗等）均由大模型驱动。

## 特性

- 🤖 **AI驱动**: 所有游戏逻辑由AI生成
- 📜 **历史还原**: 贴合历史的剧情和事件
- 🎮 **策略深度**: 完整的内政、外交、战斗系统
- 🗺️ **像素地图**: 可拖动的三国大地图
- 👤 **武将系统**: 200+武将，AI驱动成长

## 技术栈

- **前端**: React + TypeScript + Vite
- **后端**: Node.js + Express + TypeScript
- **AI**: OpenAI兼容API（支持GPT、Claude、本地模型）

## 快速开始

### 1. 安装依赖

```bash
# 安装后端依赖
cd server
npm install

# 安装前端依赖
cd ../client
npm install
```

### 2. 启动后端

```bash
cd server
npm run dev
```

后端将在 http://localhost:3001 启动

### 3. 启动前端

```bash
cd client
npm run dev
```

前端将在 http://localhost:5173 启动

### 4. 配置AI

1. 打开浏览器访问 http://localhost:5173
2. 输入你的API Key和URL
3. 选择模型
4. 开始游戏

## 项目结构

```
ai-3-kingdom/
├── client/                    # 前端 React 项目
│   ├── src/
│   │   ├── components/        # UI组件
│   │   ├── pages/             # 页面
│   │   ├── stores/            # 状态管理
│   │   ├── services/          # API调用
│   │   └── App.tsx
│   └── package.json
│
├── server/                    # 后端 Node.js 项目
│   ├── src/
│   │   ├── routes/            # API路由
│   │   ├── services/          # 业务逻辑
│   │   ├── prompts/           # AI提示词
│   │   └── index.ts
│   └── package.json
│
└── shared/                    # 共享类型
    └── types.ts
```

## 核心系统

- **AI剧情引擎**: AI生成动态剧情和事件
- **武将系统**: 武将属性、技能、关系
- **战斗系统**: 回合制战棋战斗
- **经济系统**: 资源管理、贸易
- **内政系统**: 城池建设、技术研究
- **外交系统**: 联盟、联姻、间谍

## 开发计划

- [x] Phase 1: 基础框架
- [ ] Phase 2: 游戏核心逻辑
- [ ] Phase 3: 三国大地图系统
- [ ] Phase 4: 游戏系统完善
- [ ] Phase 5: 剧情与历史
- [ ] Phase 6: 优化与体验

## 许可证

MIT
