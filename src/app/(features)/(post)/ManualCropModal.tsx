// ManualCropModal.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Dimensions,
  Image,
  StyleSheet,
  ActivityIndicator,
  Platform,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withDecay,
  cancelAnimation,
} from "react-native-reanimated";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView, // 👈 add this
} from "react-native-gesture-handler";
import { manipulateAsync, SaveFormat } from "expo-image-manipulator";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

interface CropArea { x: number; y: number; width: number; height: number; }
interface ImageTransform { scale: number; translateX: number; translateY: number; }
interface AspectRatio { width: number; height: number; label: string; icon: string; }
interface CroppedImageResult { uri: string; width: number; height: number; type: string; mimeType: string; fileName: string; }
interface ManualCropModalProps {
  visible: boolean;
  imageUri?: string;
  onComplete: (croppedImageData: CroppedImageResult) => Promise<void>;
  onCancel: () => void;
  currentIndex: number;
  totalImages: number;
}

function clamp(v: number, min: number, max: number) { "worklet"; return Math.max(min, Math.min(max, v)); }
function maxTranslateFor(scale: number, imgW: number, imgH: number, cropW: number, cropH: number) { "worklet";
  const scaledW = imgW * scale, scaledH = imgH * scale;
  return { maxX: Math.max(0, (scaledW - cropW) / 2), maxY: Math.max(0, (scaledH - cropH) / 2) };
}

