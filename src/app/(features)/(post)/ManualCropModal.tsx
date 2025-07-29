import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Dimensions,
  Image,
  StyleSheet,
  ActivityIndicator,
  PanResponder,
  Animated,
} from "react-native";
import { manipulateAsync, SaveFormat } from "expo-image-manipulator";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

// Type definitions
interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface ImageLayout {
  width: number;
  height: number;
  x: number;
  y: number;
}

interface ImageTransform {
  scale: number;
  translateX: number;
  translateY: number;
}

interface AspectRatio {
  width: number;
  height: number;
  label: string;
  icon: string;
}

interface CroppedImageResult {
  uri: string;
  width: number;
  height: number;
  type: string;
  mimeType: string;
  fileName: string;
}

interface ManualCropModalProps {
  visible: boolean;
  imageUri?: string;
  onComplete: (croppedImageData: CroppedImageResult) => Promise<void>;
  onCancel: () => void;
  currentIndex: number;
  totalImages: number;
}

const ManualCropModal: React.FC<ManualCropModalProps> = ({
  visible,
  imageUri,
  onComplete,
  onCancel,
  currentIndex,
  totalImages,
}) => {
  const [aspectRatio, setAspectRatio] = useState<{
    width: number;
    height: number;
  }>({ width: 1, height: 1 });

  // Dynamic crop area that changes with aspect ratio
  const [cropArea, setCropArea] = useState<CropArea>({
    x: 0,
    y: 100, // Below header
    width: screenWidth,
    height: screenWidth, // Square by default
  });

  // Image transform state
  const [imageTransform, setImageTransform] = useState<ImageTransform>({
    scale: 1,
    translateX: 0,
    translateY: 0,
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [originalImageSize, setOriginalImageSize] = useState({
    width: 0,
    height: 0,
  });

  const [imageSize, setImageSize] = useState({
    width: 0,
    height: 0,
  });

  const aspectRatios: AspectRatio[] = [
    { width: 1, height: 1, label: "Square", icon: "⬜" },
    { width: 4, height: 5, label: "Portrait", icon: "📱" },
    { width: 16, height: 9, label: "Landscape", icon: "🖥️" },
  ];

  // Get original image dimensions and setup display
  React.useEffect(() => {
    if (imageUri) {
      Image.getSize(
        imageUri,
        (width, height) => {
          console.log("Original image size:", width, "x", height);
          setOriginalImageSize({ width, height });

          // Calculate how the image will be displayed to fit the crop area
          // We want to ensure the image covers the entire crop area (like resizeMode="cover")
          const imageAspect = width / height;
          const cropAspect = cropArea.width / cropArea.height;

          let displayWidth, displayHeight;

          // This matches the "cover" behavior - image fills the crop area
          if (imageAspect > cropAspect) {
            // Image is wider than crop area - fit by height
            displayHeight = cropArea.height;
            displayWidth = displayHeight * imageAspect;
          } else {
            // Image is taller than crop area - fit by width
            displayWidth = cropArea.width;
            displayHeight = displayWidth / imageAspect;
          }

          // The minimum scale ensures the image always covers the crop area
          const minScale = Math.max(
            cropArea.width / displayWidth,
            cropArea.height / displayHeight
          );

          setImageSize({ width: displayWidth, height: displayHeight });

          setImageTransform({
            scale: minScale,
            translateX: 0,
            translateY: 0,
          });

          console.log("Display image size:", displayWidth, "x", displayHeight);
          console.log("Minimum scale to cover crop:", minScale.toFixed(2));
          console.log(
            "Final rendered size:",
            displayWidth * minScale,
            "x",
            displayHeight * minScale
          );
        },
        (error) => {
          console.error("Failed to get image size:", error);
        }
      );
    }
  }, [imageUri, cropArea]);

  // Calculate exact crop coordinates using a different approach
  const calculateExactCropCoordinates = () => {
    console.log("🎯 ALTERNATIVE APPROACH - Canvas-style Mapping");

    console.log("States:", {
      originalImageSize,
      imageSize,
      cropArea,
      imageTransform,
    });

    // Think of it this way:
    // 1. Original image gets scaled to fit the display size (imageSize)
    // 2. User applies zoom (imageTransform.scale) and pan (translate)
    // 3. The crop window cuts a specific rectangle from this transformed view
    // 4. We need to find what part of the ORIGINAL image this rectangle represents

    // Start from the crop window: it's always (0,0) to (cropArea.width, cropArea.height)
    console.log("Crop window (what user sees):", {
      x: 0,
      y: 0,
      width: cropArea.width,
      height: cropArea.height,
    });

    // The image in the crop area has these dimensions after user scaling
    const finalImageWidth = imageSize.width * imageTransform.scale;
    const finalImageHeight = imageSize.height * imageTransform.scale;

    // And it's positioned like this in the crop area (centered + user translation)
    const imageLeftInCrop =
      (cropArea.width - finalImageWidth) / 2 + imageTransform.translateX;
    const imageTopInCrop =
      (cropArea.height - finalImageHeight) / 2 + imageTransform.translateY;

    console.log("Final image in crop area:", {
      width: finalImageWidth,
      height: finalImageHeight,
      left: imageLeftInCrop,
      top: imageTopInCrop,
    });

    // Now, the crop window (0,0,cropWidth,cropHeight) maps to what coordinates on the final scaled image?
    const cropOnFinalImageLeft = -imageLeftInCrop;
    const cropOnFinalImageTop = -imageTopInCrop;
    const cropOnFinalImageRight = cropArea.width - imageLeftInCrop;
    const cropOnFinalImageBottom = cropArea.height - imageTopInCrop;

    // Clamp to image bounds
    const clampedLeft = Math.max(0, cropOnFinalImageLeft);
    const clampedTop = Math.max(0, cropOnFinalImageTop);
    const clampedRight = Math.min(finalImageWidth, cropOnFinalImageRight);
    const clampedBottom = Math.min(finalImageHeight, cropOnFinalImageBottom);

    console.log("Crop area on final scaled image:", {
      left: clampedLeft,
      top: clampedTop,
      right: clampedRight,
      bottom: clampedBottom,
    });

    // Convert to width/height
    const cropWidth = clampedRight - clampedLeft;
    const cropHeight = clampedBottom - clampedTop;

    console.log("Crop dimensions on final scaled image:", {
      width: cropWidth,
      height: cropHeight,
    });

    // Now remove the user scaling to get coordinates on the display-sized image
    const onDisplayLeft = clampedLeft / imageTransform.scale;
    const onDisplayTop = clampedTop / imageTransform.scale;
    const onDisplayWidth = cropWidth / imageTransform.scale;
    const onDisplayHeight = cropHeight / imageTransform.scale;

    console.log("On display-sized image:", {
      left: onDisplayLeft,
      top: onDisplayTop,
      width: onDisplayWidth,
      height: onDisplayHeight,
    });

    // Finally, scale up to original image coordinates
    const scaleUpFactor = originalImageSize.width / imageSize.width;
    console.log("Scale up factor to original:", scaleUpFactor);

    const result = {
      x: Math.round(onDisplayLeft * scaleUpFactor),
      y: Math.round(onDisplayTop * scaleUpFactor),
      width: Math.round(onDisplayWidth * scaleUpFactor),
      height: Math.round(onDisplayHeight * scaleUpFactor),
    };

    // Final bounds checking
    result.x = Math.max(0, result.x);
    result.y = Math.max(0, result.y);
    result.width = Math.min(result.width, originalImageSize.width - result.x);
    result.height = Math.min(
      result.height,
      originalImageSize.height - result.y
    );

    console.log("✅ FINAL RESULT:", result);

    if (result.width <= 0 || result.height <= 0) {
      throw new Error(
        `Invalid crop dimensions: ${result.width}x${result.height}`
      );
    }

    console.log("📊 As percentages of original:", {
      x: ((result.x / originalImageSize.width) * 100).toFixed(1) + "%",
      y: ((result.y / originalImageSize.height) * 100).toFixed(1) + "%",
      width: ((result.width / originalImageSize.width) * 100).toFixed(1) + "%",
      height:
        ((result.height / originalImageSize.height) * 100).toFixed(1) + "%",
    });

    return result;
  };

  // Handle crop completion with proven two-step approach + quality optimization
  // const handleCropComplete = async (): Promise<void> => {
  //   if (!imageUri || !originalImageSize.width) return;

  //   setIsLoading(true);
  //   try {
  //     console.log("🔥 PROVEN TWO-STEP APPROACH + QUALITY OPTIMIZATION");
  //     console.log("Original image:", originalImageSize);
  //     console.log("Crop area:", cropArea);
  //     console.log("Image transform:", imageTransform);

  //     // STEP 1: Create scaled version (this matches exactly what user sees)
  //     const scaledWidth = imageSize.width * imageTransform.scale;
  //     const scaledHeight = imageSize.height * imageTransform.scale;

  //     console.log("Creating scaled image:", { scaledWidth, scaledHeight });

  //     // Use highest quality settings for scaling
  //     const scaledResult = await manipulateAsync(
  //       imageUri,
  //       [
  //         {
  //           resize: {
  //             width: Math.round(scaledWidth),
  //             height: Math.round(scaledHeight),
  //           },
  //         },
  //       ],
  //       {
  //         compress: 1.0, // No compression
  //         format: SaveFormat.PNG, // Lossless intermediate
  //       }
  //     );

  //     console.log("✅ Scaled image created:", {
  //       width: scaledResult.width,
  //       height: scaledResult.height,
  //     });

  //     // STEP 2: Calculate crop coordinates on the scaled image
  //     const imageX =
  //       (cropArea.width - scaledWidth) / 2 + imageTransform.translateX;
  //     const imageY =
  //       (cropArea.height - scaledHeight) / 2 + imageTransform.translateY;

  //     const cropOnScaledX = Math.max(0, -imageX);
  //     const cropOnScaledY = Math.max(0, -imageY);
  //     const cropOnScaledRight = Math.min(scaledWidth, cropArea.width - imageX);
  //     const cropOnScaledBottom = Math.min(
  //       scaledHeight,
  //       cropArea.height - imageY
  //     );

  //     const cropOnScaledWidth = cropOnScaledRight - cropOnScaledX;
  //     const cropOnScaledHeight = cropOnScaledBottom - cropOnScaledY;

  //     console.log("📐 Crop coordinates on scaled image:", {
  //       x: cropOnScaledX,
  //       y: cropOnScaledY,
  //       width: cropOnScaledWidth,
  //       height: cropOnScaledHeight,
  //     });

  //     if (cropOnScaledWidth <= 0 || cropOnScaledHeight <= 0) {
  //       throw new Error(
  //         `Invalid crop dimensions: ${cropOnScaledWidth}x${cropOnScaledHeight}`
  //       );
  //     }

  //     // STEP 3: Crop with maximum quality settings
  //     const finalCropResult = await manipulateAsync(
  //       scaledResult.uri,
  //       [
  //         {
  //           crop: {
  //             originX: Math.round(cropOnScaledX),
  //             originY: Math.round(cropOnScaledY),
  //             width: Math.round(cropOnScaledWidth),
  //             height: Math.round(cropOnScaledHeight),
  //           },
  //         },
  //       ],
  //       {
  //         compress: 1.0, // No compression for maximum quality
  //         format: SaveFormat.PNG, // Lossless final output
  //       }
  //     );

  //     // Create result object
  //     const croppedImageData: CroppedImageResult = {
  //       uri: finalCropResult.uri,
  //       width: finalCropResult.width,
  //       height: finalCropResult.height,
  //       type: "image",
  //       mimeType: "image/png",
  //       fileName: `cropped_${Date.now()}.png`,
  //     };

  //     console.log("✅ HIGH-QUALITY TWO-STEP RESULT:", croppedImageData);

  //     await onComplete(croppedImageData);
  //   } catch (error) {
  //     console.error("❌ Two-step quality optimization error:", error);
  //     alert("Failed to crop image: " + error.message);
  //   }
  //   setIsLoading(false);
  // };

  // FIXED VERSION: Proper bounds checking and coordinate handling
  const handleCropComplete = async (): Promise<void> => {
    if (!imageUri || !originalImageSize.width) return;

    setIsLoading(true);
    try {
      console.log(
        "🔍 ZOOM-FIXED: Accurate coordinate mapping for zoomed images"
      );

      // Log current state for debugging
      console.log("📊 Current state:", {
        originalImageSize,
        imageSize,
        cropArea,
        imageTransform,
      });

      // Step 1: Create high-res intermediate (as before)
      const displayToOriginalRatio = originalImageSize.width / imageSize.width;
      const highResMultiplier = Math.min(displayToOriginalRatio, 4);
      const highResWidth = Math.round(imageSize.width * highResMultiplier);
      const highResHeight = Math.round(imageSize.height * highResMultiplier);

      const highResResult = await manipulateAsync(
        imageUri,
        [{ resize: { width: highResWidth, height: highResHeight } }],
        { compress: 1.0, format: SaveFormat.PNG }
      );

      console.log("✅ High-res created:", {
        width: highResResult.width,
        height: highResResult.height,
      });

      // Step 2: CORRECTED coordinate calculation
      const scale = highResWidth / imageSize.width; // Scale factor to high-res

      // Calculate the transformed image dimensions in high-res space
      const transformedImageWidth =
        imageSize.width * imageTransform.scale * scale;
      const transformedImageHeight =
        imageSize.height * imageTransform.scale * scale;

      // Calculate where the transformed image is positioned in the crop window (high-res space)
      const cropWindowWidth = cropArea.width * scale;
      const cropWindowHeight = cropArea.height * scale;

      // Image center position in crop window (before user translation)
      const imageCenterX = cropWindowWidth / 2;
      const imageCenterY = cropWindowHeight / 2;

      // Apply user translation (scaled to high-res)
      const userTranslateX = imageTransform.translateX * scale;
      const userTranslateY = imageTransform.translateY * scale;

      // Final image position (top-left corner of the transformed image in crop window)
      const imageLeft =
        imageCenterX - transformedImageWidth / 2 + userTranslateX;
      const imageTop =
        imageCenterY - transformedImageHeight / 2 + userTranslateY;

      console.log("🎯 Image position in crop window:", {
        imageLeft,
        imageTop,
        imageRight: imageLeft + transformedImageWidth,
        imageBottom: imageTop + transformedImageHeight,
        transformedSize: {
          width: transformedImageWidth,
          height: transformedImageHeight,
        },
      });

      // Step 3: Calculate what part of the transformed image is visible in crop window
      // The crop window is always (0, 0, cropWindowWidth, cropWindowHeight)
      const visibleLeft = Math.max(0, imageLeft);
      const visibleTop = Math.max(0, imageTop);
      const visibleRight = Math.min(
        cropWindowWidth,
        imageLeft + transformedImageWidth
      );
      const visibleBottom = Math.min(
        cropWindowHeight,
        imageTop + transformedImageHeight
      );

      console.log("👁️ Visible area in crop window:", {
        visibleLeft,
        visibleTop,
        visibleRight,
        visibleBottom,
      });

      // Step 4: Map visible area back to coordinates on the transformed image
      const cropOnImageLeft = visibleLeft - imageLeft;
      const cropOnImageTop = visibleTop - imageTop;
      const cropOnImageRight = visibleRight - imageLeft;
      const cropOnImageBottom = visibleBottom - imageTop;

      // Ensure we're within the transformed image bounds
      const finalCropLeft = Math.max(0, cropOnImageLeft);
      const finalCropTop = Math.max(0, cropOnImageTop);
      const finalCropRight = Math.min(transformedImageWidth, cropOnImageRight);
      const finalCropBottom = Math.min(
        transformedImageHeight,
        cropOnImageBottom
      );

      const cropWidth = finalCropRight - finalCropLeft;
      const cropHeight = finalCropBottom - finalCropTop;

      console.log("✂️ Crop area on transformed image:", {
        left: finalCropLeft,
        top: finalCropTop,
        width: cropWidth,
        height: cropHeight,
      });

      // Step 5: Map back to high-res image coordinates
      // The transformed image is scaled by imageTransform.scale, so we need to reverse that
      const highResCropX = finalCropLeft / imageTransform.scale;
      const highResCropY = finalCropTop / imageTransform.scale;
      const highResCropWidth = cropWidth / imageTransform.scale;
      const highResCropHeight = cropHeight / imageTransform.scale;

      // Final integer coordinates for the crop
      const finalCropCoords = {
        originX: Math.floor(Math.max(0, highResCropX)),
        originY: Math.floor(Math.max(0, highResCropY)),
        width: Math.floor(
          Math.min(
            highResCropWidth,
            highResResult.width - Math.floor(highResCropX)
          )
        ),
        height: Math.floor(
          Math.min(
            highResCropHeight,
            highResResult.height - Math.floor(highResCropY)
          )
        ),
      };

      console.log("🎯 Final high-res crop coordinates:", finalCropCoords);
      console.log("📏 Crop validation:", {
        maxX: finalCropCoords.originX + finalCropCoords.width,
        maxY: finalCropCoords.originY + finalCropCoords.height,
        imageWidth: highResResult.width,
        imageHeight: highResResult.height,
        withinBounds:
          finalCropCoords.originX + finalCropCoords.width <=
            highResResult.width &&
          finalCropCoords.originY + finalCropCoords.height <=
            highResResult.height,
      });

      // Validate crop dimensions
      if (finalCropCoords.width <= 0 || finalCropCoords.height <= 0) {
        throw new Error(
          `Invalid crop dimensions: ${finalCropCoords.width}x${finalCropCoords.height}`
        );
      }

      // Final bounds check
      if (
        finalCropCoords.originX + finalCropCoords.width > highResResult.width ||
        finalCropCoords.originY + finalCropCoords.height > highResResult.height
      ) {
        throw new Error(
          "Crop coordinates exceed image bounds after calculation"
        );
      }

      // Step 6: Perform the crop
      const finalCropResult = await manipulateAsync(
        highResResult.uri,
        [{ crop: finalCropCoords }],
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

      console.log("✅ ZOOM-FIXED RESULT:", croppedImageData);
      await onComplete(croppedImageData);
    } catch (error) {
      console.error("❌ Zoom-fixed crop error:", error);
      alert("Failed to crop image: " + error.message);
    }
    setIsLoading(false);
  };

  // ADDITIONAL SAFETY: Add bounds checking to your existing coordinate calculation
  const calculateSafeCropCoordinates = () => {
    try {
      const coords = calculateExactCropCoordinates();

      // Ensure coordinates are integers and within bounds
      const safeCoords = {
        x: Math.max(0, Math.floor(coords.x)),
        y: Math.max(0, Math.floor(coords.y)),
        width: Math.floor(coords.width),
        height: Math.floor(coords.height),
      };

      // Bounds checking
      safeCoords.x = Math.min(safeCoords.x, originalImageSize.width - 1);
      safeCoords.y = Math.min(safeCoords.y, originalImageSize.height - 1);
      safeCoords.width = Math.min(
        safeCoords.width,
        originalImageSize.width - safeCoords.x
      );
      safeCoords.height = Math.min(
        safeCoords.height,
        originalImageSize.height - safeCoords.y
      );

      // Final validation
      if (safeCoords.width <= 0 || safeCoords.height <= 0) {
        throw new Error(
          `Invalid safe crop dimensions: ${safeCoords.width}x${safeCoords.height}`
        );
      }

      if (
        safeCoords.x + safeCoords.width > originalImageSize.width ||
        safeCoords.y + safeCoords.height > originalImageSize.height
      ) {
        throw new Error("Safe crop coordinates still exceed bounds");
      }

      return safeCoords;
    } catch (error) {
      console.error("Coordinate calculation error:", error);
      throw error;
    }
  };
  const updateCropAreaByAspectRatio = (newAspectRatio: {
    width: number;
    height: number;
  }): void => {
    setAspectRatio(newAspectRatio);

    // Calculate new crop area dimensions
    const targetRatio = newAspectRatio.width / newAspectRatio.height;
    const maxHeight = screenHeight - 300; // Reserve space for header and controls

    let newWidth = screenWidth;
    let newHeight = screenWidth / targetRatio;

    // If height exceeds available space, constrain by height
    if (newHeight > maxHeight) {
      newHeight = maxHeight;
      newWidth = maxHeight * targetRatio;
    }

    const newCropArea = {
      x: (screenWidth - newWidth) / 2, // Center horizontally
      y: 100 + (maxHeight - newHeight) / 2, // Center in available space
      width: newWidth,
      height: newHeight,
    };

    console.log("🎯 New crop area:", newCropArea);
    setCropArea(newCropArea);
  };

  // Constrain image to always cover crop area
  const constrainTransform = (transform: ImageTransform) => {
    const minScale = Math.max(
      cropArea.width / imageSize.width,
      cropArea.height / imageSize.height
    );

    // Ensure minimum scale to cover crop area
    const constrainedScale = Math.max(minScale, transform.scale);

    // Calculate translation bounds
    const scaledConstrainedWidth = imageSize.width * constrainedScale;
    const scaledConstrainedHeight = imageSize.height * constrainedScale;

    const maxTranslateX = (scaledConstrainedWidth - cropArea.width) / 2;
    const maxTranslateY = (scaledConstrainedHeight - cropArea.height) / 2;

    const constrainedTranslateX = Math.max(
      -maxTranslateX,
      Math.min(maxTranslateX, transform.translateX)
    );
    const constrainedTranslateY = Math.max(
      -maxTranslateY,
      Math.min(maxTranslateY, transform.translateY)
    );

    return {
      scale: constrainedScale,
      translateX: constrainedTranslateX,
      translateY: constrainedTranslateY,
    };
  };

  // Simple gesture handling
  const [isGesturing, setIsGesturing] = useState(false);
  const gestureState = useRef({
    initialScale: 1,
    initialTranslateX: 0,
    initialTranslateY: 0,
    initialDistance: 0,
  });

  const getDistance = (touches: any[]) => {
    if (touches.length < 2) return 0;
    const dx = touches[0].pageX - touches[1].pageX;
    const dy = touches[0].pageY - touches[1].pageY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderTerminationRequest: () => false,

    onPanResponderGrant: (evt) => {
      const touchCount = evt.nativeEvent.touches.length;
      setIsGesturing(true);

      const initialDistance =
        touchCount === 2 ? getDistance(evt.nativeEvent.touches) : 0;

      gestureState.current = {
        initialScale: imageTransform.scale,
        initialTranslateX: imageTransform.translateX,
        initialTranslateY: imageTransform.translateY,
        initialDistance: initialDistance,
      };
    },

    onPanResponderMove: (evt, gesture) => {
      const touchCount = evt.nativeEvent.touches.length;

      if (touchCount === 2) {
        // ZOOM - Two finger pinch
        const currentDistance = getDistance(evt.nativeEvent.touches);
        const initialDistance = gestureState.current.initialDistance;

        if (initialDistance === 0) {
          gestureState.current.initialDistance = currentDistance;
          gestureState.current.initialScale = imageTransform.scale;
          gestureState.current.initialTranslateX = imageTransform.translateX;
          gestureState.current.initialTranslateY = imageTransform.translateY;
          return;
        }

        if (currentDistance > 20 && initialDistance > 20) {
          const scaleRatio = currentDistance / initialDistance;
          const newScale = gestureState.current.initialScale * scaleRatio;

          const constrainedTransform = constrainTransform({
            scale: newScale,
            translateX: gestureState.current.initialTranslateX,
            translateY: gestureState.current.initialTranslateY,
          });

          setImageTransform(constrainedTransform);
        }
      } else if (touchCount === 1) {
        // PAN - Single finger drag
        if (gestureState.current.initialDistance > 0) {
          gestureState.current.initialDistance = 0;
          gestureState.current.initialTranslateX = imageTransform.translateX;
          gestureState.current.initialTranslateY = imageTransform.translateY;
        }

        const sensitivity = 1.0;
        const newTranslateX =
          gestureState.current.initialTranslateX + gesture.dx * sensitivity;
        const newTranslateY =
          gestureState.current.initialTranslateY + gesture.dy * sensitivity;

        const constrainedTransform = constrainTransform({
          scale: imageTransform.scale,
          translateX: newTranslateX,
          translateY: newTranslateY,
        });

        setImageTransform(constrainedTransform);
      }
    },

    onPanResponderRelease: () => {
      setIsGesturing(false);
      gestureState.current.initialDistance = 0;
    },
  });

  
  return (
    <Modal visible={visible} animationType="slide" statusBarTranslucent>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onCancel}>
            <Text style={styles.headerButton}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            Edit {currentIndex + 1}/{totalImages}
          </Text>
          <TouchableOpacity onPress={handleCropComplete} disabled={isLoading}>
            <Text style={[styles.headerButton, styles.doneButton]}>
              {isLoading ? "Processing..." : "Done"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Crop Container */}
        <View style={styles.cropContainer}>
          {/* Black background overlay */}
          <View style={styles.blackBackground} />

          {/* Crop window */}
          <View
            style={[
              styles.cropWindow,
              {
                top: cropArea.y,
                left: cropArea.x,
                width: cropArea.width,
                height: cropArea.height,
              },
            ]}
            {...panResponder.panHandlers}
          >
            {/* Image */}
            {imageSize.width > 0 && (
              <Animated.View
                style={[
                  styles.imageContainer,
                  {
                    width: imageSize.width,
                    height: imageSize.height,
                    left: (cropArea.width - imageSize.width) / 2,
                    top: (cropArea.height - imageSize.height) / 2,
                    transform: [
                      { scale: imageTransform.scale },
                      { translateX: imageTransform.translateX },
                      { translateY: imageTransform.translateY },
                    ],
                  },
                ]}
              >
                <Image
                  source={{ uri: imageUri }}
                  style={styles.image}
                  resizeMode="cover"
                />
              </Animated.View>
            )}

            {/* Grid overlay */}
            <View style={styles.grid} pointerEvents="none">
              <View
                style={[
                  styles.gridLine,
                  { left: "33%", width: 1, height: "100%" },
                ]}
              />
              <View
                style={[
                  styles.gridLine,
                  { left: "67%", width: 1, height: "100%" },
                ]}
              />
              <View
                style={[
                  styles.gridLine,
                  { top: "33%", height: 1, width: "100%" },
                ]}
              />
              <View
                style={[
                  styles.gridLine,
                  { top: "67%", height: 1, width: "100%" },
                ]}
              />
            </View>

            {/* Border */}
            <View style={styles.border} pointerEvents="none" />
          </View>
        </View>

        {/* Loading overlay */}
        {isLoading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.loadingText}>Cropping exact area...</Text>
          </View>
        )}

        {/* Aspect Ratio Selector */}
        <View style={styles.aspectContainer}>
          {aspectRatios.map((ratio, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.aspectButton,
                aspectRatio.width === ratio.width &&
                aspectRatio.height === ratio.height
                  ? styles.selectedAspect
                  : null,
              ]}
              onPress={() => updateCropAreaByAspectRatio(ratio)}
            >
              <Text style={styles.aspectIcon}>{ratio.icon}</Text>
              <Text style={styles.aspectLabel}>{ratio.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 50,
    backgroundColor: "#000",
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  headerButton: {
    color: "#fff",
    fontSize: 16,
  },
  doneButton: {
    color: "#007AFF",
    fontWeight: "bold",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  cropContainer: {
    flex: 1,
    position: "relative",
  },
  blackBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#000",
  },
  cropWindow: {
    position: "absolute",
    overflow: "hidden",
    backgroundColor: "transparent",
  },
  imageContainer: {
    position: "absolute",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  grid: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.3,
  },
  gridLine: {
    position: "absolute",
    backgroundColor: "#fff",
  },
  border: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderWidth: 2,
    borderColor: "#fff",
  },
  debugContainer: {
    position: "absolute",
    bottom: 120,
    left: 16,
    right: 16,
    backgroundColor: "rgba(0,0,0,0.8)",
    padding: 8,
    borderRadius: 8,
  },
  debugText: {
    color: "#fff",
    fontSize: 12,
    textAlign: "center",
  },
  aspectContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 20,
    paddingHorizontal: 16,
    backgroundColor: "#000",
    borderTopWidth: 1,
    borderTopColor: "#333",
  },
  aspectButton: {
    alignItems: "center",
    padding: 8,
    borderRadius: 8,
    minWidth: 60,
  },
  selectedAspect: {
    backgroundColor: "#007AFF20",
  },
  aspectIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  aspectLabel: {
    color: "#fff",
    fontSize: 12,
    textAlign: "center",
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#fff",
    marginTop: 10,
    fontSize: 16,
  },
  debugOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  debugCropIndicator: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  debugIndicatorText: {
    color: "#fff",
    fontSize: 10,
    textAlign: "center",
    fontWeight: "bold",
  },
});

export default ManualCropModal;
