# 内政系统 - 设计规划

## 概述

完整的内政系统，包含城池建设、武将任命、人口管理、治安管理、技术研究、法律政策、水利工程、文化教育8大模块。纯AI驱动，每个城池有独特特性，数据实时更新。

## 系统架构

```
┌─────────────────────────────────────────────────────────────┐
│                      AI 内政引擎                            │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  城池分析 → 政策制定 → 资源分配 → 执行监控           │    │
│  │      ↓          ↓           ↓          ↓            │    │
│  │  [特性识别] [AI决策] [自动化] [实时报告]              │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                      内政模块层                              │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌──────────┐ │
│  │  城池建设  │ │  武将任命  │ │  人口管理  │ │ 治安管理 │ │
│  └────────────┘ └────────────┘ └────────────┘ └──────────┘ │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌──────────┐ │
│  │  技术研究  │ │  法律政策  │ │  水利工程  │ │ 文化教育 │ │
│  └────────────┘ └────────────┘ └────────────┘ └──────────┘ │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                      城池特性层                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  地理特性 | 历史特性 | 资源特性 | 文化特性 | 发展路线 │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

## 城池特性系统

### 城池特性数据

```typescript
interface CityCharacteristics {
  cityId: string;
  name: string;
  
  // 地理特性
  geography: GeographyTrait;
  
  // 历史特性
  history: HistoryTrait;
  
  // 资源特性
  resources: ResourceTrait;
  
  // 文化特性
  culture: CultureTrait;
  
  // 发展路线
  developmentPath: DevelopmentPath;
  
  // 特殊能力
  specialAbilities: CityAbility[];
}

interface GeographyTrait {
  type: 'plains' | 'mountain' | 'river' | 'coast' | 'valley' | 'basin';
  climate: 'temperate' | 'tropical' | 'arid' | 'cold';
  
  // 地理加成
  bonuses: {
    farm: number;      // 农业加成
    trade: number;     // 贸易加成
    defense: number;   // 防御加成
    growth: number;    // 人口增长加成
  };
  
  // 地理限制
  limitations: string[];
}

interface HistoryTrait {
  era: string;         // 历史时期
  significance: 'capital' | 'major' | 'minor' | 'normal';
  
  // 历史事件影响
  historicalEvents: string[];
  
  // 历史名人关联
  famousHeroes: string[];
  
  // 历史加成
  bonuses: {
    morale: number;    // 士气加成
    loyalty: number;   // 忠诚度加成
    prestige: number;  // 威望加成
  };
}

interface ResourceTrait {
  primary: keyof Resources;    // 主要资源
  secondary: keyof Resources;  // 次要资源
  
  // 资源产出加成
  productionBonus: Record<keyof Resources, number>;
  
  // 特殊资源
  uniqueResource?: {
    name: string;
    effect: string;
  };
}

interface CultureTrait {
  type: 'agricultural' | 'commercial' | 'military' | 'scholarly' | 'religious';
  
  // 文化影响
  effects: {
    morale: number;
    population_growth: number;
    trade_income: number;
    military_recruitment: number;
  };
  
  // 文化建筑
  culturalBuildings: string[];
}

interface DevelopmentPath {
  primary: 'economic' | 'military' | 'cultural' | 'balanced';
  secondary: string;
  
  // 发展建议
  recommendations: string[];
  
  // 最佳设施配置
  optimalFacilities: CityFacilities;
}

interface CityAbility {
  id: string;
  name: string;
  description: string;
  effect: CityAbilityEffect;
  unlockCondition: string;
}
```

### 城池特性示例

```typescript
const CITY_CHARACTERISTICS: Record<string, CityCharacteristics> = {
  chengdu: {
    cityId: 'chengdu',
    name: '成都',
    geography: {
      type: 'basin',
      climate: 'temperate',
      bonuses: { farm: 30, trade: 15, defense: 20, growth: 25 },
      limitations: ['交通不便']
    },
    history: {
      era: '蜀汉都城',
      significance: 'capital',
      historicalEvents: ['刘备称帝', '诸葛亮北伐'],
      famousHeroes: ['liubei', 'zhugeliang', 'guanyu', 'zhangfei'],
      bonuses: { morale: 20, loyalty: 15, prestige: 25 }
    },
    resources: {
      primary: 'grain',
      secondary: 'wood',
      productionBonus: { grain: 40, wood: 20, gold: 10, iron: 0, cloth: 10, population: 15, morale: 0 },
      uniqueResource: { name: '蜀锦', effect: '贸易收入+30%' }
    },
    culture: {
      type: 'scholarly',
      effects: { morale: 15, population_growth: 10, trade_income: 5, military_recruitment: 0 },
      culturalBuildings: ['书院', '武侯祠']
    },
    developmentPath: {
      primary: 'balanced',
      secondary: 'scholarly',
      recommendations: ['优先发展农业和教育', '建设水利设施', '培养人才'],
      optimalFacilities: { farm: 5, market: 4, lumbermill: 3, mine: 2, workshop: 3, harbor: 0, temple: 4 }
    },
    specialAbilities: [
      {
        id: 'shujin_trade',
        name: '蜀锦贸易',
        description: '蜀锦是成都特产，贸易收入大幅增加',
        effect: { type: 'trade_bonus', value: 30 },
        unlockCondition: 'market_level_3'
      },
      {
        id: 'wuhou_blessing',
        name: '武侯庇佑',
        description: '诸葛亮的智慧影响，智力型武将能力+10%',
        effect: { type: 'hero_intellect_bonus', value: 10 },
        unlockCondition: 'temple_level_2'
      }
    ]
  },
  
  luoyang: {
    cityId: 'luoyang',
    name: '洛阳',
    geography: {
      type: 'plains',
      climate: 'temperate',
      bonuses: { farm: 20, trade: 30, defense: 10, growth: 20 },
      limitations: ['易攻难守']
    },
    history: {
      era: '东汉都城',
      significance: 'capital',
      historicalEvents: ['董卓迁都', '曹魏建国'],
      famousHeroes: ['caocao', 'xuchu', 'xiahouDun'],
      bonuses: { morale: 25, loyalty: 10, prestige: 30 }
    },
    resources: {
      primary: 'gold',
      secondary: 'population',
      productionBonus: { grain: 15, wood: 10, gold: 40, iron: 10, cloth: 15, population: 20, morale: 0 },
      uniqueResource: { name: '洛阳纸', effect: '文化研究速度+25%' }
    },
    culture: {
      type: 'commercial',
      effects: { morale: 10, population_growth: 15, trade_income: 20, military_recruitment: 5 },
      culturalBuildings: ['太学', '白马寺']
    },
    developmentPath: {
      primary: 'economic',
      secondary: 'commercial',
      recommendations: ['优先发展商业', '建设市场网络', '吸引商人'],
      optimalFacilities: { farm: 3, market: 5, lumbermill: 2, mine: 2, workshop: 4, harbor: 1, temple: 3 }
    },
    specialAbilities: [
      {
        id: 'imperial_capital',
        name: '帝都威仪',
        description: '作为曾经的都城，吸引人才能力+20%',
        effect: { type: 'hero_recruit_bonus', value: 20 },
        unlockCondition: 'palace_level_4'
      }
    ]
  },
  
  jiangling: {
    cityId: 'jiangling',
    name: '江陵',
    geography: {
      type: 'river',
      climate: 'temperate',
      bonuses: { farm: 25, trade: 35, defense: 15, growth: 20 },
      limitations: ['水患风险']
    },
    history: {
      era: '荆州重镇',
      significance: 'major',
      historicalEvents: ['关羽失荆州', '夷陵之战'],
      famousHeroes: ['guanyu', 'zhou_yu'],
      bonuses: { morale: 15, loyalty: 10, prestige: 15 }
    },
    resources: {
      primary: 'grain',
      secondary: 'cloth',
      productionBonus: { grain: 35, wood: 15, gold: 20, iron: 5, cloth: 25, population: 15, morale: 0 },
      uniqueResource: { name: '荆州鱼', effect: '粮食产量+20%' }
    },
    culture: {
      type: 'agricultural',
      effects: { morale: 10, population_growth: 20, trade_income: 10, military_recruitment: 5 },
      culturalBuildings: ['龙王庙', '鱼市']
    },
    developmentPath: {
      primary: 'economic',
      secondary: 'agricultural',
      recommendations: ['优先发展农业', '建设水利工程', '发展渔业'],
      optimalFacilities: { farm: 5, market: 4, lumbermill: 3, mine: 1, workshop: 3, harbor: 4, temple: 2 }
    },
    specialAbilities: [
      {
        id: 'river_trade',
        name: '水运枢纽',
        description: '长江水运便利，贸易效率+25%',
        effect: { type: 'trade_efficiency', value: 25 },
        unlockCondition: 'harbor_level_3'
      },
      {
        id: 'fishery',
        name: '渔业发达',
        description: '江陵渔业资源丰富，粮食产量+20%',
        effect: { type: 'grain_production', value: 20 },
        unlockCondition: 'farm_level_3'
      }
    ]
  }
};
```

## 内政模块详细设计

### 1. 城池建设系统

```typescript
interface ConstructionSystem {
  // 建设队列
  queue: ConstructionQueue[];
  
