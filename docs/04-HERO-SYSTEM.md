# 武将系统 - 设计规划

## 概述

200+武将的海量数据库，武将成长完全由AI根据剧情驱动，玩家通过剧情选择间接影响武将。武将可战死/病死，增加历史沉浸感。

## 系统架构

```
┌─────────────────────────────────────────────────────────────┐
│                      AI 剧情引擎                            │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  系统提示词 = 武将数据 + 当前状态 + 玩家选择          │    │
│  │                     ↓                                │    │
│  │  AI 输出 = 武将行为 + 属性变化 + 关系变化 + 事件      │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                      武将数据层                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   200+武将    │  │   关系网络    │  │   成长日志    │     │
│  │   基础数据    │  │   动态变化    │  │   AI驱动     │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                      剧情表现层                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  武将对话 | 武将行动 | 武将成长 | 武将关系 | 武将死亡  │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

## 武将数据结构

### 核心属性

```typescript
interface Hero {
  // 基础信息
  id: string;
  name: string;
  courtesy_name?: string;    // 字
  birth_year: number;
  death_year?: number;       // 可能战死/病死
  birthplace: string;
  
  // 势力归属
  factionId?: string;
  loyalty: number;           // 忠诚度 0-100
  
  // 五维属性（1-100）
  stats: HeroStats;
  
  // 特性/性格
  traits: HeroTrait[];
  personality: PersonalityType;
  
  // 关系网络
  relationships: Record<string, Relationship>;
  
  // 技能
  skills: HeroSkill[];
  
  // 状态
  status: HeroStatus;
  alive: boolean;
  
  // AI相关
  ai_profile: AIProfile;
  
  // 成长记录
  growthLog: GrowthEvent[];
  
  // 外观
  appearance: HeroAppearance;
}

interface HeroStats {
  command: number;      // 统率 - 带兵能力
  strength: number;     // 武力 - 个人战斗力
  intellect: number;    // 智力 - 计谋/内政
  politics: number;     // 政治 - 治理能力
  charisma: number;     // 魅力 - 招揽/士气
}

type HeroStatus = 
  | 'idle'           // 空闲
  | 'governing'      // 治理城池
  | 'leading'        // 率军在外
  | 'training'       // 训练中
  | 'injured'        // 受伤
  | 'imprisoned'     // 被俘
  | 'defecting'      // 正在叛逃
  | 'dead';          // 已死亡
```

### 性格系统

```typescript
type PersonalityType = 
  | 'loyal'      // 忠义 - 难以被策反，对主君忠诚
  | 'ambitious'  // 野心 - 可能背叛，但能力出众
  | 'scholarly'  // 文雅 - 内政优秀，不擅战斗
  | 'brave'      // 勇猛 - 战斗力强，但可能冲动
  | 'cautious'   // 谨慎 - 稳定但缺乏创新
  | 'cunning'    // 狡诈 - 擅长谋略，但可能背刺
  | 'benevolent' // 仁德 - 深受爱戴，但可能优柔
  | 'cruel'      // 残暴 - 治理严厉，但有效
  | 'free'       // 自由 - 难以控制，可能自立
  | 'loyal_to_self'; // 忠于自己 - 只为自己而战

