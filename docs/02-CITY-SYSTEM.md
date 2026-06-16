# 城池绘制系统 - 设计规划

## 概述

点击地图上的城池后，弹出城池详情面板，显示该城池的**像素侧视图绘制**。包含城墙、城门、宫殿、民居、农田、兵营等元素，5个等级有不同的视觉外观。

## 视觉风格

### 像素侧视图（横版视角）

```
┌─────────────────────────────────────────────────────────────┐
│                         天空/背景                            │
│                                                             │
│    ☁️        ☁️              ☁️                              │
│                                                             │
│   ┌─────────┐                                ┌─────────┐    │
│   │ 城墙塔楼 │═══════════╗    ╔═════════════│ 城墙塔楼 │    │
│   │  🏰     │           ║    ║             │   🏰    │    │
│   └────┬────┘           ║    ║             └────┬────┘    │
│        │                ║城门║                  │         │
│   ████████████          ║ 🚪║           ████████████      │
│   █ 城墙内 █════════════╩══╩═════════════█ 城墙内 █      │
│   ████████████     城池内部               ████████████      │
│                                                             │
│   🏠🏠🏠    🏛️宫殿     ⛺兵营     🌾农田     🏪市场       │
│   民居区      中心       军事区     农业区     商业区       │
│                                                             │
│   ═══════════════════════════════════════════════════════  │
│                        地面                                  │
└─────────────────────────────────────────────────────────────┘
```

## 5级城池视觉设计

### Level 1: 村庄 (Village)

```
         🌳
    ════════════
    │  🏠  🏠  │    ← 简陋木栅栏
    │  🏠 🏠🏠 │    ← 几间茅草屋
    ════════════
    🌾 🌾 🌾      ← 小片农田
    
尺寸: 200x120 像素
元素: 木栅栏、4-6间茅草屋、小农田
色调: 土黄色、棕色
```

### Level 2: 县城 (County)

```
         🏰
    ╔═══════════╗
    ║ ⌂   ⌂   ⌂ ║    ← 矮城墙
    ║   🏛️      ║    ← 小县衙
    ║ ⌂ ⌂  ⌂ ⌂ ║    ← 砖瓦房
    ╚═══╦═══╦═══╝
        ║🚪║        ← 简单城门
    🌾🌾 🏪 🌾🌾
    
尺寸: 240x150 像素
元素: 矮城墙、县衙、民居、农田、小市场
色调: 灰色城墙、青瓦
```

### Level 3: 郡城 (Prefecture)

```
       🏰   🏰
   ╔═════════════╗
   ║  ⌂  ⌂  ⌂  ⌂ ║    ← 高城墙
   ║    🏛️🏛️     ║    ← 郡守府
   ║ ⌂ ⌂ ⌂ ⌂ ⌂ ║    ← 住宅区
   ║  ⛺ 🏹 ⛺    ║    ← 兵营区
   ╚═══╦═════╦═══╝
       ║ 🚪🚪 ║      ← 双城门
   🌾🌾🌾 🏪🏪 🌾🌾🌾
   
尺寸: 300x180 像素
元素: 高城墙、郡守府、多区域、双城门
色调: 灰砖城墙、红柱
```

### Level 4: 州城 (Province)

```
    🏰 🏰   🏰 🏰
  ╔═══════════════════╗
  ║ 🏰 ═══════════ 🏰 ║    ← 城墙+角楼
  ║   ⌂  ⌂  ⌂  ⌂  ⌂  ║
  ║     🏛️🏛️🏛️       ║    ← 大宫殿
  ║ ⌂ ⌂ ⌂ ⌂ ⌂ ⌂ ⌂ ║
  ║ ⛺ 🏹 ⛺ 🏹 ⛺    ║    ← 大型兵营
  ║  🏪 🏪 🏪 🏪     ║    ← 商业区
  ╚═════╦══════╦═════╝
        ║ 🚪🚪🚪 ║      ← 三城门
  🌾🌾🌾🌾 🏪🏪🏪 🌾🌾🌾🌾
  
尺寸: 360x220 像素
元素: 高城墙+角楼、大宫殿、多区域、三城门
色调: 青砖城墙、金顶宫殿
```

### Level 5: 都城 (Capital)

