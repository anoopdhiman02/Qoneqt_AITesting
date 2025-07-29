// import React from "react";
// import Home from "../../../assets/svg/Home.svg";
// import Search from "../../../assets/svg/Search.svg";
// import Chat from "../../../assets/svg/Chat.svg";
// import More from "../../../assets/svg/More.svg";
// // Ensure you import necessary icons

// export const icons = {
//   Home: <Home />,
//   Search: <Search />,
//   SubGroup: <Chat />,
//   More: <More />,
// };

import React from "react";
import Home from "../../../assets/svg/Home.svg";
import Search from "../../../assets/svg/Search.svg";
import Chat from "../../../assets/svg/Chat.svg";
import { ChatTabIcon } from "@/assets/DarkIcon";
import { AddIcon } from "@/assets/DarkIcon";
import { Ionicons, Feather, MaterialCommunityIcons } from "@expo/vector-icons";

// export const icons = {
//   Home: <Ionicons name="home" size={20} color="white" />,
//   Search: <Ionicons name="search" size={20} color="#8e8e93" />,
//   "Group": <Ionicons name="people" size={20} color="#8e8e93" />,
//   Chats: <Ionicons name="chatbubble-ellipses" size={20} color="#8e8e93" />,
//   CreateUI: <Ionicons name="add" size={35} color="white" />,
  

// };


// Define colors for consistency
const ACTIVE_COLOR = "#FFFFFF";
const INACTIVE_COLOR = "#8e8e93";
const ICON_SIZE = 22;
const CREATE_ICON_SIZE = 35;

export const icons = {
  // Home Tab Icons
  Home: <Ionicons name="home" size={ICON_SIZE} color={INACTIVE_COLOR} />,
  HomeActive: <Ionicons name="home" size={ICON_SIZE} color={ACTIVE_COLOR} />,

  // Search Tab Icons
  Search: <Ionicons name="search" size={ICON_SIZE} color={INACTIVE_COLOR} />,
  SearchActive: <Ionicons name="search" size={ICON_SIZE} color={ACTIVE_COLOR} />,

  // Group Tab Icons (AllGroupListScreen)
  "Sub-Group": <Ionicons name="people-outline" size={ICON_SIZE} color={INACTIVE_COLOR} />,
  "Sub-GroupActive": <Ionicons name="people" size={ICON_SIZE} color={ACTIVE_COLOR} />,

  // Alternative group icons if you prefer different style
  Group: <Ionicons name="people" size={ICON_SIZE} color={INACTIVE_COLOR} />,
  GroupActive: <Ionicons name="people" size={ICON_SIZE} color={ACTIVE_COLOR} />,

  // Chat Tab Icons
  Chats: <Ionicons name="chatbubble-ellipses" size={ICON_SIZE} color={INACTIVE_COLOR} />,
  ChatsActive: <Ionicons name="chatbubble-ellipses" size={ICON_SIZE} color={ACTIVE_COLOR} />,

  // Create UI (Center button - stays the same)
  CreateUI: <Ionicons name="add" size={CREATE_ICON_SIZE} color="white" />,
};