# 外交系统 - 设计规划

## 概述

完整的外交系统，支持联盟、联姻、朝贡、宣战/求和、离间、同盟解散。玩家主动发起外交，AI根据势力性格决定是否接受。军事同盟可请求援军协同作战。

## 系统架构

```
┌─────────────────────────────────────────────────────────────┐
│                      外交决策流程                            │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  玩家发起外交请求                                     │    │
│  │         ↓                                            │    │
│  │  计算接受概率                                        │    │
│  │  (关系值 + 性格 + 利益 + 威胁)                       │    │
│  │         ↓                                            │    │
│  │  AI决策: 接受/拒绝/讨价还价                          │    │
│  │         ↓                                            │    │
│  │  执行外交效果                                        │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                      外交关系层                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   势力关系    │  │   联盟状态    │  │   外交记录    │     │
│  │   矩阵       │  │   管理       │  │   日志       │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                      军事同盟层                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  援军请求 | 协同作战 | 同盟义务 | 贡献度 | 解散机制  │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

## 外交关系数据

### 关系矩阵

```typescript
interface DiplomaticRelations {
  // 关系值 -100(死敌) 到 100(亲密)
  matrix: Record<string, Record<string, number>>;
  
  // 外交状态
  statuses: Record<string, Record<string, DiplomaticStatus>>;
  
  // 外交历史
  history: DiplomaticEvent[];
}

type DiplomaticStatus = 
  | 'neutral'      // 中立
  | 'friendly'     // 友好
  | 'allied'       // 同盟
  | 'vassal'       // 附庸
  | 'war'          // 交战
  | 'ceasefire'    // 停战
  | 'hostile';     // 敌对

// 初始化关系矩阵
function initializeRelations(factions: Faction[]): DiplomaticRelations {
  const matrix: Record<string, Record<string, number>> = {};
  const statuses: Record<string, Record<string, DiplomaticStatus>> = {};
  
  for (const f1 of factions) {
    matrix[f1.id] = {};
    statuses[f1.id] = {};
    for (const f2 of factions) {
      if (f1.id !== f2.id) {
        matrix[f1.id][f2.id] = getInitialRelation(f1, f2);
        statuses[f1.id][f2.id] = 'neutral';
      }
    }
  }
  
  return { matrix, statuses, history: [] };
}

// 历史初始关系
function getInitialRelation(f1: Faction, f2: Faction): number {
  // 基于历史关系设定
  const historicalRelations: Record<string, Record<string, number>> = {
    'caocao': { 'liubei': -30, 'sunquan': -40, 'yuan_shao': -60 },
    'liubei': { 'caocao': -30, 'sunquan': 50, 'zhugeliang': 90 },
    'sunquan': { 'caocao': -40, 'liubei': 50, 'zhou_yu': 85 },
    // ... 更多历史关系
  };
  
  return historicalRelations[f1.id]?.[f2.id] || 0;
}
```

### 外交性格

```typescript
interface DiplomaticPersonality {
  factionId: string;
  name: string;
  
  // 外交倾向
  aggression: number;      // 好战程度 0-100
  expansionism: number;    // 扩张欲望 0-100
  trustworthiness: number; // 守信程度 0-100
  pragmatism: number;      // 务实程度 0-100
  
  // 决策偏好
  preferences: {
    alliance_willingness: number;   // 结盟意愿
    tribute_acceptance: number;     // 接受朝贡
    marriage_willingness: number;   // 联姻意愿
    betrayal_threshold: number;     // 背叛阈值
  };
  
  // 特殊规则
  rules: DiplomaticRule[];
}

