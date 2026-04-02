// MortalBuddy - 凡人修仙传 H5
// 核心游戏引擎

const SPECIES = {
  duck:      { name: '灵鸭',   emoji: '🦆', path: '飞禽道', bonus: { spirit: 3, insight: 2 } },
  goose:     { name: '天鹅',   emoji: '🪿', path: '天禽道', bonus: { root: 3, spirit: 2 } },
  blob:      { name: '玄冰',   emoji: '🧊', path: '冰道',   bonus: { spirit: 4, root: 1 } },
  cat:       { name: '灵猫',   emoji: '🐱', path: '妖道',   bonus: { insight: 3, daoHeart: 2 } },
  dragon:    { name: '幼龙',   emoji: '🐉', path: '龙道',   bonus: { root: 4, spirit: 1 } },
  octopus:   { name: '海灵',   emoji: '🐙', path: '海道',   bonus: { spirit: 2, insight: 3 } },
  owl:       { name: '灵鸮',   emoji: '🦉', path: '灵道',   bonus: { insight: 4, merit: 1 } },
  penguin:   { name: '冰灵',   emoji: '🐧', path: '冰道',   bonus: { root: 3, daoHeart: 2 } },
  turtle:    { name: '玄龟',   emoji: '🐢', path: '玄道',   bonus: { root: 5 } },
  snail:     { name: '木灵',   emoji: '🐌', path: '木道',   bonus: { merit: 3, root: 2 } },
  ghost:     { name: '幽魂',   emoji: '👻', path: '鬼道',   bonus: { insight: 3, spirit: 2 } },
  axolotl:   { name: '灵螈',   emoji: '🦎', path: '灵道',   bonus: { merit: 4, insight: 1 } },
  capybara:  { name: '土灵',   emoji: '🐹', path: '土道',   bonus: { root: 3, merit: 2 } },
  cactus:    { name: '荒灵',   emoji: '🌵', path: '荒道',   bonus: { root: 4, merit: 1 } },
  robot:     { name: '傀灵',   emoji: '🤖', path: '傀道',   bonus: { insight: 5 } },
  rabbit:    { name: '月灵',   emoji: '🐰', path: '敏道',   bonus: { spirit: 3, insight: 2 } },
  mushroom:  { name: '菌灵',   emoji: '🍄', path: '菌道',   bonus: { merit: 4, daoHeart: 1 } },
  chonk:     { name: '灵兽',   emoji: '🐻', path: '灵兽道', bonus: { root: 3, daoHeart: 2 } }
};