  // 建设规则
  rules: ConstructionRules;
}

interface ConstructionQueue {
  cityId: string;
  facility: keyof CityFacilities;
  targetLevel: number;
  startTurn: number;
  estimatedCompletion: number;
  resources: ResourceCost;
}

interface ConstructionRules {
  // 建设时间（回合）
  buildTime: Record<keyof CityFacilities, number[]>;
  
  // 建设成本
  buildCost: Record<keyof CityFacilities, ResourceCost[]>;
  
  // 前置条件
  prerequisites: Record<keyof CityFacilities, string[]>;
}

// 建设时间表
const BUILD_TIME: Record<keyof CityFacilities, number[]> = {
  farm: [2, 3, 4, 5, 6],        // 1-5级所需回合数
  market: [2, 3, 4, 5, 6],
  lumbermill: [1, 2, 3, 4, 5],
  mine: [2, 3, 4, 5, 6],
  workshop: [2, 3, 4, 5, 6],
  harbor: [3, 4, 5, 6, 7],
  temple: [2, 3, 4, 5, 6]
};

// 建设成本表
const BUILD_COST: Record<keyof CityFacilities, ResourceCost[]> = {
  farm: [
    { gold: 200, wood: 100, grain: 50 },
    { gold: 400, wood: 200, grain: 100 },
    { gold: 800, wood: 400, grain: 200 },
    { gold: 1500, wood: 800, grain: 400 },
    { gold: 3000, wood: 1500, grain: 800 }
  ],
  market: [
    { gold: 300, wood: 150, cloth: 50 },
    { gold: 600, wood: 300, cloth: 100 },
    { gold: 1200, wood: 600, cloth: 200 },
    { gold: 2400, wood: 1200, cloth: 400 },
    { gold: 4800, wood: 2400, cloth: 800 }
  ],
  // ... 其他设施
};

// AI建设决策
function decideConstruction(
  city: CityEconomy,
  context: GameContext
): ConstructionDecision {
  const characteristics = CITY_CHARACTERISTICS[city.cityId];
  const balance = calculateEconomicBalance(city);
  
  // 根据城池特性和当前状况决定建设优先级
  const priorities = calculateConstructionPriorities(city, characteristics, balance, context);
  
  // 选择最高优先级的建设
  const bestOption = priorities[0];
  
  // 检查资源
  if (hasResources(city, bestOption.cost, context)) {
    return {
      action: 'build',
      facility: bestOption.facility,
      level: bestOption.level,
      cost: bestOption.cost,
      reason: bestOption.reason
    };
  }
  
  return { action: 'wait', reason: '资源不足' };
}

// 计算建设优先级
function calculateConstructionPriorities(
  city: CityEconomy,
  characteristics: CityCharacteristics,
  balance: EconomicBalance,
  context: GameContext
): ConstructionPriority[] {
  const priorities: ConstructionPriority[] = [];
  
  // 根据经济状况决定优先级
  if (balance.surplus.grain < 0) {
    priorities.push({
      facility: 'farm',
      level: city.facilities.farm + 1,
      priority: 90,
      reason: '粮食短缺，需要增加产量',
      cost: BUILD_COST.farm[city.facilities.farm]
    });
  }
  
  if (balance.surplus.gold < 0) {
    priorities.push({
      facility: 'market',
      level: city.facilities.market + 1,
      priority: 80,
      reason: '金钱不足，需要增加收入',
      cost: BUILD_COST.market[city.facilities.market]
    });
  }
  
  // 根据城池特性决定优先级
  const optimal = characteristics.developmentPath.optimalFacilities;
  for (const facility of Object.keys(optimal) as (keyof CityFacilities)[]) {
    if (city.facilities[facility] < optimal[facility]) {
      priorities.push({
        facility,
        level: city.facilities[facility] + 1,
        priority: 70 + (optimal[facility] - city.facilities[facility]) * 5,
        reason: `根据${characteristics.name}特性，优先发展${facility}`,
        cost: BUILD_COST[facility][city.facilities[facility]]
      });
    }
  }
  
  // 按优先级排序
  return priorities.sort((a, b) => b.priority - a.priority);
}
```

### 2. 武将任命系统

```typescript
interface AppointmentSystem {
  // 官职体系
  positions: OfficialPosition[];
  
  // 任命规则
  rules: AppointmentRules;
}

interface OfficialPosition {
  id: string;
  name: string;
  level: number;
  
  // 职位效果
  effects: PositionEffect[];
  
  // 任职要求
  requirements: PositionRequirement[];
}

const OFFICIAL_POSITIONS: OfficialPosition[] = [
  {
    id: 'governor',
    name: '太守',
    level: 1,
    effects: [
      { type: 'govern_efficiency', value: 20 },
      { type: 'morale_boost', value: 10 },
      { type: 'trade_income', value: 15 }
    ],
    requirements: [
      { type: 'politics_above', value: 70 },
      { type: 'charisma_above', value: 60 }
    ]
  },
  {
    id: 'general',
    name: '将军',
    level: 1,
    effects: [
      { type: 'defense_boost', value: 25 },
      { type: 'morale_boost', value: 15 },
      { type: 'recruitment_speed', value: 20 }
    ],
    requirements: [
      { type: 'command_above', value: 75 },
      { type: 'strength_above', value: 65 }
    ]
  },
  {
    id: 'advisor',
    name: '谋士',
    level: 1,
    effects: [
      { type: 'intellect_boost', value: 20 },
      { type: 'diplomacy_boost', value: 15 },
      { type: 'espionage_boost', value: 10 }
    ],
    requirements: [
      { type: 'intellect_above', value: 80 }
    ]
  },
  {
    id: 'mayor',
    name: '县令',
    level: 1,
    effects: [
      { type: 'govern_efficiency', value: 15 },
      { type: 'population_growth', value: 10 }
    ],
    requirements: [
      { type: 'politics_above', value: 50 }
    ]
  },
  {
    id: 'merchant_leader',
    name: '商官',
    level: 1,
    effects: [
      { type: 'trade_income', value: 25 },
      { type: 'gold_production', value: 15 }
    ],
    requirements: [
      { type: 'politics_above', value: 60 },
      { type: 'charisma_above', value: 55 }
    ]
  }
];

