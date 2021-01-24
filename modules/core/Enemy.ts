import { ENEMY } from "./constant";
import { IEnemy } from ".";

export class Enemy {
  /** 静态数据 */
  readonly data: IEnemy;

  constructor(data: IEnemy) {
    this.data = data;
  }

  /// 动态数据
  private _level = 90;
  /** 等级 */
  public get level() {
    return this._level;
  }

  public set level(value) {
    this._level = Math.max(this._minLevel, Math.min(this._maxLevel, value));
  }

  private _minLevel: number = 1;
  public get minLevel(): number {
    return this._minLevel;
  }

  private _maxLevel: number = 200;
  public get maxLevel(): number {
    return this._maxLevel;
  }

  /** 基础生命值 */
  get baseHP() {
    const base = this.data.baseHP * ENEMY.CURVE.GROW_CURVE_HP[this._level - 1];
    return base;
  }

  /** 基础攻击力 */
  get baseATK() {
    const base = this.data.baseATK * ENEMY.CURVE.GROW_CURVE_ATTACK[this._level - 1];
    return base;
  }

  /** 基础防御力 */
  get baseDEF() {
    const base = this.data.baseDEF * ENEMY.CURVE.GROW_CURVE_DEFENSE[this._level - 1];
    return base;
  }
}
