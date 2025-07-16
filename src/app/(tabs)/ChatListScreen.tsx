import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  FlatList,
  Text,
  TouchableOpacity,
  View,
  Image,
  TextInput,
  StyleSheet,
} from "react-native";
import ViewWrapper from "../../components/ViewWrapper";
import TextInputComponent from "../../components/element/TextInputComponent";
import GoBackNavigation from "../../components/Header/GoBackNavigation";
import BottomSheetWrap from "../../components/bottomSheet/BottomSheetWrap";
import Button1 from "../../components/buttons/Button1";
import BottomSheet from "@gorhom/bottom-sheet";
import { router, useFocusEffect } from "expo-router";
import { ChatIcon, SearchIcon, VerifiedIcon } from "@/assets/DarkIcon";
import { fontFamilies } from "@/assets/fonts";
import { globalColors } from "@/assets/GlobalColors";
import StatusComponent from "@/app/(screens)/StatusCompnent";
import useUserChatListViewModel from "../(features)/(chat)/viewModel/UserChatListViewModel";
import { createShimmerPlaceholder } from "react-native-shimmer-placeholder";
import { LinearGradient } from "expo-linear-gradient";
import moment from "moment";
import { ImageFallBackUser } from "@/utils/ImageUrlConcat";
import { useScreenTracking } from "@/customHooks/useAnalytics";

//@ts-ignore
const UserProfile = React.memo(({ data = [], onPressChat }: { data?: any; onPressChat?: any }) => (
  <View style={styles.chatContent}>
    {data.map((item: any, index: any) => (
      <TouchableOpacity
        key={index}
        onPress={() => onPressChat(item?.user?.id)}
        activeOpacity={0.8}
      >
        <View style={styles.chatItemContainer}>
          {/* User Profile Image & Name */}
          <View style={styles.nameRow}>
            <ImageFallBackUser
              imageData={item?.user?.profileImg || item?.user?.profile_pic}
              fullName={item?.user?.name || item?.user?.full_name}
              widths={50}
              heights={50}
              borders={25}
            />
            <View style={styles.nameContent}>
              <View style={styles.nameRows}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={styles.name}
                >
                  {item?.user?.name || item?.user?.full_name}
                </Text>
                {item.user?.kyc_status == 1 && <VerifiedIcon />}
              </View>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={styles.message}
>
                {item.last_msg}
              </Text>
            </View>
          </View>

          {/* Time & Unread Message Info */}
          <View style={styles.rightSection}>
            <Text style={styles.time}>{moment
                .utc(item?.created_at)
                .utcOffset("+05:30")
                .format("h:mm A")}</Text>
            <View style={styles.unreadContainer}>
              {item?.unread_count > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {item?.unread_count < 10
                      ? item?.unread_count
                      : `+${item?.unread_count - (item?.unread_count % 5)}`}
                  </Text>
                </View>
              )}
              {item.seen !== 0 && (
                <Image
                  style={styles.seenIcon}
                  source={require("@/assets/image/checks.png")}
                />
              )}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    ))}
  </View>
));

const UserProfileChat = React.memo(
  //@ts-ignore
  ({ data = [], onPressChat, selectedUser }: { data?: any; onPressChat?: any; selectedUser?: any }) => (
    <FlatList
      style={{ marginTop: 10 }}
      data={data}
      keyExtractor={(item) => item?.id.toString()}
      getItemLayout={(data, index) => ({
        length: 80, // Approximate row height
        offset: 80 * index,
        index,
      })}
      renderItem={({ item, index }) => (
        <TouchableOpacity key={item.id} onPress={() => onPressChat(item.id)}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              padding: 10,
              borderRadius: 10,
              backgroundColor:
                selectedUser === item.id
                  ? globalColors.neutral3
                  : "transparent",
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <ImageFallBackUser
                imageData={item.profile_pic}
                fullName={item.full_name.trim()}
                widths={40}
                heights={40}
                borders={20}
              />
              <View style={{ marginLeft: 10 }}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontFamily: fontFamilies.semiBold,
                      color: globalColors.neutralWhite,
                      marginRight: 5,
                    }}
                  >
                    {item.full_name}
                  </Text>
                  {item.kyc_status == 1 && <VerifiedIcon />}
                </View>
              </View>
            </View>
            <Image
              style={{ width: 20, height: 20 }}
              source={
                selectedUser === item.id
                  ? require("@/assets/image/checkcircle.png")
                  : require("@/assets/image/radio-botton1.png")
              }
            />
          </View>
        </TouchableOpacity>
      )}
    />
  )
);

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