const FACTION_PERSONALITIES: Record<string, DiplomaticPersonality> = {
  caocao: {
    factionId: 'caocao',
    name: '曹魏',
    aggression: 80,
    expansionism: 85,
    trustworthiness: 40,
    pragmatism: 90,
    preferences: {
      alliance_willingness: 30,
      tribute_acceptance: 70,
      marriage_willingness: 50,
      betrayal_threshold: 60
    },
    rules: [
      { type: 'refuse_alliance_if_stronger', condition: 'target_power > self_power * 1.5' },
      { type: 'always_accept_tribute', condition: 'true' },
      { type: 'betray_if_opportunity', condition: 'target_weakened && self_strong' }
    ]
  },
  
  liubei: {
    factionId: 'liubei',
    name: '蜀汉',
    aggression: 30,
    expansionism: 40,
    trustworthiness: 90,
    pragmatism: 60,
    preferences: {
      alliance_willingness: 80,
      tribute_acceptance: 20,
      marriage_willingness: 70,
      betrayal_threshold: 90
    },
    rules: [
      { type: 'always_help_ally', condition: 'ally_at_war' },
      { type: 'refuse_betrayal', condition: 'true' },
      { type: 'prefer_diplomatic_solution', condition: 'true' }
    ]
  },
  
  sunquan: {
    factionId: 'sunquan',
    name: '东吴',
    aggression: 40,
    expansionism: 50,
    trustworthiness: 70,
    pragmatism: 80,
    preferences: {
      alliance_willingness: 60,
      tribute_acceptance: 50,
      marriage_willingness: 60,
      betrayal_threshold: 70
    },
    rules: [
      { type: 'balance_power', condition: 'true' },
      { type: 'protect_jiangdong', condition: 'threat_to_jiangdong' },
      { type: 'opportunistic_expansion', condition: 'neighbor_weak' }
    ]
  },
  
  yuan_shao: {
    factionId: 'yuan_shao',
    name: '袁绍',
    aggression: 60,
    expansionism: 70,
    trustworthiness: 50,
    pragmatism: 30,
    preferences: {
      alliance_willingness: 40,
      tribute_acceptance: 60,
      marriage_willingness: 50,
      betrayal_threshold: 50
    },
    rules: [
      { type: 'indecisive', condition: 'multiple_options' },
      { type: 'pride_before_fall', condition: 'strong_position' },
      { type: 'distrust_subordinates', condition: 'true' }
    ]
  },
  
  lvbu: {
    factionId: 'lvbu',
    name: '吕布',
    aggression: 90,
    expansionism: 60,
    trustworthiness: 10,
    pragmatism: 20,
    preferences: {
      alliance_willingness: 20,
      tribute_acceptance: 40,
      marriage_willingness: 30,
      betrayal_threshold: 10
    },
    rules: [
      { type: 'betray_for_benefit', condition: 'benefit > loyalty' },
      { type: 'impulsive_decision', condition: 'true' },
      { type: 'fear_no_one', condition: 'true' }
    ]
  }
};
```

## 外交类型详细设计

### 1. 联盟系统

```typescript
interface Alliance {
  id: string;
  name: string;
  members: AllianceMember[];
  
  // 联盟属性
  level: AllianceLevel;
  duration: number;          // 持续回合数
  contribution: Record<string, number>;  // 成员贡献
  
  // 军事协作
  military_pact: boolean;    // 军事同盟
  shared_vision: boolean;    // 共享视野
  
  // 状态
  active: boolean;
  formed_date: GameDate;
}

type AllianceLevel = 
  | 'non_aggression'   // 互不侵犯
  | 'trade'            // 贸易协定
  | 'military'         // 军事同盟
  | 'comprehensive';   // 全面同盟

interface AllianceMember {
  factionId: string;
  join_date: GameDate;
  contribution: number;
  role: 'leader' | 'member';
}

// 联盟接受概率计算
function calculateAllianceAcceptance(
  proposer: Faction,
  target: Faction,
  context: GameContext
): number {
  let acceptance = 50;
  
  // 关系值影响
  const relation = context.relations.matrix[proposer.id][target.id];
  acceptance += relation / 2;
  
  // 性格影响
  const personality = FACTION_PERSONALITIES[target.id];
  acceptance += personality.preferences.alliance_willingness - 50;
  
  // 势力对比影响
  const powerRatio = calculatePowerRatio(proposer, target);
  if (powerRatio > 1.5) {
    // 我方强太多，对方可能拒绝（怕被吞并）
    acceptance -= 20;
  } else if (powerRatio < 0.7) {
    // 我方弱太多，对方可能接受（有利可图）
    acceptance += 15;
  }
  
  // 共同敌人影响
  const commonEnemies = findCommonEnemies(proposer, target, context);
  if (commonEnemies.length > 0) {
    acceptance += commonEnemies.length * 10;
  }
  
  // 当前战争影响
  if (context.relations.statuses[proposer.id][target.id] === 'war') {
    acceptance -= 80;  // 正在打仗，很难结盟
  }
  
  return Math.min(95, Math.max(5, acceptance));
}

