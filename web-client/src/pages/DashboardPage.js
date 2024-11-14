import React, { useEffect, useState } from 'react';
import '../styles/DashboardPage.css'; 
import AppointmentCard from '../components/AppointmentCard';
import PastAppointmentsTable from '../components/PastAppointmentsTable';
import UpcomingSchedule from '../components/UpcomingSchedule';
import Topbar from '../components/TopBar';

const Dashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [appointmentsToday, setAppointmentsToday] = useState(0);
  const [cancelledAppointments, setCancelledAppointments] = useState(0);
  const [pastAppointments, setPastAppointments] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);

  useEffect(() => {
    // Fetch appointments from the API
    fetch('https://my-json-server.typicode.com/EmamaBilalKhan/MediConnect-API/Appointments')
  .then((response) => response.json())  
  .then((data) => {
    const todayDate = new Date();
    const today = todayDate.toLocaleDateString('en-CA', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }); 

    const todaysAppointments = data.filter(appointment => appointment.date === today);
    
    const cancelled = todaysAppointments.filter(appointment => appointment.status === 'cancelled');
    const past = todaysAppointments.filter(appointment => new Date(`${appointment.date} ${appointment.endTime}`) < new Date());
    const upcoming = todaysAppointments.filter(appointment => new Date(`${appointment.date} ${appointment.startTime}`) > new Date());
    
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
          <AppointmentCard title="Appointments Today" value={appointmentsToday} growth="5.11%" />
          <AppointmentCard title="Cancelled Appointments" value={cancelledAppointments} growth="-2.50%" />
          <AppointmentCard title="Total Hours" value={`${appointmentsToday} hr`} growth="7.11%" />
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