// 性格影响AI决策
const PERSONALITY_EFFECTS: Record<PersonalityType, {
  loyalty_modifier: number;    // 忠诚度变化速度
  betray_threshold: number;    // 叛变阈值
  govern_bonus: number;        // 治理加成
  fight_bonus: number;         // 战斗加成
  recruit_difficulty: number;  // 招募难度
}> = {
  loyal: { loyalty_modifier: 1.2, betray_threshold: 90, govern_bonus: 1.1, fight_bonus: 1.0, recruit_difficulty: 1.5 },
  ambitious: { loyalty_modifier: 0.8, betray_threshold: 50, govern_bonus: 1.2, fight_bonus: 1.1, recruit_difficulty: 0.8 },
  scholarly: { loyalty_modifier: 1.0, betray_threshold: 70, govern_bonus: 1.5, fight_bonus: 0.7, recruit_difficulty: 1.2 },
  brave: { loyalty_modifier: 1.1, betray_threshold: 80, govern_bonus: 0.9, fight_bonus: 1.4, recruit_difficulty: 1.0 },
  cautious: { loyalty_modifier: 1.0, betray_threshold: 60, govern_bonus: 1.2, fight_bonus: 0.9, recruit_difficulty: 1.1 },
  cunning: { loyalty_modifier: 0.7, betray_threshold: 40, govern_bonus: 1.1, fight_bonus: 1.0, recruit_difficulty: 0.7 },
  benevolent: { loyalty_modifier: 1.3, betray_threshold: 85, govern_bonus: 1.3, fight_bonus: 0.8, recruit_difficulty: 1.4 },
  cruel: { loyalty_modifier: 0.9, betray_threshold: 55, govern_bonus: 1.0, fight_bonus: 1.2, recruit_difficulty: 0.9 },
  free: { loyalty_modifier: 0.6, betray_threshold: 30, govern_bonus: 0.8, fight_bonus: 1.1, recruit_difficulty: 0.6 },
  loyal_to_self: { loyalty_modifier: 0.5, betray_threshold: 20, govern_bonus: 1.0, fight_bonus: 1.3, recruit_difficulty: 0.5 }
};
```

### 特性系统

```typescript
interface HeroTrait {
  id: string;
  name: string;
  description: string;
  effects: TraitEffect[];
  icon: string;
}

const HERO_TRAITS: Record<string, HeroTrait> = {
  // 战斗特性
  vanguard: { id: 'vanguard', name: '先锋', description: '战斗开始时先手攻击', effects: [{ type: 'speed', value: 20 }], icon: '⚔️' },
  shield_bearer: { id: 'shield_bearer', name: '肉盾', description: '防御+20%，可保护相邻友军', effects: [{ type: 'defense', value: 20 }], icon: '🛡️' },
  assassin: { id: 'assassin', name: '刺客', description: '对敌将伤害+50%', effects: [{ type: 'hero_damage', value: 50 }], icon: '🗡️' },
  cavalry_master: { id: 'cavalry_master', name: '骑兵统领', description: '骑兵部队攻击+30%', effects: [{ type: 'cavalry_attack', value: 30 }], icon: '🐴' },
  archer_master: { id: 'archer_master', name: '弓术大师', description: '弓兵部队攻击+30%', effects: [{ type: 'archer_attack', value: 30 }], icon: '🏹' },
  
  // 内政特性
  administrator: { id: 'administrator', name: '能吏', description: '治理城池时产出+25%', effects: [{ type: 'govern_output', value: 25 }], icon: '📜' },
  merchant: { id: 'merchant', name: '商才', description: '金钱收入+30%', effects: [{ type: 'gold_income', value: 30 }], icon: '💰' },
  farmer: { id: 'farmer', name: '农官', description: '粮食产出+30%', effects: [{ type: 'grain_income', value: 30 }], icon: '🌾' },
  engineer: { id: 'engineer', name: '工师', description: '建筑建造速度+40%', effects: [{ type: 'build_speed', value: 40 }], icon: '🏗️' },
  
  // 特殊特性
  handsome: { id: 'handsome', name: '美髯公', description: '魅力+15，女性角色好感+20', effects: [{ type: 'charisma', value: 15 }], icon: '😎' },
  eloquent: { id: 'eloquent', name: '辩才', description: '外交成功率+25%', effects: [{ type: 'diplomacy', value: 25 }], icon: '🗣️' },
  mysterious: { id: 'mysterious', name: '神秘', description: '智力+10，忠诚度变化减半', effects: [{ type: 'intellect', value: 10 }], icon: '🔮' },
  tyrant: { id: 'tyrant', name: '暴虐', description: '治理效率+20%，但百姓不满+15', effects: [{ type: 'govern_efficiency', value: 20 }], icon: '😡' },
  humble: { id: 'humble', name: '谦逊', description: '忠诚度+10，但攻击力-5', effects: [{ type: 'loyalty', value: 10 }], icon: '🙏' },
  
  // 生存特性
  lucky: { id: 'lucky', name: '天命', description: '战死概率-50%', effects: [{ type: 'death_resist', value: 50 }], icon: '🌟' },
  iron_body: { id: 'iron_body', name: '铁骨', description: '受伤恢复速度+30%', effects: [{ type: 'recovery', value: 30 }], icon: '💪' },
  sickly: { id: 'sickly', name: '多病', description: '病死概率+30%', effects: [{ type: 'sick_death', value: 30 }], icon: '🤒' }
};
```

## 武将关系网络

### 关系类型

```typescript
interface Relationship {
  targetId: string;          // 对方武将ID
  type: RelationType;
  value: number;             // 关系值 -100到100
  history: RelationEvent[];  // 关系变化历史
}

