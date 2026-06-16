# 战斗系统 - 设计规划

## 概述

回合制战棋战斗系统，战斗在格子地图上进行，支持5种兵种和武将技能释放。战斗在大地图上实时呈现，点击可查看战斗详情和战报。

## 系统架构

```
┌─────────────────────────────────────────────────────────────┐
│                      大地图层                                │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  城池A ←⚔️ 战斗中 ⚔️→ 城池B                        │    │
│  │         (战斗图标闪烁)                               │    │
│  └─────────────────────────────────────────────────────┘    │
│                        ↓ 点击战斗图标                         │
├─────────────────────────────────────────────────────────────┤
│                    战斗详情层                                │
│  ┌───────────────────────┐  ┌─────────────────────────┐    │
│  │                       │  │   战斗兵力面板          │    │
│  │    战棋地图            │  │   ┌─────────────────┐  │    │
│  │    (格子地图)          │  │   │ 进攻方: 曹操     │  │    │
│  │    可查看实时战况      │  │   │ 兵力: 50000     │  │    │
│  │    AI自动进行          │  │   │ 伤亡: 3200      │  │    │
│  │                       │  │   ├─────────────────┤    │    │
│  │                       │  │   │ 防守方: 刘备     │  │    │
│  │                       │  │   │ 兵力: 30000     │  │    │
│  │                       │  │   │ 伤亡: 8500      │  │    │
│  │                       │  │   └─────────────────┘  │    │
│  └───────────────────────┘  └─────────────────────────┘    │
│                        ↓ 战斗结束                            │
├─────────────────────────────────────────────────────────────┤
│                    战报系统层                                │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  📜 赤壁之战 战报                                     │    │
│  │  ─────────────────────────────────────────────────  │    │
│  │  时间: 建安十三年冬                                    │    │
│  │  地点: 赤壁                                           │    │
│  │  ─────────────────────────────────────────────────  │    │
│  │  ▶ 第1回合: 曹操大军渡江，周瑜火攻准备...              │    │
│  │  ▶ 第2回合: 东南风起，黄盖诈降...                      │    │
│  │  ▶ 第3回合: 火船冲入曹营，曹军大乱...                  │    │
│  │  ...                                                 │    │
│  │  ─────────────────────────────────────────────────  │    │
│  │  🏆 胜利方: 孙刘联军                                  │    │
│  │  📊 战果: 曹操败走华容道                               │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

## 战斗触发与规模

### 战斗触发条件

```typescript
interface BattleTrigger {
  type: 'siege' | 'field' | 'ambush' | 'intercept';
  attacker: string;    // 进攻方势力ID
  defender: string;    // 防守方势力ID
  location: string;    // 战场位置（城池ID或坐标）
  attackerForces: Army[];
  defenderForces: Army[];
}
```

### 战斗规模匹配

```typescript
function determineBattleScale(totalTroops: number): BattleScale {
  if (totalTroops < 5000) {
    return {
      type: 'skirmish',
      gridSize: { width: 10, height: 8 },
      maxTurns: 5,
      description: '小规模遭遇战'
    };
  } else if (totalTroops < 20000) {
    return {
      type: 'battle',
      gridSize: { width: 15, height: 12 },
      maxTurns: 10,
      description: '中规模战斗'
    };
  } else if (totalTroops < 50000) {
    return {
      type: 'campaign',
      gridSize: { width: 20, height: 16 },
      maxTurns: 15,
      description: '大规模战役'
    };
  } else {
    return {
      type: 'war',
      gridSize: { width: 25, height: 20 },
      maxTurns: 20,
      description: '史诗级会战'
    };
  }
}
```

## 兵种系统

### 兵种定义

```typescript
interface UnitType {
  id: string;
  name: string;
  icon: string;
  moveRange: number;      // 移动范围（格数）
  attackRange: number;    // 攻击范围（格数）
  baseStats: UnitStats;
  advantages: string[];   // 克制兵种
  disadvantages: string[]; // 被克制兵种
  terrainBonus: Record<string, number>; // 地形加成
  spriteKey: string;
}

