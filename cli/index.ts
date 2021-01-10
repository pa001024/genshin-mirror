// 数据处理
// require('../../../GenshinData/Excel/')
import chalk from "chalk";
import { program } from "commander";

// commands
import * as icon from "./commands/icon";
import * as char from "./commands/char";
import * as curve from "./commands/curve";
import * as weapon from "./commands/weapon";
import * as mainattr from "./commands/mainattr";
import * as subattr from "./commands/subattr";

program.version("0.0.1");

program.option("-d, --debug", "output extra debugging");
program.option("-i, --icon", "只处理icon");
program.option("-c, --curve", "只处理curve");
program.option("-w, --weapon", "只处理weapon");
program.option("-m, --mainattr", "只处理mainattr");
program.option("-a, --subattr", "只处理subattr");
program.parse(process.argv);

(async function main() {
  if (program.icon) {
    console.log(`${chalk.green("[EXTRA]")} processing icon...`);
    await icon.run();
    return;
  }
  if (program.curve) {
    console.log(`${chalk.green("[EXTRA]")} processing curve...`);
    await curve.run();
    return;
  }
  if (program.weapon) {
    console.log(`${chalk.green("[EXTRA]")} processing weapon...`);
    await weapon.run();
    return;
  }
  if (program.mainattr) {
    console.log(`${chalk.green("[EXTRA]")} processing mainattr...`);
    await mainattr.run();
    return;
  }
  if (program.subattr) {
    console.log(`${chalk.green("[EXTRA]")} processing subattr...`);
    await subattr.run();
    return;
  }

  console.log(`${chalk.green("[STEP1]")} fetch charactors...`);
  await char.run();
})();
