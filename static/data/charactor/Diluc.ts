import { ICharacter } from "~/core";

export default <ICharacter>{
  name: "Diluc",
  region: 1,
  gender: 1,
  rarity: 5,
  element: 6,
  weapon: 3,
  attack: {
    name: "Tempered Sword",
    normalAttack: [
      {
        name: "1-Hit",
        damage: [89.7, 97, 104, 115, 122, 130],
        actTime: 0.66,
      },
      {
        name: "2-Hit",
        damage: [87.6, 94.8, 102, 112, 119, 127],
        actTime: 0.66,
      },
      {
        name: "3-Hit",
        damage: [98.8, 107, 115, 126, 134, 144],
        actTime: 0.66,
      },
      {
        name: "4-Hit",
        damage: [134, 145, 156, 171, 182, 195],
        actTime: 0.66,
        backTime: 0.66,
      },
    ],
    chargeAttack: [
      {
        name: "Spinning",
        damage: [68.8, 74.4, 80, 88, 94, 100],
        actTime: 0.66,
        backTime: 0,
        staminaCost: 40,
      },
      {
        name: "Spinning Final",
        damage: [125, 135, 145, 160, 170, 181],
        actTime: 0.66,
        backTime: 0,
      },
    ],
    plungeAttack: [
      {
        name: "Plunge",
        damage: [89.5, 96.8, 104, 114, 122, 130],
      },
      {
        name: "Low Plunge",
        damage: [179, 194, 208, 229, 243, 260],
      },
      {
        name: "High Plunge",
        damage: [224, 242, 260, 286, 304, 325],
      },
    ],
  },

  elementalSkill: {
    name: "Searing Onslaught",
    cd: 10,
    attrs: [
      {
        name: "1-Hit",
        type: "atk",
        damage: [94.4, 101, 109, 118, 125, 132, 142, 151, 160, 170, 179, 189, 201],
      },
      {
        name: "2-Hit",
        type: "atk",
        damage: [97.6, 105, 112, 122, 129, 137, 146, 156, 166, 176, 185, 195, 207],
      },
      {
        name: "3-Hit",
        type: "atk",
        damage: [129, 138, 148, 161, 171, 180, 193, 206, 219, 232, 245, 258, 274],
      },
    ],
  },
  elementalBurst: {
    name: "Dawn",
    cd: 12,
    energyCost: 40,
    attrs: [
      {
        name: "Slashing",
        type: "damage",
        damage: [204, 219, 235, 255, 270, 286, 306],
      },
      {
        name: "DoT",
        type: "damage",
        damage: [60, 64.5, 69, 75, 79.5, 84, 90],
      },
      {
        name: "Explosion",
        type: "damage",
        damage: [204, 219, 235, 255, 270, 286, 306],
      },
      {
        name: "Pyro Enhance",
        type: "enhance",
        duration: 8,
      },
    ],
  },
  talents: [
    {
      name: "Relentless",
      effects: [
        {
          path: "attack.chargeAttack[0].duration",
          value: 8,
        },
        {
          path: "attack.chargeAttack[0].staminaCost",
          value: 20,
        },
      ],
    },
    {
      name: "Blessing of Phoenix",
      effects: [
        {
          path: "attack.elementalBurst[3].duration",
          value: 12,
        },
        {
          path: "attack.elementalBurst[3].buff",
          value: [{ type: 17, value: 20 }],
        },
      ],
    },
  ],
  baseHP: [1011, 2621, 3488],
  baseATK: [26, 68, 90],
  baseDEF: [61, 158, 211],
  ascensionType: 9,
  ascensionValue: [4.8, 9.6, 14.4, 19.4],
  constellations: [
    {
      name: "Conviction",
      buff: {},
    },
    {
      name: "Searing Ember",
    },
    {
      name: "Steel and Fire",
    },
    {
      name: "Flowing Flame",
    },
    {
      name: "Phoenix, Harbinger of Dawn",
    },
    {
      name: "Flaming Sword, Nemesis of Dark",
    },
  ],
};