const renderShimmer = () => (
  <View
    style={{
      width: "100%",
      marginBottom: "10%",
      marginTop: "3%",
      alignItems: "center",
    }}
  >
    <ShimmerPlaceholder
      style={{
        width: "95%",
        height: 50,
        borderRadius: 5,
      }}
    />
  </View>
);

const ChatListScreen = () => {
  useScreenTracking("ChatListScreen");
  const [isLoading, setIsLoading] = useState(false);
  const {
    onFectMessageRedisHandler,
    onFectMessageListHandler,
    messagesList,
    onFetchUserListHandler,
    userList,
    userLoading,
    messagesRedisList,
  } = useUserChatListViewModel();

  const StartChatRef = useRef<BottomSheet>(null);

  const [searchMain, setSearchMain] = useState("");
  const [search, setSearch] = useState("");
  const [isSearchDisabled, setIsSearchDisabled] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const filteredUserList = useMemo(
    () =>
      userList.filter((user) =>
        user?.full_name.toLowerCase().includes(search.toLowerCase())
      ),
    [search, userList]
  );

  const filteredMessageList = useMemo(
    () =>
      (messagesList?.length > 0 ? messagesList : messagesRedisList).filter(
        (message) =>
          (message.user.name || message.user.full_name).toLowerCase().includes(searchMain.toLowerCase())
      ),
    [searchMain, messagesList, messagesRedisList]
  );

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await userList.filter((user) =>
        user.full_name.toLowerCase().includes(search.toLowerCase())
      );
      setIsLoading(false);
    };
    fetchData();
  }, []);

  useFocusEffect(
    useCallback(() => {
      onFectMessageRedisHandler();
      setTimeout(() => {
        onFectMessageListHandler();
      }, 2000);
    }, [])
  );

  const onPressNewChat = () => {
    onFetchUserListHandler();
    StartChatRef.current.expand();
  };

  const onPressViewChat = (id: number) => {
    StartChatRef.current.close();
    router.push({
      pathname: "/UserChatScreen",
      params: { id: id, from: 1, isNotification: "false" },
    });
  };

  const onPressChat = useCallback(() => {
    if (selectedUser) {
      StartChatRef.current.close();
      router.push({
        pathname: "/UserChatScreen",
        params: { id: selectedUser, from: 1, isNotification: "false" },
      });
      setSelectedUser(null);
    }
  }, [selectedUser]);

  const onPressUser = (id: number) => {
    setSelectedUser(id);
    setIsSearchDisabled(true);
  };

  const renderProfileItem = ({ item }: { item?: any }) => {
    return (
      <>
        <UserProfile data={[item]} onPressChat={onPressViewChat} />
      </>
    );
  };

  const ListEmptyComponent = () => {
    if (isLoading) {
      return (
        <FlatList
          data={[...Array(6)]}
          renderItem={() => renderShimmer()}
          keyExtractor={(_, index) => `shimmer-${index}`}
        />
      );
    } else {
      return (
        <StatusComponent
          subtitle="You have no messages yet!"
          imageSource={require("@/assets/image/welcomeImage.png")}
          title="You have no messages yet!"
          // buttonLabel="Start a chat"
          onButtonPress={() => console.log("test")}
          showButton={false}
        />
      );
    }
  };

  return (
    <ViewWrapper>
      <GoBackNavigation header="Chat" isDeepLink={true} />
      <View style={styles.container}>
        <View style={styles.searchBox}>
          <SearchIcon style={{ marginRight: 10 }} />
          <TextInput
            placeholder="Search"
            value={searchMain}
            onChangeText={setSearchMain}
            placeholderTextColor={globalColors.neutral7}
            style={styles.searchInput}
          />
        </View>

        <FlatList
          data={filteredMessageList}
          keyExtractor={(item) => item?.id.toString()}
          renderItem={renderProfileItem}
          ListEmptyComponent={ListEmptyComponent}
          keyboardShouldPersistTaps="handled"
        />

        <TouchableOpacity
          onPress={onPressNewChat}
          style={styles.chatIconContainer}
        >
          <ChatIcon />
        </TouchableOpacity>
      </View>

      <BottomSheetWrap bottomSheetRef={StartChatRef}>
        <View style={{ height: "88%" }}>
          <Text
            style={{
              color: globalColors.neutralWhite,
              fontSize: 22,
              fontFamily: fontFamilies.semiBold,
            }}
          >
            Select person to chat
          </Text>
          <TextInputComponent
            placeHolder="Search"
            value={search}
            onChangeText={setSearch}
            containerHeight={50}
            disabled={isSearchDisabled}
          />
          <FlatList
            data={filteredUserList}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <UserProfileChat
                data={[item]}
                onPressChat={onPressUser}
                selectedUser={selectedUser}
              />
            )}
            style={{ marginVertical: 15 }}
            keyboardShouldPersistTaps="handled"
          />
        </View>
        <View style={{ marginTop: "auto", marginBottom: "auto" }}>
          <Button1
            isLoading={false}
            title="Start chat"
            onPress={selectedUser ? onPressChat : null}
          />
        </View>
      </BottomSheetWrap>
    </ViewWrapper>
  );
};