```
      🏯🏯🏯🏯🏯
  ╔═══════════════════════════╗
  ║ 🏰═╗                ╔═🏰 ║    ← 城墙+双角楼
  ║    ║   🏯🏯🏯🏯    ║    ║
  ║ 🏰 ║     🏛️        ║ 🏰 ║    ← 宫殿群
  ║    ║  🏛️🏛️🏛️🏛️    ║    ║
  ║ ⌂  ║               ║  ⌂ ║
  ║ ⌂ ⌂║ ⛺ 🏹 ⛺ 🏹 ⛺ ║ ⌂ ⌂║    ← 军事区
  ║ ⌂ ⌂║               ║ ⌂ ⌂║
  ║    ║ 🏪🏪🏪🏪🏪    ║    ║    ← 繁华商业
  ╚════╩═══╦══════╦═══╩════╝
           ║🚪🚪🚪🚪║        ← 四城门
  🌾🌾🌾🌾🌾 🏪🏪🏪🏪 🌾🌾🌾🌾🌾

尺寸: 420x260 像素
元素: 完整城墙+双角楼、宫殿群、全功能区域、四城门
色调: 金碧辉煌、红墙黄瓦
```

## 城池详情面板

### 面板布局

```
┌─────────────────────────────────────────────────────────────────┐
│  ✕                                                              │
│                                                                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                                                           │  │
│  │                    [城池像素绘制区域]                       │  │
│  │                    420 x 260 像素                          │  │
│  │                                                           │  │
│  │    🏯🏯🏯🏯🏯                                            │  │
│  │  ╔═══════════════════════════╗                            │  │
│  │  ║ 🏰═╗                ╔═🏰 ║                            │  │
│  │  ... (完整城池绘制)         ║                            │  │
│  │                                                           │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  洛阳 ⭐⭐⭐⭐⭐ 都城                                       │  │
│  │  ─────────────────────────────────────────────────────── │  │
│  │  归属: 曹魏          守将: 曹操、夏侯惇                    │  │
│  │  人口: 125,000       兵力: 80,000                         │  │
│  │  粮食: 50,000        金钱: 80,000                         │  │
│  │  繁荣度: ████████████████████░░░░ 85%                     │  │
│  │  治安:   ██████████████████████░░ 92%                     │  │
│  │                                                           │  │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐        │  │
│  │  │ 🏛️ 宫殿 │ │ 🏠 民居 │ │ 🌾 农田 │ │ 🏪 市场 │        │  │
│  │  │ 等级:5  │ │ 数量:42 │ │ 等级:4  │ │ 等级:3  │        │  │
│  │  │ 效果:   │ │ 人口:   │ │ 产量:   │ │ 收入:   │        │  │
│  │  │ 政治+10 │ │ +2500   │ │ +800/季 │ │ +500/季 │        │  │
│  │  └─────────┘ └─────────┘ └─────────┘ └─────────┘        │  │
│  │                                                           │  │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐                     │  │
│  │  │ ⛺ 兵营 │ │ 🏹 校场 │ │ 🏰 城墙 │                     │  │
│  │  │ 等级:4  │ │ 等级:3  │ │ 等级:5  │                     │  │
│  │  │ 征兵:   │ │ 训练:   │ │ 防御:   │                     │  │
│  │  │ +500/月 │ │ 士气+5  │ │ 10,000  │                     │  │
│  │  └─────────┘ └─────────┘ └─────────┘                     │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  [🏰 建设]  [⚔️ 征兵]  [🌾 内政]  [📜 详情]  [🚪 返回]  │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## 像素绘制模块

### 1. CityRenderer - 城池渲染器

```typescript
class CityRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private sprites: SpriteSheet;
  
  // 渲染完整城池
  renderCity(city: CityData, level: number): void {
    this.clear();
    this.renderSky();           // 天空背景
    this.renderGround();        // 地面
    this.renderWalls(level);    // 城墙（根据等级）
    this.renderGate(level);     // 城门
    this.renderBuildings(city); // 建筑
    this.renderUnits(city);     // 驻军
    this.renderEffects(city);   // 特效（烟火、旗帜）
  }
}
```

### 2. SpriteSheet - 精灵图管理

```typescript
// 精灵图结构
interface SpriteSheet {
  // 城墙系列
  walls: {
    village: Sprite[];     // 木栅栏
    county: Sprite[];      // 矮城墙
    prefecture: Sprite[];  // 高城墙
    province: Sprite[];    // 城墙+角楼
    capital: Sprite[];     // 完整城墙
  };
  