// AI任命决策
function decideAppointment(
  city: City,
  availableHeroes: Hero[],
  context: GameContext
): AppointmentDecision {
  const emptyPositions = getEmptyPositions(city);
  const decisions: AppointmentDecision[] = [];
  
  for (const position of emptyPositions) {
    // 筛选符合条件的武将
    const eligibleHeroes = availableHeroes.filter(hero => 
      meetsRequirements(hero, position.requirements)
    );
    
    if (eligibleHeroes.length === 0) continue;
    
    // 按适配度排序
    const sorted = eligibleHeroes.sort((a, b) => 
      calculateFitness(b, position) - calculateFitness(a, position)
    );
    
    // 选择最佳人选
    const bestCandidate = sorted[0];
    
    decisions.push({
      position: position.id,
      heroId: bestCandidate.id,
      fitness: calculateFitness(bestCandidate, position),
      reason: generateAppointmentReason(bestCandidate, position)
    });
  }
  
  return decisions[0]; // 返回最高优先级的任命
}

// 计算武将适配度
function calculateFitness(hero: Hero, position: OfficialPosition): number {
  let fitness = 0;
  
  for (const req of position.requirements) {
    switch (req.type) {
      case 'politics_above':
        fitness += hero.stats.politics;
        break;
      case 'command_above':
        fitness += hero.stats.command;
        break;
      case 'strength_above':
        fitness += hero.stats.strength;
        break;
      case 'intellect_above':
        fitness += hero.stats.intellect;
        break;
      case 'charisma_above':
        fitness += hero.stats.charisma;
        break;
    }
  }
  
  // 性格加成
  if (hero.personality === 'loyal' && position.id === 'governor') {
    fitness += 20; // 忠诚的人更适合当太守
  }
  if (hero.personality === 'brave' && position.id === 'general') {
    fitness += 20; // 勇猛的人更适合当将军
  }
  
  return fitness;
}

// 任命效果
function applyAppointmentEffects(
  hero: Hero,
  position: OfficialPosition,
  city: City
): void {
  for (const effect of position.effects) {
    switch (effect.type) {
      case 'govern_efficiency':
        city.governEfficiency += effect.value;
        break;
      case 'morale_boost':
        city.morale += effect.value;
        break;
      case 'trade_income':
        city.tradeIncome += effect.value;
        break;
      case 'defense_boost':
        city.defense += effect.value;
        break;
      case 'population_growth':
        city.populationGrowth += effect.value;
        break;
    }
  }
  
  // 记录任命
  city.appointments[position.id] = hero.id;
}
```

### 3. 人口管理系统

```typescript
interface PopulationSystem {
  // 人口增长因素
  growthFactors: GrowthFactor[];
  
  // 人口迁移
  migration: MigrationRule[];
  
  // 征兵系统
  conscription: ConscriptionRule[];
}

interface GrowthFactor {
  type: 'food' | 'housing' | 'health' | 'happiness' | 'policy';
  value: number;
  condition: string;
}

// 人口增长计算
function calculatePopulationGrowth(
  city: City,
  context: GameContext
): PopulationGrowth {
  let growthRate = 0;
  const factors: GrowthFactor[] = [];
  
  // 粮食因素
  const grainSurplus = calculateGrainSurplus(city);
  if (grainSurplus > 0) {
    growthRate += grainSurplus / city.population * 10;
    factors.push({ type: 'food', value: grainSurplus / city.population * 10, condition: '粮食充足' });
  } else {
    growthRate += grainSurplus / city.population * 20; // 饥饿时下降更快
    factors.push({ type: 'food', value: grainSurplus / city.population * 20, condition: '粮食短缺' });
  }
  
  // 民心因素
  growthRate += (city.morale - 50) / 100;
  factors.push({ type: 'happiness', value: (city.morale - 50) / 100, condition: `民心${city.morale}` });
  
  // 设施因素
  if (city.facilities.temple > 0) {
    growthRate += city.facilities.temple * 0.5;
    factors.push({ type: 'health', value: city.facilities.temple * 0.5, condition: '寺庙提供医疗' });
  }
  
  // 政策因素
  for (const policy of city.activePolicies) {
    if (policy.effects.population_growth) {
      growthRate += policy.effects.population_growth;
      factors.push({ type: 'policy', value: policy.effects.population_growth, condition: policy.name });
    }
  }
  
  // 城池特性加成
  const characteristics = CITY_CHARACTERISTICS[city.id];
  growthRate *= 1 + characteristics.geography.bonuses.growth / 100;
  
  return {
    currentPopulation: city.population,
    growthRate: Math.floor(city.population * growthRate / 100),
    factors,
    projectedPopulation: Math.floor(city.population * (1 + growthRate / 100))
  };
}

// 人口迁移
function checkMigration(
  city: City,
  context: GameContext
): MigrationDecision | null {
  const characteristics = CITY_CHARACTERISTICS[city.id];
  const growth = calculatePopulationGrowth(city, context);
  
  // 检查是否需要迁出
  if (city.population > city.maxPopulation * 0.9) {
    // 人口接近上限，寻找迁出目的地
    const destination = findMigrationDestination(city, context);
    if (destination) {
      return {
        type: 'outflow',
        amount: Math.floor(city.population * 0.1),
        destination: destination.id,
        reason: '人口接近上限，需要分流'
      };
    }
  }
  
  // 检查是否吸引迁入
  if (growth.growthRate > 0 && city.morale > 60) {
    // 吸引外来人口
    const migrants = calculateMigrationInflow(city, context);
    if (migrants > 0) {
      return {
        type: 'inflow',
        amount: migrants,
        source: '周边地区',
        reason: `城市繁荣，吸引人口迁入`
      };
    }
  }
  
  return null;
}

// 征兵系统
function calculateConscriptionCapacity(
  city: City,
  context: GameContext
): ConscriptionCapacity {
  // 可征兵人口比例（通常10-20%）
  let conscriptionRate = 0.15;
  
  // 民心影响
  if (city.morale < 30) {
    conscriptionRate *= 0.5; // 民心低，征兵困难
  } else if (city.morale > 70) {
    conscriptionRate *= 1.3; // 民心高，征兵容易
  }
  
  // 人口影响
  if (city.population < 5000) {
    conscriptionRate *= 0.3; // 人口少，征兵比例低
  }
  
  // 法律影响
  for (const policy of city.activePolicies) {
    if (policy.effects.conscription_rate) {
      conscriptionRate *= 1 + policy.effects.conscription_rate / 100;
    }
  }
  
  const maxConscription = Math.floor(city.population * conscriptionRate);
  const currentConscription = city.conscriptedPopulation || 0;
  
  return {
    maxCapacity: maxConscription,
    current: currentConscription,
    available: maxConscription - currentConscription,
    moraleImpact: calculateConscriptionMoraleImpact(city, maxConscription - currentConscription),
    foodImpact: (maxConscription - currentConscription) * 0.5 // 每兵每月消耗0.5粮食
  };
}
```

### 4. 治安管理系统

```typescript
interface SecuritySystem {
  // 治安因素
  factors: SecurityFactor[];
  
