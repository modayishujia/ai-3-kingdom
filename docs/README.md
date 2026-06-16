# AI 驱动三国 SLG 游戏 - 开发规划

## 项目概述

一款以**剧情驱动**为核心的三国SLG网页游戏，所有核心逻辑（数值、任务、经济、战斗、外交）均由大模型驱动，力求贴合历史。玩家通过与AI对话做出决策，影响历史走向。

## 技术架构

```
┌─────────────────────────────────────────┐
│              前端 (React)                │
│  ┌───────────┐ ┌──────────┐ ┌────────┐  │
│  │ 聊天界面   │ │ 地图/城池 │ │ 数据面板│  │
│  └─────┬─────┘ └────┬─────┘ └───┬────┘  │
│        └──────────┬──┘──────────┘        │
│              localStorage                │
└──────────────────┬──────────────────────┘
                   │ HTTP/WebSocket
┌──────────────────┴──────────────────────┐
│             后端 (Node.js/Express)        │
│  ┌──────────┐ ┌──────────┐ ┌─────────┐  │
│  │ 游戏引擎  │ │ AI代理层  │ │ 状态管理 │  │
│  └─────┬────┘ └────┬─────┘ └────┬────┘  │
│        └─────┬─────┘────────────┘        │
│           OpenAI 兼容 API                │
└─────────────────────────────────────────┘
```

### 前后端职责

| 层 | 职责 |
|---|------|
| **前端** | UI渲染、玩家交互、本地存档、地图显示、聊天界面 |
| **后端** | AI API代理(保护key)、游戏逻辑计算、历史事件管理、存档校验 |
| **AI** | 剧情生成、数值决策、战斗模拟、武将对话、外交判断 |

## 项目结构

```
ai-3-kingdom/
├── client/                    # 前端 React 项目
│   ├── src/
│   │   ├── components/        # UI组件
│   │   │   ├── ChatPanel/     # AI对话面板（核心交互）
│   │   │   ├── GameMap/       # 三国大地图（详见地图规划文档）
│   │   │   ├── CityView/      # 城池视图（详见城池绘制规划）
│   │   │   ├── HeroPanel/     # 武将面板（详见武将系统规划）
│   │   │   ├── BattleReport/  # 战报展示（详见战斗系统规划）
│   │   │   ├── EventCard/     # 事件卡片（详见事件与任务系统规划）
│   │   │   └── StatusBar/     # 资源/势力状态栏
│   │   ├── pages/
│   │   │   ├── SetupPage/     # 设置页（输入API Key/URL/模型）
│   │   │   ├── MainPage/      # 游戏主界面
│   │   │   └── LoadPage/      # 存档管理
│   │   ├── stores/            # 状态管理 (Zustand)
│   │   ├── services/          # API调用
│   │   │   └── gameApi.ts     # 与后端通信
│   │   ├── utils/
│   │   │   └── storage.ts     # localStorage 存档工具
│   │   ├── prompts/           # 前端用的提示词模板
│   │   └── App.tsx
│   ├── package.json
│   └── vite.config.ts
│
├── server/                    # 后端 Node.js 项目
│   ├── src/
│   │   ├── routes/
│   │   │   ├── game.ts        # 游戏状态API
│   │   │   ├── chat.ts        # AI对话API
│   │   │   └── battle.ts      # 战斗API
│   │   ├── services/
│   │   │   ├── aiService.ts   # AI API调用封装
│   │   │   ├── gameEngine.ts  # 游戏引擎核心
│   │   │   └── historyData.ts # 历史数据管理
│   │   ├── prompts/           # AI提示词模板
│   │   │   ├── system.ts      # 系统提示词
│   │   │   ├── story.ts       # 剧情生成
│   │   │   ├── battle.ts      # 战斗模拟
│   │   │   ├── diplomacy.ts   # 外交决策
│   │   │   └── economy.ts     # 经济管理
│   │   ├── data/              # 静态历史数据
│   │   │   ├── heroes.json    # 武将数据
│   │   │   ├── cities.json    # 城池数据
│   │   │   ├── events.json    # 历史事件
│   │   │   └── factions.json  # 势力数据
│   │   ├── types/
│   │   └── index.ts
│   ├── package.json
│   └── tsconfig.json
│
└── shared/                    # 前后端共享类型
    └── types.ts
```

