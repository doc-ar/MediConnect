import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login } from '../features/authSlice';
import '../styles/Auth.css'; // Import the CSS file

function Signup() {
  const [name, setName] = useState('');
  const [designation, setDesignation] = useState('');
  const [qualification, setQualification] = useState('');
  const [roomNo, setRoomNo] = useState('');
  const [contactNo, setContactNo] = useState('');
  const [profilePic, setProfilePic] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleProfilePicChange = (e) => {
    setProfilePic(e.target.files[0]);
  };

  const handleSignup = () => {
    const token = 'sampleToken';
    const user = { 
      name, 
      designation, 
      qualification, 
      roomNo, 
      contactNo, 
      profilePic, 
      email, 
      token 
    };
    dispatch(login(user));
    navigate('/dashboard');
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Doctor Signup</h2>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
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
        <input
          type="text"
          placeholder="Designation"
          value={designation}
          onChange={(e) => setDesignation(e.target.value)}
        />
        <input
          type="text"
          placeholder="Qualification"
          value={qualification}
          onChange={(e) => setQualification(e.target.value)}
        />
        <input
          type="text"
          placeholder="Room No."
          value={roomNo}
          onChange={(e) => setRoomNo(e.target.value)}
        />
        <input
          type="text"
          placeholder="Contact No."
          value={contactNo}
          onChange={(e) => setContactNo(e.target.value)}
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleProfilePicChange}
        />
      
        <button onClick={handleSignup}>Signup</button>

        <p className='link-line'>
          <span>Already have an account? </span>
          <a href="/login" className="auth-link">Login</a>
        </p>
      </div>
    </div>
  );
}

export default Signup;
