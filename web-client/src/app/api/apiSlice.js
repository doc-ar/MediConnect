import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setCredentials, logout } from "../../features/authSlice";

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:3000",
  // credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.accessToken;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result?.error?.originalStatus === 403) {
    console.log("Sending Refresh Token");
    const refreshResult = await baseQuery(
      "/auth/refresh-token",
      api,
      extraOptions,
    );
    console.log(refreshResult);
    if (refreshResult?.data) {
      const user = api.getState().auth.user;
      api.disptach(setCredentials(...refreshResult.data, user));
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.disptach(logout());
    }
  }
  return result;
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({}),
});
