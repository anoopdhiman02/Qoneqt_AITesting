import { View, Text, TouchableWithoutFeedback, TouchableOpacity } from 'react-native'
import React from 'react'
import { globalColors } from '@/assets/GlobalColors';
import { Image } from 'expo-image';

interface AddModalViewComponentProps {
    onPressGallary: (type: string) => void;
    hasPermission: boolean;
    setIsAddModalVisible: (value: boolean) => void;
    handleGalleryPress: (type: string) => void;
    Document_Picker: () => void;
}

const AddModalViewComponent: React.FC<AddModalViewComponentProps> = ({
    onPressGallary,
    hasPermission,
    setIsAddModalVisible,
    handleGalleryPress,
    Document_Picker,
}) => {
  return (
    <TouchableWithoutFeedback
                    onPress={() => setIsAddModalVisible(false)}
                  >
                    <View
                      style={{
                        flex: 1,
                        backgroundColor: "rgba(0,0,0,0.5)",
                        justifyContent: "flex-end",
                      }}
                    >
                      <TouchableWithoutFeedback>
                        <View
                          style={{
                            backgroundColor: "#1C1C1E",
                            borderTopLeftRadius: 40,
                            borderTopRightRadius: 40,
                            minHeight: 150,
                            flexDirection: "row",
                            justifyContent: "space-around",
                            alignItems: "center",
                            paddingHorizontal: 30,
                          }}
                        >
                          <View
                            style={{
                              width: 80,
                              height: 80,
                              borderRadius: 45,
                              backgroundColor: globalColors.bgDark2,
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <TouchableOpacity
                              onPress={() => {
                                hasPermission
                                  ? onPressGallary("1")
                                  : handleGalleryPress("1");
                                setIsAddModalVisible(false);
                              }}
                            >
                              <Image
                                style={{ width: 30, height: 30 }}
                                source={require("../../../../../assets/image/video-camera.png")}
                              />
                            </TouchableOpacity>
                          </View>
    
                          <View
                            style={{
                              width: 80,
                              height: 80,
                              borderRadius: 45,
                              backgroundColor: globalColors.bgDark2,
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <TouchableOpacity
                              onPress={() => {
                                hasPermission
                                  ? onPressGallary("2")
                                  : handleGalleryPress("2");
                                setIsAddModalVisible(false);
                              }}
                            >
                              <Image
                                style={{ width: 30, height: 30 }}
                                source={require("../../../../../assets/image/gallery.png")}
                              />
                            </TouchableOpacity>
                          </View>
    
                          <View
                            style={{
                              width: 80,
                              height: 80,
                              borderRadius: 45,
                              backgroundColor: globalColors.bgDark2,
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <TouchableOpacity
                              onPress={() => {
                                Document_Picker();
                                setIsAddModalVisible(false);
                              }}
                            >
                              <Image
                                style={{ width: 30, height: 30 }}
                                source={require("../../../../../assets/image/musicalnote.png")}
                              />
                            </TouchableOpacity>
                          </View>
                        </View>
                      </TouchableWithoutFeedback>
                    </View>
                  </TouchableWithoutFeedback>
  )
}

export default AddModalViewComponent