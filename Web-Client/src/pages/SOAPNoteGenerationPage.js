import React, { useState } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import '../styles/SOAPNoteGenerationPage.css';
import { FaMicrophone } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import TopBar from '../components/TopBar';

const SOAPNoteGenerationPage = () => {
  const { appointmentId } = useParams();
  const [recording, setRecording] = useState(false);
  const [soapNotes, setSoapNotes] = useState('');
  const { transcript, resetTranscript } = useSpeechRecognition();

  const startRecording = () => {
    setRecording(true);
    resetTranscript();
    SpeechRecognition.startListening({ continuous: true });
  };

  const stopRecording = () => {
    setRecording(false);
    SpeechRecognition.stopListening();
    setSoapNotes("Generated SOAP Notes based on the transcription");
  };

  return (
    <div className="soap-note-page-container">
      <TopBar pageTitle="Soap Note Generation" />
      <div className="soap-note-page">
      <div className="top-section">
        <div className="card">
          <button className="record-button" onClick={recording ? stopRecording : startRecording}>
            <FaMicrophone size={50} />
          </button>
          <p>{recording ? 'Recording in progress...' : 'Click to Start Recording'}</p>
        </div>
        <div className="transcription-box">
          <h3>Transcription</h3>
          <p className={transcript ? "recording-text" : ""}>
            {transcript || 'Your text appears here'}
          </p>
        </div>
      </div>
      <div className="bottom-section soap-notes-box">
        <h3>SOAP Notes</h3>
        <p>{soapNotes || 'Your SOAP notes are generated here'}</p>
      </div>
      </div>
    </div>
  );
};

export default SOAPNoteGenerationPage;
