import { Resolver, Query, Mutation, Arg, Authorized, Ctx, InputType, Field, FieldResolver, Root } from "type-graphql";
import { JWTContext } from "../util";
import { User, UserModel, UserWeapon, UserWeaponModel } from "../../db";

@InputType()
class UserWeaponInput {
  @Field()
  public weaponId!: string;

  @Field()
  public level!: number;

  @Field()
  public promoteLevel!: number;

  @Field()
  public refineLevel!: number;
}

@Resolver(() => UserWeapon)
export class UserWeaponResolver {
  @Authorized()
  @Query(() => [UserWeapon])
  /** 用户角色 */
  async userWeapons(@Ctx() ctx: JWTContext) {
    const weapon = await UserWeaponModel.find({ owner: ctx.user.uid });
    return weapon.map(v => ({ ...v.toObject(), id: v.id.toString() }));
  }

  @Authorized()
  @Mutation(() => UserWeapon)
  async setUserWeapon(@Ctx() ctx: JWTContext, @Arg("data") data: UserWeaponInput) {
    const weapon = await UserWeaponModel.findOne({ owner: ctx.user.uid, weaponId: data.weaponId });

    // 不存在则新建
    if (!weapon) {
      const newData = await UserWeaponModel.create({
        owner: ctx.user.uid,
        weaponId: data.weaponId,
        level: data.level,
        promoteLevel: data.promoteLevel,
        refineLevel: data.refineLevel,
      });
      return newData;
    } else {
      // 存在则更新
      weapon.weaponId = data.weaponId;
      weapon.level = data.level;
      weapon.promoteLevel = data.promoteLevel;
      weapon.refineLevel = data.refineLevel;
      await weapon.save();
      return weapon;
    }
  }

  @Authorized()
  @Mutation(() => UserWeapon)
  async removeUserWeapon(@Ctx() ctx: JWTContext, @Arg("id") id: string) {
    const item = await UserWeaponModel.findOneAndDelete({ owner: ctx.user.uid, weaponId: id });
    return item;
  }

  @FieldResolver(() => User)
  async owner(@Root() weapon: UserWeapon) {
    const user = await UserModel.findById(weapon.owner);
    return user;
  }
}
