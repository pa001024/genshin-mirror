import { getModelForClass, prop } from "@typegoose/typegoose";
import { User } from "./user";
import type { IArtifact, IAttr } from "~/modules/core";

/**
 * 圣遗物
 *
 * @export
 * @class Artifact
 */
export class Artifact implements IArtifact {
  /** 拥有者 */
  @prop({ ref: () => User, index: true })
  public owner!: string;

  /** 部位 */
  @prop({ type: Number, required: true })
  public typeId!: number;

  /** 等级 */
  @prop({ type: Number, required: true, default: 0 })
  public level!: number;

  /** 主属性类型 */
  @prop({ type: Number, required: true })
  public main!: number;

  /** 副属性 */
  @prop({ type: () => [Attr] })
  public attrs!: Attr[];

  // 评分
  @prop({ type: Number })
  public score?: number;
}

/**
 * 属性
 *
 * @class Attr
 */
export class Attr implements IAttr {
  //
  @prop({ type: Number, required: true })
  type!: number;

  @prop({ type: Number, required: true })
  value!: number;
}

export const ArtifactModel = getModelForClass(Artifact);
