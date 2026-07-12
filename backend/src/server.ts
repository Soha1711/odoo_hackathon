import app from './app';
import { env } from './config/environment';

const server = app.listen(env.PORT, () => {
  console.log(`=========================================`);
  console.log(`☘️  EcoSphere ESG Management Platform Server`);
  console.log(`🚀 Running in ${env.NODE_ENV} mode on port ${env.PORT}`);
  console.log(`📡 URL: http://localhost:${env.PORT}/health`);
  console.log(`=========================================`);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});
