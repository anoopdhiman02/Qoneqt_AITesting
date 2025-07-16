import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder';
import { LinearGradient } from 'expo-linear-gradient';
const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

const RenderShimmerComponent = () => {
  return (
    <View style={styles.container}>
          <View style={styles.imageContainer}>
            <ShimmerPlaceholder
              style={styles.placeHolderView}
            />
          </View>
    
          <View
            style={styles.mainContainer}
          >
            <ShimmerPlaceholder
              style={styles.nameContainer}
            />
            <ShimmerPlaceholder
              style={styles.subContainer}
            />
          </View>
        </View>
  )
}

export default RenderShimmerComponent

const styles = StyleSheet.create({
    container: {
        padding: "2%",
        marginBottom: 4,
    },
    imageContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    mainContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: "4%",
        justifyContent: "space-between",
    },
    nameContainer: {
        width: "35%",
                height: 25,
                marginRight: "5%",
                borderRadius: 3,
    },
    placeHolderView: {
        width: "100%",
        height: 100,
        borderRadius: 3,
    },
    subContainer: {
        width: "60%",
        height: 25,
        marginRight: "7%",
        borderRadius: 3,
    },
})