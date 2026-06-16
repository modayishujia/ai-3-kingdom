# 经济系统 - 设计规划

## 概述

完整的经济系统，支持7种资源（粮食、金钱、人口、木材、铁矿、布匹、民心），纯AI管理，分层架构（城池产出→势力池→分配），完整贸易网络（城池间+势力间+商人）。

## 系统架构

```
┌─────────────────────────────────────────────────────────────┐
│                      AI 经济引擎                            │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  城池产出 → 势力资源池 → AI分配 → 城池需求           │    │
│  │      ↓          ↓           ↓          ↓            │    │
│  │  [生产报告] [资源汇总] [分配决策] [需求分析]          │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                      资源层                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   城池产出    │  │   势力资源池  │  │   贸易网络    │     │
│  │   (7种资源)  │  │   (统一管理)  │  │   (流动)     │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                      消费层                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   军事消耗    │  │   建设消耗    │  │   外交消耗    │     │
│  │   (养兵/征兵) │  │   (建筑升级)  │  │   (联盟/朝贡) │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

## 资源系统

### 资源类型定义

```typescript
interface Resources {
  grain: number;    // 粮食 - 养兵、维持人口、贸易
  gold: number;     // 金钱 - 建设、外交、雇佣
  population: number; // 人口 - 征兵、生产、税收基础
  wood: number;     // 木材 - 建筑、攻城器械
  iron: number;     // 铁矿 - 兵器、盔甲
  cloth: number;    // 布匹 - 军需、贸易品
  morale: number;   // 民心 - 统治稳定度、叛乱风险
}

// 资源配置
const RESOURCE_CONFIG: Record<keyof Resources, ResourceConfig> = {
  grain: {
    name: '粮食',
    icon: '🌾',
    baseStorage: 10000,
    perishable: true,      // 可腐烂
    perishRate: 0.02,      // 每月腐烂2%
    tradeValue: 1,
    description: '养兵和维持人口的基础资源'
  },
  gold: {
    name: '金钱',
    icon: '💰',
    baseStorage: 5000,
    perishable: false,
    tradeValue: 10,
    description: '建设和外交的主要货币'
  },
  population: {
    name: '人口',
    icon: '👥',
    baseStorage: 50000,
    perishable: false,
    tradeValue: 0,         // 人口不可交易
    description: '征兵和生产的基础'
  },
  wood: {
    name: '木材',
    icon: '🪵',
    baseStorage: 8000,
    perishable: false,
    tradeValue: 2,
    description: '建筑和攻城器械的材料'
  },
  iron: {
    name: '铁矿',
    icon: '⛏️',
    baseStorage: 6000,
    perishable: false,
    tradeValue: 5,
    description: '兵器和盔甲的材料'
  },
  cloth: {
    name: '布匹',
    icon: '🧵',
    baseStorage: 4000,
    perishable: false,
    tradeValue: 3,
    description: '军需和贸易品'
  },
  morale: {
    name: '民心',
    icon: '❤️',
    baseStorage: 100,
    perishable: false,
    tradeValue: 0,         // 民心不可交易
    max: 100,
    description: '统治稳定度，过低会引发叛乱'
  }
};
```

### 资源关系图

```
         粮食 ←←← 人口
          ↓         ↑
         养兵      征兵
          ↓         ↑
    ┌─────↓─────────↓─────┐
    │      军事力量        │
    └─────↑─────────↑─────┘
          ↓         ↑
    铁矿+木材    布匹
     (兵器)     (军服)
          ↓         ↑
         建设 ←←← 金钱
```

## 城池经济系统

### 城池经济数据

```typescript
interface CityEconomy {
  cityId: string;
  
  // 生产设施
  facilities: CityFacilities;
  
  // 资源产出
  production: Resources;
  
  // 资源消耗
  consumption: Resources;
  
  // 贸易
  trade: CityTrade;
  
  // 特殊加成
  bonuses: EconomicBonus[];
}

interface CityFacilities {
  farm: number;      // 农田等级 0-5
  market: number;    // 市场等级 0-5
  lumbermill: number; // 伐木场等级 0-5
  mine: number;      // 矿场等级 0-5
  workshop: number;  // 工坊等级 0-5
  harbor: number;    // 港口等级 0-5
  temple: number;    // 寺庙等级 0-5 (影响民心)
}

