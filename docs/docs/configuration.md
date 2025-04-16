---
sidebar_position: 10
---

# Configuration

S3 Streamer is designed to easily integrate with your existing S3-compatible storage solutions.
To get started, you need to configure the application with your AWS credentials and bucket information.
This guide will walk you through the configuration process.

## Configuration File

The configuration file is located in the root directory of the project and is named `.env`.
This file contains all the necessary environment variables required for the application to function correctly.
You can create this file by copying the example file provided:

```bash
cp .env.example .env
```

## Environment Variables

The following environment variables are required for the application to work:

| Variable Name           | Description                                                                   |
|-------------------------|-----------------------------------------------------------------------------  |
| `AWS_ACCESS_KEY_ID`     | Your AWS access key ID.                                                       |
| `AWS_SECRET_ACCESS_KEY` | Your AWS secret access key.                                                   |
| `AWS_REGION`            | The AWS region where your S3 bucket is located.                               |
| `AWS_S3_ENDPOINT_URL`       | The endpoint URL for your S3-compatible storage solution.                     |
| `AWS_S3_BUCKET_NAME`        | The name of your S3 bucket.                                                   |
| `PORT`                  | The port on which the server will run (default is 3000).                      |
| `NODE_ENV`              | The environment in which the application is running (development/production). |