  // 叛乱条件
  rebellionConditions: RebellionCondition[];
}

interface SecurityFactor {
  type: 'garrison' | 'policy' | 'morale' | 'population' | 'event';
  value: number;
  description: string;
}

// 治安度计算
function calculateSecurity(
  city: City,
  context: GameContext
): SecurityStatus {
  let security = 50; // 基础治安度
  
  const factors: SecurityFactor[] = [];
  
  // 驻军影响
  if (city.garrison > 0) {
    security += Math.min(30, city.garrison / 1000 * 5);
    factors.push({ type: 'garrison', value: Math.min(30, city.garrison / 1000 * 5), description: `${city.garrison}驻军` });
  }
  
  // 民心影响
  security += (city.morale - 50) / 2;
  factors.push({ type: 'morale', value: (city.morale - 50) / 2, description: `民心${city.morale}` });
  
  // 人口密度影响
  const density = city.population / city.area;
  if (density > 1000) {
    security -= (density - 1000) / 500 * 5;
    factors.push({ type: 'population', value: -(density - 1000) / 500 * 5, description: '人口密集' });
  }
  
  // 政策影响
  for (const policy of city.activePolicies) {
    if (policy.effects.security) {
      security += policy.effects.security;
      factors.push({ type: 'policy', value: policy.effects.security, description: policy.name });
    }
  }
  
  // 事件影响
  for (const event of city.activeEvents) {
    if (event.effects.security) {
      security += event.effects.security;
      factors.push({ type: 'event', value: event.effects.security, description: event.name });
    }
  }
  
  // 城池特性影响
  const characteristics = CITY_CHARACTERISTICS[city.id];
  security += characteristics.history.bonuses.morale / 2;
  
  return {
    level: Math.min(100, Math.max(0, security)),
    factors,
    status: security > 70 ? 'stable' : security > 40 ? 'warning' : 'critical',
    rebellionRisk: calculateRebellionRisk(city, security)
  };
}

// 叛乱风险计算
function calculateRebellionRisk(
  city: City,
  security: number
): RebellionRisk {
  let risk = 0;
  
  // 治安度影响
  if (security < 30) {
    risk += (30 - security) * 2;
  } else if (security < 50) {
    risk += (50 - security);
  }
  
  // 民心影响
  if (city.morale < 20) {
    risk += (20 - city.morale) * 3;
  }
  
  // 特殊事件影响
  if (city.activeEvents.some(e => e.type === 'rebellion')) {
    risk += 50;
  }
  
  // 历史特性影响
  const characteristics = CITY_CHARACTERISTICS[city.id];
  if (characteristics.history.significance === 'capital') {
    risk *= 0.7; // 都城更难叛乱
  }
  
  return {
    level: Math.min(100, risk),
    factors: generateRebellionFactors(city, security),
    prediction: risk > 70 ? 'likely' : risk > 40 ? 'possible' : 'unlikely'
  };
}

// 叛乱处理
function handleRebellion(
  city: City,
  context: GameContext
): RebellionEvent {
  // 判断叛乱规模
  const scale = calculateRebellionScale(city);
  
  // 生成叛军
  const rebels = generateRebels(city, scale);
  
  // 叛乱目标
  const goals = generateRebellionGoals(city, scale);
  
  // 触发叛乱事件
  return {
    cityId: city.id,
    scale,
    rebels,
    goals,
    duration: scale === 'major' ? 5 : scale === 'minor' ? 2 : 1,
    effects: {
      production: -50,
      morale: -30,
      security: -40,
      population_loss: Math.floor(city.population * 0.05)
    }
  };
}
```

### 5. 技术研究系统

```typescript
interface TechnologySystem {
  // 技术树
  techTree: TechTree;
  
  // 研究队列
  queue: ResearchQueue[];
}

interface TechTree {
  categories: TechCategory[];
}

interface TechCategory {
  id: string;
  name: string;
  description: string;
  technologies: Technology[];
}

interface Technology {
  id: string;
  name: string;
  description: string;
  level: number;
  
  // 研究成本
  cost: {
    turns: number;
    resources: ResourceCost;
  };
  
  // 前置技术
  prerequisites: string[];
  
  // 效果
  effects: TechEffect[];
  
  // 解锁内容
  unlocks: TechUnlock[];
}

