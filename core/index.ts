/**
 * Charactor's Vision's type
 *
 * @enum {number}
 */
export enum ElementType {
  Anemo = 1, // 风
  Geo, // 岩
  Electro, // 雷
  Dendro, // 草
  Hydro, // 水
  Pyro, // 火
  Cryo, // 冰
}

/**
 * Area names in Teyvat
 *
 * @enum {number}
 */
export enum Region {
  Mondstadt = 1, // 蒙德
  Liyue, // 璃月
  Inazuma, // 稻妻
  Sumeru, // 须弥
  Fontaine, // 枫丹
  Natlan, // 纳特兰
  Snezhnaya, // 至冬国
}

export enum BuffType {
  HP = 1, // 生命
  ATK, // 攻击
  DEF, // 防御
  ExtHP, // 生命点
  ExtATK, // 攻击点
  ExtDEF, // 防御点
  ElmMastery, // 元素精通
  MaxStamina, // 体力上限
  CritChance, // 暴击
  CritDamage, // 暴伤
  Heal, // 治疗加成
  Healen, // 受治疗加成
  Recharge, // 元素充能效率
  SkillCD, // 冷却缩减
  Shield, // 护盾强效
  PyroDmg, // 火元素伤害加成
  PyroResist, // 火元素抗性
  HydroDmg, // 水元素伤害加成
  HydroResist, // 水元素抗性
  DendroDmg, // 草元素伤害加成
  DendroResist, // 草元素抗性
  ElectroDmg, // 雷元素伤害加成
  ElectroResist, // 雷元素抗性
  AnemoDmg, // 风元素伤害加成
  AnemoResist, // 风元素抗性
  CryoDmg, // 冰元素伤害加成
  CryoResist, // 冰元素抗性
  GeoDmg, // 岩元素伤害加成
  GeoResist, // 岩元素抗性
  PhysicalDmg, // 物理伤害加成
  PhysicalResist, // 物理抗性
  ElmDmg, // 全元素伤害加成
  ElmResist, // 全元素伤害抗性
  AllDmg, // 全伤害加成
  Move, // 移动速度
  AtkSpd, // 攻击速度
}
export enum BuffCondition {
  AD = 1, // 普攻
  HD = 2, // 重击
  SP = 4, // 元素战技
  UB = 8, // 元素爆发
  Elm = 16, // 元素附着
  Air = 32, // 空中
  Down = 64, // 倒地
}

/**
 * 武器类型
 *
 * @enum {number}
 */
export enum WeaponType {
  /** 单手 */
  Sword = 1,
  /** 弓 */
  Bow,
  /** 长枪 */
  Polearm,
  /** 大剑 */
  Claymore,
  /** 法器 */
  Catalyst,
}

/**
 * 角色
 */
export interface ICharactor {
  /**
   * 名字
   *
   * @type {string}
   * @example 迪卢克
   */
  name: string;
  /**
   * 地区
   *
   * @type {string}
   * @example 1(蒙德)
   */
  region: Region;
  /**
   * 性别
   *
   * @type {(0 | 1)}
   * @example 1(男)
   */
  gender: 0 | 1;
  /**
   * 稀有度
   *
   * @type {number}
   * @example 5
   */
  rarity: number;
  /**
   * 元素属性
   *
   * @type {ElementType}
   * @example 6(火)
   */
  element: ElementType;
  /**
   * 武器类型
   *
   * @type {WeaponType}
   * @example 3(双手剑)
   */
  weapon: WeaponType;

  /** 普通攻击 */
  attack: IAttackGroup;
  /** 元素战技 */
  elementalSkill: ISkill;
  /** 元素爆发 */
  elementalBurst: ISkill;
  /** 天赋 */
  talents: ITalent[];
  /** 基础生命 */
  baseHP: number[];
  /** 基础攻击 */
  baseATK: number[];
  /** 基础防御 */
  baseDEF: number[];
  /** 突破属性 */
  ascensionType: BuffType;
  /** 突破属性值 */
  ascensionValue: number[];
  /** 命座提升 */
  constellations: IConstellation[];
}
export interface IAttackGroup {
  name: string;
  /** 普通攻击 */
  normalAttack: IAttack[];
  /** 重击 */
  chargeAttack: IAttack[];
  /** 下落攻击 */
  plungeAttack: IAttack[];
}

export interface IAttack {
  name?: string;
  /** 各级别伤害倍率 */
  damage: number[];
  /** 伤害判定次数 */
  damageTimes?: number;
  /** 准备时间 */
  preTime?: number;
  /** 动作时间 */
  actTime?: number;
  /** 后摇时间 */
  backTime?: number;
  /** 间隔时间 */
  period?: number;
  /** 持续时间 */
  duration?: number;
  /** 体力消耗 */
  staminaCost?: number;
}

export interface ISkill {
  name: string;
  cd: number;
  charges?: number;
  attrs: ISkillAttribute[];
}

export interface ISkillAttribute {
  name: string;
  /** 类型 */
  type: "heal" | "atk" | "enhance" | "summon";
  /** 伤害 */
  damage?: number[];
  /** 治疗 */
  heal?: number[];
  /** 持续时间 */
  duration?: number;
  /** 加成 */
  buff?: IBuff[];
}

export interface ITalent {
  name: string;
  /** 效果 */
  effects?: ITalentEffect[];
}

export interface ITalentEffect {
  path: string;
  value: any;
}

export interface IBuff {
  type: BuffType;
  cond?: BuffCondition;
  value: number;
}

export interface IConstellation {
  name: string;
  buffs?: IBuff[];
  values?: number[];
}