## 核心系统设计

### 1. 开局设置系统

玩家进入游戏时需要配置：
- **API Base URL**: 大模型API地址（如 `https://api.openai.com/v1`）
- **API Key**: 大模型密钥
- **Model**: 模型名称（如 `gpt-4o`、`claude-3-opus`、本地模型名）
- **起始剧本**: 默认从黄巾之乱(184年)开始，玩家可选择其他历史起点

配置保存到 localStorage，后续自动加载。

### 2. AI 剧情引擎（核心）

AI 作为"历史编剧"，负责生成动态剧情：

```
系统提示词 = 角色设定 + 历史背景 + 当前状态 + 玩家行为
    ↓
AI 输出 = 剧情文本 + 数值变化 + 新事件 + 角色反应
    ↓
游戏引擎解析 JSON → 更新游戏状态 → 渲染前端
```

**关键设计**：
- AI 输出必须是结构化 JSON，前端解析渲染
- 系统提示词中注入当前游戏状态（势力分布、武将归属、资源等）
- 历史事件作为"锚点"，AI 围绕这些锚点生成分支剧情
- 每次对话后 AI 自动推进游戏时间线（按月/季度）

**剧情示例流程**：
1. 玩家选择"讨伐董卓"→ AI 生成联盟场景
2. AI 询问"谁来当盟主？"→ 玩家选择
3. AI 根据选择生成后续：诸侯各怀鬼胎的剧情
4. 战斗由 AI 模拟，输出详细战报

### 3. 武将系统

每个武将由 AI 驱动其"人格"：

```json
{
  "id": "guanyu",
  "name": "关羽",
  "era": "160-220",
  "traits": ["忠义", "傲慢", "武勇"],
  "stats": { "attack": 95, "defense": 88, "intellect": 72, "charisma": 85 },
  "relationships": {
    "liubei": "兄弟",
    "caocao": "复杂"
  },
  "speech_style": "说话简短有力，常引《春秋》"
}
```

AI 在与玩家对话时，会根据武将的 traits、relationships 和 speech_style 来生成对话内容。

**武将获取方式**：
- 历史事件触发（如桃园三结义）
- 招降（战后 AI 判断是否可招降）
- 事件选择（特定剧情分支可获得）

### 4. 战斗系统

战斗由 AI 模拟，但遵循基本规则：

**输入给 AI**：
- 双方将领属性、兵力、兵种
- 地形、天气、士气
- 特殊事件（埋伏、内应等）

**AI 输出**：
- 战斗过程描述（文字战报）
- 结构化结果（伤亡、俘虏、战利品）
- 胜负判定

**战斗提示词要点**：
```
你是三国时期的军事模拟器。根据以下条件模拟一场战斗：
- 要求历史合理性（以少胜多需要合理条件）
- 武将特性影响战斗（如张飞适合冲锋，诸葛亮擅长用计）
- 地形影响（水战、山地、平原各有优势）
- 输出格式：{winner, losses_a, losses_b, prisoners, report, key_moments[]}
```

### 5. 经济/内政系统（详见经济系统规划 + 内政系统规划）

AI 管理每个城池的内政：

**资源类型**：
- 粮食（养兵）
- 金钱（建设/外交）
- 人口（征兵/生产）
- 治安（叛乱风险）

**AI 内政决策**：
- 玩家可下达大方向（如"发展农业"）
- AI 细化执行方案，输出季度报告
- 自然灾害、丰收等随机事件由 AI 生成

### 6. 外交系统（详见外交系统规划）

AI 驱动势力间外交：

