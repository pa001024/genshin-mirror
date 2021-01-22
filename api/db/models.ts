import { prop, getModelForClass } from "@typegoose/typegoose";
import mongoose from "mongoose";

class UserModel {
  @prop({ required: true, unique: true }) email!: string;
  @prop({ required: true }) hash!: string;
  @prop() name?: string;
  @prop() type?: number;
}

export const User = getModelForClass(UserModel);

mongoose.connect("mongodb://localhost/genshin-im", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("mongodb connected");
});
