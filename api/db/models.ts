import { prop, getModelForClass } from "@typegoose/typegoose";
import mongoose from "mongoose";

export class User {
  @prop({ type: String, required: true, unique: true })
  public email!: string;

  @prop({ type: String })
  public username?: string;

  @prop({ type: Number })
  public type?: number;

  // password
  @prop({ type: String, required: true })
  public pass!: string;
}

export const UserModel = getModelForClass(User);

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
  console.log("connected to", DB);
});
