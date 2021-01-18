import fs from "fs-extra";

export async function run() {
  await fs.copy("dist", "../content", { overwrite: true, recursive: true });
}