type RelationType = 
  | 'blood_brother'    // 结义兄弟
  | 'family'           // 家族关系
  | 'master_student'   // 师徒
  | 'lord_vassal'      // 君臣
  | 'rival'            // 宿敌
  | 'friend'           // 友人
  | 'lover'            // 恋人
  | 'colleague'        // 同僚
  | 'stranger'         // 陌生人
  | 'enemy';           // 敌人

// 预设关系（历史关系）
const HISTORICAL_RELATIONSHIPS: Relationship[] = [
  // 桃园三结义
  { targetId: 'liubei', type: 'blood_brother', value: 100, source: 'guanyu' },
  { targetId: 'zhangfei', type: 'blood_brother', value: 100, source: 'guanyu' },
  { targetId: 'guanyu', type: 'blood_brother', value: 100, source: 'liubei' },
  { targetId: 'zhangfei', type: 'blood_brother', value: 100, source: 'liubei' },
  
  // 曹操阵营
  { targetId: 'caocao', type: 'lord_vassal', value: 85, source: 'xiahouyuan' },
  { targetId: 'caocao', type: 'lord_vassal', value: 80, source: 'xiahouDun' },
  { targetId: 'caocao', type: 'lord_vassal', value: 75, source: 'xuchu' },
  
  // 诸葛亮与刘备
  { targetId: 'liubei', type: 'lord_vassal', value: 95, source: 'zhugeliang' },
  { targetId: 'zhugeliang', type: 'master_student', value: 90, source: 'pangtong' },
  
  // 宿敌
  { targetId: 'guanyu', type: 'rival', value: -80, source: 'lvbu' },
  { targetId: 'lvbu', type: 'rival', value: -80, source: 'guanyu' },
  
  // 家族
  { targetId: 'caopiyi', type: 'family', value: 90, source: 'caocao' },
  { targetId: 'sunquan', type: 'family', value: 85, source: 'sunce' }
];
```

### 关系影响

```typescript
// 关系值影响
function getRelationshipEffects(relations: Relationship[]): {
  loyaltyModifier: number;
  combatBonus: number;
  betrayalRisk: number;
  recruitDifficulty: number;
} {
  let loyaltyModifier = 1.0;
  let combatBonus = 1.0;
  let betrayalRisk = 0;
  let recruitDifficulty = 1.0;
  
  for (const rel of relations) {
    switch (rel.type) {
      case 'blood_brother':
        loyaltyModifier += rel.value / 200;
        combatBonus += rel.value / 300;
        break;
      case 'rival':
        betrayalRisk += Math.abs(rel.value) / 200;
        recruitDifficulty -= rel.value / 300;
        break;
      case 'lord_vassal':
        loyaltyModifier += rel.value / 150;
        break;
    }
  }
  
  return { loyaltyModifier, combatBonus, betrayalRisk, recruitDifficulty };
}
```

## AI驱动成长系统

### 成长触发条件

```typescript
interface GrowthTrigger {
  type: 'battle' | 'govern' | 'event' | 'time' | 'relationship';
  conditions: GrowthCondition[];
  effects: GrowthEffect[];
}

interface GrowthCondition {
  type: string;
  value: number;
  comparison: 'gt' | 'lt' | 'eq';
}

interface GrowthEffect {
  stat?: keyof HeroStats;
  value?: number;
  trait?: string;
  skill?: string;
  relationship?: { targetId: string; value: number };
}

