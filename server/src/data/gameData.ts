export const HEROES_DATA = [
  {
    id: 'liubei',
    name: '刘备',
    courtesyName: '玄德',
    birthYear: 161,
    factionId: undefined,
    loyalty: 100,
    stats: { command: 75, strength: 70, intellect: 78, politics: 85, charisma: 98 },
    traits: ['仁德', '坚韧'],
    personality: 'benevolent',
    skills: ['仁德之光', '号召'],
    relationships: {
      guanyu: { targetId: 'guanyu', type: 'blood_brother', value: 100 },
      zhangfei: { targetId: 'zhangfei', type: 'blood_brother', value: 100 }
    }
  },
  {
    id: 'guanyu',
    name: '关羽',
    courtesyName: '云长',
    birthYear: 160,
    factionId: undefined,
    loyalty: 100,
    stats: { command: 88, strength: 97, intellect: 72, politics: 62, charisma: 85 },
    traits: ['忠义', '傲慢', '武勇'],
    personality: 'loyal',
    skills: ['青龙斩', '义绝'],
    relationships: {
      liubei: { targetId: 'liubei', type: 'blood_brother', value: 100 },
      zhangfei: { targetId: 'zhangfei', type: 'blood_brother', value: 100 }
    }
  },
  {
    id: 'zhangfei',
    name: '张飞',
    courtesyName: '翼德',
    birthYear: 166,
    factionId: undefined,
    loyalty: 100,
    stats: { command: 82, strength: 98, intellect: 45, politics: 35, charisma: 70 },
    traits: ['勇猛', '暴躁'],
    personality: 'brave',
    skills: ['燕人怒吼', '蛇矛乱舞'],
    relationships: {
      liubei: { targetId: 'liubei', type: 'blood_brother', value: 100 },
      guanyu: { targetId: 'guanyu', type: 'blood_brother', value: 100 }
    }
  },
  {
    id: 'caocao',
    name: '曹操',
    courtesyName: '孟德',
    birthYear: 155,
    stats: { command: 92, strength: 75, intellect: 91, politics: 94, charisma: 88 },
    traits: ['奸雄', '多疑', '果断'],
    personality: 'cunning',
    skills: ['奸雄之智', '求贤若渴'],
    relationships: {}
  },
  {
    id: 'zhugeliang',
    name: '诸葛亮',
    courtesyName: '孔明',
    birthYear: 181,
    stats: { command: 95, strength: 38, intellect: 99, politics: 96, charisma: 92 },
    traits: ['睿智', '谨慎', '忠诚'],
    personality: 'scholarly',
    skills: ['八阵图', '火攻', '空城计'],
    relationships: {}
  },
  {
    id: 'zhouyu',
    name: '周瑜',
    courtesyName: '公瑾',
    birthYear: 175,
    stats: { command: 90, strength: 70, intellect: 96, politics: 80, charisma: 93 },
    traits: ['儒雅', '自信', '火攻'],
    personality: 'proud',
    skills: ['火攻', '反间计'],
    relationships: {}
  },
  {
    id: 'lvbu',
    name: '吕布',
    courtesyName: '奉先',
    birthYear: 160,
    stats: { command: 85, strength: 100, intellect: 30, politics: 20, charisma: 40 },
    traits: ['无双', '反复无常'],
    personality: 'free',
    skills: ['无双乱舞', '飞将'],
    relationships: {}
  },
  {
    id: 'simayi',
    name: '司马懿',
    courtesyName: '仲达',
    birthYear: 179,
    stats: { command: 93, strength: 50, intellect: 98, politics: 95, charisma: 75 },
    traits: ['隐忍', '多谋', '深沉'],
    personality: 'cunning',
    skills: ['深谋远虑', '鹰视狼顾'],
    relationships: {}
  },
  {
    id: 'zhaoyun',
    name: '赵云',
    courtesyName: '子龙',
    birthYear: 168,
    stats: { command: 86, strength: 96, intellect: 76, politics: 65, charisma: 88 },
    traits: ['忠诚', '勇猛', '沉稳'],
    personality: 'loyal',
    skills: ['七进七出', '龙胆'],
    relationships: {}
  },
  {
    id: 'xuchu',
    name: '许褚',
    courtesyName: '仲康',
    birthYear: 170,
    stats: { command: 72, strength: 95, intellect: 30, politics: 25, charisma: 55 },
    traits: ['勇猛', '忠诚', '粗犷'],
    personality: 'brave',
    skills: ['虎痴', '裸衣斗马超'],
    relationships: {}
  },
  {
    id: 'dianwei',
    name: '典韦',
    birthYear: 150,
    deathYear: 197,
    stats: { command: 70, strength: 98, intellect: 20, politics: 15, charisma: 45 },
    traits: ['忠勇', '无畏'],
    personality: 'brave',
    skills: ['古之恶来', '双戟'],
    relationships: {}
  },
  {
    id: 'guojia',
    name: '郭嘉',
    courtesyName: '奉孝',
    birthYear: 170,
    deathYear: 207,
    stats: { command: 85, strength: 20, intellect: 97, politics: 70, charisma: 75 },
    traits: ['鬼才', '嗜酒'],
    personality: 'cunning',
    skills: ['十胜十败', '遗计定辽东'],
    relationships: {}
  },
  {
    id: 'sunquan',
    name: '孙权',
    courtesyName: '仲谋',
    birthYear: 182,
    stats: { command: 80, strength: 65, intellect: 82, politics: 88, charisma: 90 },
    traits: ['守成', '知人善任'],
    personality: 'cautious',
    skills: ['据江东', '联刘抗曹'],
    relationships: {}
  },
  {
    id: 'zhangliao',
    name: '张辽',
    courtesyName: '文远',
    birthYear: 169,
    stats: { command: 88, strength: 90, intellect: 78, politics: 60, charisma: 72 },
    traits: ['勇猛', '善战'],
    personality: 'brave',
    skills: ['威震逍遥津', '突袭'],
    relationships: {}
  },
  {
    id: 'ganning',
    name: '甘宁',
    courtesyName: '兴霸',
    birthYear: 170,
    stats: { command: 80, strength: 92, intellect: 55, politics: 35, charisma: 60 },
    traits: ['锦帆贼', '勇猛'],
    personality: 'brave',
    skills: ['百骑劫魏营', '锦帆'],
    relationships: {}
  },
  {
    id: 'huangzhong',
    name: '黄忠',
    courtesyName: '汉升',
    birthYear: 148,
    deathYear: 220,
    stats: { command: 82, strength: 95, intellect: 60, politics: 45, charisma: 65 },
    traits: ['老当益壮', '神射'],
    personality: 'brave',
    skills: ['百步穿杨', '定军山'],
    relationships: {}
  },
  {
    id: 'weiyan',
    name: '魏延',
    courtesyName: '文长',
    birthYear: 175,
    deathYear: 234,
    stats: { command: 85, strength: 90, intellect: 70, politics: 40, charisma: 50 },
    traits: ['勇猛', '有反骨'],
    personality: 'ambitious',
    skills: ['子午谷奇谋', '反骨'],
    relationships: {}
  },
  {
    id: 'jiangwei',
    name: '姜维',
    courtesyName: '伯约',
    birthYear: 202,
    deathYear: 264,
    stats: { command: 90, strength: 85, intellect: 92, politics: 75, charisma: 70 },
    traits: ['忠诚', '北伐'],
    personality: 'loyal',
    skills: ['九伐中原', '胆大如斗'],
    relationships: {}
  },
  {
    id: 'lv_meng',
    name: '吕蒙',
    courtesyName: '子明',
    birthYear: 178,
    deathYear: 220,
    stats: { command: 86, strength: 78, intellect: 88, politics: 72, charisma: 70 },
    traits: ['好学', '白衣渡江'],
    personality: 'cautious',
    skills: ['白衣渡江', '士别三日'],
    relationships: {}
  },
  {
    id: 'luxun',
    name: '陆逊',
    courtesyName: '伯言',
    birthYear: 183,
    deathYear: 245,
    stats: { command: 92, strength: 60, intellect: 95, politics: 85, charisma: 78 },
    traits: ['儒将', '火烧连营'],
    personality: 'scholarly',
    skills: ['火烧连营', '忍辱负重'],
    relationships: {}
  }
];

