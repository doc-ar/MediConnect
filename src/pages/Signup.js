import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useInitialSignupMutation, useCompleteSignupMutation, useSilentLoginMutation } from '../features/authApiSlice';
import { selectCurrentAccessToken, setCredentials } from '../features/authSlice';

function Signup() {
  const [step, setStep] = useState(1);
  const [userId, setUserId] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [designation, setDesignation] = useState('');
  const [qualification, setQualification] = useState('');
  const [roomNo, setRoomNo] = useState('');
  const [contactNo, setContactNo] = useState('');
  const [image, setImage] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [initialSignup, { isLoading: isInitialLoading }] = useInitialSignupMutation();
  const [completeSignup, { isLoading: isCompleteLoading }] = useCompleteSignupMutation();
  const [silentLogin, { isLoading: isSilentLoginLoading }] = useSilentLoginMutation();
  const token = useSelector(selectCurrentAccessToken);

  const handleProfilePicChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleInitialSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await initialSignup({ email, password, role: "doctor" }).unwrap();
      setUserId(response.user_id); 
      
      
      // Perform silent login to get accessToken
      const loginResponse = await silentLogin({ email, password }).unwrap();
      
      dispatch(setCredentials({
        user: loginResponse.user, 
        accessToken: loginResponse.accessToken,
        refreshToken: loginResponse.refreshToken,
        
    }));
      setStep(2); // Move to the next step
    } catch (err) {
      console.error('Failed to signup:', err);
    }
  };

  const handleCompleteSignup = async (e) => {
    e.preventDefault();
    try {
      const userData = {
        user_id: userId,
        name,
        roomno: roomNo,
        qualification,
        image,
        designation,
        contact: contactNo,
      };
      
      
      // Send userData with the token
      await completeSignup({ userData, token }).unwrap();
      navigate('/dashboard');
    } catch (err) {
      console.error('Failed to complete signup:', err);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Doctor Signup</h2>
        {step === 1 ? (
          <form onSubmit={handleInitialSignup}>
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <button type="submit" disabled={isInitialLoading || isSilentLoginLoading}>
              {isInitialLoading || isSilentLoginLoading ? 'Loading...' : 'Signup'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleCompleteSignup}>
            <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
            <input type="text" placeholder="Specialization" value={designation} onChange={(e) => setDesignation(e.target.value)} />
            <input type="text" placeholder="Qualification" value={qualification} onChange={(e) => setQualification(e.target.value)} />
            <input type="text" placeholder="Room No." value={roomNo} onChange={(e) => setRoomNo(e.target.value)} />
            <input type="text" placeholder="Contact No." value={contactNo} onChange={(e) => setContactNo(e.target.value)} />
            <input type="file" accept="image/*" onChange={handleProfilePicChange} />
            <button type="submit" disabled={isCompleteLoading}>
              {isCompleteLoading ? 'Loading...' : 'Complete Signup'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default Signup;
