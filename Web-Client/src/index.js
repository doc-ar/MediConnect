import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import App from './App';
import { Provider } from 'react-redux';
import { store } from './app/store';
import PatientPage from "./pages/PatientPage";
import SOAPNoteGenerationPage from './pages/SOAPNoteGenerationPage';
import PatientList from './pages/PatientList';
import Appointment from './pages/Appointment';
import DashboardPage from './pages/DashboardPage';
import SOAPNotesListPage from './pages/SOAPNotesListPage';
import SettingsPage from './pages/SettingsPage';
import Login from './pages/Login'; 
import Signup from './pages/Signup'; 
import { registerLicense } from '@syncfusion/ej2-base';
import Sidebar from './components/Sidebar';
import './index.css';
registerLicense('Ngo9BigBOggjHTQxAR8/V1NCaF5cXmZCf1FpRmJGdld5fUVHYVZUTXxaS00DNHVRdkdnWXZednVRR2FeVkF/V0Y=');

function Layout() {
  const location = useLocation();
  const hideSidebar = location.pathname === '/login' || location.pathname === '/signup';

  return (
    <div style={{ display: "flex", margin: '0px' }}>
      {!hideSidebar && <Sidebar />}
      <div style={{ flex: 1, backgroundColor: '#f7f9fc', marginLeft: hideSidebar ? '0px' : '240px'}}>
      <div className="content-wrapper">
        <Routes>
          <Route path="*" element={<App />} />
          <Route path="/soap-note-generation/:appointmentId" element={<SOAPNoteGenerationPage />} />
          <Route path="/patients-list" element={<PatientList />} />
          <Route path="/patients/:id" element={<PatientPage />} />
          <Route path="/appointments" element={<Appointment />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/soap-notes" element={<SOAPNotesListPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
        </div>
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <Router>
      <Layout />
    </Router>
  </Provider>
);