- **联盟**：AI 判断是否接受联盟（基于势力关系、历史渊源）
- **投降**：AI 判断何时投降/招降
- **背叛**：AI 根据关系值动态生成背叛事件
- **朝贡**：弱小势力的生存策略

外交提示词中注入各势力关系矩阵，AI 会基于历史人物性格做出决策。

## AI 提示词设计要点

### 系统提示词核心结构

```
你是《AI三国》的游戏AI，负责驱动以下系统：
1. 历史剧情（你是一位严谨的历史编剧）
2. 武将对话（你需要模拟每个武将的独特性格）
3. 战斗模拟（你需要成为公正的军事模拟器）
4. 经济管理（你需要成为合理的内政官）
5. 外交决策（你需要模拟各势力的真实意图）

历史准确性要求：
- 主要事件遵循真实历史时间线
- 人物性格基于史书记载
- 可以在细节上创作，但大方向符合历史
- 如果玩家做出偏离历史的决策，要合理地引导或展示后果

输出格式：始终输出合法JSON，格式为：
{
  "narrative": "剧情描述文本",
  "dialogue": [{"speaker": "武将名", "text": "对话内容"}],
  "effects": {"resources": {}, "relationships": {}, "events": []},
  "choices": [{"id": "选项ID", "text": "选项描述", "consequence_hint": "暗示"}],
  "next_date": "下一时间点"
}
```

### 历史一致性保障

1. **历史事件库**：预定义关键历史事件（如官渡之战、赤壁之战的时间、参与者、结果）
2. **时间锚点**：AI 生成的剧情必须围绕这些锚点展开
3. **人物关系网**：预定义武将关系，AI 对话时参考
4. **回溯修正**：如果 AI 生成了偏离历史的内容，通过提示词修正

## 数据模型

### 核心类型定义

```typescript
// 游戏状态
interface GameState {
  player: Player;
  date: GameDate;              // 当前游戏时间
  factions: Faction[];         // 所有势力
  heroes: Hero[];              // 所有武将
  cities: City[];              // 所有城池
  activeEvents: GameEvent[];   // 当前活跃事件
  history: HistoryLog[];       // 历史记录
  settings: GameSettings;
}

// 玩家
interface Player {
  name: string;
  factionId: string;           // 所属势力
  resources: Resources;
}

// 势力
interface Faction {
  id: string;
  name: string;                // 魏/蜀/吴/其他
  leaderId: string;
  heroes: string[];            // 武将ID列表
  cities: string[];            // 城池ID列表
  relationships: Record<string, number>;  // 与其他势力关系值
  personality: string;         // AI决策风格
}

// 武将
interface Hero {
  id: string;
  name: string;
  title?: string;              // 称号
  factionId?: string;
  stats: HeroStats;
  skills: string[];
  traits: string[];
  relationships: Record<string, string>;
  loyalty: number;             // 忠诚度
  alive: boolean;
  age: number;
}

interface HeroStats {
  attack: number;      // 武力 1-100
  defense: number;     // 防御 1-100
  intellect: number;   // 智力 1-100
  charisma: number;    // 魅力 1-100
  politics: number;    // 政治 1-100
}

// 城池
interface City {
  id: string;
  name: string;
  factionId?: string;
  population: number;
  prosperity: number;  // 繁荣度
  defense: number;     // 防御力
  resources: Resources;
  position: { x: number; y: number };
}

// 资源
interface Resources {
  grain: number;       // 粮食
  gold: number;        // 金钱
  troops: number;      // 兵力
  morale: number;      // 士气
}

// 游戏事件
interface GameEvent {
  id: string;
  type: 'story' | 'battle' | 'diplomacy' | 'economy' | 'random';
  title: string;
  description: string;
  choices: EventChoice[];
  historical: boolean;  // 是否为历史事件
  requiredDate?: GameDate;
}

// AI 对话
interface AIResponse {
  narrative: string;
  dialogue: DialogueLine[];
  effects: GameEffects;
  choices: AIChoice[];
  nextDate: GameDate;
}

// 存档
interface SaveData {
  gameState: GameState;
  version: string;
  timestamp: number;
}
```