const TECH_TREE: TechCategory[] = [
  {
    id: 'agriculture',
    name: '农业技术',
    description: '提升农业产量和效率',
    technologies: [
      {
        id: 'irrigation',
        name: '灌溉技术',
        description: '修建灌溉渠道，提高农田产量',
        level: 1,
        cost: { turns: 5, resources: { gold: 1000, wood: 500, grain: 0, population: 0, iron: 0, cloth: 0, morale: 0 } },
        prerequisites: [],
        effects: [
          { type: 'farm_production', value: 20 }
        ],
        unlocks: [
          { type: 'facility', id: 'irrigation_canal', name: '灌溉渠' }
        ]
      },
      {
        id: 'crop_rotation',
        name: '轮作制度',
        description: '采用轮作制度，防止土地肥力下降',
        level: 2,
        cost: { turns: 8, resources: { gold: 2000, wood: 800, grain: 0, population: 0, iron: 0, cloth: 0, morale: 0 } },
        prerequisites: ['irrigation'],
        effects: [
          { type: 'farm_production', value: 30 },
          { type: 'grain_perish_reduction', value: 50 }
        ],
        unlocks: []
      },
      {
        id: 'rice_cultivation',
        name: '水稻种植',
        description: '引进水稻种植技术，大幅提高粮食产量',
        level: 3,
        cost: { turns: 12, resources: { gold: 4000, wood: 1500, grain: 500, population: 0, iron: 0, cloth: 0, morale: 0 } },
        prerequisites: ['crop_rotation'],
        effects: [
          { type: 'farm_production', value: 50 }
        ],
        unlocks: [
          { type: 'facility', id: 'rice_paddy', name: '水田' }
        ]
      }
    ]
  },
  {
    id: 'military',
    name: '军事技术',
    description: '提升军队战斗力和装备',
    technologies: [
      {
        id: 'iron_smelting',
        name: '冶铁技术',
        description: '改进冶铁工艺，生产更好的兵器',
        level: 1,
        cost: { turns: 6, resources: { gold: 1500, wood: 300, grain: 0, population: 0, iron: 200, cloth: 0, morale: 0 } },
        prerequisites: [],
        effects: [
          { type: 'infantry_attack', value: 15 },
          { type: 'cavalry_attack', value: 10 }
        ],
        unlocks: [
          { type: 'unit', id: 'heavy_infantry', name: '重步兵' }
        ]
      },
      {
        id: 'crossbow',
        name: '弩箭技术',
        description: '改进弩的射程和威力',
        level: 2,
        cost: { turns: 8, resources: { gold: 2500, wood: 600, grain: 0, population: 0, iron: 150, cloth: 0, morale: 0 } },
        prerequisites: ['iron_smelting'],
        effects: [
          { type: 'archer_attack', value: 25 },
          { type: 'archer_range', value: 1 }
        ],
        unlocks: [
          { type: 'unit', id: 'crossbowman', name: '弩兵' }
        ]
      },
      {
        id: 'cavalry_tactics',
        name: '骑兵战术',
        description: '发展骑兵作战战术',
        level: 3,
        cost: { turns: 10, resources: { gold: 3000, wood: 400, grain: 500, population: 0, iron: 100, cloth: 200, morale: 0 } },
        prerequisites: ['iron_smelting'],
        effects: [
          { type: 'cavalry_attack', value: 30 },
          { type: 'cavalry_speed', value: 2 }
        ],
        unlocks: [
          { type: 'unit', id: 'heavy_cavalry', name: '重骑兵' }
        ]
      }
    ]
  },
  {
    id: 'engineering',
    name: '工程技术',
    description: '提升建筑和器械制造能力',
    technologies: [
      {
        id: 'architecture',
        name: '建筑技术',
        description: '改进建筑工艺，加快建造速度',
        level: 1,
        cost: { turns: 5, resources: { gold: 1200, wood: 800, grain: 0, population: 0, iron: 50, cloth: 0, morale: 0 } },
        prerequisites: [],
        effects: [
          { type: 'construction_speed', value: 20 },
          { type: 'building_cost_reduction', value: 15 }
        ],
        unlocks: []
      },
      {
        id: 'siege_engineering',
        name: '攻城技术',
        description: '发展攻城器械制造技术',
        level: 2,
        cost: { turns: 10, resources: { gold: 3000, wood: 1500, grain: 0, population: 0, iron: 500, cloth: 0, morale: 0 } },
        prerequisites: ['architecture'],
        effects: [
          { type: 'siege_attack', value: 40 },
          { type: 'wall_damage', value: 50 }
        ],
        unlocks: [
          { type: 'unit', id: 'trebuchet', name: '投石车' },
          { type: 'unit', id: 'battering_ram', name: '攻城锤' }
        ]
      }
    ]
  },
  {
    id: 'trade',
    name: '商业技术',
    description: '提升贸易和经济效率',
    technologies: [
      {
        id: 'accounting',
        name: '记账技术',
        description: '发展记账方法，提高财务管理效率',
        level: 1,
        cost: { turns: 4, resources: { gold: 800, wood: 200, grain: 0, population: 0, iron: 0, cloth: 100, morale: 0 } },
        prerequisites: [],
        effects: [
          { type: 'trade_income', value: 15 },
          { type: 'gold_production', value: 10 }
        ],
        unlocks: []
      },
      {
        id: 'banking',
        name: '银行业',
        description: '发展银行业，促进商业发展',
        level: 2,
        cost: { turns: 8, resources: { gold: 2000, wood: 400, grain: 0, population: 0, iron: 0, cloth: 200, morale: 0 } },
        prerequisites: ['accounting'],
        effects: [
          { type: 'trade_income', value: 25 },
          { type: 'trade_efficiency', value: 20 }
        ],
        unlocks: [
          { type: 'facility', id: 'bank', name: '钱庄' }
        ]
      }
    ]
  }
];

// AI研究决策
function decideResearch(
  faction: Faction,
  context: GameContext
): ResearchDecision {
  // 分析当前需求
  const needs = analyzeResearchNeeds(faction, context);
  
  // 寻找合适的技术
  const availableTechs = getAvailableTechs(faction, context);
  
  // 评估每个技术的价值
  const techValues = availableTechs.map(tech => ({
    tech,
    value: evaluateTechValue(tech, needs, faction, context)
  }));
  
  // 选择最有价值的技术
  const bestTech = techValues.sort((a, b) => b.value - a.value)[0];
  
  if (bestTech && bestTech.value > 50) {
    return {
      action: 'research',
      technology: bestTech.tech.id,
      reason: generateResearchReason(bestTech.tech, needs)
    };
  }
  
  return { action: 'wait', reason: '无合适技术可研究' };
}
```

### 6. 法律政策系统

```typescript
interface PolicySystem {
  // 政策类别
  categories: PolicyCategory[];
  
  // 当前执行政策
  activePolicies: ActivePolicy[];
}

interface PolicyCategory {
  id: string;
  name: string;
  policies: Policy[];
}

interface Policy {
  id: string;
  name: string;
  description: string;
  
  // 政策效果
  effects: PolicyEffect[];
  
  // 实施成本
  cost: {
    gold: number;
    influence: number;  // 政治影响力
  };
  
  // 持续时间
  duration: number;  // 0为永久
  
  // 冲突政策
  conflicts: string[];
}

const POLICY_CATEGORIES: PolicyCategory[] = [
  {
    id: 'taxation',
    name: '税收政策',
    policies: [
      {
        id: 'low_tax',
        name: '轻徭薄赋',
        description: '降低税收，提高民心',
        effects: [
          { type: 'gold_income', value: -20 },
          { type: 'morale_boost', value: 15 },
          { type: 'population_growth', value: 10 }
        ],
        cost: { gold: 500, influence: 10 },
        duration: 0,
        conflicts: ['high_tax']
      },
      {
        id: 'high_tax',
        name: '重税政策',
        description: '提高税收，增加收入',
        effects: [
          { type: 'gold_income', value: 30 },
          { type: 'morale_drop', value: -10 },
          { type: 'population_growth', value: -5 }
        ],
        cost: { gold: 300, influence: 5 },
        duration: 0,
        conflicts: ['low_tax']
      }
    ]
  },
  {
    id: 'labor',
    name: '劳役政策',
    policies: [
      {
        id: 'light_labor',
        name: '轻徭役',
        description: '减少劳役，让百姓休养生息',
        effects: [
          { type: 'construction_speed', value: -15 },
          { type: 'morale_boost', value: 10 },
          { type: 'population_growth', value: 8 }
        ],
        cost: { gold: 400, influence: 8 },
        duration: 0,
        conflicts: ['heavy_labor']
      },
      {
        id: 'heavy_labor',
        name: '重劳役',
        description: '集中劳力进行大规模建设',
        effects: [
          { type: 'construction_speed', value: 30 },
          { type: 'morale_drop', value: -15 },
          { type: 'population_growth', value: -10 }
        ],
        cost: { gold: 200, influence: 5 },
        duration: 0,
        conflicts: ['light_labor']
      }
    ]
  },
  {
    id: 'military_law',
    name: '军事法律',
    policies: [
      {
        id: 'strict_military',
        name: '军法严明',
        description: '实行严格军法，提高军队纪律',
        effects: [
          { type: 'military_discipline', value: 25 },
          { type: 'morale_boost', value: 5 },
          { type: 'recruitment_speed', value: -10 }
        ],
        cost: { gold: 600, influence: 12 },
        duration: 0,
        conflicts: ['lenient_military']
      },
      {
        id: 'lenient_military',
        name: '宽松军法',
        description: '宽松军法，提高士气',
        effects: [
          { type: 'military_discipline', value: -10 },
          { type: 'morale_boost', value: 15 },
          { type: 'recruitment_speed', value: 20 }
        ],
        cost: { gold: 300, influence: 6 },
        duration: 0,
        conflicts: ['strict_military']
      }
    ]
  },
  {
    id: 'social',
    name: '社会政策',
    policies: [
      {
        id: 'encourage_education',
        name: '兴办教育',
        description: '鼓励教育，培养人才',
        effects: [
          { type: 'research_speed', value: 20 },
          { type: 'hero recruite_chance', value: 15 },
          { type: 'morale_boost', value: 8 }
        ],
        cost: { gold: 1000, influence: 15 },
        duration: 0,
        conflicts: []
      },
      {
        id: 'encourage_trade',
        name: '鼓励贸易',
        description: '鼓励商业发展',
        effects: [
          { type: 'trade_income', value: 25 },
          { type: 'merchant_spawn_rate', value: 30 },
          { type: 'population_growth', value: 5 }
        ],
        cost: { gold: 800, influence: 10 },
        duration: 0,
        conflicts: []
      }
    ]
  }
];

