import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setCredentials } from "../features/authSlice";
import { useLoginMutation } from "../features/authApiSlice";
import "../styles/Auth.css"; // Import the CSS file

function Login() {
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetMessage, setResetMessage] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();

  // const handleLogin = async (e) => {
  //   setError('');
  //   if (!email || !password) {
  //     setError("Fields cannot be empty");
  //     alert("Input Fields are empty");
  //     return;
  //   }
  //   const emailPattern = /^[a-zA-Z0-9._-]+@gmail\.com$/;
  //   if (!emailPattern.test(email)) {
  //     setError("Email format is not valid");
  //     alert("Email format is not valid");
  //     return;
  //   }

  //   e.preventDefault();
  //   try {
  //     const { user, accessToken, refreshToken } = await login({ email, password, role: "doctor" }).unwrap();
  //     dispatch(setCredentials({ user, accessToken, refreshToken }));
  //     navigate('/dashboard');
  //   } catch (err) {
  //     console.error('Failed to login:', err);
  //   }
  // };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setErrMsg("");

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

    try {
      const { user, accessToken, refreshToken } = await login({
        email,
        password,
        role: "doctor",
      }).unwrap();
      dispatch(setCredentials({ user, accessToken, refreshToken }));
      navigate("/dashboard");
    } catch (err) {
      console.error("Failed to login:", err);
      if (err?.status === 401 || err?.status === 403) {
        setErrMsg("Invalid email or password. Please try again.");
      } else {
        setErrMsg("An unexpected error occurred. Please try again later.");
      }
    }
  };

  const handleForgotPassword = async () => {
    if (!resetEmail) {
      alert("Please enter your email.");
      return;
    }
    try {
      const response = await fetch(
        "http://localhost:3000/auth/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: resetEmail }),
        },
      );
      const data = await response.json();
      if (response.ok) {
        setResetMessage(data.message);
      } else {
        setResetMessage("Failed to send reset email.");
      }
    } catch (error) {
      console.error("Error sending reset email:", error);
      setResetMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div className="auth-container" id="login-container">
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
          <button className="action-btn">Login</button>
          {errMsg && <p className="error-message">{errMsg}</p>}
          <p className="link-line">
            <span>Don't have an account? </span>
            <a href="/signup" className="auth-link">
              Sign Up
            </a>
          </p>
        </form>
        <p
          id="forgot-pass"
          onClick={() => setShowModal(true)}
          style={{ cursor: "pointer", color: "#233B69" }}
        >
          Forgot your password?
        </p>
      </div>

      {showModal && (
        <>
          <div
            className="modal-overlay"
            onClick={() => setShowModal(false)}
          ></div>
          <div className="login-modal">
            <div className="login-modal-content">
              <h3 id="reset-pass-title">Reset Password</h3>
              <input
                type="email"
                placeholder="Enter your email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
              />
              <button className="action-btn" onClick={handleForgotPassword}>
                Submit
              </button>

              {resetMessage && <p>{resetMessage}</p>}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Login;
