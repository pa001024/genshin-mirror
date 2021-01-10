import fs from "fs-extra";
import { groupBy, values, map } from "lodash";
import { BuffType } from "../../modules/core/enum";

// extra
import { DATA_DIR, saveObject, toAttrType, toNum } from "../util";

export async function run() {
  const data: ReliquaryAffixData[] = await fs.readJSON(DATA_DIR + "Excel/ReliquaryAffixExcelConfigData.json");

  const normalDepotId = new Set([101, 201, 301, 401, 501]);
  const normalAffix = data.filter(v => normalDepotId.has(v.DepotId));

  const groups = values(groupBy(normalAffix, v => v.DepotId));
  const rst = groups.map(group => {
    const typeMap = groupBy(group, v => v.PropType);
    return map(typeMap, (val, prop) => {
      const type = toAttrType(prop);
      return { type: BuffType[type], values: val.map(v => toNum(v.PropValue)), weight: val[0].Weight };
    }).map(v => v.values);
  });
  await saveObject("curve", "subattr.json", rst);
}

interface ReliquaryAffixData {
  Id: number;
  DepotId: number;
  GroupId: number;
  PropType: string;
  PropValue: number;
  Weight: number;
  UpgradeWeight: number;
}