  // 城门系列
  gates: {
    simple: Sprite;        // 简单木门
    double: Sprite;        // 双开门
    triple: Sprite;        // 三开门
    grand: Sprite;         // 宏伟城门
  };
  
  // 建筑系列
  buildings: {
    palace: Sprite[];      // 宫殿（5级）
    house: Sprite[];       // 民居（3级）
    farm: Sprite[];        // 农田（3级）
    market: Sprite[];      // 市场（3级）
    barracks: Sprite[];    // 兵营（3级）
    arena: Sprite[];       // 校场（3级）
  };
  
  // 装饰
  decorations: {
    trees: Sprite[];
    flags: Sprite[];
    people: Sprite[];
    smoke: Sprite[];
  };
}
```

### 3. 像素精灵定义（16x16 / 32x32）

```typescript
// 宫殿精灵示例
const PALACE_SPRITES = {
  // 等级1：小县衙
  level1: {
    width: 32, height: 32,
    pixels: [
      // 16行像素数据
      '................',
      '......████......',
      '.....██████.....',
      '....██▄▄▄▄██....',
      '...██▄▄▄▄▄▄██...',
      '..██▄▄▄▄▄▄▄▄██..',
      '..██▄▄████▄▄██..',
      '..██▄▄████▄▄██..',
      '..██▄▄████▄▄██..',
      '..██▄▄████▄▄██..',
      '..██▄▄████▄▄██..',
      '..██▄▄████▄▄██..',
      '...██████████...',
      '...██████████...',
      '...██████████...',
      '................'
    ],
    colors: {
      '█': '#4A4A4A',  // 灰色
      '▄': '#8B4513',  // 棕色门
    }
  },
  
  // 等级5：宏伟宫殿
  level5: {
    width: 64, height: 48,
    pixels: [
      // 48行像素数据（简化示意）
      '............████████████............',
      '...........██▄▄▄▄▄▄▄▄▄██...........',
      '..........██▄▄▄▄▄▄▄▄▄▄▄██..........',
      // ... 更多像素行
    ],
    colors: {
      '█': '#C41E3A',  // 红墙
      '▄': '#FFD700',  // 金顶
    }
  }
};
```

## 建筑系统

### 建筑配置

```typescript
interface BuildingConfig {
  id: string;
  name: string;
  icon: string;
  maxLevel: number;
  effects: BuildingEffect[];
  spriteKey: string;
}

const BUILDINGS: Record<string, BuildingConfig> = {
  palace: {
    id: 'palace',
    name: '宫殿/府邸',
    icon: '🏛️',
    maxLevel: 5,
    effects: [
      { level: 1, stats: { politics: 2 } },
      { level: 3, stats: { politics: 5, charisma: 3 } },
      { level: 5, stats: { politics: 10, charisma: 8 } }
    ],
    spriteKey: 'buildings.palace'
  },
  
  house: {
    id: 'house',
    name: '民居',
    icon: '🏠',
    maxLevel: 3,
    effects: [
      { level: 1, stats: { population: 500 } },
      { level: 2, stats: { population: 1200 } },
      { level: 3, stats: { population: 2500 } }
    ],
    spriteKey: 'buildings.house'
  },
  
  farm: {
    id: 'farm',
    name: '农田',
    icon: '🌾',
    maxLevel: 3,
    effects: [
      { level: 1, stats: { grainPerTurn: 200 } },
      { level: 2, stats: { grainPerTurn: 500 } },
      { level: 3, stats: { grainPerTurn: 1000 } }
    ],
    spriteKey: 'buildings.farm'
  },
  
  market: {
    id: 'market',
    name: '市场',
    icon: '🏪',
    maxLevel: 3,
    effects: [
      { level: 1, stats: { goldPerTurn: 150 } },
      { level: 2, stats: { goldPerTurn: 350 } },
      { level: 3, stats: { goldPerTurn: 700 } }
    ],
    spriteKey: 'buildings.market'
  },
  
  barracks: {
    id: 'barracks',
    name: '兵营',
    icon: '⛺',
    maxLevel: 4,
    effects: [
      { level: 1, stats: { recruitPerTurn: 100 } },
      { level: 2, stats: { recruitPerTurn: 250 } },
      { level: 3, stats: { recruitPerTurn: 500 } },
      { level: 4, stats: { recruitPerTurn: 1000 } }
    ],
    spriteKey: 'buildings.barracks'
  },
  
  arena: {
    id: 'arena',
    name: '校场',
    icon: '🏹',
    maxLevel: 3,
    effects: [
      { level: 1, stats: { morale: 2, training: 50 } },
      { level: 2, stats: { morale: 5, training: 120 } },
      { level: 3, stats: { morale: 10, training: 250 } }
    ],
    spriteKey: 'buildings.arena'
  },
  
  wall: {
    id: 'wall',
    name: '城墙',
    icon: '🏰',
    maxLevel: 5,
    effects: [
      { level: 1, stats: { defense: 1000 } },
      { level: 2, stats: { defense: 2500 } },
      { level: 3, stats: { defense: 5000 } },
      { level: 4, stats: { defense: 8000 } },
      { level: 5, stats: { defense: 12000 } }
    ],
    spriteKey: 'walls'
  }
};
```

## 城池数据

```typescript
interface CityData {
  id: string;
  name: string;
  level: 1 | 2 | 3 | 4 | 5;
  factionId: string;
  
