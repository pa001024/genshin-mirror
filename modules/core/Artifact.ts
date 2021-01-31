import { memoize } from "lodash";
import { base62, debase62 } from "../util/base62";
import { ARTIFACT, BuffType } from ".";
import type { IArtifactType, IAttr, IArtifact } from ".";

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

  get mainAttr() {
    const mainAttr: IAttr = {
      type: this.data.main,
      value: ARTIFACT.MAIN_PROPERTY_CURVE[this.type.rarity - 1][this._level][ARTIFACT.MAIN_PROPERTY_CURVE_ORDER[this.data.main]],
    };
    return mainAttr;
  }

  get allAttrs() {
    return [this.mainAttr, ...this.attrs];
  }

  get attrs() {
    return this.data.attrs;
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
  get powerupInfo() {
    const pmap = ARTIFACT.SUB_PROPERTY[this.type.rarity - 1];
    const maxN = ARTIFACT.MAX_POWERUP_PROPS[this.type.rarity - 1];
    const maxT = pmap[BuffType.HPDelta].length;
    const cs = this.attrs.map((attr, index) => {
      const ratio = attr.type in ARTIFACT.ENCODE_RATIO ? 1 : 1000;
      const probs = ratio === 1 ? pmap[attr.type] : pmap[attr.type].map(v => v * ratio);
      const rainbow = getNRainbow(probs, maxN);
      const params = rainbow[attr.value * ratio] || [];
      return {
        index,
        ...attr,
        params,
        maxN: params.length ? params[0].length : 1,
        probs,
        ratio,
      };
    });
    let remainN = maxN;
    const np = cs
      .sort((a, b) => a.maxN - b.maxN)
      .map(v => {
        const params = v.params.find(v => v.reduce((a, b) => a + b) <= remainN) || Array(maxT).fill(0);
        const n = params.reduce((a, b) => a + b);
        remainN -= n - 1;
        return {
          ...v,
          params,
          n,
          values: v.probs
            .map<[number, number, number]>((u, i) => [maxT - i, u / v.ratio, params[i]])
            .filter(v => v[2]),
        };
      })
      .sort((a, b) => a.index - b.index)
      .map(v => {
        const tier = v.values.reduce((a, b) => a + b[0], 0) / v.values.length;
        const tierR = Math.round(tier);
        const plus = tier === tierR ? "" : tier > tierR ? "+" : "-";
        const res: IAttrPowerUpInfo = {
          type: v.type,
          value: v.value,
          tier: tierR + plus,
          params: v.params,
          values: v.values,
          n: v.n,
        };
        return res;
      });

    return np;
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
      const valueRange = ARTIFACT.SUB_PROPERTY[atype.rarity][sub];
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
      (r, v) => r + base62(v.type) + base62(v.type in ARTIFACT.ENCODE_RATIO ? v.value : v.value * 1e3, 2),
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
        value: debase62(subs.substr(i + 1, 2)) / (type in ARTIFACT.ENCODE_RATIO ? 1 : 1e3),
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

  get rarity() {
    return this.type.rarity;
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
const getNRainbow = memoize(
  (values: number[], maxN: number) => {
    const all: number[][] = [].concat(
      ...(Array(maxN)
        .fill(0)
        .map((_, n) => wnMatrix(values.length, n + 1)) as any)
    );

    const amap = all.reduce<{ [x: number]: number[][] }>((r, m) => {
      const val = values.reduce((r, v, i) => r + v * m[i], 0);
      const k = +val.toFixed(0);
      if (k in r) r[k].push(m);
      else r[k] = [m];
      return r;
    }, {});

    return amap;
  },
  (values: number[], maxN: number) => values.join(",") + "-" + maxN
);
export interface IAttrPowerUpInfo extends IAttr {
  tier: string;
  params: number[];
  values: [number, number, number][];
  n: number;
}
