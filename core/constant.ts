import { ArtifactSeries, BuffCondition, BuffTarget, BuffType, ElementType } from "./enum";
import { IArtifactSetBonus, IBuff, IWeapon } from "./interface";

/** 角色 */
export namespace CHARACTER {
  /** 突破对应等级上限 */
  export const MAX_BASE_LEVEL = [20, 40, 50, 60, 70, 80, 90];
  /** 需要冒险等级 */
  export const REQUIRED_ADVENTURE_RANK = [0, 15, 25, 30, 35, 40, 50];
  /** 到等级上限升级所需经验(总量) */
  export const EXP_TO_NEXT_LEVEL = [120175, 696500, 1277600, 2131725, 3327650, 4939525, 8362650];
  /** 到等级上限升级所需摩拉(总量) */
  export const GOLD_TO_NEXT_LEVEL = [24035, 159700, 315520, 546345, 866345, 1287905, 2092530];

  /** 元素共鸣 */
  export const ELEMENTAL_RESONANCE: { [name: string]: IBuff[] } = {
    ProtectiveCanopy: [{ type: BuffType.AllRES, value: 0.15 }],
    ImpetuousWinds: [
      { type: BuffType.StaminaConsumption, value: -0.15 },
      { type: BuffType.MovementSPD, value: 0.1 },
      { type: BuffType.SkillSPD, value: 0.05 },
    ],
    EnduringRock: [
      { type: BuffType.InterruptionRES, value: 3 },
      { type: BuffType.AllDMG, value: 0.15, cond: BuffCondition.Shield },
    ],
    HighVoltage: [
      { type: BuffType.ElementalAffectDuration, value: -0.4, element: ElementType.Hydro },
      // TODO: Superconduct, Overloaded, and Electro-Charged have a 100% chance to generate an Electro Elemental Particle (CD: 5s).
    ],
    SoothingWater: [
      { type: BuffType.ElementalAffectDuration, value: -0.4, element: ElementType.Pyro },
      { type: BuffType.Healen, value: 0.3 },
    ],
    FerventFlames: [
      { type: BuffType.ElementalAffectDuration, value: -0.4, element: ElementType.Cryo },
      { type: BuffType.ATK, value: 0.25 },
    ],
    ShatteringIce: [
      { type: BuffType.ElementalAffectDuration, value: -0.4, element: ElementType.Electro },
      { type: BuffType.CRITRate, value: 0.15, cond: BuffCondition.ElementAffect, element: ElementType.Cryo },
    ],
  };
}

/** 武器 */
export namespace WEAPON {
  /** 突破对应等级上限 */
  export const MAX_BASE_LEVEL = [20, 40, 50, 60, 70, 80, 90];
  /** 需要冒险等级 */
  export const REQUIRED_ADVENTURE_RANK = [0, 15, 25, 30, 35, 40, 50];
  /** 到等级上限升级所需经验(总量) */
  export const EXP_TO_NEXT_LEVEL = [
    [24325, 148875, 274500, 460025, 719875],
    [36400, 223225, 411650, 689950, 1079675],
    [53475, 327475, 603825, 1011975, 1583600, 2353725, 3988200],
    [81000, 496125, 914850, 1533250, 2399300, 3566175, 6042650],
    [121550, 744350, 1372500, 2300175, 3599300, 5349675, 9064450],
  ];
  /** 到等级上限升级所需摩拉(总量) */
  export const GOLD_TO_NEXT_LEVEL = [
    [2432, 14887, 32450, 56002, 91987],
    [3640, 27322, 51165, 88995, 1079675],
    [5347, 37747, 75382, 131197, 208360, 310372, 503820],
    [8100, 54612, 111485, 193325, 309930, 461617, 754265],
    [12155, 84435, 167250, 290017, 464930, 694967, 1131445],
  ];

  export const WEAPONS: { [id: number]: IWeapon } = {};

