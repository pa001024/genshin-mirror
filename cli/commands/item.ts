import fs from "fs-extra";
import { groupBy, keyBy, map } from "lodash";
import { BuffType } from "../../modules/core/enum";

// extra
import { DATA_DIR, Dict, saveObject, saveTranslation, toAttrType, toNum, toText } from "../util";

export async function run() {
  // await fs.emptyDir("dist/item");

  await parseMaterial();
}

async function parseMaterial() {
  interface MaterialExcelConfigData {
    InteractionTitleTextMapHash: number;
    NoFirstGetHint?: boolean;
    ItemUse: ItemUse[];
    RankLevel: number;
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
    Rank?: number;
    EffectGadgetId?: number;
    MaterialType?: string;
    GadgetId?: number;
    StackLimit?: number;
  }

  interface ItemUse {
    UseParam: string[];
  }
  const data: MaterialExcelConfigData[] = await fs.readJSON(DATA_DIR + "Excel/MaterialExcelConfigData.json");

  await saveTranslation("item", "material.json", t => {
    const rst = data
      .filter(v => {
        if (v.RankLevel && v.MaterialType && v.MaterialType in MaterialType) {
          const enName = toText(v.NameTextMapHash);
          if (enName.includes("(Invalidated)") || enName.includes("(test)")) return false;
          return true;
        }
        return false;
      })
      .map(v => {
        return {
          id: v.Id,
          name: t(v.NameTextMapHash),
          desc: t(v.DescTextMapHash),
          rank: v.RankLevel,
          type: MaterialType[v.MaterialType as any],
        };
      });
    return rst;
  });
}

enum MaterialType {
  MATERIAL_TALENT, // 天赋材料
  MATERIAL_AVATAR_MATERIAL, // 突破材料
  MATERIAL_AVATAR, // 角色
  MATERIAL_FOOD, // 料理
  MATERIAL_NOTICE_ADD_HP, // 加血道具
  MATERIAL_EXCHANGE, // 食材
  MATERIAL_FLYCLOAK, // 风之翼
  MATERIAL_NAMECARD, // 名片
  MATERIAL_CONSUME, // 消耗品
  // MATERIAL_QUEST,
  // MATERIAL_CHEST, // 宝箱
  // MATERIAL_SELECTABLE_CHEST, // 宝箱
}
