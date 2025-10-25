import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import { config } from './utils/config';
import { logger } from './utils/logger';
import { errorHandler } from './middleware/errorHandler';
import { disconnectPrisma } from './utils/prisma';

// Import routes
import authRoutes from './routes/authRoutes';
import intakeRoutes from './routes/intakeRoutes';
import planRoutes from './routes/planRoutes';
import agentRoutes from './routes/agentRoutes';
import progressRoutes from './routes/progressRoutes';

const app: Application = express();

// Middleware
app.use(cors({
  origin: config.frontendUrl || '*',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from Next.js export in production
if (config.nodeEnv === 'production') {
  const frontendPath = path.join(__dirname, '../frontend');
  app.use(express.static(frontendPath));
}

// Request logging middleware
app.use((req: Request, _res: Response, next) => {
  logger.info('Incoming request', {
    method: req.method,
    path: req.path,
    ip: req.ip,
  });
  next();
});

// Health check endpoint
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv,
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/intake', intakeRoutes);
app.use('/api/plans', planRoutes);
app.use('/api/agents', agentRoutes);
app.use('/api/progress', progressRoutes);

// Serve Next.js pages in production (catch-all route for SPA)
if (config.nodeEnv === 'production') {
  app.get('*', (req: Request, res: Response) => {
    // Serve the appropriate HTML file based on the route
    const frontendPath = path.join(__dirname, '../frontend');
    const requestedPath = req.path === '/' ? '/index.html' : req.path + '.html';
    const filePath = path.join(frontendPath, requestedPath);

    // Check if the HTML file exists, otherwise serve index.html
    res.sendFile(filePath, (err) => {
      if (err) {
        res.sendFile(path.join(frontendPath, 'index.html'));
      }
    });
  });
} else {
  // 404 handler for development
  app.use((_req: Request, res: Response) => {
    res.status(404).json({
      error: {
        message: 'Route not found',
        statusCode: 404,
      },
    });
  });
}

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server
const server = app.listen(config.port, () => {
  logger.info('Server started', {
    port: config.port,
    environment: config.nodeEnv,
  });
  console.log(`
╔════════════════════════════════════════════════════════╗
║                                                        ║
║   Career Transition AI Platform - Backend API         ║
║                                                        ║
║   Server running on: http://localhost:${config.port}            ║
║   Environment: ${config.nodeEnv}                            ║
║                                                        ║
║   Health check: http://localhost:${config.port}/health      ║
║                                                        ║
╚════════════════════════════════════════════════════════╝
  `);
});

// Graceful shutdown
const gracefulShutdown = async (): Promise<void> => {
  logger.info('Shutting down gracefully...');

  server.close(async () => {
    logger.info('HTTP server closed');

    try {
      await disconnectPrisma();
      logger.info('Database connection closed');
      process.exit(0);
    } catch (error) {
      logger.error('Error during shutdown', { error });
      process.exit(1);
    }
  });

  // Force shutdown after 10 seconds
  setTimeout(() => {
    logger.error('Forced shutdown due to timeout');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason: unknown) => {
  logger.error('Unhandled Promise Rejection', { reason });
  gracefulShutdown();
});

export default app;