  // export const DEFAULT_WEAPON: { [k: number]: IWeapon } = {
  //   [WeaponType.Sword]: { id: "风鹰剑" },
  //   [WeaponType.Bow]: {},
  //   [WeaponType.Polearm]: {},
  //   [WeaponType.Claymore]: {},
  //   [WeaponType.Catalyst]: {},
  // };
}

const percent = (a: number[]) => a.map(v => v / 1e3);

/** 圣遗物 */
export namespace ARTIFACT {
  /** 到等级上限升级所需经验(总量) */
  export const EXP_TO_NEXT_LEVEL = [
    [600, 1350, 2225, 3250],
    [1200, 2700, 4475, 6525],
    [1800, 4025, 6675, 9775, 13325, 17325, 21825, 26825, 32550, 38425, 45050, 52275],
    [2400, 5375, 8925, 13050, 17775, 23125, 29125, 35800, 43175, 51275, 60125, 69750, 80175, 92300, 106375, 122675],
    [3000, 6725, 11150, 16300, 22200, 28875, 36375, 44725, 53950, 64075, 75125, 87150, 100175, 115325, 132925, 153300, 176800, 203850, 234900, 270475],
  ];
  /** 到等级上限升级所需摩拉(总量) */
  export const GOLD_TO_NEXT_LEVEL = EXP_TO_NEXT_LEVEL;

  /** 强化提供经验 */
  export const RARYTIY_TO_EXP = [420, 840, 1260, 2520, 3780];

  /** 强化暴击概率 */
  export const ENHANCE_CRIT_RATE = [
    [2, 0.05],
    [5, 0.01],
  ];

  /** 主词条 */
  export const MAIN_PROPERTY: { [k: number]: number[] } = {};
  /** 稀有度-主词条缩放 */
  export const MAIN_PROPERTY_SCALE = [0, 0.4, 0.6, 0.8, 1];

  /** 部位主词条范围 */
  export const PART_MAIN_PROPERTY = [
    [BuffType.ExtHP],
    [BuffType.ExtATK],
    [BuffType.HP, BuffType.ATK, BuffType.DEF, BuffType.ElementalMastery, BuffType.EnergyRecharge],
    [
      BuffType.HP,
      BuffType.ATK,
      BuffType.DEF,
      BuffType.ElementalMastery,
      BuffType.PyroDMG,
      BuffType.HydroDMG,
      BuffType.ElectroDMG,
      BuffType.AnemoDMG,
      BuffType.CryoDMG,
      BuffType.GeoDMG,
      BuffType.PhysicalDMG,
    ],
    [BuffType.HP, BuffType.ATK, BuffType.DEF, BuffType.ElementalMastery, BuffType.CRITRate, BuffType.CRITDMG, BuffType.Heal],
  ];

  /** 副词条取值 */
  export const SUB_PROPERTY: { [k: number]: number[] } = {
    [BuffType.ExtHP]: [209, 239, 269, 299],
    [BuffType.ExtATK]: [14, 16, 18, 19],
    [BuffType.ExtDEF]: [16, 19, 21, 23],
    [BuffType.ElementalMastery]: [16, 19, 21, 23],
    [BuffType.EnergyRecharge]: percent([45, 52, 58, 65]),
    [BuffType.DEF]: percent([51, 58, 66, 73]),
    [BuffType.HP]: percent([41, 47, 53, 58]),
    [BuffType.ATK]: percent([41, 47, 53, 58]),
    [BuffType.CRITRate]: percent([27, 31, 35, 39]),
    [BuffType.CRITDMG]: percent([54, 62, 70, 78]),
  };

