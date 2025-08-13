// homeSelectors.ts
import { RootState } from "../store"; // Adjust path if needed

export const selectHomePostResponse = (state: RootState) => state.HomePostResponse;
export const selectHomePostNextResponse = (state: RootState) => state.HomePostNextResponse;
export const selectTrendingPostResponse = (state: RootState) => state.TrendingPostResponse;
export const selectDynamicContentStatus = (state: RootState) => state.dynamicContentStatusSlice;
export const selectNewPostCount = (state: RootState) => state.newFeedSlice?.data;;
export const selectLoginUserData = (state: RootState) => state.loginUserApi;
export const selectPostDetailData = (state: RootState) => state.postDetailData;
