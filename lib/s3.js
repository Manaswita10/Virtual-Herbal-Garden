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

export async function getPresignedUrls(modelBasePath) {
  // Check cache first
  const cacheKey = `urls_${modelBasePath}`;
  const cachedUrls = urlCache.get(cacheKey);
  if (cachedUrls) {
    return cachedUrls;
  }

  try {
    const listCommand = new ListObjectsV2Command({
      Bucket: process.env.S3_BUCKET_NAME,
      Prefix: modelBasePath
    });
    const listedObjects = await s3Client.send(listCommand);

    if (!listedObjects.Contents || listedObjects.Contents.length === 0) {
      console.log(`No objects found for prefix: ${modelBasePath}`);
      return {};
    }

    const signedUrls = {};
    for (const object of listedObjects.Contents) {
      const command = new GetObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: object.Key,
      });
      const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
      signedUrls[object.Key] = signedUrl;
    }

    // Cache the URLs
    urlCache.set(cacheKey, signedUrls);
    setTimeout(() => urlCache.delete(cacheKey), 3500 * 1000); // Clear cache before URLs expire

    return signedUrls;
  } catch (error) {
    console.error('Error generating pre-signed URLs:', error);
    throw error;
  }
}

export async function getPresignedUrl(key) {
  // Check cache first
  const cacheKey = `url_${key}`;
  const cachedUrl = urlCache.get(cacheKey);
  if (cachedUrl) {
    return cachedUrl;
  }

  try {
    const command = new GetObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
    });
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