  /** 系列对应稀有度 */
  export const SERIES_TO_RARITY: { [k: number]: number[] } = {
    [ArtifactSeries.Adventurer]: [1, 2, 3],
    [ArtifactSeries.LuckyDog]: [1, 2, 3],
    [ArtifactSeries.TravelingDoctor]: [1, 2, 3],
    [ArtifactSeries.Instructor]: [3, 4],
    [ArtifactSeries.Berserker]: [3, 4],
    [ArtifactSeries.TheExile]: [3, 4],
    [ArtifactSeries.ResolutionOfSojourner]: [3, 4],
    [ArtifactSeries.MartialArtist]: [3, 4],
    [ArtifactSeries.DefenderSWill]: [3, 4],
    [ArtifactSeries.TinyMiracle]: [3, 4],
    [ArtifactSeries.BraveHeart]: [3, 4],
    [ArtifactSeries.Gambler]: [3, 4],
    [ArtifactSeries.Scholar]: [3, 4],
    [ArtifactSeries.PrayersForWisdom]: [3, 4],
    [ArtifactSeries.PrayersToSpringtime]: [3, 4],
    [ArtifactSeries.PrayersForIllumination]: [3, 4],
    [ArtifactSeries.PrayersForDestiny]: [3, 4],
    [ArtifactSeries.GladiatorSFinale]: [4, 5],
    [ArtifactSeries.MaidenBeloved]: [4, 5],
    [ArtifactSeries.NoblesseOblige]: [4, 5],
    [ArtifactSeries.BloodstainedChivalry]: [4, 5],
    [ArtifactSeries.WandererSTroupe]: [4, 5],
    [ArtifactSeries.ViridescentVenerer]: [4, 5],
    [ArtifactSeries.ThunderingFury]: [4, 5],
    [ArtifactSeries.Thundersoother]: [4, 5],
    [ArtifactSeries.CrimsonWitchOfFlames]: [4, 5],
    [ArtifactSeries.Lavawalker]: [4, 5],
    [ArtifactSeries.ArchaicPetra]: [4, 5],
    [ArtifactSeries.RetracingBolide]: [4, 5],
    [ArtifactSeries.GlacierAndSnowfield]: [4, 5],
    [ArtifactSeries.Icebreaker]: [4, 5],
  };

