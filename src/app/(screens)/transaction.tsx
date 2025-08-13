import React, { useCallback, useEffect, useState, useMemo, useRef } from "react";
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
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { getTransactionHistory } from "@/redux/reducer/Transaction/GetTransactionHistory";
import { transactionLoader } from "@/redux/slice/Transaction/GetTransactionHistorySlice";

// Memoized HeaderTab component
const HeaderTab = React.memo(() => {
  return (
    <TouchableOpacity
      style={headerTabStyles.container}
    >
      <Text style={headerTabStyles.text}>
        All groups
      </Text>
      <ArrowUpIcon />
    </TouchableOpacity>
  );
});

// Styles extracted to constants for better performance
const headerTabStyles: any = {
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 20,
    alignSelf: "flex-start",
  },
  text: {
    fontSize: 14,
    fontFamily: fontFamilies.semiBold,
    color: globalColors.neutralWhite,
    marginRight: 8,
  }
};

const transactionStyles: any = {
  container: {
    backgroundColor: globalColors.neutral2,
    borderRadius: 12,
    padding: "6%",
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    top: 5,
  },
  leftSection: {
    flex: 1,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  transactionText: {
    fontSize: 14,
    fontFamily: fontFamilies.semiBold,
    color: globalColors.neutralWhite,
    marginBottom: 4,
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dateText: {
    fontSize: 12,
    fontFamily: fontFamilies.regular,
    color: globalColors.neutral8,
  },
  amountText: {
    fontSize: 16,
    fontFamily: fontFamilies.semiBold,
  }
};

const emptyStateStyles: any = {
  text: {
    fontSize: 18,
    fontFamily: fontFamilies.semiBold,
    color: globalColors.neutralWhite,
    textAlign: "center",
    marginTop: "100%",
    padding: "5%",
    borderRadius: 8,
  }
};

const loadingStyles: any = {
  text: {
    fontSize: 16,
    fontFamily: fontFamilies.regular,
    color: globalColors.neutralWhite,
    textAlign: "center",
    marginTop: 20,
  }
};

const TransactionScreen = () => {
  const { userId } = useAppStore();
  const { onfetchTransactionHistory, loading, historyData } = useHistoryViewModel();
  const [dots, setDots] = useState('');
  const flatListRef = useRef(null);
  const isLoadingMore = useRef(false);
  const dispatch = useDispatch();
  const transactionData = useSelector(
    (state: any) => state.transactionHistortData,
    shallowEqual
  );

  // Memoized transaction data to prevent unnecessary re-renders
  const memoizedTransactionData = useMemo(() => {
    const rawData = transactionData?.updateData || [];
    // Remove duplicates based on transaction_id and created_at
    const uniqueTransactions = rawData.filter((item, index, self) => {
      return index === self.findIndex(t => 
        t?.transaction_id === item?.transaction_id && 
        t?.created_at === item?.created_at
      );
    });
    
    return uniqueTransactions;
  }, [transactionData?.updateData]);

  // Optimized copy to clipboard function
  const copyToClipboard = useCallback((transId) => {
    if (transId) {
      Clipboard.setString(transId);
      showToast({ type: "success", text1: "Transaction ID copied!" });
    }
  }, []);

  // Optimized TransactionComponent with proper memoization
  const TransactionComponent = React.memo(({ data, userId }: any) => {
    const isSuccess = data?.payment_type;
    const textColor = isSuccess === "credited" ? globalColors.success : globalColors.warning;
    const sign = isSuccess === "credited" ? "+" : "-";
    
    // Memoize the formatted date to avoid recalculation
    const formattedDate = useMemo(() => {
      return moment
        .utc(data?.created_at)
        .utcOffset("+05:30")
        .format("D MMM YY | h:mm a");
    }, [data?.created_at]);

    const handleCopyPress = useCallback(() => {
      copyToClipboard(data?.transaction_id);
    }, [data?.transaction_id, copyToClipboard]);

    return (
      <TouchableOpacity activeOpacity={1} style={transactionStyles.container}>
        <View style={transactionStyles.leftSection}>
          <View style={transactionStyles.headerRow}>
            <Text style={transactionStyles.transactionText}>
              Transaction :- {data?.transaction_id}
            </Text>
          </View>
          <View style={transactionStyles.dateRow}>
            <Text style={transactionStyles.dateText}>
              {formattedDate}
            </Text>
          </View>
        </View>
        <Text
          style={[
            transactionStyles.amountText,
            { color: textColor }
          ]}
        >
          {`${sign} ${data.transaction_amount}`}
        </Text>
      </TouchableOpacity>
    );
  });

  // Optimized loading dots animation
  useEffect(() => {
    let dotCount = 0;
    const interval = setInterval(() => {
      dotCount = (dotCount + 1) % 4;
      setDots('.'.repeat(dotCount));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  // Initial data fetch
  useEffect(() => {
    getTransactionHistoryData(0)
    return () => {
      setPrefsValue("notificationInfo", "");
    };
  }, []);

  const getTransactionHistoryData = (lastCount: number) => {
    dispatch(transactionLoader(true))
    // @ts-ignore
    dispatch(getTransactionHistory({ userId: userId, lastCount: lastCount }));
  }

  // Memoized empty component
  const ListEmptyComponent = useMemo(() => {
    return () => (
      <Text style={emptyStateStyles.text}>
        No transactions found.
      </Text>
    );
  }, []);

  // Memoized loading component
  const LoadingComponent = useMemo(() => {
    return () => (
      <Text style={loadingStyles.text}>
        {`Loading transactions${dots}`}
      </Text>
    );
  }, [dots]);

  // Optimized pagination logic
  const onEndReached = useCallback(() => {
    if (
      transactionData?.updateData?.length > 5 && 
      transactionData?.data?.length !== 0 && 
      !transactionData?.isLoaded
    ) {
      getTransactionHistoryData(transactionData?.updateData?.length)
    }
  }, [transactionData?.updateData?.length, transactionData?.data?.length, transactionData?.isLoaded, onfetchTransactionHistory]);

  // Memoized footer component
  const ListFooterComponent = useMemo(() => {
    return () => {
      if (
        transactionData?.updateData?.length > 5 && 
        transactionData?.data?.length !== 0 && 
        !transactionData?.isLoaded
      ) {
        return <LoadingComponent />;
      }
      return <View style={{ height: 50 }} />;
    };
  }, [transactionData?.updateData?.length, transactionData?.data?.length, transactionData?.isLoaded, LoadingComponent]);

  // Optimized renderItem function
  const renderItem = useCallback(({ item }) => (
    <TransactionComponent data={item} userId={userId} />
  ), [userId]);

  // Optimized keyExtractor
  const keyExtractor = useCallback((item, index) => {
    return item?.transaction_id?.toString() || index.toString();
  }, []);

  // Determine if we should show loading or list
  const shouldShowLoading = transactionData.isLoaded && transactionData?.updateData?.length === 0;

  return (
    <ViewWrapper>
      <TouchableOpacity activeOpacity={1} style={{ flex: 1, padding: 20, width: "100%" }}>
        <GoBackNavigation header="Transaction history" isDeepLink={true} />
        {/* <HeaderTab /> */}
        {shouldShowLoading ? (
          <LoadingComponent />
        ) : (
          <FlatList
            ref={flatListRef}
            data={memoizedTransactionData}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            ListEmptyComponent={ListEmptyComponent}
            ListFooterComponent={ListFooterComponent}
            contentContainerStyle={{
              paddingBottom: 10,
            }}
            onEndReachedThreshold={0.5}
            onEndReached={onEndReached}
            removeClippedSubviews={true}
            maxToRenderPerBatch={10}
            windowSize={10}
            initialNumToRender={10}
            getItemLayout={(data, index) => ({
              length: 80, // Approximate height of each item
              offset: 80 * index,
              index,
            })}
            updateCellsBatchingPeriod={50}
          />
        )}
      </TouchableOpacity>
    </ViewWrapper>
  );
};

export default TransactionScreen;