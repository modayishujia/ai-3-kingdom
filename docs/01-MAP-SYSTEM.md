# 三国大地图系统 - 设计规划

## 概述

一个像素风格的三国大地图，支持无限拖动、多级缩放（全疆域→区域→城池周边），实时绘制势力范围、军队、事件标记。

## 技术选型

| 技术 | 选择 | 理由 |
|------|------|------|
| 渲染引擎 | **HTML5 Canvas** | 像素绘制性能最优，支持无限地图 |
| 地图瓦片 | **程序化生成** | 无需切图，AI可动态修改地形 |
| 缩放实现 | **多层LOD** | 不同缩放级别显示不同细节 |
| 状态管理 | **Zustand** | 轻量，适合频繁更新的地图状态 |

## 地图架构

```
┌─────────────────────────────────────────┐
│           MapContainer (React)          │
│  ┌─────────────────────────────────┐    │
│  │        Canvas 渲染层             │    │
│  │  ┌───────────────────────────┐  │    │
│  │  │    Terrain Layer          │  │    │
│  │  │    (地形/河流/山脉)       │  │    │
│  │  ├───────────────────────────┤  │    │
│  │  │    Faction Layer          │  │    │
│  │  │    (势力范围着色)         │  │    │
│  │  ├───────────────────────────┤  │    │
│  │  │    City Layer             │  │    │
│  │  │    (城池图标)             │  │    │
│  │  ├───────────────────────────┤  │    │
│  │  │    Army Layer             │  │    │
│  │  │    (军队标记)             │  │    │
│  │  ├───────────────────────────┤  │    │
│  │  │    Event Layer            │  │    │
│  │  │    (事件标记)             │  │    │
│  │  └───────────────────────────┘  │    │
│  └─────────────────────────────────┘    │
│  ┌─────────┐  ┌─────────────────────┐   │
│  │ 缩放控件 │  │ 城池详情弹窗         │   │
│  └─────────┘  └─────────────────────┘   │
└─────────────────────────────────────────┘
```

## 缩放级别设计（4级LOD）

### Level 1: 全疆域视图 (zoom: 0.3-0.5)
- 显示：整个三国疆域
- 地形：色块表示（绿色=平原，褐色=山地，蓝色=水域）
- 势力：大面积着色（魏=蓝，蜀=绿，吴=红，其他=灰）
- 城池：小圆点+名称
- 军队：不显示

### Level 2: 区域视图 (zoom: 0.5-1.0)
- 显示：1-2个州的范围
- 地形：开始显示河流、山脉轮廓
- 势力：边界线清晰
- 城池：图标+名称+兵力数
- 军队：小旗帜标记

### Level 3: 城池周边 (zoom: 1.0-2.0)
- 显示：单个城池及周边
- 地形：详细地形（森林、农田、关隘）
- 势力：城池归属明确
- 城池：详细图标（不同等级不同外观）
- 军队：单位图标+数量

### Level 4: 战术视图 (zoom: 2.0-3.0)
- 显示：城池攻防区域
- 地形：格子地图，可显示地形效果
- 军队：详细单位（步兵、骑兵、弓兵图标）
- 可进行战术操作

## 像素美术风格

### 城池图标设计（16x16 / 32x32 像素）

```
┌──────────────────────┐
│  城池等级图标：        │
│                      │
│  Lv1 村庄:  小房子    │
│  Lv2 县城:  围墙+塔  │
│  Lv3 郡城:  双塔+城门 │
│  Lv4 州城:  大城池    │
│  Lv5 都城:  宫殿+城墙 │
└──────────────────────┘
```

### 地形像素样式
- 平原：浅绿色草地纹理
- 山地：深褐色三角形
- 河流：蓝色波浪线
- 森林：深绿色树木
- 沙漠：黄色沙地
- 城池周边：浅灰色道路

### 势力颜色
| 势力 | 主色 | 边界色 |
|------|------|--------|
| 曹魏 | #4A90D9 (蓝) | #2C5F8A |
| 蜀汉 | #5BA55B (绿) | #3A7A3A |
| 东吴 | #D94A4A (红) | #8A2C2C |
| 其他 | #999999 (灰) | #666666 |
| 未占领 | #F5E6C8 (黄褐) | #D4C4A0 |

## 核心模块

### 1. MapEngine - 地图引擎

