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
import { NotificationIcon } from "@/assets/DarkIcon";

export const icons = {
  Home: <Home height={30} width={30} />,
  Search: <Search height={30} width={30} />,
  "Group": <Chat height={30} width={30} />,
  Notification: <NotificationIcon height={30} width={30} />,
  Chats: <ChatTabIcon height={30} width={30} />,

};