## 前端界面设计

### 主要页面

1. **设置页 (Setup)**
   - API Key / URL / 模型输入
   - 历史剧本选择（时间线起点）
   - 开始新游戏 / 加载存档

2. **游戏主页 (Main)** - 对话+可视化混合模式
   - 左侧：AI 聊天/剧情面板（占60%宽度）- 剧情时为主要交互
   - 右侧：信息面板（可切换）- 战略时为主
     - 三国地图视图（实时显示势力变化）
     - 势力状态
     - 武将列表
     - 城池信息
   - 顶部：状态栏（日期、资源、势力名）
   - 底部：快捷操作栏

3. **对话界面**
   - AI 叙事（历史背景描述）
   - 武将对话（带头像、语气标签）
   - 玩家选项（2-4个选择）
   - 资源变动提示

4. **战报界面**
   - 战斗过程动画/文字滚动
   - 双方兵力对比条
   - 关键时刻高亮
   - 战后处置选项

### 交互流程

```
玩家做出选择 → 前端发送到后端 → 后端组装提示词 → 调用AI → 
解析AI响应 → 更新游戏状态 → 前端渲染新剧情 → 自动存档
```

## 开发阶段

### Phase 1: 基础框架（核心骨架）
- 前端 React 项目搭建（Vite + React + TypeScript）
- 后端 Node.js 项目搭建（Express + TypeScript）
- AI API 代理层（支持 OpenAI 兼容格式）
- 设置页面（API 配置输入）
- 基础聊天界面
- **验证**: 能通过后端代理调用AI，输出对话

### Phase 2: 游戏核心逻辑
- 游戏状态管理（Zustand）
- 数据模型定义
- 历史数据录入（初始武将、城池、势力）
- AI 系统提示词设计
- 剧情引擎（AI 生成 → JSON解析 → 状态更新）
- localStorage 存档/读档
- **验证**: 能开始游戏，AI生成剧情，状态正确更新

### Phase 3: 三国大地图系统（独立模块）
- Canvas地图引擎（拖动、缩放、LOD）
- 程序化像素地形生成
- 势力范围着色渲染
- 城池标记系统
- 军队追踪系统
- 事件标记系统
- 城池详情弹窗
- **详细设计见**: `plans/1781604053936-kind-meadow-map.md`
- **验证**: 地图能拖动缩放，城池可点击查看详情

### Phase 4: 游戏系统完善
- 武将系统（属性、技能、对话风格）
- 战斗系统（AI模拟 + 战报渲染）
- 经济系统（资源管理 + 内政报告）
- 外交系统（势力关系 + AI决策）
- **验证**: 各子系统可正常运转

### Phase 5: 剧情与历史
- 历史事件库完善（关键事件50+）
- 武将数据库完善（100+武将）
- 城池地图完善（主要城池30+）
- 剧情分支设计
- **验证**: 能完整经历一段历史剧情

### Phase 6: 优化与体验
- 对话界面美化
- 战斗动画效果
- 音效/BGM（可选）
- 存档管理界面
- 错误处理与网络异常
- 响应式适配

## 验证方案

1. **Phase 1 验证**: 启动前后端，输入 API Key，能完成一次 AI 对话
2. **Phase 2 验证**: 开始新游戏，选择剧本，AI 生成开局剧情，做出选择后状态更新
3. **Phase 3 验证**: 地图能拖动、缩放；城池可点击；势力颜色正确；军队可追踪
4. **Phase 4 验证**: 触发战斗 → 查看战报 → 检查资源变化 → 外交互动
5. **Phase 5 验证**: 从黄巾之乱开始，经历董卓之乱、群雄割据，AI 生成连贯剧情
6. **整体验证**: 完整游戏一局（1-2小时），无报错，剧情连贯，存档可用
