import React, { useEffect, useState } from 'react';
import '../styles/SOAPNotesListPage.css';
import Topbar from '../components/TopBar';
function SOAPNotesListPage() {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState('');

  // Fetch patient data from API
  useEffect(() => {
    fetch('https://my-json-server.typicode.com/EmamaBilalKhan/MediConnect-API-2/Patients')
      .then((response) => response.json())
      .then((data) => setPatients(data))
      .catch((error) => console.error('Error fetching patients:', error));
  }, []);

  // Open Edit Modal
  // Open Edit Modal with formatted content
const handleEdit = (patient) => {
  setSelectedPatient(patient);

  // Get the full SOAP Note content as a formatted string
  const note = patient.SOAP_Notes?.[0];

  const formattedNote = `
    ${note.subjective.chief_complaint ? `Subjective:\n- Chief Complaint: ${note.subjective.chief_complaint}\n` : ''}
    ${note.subjective.history_of_present_illness ? `- History of Present Illness: ${note.subjective.history_of_present_illness}\n` : ''}
    ${note.subjective.past_psychiatric_history ? `- Past Psychiatric History: ${note.subjective.past_psychiatric_history}\n` : ''}
    ${note.subjective.medications ? `- Medications: ${note.subjective.medications}\n` : ''}
    ${note.subjective.allergies ? `- Allergies: ${note.subjective.allergies}\n` : ''}
    ${note.subjective.social_history ? `- Social History: ${note.subjective.social_history}\n` : ''}
    ${note.subjective.family_history ? `- Family History: ${note.subjective.family_history}\n` : ''}

    ${note.objective.mood ? `Objective:\n- Mood: ${note.objective.mood}\n` : ''}
    ${note.objective.affect ? `- Affect: ${note.objective.affect}\n` : ''}
    ${note.objective.thought_process ? `- Thought Process: ${note.objective.thought_process}\n` : ''}
    ${note.objective.speech ? `- Speech: ${note.objective.speech}\n` : ''}
    ${note.objective.judgment ? `- Judgment: ${note.objective.judgment}\n` : ''}

    ${note.assessment ? `Assessment:\n${note.assessment}\n` : ''}

    ${note.plan.medications ? `Plan:\n- Medications: ${note.plan.medications}\n` : ''}
    ${note.plan.therapy ? `- Therapy: ${note.plan.therapy}\n` : ''}
    ${note.plan.follow_up ? `- Follow Up: ${note.plan.follow_up}\n` : ''}
    ${note.plan.instructions ? `- Instructions: ${note.plan.instructions}\n` : ''}
  `.trim(); 

  setEditText(formattedNote);
  setIsEditing(true);
};


  // Save edited SOAP Note
  const handleUpdate = () => {
    if (!selectedPatient) return;

    // Update the patient's SOAP Note
    const updatedPatients = patients.map((patient) => {
      if (patient.patientid === selectedPatient.patientid) {
        const updatedNotes = [...patient.SOAP_Notes];
        if (updatedNotes[0]) {
          // Parse the editText back into the structured SOAP Note if needed
          updatedNotes[0].subjective.chief_complaint = extractField('Chief Complaint', editText);
          updatedNotes[0].subjective.history_of_present_illness = extractField('History of Present Illness', editText);
          updatedNotes[0].subjective.past_psychiatric_history = extractField('Past Psychiatric History', editText);
          updatedNotes[0].subjective.medications = extractField('Medications', editText);
          updatedNotes[0].subjective.allergies = extractField('Allergies', editText);
          updatedNotes[0].subjective.social_history = extractField('Social History', editText);
          updatedNotes[0].subjective.family_history = extractField('Family History', editText);
          updatedNotes[0].objective.mood = extractField('Mood', editText);
          updatedNotes[0].objective.affect = extractField('Affect', editText);
          updatedNotes[0].objective.thought_process = extractField('Thought Process', editText);
          updatedNotes[0].objective.speech = extractField('Speech', editText);
          updatedNotes[0].objective.judgment = extractField('Judgment', editText);
          updatedNotes[0].assessment = extractField('Assessment', editText);
          updatedNotes[0].plan.medications = extractField('Medications', editText);
          updatedNotes[0].plan.therapy = extractField('Therapy', editText);
          updatedNotes[0].plan.follow_up = extractField('Follow Up', editText);
          updatedNotes[0].plan.instructions = extractField('Instructions', editText);
        }
        return { ...patient, SOAP_Notes: updatedNotes };
      }
      return patient;
    });

    setPatients(updatedPatients);
    setIsEditing(false);
    setSelectedPatient(null);
    setEditText('');
  };

  // Helper function to extract fields from the formatted text
  const extractField = (label, text) => {
    const regex = new RegExp(`${label}:\\s*(.*)`, 'i');
    const match = text.match(regex);
    return match ? match[1].trim() : '';
  };

  // Cancel editing
  const handleCancel = () => {
    setIsEditing(false);
    setSelectedPatient(null);
    setEditText('');
  };

  // Delete SOAP Note
  const handleDelete = (patientId) => {
    const updatedPatients = patients.filter(patient => patient.patientid !== patientId);
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
    .filter((patient) => patient.SOAP_Notes && patient.SOAP_Notes.length > 0)
          .map((patient) => (
            <tr key={patient.patientid}>
              <td>
                <div className="soapnote-patient-info">
                <img src={patient.image} alt={patient.name} style={{ width: '50px', height: '50px', borderRadius: '50%' }} />
                {patient.name}
                </div>
              </td>
              <td>
                {patient.SOAP_Notes?.length > 0 && patient.SOAP_Notes[0].LastUpdated
                  ? new Date(patient.SOAP_Notes[0].LastUpdated).toLocaleDateString()
                  : 'N/A'}
              </td>
              <td className='soapnote-action-btn'>
                <button onClick={() => handleEdit(patient)}>Edit</button>
                <button onClick={() => handleDelete(patient.patientid)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>




        
      </table>

      {/* Edit Modal */}
      {isEditing && (
        <div className="modal">
          <div className="modal-content">
            <h2>Edit SOAP Note</h2>
            <textarea
              rows="20"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              style={{ width: '100%' }}
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