  // 基础属性
  population: number;
  prosperity: number;  // 0-100
  security: number;    // 0-100
  
  // 资源
  grain: number;
  gold: number;
  
  // 军事
  troops: number;
  defense: number;
  garrison: Hero[];    // 驻守武将
  
  // 建筑
  buildings: {
    palace: number;    // 宫殿等级
    house: number;     // 民居数量/等级
    farm: number;      // 农田等级
    market: number;    // 市场等级
    barracks: number;  // 兵营等级
    arena: number;     // 校场等级
    wall: number;      // 城墙等级
  };
  
  // 位置
  position: { x: number; y: number };
  
  // 特殊状态
  underSiege: boolean;
  justConquered: boolean;
}
```

## 城池等级与建筑对应关系

| 城池等级 | 城墙 | 宫殿 | 民居 | 农田 | 市场 | 兵营 | 校场 |
|---------|------|------|------|------|------|------|------|
| Lv1 村庄 | 木栅栏 | 无 | 4-6间 | 1片 | 无 | 无 | 无 |
| Lv2 县城 | 矮墙 | 县衙 | 10-15间 | 2片 | 1个 | 1个 | 无 |
| Lv3 郡城 | 高墙 | 郡守府 | 20-30间 | 3片 | 2个 | 2个 | 1个 |
| Lv4 州城 | 城墙+角楼 | 州牧府 | 40-50间 | 4片 | 3个 | 3个 | 2个 |
| Lv5 都城 | 完整城墙 | 宫殿群 | 60+间 | 5片 | 4个 | 4个 | 3个 |

## 建筑升级系统

### 升级条件

```typescript
interface UpgradeCost {
  level: number;
  gold: number;
  grain: number;
  turns: number;  // 建造回合数
}

const UPGRADE_COSTS: Record<string, UpgradeCost[]> = {
  palace: [
    { level: 1, gold: 500, grain: 200, turns: 2 },
    { level: 2, gold: 1200, grain: 500, turns: 3 },
    { level: 3, gold: 2500, grain: 1000, turns: 4 },
    { level: 4, gold: 5000, grain: 2000, turns: 5 },
    { level: 5, gold: 10000, grain: 4000, turns: 6 }
  ],
  
  wall: [
    { level: 1, gold: 300, grain: 100, turns: 1 },
    { level: 2, gold: 800, grain: 300, turns: 2 },
    { level: 3, gold: 1500, grain: 600, turns: 3 },
    { level: 4, gold: 3000, grain: 1200, turns: 4 },
    { level: 5, gold: 6000, grain: 2500, turns: 5 }
  ],
  // ... 其他建筑
};
```

### 升级逻辑

```typescript
function upgradeBuilding(city: CityData, buildingId: string): UpgradeResult {
  const currentLevel = city.buildings[buildingId];
  const maxLevel = BUILDINGS[buildingId].maxLevel;
  
  // 检查是否已满级
  if (currentLevel >= maxLevel) {
    return { success: false, reason: '已达最高等级' };
  }
  
  // 检查资源
  const cost = UPGRADE_COSTS[buildingId][currentLevel];
  if (city.gold < cost.gold || city.grain < cost.grain) {
    return { success: false, reason: '资源不足' };
  }
  
  // 扣除资源，开始建造
  city.gold -= cost.gold;
  city.grain -= cost.grain;
  
  return { 
    success: true, 
    turnsRemaining: cost.turns,
    message: `${BUILDINGS[buildingId].name}升级中，还需${cost.turns}回合`
  };
}
```

## 特效系统

### 动态效果

```typescript
interface CityEffect {
  type: 'smoke' | 'flag' | 'people' | 'lights';
  position: { x: number; y: number };
  animation: AnimationConfig;
}

