import { getModelForClass, prop, Ref } from "@typegoose/typegoose";
import { Field, ID, Int, ObjectType } from "type-graphql";
import { Types } from "mongoose";
import { User } from "./User";
import type { IUserWeapon } from "~/modules/core";

/**
 * 圣遗物
 *
 * @export
 * @class Weapon
 */
@ObjectType()
export class UserWeapon implements IUserWeapon {
  @Field(() => ID)
  public id!: string;

  /** 拥有者 */
  @Field(() => User)
  @prop({ type: Types.ObjectId, index: true, required: true })
  public owner!: Ref<User>;

  /** 类型id */
  @Field()
  @prop({ required: true })
  public weaponId!: string;

  /** 等级 */
  @Field(() => Int)
  @prop({ required: true, default: 1 })
  public level!: number;

  /** 突破等级 */
  @Field(() => Int)
  @prop({ required: true })
  public promoteLevel!: number;

  /** 精炼等级 */
  @Field(() => Int)
  @prop({ required: true })
  public refineLevel!: number;
}

export const UserWeaponModel = getModelForClass(UserWeapon);
