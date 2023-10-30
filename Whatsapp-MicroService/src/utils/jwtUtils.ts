import { Types } from "mongoose";
import { JWT_RANDOM_PASSWORD } from "../config/env";
import jwt from 'jsonwebtoken'

export type TokenSignature = { id?: Types.ObjectId, email: string, role?: string, name?: string, compañy?: string, phoneNumber?: string}

export const firmarToken = (payload:TokenSignature) => {
  return jwt.sign(payload, JWT_RANDOM_PASSWORD, { expiresIn: '6000h' });
};

export const decodeToken = (token:string) => {
    return jwt.verify(token, JWT_RANDOM_PASSWORD);
};


