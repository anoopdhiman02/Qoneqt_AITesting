import * as ImagePicker from "expo-image-picker";
import { Camera } from "react-native-vision-camera";
import { Dimensions, Image } from "react-native";
import { showToast } from "@/components/atom/ToastMessageComponent";
import * as ImageManipulator from "expo-image-manipulator";
import * as FileSystem from "expo-file-system";
import { uploadToR2WithCompression } from "./r2Uploads";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

/* =========================
   Enhanced cache with expiration
   ========================= */
class ImageDimensionsCache {
  cache: Map<string, { value: { width: number; height: number }; timestamp: number }>;
  maxSize: number;
  ttl: number;

  constructor(maxSize = 200, ttl = 15 * 60 * 1000) { // bigger cache, longer TTL
    this.cache = new Map();
    this.maxSize = maxSize;
    this.ttl = ttl;
  }

  set(key: string, value: { width: number; height: number }) {
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    this.cache.set(key, { value, timestamp: Date.now() });
  }

  get(key: string) {
    const entry = this.cache.get(key);
    if (!entry) return null;
    if (Date.now() - entry.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }
    return entry.value;
  }

  has(key: string) {
    return this.get(key) !== null;
  }

  clear() {
    this.cache.clear();
  }

  size() {
    return this.cache.size;
  }
}

const dimensionsCache = new ImageDimensionsCache();

/* =========================
   Constants
   ========================= */
const MAX_IMAGE_HEIGHT = screenHeight * 0.75;
const MIN_IMAGE_HEIGHT = screenWidth * 0.6;
const INSTAGRAM_MAX_ASPECT_RATIO = 1.91;
const INSTAGRAM_MIN_ASPECT_RATIO = 0.8;
const DEFAULT_TIMEOUT = 5000; // slightly higher; avoids false timeouts on cold cache
const DEFAULT_DIMENSIONS = { width: screenWidth, height: 400 };

/* =========================
   Permissions / Camera helpers
   ========================= */
export const requestCameraPermission = async () => {
  try {
    const cameraPermission = await Camera.requestCameraPermission();
    return cameraPermission === "granted";
  } catch (error) {
    console.warn("Error requesting camera permission:", error);
    return false;
  }
};

export const checkCameraPermission = async () => {
  try {
    const cameraPermission = await Camera.getCameraPermissionStatus();
    if (cameraPermission === "granted") return true;
    if (cameraPermission === "not-determined") return await requestCameraPermission();
    return false;
  } catch (error) {
    console.warn("Error checking camera permission:", error);
    return false;
  }
};

export const getCameraDevice = async (facing: "back" | "front" = "back") => {
  const devices = await Camera.getAvailableCameraDevices();
  return devices.find((device) => device.position === facing) || null;
};

export const takeImageFromCamera = async (cameraRef: any) => {
  if (!cameraRef.current) {
    console.warn("Camera reference not found");
    return null;
  }

  try {
    const photo = await cameraRef.current.takePhoto();
    const imageInfo = await compressImageSize({ uri: photo?.path });
    return imageInfo.uri;
  } catch (error) {
    console.error("Error taking photo:", error);
    return null;
  }
};

export const pickImageFromGallery = async () => {
  try {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const imageInfo = await compressImageSize(result.assets[0]);
      return imageInfo?.uri;
    } else {
      showToast({ type: "error", text1: "You did not select any image." });
      return null;
    }
  } catch (error) {
    console.error("Error picking image:", error);
    return null;
  }
};

export const getCameraFormat = (device: any, width = 1280, height = 720) => {
  if (!device) return null;
  const formats = device.formats;
  return formats.find(
    (format: any) =>
      format.photoResolution.width === width &&
      format.photoResolution.height === height
  );
};

export const compressImageSize = async (asset: { uri: string }) => {
  const compressedImage = await ImageManipulator.manipulateAsync(
    asset.uri,
    [],
    { compress: 0.5, format: ImageManipulator.SaveFormat.JPEG }
  );
  return compressedImage;
};

