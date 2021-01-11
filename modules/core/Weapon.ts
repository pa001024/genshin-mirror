import { IWeapon, WEAPON } from ".";

export class Weapon {
  data: IWeapon;
  level: number = 20;
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
}
