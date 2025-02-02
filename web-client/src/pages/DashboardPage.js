import React, { useEffect, useState } from "react";
import "../styles/DashboardPage.css";
import AppointmentCard from "../components/AppointmentCard";
import PastAppointmentsTable from "../components/PastAppointmentsTable";
import UpcomingSchedule from "../components/UpcomingSchedule";
import Topbar from "../components/TopBar";
import { selectCurrentAccessToken } from "../features/authSlice";
import { useSelector } from "react-redux";

const Dashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [appointmentsToday, setAppointmentsToday] = useState(0);
  const [cancelledAppointments, setCancelledAppointments] = useState(0);
  const [pastAppointments, setPastAppointments] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const accessToken = useSelector(selectCurrentAccessToken);
  // useEffect(() => {
  //   // Fetch appointments from the API
  //   fetch('http://localhost:3001/web/get-appointments',{
  //     method: 'GET',
  //     headers: {
  //       'Authorization': `Bearer ${accessToken}`,
  //       'Content-Type': 'application/json'
  //     }
  //   })
  // .then((response) => response.json())
  // .then((data) => {
  //   const today = new Date();
  //     today.setHours(0, 0, 0, 0);

  //     const todaysAppointments = data.filter(appointment => {
  //       const [year, month, day] = appointment.date.split("-");
  //       const parsedDate = new Date(`${day}-${month}-${year}`);
  //       return parsedDate.getTime() === today.getTime();
  //     });

  //   const cancelled = todaysAppointments.filter(appointment => appointment.status === 'cancelled');
  //   const past = todaysAppointments.filter(appointment => new Date(`${appointment.date} ${appointment.endtime}`) < new Date());

  //   // const upcoming = todaysAppointments.filter(appointment => {
  //   //   // Parse the appointment start date and time
  //   //   const appointmentStart = new Date(`${appointment.date} ${appointment.starttime}`);
  //   //   console.log("Appointment Start:", appointmentStart, "Current Time:", new Date());

  //   //   // Compare the appointment start time with the current time
  //   //   return appointmentStart >= new Date();
  //   // });

  //   const upcoming = todaysAppointments.filter(appointment => {
  //     const appointmentStart = new Date(`${appointment.date} ${appointment.starttime}`);
  //     const appointmentEnd = new Date(`${appointment.date} ${appointment.endtime}`);
  //     // Check if the current time is between the start and end times
  //     console.log("Appointment Start:", appointmentStart, "Current Time:", new Date(), "Appointment End:", appointmentEnd);
  //     return new Date() >= appointmentStart && new Date() < appointmentEnd;
  //   });

  //       setAppointments(data);
  //       setAppointmentsToday(todaysAppointments.length);
  //       setCancelledAppointments(cancelled.length);
  //       setPastAppointments(past);

  //       setUpcomingAppointments(upcoming);
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching appointments:", error);
  //     });
  // }, []);
  useEffect(() => {
    fetch("http://localhost:3001/web/get-appointments", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const todaysAppointments = data.filter((appointment) => {
          const appointmentDate = new Date(appointment.date);
          return appointmentDate.toDateString() === today.toDateString();
        });

        const cancelled = todaysAppointments.filter(
          (appointment) => appointment.status === "cancelled",
        );
        const past = todaysAppointments.filter((appointment) => {
          const appointmentEnd = new Date(
            `${appointment.date} ${appointment.endtime}`,
          );
          return appointmentEnd < new Date();
        });

        const upcoming = todaysAppointments.filter((appointment) => {
          const appointmentStart = new Date(
            `${appointment.date} ${appointment.starttime}`,
          );

          return (
            appointmentStart >= new Date() && appointment.status !== "cancelled"
          );
        });

        console.log("Today's Appointments:", todaysAppointments);
        console.log("Upcoming Appointments:", upcoming);

        setAppointments(data);
        setAppointmentsToday(todaysAppointments.length);
        setCancelledAppointments(cancelled.length);
        setPastAppointments(past);
        setUpcomingAppointments(upcoming);
      })
      .catch((error) => {
        console.error("Error fetching appointments:", error);
      });
  }, []);

  return (
    <>
      <Topbar pageTitle="Dashboard" />
      <div className="dashboard">
        {/* Top Section for Appointment Cards */}
        <div className="top-section-dashboard">
          <AppointmentCard
            title="Appointments Today"
            value={appointmentsToday}
            growth="5.11%"
          />
          <AppointmentCard
            title="Cancelled Appointments"
            value={cancelledAppointments}
            growth="-2.50%"
          />
          <AppointmentCard
            title="Total Hours"
            value={`${appointmentsToday} hr`}
            growth="7.11%"
          />
        </div>

        {/* Bottom Section for Past Appointments */}
        <div className="bottom-section-dashboard">
          <PastAppointmentsTable appointments={pastAppointments} />
        </div>

        {/* Right Section for Upcoming Appointments */}
        <div className="right-section">
          <UpcomingSchedule appointments={upcomingAppointments} />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
