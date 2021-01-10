import fs from "fs-extra";
import { groupBy, map, keyBy } from "lodash";

// extra
import { DATA_DIR, Dict, saveObject, toAttrType, toNum } from "../util";
import { BuffType } from "../../modules/core/enum";

export async function run() {
  const data: ReliquaryLevelData[] = await fs.readJSON(DATA_DIR + "Excel/ReliquaryLevelExcelConfigData.json");
  const dropData: ReliquaryMainPropData[] = await fs.readJSON(DATA_DIR + "Excel/ReliquaryMainPropExcelConfigData.json");

  const normalData = data.filter(v => v.Rank);

  const groups = groupBy(normalData, v => v.Rank);
  const typenames = groups[5][0].AddProps.map(v => BuffType[toAttrType(v.PropType)]);

  const rst = map(groups, (group, rank) => {
    const maxLevel = toMaxLevel(~~rank);
    const normalGroup = group
      .filter(v => v.Level <= maxLevel)
      .map(v => {
        return v.AddProps.map(v => toNum(v.Value));
      });

    return normalGroup;
  });
  await saveObject("curve", "mainattr.json", rst);

  const weights = [
    // 花
    toWeight(4000),
    // 毛
    toWeight(2000),
    // 沙
    toWeight(1000),
    // 时
    toWeight(5000),
    // 头
    toWeight(3000),
  ];

  await saveObject("curve", "mainattr_order.json", typenames);
  await saveObject("curve", "mainattr_weight.json", weights);

  function toWeight(depotId: number) {
    const weightMap = keyBy(
      dropData.filter(v => v.PropDepotId === depotId),
      v => BuffType[toAttrType(v.PropType)]
    );
    const rst = typenames.reduce<Dict<number>>((r, v) => {
      if (!weightMap[v]?.Weight) return r;
      r[v] = weightMap[v].Weight;
      return r;
    }, {});
    return rst;
  }
}

function toMaxLevel(rank: number) {
  return [0, 5, 9, 13, 17, 21][rank];
}

interface ReliquaryLevelData {
  Level: number;
  AddProps: AddProp[];
  Rank?: number;
  Exp?: number;
}

interface AddProp {
  PropType: string;
  Value: number;
}

interface ReliquaryMainPropData {
  Id: number;
  PropDepotId: number;
  PropType: string;
  AffixName: string;
  Weight: number;
}
