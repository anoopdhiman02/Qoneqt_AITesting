import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { useKycState } from "../zustand/zustandStore";

const KycOnboardViewModel = () => {
  const userKycStatus = useKycState((state) => state.userKycStep);

  const updateUserKycState = useKycState((state) => state.updateBears);

  const [kycStep, setKycStep] = useState(1);
  const StepData = [
    { id: 0, title: "Step 1: Basic information", step: 1, isCompleted: true },
    { id: 2, title: "Step 2: Face verification", step: 2, isCompleted: true },
    {
      id: 3,
      title: "Step 3: Upload your Aadhaar",
      step: 3,
      isCompleted: false,
    },
    { id: 4, title: "Step 4: Upload your PAN", step: 4, isCompleted: false },
  ];

  let newKycStage = StepData.find(({ step }) => step === kycStep);

  const onSubmitHandler = () => {
    updateUserKycState(2);
  };
  return {
    userKycStatus,
    StepData,
    updateUserKycState,
    newKycStage,
    onSubmitHandler,
  };
};

export default KycOnboardViewModel;