// 城池产出计算
function calculateCityProduction(city: CityEconomy): Resources {
  const { facilities, bonuses } = city;
  
  // 基础产出
  let production: Resources = {
    grain: 200 + facilities.farm * 100,
    gold: 100 + facilities.market * 80,
    population: 50 + Math.floor(city.population / 1000),
    wood: 80 + facilities.lumbermill * 60,
    iron: 40 + facilities.mine * 50,
    cloth: 30 + facilities.workshop * 40,
    morale: 0  // 民心不直接产出
  };
  
  // 应用加成
  for (const bonus of bonuses) {
    if (bonus.type === 'production') {
      production[bonus.resource] = Math.floor(
        production[bonus.resource] * (1 + bonus.value / 100)
      );
    }
  }
  
  // 人口影响（人口越多产出越高）
  const populationMultiplier = 1 + (city.population - 10000) / 50000;
  production.grain = Math.floor(production.grain * populationMultiplier);
  production.gold = Math.floor(production.gold * populationMultiplier);
  
  return production;
}

// 城池消耗计算
function calculateCityConsumption(city: CityEconomy): Resources {
  const { population, facilities } = city;
  
  // 基础消耗（维持人口）
  let consumption: Resources = {
    grain: Math.floor(population * 0.1),  // 每人每月消耗0.1粮食
    gold: Math.floor(population * 0.02), // 每人每月消耗0.02金钱
    population: 0,
    wood: 0,
    iron: 0,
    cloth: Math.floor(population * 0.01), // 每人每月消耗0.01布匹
    morale: 0
  };
  
  // 设施维护消耗
  consumption.gold += facilities.farm * 10;
  consumption.gold += facilities.market * 15;
  consumption.gold += facilities.lumbermill * 12;
  consumption.gold += facilities.mine * 18;
  consumption.gold += facilities.workshop * 14;
  
  return consumption;
}
```

### 城池经济平衡

```typescript
interface EconomicBalance {
  cityId: string;
  
  // 盈余/赤字
  surplus: Resources;
  
  // 经济状态
  status: 'prosperity' | 'stable' | 'declining' | 'crisis';
  
  // 预警
  warnings: EconomicWarning[];
}

function calculateEconomicBalance(city: CityEconomy): EconomicBalance {
  const production = calculateCityProduction(city);
  const consumption = calculateCityConsumption(city);
  
  // 计算盈余/赤字
  const surplus: Resources = {
    grain: production.grain - consumption.grain,
    gold: production.gold - consumption.gold,
    population: production.population - consumption.population,
    wood: production.wood - consumption.wood,
    iron: production.iron - consumption.iron,
    cloth: production.cloth - consumption.cloth,
    morale: production.morale - consumption.morale
  };
  
  // 判断经济状态
  let status: EconomicBalance['status'] = 'stable';
  let warnings: EconomicWarning[] = [];
  
  // 检查粮食盈余
  if (surplus.grain < 0) {
    warnings.push({
      type: 'grain_deficit',
      severity: 'high',
      message: `粮食短缺，每月亏损${Math.abs(surplus.grain)}`
    });
    status = 'declining';
  }
  
  // 检查金钱盈余
  if (surplus.gold < 0) {
    warnings.push({
      type: 'gold_deficit',
      severity: 'medium',
      message: `金钱不足，每月亏损${Math.abs(surplus.gold)}`
    });
  }
  
  // 检查民心
  if (city.morale < 30) {
    warnings.push({
      type: 'low_morale',
      severity: 'critical',
      message: '民心过低，可能爆发叛乱'
    });
    status = 'crisis';
  }
  
  // 检查人口增长
  if (surplus.population < 0) {
    warnings.push({
      type: 'population_decline',
      severity: 'medium',
      message: '人口减少，影响长期发展'
    });
  }
  
  return { cityId: city.cityId, surplus, status, warnings };
}
```

## 势力经济系统

### 势力资源池

```typescript
interface FactionEconomy {
  factionId: string;
  
  // 资源池（所有城池产出汇总）
  resourcePool: Resources;
  
  // 城池经济
  cities: Map<string, CityEconomy>;
  
  // 贸易网络
  tradeNetwork: TradeNetwork;
  
  // 预算分配
  budget: BudgetAllocation;
  
  // 经济政策
  policies: EconomicPolicy[];
}

interface BudgetAllocation {
  // 预算比例 (0-100%)
  military: number;    // 军事
  construction: number; // 建设
  diplomacy: number;   // 外交
  reserves: number;    // 储备
}

