import prettier from "prettier";
import fs from "fs-extra";
import chalk from "chalk";

import { BuffType, WeaponType } from "../modules/core/enum";
import type { IAttr, IWeaponAffix } from "../modules/core/interface";
import { startCase } from "lodash";

export type Dict<T = string> = { [x: string]: T };

export const DATA_DIR = "../../GenshinData/";

export const itemMap = (fs.readJsonSync(DATA_DIR + "Excel/MaterialExcelConfigData.json") as Item[]).reduce<{
  [x: number]: Item;
}>((r, v) => ((r[v.Id] = v), r), {});

export const affixMap = (fs.readJSONSync(DATA_DIR + "Excel/EquipAffixExcelConfigData.json") as WeaponAffixData[]).reduce<{
  [x: number]: WeaponAffixData[];
}>((r, v) => {
  if (!r[v.Id]) {
    r[v.Id] = [v];
  } else {
    r[v.Id].push(v);
  }
  return r;
}, {});

export const tagMap = (fs.readJsonSync(DATA_DIR + "Excel/FeatureTagExcelConfigData.json") as FeatureTagExcelConfigData[]).reduce<{
  [x: number]: FeatureTagExcelConfigData;
}>((r, v) => ((r[v.TagId] = v), r), {});

export const tagGroupMap = (fs.readJsonSync(DATA_DIR + "Excel/FeatureTagGroupExcelConfigData.json") as FeatureTagGroupExcelConfigData[]).reduce<{
  [x: number]: FeatureTagGroupExcelConfigData;
}>((r, v) => ((r[v.GroupId] = v), r), {});

export const locales: Dict = {
  // de: fs.readJsonSync(DATA_DIR + "TextMap/TextDE.json"),
  en: fs.readJsonSync(DATA_DIR + "TextMap/TextEN.json"),
  // es: fs.readJsonSync(DATA_DIR + "TextMap/TextES.json"),
  // fr: fs.readJsonSync(DATA_DIR + "TextMap/TextFR.json"),
  // id: fs.readJsonSync(DATA_DIR + "TextMap/TextID.json"),
  ja: fs.readJsonSync(DATA_DIR + "TextMap/TextJA.json"),
  // ko: fs.readJsonSync(DATA_DIR + "TextMap/TextKO.json"),
  // pt: fs.readJsonSync(DATA_DIR + "TextMap/TextPT.json"),
  // ru: fs.readJsonSync(DATA_DIR + "TextMap/TextRU.json"),
  // th: fs.readJsonSync(DATA_DIR + "TextMap/TextTH.json"),
  // vi: fs.readJsonSync(DATA_DIR + "TextMap/TextVI.json"),
  "zh-Hans": fs.readJsonSync(DATA_DIR + "TextMap/TextZHS.json"),
  "zh-Hant": fs.readJsonSync(DATA_DIR + "TextMap/TextZHT.json"),
};

export function toText(hash: number, lang = "en") {
  return locales[lang][hash];
}

export function toNormalName(NameTextMapHash: number) {
  return startCase(toText(NameTextMapHash)).replace(/ /g, "");
}

export async function saveObject(domain: string, file: string, obj: any) {
  const data = prettier.format(JSON.stringify(obj), { parser: "json" });
  await fs.ensureDir("dist/" + domain);
  await fs.writeFile("dist/" + domain + "/" + file, data);
}
export function toAffix(id: number): IWeaponAffix {
  const affixLevels = affixMap[id];
  const affix = affixLevels[0];
  return {
    name: toText(affix.NameTextMapHash) || "???",
    levels: affixLevels.map(v => {
      return { attrs: toAttr(v.AddProps), params: v.Param.filter(Boolean).map(toNum) };
    }),
  };
}