const UNIT_TYPES: Record<string, UnitType> = {
  infantry: {
    id: 'infantry',
    name: '步兵',
    icon: '⚔️',
    moveRange: 3,
    attackRange: 1,
    baseStats: {
      hp: 100,
      attack: 25,
      defense: 30,
      speed: 20
    },
    advantages: ['archer'],
    disadvantages: ['cavalry'],
    terrainBonus: {
      plains: 0,
      forest: 10,
      mountain: 20,
      city: 15
    },
    spriteKey: 'units.infantry'
  },
  
  cavalry: {
    id: 'cavalry',
    name: '骑兵',
    icon: '🐴',
    moveRange: 5,
    attackRange: 1,
    baseStats: {
      hp: 80,
      attack: 35,
      defense: 20,
      speed: 40
    },
    advantages: ['infantry'],
    disadvantages: ['archer', 'spear'],
    terrainBonus: {
      plains: 20,
      forest: -10,
      mountain: -20,
      city: -5
    },
    spriteKey: 'units.cavalry'
  },
  
  archer: {
    id: 'archer',
    name: '弓兵',
    icon: '🏹',
    moveRange: 3,
    attackRange: 3,
    baseStats: {
      hp: 70,
      attack: 30,
      defense: 15,
      speed: 25
    },
    advantages: ['cavalry'],
    disadvantages: ['infantry'],
    terrainBonus: {
      plains: 10,
      forest: 15,
      mountain: 5,
      city: 10
    },
    spriteKey: 'units.archer'
  },
  
  navy: {
    id: 'navy',
    name: '水军',
    icon: '⛵',
    moveRange: 4,
    attackRange: 2,
    baseStats: {
      hp: 90,
      attack: 28,
      defense: 25,
      speed: 30
    },
    advantages: [],
    disadvantages: [],
    terrainBonus: {
      water: 30,
      plains: -10,
      forest: -20,
      mountain: -30
    },
    spriteKey: 'units.navy'
  },
  
  siege: {
    id: 'siege',
    name: '攻城器械',
    icon: '🗼',
    moveRange: 2,
    attackRange: 2,
    baseStats: {
      hp: 150,
      attack: 50,
      defense: 10,
      speed: 10
    },
    advantages: ['wall'],
    disadvantages: ['cavalry', 'infantry'],
    terrainBonus: {
      plains: 0,
      forest: -20,
      mountain: -30,
      city: 10
    },
    spriteKey: 'units.siege'
  }
};
```

### 兵种克制关系

```
        骑兵 ←←← 步兵 ←←← 弓兵
         ↓                    ↑
         →→→→→→→→→→→→→→→→→→→→

攻城器械: 被所有移动单位克制，但对城墙伤害极高
水军:     水战无敌，陆地作战大减
```

### 兵种属性

```typescript
interface UnitStats {
  hp: number;           // 生命值
  attack: number;       // 攻击力
  defense: number;      // 防御力
  speed: number;        // 速度（决定出手顺序）
}

// 实际战斗属性 = 基础属性 * (1 + 地形加成) * (1 + 武将加成) * 克制系数
```

## 格子地图系统

### 地形类型

```typescript
type TerrainType = 
  | 'plains'    // 平原 - 无特殊效果
  | 'forest'    // 森林 - 步兵/弓兵加成，骑兵减速
  | 'mountain'  // 山地 - 防御加成，移动困难
  | 'water'     // 水域 - 仅水军可通过
  | 'city'      // 城池 - 防御大幅加成
  | 'wall'      // 城墙 - 需攻城器械破坏
  | 'road'      // 道路 - 移动加速
  | 'bridge';  // 桥梁 - 狭窄通道，易守难攻

interface TerrainEffect {
  moveCost: number;     // 移动消耗（格数）
  defenseBonus: number; // 防御加成（%）
  attackBonus: number;  // 攻击加成（%）
  rangedPenalty: number; // 远程惩罚（%）
}
```

### 格子地图数据结构

```typescript
interface BattleMap {
  width: number;
  height: number;
  grid: TerrainType[][];
  deployZones: {
    attacker: Position[];
    defender: Position[];
  };
  objectives: Objective[]; // 战斗目标（占领点、撤退点等）
}