// 势力经济汇总
function calculateFactionEconomy(faction: FactionEconomy): void {
  let totalProduction: Resources = {
    grain: 0, gold: 0, population: 0,
    wood: 0, iron: 0, cloth: 0, morale: 0
  };
  
  let totalConsumption: Resources = {
    grain: 0, gold: 0, population: 0,
    wood: 0, iron: 0, cloth: 0, morale: 0
  };
  
  // 汇总所有城池
  for (const [cityId, city] of faction.cities) {
    const production = calculateCityProduction(city);
    const consumption = calculateCityConsumption(city);
    
    for (const resource of Object.keys(totalProduction) as (keyof Resources)[]) {
      totalProduction[resource] += production[resource];
      totalConsumption[resource] += consumption[resource];
    }
  }
  
  // 更新资源池
  faction.resourcePool = {
    grain: totalProduction.grain - totalConsumption.grain,
    gold: totalProduction.gold - totalConsumption.gold,
    population: totalProduction.population,
    wood: totalProduction.wood - totalConsumption.wood,
    iron: totalProduction.iron - totalConsumption.iron,
    cloth: totalProduction.cloth - totalConsumption.cloth,
    morale: 0
  };
}
```

### 预算分配系统

```typescript
interface BudgetPolicy {
  name: string;
  description: string;
  allocation: BudgetAllocation;
  effects: BudgetEffect[];
}

const BUDGET_POLICIES: BudgetPolicy[] = [
  {
    name: '军事优先',
    description: '集中资源发展军事，适合战争时期',
    allocation: { military: 60, construction: 20, diplomacy: 10, reserves: 10 },
    effects: [
      { type: 'military_boost', value: 20 },
      { type: 'construction_slow', value: -30 },
      { type: 'morale_drop', value: -5 }
    ]
  },
  {
    name: '均衡发展',
    description: '平衡各方面发展，适合稳定时期',
    allocation: { military: 30, construction: 35, diplomacy: 15, reserves: 20 },
    effects: []
  },
  {
    name: '经济优先',
    description: '集中发展经济，适合积蓄力量',
    allocation: { military: 15, construction: 50, diplomacy: 10, reserves: 25 },
    effects: [
      { type: 'production_boost', value: 25 },
      { type: 'military_weak', value: -20 },
      { type: 'morale_boost', value: 10 }
    ]
  },
  {
    name: '外交优先',
    description: '重视外交关系，适合弱小时期',
    allocation: { military: 20, construction: 25, diplomacy: 40, reserves: 15 },
    effects: [
      { type: 'diplomacy_boost', value: 30 },
      { type: 'military_weak', value: -15 },
      { type: 'alliance_easier', value: 20 }
    ]
  }
];

// 应用预算分配
function applyBudget(
  faction: FactionEconomy,
  policy: BudgetPolicy
): void {
  faction.budget = policy.allocation;
  
  // 应用效果
  for (const effect of policy.effects) {
    applyBudgetEffect(faction, effect);
  }
}

// AI预算决策
function decideBudgetAI(
  faction: Faction,
  context: GameContext
): BudgetPolicy {
  // 分析当前形势
  const analysis = analyzeFactionSituation(faction, context);
  
  // 根据形势选择政策
  if (analysis.atWar) {
    return BUDGET_POLICIES.find(p => p.name === '军事优先')!;
  }
  
  if (analysis.economyCrisis) {
    return BUDGET_POLICIES.find(p => p.name === '经济优先')!;
  }
  
  if (analysis.weakPosition) {
    return BUDGET_POLICIES.find(p => p.name === '外交优先')!;
  }
  
  return BUDGET_POLICIES.find(p => p.name === '均衡发展')!;
}
```

## 贸易系统

### 贸易网络

```typescript
interface TradeNetwork {
  // 内部贸易（己方城池间）
  internalTrade: InternalTradeRoute[];
  
  // 外部贸易（势力间）
  externalTrade: ExternalTradeRoute[];
  
  // 商人系统
  merchants: Merchant[];
}

interface InternalTradeRoute {
  from: string;      // 起点城池
  to: string;        // 终点城池
  resource: keyof Resources;
  amount: number;
  cost: number;      // 运输成本
  duration: number;  // 运输时间（回合）
}

interface ExternalTradeRoute {
  faction1: string;
  faction2: string;
  resource: keyof Resources;
  amount: number;
  price: number;     // 交易价格
  reputation: number; // 信誉度
}

interface Merchant {
  id: string;
  name: string;
  factionId: string;
  location: string;  // 当前所在城池
  
  // 商人属性
  capital: number;       // 资金
  reputation: number;    // 信誉
  specialty: keyof Resources; // 专营资源
  
