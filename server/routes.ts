import express, { type Express } from "express";
import { createServer } from "http";
import multer from "multer";
import { join } from "path";
import { storage } from "./storage";
import { insertContactSchema, insertProductSchema, insertCategorySchema } from "@shared/schema";

import { authenticateAdmin, comparePassword } from "./auth";
import { saveUploadedFile } from "./upload";

const upload = multer({ storage: multer.memoryStorage() });

export async function registerRoutes(app: Express) {
  // Serve uploaded files
  app.use('/uploads', express.static(join(process.cwd(), 'uploads')));

  // Product routes
  app.get("/api/products", async (_req, res) => {
    const products = await storage.getProducts();
    res.json(products);
  });

  app.get("/api/products/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Yanlış məhsul ID" });
    }
    const product = await storage.getProduct(id);
    if (!product) {
      return res.status(404).json({ message: "Məhsul tapılmadı" });
    }
    res.json(product);
  });

  // File upload endpoint
  app.post("/api/upload", authenticateAdmin, upload.single('image'), async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: "Şəkil yüklənmədi" });
    }

    try {
      const imageUrl = await saveUploadedFile(req.file);
      res.json({ imageUrl });
    } catch (error) {
      console.error('File upload error:', error);
      res.status(500).json({ message: "Şəkil yükləmə xətası" });
    }
  });

  app.get("/api/products/category/:category", async (req, res) => {
    const products = await storage.getProductsByCategory(req.params.category);
    res.json(products);
  });

  // Category routes
  app.get("/api/categories", async (_req, res) => {
    const categories = await storage.getCategories();
    res.json(categories);
  });

  app.post("/api/categories", authenticateAdmin, async (req, res) => {
    const result = insertCategorySchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }
    const category = await storage.createCategory(result.data);
    res.status(201).json(category);
  });

  app.put("/api/categories/:id", authenticateAdmin, async (req, res) => {
    const result = insertCategorySchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }
    const category = await storage.updateCategory(Number(req.params.id), result.data);
    if (!category) {
      return res.status(404).json({ message: "Kateqoriya tapılmadı" });
    }
    res.json(category);
  });

  app.delete("/api/categories/:id", authenticateAdmin, async (req, res) => {
    const hasProducts = await storage.getProductsByCategory(req.params.id);
    if (hasProducts.length > 0) {
      return res.status(400).json({ message: "Bu kateqoriyada məhsullar var" });
    }

    const success = await storage.deleteCategory(Number(req.params.id));
    if (!success) {
      return res.status(404).json({ message: "Kateqoriya tapılmadı" });
    }
    res.sendStatus(204);
  });

  // Admin authentication
  app.get("/api/admin/check-auth", async (req, res) => {
    const adminToken = req.cookies.adminToken;
    if (!adminToken) {
      return res.json(false);
    }

    const admin = await storage.getAdminByEmail(adminToken);
    res.json(!!admin);
  });

  app.post("/api/admin/login", async (req, res) => {
    const { email, password } = req.body;
    const admin = await storage.getAdminByEmail(email);

    if (!admin) {
      return res.status(401).json({ message: "Email və ya şifrə yanlışdır" });
    }

    const isValid = await comparePassword(password, admin.password);
    if (!isValid) {
      return res.status(401).json({ message: "Email və ya şifrə yanlışdır" });
    }

    res.cookie("adminToken", admin.email, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });

    res.json({ message: "Uğurla giriş edildi" });
  });

  app.post("/api/admin/logout", (req, res) => {
    res.clearCookie("adminToken");
    res.json({ message: "Çıxış edildi" });
  });

  // Protected admin routes
  app.post("/api/products", authenticateAdmin, async (req, res) => {
    const result = insertProductSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }
    const product = await storage.createProduct(result.data);
    res.status(201).json(product);
  });

  app.put("/api/products/:id", authenticateAdmin, async (req, res) => {
    const result = insertProductSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }
    const product = await storage.updateProduct(Number(req.params.id), result.data);
    if (!product) {
      return res.status(404).json({ message: "Məhsul tapılmadı" });
    }
    res.json(product);
  });

  app.delete("/api/products/:id", authenticateAdmin, async (req, res) => {
    const success = await storage.deleteProduct(Number(req.params.id));
    if (!success) {
      return res.status(404).json({ message: "Məhsul tapılmadı" });
    }
    res.sendStatus(204);
  });

  // Contact form with email notification
  app.get("/api/contacts", authenticateAdmin, async (_req, res) => {
    const contacts = await storage.getContacts();
    res.json(contacts);
  });

  app.post("/api/contact", async (req, res) => {
    const result = insertContactSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }

    const contact = await storage.createContact(result.data);
    res.json(contact);
  });

  const httpServer = createServer(app);
  return httpServer;
}