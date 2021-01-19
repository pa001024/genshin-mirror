import { IWeapon, WEAPON } from ".";

export class Weapon {
  data: IWeapon;
  /** 当前等级 */
  level: number = 20;
  /** 突破等级 0~7 (游戏内显示的星数) */
  ascensionLevel = 0;
  enhance: number = 1;
  constructor(weapon: IWeapon) {
    this.data = weapon;
  }

  get baseLevel() {
    return this.level - (WEAPON.MAX_BASE_LEVEL[this.ascensionLevel - 1] || 0);
  }

  get baseATK() {
    return this.data.baseATK;
  }

  // TODO 成本: 经验
  get expCost() {
    return WEAPON.EXP_COST[this.data.rarity][this.ascensionLevel];
  }

  // TODO 成本: 经验
  get goldCost() {
    return WEAPON.GOLD_COST[this.data.rarity][this.ascensionLevel];
  }
}