// 联盟效果
function applyAllianceEffects(alliance: Alliance, state: GameState): void {
  for (const member of alliance.members) {
    for (const other of alliance.members) {
      if (member.factionId !== other.factionId) {
        // 提升关系
        state.relations.matrix[member.factionId][other.factionId] += 20;
        
        // 设置状态
        state.relations.statuses[member.factionId][other.factionId] = 'allied';
        
        // 共享视野
        if (alliance.shared_vision) {
          shareVision(member.factionId, other.factionId, state);
        }
      }
    }
  }
}
```

### 2. 军事同盟详细

```typescript
interface MilitaryAlliance extends Alliance {
  // 军事协作规则
  military_pact: true;
  
  // 援军系统
  reinforcement: {
    max_troops: number;      // 最大援军数量
    response_time: number;   // 响应时间（回合）
    cost_per_troop: number;  // 每兵成本
  };
  
  // 协同作战
  coordination: {
    joint_battle: boolean;   // 可联合进攻
    defensive_pact: boolean; // 防御条约（被攻击时盟友必须支援）
    war_declaration: boolean; // 宣战需盟友同意
  };
  
  // 贡献度
  contribution_rules: {
    battle_participation: number;  // 参战贡献
    resource_sharing: number;      // 资源援助贡献
    territory_concession: number;  // 领土让步贡献
  };
}

// 请求援军
interface ReinforcementRequest {
  requester: string;        // 请求方
  ally: string;             // 援助方
  target_city: string;      // 目标城池
  troops_requested: number; // 请求兵力
  duration: number;         // 援助持续时间
  cost: ResourceCost;       // 费用
}

// 援军响应计算
function calculateReinforcementResponse(
  ally: Faction,
  request: ReinforcementRequest,
  context: GameContext
): ReinforcementDecision {
  const personality = FACTION_PERSONALITIES[ally.id];
  
  // 检查是否愿意
  if (!checkAllianceObligation(ally.id, request.requester, context)) {
    return { accept: false, reason: '无防御条约义务' };
  }
  
  // 检查自身情况
  if (ally.cities.length < 3) {
    return { accept: false, reason: '自身实力不足' };
  }
  
  // 计算可派遣兵力
  const availableTroops = calculateAvailableTroops(ally);
  const requestedTroops = Math.min(request.troops_requested, availableTroops);
  
  // 检查费用
  if (context.player.resources.gold < requestedTroops * 10) {
    return { accept: false, reason: '援助方资金不足' };
  }
  
  return {
    accept: true,
    troops_provided: requestedTroops,
    arrival_turn: context.currentTurn + personality.pragmatism / 20,
    conditions: [
      '援助期间粮草由请求方承担',
      '战后领土分配需协商'
    ]
  };
}

// 协同作战
interface JointOperation {
  id: string;
  participants: string[];    // 参与势力
  target: string;           // 目标
  plan: OperationPlan;
  status: 'planning' | 'executing' | 'completed' | 'failed';
}

function coordinateJointAttack(
  participants: string[],
  target: Faction,
  context: GameContext
): JointOperation {
  // 确定主攻方（兵力最多）
  const mainAttacker = participants.reduce((a, b) => {
    return getFactionPower(a, context) > getFactionPower(b, context) ? a : b;
  });
  
  // 确定助攻方
  const supporters = participants.filter(p => p !== mainAttacker);
  
  // 制定作战计划
  const plan: OperationPlan = {
    main_attack: {
      faction: mainAttacker,
      direction: determineBestDirection(mainAttacker, target, context),
      timing: context.currentTurn + 1
    },
    support_attacks: supporters.map(supporter => ({
      faction: supporter,
      direction: determineSupportDirection(supporter, target, context),
      timing: context.currentTurn + 2  // 晚一回合，形成夹击
    })),
    coordination_points: findCoordinationPoints(participants, target, context)
  };
  
  return {
    id: generateId(),
    participants,
    target: target.id,
    plan,
    status: 'planning'
  };
}
```

### 3. 联姻系统

```typescript
interface MarriageProposal {
  proposer: Faction;
  target: Faction;
  