  // 行为
  routes: TradeRoute[];
  profit: number;
}
```

### 内部贸易系统

```typescript
// 资源调配（势力内部）
function createResourceTransfer(
  fromCity: CityEconomy,
  toCity: CityEconomy,
  resource: keyof Resources,
  amount: number
): ResourceTransfer {
  // 计算运输成本
  const distance = calculateDistance(fromCity, toCity);
  const cost = Math.floor(amount * distance * 0.01);
  
  // 检查是否有足够资源
  if (fromCity.production[resource] < amount) {
    return { success: false, reason: '资源不足' };
  }
  
  // 检查运输能力
  const transportCapacity = calculateTransportCapacity(fromCity, toCity);
  if (amount > transportCapacity) {
    return { success: false, reason: '运输能力不足' };
  }
  
  return {
    success: true,
    cost,
    duration: Math.ceil(distance / 10),
    message: `运输${RESOURCE_CONFIG[resource].name} ${amount}单位，预计${Math.ceil(distance / 10)}回合到达`
  };
}

// AI自动调配
function autoResourceAllocation(faction: FactionEconomy): void {
  // 找出盈余和赤字城池
  const surplusCities: { city: CityEconomy; resource: keyof Resources; amount: number }[] = [];
  const deficitCities: { city: CityEconomy; resource: keyof Resources; amount: number }[] = [];
  
  for (const [cityId, city] of faction.cities) {
    const balance = calculateEconomicBalance(city);
    
    for (const resource of Object.keys(balance.surplus) as (keyof Resources)[]) {
      if (balance.surplus[resource] > 100) {
        surplusCities.push({ city, resource, amount: balance.surplus[resource] });
      } else if (balance.surplus[resource] < -100) {
        deficitCities.push({ city, resource, amount: Math.abs(balance.surplus[resource]) });
      }
    }
  }
  
  // 按距离匹配供需
  for (const surplus of surplusCities) {
    for (const deficit of deficitCities) {
      if (surplus.resource === deficit.resource) {
        const distance = calculateDistance(surplus.city, deficit.city);
        const amount = Math.min(surplus.amount, deficit.amount);
        
        if (amount > 50 && distance < 100) {
          createResourceTransfer(surplus.city, deficit.city, surplus.resource, amount);
        }
      }
    }
  }
}
```

### 外部贸易系统

```typescript
// 势力间贸易
interface TradeAgreement {
  faction1: string;
  faction2: string;
  
  // 贸易条款
  terms: TradeTerms;
  
  // 持续时间
  duration: number;
  currentTurn: number;
  
  // 信誉
  reputation: number;
}

interface TradeTerms {
  // 可交易资源
  tradableResources: (keyof Resources)[];
  
  // 价格调整
  priceModifier: number;
  
  // 优惠条件
  preferential: boolean;
}

// 计算贸易价格
function calculateTradePrice(
  buyer: Faction,
  seller: Faction,
  resource: keyof Resources,
  context: GameContext
): number {
  // 基础价格
  let basePrice = RESOURCE_CONFIG[resource].tradeValue * 100;
  
  // 供需影响
  const buyerDemand = calculateResourceDemand(buyer, resource, context);
  const sellerSupply = calculateResourceSupply(seller, resource, context);
  
  if (buyerDemand > sellerSupply * 2) {
    basePrice *= 1.5;  // 供不应求，涨价
  } else if (sellerSupply > buyerDemand * 2) {
    basePrice *= 0.7;  // 供过于求，降价
  }
  
  // 关系影响
  const relation = context.relations.matrix[buyer.id][seller.id];
  const relationModifier = 1 - (relation / 200);  // 关系好则便宜
  basePrice *= relationModifier;
  
  // 距离影响
  const distance = calculateFactionDistance(buyer, seller);
  basePrice *= 1 + (distance / 1000);
  
  // 贸易协定影响
  if (hasTradeAgreement(buyer.id, seller.id, context)) {
    basePrice *= 0.85;  // 有协定优惠15%
  }
  
  return Math.floor(basePrice);
}

