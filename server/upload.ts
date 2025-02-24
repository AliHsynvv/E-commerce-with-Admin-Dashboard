import { randomBytes } from "crypto";
import { join } from "path";
import { createWriteStream, mkdirSync, existsSync } from "fs";
import type { Request } from "express";

const UPLOAD_DIR = join(process.cwd(), "uploads");

// Ensure uploads directory exists
if (!existsSync(UPLOAD_DIR)) {
  mkdirSync(UPLOAD_DIR, { recursive: true });
}

export async function saveUploadedFile(file: Express.Multer.File): Promise<string> {
  const ext = file.originalname.split('.').pop();
  const fileName = `${randomBytes(16).toString('hex')}.${ext}`;
  const filePath = join(UPLOAD_DIR, fileName);
  
  await new Promise((resolve, reject) => {
    const writeStream = createWriteStream(filePath);
    writeStream.write(file.buffer);
    writeStream.end();
    writeStream.on('finish', resolve);
    writeStream.on('error', reject);
  });

  return `/uploads/${fileName}`;
}
