import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  useInitialSignupMutation,
  useCompleteSignupMutation,
  useSilentLoginMutation,
} from "../features/authApiSlice";
import {
  selectCurrentAccessToken,
  setCredentials,
} from "../features/authSlice";

function Signup() {
  const [step, setStep] = useState(1);
  const [userId, setUserId] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [designation, setDesignation] = useState("");
  const [qualification, setQualification] = useState("");
  const [roomNo, setRoomNo] = useState("");
  const [contactNo, setContactNo] = useState("");
  const [image, setImage] = useState(null);
  const [qualifications, setQualifications] = useState([]);
  const qualificationOptions = [
    "MBBS",
    "MD",
    "FCPS",
    "DO",
    "PhD",
    "Fellowship",
    "Specialization in Cardiology",
    "Specialization in Neurology",
    "Other",
  ];

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [initialSignup, { isLoading: isInitialLoading }] =
    useInitialSignupMutation();
  const [completeSignup, { isLoading: isCompleteLoading }] =
    useCompleteSignupMutation();
  const [silentLogin, { isLoading: isSilentLoginLoading }] =
    useSilentLoginMutation();
  const token = useSelector(selectCurrentAccessToken);

  const handleProfilePicChange = async (e) => {
    const selectedFile = e.target.files[0];

    // Validate file type
    const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
    if (!allowedTypes.includes(selectedFile.type)) {
      alert("Invalid file type. Please upload a PNG, JPG, or JPEG image.");
      return;
    }

    const formData = new FormData();
    formData.append("avatar", selectedFile);

    try {
      const response = await fetch("http://localhost:3004/file/upload-avatar", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // Include the access token
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        console.log("File uploaded successfully:", data);
        alert(`Profile picture uploaded successfully!`);
        // Optionally update the state with the uploaded file's URL
        setImage(data.file_url);
      } else {
        const errorData = await response.json();
        console.error("Error response from API:", errorData);
        alert("Failed to upload the profile picture. Please try again.");
      }
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      alert("Error uploading profile picture. Please try again.");
    }
  };

  const handleInitialSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await initialSignup({
        email,
        password,
        role: "doctor",
      }).unwrap();
      setUserId(response.user_id);

      // Perform silent login to get accessToken
      const loginResponse = await silentLogin({
        email,
        password,
        role: "doctor",
      }).unwrap();
      console.log(loginResponse);

      dispatch(
        setCredentials({
          user: loginResponse.user,
          accessToken: loginResponse.accessToken,
          refreshToken: loginResponse.refreshToken,
        }),
      );
      setStep(2); // Move to the next step
    } catch (err) {
      console.error("Failed to signup:", err);
    }
  };

  const handleCompleteSignup = async (e) => {
    e.preventDefault();
    try {
      const userData = {
        // user_id: userId,
        name,
        roomno: roomNo,
        qualification: qualifications.join(","),
        image,
        designation,
        contact: contactNo,
      };

      // Send userData with the token
      await completeSignup({ userData, token }).unwrap();
      console.log(userData);
      navigate("/dashboard");
    } catch (err) {
      console.error("Failed to complete signup:", err);
    }
  };

  const handleAddQualification = (option) => {
    if (!qualifications.includes(option)) {
      setQualifications([...qualifications, option]);
    }
  };

  const handleRemoveQualification = (option) => {
    setQualifications(qualifications.filter((q) => q !== option));
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Doctor Signup</h2>
        {step === 1 ? (
          <form onSubmit={handleInitialSignup}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {/* <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
             */}
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => {
                const value = e.target.value;
                const regex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*\d).{8,}$/;
                if (!regex.test(value)) {
                  e.target.setCustomValidity(
                    "Password must be at least 8 characters, include one uppercase letter, one number, and one special character.",
                  );
                } else {
                  e.target.setCustomValidity("");
                }
                setPassword(value);
              }}
              required
            />

            <button
              className="action-btn"
              type="submit"
              disabled={isInitialLoading || isSilentLoginLoading}
            >
              {isInitialLoading || isSilentLoginLoading
                ? "Loading..."
                : "Signup"}
            </button>
            <p className="link-line">
              <span>Already have an account? </span>
              <a href="/login" className="auth-link">
                Login
              </a>
            </p>
          </form>
        ) : (
          <form onSubmit={handleCompleteSignup}>
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <select
              className="designation-dropdown"
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
              required
            >
              <option value="" disabled>
                Select Specialization
              </option>
              <option value="General Physician">General Physician</option>
              <option value="Cardiologist">Cardiologist</option>
              <option value="Dermatologist">Dermatologist</option>
              <option value="Neurologist">Neurologist</option>
              <option value="Orthopedic Surgeon">Orthopedic Surgeon</option>
              <option value="Pediatrician">Pediatrician</option>
              <option value="Psychiatrist">Psychiatrist</option>
              <option value="Radiologist">Radiologist</option>
              <option value="Surgeon">Surgeon</option>
              <option value="Other">Other</option>
            </select>
            {/* <input type="text" placeholder="Qualification" value={qualification} onChange={(e) => setQualification(e.target.value)} required /> */}
            <select
              className="qualification-dropdown"
              value=""
              onChange={(e) => {
                if (e.target.value) {
                  handleAddQualification(e.target.value);
                }
              }}
            >
              <option value="" disabled>
                Select Qualification
              </option>
              {qualificationOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>

            {/* Display selected qualifications as tags */}
            <div className="tags-container">
              {qualifications.map((qualification) => (
                <div key={qualification} className="tag">
                  {qualification}
                  <button
                    type="button"
                    onClick={() => handleRemoveQualification(qualification)}
                    className="remove-tag"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <input
              type="text"
              placeholder="Room No."
              value={roomNo}
              onChange={(e) => setRoomNo(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Contact No."
              value={contactNo}
              onChange={(e) => setContactNo(e.target.value)}
              required
              pattern="^\d{11}$"
              title="Please enter a valid 11-digit contact number"
            />

            <p htmlFor="profilePic">Upload Profile Picture:</p>
            <input
              id="profilePic"
              type="file"
              accept="image/png, image/jpeg, image/jpg"
              onChange={handleProfilePicChange}
            />
            <button
              className="action-btn"
              type="submit"
              disabled={isCompleteLoading}
            >
              {isCompleteLoading ? "Loading..." : "Complete Signup"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default Signup;
