import chalk from "chalk";
import mongoose from "mongoose";

const DB = process.env.DB!;

mongoose.connect(DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log(chalk.green("✔"), "Connected to", chalk.blue(DB));
});

export * from "./models/User";
export * from "./models/UserArtifact";
export * from "./models/UserAvatar";
export * from "./models/UserWeapon";
