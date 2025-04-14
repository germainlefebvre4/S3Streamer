import express from 'express';
import { listVideos, streamVideo } from '../controllers/videoController.js';

const router = express.Router();

// Route to get list of all videos in the bucket
router.get('/', listVideos);

// Route to stream a specific video
router.get('/stream/:key', streamVideo);

export default router;