// 贸易接受概率
function calculateTradeAcceptance(
  buyer: Faction,
  seller: Faction,
  resource: keyof Resources,
  amount: number,
  context: GameContext
): number {
  let acceptance = 50;
  
  // 关系影响
  const relation = context.relations.matrix[seller.id][buyer.id];
  acceptance += relation / 3;
  
  // 自身需求影响
  const sellerNeed = calculateResourceNeed(seller, resource, context);
  if (sellerNeed > amount * 2) {
    acceptance -= 30;  // 自己很需要，不愿卖
  }
  
  // 价格影响
  const price = calculateTradePrice(buyer, seller, resource, context);
  if (price < 80) {
    acceptance += 15;  // 价格好，更愿意
  }
  
  // 贸易协定影响
  if (hasTradeAgreement(buyer.id, seller.id, context)) {
    acceptance += 25;  // 有协定更愿意
  }
  
  // 历史交易影响
  const tradeHistory = getTradeHistory(buyer.id, seller.id, context);
  if (tradeHistory.successRate > 80) {
    acceptance += 15;  // 历史信誉好
  }
  
  return Math.min(90, Math.max(10, acceptance));
}
```

### 商人系统

```typescript
class MerchantAI {
  // 商人行为决策
  decideAction(merchant: Merchant, context: GameContext): MerchantAction {
    // 分析当前市场
    const marketAnalysis = this.analyzeMarket(merchant.location, context);
    
    // 寻找最佳贸易路线
    const bestRoute = this.findBestRoute(merchant, marketAnalysis, context);
    
    // 决策
    if (bestRoute.profit > merchant.capital * 0.1) {
      return {
        type: 'trade',
        route: bestRoute,
        message: `${merchant.name}发现商机，前往${bestRoute.destination}贸易`
      };
    }
    
    if (merchant.capital < 1000) {
      return {
        type: 'rest',
        message: `${merchant.name}资金不足，暂时休整`
      };
    }
    
    return {
      type: 'explore',
      message: `${merchant.name}探索新的贸易机会`
    };
  }
  
  // 分析市场
  private analyzeMarket(
    location: string,
    context: GameContext
  ): MarketAnalysis {
    const city = context.cities.find(c => c.id === location);
    if (!city) return { prices: {}, demands: {}, supplies: {} };
    
    const prices: Record<keyof Resources, number> = {
      grain: 0, gold: 0, population: 0,
      wood: 0, iron: 0, cloth: 0, morale: 0
    };
    
    // 计算各资源价格
    for (const resource of Object.keys(prices) as (keyof Resources)[]) {
      prices[resource] = calculateLocalPrice(city, resource, context);
    }
    
    return { prices, demands: {}, supplies: {} };
  }
  
  // 寻找最佳路线
  private findBestRoute(
    merchant: Merchant,
    market: MarketAnalysis,
    context: GameContext
  ): TradeRoute {
    let bestRoute: TradeRoute = {
      destination: '',
      resource: 'grain',
      amount: 0,
      profit: 0,
      risk: 0
    };
    
    // 遍历所有可达城池
    for (const city of context.cities) {
      if (city.id === merchant.location) continue;
      
      // 计算距离和安全
      const distance = calculateDistance(merchant.location, city.id, context);
      const safety = this.calculateSafety(city.factionId, context);
      
      // 计算各资源利润
      for (const resource of Object.keys(market.prices) as (keyof Resources)[]) {
        if (resource === 'population' || resource === 'morale') continue;
        
        const buyPrice = market.prices[resource];
        const sellPrice = calculateLocalPrice(city, resource, context);
        const transportCost = distance * 0.5;
        
        const profit = (sellPrice - buyPrice) * 100 - transportCost;
        
        if (profit > bestRoute.profit) {
          bestRoute = {
            destination: city.id,
            resource,
            amount: Math.floor(merchant.capital / buyPrice),
            profit,
            risk: 100 - safety
          };
        }
      }
    }
    
    return bestRoute;
  }
  
  // 计算安全性
  private calculateSafety(factionId: string, context: GameContext): number {
    let safety = 70;
    
    // 战争状态减分
    if (isAtWar(factionId, context)) {
      safety -= 40;
    }
    
    // 治安度加分
    const faction = context.factions.find(f => f.id === factionId);
    if (faction) {
      const avgSecurity = calculateAverageSecurity(faction, context);
      safety += avgSecurity / 5;
    }
    
    return Math.min(95, Math.max(10, safety));
  }
}
```

## AI经济管理

### AI经济决策

```typescript
class EconomyAI {
  // AI经济管理主循环
  manageEconomy(faction: Faction, context: GameContext): EconomyReport {
    const report: EconomyReport = {
      factionId: faction.id,
      date: context.currentDate,
      actions: [],
      warnings: [],
      recommendations: []
    };
    
    // 1. 检查资源状况
    const resourceStatus = this.analyzeResources(faction, context);
    report.warnings.push(...resourceStatus.warnings);
    
    // 2. 调整预算
    const budgetPolicy = this.decideBudget(faction, context);
    report.actions.push({
      type: 'budget_adjustment',
      policy: budgetPolicy.name,
      reason: budgetPolicy.description
    });
    
    // 3. 资源调配
    const allocationActions = this.allocateResources(faction, context);
    report.actions.push(...allocationActions);
    
    // 4. 贸易决策
    const tradeActions = this.decideTrades(faction, context);
    report.actions.push(...tradeActions);
    
    // 5. 建设建议
    const constructionRecommendations = this.recommendConstruction(faction, context);
    report.recommendations.push(...constructionRecommendations);
    
    return report;
  }
  
