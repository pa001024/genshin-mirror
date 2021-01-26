import { getModelForClass, prop } from "@typegoose/typegoose";
import { User } from "./User";
import { UserArtifact } from "./UserArtifact";
import { IUserAvatar, IUserWeapon } from "~/modules/core";

/**
 * 角色
 *
 * @export
 * @class Char
 */
export class UserAvatar implements IUserAvatar {
  /** 拥有者 */
  @prop({ ref: () => User, index: true })
  public owner!: User;

  @prop({ type: String, required: true })
  public avatarId!: string;

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
  @prop({ ref: () => UserArtifact })
  public artifacts!: UserArtifact[];

  /** 武器 */
  @prop({ type: () => UserWeapon })
  public weapon?: UserWeapon;
}

class UserWeapon implements IUserWeapon {
  @prop({ type: String })
  public typeId!: string;

  @prop({ type: Number })
  public level!: number;

  @prop({ type: Number })
  public promoteLevel!: number;

  @prop({ type: Number })
  public refineLevel!: number;
}

export const UserAvatarModel = getModelForClass(UserAvatar);
