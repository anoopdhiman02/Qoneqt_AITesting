import { View, Text } from "react-native";
import React, { PropsWithChildren } from "react";

import Realm from "realm";
import { RealmProvider } from "@realm/react";
import { isLogin } from "../localDB/models/isLogin";
import { DiscoverPostSchema } from "@/localDB/models/discover_feeds";
import { submit_kyc_data } from "@/localDB/models/submit_kyc_data";
import { user_data } from "@/localDB/models/user_data";
import { profile_detail } from "@/localDB/models/ProfileDetail";

const RealmCustomProvider = ({ children }: PropsWithChildren) => {
  return (
    <RealmProvider
      schema={[
        // profile_detail,
        isLogin,
        DiscoverPostSchema,
        submit_kyc_data,
        user_data,
      ]}
    >
      {children}
    </RealmProvider>
  );
};

export default RealmCustomProvider;
