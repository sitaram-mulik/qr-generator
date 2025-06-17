import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs-extra';
import cookieParser from 'cookie-parser';
import multer from 'multer';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { httpsRedirect } from './middleware/https.middleware.js';
import greenlock from './greenlock.js';
import connectDatabase from './utils/database.util.js';
import authRoutes from './routes/auth.routes.js';
import assetsRoutes from './routes/assets.routes.js';
import userRoutes from './routes/user.routes.js';
import locationRoutes from './routes/location.route.js';
import campaignRoutes from './routes/campaign.routes.js';
import ApiError from './utils/ApiError.js';
import { getClientUrl } from './utils/config.util.js';
import { backupCronjob } from './configs/db_backup.js';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const STORAGE_DIR = path.join(__dirname, 'storage', 'codes');
fs.ensureDirSync(STORAGE_DIR);

async function startServer() {
  const app = express();
  const PORT = process.env.SERVER_PORT || 8001;

  await connectDatabase();

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
    app.use(
      cors({
        origin: getClientUrl(),
        credentials: true
      })
    );
  }

  app.use(cookieParser());
  app.use(express.json());
  const upload = multer();
  app.use(upload.any());
  app.use('/storage', express.static(path.join(__dirname, 'storage')));

  app.use('/api/auth', authRoutes);
  app.use('/api/assets', assetsRoutes);
  app.use('/api/campaigns', campaignRoutes);
  app.use('/api/user', userRoutes);
  app.use('/api/locations', locationRoutes);

  // Global error handler middleware
  app.use((err, req, res, next) => {
    console.log(err.stack);
    if (err instanceof ApiError || err.statusCode) {
      const statusCode = err.statusCode || 500;
      const message = err.message || 'An unexpected error occurred';
      // Remove file and line numbers from stack trace for details
      const details = err.stack ? err.stack.split('\n').slice(0, 1).join('') : '';
      res.status(statusCode).json({
        message,
        details
      });
    } else {
      const details = err.stack ? err.stack.split('\n').slice(0, 1).join('') : '';
      res.status(500).json({
        message: 'An unexpected error occurred',
        details
      });
    }
  });

  if (process.env.NODE_ENV === 'production') {
    app.get('*', (req, res, next) => {
      if (!req.path.startsWith('/api')) {
        res.sendFile(path.join(__dirname, 'public', 'index.html'));
      } else {
        next();
      }
    });

    // Use Greenlock's HTTPS server (handles certs & renewal)
    greenlock.serve(app);
  } else {
    app.get('/', (req, res) => {
      res.send('Server is running');
    });

    app.listen(PORT, () => {
      console.log(`Development server running on port ${PORT}`);
    });
  }
}

// Add process-level error handlers to prevent server crash
process.on('uncaughtException', err => {
  console.log('Uncaught Exception:', err.stack || err);
  // Optionally perform cleanup or restart here
});

process.on('unhandledRejection', (reason, promise) => {
  console.log('Unhandled Rejection at:', promise, 'reason:', reason.stack || reason);
  // Optionally perform cleanup or restart here
});

startServer().catch(console.log);
backupCronjob();
