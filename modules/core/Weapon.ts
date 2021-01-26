import { IAttr } from "./interface";
import { IWeapon, WEAPON, IUserWeapon } from ".";

export class Weapon implements IUserWeapon {
  /** 静态数据 */
  data: IWeapon;
  typeId: string;
  constructor(weapon: IWeapon) {
    this.typeId = weapon.id;
    this.data = weapon;
  }

  /** 精练等级 */
  refineLevel = 1;

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

  private _promoteLevel = 6;
  /** 突破等级 */
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

  /** 基础攻击力 */
  get baseATK() {
    const base = this.data.baseATK * WEAPON.CURVE[this.data.baseATKCurve][this._level - 1];
    const promote = this.data.ascensions[this._promoteLevel - 1]?.baseATK || 0;
    return base + promote;
  }

  /** 副属性 */
  get subAttr(): IAttr | null {
    if (!this.data.subAttr) return null;
    const base = this.data.subAttr.value * WEAPON.CURVE[this.data.subAttr.curve][this._level - 1];
    return { type: this.data.subAttr.type, value: base };
  }
}
