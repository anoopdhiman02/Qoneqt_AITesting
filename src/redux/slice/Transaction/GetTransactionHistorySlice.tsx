import { createSlice } from "@reduxjs/toolkit";
import { getTransactionHistory } from "../../reducer/Transaction/GetTransactionHistory";
import { isArray } from "lodash";

const getTransactionHistorySlice = createSlice({
  name: "transaction_history",
  initialState: {
    data: [],
    updateData: [],
    success: false,
    isLoaded: false,
    error: false,
    error_message: "",
    last_count: 0,
  },
  reducers: {
    transactionLoader: (state, action)=>{
      state.isLoaded= action.payload;
    }
    // You can include synchronous actions directly in createSlice
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTransactionHistory.fulfilled, (state, action) => {
        state.data = action?.payload?.data;
        state.updateData = action?.payload?.last_count == 0 ? action?.payload?.data: Array.isArray(action.payload.data) ? [...state.data,  ...action.payload.data] : [...state.updateData]
        state.success = action?.payload?.success;
        state.isLoaded = false;
        state.error = false;
        state.error_message = "";
      })
      .addCase(getTransactionHistory.rejected, (state, action: any) => {
        state.success = false;
        state.isLoaded = false;
        state.error = true;
        state.error_message = action.payload.message|| '';
      });
  },
});
export const {transactionLoader} = getTransactionHistorySlice.actions;
export default getTransactionHistorySlice.reducer;
