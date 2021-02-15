import { getModelForClass, prop } from "@typegoose/typegoose";
import { Field, ID, ObjectType } from "type-graphql";
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
  @prop({ ref: () => User, index: true })
  public author!: string;

  @Field()
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

  @Field()
  @prop({ required: true })
  public desc!: string;

  @Field(() => [UserAvatar])
  @prop({ type: UserAvatar })
  public avatars!: UserAvatar[];
}

export const UserBuildModel = getModelForClass(UserBuild);
