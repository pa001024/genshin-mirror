import { getModelForClass, prop, Ref } from "@typegoose/typegoose";
import { Field, ID, Int, ObjectType } from "type-graphql";
import { Types } from "mongoose";
import { User } from "./User";
import { UserArtifact } from "./UserArtifact";
import { UserWeapon } from "./UserWeapon";
import type { IUserAvatar } from "~/modules/core";

/**
 * 角色
 *
 * @export
 * @class Char
 */
@ObjectType()
export class UserAvatar implements IUserAvatar {
  @Field(() => ID)
  public id!: string;

  /** 拥有者 */
  @Field(() => User)
  @prop({ type: Types.ObjectId, index: true, required: true })
  public owner!: Ref<User>;

  @Field()
  @prop({ type: String, required: true })
  public avatarId!: string;

  /** 等级 */
  @Field(() => Int)
  @prop({ type: Number, required: true, default: 0 })
  public level!: number;

  /** 突破等级 */
  @Field(() => Int)
  @prop({ type: Number, required: true })
  public promoteLevel!: number;

  /** 命座等级 */
  @Field(() => Int)
  @prop({ type: Number, required: true })
  public talentLevel!: number;

  /** 普攻等级 */
  @Field(() => Int)
  @prop({ type: Number, required: true })
  public attackLevel!: number;

  /** E等级 */
  @Field(() => Int)
  @prop({ type: Number, required: true })
  public eLevel!: number;

  /** Q等级 */
  @Field(() => Int)
  @prop({ type: Number, required: true })
  public qLevel!: number;

  /** 圣遗物 */
  @Field(() => [UserArtifact], { nullable: true })
  @prop({ ref: UserArtifact })
  public artifacts?: UserArtifact[];

  /** 武器 */
  @Field(() => UserWeapon, { nullable: true })
  @prop({ ref: "UserWeapon" })
  public weapon?: UserWeapon;
}

export const UserAvatarModel = getModelForClass(UserAvatar);
