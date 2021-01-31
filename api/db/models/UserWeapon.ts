import { getModelForClass, prop } from "@typegoose/typegoose";
import { User } from "./User";
import type { IUserWeapon } from "~/modules/core";

/**
 * 圣遗物
 *
 * @export
 * @class Weapon
 */
export class UserWeapon implements IUserWeapon {
  /** 拥有者 */
  @prop({ ref: () => User, index: true, required: true })
  public owner!: User | string;

  /** 类型id */
  @prop({ type: String, required: true })
  public weaponId!: string;

  /** 等级 */
  @prop({ type: Number, required: true, default: 1 })
  public level!: number;

  /** 突破等级 */
  @prop({ type: Number, required: true })
  public promoteLevel!: number;

  /** 精炼等级 */
  @prop({ type: Number, required: true })
  public refineLevel!: number;
}

export const UserWeaponModel = getModelForClass(UserWeapon);
