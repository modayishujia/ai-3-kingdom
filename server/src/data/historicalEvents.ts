export interface HistoricalEvent {
  id: string;
  name: string;
  date: { year: number; month: number };
  description: string;
  narrative: string;
  choices: EventChoice[];
  conditions: EventCondition[];
}

export interface EventChoice {
  id: string;
  text: string;
  description: string;
  effects: EventEffect[];
  followUp?: string;
}

export interface EventEffect {
  type: string;
  target?: string;
  value?: number | string;
  description: string;
}

export interface EventCondition {
  type: string;
  value: any;
}

export const HISTORICAL_EVENTS: HistoricalEvent[] = [
  {
    id: 'yellow_turban_start',
    name: '黄巾之乱',
    date: { year: 184, month: 2 },
    description: '张角率黄巾军起义，天下震动',
    narrative: `中平元年二月，巨鹿人张角自称为"天公将军"，率领数十万信众揭竿而起。他们头裹黄巾，攻城掠地，一时间天下震动。朝廷急发兵马征讨，各路诸侯也趁势而起。

"苍天已死，黄天当立，岁在甲子，天下大吉！"

黄巾军势如破竹，连克数城。汉室江山岌岌可危...`,
    choices: [
      {
        id: 'join_imperial',
        text: '响应朝廷，讨伐黄巾',
        description: '站在汉室一边，建立功勋',
        effects: [
          { type: 'relation_change', target: 'han', value: 30, description: '与朝廷关系改善' },
          { type: 'resource_change', target: 'gold', value: 1000, description: '获得朝廷赏赐' },
          { type: 'morale_change', target: 'player', value: 10, description: '士气提升' }
        ]
      },
      {
        id: 'join_rebellion',
        text: '响应黄巾，反抗朝廷',
        description: '加入起义军，推翻腐朽的汉室',
        effects: [
          { type: 'relation_change', target: 'han', value: -80, description: '与朝廷关系恶化' },
          { type: 'relation_change', target: 'yellow_turban', value: 50, description: '与黄巾军结盟' },
          { type: 'hero_join', target: 'zhang_jiao', description: '张角可能加入' }
        ]
      },
      {
        id: 'stay_neutral',
        text: '坐山观虎斗',
        description: '保存实力，等待时机',
        effects: [
          { type: 'resource_change', target: 'grain', value: 2000, description: '储备粮食' },
          { type: 'morale_change', target: 'player', value: -5, description: '百姓略有不满' }
        ]
      }
    ],
    conditions: [
      { type: 'date', value: { year: 184, month: 2 } }
    ]
  },
  {
    id: 'coalition_against_dong_zhuo',
    name: '诸侯讨董',
    date: { year: 190, month: 1 },
    description: '董卓乱政，诸侯联盟讨伐',
    narrative: `初平元年，董卓挟天子以令诸侯，迁都长安，火烧洛阳。各路诸侯以袁绍为盟主，组成联军讨伐董卓。

十八路诸侯，百万大军，齐聚虎牢关前。

然而各怀鬼胎，联盟貌合神离。谁来当先锋？谁来当盟主？一切都需要抉择...`,
    choices: [
      {
        id: 'lead_army',
        text: '亲自领兵参战',
        description: '在讨董战争中建立威望',
        effects: [
          { type: 'relation_change', target: 'all_factions', value: 10, description: '与各诸侯关系改善' },
          { type: 'morale_change', target: 'player', value: 15, description: '军队士气大振' },
          { type: 'trigger_quest', target: 'battle_dong_zhuo', description: '触发讨董任务' }
        ]
      },
      {
        id: 'send_support',
        text: '提供粮草支援',
        description: '以实际行动支持联军',
        effects: [
          { type: 'resource_change', target: 'grain', value: -3000, description: '消耗粮食' },
          { type: 'relation_change', target: 'all_factions', value: 15, description: '获得各诸侯好感' }
        ]
      },
      {
        id: 'ignore',
        text: '按兵不动',
        description: '保存实力，不参与这场战争',
        effects: [
          { type: 'relation_change', target: 'yuan_shao', value: -20, description: '袁绍不满' },
          { type: 'resource_change', target: 'gold', value: 500, description: '节省军费' }
        ]
      }
    ],
    conditions: [
      { type: 'date', value: { year: 190, month: 1 } }
    ]
  },
  {
    id: 'three_visits',
    name: '三顾茅庐',
    date: { year: 207, month: 12 },
    description: '刘备三顾茅庐请诸葛亮出山',
    narrative: `建安十二年，刘备驻扎新野，听闻南阳诸葛亮有经天纬地之才，决定亲自前往隆中拜访。

前两次都未能见到诸葛亮，第三次终于见到了这位卧龙先生。

"大梦谁先觉？平生我自知。草堂春睡足，窗外日迟迟。"

诸葛亮被刘备的诚意感动，终于答应出山辅佐...`,
    choices: [
      {
        id: 'visit_three_times',
        text: '亲自三顾茅庐',
        description: '展现诚意，打动诸葛亮',
        effects: [
          { type: 'hero_join', target: 'zhugeliang', description: '诸葛亮加入' },
          { type: 'morale_change', target: 'player', value: 20, description: '获得贤才，士气大振' },
          { type: 'unlock', target: 'longzhong_plan', description: '解锁隆中对策' }
        ]
      },
      {
        id: 'send_messenger',
        text: '派人邀请',
        description: '节省时间，但可能失礼',
        effects: [
          { type: 'relation_change', target: 'zhugeliang', value: -20, description: '诸葛亮略有不满' },
          { type: 'resource_change', target: 'gold', value: -500, description: '送礼' }
        ]
      }
    ],
    conditions: [
      { type: 'date', value: { year: 207, month: 12 } },
      { type: 'player_is', value: 'liubei' },
      { type: 'has_city', value: 'xinye' }
    ]
  },
  {
    id: 'battle_of_chibi',
    name: '赤壁之战',
    date: { year: 208, month: 11 },
    description: '孙刘联军与曹操在赤壁决战',
    narrative: `建安十三年，曹操率八十万大军南下，意图一统天下。刘备败走夏口，孙权面临生死抉择。

周瑜、诸葛亮力主联合抗曹。黄盖献苦肉计，庞统献连环计。

东风起，火船冲入曹营。一时间，烈焰冲天，曹军大败...`,
    choices: [
      {
        id: 'join_alliance',
        text: '联合抗曹',
        description: '与孙权结盟，共同对抗曹操',
        effects: [
          { type: 'relation_change', target: 'sunquan', value: 50, description: '与孙权结盟' },
          { type: 'relation_change', target: 'caocao', value: -50, description: '与曹操关系恶化' },
          { type: 'trigger_quest', target: 'battle_chibi', description: '触发赤壁之战任务' }
        ]
      },
      {
        id: 'surrender',
        text: '投降曹操',
        description: '保全实力，避免战争',
        effects: [
          { type: 'relation_change', target: 'caocao', value: 80, description: '与曹操关系改善' },
          { type: 'relation_change', target: 'sunquan', value: -60, description: '与孙权关系恶化' },
          { type: 'lose_territory', description: '失去部分领地' }
        ]
      },
      {
        id: 'flee',
        text: '逃往南方',
        description: '避开锋芒，保存实力',
        effects: [
          { type: 'resource_change', target: 'gold', value: -2000, description: '损失钱财' },
          { type: 'morale_change', target: 'player', value: -15, description: '士气低落' }
        ]
      }
    ],
    conditions: [
      { type: 'date', value: { year: 208, month: 11 } }
    ]
  },
  {
    id: 'guan_yu_death',
    name: '关羽败走麦城',
    date: { year: 219, month: 12 },
    description: '关羽大意失荆州，败走麦城',
    narrative: `建安二十四年，关羽北伐襄樊，水淹七军，威震华夏。然而吕蒙白衣渡江，偷袭荆州。

关羽腹背受敌，败走麦城。一代武圣，最终被俘遇害...

"玉可碎而不可改其白，竹可焚而不可毁其节。"`,
    choices: [
      {
        id: 'rescue',
        text: '派兵救援',
        description: '不惜一切代价救关羽',
        effects: [
          { type: 'resource_change', target: 'gold', value: -5000, description: '消耗军费' },
          { type: 'morale_change', target: 'player', value: 10, description: '展现义气' },
          { type: 'relation_change', target: 'guanyu', value: 30, description: '关羽忠诚度提升' }
        ]
      },
      {
        id: 'strategic_retreat',
        text: '战略撤退',
        description: '保存实力，放弃荆州',
        effects: [
          { type: 'relation_change', target: 'guanyu', value: -40, description: '关羽不满' },
          { type: 'resource_change', target: 'gold', value: 2000, description: '保存实力' }
        ]
      }
    ],
    conditions: [
      { type: 'date', value: { year: 219, month: 12 } },
      { type: 'player_is', value: 'liubei' }
    ]
  },
  {
    id: 'liubei_death',
    name: '白帝城托孤',
    date: { year: 223, month: 4 },
    description: '刘备病逝白帝城，托孤诸葛亮',
    narrative: `章武三年，刘备在夷陵之战大败，退守白帝城。病重之际，召诸葛亮前来托孤。

"君才十倍曹丕，必能安国，终定大事。若嗣子可辅，辅之；如其不才，君可自取。"

诸葛亮泣不成声："臣敢竭股肱之力，效忠贞之节，继之以死！"

一代枭雄刘备，就此陨落...`,
    choices: [
      {
        id: 'trust_zhuge',
        text: '完全信任诸葛亮',
        description: '将国家大事托付给诸葛亮',
        effects: [
          { type: 'relation_change', target: 'zhugeliang', value: 50, description: '诸葛亮忠诚度大幅提升' },
          { type: 'unlock', target: 'northern_expedition', description: '解锁北伐剧情' }
        ]
      },
      {
        id: 'setup_checks',
        text: '设置制衡',
        description: '安排其他大臣制衡诸葛亮',
        effects: [
          { type: 'relation_change', target: 'zhugeliang', value: -20, description: '诸葛亮略有不满' },
          { type: 'stability_change', target: 'player', value: 10, description: '政权更稳定' }
        ]
      }
    ],
    conditions: [
      { type: 'date', value: { year: 223, month: 4 } },
      { type: 'player_is', value: 'liubei' }
    ]
  }
];

export function checkEventConditions(event: HistoricalEvent, gameState: any): boolean {
  for (const condition of event.conditions) {
    switch (condition.type) {
      case 'date':
        if (gameState.date.year < condition.value.year ||
            (gameState.date.year === condition.value.year && gameState.date.month < condition.value.month)) {
          return false;
        }
        break;
      case 'player_is':
        if (gameState.player.factionId !== condition.value) {
          return false;
        }
        break;
      case 'has_city':
        if (!gameState.cities.some((c: any) => c.id === condition.value && c.factionId === gameState.player.factionId)) {
          return false;
        }
        break;
    }
  }
  return true;
}

export function getAvailableEvents(gameState: any, completedEvents: string[]): HistoricalEvent[] {
  return HISTORICAL_EVENTS.filter(event => {
    if (completedEvents.includes(event.id)) return false;
    return checkEventConditions(event, gameState);
  });
}
