import React, { useState } from 'react';
import './App.css'; // Import your custom CSS file
import StudentDetailsForm from './Student';
import CampDetailsForm from './CampDetailsForm';
import ManageEvent from './ManageEvent';
import ViewCamp from './TimelineCamp'; // Corrected import with uppercase letter
import Viewod from './ODRegistrationForm'

function App() {
  // State to manage active menu
  const [activeMenu, setActiveMenu] = useState('student');

  // Function to handle menu change
  const handleMenuChange = (menu) => {
    setActiveMenu(menu);
  };

  return (
    <>
      <nav className="navbar">
        <div className="container">
          {/* NSS Logo */}
          <div className="nss-logo">
            <img
              src="/static/media/nsslogo.83fe8115f59fd585dcf5.png"
              alt="NSS Logo"
            />
          </div>
          <div className="navbar-title">NSS Management System</div>
          <div className="menu-items">
            <button onClick={() => handleMenuChange('student')}>Add Student</button>
            <button onClick={() => handleMenuChange('camp')}>Manage Camps</button>
            <button onClick={() => handleMenuChange('events')}>Handle Events</button>
            <button onClick={() => handleMenuChange('viewcamp')}>View Camps</button> 
            <button onClick={() => handleMenuChange('viewod')}>Manage ODs</button> 
            <div className="dropdown">
              <button className="dropbtn">Dummy Menus</button>
              <div className="dropdown-content">
                <button onClick={() => handleMenuChange('dummy1')}>Dummy Menu 1</button>
                <button onClick={() => handleMenuChange('dummy2')}>Dummy Menu 2</button>
                <button onClick={() => handleMenuChange('dummy3')}>Dummy Menu 3</button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="forms-container">
        {/* Render the form based on the active menu */}
        {activeMenu === 'student' && <StudentDetailsForm />}
        {activeMenu === 'camp' && <CampDetailsForm />}
        {activeMenu === 'events' && <ManageEvent />}
        {activeMenu === 'viewcamp' && <ViewCamp />} {/* Corrected component name */}
        {activeMenu === 'viewod' && <Viewod />}


      </div>
    </>
  );
}

export default App;
