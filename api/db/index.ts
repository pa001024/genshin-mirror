import chalk from "chalk";
import consola from "consola";
import mongoose from "mongoose";

const DB = process.env.DB!;

mongoose.connect(DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

const db = mongoose.connection;
db.on("error", err => consola.error(err));
db.once("open", () => consola.success("Connected to", chalk.blue(DB)));

export * from "./models/User";
export * from "./models/UserArtifact";
export * from "./models/UserAvatar";
export * from "./models/UserWeapon";
