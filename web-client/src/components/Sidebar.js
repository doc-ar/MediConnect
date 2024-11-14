import React from "react";
import { useNavigate } from "react-router-dom";
import { FaTachometerAlt, FaCalendarAlt, FaNotesMedical, FaUserFriends, FaCog, FaQuestionCircle } from "react-icons/fa";
import '../styles/Sidebar.css';

const Sidebar = () => {
  const navigate = useNavigate();

  return (
    <div className="sidebar">
      <ul>
        <li onClick={() => navigate('/dashboard')}>
          <FaTachometerAlt /> Dashboard
        </li>
        <li onClick={() => navigate('/appointments')}>
          <FaCalendarAlt /> Appointments
        </li>
        <li onClick={() => navigate('/soap-notes')}>
          <FaNotesMedical /> SOAP Notes
        </li>
        <li onClick={() => navigate('/patients-list')}>
          <FaUserFriends /> Patients
        </li>
        <li onClick={() => navigate('/settings')}>
          <FaCog /> Settings
        </li>
      
      </ul>
    </div>
  );
};

export default Sidebar;
