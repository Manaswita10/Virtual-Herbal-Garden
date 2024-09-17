import { S3Client, GetObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

export async function getPresignedUrls(modelBasePath) {
  try {
    const listCommand = new ListObjectsV2Command({
      Bucket: process.env.S3_BUCKET_NAME,
      Prefix: modelBasePath
    });
    const listedObjects = await s3Client.send(listCommand);

    const signedUrls = {};
    for (const object of listedObjects.Contents) {
      const command = new GetObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: object.Key,
      });
      const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
      signedUrls[object.Key] = signedUrl;
    }

    console.log('Generated pre-signed URLs:', signedUrls);
    return signedUrls;
  } catch (error) {
    console.error('Error generating pre-signed URLs:', error);
    throw error;
  }
}