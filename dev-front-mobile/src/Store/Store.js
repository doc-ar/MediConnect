import { create } from "zustand";
import * as SecureStore from "expo-secure-store";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
export const useMediConnectStore = create((set) => {
  const checkRefreshToken = async () => {
    const refreshToken = await SecureStore.getItemAsync("refreshToken");
    set({ isAuthenticated: !!refreshToken });
    return !!refreshToken;
  };

  const fetchWithRetry = async (url, method, data = undefined) => {
    console.log("In fetch function");

    const accessToken = await SecureStore.getItemAsync("accessToken");
    console.log("access: ", accessToken);

    let headers = {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      Accept: "application/json",
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
    if (data && data.file) {
      console.log("Detected image upload. Switching to multipart/form-data.");
      console.log(data.file);
      headers["Content-Type"] = "multipart/form-data";
      formData = new FormData();
      formData.append("avatar", {
        uri: data.file,
        name: data.name ? data.name : "uploaded_file.jpeg",
        type: "image/jpeg",
      });
    }
    const requestData = formData ? formData : data;

    console.log("Making initial request");
    try {
      let response = await axios({
        url: url,
        method: method,
        headers: headers,
        data: requestData,
      });
      console.log("initial req successful");
      return response;
    } catch (error) {
      console.log("initial request failed, error: ", error);
      console.log("Fetching secure refresh token");

      const refreshToken = await SecureStore.getItemAsync("refreshToken");
      if (!refreshToken) {
        console.log("No refresh token in secure storage, logging user out");
        await clearTokens();
        return null;
      }
      try {
        console.log("Got refresh token, Making request for auth token");
        const refreshResponse = await axios.get(
          "http://localhost:3000/auth/refresh-token",
          { refresh_token: refreshToken },
          { headers: { "Content-Type": "application/json" } },
        );

        const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
          refreshResponse.data;
        await setTokens(newAccessToken, newRefreshToken);
        console.log("Got new refresh and auth token");
        console.log("new access: ", newAccessToken);
        try {
          console.log("Retrying request with new access token");
          response = await axios({
            url: url,
            method: method,
            headers: { ...headers, Authorization: `Bearer ${newAccessToken}` },
            data: requestData,
          });
          console.log("Request again successful. data: ", response.data);
          return response;
        } catch (error) {
          console.log(
            "error fetching data again with new access token: ",
            error,
          );
          return null;
        }
      } catch (error) {
        console.log("Logging out. error fetching new auth token: ", error);
        await clearTokens();
        return null;
      }
    }
  };

  const clearTokens = async () => {
    await SecureStore.deleteItemAsync("accessToken");
    await SecureStore.deleteItemAsync("refreshToken");
    await SecureStore.deleteItemAsync("isRegistered");
    console.log("cleared tokens");
    checkRefreshToken();
  };

  const setTokens = async (accessToken, refreshToken) => {
    await SecureStore.setItemAsync("accessToken", accessToken);
    await SecureStore.setItemAsync("refreshToken", refreshToken);
    checkRefreshToken();
  };

  const setIsRegistered = async (bool) => {
    await SecureStore.setItemAsync("isRegistered", bool ? "true" : "false");
  };

  const getIsRegistered = async () => {
    const isRegistered = await SecureStore.getItemAsync("isRegistered");
    return isRegistered === "true" ? true : false;
  };

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });

  async function showAppointmentNotification(message, Date) {
    const { status } = await Notifications.getPermissionsAsync();
    if (status !== "granted") {
      return;
    }
    let triggerOn = null;

    if (Date !== null) {
      const formattedDate = new Date(Date);

      if (!isNaN(formattedDate)) {
        triggerOn = {
          type: "date",
          value: formattedDate.getTime(),
        };
      } else {
        console.error("Invalid date format");
      }
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Appointment Update",
        body: message,
        sound: "default",
      },
      trigger: triggerOn,
    });

    saveNotifications(message);
  }

  const getNotifications = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("notifications");
      return jsonValue != null ? JSON.parse(jsonValue) : {};
    } catch (e) {
      console.error("Error retrieving notifications:", e);
      return {};
    }
  };

  const saveNotifications = async (notificationText) => {
    try {
      const existingNotifications = await getNotifications();

      const id = Object.keys(existingNotifications).length;
      const notificationId = id + 1;

      const updatedNotifications = {
        ...existingNotifications,
        [notificationId]: notificationText,
      };

      await AsyncStorage.setItem(
        "notifications",
        JSON.stringify(updatedNotifications),
      );

      console.log("New notification added");
      console.log("Notifications:", await getNotifications());
    } catch (e) {
      console.error("Error saving notification:", e);
    }
  };

  const clearNotifications = async () => {
    try {
      await AsyncStorage.removeItem("notifications");
      console.log("All notifications cleared");
    } catch (e) {
      console.error("Error clearing notifications:", e);
    }
  };

  return {
    selectedAppointmentMonth: "",
    setSelectedAppointmentMonth: (Month) =>
      set({ selectedAppointmentMonth: Month }),
    PatientData: {},
    setPatientData: (data) => set({ PatientData: data }),
    ReloadAppointments: false,
    setReloadAppointments: (bool) => set({ ReloadAppointments: bool }),
    ReloadUpcomingAppointments: false,
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
    showAppointmentNotification,
  };
});