  // 分析资源状况
  private analyzeResources(
    faction: Faction,
    context: GameContext
  ): ResourceAnalysis {
    const warnings: EconomicWarning[] = [];
    
    // 检查粮食
    const grainMonths = calculateGrainMonths(faction, context);
    if (grainMonths < 3) {
      warnings.push({
        type: 'grain_shortage',
        severity: 'critical',
        message: `粮食仅够${grainMonths}个月，急需补充`
      });
    }
    
    // 检查金钱
    const goldBalance = calculateGoldBalance(faction, context);
    if (goldBalance < 0) {
      warnings.push({
        type: 'gold_deficit',
        severity: 'high',
        message: `金钱每月亏损${Math.abs(goldBalance)}`
      });
    }
    
    // 检查木材（影响建设）
    const woodSupply = calculateWoodSupply(faction, context);
    if (woodSupply < 1000) {
      warnings.push({
        type: 'wood_low',
        severity: 'medium',
        message: '木材不足，影响建设进度'
      });
    }
    
    // 检查铁矿（影响军事）
    const ironSupply = calculateIronSupply(faction, context);
    if (ironSupply < 500) {
      warnings.push({
        type: 'iron_low',
        severity: 'medium',
        message: '铁矿不足，影响兵器生产'
      });
    }
    
    return { warnings };
  }
  
  // 资源调配
  private allocateResources(
    faction: Faction,
    context: GameContext
  ): EconomyAction[] {
    const actions: EconomyAction[] = [];
    
    // 自动调配内部资源
    autoResourceAllocation(faction.economy);
    
    actions.push({
      type: 'internal_allocation',
      message: '自动调配各城池资源'
    });
    
    return actions;
  }
  
  // 贸易决策
  private decideTrades(
    faction: Faction,
    context: GameContext
  ): EconomyAction[] {
    const actions: EconomyAction[] = [];
    
    // 检查是否需要外部贸易
    const resourceNeeds = this.assessResourceNeeds(faction, context);
    
    for (const need of resourceNeeds) {
      if (need.urgency > 70) {
        // 寻找贸易伙伴
        const partner = this.findTradePartner(faction, need.resource, context);
        if (partner) {
          const amount = this.calculateTradeAmount(faction, partner, need.resource, context);
          actions.push({
            type: 'external_trade',
            partner: partner.name,
            resource: need.resource,
            amount,
            reason: need.reason
          });
        }
      }
    }
    
    return actions;
  }
  
  // 建设建议
  private recommendConstruction(
    faction: Faction,
    context: GameContext
  ): ConstructionRecommendation[] {
    const recommendations: ConstructionRecommendation[] = [];
    
    // 分析各城池需求
    for (const city of faction.cities) {
      const balance = calculateEconomicBalance(city.economy);
      
      // 粮食短缺，建议建农田
      if (balance.surplus.grain < 0) {
        recommendations.push({
          cityId: city.id,
          facility: 'farm',
          priority: 'high',
          reason: '粮食短缺，需要增加产量'
        });
      }
      
      // 金钱不足，建议建市场
      if (balance.surplus.gold < 0) {
        recommendations.push({
          cityId: city.id,
          facility: 'market',
          priority: 'medium',
          reason: '金钱不足，需要增加收入'
        });
      }
      
      // 民心低，建议建寺庙
      if (city.morale < 40) {
        recommendations.push({
          cityId: city.id,
          facility: 'temple',
          priority: 'high',
          reason: '民心过低，需要安抚百姓'
        });
      }
    }
    
    return recommendations;
  }
}
```

## 经济事件系统

### 随机经济事件

```typescript
interface EconomicEvent {
  id: string;
  name: string;
  description: string;
  
  // 触发条件
  conditions: EventCondition[];
  
  // 效果
  effects: EconomicEffect[];
  
  // 持续时间
  duration: number;
}

