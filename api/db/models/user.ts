import { getModelForClass, prop } from "@typegoose/typegoose";

/**
 * 用户
 *
 * @export
 * @class User
 */
export class User {
  @prop({ type: String, required: true, unique: true })
  public email!: string;

  @prop({ type: String })
  public username?: string;

  // 类型 普通用户=1
  @prop({ type: Number })
  public type?: number;

  // password
  @prop({ type: String, required: true })
  public pass!: string;

  // 旅行者性别
  @prop({ type: Number })
  public travelerGender!: number;

  // 平台
  @prop({ type: String })
  public platform!: string;

  // 服务器
  @prop({ type: String })
  public server!: string;

  // 圣遗物hash
  @prop({ type: String })
  public artifactHash!: string;
}

export const UserModel = getModelForClass(User);
