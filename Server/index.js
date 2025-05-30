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
app.use(
  cors({
    origin: getClientUrl(),
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
const upload = multer();

app.use(upload.any());
app.use("/storage", express.static(path.join(__dirname, "storage")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/assets", assetsRoutes);
app.use("/campaigns", campaignRoutes);

// Basic route
app.get("/", (req, res) => {
  res.send("Server is running");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
