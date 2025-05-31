import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs-extra";
import cookieParser from "cookie-parser";
import multer from "multer";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

import connectDatabase from "./utils/database.util.js";
import authRoutes from "./routes/auth.routes.js";
import assetsRoutes from "./routes/assets.routes.js";
import campaignRoutes from "./routes/campaign.routes.js";
import { getClientUrl } from "./utils/config.util.js";


dotenv.config();

const app = express();
const PORT = process.env.SERVER_PORT || 8001;

// Get __dirname equivalent in ES modules
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Ensure storage directories exist
const STORAGE_DIR = path.join(__dirname, "storage", "codes");
fs.ensureDirSync(STORAGE_DIR);

// Connect to MongoDB
connectDatabase();

// Middleware
if (process.env.NODE_ENV === 'production') {
  // In production, serve static files and handle client routing
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(cors());
} else {
  // In development, use CORS with specific origin
  app.use(cors({
    origin: getClientUrl(),
    credentials: true,
  }));
}

app.use(cookieParser());
app.use(express.json());
const upload = multer();

app.use(upload.any());
app.use("/storage", express.static(path.join(__dirname, "storage")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/assets", assetsRoutes);
app.use("/campaigns", campaignRoutes);

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  // Handle client-side routing by serving index.html for all non-API routes
  app.get('*', (req, res, next) => {
    if (!req.path.startsWith('/api') && !req.path.startsWith('/assets') && !req.path.startsWith('/campaigns')) {
      res.sendFile(path.join(__dirname, 'public', 'index.html'));
    } else {
      next();
    }
  });
} else {
  // Basic route for development
  app.get("/", (req, res) => {
    res.send("Server is running");
  });
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
