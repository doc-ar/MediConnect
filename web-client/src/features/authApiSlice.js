// authApiSlice.js

import { apiSlice } from '../app/api/apiSlice';

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: ({ email, password, role }) => ({
        url: '/auth/login',
        method: 'POST',
        body: { email, password, role  },
      }),
    }),
    initialSignup: builder.mutation({
      query: ({ email, password, role }) => ({
        url: '/auth/signup',
        method: 'POST',
        body: { email, password, role },
      }),
    }),
    completeSignup: builder.mutation({
      query: ({token, userData}) => ({
        url: '/web/create-doctor-profile', 
        method: 'POST',
        headers:{
          Authorization: `Bearer ${token}`
        },
        body: {...userData },
      }),
    }),
    silentLogin: builder.mutation({
      query: ({ email, password, role }) => ({
        url: '/auth/login', // Use the same login endpoint for silent login
        method: 'POST',
        body: { email, password, role },
      }),
    }),
  }),
});

export const { useLoginMutation, useInitialSignupMutation, useCompleteSignupMutation, useSilentLoginMutation } = authApiSlice;
