import { PutObjectCommand } from "@aws-sdk/client-s3";
import { r2Client, BUCKET_NAME_PUBLIC } from "./awsConfig";
import RNFS from "react-native-fs";
import { Buffer } from "buffer";
import { R2_PUBLIC_URL } from "./constants";

export const generateRandomID = () => {
  const characters = "0123456789";
  return Array.from(
    { length: 16 },
    () => characters[Math.floor(Math.random() * characters.length)]
  ).join("");
};

export async function uploadToR2(
  file: {
    uri: string;
    name: string;
    type: string;
  },
  type: string,
  path: string = ""
) {
  // Remove the 'file://' prefix if it exists
  const fileUri = file.uri.replace(/^file:\/\//, "");

  try {
    const fileContent = await RNFS.readFile(fileUri, "base64");
    const buffer = Buffer.from(fileContent, "base64");
    const randomString = generateRandomID();
    const baseFilename = `${type}_${randomString}_${Date.now()}.${file.type
      .split("/")
      .pop()}`;
    const key = `uploads/${path}${baseFilename}`;
    const params = {
      Bucket: BUCKET_NAME_PUBLIC,
      Key: key,
      Body: buffer,
      ContentType: file.type,
    };

    const putCommand = new PutObjectCommand(params);
    await r2Client.send(putCommand);

    const publicUrl = `${R2_PUBLIC_URL}${key}`;
    return {
      key,
      url: publicUrl,
    };
  } catch (error) {
    console.log("Error uploading to R2:", error);
    return error;
  }
}

export async function uploadToR2WithCompression(
  file: string,
  fileType: string = "image/jpeg",
  type: string,
) {

  try {
    const fileContent = await RNFS.readFile(file, "base64");
    const buffer = Buffer.from(fileContent, "base64");
    const randomString = generateRandomID();
    const baseFilename = `post_${randomString}_${Date.now()}.${fileType
      .split("/")
      .pop()}`;
    const key = `uploads/${baseFilename}`;
    const params = {
      Bucket: BUCKET_NAME_PUBLIC,
      Key: key,
      Body: buffer,
      ContentType: fileType,
    };

    const putCommand = new PutObjectCommand(params);
    await r2Client.send(putCommand);

    const publicUrl = `${R2_PUBLIC_URL}${key}`;
    return {
      key,
      url: publicUrl,
    };
  } catch (error) {
    console.log("Error uploading to R2:", error);
    return error;
  }
}

export const determineAttachmentType = (name: string) => {
  const imageExtensions = ["jpg", "jpeg", "png", "gif"];
  const audioExtensions = ["mp3", "wav", "ogg"];
  const videoExtensions = ["mp4", "avi", "mov"];

  const extension = name ?  name.split(".").pop().toLowerCase() : 'jpg';

  if (imageExtensions.includes(extension)) return "image";
  if (audioExtensions.includes(extension)) return "audio";
  if (videoExtensions.includes(extension)) return "video";
  if (
    !imageExtensions.includes(extension) &&
    !audioExtensions.includes(extension) &&
    !videoExtensions.includes(extension)
  ) {
    return "null";
  }
};
