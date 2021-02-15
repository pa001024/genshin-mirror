import { getModelForClass, prop, Ref } from "@typegoose/typegoose";
import { Field, ID, Int, ObjectType } from "type-graphql";
import { Types } from "mongoose";
import { User } from "./User";
import type { IArtifact as IUserArtifact, IAttr } from "~/modules/core";

/** 属性 */
@ObjectType()
export class Attr implements IAttr {
  @Field()
  @prop({ required: true })
  type!: number;

  @Field()
  @prop({ required: true })
  value!: number;
}

/** 圣遗物 */
@ObjectType()
export class UserArtifact implements IUserArtifact {
  @Field(() => ID)
  public id!: string;

  /** 拥有者 */
  @Field(() => User)
  @prop({ type: Types.ObjectId, index: true, required: true })
  public owner!: Ref<User>;

  /** 类型id */
  @Field(() => Int)
  @prop({ required: true })
  public typeId!: number;

  /** 等级 */
  @Field(() => Int)
  @prop({ required: true, default: 0 })
  public level!: number;

  /** 主属性类型 */
  @Field(() => Int)
  @prop({ required: true })
  public main!: number;

  /** 副属性 */
  @Field(() => [Attr])
  @prop({ type: Attr })
  public attrs!: Attr[];

  // 评分
  @Field()
  @prop()
  public score?: number;
}

export const UserArtifactModel = getModelForClass(UserArtifact);