interface Position {
  x: number;
  y: number;
}
```

## 战斗单位

### 单位数据

```typescript
interface BattleUnit {
  id: string;
  type: UnitType;
  count: number;         // 单位数量
  position: Position;
  
  // 战斗属性（受武将加成）
  stats: UnitStats;
  
  // 状态
  hp: number;            // 当前生命值
  maxHp: number;
  morale: number;        // 士气 0-100
  canAct: boolean;       // 本回合是否可行动
  
  // 所属
  factionId: string;
  heroId?: string;       // 统率武将
  
  // 动画状态
  animation?: AnimationState;
}
```

### 单位创建

```typescript
function createBattleUnit(
  army: Army,
  hero?: Hero,
  position?: Position
): BattleUnit {
  const unitType = UNIT_TYPES[army.unitType];
  const heroBonus = hero ? calculateHeroBonus(hero) : {};
  
  return {
    id: generateId(),
    type: unitType,
    count: army.troops,
    position: position || { x: 0, y: 0 },
    stats: {
      hp: Math.floor(unitType.baseStats.hp * (1 + (heroBonus.hp || 0))),
      attack: Math.floor(unitType.baseStats.attack * (1 + (heroBonus.attack || 0))),
      defense: Math.floor(unitType.baseStats.defense * (1 + (heroBonus.defense || 0))),
      speed: Math.floor(unitType.baseStats.speed * (1 + (heroBonus.speed || 0)))
    },
    hp: army.troops * unitType.baseStats.hp,
    maxHp: army.troops * unitType.baseStats.hp,
    morale: 80 + (hero?.stats.charisma || 0) / 5,
    canAct: true,
    factionId: army.factionId,
    heroId: hero?.id
  };
}
```

## 武将技能系统

### 技能定义

```typescript
interface HeroSkill {
  id: string;
  name: string;
  description: string;
  icon: string;
  
  // 效果
  type: 'damage' | 'buff' | 'debuff' | 'heal' | 'special';
  range: SkillRange;
  power: number;
  duration?: number;
  
  // 冷却
  cooldown: number;
  currentCooldown: number;
  
  // 条件
  conditions?: SkillCondition[];
}

interface SkillRange {
  type: 'self' | 'single' | 'line' | 'area' | 'all';
  shape?: 'circle' | 'cross' | 'line' | 'cone';
  radius?: number;
}