  // 联姻人选
  proposer_hero: Hero;
  target_hero: Hero;
  
  // 条件
  conditions: MarriageCondition[];
  
  // 效果
  effects: MarriageEffect[];
}

interface MarriageCondition {
  type: 'relation_above' | 'same_culture' | 'hero_available' | 'power_balance';
  value: number;
  met: boolean;
}

interface MarriageEffect {
  type: 'relation_boost' | 'stat_boost' | 'alliance_formed' | 'special_bonus';
  value: number;
  duration?: number;
}

// 联姻接受概率
function calculateMarriageAcceptance(
  proposer: Faction,
  target: Faction,
  context: GameContext
): number {
  let acceptance = 40;
  
  // 关系值影响
  const relation = context.relations.matrix[proposer.id][target.id];
  acceptance += relation / 3;
  
  // 性格影响
  const personality = FACTION_PERSONALITIES[target.id];
  acceptance += personality.preferences.marriage_willingness - 50;
  
  // 势力平衡影响
  const powerRatio = calculatePowerRatio(proposer, target);
  if (powerRatio > 0.8 && powerRatio < 1.2) {
    acceptance += 20;  // 势力相当，更愿意
  }
  
  // 已有联姻影响
  const existingMarriage = findExistingMarriage(proposer.id, target.id, context);
  if (existingMarriage) {
    acceptance -= 30;  // 已有联姻，不愿再嫁
  }
  
  // 英雄可用性
  if (!hasAvailableHero(target, context)) {
    return 5;  // 没有适婚英雄
  }
  
  return Math.min(90, Math.max(5, acceptance));
}

// 联姻效果
function applyMarriageEffects(marriage: MarriageProposal, state: GameState): void {
  // 关系大幅提升
  state.relations.matrix[marriage.proposer.id][marriage.target.id] += 40;
  state.relations.matrix[marriage.target.id][marriage.proposer.id] += 40;
  
  // 自动形成友好关系
  state.relations.statuses[marriage.proposer.id][marriage.target.id] = 'friendly';
  state.relations.statuses[marriage.target.id][marriage.proposer.id] = 'friendly';
  
  // 武将加入
  if (marriage.proposer_hero.factionId !== marriage.proposer.id) {
    transferHero(marriage.proposer_hero, marriage.proposer.id, state);
  }
  
  // 特殊加成
  applyMarriageBonus(marriage, state);
}
```

### 4. 朝贡系统

```typescript
interface TributeAgreement {
  vassal: string;          // 朝贡方
  overlord: string;        // 宗主方
  
  // 朝贡内容
  tribute: {
    gold_per_turn: number;
    grain_per_turn: number;
    troops_per_turn: number;
  };
  
  // 保护义务
  protection: {
    defend_vassal: boolean;    // 防御义务
    dont_attack: boolean;      // 不攻击义务
    military_support: boolean; // 军事支援
  };
  
  // 持续时间
  duration: number;
  current_turn: number;
}

// 朝贡接受概率
function calculateTributeAcceptance(
  vassal: Faction,
  overlord: Faction,
  context: GameContext
): number {
  let acceptance = 30;
  
  // 势力差距影响（弱方向强方朝贡更可能被接受）
  const powerRatio = calculatePowerRatio(vassal, overlord);
  if (powerRatio < 0.5) {
    acceptance += 30;  // 弱很多，对方愿意接受
  } else if (powerRatio > 1) {
    return 5;  // 比对方强，对方不会接受
  }
  
  // 关系值影响
  const relation = context.relations.matrix[vassal.id][overlord.id];
  acceptance += relation / 3;
  
  // 性格影响
  const personality = FACTION_PERSONALITIES[overlord.id];
  acceptance += personality.preferences.tribute_acceptance - 50;
  
  // 地理位置影响（相邻更容易接受）
  if (areNeighbors(vassal, overlord, context)) {
    acceptance += 15;
  }
  
  return Math.min(85, Math.max(5, acceptance));
}

