import { View, Text } from 'react-native'
import React from 'react'
import { ImageBackground } from 'expo-image'
import { Dimensions } from 'react-native'
import { globalColors } from '@/assets/GlobalColors'
import { fontFamilies } from '@/assets/fonts'

interface LeaderBoardComponentProps {
    eventLeaderBoard: any;
}

const LeaderBoardComponent: React.FC<LeaderBoardComponentProps> = ({ eventLeaderBoard }) => {
    const { width, height } = Dimensions.get("window");
  return (
    <ImageBackground
                source={require("../../../../../../assets/image/LeaderBoardDesign.png")}
                style={{
                  width: width * 0.9,
                  height: height * 0.3,
                  alignItems: "center",
                  alignSelf: "center",
                  marginTop: 5,
                  borderRadius: 12,
                  padding: "4%",
                  borderWidth: 1,
                  borderColor: globalColors.slateBlueShade60,
                  overflow: "hidden", // Border radius ke liye zaroori hai
                }}
              >
                <View style={{ marginTop: "25%" }}>
                  <Text
                    style={{
                      fontSize: 24,
                      fontFamily: fontFamilies.bold,
                      color: globalColors.neutralWhite,
                      marginBottom: 5,
                      textAlign: "center",
                    }}
                  >
                    Leader Board
                  </Text>
                  <View
                    style={{
                      width: "100%",
                      borderBottomWidth: 1,
                      borderBottomColor: globalColors.slateBlueTint20,
                    }}
                  />
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      width: "100%",
                    }}
                  >
                    {/* Pet Balloon Ranking */}
                    <View style={{ alignItems: "center", flex: 1 }}>
                      <Text
                        style={{
                          fontSize: 18,
                          fontFamily: fontFamilies.bold,
                          color: globalColors.neutralWhite,
                          marginBottom: 8,
                        }}
                      >
                        Balloon Rank
                      </Text>
                      <View
                        style={{
                          width: "80%",
                          borderBottomWidth: 1,
                          borderBottomColor: globalColors.slateBlueTint20,
                          marginBottom: 10,
                        }}
                      />
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          width: "80%",
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 16,
                            fontFamily: fontFamilies.semiBold,
                            color: globalColors.neutralWhite,
                          }}
                        >
                          #{eventLeaderBoard?.data?.balloonRank}
                        </Text>
                        <Text
                          style={{
                            fontSize: 16,
                            fontFamily: fontFamilies.semiBold,
                            color: globalColors.neutralWhite,
                          }}
                        >
                          ({eventLeaderBoard?.data?.inBalloonCounts} Users)
                        </Text>
                      </View>
                    </View>
    
                    <View
                      style={{
                        width: 1,
                        backgroundColor: globalColors.slateBlueTint20,
                        marginHorizontal: 15,
                      }}
                    />
    
                    {/* User Ranking */}
                    <View style={{ alignItems: "center", flex: 1 }}>
                      <Text
                        style={{
                          fontSize: 18,
                          fontFamily: fontFamilies.bold,
                          color: globalColors.neutralWhite,
                          marginBottom: 8,
                        }}
                      >
                        Users Rank
                      </Text>
                      <View
                        style={{
                          width: "80%",
                          borderBottomWidth: 1,
                          borderBottomColor: globalColors.slateBlueTint20,
                          marginBottom: 10,
                        }}
                      />
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          width: "80%",
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 16,
                            fontFamily: fontFamilies.semiBold,
                            color: globalColors.neutralWhite,
                          }}
                        >
                          #{eventLeaderBoard?.data?.userRank}
                        </Text>
                        <Text
                          style={{
                            fontSize: 16,
                            fontFamily: fontFamilies.semiBold,
                            color: globalColors.neutralWhite,
                          }}
                        >
                          ({eventLeaderBoard?.data?.inUserCounts} Balloons)
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </ImageBackground>
  )
}

export default LeaderBoardComponent