// 技能示例
const HERO_SKILLS: Record<string, HeroSkill[]> = {
  caocao: [
    {
      id: 'cao_01',
      name: '奸雄之智',
      description: '对单体敌人造成智力*3伤害，并降低其防御20%',
      icon: '🧠',
      type: 'damage',
      range: { type: 'single' },
      power: 3,
      cooldown: 3,
      currentCooldown: 0,
      conditions: [{ type: 'intellect_above', value: 80 }]
    },
    {
      id: 'cao_02',
      name: '求贤若渴',
      description: '提升己方所有部队攻击15%，持续3回合',
      icon: '👥',
      type: 'buff',
      range: { type: 'all' },
      power: 0.15,
      duration: 3,
      cooldown: 5,
      currentCooldown: 0
    }
  ],
  
  zhugeliang: [
    {
      id: 'zgl_01',
      name: '八阵图',
      description: '在指定区域布置阵法，区域内敌军移动-2，防御-25%',
      icon: '🔮',
      type: 'debuff',
      range: { type: 'area', shape: 'circle', radius: 3 },
      power: 0.25,
      duration: 2,
      cooldown: 4,
      currentCooldown: 0,
      conditions: [{ type: 'intellect_above', value: 90 }]
    },
    {
      id: 'zgl_02',
      name: '火攻',
      description: '对直线范围内敌人造成智力*4火焰伤害',
      icon: '🔥',
      type: 'damage',
      range: { type: 'line' },
      power: 4,
      cooldown: 3,
      currentCooldown: 0
    }
  ],
  
  guanyu: [
    {
      id: 'gy_01',
      name: '青龙斩',
      description: '对面前横扫，造成武力*2.5伤害，击退2格',
      icon: '🐉',
      type: 'damage',
      range: { type: 'area', shape: 'cone', radius: 2 },
      power: 2.5,
      cooldown: 2,
      currentCooldown: 0
    },
    {
      id: 'gy_02',
      name: '义绝',
      description: '对单体造成武力*3伤害，若目标为义敌则伤害翻倍',
      icon: '⚔️',
      type: 'damage',
      range: { type: 'single' },
      power: 3,
      cooldown: 4,
      currentCooldown: 0,
      conditions: [{ type: 'target_is_rival' }]
    }
  ],
  
  lvbu: [
    {
      id: 'lb_01',
      name: '无双乱舞',
      description: '对周围3格所有敌人造成武力*2伤害',
      icon: '💪',
      type: 'damage',
      range: { type: 'area', shape: 'circle', radius: 3 },
      power: 2,
      cooldown: 3,
      currentCooldown: 0
    },
    {
      id: 'lb_02',
      name: '飞将',
      description: '本回合移动+3，攻击+50%',
      icon: '🐎',
      type: 'buff',
      range: { type: 'self' },
      power: 0.5,
      duration: 1,
      cooldown: 4,
      currentCooldown: 0
    }
  ],
  
  zhaoyun: [
    {
      id: 'zy_01',
      name: '七进七出',
      description: '连续攻击范围内最多7个敌人，每次造成武力*1.5伤害',
      icon: '🏇',
      type: 'damage',
      range: { type: 'area', shape: 'circle', radius: 2 },
      power: 1.5,
      cooldown: 5,
      currentCooldown: 0
    }
  ],
  
  sunquan: [
    {
      id: 'sq_01',
      name: '联吴抗曹',
      description: '提升己方所有部队防御20%，士气+30',
      icon: '🤝',
      type: 'buff',
      range: { type: 'all' },
      power: 0.2,
      duration: 3,
      cooldown: 6,
      currentCooldown: 0
    }
  ]
};
```

### 技能释放流程

```typescript
function executeSkill(
  caster: BattleUnit,
  skill: HeroSkill,
  targets: Position[]
): SkillResult {
  // 1. 检查条件
  if (!checkSkillConditions(caster, skill)) {
    return { success: false, reason: '条件不满足' };
  }
  
  // 2. 检查冷却
  if (skill.currentCooldown > 0) {
    return { success: false, reason: '技能冷却中' };
  }
  
  // 3. 获取范围内的目标
  const affectedUnits = getUnitsInRange(
    caster.position,
    skill.range,
    targets
  );
  
  // 4. 计算效果
  const effects = calculateSkillEffects(caster, skill, affectedUnits);
  
  // 5. 应用效果
  applyEffects(effects);
  
  // 6. 进入冷却
  skill.currentCooldown = skill.cooldown;
  
  // 7. 生成战报条目
  const reportEntry = generateSkillReport(caster, skill, affectedUnits);
  
  return {
    success: true,
    effects,
    reportEntry
  };
}
```

## 回合制战斗流程

### 战斗状态机

```typescript
enum BattlePhase {
  DEPLOY = 'deploy',         // 部署阶段
  BATTLE = 'battle',         // 战斗阶段
  VICTORY = 'victory',       // 胜利
  DEFEAT = 'defeat',         // 失败
  RETREAT = 'retreat'        // 撤退
}

interface BattleState {
  phase: BattlePhase;
  currentTurn: number;
  currentFaction: string;    // 当前行动方
  currentUnit?: BattleUnit;  // 当前行动单位
  
  map: BattleMap;
  units: BattleUnit[];
  
