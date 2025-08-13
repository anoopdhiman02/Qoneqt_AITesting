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

  // Enhanced movement controls state
  const [movementMode, setMovementMode] = useState<'free' | 'horizontal' | 'vertical'>('free');
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const animationRef = useRef<number | null>(null);

  const aspectRatios: AspectRatio[] = [
    { width: 1, height: 1, label: "Square", icon: "⬜" },
    { width: 4, height: 5, label: "Portrait", icon: "📱" },
    { width: 16, height: 9, label: "Landscape", icon: "🖥️" },
  ];

  // Enhanced zoom state
  const [minScale, setMinScale] = useState(1);
  const [maxScale, setMaxScale] = useState(5);
  const lastTap = useRef<number>(0);

  // Enhanced gesture state
  const [isGesturing, setIsGesturing] = useState(false);
  const gestureState = useRef({
    initialScale: 1,
    initialTranslateX: 0,
    initialTranslateY: 0,
    initialDistance: 0,
    lastTouchCount: 0,
    startTime: 0,
    gestureDirection: null as 'horizontal' | 'vertical' | 'diagonal' | null,
    lockDirection: false,
  });

  // Get distance between two touches for pinch gesture
  const getDistance = (touches: any[]) => {
    if (touches.length < 2) return 0;
    const dx = touches[0].pageX - touches[1].pageX;
    const dy = touches[0].pageY - touches[1].pageY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  // Get original image dimensions and setup display
  React.useEffect(() => {
    if (imageUri) {
      Image.getSize(
        imageUri,
        (width, height) => {
          console.log("Original image size:", width, "x", height);
          setOriginalImageSize({ width, height });

          // Calculate how the image will be displayed to fit the crop area
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
          const calculatedMinScale = Math.max(
            cropArea.width / displayWidth,
            cropArea.height / displayHeight
          );

          // Set dynamic max scale based on image resolution
          const calculatedMaxScale = Math.max(
            3,
            Math.min(8, Math.max(width, height) / 500)
          );

          setImageSize({ width: displayWidth, height: displayHeight });
          setMinScale(calculatedMinScale);
          setMaxScale(calculatedMaxScale);
          setImageTransform({
            scale: calculatedMinScale,
            translateX: 0,
            translateY: 0,
          });

          console.log("Display setup:", {
            displaySize: { width: displayWidth, height: displayHeight },
            minScale: calculatedMinScale.toFixed(2),
            maxScale: calculatedMaxScale.toFixed(2),
          });
        },
        (error) => {
          console.error("Failed to get image size:", error);
        }
      );
    }
  }, [imageUri, cropArea]);

  // Enhanced constrain transform with improved bounds checking
  const constrainTransform = (transform: ImageTransform) => {
    // Ensure minimum scale to cover crop area
    const constrainedScale = Math.max(
      minScale,
      Math.min(maxScale, transform.scale)
    );

    // Calculate translation bounds
    const scaledConstrainedWidth = imageSize.width * constrainedScale;
    const scaledConstrainedHeight = imageSize.height * constrainedScale;

    const maxTranslateX = Math.max(
      0,
      (scaledConstrainedWidth - cropArea.width) / 2
    );
    const maxTranslateY = Math.max(
      0,
      (scaledConstrainedHeight - cropArea.height) / 2
    );

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

  // Enhanced smooth movement function
  const moveImageSmooth = (direction: 'left' | 'right' | 'up' | 'down', distance = 25) => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    
    const startTransform = { ...imageTransform };
    let targetTransform = { ...startTransform };
    
    switch(direction) {
      case 'left':
        targetTransform.translateX = startTransform.translateX - distance;
        break;
      case 'right':
        targetTransform.translateX = startTransform.translateX + distance;
        break;
      case 'up':
        targetTransform.translateY = startTransform.translateY - distance;
        break;
      case 'down':
        targetTransform.translateY = startTransform.translateY + distance;
        break;
    }
    
    const constrainedTarget = constrainTransform(targetTransform);
    
    // Smooth animation
    const duration = 150;
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease-out animation
      const easeProgress = 1 - Math.pow(1 - progress, 2);
      
      const currentTransform = {
        scale: startTransform.scale,
        translateX: startTransform.translateX + 
          (constrainedTarget.translateX - startTransform.translateX) * easeProgress,
        translateY: startTransform.translateY + 
          (constrainedTarget.translateY - startTransform.translateY) * easeProgress,
      };
      
      setImageTransform(currentTransform);
      
      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
      }
    };
    
    animationRef.current = requestAnimationFrame(animate);
  };

  // Add momentum after gesture
  const addMomentum = (vx: number, vy: number) => {
    const momentumDuration = 300;
    const friction = 0.95;
    const startTime = Date.now();
    
    let currentVx = vx * 15;
    let currentVy = vy * 15;
    
    const momentum = () => {
      const elapsed = Date.now() - startTime;
      const progress = elapsed / momentumDuration;
      
      if (progress >= 1 || (Math.abs(currentVx) < 0.1 && Math.abs(currentVy) < 0.1)) {
        return;
      }
      
      currentVx *= friction;
      currentVy *= friction;
      
      setImageTransform(prev => {
        const newTransform = {
          ...prev,
          translateX: prev.translateX + currentVx,
          translateY: prev.translateY + currentVy,
        };
        
        return constrainTransform(newTransform);
      });
      
      requestAnimationFrame(momentum);
    };
    
    requestAnimationFrame(momentum);
  };

  // Enhanced zoom functions
  const zoomIn = (centerX?: number, centerY?: number) => {
    const zoomFactor = 1.5;
    const newScale = Math.min(maxScale, imageTransform.scale * zoomFactor);

    if (newScale === imageTransform.scale) return; // Already at max zoom

    // If no center provided, zoom to center of crop area
    const zoomCenterX = centerX ?? cropArea.width / 2;
    const zoomCenterY = centerY ?? cropArea.height / 2;

    // Calculate new translation to keep zoom centered
    const scaleDiff = newScale / imageTransform.scale;
    const newTranslateX =
      imageTransform.translateX -
      ((zoomCenterX - cropArea.width / 2 - imageTransform.translateX) *
        (scaleDiff - 1)) /
        scaleDiff;
    const newTranslateY =
      imageTransform.translateY -
      ((zoomCenterY - cropArea.height / 2 - imageTransform.translateY) *
        (scaleDiff - 1)) /
        scaleDiff;

    const constrainedTransform = constrainTransform({
      scale: newScale,
      translateX: newTranslateX,
      translateY: newTranslateY,
    });

    setImageTransform(constrainedTransform);
  };

  const zoomOut = (centerX?: number, centerY?: number) => {
    const zoomFactor = 0.7;
    const newScale = Math.max(minScale, imageTransform.scale * zoomFactor);

    if (newScale === imageTransform.scale) return; // Already at min zoom

    // If no center provided, zoom to center of crop area
    const zoomCenterX = centerX ?? cropArea.width / 2;
    const zoomCenterY = centerY ?? cropArea.height / 2;

    // Calculate new translation to keep zoom centered
    const scaleDiff = newScale / imageTransform.scale;
    const newTranslateX =
      imageTransform.translateX -
      ((zoomCenterX - cropArea.width / 2 - imageTransform.translateX) *
        (scaleDiff - 1)) /
        scaleDiff;
    const newTranslateY =
      imageTransform.translateY -
      ((zoomCenterY - cropArea.height / 2 - imageTransform.translateY) *
        (scaleDiff - 1)) /
        scaleDiff;

    const constrainedTransform = constrainTransform({
      scale: newScale,
      translateX: newTranslateX,
      translateY: newTranslateY,
    });

    setImageTransform(constrainedTransform);
  };

  const resetZoom = () => {
    setImageTransform({
      scale: minScale,
      translateX: 0,
      translateY: 0,
    });
  };

  const handleDoubleTap = (event: any) => {
    const now = Date.now();
    const DOUBLE_PRESS_DELAY = 300;

    if (lastTap.current && now - lastTap.current < DOUBLE_PRESS_DELAY) {
      // Double tap detected
      const touch = event.nativeEvent;
      const tapX = touch.locationX;
      const tapY = touch.locationY;

      // Define zoom levels as percentages of the available zoom range
      const zoomRange = maxScale - minScale;
      const zoomLevels = [
        minScale + zoomRange * 0.25, // 25%
        minScale + zoomRange * 0.5, // 50%
        minScale + zoomRange * 0.75, // 75%
      ];

      let targetScale: number;

      // Determine current zoom state and next target
      if (imageTransform.scale <= minScale * 1.1) {
        // Currently at minimum, go to 25%
        targetScale = zoomLevels[0];
      } else if (imageTransform.scale <= zoomLevels[0] * 1.1) {
        // Currently at 25%, go to 50%
        targetScale = zoomLevels[1];
      } else if (imageTransform.scale <= zoomLevels[1] * 1.1) {
        // Currently at 50%, go to 75%
        targetScale = zoomLevels[2];
      } else {
        // Currently at 75% or higher, reset to minimum
        resetZoom();
        lastTap.current = 0;
        return;
      }

      // Calculate new translation to zoom into tap location
      const scaleDiff = targetScale / imageTransform.scale;
      const newTranslateX =
        imageTransform.translateX -
        ((tapX - cropArea.width / 2 - imageTransform.translateX) *
          (scaleDiff - 1)) /
          scaleDiff;
      const newTranslateY =
        imageTransform.translateY -
        ((tapY - cropArea.height / 2 - imageTransform.translateY) *
          (scaleDiff - 1)) /
          scaleDiff;

      const constrainedTransform = constrainTransform({
        scale: targetScale,
        translateX: newTranslateX,
        translateY: newTranslateY,
      });

      setImageTransform(constrainedTransform);

      lastTap.current = 0; // Reset
    } else {
      lastTap.current = now;
    }
  };

  // Enhanced Pan Responder
  const enhancedPanResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: (evt, gesture) => {
      return Math.abs(gesture.dx) > 3 || Math.abs(gesture.dy) > 3;
    },

    onPanResponderGrant: (evt) => {
      // Cancel any ongoing animation
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        setIsAnimating(false);
      }
      
      const touches = evt.nativeEvent.touches;
      const touchCount = touches.length;
      setIsGesturing(true);

      gestureState.current = {
        initialScale: imageTransform.scale,
        initialTranslateX: imageTransform.translateX,
        initialTranslateY: imageTransform.translateY,
        initialDistance: touchCount === 2 ? getDistance(touches) : 0,
        lastTouchCount: touchCount,
        startTime: Date.now(),
        gestureDirection: null,
        lockDirection: false,
      };
    },

    onPanResponderMove: (evt, gesture) => {
      const touches = evt.nativeEvent.touches;
      
      // Two finger pinch-to-zoom
      if (touches.length === 2) {
        const distance = getDistance(touches);
        if (gestureState.current.initialDistance > 0) {
          const scaleChange = distance / gestureState.current.initialDistance;
          const newScale = Math.max(minScale, Math.min(maxScale, 
            gestureState.current.initialScale * scaleChange));
          
          setImageTransform(prev => ({
            ...prev,
            scale: newScale
          }));
        }
        return;
      }

      // Single finger pan with directional locking
      if (touches.length === 1) {
        const { dx, dy } = gesture;
        
        // Determine and lock gesture direction
        if (!gestureState.current.lockDirection && 
            (Math.abs(dx) > 10 || Math.abs(dy) > 10)) {
          
          const absDx = Math.abs(dx);
          const absDy = Math.abs(dy);
          
          if (absDx > absDy * 1.5) {
            gestureState.current.gestureDirection = 'horizontal';
          } else if (absDy > absDx * 1.5) {
            gestureState.current.gestureDirection = 'vertical';
          } else {
            gestureState.current.gestureDirection = 'diagonal';
          }
          
          gestureState.current.lockDirection = true;
        }
        
        // Apply movement based on direction and mode
        let newTranslateX = gestureState.current.initialTranslateX;
        let newTranslateY = gestureState.current.initialTranslateY;
        
        switch(movementMode) {
          case 'horizontal':
            newTranslateX += dx;
            break;
          case 'vertical':
            newTranslateY += dy;
            break;
          case 'free':
          default:
            if (gestureState.current.gestureDirection === 'horizontal') {
              newTranslateX += dx;
              newTranslateY += dy * 0.3; // Reduced vertical sensitivity
            } else if (gestureState.current.gestureDirection === 'vertical') {
              newTranslateY += dy;
              newTranslateX += dx * 0.3; // Reduced horizontal sensitivity
            } else {
              newTranslateX += dx;
              newTranslateY += dy;
            }
            break;
        }
        
        const newTransform = {
          scale: imageTransform.scale,
          translateX: newTranslateX,
          translateY: newTranslateY,
        };
        
        setImageTransform(constrainTransform(newTransform));
      }
    },

    onPanResponderRelease: (evt, gesture) => {
      setIsGesturing(false);
      
      // Add momentum if gesture was fast enough
      const { vx, vy } = gesture;
      const velocityThreshold = 0.5;
      
      if (Math.abs(vx) > velocityThreshold || Math.abs(vy) > velocityThreshold) {
        addMomentum(vx, vy);
      }
    },

    onPanResponderTerminate: () => {
      setIsGesturing(false);
    },
  });

  // Handle crop completion
  const handleCropComplete = async (): Promise<void> => {
    if (!imageUri || !originalImageSize.width) return;

    setIsLoading(true);
    try {
      console.log("🔍 ZOOM-FIXED: Accurate coordinate mapping for zoomed images");

      // Step 1: Create high-res intermediate
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

      // Step 2: Calculate coordinates
      const scale = highResWidth / imageSize.width;

      const transformedImageWidth =
        imageSize.width * imageTransform.scale * scale;
      const transformedImageHeight =
        imageSize.height * imageTransform.scale * scale;

      const cropWindowWidth = cropArea.width * scale;
      const cropWindowHeight = cropArea.height * scale;

      const imageCenterX = cropWindowWidth / 2;
      const imageCenterY = cropWindowHeight / 2;

      const userTranslateX = imageTransform.translateX * scale;
      const userTranslateY = imageTransform.translateY * scale;

      const imageLeft =
        imageCenterX - transformedImageWidth / 2 + userTranslateX;
      const imageTop =
        imageCenterY - transformedImageHeight / 2 + userTranslateY;

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

      const cropOnImageLeft = visibleLeft - imageLeft;
      const cropOnImageTop = visibleTop - imageTop;
      const cropOnImageRight = visibleRight - imageLeft;
      const cropOnImageBottom = visibleBottom - imageTop;

      const finalCropLeft = Math.max(0, cropOnImageLeft);
      const finalCropTop = Math.max(0, cropOnImageTop);
      const finalCropRight = Math.min(transformedImageWidth, cropOnImageRight);
      const finalCropBottom = Math.min(
        transformedImageHeight,
        cropOnImageBottom
      );

      const cropWidth = finalCropRight - finalCropLeft;
      const cropHeight = finalCropBottom - finalCropTop;

      const highResCropX = finalCropLeft / imageTransform.scale;
      const highResCropY = finalCropTop / imageTransform.scale;
      const highResCropWidth = cropWidth / imageTransform.scale;
      const highResCropHeight = cropHeight / imageTransform.scale;

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

      // Validate crop dimensions
      if (finalCropCoords.width <= 0 || finalCropCoords.height <= 0) {
        throw new Error(
          `Invalid crop dimensions: ${finalCropCoords.width}x${finalCropCoords.height}`
        );
      }

      // Perform the crop
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

  // Directional Controls Component
  const DirectionalControls = () => (
    <View style={styles.directionalControls}>
      <TouchableOpacity 
        style={styles.directionButton}
        onPress={() => moveImageSmooth('up')}
        disabled={isAnimating}
      >
        <Text style={styles.directionIcon}>↑</Text>
      </TouchableOpacity>
      
      <View style={styles.horizontalControls}>
        <TouchableOpacity 
          style={styles.directionButton}
          onPress={() => moveImageSmooth('left')}
          disabled={isAnimating}
        >
          <Text style={styles.directionIcon}>←</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.directionButton}
          onPress={() => moveImageSmooth('right')}
          disabled={isAnimating}
        >
          <Text style={styles.directionIcon}>→</Text>
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity 
        style={styles.directionButton}
        onPress={() => moveImageSmooth('down')}
        disabled={isAnimating}
      >
        <Text style={styles.directionIcon}>↓</Text>
      </TouchableOpacity>
    </View>
  );

  // Movement Mode Selector Component
  const MovementModeSelector = () => (
    <View style={styles.movementModeContainer}>
      {(['free', 'horizontal', 'vertical'] as const).map((mode) => (
        <TouchableOpacity
          key={mode}
          style={[
            styles.modeButton,
            movementMode === mode && styles.activeModeButton
          ]}
          onPress={() => setMovementMode(mode)}
        >
          <Text style={[
            styles.modeText,
            movementMode === mode && styles.activeModeText
          ]}>
            {mode === 'free' ? '🔄' : mode === 'horizontal' ? '↔️' : '↕️'}
          </Text>
          <Text style={[
            styles.modeLabel,
            movementMode === mode && styles.activeModeText
          ]}>
            {mode}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

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

          {/* Crop window with enhanced gesture handling */}
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
            {...enhancedPanResponder.panHandlers}
            onTouchEnd={handleDoubleTap}
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

          {/* Directional Controls */}
          <DirectionalControls />

          {/* Zoom indicator */}
          {isGesturing && (
            <View style={styles.zoomIndicator}>
              <Text style={styles.zoomText}>
                {Math.round(
                  ((imageTransform.scale - minScale) / (maxScale - minScale)) *
                    100
                )}
                %
              </Text>
            </View>
          )}
        </View>

        {/* Loading overlay */}
        {isLoading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.loadingText}>Cropping exact area...</Text>
          </View>
        )}

        {/* Movement Mode Selector */}
        <MovementModeSelector />

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

        {/* Instructions */}
        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsText}>
            • Double tap to zoom • Pinch to zoom • Drag to move • Use arrows for precise control
          </Text>
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
  // Enhanced directional controls
  directionalControls: {
    position: 'absolute',
    right: 20,
    top: '50%',
    marginTop: -80,
    zIndex: 10,
  },
  directionButton: {
    width: 50,
    height: 50,
    backgroundColor: 'rgba(0,0,0,0.8)',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 5,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  directionIcon: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  horizontalControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 120,
    marginVertical: 10,
  },
  // Movement mode selector
  movementModeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 10,
    backgroundColor: '#1a1a1a',
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  modeButton: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginHorizontal: 5,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  activeModeButton: {
    backgroundColor: '#007AFF',
  },
  modeText: {
    fontSize: 20,
    marginBottom: 2,
  },
  modeLabel: {
    color: '#fff',
    fontSize: 10,
    textTransform: 'capitalize',
  },
  activeModeText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  zoomIndicator: {
    position: "absolute",
    top: 120,
    right: 20,
    backgroundColor: "rgba(0,0,0,0.8)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  zoomText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
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
  instructionsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#000",
    borderTopWidth: 1,
    borderTopColor: "#333",
  },
  instructionsText: {
    color: "#888",
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
});

export default ManualCropModal;