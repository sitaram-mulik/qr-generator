import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs-extra";
import cookieParser from "cookie-parser";
import multer from "multer";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import https from 'https';
import { httpsRedirect } from './middleware/https.middleware.js';
//import healthRoutes from './routes/health.routes.js';

import connectDatabase from "./utils/database.util.js";
import authRoutes from "./routes/auth.routes.js";
import assetsRoutes from "./routes/assets.routes.js";
import campaignRoutes from "./routes/campaign.routes.js";
import { getClientUrl } from "./utils/config.util.js";


dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const STORAGE_DIR = path.join(__dirname, "storage", "codes");
fs.ensureDirSync(STORAGE_DIR);

let monitoringInterval;

async function startServer() {
  const app = express();
  const PORT = process.env.SERVER_PORT || 8001;

  // Connect to MongoDB
  await connectDatabase();

  // Always apply HTTPS redirect first in production
  if (process.env.NODE_ENV === 'production') {
    app.enable('trust proxy');
    app.use(httpsRedirect);
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(cors());
    app.use((req, res, next) => {
      res.set({
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
        'X-Frame-Options': 'DENY',
        'X-Content-Type-Options': 'nosniff'
      });
      next();
    });
  } else {
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

  // Health check routes should be available in all environments
  // app.use("/health", healthRoutes);

  // Routes
  app.use("/api/auth", authRoutes);
  app.use("/api/assets", assetsRoutes);
  app.use("/api/campaigns", campaignRoutes);

  // Add security headers in production
  if (process.env.NODE_ENV === 'production') {
    app.get('*', (req, res, next) => {
      if (!req.path.startsWith('/api')) {
        res.sendFile(path.join(__dirname, 'public', 'index.html'));
      } else {
        next();
      }
    });

    // Start HTTPS server with Let's Encrypt
    // await greenlock.init(greenlockConfig).serve(app);
    
    // Start certificate monitoring
    // monitoringInterval = startCertificateMonitoring(process.env.DOMAIN);

    https.createServer({
      key: fs.readFileSync('/etc/letsencrypt/live/yourdomain.com/privkey.pem'),
      cert: fs.readFileSync('/etc/letsencrypt/live/yourdomain.com/cert.pem'),
      ca: fs.readFileSync('/etc/letsencrypt/live/yourdomain.com/fullchain.pem'),
    }, app).listen(PORT, () => {
      console.log('HTTPS server running');
    });
    
    
    console.log(`Server is running with HTTPS on port ${PORT}`);
  } else {
    app.get("/", (req, res) => {
      res.send("Server is running");
    });

    // Start HTTP server in development
    app.listen(PORT, () => {
      console.log(`Development server is running on port ${PORT}`);
    });
  }

  // Graceful shutdown handler
  // const gracefulShutdown = () => {
  //   console.log('Received shutdown signal. Cleaning up...');
  //   if (monitoringInterval) {
  //     clearInterval(monitoringInterval);
  //   }
  //   process.exit(0);
  // };

  // // Handle various shutdown signals
  // process.on('SIGTERM', gracefulShutdown);
  // process.on('SIGINT', gracefulShutdown);
}

startServer().catch(console.error);
