import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import pinoHttp from 'pino-http';
import swaggerUi from 'swagger-ui-express';

import { config } from './config';
import { logger } from './utils/logger';
import { swaggerSpec } from './docs/swagger';
import { errorHandler, notFound } from './middleware/errorHandler';
import { generalRateLimit } from './middleware/rateLimit';

// Import routes
import authRoutes from './modules/auth/auth.routes';
import userRoutes from './modules/users/user.routes';
import classRoutes from './modules/classes/class.routes';
import subjectRoutes from './modules/subjects/subject.routes';
import enrollmentRoutes from './modules/enrollments/enrollment.routes';
import attendanceRoutes from './modules/attendance/attendance.routes';
import examRoutes from './modules/exams/exams.routes';
import announcementRoutes from './modules/announcements/announcement.routes';

const app = express();

// Trust proxy (for Railway deployment)
app.set('trust proxy', 1);

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// CORS configuration
app.use(cors({
  origin: config.cors.origin,
  credentials: config.cors.credentials,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Logging middleware
app.use(pinoHttp({
  logger,
  customLogLevel: function (req, res, err) {
    if (res.statusCode >= 400 && res.statusCode < 500) {
      return 'warn';
    } else if (res.statusCode >= 500 || err) {
      return 'error';
    } else if (res.statusCode >= 300 && res.statusCode < 400) {
      return 'silent';
    }
    return 'info';
  },
}));

// Rate limiting
app.use(generalRateLimit);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API documentation
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'School Management System API',
}));

// API routes
app.use(`${config.apiPrefix}/auth`, authRoutes);
app.use(`${config.apiPrefix}/users`, userRoutes);
app.use(`${config.apiPrefix}/classes`, classRoutes);
app.use(`${config.apiPrefix}/subjects`, subjectRoutes);
app.use(`${config.apiPrefix}/enrollments`, enrollmentRoutes);
app.use(`${config.apiPrefix}/attendance`, attendanceRoutes);
app.use(`${config.apiPrefix}/exams`, examRoutes);
app.use(`${config.apiPrefix}/announcements`, announcementRoutes);

// 404 handler
app.use(notFound);

// Error handling middleware
app.use(errorHandler);

export default app;