// AI政策决策
function decidePolicy(
  city: City,
  context: GameContext
): PolicyDecision {
  const characteristics = CITY_CHARACTERISTICS[city.id];
  const balance = calculateEconomicBalance(city.economy);
  const security = calculateSecurity(city, context);
  
  // 根据城池状况决定政策
  const recommendations: PolicyRecommendation[] = [];
  
  // 民心低时推荐轻税
  if (city.morale < 40) {
    recommendations.push({
      policy: 'low_tax',
      priority: 90,
      reason: '民心过低，需要减轻赋税'
    });
  }
  
  // 金钱不足时推荐重税
  if (balance.surplus.gold < 0) {
    recommendations.push({
      policy: 'high_tax',
      priority: 70,
      reason: '金钱不足，需要增加税收'
    });
  }
  
  // 建设需求高时推荐轻徭役
  if (characteristics.developmentPath.primary === 'economic') {
    recommendations.push({
      policy: 'light_labor',
      priority: 60,
      reason: '经济发展需要休养生息'
    });
  }
  
  // 战争时期推荐严明军法
  if (context.atWar) {
    recommendations.push({
      policy: 'strict_military',
      priority: 80,
      reason: '战争时期需要严明军法'
    });
  }
  
  // 按优先级排序
  return recommendations.sort((a, b) => b.priority - a.priority)[0];
}
```

### 7. 水利工程系统

```typescript
interface WaterEngineeringSystem {
  // 水利设施
  facilities: WaterFacility[];
  
  // 水利事件
  events: WaterEvent[];
}

interface WaterFacility {
  id: string;
  name: string;
  type: 'irrigation' | 'dam' | 'levee' | 'canal' | 'harbor';
  
  // 效果
  effects: WaterFacilityEffect[];
  
  // 建设成本
  cost: ResourceCost;
  
  // 建设时间
  buildTime: number;
  
  // 维护成本
  maintenance: ResourceCost;
}

const WATER_FACILITIES: WaterFacility[] = [
  {
    id: 'irrigation_canal',
    name: '灌溉渠',
    type: 'irrigation',
    effects: [
      { type: 'farm_production', value: 25 },
      { type: 'drought_resistance', value: 30 }
    ],
    cost: { gold: 800, wood: 400, grain: 0, population: 0, iron: 50, cloth: 0, morale: 0 },
    buildTime: 4,
    maintenance: { gold: 50, wood: 20, grain: 0, population: 0, iron: 0, cloth: 0, morale: 0 }
  },
  {
    id: 'flood_control_dam',
    name: '防洪坝',
    type: 'dam',
    effects: [
      { type: 'flood_resistance', value: 50 },
      { type: 'water_supply', value: 30 }
    ],
    cost: { gold: 1500, wood: 800, grain: 0, population: 0, iron: 200, cloth: 0, morale: 0 },
    buildTime: 6,
    maintenance: { gold: 80, wood: 30, grain: 0, population: 0, iron: 10, cloth: 0, morale: 0 }
  },
  {
    id: 'levee',
    name: '堤坝',
    type: 'levee',
    effects: [
      { type: 'flood_resistance', value: 40 },
      { type: 'land_reclamation', value: 20 }
    ],
    cost: { gold: 1000, wood: 600, grain: 0, population: 0, iron: 100, cloth: 0, morale: 0 },
    buildTime: 5,
    maintenance: { gold: 60, wood: 25, grain: 0, population: 0, iron: 5, cloth: 0, morale: 0 }
  },
  {
    id: 'canal',
    name: '运河',
    type: 'canal',
    effects: [
      { type: 'trade_route', value: 1 },
      { type: 'transport_speed', value: 20 },
      { type: 'irrigation', value: 15 }
    ],
    cost: { gold: 2000, wood: 1000, grain: 0, population: 0, iron: 150, cloth: 0, morale: 0 },
    buildTime: 8,
    maintenance: { gold: 100, wood: 40, grain: 0, population: 0, iron: 10, cloth: 0, morale: 0 }
  }
];

// 水利需求分析
function analyzeWaterNeeds(
  city: City,
  context: GameContext
): WaterNeed[] {
  const needs: WaterNeed[] = [];
  const characteristics = CITY_CHARACTERISTICS[city.id];
  
  // 河流城市需要防洪
  if (characteristics.geography.type === 'river') {
    needs.push({
      type: 'flood_control',
      priority: 80,
      reason: '河流城市需要防洪设施',
      suggestedFacility: 'levee'
    });
  }
  
  // 干旱地区需要灌溉
  if (characteristics.geography.climate === 'arid') {
    needs.push({
      type: 'irrigation',
      priority: 90,
      reason: '干旱地区需要灌溉设施',
      suggestedFacility: 'irrigation_canal'
    });
  }
  
  // 农业城市需要灌溉
  if (characteristics.developmentPath.primary === 'economic' && 
      characteristics.resources.primary === 'grain') {
    needs.push({
      type: 'irrigation',
      priority: 70,
      reason: '农业城市需要灌溉提高产量',
      suggestedFacility: 'irrigation_canal'
    });
  }
  
  // 沿海/沿河城市需要港口
  if (characteristics.geography.type === 'coast' || 
      characteristics.geography.type === 'river') {
    if (city.facilities.harbor < 3) {
      needs.push({
        type: 'harbor',
        priority: 60,
        reason: '水运城市发展需要港口',
        suggestedFacility: 'canal'
      });
    }
  }
  
  return needs.sort((a, b) => b.priority - a.priority);
}

// 水利效果计算
function calculateWaterEffects(
  city: City,
  context: GameContext
): WaterEffects {
  let effects: WaterEffects = {
    farm_production: 0,
    flood_resistance: 0,
    drought_resistance: 0,
    trade_bonus: 0,
    transport_speed: 0
  };
  
  // 累加所有水利设施效果
  for (const facility of city.waterFacilities) {
    const facilityData = WATER_FACILITIES.find(f => f.id === facility.id);
    if (facilityData) {
      for (const effect of facilityData.effects) {
        effects[effect.type] += effect.value;
      }
    }
  }
  
  return effects;
}
```

### 8. 文化教育系统

```typescript
interface CultureSystem {
  // 文化设施
  facilities: CultureFacility[];
  
  // 文化活动
  activities: CultureActivity[];
}

interface CultureFacility {
  id: string;
  name: string;
  type: 'school' | 'academy' | 'temple' | 'market' | 'entertainment';
  
