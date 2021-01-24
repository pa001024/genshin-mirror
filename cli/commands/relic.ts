// artifact 圣遗物

import fs from "fs-extra";
import { uniqBy } from "lodash";
import { ArtifactType } from "../../modules/core/enum";
import { IArtifactType, IArtifactSet, IArtifactSetAffix } from "../../modules/core/interface";

// extra
import { DATA_DIR, saveTranslation, toDesc, toAttr, toID, affixMap, toNum } from "../util";

export async function run() {
  // await fs.emptyDir("dist/item");

  await parseArtifact();
  await parseArtifactSet();
}

async function parseArtifactSet() {
  interface ReliquarySetExcelConfigData {
    SetId: number;
    SetIcon: string;
    SetNeed: number[];
    EquipAffixId: number;
    Contains: number[];
    DisableFilter?: number;
  }
  const data: ReliquarySetExcelConfigData[] = await fs.readJSON(DATA_DIR + "Excel/ReliquarySetExcelConfigData.json");

  await saveTranslation("relicset", "relicset.json", t => {
    const rst = data
      .filter(v => v.EquipAffixId)
      .map(v => {
        const { name, affixs } = toAffix(v.EquipAffixId);
        const item: IArtifactSet = {
          id: v.SetId,
          name,
          need: v.SetNeed,
          // maxLevel: v.MaxLevel || 1,
          affixs,
        };
        return item;
      });
    return uniqBy(rst, "id");
    function toAffix(id: number): { name: string; affixs: IArtifactSetAffix[] } {
      const affixLevels = affixMap[id];
      const affix = affixLevels[0];
      return {
        name: t(affix.NameTextMapHash) || "???",
        affixs: affixLevels.map(v => {
          return { desc: toDesc(t(affix.DescTextMapHash)), attrs: toAttr(v.AddProps), params: v.Param.filter(Boolean).map(toNum) };
        }),
      };
    }
  });
}
async function parseArtifact() {
  interface ReliquaryExcelConfigData {
    EquipType: string;
    ShowPic: string;
    MainPropDepotId: number;
    AppendPropDepotId: number;
    AddPropLevels: number[];
    BaseConvExp: number;
    MaxLevel: number;
    DestroyReturnMaterial: number[];
    DestroyReturnMaterialCount: number[];
    Id: number;
    NameTextMapHash: any;
    DescTextMapHash: any;
    Icon: string;
    ItemType: string;
    Weight: number;
    Rank: number;
    GadgetId: number;
    RankLevel?: number;
    AppendPropNum?: number;
    SetId?: number;
    StoryId?: number;
    DestroyRule: string;
    InitialLockState?: number;
    Dropable?: boolean;
  }
  interface ReliquaryCodexExcelConfigData {
    Id: number;
    SuitId: number;
    Level: number;
    CupId: number;
    LeatherId: number;
    CapId: number;
    FlowerId: number;
    SandId: number;
    SortOrder: number;
  }
  const data: ReliquaryExcelConfigData[] = await fs.readJSON(DATA_DIR + "Excel/ReliquaryExcelConfigData.json");
  const codex: ReliquaryCodexExcelConfigData[] = await fs.readJSON(DATA_DIR + "Excel/ReliquaryCodexExcelConfigData.json");
  const enabledIds = new Set<number>([].concat(...codex.map(v => [v.CupId, v.LeatherId, v.CapId, v.FlowerId, v.SandId] as any)));

  await saveTranslation("relic", "relic.json", t => {
    const rst = data
      .filter(v => v.RankLevel && v.SetId && enabledIds.has(v.Id))
      .map(v => {
        const item: IArtifactType = {
          id: v.Id,
          name: toID(v.NameTextMapHash),
          localeName: t(v.NameTextMapHash),
          desc: toDesc(t(v.DescTextMapHash)),
          rarity: v.RankLevel!,
          setId: v.SetId!,
          // maxLevel: v.MaxLevel || 1,
          type: toArtifaceType(v.EquipType),
        };
        return item;
      });
    return uniqBy(rst, v => v.id);
  });
}

function toArtifaceType(str: string): ArtifactType {
  const mp: { [x: string]: ArtifactType } = {
    EQUIP_BRACER: ArtifactType.FlowerOfLife,
    EQUIP_NECKLACE: ArtifactType.PlumeOfDeath,
    EQUIP_SHOES: ArtifactType.SandsOfEon,
    EQUIP_RING: ArtifactType.GobletOfEonothem,
    EQUIP_DRESS: ArtifactType.CircletOfLogos,
  };
  return mp[str] || ArtifactType.FlowerOfLife;
}
