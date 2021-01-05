/**
 * 角色神之眼类型
 * Character's Vision's type
 *
 * @enum {number}
 */
export enum ElementType {
  /** 任何 */ Any,
  /** 风 */ Anemo,
  /** 岩 */ Geo,
  /** 雷 */ Electro,
  /** 草 */ Dendro,
  /** 水 */ Hydro,
  /** 火 */ Pyro,
  /** 冰 */ Cryo,
  /** 最后 */ Last,
  /** 附着 */ Ing,
}

/**
 * 反应类型
 * Element's reaction type
 *
 * @enum {number}
 */
export enum ReactionType {
  /** 扩散 */ Swirl,
  /** 结晶 */ Crystallize,
  /** 感电 */ ElectroCharged,
  /** 超载 */ Overloaded,
  /** 超导 */ Superconduct,
  /** 燃烧 */ Burning,
  /** 冻结 */ Frozen,
  /** 蒸发 */ Vaporize,
  /** 融化 */ Melt,
}

/**
 * 提瓦特区域名称
 * Area names in Teyvat
 *
 * @enum {number}
 */
export enum Region {
  /** 未知 */ Unknown,
  /** 蒙德 */ Mondstadt,
  /** 璃月 */ Liyue,
  /** 稻妻 */ Inazuma,
  /** 须弥 */ Sumeru,
  /** 枫丹 */ Fontaine,
  /** 纳塔 */ Natlan,
  /** 至冬 */ Snezhnaya,
}

/** 加成类型 */
export enum BuffType {
  /** 未知 */ Unknown,
  /** 生命 */ HP,
  /** 攻击 */ ATK,
  /** 防御 */ DEF,
  /** 生命点 */ ExtHP,
  /** 攻击点 */ ExtATK,
  /** 防御点 */ ExtDEF,
  /** 元素精通 */ ElementalMastery,
  /** 体力上限 */ MaxStamina,
  /** 暴击率 */ CRITRate,
  /** 暴击伤害 */ CRITDMG,
  /** 治疗加成 */ Heal,
  /** 受治疗加成 */ Healen,
  /** 元素充能效率 */ EnergyRecharge,
  /** 冷却缩减 */ SkillCD,
  /** 冷却速度 */ SkillSPD,
  /** 护盾强效 */ ShieldEffectiveness,
  /** 火元素伤害加成 */ PyroDMG,
  /** 火元素抗性 */ PyroRES,
  /** 水元素伤害加成 */ HydroDMG,
  /** 水元素抗性 */ HydroRES,
  /** 草元素伤害加成 */ DendroDMG,
  /** 草元素抗性 */ DendroRES,
  /** 雷元素伤害加成 */ ElectroDMG,
  /** 雷元素抗性 */ ElectroRES,
  /** 风元素伤害加成 */ AnemoDMG,
  /** 风元素抗性 */ AnemoRES,
  /** 冰元素伤害加成 */ CryoDMG,
  /** 冰元素抗性 */ CryoRES,
  /** 岩元素伤害加成 */ GeoDMG,
  /** 岩元素抗性 */ GeoRES,
  /** 物理伤害加成 */ PhysicalDMG,
  /** 物理抗性 */ PhysicalRES,
  /** 全元素伤害加成 */ ElementalDMG,
  /** 全元素伤害抗性 */ AllRES,
  /** 全伤害加成 */ AllDMG,
  /** 移动速度 */ MovementSPD,
  /** 攻击速度 */ AttackSPD,
  /** 元素反应伤害 */ ElementalReactionDMG,
  /** 体力消耗 */ StaminaConsumption,
  /** 抗打断能力 */ InterruptionRES,
  /** 元素附着时间 */ ElementalAffectDuration,
  /** 技能冷却时间 */ SkillCDReduce,
  /** 产生元素晶球 */ GenerateElementalParticle,
}

