import fs from "fs-extra";

// extra

export async function run() {
  await fs.emptyDir("./dist");
}