export const compressedImage = async (imageUri: string, width: number) => {
  try {
    const originalInfos: any = await FileSystem.getInfoAsync(imageUri);
    const newSize = (originalInfos?.size ?? 0) / (1024 * 1024);
    const stage1 = await ImageManipulator.manipulateAsync(
      imageUri,
      width > 1400 ? [{ resize: { width: 1400 } }] : [],
      { compress: newSize > 10 ? 0.7 : 1.0, format: ImageManipulator.SaveFormat.JPEG }
    );
    const uploadResult = await uploadToR2WithCompression(stage1.uri, "image/jpeg", "image");
    return { result: uploadResult };
  } catch (error) {
    console.error("Error compressing image:", error);
    return null;
  }
};

/* =========================
   Member count formatting
   ========================= */
export const formatMemberCount = (count: number) => {
  if (count < 1000) {
    if (count < 100) return `${count}`;
    if (count % 100 === 0) return `${count}`;
    const roundedDown = Math.floor(count / 10) * 10;
    return `+${roundedDown}`;
  }
  if (count >= 1000 && count < 100000) {
    const thousands = Math.floor(count / 1000);
    const remainder = count % 1000;
    if (remainder === 0) return `${thousands}k`;
    if (remainder < 100) return `+${thousands}k`;
    const decimalPart = Math.floor(remainder / 100);
    if (remainder % 100 === 0) return `${thousands}.${decimalPart}k`;
    return `+${thousands}.${decimalPart}k`;
  }
  if (count >= 100000) {
    const lakhs = Math.floor(count / 1000);
    return `${lakhs}k`;
  }
  return `${count}`;
};

/* =========================
   Dimension fetching: de-duped + throttled
   ========================= */
// in-flight promise dedup
const inflightDimensionPromises = new Map<string, Promise<{ width: number; height: number }>>();

// global semaphore
let activeGetSizeCalls = 0;
const MAX_PARALLEL_GETSIZE = 4;

const withSemaphore = async <T>(fn: () => Promise<T>): Promise<T> => {
  while (activeGetSizeCalls >= MAX_PARALLEL_GETSIZE) {
    await new Promise((r) => setTimeout(r, 16));
  }
  activeGetSizeCalls++;
  try {
    return await fn();
  } finally {
    activeGetSizeCalls--;
  }
};

export const getImageDimensions = async (
  imageUri: string,
  timeoutMs = DEFAULT_TIMEOUT,
  maxRetries = 1
): Promise<{ width: number; height: number }> => {
  if (!imageUri) {
    if (__DEV__) console.warn("No image URI provided");
    return DEFAULT_DIMENSIONS;
  }

  const cached = dimensionsCache.get(imageUri);
  if (cached) return cached;

  const existing = inflightDimensionPromises.get(imageUri);
  if (existing) return existing;

  const promise = (async () => {
    let lastError: any = null;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const dims = await withSemaphore(
          () =>
            new Promise<{ width: number; height: number }>((resolve, reject) => {
              const id = setTimeout(() => reject(new Error(`Timeout after ${timeoutMs}ms`)), timeoutMs);
              Image.getSize(
                imageUri,
                (width, height) => {
                  clearTimeout(id);
                  resolve({ width, height });
                },
                (err) => {
                  clearTimeout(id);
                  reject(err);
                }
              );
            })
        );
        dimensionsCache.set(imageUri, dims);
        return dims;
      } catch (err: any) {
        lastError = err;
        if (attempt === maxRetries) break;
        const backoff = 300 * Math.pow(2, attempt) + Math.random() * 120;
        await new Promise((r) => setTimeout(r, backoff));
      }
    }

    if (__DEV__) console.warn(`getImageDimensions failed for ${imageUri}: ${lastError?.message}`);
    // short-circuit fallback so others don't stampede
    dimensionsCache.set(imageUri, DEFAULT_DIMENSIONS);
    return DEFAULT_DIMENSIONS;
  })();

  inflightDimensionPromises.set(imageUri, promise);
  try {
    return await promise;
  } finally {
    inflightDimensionPromises.delete(imageUri);
  }
};

// If you still want a "hybrid", keep it simple: reuse the core, then bail.
export const getImageDimensionsHybrid = async (imageUri: string, timeoutMs = DEFAULT_TIMEOUT) => {
  const dims = await getImageDimensions(imageUri, Math.max(2000, Math.floor(timeoutMs * 0.7)), 1);
  return dims; // already cached / de-duped
};

/* =========================
   Height calculation
   ========================= */