// 朝贡效果
function applyTributeEffects(agreement: TributeAgreement, state: GameState): void {
  // 每回合收取朝贡
  const vassal = state.factions.find(f => f.id === agreement.vassal);
  const overlord = state.factions.find(f => f.id === agreement.overlord);
  
  if (vassal && overlord) {
    // 扣除朝贡方资源
    vassal.resources.gold -= agreement.tribute.gold_per_turn;
    vassal.resources.grain -= agreement.tribute.grain_per_turn;
    
    // 增加宗主方资源
    overlord.resources.gold += agreement.tribute.gold_per_turn;
    overlord.resources.grain += agreement.tribute.grain_per_turn;
    
    // 提升关系
    state.relations.matrix[agreement.vassal][agreement.overlord] += 5;
    
    // 设置附庸状态
    state.relations.statuses[agreement.vassal][agreement.overlord] = 'vassal';
  }
}
```

### 5. 宣战/求和系统

```typescript
interface WarDeclaration {
  declarer: string;        // 宣战方
  target: string;          // 被宣战方
  reason: WarReason;
  
  // 盟友义务
  allies_called: string[]; // 被召集的盟友
  
  // 战争目标
  war_goals: WarGoal[];
}

type WarReason = 
  | 'territorial'      // 领土争端
  | 'revenge'          // 复仇
  | 'ideological'      // 意识形态
  | 'opportunistic'    // 机会主义
  | 'defensive';       // 防御性

interface WarGoal {
  type: 'capture_city' | 'destroy_army' | 'humiliate' | 'vassalize';
  target: string;
  priority: 'high' | 'medium' | 'low';
}

// 宣战接受概率（被宣战方盟友是否参战）
function calculateAllyJoinWarProbability(
  ally: Faction,
  defender: Faction,
  context: GameContext
): number {
  let probability = 50;
  
  // 关系值影响
  const relation = context.relations.matrix[ally.id][defender.id];
  probability += relation / 3;
  
  // 性格影响
  const personality = FACTION_PERSONALITIES[ally.id];
  probability -= personality.aggression / 5;  // 好战的更可能参战
  
  // 自身情况影响
  if (ally.cities.length < 3) {
    probability -= 30;  // 自身弱，不愿参战
  }
  
  // 共同敌人影响
  const commonEnemies = findCommonEnemies(ally, context.declarer, context);
  if (commonEnemies.length > 0) {
    probability += 20;
  }
  
  // 防御条约影响
  if (hasDefensivePact(ally.id, defender.id, context)) {
    probability += 40;  // 有防御条约，必须参战
  }
  
  return Math.min(90, Math.max(10, probability));
}

// 求和系统
interface PeaceNegotiation {
  initiator: string;      // 发起方
  target: string;         // 对方
  
  // 求和条件
  conditions: PeaceCondition[];
  
  // 接受概率
  acceptance_probability: number;
}

interface PeaceCondition {
  type: 'ceasefire' | 'territory' | 'tribute' | 'hostage' | 'prisoner';
  value: any;
  acceptable: boolean;
}

// 求和接受概率
function calculatePeaceAcceptance(
  peacemaker: Faction,
  belligerent: Faction,
  context: GameContext
): number {
  let acceptance = 30;
  
  // 战况影响
  const warStatus = getWarStatus(peacemaker.id, belligerent.id, context);
  if (warStatus.defender_winning) {
    acceptance += 30;  // 我方占优势，可能接受
  } else if (warStatus.attacker_winning) {
    acceptance -= 20;  // 对方占优势，不愿和谈
  }
  
  // 持续时间影响
  if (warStatus.duration > 10) {
    acceptance += 20;  // 战争太久，想结束
  }
  
  // 损失影响
  if (warStatus.losses > 30) {
    acceptance += 25;  // 损失惨重，想停战
  }
  
  // 性格影响
  const personality = FACTION_PERSONALITIES[belligerent.id];
  acceptance += personality.pragmatism - 50;
  
  return Math.min(85, max(10, acceptance));
}
```

### 6. 离间系统

```typescript
interface EspionageOperation {
  type: 'sow_dissent' | 'bribe_hero' | 'spread_rumors' | 'assassinate';
  agent: string;          // 执行武将
  target_faction: string;
  target_hero?: string;
  