// 生成大段文字的国际化文件
export async function saveTranslation(domain: string, file: string, produce: (t: (hash: number) => string) => any) {
  for (const lang in locales) {
    const t = (n: number) => toText(n, lang);
    const obj = produce(t);
    await saveObject(lang + "/" + domain, file, obj);
  }
}

export function toCurve(str: string) {
  const nameMap: { [x: string]: number } = {
    GROW_CURVE_ATTACK_101: 1,
    GROW_CURVE_ATTACK_102: 2,
    GROW_CURVE_ATTACK_103: 3,
    GROW_CURVE_ATTACK_104: 4,
    GROW_CURVE_ATTACK_105: 5,
    GROW_CURVE_ATTACK_201: 6,
    GROW_CURVE_ATTACK_202: 7,
    GROW_CURVE_ATTACK_203: 8,
    GROW_CURVE_ATTACK_204: 9,
    GROW_CURVE_ATTACK_205: 10,
    GROW_CURVE_ATTACK_301: 11,
    GROW_CURVE_ATTACK_302: 12,
    GROW_CURVE_ATTACK_303: 13,
    GROW_CURVE_ATTACK_304: 14,
    GROW_CURVE_ATTACK_305: 15,
    GROW_CURVE_CRITICAL_101: 16,
    GROW_CURVE_CRITICAL_201: 17,
    GROW_CURVE_CRITICAL_301: 18,
  };
  return nameMap[str] || 0;
}
export function toNum(num: number) {
  return +num.toPrecision(5);
}

export function toWeaponType(str: string) {
  const nameMap: { [x: string]: WeaponType } = {
    WEAPON_SWORD_ONE_HAND: WeaponType.Sword,
    WEAPON_POLE: WeaponType.Polearm,
    WEAPON_CATALYST: WeaponType.Catalyst,
    WEAPON_BOW: WeaponType.Bow,
    WEAPON_CLAYMORE: WeaponType.Claymore,
  };
  return nameMap[str] || WeaponType.Unknown;
}

export function toTags(id: number) {
  const group = tagGroupMap[id];
  return group.TagIds.filter(Boolean).map(v => tagMap[v]);
}

export function toAttrType(str: string) {
  const nameMap: { [x: string]: BuffType } = {
    FIGHT_PROP_HP_PERCENT: BuffType.HPRatio,
    FIGHT_PROP_DEFENSE_PERCENT: BuffType.DEFRatio,
    FIGHT_PROP_ATTACK_PERCENT: BuffType.ATKRatio,
    FIGHT_PROP_HP: BuffType.HPDelta,
    FIGHT_PROP_DEFENSE: BuffType.DEFDelta,
    FIGHT_PROP_ATTACK: BuffType.ATKDelta,
    FIGHT_PROP_BASE_HP: BuffType.BaseHP,
    FIGHT_PROP_BASE_DEFENSE: BuffType.BaseDEF,
    FIGHT_PROP_BASE_ATTACK: BuffType.BaseATK,
    FIGHT_PROP_CRITICAL: BuffType.CRITRate,
    FIGHT_PROP_CRITICAL_HURT: BuffType.CRITDMG,
    FIGHT_PROP_CHARGE_EFFICIENCY: BuffType.EnergyRecharge,
    FIGHT_PROP_ELEMENT_MASTERY: BuffType.ElementalMastery,
    FIGHT_PROP_SHIELD_COST_MINUS_RATIO: BuffType.ShieldEffectiveness,
    FIGHT_PROP_ELEC_SUB_HURT: BuffType.ElectroRES,
    FIGHT_PROP_ELEC_ADD_HURT: BuffType.ElectroDMG,
    FIGHT_PROP_FIRE_SUB_HURT: BuffType.PyroRES,
    FIGHT_PROP_FIRE_ADD_HURT: BuffType.PyroDMG,
    FIGHT_PROP_WIND_SUB_HURT: BuffType.AnemoRES,
    FIGHT_PROP_WIND_ADD_HURT: BuffType.AnemoDMG,
    FIGHT_PROP_ICE_SUB_HURT: BuffType.CryoRES,
    FIGHT_PROP_ICE_ADD_HURT: BuffType.CryoDMG,
    FIGHT_PROP_PHYSICAL_SUB_HURT: BuffType.PhysicalRES,
    FIGHT_PROP_PHYSICAL_ADD_HURT: BuffType.PhysicalDMG,
    FIGHT_PROP_ROCK_SUB_HURT: BuffType.GeoRES,
    FIGHT_PROP_ROCK_ADD_HURT: BuffType.GeoDMG,
    FIGHT_PROP_WATER_SUB_HURT: BuffType.HydroRES,
    FIGHT_PROP_WATER_ADD_HURT: BuffType.HydroDMG,
    FIGHT_PROP_GRASS_SUB_HURT: BuffType.DendroRES,
    FIGHT_PROP_GRASS_ADD_HURT: BuffType.DendroDMG,
    FIGHT_PROP_HEAL_ADD: BuffType.Heal,
    FIGHT_PROP_HEALED_ADD: BuffType.Healed,
    FIGHT_PROP_ADD_HURT: BuffType.AllDMG,
    FIGHT_PROP_SUB_HURT: BuffType.DMGReduce,
    FIGHT_PROP_BASE_SPEED: BuffType.BaseSpeed,
    FIGHT_PROP_SPEED_PERCENT: BuffType.SpeedRatio,
    FIGHT_PROP_ANTI_CRITICAL: BuffType.AntiCRITRate,
  };
  if (!nameMap[str]) {
    console.error(`${chalk.red("[prop]")} unknown prop ${str}`);
    process.exit(2);
  }
  return nameMap[str];
}

