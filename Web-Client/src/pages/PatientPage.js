import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/PatientPage.css'; 

const PatientPage = () => {
    const { id } = useParams();  // Get the patient ID from the URL
    const [patientData, setPatientData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);


    useEffect(() => {
        fetch('https://my-json-server.typicode.com/EmamaBilalKhan/MediConnect-API-2/Patients')
            .then(response => response.json())
            .then(data => {
                const patient = data.find(p => p.patientid === id);
                setPatientData(patient);
                setIsLoading(false);
            })
            .catch(error => {
                console.error('Error fetching patient data:', error);
                setIsLoading(false);
            });
    }, [id]);

    if (isLoading) {
        return <div className='loading-state'>Loading...</div>;
    }

    if (!patientData) {
        return <div className='loading-state'>No data found for this patient</div>;
    }

    return (
        <div className="patient-profile-container">
            
            <div className="patient-info">
                <div className="patient-header">
                    <img src={patientData.image} alt={patientData.name} className="patient-photo" />
                    <div>
                        <h2>{patientData.name}</h2>
                        <p>{patientData.gender}, Age {patientData.Age}</p> 
                        <p>{patientData.email}</p>
                    </div>
                </div>
                <div className="vitals-section">
                    <h3>Latest Vitals</h3>
                    <div className="vitals-grid">
                        <div><p>Blood Glucose</p><strong>{patientData.bloodglucose} mg/dl</strong></div>
                        <div><p>Blood Pressure</p><strong>{patientData.bloodpressure}</strong></div>
                        <div><p>Weight</p><strong>{patientData.weight} kg</strong></div>
                    </div>
                </div>
            </div>

            

            
            <div className="follow-up-section">
                <h3>Contact Info</h3>
                <p>{patientData.contact}</p> 
            </div>

            
        </div>
    );
};

export default PatientPage;
