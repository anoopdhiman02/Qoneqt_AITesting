import { S3Client } from "@aws-sdk/client-s3";
import { R2_ACCESS_KEY, R2_SECRET_KEY, R2_BUCKET } from "./constants";

const ACCOUNT_ID = "ca5014936df81743ed3cbafd370d6b79";
const ACCESS_KEY = R2_ACCESS_KEY;
const SECRET_KEY = R2_SECRET_KEY;

export const r2Client = new S3Client({
  region: "auto",
  endpoint: `https://${ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: ACCESS_KEY,
    secretAccessKey: SECRET_KEY,
  },
});

export const BUCKET_NAME_PUBLIC = R2_BUCKET;
export const BUCKET_NAME_PRIVATE = "qoneqtprivate";
