import { IEnemy } from ".";

export class Enemy {
  /** 静态数据 */
  readonly data: IEnemy;

  /// 动态数据
  /** 角色等级 */
  level = 20;
  constructor(data: IEnemy) {
    this.data = data;
  }
}
