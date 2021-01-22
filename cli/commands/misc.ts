import fs from "fs-extra";
import { uniqBy } from "lodash";

// extra
import { DATA_DIR, saveTranslation, toDesc, toID, toNum, toText } from "../util";

export async function run() {
  // await fs.emptyDir("dist/item");

  await parseTeamResonance();
}

async function parseTeamResonance() {
  interface TeamResonanceExcelConfigData {
    TeamResonanceId: number;
    TeamResonanceGroupId: number;
    Level: number;
    FireAvatarCount?: number;
    NameTextMapHash: number;
    DescTextMapHash: number;
    OpenConfig: string;
    AddProps: any[];
    Param: number[];
    WaterAvatarCount?: number;
    WindAvatarCount?: number;
    ElectricAvatarCount?: number;
    IceAvatarCount?: number;
    RockAvatarCount?: number;
    Cond?: string;
  }

  interface ItemUse {
    UseParam: string[];
  }
  const data: TeamResonanceExcelConfigData[] = await fs.readJSON(DATA_DIR + "Excel/TeamResonanceExcelConfigData.json");

  await saveTranslation("misc", "resonance.json", t => {
    const rst = data.map(v => {
      const item = {
        id: toID(v.NameTextMapHash),
        name: toText(v.NameTextMapHash),
        localeName: t(v.NameTextMapHash),
        desc: toDesc(t(v.DescTextMapHash)),
        param: v.Param.map(toNum),
      };
      return item;
    });
    return uniqBy(rst, "id");
  });
}