// 成长事件示例
const GROWTH_EVENTS: GrowthTrigger[] = [
  // 战斗成长
  {
    type: 'battle',
    conditions: [{ type: 'battles_won', value: 10, comparison: 'gt' }],
    effects: [
      { stat: 'strength', value: 3 },
      { trait: 'vanguard' }
    ]
  },
  
  // 治理成长
  {
    type: 'govern',
    conditions: [{ type: 'govern_years', value: 5, comparison: 'gt' }],
    effects: [
      { stat: 'politics', value: 5 },
      { trait: 'administrator' }
    ]
  },
  
  // 关系成长
  {
    type: 'relationship',
    conditions: [{ type: 'same_faction_years', value: 10, comparison: 'gt' }],
    effects: [
      { relationship: { targetId: 'lord', value: 20 } }
    ]
  },
  
  // 特殊事件成长
  {
    type: 'event',
    conditions: [{ type: 'saved_lord', value: 1, comparison: 'eq' }],
    effects: [
      { stat: 'loyalty', value: 30 },
      { trait: 'loyal' }
    ]
  }
];
```

### AI成长决策

```typescript
class HeroGrowthAI {
  // AI决定武将成长方向
  decideGrowth(hero: Hero, context: GameContext): GrowthDecision {
    // 1. 分析当前状态
    const analysis = this.analyzeHero(hero, context);
    
    // 2. 根据性格决定成长倾向
    const tendency = this.getGrowthTendency(hero.personality);
    
    // 3. 根据经历决定成长内容
    const experience = this.analyzeExperience(hero.growthLog);
    
    // 4. 生成成长建议
    return this.generateGrowth(hero, analysis, tendency, experience);
  }
  
  // 性格决定成长倾向
  private getGrowthTendency(personality: PersonalityType): GrowthTendency {
    const tendencies: Record<PersonalityType, GrowthTendency> = {
      loyal: { stats: ['command', 'charisma'], traits: ['loyal', 'humble'] },
      ambitious: { stats: ['command', 'politics'], traits: ['ambitious', 'cunning'] },
      scholarly: { stats: ['intellect', 'politics'], traits: ['scholarly', 'eloquent'] },
      brave: { stats: ['strength', 'command'], traits: ['brave', 'vanguard'] },
      cautious: { stats: ['intellect', 'politics'], traits: ['cautious', 'administrator'] },
      cunning: { stats: ['intellect', 'charisma'], traits: ['cunning', 'eloquent'] },
      benevolent: { stats: ['charisma', 'politics'], traits: ['benevolent', 'humble'] },
      cruel: { stats: ['strength', 'command'], traits: ['cruel', 'tyrant'] },
      free: { stats: ['strength', 'intellect'], traits: ['free', 'lucky'] },
      loyal_to_self: { stats: ['strength', 'politics'], traits: ['loyal_to_self', 'ambitious'] }
    };
    return tendencies[personality];
  }
  
  // 分析经历决定成长
  private analyzeExperience(logs: GrowthEvent[]): ExperienceAnalysis {
    const battleCount = logs.filter(l => l.type === 'battle').length;
    const governCount = logs.filter(l => l.type === 'govern').length;
    const injuryCount = logs.filter(l => l.type === 'injury').length;
    
    return {
      isWarrior: battleCount > governCount * 2,
      isGovernor: governCount > battleCount * 2,
      isVeteran: logs.length > 20,
      isWounded: injuryCount > 3
    };
  }
}
```

## 武将获取系统

### 获取方式

```typescript
enum AcquisitionMethod {
  STORY_EVENT = 'story_event',      // 剧情事件
  RECRUIT = 'recruit',              // 招募在野武将
  CAPTURE = 'capture',              // 俘虏后招降
  CHOICE_REWARD = 'choice_reward',  // 剧情选择奖励
  TRIGGER = 'trigger',              // 条件触发
  DEFECT = 'defect'                 // 敌方叛逃
}

// 剧情事件获取
const STORY_ACQUISITIONS: StoryAcquisition[] = [
  {
    id: 'sanguo_jieyi',
    name: '桃园三结义',
    trigger: { year: 184, month: 1, event: 'yellow_turban_start' },
    description: '刘备、关羽、张飞在桃园结义',
    heroes: ['liubei', 'guanyu', 'zhangfei'],
    conditions: [{ type: 'player_is_liubei' }]
  },
  {
    id: 'sanguu_maoLu',
    name: '三顾茅庐',
    trigger: { year: 207, month: 12 },
    description: '刘备三顾茅庐请诸葛亮出山',
    heroes: ['zhugeliang'],
    conditions: [{ type: 'player_is_liubei' }, { type: 'has_city', value: 'xinYe' }]
  },
  {
    id: 'caocao_recruit_xuchu',
    name: '许褚归曹',
    trigger: { year: 197, month: 1 },
    description: '许褚率众投奔曹操',
    heroes: ['xuchu'],
    conditions: [{ type: 'player_is_caocao' }]
  }
];

