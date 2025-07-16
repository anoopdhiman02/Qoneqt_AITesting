import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../utils/Hooks";
import { getTransactionHistory } from "../../../redux/reducer/Transaction/GetTransactionHistory";
import { useAppStore } from "@/zustand/zustandStore";
import { transactionLoader } from "@/redux/slice/Transaction/GetTransactionHistorySlice";

const useHistoryViewModel = () => {
  const Dispatch = useAppDispatch();
  const { userId } = useAppStore();
  const transactionData: any = useAppSelector(
    (state) => state.transactionHistortData
  );
  const [apiCalled, setApiCalled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [historyData, setHistoryData] = useState([]);

  const onfetchTransactionHistory = () => {
    Dispatch(transactionLoader(true))
    Dispatch(getTransactionHistory({ userId: userId, lastCount: transactionData?.updateData.length }));
    
  };


  return { onfetchTransactionHistory, loading, historyData };
};

export default useHistoryViewModel;