  // 效果
  effects: CultureFacilityEffect[];
  
  // 建设成本
  cost: ResourceCost;
  
  // 维护成本
  maintenance: ResourceCost;
}

const CULTURE_FACILITIES: CultureFacility[] = [
  {
    id: 'village_school',
    name: '村学',
    type: 'school',
    effects: [
      { type: 'morale_boost', value: 5 },
      { type: 'population_growth', value: 3 },
      { type: 'hero_recruit_chance', value: 5 }
    ],
    cost: { gold: 300, wood: 150, grain: 0, population: 0, iron: 0, cloth: 50, morale: 0 },
    maintenance: { gold: 20, wood: 5, grain: 0, population: 0, iron: 0, cloth: 10, morale: 0 }
  },
  {
    id: 'county_academy',
    name: '县学',
    type: 'academy',
    effects: [
      { type: 'morale_boost', value: 10 },
      { type: 'research_speed', value: 15 },
      { type: 'hero_recruit_chance', value: 10 },
      { type: 'intellect_hero_bonus', value: 5 }
    ],
    cost: { gold: 800, wood: 400, grain: 0, population: 0, iron: 0, cloth: 150, morale: 0 },
    maintenance: { gold: 50, wood: 15, grain: 0, population: 0, iron: 0, cloth: 30, morale: 0 }
  },
  {
    id: 'imperial_academy',
    name: '太学',
    type: 'academy',
    effects: [
      { type: 'morale_boost', value: 20 },
      { type: 'research_speed', value: 30 },
      { type: 'hero_recruit_chance', value: 20 },
      { type: 'intellect_hero_bonus', value: 10 },
      { type: 'politics_hero_bonus', value: 5 }
    ],
    cost: { gold: 2000, wood: 1000, grain: 0, population: 0, iron: 0, cloth: 400, morale: 0 },
    maintenance: { gold: 120, wood: 40, grain: 0, population: 0, iron: 0, cloth: 80, morale: 0 }
  },
  {
    id: 'temple',
    name: '寺庙',
    type: 'temple',
    effects: [
      { type: 'morale_boost', value: 15 },
      { type: 'security_boost', value: 10 },
      { type: 'health_boost', value: 10 }
    ],
    cost: { gold: 600, wood: 300, grain: 0, population: 0, iron: 0, cloth: 100, morale: 0 },
    maintenance: { gold: 40, wood: 10, grain: 0, population: 0, iron: 0, cloth: 20, morale: 0 }
  },
  {
    id: 'entertainment_district',
    name: '娱乐区',
    type: 'entertainment',
    effects: [
      { type: 'morale_boost', value: 20 },
      { type: 'trade_income', value: 10 },
      { type: 'population_growth', value: 5 }
    ],
    cost: { gold: 500, wood: 250, grain: 0, population: 0, iron: 0, cloth: 80, morale: 0 },
    maintenance: { gold: 30, wood: 8, grain: 0, population: 0, iron: 0, cloth: 15, morale: 0 }
  }
];

// 文化活动
interface CultureActivity {
  id: string;
  name: string;
  description: string;
  
  // 效果
  effects: CultureActivityEffect[];
  
  // 持续时间
  duration: number;
  
  // 成本
  cost: ResourceCost;
  
  // 冷却时间
  cooldown: number;
}

const CULTURE_ACTIVITIES: CultureActivity[] = [
  {
    id: 'harvest_festival',
    name: '丰收节',
    description: '庆祝丰收，提升民心',
    effects: [
      { type: 'morale_boost', value: 25 },
      { type: 'grain_production', value: 10 }
    ],
    duration: 2,
    cost: { gold: 300, wood: 50, grain: 200, population: 0, iron: 0, cloth: 50, morale: 0 },
    cooldown: 6
  },
  {
    id: 'literary_gathering',
    name: '文会',
    description: '举办文学聚会，吸引文人',
    effects: [
      { type: 'research_speed', value: 20 },
      { type: 'hero_recruit_chance', value: 15 },
      { type: 'morale_boost', value: 10 }
    ],
    duration: 1,
    cost: { gold: 200, wood: 30, grain: 0, population: 0, iron: 0, cloth: 100, morale: 0 },
    cooldown: 4
  },
  {
    id: 'military_parade',
    name: '阅兵',
    description: '举行阅兵，展示军威',
    effects: [
      { type: 'morale_boost', value: 15 },
      { type: 'military_discipline', value: 10 },
      { type: 'security_boost', value: 5 }
    ],
    duration: 1,
    cost: { gold: 400, wood: 100, grain: 100, population: 0, iron: 50, cloth: 100, morale: 0 },
    cooldown: 8
  },
  {
    id: 'religious_ceremony',
    name: '祭祀',
    description: '举行祭祀活动，安抚民心',
    effects: [
      { type: 'morale_boost', value: 20 },
      { type: 'security_boost', value: 10 },
      { type: 'health_boost', value: 5 }
    ],
    duration: 1,
    cost: { gold: 250, wood: 50, grain: 100, population: 0, iron: 0, cloth: 80, morale: 0 },
    cooldown: 5
  }
];

// AI文化决策
function decideCulture(
  city: City,
  context: GameContext
): CultureDecision {
  const characteristics = CITY_CHARACTERISTICS[city.id];
  
  // 分析文化需求
  const needs = analyzeCultureNeeds(city, characteristics, context);
  
  // 推荐设施
  const facilityRecommendations = recommendFacilities(city, needs, context);
  
  // 推荐活动
  const activityRecommendations = recommendActivities(city, needs, context);
  
  return {
    facilities: facilityRecommendations,
    activities: activityRecommendations
  };
}

// 分析文化需求
function analyzeCultureNeeds(
  city: City,
  characteristics: CityCharacteristics,
  context: GameContext
): CultureNeed[] {
  const needs: CultureNeed[] = [];
  
  // 民心低需要文化设施
  if (city.morale < 50) {
    needs.push({
      type: 'morale_boost',
      priority: 80,
      reason: '民心过低，需要文化活动提升'
    });
  }
  
  // 学术城市需要教育设施
  if (characteristics.culture.type === 'scholarly') {
    needs.push({
      type: 'education',
      priority: 70,
      reason: '学术城市需要完善教育体系'
    });
  }
  
  // 治安低需要宗教设施
  const security = calculateSecurity(city, context);
  if (security.level < 50) {
    needs.push({
      type: 'religion',
      priority: 60,
      reason: '治安不稳，需要宗教安抚'
    });
  }
  
  // 人口增长需要娱乐设施
  if (city.population < city.maxPopulation * 0.7) {
    needs.push({
      type: 'entertainment',
      priority: 50,
      reason: '需要吸引人口，提升生活品质'
    });
  }
  
  return needs.sort((a, b) => b.priority - a.priority);
}
```

## 内政报告系统

### 实时报告

```typescript
interface InternalAffairsReport {
  date: GameDate;
  factionId: string;
  
  // 城池状况
  cities: CityStatusReport[];
  
  // 整体统计
  overall: OverallStats;
  
  // AI建议
  recommendations: Recommendation[];
  
  // 预警
  warnings: Warning[];
}

interface CityStatusReport {
  cityId: string;
  name: string;
  
