import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import dotenv from "dotenv";
dotenv.config();

const bucketName = process.env.AWS_BUCKET_NAME || "";
const region = process.env.AWS_BUCKET_REGION || "";
const accessKeyId = process.env.AWS_ACCESS_KEY_ID || "";
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY || "";

const s3Client = new S3Client({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

export const uploadImage = async (file, fileName, mimeType) => {
  const params = {
    Bucket: bucketName,
    Key: fileName,
    Body: file,
    ContentType: mimeType,
  };

  try {
    await s3Client.send(new PutObjectCommand(params));
    return `https://${bucketName}.s3.amazonaws.com/${fileName}`;
  } catch (err) {
    console.log("Error", err);
    throw new Error("Error uploading image ", err);
  }
};