  // 战斗日志
  turnLogs: TurnLog[];
  currentLog: TurnLog;
}
```

### 回合流程

```
┌─────────────────────────────────────────────────────────────┐
│                    回合开始                                  │
│  1. 重置所有单位行动点                                        │
│  2. 处理持续效果（buff/debuff）                               │
│  3. 检查战斗胜负条件                                          │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                    行动阶段                                  │
│  按速度排序，依次行动：                                        │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  单位选择：                                          │    │
│  │  1. 移动（消耗移动点）                                │    │
│  │  2. 攻击（消耗行动点）                                │    │
│  │  3. 使用技能（消耗行动点+技能冷却）                    │    │
│  │  4. 待机（保留50%下回合移动）                          │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                    回合结束                                  │
│  1. 处理回合结束效果（如持续伤害）                            │
│  2. 检查胜负条件                                             │
│  3. 切换行动方                                               │
│  4. 记录战报                                                 │
└─────────────────────────────────────────────────────────────┘
```

### AI自动战斗

```typescript
class BattleAI {
  // AI决定单位行动
  decideUnitAction(unit: BattleUnit, state: BattleState): UnitAction {
    // 1. 评估威胁
    const threats = this.evaluateThreats(unit, state);
    
    // 2. 评估机会
    const opportunities = this.evaluateOpportunities(unit, state);
    
    // 3. 决策
    if (unit.hp < unit.maxHp * 0.3) {
      // 低血量，优先撤退或使用治疗技能
      return this.decideRetreatOrHeal(unit, state);
    }
    
    if (opportunities.length > 0 && opportunities[0].score > 80) {
      // 有高价值目标，优先攻击
      return this.decideAttack(unit, opportunities[0].target);
    }
    
    // 默认：向最近敌人移动
    return this.decideMoveToEnemy(unit, state);
  }
  
  // AI使用技能
  decideSkillUsage(unit: BattleUnit, state: BattleState): SkillAction | null {
    const skills = unit.type.heroSkills || [];
    
    for (const skill of skills) {
      if (skill.currentCooldown > 0) continue;
      
      // 评估技能价值
      const value = this.evaluateSkillValue(unit, skill, state);
      if (value > 70) {
        return { type: 'skill', skill, target: this.findBestTarget(skill) };
      }
    }
    
    return null;
  }
}
```

## 战报系统

### 战报数据结构

```typescript
interface BattleReport {
  id: string;
  title: string;           // 战斗名称
  date: GameDate;          // 战斗时间
  location: string;        // 战斗地点
  
  // 参战方
  attacker: {
    factionId: string;
    commander: string;     // 主将
    heroes: string[];      // 参战武将
    initialTroops: number;
    finalTroops: number;
    casualties: number;
    prisoners: number;
  };
  
  defender: {
    factionId: string;
    commander: string;
    heroes: string[];
    initialTroops: number;
    finalTroops: number;
    casualties: number;
    prisoners: number;
  };
  
  // 战斗过程
  totalTurns: number;
  turns: TurnLog[];
  
  // 结果
  winner: string;
  result: BattleResult;
  
  // 关键时刻
  keyMoments: KeyMoment[];
  
  // 战利品
  loot: BattleLoot;
}

interface TurnLog {
  turn: number;
  events: BattleEvent[];
  summary: string;
}

interface BattleEvent {
  type: 'move' | 'attack' | 'skill' | 'buff' | 'debuff' | 'death' | 'retreat';
  actor: string;
  actorName: string;
  target?: string;
  targetName?: string;
  skill?: string;
  damage?: number;
  description: string;
  timestamp: number;
}

interface KeyMoment {
  turn: number;
  type: 'hero_death' | 'skill_use' | 'critical_hit' | 'retreat' | 'reinforcement';
  description: string;
  impact: string;
}
```

### 战报生成

```typescript
class BattleReportGenerator {
  // 生成战报标题
  generateTitle(battle: BattleState): string {
    const location = this.getLocationName(battle.map);
    const isSiege = battle.units.some(u => u.type.id === 'siege');
    
    if (isSiege) {
      return `${location}攻城战`;
    }
    return `${location}之战`;
  }
  
  // 生成回合描述
  generateTurnDescription(turnLog: TurnLog): string {
    const events = turnLog.events;
    const descriptions: string[] = [];
    
    // 关键事件描述
    for (const event of events) {
      if (event.type === 'skill') {
        descriptions.push(
          `${event.actorName}发动【${event.skill}】，${event.description}`
        );
      } else if (event.type === 'death') {
        descriptions.push(`${event.targetName}阵亡！`);
      } else if (event.type === 'retreat') {
        descriptions.push(`${event.actorName}败退！`);
      }
    }
    
    return descriptions.join('\n');
  }
  
