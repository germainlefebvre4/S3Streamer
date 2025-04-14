import { S3Client, ListObjectsV2Command, GetObjectCommand } from '@aws-sdk/client-s3';
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

// List all videos in the bucket
export const listVideos = async (req, res) => {
  try {
    const command = new ListObjectsV2Command({
      Bucket: BUCKET_NAME,
      // Filter for common video extensions
      // You can customize this based on your file types
      Prefix: '',
    });

    const { Contents } = await s3Client.send(command);
    
    // Filter for video files using common video extensions
    const videoExtensions = ['.mp4', '.mov', '.avi', '.mkv', '.webm'];
    const videos = Contents?.filter(item => 
      videoExtensions.some(ext => item.Key.toLowerCase().endsWith(ext))
    ) || [];
    
    // Generate presigned URLs for each video (valid for 1 hour)
    const videosWithUrls = await Promise.all(videos.map(async (video) => {
      const streamUrl = `/api/videos/stream/${encodeURIComponent(video.Key)}`;
      
      return {
        key: video.Key,
        size: video.Size,
        lastModified: video.LastModified,
        streamUrl
      };
    }));

    res.json(videosWithUrls);
  } catch (error) {
    console.error('Error listing videos:', error);
    res.status(500).json({ error: 'Failed to list videos' });
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