import fs from "fs-extra";
import { BodyType, Region } from "../../modules/core/enum";
import { IAvatar, ISkill, IAscension, IConstellation } from "../../modules/core/interface";

// extra
import { DATA_DIR, Dict, saveTranslation, toNum, toText, toWeaponType, toTags, toElement, toItem, toID, toAttrType } from "../util";

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
  const talentData: AvatarTalentExcelConfigData[] = await fs.readJSON(DATA_DIR + "Excel/AvatarTalentExcelConfigData.json");
  const talentIndex = new Map(talentData.map(v => [v.TalentId, v]));
  const proudSkillData: ProudSkillExcelConfigData[] = await fs.readJSON(DATA_DIR + "Excel/ProudSkillExcelConfigData.json");
  const proudSkillIndex = proudSkillData.reduce<Dict<ProudSkillExcelConfigData[]>>((r, v) => {
    if (v.ProudSkillId in r) r[v.ProudSkillId].push(v);
    else r[v.ProudSkillId] = [v];
    return r;
  }, {});
  const promoteData: AvatarPromoteExcelConfigData[] = await fs.readJSON(DATA_DIR + "Excel/AvatarPromoteExcelConfigData.json");
  const promoteIndex = promoteData.reduce<Dict<AvatarPromoteExcelConfigData[]>>((r, v) => {
    if (v.AvatarPromoteId in r) r[v.AvatarPromoteId].push(v);
    else r[v.AvatarPromoteId] = [v];
    return r;
  }, {});

  const normalAvatars = data.filter(v => v.UseType === "AVATAR_FORMAL");

  for (const char of normalAvatars) {
    const id = toText(char.NameTextMapHash).replace(/ /g, "");
    if (id.includes("(Test)") || char.UseType === "AVATAR_ABANDON" || char.UseType === "AVATAR_SYNC_TEST") continue;
    await saveTranslation("char", id + ".json", t => {
      const tags = toTags(char.FeatureTagGroupId);
      const skills = toSkills(char.SkillDepotId);
      const ascensions = toAscension(char.AvatarPromoteId);
      const avatar: IAvatar = {
        id: toID(char.NameTextMapHash),
        name: t(char.NameTextMapHash),
        desc: t(char.DescTextMapHash),
        baseHP: toNum(char.HpBase || 0),
        baseATK: toNum(char.AttackBase || 0),
        baseDEF: toNum(char.DefenseBase || 0),
        bodyType: toBodyType(char.BodyType),
        rarity: toRarity(char.QualityType),
        weapon: toWeaponType(char.WeaponType),
        region: toRegion(tags),
        ascensions,
        ascensionType: ascensions ? ascensions[0].attrs[3].type : 0,
        element: skills.element,
        elemSkill: skills.eSkill,
        elemBurst: skills.qSkill,
        attackSkill: skills.aSkill,
        c13ns: skills.talents,
      };
      return avatar;

      function toAscension(aid: number) {
        const promote = promoteIndex[aid];
        return promote
          .filter(v => v.PromoteLevel)
          .map(v => {
            const rst: IAscension = {
              level: v.PromoteLevel || 0,
              itemCost: v.CostItems.filter(v => v.Id).map(it => {
                const item = toItem(it.Id!);
                if (!item) {
                  // console.warn(`[item] ${id}:${it.Id} not found`);
                  return { name: "???", count: it.Count! };
                }
                return { name: toID(item.NameTextMapHash), count: it.Count! };
              }),
              attrs: v.AddProps.filter(p => p.PropType).map(p => {
                return { type: toAttrType(p.PropType!), value: p.Value ? toNum(p.Value) : 0 };
              }),
            };
            return rst;
          });
      }

      function toSkills(depotId: number) {
        const depot = depotIndex.get(depotId)!;
        const [aSkill, eSkill] = depot.Skills.filter(Boolean).map(toSkill);
        // const [aimPress,aim,weaponCD,teamCD]=depot.SubSkills.filter(Boolean).map(toSkill)
        // attackMode: depot.AttackModeSkill && toSkill(depot.AttackModeSkill),

        const elem = skillIndex.get(depot.EnergySkill)!;
        if (!elem) {
          // console.warn(`[skill] no elem of ${id}(${depotId}):${depot.EnergySkill}`);
        }
        return {
          aSkill, // 普攻
          eSkill, // E技能
          qSkill: depot.EnergySkill ? toSkill(depot.EnergySkill) : undefined,
          talents: depot.Talents.filter(Boolean).map(toC13n),
          element: elem ? toElement(elem.CostElemType!) : 0, // 元素
        };
      }

      function toC13n(talentId: number) {
        const talent = talentIndex.get(talentId)!;
        const rst: IConstellation = {
          name: t(talent.NameTextMapHash),
          desc: t(talent.DescTextMapHash),
          values: talent.Param.map(toNum).filter(Boolean),
        };
        return rst;
      }
      function toSkill(skillId: number) {
        const skill = skillIndex.get(skillId)!;
        const proud = (skill.ProudSkillGroupId && proudSkillIndex[skill.ProudSkillGroupId]) || undefined;
        const rst: ISkill = {
          name: t(skill.NameTextMapHash),
          desc: t(skill.DescTextMapHash),
          cd: toNum(skill.CdTime || 0),
        };
        if (proud) {
          rst.paramTpls = proud[0].ParamDescList.map(v => t(v));
          rst.paramVals = proud.map(lv => lv.Param.map(toNum));
        }
        if (skill.CostElemVal) rst.energyCost = skill.CostElemVal;
        return rst;
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

      function toBodyType(raw: string) {
        return (BodyType[raw as any] as any) as BodyType;
      }

      function toRarity(raw: string) {
        const nm: Dict<number> = { QUALITY_BLUE: 3, QUALITY_PURPLE: 4, QUALITY_ORANGE: 5 };
        return nm[raw];
      }
    });
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
