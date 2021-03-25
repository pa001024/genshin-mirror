import { Resolver, Query, Mutation, Arg, Authorized, Ctx, InputType, Field, FieldResolver, Root } from "type-graphql";
import { JWTContext } from "../util";
import { User, UserModel, UserBuild, UserBuildModel, UserAvatar } from "../../db";

@InputType()
class UserBuildInput {
  @Field({ nullable: true })
  public id?: string;

  @Field({ nullable: true })
  public title?: string;

  @Field(() => [String], { nullable: true })
  public cores?: string[];

  @Field(() => [String], { nullable: true })
  public tags?: string[];

  @Field({ nullable: true })
  public cover?: string;

  @Field({ nullable: true })
  public desc?: string;

  @Field({ description: "JSON" })
  public avatars!: string;
}

@Resolver(UserBuild)
export class UserBuildResolver {
  @Authorized()
  @Query(() => [UserBuild])
  /** 用户构筑 */
  async userBuilds(@Ctx() ctx: JWTContext) {
    const build = await UserBuildModel.find({ author: ctx.user.uid });
    return build.map(v => ({ ...v.toObject(), id: v.id.toString() }));
  }

  @Authorized()
  @Query(() => [UserBuild])
  /** 用户构筑 */
  async userBuild(@Ctx() ctx: JWTContext, @Arg("id") id: string) {
    const build = await UserBuildModel.find({ author: ctx.user.uid, _id: id });
    return build;
  }

  @Authorized()
  @Mutation(() => UserBuild)
  async setUserBuild(@Ctx() ctx: JWTContext, @Arg("data") data: UserBuildInput) {
    const build = await UserBuildModel.findOne({ author: ctx.user.uid, _id: data.id });

    // 不存在则新建
    if (!build) {
      const newData = await UserBuildModel.create({
        author: ctx.user.uid,
        title: data.title,
        cores: data.cores || [],
        tags: data.tags || [],
        cover: data.cover,
        desc: data.desc,
        avatars: data.avatars && JSON.parse(data.avatars),
      });
      return newData;
    } else {
      // 存在则更新
      build.title = data.title;
      build.cores = data.cores || [];
      build.tags = data.tags || [];
      build.cover = data.cover;
      build.desc = data.desc;
      build.avatars = data.avatars && JSON.parse(data.avatars);
      await build.save();
      return build;
    }
  }

  @Authorized()
  @Mutation(() => UserBuild)
  async removeUserBuild(@Ctx() ctx: JWTContext, @Arg("id") id: string) {
    const item = await UserBuildModel.findOneAndDelete({ author: ctx.user.uid, _id: id });
    return item;
  }

  @FieldResolver(() => User)
  async author(@Root() build: UserBuild) {
    const user = await UserModel.findById(build.author);
    return user;
  }
}
