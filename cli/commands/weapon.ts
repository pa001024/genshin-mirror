import fs from "fs-extra";

// extra
import type { IWeapon, IWeaponPromoteStage, IWeaponAffix } from "../../modules/core/interface";
import { DATA_DIR, itemMap, toAttrType, toCurve, toNum, toWeaponType, toText, toID, saveTranslation, toDesc, toAttr, affixMap } from "../util";
import { uniqBy } from "lodash";

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

  await saveTranslation("weapon", "weapon.json", t => {
    const rst = data
      .filter(weapon => {
        return toID(weapon.NameTextMapHash);
      })
      .map(v => {
        const promote = promoteMap[v.WeaponPromoteId];
        const rst: IWeapon = {
          id: toID(v.NameTextMapHash),
          name: toText(v.NameTextMapHash),
          localeName: t(v.NameTextMapHash),
          desc: toDesc(t(v.DescTextMapHash)),
          rarity: v.RankLevel,
          type: toWeaponType(v.WeaponType),
          promoteStages: toPromoteStage(promote),
          baseATK: toNum(v.WeaponProp[0].InitValue!),
          baseATKCurve: toCurve(v.WeaponProp[0].Type),
        };
        if (v.WeaponProp[1].PropType && v.WeaponProp[1].InitValue)
          rst.subAttr = {
            type: toAttrType(v.WeaponProp[1].PropType),
            value: toNum(v.WeaponProp[1].InitValue),
            curve: toCurve(v.WeaponProp[1].Type),
          };

        // 特效
        if (v.SkillAffix[0]) rst.affix = toAffix(v.SkillAffix[0]);
        return rst;
      });
    return uniqBy(rst, "id");
    function toPromoteStage(data: WeaponPromoteData[]): IWeaponPromoteStage[] {
      return data
        .filter(v => v.PromoteLevel)
        .map(lv => {
          return {
            level: lv.PromoteLevel!,
            baseATK: toNum(lv.AddProps[0].Value!),
            cost: lv.CostItems.filter(v => v.Id).map(v => {
              const item = itemMap[v.Id!];
              return [toID(item.NameTextMapHash), v.Count!];
            }),
          };
        });
    }
    function toAffix(id: number): IWeaponAffix {
      const affixLevels = affixMap[id];
      const affix = affixLevels[0];
      return {
        name: t(affix.NameTextMapHash) || "???",
        desc: toDesc(t(affix.DescTextMapHash)),
        levels: affixLevels.map(v => {
          return { attrs: toAttr(v.AddProps), params: v.Param.filter(Boolean).map(toNum) };
        }),
      };
    }
  });
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