export const CITIES_DATA = [
  {
    id: 'luoyang',
    name: '洛阳',
    level: 5,
    factionId: 'han',
    population: 100000,
    prosperity: 85,
    security: 70,
    morale: 60,
    position: { x: 800, y: 400 },
    facilities: { farm: 4, market: 5, lumbermill: 3, mine: 3, workshop: 4, harbor: 1, temple: 4 }
  },
  {
    id: 'chang_an',
    name: '长安',
    level: 5,
    factionId: 'han',
    population: 80000,
    prosperity: 80,
    security: 65,
    morale: 55,
    position: { x: 600, y: 400 },
    facilities: { farm: 4, market: 4, lumbermill: 3, mine: 3, workshop: 3, harbor: 0, temple: 3 }
  },
  {
    id: 'ye',
    name: '邺城',
    level: 3,
    population: 30000,
    prosperity: 60,
    security: 50,
    morale: 50,
    position: { x: 900, y: 350 },
    facilities: { farm: 3, market: 3, lumbermill: 2, mine: 2, workshop: 2, harbor: 1, temple: 2 }
  },
  {
    id: 'xinye',
    name: '新野',
    level: 2,
    population: 15000,
    prosperity: 45,
    security: 40,
    morale: 55,
    position: { x: 750, y: 500 },
    facilities: { farm: 2, market: 2, lumbermill: 1, mine: 1, workshop: 1, harbor: 1, temple: 1 }
  },
  {
    id: 'jingzhou',
    name: '荆州',
    level: 4,
    population: 50000,
    prosperity: 70,
    security: 60,
    morale: 60,
    position: { x: 750, y: 600 },
    facilities: { farm: 4, market: 4, lumbermill: 3, mine: 2, workshop: 3, harbor: 3, temple: 3 }
  },
  {
    id: 'xuzhou',
    name: '徐州',
    level: 3,
    population: 40000,
    prosperity: 65,
    security: 55,
    morale: 55,
    position: { x: 950, y: 500 },
    facilities: { farm: 3, market: 3, lumbermill: 2, mine: 2, workshop: 2, harbor: 2, temple: 2 }
  },
  {
    id: 'chengdu',
    name: '成都',
    level: 4,
    population: 60000,
    prosperity: 75,
    security: 65,
    morale: 70,
    position: { x: 400, y: 600 },
    facilities: { farm: 4, market: 4, lumbermill: 3, mine: 2, workshop: 3, harbor: 1, temple: 4 }
  },
  {
    id: 'hanzhong',
    name: '汉中',
    level: 3,
    population: 30000,
    prosperity: 55,
    security: 60,
    morale: 55,
    position: { x: 500, y: 500 },
    facilities: { farm: 3, market: 2, lumbermill: 2, mine: 2, workshop: 2, harbor: 1, temple: 2 }
  },
  {
    id: 'jianye',
    name: '建业',
    level: 4,
    population: 55000,
    prosperity: 72,
    security: 62,
    morale: 65,
    position: { x: 1000, y: 550 },
    facilities: { farm: 3, market: 4, lumbermill: 3, mine: 2, workshop: 3, harbor: 4, temple: 3 }
  },
  {
    id: 'chaisang',
    name: '柴桑',
    level: 3,
    population: 35000,
    prosperity: 60,
    security: 55,
    morale: 58,
    position: { x: 950, y: 600 },
    facilities: { farm: 3, market: 3, lumbermill: 2, mine: 2, workshop: 2, harbor: 3, temple: 2 }
  },
  {
    id: 'xuchang',
    name: '许昌',
    level: 4,
    population: 50000,
    prosperity: 70,
    security: 65,
    morale: 58,
    position: { x: 850, y: 450 },
    facilities: { farm: 4, market: 4, lumbermill: 3, mine: 2, workshop: 3, harbor: 1, temple: 3 }
  },
  {
    id: 'beijing',
    name: '北平',
    level: 3,
    population: 35000,
    prosperity: 55,
    security: 55,
    morale: 50,
    position: { x: 950, y: 250 },
    facilities: { farm: 3, market: 2, lumbermill: 2, mine: 3, workshop: 2, harbor: 1, temple: 2 }
  }
];

