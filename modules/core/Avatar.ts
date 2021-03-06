import { AVATAR } from "./constant";
import { BuffType } from "./enum";
import { IArtifact, IAvatar, Weapon, IUserAvatar } from ".";

export class Avatar implements IUserAvatar {
  /** 静态数据 */
  readonly data: IAvatar;
  readonly avatarId: string;

  constructor(data: IAvatar) {
    this.data = data;
    this.avatarId = data.id;
  }

  attackLevel: number = 1;
  eLevel: number = 1;
  qLevel: number = 1;

  lazy = false;

  /// 动态数据
  private _level = 90;
  /** 等级 */
  public get level() {
    return this._level;
  }

  public set level(value) {
    this._level = Math.max(this._minLevel, Math.min(this._maxLevel, value));
  }

  private _minLevel: number = 80;
  public get minLevel(): number {
    return this._minLevel;
  }

  private _maxLevel: number = 90;
  public get maxLevel(): number {
    return this._maxLevel;
  }

  /** 突破等级 */
  private _promoteLevel = 6;
  public get promoteLevel() {
    return this._promoteLevel;
  }

  public set promoteLevel(value) {
    if (this._promoteLevel !== value) {
      this._promoteLevel = value;
      this._minLevel = [1, 20, 40, 50, 60, 70, 80][value];
      this._maxLevel = this._level = [20, 40, 50, 60, 70, 80, 90][value];
    }
  }

  /** 命座等级 */
  talentLevel = 0;

  /** 武器 */
  weapon?: Weapon;

  /** 圣遗物 */
  artifacts: IArtifact[] = [];

  /** 基础生命值 */
  get baseHP() {
    const base = this.data.baseHP * AVATAR.CURVE[this.data.rarity][this._level - 1];
    const promote = this.data.ascensions[this._promoteLevel - 1]?.HP || 0;
    return base + promote;
  }

  /** 人物基础攻击力 */
  get charBaseATK() {
    const base = this.data.baseATK * AVATAR.CURVE[this.data.rarity][this._level - 1];
    const promote = this.data.ascensions[this._promoteLevel - 1]?.ATK || 0;
    return base + promote;
  }

  /** 总基础攻击力 */
  get baseATK() {
    return (this.weapon?.baseATK || 0) + this.charBaseATK;
  }

  /** 基础防御力 */
  get baseDEF() {
    const base = this.data.baseDEF * AVATAR.CURVE[this.data.rarity][this._level - 1];
    const promote = this.data.ascensions[this._promoteLevel - 1]?.DEF || 0;
    return base + promote;
  }

  /** 突破加成 */
  get extra() {
    const promote = this.data.ascensions[this._promoteLevel - 1]?.extra || 0;
    return promote;
  }

  /** 暴击率 */
  get critRate() {
    const art = this.artifacts.reduce(
      (r, v) =>
        r +
        v.attrs
          .filter(a => a.type === BuffType.CRITRate)
          .map(a => a.value)
          .reduce((a, b) => a + b),
      0
    );
    return 5 + art;
  }

  /** 暴击伤害 */
  get critDMG() {
    const art = this.artifacts.reduce(
      (r, v) =>
        r +
        v.attrs
          .filter(a => a.type === BuffType.CRITDMG)
          .map(a => a.value)
          .reduce((a, b) => a + b),
      0
    );
    return 50 + art;
  }

  /** 稀有度 4/5 */
  get rarity() {
    return this.data.rarity;
  }
}
