// import React, { useState } from 'react';
// import "../styles/Navbar.css";
// import DoctorLogin from './DoctorLogin';

// const Navbar = () => {
//   const [showDoctorLogin, setShowDoctorLogin] = useState(false);

//   return (
//     <>
//       <nav className="navbar">
//         <div className="navbar-left">
//           <img src="/logo512.png" alt="CareConnect Logo" className="logo" />
//           <span className="brand-name">
//             <span style={{ color: '#007bff' }}>HealthCure</span>
//           </span>
//         </div>
//         <div className="navbar-right">
//           <button className="nav-button">Patient Login</button>
//           <button
//             className="nav-button"
//             onClick={() => setShowDoctorLogin(true)}
//           >
//             Doctor Login
//           </button>
//         </div>
//       </nav>

//       {showDoctorLogin && (
//         <DoctorLogin onClose={() => setShowDoctorLogin(false)} />
//       )}
//     </>
//   );
// };

// export default Navbar;

import React, { useState } from 'react';
import "../styles/Navbar.css";
import DoctorLogin from './DoctorLogin';
import PatientLogin from './PatientLogin';

const Navbar = () => {
  const [showDoctorLogin, setShowDoctorLogin] = useState(false);
  const [showPatientLogin, setShowPatientLogin] = useState(false);

  return (
    <>
      <nav className="navbar">
        <div className="navbar-left">
          <img src="/logo512.png" alt="CareConnect Logo" className="logo" />
          <span className="brand-name">
            <span style={{ color: '#007bff' }}>HealthCure</span>
          </span>
        </div>
        <div className="navbar-right">
          <button className="nav-button" onClick={() => setShowPatientLogin(true)}>
            Patient Login
          </button>
          <button className="nav-button" onClick={() => setShowDoctorLogin(true)}>
            Doctor Login
          </button>
        </div>
      </nav>

      {showDoctorLogin && <DoctorLogin onClose={() => setShowDoctorLogin(false)} />}
      {showPatientLogin && <PatientLogin onClose={() => setShowPatientLogin(false)} />}
    </>
  );
};

export default Navbar;