  // 经济
  economy: {
    production: Resources;
    consumption: Resources;
    balance: Resources;
    status: 'prosperity' | 'stable' | 'declining' | 'crisis';
  };
  
  // 人口
  population: {
    current: number;
    growth: number;
    conscription: number;
    migration: MigrationInfo;
  };
  
  // 治安
  security: {
    level: number;
    status: 'stable' | 'warning' | 'critical';
    rebellionRisk: number;
  };
  
  // 设施
  facilities: CityFacilities;
  
  // 武将
  appointments: HeroAppointment[];
  
  // 建设
  construction: ConstructionQueue[];
  
  // 研究
  research: ResearchProgress[];
  
  // 政策
  policies: ActivePolicy[];
  
  // 水利
  waterWorks: WaterFacility[];
  
  // 文化
  culture: CultureStatus;
}

interface OverallStats {
  totalPopulation: number;
  totalWealth: number;
  averageMorale: number;
  averageSecurity: number;
  constructionProjects: number;
  activeResearch: number;
  activePolicies: number;
}

interface Recommendation {
  type: 'construction' | 'policy' | 'appointment' | 'research' | 'culture';
  priority: 'high' | 'medium' | 'low';
  description: string;
  reason: string;
  estimatedCost: ResourceCost;
  estimatedBenefit: string;
}

interface Warning {
  type: 'economic' | 'security' | 'population' | 'morale' | 'disaster';
  severity: 'critical' | 'high' | 'medium' | 'low';
  cityId: string;
  description: string;
  suggestion: string;
}

// 生成内政报告
function generateInternalAffairsReport(
  faction: Faction,
  context: GameContext
): InternalAffairsReport {
  const report: InternalAffairsReport = {
    date: context.currentDate,
    factionId: faction.id,
    cities: [],
    overall: {
      totalPopulation: 0,
      totalWealth: 0,
      averageMorale: 0,
      averageSecurity: 0,
      constructionProjects: 0,
      activeResearch: 0,
      activePolicies: 0
    },
    recommendations: [],
    warnings: []
  };
  
  let totalMorale = 0;
  let totalSecurity = 0;
  
  for (const city of faction.cities) {
    const cityReport = generateCityStatusReport(city, context);
    report.cities.push(cityReport);
    
    // 累计统计
    report.overall.totalPopulation += city.population;
    report.overall.totalWealth += city.resources.gold;
    totalMorale += city.morale;
    totalSecurity += cityReport.security.level;
    report.overall.constructionProjects += cityReport.construction.length;
    report.overall.activeResearch += cityReport.research.length;
    report.overall.activePolicies += cityReport.policies.length;
    
    // 收集预警
    report.warnings.push(...cityReport.warnings);
    
    // 收集建议
    report.recommendations.push(...cityReport.recommendations);
  }
  
  // 计算平均值
  const cityCount = faction.cities.length;
  report.overall.averageMorale = Math.floor(totalMorale / cityCount);
  report.overall.averageSecurity = Math.floor(totalSecurity / cityCount);
  
  // 按优先级排序建议
  report.recommendations.sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  });
  
  return report;
}

// 生成城市状态报告
function generateCityStatusReport(
  city: City,
  context: GameContext
): CityStatusReport {
  const economy = calculateEconomicBalance(city.economy);
  const population = calculatePopulationGrowth(city, context);
  const security = calculateSecurity(city, context);
  
  return {
    cityId: city.id,
    name: city.name,
    economy: {
      production: calculateCityProduction(city.economy),
      consumption: calculateCityConsumption(city.economy),
      balance: economy.surplus,
      status: economy.status
    },
    population: {
      current: city.population,
      growth: population.growthRate,
      conscription: calculateConscriptionCapacity(city, context).current,
      migration: checkMigration(city, context)
    },
    security: {
      level: security.level,
      status: security.status,
      rebellionRisk: security.rebellionRisk.level
    },
    facilities: city.facilities,
    appointments: Object.entries(city.appointments).map(([position, heroId]) => ({
      position,
      heroId,
      heroName: getHeroName(heroId, context)
    })),
    construction: city.constructionQueue,
    research: city.activeResearch,
    policies: city.activePolicies,
    waterWorks: city.waterFacilities,
    culture: {
      facilities: city.cultureFacilities,
      activities: city.activeActivities
    },
    warnings: generateCityWarnings(city, economy, population, security),
    recommendations: generateCityRecommendations(city, context)
  };
}
```

## 文件结构

```
client/src/components/InternalAffairs/
├── InternalAffairsPanel.tsx    # 内政总览面板
├── CityDetailView.tsx          # 城池详情视图
├── ConstructionPanel.tsx       # 建设面板
├── AppointmentPanel.tsx        # 任命面板
├── PopulationPanel.tsx         # 人口面板
├── SecurityPanel.tsx           # 治安面板
├── ResearchPanel.tsx           # 研究面板
├── PolicyPanel.tsx             # 政策面板
├── WaterWorksPanel.tsx         # 水利面板
├── CulturePanel.tsx            # 文化面板
├── data/
│   ├── cityCharacteristics.json # 城池特性
│   ├── facilities.json         # 设施数据
│   ├── technologies.json       # 技术树
│   ├── policies.json           # 政策数据
│   ├── waterFacilities.json    # 水利设施
│   ├── cultureFacilities.json  # 文化设施
│   └── activities.json         # 文化活动
├── engine/
│   ├── InternalAffairsAI.ts    # 内政AI
│   ├── ConstructionSystem.ts   # 建设系统
│   ├── AppointmentSystem.ts    # 任命系统
│   ├── PopulationSystem.ts     # 人口系统
│   ├── SecuritySystem.ts       # 治安系统
│   ├── TechnologySystem.ts     # 技术系统
│   ├── PolicySystem.ts         # 政策系统
│   ├── WaterEngineering.ts     # 水利系统
│   ├── CultureSystem.ts        # 文化系统
│   └── ReportGenerator.ts      # 报告生成器
├── ui/
│   ├── ResourceBar.tsx         # 资源条
│   ├── ProgressChart.tsx       # 进度图表
│   ├── WarningBadge.tsx        # 预警标签
│   └── RecommendationCard.tsx  # 建议卡片
└── types/
    └── internalAffairs.ts      # 内政类型定义
```

## 开发阶段

### Phase 1: 基础框架
- 城池特性系统
- 基础内政模块
- 实时报告

### Phase 2: 建设与任命
- 建设系统
- 武将任命
- 设施效果

### Phase 3: 人口与治安
- 人口管理
- 治安系统
- 叛乱机制

### Phase 4: 技术与政策
- 技术研究
- 法律政策
- 政策效果

### Phase 5: 水利与文化
- 水利工程
- 文化教育
- 活动系统

### Phase 6: AI与报告
- AI决策逻辑
- 内政报告
- 预警系统

## 验证方案

1. **城池特性**: 每个城池有独特特性和发展路线
2. **建设系统**: 建设时间、成本、效果正确
3. **任命系统**: 武将适配度计算正确，效果生效
4. **人口系统**: 人口增长、迁移、征兵正常
5. **治安系统**: 治安度计算正确，叛乱触发合理
6. **技术系统**: 技术树完整，效果正确
7. **政策系统**: 政策效果正确，冲突检测正常
8. **水利系统**: 水利设施效果正确
9. **文化系统**: 文化设施和活动效果正确
10. **内政报告**: 实时更新，数据准确
