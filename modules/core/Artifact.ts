import { base62, debase62 } from "../util/base62";
import { IArtifactType, IAttr } from "./interface";
import { IArtifact, ARTIFACT } from ".";

// move to component created()
// const data: IArtifactType[] = require("~/content/en/relic/relic");
// const dataMap = data.reduce<{ [x: number]: IArtifactType }>((r, v) => (r[v.id] = v) && r, {});

export interface IRelicMap {
  [x: number]: IArtifactType;
}

export class Artifact implements IArtifact {
  /** 静态数据 */
  data: IArtifact;
  type: IArtifactType;
  constructor(artifact: IArtifact, relicMap: IRelicMap = {}) {
    this.data = artifact;
    this.type = relicMap[artifact.typeId];
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
      value: ARTIFACT.MAIN_PROPERTY_CURVE[this.type.rarity - 1][this._level][ARTIFACT.MAIN_PROPERTY_CURVE_ORDER[this.data.main]],
    };
    return [mainAttr, ...this.data.attrs];
  }

  private _attrPowerUpInfo = [];
  public get attrPowerUpInfo() {
    return this._attrPowerUpInfo;
  }

  /** 主属性 */
  get main() {
    return this.data.main;
  }

  /** 类型id */
  get typeId() {
    return this.data.typeId;
  }

  /**
   * 回溯副属性强化情况 (高开销)
   */
  getPowerupInfo() {
    const pmap = new Map(ARTIFACT.SUB_PROPERTY[this.type.rarity - 1]);
    const maxN = ARTIFACT.MAX_POWERUP_PROPS[this.type.rarity - 1];
    return this.attrs.map(attr => {
      const probs = pmap.get(attr.type)!;
      // TODO: 考虑缓存
      const rainbow = getNRainbow(probs, maxN);
      const params = rainbow.get(attr.value)! || [0, 0, 0, 0];
      return {
        ...attr,
        params,
        // 分解后数值
        values: [].concat(probs.map((v, i) => Array(params[i]).fill(v)) as any),
      } as IAttrPowerUpInfo;
    });
  }

  /**
   * 生成随机圣遗物
   *
   * @static
   * @param atype 类型
   * @param [level=0] 等级
   */
  static random(relicMap: IRelicMap, atype: IArtifactType | string | number, level = 0) {
    if (typeof atype === "string") atype = relicMap[+atype];
    else if (typeof atype === "number") atype = relicMap[atype];

    // 随机主属性
    const mainWeights = ARTIFACT.MAIN_PROPERTY_WEIGHT[atype.type];
    let total = mainWeights.reduce((r, [, w]) => r + w, 0) * Math.random();
    const main = mainWeights.find(([, w]) => (total -= w) < 0)![0];

    // 随机副属性
    const subCount = Math.max(0, ARTIFACT.MAX_SUB_PROPS[atype.rarity] - ~~(Math.random() + 0.5));
    const subs: IAttr[] = [];
    for (let i = 0; i < subCount; i++) {
      const used = [main, ...subs.map(v => v.type)];
      const subWeights = ARTIFACT.SUB_PROPERTY_WEIGHT.filter(v => !used.includes(v[0]));
      total = subWeights.reduce((r, [, w]) => r + w, 0) * Math.random();
      const sub = subWeights.find(([, w]) => (total -= w) < 0)![0];
      const valueRange = ARTIFACT.SUB_PROPERTY[atype.rarity].find(v => v[0] === sub)![1];
      const value = valueRange[~~(Math.random() * valueRange.length)];
      subs.push({ type: sub, value });
    }

    return new Artifact(
      {
        typeId: atype.id,
        level,
        main,
        attrs: subs,
      },
      relicMap
    );
  }

  // 序列化
  get code() {
    return this.attrs.reduce(
      (r, v) => r + (base62(v.type) + base62(v.type in ARTIFACT.ENCODE_RATIO ? v.value : v.value * 10, 2), 3),
      `${base62(this.typeId, 4)}${base62(this.main)}${base62(this.level)}`
    );
  }

  static fromCode(value: string, relicMap: IRelicMap = {}) {
    const typeId = debase62(value.substr(0, 4));
    const main = debase62(value.substr(4, 1));
    const level = debase62(value.substr(5, 1));
    const subs = value.substr(6);
    const attrs: IAttr[] = [];
    for (let i = 0; i < subs.length; i += 3) {
      const type = debase62(subs.substr(i, 1));
      attrs.push({
        type,
        value: debase62(subs.substr(i + 1, 2)) / (type in ARTIFACT.ENCODE_RATIO ? 1 : 1000),
      });
    }
    return new Artifact({ typeId, main, level, attrs }, relicMap);
  }

  static getTypeId(value: string) {
    const typeId = debase62(value.substr(0, 4));
    return typeId;
  }

  toString() {
    return this.type.localeName + " +" + this.level;
  }

  get localeName() {
    return this.type.localeName;
  }

  get desc() {
    return this.type.desc;
  }

  get part() {
    return this.type.type;
  }

  toJSON() {
    const {
      typeId,
      level,
      main,
      data: { attrs },
    } = this;
    return JSON.stringify({ typeId, level, main, attrs });
  }
}

/**
 * 获取w阶n次组合矩阵
 * 如2阶3次结果为
 * [3,0]
 * [2,1]
 * [1,2]
 * [0,3]
 *
 * @param w 宽度
 * @param n 深度
 */
function wnMatrix(w: number, n: number) {
  if (w === 1) return [[n]];
  const m: number[][] = [];
  for (let i = 0; i <= n; i++) {
    for (const rest of wnMatrix(w - 1, n - i)) {
      m.push([...rest, i]);
    }
  }
  return m;
}

/**
 * 获取特定值彩虹表
 *
 * @param values 取值范围
 * @param maxN 最大强化次数
 */
function getNRainbow(values: number[], maxN: number) {
  const all: number[][] = [].concat(
    ...(Array(maxN)
      .fill(0)
      .map((_, n) => wnMatrix(values.length, n + 1)) as any)
  );

  const vm = new Map(
    all.map(m => {
      const val = values.reduce((r, v, i) => r + v * m[i], 0);
      return [+val.toFixed(1), m];
    })
  );

  return vm;
}
interface IAttrPowerUpInfo extends IAttr {
  params: number[];
  values: number[];
}
