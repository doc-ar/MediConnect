
import React from 'react';
import '../styles/PatientCard.css'; 
import { useNavigate } from 'react-router-dom';
const PatientCard = ({ patient }) => {
    const navigate = useNavigate();
   
    const handleViewProfile = () => {
        
        navigate(`/patients/${patient.patientid}`); 
      };
  return (
    <div className="patient-card">
      <img src={patient.image} alt={patient.name} className="patient-image" />
      <h3>{patient.name}</h3>
      <p>{patient.address}</p>
      <p>Weight: {patient.weight} lb</p>
      <p>Blood Pressure: {patient.bloodpressure} mmHg</p>
      <p>Blood Glucose: {patient.bloodglucose} mg/dL</p>
      <button className="patient-details-btn" onClick={handleViewProfile}>
        View patient detail
      </button>
    </div>
  );
};

export default PatientCard;
