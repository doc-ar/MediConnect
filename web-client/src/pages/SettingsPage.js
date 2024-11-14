import React, { useEffect, useState } from 'react';
import '../styles/SettingsPage.css';
import Topbar from '../components/TopBar';

const SettingsPage = () => {
  const [doctorData, setDoctorData] = useState(null);
  const [formData, setFormData] = useState({
    Name: '',
    email: '',
    password: '',
    contact: '',
    room: '',
    designation: '',
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Fetching user data from the API
    fetch('https://my-json-server.typicode.com/EmamaBilalKhan/MediConnect-API-3/Doctors')
      .then(response => response.json())
      .then(data => {
        const user = data[1]; // Assuming the first doctor in the list is the logged-in user.
        setDoctorData(user);
        setFormData({
          Name: user.name,
          email: user.email,
          password: user.password,
          contact: user.contact,
          roomNo: user.roomno,
          designation: user.designation
        });
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSaveChanges = () => {
    setIsSaving(true); // Set saving state

    // Update the user data with a PUT request
    fetch(`https://my-json-server.typicode.com/EmamaBilalKhan/MediConnect-API-3/Doctors/${doctorData.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to update data');
      }
      return response.json();
    })
    .then(updatedData => {
      setDoctorData(updatedData);
      alert('Changes saved successfully!');
    })
    .catch(error => {
      console.error('Error updating data:', error);
      alert('Failed to save changes.');
    })
    .finally(() => {
      setIsSaving(false); // Reset saving state
    });
  };

  return (
    <><Topbar pageTitle="Settings" />
    <div className="settings-page">
      {doctorData ? (
        <div className="settings-container">
          <h3>{doctorData.name} / {doctorData.designation}</h3>
          <p>Update and Manage your Account</p>

          <div className="settings-field">
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={formData.Name}
              onChange={handleChange} />
          </div>

          <div className="settings-field">
            <label>Designation:</label>
            <input
              type="text"
              name="designation"
              value={formData.designation}
              onChange={handleChange} />
          </div>

          <div className="settings-field">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange} />
          </div>

          <div className="settings-field">
            <label>Current Password:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange} />
          </div>

          <div className="settings-field">
            <label>Contact #:</label>
            <input
              type="text"
              name="contact"
              value={formData.contact}
              onChange={handleChange} />
          </div>

          <div className="settings-field">
            <label>Room #:</label>
            <input
              type="text"
              name="room"
              value={formData.roomNo}
              onChange={handleChange} />
          </div>
          <div className="setting-btns">
            <button
              className="save-changes-btn"
              onClick={handleSaveChanges}
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>

            <button className="delete-account-btn">
              Delete Account
            </button>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div></>
  );
};

export default SettingsPage;
