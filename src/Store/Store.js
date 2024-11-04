import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';

export const useMediConnectStore = create((set) => {

  const checkRefreshToken = async () => {
    const refreshToken = await SecureStore.getItemAsync('refreshToken');
    set({ isAuthenticated: !!refreshToken });
  };

  checkRefreshToken();
  
  const fetchWithRetry = async (url, method, data = undefined) => {
    try {
      console.log("1");
      // Retrieve access token
      const accessToken = await SecureStore.getItemAsync('accessToken');
      console.log("access: ",accessToken);
      const headers = {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      };

      // Make the initial request with Axios
      console.log("2");
      let response = await axios({
        url:url,
        method:method,
        headers:headers,
        data:data
      });
      console.log("3");
      // If the response status is not 200, attempt to refresh the token
      if (response.status === 403 || response.status !== 200) {
        const refreshToken = await SecureStore.getItemAsync('refreshToken');
        console.log("4");
        if (!refreshToken) {
          // Log the user out if there's no refresh token
          await clearTokens();
          return null;
        }
        console.log("5");
        // Attempt to refresh the access token
        const refreshResponse = await axios.get(
          'https://www.mediconnect.live/auth/refresh-token',
          { refresh_token: refreshToken },
          { headers: { 'Content-Type': 'application/json' } }
        );

        if (refreshResponse.status === 200) {
          const { accessToken: newAccessToken, refreshToken: newRefreshToken } = refreshResponse.data;
          await setTokens(newAccessToken, newRefreshToken);
          console.log("6");
          // Retry the original request with the new access token
          response = await axios({
            url:url,
            method:method,
            headers: { ...headers, Authorization: `Bearer ${newAccessToken}` },
            data:data,
          });
          console.log("7");
        } else {
          await clearTokens();
          return null;
        }
      }

      return response;
    } catch (error) {
      console.error('Network request failed:', error);
      return null;
    }
  };

  const clearTokens = async () => {
    await SecureStore.deleteItemAsync('accessToken');
    await SecureStore.deleteItemAsync('refreshToken');
    set({ isAuthenticated: false });
  };

  const setTokens = async (accessToken, refreshToken) => {
    await SecureStore.setItemAsync('accessToken', accessToken);
    await SecureStore.setItemAsync('refreshToken', refreshToken);
    checkRefreshToken();
  };

  
  return {
    selectedAppointmentMonth: "",  
    setSelectedAppointmentMonth: (Month) => set({ selectedAppointmentMonth: Month }),
    
    RegistrationDetails: false,
    setRegistrationDetails: (bool) => set({ RegistrationDetails: bool }),

    isAuthenticated: false,
    setTokens,
    clearTokens,
    fetchWithRetry,
  };
});
