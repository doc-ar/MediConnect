import React, { useEffect, useState } from 'react';
import '../styles/SettingsPage.css';
import Topbar from '../components/TopBar';
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentAccessToken, logout } from '../features/authSlice';
import { useNavigate } from 'react-router-dom';

const SettingsPage = () => {
  const [doctorData, setDoctorData] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    qualification: '',
    contact: '',
    roomno: '',
    designation: '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const accessToken = useSelector(selectCurrentAccessToken);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    fetch('https://mediconnect.live/web/doctor-data', {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        if (response.headers.get("content-length") === "0") {
          throw new Error("No data received from API.");
        }
        return response.json();
      })
      .then(data => {
        setDoctorData(data);
        setFormData({
          name: data.name || '',
          email: data.email || '',
          qualification: data.qualification || '',
          contact: data.contact || '',
          roomno: data.roomno || '',
          designation: data.designation || '',
        });
      })
      .catch(error => console.error('Error fetching data:', error));
  }, [accessToken]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSaveChanges = () => {
    setIsSaving(true);

    fetch('https://mediconnect.live/web/update-doctor', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify(formData)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Failed to update data. Status: ${response.status}`);
      }
      return response.json();
    })
    .then(updatedData => {
      setDoctorData(updatedData);
      alert('Changes saved successfully!');
    })
    .catch(error => console.error('Error updating data:', error))
    .finally(() => setIsSaving(false));
  };

  const handlePasswordChange = () => {
    fetch('https://mediconnect.live/auth/change-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify({
        old_password: oldPassword,
        new_password: newPassword
      })
    })
    .then(response => response.json())
    .then(data => {
      setPasswordMessage(data.message);
      setOldPassword('');
      setNewPassword('');
      setIsPasswordModalOpen(false);
      dispatch(logout());
      navigate('/login', { replace: true });
      window.history.pushState(null, null, '/login');
      window.addEventListener('popstate', () => {
        navigate('/login', { replace: true });
      });
    })
    .catch(error => {
      console.error('Error changing password:', error);
      setPasswordMessage('Error changing password. Please try again.');
    });
  };

  return (
    <>
      <Topbar pageTitle="Settings" />
      <div className="settings-page">
        {doctorData ? (
          <div className="settings-container">
            <h3>{doctorData.name} / {doctorData.designation}</h3>
            <p>Update and Manage your Account</p>

            <div className="settings-field">
              <label>Name:</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} />
            </div>

            <div className="settings-field">
              <label>Qualification:</label>
              <input type="text" name="qualification" value={formData.qualification} onChange={handleChange} />
            </div>

            <div className="settings-field">
              <label>Specialization:</label>
              <input type="text" name="designation" value={formData.designation} onChange={handleChange} />
            </div>

            <div className="settings-field">
              <label>Email:</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} />
            </div>

            <div className="settings-field">
              <label>Contact #:</label>
              <input type="text" name="contact" value={formData.contact} onChange={handleChange} />
            </div>

            <div className="settings-field">
              <label>Room #:</label>
              <input type="text" name="roomno" value={formData.roomno} onChange={handleChange} />
            </div>

            <div className="setting-btns">
              <button className="save-changes-btn" onClick={handleSaveChanges} disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
              <button className="change-password-btn" onClick={() => setIsPasswordModalOpen(true)}>
                Change Password
              </button>
            </div>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>

      {isPasswordModalOpen && (
        <div className="modal-overlay">
          <div className="password-modal">
            <h3>Change Password</h3>
            <input
              type="password"
              placeholder="Current Password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <button onClick={handlePasswordChange}>Submit</button>
            <button onClick={() => setIsPasswordModalOpen(false)}>Cancel</button>
            {passwordMessage && <p>{passwordMessage}</p>}
          </div>
        </div>
      )}
    </>
  );
};

export default SettingsPage;