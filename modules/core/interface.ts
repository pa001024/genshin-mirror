import {
  BuffCondition,
  BuffType,
  ElementType,
  Region,
  WeaponType,
  BuffTarget,
  ReactionType,
  BodyType,
  MaterialType,
  EnemyType,
  ArtifactType,
  DungeonType,
} from "./enum";

export interface IUser {
  uid: string;
  username: string;
  artifacts: IArtifact[];
  weapons: IUserWeapon[];
}

/** 武器 */
export interface IUserWeapon {
  /** 武器ID */ weaponId: string;
  /** 等级 */ level: number;
  /** 突破等级 */ promoteLevel: number;
  /** 精炼等级 */ refineLevel: number;
}

/** 武器类型 */
export interface IWeapon {
  /** 序号 */ uid: number;
  /** 序号 */ id: string;
  /** 名称 */ name: string;
  /** 本地化名称 */ localeName: string;
  /** 描述 */ desc?: string;
  /** 类型 */ type: WeaponType;
  /** 稀有度 */ rarity: number;
  /** 基础攻击力 */ baseATK: number;
  /** 基础攻击力成长曲线 */ baseATKCurve: number;
  /** 武器突破阶段 */ ascensions: IWeaponAscension[];
  /** 副属性类型 */ subAttr?: IWeaponSubAttr;
  /** 特效 */ affix?: IWeaponAffix;
  /** 概览物品 */ overviewItems?: IItem[];
}

/** 武器突破阶段 */
export interface IWeaponAscension {
  level: number;
  baseATK: number;
  cost: IItemStack[];
}

/** 武器特效 */
export interface IWeaponAffix {
  name: string;
  levels: IWeaponAffixLevel[];
}

export interface IWeaponAffixLevel {
  /** 描述 */ desc: string;
  /** 属性 */ attrs?: IAttr[];
  /** 参数 */ params: number[];
}

/** 圣遗物 */
export interface IArtifact {
  /** 套装和部位引用id ref: IArtifactType */ typeId: number;
  /** 等级 */ level: number;
  /** 主属性 */ main: BuffType;
  /** 副属性 */ attrs: IAttr[];
}

/** 圣遗物类型 */
export interface IArtifactType {
  /** 用于索引 */ id: number;
  /** 图片 */ name: string;
  /** 本地化名称 */ localeName: string;
  /** 描述 */ desc: string;
  /** 稀有度 */ rarity: number;
  /** 部位 */ type: ArtifactType;
  /** 套装 ref: IArtifactSet */ setId: number;
}

/** 圣遗物套装 */
export interface IArtifactSet {
  /** 用于索引 */ id: number;
  /** 图片 */ name: string;
  /** 本地化名称 */ localeName: string;
  /** 套装等级 */ levels: IArtifactSetLevel[];
}

export interface IArtifactSetLevel {
  /** 激活条件 */ need: number;
  /** 描述 */ desc: string;
  /** 增幅 */ attrs: IAttr[];
  /** 参数 */ params: number[];
}

export interface IUserAvatar {
  avatarId: string;
  /** ref IAvatar.id */
  data?: IAvatar;

  /** 等级 */
  level: number;
  /** 突破等级 */
  promoteLevel: number;
  /** 命座等级 */
  talentLevel: number;
  /** 普攻等级 */
  attackLevel: number;
  /** E等级 */
  eLevel: number;
  /** Q等级 */
  qLevel: number;
  /** 圣遗物 */
  artifacts?: IArtifact[];
  /** 武器 */
  weapon?: IUserWeapon;
}

/** 角色 */
export interface IAvatar {
  /** uid */ uid: number;
  /** id */ id: string;
  /** 本地化名称 */ localeName: string;
  /**
   * 名字
   *
   * @type {string}
   * @example 迪卢克
   */
  name: string;

  /**
   * 描述
   *
   * @type {string}
   */
  desc: string;

  /**
   * 体型
   *
   * @type {BodyType}
   */
  bodyType: BodyType;

  /**
   * 地区
   *
   * @type {string}
   * @example 1(蒙德)
   */
  region: Region;

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

  /** 概览物品 */
  overviewItems?: IItem[];

  /** 基础生命 */ baseHP: number;
  /** 基础攻击 */ baseATK: number;
  /** 基础防御 */ baseDEF: number;
  /** 突破属性 */ ascensions: IAscensionPhase[];
  /** 突破属性 */ ascensionType: BuffType;
  /** 普通攻击 */ attackSkill?: ISkill;
  /** 元素战技 */ elemSkill?: ISkill;
  /** 元素爆发 */ elemBurst?: ISkill;
  /** 天赋 */ talents?: ITalent[];
  /** 命座提升 */ c13ns?: IConstellation[];
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

/** 突破 */
export interface IAscensionPhase {
  level: number;
  itemCost: IItemStack[];
  HP: number;
  ATK: number;
  DEF: number;
  extra: number;
}
/** 突破 */
export interface IAscension {
  level: number;
  itemCost: IItemStack[];
  attrs: IAttr[];
}

/** 物品 */
export interface IItemStack {
  id: string;
  localeName: string;
  rarity?: number;
  count: number;
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
  localeName: string;
  desc: string;
  cd: number;
  energyCost?: number;
  charges?: number;
  paramTpls?: string[];
  paramVals?: number[][];
  costItems?: IItemStack[][];
  attrs?: ISkillAttribute[]; // 人工补充
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
  localeName: string;
  desc: string;
  unlock?: number;
  unlockDesc?: string;
  tpl?: string[];
  values?: number[];
}

/** 命之座 */
export interface IConstellation {
  name: string;
  localeName: string;
  desc: string;
  values?: number[];
  buffs?: IBuff[];
}

/** 属性 */
export interface IAttr {
  type: BuffType;
  value: number;
}
export interface IWeaponSubAttr {
  type: BuffType;
  value: number;
  curve: number;
}

/** 加成 */
export interface IBuff extends IAttr {
  cond?: BuffCondition;
  trigger?: BuffCondition;
  target?: BuffTarget;
  duration?: number;
  chance?: number;
  cd?: number;
  element?: ElementType; // for type == ElementalReactionDMG/ElementalAffectDuration
  reaction?: ReactionType[]; // for cond == ElementalReaction
  maxStack?: number;
  expr?: string;
}

/** 圣遗物组合效果 */
export interface IArtifactSetBonus {
  pieces: number;
  buffs: IBuff[];
}

export interface IEnemy {
  id: string;
  name: string;
  type: EnemyType;
  localeName: string;
  desc?: string;
  /** 基础生命 */ baseHP: number;
  /** 基础攻击 */ baseATK: number;
  /** 基础防御 */ baseDEF: number;
}

export interface IItem {
  uid?: number;
  id: string;
  name?: string;
  localeName?: string;
  desc?: string;
  type?: MaterialType;
  typeText?: string;
  rarity: number;
  drop?: string[];
}

export interface IUserBuild {
  /** 标识符 */ id?: string;
  /** 标题 */ title?: string;
  /** 核心角色id */ cores?: string[];
  /** 标签 */ tags?: string[];
  /** 封面图片地址 */ cover?: string;
  /** 描述 */ desc?: string;
  /** 角色 */ avatars: (IUserAvatar | null)[];
}

export interface IDungeon {
  id: number;
  name: string;
  localeName: string;
  desc: string;
  elements: ElementType[];
  type: DungeonType;
}