// 招募系统
interface RecruitRequest {
  heroId: string;
  method: 'gold' | 'persuade' | 'force';
  cost?: number;
  successRate: number;
}

function calculateRecruitSuccess(
  recruiter: Hero,
  target: Hero,
  method: string
): number {
  let baseRate = 30;
  
  // 魅力影响
  baseRate += recruiter.stats.charisma / 5;
  
  // 关系影响
  const relation = recruiter.relationships[target.id];
  if (relation) {
    baseRate += relation.value / 10;
  }
  
  // 性格影响
  const personalityMod = PERSONALITY_EFFECTS[target.personality].recruit_difficulty;
  baseRate = Math.floor(baseRate / personalityMod);
  
  // 忠诚度影响
  if (target.factionId) {
    baseRate -= target.loyalty / 5;
  }
  
  return Math.min(95, Math.max(5, baseRate));
}
```

## 武将生死系统

### 死亡类型

```typescript
type DeathCause = 
  | 'battle_death'      // 战死
  | 'ambush_death'      // 伏击身亡
  | 'execute'           // 被处决
  | 'illness'           // 病死
  | 'old_age'           // 自然死亡
  | 'assassination'     // 暗杀
  | 'accident'          // 意外
  | 'suicide';          // 自杀

interface DeathEvent {
  heroId: string;
  cause: DeathCause;
  date: GameDate;
  location?: string;
  killer?: string;      // 凶手（战死时）
  witnesses: string[];  // 目击者
  consequences: DeathConsequence[];
}

interface DeathConsequence {
  type: 'loyalty_drop' | 'revenge' | 'defection' | 'mourning' | 'succession';
  affectedHeroId?: string;
  value: number;
  description: string;
}
```

### 战死判定

```typescript
function checkBattleDeath(
  hero: Hero,
  battle: BattleState,
  damage: number
): DeathCheckResult {
  // 基础战死概率
  let deathChance = 5;  // 5%基础概率
  
  // 伤害影响
  if (damage > hero.stats.strength * 10) {
    deathChance += 10;  // 致命伤害
  }
  
  // 武力影响
  deathChance -= hero.stats.strength / 10;  // 武力高更难死
  
  // 特性影响
  if (hero.traits.some(t => t.id === 'lucky')) {
    deathChance -= 50;  // 天命特性减半
  }
  if (hero.traits.some(t => t.id === 'iron_body')) {
    deathChance -= 30;  // 铁骨特性
  }
  
  // 年龄影响
  const age = battle.date.year - hero.birth_year;
  if (age > 60) deathChance += 10;
  if (age > 70) deathChance += 20;
  
  // 随机判定
  const roll = Math.random() * 100;
  
  if (roll < deathChance) {
    return {
      died: true,
      cause: 'battle_death',
      description: generateDeathDescription(hero, battle)
    };
  }
  
  return { died: false };
}

