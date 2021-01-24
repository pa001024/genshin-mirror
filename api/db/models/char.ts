import { getModelForClass, prop } from "@typegoose/typegoose";
import { User } from "./user";
import { Artifact } from "./artifact";
import { IWeapon } from "~/modules/core";

/**
 * 角色
 *
 * @export
 * @class Char
 */
export class Char {
  /** 拥有者 */
  @prop({ ref: () => User, index: true })
  public owner!: string;

  /** 等级 */
  @prop({ type: Number, required: true, default: 0 })
  public level!: number;

  /** 突破等级 */
  @prop({ type: Number, required: true })
  public promoteLevel!: number;

  /** 命座等级 */
  @prop({ type: Number })
  public talentLevel!: number;

  /** 普攻等级 */
  @prop({ type: Number })
  public attackLevel!: number;

  /** E等级 */
  @prop({ type: Number })
  public eLevel!: number;

  /** Q等级 */
  @prop({ type: Number })
  public qLevel!: number;

  /** 圣遗物 */
  @prop({ ref: () => Artifact })
  public artifacts!: Artifact[];

  /** 武器 */
  @prop({ type: () => Weapon })
  public weaponId!: Weapon;
}

class Weapon implements IWeapon {
  @prop({ type: Number })
  public typeId!: number;

  @prop({ type: Number })
  public level!: number;

  @prop({ type: Number })
  public promoteLevel!: number;
}

export const CharModel = getModelForClass(Char);
