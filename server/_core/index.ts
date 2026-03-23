import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";
import { generateCVHtml } from "../cvGenerator";
import { getSeafarerByUserId, getSeafarerDocuments, getSeafarerShipTypes, getAllShipTypes, getAllRanks, getAllEducationLevels, getUserById } from "../db";
import { sdk } from "./sdk";
import { generalLimiter, cvLimiter, securityHeaders } from "../rateLimit";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  const app = express();
  const server = createServer(app);
  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  // Security headers
  app.use(securityHeaders);
  // General rate limiting for all API routes
  app.use("/api", generalLimiter);
  // OAuth callback under /api/oauth/callback
  registerOAuthRoutes(app);

  // CV PDF Generator endpoint (with rate limiting)
  app.get("/api/cv/generate", cvLimiter, async (req, res) => {
    try {
      const authUser = await sdk.authenticateRequest(req).catch(() => null);
      if (!authUser) return res.status(401).json({ error: "Unauthorized" });
      const user = await getUserById(authUser.id);
      if (!user) return res.status(404).json({ error: "User not found" });
      const seafarer = await getSeafarerByUserId(authUser.id);
      if (!seafarer) return res.status(404).json({ error: "Seafarer profile not found" });
      const [docs, shipTypeLinks, allShipTypes, allRanks, allEducation] = await Promise.all([
        getSeafarerDocuments(seafarer.id),
        getSeafarerShipTypes(seafarer.id),
        getAllShipTypes(),
        getAllRanks(),
        getAllEducationLevels(),
      ]);
      const lang = (req.query.lang as string) === "en" ? "en" : "ar";
      const rank = allRanks.find(r => r.id === seafarer.rankId);
      const education = allEducation.find(e => e.id === seafarer.educationLevelId);
      const shipTypeNames = shipTypeLinks.map(st => {
        const found = allShipTypes.find(s => s.id === st.shipTypeId);
        return found ? (lang === "ar" && found.nameAr ? found.nameAr : found.nameEn) : "";
      }).filter(Boolean);
      const cvData = {
        name: user.name || `${seafarer.firstNameEn || ""} ${seafarer.lastNameEn || ""}`.trim() || "Seafarer",
        email: seafarer.email || user.email,
        phone: seafarer.phone || user.phone,
        nationality: undefined,
        birthDate: seafarer.birthDate,
        rank: rank ? (lang === "ar" && rank.nameAr ? rank.nameAr : rank.nameEn) : null,
        experience: seafarer.experienceMonths,
        availability: seafarer.availabilityStatus,
        bio: seafarer.bio,
        education: education ? (lang === "ar" && education.nameAr ? education.nameAr : education.nameEn) : null,
        profileImageUrl: seafarer.profileImageUrl,
        documents: docs.map(d => ({ docType: d.docType, expiryDate: d.expiryDate })),
        shipTypes: shipTypeNames,
      };
      const html = generateCVHtml(cvData, lang);
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.setHeader("Content-Disposition", `inline; filename="cv-${seafarer.id}.html"`);
      res.send(html);
    } catch (err) {
      console.error("[CV Generator]", err);
      res.status(500).json({ error: "Failed to generate CV" });
    }
  });

  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
