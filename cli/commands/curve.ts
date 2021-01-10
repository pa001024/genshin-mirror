import fs from "fs-extra";

// extra
import { DATA_DIR, saveObject } from "../util";

export async function run() {
  const data: CurveData[] = await fs.readJSON(DATA_DIR + "Excel/WeaponCurveExcelConfigData.json");

  const rst: ResultData = {};

  for (const level of data) {
    level.CurveInfos.map(v => {
      if (!rst[v.Type]) {
        rst[v.Type] = [+v.Value.toPrecision(5)];
      } else {
        rst[v.Type].push(+v.Value.toPrecision(5));
      }
    });
  }

  await saveObject("curve", "weapon.json", rst);
}

interface ResultData {
  [x: string]: number[];
}

interface CurveData {
  Level: number;
  CurveInfos: CurveInfo[];
}

interface CurveInfo {
  Type: string;
  Arith: string;
  Value: number;
}
