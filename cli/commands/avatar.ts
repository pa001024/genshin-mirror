import fs from "fs-extra";
import { BodyType, ElementType, Region } from "../../modules/core/enum";
import { IAvatar as IAvatar } from "../../modules/core/interface";

// extra
import { DATA_DIR, Dict, saveTranslation, toNum, toText, toWeaponType, toTags } from "../util";

export async function run() {
  // await fs.emptyDir("dist/char");

  await parseChar();
}

async function parseChar() {
  const data: AvatarExcelConfigData[] = await fs.readJSON(DATA_DIR + "Excel/AvatarExcelConfigData.json");
  const skillData: AvatarSkillExcelConfigData[] = await fs.readJSON(DATA_DIR + "Excel/AvatarSkillExcelConfigData.json");
  const skillIndex = new Map(skillData.map(v => [v.Id, v]));
  const depotData: AvatarSkillDepotExcelConfigData[] = await fs.readJSON(DATA_DIR + "Excel/AvatarSkillDepotExcelConfigData.json");
  const depotIndex = new Map(depotData.map(v => [v.Id, v]));
  const promoteData: AvatarPromoteExcelConfigData[] = await fs.readJSON(DATA_DIR + "Excel/AvatarPromoteExcelConfigData.json");
  const promoteIndex = new Map(promoteData.map(v => [v.AvatarPromoteId, v]));
  const talentData: AvatarTalentExcelConfigData[] = await fs.readJSON(DATA_DIR + "Excel/AvatarTalentExcelConfigData.json");
  const talentIndex = new Map(talentData.map(v => [v.TalentId, v]));
  const proudSkillData: ProudSkillExcelConfigData[] = await fs.readJSON(DATA_DIR + "Excel/ProudSkillExcelConfigData.json");
  const proudSkillIndex = proudSkillData.reduce<Dict<ProudSkillExcelConfigData[]>>((r, v) => {
    if (v.ProudSkillGroupId in r) r[v.ProudSkillGroupId].push(v);
    else r[v.ProudSkillGroupId] = [v];
    return r;
  }, {});

  for (const char of data) {
    const id = toText(char.NameTextMapHash).replace(/ /g, "");
    if (id.includes("(Test)") || char.UseType === "AVATAR_ABANDON" || char.UseType === "AVATAR_SYNC_TEST") continue;
    await saveTranslation("char", id + ".json", t => {
      const rst = data.map(v => {
        const promote = promoteIndex.get(v.AvatarPromoteId)!;
        const tags = toTags(v.FeatureTagGroupId);
        const skills = toSkills(v.SkillDepotId);
        const avatar: IAvatar = {
          name: t(v.NameTextMapHash),
          desc: t(v.DescTextMapHash),
          baseHP: toNum(v.HpBase || 0),
          baseATK: toNum(v.AttackBase || 0),
          baseDEF: toNum(v.DefenseBase || 0),
          bodyType: toBodyType(v.BodyType),
          rarity: toRarity(v.QualityType),
          weapon: toWeaponType(v.WeaponType),
          region: toRegion(tags),
          promote,
          element: skills.energy.CostElemType ? toElement(skills.energy.CostElemType) : 0,
          elementalSkill: skills.subSkill,
          attack: skills.attackMode,
        };
        return avatar;
      });
      return rst;
    });
  }

  function toSkills(depotId: number) {
    const depot = depotIndex.get(depotId)!;
    return {
      energy: toSkill(depot.EnergySkill),
      skill: depot.Skills.filter(Boolean).map(toSkill),
      subSkill: depot.SubSkills.filter(Boolean).map(toSkill),
      attackMode: depot.AttackModeSkill && toSkill(depot.AttackModeSkill),
      talents: depot.Talents.map(toTelent),
    };
  }

  function toTelent(telentId: number) {
    return talentIndex.get(telentId)!;
  }
  function toSkill(skillId: number) {
    return skillIndex.get(skillId)!;
  }

  function toRegion(tags: ReturnType<typeof toTags>) {
    const ids = new Set(tags.map(v => v.TagId));
    if (ids.has(1001)) return Region.Mondstadt;
    if (ids.has(1002)) return Region.Liyue;
    if (ids.has(1003)) return Region.Inazuma;
    if (ids.has(1004)) return Region.Sumeru;
    if (ids.has(1005)) return Region.Fontaine;
    if (ids.has(1006)) return Region.Natlan;
    if (ids.has(1007)) return Region.Snezhnaya;
    return Region.Snezhnaya;
  }

  function toElement(skill: string) {
    const nm: Dict<ElementType> = {
      ELECTRIC: ElementType.Electro,
      FIRE: ElementType.Pyro,
      ICE: ElementType.Cryo,
      ROCK: ElementType.Geo,
      WATER: ElementType.Hydro,
      WIND: ElementType.Anemo,
    };
    return nm[skill];
  }

  function toBodyType(raw: string) {
    return (BodyType[raw as any] as any) as BodyType;
  }

  function toRarity(raw: string) {
    const nm: Dict<number> = { QUALITY_BLUE: 3, QUALITY_ORANGE: 4, QUALITY_PURPLE: 5 };
    return nm[raw];
  }
}