// 死亡描述生成
function generateDeathDescription(hero: Hero, battle: BattleState): string {
  const descriptions = [
    `${hero.name}在乱军中被流矢射中，当场殒命`,
    `${hero.name}力战不退，最终力竭而亡`,
    `${hero.name}被敌将偷袭，一击毙命`,
    `${hero.name}身中数箭，仍奋勇杀敌，终因伤重不治`
  ];
  
  return descriptions[Math.floor(Math.random() * descriptions.length)];
}
```

### 病死判定

```typescript
function checkIllnessDeath(hero: Hero, date: GameDate): DeathCheckResult {
  const age = date.year - hero.birth_year;
  
  // 基础病死概率
  let deathChance = 0;
  
  // 年龄因素
  if (age < 40) deathChance = 0.5;
  else if (age < 50) deathChance = 1;
  else if (age < 60) deathChance = 2;
  else if (age < 70) deathChance = 5;
  else if (age < 80) deathChance = 10;
  else deathChance = 20;
  
  // 特性影响
  if (hero.traits.some(t => t.id === 'sickly')) {
    deathChance *= 1.5;
  }
  if (hero.traits.some(t => t.id === 'iron_body')) {
    deathChance *= 0.7;
  }
  
  // 每月检查
  const roll = Math.random() * 100;
  
  if (roll < deathChance) {
    return {
      died: true,
      cause: 'illness',
      description: `${hero.name}因病去世，享年${age}岁`
    };
  }
  
  return { died: false };
}
```

### 死亡后果

```typescript
function processDeathConsequences(death: DeathEvent, state: GameState): void {
  for (const consequence of death.consequences) {
    switch (consequence.type) {
      case 'loyalty_drop':
        // 同阵营武将忠诚度下降
        const allies = state.heroes.filter(
          h => h.factionId === death.heroId && h.alive
        );
        for (const ally of allies) {
          ally.loyalty = Math.max(0, ally.loyalty - consequence.value);
        }
        break;
        
      case 'revenge':
        // 触发复仇事件
        state.activeEvents.push({
          type: 'revenge',
          trigger: consequence.affectedHeroId,
          target: death.killer,
          description: consequence.description
        });
        break;
        
      case 'defection':
        // 触发叛逃事件
        const disloyal = state.heroes.filter(
          h => h.factionId === death.heroId && 
               h.loyalty < 50 && 
               h.personality === 'ambitious'
        );
        for (const hero of disloyal) {
          state.activeEvents.push({
            type: 'defection',
            heroId: hero.id,
            description: `${hero.name}见大势已去，萌生去意`
          });
        }
        break;
        
      case 'mourning':
        // 士气下降
        state.factions.find(f => f.id === death.heroId)?.cities.forEach(cityId => {
          const city = state.cities.find(c => c.id === cityId);
          if (city) city.morale -= consequence.value;
        });
        break;
        
      case 'succession':
        // 继承人触发
        const successor = findSuccessor(death.heroId, state);
        if (successor) {
          state.activeEvents.push({
            type: 'succession',
            heroId: successor.id,
            description: `${successor.name}继承了${death.heroName}的位置`
          });
        }
        break;
    }
  }
}
```

## 武将界面

### 武将列表面板

```
┌─────────────────────────────────────────────────────────────┐
│  武将一览                                    搜索: [______] │
│  ─────────────────────────────────────────────────────────  │
│  筛选: [全部▼] [势力▼] [状态▼] [排序: 能力▼]               │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 📋 己方武将 (12人)                                   │   │
│  ├─────────────────────────────────────────────────────┤   │
│  │ 👤 刘备    统92 武75 智78 政85 魅98  [查看] [对话]  │   │
│  │ 👤 关羽    统88 武97 智72 政62 魅85  [查看] [对话]  │   │
│  │ 👤 张飞    统82 武98 智45 政35 魅70  [查看] [对话]  │   │
│  │ 👤 诸葛亮  统95 武38 智99 政96 魅92  [查看] [对话]  │   │
│  │ ...                                                  │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 📋 在野武将 (5人)                                    │   │
│  ├─────────────────────────────────────────────────────┤   │
│  │ 👤 徐庶    统65 武50 智88 政82 魅75  [招募]         │   │
│  │ ...                                                  │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### 武将详情面板