  // 成功率
  success_rate: number;
  
  // 效果
  effects: EspionageEffect[];
}

// 策反武将
function calculateBribeHeroSuccess(
  agent: Hero,
  target: Hero,
  context: GameContext
): number {
  let successRate = 20;
  
  // 探子智力影响
  successRate += agent.stats.intellect / 5;
  
  // 目标忠诚度影响
  successRate -= target.loyalty / 5;
  
  // 目标性格影响
  const personality = FACTION_PERSONALITIES[target.factionId];
  successRate += (100 - personality.trustworthiness) / 5;
  
  // 关系影响
  const relation = agent.relationships[target.id];
  if (relation && relation.value > 50) {
    successRate += 15;  // 有交情更容易策反
  }
  
  // 资金影响
  if (context.player.resources.gold > 5000) {
    successRate += 10;  // 重金收买
  }
  
  return Math.min(70, Math.max(5, successRate));
}

// 制造内乱
function calculateSowDissentSuccess(
  agent: Hero,
  target_faction: Faction,
  context: GameContext
): number {
  let successRate = 15;
  
  // 探子智力影响
  successRate += agent.stats.intellect / 6;
  
  // 目标势力不稳定度影响
  const instability = calculateFactionInstability(target_faction, context);
  successRate += instability / 5;
  
  // 目标势力内部矛盾影响
  const internalConflict = calculateInternalConflict(target_faction, context);
  successRate += internalConflict / 8;
  
  return Math.min(60, Math.max(5, successRate));
}

// 离间效果
function applyEspionageEffects(
  operation: EspionageOperation,
  state: GameState
): EspionageResult {
  switch (operation.type) {
    case 'bribe_hero':
      const target = state.heroes.find(h => h.id === operation.target_hero);
      if (target) {
        target.loyalty -= 30;
        if (target.loyalty < 20) {
          // 忠诚度过低，触发叛逃
          triggerDefection(target, state);
          return { success: true, message: `${target.name}被成功策反！` };
        }
        return { success: true, message: `${target.name}忠诚度下降` };
      }
      break;
      
    case 'sow_dissent':
      const faction = state.factions.find(f => f.id === operation.target_faction);
      if (faction) {
        // 降低所有武将忠诚度
        for (const heroId of faction.heroes) {
          const hero = state.heroes.find(h => h.id === heroId);
          if (hero) {
            hero.loyalty -= 15;
          }
        }
        return { success: true, message: `${faction.name}内部出现不稳定` };
      }
      break;
      
    case 'spread_rumors':
      // 降低目标势力与其他势力的关系
      for (const otherFaction of state.factions) {
        if (otherFaction.id !== operation.target_faction) {
          state.relations.matrix[operation.target_faction][otherFaction.id] -= 10;
        }
      }
      return { success: true, message: '谣言成功散播' };
  }
  
  return { success: false, message: '行动失败' };
}
```

### 7. 同盟解散

```typescript
interface AllianceDissolution {
  alliance_id: string;
  initiator: string;
  reason: DissolutionReason;
  
  // 后果
  consequences: DissolutionConsequence[];
}

type DissolutionReason = 
  | 'betrayal'         // 背叛
  | 'expired'          // 到期
  | 'conflict'         // 利益冲突
  | 'weakness'         // 对方变弱
  | 'opportunity';     // 机会主义