  // 生成关键时刻
  generateKeyMoments(turnLogs: TurnLog[]): KeyMoment[] {
    const moments: KeyMoment[] = [];
    
    for (const log of turnLogs) {
      for (const event of log.events) {
        if (event.type === 'death' && this.isHero(event.target)) {
          moments.push({
            turn: log.turn,
            type: 'hero_death',
            description: `${event.targetName}在战斗中阵亡`,
            impact: '极大影响士气'
          });
        }
        
        if (event.type === 'skill' && this.isUltimateSkill(event.skill)) {
          moments.push({
            turn: log.turn,
            type: 'skill_use',
            description: `${event.actorName}发动绝技【${event.skill}】`,
            impact: '扭转战局'
          });
        }
      }
    }
    
    return moments;
  }
}
```

## 大地图战斗呈现

### 战斗图标

```typescript
interface BattleIcon {
  position: Position;
  type: 'battle_start' | 'battle_ongoing' | 'battle_end';
  attackerFaction: string;
  defenderFaction: string;
  
  // 动画
  animation: {
    type: 'pulse' | 'flash' | 'rotate';
    speed: number;
    colors: string[];
  };
}
```

### 战斗详情弹窗

```typescript
interface BattleDetailPopup {
  // 基本信息
  title: string;
  location: string;
  date: string;
  
  // 双方信息
  attacker: ForceInfo;
  defender: ForceInfo;
  
  // 实时数据
  currentTurn: number;
  attackerLosses: number;
  defenderLosses: number;
  
  // 操作
  actions: BattleAction[];
}

interface ForceInfo {
  name: string;
  commander: string;
  heroes: HeroInfo[];
  initialTroops: number;
  currentTroops: number;
  casualties: number;
}

interface BattleAction {
  id: string;
  label: string;
  icon: string;
  action: () => void;
}
```

## 伤害计算公式

### 基础伤害

```typescript
function calculateBaseDamage(
  attacker: BattleUnit,
  defender: BattleUnit
): number {
  // 基础伤害 = 攻击力 * (1 - 防御率)
  const defenseRate = defender.stats.defense / (defender.stats.defense + 100);
  const baseDamage = attacker.stats.attack * (1 - defenseRate);
  
  // 克制系数
  const typeMultiplier = getTypeMultiplier(
    attacker.type.id,
    defender.type.id
  );
  
  // 地形系数
  const terrainMultiplier = getTerrainMultiplier(
    attacker,
    defender,
    defender.position
  );
  
  // 士气系数
  const moraleMultiplier = 0.7 + (attacker.morale / 100) * 0.6;
  
  return Math.floor(
    baseDamage * typeMultiplier * terrainMultiplier * moraleMultiplier
  );
}

// 克制系数
function getTypeMultiplier(
  attackerType: string,
  defenderType: string
): number {
  const unitType = UNIT_TYPES[attackerType];
  
  if (unitType.advantages.includes(defenderType)) {
    return 1.5;  // 克制 +50%
  }
  if (unitType.disadvantages.includes(defenderType)) {
    return 0.7;  // 被克制 -30%
  }
  return 1.0;    // 无克制
}

