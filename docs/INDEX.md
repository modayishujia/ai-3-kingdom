# AI 三国 - 设计文档

## 文档目录

| 编号 | 模块 | 文件 | 说明 |
|------|------|------|------|
| 00 | 主规划 | [README.md](./README.md) | 整体架构和开发规划 |
| 01 | 地图系统 | [01-MAP-SYSTEM.md](./01-MAP-SYSTEM.md) | 像素风格大地图设计 |
| 02 | 城池系统 | [02-CITY-SYSTEM.md](./02-CITY-SYSTEM.md) | 城池绘制和详情 |
| 03 | 战斗系统 | [03-BATTLE-SYSTEM.md](./03-BATTLE-SYSTEM.md) | 回合制战棋战斗 |
| 04 | 武将系统 | [04-HERO-SYSTEM.md](./04-HERO-SYSTEM.md) | 200+武将系统 |
| 05 | 外交系统 | [05-DIPLOMACY-SYSTEM.md](./05-DIPLOMACY-SYSTEM.md) | 联盟、联姻、间谍 |
| 06 | 经济系统 | [06-ECONOMY-SYSTEM.md](./06-ECONOMY-SYSTEM.md) | 7种资源和贸易 |
| 07 | 内政系统 | [07-INTERNAL-AFFAIRS.md](./07-INTERNAL-AFFAIRS.md) | 建设、技术、政策 |
| 08 | 事件任务 | [08-EVENTS-QUESTS.md](./08-EVENTS-QUESTS.md) | AI驱动事件和任务 |

## 核心设计理念

### 1. AI 驱动
- 所有核心逻辑由大模型驱动
- 玩家通过对话做出决策
- AI根据历史生成动态剧情

### 2. 历史还原
- 贴合历史的事件和人物
- 历史事件作为"锚点"
- 人物性格基于史书记载

### 3. 简洁有趣
- 不让玩家太累
- 关键事件驱动游戏
- 选择有明确后果

## 技术架构

```
前端 (React) ←→ 后端 (Node.js) ←→ 大模型 API
     ↓               ↓
   本地存储         游戏引擎
```

## 开发阶段

### Phase 1: 基础框架 ✅
- 前后端搭建
- AI API 代理
- 设置页面
- 基础聊天

### Phase 2: 游戏核心逻辑
- 游戏状态管理
- AI剧情引擎
- 武将数据

### Phase 3: 三国大地图
- Canvas地图
- 势力着色
- 城池标记

### Phase 4: 游戏系统
- 战斗系统
- 经济系统
- 外交系统

### Phase 5: 剧情历史
- 历史事件
- 武将数据库
- 剧情分支

### Phase 6: 优化体验
- 界面美化
- 动画效果
- 性能优化
