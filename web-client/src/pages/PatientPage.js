import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../styles/PatientPage.css";
import { selectCurrentAccessToken } from "../features/authSlice";
import { useSelector } from "react-redux";
const PatientPage = () => {
  const { id } = useParams(); // Get the patient ID from the URL
  const [patientData, setPatientData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const accessToken = useSelector(selectCurrentAccessToken);

  useEffect(() => {
    fetch("http://localhost:3001/web/get-patients", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        const patient = data.find((p) => p.patientid === id);
        setPatientData(patient);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching patient data:", error);
        setIsLoading(false);
      });
  }, [id]);

  if (isLoading) {
    return <div className="loading-state">Loading...</div>;
  }

  if (!patientData) {
    return <div className="loading-state">No data found for this patient</div>;
  }

  return (
    <div className="patient-profile-container">
      <div className="patient-info">
        <div className="patient-header">
          <img
            src={patientData.image}
            alt={patientData.name}
            className="patient-photo"
          />
          <div>
            <h2>{patientData.name}</h2>
            <p>
              {patientData.gender}, Age {patientData.Age}
            </p>
            <p>{patientData.email}</p>
          </div>
        </div>
        <div className="vitals-section">
          <h3>Latest Vitals</h3>
          <div className="vitals-grid">
            <div>
              <p>Blood Glucose</p>
              <strong>{patientData.bloodglucose} mg/dl</strong>
            </div>
            <div>
              <p>Blood Pressure</p>
              <strong>{patientData.bloodpressure}</strong>
            </div>
            <div>
              <p>Weight</p>
              <strong>{patientData.weight} kg</strong>
            </div>
          </div>
        </div>
      </div>

      <div className="follow-up-section">
        <h3>Contact Info</h3>
        <p>{patientData.contact}</p>
        <h3 className="report-title">Patient Reports</h3>
        <ul className="report-list">
          {patientData.reports.map((report, index) => (
            <li className="report-item" key={index}>
              <a href={report.url} target="_blank" rel="noopener noreferrer">
                {report.name}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PatientPage;
