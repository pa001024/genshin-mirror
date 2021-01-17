// 数据处理
import chalk from "chalk";
import { program } from "commander";

program.version("0.0.1");

program.option("-o, --output", "输出到content目录");
program.option("--icon", "处理icon");
program.option("-a, --avatar", "处理char");
program.option("-c, --curve", "处理curve");
program.option("-w, --weapon", "处理weapon");
program.option("-i, --item", "处理item");
program.option("-s, --subattr", "处理subattr");
program.option("-e, --enemy", "处理enemy");
program
  .command("clear")
  .description("清空")
  .action(async args => {
    await runCommand("clear");
  });
program
  .command("parse")
  .aliases(["p"])
  .description("处理")
  .action(async args => {
    // 输出前清理
    if (program.output) {
      console.log(`${chalk.green("[CLI]")} output to content...`);
      await runCommand("clear");
    }

    // 对象处理
    if (program.icon) {
      console.log(`${chalk.green("[CLI]")} processing icon...`);
      await runCommand("icon");
    }
    if (program.curve) {
      console.log(`${chalk.green("[CLI]")} processing curve...`);
      await runCommand("curve");
    }
    if (program.weapon) {
      console.log(`${chalk.green("[CLI]")} processing weapon...`);
      await runCommand("weapon");
    }
    if (program.subattr) {
      console.log(`${chalk.green("[CLI]")} processing subattr...`);
      await runCommand("subattr");
    }
    if (program.item) {
      console.log(`${chalk.green("[CLI]")} processing items...`);
      await runCommand("item");
    }
    if (program.enemy) {
      console.log(`${chalk.green("[CLI]")} processing enemy...`);
      await runCommand("enemy");
    }
    if (program.avatar) {
      console.log(`${chalk.green("[CLI]")} fetch charactors...`);
      await runCommand("avatar");
    }

    /// 输出
    if (program.output) {
      console.log(`${chalk.green("[CLI]")} output to content...`);
      await runCommand("output");
    }
  });
program.parse(process.argv);

function runCommand(name: string): Promise<any> {
  return require("./commands/" + name).run();
}
