import axios from "axios";
import jquery from "jquery";
import fs from "fs-extra";
import chalk from "chalk";
import { URL } from "url";
import { JSDOM } from "jsdom";

// extra
import type { IAvatar } from "../../modules/core/interface";
import { BuffType, ElementType, Region, WeaponType } from "../../modules/core/enum";
import { saveObject } from "../util";

const http = axios.create({
  headers: {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36 Edg/87.0.664.66",
  },
});

function toFilename(url: string) {
  const STORE_DIR = "tmp/";
  const u = new URL(url);
  const path = u.hostname + u.pathname.replace(/\/$/, "");
  const dir = STORE_DIR + path.split("/").slice(0, -1).join("/").replace(/[\/]/g, "_");
  let filename = path.split("/").slice(-1).join("/");
  if (!filename.includes(".")) filename += ".html";
  return { dir, filename, path: dir + "/" + filename };
}

async function checkCache(filename: string) {
  const fn = await fs.stat(filename).catch(() => {});
  if (fn && fn.mtime.getTime() > Date.now()) {
    // console.log("[Cache] hit:", filename);
    return true;
  }
  return false;
}

async function saveWithTime(file: string, data: any, time: Date) {
  await fs.writeFile(file, data).catch(console.error);
  await fs.utimes(file, time, time).catch(console.error);
}

async function getWithCache(url: string) {
  const { dir, path } = toFilename(url);
  if (await checkCache(path)) {
    return fs.readFile(path);
  }
  const page = await http.get(url);
  const expires = new Date(page.headers["expires"]);
  await fs.ensureDir(dir);
  /* await */ saveWithTime(path, page.data, expires);
  return page.data;
}

async function loadPage(url: string) {
  const page = await getWithCache(url);
  const { window } = new JSDOM(page);
  const $ = jquery(window);
  return ($ as unknown) as JQueryStatic & JQuery;
}

export async function run() {
  const listPage$ = await loadPage("https://genshin.honeyhunterworld.com/db/char/characters/");
  const names = listPage$(".page > div > div > div > div > a > span")
    .toArray()
    .map(v => listPage$(v).text());

  await Promise.all(
    names.map(async name => {
      const urlName = name.replace(/[()]/g, "").replace(" ", "_").toLowerCase();
      const charPage$ = await loadPage(`https://genshin.honeyhunterworld.com/db/char/${urlName}/`);

      const char: IAvatar = {
        name,
        element: toElement(charPage$("#live_data > table:nth-child(1) tr:nth-child(6) > td:nth-child(2) > img").attr("src")!),
        // gender: toGender(name),
        rarity: charPage$("#live_data .item_main_table .sea_char_stars").length,
        region: toRegion(name, charPage$("#scroll_stories ~ table:first tr:nth-child(2)").text()),
        weapon: toWeaponType(charPage$("#live_data > table:nth-child(1) tr:nth-child(5) > td:nth-child(2)").text()),
        ascensionType: toAscensionType(charPage$("#live_data > table:nth-child(5) tr:nth-child(1) > td:nth-child(5)").text()),
        baseHP: +charPage$("#live_data > table:nth-child(5) tr:nth-child(2) > td:nth-child(2)").text(),
        baseDEF: +charPage$("#live_data > table:nth-child(5) tr:nth-child(2) > td:nth-child(3)").text(),
        baseATK: +charPage$("#live_data > table:nth-child(5) tr:nth-child(2) > td:nth-child(4)").text(),
      };
      await saveObject("char", name + ".json", char);
      // return
      console.log(`${chalk.blue("[char]")} saved ${name}`);
    })
  );
}

function toAscensionType(str: string) {
  switch (str) {
    case "ATK%":
      return BuffType.ATKRatio;
    case "HP%":
      return BuffType.HPRatio;
    case "DEF%":
      return BuffType.DEFRatio;
    case "CRIT Rate%":
      return BuffType.CRITRate;
    case "CRIT DMG%":
      return BuffType.CRITDMG;
    case "Healing Bonus%":
      return BuffType.Heal;
    case "Elemental Mastery":
      return BuffType.ElementalMastery;
    case "Pyro DMG%":
      return BuffType.PyroDMG;
    case "Hydro DMG%":
      return BuffType.HydroDMG;
    case "Dendro DMG%":
      return BuffType.DendroDMG;
    case "Electro DMG%":
      return BuffType.ElectroDMG;
    case "Anemo DMG%":
      return BuffType.AnemoDMG;
    case "Cryo DMG%":
      return BuffType.CryoDMG;
    case "Geo DMG%":
      return BuffType.GeoDMG;
    case "Phys DMG%":
      return BuffType.PhysicalDMG;
    case "Energy Recharge%":
      return BuffType.EnergyRecharge;

    default:
      console.warn(`${chalk.red("[parser]")} unknown AscensionType type:`, str);
      return BuffType.Unknown;
  }
}
function toWeaponType(str: string) {
  switch (str) {
    case "Sword":
      return WeaponType.Sword;
    case "Bow":
      return WeaponType.Bow;
    case "Polearm":
      return WeaponType.Polearm;
    case "Claymore":
      return WeaponType.Claymore;
    case "Catalyst":
      return WeaponType.Catalyst;

    default:
      console.warn(`${chalk.red("[parser]")} unknown Weapon type:`, str);
      return WeaponType.Unknown;
  }
}
function toRegion(name: string, str: string) {
  switch (name) {
    case "Fischl":
    case "Mona":
    case "Albedo":
    case "Sucrose":
    case "Venti":
      return Region.Mondstadt;
    case "Qiqi":
      return Region.Liyue;
    default:
      break;
  }
  if (name.includes("Traveler")) return Region.Unknown;
  if (str.includes("Mondstadt") || str.includes("Knights of Favonius")) return Region.Mondstadt;
  if (str.includes("Liyue")) return Region.Liyue;
  if (str.includes("Inazuma")) return Region.Inazuma;
  if (str.includes("Sumeru")) return Region.Sumeru;
  if (str.includes("Fontaine")) return Region.Fontaine;
  if (str.includes("Natlan")) return Region.Natlan;
  if (str.includes("Snezhnaya") || str.includes("Eleven Harbingers")) return Region.Snezhnaya;
  console.warn(`${chalk.red("[parser]")} unknown Region type(${name}):`, str);
  process.exit(2);
  return Region.Unknown;
}
function toGender(str: string): 0 | 1 {
  switch (str) {
    case "Albedo":
    case "Bennett":
    case "Diluc":
    case "Kaeya":
    case "Razor":
    case "Tartaglia":
    case "Venti":
    case "Zhongli":
      return 1;
    default:
      return 0;
  }
}

function toElement(str: string): ElementType {
  const m = str.match(/\/(\w+?)_35/);
  if (!m) return ElementType.Any;
  switch (m[1]) {
    case "anemo":
      return ElementType.Anemo;
    case "geo":
      return ElementType.Geo;
    case "electro":
      return ElementType.Electro;
    case "dendro":
      return ElementType.Dendro;
    case "hydro":
      return ElementType.Hydro;
    case "pyro":
      return ElementType.Pyro;
    case "cryo":
      return ElementType.Cryo;
    default:
      console.warn(`${chalk.red("[parser]")} unknown Element type:`, m[1]);
      return ElementType.Any;
  }
}
