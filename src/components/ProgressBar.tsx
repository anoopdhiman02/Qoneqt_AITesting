import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Text, Animated, TouchableOpacity } from 'react-native';
import { globalColors } from '@/assets/GlobalColors';
import { ReUploadIcon } from '@/assets/DarkIcon';

const ProgressBar = ({
  progress = 0, // 0 to 100
  height = 4,
  backgroundColor = '#ddd',
  fillColor = '#4caf50',
  isFailed = false,
  uploadPostAgain,
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const [dots, setDots] = useState('')
  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: progress,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [progress]);
  useEffect(() => {
    let dotCount = 0;
    const interval = setInterval(() => {
      dotCount = (dotCount + 1) % 4;
      setDots('.'.repeat(dotCount));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const widthInterpolated = animatedValue.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={{ width: '100%', paddingHorizontal: 20, paddingVertical: 10 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 5 }}>
      <Text
        style={{
          color: isFailed ? 'red' : globalColors?.neutralWhite ?? '#fff',
          fontSize: 18,
          fontWeight: '600',
          marginBottom: 5,
        }}
      >
        {`Uploading${isFailed ? ' Failed' : dots}`}
      </Text>
      {isFailed && (
          <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }} onPress={uploadPostAgain}>
            <Text style={{ color: globalColors?.neutralWhite ?? '#fff', fontSize: 18, fontWeight: '600', marginBottom: 5 }}>Retry</Text>
            <ReUploadIcon width={24} height={24} />
          </TouchableOpacity>
        )}
      </View>

      <View style={[styles.container, { height, backgroundColor }]}>
        <Animated.View
          style={[
            styles.fill,
            { height: '100%', backgroundColor: isFailed ? 'red' : fillColor, width: widthInterpolated },
          ]}
        />
        
      </View>
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#ddd',
  },
  fill: {
    borderRadius: 10,
  },
});

export default ProgressBar;