  /** 圣遗物套装效果 */
  export const SERIES_TO_EFFECT: { [k: number]: IArtifactSetBonus[] } = {
    [ArtifactSeries.Adventurer]: [
      {
        pieces: 2,
        // HP increased by 1,000.
        buffs: [{ type: BuffType.ExtHP, value: 1000 }],
      },
      {
        pieces: 4,
        // Opening chest regenerates 30% HP over 5s.
        buffs: [],
      },
    ],
    [ArtifactSeries.LuckyDog]: [
      {
        pieces: 2,
        // DEF increased by 100.
        buffs: [{ type: BuffType.DEF, value: 100 }],
      },
      {
        pieces: 4,
        // Picking up Mora restores 300 HP.
        buffs: [],
      },
    ],
    [ArtifactSeries.TravelingDoctor]: [
      {
        pieces: 2,
        // Increases incoming healing by 20%.
        buffs: [{ type: BuffType.Healen, value: 0.2 }],
      },
      {
        pieces: 4,
        // Using Elemental Burst restores 20% HP.
        buffs: [],
      },
    ],
    [ArtifactSeries.Instructor]: [
      {
        pieces: 2,
        // Increases Elemental Mastery by 80.
        buffs: [{ type: BuffType.ElementalMastery, value: 80 }],
      },
      {
        pieces: 4,
        // After causing an elemental reaction, increases all party members' Elemental Mastery by 120 for 8s.
        buffs: [{ type: BuffType.ElementalMastery, value: 80, cond: BuffCondition.ElementalReaction }],
      },
    ],
    [ArtifactSeries.Berserker]: [
      {
        pieces: 2,
        // CRIT Rate +12%
        buffs: [{ type: BuffType.CRITRate, value: 0.12 }],
      },
      {
        pieces: 4,
        // When HP is below 70%, CRIT Rate increases by an additional 24%.
        buffs: [{ type: BuffType.CRITRate, value: 0.24, cond: BuffCondition.Expression, expr: "HP < 70%" }],
      },
    ],
    [ArtifactSeries.TheExile]: [
      {
        pieces: 2,
        // Energy Recharge +20%
        buffs: [{ type: BuffType.EnergyRecharge, value: 0.2 }],
      },
      {
        pieces: 4,
        // Using an Elemental Burst regenerates 2 Energy for all party members (excluding the wearer) every 2s for 6s. This effect cannot stack.
        buffs: [],
      },
    ],
    [ArtifactSeries.ResolutionOfSojourner]: [
      {
        pieces: 2,
        // ATK +18%
        buffs: [{ type: BuffType.ATK, value: 0.12 }],
      },
      {
        pieces: 4,
        // Increases Charged Attack CRIT Rate by 30%.
        buffs: [{ type: BuffType.CRITRate, value: 0.3, target: BuffTarget.ChargeAttack }],
      },
    ],
    [ArtifactSeries.MartialArtist]: [
      {
        pieces: 2,
        // Increases Normal Attack and Charged Attack DMG by 15%.
        buffs: [{ type: BuffType.AllDMG, value: 0.15, target: BuffCondition.NormalAttack | BuffCondition.ChargeAttack }],
      },
      {
        pieces: 4,
        // After using Elemental Skill, increases Normal Attack and Charged Attack DMG by 25% for 8s.
        buffs: [
          {
            type: BuffType.AllDMG,
            value: 0.25,
            target: BuffTarget.NormalAttack | BuffTarget.ChargeAttack,
            cond: BuffCondition.ElementalSkill,
            duration: 8,
          },
        ],
      },
    ],
    [ArtifactSeries.DefenderSWill]: [
      {
        pieces: 2,
        // 	DEF +30%
        buffs: [{ type: BuffType.DEF, value: 0.3 }],
      },
      {
        pieces: 4,
        // Increases Elemental RES by 30% for each element present in the party.
        buffs: [{ type: BuffType.AllRES, value: 0.3 }],
      },
    ],
    [ArtifactSeries.TinyMiracle]: [
      {
        pieces: 2,
        // All Elemental RES increased by 20%
        buffs: [{ type: BuffType.AllRES, value: 0.2 }],
      },
      {
        pieces: 4,
        // Incoming elemental DMG increases corresponding Elemental RES by 30% for 10s. Can only occur once every 10s.
        buffs: [],
      },
    ],
    [ArtifactSeries.BraveHeart]: [
      {
        pieces: 2,
        // ATK +18%
        buffs: [{ type: BuffType.ATK, value: 0.18 }],
      },
      {
        pieces: 4,
        // Increases DMG by 30% against enemies with more than 50% HP.
        buffs: [],
      },
    ],
    [ArtifactSeries.Gambler]: [
      {
        pieces: 2,
        // Elemental Skill DMG increased by 20%
        buffs: [{ type: BuffType.AllDMG, value: 0.2, target: BuffTarget.ElementalSkill }],
      },
      {
        pieces: 4,
        // Defeating an enemy has 100% chance to remove Elemental Skill CD. Can only occur once every 15s.
        buffs: [],
      },
    ],
    [ArtifactSeries.Scholar]: [
      {
        pieces: 2,
        // Energy Recharge +20%
        buffs: [{ type: BuffType.EnergyRecharge, value: 0.2 }],
      },
      {
        pieces: 4,
        // Gaining Energy gives 3 Energy to all party members who have a bow or a catalyst equipped. Can only occurs once every 3s.
        buffs: [],
      },
    ],
    [ArtifactSeries.PrayersForWisdom]: [
      {
        pieces: 1,
        // Affected by Electro for 40% less time.
        buffs: [],
      },
    ],
    [ArtifactSeries.PrayersToSpringtime]: [
      {
        pieces: 1,
        // Affected by Cryo for 40% less time.
        buffs: [],
      },
    ],
    [ArtifactSeries.PrayersForIllumination]: [
      {
        pieces: 1,
        // Affected by Pyro for 40% less time.
        buffs: [],
      },
    ],
    [ArtifactSeries.PrayersForDestiny]: [
      {
        pieces: 1,
        // Affected by Hydro for 40% less time.
        buffs: [],
      },
    ],
    [ArtifactSeries.GladiatorSFinale]: [
      {
        pieces: 2,
        // ATK +18%
        buffs: [{ type: BuffType.ATK, value: 0.18 }],
      },
      {
        pieces: 4,
        // If the wielder of this artifact set uses a Sword, Claymore or Polearm, increases their Normal Attack DMG by 35%.
        buffs: [{ type: BuffType.AllDMG, value: 0.35, target: BuffTarget.NormalAttack, cond: BuffCondition.Expression, expr: "WeaponType = Melee" }],
      },
    ],
    [ArtifactSeries.MaidenBeloved]: [
      {
        pieces: 2,
        // Character Healing Effectiveness +15%
        buffs: [{ type: BuffType.Heal, value: 0.15 }],
      },
      {
        pieces: 4,
        // Using an Elemental Skill or Burst increases healing received by all party members by 20% for 10s.
        buffs: [{ type: BuffType.Healen, value: 0.2, cond: BuffCondition.ElementalBurst | BuffCondition.ElementalBurst, duration: 10 }],
      },
    ],
    [ArtifactSeries.NoblesseOblige]: [
      {
        pieces: 2,
        // Elemental Burst DMG +20%
        buffs: [{ type: BuffType.AllDMG, value: 0.2, target: BuffTarget.ElementalBurst }],
      },
      {
        pieces: 4,
        // Using an Elemental Burst increases all party members' ATK by 20% for 12s. This effect cannot stack.
        buffs: [{ type: BuffType.ATK, value: 0.2, cond: BuffCondition.ElementalBurst, duration: 12 }],
      },
    ],
    [ArtifactSeries.BloodstainedChivalry]: [
      {
        pieces: 2,
        // Physical DMG +25%
        buffs: [{ type: BuffType.PhysicalDMG, value: 0.25 }],
      },
      {
        pieces: 4,
        // After defeating an opponent, increases Charged Attack DMG by 50%, and reduces its Stamina cost to 0 for 10s.
        buffs: [{ type: BuffType.AllDMG, value: 0.5, target: BuffTarget.ChargeAttack, cond: BuffCondition.Defeating, duration: 10 }],
      },
    ],
    [ArtifactSeries.WandererSTroupe]: [
      {
        pieces: 2,
        // Elemental Mastery +80
        buffs: [{ type: BuffType.ElementalMastery, value: 80 }],
      },
      {
        pieces: 4,
        // Increases Charged Attack DMG by 35% if the character uses a Catalyst or Bow.
        buffs: [{ type: BuffType.AllDMG, value: 0.35, target: BuffTarget.ChargeAttack, cond: BuffCondition.Expression, expr: "WeaponType = Ranged" }],
      },
    ],
    [ArtifactSeries.ViridescentVenerer]: [
      {
        pieces: 2,
        // Anemo DMG Bonus +15%
        buffs: [{ type: BuffType.AnemoDMG, value: 0.15 }],
      },
      {
        pieces: 4,
        // Increases Swirl DMG by 60%. Decreases opponent's Elemental RES to the element infused in the Swirl by 40% for 10s.
        buffs: [],
      },
    ],
    [ArtifactSeries.ThunderingFury]: [
      {
        pieces: 2,
        // Electro DMG Bonus +15%
        buffs: [{ type: BuffType.ElectroDMG, value: 0.15 }],
      },
      {
        pieces: 4,
        // Increases damage caused by Overloaded, Electro-Charged, and Superconduct DMG by 40%. Triggering such effects decreases Elemental Skill CD by 1s. Can only occur once every 0.8s.
        buffs: [
          { type: BuffType.ElementalReactionDMG, value: 0.4, element: ElementType.Electro },
          { type: BuffType.SkillCD, value: 1, element: ElementType.Electro },
        ],
      },
    ],
    [ArtifactSeries.Thundersoother]: [
      {
        pieces: 2,
        // Electro RES increased by 40%
        buffs: [{ type: BuffType.ElectroRES, value: 0.4 }],
      },
      {
        pieces: 4,
        // Increases DMG against enemies affected by Electro by 35%.
        buffs: [{ type: BuffType.AllDMG, value: 0.35, cond: BuffCondition.ElementAffect, element: ElementType.Electro }],
      },
    ],
    [ArtifactSeries.CrimsonWitchOfFlames]: [
      {
        pieces: 2,
        // Pyro DMG Bonus +15%
        buffs: [{ type: BuffType.PyroDMG, value: 0.15 }],
      },
      {
        pieces: 4,
        // Increases Overloaded and Burning DMG by 40%. Increases Vaporize and Melt DMG by 15%. Using an Elemental Skill increases 2-Piece Set effects by 50% for 10s. Max 3 stacks.
        buffs: [
          { type: BuffType.ElementalReactionDMG, value: 0.4, element: ElementType.Pyro },
          { type: BuffType.PyroDMG, value: 0.075, maxStack: 3 },
        ],
      },
    ],
    [ArtifactSeries.Lavawalker]: [
      {
        pieces: 2,
        // Pyro RES increased by 40%
        buffs: [{ type: BuffType.PyroRES, value: 0.4 }],
      },
      {
        pieces: 4,
        // Increases DMG against enemies that are Burning or affected by Pyro by 35%.
        buffs: [{ type: BuffType.AllDMG, value: 0.35, cond: BuffCondition.ElementAffect, element: ElementType.Pyro }],
      },
    ],
    [ArtifactSeries.ArchaicPetra]: [
      {
        pieces: 2,
        // Gain a 15% Geo DMG Bonus
        buffs: [{ type: BuffType.GeoDMG, value: 0.15 }],
      },
      {
        pieces: 4,
        // Upon obtaining a crystal created through a Geo Elemental Reaction, all party members gain 35% Elemental DMG Bonus to that particular element for 10s. Only one form of Elemental DMG Bonus can be gained in this manner at any one time.
        buffs: [{ type: BuffType.ElementalDMG, value: 0.35, cond: BuffCondition.ElementalReaction, element: ElementType.Last }],
      },
    ],
    [ArtifactSeries.RetracingBolide]: [
      {
        pieces: 2,
        // Increases the effectiveness of shields by 35%
        buffs: [{ type: BuffType.ShieldEffectiveness, value: 0.35 }],
      },
      {
        pieces: 4,
        // Gain an additional 40% Normal and Charged Attack DMG while under the protection of a shield.
        buffs: [{ type: BuffType.AllDMG, value: 0.4, target: BuffTarget.NormalAttack | BuffTarget.ChargeAttack, cond: BuffCondition.Shield }],
      },
    ],
    [ArtifactSeries.GlacierAndSnowfield]: [
      {
        pieces: 2,
        // Cryo DMG Bonus +15%
        buffs: [{ type: BuffType.CryoDMG, value: 0.15 }],
      },
      {
        pieces: 4,
        // Increases Superconduct DMG by 50%. Increases Melt DMG by 15%. Using an Elemental Burst increases Cryo DMG by 25% for 10s.
        buffs: [],
      },
    ],
    [ArtifactSeries.Icebreaker]: [
      {
        pieces: 2,
        // Cryo RES increased by 40%
        buffs: [{ type: BuffType.CryoRES, value: 0.4 }],
      },
      {
        pieces: 4,
        // Increases DMG against enemies in a Frozen state or affected by cryo by 35%.
        buffs: [{ type: BuffType.AllDMG, value: 0.35, cond: BuffCondition.ElementAffect, element: ElementType.Cryo }],
      },
    ],
  };
}

export namespace ENEMY {
  // 怪物抗性
}
