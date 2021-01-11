import fs from "fs-extra";
import chalk from "chalk";

// extra
import type { IWeapon, IWeaponPromoteStage } from "../../modules/core/interface";
import { Dict, DATA_DIR, saveObject, itemMap, toAttrType, toCurve, toNum, toWeaponType, enLang, toAffix, locales, toNormalName } from "../util";

export async function run() {
  const data: WeaponData[] = await fs.readJSON(DATA_DIR + "Excel/WeaponExcelConfigData.json");
  // 突破数据
  const promoteMap = ((await fs.readJSON(DATA_DIR + "Excel/WeaponPromoteExcelConfigData.json")) as WeaponPromoteData[]).reduce<{
    [x: number]: WeaponPromoteData[];
  }>((r, v) => {
    if (!r[v.WeaponPromoteId]) {
      r[v.WeaponPromoteId] = [v];
    } else {
      r[v.WeaponPromoteId].push(v);
    }
    return r;
  }, {});

  const allKeys: Map<string, number> = new Map();

  await Promise.all(
    data.map(async weapon => {
      const name = toNormalName(weapon.NameTextMapHash);
      if (!name) {
        console.warn(`${chalk.red("[weapon]")} id ${weapon.Id} no translation skiped`);
        return;
      }

      allKeys.set(name, weapon.NameTextMapHash);
      const promote = promoteMap[weapon.WeaponPromoteId];
      const rst: Partial<IWeapon> = {
        id: weapon.Id,
        name,
        rarity: weapon.RankLevel,
        type: toWeaponType(weapon.WeaponType),
        promoteStages: toPromoteStage(promote),
        baseATK: toNum(weapon.WeaponProp[0].InitValue!),
        baseATKCurve: toCurve(weapon.WeaponProp[0].Type),
      };
      if (weapon.WeaponProp[1].PropType && weapon.WeaponProp[1].InitValue)
        rst.subAttr = {
          type: toAttrType(weapon.WeaponProp[1].PropType),
          value: toNum(weapon.WeaponProp[1].InitValue),
          curve: toCurve(weapon.WeaponProp[1].Type),
        };

      // 特效
      if (weapon.SkillAffix[0]) rst.affix = toAffix(weapon.SkillAffix[0]);

      await saveObject("weapon", rst.name + ".json", rst);
    })
  );

  // 导出翻译
  const localeKeys = [...allKeys.keys()];
  await Promise.all(
    Object.keys(locales).map(async locale => {
      const localeFile = await fs.readJSON(DATA_DIR + locales[locale]);
      const localeData = localeKeys.reduce<Dict>((r, v) => ((r[v] = localeFile[allKeys.get(v)!]), r), {});
      await saveObject("weapon_locales", locale + ".json", localeData);
    })
  );
  function toPromoteStage(data: WeaponPromoteData[]): IWeaponPromoteStage[] {
    return data
      .filter(v => v.PromoteLevel)
      .map(lv => {
        return {
          level: lv.PromoteLevel!,
          baseATK: toNum(lv.AddProps[0].Value!),
          cost: lv.CostItems.filter(v => v.Id).map(v => {
            const item = itemMap[v.Id!];
            return [enLang[item.NameTextMapHash], v.Count!];
          }),
        };
      });
  }
}

interface WeaponData {
  Id: number;
  WeaponType: string;
  RankLevel: number;
  WeaponBaseExp: number;
  SkillAffix: number[];
  WeaponProp: WeaponProp[];
  AwakenTexture: string;
  AwakenIcon: string;
  WeaponPromoteId: number;
  StoryId: number;
  AwakenCosts: number[];
  GachaCardNameHashPre: number;
  GachaCardNameHashSuffix: number;
  DestroyRule?: string;
  DestroyReturnMaterial: number[];
  DestroyReturnMaterialCount: number[];
  NameTextMapHash: number;
  DescTextMapHash: number;
  Icon: string;
  ItemType: string;
  Weight: number;
  Rank: number;
  GadgetId: number;
  InitialLockState?: number;
  AwakenMaterial?: number;
  EnhanceRule?: number;
  Unrotate?: boolean;
}

interface WeaponProp {
  PropType?: string;
  InitValue?: number;
  Type: string;
}

interface WeaponPromoteData {
  WeaponPromoteId: number;
  CostItems: CostItem[];
  AddProps: WeaponPromoteAddProp[];
  UnlockMaxLevel: number;
  PromoteLevel?: number;
  RequiredPlayerLevel?: number;
  CoinCost?: number;
}

interface WeaponPromoteAddProp {
  PropType: string;
  Value?: number;
}

interface CostItem {
  Id?: number;
  Count?: number;
}
