import { createSlice } from "@reduxjs/toolkit";
import { onFetchGroupMembers } from "../../reducer/group/GroupMembers";

const groupMembersSlice = createSlice({
  name: "group_members",
  initialState: {
    data: [],
    success: false,
    isLoaded: false,
    error: false,
    error_message: "",
    message: "",
    called: false,
    status: 0,
    allMembersCount:0,
    authMembersCount:0,
    authMembersList:[],
    allMembersList:[],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(onFetchGroupMembers.fulfilled, (state, action) => {
        state.data = action.payload?.data;
        state.allMembersList = action.payload.type == 0 ? action.payload?.data?.members?  action.payload.lastCount > 0 ? [...state.allMembersList, ...action.payload?.data?.members] :  [...action.payload?.data?.members] : state.allMembersList  : state.allMembersList;
        state.authMembersList = action.payload.type == 1 ? action.payload?.data?.members ? action.payload.lastCount > 0 ? [...state.authMembersList, ...action.payload?.data?.members] :  [...action.payload?.data?.members] : state.authMembersList : state.authMembersList;
        state.allMembersCount = action.payload.type == 0 ? action.payload?.data?.member_count: state.allMembersCount;
        state.authMembersCount = action.payload.type == 1 ? action.payload?.data?.member_count : state.authMembersCount;
        state.success = action.payload?.success;
        state.message = action.payload?.message;
        state.isLoaded = true;
        state.error = false;
        state.error_message = "";
        state.called = false;
        state.status = action.payload.status;
      })
      .addCase(onFetchGroupMembers.rejected, (state, action) => {
        state.success = false;
        state.isLoaded = true;
        state.error = true;
        state.error_message = "Data fetch";
      });
  },
});

export default groupMembersSlice.reducer;
