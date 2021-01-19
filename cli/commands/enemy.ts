import fs from "fs-extra";
import { MonsterRarity } from "../../modules/core/enum";

// extra
import { DATA_DIR, saveTranslation, toID, toNum, toText } from "../util";

export async function run() {
  // await fs.emptyDir("dist/enemy");

  await parseEnemy();
}

async function parseEnemy() {
  interface MonsterExcelConfigData {
    MonsterName: string;
    Type: string;
    ScriptDataPathHashPre: number;
    ScriptDataPathHashSuffix: number;
    ServerScript: string;
    CombatConfigHashPre: number;
    CombatConfigHashSuffix: number;
    Affix: any[];
    AI: string;
    IsAIHashCheck: boolean;
    Equips: number[];
    HpDrops: HpDrop[];
    KillDropId: number;
    ExcludeWeathers: string;
    FeatureTagGroupId: number;
    MpPropId: number;
    Skin: string;
    DescribeId: number;
    CombatBGMLevel: number;
    HpBase: number;
    AttackBase: number;
    DefenseBase: number;
    FireSubHurt: number;
    GrassSubHurt: number;
    WaterSubHurt: number;
    ElecSubHurt: number;
    WindSubHurt: number;
    IceSubHurt: number;
    RockSubHurt: number;
    PropGrowCurves: PropGrowCurve[];
    PhysicalSubHurt: number;
    PrefabPathRagdollHashPre: number;
    PrefabPathRagdollHashSuffix: number;
    Id: number;
    NameTextMapHash: number;
    PrefabPathHashPre: number;
    PrefabPathHashSuffix: number;
    PrefabPathRemoteHashPre: number;
    PrefabPathRemoteHashSuffix: number;
    ControllerPathHashPre: number;
    ControllerPathHashSuffix: number;
    ControllerPathRemoteHashPre: number;
    ControllerPathRemoteHashSuffix: number;
    CampId: number;
    LODPatternName: string;
  }
  interface PropGrowCurve {
    Type: string;
    GrowCurve: string;
  }
  interface HpDrop {
    DropId?: number;
    HpPercent?: number;
  }
  interface MonsterDescribeExcelConfigData {
    Id: number;
    NameTextMapHash: number;
    TitleId: number;
    SpecialNameLabId: number;
    Icon: string;
    DescTextMapHash: number;
    LockDescTextMapHash: number;
  }
  interface MonsterRelationshipExcelConfigData {
    Id: number;
    TagStr: string;
    MonsterRarity: string;
  }
  const data: MonsterExcelConfigData[] = await fs.readJSON(DATA_DIR + "Excel/MonsterExcelConfigData.json");
  const relData: MonsterRelationshipExcelConfigData[] = await fs.readJSON(DATA_DIR + "Excel/MonsterRelationshipExcelConfigData.json");
  const relIndex = new Map(relData.map(v => [v.Id, v]));
  const descData: MonsterDescribeExcelConfigData[] = await fs.readJSON(DATA_DIR + "Excel/MonsterDescribeExcelConfigData.json");
  const descIndex = new Map(descData.map(v => [v.Id, v]));

  await saveTranslation("enemy", "enemy.json", t => {
    const rst = data
      .filter(v => descIndex.has(v.DescribeId))
      .map(v => {
        const desc = descIndex.get(v.DescribeId)!;
        const rel = relIndex.get(v.DescribeId);
        return {
          id: toID(desc.NameTextMapHash),
          name: toText(desc.NameTextMapHash),
          localeName: t(desc.NameTextMapHash),
          desc: t(desc.DescTextMapHash).replace(/\\\\n/g, "\n"),
          baseHP: toNum(v.HpBase || 0),
          baseATK: toNum(v.AttackBase || 0),
          baseDEF: toNum(v.DefenseBase || 0), // 固定500
          type: MonsterRarity[rel?.MonsterRarity as any],
          resist: [
            //
            toNum(v.FireSubHurt || 0),
            toNum(v.GrassSubHurt || 0),
            toNum(v.WaterSubHurt || 0),
            toNum(v.ElecSubHurt || 0),
            toNum(v.WindSubHurt || 0),
            toNum(v.IceSubHurt || 0),
            toNum(v.RockSubHurt || 0),
            toNum(v.PhysicalSubHurt || 0),
          ],
        };
      });
    return rst;
  });
}
