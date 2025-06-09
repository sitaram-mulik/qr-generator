import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs-extra";
import cookieParser from "cookie-parser";
import multer from "multer";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { httpsRedirect } from "./middleware/https.middleware.js";
import greenlock from "./greenlock.js";
import connectDatabase from "./utils/database.util.js";
import authRoutes from "./routes/auth.routes.js";
import assetsRoutes from "./routes/assets.routes.js";
import userRoutes from "./routes/user.routes.js";
import locationRoutes from "./routes/location.route.js";
import campaignRoutes from "./routes/campaign.routes.js";
import { getClientUrl } from "./utils/config.util.js";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const STORAGE_DIR = path.join(__dirname, "storage", "codes");
fs.ensureDirSync(STORAGE_DIR);

async function startServer() {
  const app = express();
  const PORT = process.env.SERVER_PORT || 8001;

  await connectDatabase();

  if (process.env.NODE_ENV === "production") {
    app.enable("trust proxy");
    app.use(httpsRedirect);
    app.use(express.static(path.join(__dirname, "public")));
    app.use(cors());

    app.use((req, res, next) => {
      res.set({
        "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
        "X-Frame-Options": "DENY",
        "X-Content-Type-Options": "nosniff",
      });
      next();
    });
  } else {
    app.use(
      cors({
        origin: getClientUrl(),
        credentials: true,
      })
    );
  }

  app.use(cookieParser());
  app.use(express.json());
  const upload = multer();
  app.use(upload.any());
  app.use("/storage", express.static(path.join(__dirname, "storage")));

  app.use("/api/auth", authRoutes);
  app.use("/api/assets", assetsRoutes);
  app.use("/api/campaigns", campaignRoutes);
  app.use("/api/user", userRoutes);
  app.use("/api/locations", locationRoutes);

  if (process.env.NODE_ENV === "production") {
    app.get("*", (req, res, next) => {
      if (!req.path.startsWith("/api")) {
        res.sendFile(path.join(__dirname, "public", "index.html"));
      } else {
        next();
      }
    });

    // Use Greenlock's HTTPS server (handles certs & renewal)
    greenlock.serve(app);
  } else {
    app.get("/", (req, res) => {
      res.send("Server is running");
    });

    app.listen(PORT, () => {
      console.log(`Development server running on port ${PORT}`);
    });
  }
}

startServer().catch(console.error);