// 背叛触发条件
function checkBetrayalConditions(
  faction: Faction,
  alliance: Alliance,
  context: GameContext
): boolean {
  const personality = FACTION_PERSONALITIES[faction.id];
  
  // 性格背叛阈值
  if (personality.preferences.betrayal_threshold > 70) {
    return false;  // 忠诚度高的势力不会轻易背叛
  }
  
  // 检查背叛条件
  const conditions = [
    // 对方变弱
    () => {
      const ally = alliance.members.find(m => m.factionId !== faction.id);
      return ally && getFactionPower(ally.factionId, context) < 
             getFactionPower(faction.id, context) * 0.5;
    },
    
    // 有更好选择
    () => {
      const betterAlly = findBetterAlly(faction, context);
      return betterAlly && getRelationValue(faction.id, betterAlly.id, context) > 
             getRelationValue(faction.id, alliance.members[0].factionId, context) + 30;
    },
    
    // 战争机会
    () => {
      const weakNeighbor = findWeakNeighbor(faction, context);
      return weakNeighbor && !alliance.members.some(m => m.factionId === weakNeighbor.id);
    },
    
    // 利益足够大
    () => {
      const benefit = calculateBetrayalBenefit(faction, alliance, context);
      return benefit > personality.preferences.betrayal_threshold * 100;
    }
  ];
  
  // 随机触发（好战的更可能背叛）
  const betrayalChance = (100 - personality.trustworthiness) / 100;
  if (Math.random() < betrayalChance) {
    for (const condition of conditions) {
      if (condition()) {
        return true;
      }
    }
  }
  
  return false;
}

// 背叛后果
function applyBetrayalConsequences(
  betrayer: Faction,
  victim: Faction,
  alliance: Alliance,
  state: GameState
): void {
  // 1. 关系急剧恶化
  state.relations.matrix[betrayer.id][victim.id] -= 80;
  state.relations.matrix[victim.id][betrayer.id] -= 80;
  state.relations.statuses[betrayer.id][victim.id] = 'hostile';
  
  // 2. 其他势力对背叛者的信任下降
  for (const faction of state.factions) {
    if (faction.id !== betrayer.id && faction.id !== victim.id) {
      state.relations.matrix[faction.id][betrayer.id] -= 20;
    }
  }
  
  // 3. 背叛者获得短期利益
  betrayer.resources.gold += 5000;
  betrayer.resources.grain += 3000;
  
  // 4. 触发复仇事件
  state.activeEvents.push({
    type: 'revenge',
    description: `${victim.name}誓言报复${betrayer.name}的背叛`,
    effects: {
      victim_attack_bonus: 20,
      victim_morale_bonus: 30,
      betrayer_debuff: {
        loyalty_drop: 15,
        reputation_drop: 30
      }
    }
  });
  
  // 5. 联盟解散
  dissolveAlliance(alliance, state);
}
```

## 外交界面

### 外交总览面板

```
┌─────────────────────────────────────────────────────────────┐
│  外交总览                                                    │
│  ─────────────────────────────────────────────────────────  │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  势力关系                                            │   │
│  │                                                     │   │
│  │         曹魏    蜀汉    东吴    袁绍    吕布         │   │
│  │  曹魏     -     -30     -40     -60     -20         │   │
│  │  蜀汉    -30      -      50      10     -10         │   │
│  │  东吴    -40      50      -      20      15         │   │
│  │  袁绍    -60      10      20      -      -5         │   │
│  │  吕布    -20     -10      15     -5       -         │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  当前同盟                                            │   │
│  │  🤝 蜀吴联盟 (军事同盟) - 建安十三年                  │   │
│  │     成员: 蜀汉、东吴                                  │   │
│  │     持续: 5回合                                      │   │
│  │     [查看详情] [解散同盟]                             │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  进行中的战争                                        │   │
│  │  ⚔️ 官渡之战                                        │   │
│  │     参战: 曹魏 vs 袁绍                               │   │
│  │     持续: 3回合                                      │   │
│  │     战况: 曹魏占优                                   │   │
│  │     [求和] [查看战报]                                │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  [🤝 提议联盟] [💍 提议联姻] [💰 请求朝贡]          │   │
│  │  [⚔️ 宣战] [🕊️ 求和] [🕵️ 派遣间谍]                 │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### 外交提议界面

