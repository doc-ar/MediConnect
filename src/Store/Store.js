import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
export const useMediConnectStore = create((set) => {

  const checkRefreshToken = async () => {
    const refreshToken = await SecureStore.getItemAsync('refreshToken');
    set({ isAuthenticated: !!refreshToken });
    return !!refreshToken;
  };
  
  const fetchWithRetry = async (url, method, data = undefined) => {
    
      console.log("In fetch function");
     
      const accessToken = await SecureStore.getItemAsync('accessToken');
      console.log("access: ",accessToken);
      
      let headers = {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      };

       
  let formData = null;
  if (data && data.report) {
    console.log("Detected file upload. Switching to multipart/form-data.");
    headers["Content-Type"] = "multipart/form-data";

    formData = new FormData();
    formData.append("name", data.name);
    formData.append("report", {
      uri: data.report,
      name: data.name || "uploaded_file.pdf",
      type: "application/pdf",
    });
  }

  const requestData = formData?formData: data;

      console.log("Making initial request");
    try{
      let response = await axios({
        url:url,
        method:method,
        headers:headers,
        data:requestData
      });
      console.log("initial req successful");
      return response;
    }
    catch(error){
      console.log("initial request failed, error: ",error);
      console.log("Fetching secure refresh token");

      const refreshToken = await SecureStore.getItemAsync('refreshToken');
        if (!refreshToken) {
          console.log("No refresh token in secure storage, logging user out");
          await clearTokens();
          return null;
        }
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
          try{
            console.log("Retrying request with new access token");
            response = await axios({
              url:url,
              method:method,
              headers: { ...headers, Authorization: `Bearer ${newAccessToken}` },
              data:requestData,
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
    console.log("cleared tokens");
    checkRefreshToken();
  };

  const setTokens = async (accessToken, refreshToken) => {
    await SecureStore.setItemAsync('accessToken', accessToken);
    await SecureStore.setItemAsync('refreshToken', refreshToken);
    checkRefreshToken();
  };

  const setNotificationPermission = async (bool) => {
    // Store as a string ("true" or "false")
    await SecureStore.setItemAsync('NotificationPermission', bool ? "true" : "false");
  };

  const getNotificationPermission = async () => {
    // Retrieve and convert to a boolean
    const NotificationPermission = await SecureStore.getItemAsync('NotificationPermission');
    return NotificationPermission === "true"?true:false;
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

  async function showAppointmentNotification(message) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Appointment Update',
        body: message,
        sound: 'default',
      },
      trigger: null,
    });
    saveNotifications(message);
  }

  const getNotifications = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('notifications');
      return jsonValue != null ? JSON.parse(jsonValue) : {};
    } catch (e) {
      console.error('Error retrieving notifications:', e);
      return {};
    }
  };

  const saveNotifications = async (notificationText) => {
    try {
      // Retrieve the current notifications object
      const existingNotifications = await getNotifications();
  
      // Generate a unique ID for the new notification
      const id = Object.keys(existingNotifications).length;
      const notificationId = id+1;
  
      // Add the new notification to the existing notifications object
      const updatedNotifications = {
        ...existingNotifications,
        [notificationId]: notificationText,
      };
  
      // Save the updated object back to AsyncStorage
      await AsyncStorage.setItem('notifications', JSON.stringify(updatedNotifications));
  
      console.log('New notification added');
      console.log("Notifications:", await getNotifications());
    } catch (e) {
      console.error('Error saving notification:', e);
    }
  };

  const clearNotifications = async () => {
    try {
      await AsyncStorage.removeItem('notifications');
      console.log('All notifications cleared');
    } catch (e) {
      console.error('Error clearing notifications:', e);
    }
  };
  
  return {
    selectedAppointmentMonth: "",  
    setSelectedAppointmentMonth: (Month) => set({ selectedAppointmentMonth: Month }),
    PatientData: {},
    setPatientData: (data) => set({ PatientData: data }),
    ReloadAppointments : false,
    setReloadAppointments: (bool) => set({ ReloadAppointments: bool }),
    ReloadUpcomingAppointments : false,
    setReloadUpcomingAppointments: (bool) => set({ ReloadAppointments: bool }),
    RegistrationCheck: false,
    setRegistrationCheck: (bool) => set({ RegistrationCheck: bool }),
    isAuthenticated: false,
    setIsRegistered,
    getIsRegistered,
    setTokens,
    clearTokens,
    fetchWithRetry,
    checkRefreshToken,
    getNotifications,
    saveNotifications,
    clearNotifications,
    getNotificationPermission,
    setNotificationPermission,
    showAppointmentNotification
  };
});
