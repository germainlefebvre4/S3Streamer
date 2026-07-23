import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import videoRoutes from './routes/videoRoutes.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Define __dirname in ES module scope
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());

// Serve compiled production static files from frontend/dist
app.use(express.static(path.join(__dirname, '..', 'frontend', 'dist')));

// Routes
app.use('/api/videos', videoRoutes);

// Serve the frontend entry index.html for all non-API paths (SPA fallback)
app.get('/{*splat}', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'Not Found' });
  }
  res.sendFile(path.join(__dirname, '..', 'frontend', 'dist', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT} to access the application`);
});