```
┌─────────────────────────────────────────────────────────────┐
│  提议联盟 - 选择目标势力                                     │
│  ─────────────────────────────────────────────────────────  │
│                                                             │
│  目标势力: [蜀汉 ▼]                                         │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  联盟类型:                                           │   │
│  │  ○ 互不侵犯                                         │   │
│  │  ● 军事同盟 (Recommended)                           │   │
│  │  ○ 全面同盟                                         │   │
│  │                                                     │   │
│  │  预计接受概率: 75%                                   │   │
│  │                                                     │   │
│  │  我方条件:                                           │   │
│  │  ☑ 提供粮食 5000                                    │   │
│  │  ☑ 共享军事视野                                     │   │
│  │  ☐ 联合进攻 (需要额外条件)                          │   │
│  │                                                     │   │
│  │  对方义务:                                           │   │
│  │  • 被攻击时提供援军                                 │   │
│  │  • 不得与我方敌人结盟                               │   │
│  │  • 协同作战时共同分担费用                           │   │
│  │                                                     │   │
│  │  [提议联盟] [取消]                                  │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### 援军请求界面

```
┌─────────────────────────────────────────────────────────────┐
│  请求援军 - 蜀汉                                            │
│  ─────────────────────────────────────────────────────────  │
│                                                             │
│  ⚠️ 你正在与曹魏交战，请求蜀汉援助                         │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  盟友情况:                                           │   │
│  │  蜀汉: 关系 50, 兵力 80000, 愿意援助概率 65%          │   │
│  │                                                     │   │
│  │  请求内容:                                           │   │
│  │  兵力: [10000 ▼]                                    │   │
│  │  持续: [3回合 ▼]                                    │   │
│  │                                                     │   │
│  │  你需支付:                                           │   │
│  │  💰 金钱: 10000                                     │   │
│  │  🌾 粮食: 5000                                      │   │
│  │                                                     │   │
│  │  盟友条件:                                           │   │
│  │  • 援军粮草由你承担                                 │   │
│  │  • 战后领土分配需协商                               │   │
│  │  • 援军将领保留指挥权                               │   │
│  │                                                     │   │
│  │  [发送请求] [取消]                                  │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## 文件结构

```
client/src/components/Diplomacy/
├── DiplomacyPanel.tsx        # 外交总览面板
├── AllianceView.tsx          # 联盟详情
├── WarStatus.tsx             # 战争状态
├── ProposalModal.tsx         # 外交提议弹窗
├── PeaceNegotiation.tsx      # 和谈界面
├── EspionagePanel.tsx        # 间谍行动
├── data/
│   ├── personalities.json    # 外交性格
│   ├── alliance_rules.json   # 联盟规则
│   ├── marriage_events.json  # 联姻事件
│   └── war_reasons.json      # 战争理由
├── engine/
│   ├── DiplomacyAI.ts        # 外交AI
│   ├── AllianceManager.ts    # 联盟管理
│   ├── WarManager.ts         # 战争管理
│   ├── EspionageSystem.ts    # 间谍系统
│   └── PeaceNegotiator.ts    # 和谈系统
├── ui/
│   ├── RelationMatrix.tsx    # 关系矩阵
│   ├── DiplomaticAction.tsx  # 外交行动按钮
│   └── TreatyDocument.tsx    # 条约文书
└── types/
    └── diplomacy.ts          # 外交类型定义
```

## 开发阶段

### Phase 1: 基础外交
- 势力关系矩阵
- 外交状态管理
- 关系变化历史

### Phase 2: 联盟系统
- 联盟创建/解散
- 军事同盟
- 援军系统

### Phase 3: 其他外交形式
- 联姻系统
- 朝贡系统
- 宣战/求和

### Phase 4: 间谍系统
- 策反武将
- 制造内乱
- 散布谣言

### Phase 5: AI外交决策
- 外交性格
- 决策逻辑
- 背叛机制

### Phase 6: 界面完善
- 外交总览
- 各外交界面
- 条约展示

## 验证方案

1. **关系系统**: 关系值正确影响外交决策
2. **联盟系统**: 创建/解散正常，援军可请求
3. **联姻系统**: 联姻效果正确
4. **朝贡系统**: 资源流动正确
5. **宣战/求和**: 战争状态正确切换
6. **间谍系统**: 策反/内乱概率合理
7. **AI决策**: 符合势力性格
8. **背叛机制**: 条件满足时触发背叛
