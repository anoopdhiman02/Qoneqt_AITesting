import { fetchNotifications } from "@/redux/reducer/notification/FetchNotificationsApi";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: [],
  success: false,
  error: false,
  error_message: "",
  isLoaded: false,
  called: false,
  allData: [],
  postData: [],
  groupData:[],
  isLoading: false,
  type:0,
};

const fetchNotificationsSlice = createSlice({
  name: "all_notifications",
  initialState: initialState,
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.isLoaded = true;
        state.called = true;
        state.data = action?.payload?.data;
        state.allData= action?.payload?.type == 0 ? action?.payload?.lastCount == 0 ?  action?.payload?.data : [...state.allData, ...action?.payload?.data] : state.allData;
        state.postData = action?.payload?.type == 1? action?.payload?.lastCount == 0 ? action?.payload?.data : [...state.postData, ...action?.payload?.data] : state.postData;
        state.groupData = action?.payload?.type == 2? action?.payload?.lastCount == 0 ? action?.payload?.data : [...state.groupData, ...action?.payload?.data] : state.groupData
        state.type = action?.payload?.type;
        state.success = action?.payload?.success;
        state.error = false;
        state.error_message = action?.payload?.message;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.isLoaded = true;
        state.called = true;
        state.error = true;
        state.error_message = "failed api";
        state.success = false;
      });
  },
  reducers:{
    setLoadingData : (state, action) =>{
      state.isLoading = action.payload;
    },
    clearData : (state) =>{
      state.data = [];
      state.success = false;
      state.error = false;
      state.error_message = "";
      state.isLoaded = false;
      state.called = false;
      state.allData = [];
      state.postData = [];
      state.groupData = [];
      state.isLoading = false;
      state.type = 0;
    },
    updateNotificationData : (state, action) =>{
      state.allData = action.payload.allData;
      state.postData = action.payload.postData;
      state.groupData = action.payload.groupData;
    }
  },
});
export const {setLoadingData, clearData, updateNotificationData} = fetchNotificationsSlice.actions;
export default fetchNotificationsSlice.reducer;
