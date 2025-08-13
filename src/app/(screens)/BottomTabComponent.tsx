import * as React from "react";
import {
  Platform,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import TabBarButton from "../../components/atom/BottomTab/TabBarBotton";
import { router } from "expo-router";
import { globalColors } from "@/assets/GlobalColors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";

const circleRadius = 40;
const tabHeight = 60;
const width = Dimensions.get("window").width;

const BottomTabComponent = ({
  state,
  descriptors,
  navigation,
  keyboardVisible,
  isComment,
  isConnected,
  recheckNetwork,
}) => {
  const insets = useSafeAreaInsets();

  // Direct navigation to post creation
  const onPressCreate = () => {
    router.push("/CreatePostScreen");
  };

  if (isComment) {
    return null;
  }

  return (
    <View style={{backgroundColor:globalColors.neutral2}}>
      {!isConnected && (
        <View
          style={{
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: "#1b192C",
            padding: "2%",
            flexDirection: "row",
            width: "100%",
            marginBottom: 5,
          }}
        >
          <Text style={{ color: globalColors.neutralWhite }}>
            No internet connection
          </Text>
          <TouchableOpacity onPress={recheckNetwork}>
            <Text style={{ color: globalColors.neutralWhite }}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      <View
        style={{
          ...styles.wrapper,
          marginBottom: Platform.OS === "ios" ? 0 : insets.bottom,
        }}
      >
        <View style={styles.tabContainer}>
          {state.routes.map((route, index) => {
            const { options } = descriptors[route.key];
            const label = options?.tabBarLabel ?? options?.title ?? route?.name;

            const isFocused = state.index === index;

            const onPress = () => {
              const event = navigation.emit({
                type: "tabPress",
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name, route.params);
              }
            };

            const onLongPress = () => {
              navigation.emit({
                type: "tabLongPress",
                target: route.key,
              });
            };

            if (index === 2)
              return (
                <View key={route.key} style={{ width: circleRadius * 2 }} />
              );
            return (
              <TabBarButton
                key={route.name}
                onPress={onPress}
                onLongPress={onLongPress}
                isFocused={isFocused}
                routeName={route.name}
                color={
                  isFocused ? globalColors.neutralWhite : globalColors.neutral8
                }
                label={label}
                index={index}
                labelActive={label + "Active"}
              />
            );
          })}
        </View>

        <TouchableOpacity style={styles.fab} onPress={onPressCreate}>
          <View style={styles.fabBackground}>
            <Ionicons name={"add"} size={32} color="white" />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default BottomTabComponent;

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    flexDirection: "row",
    zIndex: 99,
    backgroundColor: globalColors.neutral2,
    justifyContent: "center",
    paddingBottom: 8,
    padding: "2%",
    paddingVertical: "4%",
    alignItems: "center",
    marginHorizontal: 5,
    alignSelf: "center",
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width,
    height: tabHeight,
    alignItems: "center",
    paddingHorizontal: 8,
  },
  fab: {
    position: "absolute",
    bottom: tabHeight / 3,
    width: circleRadius * 1.2,
    height: circleRadius * 1.2,
    borderRadius: circleRadius,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 20,
  },
  fabBackground: {
    width: "100%",
    height: "100%",
    borderRadius: circleRadius,
    backgroundColor: globalColors.slateBlueTint20,
    alignItems: "center",
    justifyContent: "center",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
});
