
import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  Modal,
  Dimensions,
  StyleSheet,
  StatusBar,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { R2_PUBLIC_URL } from "@/utils/constants";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const MediaGallery = ({ supabaseGroupMedia, subgroup }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const openImageModal = (index) => {
    setSelectedImageIndex(index);
    setIsModalVisible(true);
  };

  const closeImageModal = () => {
    setIsModalVisible(false);
    setSelectedImageIndex(null);
  };

  const renderMediaItem = ({ item, index }) => {
    const itemWidth = (screenWidth - 45) / 3; // 3 columns with spacing
    const imageUri = R2_PUBLIC_URL + item.attachment;

    return (
      <TouchableOpacity
        style={[styles.mediaItem, { width: itemWidth, height: itemWidth }]}
        onPress={() => openImageModal(index)}
      >
        <Image
          source={{ uri: imageUri }}
          style={styles.mediaImage}
          resizeMode="cover"
        />
      </TouchableOpacity>
    );
  };

  const renderModalImage = ({ item }) => {
    const imageUri = R2_PUBLIC_URL + item.attachment;
    return (
      <View style={styles.modalImageContainer}>
        <Image
          source={{ uri: imageUri }}
          style={styles.modalImage}
          resizeMode="contain"
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={supabaseGroupMedia || []}
        keyExtractor={(item) => item._id.toString()}
        renderItem={renderMediaItem}
        numColumns={3}
        contentContainerStyle={styles.postsContainer}
        columnWrapperStyle={styles.row}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="images-outline" size={48} color="#8954F6" />
            <Text style={styles.emptyTitle}>No Media Yet</Text>
            <Text style={styles.emptyText}>
              Media shared in `{subgroup.name}` will appear here
            </Text>
          </View>
        }
      />

      {/* Modal for viewing images */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={closeImageModal}
      >
        <StatusBar hidden />
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={closeImageModal}
            >
              <Ionicons name="close" size={30} color="white" />
            </TouchableOpacity>
          </View>

          <FlatList
            data={supabaseGroupMedia || []}
            keyExtractor={(item) => item._id.toString()}
            renderItem={renderModalImage}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            initialScrollIndex={selectedImageIndex}
            getItemLayout={(data, index) => ({
              length: screenWidth,
              offset: screenWidth * index,
              index,
            })}
            onScrollToIndexFailed={() => {}}
          />

          <View style={styles.modalFooter}>
            <Text style={styles.imageCounter}>
              {selectedImageIndex !== null ? selectedImageIndex + 1 : 1} of{" "}
              {supabaseGroupMedia?.length || 0}
            </Text>
          </View>
        </SafeAreaView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  postsContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
    width: "100%",
  },
  row: {
    justifyContent: "center",
    flexWrap: "wrap",
    // marginBottom: 5,
  },
  mediaItem: {
    margin: 2,
    width: (screenWidth - 45) / 3, // 3 columns with spacing
    height: (screenWidth - 45) / 3, // Maintain square aspect ratio
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#f5f5f5",
  },
  mediaImage: {
    width: "100%",
    height: "100%",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "white",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "black",
  },
  modalHeader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 80,
    zIndex: 1,
    paddingTop: 30,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  closeButton: {
    padding: 10,
  },
  modalImageContainer: {
    width: screenWidth,
    height: screenHeight,
    justifyContent: "center",
    alignItems: "center",
  },
  modalImage: {
    width: screenWidth,
    height: screenHeight * 0.8,
  },
  modalFooter: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  imageCounter: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
});

export default MediaGallery;