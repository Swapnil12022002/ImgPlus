import dotenv from "dotenv";
import { Storage } from "@google-cloud/storage";
import { keyFilename } from "../common/keyFileName.js";

dotenv.config();

const storage = new Storage({
  keyFilename,
});

const bucketName = process.env.GCP_BUCKET_NAME || "";
const bucket = storage.bucket(bucketName);

export const uploadImage = async (file, fileName, mimeType) => {
  const fileUpload = bucket.file(fileName);
  const stream = fileUpload.createWriteStream({
    metadata: {
      contentType: mimeType,
    },
  });

  return new Promise((resolve, reject) => {
    stream.on("error", (error) => {
      reject(error);
    });

    stream.on("finish", () => {
      resolve(`gs://${bucketName}/${fileUpload.name}`);
    });

    stream.end(file);
  });
};

export const generateSignedUrl = async (gcsUri) => {
  try {
    const [bucketName, objectName] = gcsUri
      .match(/gs:\/\/([^/]+)\/(.+)/)
      .slice(1);

    const options = {
      version: "v4",
      action: "read",
      expires: Date.now() + 5 * 24 * 60 * 60 * 1000,
    };

    const [signedUrl] = await storage
      .bucket(bucketName)
      .file(objectName)
      .getSignedUrl(options);

    console.log(`Authenticated URL for ${gcsUri}:`);
    console.log(signedUrl);

    return signedUrl;
  } catch (error) {
    console.error("Error generating signed URL:", error);
    return null;
  }
};
