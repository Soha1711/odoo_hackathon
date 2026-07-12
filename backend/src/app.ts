import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import rootRouter from './routes';
import { errorMiddleware } from './middleware/error.middleware';
import { env } from './config/environment';

const app = express();

// Security headers
app.use(helmet());

// Rate limiting on auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: { message: 'Too many requests, please try again later.' } },
});

// General rate limiter
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: { message: 'Too many requests, please try again later.' } },
});

app.use(generalLimiter);

// CORS restricted to configured frontend origin
app.use(cors({
  origin: env.CORS_ORIGIN,
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));

// Base diagnostic endpoint
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Mount modular APIs with auth rate limiter on auth routes
app.use('/api/v1/auth', authLimiter);
app.use('/api/v1', rootRouter);

// Error Handling
app.use(errorMiddleware);

export default app;
