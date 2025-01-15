import React from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/DashboardPage.css"
const UpcomingSchedule = ({ appointments }) => {
  const navigate = useNavigate();
  const handleStartAppointment = (appointmentId, patientId) => {
    navigate(`/soap-note-generation/${appointmentId}/${patientId}`);
  };

  return (
    <div>
      <h2>Upcoming Appointments</h2>
      <ul className='appointment-list'>
        {appointments.map((appointment, index) => (
          <li key={appointment.appointmentid}>
            <div className='appointment-list-item'>
              <strong>{appointment.starttime}</strong> - <strong>{appointment.endtime}</strong> - {appointment.patientname} 
              <p>{appointment.date}</p>
              <p style={{ color: appointment.status === 'cancelled' ? 'red' : 'green' }}>
                {appointment.status}
              </p>
            </div>
            <button
              onClick={() => handleStartAppointment(appointment.appointmentid, appointment.patientid)}
            >
              Start Appointment
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UpcomingSchedule;