const ManualCropModal: React.FC<ManualCropModalProps> = ({
  visible, imageUri, onComplete, onCancel, currentIndex, totalImages,
}) => {
  const aspectRatios: AspectRatio[] = [
    { width: 1, height: 1, label: "Square", icon: "⬜" },
    { width: 4, height: 5, label: "Portrait", icon: "📱" },
    { width: 16, height: 9, label: "Landscape", icon: "🖥️" },
  ];
  const [aspectRatio, setAspectRatio] = useState({ width: 1, height: 1 });
  const [cropArea, setCropArea] = useState<CropArea>({ x: 0, y: 100, width: screenWidth, height: screenWidth });
  const [originalImageSize, setOriginalImageSize] = useState({ width: 0, height: 0 });
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });

  const [isLoading, setIsLoading] = useState(false);
  const [edgeResistance, setEdgeResistance] = useState(true);
  const [movementSensitivity, setMovementSensitivity] = useState(1.0);

  const [transformMirror, setTransformMirror] = useState<ImageTransform>({ scale: 1, translateX: 0, translateY: 0 });
  const [minScaleState, setMinScaleState] = useState(1);
  const [maxScaleState, setMaxScaleState] = useState(5);

  // shared values
  const scaleSV = useSharedValue(1);
  const txSV = useSharedValue(0);
  const tySV = useSharedValue(0);
  const minScaleSV = useSharedValue(1);
  const maxScaleSV = useSharedValue(5);
  const pinchStartScale = useSharedValue(1);
  const pinchStartTx = useSharedValue(0);
  const pinchStartTy = useSharedValue(0);
  const panStartTx = useSharedValue(0);
  const panStartTy = useSharedValue(0);

  // Android-safe shared config/dims
  const movementSensitivitySV = useSharedValue(1.0);
  const edgeResistanceSV = useSharedValue(1); // 1 on, 0 off
  const imgW = useSharedValue(0);
  const imgH = useSharedValue(0);
  const cropW = useSharedValue(0);
  const cropH = useSharedValue(0);

  useEffect(() => { movementSensitivitySV.value = movementSensitivity; }, [movementSensitivity]);
  useEffect(() => { edgeResistanceSV.value = edgeResistance ? 1 : 0; }, [edgeResistance]);
  useEffect(() => { cropW.value = cropArea.width; cropH.value = cropArea.height; }, [cropArea.width, cropArea.height]);

  useEffect(() => {
    const id = setInterval(() => setTransformMirror({ scale: scaleSV.value, translateX: txSV.value, translateY: tySV.value }), 60);
    return () => clearInterval(id);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: Number.isFinite(txSV.value) ? txSV.value : 0 },
      { translateY: Number.isFinite(tySV.value) ? tySV.value : 0 },
      { scale: Number.isFinite(scaleSV.value) ? scaleSV.value : 1 },
    ],
  }));

  const clampToBounds = (softOvershootPx: number) => { "worklet";
    if (!Number.isFinite(scaleSV.value) || imgW.value === 0 || imgH.value === 0 || cropW.value === 0 || cropH.value === 0) {
      txSV.value = 0; tySV.value = 0; return;
    }
    const { maxX, maxY } = maxTranslateFor(scaleSV.value, imgW.value, imgH.value, cropW.value, cropH.value);
    const overshoot = edgeResistanceSV.value ? softOvershootPx : 0;
    const minX = -(maxX + overshoot), maxXc =  (maxX + overshoot);
    const minY = -(maxY + overshoot), maxYc =  (maxY + overshoot);
    if (!Number.isFinite(txSV.value)) txSV.value = 0;
    if (!Number.isFinite(tySV.value)) tySV.value = 0;
    txSV.value = clamp(txSV.value, minX, maxXc);
    tySV.value = clamp(tySV.value, minY, maxYc);
  };

  const pinch = Gesture.Pinch()
    .enabled(visible)
    .onBegin(() => {
      cancelAnimation(txSV); cancelAnimation(tySV); cancelAnimation(scaleSV);
      pinchStartScale.value = Number.isFinite(scaleSV.value) ? scaleSV.value : 1;
      pinchStartTx.value = Number.isFinite(txSV.value) ? txSV.value : 0;
      pinchStartTy.value = Number.isFinite(tySV.value) ? tySV.value : 0;
    })
    .onUpdate((e) => {
      let nextScale = pinchStartScale.value * e.scale;
      if (!Number.isFinite(nextScale)) return;
      nextScale = clamp(nextScale, minScaleSV.value, maxScaleSV.value);

      const cx = cropW.value / 2, cy = cropH.value / 2;
      const dx = e.focalX - cx, dy = e.focalY - cy;
      if (!Number.isFinite(dx) || !Number.isFinite(dy)) return;

      const currentScale = Number.isFinite(scaleSV.value) ? scaleSV.value : 1;
      const sRatio = nextScale / currentScale;
      if (!Number.isFinite(sRatio) || sRatio === 0) return;

      txSV.value = (pinchStartTx.value - dx) * sRatio + dx;
      tySV.value = (pinchStartTy.value - dy) * sRatio + dy;
      scaleSV.value = nextScale;
      clampToBounds(30);
    })
    .onEnd(() => {
      clampToBounds(0);
      txSV.value = withTiming(txSV.value, { duration: 140 });
      tySV.value = withTiming(tySV.value, { duration: 140 });
    });

  const pan = Gesture.Pan()
    .enabled(visible)
    .minPointers(1)
    .maxPointers(1)
    .activeOffsetX([-10, 10])
    .activeOffsetY([-10, 10])
    .shouldCancelWhenOutside(false) // 👈 helps Android keep gesture active
    .onBegin(() => {
      cancelAnimation(txSV); cancelAnimation(tySV);
      panStartTx.value = Number.isFinite(txSV.value) ? txSV.value : 0;
      panStartTy.value = Number.isFinite(tySV.value) ? tySV.value : 0;
    })
    .onUpdate((e) => {
      const s = movementSensitivitySV.value;
      const tx = panStartTx.value + (e.translationX ?? 0) * s;
      const ty = panStartTy.value + (e.translationY ?? 0) * s;
      if (Number.isFinite(tx)) txSV.value = tx;
      if (Number.isFinite(ty)) tySV.value = ty;
      clampToBounds(30);
    })
    .onEnd((e) => {
      const { maxX, maxY } = maxTranslateFor(scaleSV.value, imgW.value, imgH.value, cropW.value, cropH.value);
      const cx: [number, number] = [-(Number.isFinite(maxX) ? maxX : 0), Number.isFinite(maxX) ? maxX : 0];
      const cy: [number, number] = [-(Number.isFinite(maxY) ? maxY : 0), Number.isFinite(maxY) ? maxY : 0];
      txSV.value = withDecay({ velocity: e.velocityX || 0, deceleration: 0.995, clamp: cx });
      tySV.value = withDecay({ velocity: e.velocityY || 0, deceleration: 0.995, clamp: cy });
    });

  const doubleTap = Gesture.Tap()
    .enabled(visible)
    .numberOfTaps(2)
    .maxDelay(250)
    .onStart((e) => {
      const minZ = minScaleSV.value, maxZ = maxScaleSV.value;
      if (!Number.isFinite(minZ) || !Number.isFinite(maxZ) || maxZ <= 0) return;
      const z = Number.isFinite(scaleSV.value) ? scaleSV.value : minZ;
      const mid = minZ + (maxZ - minZ) * 0.6;
      const target = z < minZ * 1.15 ? mid : (z < mid ? maxZ : minZ);

      const cx = cropW.value / 2, cy = cropH.value / 2;
      const dx = e.x - cx, dy = e.y - cy;
      if (!Number.isFinite(dx) || !Number.isFinite(dy)) return;

      const startZ = z, endZ = target, steps = 12;
      for (let i = 1; i <= steps; i++) {
        const t = i / steps, ease = 1 - Math.pow(1 - t, 3);
        const cur = startZ + (endZ - startZ) * ease;
        const sRatio = cur / (Number.isFinite(scaleSV.value) ? scaleSV.value : startZ);
        if (!Number.isFinite(sRatio) || sRatio === 0) continue;
        txSV.value = (txSV.value - dx) * sRatio + dx;
        tySV.value = (tySV.value - dy) * sRatio + dy;
        scaleSV.value = cur;
        clampToBounds(30);
      }
      clampToBounds(0);
    });

  // ✅ Android-friendly: allow all together
  const composedGesture = Gesture.Simultaneous(pinch, pan, doubleTap);

  // Setup image layout + bounds
  useEffect(() => {
    if (!imageUri) return;
    Image.getSize(
      imageUri,
      (width, height) => {
        setOriginalImageSize({ width, height });
        const imgAspect = width / height;
        const cropAspect = cropArea.width / cropArea.height;
        let displayW: number, displayH: number;
        if (imgAspect > cropAspect) {
          displayH = cropArea.height; displayW = displayH * imgAspect;
        } else {
          displayW = cropArea.width; displayH = displayW / imgAspect;
        }
        setImageSize({ width: displayW, height: displayH });
        imgW.value = displayW; imgH.value = displayH;
        cropW.value = cropArea.width; cropH.value = cropArea.height;

        const minZ = Math.max(cropArea.width / displayW, cropArea.height / displayH);
        const maxZ = Math.max(3, Math.min(8, Math.max(width, height) / 500));
        setMinScaleState(minZ); setMaxScaleState(maxZ);
        minScaleSV.value = minZ; maxScaleSV.value = maxZ;
        scaleSV.value = minZ; txSV.value = 0; tySV.value = 0;
      },
      (err) => console.error("Failed to get image size:", err)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageUri, cropArea.x, cropArea.y, cropArea.width, cropArea.height]);

  const handleCropComplete = async (): Promise<void> => {
    if (!imageUri || !originalImageSize.width || !imageSize.width) return;
    setIsLoading(true);
    try {
      const displayToOriginalRatio = originalImageSize.width / imageSize.width;
      const highResMultiplier = Math.min(displayToOriginalRatio, 4);
      const highResWidth = Math.round(imageSize.width * highResMultiplier);
      const highResHeight = Math.round(imageSize.height * highResMultiplier);

      const highResResult = await manipulateAsync(
        imageUri,
        [{ resize: { width: highResWidth, height: highResHeight } }],
        { compress: 1.0, format: SaveFormat.PNG }
      );

      const scale = scaleSV.value, tX = txSV.value, tY = tySV.value;
      const scaleFactor = highResWidth / imageSize.width;
      const transformedW = imageSize.width * scale * scaleFactor;
      const transformedH = imageSize.height * scale * scaleFactor;
      const cropWpx = cropArea.width * scaleFactor;
      const cropHpx = cropArea.height * scaleFactor;
      const centerX = cropWpx / 2, centerY = cropHpx / 2;
      const uTx = tX * scaleFactor, uTy = tY * scaleFactor;
      const imageLeft = centerX - transformedW / 2 + uTx;
      const imageTop = centerY - transformedH / 2 + uTy;

      const visibleLeft = Math.max(0, imageLeft);
      const visibleTop = Math.max(0, imageTop);
      const visibleRight = Math.min(cropWpx, imageLeft + transformedW);
      const visibleBottom = Math.min(cropHpx, imageTop + transformedH);

      const cropOnImageLeft = visibleLeft - imageLeft;
      const cropOnImageTop = visibleTop - imageTop;
      const cropOnImageRight = visibleRight - imageLeft;
      const cropOnImageBottom = visibleBottom - imageTop;

      const finalCropLeft = Math.max(0, cropOnImageLeft);
      const finalCropTop = Math.max(0, cropOnImageTop);
      const finalCropRight = Math.min(transformedW, cropOnImageRight);
      const finalCropBottom = Math.min(transformedH, cropOnImageBottom);

      const cropWidth = finalCropRight - finalCropLeft;
      const cropHeight = finalCropBottom - finalCropTop;

      const highResCropX = finalCropLeft / scale;
      const highResCropY = finalCropTop / scale;
      const highResCropWidth = cropWidth / scale;
      const highResCropHeight = cropHeight / scale;

      const fx = Math.floor(Math.max(0, highResCropX));
      const fy = Math.floor(Math.max(0, highResCropY));
      const fw = Math.floor(Math.min(highResCropWidth, highResResult.width - fx));
      const fh = Math.floor(Math.min(highResCropHeight, highResResult.height - fy));
      if (fw <= 0 || fh <= 0) throw new Error(`Invalid crop dims ${fw}x${fh}`);

      const finalCropResult = await manipulateAsync(
        highResResult.uri,
        [{ crop: { originX: fx, originY: fy, width: fw, height: fh } }],
        { compress: 0.95, format: SaveFormat.JPEG }
      );

      const croppedImageData: CroppedImageResult = {
        uri: finalCropResult.uri,
        width: finalCropResult.width,
        height: finalCropResult.height,
        type: "image",
        mimeType: "image/jpeg",
        fileName: `cropped_${Date.now()}.jpg`,
      };
      await onComplete(croppedImageData);
    } catch (error: any) {
      console.error("Crop error:", error);
      alert("Failed to crop image: " + error?.message);
    }
    setIsLoading(false);
  };

  const updateCropAreaByAspectRatio = (newAspectRatio: { width: number; height: number }) => {
    setAspectRatio(newAspectRatio);
    const targetRatio = newAspectRatio.width / newAspectRatio.height;
    const maxHeight = screenHeight - 300;
    let newWidth = screenWidth;
    let newHeight = screenWidth / targetRatio;
    if (newHeight > maxHeight) { newHeight = maxHeight; newWidth = maxHeight * targetRatio; }
    const newCrop = { x: (screenWidth - newWidth) / 2, y: 100 + (maxHeight - newHeight) / 2, width: newWidth, height: newHeight };
    setCropArea(newCrop);
    scaleSV.value = withTiming(minScaleState, { duration: 120 });
    txSV.value = withTiming(0, { duration: 120 });
    tySV.value = withTiming(0, { duration: 120 });
  };

  const ZoomHUD = () => (
    <View style={styles.gestureFeedback}>
      <Text style={styles.gestureType}>🔍 / 👆</Text>
      <Text style={styles.zoomLevel}>
        Zoom: {Math.round(((transformMirror.scale - minScaleState) / (maxScaleState - minScaleState || 1)) * 100)}%
      </Text>
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      statusBarTranslucent
      presentationStyle={Platform.OS === "ios" ? "fullScreen" : undefined}
      hardwareAccelerated // 👈 helps Android rendering
      onRequestClose={onCancel}
    >
      {/* 👇 CRUCIAL for Android: a local GestureHandlerRootView inside Modal */}
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onCancel}><Text style={styles.headerButton}>Cancel</Text></TouchableOpacity>
            <Text style={styles.headerTitle}>Edit {currentIndex + 1}/{totalImages}</Text>
            <TouchableOpacity onPress={handleCropComplete} disabled={isLoading}>
              <Text style={[styles.headerButton, styles.doneButton]}>{isLoading ? "Processing..." : "Done"}</Text>
            </TouchableOpacity>
          </View>

          {/* Crop Container */}
          <View style={styles.cropContainer}>
            <View style={styles.blackBackground} />

            <View style={[styles.cropWindow, { top: cropArea.y, left: cropArea.x, width: cropArea.width, height: cropArea.height }]}>
              <GestureDetector gesture={composedGesture}>
                <Animated.View
                  collapsable={false}
                  style={[
                    styles.imageContainer,
                    {
                      width: imageSize.width,
                      height: imageSize.height,
                      left: (cropArea.width - imageSize.width) / 2,
                      top: (cropArea.height - imageSize.height) / 2,
                    },
                    animatedStyle,
                  ]}
                >
                  {!!imageUri && <Image source={{ uri: imageUri }} style={styles.image} resizeMode="cover" />}
                </Animated.View>
              </GestureDetector>

              <View style={styles.grid} pointerEvents="none">
                <View style={[styles.gridLine, { left: "33%", width: 1, height: "100%" }]} />
                <View style={[styles.gridLine, { left: "67%", width: 1, height: "100%" }]} />
                <View style={[styles.gridLine, { top: "33%", height: 1, width: "100%" }]} />
                <View style={[styles.gridLine, { top: "67%", height: 1, width: "100%" }]} />
              </View>

              <View style={styles.border} pointerEvents="none" />
            </View>

            <ZoomHUD />
          </View>

          {isLoading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color="#007AFF" />
              <Text style={styles.loadingText}>Cropping exact area...</Text>
            </View>
          )}

          <View style={styles.aspectContainer}>
            {aspectRatios.map((ratio, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.aspectButton, aspectRatio.width === ratio.width && aspectRatio.height === ratio.height ? styles.selectedAspect : null]}
                onPress={() => updateCropAreaByAspectRatio(ratio)}
              >
                <Text style={styles.aspectIcon}>{ratio.icon}</Text>
                <Text style={styles.aspectLabel}>{ratio.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.instructionsContainer}>
            <Text style={styles.instructionsText}>• Double tap to smart zoom • Pinch with 2 fingers to zoom • Drag with 1 finger to move</Text>
            <Text style={styles.instructionsSubtext}>• Edge touches are more sensitive • Movement adapts to zoom level</Text>
          </View>
        </View>
      </GestureHandlerRootView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 16, paddingVertical: 12, paddingTop: 50, backgroundColor: "#000", borderBottomWidth: 1, borderBottomColor: "#333" },
  headerButton: { color: "#fff", fontSize: 16 },
  doneButton: { color: "#007AFF", fontWeight: "bold" },
  headerTitle: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  cropContainer: { flex: 1, position: "relative" },
  blackBackground: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "#000" },
  cropWindow: { position: "absolute", overflow: "hidden", backgroundColor: "transparent" },
  imageContainer: { position: "absolute" },
  image: { width: "100%", height: "100%" },
  grid: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, opacity: 0.3 },
  gridLine: { position: "absolute", backgroundColor: "#fff" },
  border: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, borderWidth: 2, borderColor: "#fff" },
  gestureFeedback: { position: "absolute", top: 120, right: 20, backgroundColor: "rgba(0,0,0,0.9)", paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, minWidth: 100 },
  gestureType: { color: "#fff", fontSize: 14, fontWeight: "bold", textAlign: "center" },
  zoomLevel: { color: "#888", fontSize: 11, textAlign: "center", marginTop: 2 },
  aspectContainer: { flexDirection: "row", justifyContent: "space-around", paddingVertical: 20, paddingHorizontal: 16, backgroundColor: "#000", borderTopWidth: 1, borderTopColor: "#333" },
  aspectButton: { alignItems: "center", padding: 8, borderRadius: 8, minWidth: 60 },
  selectedAspect: { backgroundColor: "#007AFF20" },
  aspectIcon: { fontSize: 24, marginBottom: 4 },
  aspectLabel: { color: "#fff", fontSize: 12, textAlign: "center" },
  instructionsContainer: { paddingHorizontal: 16, paddingVertical: 8, backgroundColor: "#000", borderTopWidth: 1, borderTopColor: "#333" },
  instructionsText: { color: "#888", fontSize: 12, textAlign: "center" },
  instructionsSubtext: { color: "#666", fontSize: 10, textAlign: "center", marginTop: 2 },
  loadingOverlay: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.7)", justifyContent: "center", alignItems: "center" },
  loadingText: { color: "#fff", marginTop: 10, fontSize: 16 },
});

export default ManualCropModal;
