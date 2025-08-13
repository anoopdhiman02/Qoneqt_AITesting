import React from "react";
import { View, StyleSheet } from "react-native";
import {createShimmerPlaceholder} from "react-native-shimmer-placeholder";
import { LinearGradient } from "expo-linear-gradient";
const ShimmerPlaceHolder = createShimmerPlaceholder(LinearGradient);
const HomeScreenShimmer = () => {

  return (
    <View style={styles.container}>
      {/* Profile Section */}
      <View style={styles.profileSection}>
        <ShimmerPlaceHolder style={styles.profileImage} />
        <View style={{ marginLeft: 10 }}>
          <ShimmerPlaceHolder style={styles.profileName} />
          <ShimmerPlaceHolder style={styles.profileInfo} />
        </View>
      </View>

      {/* Post Section */}
      <View style={styles.postContainer}>
        <ShimmerPlaceHolder style={styles.postTitle} />
        <ShimmerPlaceHolder style={styles.postImage} />
        <ShimmerPlaceHolder style={styles.postDescription} />
        <ShimmerPlaceHolder style={styles.postDescription} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  profileName: {
    width: 120,
    height: 20,
    marginBottom: 5,
  },
  profileInfo: {
    width: 100,
    height: 15,
  },
  postContainer: {
    marginTop: 10,
  },
  postTitle: {
    width: "80%",
    height: 20,
    marginBottom: 10,
  },
  postImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  postDescription: {
    width: "100%",
    height: 15,
    marginBottom: 5,
  },
});

export default HomeScreenShimmer;
