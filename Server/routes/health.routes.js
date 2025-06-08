import express from 'express';
import rateLimit from 'express-rate-limit';
import { checkCertificateStatus } from '../utils/certificate.util.js';
import { getDomainName } from '../utils/user.util.js';

const router = express.Router();

// Rate limiting configuration
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: process.env.NODE_ENV === 'production' ? 100 : 0, // 100 requests per windowMs in production, unlimited in dev
  message: 'Too many requests from this IP, please try again later',
  standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  legacyHeaders: false
});

router.get('/status', limiter, (req, res) => {
  const httpsEnabled = req.secure || req.headers['x-forwarded-proto'] === 'https';
  const status = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    https: httpsEnabled,
    secure: req.secure,
    environment: process.env.NODE_ENV || 'development'
  };

  if (process.env.NODE_ENV === 'production') {
    const certStatus = checkCertificateStatus(getDomainName());
    status.certificate = certStatus;
  }

  res.json(status);
});

export default router;