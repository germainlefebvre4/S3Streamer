import { S3Client, ListObjectsV2Command, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import dotenv from 'dotenv';

dotenv.config();

// Initialize S3 client with configuration options
const s3ClientOptions = {
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
};

// Add endpoint URL if provided in environment variables
if (process.env.AWS_S3_ENDPOINT_URL) {
  s3ClientOptions.endpoint = process.env.AWS_S3_ENDPOINT_URL;
  console.log(`Using custom S3 endpoint: ${process.env.AWS_S3_ENDPOINT_URL}`);
}

const s3Client = new S3Client(s3ClientOptions);

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;
const DEFAULT_PAGE_SIZE = 18;
const CACHE_TTL_MS = (parseInt(process.env.CACHE_TTL_SECONDS) || 300) * 1000;

let cachedContents = null;
let cacheExpiresAt = 0;

// List all videos in the bucket with pagination
export const listVideos = async (req, res) => {
  try {
    // Extract pagination and search parameters from query
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || DEFAULT_PAGE_SIZE;
    const search = (req.query.search || '').trim().toLowerCase();

    // Use cached S3 object list if still valid, otherwise fetch from S3
    let allContents;
    if (cachedContents && Date.now() < cacheExpiresAt) {
      allContents = cachedContents;
    } else {
      // Fetch all objects from S3, following continuation tokens for buckets > 1000 objects
      allContents = [];
      let continuationToken = undefined;
      let isTruncated = true;

      while (isTruncated) {
        const command = new ListObjectsV2Command({
          Bucket: BUCKET_NAME,
          Prefix: '',
          MaxKeys: 1000,
          ContinuationToken: continuationToken
        });

        const response = await s3Client.send(command);
        allContents.push(...(response.Contents ?? []));
        isTruncated = response.IsTruncated ?? false;
        continuationToken = response.NextContinuationToken;
      }

      cachedContents = allContents;
      cacheExpiresAt = Date.now() + CACHE_TTL_MS;
    }

    // Filter for video files using common video extensions
    const videoExtensions = ['.mp4', '.mov', '.avi', '.mkv', '.webm'];
    const videos = allContents.filter(item =>
      videoExtensions.some(ext => item.Key.toLowerCase().endsWith(ext))
    );

    // Apply search filter (case-insensitive substring match on S3 key)
    const filteredVideos = search
      ? videos.filter(item => item.Key.toLowerCase().includes(search))
      : videos;

    const totalVideos = filteredVideos.length;
    const shuffle = req.query.shuffle === 'true';

    let paginatedVideos;
    let pagination;

    if (shuffle) {
      const shuffled = [...filteredVideos];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      paginatedVideos = shuffled.slice(0, pageSize);
      pagination = { page: 1, pageSize, totalPages: 1, totalVideos, hasNextPage: false, hasPrevPage: false };
    } else {
      const totalPages = Math.ceil(totalVideos / pageSize);
      const startIndex = (page - 1) * pageSize;
      const endIndex = Math.min(startIndex + pageSize, totalVideos);
      paginatedVideos = filteredVideos.slice(startIndex, endIndex);
      pagination = { page, pageSize, totalPages, totalVideos, hasNextPage: page < totalPages, hasPrevPage: page > 1 };
    }

    const videosWithUrls = await Promise.all(paginatedVideos.map(async (video) => {
      const streamUrl = `/api/videos/stream/${encodeURIComponent(video.Key)}`;
      return { key: video.Key, size: video.Size, lastModified: video.LastModified, streamUrl };
    }));

    res.json({ videos: videosWithUrls, pagination });
  } catch (error) {
    console.error('Error listing videos:', error);
    res.status(500).json({ error: 'Failed to list videos' });
  }
};

const STOPWORDS = new Set([
  'a', 'an', 'the', 'in', 'on', 'at', 'de', 'du', 'le', 'la', 'les',
  'un', 'une', 'et', 'en', 'au', 'aux', 'par', 'and', 'or', 'of',
  'to', 'for', 'is', 'it', 'be', 'by', 'des', 'qui', 'que', 'avec',
  'nfo', 'from', 'torrent', 'sample', 'part', 'prt', 'x264', 'h264',
  'all', '720p', '1080p', '2160p', '4k', '8k', 'hdr', 'downloaded',
]);
const VIDEO_EXTENSIONS = new Set(['mp4', 'mov', 'avi', 'mkv', 'webm']);

const extractTags = (contents) => {
  const wordCounts = new Map();

  for (const item of contents) {
    const fileName = item.Key.split('/').pop();
    const tokens = fileName.toLowerCase().split(/[^a-z0-9]+/);
    const seen = new Set();
    for (const token of tokens) {
      if (token.length < 3) continue;
      if (/^\d+$/.test(token)) continue;
      if (STOPWORDS.has(token)) continue;
      if (VIDEO_EXTENSIONS.has(token)) continue;
      if (!seen.has(token)) {
        seen.add(token);
        wordCounts.set(token, (wordCounts.get(token) ?? 0) + 1);
      }
    }
  }

  return [...wordCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 100)
    .map(([word, count]) => ({ word, count }));
};

export const listTags = async (req, res) => {
  try {
    if (!cachedContents || Date.now() >= cacheExpiresAt) {
      cachedContents = [];
      let continuationToken = undefined;
      let isTruncated = true;
      while (isTruncated) {
        const command = new ListObjectsV2Command({
          Bucket: BUCKET_NAME,
          Prefix: '',
          MaxKeys: 1000,
          ContinuationToken: continuationToken
        });
        const response = await s3Client.send(command);
        cachedContents.push(...(response.Contents ?? []));
        isTruncated = response.IsTruncated ?? false;
        continuationToken = response.NextContinuationToken;
      }
      cacheExpiresAt = Date.now() + CACHE_TTL_MS;
    }
    res.json({ tags: extractTags(cachedContents) });
  } catch (error) {
    console.error('Error listing tags:', error);
    res.status(500).json({ error: 'Failed to list tags' });
  }
};

// Stream video using range requests for seeking support
export const streamVideo = async (req, res) => {
  const key = decodeURIComponent(req.params.key);

  try {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key
    });

    // Create a signed URL that's valid for a short period (3600 seconds = 1 hour)
    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

    // Redirect to the signed URL for streaming
    // This approach works well for most modern browsers and players
    res.redirect(signedUrl);

  } catch (error) {
    console.error('Error streaming video:', error);
    res.status(500).json({ error: 'Failed to stream video' });
  }
};

export const deleteVideo = async (req, res) => {
  const key = decodeURIComponent(req.params.key);

  try {
    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key
    });

    await s3Client.send(command);

    // Surgically remove the deleted entry from the in-memory cache
    if (cachedContents) {
      cachedContents = cachedContents.filter(item => item.Key !== key);
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting video:', error);
    res.status(500).json({ error: 'Failed to delete video' });
  }
};