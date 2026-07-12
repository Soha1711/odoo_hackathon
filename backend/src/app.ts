import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Base diagnostic endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// App starter listener
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`EcoSphere ESG Platform server running on port ${PORT}`);
  });
}

export default app;
