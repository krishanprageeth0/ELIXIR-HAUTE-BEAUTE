import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { prisma } from "./prisma";

const JWT_SECRET = process.env.JWT_SECRET || "elixir-haute-beaute-secret-luxury-key-2027";
const COOKIE_NAME = "elixir_session";

export interface SessionPayload {
  userId: string;
  email: string;
  role: "ADMIN" | "STAFF" | "CUSTOMER";
  name: string;
}

export function signToken(payload: SessionPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): SessionPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as SessionPayload;
  } catch {
    return null;
  }
}

export async function getCurrentUser(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function requireAdmin(): Promise<SessionPayload | null> {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return null;
  }
  return user;
}
