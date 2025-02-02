import React, { useState, useEffect } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import "../styles/SOAPNoteGenerationPage.css";
import { FaMicrophone } from "react-icons/fa";
import { useParams } from "react-router-dom";
import TopBar from "../components/TopBar";
import ReactMarkdown from "react-markdown";
import Select from "react-select";
import { useSelector } from "react-redux";
import { selectCurrentAccessToken } from "../features/authSlice";

const SOAPNoteGenerationPage = () => {
  const { appointmentId, patientId } = useParams();
  const [recording, setRecording] = useState(false);
  const [soapNotes, setSoapNotes] = useState({
    subjective: "",
    objective: "",
    assessment: "",
    plan: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const { transcript, resetTranscript } = useSpeechRecognition();
  const [prescription, setPrescription] = useState([]); // Array to hold prescription entries
  const [newPrescriptionEntry, setNewPrescriptionEntry] = useState({
    Dosage: "",
    Duration: "",
    Medicine: "",
    Frequency: "",
  });
  const [pastPrescriptions, setPastPrescriptions] = useState([]); // To hold past prescriptions
  const [medicines, setMedicines] = useState([]); // To hold medicine options
  const [geminiUse, setGeminiUse] = useState(true);
  const accessToken = useSelector(selectCurrentAccessToken);

  useEffect(() => {
    // Fetch past prescriptions for the patient when the component mounts
    const fetchPastPrescriptions = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/web/get-prescriptions/${patientId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );

        const data = await response.json();
        console.log(data);
        if (data && data.length > 0) {
          setPastPrescriptions(data);
        } else {
          console.warn("No past prescriptions found for this patient.");
        }
      } catch (error) {
        console.error("Error fetching past prescriptions:", error);
      }
    };

    fetchPastPrescriptions();
  }, [patientId, accessToken]);

  useEffect(() => {
    // Fetch medicines from the API
    const fetchMedicines = async () => {
      try {
        const response = await fetch(
          "http://localhost:3001/web/get-medicines",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );

        const text = await response.text(); // raw text
        const data = JSON.parse(text); // Parse JSON if valid
        const medicineOptions = data.map((medicine) => ({
          value: medicine.medicine_id, // Use `medicine_id` from the API response
          label: `${medicine.medicine_name}`,
          medicine_formula: medicine.medicine_formula || "N/A",
          medicine_strength: medicine.medicine_strength || "N/A",
          price: medicine.price || "N/A",
        }));
        setMedicines(medicineOptions);
      } catch (error) {
        console.error("Error fetching medicines:", error);
      }
    };

    fetchMedicines();
  });

  const startRecording = () => {
    setRecording(true);
    resetTranscript();
    SpeechRecognition.startListening({ continuous: true });
  };

  const stopRecording = async () => {
    setRecording(false);
    SpeechRecognition.stopListening();

    await fetch("http://localhost:3001/web/new-transcription", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ appointment_id: appointmentId, transcript }),
    });

    if (transcript) {
      setIsLoading(true);
      try {
        const response = await fetch(
          "http://localhost:3001/web/generate-soap-notes",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
              transcript,
              geminiUse,
              patient_id: patientId,
            }),
          },
        );

        const data = await response.json();
        if (response.ok) {
          const { subjective, objective, assessment, plan } = data.soap_notes;
          console.log("SOAP notes generated:", {
            subjective,
            objective,
            assessment,
            plan,
          });
          setSoapNotes({
            subjective,
            objective,
            assessment,
            plan,
          });
        } else {
          setSoapNotes({
            subjective: "Error generating SOAP notes. Please try again.",
          });
        }
      } catch (error) {
        console.error("Error generating SOAP notes:", error);
        setSoapNotes({
          subjective: "Error generating SOAP notes. Please try again.",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };
  const toggleGeminiUse = () => {
    setGeminiUse((prev) => !prev); // Toggle the boolean value
  };

  const handleSaveSOAPNotes = async () => {
    const Postpayload = {
      soap_note_data: {
        subjective: soapNotes.subjective,
        objective: soapNotes.objective,
        assessment: soapNotes.assessment,
        plan: soapNotes.plan,
      },
      patient_id: patientId,
    };

    try {
      // Step 1: Check for existing SOAP notes
      const getResponse = await fetch(
        `http://localhost:3001/web/get-soapnotes/${patientId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      if (!getResponse.ok) {
        console.error(
          `Error fetching SOAP notes: ${getResponse.status} ${getResponse.statusText}`,
        );
        alert("Error fetching SOAP notes. Please try again.");
        return;
      }
      let prevsoapNotesData;
      try {
        prevsoapNotesData = await getResponse.json();
      } catch (error) {
        console.error("Error parsing JSON from GET response:", error);
        alert("Error reading SOAP notes. Please try again.");
        return;
      }

      // const prevsoapNotesData = await getResponse.json();

      console.log("this is the prev soap note", prevsoapNotesData);
      let response;
      if (prevsoapNotesData && prevsoapNotesData.soap_note_id) {
        // If notes exist, make a PATCH request
        const Patchpayload = {
          soap_note_id: prevsoapNotesData.soap_note_id,
          soap_note_data: {
            subjective: soapNotes.subjective,
            objective: soapNotes.objective,
            assessment: soapNotes.assessment,
            plan: soapNotes.plan,
          },
        };
        response = await fetch(`http://localhost:3001/web/update-soapnote`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(Patchpayload),
        });
      } else {
        // If no notes exist, make a POST request
        response = await fetch(`http://localhost:3001/web/new-soapnote`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(Postpayload),
        });
      }

      // Step 3: Handle the response
      if (response.ok) {
        alert("SOAP notes saved successfully.");
      } else {
        const errorData = await response.json();
        console.error("Error response from API:", errorData);
        alert("Error saving SOAP notes. Please try again.");
      }
    } catch (error) {
      console.error("Error saving SOAP notes:", error);
      alert("Error saving SOAP notes. Please try again.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPrescriptionEntry((prevEntry) => ({
      ...prevEntry,
      [name]: value,
    }));
  };

  const handleMedicineChange = (selectedOption) => {
    setNewPrescriptionEntry((prev) => ({
      ...prev,
      Medicine: selectedOption ? selectedOption.label : "",
    }));
  };
  // Add a new prescription entry to the array
  const handleAddPrescription = () => {
    const { Dosage, Duration, Medicine, Frequency } = newPrescriptionEntry;
    if (!Dosage || !Duration || !Medicine || !Frequency) {
      alert("Please fill in all fields before adding a prescription.");
      return; // Stop execution if validation fails
    }
    setPrescription((prevPrescriptions) => [
      ...prevPrescriptions,
      newPrescriptionEntry,
    ]);
    setNewPrescriptionEntry({
      Dosage: "",
      Duration: "",
      Medicine: "",
      Frequency: "",
    }); // Reset form
    console.log(prescription);
  };

  const handlePrescriptionSubmit = async (e) => {
    e.preventDefault();

    // Check if the prescription list is empty
    if (prescription.length === 0) {
      alert("Please add at least one prescription before submitting.");
      return;
    }

    // Map the prescription array to the required structure
    const formattedPrescriptionData = prescription.map((entry) => {
      const selectedMedicine = medicines.find(
        (med) => med.label === entry.Medicine,
      );
      if (!selectedMedicine) {
        alert(`Medicine "${entry.Medicine}" is invalid. Please re-select it.`);
        return null;
      }
      return {
        medicine_id: selectedMedicine.value, // Use medicine_id from the medicines list
        medicine_name: entry.Medicine, // Medicine name
        medicine_formula: selectedMedicine.medicine_formula || "N/A", // Assume formula is part of fetched medicine data
        medicine_strength: selectedMedicine.medicine_strength || "N/A", // Assume strength is part of fetched medicine data
        price: selectedMedicine.price || "N/A", // Assume price is part of fetched medicine data
        medicine_frequency: entry.Frequency,
        dosage: entry.Dosage,
        duration: entry.Duration,
      };
    });

    // Filter out any null entries
    if (formattedPrescriptionData.some((item) => item === null)) {
      return; // Exit if there are invalid entries
    }

    const payload = {
      appointment_id: appointmentId,
      prescription_data: formattedPrescriptionData,
    };

    try {
      const response = await fetch(
        "http://localhost:3001/web/new-prescription",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(payload),
        },
      );

      if (response.ok) {
        alert("Prescription submitted successfully");
        console.log(formattedPrescriptionData);
        setPrescription([]); // Clear the prescription array
      } else {
        const errorData = await response.json();
        console.error("Error response from API:", errorData);
        alert("Error submitting prescription. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting prescription:", error);
      alert("Error submitting prescription. Please try again.");
    }
  };

  return (
    <div className="soap-note-page-container">
      <TopBar pageTitle="Soap Note Generation" />
      <div className="soap-note-page">
        <div className="top-section">
          <div className="card">
            <button
              className="record-button"
              onClick={recording ? stopRecording : startRecording}
            >
              <FaMicrophone size={50} />
            </button>
            <p>
              {recording
                ? "Recording in progress..."
                : "Click to Start Recording"}
            </p>
          </div>
          <div className="transcription-box">
            <h3>Transcription</h3>
            <p className={transcript ? "recording-text" : ""}>
              {transcript || "Your text appears here"}
            </p>
          </div>
        </div>
        <label>
          <input
            type="checkbox"
            checked={geminiUse}
            onChange={toggleGeminiUse} // Toggle when checkbox changes
          />
          Use Gemini
        </label>
        <div className="bottom-section soap-notes-box">
          <h3>SOAP Notes</h3>
          {isLoading ? (
            <p>Generating SOAP notes...</p>
          ) : (
            <ReactMarkdown className="soap-notes-content">
              {isLoading
                ? "Generating SOAP notes..."
                : `${soapNotes.subjective ? `### Subjective\n${soapNotes.subjective}\n\n` : ""}${soapNotes.objective ? `### Objective\n${soapNotes.objective}\n\n` : ""}${soapNotes.assessment ? `### Assessment\n${soapNotes.assessment}\n\n` : ""}${soapNotes.plan ? `### Plan\n${soapNotes.plan}` : ""}` ||
                  "Your SOAP notes are generated here"}
            </ReactMarkdown>
          )}
        </div>
        <div className="soap-notes-action">
          {soapNotes.subjective ||
          soapNotes.objective ||
          soapNotes.assessment ||
          soapNotes.plan ? (
            <button
              onClick={handleSaveSOAPNotes}
              className="save-soap-notes-button"
            >
              Save SOAP Notes
            </button>
          ) : null}
        </div>

        <div className="bottom-section prescription-box">
          <h3>Prescription Entry</h3>
          <form>
            <Select
              options={medicines}
              name="Medicine"
              value={
                medicines.find(
                  (option) => option.label === newPrescriptionEntry.Medicine,
                ) || null
              } // Bind the selected value
              onChange={handleMedicineChange}
              placeholder="Search Medicine"
              className="prescription-input select-dropdown"
              isClearable
            />
            <input
              type="text"
              name="Dosage"
              value={newPrescriptionEntry.Dosage}
              placeholder="Dosage (e.g., 1 tablet)"
              onChange={handleInputChange}
              className="prescription-input"
              required
            />

            <input
              type="text"
              name="Frequency"
              value={newPrescriptionEntry.Frequency}
              placeholder="Frequency (e.g., 2/day)"
              onChange={handleInputChange}
              className="prescription-input"
              required
            />
            <input
              type="text"
              name="Duration"
              value={newPrescriptionEntry.Duration}
              placeholder="Duration (e.g., 10 days)"
              onChange={handleInputChange}
              className="prescription-input"
              required
            />
            <button
              type="button"
              onClick={handleAddPrescription}
              className="medicine-add-button"
            >
              Add to List
            </button>
            <button
              type="submit"
              onClick={handlePrescriptionSubmit}
              className="prescription-submit-button"
            >
              Submit Prescription
            </button>
          </form>

          <div className="prescription-list">
            <h4>Current Prescription List</h4>
            <ul>
              {prescription.map((entry, index) => (
                <li key={index}>
                  {`${entry.Medicine}, Dosage: ${entry.Dosage}, Frequency: ${entry.Frequency}, Duration: ${entry.Duration}`}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="bottom-section past-prescriptions">
          <h3>Past Prescriptions</h3>
          <ul>
            {pastPrescriptions.length > 0 ? (
              pastPrescriptions.map((prescription, index) => (
                <li key={index}>
                  <p>
                    <strong>Date:</strong> {prescription.date || "N/A"}
                  </p>
                  {prescription.medication &&
                  prescription.medication.length > 0 ? (
                    prescription.medication.map((med, idx) => (
                      <p key={idx}>
                        {`${med.medicine_name || ""}, Dosage: ${med.dosage || ""}, Strength: ${med.medicine_strength || ""}, Frequency: ${med.medicine_frequency || ""}, Duration: ${med.duration || ""}`}
                      </p>
                    ))
                  ) : (
                    <p>No medication details available.</p>
                  )}
                </li>
              ))
            ) : (
              <p>No past prescriptions found.</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SOAPNoteGenerationPage;
