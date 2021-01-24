import { IArtifactType, IAttr } from "./interface";
import { IArtifact, ARTIFACT } from ".";

const data: IArtifactType[] = require("~/content/en/relic/relic");
const dataMap = data.reduce<{ [x: number]: IArtifactType }>((r, v) => (r[v.id] = v) && r, {});

export class Artifact {
  /** 静态数据 */
  data: IArtifact;
  type: IArtifactType;
  constructor(artifact: IArtifact) {
    this.data = artifact;
    this.type = dataMap[artifact.typeId];
  }

  lazy = false;

  /// 动态数据

  private _level = 20;
  /** 等级 */
  public get level() {
    return this._level;
  }

  public set level(value) {
    this._level = Math.max(this._minLevel, Math.min(this._maxLevel, value));
  }

  private _minLevel: number = 0;
  public get minLevel(): number {
    return this._minLevel;
  }

  private _maxLevel: number = 20;
  public get maxLevel(): number {
    return this._maxLevel;
  }

  get attrs() {
    const mainAttr: IAttr = {
      type: this.data.main,
      value: ARTIFACT.MAIN_PROPERTY_CURVE[this.type.rarity][this._level][this.data.main],
    };
    return [mainAttr, ...this.data.attrs];
  }
}
