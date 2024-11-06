import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setCredentials } from '../features/authSlice';
import { useLoginMutation } from '../features/authApiSlice';
import '../styles/Auth.css'; // Import the CSS file

function Login() {

  const [error,setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation()
  const handleLogin = async (e) => {
    setError('');
    if (!email || !password) {
        setError("Fields cannot be empty");
        alert("Input Fields are empty");
        return;
    }
    const emailPattern = /^[a-zA-Z0-9._-]+@gmail\.com$/;
        if (!emailPattern.test(email)) {
            setError("Email format is not valid");
            alert("Email format is not valid");
            return;
        }

    e.preventDefault();
    try {
      const { user, accessToken, refreshToken } = await login({ email, password }).unwrap();
      dispatch(setCredentials({ user, accessToken, refreshToken }));
      navigate('/dashboard');
    } catch (err) {
      console.error('Failed to login:', err);
    }
  };


  return (
    <div className="auth-container" id='login-container'>
      <div className="auth-box">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
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
        <button>Login</button>
        <p className='link-line'>
        <span>Don't have an account? </span>
        <a href="/signup" className="auth-link">Sign Up</a>
        </p>
        </form>

      </div>
    </div>
  );
}

export default Login;
