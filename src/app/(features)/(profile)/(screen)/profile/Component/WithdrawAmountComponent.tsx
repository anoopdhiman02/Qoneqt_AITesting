import { View, Text, TouchableOpacity, ScrollView, Platform, KeyboardAvoidingView } from 'react-native'
import React from 'react'
import { globalColors } from '@/assets/GlobalColors'
import { fontFamilies } from '@/assets/fonts'
import GradientText from '@/components/element/GradientText'
import Button1 from '@/components/buttons/Button1'
import TextInputComponent from '@/components/element/TextInputComponent'
import { ArrowDownIcon, ArrowUpIcon } from '@/assets/DarkIcon'

interface WithdrawAmountComponentProps {
    setIsExpanded?: any;
    isExpanded?: boolean;
    accontNumber?: string;
    onChangeAccountNumber?: (text: string) => void;
    code?: string;
    onChangeCode?: (text: string) => void;
    accountHolderName?: string;
    onChangeHolderName?: (text: string) => void;
    bankName?: string;
    onChangeBankName?: (text: string) => void;
    branchName?: string;
    onChangeBranchName?: (text: string) => void;
    insertLoading?: boolean;
    withdrawLoading?: boolean;
    onInsertBankHandler?: () => void;
    onPressWithdrawHandler?: () => void;
    isOldAcc?: number;
    cancelPress?: () => void;
    isOldAccount?: any
}

const WithdrawAmountComponent: React.FC<WithdrawAmountComponentProps> = ({setIsExpanded, isExpanded, accontNumber, onChangeAccountNumber, code, onChangeCode, accountHolderName, onChangeHolderName, bankName, onChangeBankName, branchName, onChangeBranchName, insertLoading, withdrawLoading, onInsertBankHandler, onPressWithdrawHandler, isOldAcc, cancelPress, isOldAccount}) => {
  return (
    <View>
      <View
          style={{
            flex: 1,
            width: "100%",
          }}
        >
          <Text
            style={{
              color: globalColors.neutralWhite,
              fontSize: 18,
              fontFamily: fontFamilies.bold,
              textAlign: "center",
              marginBottom: 2,
            }}
          >
            Withdraw Amount
          </Text>

          <TouchableOpacity
            onPress={() => setIsExpanded(!isExpanded)}
            style={{
              backgroundColor: globalColors.darkOrchidShade40,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              padding: 3,
              borderRadius: 12,
              marginBottom: 5,
            }}
          >
            <Text
              style={{
                color: globalColors.neutralWhite,
                fontSize: 16,
                fontFamily: fontFamilies.medium,
              }}
            >
              Account details
            </Text>
            {isExpanded ? <ArrowDownIcon /> : <ArrowUpIcon />}
          </TouchableOpacity>

          {isExpanded && (
            <View>
            {/* <KeyboardAvoidingView
              style={{ flex: 1 }} // Ensure it takes full height
              behavior={Platform.OS === "ios" ? "padding" : "height"} // Adjust behavior based on platform
            >
              <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                style={{ paddingBottom: "10%" }}
              > */}
                <TextInputComponent
                  keyboardType={"number-pad"}
                  header="Account Number"
                  value={accontNumber}
                  placeHolder="Enter Account Number"
                  onChangeText={(text) => onChangeAccountNumber(text)}
                  style={{
                    backgroundColor: globalColors.neutral2,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "4%",
                    borderRadius: 12,
                    marginBottom: 15,
                    color: globalColors.neutral10,
                    fontSize: 14,
                  }}
                />
                {/* {accontNumberError ? (
                  <Text style={{ color: "red", marginLeft: 10, top: 5 }}>
                    Account Number
                  </Text>
                ) : null} */}
                <TextInputComponent
                  autoCapitalize={"characters"}
                  header="IFSC Code"
                  value={code}
                  placeHolder="Enter IFSC Code"
                  onChangeText={(text) => onChangeCode(text)}
                  style={{
                    backgroundColor: globalColors.neutral2,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "4%",
                    borderRadius: 12,
                    marginBottom: 15,
                    color: globalColors.neutral10,
                    fontSize: 14,
                  }}
                />
                {/* {codeError ? (
                  <Text style={{ color: "red", marginLeft: 10, top: 5 }}>
                    IFSC Code
                  </Text>
                ) : null} */}
                <TextInputComponent
                  autoCapitalize={"characters"}
                  header="Account Holder Name"
                  value={accountHolderName}
                  placeHolder="Enter Account Holder Name"
                  onChangeText={(text) => onChangeHolderName(text)}
                  style={{
                    backgroundColor: globalColors.neutral2,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "4%",
                    borderRadius: 12,
                    marginBottom: 15,
                    color: globalColors.neutral10,
                    fontSize: 14,
                  }}
                />
                {/* {accountHolderNameError ? (
                  <Text style={{ color: "red", marginLeft: 10, top: 5 }}>
                    Account Holder Name
                  </Text>
                ) : null} */}
                <TextInputComponent
                  autoCapitalize={"characters"}
                  header="Bank Name"
                  value={bankName}
                  placeHolder="Enter Bank Name"
                  onChangeText={(text) => onChangeBankName(text)}
                  style={{
                    backgroundColor: globalColors.neutral2,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "4%",
                    borderRadius: 12,
                    marginBottom: 15,
                    color: globalColors.neutral10,
                    fontSize: 14,
                  }}
                />
                {/* {bankNameError ? (
                  <Text style={{ color: "red", marginLeft: 10, top: 5 }}>
                    Bank Name
                  </Text>
                ) : null} */}
                <TextInputComponent
                  autoCapitalize={"characters"}
                  header="Branch Name"
                  value={branchName}
                  placeHolder="Enter Branch Name"
                  onChangeText={(text) => onChangeBranchName(text)}
                  style={{
                    backgroundColor: globalColors.neutral2,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "4%",
                    borderRadius: 12,
                    marginBottom: 15,
                    color: globalColors.neutral10,
                    fontSize: 14,
                  }}
                />
                {/* {branchNameError ? (
                  <Text style={{ color: "red", marginLeft: 10, top: 5 }}>
                    Branch Name
                  </Text>
                ) : null} */}
              {/* </ScrollView>
            </KeyboardAvoidingView> */}
            </View>
          )}
        </View>
        <View>
          <Button1
            title={isOldAccount ? "Update Details" : "Save Detail"}
            onPress={onInsertBankHandler}
            isLoading={insertLoading}
          />
          {isOldAccount && (
            <View style={{ marginTop: -35 }}>
              <Button1
                title="Withdraw"
                isLoading={withdrawLoading}
                // onPress={() => onWithdrawHandler({ amount: amount })}
                onPress={() => onPressWithdrawHandler()}
              />

              <TouchableOpacity onPress={cancelPress}>
                <GradientText
                  style={{
                    fontFamily: fontFamilies.regular,
                    fontSize: 17,
                    color: globalColors.darkOrchid,
                  }}
                >
                  {"Cancel"}
                </GradientText>
              </TouchableOpacity>
            </View>
          )}
        </View>
    </View>
  )
}

export default WithdrawAmountComponent