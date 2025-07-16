import React, { useRef, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  PanResponder,
  Alert,
  Dimensions,
} from 'react-native';
import { DeleteIcon } from '@/assets/DarkIcon';
import { globalColors } from '@/assets/GlobalColors';
import { fontFamilies } from '@/assets/fonts';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const SwipeableNotificationItem = ({ 
  children, 
  onDelete, 
  itemId, 
  disabled = false 
}) => {
  const translateX = useRef(new Animated.Value(0)).current;
  const lastOffset = useRef(0);
  const SWIPE_THRESHOLD = -80;
  const DELETE_THRESHOLD = -120;

  const resetPosition = useCallback(() => {
    Animated.spring(translateX, {
      toValue: 0,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    }).start(() => {
      lastOffset.current = 0;
    });
  }, [translateX]);

  const handleDelete = useCallback(() => {
    Alert.alert(
      'Delete Notification',
      'Are you sure you want to delete this notification?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: resetPosition,
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            Animated.timing(translateX, {
              toValue: -SCREEN_WIDTH,
              duration: 300,
              useNativeDriver: true,
            }).start(() => {
            resetPosition();
              onDelete(itemId);
              
            });
          },
        },
      ]
    );
  }, [resetPosition, translateX, onDelete, itemId]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !disabled,
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        if (disabled) return false;
        
        // Only respond to horizontal swipes that are significant
        const isHorizontalSwipe = Math.abs(gestureState.dx) > Math.abs(gestureState.dy);
        const isSignificantMove = Math.abs(gestureState.dx) > 10;
        
        return isHorizontalSwipe && isSignificantMove;
      },
      onPanResponderGrant: () => {
        translateX.setOffset(lastOffset.current);
        translateX.setValue(0);
      },
      onPanResponderMove: (evt, gestureState) => {
        // Only allow left swipe (negative values)
        if (gestureState.dx <= 0) {
          translateX.setValue(gestureState.dx);
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        translateX.flattenOffset();
        
        const finalPosition = lastOffset.current + gestureState.dx;
        const shouldDelete = finalPosition < DELETE_THRESHOLD;
        const shouldShowDelete = finalPosition < SWIPE_THRESHOLD;

        if (shouldDelete) {
          handleDelete();
        } else if (shouldShowDelete) {
          Animated.spring(translateX, {
            toValue: SWIPE_THRESHOLD,
            useNativeDriver: true,
            tension: 100,
            friction: 8,
          }).start(() => {
            lastOffset.current = SWIPE_THRESHOLD;
          });
        } else {
          resetPosition();
        }
      },
      onPanResponderTerminate: () => {
        translateX.flattenOffset();
        resetPosition();
      },
    })
  ).current;

  return (
    <View style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Delete Button Background */}
      <View
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
          bottom: 0,
          width: 80,
          backgroundColor: '#FF4444',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1,
        }}
      >
        <TouchableOpacity
          onPress={handleDelete}
          style={{
            width: '100%',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <DeleteIcon width={24} height={24} color={globalColors.neutralWhite} />
          <Text
            style={{
              color: globalColors.neutralWhite,
              fontSize: 12,
              fontFamily: fontFamilies.medium || fontFamilies.regular,
              marginTop: 4,
            }}
          >
            Delete
          </Text>
        </TouchableOpacity>
      </View>

      {/* Swipeable Content */}
      <Animated.View
        {...panResponder.panHandlers}
        style={{
          transform: [{ translateX }],
          backgroundColor: '#000',
          zIndex: 2,
        }}
      >
        {children}
      </Animated.View>
    </View>
  );
};

export default SwipeableNotificationItem;