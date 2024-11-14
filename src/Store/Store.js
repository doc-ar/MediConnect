import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';

export const useMediConnectStore = create((set) => {

  const checkRefreshToken = async () => {
    const refreshToken = await SecureStore.getItemAsync('refreshToken');
    set({ isAuthenticated: !!refreshToken });
    return !!refreshToken;
  };
  
  const fetchWithRetry = async (url, method, data = undefined) => {
    
      console.log("In fetch function");
      // Retrieve access token
      const accessToken = await SecureStore.getItemAsync('accessToken');
      console.log("access: ",accessToken);
      const headers = {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      };

      // Make the initial request
      console.log("Making initial request");
    try{
      let response = await axios({
        url:url,
        method:method,
        headers:headers,
        data:data
      });
      console.log("initial req successful");
      return response;
    }
    catch(error){
      console.log("initial request failed, error: ",error);
      console.log("Fetching secure refresh token");

      const refreshToken = await SecureStore.getItemAsync('refreshToken');
        if (!refreshToken) {
          // Log the user out if there's no refresh token
          console.log("No refresh token in secure storage, logging user out");
          await clearTokens();
          return null;
        }
        // Attempt to refresh the access token
        try{
          console.log("Got refresh token, Making request for auth token");
          const refreshResponse = await axios.get(
            'https://www.mediconnect.live/auth/refresh-token',
            { refresh_token: refreshToken },
            { headers: { 'Content-Type': 'application/json' } }
        );
        
          const { accessToken: newAccessToken, refreshToken: newRefreshToken } = refreshResponse.data;
          await setTokens(newAccessToken, newRefreshToken);
          console.log("Got new refresh and auth token");
          console.log("new access: ", newAccessToken);
          // Retry the original request with the new access token
          try{
            console.log("Retrying request with new access token");
            response = await axios({
              url:url,
              method:method,
              headers: { ...headers, Authorization: `Bearer ${newAccessToken}` },
              data:data,
            });
            console.log("Request again successful. data: ",response.data);
            return response;
          }
          catch(error){
            console.log("error fetching data again with new access token: ", error);
            return null;
          }
        } catch(error) {
          console.log("Logging out. error fetching new auth token: ",error);
          await clearTokens();
          return null;
        }
    }
    
  };

  const clearTokens = async () => {
    await SecureStore.deleteItemAsync('accessToken');
    await SecureStore.deleteItemAsync('refreshToken');
    await SecureStore.deleteItemAsync('isRegistered');
    checkRefreshToken();
  };

  const setTokens = async (accessToken, refreshToken) => {
    await SecureStore.setItemAsync('accessToken', accessToken);
    await SecureStore.setItemAsync('refreshToken', refreshToken);
    checkRefreshToken();
  };
  
  const setIsRegistered = async (bool) => {
    // Store isRegistered as a string ("true" or "false")
    await SecureStore.setItemAsync('isRegistered', bool ? "true" : "false");
  };

  const getIsRegistered = async () => {
    // Retrieve and convert isRegistered to a boolean
    const isRegistered = await SecureStore.getItemAsync('isRegistered');
    return isRegistered === "true"?true:false;
  };
  
  return {
    selectedAppointmentMonth: "",  
    setSelectedAppointmentMonth: (Month) => set({ selectedAppointmentMonth: Month }),
    
    PatientData: {},
    setPatientData: (data) => set({ PatientData: data }),

    ReloadAppointments : 1,
    setReloadAppointments: (Num) => set({ ReloadAppointments: Num }),
    RegistrationCheck: false,
    setRegistrationCheck: (bool) => set({ RegistrationCheck: bool }),
    isAuthenticated: false,
    setIsRegistered,
    getIsRegistered,
    setTokens,
    clearTokens,
    fetchWithRetry,
    checkRefreshToken
  };
});