```typescript
// 地图引擎核心
class MapEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private camera: Camera;
  private layers: MapLayer[];
  
  // 视口管理
  camera: {
    x: number;          // 世界坐标X
    y: number;          // 世界坐标Y
    zoom: number;       // 缩放级别 0.3-3.0
    targetX: number;    // 平滑移动目标
    targetY: number;
    targetZoom: number;
  }
  
  // 坐标转换
  screenToWorld(sx: number, sy: number): {x: number, y: number};
  worldToScreen(wx: number, wy: number): {x: number, y: number};
  
  // 交互
  handleDrag(dx: number, dy: number): void;
  handleZoom(delta: number, centerX: number, centerY: number): void;
  handleClick(worldX: number, worldY: number): MapObject | null;
}
```

### 2. TerrainGenerator - 地形生成

```typescript
// 程序化地形生成（像素风）
class TerrainGenerator {
  // 基于Perlin噪声生成地形
  generateTerrain(width: number, height: number): TerrainMap;
  
  // 三国历史地形约束
  applyHistoricalConstraints(terrain: TerrainMap): void;
  // - 长江必须横贯东西
  // - 黄河必须流经中原
  // - 秦岭、太行山等山脉位置固定
  
  // 渲染像素地形
  renderTerrain(ctx: CanvasRenderingContext2D, 
                viewport: Viewport, 
                zoom: number): void;
}
```

### 3. FactionRenderer - 势力渲染

```typescript
// 势力范围渲染
class FactionRenderer {
  // 渲染势力着色（使用FloodFill算法）
  renderFactionColors(ctx: CanvasRenderingContext2D,
                      cities: City[],
                      viewport: Viewport): void;
  
  // 渲染势力边界
  renderBorders(ctx: CanvasRenderingContext2D,
                factions: Faction[]): void;
  
  // 势力颜色配置
  private factionColors: Map<string, FactionColor>;
}
```

### 4. CityMarker - 城池标记

```typescript
// 城池渲染和交互
class CityMarker {
  // 渲染城池图标
  renderCity(ctx: CanvasRenderingContext2D,
             city: City,
             zoom: number): void;
  
  // 根据等级选择图标
  private getCityIcon(level: number): ImageBitmap;
  
  // 城池点击检测
  hitTest(worldX: number, worldY: number, city: City): boolean;
}
```

### 5. ArmyTracker - 军队追踪

```typescript
// 军队标记渲染
class ArmyTracker {
  // 渲染军队位置
  renderArmies(ctx: CanvasRenderingContext2D,
               armies: Army[],
               zoom: number): void;
  
  // 渲染行军路线
  renderMarchRoute(ctx: CanvasRenderingContext2D,
                   route: MarchRoute): void;
  
  // 军队动画
  animateMovement(army: Army, target: Position): void;
}
```

### 6. EventMarker - 事件标记

```typescript
// 历史事件标记
class EventMarker {
  // 渲染事件标记（闪烁动画）
  renderEvents(ctx: CanvasRenderingContext2D,
               events: GameEvent[],
               zoom: number): void;
  
  // 事件图标样式
  private getEventIcon(type: EventType): string;
  // 战争: ⚔️
  // 会议: 🏛️
  // 灾害: 🌋
  // 丰收: 🌾
}
```

## 数据结构

```typescript
// 世界坐标系（像素单位）
interface WorldPosition {
  x: number;  // 0-4000（地图宽度）
  y: number;  // 0-3000（地图高度）
}

// 城池数据
interface MapCity {
  id: string;
  name: string;
  position: WorldPosition;
  level: number;        // 1-5
  factionId: string;
  population: number;
  troops: number;
  icon: CityIconType;
}

// 军队数据
interface MapArmy {
  id: string;
  factionId: string;
  position: WorldPosition;
  target?: WorldPosition;
  size: number;         // 兵力数
  type: 'infantry' | 'cavalry' | 'archer' | 'navy';
  moving: boolean;
}

// 事件标记
interface MapEvent {
  id: string;
  type: 'battle' | 'meeting' | 'disaster' | 'harvest';
  position: WorldPosition;
  date: GameDate;
  active: boolean;
}

// 视口状态
interface Viewport {
  x: number;
  y: number;
  zoom: number;
  width: number;
  height: number;
}
```

## 交互设计

### 拖动操作
- 鼠标拖动：平移地图
- 触摸拖动：移动端支持
- 惯性滑动：释放后继续滑动

### 缩放操作
- 鼠标滚轮：以鼠标位置为中心缩放
- 双指缩放：移动端支持
- 缩放按钮：+/- 按钮
- 缩放范围：0.3x - 3.0x

### 点击交互
- 点击城池：弹出详情面板
- 点击军队：显示军队信息
- 点击事件：显示事件详情
- 点击空白：取消选择