const calculateImageHeight = (dimensions: { width: number; height: number }) => {
  let aspectRatio = dimensions.width / dimensions.height;
  aspectRatio = Math.max(INSTAGRAM_MIN_ASPECT_RATIO, Math.min(INSTAGRAM_MAX_ASPECT_RATIO, aspectRatio));
  let calculatedHeight = screenWidth / aspectRatio;
  return Math.round(Math.max(MIN_IMAGE_HEIGHT, Math.min(MAX_IMAGE_HEIGHT, calculatedHeight)));
};

export const calculateHeight = async (data: any) => {
  const images: string[] = data?.post_image ? data.post_image.split(",").filter(Boolean) : [];
  if (images.length === 0) return [];

  const results: Array<{ height: number; imageUrl: string; originalDimensions: { width: number; height: number } }> = [];
  const concurrencyLimit = 2;

  for (let i = 0; i < images.length; i += concurrencyLimit) {
    const batch = images.slice(i, i + concurrencyLimit);
    const batchResults = await Promise.all(
      batch.map(async (item) => {
        const imageUrl = `https://cdn.qoneqt.com/${item}`;
        try {
          const dimensions = await getImageDimensionsHybrid(imageUrl, DEFAULT_TIMEOUT);
          const height = calculateImageHeight(dimensions);
          return { height, imageUrl, originalDimensions: dimensions };
        } catch (_e) {
          return { height: 400, imageUrl, originalDimensions: DEFAULT_DIMENSIONS };
        }
      })
    );
    results.push(...batchResults);
  }
  return results;
};

export const calculateHeightBatch = async (data: any, concurrencyLimit = 2) => {
  const images: string[] = data?.post_image ? data.post_image.split(",").filter(Boolean) : [];
  if (images.length === 0) return [];

  const results: Array<{ height: number }> = [];
  for (let i = 0; i < images.length; i += concurrencyLimit) {
    const batch = images.slice(i, i + concurrencyLimit);
    const batchResults = await Promise.all(
      batch.map(async (item) => {
        const imageUrl = `https://cdn.qoneqt.com/${item}`;
        try {
          const dimensions = await getImageDimensionsHybrid(imageUrl, DEFAULT_TIMEOUT);
          return { height: calculateImageHeight(dimensions) };
        } catch (_e) {
          return { height: 400 };
        }
      })
    );
    results.push(...batchResults);
  }
  return results;
};

/* =========================
   Post processing
   ========================= */
export const processPostsInBatches = async (posts: any[], batchSize = 2) => {
  const results: any[] = [];
  for (let i = 0; i < posts.length; i += batchSize) {
    const batch = posts.slice(i, i + batchSize);
    const batchResults = await Promise.all(
      batch.map(async (item) => {
        if (item?.file_type === "image") {
          try {
            const heights = await calculateHeight(item);
            return {
              ...item,
              display_height: heights.length > 0 ? heights : [{ height: 400 }],
            };
          } catch (_e) {
            return { ...item, display_height: [{ height: 400 }] };
          }
        }
        return { ...item };
      })
    );
    results.push(...batchResults);
  }
  return results;
};

/* =========================
   Preload helpers
   ========================= */
export const preloadImage = (imageUri: string) => {
  return new Promise((resolve) => {
    Image.prefetch(imageUri)
      .then(() => {
        if (__DEV__) console.log("Image preloaded:", imageUri);
        resolve(true);
      })
      .catch((error) => {
        if (__DEV__) console.warn("Image preload failed:", imageUri, error);
        resolve(false);
      });
  });
};

export const preloadImages = async (imageUris: string[], concurrencyLimit = 3) => {
  const results: boolean[] = [];
  for (let i = 0; i < imageUris.length; i += concurrencyLimit) {
    const batch = imageUris.slice(i, i + concurrencyLimit);
    const batchResults: any[] = await Promise.all(batch.map((uri) => preloadImage(uri)));
    results.push(...batchResults);
  }
  return results;
};

/* =========================
   Cache utils
   ========================= */
export const clearImageDimensionsCache = () => {
  dimensionsCache.clear();
  if (__DEV__) console.log("Image dimensions cache cleared");
};

export const getCacheStats = () => {
  return {
    size: dimensionsCache.size(),
    maxSize: dimensionsCache.maxSize,
  };
};
