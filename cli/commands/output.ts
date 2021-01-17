import fs from "fs-extra";

export async function run() {
  await fs.copy("dist/avatar", "../content/avatar", { overwrite: true, recursive: true });
  await fs.copy("dist/weapon", "../content/weapon", { overwrite: true, recursive: true });
}