export default ChatListScreen;

const styles = StyleSheet.create({
  container: { width: "90%", height: "90%" },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginTop: "5%",
    borderColor: globalColors.neutral2,
    borderWidth: 1,
    borderStyle: "solid",
  },
  searchInput: {
    fontSize: 14,
    fontFamily: fontFamilies.regular,
    color: globalColors.neutralWhite,
    width: "85%",
  },
  chatIconContainer: {
    position: "absolute",
    bottom: 10,
    right: 10,
    height: 50,
    width: 50,
    borderRadius: 30,
    backgroundColor: globalColors.warmPink,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
  },
  chatItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: globalColors.neutral2,
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
  },
  chatContent: { flex: 1, marginTop: "1%" },
  chatItemContainer: { flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: globalColors.neutral2,
    borderRadius: 15,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  nameRow: { flexDirection: "row", alignItems: "center", flex: 1 },
  nameContent: {marginLeft: 15, flex: 1},
  nameRows: { flexDirection: "row", alignItems: "center" },
  name: {
    fontSize: 16,
    fontFamily: fontFamilies.semiBold,
    color: globalColors.neutralWhite,
    marginRight: 5,
  },
  message: {
    fontSize: 14,
    color: globalColors.neutralWhite,
    opacity: 0.7,
    marginTop: 2,
  },
  rightSection: { alignItems: "flex-end" },
  time: { fontSize: 12, color: globalColors.neutralWhite, opacity: 0.7 },
  unreadContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  badge: {
    backgroundColor: globalColors.warmPink,
    borderRadius: 7,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginTop: 5,
  },
  badgeText: {
    fontSize: 12,
    color: globalColors.neutralWhite,
    fontFamily: fontFamilies.semiBold,
  },
  seenIcon: {
    width: 16, height: 16, marginLeft: 5
  },
  userItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 10,
  },
  selected: { backgroundColor: globalColors.neutral3 },
  fab: {
    position: "absolute",
    bottom: 10,
    right: 10,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: globalColors.warmPink,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  title: {
    fontSize: 22,
    fontFamily: fontFamilies.semiBold,
    color: globalColors.neutralWhite,
    marginBottom: 15,
  },
});
