import dotenv from "dotenv";
dotenv.config();

export const keyFilename = process.env.SERVICE_ACCOUNT_FILE || "";
