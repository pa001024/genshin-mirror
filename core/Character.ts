import { CHARACTER } from "./constant";
import { IArtifact, ICharacter, Weapon } from ".";

export class Character {
  /** 静态数据 */
  readonly data: ICharacter;

  /// 动态数据
  /** 角色等级 */
  level = 20;
  /** 突破等级 */
  ascensionLevel = 0;
  /** 命座等级 */
  constellationLevel = 0;

  /** 武器 */
  weapon?: Weapon;

  /** 圣遗物 */
  artifacts: IArtifact[] = [];

  constructor(data: ICharacter) {
    this.data = data;
  }

  /** 突破层基础等级 */
  get baseLevel() {
    return this.level - CHARACTER.MAX_BASE_LEVEL[this.ascensionLevel];
  }

  /** 升级所需经验 */
  get levelCostExp() {
    const last = CHARACTER.EXP_TO_NEXT_LEVEL[this.ascensionLevel - 1] || 0;
    const current = CHARACTER.EXP_TO_NEXT_LEVEL[this.ascensionLevel];
    return current - (current - last) * this.baseLevel;
  }

  /** 升级所需摩拉 */
  get levelCostGold() {
    const last = CHARACTER.GOLD_TO_NEXT_LEVEL[this.ascensionLevel - 1] || 0;
    const current = CHARACTER.GOLD_TO_NEXT_LEVEL[this.ascensionLevel];
    return current - (current - last) * this.baseLevel;
  }

  /** 基础生命值 */
  get baseHP() {
    const current = this.data.baseHP[this.ascensionLevel * 2];
    const next = this.data.baseHP[this.ascensionLevel * 2 + 1];
    return current + (next - current) * this.baseLevel;
  }

  /** 人物基础攻击力 */
  get charBaseATK() {
    const current = this.data.baseATK[this.ascensionLevel * 2];
    const next = this.data.baseATK[this.ascensionLevel * 2 + 1];
    return current + (next - current) * this.baseLevel;
  }

  get baseATK() {
    return (this.weapon?.baseATK || 0) + this.charBaseATK;
  }

  /** 基础防御力 */
  get baseDEF() {
    const current = this.data.baseDEF[this.ascensionLevel * 2];
    const next = this.data.baseDEF[this.ascensionLevel * 2 + 1];
    return current + (next - current) * this.baseLevel;
  }
}