```
┌─────────────────────────────────────────────────────────────┐
│  ✕                                                          │
│                                                             │
│  ┌─────────┐  关羽                                         │
│  │         │  字: 云长                                      │
│  │  头像   │  年龄: 45岁                                    │
│  │  像素   │  势力: 蜀汉                                    │
│  │  绘制   │  忠诚: 98 ████████████████████░░               │
│  │         │  状态: 率军在外                                │
│  └─────────┘                                                │
│                                                             │
│  ─────────────────────────────────────────────────────────  │
│  能力值                                                     │
│  统率: 88 ████████████████████████░░                        │
│  武力: 97 ██████████████████████████████░░                  │
│  智力: 72 ██████████████████████░░░░░░                      │
│  政治: 62 ██████████████████░░░░░░░░░░                      │
│  魅力: 85 ████████████████████████░░░░                      │
│                                                             │
│  ─────────────────────────────────────────────────────────  │
│  特性: [忠义] [傲慢] [武勇]                                 │
│  技能: [青龙斩 Lv3] [义绝 Lv2]                              │
│                                                             │
│  ─────────────────────────────────────────────────────────  │
│  关系:                                                       │
│  🟢 刘备 - 结义兄弟 (100)                                   │
│  🟢 张飞 - 结义兄弟 (100)                                   │
│  🔴 曹操 - 宿敌 (-80)                                       │
│  🟡 诸葛亮 - 同僚 (65)                                      │
│                                                             │
│  ─────────────────────────────────────────────────────────  │
│  最近动态:                                                   │
│  [208年3月] 在新野之战中斩杀敌将曹仁                        │
│  [208年2月] 被任命为荆州守将                                 │
│  [207年12月] 随刘备三顾茅庐                                 │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  [💬 对话] [📜 详情] [⚔️ 战绩] [❌ 关闭]            │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## AI驱动武将对话

### 对话提示词

```typescript
function generateHeroDialoguePrompt(
  hero: Hero,
  context: DialogueContext
): string {
  return `
你是${hero.name}（字${hero.courtesy_name}），三国时期的人物。

【人物设定】
- 性格: ${hero.personality}
- 特性: ${hero.traits.map(t => t.name).join('、')}
- 说话风格: ${getSpeechStyle(hero)}

【当前状态】
- 势力: ${hero.factionId ? getFactionName(hero.factionId) : '在野'}
- 忠诚度: ${hero.loyalty}
- 当前任务: ${hero.status}

【关系】
${formatRelationships(hero.relationships)}

【对话要求】
1. 保持人物性格一致性
2. 根据关系调整态度
3. 使用符合时代的语言
4. 回应要简洁有力

请以${hero.name}的口吻回应：
`;
}

// 说话风格定义
function getSpeechStyle(hero: Hero): string {
  const styles: Record<string, string> = {
    '刘备': '温和有礼，常用"备"自称，爱引用仁义之道',
    '关羽': '傲气十足，说话简短有力，常引《春秋》',
    '张飞': '粗犷直率，常自称"俺"，声音洪亮',
    '诸葛亮': '文雅睿智，引经据典，常用"亮"自称',
    '曹操': '霸气果断，时而幽默时而狠辣，常用"孤"',
    '吕布': '傲慢自负，自称"温侯"，语气轻蔑',
    '司马懿': '深沉内敛，话中有话，常笑而不语',
    '赵云': '沉稳忠诚，自称"子龙"，言辞谦逊'
  };
  return styles[hero.name] || '符合人物身份的说话方式';
}
```

## 文件结构

```
client/src/components/HeroPanel/
├── HeroList.tsx            # 武将列表
├── HeroDetail.tsx          # 武将详情
├── HeroRelationGraph.tsx   # 关系网络图
├── HeroDialogue.tsx        # 武将对话
├── data/
│   ├── heroes.json         # 武将数据库
│   ├── traits.json         # 特性数据
│   ├── relationships.json  # 预设关系
│   ├── growthEvents.json   # 成长事件
│   └── storyAcquisitions.json # 剧情获取
├── engine/
│   ├── HeroGrowthAI.ts     # 成长AI
│   ├── DeathSystem.ts      # 生死系统
│   └── RelationManager.ts  # 关系管理
├── ui/
│   ├── HeroCard.tsx        # 武将卡片
│   ├── StatBar.tsx         # 属性条
│   └── TraitBadge.tsx      # 特性标签
└── types/
    └── hero.ts             # 武将类型定义
```

## 开发阶段

### Phase 1: 武将数据库
- 200+武将基础数据
- 五维属性
- 性格/特性

### Phase 2: 关系系统
- 预设历史关系
- 动态关系变化
- 关系网络可视化

### Phase 3: AI成长
- 成长触发条件
- AI成长决策
- 成长日志

### Phase 4: 生死系统
- 战死判定
- 病死判定
- 死亡后果

### Phase 5: 获取系统
- 剧情事件获取
- 招募系统
- 叛逃系统

### Phase 6: 界面完善
- 武将列表/详情
- 关系图谱
- AI对话

## 验证方案

1. **数据库**: 200+武将正确加载
2. **属性**: 五维属性影响战斗/内政
3. **性格**: 不同性格武将表现不同
4. **关系**: 历史关系正确，动态变化正常
5. **成长**: 武将随经历成长
6. **生死**: 战死/病死概率合理
7. **对话**: AI生成符合人物性格的对话
