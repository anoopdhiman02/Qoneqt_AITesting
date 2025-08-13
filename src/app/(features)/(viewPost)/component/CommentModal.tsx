import React, { useState } from "react";
import {
  Modal,
  View,
  TextInput,
  StyleSheet,
  Text,
  Button,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  Dimensions,
} from "react-native";
import CommentContainer from "./CommentContainer";
import usePostCommentsHook from "@/customHooks/PostCommentsHook";
import { usePostDetailStore } from "@/zustand/PostDetailStore";
import { useAppSelector } from "@/utils/Hooks";

const CommentModal = ({ visible, commentData }) => {
  const [modalVisible, setModalVisible] = useState(visible);
  const { height } = Dimensions.get("window");
  const fetchCommentsResponse = useAppSelector(
    (state) => state.fetchCommentsData
  );
  const { enterComment, onEnterCommenthandler, onAddCommentHandler } =
    usePostCommentsHook();

  const { postId } = usePostDetailStore();
  return (
    <View style={styles.container}>
      {/* Button to open modal */}
      {/* <Button title="Open Modal" onPress={() => setModalVisible(true)} /> */}

      {/* Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
          
        }}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.centeredView}>
            <View style={[styles.modalView, { height: height * 0.6 }]}>
              {/* Content of the modal */}
              <Text style={styles.modalText}>
                This is a modal with 60% height
              </Text>

              <CommentContainer
                postId={postId}
                commentData={fetchCommentsResponse?.data }
                commentLoading={false}
                enterComment={enterComment}
                onEnterComment={onEnterCommenthandler}
                addComment={onAddCommentHandler}
              />

              {/* KeyboardAvoidingView ensures TextInput is visible above the keyboard */}
              <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.keyboardAvoidView}
              >
                <TextInput
                  placeholder="Enter some text"
                  style={styles.textInput}
                />
              </KeyboardAvoidingView>

              {/* Button to close the modal */}
              <Button title="Close" onPress={() => setModalVisible(false)} />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // semi-transparent background
  },
  modalView: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    justifyContent: "space-between",
    alignItems: "center",
  },
  modalText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  keyboardAvoidView: {
    width: "100%",
    backgroundColor: "red",
    position: "absolute",
    bottom: 10,
  },
  textInput: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    width: "100%",
    marginBottom: 20,
  },
});

export default CommentModal;