### 快捷操作
- 双击城池：快速缩放并居中
- 空格键：回到玩家城池
- 1-5数字键：快速跳转到各势力都城

## 城池详情弹窗

```
┌──────────────────────────────┐
│  [城池图标] 洛阳             │
│  ─────────────────────────── │
│  归属：曹魏                  │
│  等级：★★★★★ (都城)         │
│  人口：125,000               │
│  兵力：80,000                │
│  繁荣度：██████████ 95%      │
│  ─────────────────────────── │
│  [查看详情] [派兵] [外交]     │
└──────────────────────────────┘
```

## 文件结构

```
client/src/components/GameMap/
├── MapContainer.tsx        # 地图容器组件
├── MapCanvas.tsx           # Canvas渲染组件
├── MapControls.tsx         # 缩放控件
├── CityDetailPopup.tsx     # 城池详情弹窗
├── ArmyInfoPanel.tsx       # 军队信息面板
├── engine/
│   ├── MapEngine.ts        # 地图引擎核心
│   ├── Camera.ts           # 摄像机/视口控制
│   ├── InputHandler.ts     # 输入处理（拖动/缩放）
│   └── Renderer.ts         # 渲染协调器
├── layers/
│   ├── TerrainLayer.ts     # 地形渲染层
│   ├── FactionLayer.ts     # 势力范围层
│   ├── CityLayer.ts        # 城池标记层
│   ├── ArmyLayer.ts        # 军队标记层
│   └── EventLayer.ts       # 事件标记层
├── generators/
│   ├── TerrainGenerator.ts # 程序化地形生成
│   └── PixelArt.ts         # 像素图标生成
├── data/
│   ├── mapConfig.ts        # 地图配置
│   └── terrainData.ts      # 地形数据
└── types/
    └── map.ts              # 地图类型定义
```

## 像素图标资源

### 城池图标（程序化生成）
```typescript
// 16x16像素城池图标
const CITY_ICONS = {
  village: [
    '....XXXX....',
    '...XxxxxX...',
    '..XxxxxxxX..',
    '.XxxxxxxxxX.',
    'XxxxxxxxxxxX',
    // ... 16行像素数据
  ],
  county: [/* 县城图标 */],
  prefecture: [/* 郡城图标 */],
  province: [/* 州城图标 */],
  capital: [/* 都城图标 */]
};
```

### 地形瓦片（32x32像素）
```typescript
const TERRAIN_TILES = {
  plains: [/* 草地纹理 */],
  mountain: [/* 山脉纹理 */],
  forest: [/* 森林纹理 */],
  water: [/* 水域纹理 */],
  desert: [/* 沙漠纹理 */],
  road: [/* 道路纹理 */]
};
```

## 性能优化

### 渲染优化
1. **视口裁剪**：只渲染视口内的内容
2. **分层缓存**：地形层不频繁变化，缓存为离屏Canvas
3. **LOD切换**：不同缩放级别使用不同精度的资源
4. **.requestAnimationFrame**：60fps平滑渲染

### 内存优化
1. **瓦片复用**：相同地形瓦片复用
2. **图标池**：图标对象池，避免频繁创建
3. **按需加载**：城池详情数据按需加载

## 与游戏引擎集成

```typescript
// 地图状态同步
interface MapSync {
  // 游戏状态 → 地图更新
  onCityOwnerChange(cityId: string, newFaction: string): void;
  onArmyMove(armyId: string, newPosition: WorldPosition): void;
  onEventOccur(event: GameEvent): void;
  
  // 地图交互 → 游戏状态
  onCityClick(cityId: string): void;
  onArmySelect(armyId: string): void;
  onTileClick(position: WorldPosition): void;
}
```

## 开发阶段

### Phase 1: 基础地图
- Canvas渲染基础
- 程序化地形生成（静态）
- 拖动和缩放功能
- 城池图标渲染

### Phase 2: 势力系统
- 势力范围着色
- 势力边界线
- 城池详情弹窗

### Phase 3: 动态元素
- 军队标记和移动
- 事件标记
- 动画效果

### Phase 4: 交互完善
- 点击检测
- 快捷操作
- 性能优化

## 验证方案

1. **基础功能**：地图能正常显示、拖动、缩放
2. **视觉效果**：像素风格美观，势力颜色清晰
3. **交互响应**：城池点击弹出详情，操作流畅
4. **性能测试**：拖动/缩放时帧率稳定60fps
5. **集成测试**：与游戏引擎状态同步正常
