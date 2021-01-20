import fs from "fs-extra";
import { uniqBy } from "lodash";
import { MaterialType } from "../../modules/core/enum";
import { IItem } from "../../modules/core/interface";

// extra
import { DATA_DIR, saveTranslation, toID, toText } from "../util";

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

  await saveTranslation("item", "item.json", t => {
    const rst = data
      .filter(v => {
        if (v.RankLevel && v.MaterialType && v.MaterialType in MaterialType) {
          const enName = toText(v.NameTextMapHash, "zh-Hans");
          if (enName.includes("（废弃）") || enName.includes("(test)")) return false;
          return true;
        }
        return false;
      })
      .map(v => {
        const item: IItem = {
          id: toID(v.NameTextMapHash),
          name: toText(v.NameTextMapHash),
          localeName: t(v.NameTextMapHash),
          desc: t(v.DescTextMapHash),
          rarity: v.RankLevel,
          type: (MaterialType[v.MaterialType as any] as any) as MaterialType,
        };
        return item;
      });
    return uniqBy(rst, "id");
  });
}
