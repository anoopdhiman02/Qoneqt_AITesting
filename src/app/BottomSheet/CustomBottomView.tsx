import { LinearGradient } from 'expo-linear-gradient';
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  Animated,
  PanResponder,
  Dimensions,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
  StyleSheet,
  PanResponderInstance,
} from 'react-native';

const { height: screenHeight, width } = Dimensions.get('window');

const CustomBottomView= ({ 
  visible, 
  onClose, 
  title = "Bottom Sheet",
  children,
  maxHeight = screenHeight * 0.9,
  minHeight = 200,
  snapPoints = [0.3, 0.6, 0.9] // Percentage of screen height
}) => {
  const translateY: any = useRef(new Animated.Value(screenHeight)).current;
  const [sheetHeight, setSheetHeight] = useState(screenHeight * snapPoints[0]);
  const lastGestureDy: any = useRef(0);
  const panResponder: any= useRef<PanResponderInstance | null>(null);

  useEffect(() => {
    if (visible) {
      openBottomSheet();
    } else {
      closeBottomSheet();
    }
  }, [visible]);

  const openBottomSheet = () => {
    Animated.spring(translateY, {
      toValue: screenHeight - sheetHeight,
      damping: 20,
      stiffness: 90,
      useNativeDriver: true,
    }).start();
  };

  const closeBottomSheet = () => {
    Animated.timing(translateY, {
      toValue: screenHeight,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      onClose();
    });
  };

  const snapToClosest = (gestureState) => {
    const { dy, vy } = gestureState;
    const currentPosition = screenHeight - sheetHeight + dy;
    
    // Calculate snap positions
    const snapPositions = snapPoints.map(point => screenHeight - (screenHeight * point));
    
    // Add close position
    snapPositions.push(screenHeight);
    
    // Find closest snap point
    let closestSnapPoint = snapPositions[0];
    let minDistance = Math.abs(currentPosition - snapPositions[0]);
    
    snapPositions.forEach(point => {
      const distance = Math.abs(currentPosition - point);
      if (distance < minDistance) {
        minDistance = distance;
        closestSnapPoint = point;
      }
    });
    
    // Consider velocity for better UX
    if (Math.abs(vy) > 0.5) {
      if (vy > 0 && closestSnapPoint < screenHeight) {
        // Moving down with velocity, go to next lower position
        const currentIndex = snapPositions.indexOf(closestSnapPoint);
        if (currentIndex < snapPositions.length - 1) {
          closestSnapPoint = snapPositions[currentIndex + 1];
        }
      } else if (vy < 0 && closestSnapPoint > snapPositions[0]) {
        // Moving up with velocity, go to next higher position
        const currentIndex = snapPositions.indexOf(closestSnapPoint);
        if (currentIndex > 0) {
          closestSnapPoint = snapPositions[currentIndex - 1];
        }
      }
    }
    
    // Close if snapped to bottom
    if (closestSnapPoint >= screenHeight) {
      closeBottomSheet();
      return;
    }
    
    // Update sheet height based on snap point
    const newHeight = screenHeight - closestSnapPoint;
    setSheetHeight(newHeight);
    
    Animated.spring(translateY, {
      toValue: closestSnapPoint,
      damping: 20,
      stiffness: 90,
      useNativeDriver: true,
    }).start();
  };

  panResponder.current = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: (evt, gestureState) => {
      return Math.abs(gestureState.dy) > 10;
    },
    onPanResponderGrant: () => {
      translateY.setOffset(translateY._value);
      translateY.setValue(0);
    },
    onPanResponderMove: (evt, gestureState) => {
      lastGestureDy.current = gestureState.dy;
      
      // Only allow dragging down from the top, or up/down from middle positions
      if (gestureState.dy > 0 || sheetHeight < maxHeight) {
        translateY.setValue(Math.max(gestureState.dy, -(maxHeight - sheetHeight)));
      }
    },
    onPanResponderRelease: (evt, gestureState) => {
      translateY.flattenOffset();
      snapToClosest(gestureState);
    },
  });

  const handleOverlayPress = () => {
    closeBottomSheet();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <TouchableWithoutFeedback onPress={handleOverlayPress}>
          <View style={styles.background} />
        </TouchableWithoutFeedback>
        
        <Animated.View
          style={[
            styles.bottomSheet,
            {
              height: maxHeight,
              transform: [{ translateY }],
            },
          ]}
          {...panResponder.current?.panHandlers||{}}
        >
        <LinearGradient
        colors={["#2B0A6E", "#07072B", "#000000"]}
        style={{ flex: 1, height: "100%" }}
        >
          {/* Drag Handle */}
          <View style={styles.dragHandleContainer}>
             <View style={styles.dragHandle} />
          </View>
          
          {/* Content */}
         <View style={styles.content}>
            {children}
         </View>
         </LinearGradient>
        </Animated.View>
      </View>
    </Modal>
  );
};



const styles = StyleSheet.create({
  // Demo container styles
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#667eea',
    padding: 20,
  },
  demoTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
    textAlign: 'center',
  },
  demoSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 30,
    textAlign: 'center',
  },
  openButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  openButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },

  // Bottom sheet styles
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  background: {
    flex: 1,
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#2B0A6E",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -5,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
    overflow: "hidden",

  },
  dragHandle: {
    width: width * 0.3,
    height: 4,
    backgroundColor: '#ddd',
    borderRadius: 2,
    alignSelf: 'center',
marginVertical: "2%",
  },
  dragHandleContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 0.5,
    borderBottomColor: '#eee',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  closeButton: {
    padding: 4,
    borderRadius: 12,
  },
  closeButtonText: {
    fontSize: 18,
    color: '#666',
  },
  content: {
    flex: 1,
    // paddingHorizontal: 24,
    width: "100%",
  },

  // Menu item styles
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  dangerItem: {
    borderBottomColor: '#ffebee',
  },
  menuIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  dangerIcon: {
    backgroundColor: '#ffebee',
  },
  menuIconText: {
    fontSize: 18,
  },
  menuText: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 2,
  },
  dangerText: {
    color: '#d32f2f',
  },
  menuSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  extraContent: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  extraTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
});

export default CustomBottomView;