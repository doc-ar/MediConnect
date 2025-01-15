import React from 'react';
import "../styles/DashboardPage.css"
import { useNavigate } from 'react-router-dom';
const PastAppointmentsTable = ({ appointments }) => {
  const navigate = useNavigate();

  const navigateToPatientProfile = (patientid) => {
    navigate(`/patients/${patientid}`);
  }
  return (
    <div >
      <h2>Today's Past Appointments</h2>
      <table >
        <thead>
          <tr>
            
            <th>Patient Name</th>
            <th>Doctor Name</th>
            <th>Start Time</th>
            <th>End Time</th>
            <th>Profile</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((appointment) => (
            <tr key={appointment.appointmentid}>
              
              <td>{appointment.patientname}</td>
              <td>{appointment.doctorname}</td>
              <td>{appointment.starttime}</td>
              <td>{appointment.endtime}</td>
              
              <td>
                <button className='button-dashboard'  onMouseOver={(e) => (e.target.style.backgroundColor = '#2563eb')} onMouseOut={(e) => (e.target.style.backgroundColor = '#3b82f6')} onClick={() => navigateToPatientProfile(appointment.patientid)}>
                  Profile
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PastAppointmentsTable;
