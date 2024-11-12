import React from 'react';
import "../styles/DashboardPage.css"
import { useNavigate } from 'react-router-dom';
const PastAppointmentsTable = ({ appointments }) => {
  const navigate = useNavigate();

  const navigateToPatientProfile = (patientId) => {
    navigate(`/patients/${patientId}`);
  }
  return (
    <div >
      <h2>Today's Past Appointments</h2>
      <table >
        <thead>
          <tr>
            <th>Appointment ID</th>
            <th>Patient Name</th>
            <th>Doctor Name</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((appointment) => (
            <tr key={appointment.appointmentId}>
              <td>{appointment.appointmentId}</td>
              <td>{appointment.patientName}</td>
              <td>{appointment.doctorName}</td>
              <td>{appointment.status}</td>
              <td>
                <button className='button-dashboard'  onMouseOver={(e) => (e.target.style.backgroundColor = '#2563eb')} onMouseOut={(e) => (e.target.style.backgroundColor = '#3b82f6')} onClick={() => navigateToPatientProfile()}>
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