const ECONOMIC_EVENTS: EconomicEvent[] = [
  {
    id: 'drought',
    name: '旱灾',
    description: '持续干旱导致农作物减产',
    conditions: [
      { type: 'season', value: 'summer' },
      { type: 'random', value: 0.05 }
    ],
    effects: [
      { type: 'grain_production', value: -30, target: 'city' },
      { type: 'morale_drop', value: -10, target: 'city' }
    ],
    duration: 3
  },
  {
    id: 'flood',
    name: '水灾',
    description: '洪水泛滥造成破坏',
    conditions: [
      { type: 'season', value: 'summer' },
      { type: 'near_river', value: true },
      { type: 'random', value: 0.03 }
    ],
    effects: [
      { type: 'grain_production', value: -50, target: 'city' },
      { type: 'population_loss', value: -500, target: 'city' },
      { type: 'wood_production', value: -20, target: 'city' }
    ],
    duration: 2
  },
  {
    id: 'plague',
    name: '瘟疫',
    description: '瘟疫爆发导致人口锐减',
    conditions: [
      { type: 'population_density', value: 30000 },
      { type: 'sanitation', value: 30 },
      { type: 'random', value: 0.02 }
    ],
    effects: [
      { type: 'population_loss', value: -2000, target: 'city' },
      { type: 'morale_drop', value: -20, target: 'city' },
      { type: 'production_slow', value: -40, target: 'city' }
    ],
    duration: 4
  },
  {
    id: 'bountiful_harvest',
    name: '丰收',
    description: '风调雨顺，获得大丰收',
    conditions: [
      { type: 'season', value: 'autumn' },
      { type: 'farm_level', value: 3 },
      { type: 'random', value: 0.1 }
    ],
    effects: [
      { type: 'grain_production', value: 50, target: 'city' },
      { type: 'morale_boost', value: 10, target: 'city' }
    ],
    duration: 1
  },
  {
    id: 'gold_mine',
    name: '发现金矿',
    description: '在城池附近发现金矿',
    conditions: [
      { type: 'has_mine', value: true },
      { type: 'random', value: 0.01 }
    ],
    effects: [
      { type: 'gold_production', value: 100, target: 'city' },
      { type: 'population_boost', value: 500, target: 'city' }
    ],
    duration: 10
  },
  {
    id: 'trade_route',
    name: '发现商路',
    description: '发现新的贸易路线',
    conditions: [
      { type: 'has_harbor', value: true },
      { type: 'trade_reputation', value: 50 },
      { type: 'random', value: 0.05 }
    ],
    effects: [
      { type: 'trade_bonus', value: 30, target: 'city' },
      { type: 'gold_production', value: 50, target: 'city' }
    ],
    duration: 8
  },
  {
    id: 'bandits',
    name: '山贼横行',
    description: '山贼劫掠商队和村庄',
    conditions: [
      { type: 'security_low', value: 40 },
      { type: 'random', value: 0.08 }
    ],
    effects: [
      { type: 'trade_disruption', value: -50, target: 'city' },
      { type: 'gold_loss', value: -200, target: 'city' },
      { type: 'morale_drop', value: -5, target: 'city' }
    ],
    duration: 2
  }
];

// 经济事件处理
function processEconomicEvent(
  event: EconomicEvent,
  city: CityEconomy,
  state: GameState
): void {
  for (const effect of event.effects) {
    switch (effect.type) {
      case 'grain_production':
        city.production.grain = Math.floor(
          city.production.grain * (1 + effect.value / 100)
        );
        break;
      case 'gold_production':
        city.production.gold = Math.floor(
          city.production.gold * (1 + effect.value / 100)
        );
        break;
      case 'population_loss':
        city.population = Math.max(0, city.population + effect.value);
        break;
      case 'morale_drop':
        city.morale = Math.max(0, city.morale + effect.value);
        break;
      case 'trade_disruption':
        // 中断贸易路线
        break;
    }
  }
  
  // 记录事件
  state.history.push({
    date: state.currentDate,
    type: 'economic',
    description: `${city.cityId}发生${event.name}：${event.description}`
  });
}
```

## 经济界面

### 经济总览面板

```
┌─────────────────────────────────────────────────────────────┐
│  经济总览 - 蜀汉                                            │
│  ─────────────────────────────────────────────────────────  │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  势力资源池                                          │   │
│  │  🌾 粮食: 125,000  (+2,500/月)                      │   │
│  │  💰 金钱: 45,000   (+800/月)                        │   │
│  │  👥 人口: 850,000  (+1,200/月)                      │   │
│  │  🪵 木材: 32,000   (+450/月)                        │   │
│  │  ⛏️ 铁矿: 18,000   (+320/月)                        │   │
│  │  🧵 布匹: 12,000   (+280/月)                        │   │
│  │  ❤️ 民心: 72/100                                   │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  预算分配: 军事30% 建设35% 外交15% 储备20%           │   │
│  │  [调整预算]                                          │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  城池经济状况                                        │   │
│  │                                                     │   │
│  │  城池      粮食    金钱    状态     预警              │   │
│  │  ──────────────────────────────────────────────     │   │
│  │  成都      +500    +200    繁荣     无               │   │
│  │  汉中      +300    +150    稳定     无               │   │
│  │  新野      -100    +80     衰退     粮食短缺        │   │
│  │  荆州      +400    +300    繁荣     无               │   │
│  │                                                     │   │
│  │  [查看城池详情] [自动调配资源]                        │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  贸易网络                                            │   │
│  │  内部贸易: 3条活跃路线                               │   │
│  │  外部贸易: 2个贸易协定                               │   │
│  │  商人: 5名活跃商人                                   │   │
│  │                                                     │   │
│  │  [管理贸易] [派遣商人] [签订贸易协定]                 │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  近期经济事件                                        │   │
│  │  🌾 成都丰收，粮食产量+50%                          │   │
│  │  ⛏️ 汉中发现铁矿，铁矿产量+100                     │   │
│  │  ⚔️ 新野遭山贼劫掠，贸易中断                        │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### 贸易界面