interface AvatarExcelConfigData {
  BodyType: string;
  ScriptDataPathHashPre: number;
  ScriptDataPathHashSuffix: number;
  IconName: string;
  SideIconName: string;
  QualityType: string;
  ChargeEfficiency: number;
  CombatConfigHashPre: number;
  CombatConfigHashSuffix: number;
  InitialWeapon: number;
  WeaponType: string;
  ManekinPathHashPre: number;
  ManekinPathHashSuffix: number;
  ImageName: string;
  GachaCardNameHashPre?: number;
  GachaCardNameHashSuffix?: number;
  GachaImageNameHashPre?: number;
  GachaImageNameHashSuffix?: number;
  CutsceneShow: string;
  SkillDepotId: number;
  StaminaRecoverSpeed: number;
  CandSkillDepotIds: number[];
  ManekinJsonConfigHashPre: number;
  ManekinJsonConfigHashSuffix: number;
  ManekinMotionConfig: number;
  DescTextMapHash: number;
  AvatarIdentityType?: string;
  AvatarPromoteId: number;
  AvatarPromoteRewardLevel: number[];
  AvatarPromoteRewardId: number[];
  FeatureTagGroupId: number;
  InfoDescTextMapHash: number;
  HpBase: number;
  AttackBase: number;
  DefenseBase: number;
  Critical: number;
  CriticalHurt: number;
  PropGrowCurves: PropGrowCurve[];
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
  LODPatternName: string;
  UseType?: string;
  IsRangeAttack?: boolean;
}

interface PropGrowCurve {
  Type: string;
  GrowCurve: string;
}

interface AvatarSkillExcelConfigData {
  Id: number;
  NameTextMapHash: number;
  AbilityName: string;
  DescTextMapHash: number;
  SkillIcon: string;
  CostStamina?: number;
  MaxChargeNum: number;
  LockShape: string;
  LockWeightParams: number[];
  IsAttackCameraLock?: boolean;
  BuffIcon: string;
  GlobalValueKey: string;
  CdTime?: number;
  TriggerId?: number;
  DragType?: string;
  ShowIconArrow?: boolean;
  ProudSkillGroupId?: number;
  CostElemType?: string;
  CostElemVal?: number;
  IsRanged?: boolean;
  NeedMonitor?: string;
  DefaultLocked?: boolean;
  EnergyMin?: number;
}

interface AvatarSkillDepotExcelConfigData {
  Id: number;
  EnergySkill: number;
  Skills: number[];
  SubSkills: number[];
  ExtraAbilities: string[];
  Talents: number[];
  TalentStarName: string;
  InherentProudSkillOpens: InherentProudSkillOpen[];
  SkillDepotAbilityGroup: string;
  LeaderTalent?: number;
  AttackModeSkill?: number;
}

interface InherentProudSkillOpen {
  ProudskillGroupId?: number;
  NeedAvatarPromoteLevel?: number;
}

interface InherentProudSkillOpen {
  ProudskillGroupId?: number;
  NeedAvatarPromoteLevel?: number;
}
interface AvatarPromoteExcelConfigData {
  AvatarPromoteId: number;
  PromoteAudio: string;
  CostItems: CostItem[];
  UnlockMaxLevel: number;
  AddProps: AddProp[];
  PromoteLevel?: number;
  ScoinCost?: number;
  RequiredPlayerLevel?: number;
}

interface CostItem {
  Id?: number;
  Count?: number;
}

interface AvatarTalentExcelConfigData {
  TalentId: number;
  NameTextMapHash: number;
  DescTextMapHash: number;
  Icon: string;
  MainCostItemId: number;
  MainCostItemCount: number;
  OpenConfig: string;
  AddProps: AddProp[];
  Param: number[];
  PrevTalent?: number;
}

interface AddProp {
  PropType?: string;
  Value?: number;
}

interface ProudSkillExcelConfigData {
  ProudSkillId: number;
  ProudSkillGroupId: number;
  Level: number;
  ProudSkillType: number;
  NameTextMapHash: number;
  DescTextMapHash: number;
  UnlockDescTextMapHash: number;
  Icon: string;
  CostItems: CostItem[];
  FilterConds: string[];
  BreakLevel?: number;
  ParamDescList: number[];
  LifeEffectParams: string[];
  OpenConfig: string;
  AddProps: AddProp[];
  Param: number[];
  LifeEffectType?: string;
  CoinCost?: number;
}

interface AddProp {}

interface CostItem {
  Id?: number;
  Count?: number;
}
