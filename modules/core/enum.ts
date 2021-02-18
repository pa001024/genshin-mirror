/**
 * 角色神之眼类型
 * Avatar's Vision's type
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

/**
 * 怪物稀有度
 * Monster Rarity
 *
 * @enum {number}
 */
export enum MonsterRarity {
  MONSTER_RARITY_SMALL_ENV_ANIMAL,
  MONSTER_RARITY_SMALL_MONSTER,
  MONSTER_RARITY_ELITE_MONSTER,
  MONSTER_RARITY_BOSS_MONSTER,
  MONSTER_RARITY_BIG_BOSS_MONSTER,
}

/**
 * 角色体型
 *
 * @export
 * @enum {number}
 */
export enum BodyType {
  BODY_BOY,
  BODY_MALE,
  BODY_LOLI,
  BODY_GIRL,
  BODY_LADY,
}

/** 加成类型 */
export enum BuffType {
  /** 未知 */ Unknown,
  /** 基础生命 */ BaseHP,
  /** 基础攻击 */ BaseATK,
  /** 基础防御 */ BaseDEF,
  /** 固定生命 */ HPDelta,
  /** 生命 */ HPRatio,
  /** 固定攻击 */ ATKDelta,
  /** 攻击 */ ATKRatio,
  /** 固定防御 */ DEFDelta,
  /** 防御 */ DEFRatio,
  /** 元素充能效率 */ EnergyRecharge,
  /** 元素精通 */ ElementalMastery,
  /** 暴击率 */ CRITRate,
  /** 暴击伤害 */ CRITDMG,
  /** 治疗加成 */ Heal,
  /** 受治疗加成 */ Healed,
  /** 冷却缩减 */ SkillCDSpeed,
  /** 冷却时间减少 */ SkillCDSkip,
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
  /** 减伤 */ DMGReduce,
  /** 移动速度 */ MovementSPD,
  /** 全速度 */ BaseSpeed,
  /** 全速度 */ SpeedRatio,
  /** 攻击速度 */ AttackSPD,
  /** 元素反应伤害 */ ElementalReactionDMG,
  /** 体力消耗 */ StaminaConsumption,
  /** 抗打断能力 */ Endure,
  /** 元素附着时间 */ ElementalAffectDuration,
  /** 产生元素晶球 */ GenerateElementalParticle,
  /** 蓄力速度 */ ChargeSpeed,
  /** 爆头伤害 */ HitHeadDMG,
  /** 体力上限 */ MaxStamina,
  /** 反暴击率 */ AntiCRITRate,
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

export enum MaterialType {
  // /** 命星 */ MATERIAL_TALENT,
  /** 突破材料 */ MATERIAL_AVATAR_MATERIAL = 1,
  // /** 角色 */ MATERIAL_AVATAR,
  /** 料理 */ MATERIAL_FOOD,
  /** 加血道具 */ MATERIAL_NOTICE_ADD_HP,
  /** 素材 */ MATERIAL_EXCHANGE,
  /** 风之翼 */ MATERIAL_FLYCLOAK,
  /** 名片 */ MATERIAL_NAMECARD,
  /** 消耗品 */ MATERIAL_CONSUME,
  // MATERIAL_QUEST,
  // MATERIAL_CHEST, // 宝箱
  // MATERIAL_SELECTABLE_CHEST, // 宝箱
}