```
┌─────────────────────────────────────────────────────────────┐
│  贸易管理                                                    │
│  ─────────────────────────────────────────────────────────  │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  内部贸易（资源调配）                                 │   │
│  │                                                     │   │
│  │  起点: [成都 ▼]  终点: [汉中 ▼]                      │   │
│  │  资源: [粮食 ▼]  数量: [1000____]                   │   │
│  │                                                     │   │
│  │  运输成本: 100金                                     │   │
│  │  运输时间: 2回合                                     │   │
│  │                                                     │   │
│  │  [调配资源] [取消]                                   │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  外部贸易（势力间）                                   │   │
│  │                                                     │   │
│  │  贸易伙伴: [东吴 ▼]                                 │   │
│  │  交易资源: [布匹 ▼]                                 │   │
│  │  交易数量: [500____]                                │   │
│  │  交易价格: 15,000金                                 │   │
│  │                                                     │   │
│  │  接受概率: 65%                                      │   │
│  │  关系影响: +5                                       │   │
│  │                                                     │   │
│  │  [提议贸易] [取消]                                   │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  商人列表                                            │   │
│  │                                                     │   │
│  │  👤 张商   成都→汉中   粮食 1000   利润: 2000       │   │
│  │  👤 李商   汉中→荆州   铁矿 500    利润: 1500       │   │
│  │  👤 王商   荆州→东吴   布匹 800    利润: 2400       │   │
│  │                                                     │   │
│  │  [派遣商人] [召回商人]                                │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## 文件结构

```
client/src/components/Economy/
├── EconomyPanel.tsx         # 经济总览面板
├── ResourceBar.tsx          # 资源显示条
├── CityEconomyView.tsx      # 城池经济详情
├── TradePanel.tsx           # 贸易管理
├── BudgetModal.tsx          # 预算调整弹窗
├── data/
│   ├── resources.json       # 资源配置
│   ├── facilities.json      # 设施数据
│   ├── events.json          # 经济事件
│   ├── merchants.json       # 商人数据
│   └── trade_routes.json    # 贸易路线
├── engine/
│   ├── EconomyAI.ts         # 经济AI
│   ├── TradeSystem.ts       # 贸易系统
│   ├── MerchantAI.ts        # 商人AI
│   ├── EventSystem.ts       # 事件系统
│   └── ResourceCalculator.ts # 资源计算
├── ui/
│   ├── ResourceIcon.tsx     # 资源图标
│   ├── ProductionChart.tsx  # 产出图表
│   └── TradeRouteMap.tsx    # 贸易路线图
└── types/
    └── economy.ts           # 经济类型定义
```

## 开发阶段

### Phase 1: 基础资源系统
- 7种资源定义
- 城池产出/消耗计算
- 势力资源池

### Phase 2: 城池经济
- 设施系统
- 经济平衡
- 预警系统

### Phase 3: 贸易系统
- 内部调配
- 外部贸易
- 商人系统

### Phase 4: AI经济管理
- AI决策逻辑
- 预算分配
- 自动调配

### Phase 5: 经济事件
- 随机事件
- 事件效果
- 事件历史

### Phase 6: 界面完善
- 经济总览
- 贸易界面
- 图表展示

## 验证方案

1. **资源系统**: 7种资源正确计算产出/消耗
2. **城池经济**: 设施影响产出，经济平衡正确
3. **贸易系统**: 内部调配正常，外部贸易概率合理
4. **商人系统**: 商人自动贸易，利润计算正确
5. **AI管理**: AI正确决策预算、调配、贸易
6. **经济事件**: 事件触发和效果正确
7. **界面**: 数据显示正确，操作流畅
