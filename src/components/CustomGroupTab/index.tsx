import { View, Text, TouchableOpacity, ViewStyle } from "react-native";
import React, { FC } from "react";
import styles from "./styles";

interface CustomGroupProps {
  container?: ViewStyle;
  subContainer?: ViewStyle;
  isSelected?: number;
  onPress?: (data?: any) => void;
}

const CustomGroupTab: FC<CustomGroupProps> = ({
  container,
  subContainer,
  isSelected,
  onPress,
}) => {
  return (
    <View style={{ ...styles.container, ...container }}>
      <TouchableOpacity
      // @ts-ignore
        style={{ ...styles.subContainer(isSelected==1), ...subContainer }}
        onPress={()=>{
          onPress(1)
        }}
      >
        <Text style={styles.text}>All Group</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
      // @ts-ignore
        style={{ ...styles.subContainer(isSelected==2) }}
        onPress={()=>onPress(2)}
      >
        <Text style={styles.text}>My Group</Text>
      </TouchableOpacity>
      <TouchableOpacity
      // @ts-ignore
        style={{ ...styles.subContainer(isSelected==3) }}
        onPress={()=>onPress(3)}
      >
        <Text style={styles.text}>Trending Group</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CustomGroupTab;
