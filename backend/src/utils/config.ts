import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

interface Config {
  port: number;
  nodeEnv: string;
  frontendUrl: string;
  jwtSecret: string;
  databaseUrl: string;
  anthropicApiKey: string;
}

// Validate required environment variables
const requiredEnvVars = [
  'DATABASE_URL',
  'ANTHROPIC_API_KEY',
  'JWT_SECRET',
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

export const config: Config = {
  port: parseInt(process.env.PORT || '3001', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  jwtSecret: process.env.JWT_SECRET as string,
  databaseUrl: process.env.DATABASE_URL as string,
  anthropicApiKey: process.env.ANTHROPIC_API_KEY as string,
};
