import { exec } from "child_process";

export function run() {
  return new Promise(resolve => {
    const p = exec("yarn svgo -f ../resource/icon/ --pretty");
    p.stdout?.pipe(process.stdout);
    p.on("exit", resolve);
  });
}
