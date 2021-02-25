import { getModelForClass, prop, Ref } from "@typegoose/typegoose";
import { Field, ID, ObjectType } from "type-graphql";
import { Types } from "mongoose";
import { User } from "./User";
import { UserAvatar } from "./UserAvatar";
import type { IUserBuild } from "~/modules/core";

/**
 * 圣遗物
 *
 * @export
 * @class Build
 */
@ObjectType()
export class UserBuild implements IUserBuild {
  @Field(() => ID)
  public id!: string;

  /** 作者 */
  @Field(() => User)
  @prop({ type: Types.ObjectId, index: true, required: true })
  public author!: Ref<User>;

  @Field({ nullable: true })
  @prop()
  public title?: string;

  @Field(() => [String])
  @prop({ type: String })
  public cores!: string[];

  @Field(() => [String])
  @prop({ type: String })
  public tags!: string[];

  @Field({ nullable: true })
  @prop()
  public cover?: string;

  @Field({ nullable: true })
  @prop()
  public desc?: string;

  @Field(() => [UserAvatar])
  @prop({ type: UserAvatar, _id: false })
  public avatars!: UserAvatar[];
}

export const UserBuildModel = getModelForClass(UserBuild);
