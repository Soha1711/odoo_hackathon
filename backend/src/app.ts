import express, { Request, Response } from 'express';
import cors from 'cors';
import rootRouter from './routes';
import { errorMiddleware } from './middleware/error.middleware';

const app = express();

app.use(cors({
  origin: '*', // For hackathon/development environment simplicity
}));
app.use(express.json());

// Base diagnostic endpoint
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Mount modular APIs
app.use('/api/v1', rootRouter);

// Error Handling
app.use(errorMiddleware);

export default app;