/** 加成条件 */
export enum BuffCondition {
  /** 普攻 */ NormalAttack = 1 >> 1,
  /** 重击 */ ChargeAttack = 1 >> 2,
  /** 元素战技 */ ElementalSkill = 1 >> 3,
  /** 元素爆发 */ ElementalBurst = 1 >> 4,
  /** 元素附着 */ ElementalAffect = 1 >> 5,
  /** 空中 */ Air = 1 >> 6,
  /** 倒地 */ KnockDown = 1 >> 7,
  /** 元素反应 */ ElementalReaction = 1 >> 8,
  /** 击杀 */ Defeating = 1 >> 9,
  /** 护盾 */ Shield = 1 >> 10,
  /** 表达式 */ Expression = 1 >> 11,
  /** 冻结 */ Frozen = 1 >> 12,
  /** 受到伤害 */ Damaged = 1 >> 13,
}

/** 加成对象 */
export enum BuffTarget {
  /** 普攻 */ NormalAttack = 1 >> 1,
  /** 重击 */ ChargeAttack = 1 >> 2,
  /** 空中 */ PlungeAttack = 1 >> 3,
  /** 元素战技 */ ElementalSkill = 1 >> 4,
  /** 元素爆发 */ ElementalBurst = 1 >> 5,
}

/** 武器类型 */
export enum WeaponType {
  /** 未知 */ Unknown,
  /** 单手 */ Sword,
  /** 弓 */ Bow,
  /** 长枪 */ Polearm,
  /** 大剑 */ Claymore,
  /** 法器 */ Catalyst,
}

/** 圣遗物套装 */
export enum ArtifactSeries {
  // ==== 1-3 ====
  /** 冒险家 */ Adventurer = 1,
  /** 幸运儿 */ LuckyDog,
  /** 游医 */ TravelingDoctor,
  // ==== 3-4 ====
  /** 教官 */ Instructor = 100,
  /** 战狂 */ Berserker,
  /** 流放者 */ TheExile,
  /** 故人之心 */ ResolutionOfSojourner,
  /** 武人 */ MartialArtist,
  /** 守护之心 */ DefenderSWill,
  /** 奇迹 */ TinyMiracle,
  /** 勇士之心 */ BraveHeart,
  /** 赌徒 */ Gambler,
  /** 学士 */ Scholar,
  // ==== 3-4 特殊(只有理之冠) ====
  /** 祭雷之人 */ PrayersForWisdom = 200,
  /** 祭冰之人 */ PrayersToSpringtime,
  /** 祭火之人 */ PrayersForIllumination,
  /** 祭水之人 */ PrayersForDestiny,
  // ==== 4-5 ====
  /** 角斗士的终幕礼 */ GladiatorSFinale = 300,
  /** 被怜爱的少女 */ MaidenBeloved,
  /** 昔日宗室之仪 */ NoblesseOblige,
  /** 染血的骑士道 */ BloodstainedChivalry,
  /** 流浪大地的乐团 */ WandererSTroupe,
  /** 翠绿之影 */ ViridescentVenerer,
  /** 如雷的盛怒 */ ThunderingFury,
  /** 平息鸣雷的尊者 */ Thundersoother,
  /** 炽烈的炎之魔女 */ CrimsonWitchOfFlames,
  /** 渡过烈火的贤人 */ Lavawalker,
  /** 悠古的磐岩 */ ArchaicPetra,
  /** 逆飞的流星 */ RetracingBolide,
  /** 冰风迷途的勇士 */ Icebreaker,
  /** 沉沦之心 */ OceanConqueror,
}

/** 圣遗物部位 */
export enum ArtifactType {
  /** 生之花 */ FlowerOfLife,
  /** 死之羽 */ PlumeOfDeath,
  /** 时之沙 */ SandsOfEon,
  /** 空之杯 */ GobletOfEonothem,
  /** 理之冠 */ CircletOfLogos,
}

export enum EnemyType {
  /** 未知 */ Unknown,
  /** 丘丘人 */ Hilichurls,
  /** 史莱姆 */ Slimes,
  /** 遗迹机器 */ RuinMachina,
  /** 深渊教团 */ AbyssOrder,
  /** 盗宝团 */ TreasureHoarders,
  /** 愚人众 */ Fatui,
  /** BOSS */ Boss,
  /** 公子 */ Childe,
}
