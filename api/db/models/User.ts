import { Types } from "mongoose";
import { getModelForClass, pre, prop, Ref } from "@typegoose/typegoose";
import { Field, ID, ObjectType } from "type-graphql";
import { UserAvatar } from "./UserAvatar";

export enum UserType {
  BANNED,
  NORMAL,
  ADMIN,
}

/**
 * 用户
 *
 * @export
 * @class User
 */
@pre<User>("save", function () {
  this.lastUpdate = new Date();
})
@ObjectType()
export class User {
  @Field(() => ID)
  public id!: string;

  @Field()
  @prop({ type: String, required: true, unique: true, index: true })
  public email!: string;

  @Field()
  @prop()
  public username?: string;

  // 类型 普通用户=1
  @Field()
  @prop({ enum: UserType, type: Number })
  public type?: UserType;

  // password
  @Field()
  @prop({ required: true, select: false })
  public pass!: string;

  // 旅行者性别
  @Field()
  @prop()
  public travelerGender!: number;

  // 平台
  @Field()
  @prop()
  public platform!: string;

  // 服务器
  @Field()
  @prop()
  public server!: string;

  // 最后更新
  @Field()
  @prop({ type: Date, default: Date.now })
  public lastUpdate!: Date;

  // 最后登录
  @Field()
  @prop({ type: Date, default: Date.now })
  public lastLogin!: Date;

  @prop({
    ref: () => UserAvatar,
    foreignField: "owner",
    localField: "_id",
  })
  public avatars?: Ref<UserAvatar>[];
}

export const UserModel = getModelForClass(User);