export function toAttr(src: WeaponAffixAddProp[]): IAttr[] {
  return src.filter(v => v.Type && v.Value).map(v => ({ type: toAttrType(v.Type!), value: toNum(v.Value!) }));
}

const _BASE62_ST = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

export function base62(src: number): string {
  let rst = "",
    negative = src < 0;
  if (negative) src = -src;
  while (1) {
    let a = ~~src % 62;
    rst = _BASE62_ST[a] + rst;
    src = ~~(src / 62);
    if (src <= 0) {
      break;
    }
  }
  return negative ? "-" + rst : rst;
}

export function debase62(src: string): number {
  let rst = 0,
    negative = src[0] === "-";
  if (negative) src = src.substr(1);
  for (let i = 0; i < src.length; i++) {
    const a = _BASE62_ST.indexOf(src[i]);
    if (a < 0) {
      continue;
    }
    rst = rst * 62 + a;
  }
  return negative ? -rst : rst;
}

interface Item {
  InteractionTitleTextMapHash: number;
  MaterialType: string;
  StackLimit: number;
  ItemUse: ItemUse[];
  EffectDescTextMapHash: number;
  SpecialDescTextMapHash: number;
  TypeDescTextMapHash: number;
  EffectIcon: string;
  EffectName: string;
  PicPath: any[];
  SatiationParams: any[];
  DestroyReturnMaterial: any[];
  DestroyReturnMaterialCount: any[];
  Id: number;
  NameTextMapHash: number;
  DescTextMapHash: number;
  Icon: string;
  ItemType: string;
  Rank: number;
}

interface ItemUse {
  UseParam: string[];
}

interface WeaponAffixData {
  AffixId: number;
  Id: number;
  NameTextMapHash: number;
  DescTextMapHash: number;
  OpenConfig: string;
  AddProps: WeaponAffixAddProp[];
  Param: number[];
  Level?: number;
}

interface WeaponAffixAddProp {
  Type?: string;
  Value?: number;
}

interface FeatureTagExcelConfigData {
  TagId: number;
  TagName: string;
  TagDesp: string;
}
interface FeatureTagGroupExcelConfigData {
  GroupId: number;
  TagIds: number[];
}
