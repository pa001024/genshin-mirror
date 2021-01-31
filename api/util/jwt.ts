import jwt from "jsonwebtoken";
import ejwt from "express-jwt";
import { DocumentType } from "@typegoose/typegoose";
import { User } from "../db";

const SECRET = process.env.JWT_SECRET!;

export const PROTECTED = ejwt({ secret: SECRET, algorithms: ["HS256"] });

export interface JWTPayload {
  uid: string;
  user: string;
  type: number;
  ver: number;
}

export const JWT_VERSION = 1;

export function signUser(user: DocumentType<User>) {
  const payload: JWTPayload = { uid: user.id, user: user.username!, type: user.type!, ver: JWT_VERSION };
  console.log("signUser", user.id);
  const sign = jwt.sign(payload, SECRET, { expiresIn: "30d" });
  return sign;
}

declare global {
  namespace Express {
    // These open interfaces may be extended in an application-specific manner via declaration merging.
    // See for example method-override.d.ts (https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/method-override/index.d.ts)
    interface Request {
      user: JWTPayload;
    }
    interface Response {}
    interface Application {}
  }
}
