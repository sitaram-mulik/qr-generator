import dotenv from 'dotenv';
dotenv.config();

export const greenlockConfig = {
  packageRoot: process.cwd(),
  configDir: './greenlock.d',
  cluster: false,
  staging: process.env.NODE_ENV !== 'production',
  sites: [
    {
      subject: process.env.DOMAIN,
      altnames: [process.env.DOMAIN]
    }
  ]
};