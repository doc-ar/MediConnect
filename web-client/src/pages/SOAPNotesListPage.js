import React, { useEffect, useState } from "react";
import "../styles/SOAPNotesListPage.css";
import Topbar from "../components/TopBar";
import { selectCurrentAccessToken } from "../features/authSlice";
import { useSelector } from "react-redux";

function SOAPNotesListPage() {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState("");
  const accessToken = useSelector(selectCurrentAccessToken);

  // Fetch patient data from API
  useEffect(() => {
    fetch("http://localhost:3001/web/get-patients", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("API response data:", data); // Log the entire response data
        setPatients(Array.isArray(data) ? data : []);
      })
      .catch((error) => console.error("Error fetching patients:", error));
  }, [accessToken]);

  // Open Edit Modal with formatted SOAP note content

  const handleEdit = (patient) => {
    setSelectedPatient(patient);

    const note = patient.soap_notes;

    if (note) {
      const formattedNote = `
      Subjective:
      - ${note.subjective || "N/A"}


      Objective:
      - ${note.objective || "N/A"}
      

      Assessment: 
      - ${note.assessment || "N/A"}

      Plan:
      - ${note.plan || "N/A"}
      
    `.trim();

      setEditText(formattedNote);
      setIsEditing(true);
    } else {
      console.log("No SOAP notes found for this patient");
    }
  };

  // Update SOAP note and send to API
  const handleUpdate = () => {
    if (!selectedPatient) return;

    const soapNoteId = selectedPatient.soap_note_id;
    console.log("SOAP note ID:", soapNoteId);
    if (!soapNoteId) {
      console.error("SOAP note ID is missing.");
      return;
    }

    const updatedSoapNoteData = {
      subjective: extractField("Subjective", editText),
      objective: extractField("Objective", editText),
      assessment: extractField("Assessment", editText),
      plan: extractField("Plan", editText),
    };

    console.log("Updated SOAP note data:", updatedSoapNoteData);

    // Send the updated data to the API
    fetch("http://localhost:3001/web/update-soapnote", {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        soap_note_id: soapNoteId,
        soap_note_data: updatedSoapNoteData,
      }),
    })
      .then((response) => {
        if (response.ok) {
          // Update the local state to reflect the changes
          const updatedPatients = patients.map((patient) => {
            if (patient.patientid === selectedPatient.patientid) {
              return {
                ...patient,
                soap_notes: {
                  ...patient.soap_notes, // Preserve other existing fields
                  ...updatedSoapNoteData, // Overwrite with the updated data
                },
              };
            }
            return patient;
          });
          setPatients(updatedPatients);
          setIsEditing(false);
          setSelectedPatient(null);
          setEditText("");
        } else {
          console.error("Failed to update SOAP note:", response.statusText);
        }
      })
      .catch((error) => console.error("Error updating SOAP note:", error));
  };

  const extractField = (label, text) => {
    const regex = new RegExp(`${label}:\\s*(.*)`, "i");
    const match = text.match(regex);
    return match ? match[1].trim() : "";
  };

  const handleCancel = () => {
    setIsEditing(false);
    setSelectedPatient(null);
    setEditText("");
  };

  const handleDelete = (patientId) => {
    const updatedPatients = patients.filter(
      (patient) => patient.patientid !== patientId,
    );
    setPatients(updatedPatients);
  };

  return (
    <div>
      <Topbar pageTitle="SOAP Notes" />
      <table>
        <thead>
          <tr>
            <th>Patient Name</th>
            <th>Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {patients
            .filter(
              (patient) =>
                patient.soap_notes &&
                Object.keys(patient.soap_notes).length > 0,
            )
            .map((patient, index) => (
              <tr key={patient.patientid || index}>
                <td>
                  <div className="soapnote-patient-info">
                    <img
                      src={
                        patient.image ||
                        "https://www.vecteezy.com/png/20911746-user-profile-icon-profile-avatar-user-icon-male-icon-face-icon-profile-icon"
                      }
                      alt={patient.name}
                      style={{
                        width: "50px",
                        height: "50px",
                        borderRadius: "50%",
                      }}
                    />
                    {patient.name}
                  </div>
                </td>
                <td>
                  {patient.soap_notes?.LastUpdated
                    ? new Date(
                        patient.soap_notes.LastUpdated,
                      ).toLocaleDateString()
                    : "N/A"}
                </td>
                <td className="soapnote-action-btn">
                  <button onClick={() => handleEdit(patient)}>Edit</button>
                  <button onClick={() => handleDelete(patient.patientid)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      {isEditing && (
        <div className="modal">
          <div className="modal-content">
            <h2>Edit SOAP Note</h2>
            <textarea
              rows="20"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              style={{ width: "100%" }}
            />
            <div className="modal-actions">
              <button onClick={handleUpdate}>Update</button>
              <button onClick={handleCancel}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SOAPNotesListPage;
