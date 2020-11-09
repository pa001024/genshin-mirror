import { ArtifactSeries, ArtifactType, BuffCondition, BuffType, ElementType, Region, WeaponType, BuffTarget } from "./enum";

/** 武器 */
export interface IWeapon {
  /** 序号 */ id: number;
  /** 名称 */ name: string;
  /** 类型 */ type: WeaponType;
  /** 基础攻击力 */ baseATK: number[];
  /** 副属性类型 */ subPropType: BuffType;
  /** 副属性值 */ subPropValue: number[];
  /** 特效名称 */ buffName?: string;
  /** 特效 */ buffs?: IBuff[];
}

/** 圣遗物 */
export interface IArtifact {
  /** 部位 */ type: ArtifactType;
  /** 等级 */ level: number;
  /** 系列 */ series: ArtifactSeries;
  /** 稀有度 */ rarity: number;
  /** 主属性 */ mainAttr: IAttr[];
  /** 副属性 */ subAttrs: IAttr[];
}

/** 角色 */
export interface ICharacter {
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

  /** 普通攻击 */ attack: IAttackGroup;
  /** 元素战技 */ elementalSkill: ISkill;
  /** 元素爆发 */ elementalBurst: ISkill;
  /** 天赋 */ talents: ITalent[];
  /** 基础生命 */ baseHP: number[];
  /** 基础攻击 */ baseATK: number[];
  /** 基础防御 */ baseDEF: number[];
  /** 突破属性 */ ascensionType: BuffType;
  /** 突破属性值 */ ascensionValue: number[];
  /** 命座提升 */ constellations: IConstellation[];
}

/** 攻击组 */
export interface IAttackGroup {
  name: string;
  /** 普通攻击 */
  normalAttack: IAttack[];
  /** 重击 */
  chargeAttack: IAttack[];
  /** 下落攻击 */
  plungeAttack: IAttack[];
}

/** 攻击 */
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

/** 技能 */
export interface ISkill {
  name: string;
  cd: number;
  charges?: number;
  attrs: ISkillAttribute[];
}

/** 技能参数 */
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

/** 天赋 */
export interface ITalent {
  name: string;
  /** 效果 */
  effects?: ITalentEffect[];
}

/** 天赋效果 */
export interface ITalentEffect {
  path: string;
  value: any;
}

/** 属性 */
export interface IAttr {
  type: BuffType;
  value: number;
}

/** 加成 */
export interface IBuff extends IAttr {
  cond?: BuffCondition;
  target?: BuffTarget;
  duration?: number;
  element?: ElementType;
  maxStack?: number;
  expr?: string;
}

/** 圣遗物组合效果 */
export interface IArtifactSetBonus {
  pieces: number;
  buffs: IBuff[];
}

/** 命之座 */
export interface IConstellation {
  name: string;
  buffs?: IBuff[];
  values?: number[];
}