export const FACTIONS_DATA = [
  {
    id: 'han',
    name: '汉朝',
    leaderId: 'emperor_ling',
    heroes: [] as string[],
    cities: ['luoyang', 'chang_an'],
    relationships: {} as Record<string, number>,
    personality: 'weak',
    resources: { grain: 10000, gold: 8000, population: 100000, wood: 5000, iron: 3000, cloth: 2000, morale: 50 }
  },
  {
    id: 'yellow_turban',
    name: '黄巾军',
    leaderId: 'zhang_jiao',
    heroes: [] as string[],
    cities: [] as string[],
    relationships: { han: -100 } as Record<string, number>,
    personality: 'fanatical',
    resources: { grain: 8000, gold: 2000, population: 300000, wood: 3000, iron: 2000, cloth: 1000, morale: 80 }
  },
  {
    id: 'dong_zhuo',
    name: '董卓军',
    leaderId: 'dong_zhuo',
    heroes: ['lvbu', 'huaxiong'] as string[],
    cities: ['luoyang', 'chang_an'] as string[],
    relationships: { han: -80 } as Record<string, number>,
    personality: 'cruel',
    resources: { grain: 12000, gold: 6000, population: 80000, wood: 4000, iron: 3500, cloth: 1500, morale: 40 }
  },
  {
    id: 'caocao',
    name: '曹魏',
    leaderId: 'caocao',
    heroes: ['caocao', 'xuchu', 'dianwei', 'guojia', 'xunyu', 'zhangliao'] as string[],
    cities: ['xuchang', 'ye', 'luoyang'] as string[],
    relationships: { liubei: -30, sunquan: -40, yuan_shao: -60 } as Record<string, number>,
    personality: 'ambitious',
    resources: { grain: 15000, gold: 10000, population: 150000, wood: 8000, iron: 5000, cloth: 3000, morale: 75 }
  },
  {
    id: 'liubei',
    name: '蜀汉',
    leaderId: 'liubei',
    heroes: ['liubei', 'guanyu', 'zhangfei', 'zhugeliang', 'zhaoyun', 'jiangwei'] as string[],
    cities: ['chengdu', 'hanzhong', 'jingzhou'] as string[],
    relationships: { caocao: -30, sunquan: 50 } as Record<string, number>,
    personality: 'benevolent',
    resources: { grain: 12000, gold: 7000, population: 120000, wood: 6000, iron: 4000, cloth: 2500, morale: 85 }
  },
  {
    id: 'sunquan',
    name: '东吴',
    leaderId: 'sunquan',
    heroes: ['sunquan', 'zhouyu', 'lv_meng', 'luxun', 'ganning', 'taishici'] as string[],
    cities: ['jianye', 'chaisang'] as string[],
    relationships: { caocao: -40, liubei: 50 } as Record<string, number>,
    personality: 'cautious',
    resources: { grain: 10000, gold: 8000, population: 100000, wood: 5000, iron: 3500, cloth: 3000, morale: 72 }
  },
  {
    id: 'yuan_shao',
    name: '袁绍',
    leaderId: 'yuan_shao',
    heroes: ['yuan_shao', 'yanliang', 'wenchou', 'tianfeng', 'jushou'] as string[],
    cities: ['ye', 'beijing'] as string[],
    relationships: { caocao: -60, gongsun_zan: -40 } as Record<string, number>,
    personality: 'arrogant',
    resources: { grain: 18000, gold: 12000, population: 180000, wood: 7000, iron: 4500, cloth: 2500, morale: 65 }
  },
  {
    id: 'lvbu',
    name: '吕布',
    leaderId: 'lvbu',
    heroes: ['lvbu', 'chen_gong', 'gao_shun'] as string[],
    cities: ['xuzhou'] as string[],
    relationships: { caocao: -50, liubei: -30 } as Record<string, number>,
    personality: 'untrustworthy',
    resources: { grain: 5000, gold: 3000, population: 40000, wood: 2000, iron: 1500, cloth: 1000, morale: 60 }
  }
];
