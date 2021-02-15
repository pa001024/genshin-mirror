import jwt from "jsonwebtoken";
import { DocumentType } from "@typegoose/typegoose";
import type { FastifyRequest, FastifyReply } from "fastify";
import type { User } from "../../db";

const SECRET = process.env.JWT_SECRET!;

export interface JWTPayload {
  uid: string;
  user: string;
  type: number;
  ver: number;
}

export interface JWTContext {
  user: JWTPayload;
  req: FastifyRequest;
  res: FastifyReply;
}

export const JWT_VERSION = 1;

export function signUser(user: DocumentType<User>) {
  const payload: JWTPayload = { uid: user.id, user: user.username!, type: user.type!, ver: JWT_VERSION };
  const sign = jwt.sign(payload, SECRET, { expiresIn: "30d" });
  return sign;
}

declare module "fastify-jwt" {
  interface FastifyJWT {
    payload: JWTPayload;
  }
}
