import bcrypt from "bcrypt";
import { Length, IsEmail } from "class-validator";
import { Resolver, Query, Mutation, Arg, ObjectType, Field, Ctx, InputType, Authorized } from "type-graphql";
import { nanoid } from "nanoid";
import { JWTContext, signUser } from "../util";
import { User, UserModel } from "../../db";
import { sendMail } from "../util/sendMail";
import { redis } from "../../redis";
import { IsEmailAlreadyExist } from "./validator/IsEmailAlreadyExist";

export async function createConfirmationUrl(uid: string) {
  const token = nanoid();
  await redis.set("user-confirmation:" + token, uid, "ex", 60 * 60 * 24); // 1 day expiration

  return `${process.env.BASE_URL}/user/confirm/${token}`;
}

@ObjectType()
class AuthInfo {
  @Field()
  code!: number;

  @Field({ nullable: true })
  token?: string;

  @Field({ nullable: true })
  message?: string;
}

@InputType()
class RegisterInput {
  @Field()
  @Length(2, 40)
  username!: string;

  @Field()
  @IsEmail()
  @IsEmailAlreadyExist({ message: "email already in use" })
  email!: string;

  @Field()
  password!: string;
}

@Resolver()
export class AuthResolver {
  @Authorized()
  @Query(() => User, { nullable: true })
  async me(@Ctx() ctx: JWTContext) {
    if (!ctx.user) return;
    const user = await UserModel.findById(ctx.user.uid);
    return user;
  }

  @Mutation(() => AuthInfo)
  /** 用户注册 */
  async signup(@Arg("data") data: RegisterInput) {
    const { email, username, password } = data;
    const user = await UserModel.findOne({ email });
    if (user) return { code: 403, message: "user exists" };

    const pass = await bcrypt.hash(password, 11);

    const newUser = new UserModel({ email, username, pass, type: 1 });
    await newUser.save();

    const sign = signUser(newUser);

    await sendMail(email, await createConfirmationUrl(newUser.id));

    return { code: 200, token: "Bearer " + sign };
  }

  @Mutation(() => AuthInfo, { nullable: true })
  /** 用户登录 */
  async login(
    // 参数
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Ctx() ctx: JWTContext
  ) {
    const user = await UserModel.findOne({ email }).select("+pass");

    if (user) {
      const match = await bcrypt.compare(password, user.pass);

      if (match) {
        const sign = signUser(user);
        ctx.res.setCookie("apollo-token", sign, {
          expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1e3), // 15d
          httpOnly: true,
          sameSite: true,
          secure: process.env.NODE_ENV === "production",
        });
        return { code: 200, token: "Bearer " + sign };
      }
    }

    return null;
  }

  @Mutation(() => AuthInfo, { nullable: true })
  async logout(@Ctx() ctx: JWTContext) {
    if (ctx.user) {
      ctx.res.clearCookie("apollo-token");
      return { code: 200 };
    }

    return null;
  }
}
