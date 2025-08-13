import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import AsyncStorage from '@react-native-async-storage/async-storage';

;

export const uploadImageApiSlice = createApi({
  reducerPath: 'uploadImageApiSlice',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://52.66.242.110:8888/api/',

    prepareHeaders: async (headers, {endpoint}) => {
      headers.set('Content-Type', 'application/json');
      // const token = getPrefsValue(CONSTANTS.STORAGE.TOKEN);
      const token = '';
      console.log('data', token);

      if (token) {
        headers.set('Authorization', token);
      }
      return headers;
    },
  }),

  endpoints(builder) {
    return {
      uploadImageApi: builder.mutation({
        query: params => {
          return {
            url: `/upload-simple`,
            method: 'POST',
            body: params,
          };
        },
      }),
      
    };
  },
});

export const {
  useUploadImageApiMutation,
} = uploadImageApiSlice;
