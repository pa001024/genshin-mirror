import consola from "consola";
import { Resolver, Query, Mutation, Arg, Authorized, Ctx, InputType, Field, FieldResolver, Root } from "type-graphql";
import { JWTContext } from "../util";
import { User, UserAvatar, UserAvatarModel, UserModel } from "../../db";

@InputType()
class UserAvatarInput {
  @Field()
  public avatarId!: string;

  /** 等级 */
  @Field()
  public level!: number;

  /** 突破等级 */
  @Field()
  public promoteLevel!: number;

  /** 命座等级 */
  @Field()
  public talentLevel!: number;

  /** 普攻等级 */
  @Field()
  public attackLevel!: number;

  /** E等级 */
  @Field()
  public eLevel!: number;

  /** Q等级 */
  @Field()
  public qLevel!: number;
}

@Resolver(() => UserAvatar)
export class UserAvatarResolver {
  @Authorized()
  @Query(() => [UserAvatar])
  /** 用户角色 */
  async userCharacters(@Ctx() ctx: JWTContext) {
    const avatar = await UserAvatarModel.find({ owner: ctx.user.uid });
    return avatar.map(v => ({ ...v.toObject(), id: v.id.toString() }));
  }

  @Authorized()
  @Mutation(() => UserAvatar)
  async setUserCharacter(@Ctx() ctx: JWTContext, @Arg("data") data: UserAvatarInput) {
    const avatar = await UserAvatarModel.findOne({ owner: ctx.user.uid, avatarId: data.avatarId });

    // 不存在则新建
    if (!avatar) {
      const newData = await UserAvatarModel.create({
        owner: ctx.user.uid,
        avatarId: data.avatarId,
        level: data.level,
        promoteLevel: data.promoteLevel,
        talentLevel: data.talentLevel,
        attackLevel: data.attackLevel,
        eLevel: data.eLevel,
        qLevel: data.qLevel,
      });
      return newData;
    } else {
      // 存在则更新
      avatar.avatarId = data.avatarId;
      avatar.level = data.level;
      avatar.promoteLevel = data.promoteLevel;
      avatar.talentLevel = data.talentLevel;
      avatar.attackLevel = data.attackLevel;
      avatar.eLevel = data.eLevel;
      avatar.qLevel = data.qLevel;
      await avatar.save();
      return avatar;
    }
  }

  @Authorized()
  @Mutation(() => UserAvatar)
  async removeUserCharacter(@Ctx() ctx: JWTContext, @Arg("id") id: string) {
    const item = await UserAvatarModel.findOneAndDelete({ owner: ctx.user.uid, avatarId: id });
    return item;
  }

  @FieldResolver(() => User)
  async owner(@Root() avatar: UserAvatar) {
    const user = await UserModel.findById(avatar.owner);
    return user;
  }
}
