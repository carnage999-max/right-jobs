import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "placeholder",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "placeholder",
  },
});

export async function getPresignedPostUrl(key: string, contentType: string) {
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET || "placeholder-bucket",
    Key: key,
    ContentType: contentType,
  });

  return await getSignedUrl(s3, command, { expiresIn: 3600 });
}
