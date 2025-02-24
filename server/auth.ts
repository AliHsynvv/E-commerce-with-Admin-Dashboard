import { Request, Response, NextFunction } from "express";
import { storage } from "./storage";
import bcrypt from "bcryptjs";

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function initializeAdmin() {
  const admin = await storage.getAdminByEmail("gsynvali@gmail.com");
  if (!admin) {
    const hashedPassword = await hashPassword("123321");
    await storage.createAdmin({
      email: "gsynvali@gmail.com",
      password: hashedPassword,
    });
  }
}

export async function authenticateAdmin(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies.adminToken;
  if (!token) {
    return res.status(401).json({ message: "Giriş etməlisiniz" });
  }
  try {
    const admin = await storage.getAdminByEmail(token);
    if (!admin) {
      return res.status(401).json({ message: "Giriş etməlisiniz" });
    }
    next();
  } catch (error) {
    res.status(401).json({ message: "Giriş etməlisiniz" });
  }
}
