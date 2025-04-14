# S3 Video Streaming Application

A Node.js application for streaming video files hosted on AWS S3 directly in a web browser.

## Features

- Lists video files from a specified S3 bucket
- Streams videos efficiently using pre-signed URLs
- User-friendly web interface with video playback functionality
- Responsive design that works on desktop and mobile devices

## Prerequisites

- Node.js v22+ (using nvs)
- AWS account with S3 bucket containing video files
- AWS access key ID and secret access key with permissions to list and read objects from the S3 bucket

## Setup

1. Clone this repository
2. Configure your environment variables:

```bash
cp .env.example .env
```

Then edit the `.env` file with your AWS credentials and bucket information:

```
AWS_ACCESS_KEY_ID=your_access_key_id
AWS_SECRET_ACCESS_KEY=your_secret_access_key
AWS_REGION=your_aws_region
AWS_S3_ENDPOINT_URL=https://s3.your_aws_region.amazonaws.com
AWS_S3_BUCKET_NAME=your_bucket_name
PORT=3000
NODE_ENV=development
```

3. Install dependencies:

```bash
pnpm install
```

## Running the Application

### Development Mode

```bash
pnpm run dev
```

This will start the server with nodemon, which will automatically restart on file changes.

### Production Mode

```bash
pnpm start
```

## Usage

1. Open your browser and navigate to `http://localhost:3000` (or the port you specified in the .env file)
2. You'll see a list of video files from your S3 bucket
3. Click on any video to start streaming it in the browser
4. Use the back button to return to the video list

## How It Works

1. The server retrieves a list of video files from the specified S3 bucket
2. When a user selects a video, the server generates a pre-signed URL for that specific file
3. The browser is redirected to the pre-signed URL, allowing direct streaming from S3
4. The pre-signed URL has a limited validity period for security (default: 1 hour)

## Security Considerations

- This application uses pre-signed URLs with a short expiration time
- AWS credentials are stored in the .env file, which should never be committed to version control
- CORS is enabled to allow streaming from S3 to your application

## License

ISC
