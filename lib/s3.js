import { S3Client, GetObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

// Add URL caching
const urlCache = new Map();

export async function getPresignedUrl(key) {
  // Sanitize the key
  const sanitizedKey = key.trim();
  
  // Check cache first
  const cacheKey = `url_${sanitizedKey}`;
  const cachedUrl = urlCache.get(cacheKey);
  if (cachedUrl) {
    return cachedUrl;
  }

  try {
    const command = new GetObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: sanitizedKey,
    });

    // Add some logging for debugging
    console.log('Getting presigned URL for key:', sanitizedKey);
    
    const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

    // Cache the URL
    urlCache.set(cacheKey, url);
    setTimeout(() => urlCache.delete(cacheKey), 3500 * 1000); // Clear cache before URL expires

    return url;
  } catch (error) {
    console.error('Error generating pre-signed URL:', error);
    throw error;
  }
}

export async function getPresignedUrls(prefix) {
  // Sanitize the prefix
  const sanitizedPrefix = prefix.trim();
  
  // Check cache first
  const cacheKey = `urls_${sanitizedPrefix}`;
  const cachedUrls = urlCache.get(cacheKey);
  if (cachedUrls) {
    return cachedUrls;
  }

  try {
    const command = new ListObjectsV2Command({
      Bucket: process.env.S3_BUCKET_NAME,
      Prefix: sanitizedPrefix
    });

    // Add some logging for debugging
    console.log('Listing objects with prefix:', sanitizedPrefix);
    
    const response = await s3Client.send(command);
    
    if (!response.Contents) {
      console.log('No objects found with prefix:', sanitizedPrefix);
      return {};
    }

    const urls = {};
    for (const object of response.Contents) {
      const urlCommand = new GetObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: object.Key,
      });
      urls[object.Key] = await getSignedUrl(s3Client, urlCommand, { expiresIn: 3600 });
    }

    // Cache the URLs
    urlCache.set(cacheKey, urls);
    setTimeout(() => urlCache.delete(cacheKey), 3500 * 1000);

    return urls;
  } catch (error) {
    console.error('Error getting presigned URLs:', error);
    throw error;
  }
}