const RARITY_WEIGHTS = [60, 25, 10, 4, 1]; // 1-5星
const RARITY_NAMES = ['', '普通', '优秀', '稀有', '史诗', '传说'];
const RARITY_COLORS = ['', '#9ca3af', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444'];

const REALMS = [
  { name: '练气期', minLv: 1,  color: '#d1d5db', rate: 0.95 },
  { name: '筑基期', minLv: 4,  color: '#93c5fd', rate: 0.80 },
  { name: '金丹期', minLv: 7,  color: '#3b82f6', rate: 0.60 },
  { name: '元婴期', minLv: 10, color: '#a78bfa', rate: 0.40 },
  { name: '化神期', minLv: 13, color: '#fbbf24', rate: 0.25 },
  { name: '炼虚期', minLv: 16, color: '#f97316', rate: 0.15 },
  { name: '大乘期', minLv: 19, color: '#ef4444', rate: 0.10 },
  { name: '渡劫期', minLv: 22, color: '#7dd3fc', rate: 0.05 },
  { name: '真仙期', minLv: 26, color: '#fde68a', rate: 0.03 },
  { name: '仙尊',   minLv: 31, color: '#fca5a5', rate: 0.01 }
];

// 天气系统
const WEATHERS = [
  { name: '晴天', emoji: '☀️', desc: '万里无云，灵气平稳', expMult: 1.0, spiritMult: 1.0 },
  { name: '灵雨', emoji: '🌧️', desc: '天降灵雨，灵力充沛', expMult: 1.3, spiritMult: 1.2 },
  { name: '雷暴', emoji: '⛈️', desc: '雷霆交加，劫雷洗礼', expMult: 1.5, spiritMult: 0.8 },
  { name: '云雾', emoji: '🌫️', desc: '灵雾弥漫，适合参悟', expMult: 1.1, spiritMult: 1.0, insightBonus: 1 },
  { name: '彩虹', emoji: '🌈', desc: '天降异象，大道显灵', expMult: 1.8, spiritMult: 1.5 },
  { name: '星夜', emoji: '🌌', desc: '星辉洒落，适合修炼', expMult: 1.2, spiritMult: 1.1 },
  { name: '血月', emoji: '🌑', desc: '血月高悬，危险与机遇并存', expMult: 2.0, spiritMult: 0.6 },
  { name: '灵潮', emoji: '🌊', desc: '灵气潮汐爆发，万物受益', expMult: 1.6, spiritMult: 1.3 },
];

// Tiered trial events - higher tiers unlock at higher realms
// tier 0: 练气/筑基, tier 1: 金丹/元婴, tier 2: 化神/炼虚, tier 3: 大乘/渡劫, tier 4: 真仙/仙尊
const TRIAL_EVENTS = [
  // Tier 0 - 凡人初涉修仙路
  { tier: 0, text: '在后山灵田中发现一株百年灵芝，天地灵气汇聚于此！', reward: { exp: 50, stones: 30 } },
  { tier: 0, text: '路遇一位云游散修，传授入门吐纳之法。', reward: { exp: 60 } },
  { tier: 0, text: '不慎跌落山崖，幸有灵力护体，但仍受伤不轻...', reward: { exp: 15 }, penalty: { spirit: -10 } },
  { tier: 0, text: '溪边打坐时偶得一枚灵石，灵气氤氲。', reward: { stones: 60 } },
  { tier: 0, text: '救助一只受伤的灵兔，结下善缘，功德上涨。', reward: { exp: 25, merit: 5, stones: 10 } },
  { tier: 0, text: '误闯凡人猎户的陷阱，费了半日才脱身。', reward: { exp: 10 }, penalty: { spirit: -8 } },
  { tier: 0, text: '在灵泉边小憩，泉水沁入经脉，灵力自然恢复。', reward: { exp: 30, spirit: 15 } },
  { tier: 0, text: '路遇一位疯癫老道，胡言乱语中竟暗藏修炼玄机！', reward: { exp: 40, insight: 1 } },

  // Tier 1 - 金丹元婴，渐入佳境
  { tier: 1, text: '在一处上古洞府中寻得前辈遗留的修炼手札！', reward: { exp: 120, stones: 80 } },
  { tier: 1, text: '渡过一场小天劫！虽然狼狈，但雷劫洗礼后修为大涨！', reward: { exp: 180 }, penalty: { spirit: -20 } },
  { tier: 1, text: '遇到一头护山灵兽，斗法三百回合后将其击退！', reward: { exp: 100, stones: 60 } },
  { tier: 1, text: '误入迷阵，被困三日，却在阵中悟出一丝空间法则。', reward: { exp: 90, insight: 2 }, penalty: { spirit: -15 } },
  { tier: 1, text: '集市中与一位炼丹师以物易物，换得一枚培元丹。', reward: { pills: { expPill: 1 }, stones: 20 } },
  { tier: 1, text: '在古墓中发现一张残破的藏宝图，上面标注着一处秘境！', reward: { exp: 80, stones: 50, insight: 1 } },
  { tier: 1, text: '偶遇一位同阶修士，切磋论道，彼此获益匪浅。', reward: { exp: 110, daoHeart: 2 } },
  { tier: 1, text: '在深潭中发现一柄锈迹斑斑的古剑，剑中残存灵力！', reward: { exp: 95, stones: 70 } },
  { tier: 1, text: '误食一株毒草，虽无大碍，但上吐下泻狼狈不堪...', reward: { exp: 20 }, penalty: { spirit: -25 } },

  // Tier 2 - 化神炼虚，参悟天地
  { tier: 2, text: '深入上古遗迹，在一座破败大阵中央发现一枚仙灵石！', reward: { exp: 250, stones: 150 } },
  { tier: 2, text: '与化神期妖修论道七日七夜，彼此印证大道，悟性提升！', reward: { exp: 200, insight: 3 } },
  { tier: 2, text: '横渡一片雷域，九死一生！灵力几近枯竭，但意志更加坚韧。', reward: { exp: 220, daoHeart: 3 }, penalty: { spirit: -30 } },
  { tier: 2, text: '在悬崖绝壁上悟出一套身法，根骨随之提升。', reward: { exp: 150, root: 2 } },
  { tier: 2, text: '闯入一位大能的药园，偷采了一株万年雪莲！', reward: { exp: 180, pills: { realmPill: 1 } }, penalty: { merit: -3 } },
  { tier: 2, text: '寻着藏宝图的指引，在一座荒山中找到一处上古秘境入口！', reward: { exp: 280, stones: 200, insight: 2 } },
  { tier: 2, text: '遭遇一位魔修，激战数百招后将其击退，缴获大量灵石！', reward: { exp: 200, stones: 180 }, penalty: { spirit: -20 } },
  { tier: 2, text: '在海底发现一座上古传送阵，阵中残留着空间法则碎片！', reward: { exp: 230, insight: 2, stones: 120 } },
  { tier: 2, text: '被一位化神期前辈看中，收为记名弟子，得传一门秘术！', reward: { exp: 260, daoHeart: 2, root: 1 } },

  // Tier 3 - 大乘渡劫，逆天改命
  { tier: 3, text: '天道降下心魔大劫！凭借坚定道心扛过万魔噬心之苦！', reward: { exp: 500, daoHeart: 5 }, penalty: { spirit: -40 } },
  { tier: 3, text: '在一处禁地发现上古仙人留下的传承法阵！', reward: { exp: 450, stones: 300, pills: { expPill: 2 } } },
  { tier: 3, text: '遭遇域外天魔入侵！与之殊死搏斗，以功德之力将其封印！', reward: { exp: 400, merit: 5 }, penalty: { spirit: -35 } },
  { tier: 3, text: '渡过九重天劫！最后一道紫霄神雷劈中灵台，反而打通经脉！', reward: { exp: 600, root: 4 }, penalty: { spirit: -50 } },
  { tier: 3, text: '在虚空裂缝中发现一方小世界，灵气浓郁得化为实质！', reward: { exp: 350, stones: 500 } },
  { tier: 3, text: '踏入远古秘境深处，发现一处上古大能的洞府遗存，获得无上传承！', reward: { exp: 550, insight: 5, root: 3, stones: 400 } },
  { tier: 3, text: '在星空深处发现一座悬浮的古老宫殿，其中封印着远古修士毕生修为！', reward: { exp: 650, pills: { realmPill: 2, spiritPill: 2 }, daoHeart: 4 } },
  { tier: 3, text: '闯入封印之地，与上古凶兽激战三日三夜！虽险胜但收获颇丰！', reward: { exp: 480, stones: 350, root: 2 }, penalty: { spirit: -45 } },
  { tier: 3, text: '在无量劫雷中参悟雷之法则，浑身焦黑但灵根得到淬炼！', reward: { exp: 520, root: 3, daoHeart: 3 }, penalty: { spirit: -40 } },

  // Tier 4 - 真仙仙尊，超脱轮回
  { tier: 4, text: '在混沌虚空之中参悟天道本源，窥见大道的一角真容！', reward: { exp: 1000, insight: 8, daoHeart: 5 } },
  { tier: 4, text: '天道之眼降临！以无上修为硬抗天威，感悟造化之力！', reward: { exp: 1200 }, penalty: { spirit: -60 } },
  { tier: 4, text: '在仙界废墟中发掘出上古仙尊的遗宝，内含三枚仙丹！', reward: { exp: 800, pills: { expPill: 3, realmPill: 2 } } },
  { tier: 4, text: '与域外大能斗法，天崩地裂！险胜后获得对方一半修为精元！', reward: { exp: 1500, root: 6, spirit: 30 } },
  { tier: 4, text: '在时间长河中逆流而上，目睹远古仙魔大战，心境大进！', reward: { exp: 900, daoHeart: 8, merit: 10 } },
  { tier: 4, text: '发现一处远古仙人遗留的传承之地，道韵流转万古不灭！', reward: { exp: 1100, pills: { rootPill: 3, expPill: 2 }, insight: 6, daoHeart: 6 } },
  { tier: 4, text: '在虚空尽头开启一座仙府，内藏无数天材地宝和上古功法！', reward: { exp: 1300, stones: 800, pills: { realmPill: 3, spiritPill: 3, rootPill: 2 } } },
  { tier: 4, text: '以大法力逆转时空，目睹创世之初天地开辟之象！', reward: { exp: 1400, insight: 7, daoHeart: 5 } },
  { tier: 4, text: '在大道之畔与天道化身论道，得闻至高法则！', reward: { exp: 1100, insight: 5, root: 4, merit: 8 } },
];

class MortalBuddy {
  constructor() {
    this.stateKey = 'mortalbuddy';
    this.load();
  }

  load() {
    try {
      const raw = localStorage.getItem(this.stateKey);
      this.state = raw ? JSON.parse(raw) : this.defaultState();
    } catch (e) {
      this.state = this.defaultState();
    }
    // Affection decay on load
    if (this.state.pet) {
      const pet = this.state.pet;
      const now = Date.now();
      const hoursSince = (now - (pet.lastInteract || pet.born || now)) / (1000 * 60 * 60);
      if (hoursSince > 24) {
        const daysMissed = Math.floor(hoursSince / 24);
        pet.affection = Math.max(0, pet.affection - daysMissed * 5);
      }
      // Update mood based on affection
      if (pet.affection > 70) pet.mood = 'happy';
      else if (pet.affection >= 40) pet.mood = 'neutral';
      else pet.mood = 'sad';
    }
  }

  defaultState() {
    return { pet: null, inventory: { spiritStones: 100, pills: { expPill: 3, realmPill: 1, healPill: 5, spiritPill: 3, rootPill: 2 } }, weather: null, weatherTime: 0, log: [] };
  }

  save() {
    localStorage.setItem(this.stateKey, JSON.stringify(this.state));
  }

  getPet() { return this.state.pet; }

  getWeather() {
    const now = Date.now();
    // Weather changes every 30 minutes
    if (!this.state.weather || (now - this.state.weatherTime) > 30 * 60 * 1000) {
      this._rollWeather();
    }
    return this.state.weather;
  }

  _rollWeather() {
    // Weighted: common weathers more likely, rare weathers less so
    const weights = [30, 20, 10, 15, 3, 12, 2, 5];
    const idx = this.weightedRandom(weights);
    this.state.weather = { ...WEATHERS[idx], index: idx };
    this.state.weatherTime = Date.now();
    this.save();
  }

  hatch(name) {
    if (this.state.pet) return { ok: false, msg: '你已有一只灵宠，请先放生再孵化新的' };

    const keys = Object.keys(SPECIES);
    const species = keys[Math.floor(Math.random() * keys.length)];
    const rarity = this.weightedRandom(RARITY_WEIGHTS) + 1;
    const shiny = Math.random() < 0.01;
    const sp = SPECIES[species];

    const stats = { spirit: 10, root: 10, insight: 10, merit: 10, daoHeart: 10 };
    for (const [k, v] of Object.entries(sp.bonus)) stats[k] += v * rarity;

    this.state.pet = {
      name: name || sp.name,
      species, rarity, shiny,
      realm: 0, level: 1, exp: 0, expToNext: 100,
      stats, affection: 80, mood: 'happy',
      born: Date.now(), lastInteract: Date.now()
    };
    this.addLog(`天地灵气汇聚，孵化了一只${shiny ? '✨闪光✨' : ''}${'★'.repeat(rarity)}${sp.name}！修炼之道：${sp.path}`);
    this.save();
    return { ok: true, pet: this.state.pet, msg: `孵化成功！${shiny ? '✨闪光✨' : ''}${'★'.repeat(rarity)} ${sp.emoji} ${this.state.pet.name}` };
  }

  _updateAffectionAndMood() {
    const pet = this.state.pet;
    if (!pet) return;

    const now = Date.now();
    const hoursSince = (now - pet.lastInteract) / (1000 * 60 * 60);
    if (hoursSince > 24) {
      const decayIntervals = Math.floor(hoursSince / 24);
      pet.affection = Math.max(0, pet.affection - decayIntervals * 5);
    }

    if (pet.affection > 70) pet.mood = 'happy';
    else if (pet.affection >= 40) pet.mood = 'neutral';
    else pet.mood = 'sad';
  }

  _moodMultiplier() {
    const pet = this.state.pet;
    if (!pet) return 1;
    if (pet.mood === 'happy') return 1.2;
    if (pet.mood === 'neutral') return 1.0;
    return 0.7;
  }

  // Stat growth on level up - scales with rarity (rarity * base)
  _levelUpStats(pet) {
    pet.level++;
    pet.expToNext = Math.floor(pet.expToNext * 1.2);
    const r = pet.rarity;
    pet.stats.spirit += r * 2;
    pet.stats.root += r * 1;
    pet.stats.insight += r * 1;
    pet.stats.merit += r * 1;
    pet.stats.daoHeart += r * 1;
  }

  practice() {
    const pet = this.state.pet;
    if (!pet) return { ok: false, msg: '还没有灵宠，请先孵化' };
    if (this.state.inventory.spiritStones < 10) return { ok: false, msg: '灵石不足！修炼需要10灵石' };

    this._updateAffectionAndMood();

    this.state.inventory.spiritStones -= 10;

    // Earn back 2-5 spirit stones as reward
    const stoneReturn = 2 + Math.floor(Math.random() * 4);
    this.state.inventory.spiritStones += stoneReturn;

    // Base exp scaled by level
    const baseGain = 20 + Math.floor(Math.random() * 30) + pet.stats.insight;
    const moodMult = this._moodMultiplier();
    const realmMult = 1 + pet.realm * 0.05;
    const weather = this.getWeather();
    const weatherMult = weather.expMult;
    const gain = Math.floor(baseGain * moodMult * realmMult * weatherMult);

    pet.exp += gain;
    pet.lastInteract = Date.now();
    pet.affection = Math.min(100, pet.affection + 1);

    // Level up loop
    let levelUp = false;
    while (pet.exp >= pet.expToNext) {
      pet.exp -= pet.expToNext;
      this._levelUpStats(pet);
      levelUp = true;
    }

    // Enlightenment check: 5% chance per practice (3x exp bonus)
    let enlightenment = false;
    if (Math.random() < 0.05) {
      enlightenment = true;
      const bonusExp = gain * 3;
      pet.exp += bonusExp;
      while (pet.exp >= pet.expToNext) {
        pet.exp -= pet.expToNext;
        this._levelUpStats(pet);
        levelUp = true;
      }
    }

    const moodText = pet.mood === 'happy' ? '心境愉悦' : pet.mood === 'neutral' ? '心若止水' : '心神不宁';
    const weatherText = `${weather.emoji}${weather.name}`;
    let msg = `${weatherText}｜运转功法，吸纳天地灵气...获得${gain}经验（${moodText}），灵石+${stoneReturn}`;
    if (weather.expMult > 1.0) msg += `（${weather.name}加成x${weather.expMult}）`;
    if (levelUp) msg += ` 突破至Lv.${pet.level}！`;
    if (enlightenment) msg += ` 顿悟！天降甘霖，大道共鸣，额外获得${gain * 3}修为！`;

    this.addLog(`修炼获得${gain}经验${enlightenment ? `（顿悟！额外+${gain * 3}）` : ''}${levelUp ? '，晋升Lv.' + pet.level : ''}`);
    this.save();
    return { ok: true, expGain: gain, levelUp, enlightenment, pet, msg };
  }

  feed() {
    const pet = this.state.pet;
    if (!pet) return { ok: false, msg: '还没有灵宠' };
    this._updateAffectionAndMood();

    const maxSpirit = 50 + pet.level * 5;
    pet.stats.spirit = Math.min(pet.stats.spirit + 10, maxSpirit);
    pet.affection = Math.min(100, pet.affection + 5);
    pet.lastInteract = Date.now();
    this.addLog(`喂食了灵宠，灵力+10，亲密度+5`);
    this.save();
    return { ok: true, msg: `${pet.name}欢喜地服下灵食~ 灵力+10 亲密度+5` };
  }

  pat() {
    const pet = this.state.pet;
    if (!pet) return { ok: false, msg: '还没有灵宠' };
    this._updateAffectionAndMood();
    pet.affection = Math.min(100, pet.affection + 3);
    pet.lastInteract = Date.now();

    const reactions = [
      `${pet.name}舒服地眯起了眼睛，发出满足的声响~`,
      `${pet.name}蹭了蹭你的手掌，似乎很享受这份温暖`,
      `${pet.name}微微颤抖，灵力在抚摸中缓缓流转`,
      `${pet.name}打了个哈欠，惬意地靠向你~`,
      `${pet.name}眼中闪过一丝灵光，道心更加稳固了`,
    ];
    const msg = reactions[Math.floor(Math.random() * reactions.length)];
    this.addLog(`抚摸了${pet.name}，亲密度+3`);
    this.save();
    return { ok: true, msg: `${msg} 亲密度+3` };
  }

  talk() {
    const pet = this.state.pet;
    if (!pet) return { ok: false, msg: '还没有灵宠' };
    this._updateAffectionAndMood();
    pet.affection = Math.min(100, pet.affection + 2);
    pet.lastInteract = Date.now();

    const speeches = [
      { mood: 'happy', texts: [
        '道友今日气色不凡，想必修炼有所精进！',
        '方才感应到一丝天地灵韵，与你分享~',
        '有你在身旁，修仙之路不觉孤寂。',
        '道友，我觉得我们离突破不远了！',
      ]},
      { mood: 'neutral', texts: [
        '修炼之道，讲究水到渠成，不必急躁。',
        '天地灵气尚可，可以继续修炼。',
        '道友，灵石储备还充足吗？',
        '今日心绪平稳，适合闭关参悟。',
      ]},
      { mood: 'sad', texts: [
        '道友...好久没有修炼了，灵力有些涣散...',
        '有些想念一起历练的日子...',
        '道友，不要忘记修炼啊...',
        '灵力在流逝...请多关心我一些吧。',
      ]},
    ];

    const pool = speeches.find(s => s.mood === pet.mood) || speeches[1];
    const text = pool.texts[Math.floor(Math.random() * pool.texts.length)];
    this.addLog(`与${pet.name}论道，亲密度+2`);
    this.save();
    return { ok: true, msg: `${pet.name}：「${text}」亲密度+2`, speech: text };
  }

  trial() {
    const pet = this.state.pet;
    if (!pet) return { ok: false, msg: '还没有灵宠' };
    if (pet.stats.spirit < 15) return { ok: false, msg: '灵力不足，无法历练（需要15）' };

    this._updateAffectionAndMood();
    pet.stats.spirit -= 10;
    pet.lastInteract = Date.now();

    // Select eligible events based on realm tier
    const tier = this._realmTier();
    const eligible = TRIAL_EVENTS.filter(e => e.tier <= tier);
    const event = eligible[Math.floor(Math.random() * eligible.length)];

    // Scale rewards by realm and mood
    const realmScale = 1 + pet.realm * 0.1;
    const moodMult = this._moodMultiplier();
    const result = { ok: true, text: event.text, rewards: [], tier: event.tier };

    if (event.reward.exp) {
      const scaledExp = Math.floor(event.reward.exp * realmScale * moodMult);
      pet.exp += scaledExp;
      result.rewards.push(`经验+${scaledExp}`);
    }
    if (event.reward.stones) {
      const scaledStones = Math.floor(event.reward.stones * realmScale);
      this.state.inventory.spiritStones += scaledStones;
      result.rewards.push(`灵石+${scaledStones}`);
    }
    if (event.reward.merit) {
      pet.stats.merit += event.reward.merit;
      result.rewards.push(`功德+${event.reward.merit}`);
    }
    if (event.reward.insight) {
      pet.stats.insight += event.reward.insight;
      result.rewards.push(`悟性+${event.reward.insight}`);
    }
    if (event.reward.daoHeart) {
      pet.stats.daoHeart += event.reward.daoHeart;
      result.rewards.push(`道心+${event.reward.daoHeart}`);
    }
    if (event.reward.root) {
      pet.stats.root += event.reward.root;
      result.rewards.push(`根骨+${event.reward.root}`);
    }
    if (event.reward.pills) {
      for (const [k, v] of Object.entries(event.reward.pills)) {
        this.state.inventory.pills[k] = (this.state.inventory.pills[k] || 0) + v;
        result.rewards.push(`${k}+${v}`);
      }
    }
    if (event.penalty) {
      for (const [k, v] of Object.entries(event.penalty)) {
        if (pet.stats[k] !== undefined) pet.stats[k] = Math.max(1, pet.stats[k] + v);
        if (v < 0) result.rewards.push(`${k}${v}`);
      }
    }

    this.addLog(`历练：${event.text}`);
    this.save();
    return result;
  }

  _realmTier() {
    const pet = this.state.pet;
    if (!pet) return 0;
    if (pet.realm >= 8) return 4;
    if (pet.realm >= 6) return 3;
    if (pet.realm >= 4) return 2;
    if (pet.realm >= 2) return 1;
    return 0;
  }

  canBreakthrough() {
    const pet = this.state.pet;
    if (!pet || pet.realm >= 9) return false;
    return pet.level >= REALMS[pet.realm + 1].minLv;
  }

  breakthrough() {
    const pet = this.state.pet;
    if (!pet) return { ok: false, msg: '还没有灵宠' };
    if (pet.realm >= 9) return { ok: false, msg: '已达最高境界！大道尽头，唯我独尊！' };
    if (!this.canBreakthrough()) return { ok: false, msg: `修为尚浅，需达Lv.${REALMS[pet.realm + 1].minLv}方可尝试突破${REALMS[pet.realm + 1].name}` };

    this._updateAffectionAndMood();

    const nextRealm = REALMS[pet.realm + 1];
    // 0.01 per point of insight + daoHeart
    const bonus = (pet.stats.daoHeart + pet.stats.insight) * 0.01;
    const rate = Math.min(0.99, nextRealm.rate + bonus);
    const success = Math.random() < rate;

    if (success) {
      pet.realm++;
      const realmBonus = 3 + pet.realm * 2;
      pet.stats.root += realmBonus;
      pet.stats.spirit += realmBonus;
      pet.stats.daoHeart += Math.floor(realmBonus / 2);
      this.addLog(`天雷洗礼，突破成功！踏入${REALMS[pet.realm].name}！`);
      this.save();
      return { ok: true, success: true, realm: REALMS[pet.realm].name, msg: `突破成功！踏入${REALMS[pet.realm].name}！天地灵气倒灌，修为大进！` };
    } else {
      pet.exp = Math.floor(pet.exp * 0.7);
      pet.stats.spirit = Math.max(1, pet.stats.spirit - 10);
      this.addLog(`突破失败，走火入魔...修为受损`);
      this.save();
      return { ok: true, success: false, msg: `突破失败！心魔入侵，修为受损...（成功率${Math.round(rate * 100)}%）` };
    }
  }

  seclude(hours) {
    const pet = this.state.pet;
    if (!pet) return { ok: false, msg: '还没有灵宠' };
    if (pet.stats.spirit < 20) return { ok: false, msg: '灵力不足，无法闭关（需要20）' };

    this._updateAffectionAndMood();

    pet.stats.spirit -= 20;
    // Success rate improves with realm level: base 60% + realm * 3%
    const successRate = Math.min(0.95, 0.6 + pet.realm * 0.03);
    const success = Math.random() < successRate;

    if (success) {
      const moodMult = this._moodMultiplier();
      const gain = Math.floor((hours * 50 + pet.stats.insight * hours) * moodMult);
      pet.exp += gain;
      pet.lastInteract = Date.now();
      this.addLog(`闭关${hours}时辰，参悟大道，获得${gain}经验！`);
      this.save();
      return { ok: true, success: true, expGain: gain, msg: `闭关${hours}时辰，六根清净，悟道成功！经验+${gain}` };
    } else {
      const loss = Math.floor(pet.exp * 0.15);
      pet.exp = Math.max(0, pet.exp - loss);
      pet.lastInteract = Date.now();
      this.addLog(`闭关${hours}时辰，走火入魔！损失${loss}经验`);
      this.save();
      return { ok: true, success: false, msg: `闭关中走火入魔！灵力逆流，损失${loss}修为...` };
    }
  }

  usePill(type) {
    const pet = this.state.pet;
    if (!pet) return { ok: false, msg: '还没有灵宠' };
    const count = this.state.inventory.pills[type] || 0;
    if (count <= 0) return { ok: false, msg: '没有这种丹药' };

    this._updateAffectionAndMood();
    this.state.inventory.pills[type]--;
    let msg = '';
    if (type === 'expPill') {
      const expGain = 100 + pet.realm * 20;
      pet.exp += expGain;
      msg = `经验+${expGain}`;
    }
    else if (type === 'realmPill') { pet.stats.daoHeart += 5; msg = '道心+5'; }
    else if (type === 'healPill') {
      const maxSpirit = 50 + pet.level * 5;
      const heal = 30 + pet.realm * 5;
      pet.stats.spirit = Math.min(pet.stats.spirit + heal, maxSpirit);
      msg = `灵力+${heal}`;
    }
    else if (type === 'spiritPill') {
      const maxSpirit = 50 + pet.level * 5;
      pet.stats.spirit = Math.min(pet.stats.spirit + 20, maxSpirit);
      msg = '灵力+20';
    }
    else if (type === 'rootPill') {
      pet.stats.root += 5;
      msg = '根骨+5';
    }

    this.addLog(`服下${type}，${msg}`);
    this.save();
    return { ok: true, msg: `服下丹药，药力化开！${msg}` };
  }

  duel(pet2) {
    // 斗法存根 - 即将开放
    return { ok: false, msg: '比武场尚未开放，仙道茫茫，敬请期待...' };
  }

  enlightenment() {
    const pet = this.state.pet;
    if (!pet) return { triggered: false };

    // 0.5% base chance, modified by insight and mood
    const baseChance = 0.005;
    const insightBonus = pet.stats.insight * 0.001;
    const moodBonus = pet.mood === 'happy' ? 0.002 : pet.mood === 'sad' ? -0.002 : 0;
    const chance = baseChance + insightBonus + moodBonus;

    if (Math.random() < chance) {
      const bonusExp = pet.expToNext * 2;
      pet.exp += bonusExp;

      // Check level up
      while (pet.exp >= pet.expToNext) {
        pet.exp -= pet.expToNext;
        this._levelUpStats(pet);
      }

      this.addLog('天降甘霖，大道共鸣！灵宠顿悟！修为暴涨！');
      return { triggered: true, bonusExp, msg: '天地灵气倒灌！大道在你眼前显现！顿悟！' };
    }
    return { triggered: false };
  }

  getStatus() {
    const pet = this.state.pet;
    if (!pet) return null;

    this._updateAffectionAndMood();

    const sp = SPECIES[pet.species];
    const realm = REALMS[pet.realm];
    return {
      ...pet,
      speciesName: sp.name, speciesEmoji: sp.emoji, cultivationPath: sp.path,
      realmName: realm.name, realmColor: realm.color,
      rarityName: RARITY_NAMES[pet.rarity], rarityColor: RARITY_COLORS[pet.rarity],
      expPercent: Math.floor(pet.exp / pet.expToNext * 100)
    };
  }

  rename(name) {
    if (!this.state.pet) return { ok: false, msg: '还没有灵宠' };
    this.state.pet.name = name;
    this.save();
    return { ok: true, msg: `改名成功！${name}之名已刻入灵台` };
  }

  reset() {
    this.state = this.defaultState();
    this.save();
    return { ok: true, msg: '轮回重置，一切归零' };
  }

  addLog(text) {
    this.state.log.unshift({ text, time: Date.now() });
    if (this.state.log.length > 50) this.state.log.length = 50;
  }

  weightedRandom(weights) {
    const total = weights.reduce((a, b) => a + b, 0);
    let r = Math.random() * total;
    for (let i = 0; i < weights.length; i++) { r -= weights[i]; if (r <= 0) return i; }
    return weights.length - 1;
  }
}
