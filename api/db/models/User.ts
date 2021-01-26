import { getModelForClass, pre, prop } from "@typegoose/typegoose";

/**
 * 用户
 *
 * @export
 * @class User
 */
@pre<User>("save", function () {
  this.lastUpdate = new Date();
})
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

  // 最后更新
  @prop({ type: Date, default: Date.now })
  public lastUpdate!: Date;

  // 最后登录
  @prop({ type: Date, default: Date.now })
  public lastLogin!: Date;
}

export const UserModel = getModelForClass(User);
