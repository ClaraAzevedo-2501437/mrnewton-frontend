import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { activityRoutes } from './routes/activityRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const ACTIVITY_BACKEND_URL = process.env.ACTIVITY_BACKEND_URL || 'http://localhost:5000';

// Middleware
app.use(cors());
app.use(express.json());

// Log all incoming requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/activity', activityRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'mrnewton-frontend-bff' });
});

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error'
  });
});

app.listen(PORT, () => {
  console.log(`Frontend BFF server running on http://localhost:${PORT}`);
  console.log(`Proxying to Activity Backend: ${ACTIVITY_BACKEND_URL}`);
});

export { ACTIVITY_BACKEND_URL };