// 地形系数
function getTerrainMultiplier(
  attacker: BattleUnit,
  defender: BattleUnit,
  position: Position
): number {
  const terrain = getTerrainAt(position);
  const terrainBonus = defender.type.terrainBonus[terrain] || 0;
  
  return 1 + (terrainBonus / 100);
}
```

### 伤害结算

```typescript
function applyDamage(
  target: BattleUnit,
  damage: number
): DamageResult {
  // 计算实际伤害
  const actualDamage = Math.max(1, damage - Math.floor(target.stats.defense * 0.3));
  
  // 扣除生命值
  target.hp -= actualDamage;
  
  // 计算阵亡数量
  const unitHp = target.type.baseStats.hp;
  const deaths = Math.floor(actualDamage / unitHp);
  target.count = Math.max(0, target.count - deaths);
  
  // 士气影响
  target.morale = Math.max(0, target.morale - Math.floor(deaths / target.count * 20));
  
  // 检查是否被消灭
  if (target.count <= 0) {
    return {
      damage: actualDamage,
      deaths,
      unitDestroyed: true,
      description: `${target.type.name}全军覆没！`
    };
  }
  
  return {
    damage: actualDamage,
    deaths,
    unitDestroyed: false,
    description: `${target.type.name}损失${deaths}人`
  };
}
```

## 战斗目标与胜负

### 胜负条件

```typescript
interface VictoryCondition {
  type: 'annihilate' | 'capture' | 'hold' | 'retreat';
  description: string;
  check: (state: BattleState) => boolean;
}

// 歼灭战：消灭所有敌人
const ANNIHILATE: VictoryCondition = {
  type: 'annihilate',
  description: '消灭所有敌军',
  check: (state) => {
    const attackerUnits = state.units.filter(u => u.factionId === state.attackerFaction);
    const defenderUnits = state.units.filter(u => u.factionId === state.defenderFaction);
    
    return attackerUnits.length === 0 || defenderUnits.length === 0;
  }
};

// 攻城战：占领城池中心
const CAPTURE: VictoryCondition = {
  type: 'capture',
  description: '占领城池中心',
  check: (state) => {
    const cityCenter = state.map.objectives.find(o => o.type === 'city_center');
    if (!cityCenter) return false;
    
    const occupyingUnit = state.units.find(
      u => u.position.x === cityCenter.x && u.position.y === cityCenter.y
    );
    
    return occupyingUnit?.factionId === state.attackerFaction;
  }
};

// 守城战：坚守N回合
const HOLD: VictoryCondition = {
  type: 'hold',
  description: '坚守10回合',
  check: (state) => {
    return state.currentTurn >= 10;
  }
};
```

## 文件结构

```
client/src/components/Battle/
├── BattleView.tsx          # 战斗主视图
├── BattleMap.tsx           # 战棋地图组件
├── BattleUnit.tsx          # 战斗单位组件
├── BattleHUD.tsx           # 战斗界面UI
├── BattleControls.tsx      # 战斗控制按钮
├── SkillPanel.tsx          # 技能面板
├── BattleDetailPopup.tsx   # 战斗详情弹窗
├── engine/
│   ├── BattleEngine.ts     # 战斗引擎核心
│   ├── TurnManager.ts      # 回合管理器
│   ├── CombatCalculator.ts # 伤害计算器
│   ├── BattleAI.ts         # 战斗AI
│   └── PathFinder.ts       # 寻路算法
├── data/
│   ├── unitTypes.ts        # 兵种数据
│   ├── heroSkills.ts       # 武将技能
│   ├── terrainEffects.ts   # 地形效果
│   └── battleMaps.ts       # 预设战场
├── report/
│   ├── BattleReport.tsx    # 战报组件
│   ├── TurnLog.tsx         # 回合日志
│   └── ReportGenerator.ts  # 战报生成器
└── types/
    └── battle.ts           # 战斗类型定义
```

## 开发阶段

### Phase 1: 基础战斗框架
- 格子地图渲染
- 单位移动（寻路）
- 基础攻击

### Phase 2: 兵种系统
- 5种兵种实现
- 克制关系
- 地形效果

### Phase 3: 武将技能
- 技能数据
- 技能释放
- 技能效果

### Phase 4: 战斗AI
- AI决策逻辑
- 自动战斗

### Phase 5: 战报系统
- 战报生成
- 战报展示
- 大地图战斗图标

### Phase 6: 优化完善
- 战斗动画
- 性能优化
- 音效

## 验证方案

1. **基础战斗**: 能在格子地图上移动、攻击
2. **兵种克制**: 骑兵克步兵，弓兵克骑兵
3. **武将技能**: 能释放技能，效果正确
4. **战斗AI**: AI能合理决策
5. **战报系统**: 战斗结束生成完整战报
6. **大地图呈现**: 战斗图标正确显示
