import React, { useState } from 'react';
import '../styles/SettingsPage.css';

const SettingsPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSave = () => {
    // Logic to save updated settings
  };

  const handleDeleteAccount = () => {
    // Logic to delete account
  };

  return (
    <div className="settings-page">
      <h2>Settings</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleSave}>Save Changes</button>
      <button onClick={handleDeleteAccount}>Delete Account</button>
    </div>
  );
};

export default SettingsPage;