// 烟火效果（民居烟囱）
const SMOKE_EFFECT: CityEffect = {
  type: 'smoke',
  position: { x: 100, y: 80 },
  animation: {
    frames: 4,
    speed: 0.5,
    loop: true,
    pixels: [
      '░░',  // 淡烟
      '▒▒',  // 中烟
      '▓▓',  // 浓烟
      '░░',  // 淡烟
    ]
  }
};

// 旗帜效果（城墙上）
const FLAG_EFFECT: CityEffect = {
  type: 'flag',
  position: { x: 50, y: 30 },
  animation: {
    frames: 3,
    speed: 0.3,
    loop: true,
    colors: {
      '曹魏': '#4A90D9',
      '蜀汉': '#5BA55B',
      '东吴': '#D94A4A'
    }
  }
};

// 人群效果（市场、街道）
const PEOPLE_EFFECT: CityEffect = {
  type: 'people',
  position: { x: 200, y: 150 },
  animation: {
    frames: 8,
    speed: 0.2,
    loop: true,
    maxPeople: 10
  }
};
```

## 交互设计

### 城池详情面板交互

1. **建筑点击**：点击建筑图标，显示升级面板
2. **武将拖拽**：拖拽武将到城池，设置驻守
3. **资源分配**：滑块调整资源分配比例
4. **快捷操作**：一键征兵、一键收获

### 城池绘制区域交互

1. **鼠标悬停**：建筑高亮，显示建筑信息
2. **点击建筑**：弹出建筑详情
3. **缩放**：滚轮缩放城池视图
4. **平移**：拖动查看城池不同区域

## 文件结构

```
client/src/components/CityView/
├── CityDetailPanel.tsx      # 城池详情面板主组件
├── CityCanvas.tsx           # 城池像素绘制Canvas
├── BuildingCard.tsx         # 建筑卡片组件
├── UpgradeModal.tsx         # 升级弹窗
├── CityInfoBar.tsx          # 城池信息栏
├── engine/
│   ├── CityRenderer.ts      # 城池渲染引擎
│   ├── SpriteManager.ts     # 精灵图管理
│   ├── AnimationEngine.ts   # 动画引擎
│   └── EffectSystem.ts      # 特效系统
├── sprites/
│   ├── walls/               # 城墙精灵
│   │   ├── village.png
│   │   ├── county.png
│   │   ├── prefecture.png
│   │   ├── province.png
│   │   └── capital.png
│   ├── buildings/           # 建筑精灵
│   │   ├── palace/
│   │   ├── house/
│   │   ├── farm/
│   │   ├── market/
│   │   ├── barracks/
│   │   └── arena/
│   ├── gates/               # 城门精灵
│   ├── decorations/         # 装饰精灵
│   └── effects/             # 特效精灵
├── data/
│   ├── buildingConfig.ts    # 建筑配置
│   ├── cityLevels.ts        # 城池等级配置
│   └── upgradeCosts.ts      # 升级费用
└── types/
    └── city.ts              # 城池类型定义
```

## 性能优化

1. **精灵图预加载**：游戏启动时加载所有精灵图
2. **离屏Canvas缓存**：静态建筑缓存到离屏Canvas
3. **按需渲染**：只在面板打开时渲染
4. **动画节流**：非可见区域暂停动画
5. **资源复用**：相同建筑复用精灵图实例

## 开发阶段

### Phase 1: 基础城池绘制
- Canvas基础渲染
- 5级城池静态绘制
- 基础建筑精灵

### Phase 2: 交互与详情
- 城池详情面板
- 建筑信息展示
- 点击交互

### Phase 3: 动画与特效
- 建筑动画
- 环境特效（烟、旗帜、人群）
- 鼠标悬停效果

### Phase 4: 升级系统
- 升级面板
- 资源检查
- 建造队列

## 验证方案

1. **渲染测试**：5级城池正确显示
2. **交互测试**：点击建筑弹出信息
3. **升级测试**：资源充足时可升级，资源不足时提示
4. **动画测试**：特效流畅，无卡顿
5. **性能测试**：面板打开时帧率稳定
