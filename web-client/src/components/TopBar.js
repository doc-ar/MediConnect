import React, { useState } from 'react'
import { RxAvatar } from 'react-icons/rx';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/TopBar.css';
function Topbar({pageTitle}) {
  const [isModalOpen, setModalOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const toggleModal = () => {
    setModalOpen(!isModalOpen);
  };
  const handleLogout = () => {
    // Perform logout actions here (e.g., clearing tokens, redirecting)
    navigate('/login');
  };

  const goToSettings = () => {
    navigate('/settings');
  };
  if (location.pathname === '/login' || location.pathname === '/signup') {
    return null;
  }
  return (
    <div className='topbar'>
        <div className="topbarWrapper">
            <div className="topLeft">
                <span className="title">{pageTitle}</span>
            </div>
            <div className="topRight">
                <RxAvatar
                 className="profile-picture" 
                onClick={toggleModal} />
                {isModalOpen && (
          <div className="profile-modal">
            <button onClick={goToSettings}>Settings</button>
            <button onClick={handleLogout}>Logout</button>
          </div>
        )}
            </div>
        </div>
    </div>
  )
}

export default Topbar