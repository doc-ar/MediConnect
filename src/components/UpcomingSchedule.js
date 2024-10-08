import React from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/DashboardPage.css"
const UpcomingSchedule = ({ appointments }) => {
  const navigate = useNavigate();
  const handleStartAppointment = (appointmentId) => {
    navigate(`/soap-note-generation/${appointmentId}`);
  };

  return (
    <div >
      <h2>Upcoming Appointments</h2>
      <ul className='appointment-list'>
        {appointments.map((appointment, index) => (
          <li
            key={appointment.appointmentId}
        
          >
            <div>
              <strong>{appointment.startTime}</strong> - {appointment.patientName} ({appointment.purpose || 'General Check-up'})
            </div>
            <button
            
              onMouseOver={(e) => (e.target.style.backgroundColor = '#059669')}
              onMouseOut={(e) => (e.target.style.backgroundColor = '#10b981')}
              onClick={() => handleStartAppointment(appointment.appointmentId)}
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
