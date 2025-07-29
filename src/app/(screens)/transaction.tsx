import React, { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ViewWrapper from "../../components/ViewWrapper";
import GoBackNavigation from "../../components/Header/GoBackNavigation";
import { ArrowUpIcon, CopyIcon } from "@/assets/DarkIcon";
import { fontFamilies } from "@/assets/fonts";
import { globalColors } from "@/assets/GlobalColors";
import useHistoryViewModel from "@/structure/viewModels/transaction/HistoryViewModel";
import moment from "moment";
import { useAppStore } from "@/zustand/zustandStore";
import { rupee } from "@/utils/Helpers";
import { showToast } from "@/components/atom/ToastMessageComponent";
import { setPrefsValue } from "@/utils/storage";
import Clipboard from "@react-native-clipboard/clipboard";
import { shallowEqual, useSelector } from "react-redux";



const HeaderTab = () => {
  return (
    <TouchableOpacity
      style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 12,
        marginBottom: 20,
        alignSelf: "flex-start",
      }}
    >
      <Text
        style={{
          fontSize: 14,
          fontFamily: fontFamilies.semiBold,
          color: globalColors.neutralWhite,
          marginRight: 8,
        }}
      >
        All groups
      </Text>
      <ArrowUpIcon />
    </TouchableOpacity>
  );
};

const TransactionScreen = () => {
  const { userId } = useAppStore();
  const { onfetchTransactionHistory, loading, historyData } =
    useHistoryViewModel();
const [dots, setDots] = useState('')
    const transactionData: any = useSelector(
        (state: any) => state.transactionHistortData, shallowEqual
      );

  useEffect(() => {
    onfetchTransactionHistory();
    return () => {
      setPrefsValue("notificationInfo", "");
    };
  }, []);

  const TransactionComponent = useCallback(({ data, userId }) => {
    const isSuccess = data?.payment_type;
    const textColor =
      isSuccess === "credited" ? globalColors.success : globalColors.warning;
    const sign = isSuccess === "credited" ? "+" : "-";
    const copyToClipboard = (transId) => {
      if (transId) {
        Clipboard.setString(transId);

        showToast({ type: "success", text1: "Transaction ID copied!" });
      }
    };
  
    return (
      <View
        style={{
          backgroundColor: globalColors.neutral2,
          borderRadius: 12,
          padding: "6%",
          marginBottom: 12,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          top: 5,
        }}
      >
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text
              style={{
                fontSize: 14,
                fontFamily: fontFamilies.semiBold,
                color: globalColors.neutralWhite,
                marginBottom: 4,
              }}
            >
              Transaction :- {data?.transaction_id}
            </Text>
            {/* <TouchableOpacity
              onPress={() => copyToClipboard(data?.transaction_id)}
              style={{ marginLeft: 6 }}
            >
              <CopyIcon style={{ marginTop: 3 }} />
            </TouchableOpacity> */}
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <Text
            style={{
              fontSize: 12,
              fontFamily: fontFamilies.regular,
              color: globalColors.neutral8,
            }}
          >
            {moment
              .utc(data?.created_at)
              .utcOffset("+05:30")
              .format("D MMM YY | h:mm a")}
          </Text>
          
          </View>
          
        </View>
        <Text
          style={{
            fontSize: 16,
            fontFamily: fontFamilies.semiBold,
            color: textColor,
          }}
        >
        {`${sign} ${data.transaction_amount}`}
        </Text>
        
      </View>
    );
  },[transactionData.updateData]);

  useEffect(() => {
      let dotCount = 0;
      const interval = setInterval(() => {
        dotCount = (dotCount + 1) % 4;
        setDots('.'.repeat(dotCount));
      }, 500);
  
      return () => clearInterval(interval);
    }, []);

  const ListEmptyComponent = () =>{
    return(<Text
      style={{
        fontSize: 18,
        fontFamily: fontFamilies.semiBold,
        color: globalColors.neutralWhite,
        textAlign: "center",
        marginTop: "100%",
        padding: "5%",
        borderRadius: 8,
      }}
    >
      No transactions found.
    </Text>)
  }

  const onEndReached = ()=>{
    if(transactionData.updateData.length > 5 && transactionData.data.length != 0 && !transactionData.isLoaded ){
      onfetchTransactionHistory();
    }

  }

  const LoadingComponent = ()=>{
    return(<Text
      style={{
        fontSize: 16,
        fontFamily: fontFamilies.regular,
        color: globalColors.neutralWhite,
        textAlign: "center",
        marginTop: 20,
      }}
    >
      {`Loading transactions${dots}`}
    </Text>)
  }

  const ListFooterComponent = ()=>{
    if(transactionData.updateData.length > 5 && transactionData.data.length != 0 && !transactionData.isLoaded ){
return(
 <LoadingComponent/>
)
    }
    else {
      return(
        <View style={{height: 50}}/>
      )
    }
  }

  return (
    <ViewWrapper>
      <View style={{ flex: 1, padding: 20, width: "100%" }}>
        <GoBackNavigation header="Transaction history" isDeepLink={true} />
        {/* <HeaderTab /> */}
        {transactionData.isLoaded ? (
          <LoadingComponent/>
        ) : 
          (<FlatList
            data={transactionData.updateData}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TransactionComponent data={item} userId={userId} />
            )}
            ListEmptyComponent={ListEmptyComponent}
            contentContainerStyle={{
              paddingBottom: 10,
            }}
            onEndReachedThreshold={0.5}
            onEndReached={onEndReached}
          ListFooterComponent={ListFooterComponent}
          />
        )} 
      </View>
    </ViewWrapper>
  );
};

export default TransactionScreen;
