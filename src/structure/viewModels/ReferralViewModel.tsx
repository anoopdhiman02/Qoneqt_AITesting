import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../utils/Hooks";
import { onFetchReferral } from "@/redux/reducer/Transaction/FetchReferral";
import { useAppStore } from "@/zustand/zustandStore";

const useReferralViewModel = () => {
  const { userId } = useAppStore();
  const Dispatch = useAppDispatch();
  const referralResponse = useAppSelector((state) => state.fetchReferralData);
  const [ReferralLoading, setReferralLoading] = useState(false);
  const [apiCalled, setApiCalled] = useState(false);

  const [referralData, setReferralData] = useState({});
  const [refList, setRefList] = useState([]);

  const fetchReferralDetail = () => {
    Dispatch(onFetchReferral({ userId: userId }));
    setApiCalled(true);
    setReferralLoading(true);
  };

  useEffect(() => {
    if (apiCalled && referralResponse?.success) {
      const { refEarn, refcount, list, refer_link } = referralResponse?.data;


      let tempData = {
        refEarn,
        refcount,
        refer_link,
      };
      setReferralData(tempData);
      setRefList(list);
      setApiCalled(false);
      setReferralLoading(false);
    } else if (apiCalled && !referralResponse?.success) {
      setApiCalled(false);
      setReferralLoading(false);
    }
  }, [referralResponse]);

  return { fetchReferralDetail, ReferralLoading, referralData, refList };
};

export default useReferralViewModel;

const styles = StyleSheet.create({});
