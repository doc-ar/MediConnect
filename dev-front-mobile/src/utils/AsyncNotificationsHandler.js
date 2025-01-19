import React, { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";

export default function AsyncNotificationHandler({ Appointment }) {
  const setUpcomingAppointment = async () => {
    await AsyncStorage.setItem("upcomingAppointment", JSON.stringify(Appointment));
  };

  const getUpcomingAppointment = async () => {
    const upcomingAppointment = await AsyncStorage.getItem("upcomingAppointment");
    return upcomingAppointment ? JSON.parse(upcomingAppointment) : null;
  };

  const checkNotificationSet = async () => {
    const upcomingAppointment = await getUpcomingAppointment();
    if (!upcomingAppointment) {
      await setUpcomingAppointment();
      return false;
    }
    if (
      upcomingAppointment.appointment_id === Appointment.appointment_id &&
      upcomingAppointment.date === Appointment.date &&
      upcomingAppointment.month === Appointment.month &&
      upcomingAppointment.start_time === Appointment.start_time &&
      upcomingAppointment.end_time === Appointment.end_time
    ) {
      return true;
    } else {
      await setUpcomingAppointment();
      return false;
    }
  };

  const logScheduledNotifications = async () => {
    const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
    console.log("Scheduled Notifications:", scheduledNotifications);
  };

  const convertTo24HourTime = (time) => {
    const [hour, minute] = time.split(":");
    let [hour24, suffix] = hour.split(" ");
    let formattedHour = parseInt(hour24, 10);

    if (suffix === "PM" && formattedHour !== 12) {
      formattedHour += 12;
    }
    if (suffix === "AM" && formattedHour === 12) {
      formattedHour = 0;
    }

    return new Date().setHours(formattedHour, parseInt(minute, 10), 0, 0);
  };

  const setAsyncNotification = async () => {
    const notificationSet = await checkNotificationSet();

    if (notificationSet) {
      return;
    } else {
      await Notifications.cancelAllScheduledNotificationsAsync();
      console.log("Scheduling new notification...");

      const { date, month, start_time } = Appointment;

      // Create the appointment date using the proper time
      const appointmentDate = new Date(`${month} ${date}, ${new Date().getFullYear()} ${start_time}`);
      const appointmentDateWithTime = convertTo24HourTime(start_time);
      const appointmentDateObject = new Date(`${month} ${date}, ${new Date().getFullYear()}`).setHours(new Date(appointmentDateWithTime).getHours(), new Date(appointmentDateWithTime).getMinutes());

      console.log("appointmentDate: ", new Date(appointmentDateObject));

      const timeDifference = appointmentDateObject - new Date();
      console.log("Time difference (in ms):", timeDifference);

      if (timeDifference <= 3 * 60 * 60 * 1000) {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: "Upcoming Appointment",
            body: `You have an appointment scheduled for ${start_time} today (${month} ${date})`,
            sound: true,
          },
          trigger: {
            seconds: 0,
          },
        });
      } else {
        const notificationTime = new Date(appointmentDateObject - 3 * 60 * 60 * 1000);

        await Notifications.scheduleNotificationAsync({
          content: {
            title: "Upcoming Appointment",
            body: `You have an appointment scheduled for ${start_time} today (${month} ${date})`,
            sound: true,
          },
          trigger: {
            date: notificationTime,
          },
        });
      }

      logScheduledNotifications();
    }
  };

  useEffect(() => {
    setAsyncNotification();
  }, [Appointment]);
  logScheduledNotifications();

  return null;
}
