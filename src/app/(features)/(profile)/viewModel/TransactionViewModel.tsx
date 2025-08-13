import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useAppStore } from "@/zustand/zustandStore";
import { onFetchBankDetail } from "@/redux/reducer/Transaction/GetBankDetail";
import { onInsertBankDetail } from "@/redux/reducer/Transaction/InsertBankDetail";
import { onCheckWithdrawal } from "@/redux/reducer/Transaction/CheckWithdrawal";
import { showToast } from "@/components/atom/ToastMessageComponent";
import BottomSheet from "@gorhom/bottom-sheet";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { Alert } from "react-native";

const TransactionViewModel = () => {
  const { userId } = useAppStore();
  const Dispatch = useDispatch();

  const getBankResponse = useSelector((state: any) => state.getBankDetailData);
  const profileDetailResponse = useSelector(
    (state: any) => state.myProfileData,
    shallowEqual
  );
  const [isWithDrawAmount, setIsWithDrawAmount] = useState(false);
  const WithdrawAmount = useRef<BottomSheet>(null);
  const WithdrawRef = useRef<BottomSheet>(null);

  // FIXED: Memoized profile details with proper dependency
  const profileDetails = useMemo(() => {
    return profileDetailResponse?.data || null;
  }, [profileDetailResponse?.data]);

  const [loadingStates, setLoadingStates] = useState({
    getBank: false,
    insertBank: false,
    withdraw: false,
  });

  const [form, setForm] = useState({
    accountNumber: "",
    ifscCode: "",
    accountHolder: "",
    bankName: "",
    branchName: "",
  });
  const [isOldAcc, setIsOldAcc] = useState(0);
  const today = new Date();
  const approveBy = new Date(today);
  approveBy.setDate(today.getDate() + 7);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleInputChange = useCallback(
    (key: keyof typeof form, value: string) => {
      setForm((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const onFetchDetailHandler = useCallback(() => {
    if (!userId) return;
    setLoadingStates((prev) => ({ ...prev, getBank: true }));
    //@ts-ignore
    var fetchBankData: any = Dispatch(onFetchBankDetail({ userId }));
    setLoadingStates((prev) => ({ ...prev, getBank: false }));
    if (fetchBankData?.payload?.success) {
      const data = fetchBankData?.payload?.data;
      if (data) {
        setForm({
          accountNumber: data.account_number || "",
          ifscCode: data.ifsc || "",
          accountHolder: data.account_holder_name || "",
          bankName: data.bank_name || "",
          branchName: data.branch_name || "",
        });
        setIsOldAcc(1);
      } else {
        setIsOldAcc(0);
      }
    } else {
      setIsOldAcc(0);
    }
  }, [Dispatch, userId]);

  const validateInputs = useCallback(() => {
    const { accountNumber, ifscCode, accountHolder, bankName, branchName } =
      form;

    if (!accountNumber)
      return (
        showToast({ text1: "Enter Valid Account number", type: "error" }), false
      );
    if (!ifscCode)
      return (
        showToast({ text1: "Enter Valid IFSC Code", type: "error" }), false
      );
    if (!accountHolder)
      return (
        showToast({ text1: "Enter Valid Account Holder name", type: "error" }),
        false
      );
    if (!bankName)
      return (
        showToast({ text1: "Enter Valid Bank Name", type: "error" }), false
      );
    if (!branchName)
      return (
        showToast({ text1: "Enter Valid branch name", type: "error" }), false
      );

    return true;
  }, [form]);

  const onInsertBankHandler = useCallback(async () => {
    console.log("here<<<")
    if (!validateInputs()) return;
    setLoadingStates((prev) => ({ ...prev, insertBank: true }));
    var insertBankData: any = await Dispatch(
      //@ts-ignore
      onInsertBankDetail({
        userId,
        account_name: form.accountHolder,
        account_number: form.accountNumber,
        bank_name: form.bankName,
        branch_name: form.branchName,
        ifsc_code: form.ifscCode,
        type: isOldAcc,
      })
    );
    setLoadingStates((prev) => ({ ...prev, insertBank: false }));
    if (insertBankData?.payload?.success) {
      showToast({ type: "success", text1: insertBankData.payload.message });
      setIsWithDrawAmount(true);
    } else {
      console.log("here",insertBankData?.payload?.message )
      showToast({
        type: "error",
        text1:
          insertBankData?.payload?.message || "Failed to insert bank details",
      });
    }
  }, [Dispatch, userId, form, isOldAcc, validateInputs]);

  const onWithdrawHandler = useCallback(
    async ({ amount }: { amount: number }) => {
      if (amount < 100) {
        showToast({ text1: "Minimum ₹100 to withdraw money", type: "info" });
        return;
      }
      const amountString = amount.toString();
      const balanceString = profileDetails?.total_inr.toString();

      // Clean and convert both to numbers
      const amounts = parseFloat(amountString.replace(/[₹,]/g, ""));
      const userBalance = parseFloat(balanceString.replace(/[₹,]/g, ""));
      if (amounts > userBalance) {
        showToast({ text1: "Insufficient balance", type: "error" });
        return;
      }
      setLoadingStates((prev) => ({ ...prev, withdraw: true }));
      // WithdrawAmount.current?.close();
      //@ts-ignore
      var checkWithdrawalData: any = await Dispatch(
        //@ts-ignore
        onCheckWithdrawal({ user_id: userId, amount })
      );
      setLoadingStates((prev) => ({ ...prev, withdraw: false }));
      if (checkWithdrawalData?.payload?.success) {
        if (checkWithdrawalData?.payload?.error) {
          showToast({
            type: "error",
            text1:
              checkWithdrawalData?.payload?.message || "Something went wrong",
            visibilityTime: 5000,
          });
        } else {
          Alert.alert(
            "Success",
            `Your withdrawal amount will be credited to your bank on or before ${formatDate(
              approveBy
            )}).`
          );
        }
      } else {
        showToast({
          type: "error",
          text1:
            checkWithdrawalData?.payload?.message || "Something went wrong",
          visibilityTime: 5000,
        });
      }
    },
    [Dispatch, userId]
  );

  const updateBankDetail = () => {
    const data = getBankResponse.data;
    if (data) {
      setForm({
        accountNumber: data.account_number || "",
        ifscCode: data.ifsc || "",
        accountHolder: data.account_holder_name || "",
        bankName: data.bank_name || "",
        branchName: data.branch_name || "",
      });
    }
  };

  return {
    onFetchDetailHandler,
    dataLoading: loadingStates.getBank,
    insertLoading: loadingStates.insertBank,
    withdrawLoading: loadingStates.withdraw,
    onInsertBankHandler,
    onWithdrawHandler,
    WithdrawAmount,
    WithdrawRef,
    isOldAcc,
    ...form,
    onChangeAccountNumber: (text: string) =>
      handleInputChange("accountNumber", text),
    onChangeCode: (text: string) => handleInputChange("ifscCode", text),
    onChangeHolderName: (text: string) =>
      handleInputChange("accountHolder", text),
    onChangeBankName: (text: string) => handleInputChange("bankName", text),
    onChangeBranchName: (text: string) => handleInputChange("branchName", text),
    updateBankDetail,
    isWithDrawAmount,
    setIsWithDrawAmount,
    setIsOldAcc,
  };
};

export default TransactionViewModel;
