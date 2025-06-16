

// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import "../styles/PatientDashboard.css";

// const PatientDashboard = () => {
//   const [activeTab, setActiveTab] = useState("find");
//   const [selectedSpecialization, setSelectedSpecialization] = useState("");
//   const [doctors, setDoctors] = useState([]);
//   const [filteredDoctors, setFilteredDoctors] = useState([]);
//   const navigate = useNavigate();
 



//   useEffect(() => {
//     // Fetch doctors from backend
//     axios.get("http://localhost:5555/api/doctors") 
//       .then(response => {
//         setDoctors(response.data);
//         setFilteredDoctors(response.data);
//       })
//       .catch(error => {
//         console.error("Error fetching doctors:", error);
//       });
//   }, []);

//   const handleLogout = () => {
//     localStorage.removeItem("patientToken");
//     sessionStorage.removeItem("patientToken");
//     navigate("/login");
//   };

//   const handleSpecializationChange = (e) => {
//     const specialization = e.target.value;
//     setSelectedSpecialization(specialization);
//     const filtered = doctors.filter(doc => doc.specialization === specialization);
//     setFilteredDoctors(filtered);
//   };

//   return (
//     <div className="dashboard-container">
//       <header className="dashboard-header">
//         <h1 className="logo">HealthCure</h1>
//         <div className="header-right">
//           <span>Welcome, Patient!</span>
//           <button className="logout-btn" onClick={handleLogout}>Logout</button>
//         </div>
//       </header>

//       <div className="tab-bar">
//         <button className={activeTab === "find" ? "active" : ""} onClick={() => setActiveTab("find")}>
//           Find Doctors
//         </button>
//         <button className={activeTab === "appointments" ? "active" : ""} onClick={() => setActiveTab("appointments")}>
//           My Appointments
//         </button>
//       </div>

//       <div className="tab-content">
//         {activeTab === "find" && (
//           <div className="find-doctor-section">
//             <h2>🔍 Find Your Doctor</h2>
//             <p>Search for doctors by name, specialization, or condition</p>
//             <div className="search-inputs">
//               <input type="text" placeholder="Search doctors or conditions..." />
//               <select value={selectedSpecialization} onChange={handleSpecializationChange}>
//                 <option value="">Select specialization</option>
//                 <option value="Cardiology">Cardiology</option>
//                 <option value="Dermatology">Dermatology</option>
//                 <option value="Dentist">Dentist</option>
//                 <option value="Neurologist">Neurologist</option>
//                 <option value="Pediatrics">Pediatrics</option>
                
//               </select>
//             </div>

//             {filteredDoctors.map((doc) => (
//               <div key={doc._id} className="doctor-card">
//                 <img
//                   src={doc.imageUrl || "https://via.placeholder.com/150"}
//                   alt={doc.name}
//                   className="doctor-photo"
//                 />
//                 <div className="doctor-info">
//                   <h3>{doc.name}</h3>
//                   <p className="specialization">{doc.specialization}</p>
//                   <p>👨‍⚕️ {doc.experience} years experience</p>
//                   <p class="rating">⭐ {doc.rating}</p>
//                   <p class="location">📍 {doc.location}</p>
//                   <p className="fee">₹{doc.consultationFee} consultation</p>
//                   <p className="availability">
//                     {doc.availableSlots && doc.availableSlots.length > 0
//                       ? "Available Today"
//                       : "No slots available"}
//                   </p>
//                   {/* <button className="book-btn">Book Appointment</button> */}
//                   <button
//   className="book-btn"
//   onClick={() => navigate("/book-appointment", { state: { doctor: doc
//    } })}
// >
//   Book Appointment
// </button>

//                 </div>
//               </div>
//             ))}
//           </div>
//         )}

//         {activeTab === "appointments" && (
//           <div className="appointments-section">
//             <h2>📅 My Appointments</h2>
//             <p>No appointments found.</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default PatientDashboard;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/PatientDashboard.css";

const PatientDashboard = () => {
  const [activeTab, setActiveTab] = useState("find");
  const [selectedSpecialization, setSelectedSpecialization] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Load user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/doctors")
      .then((response) => {
        setDoctors(response.data);
        setFilteredDoctors(response.data);
      })
      .catch((error) => {
        console.error("Error fetching doctors:", error);
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("patientToken");
    localStorage.removeItem("currentUser"); // 🧹 clear stored user
    navigate("/login");
  };

  const handleSpecializationChange = (e) => {
    const specialization = e.target.value;
    setSelectedSpecialization(specialization);
    const filtered = doctors.filter(
      (doc) => doc.specialization === specialization
    );
    setFilteredDoctors(filtered);
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1 className="logo">HealthCure</h1>
        <div className="header-right">
          <span>Welcome, Patient!</span>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <div className="tab-bar">
        <button
          className={activeTab === "find" ? "active" : ""}
          onClick={() => setActiveTab("find")}
        >
          Find Doctors
        </button>
        <button
          className={activeTab === "appointments" ? "active" : ""}
          onClick={() => setActiveTab("appointments")}
        >
          My Appointments
        </button>
      </div>

      <div className="tab-content">
        {activeTab === "find" && (
          <div className="find-doctor-section">
            <h2>🔍 Find Your Doctor</h2>
            <p>Search for doctors by name, specialization, or condition</p>
            <div className="search-inputs">
              <input type="text" placeholder="Search doctors or conditions..." />
              <select
                value={selectedSpecialization}
                onChange={handleSpecializationChange}
              >
                <option value="">Select specialization</option>
                <option value="Cardiology">Cardiology</option>
                <option value="Dermatology">Dermatology</option>
                <option value="Dentist">Dentist</option>
                <option value="Neurologist">Neurologist</option>
                <option value="Pediatrics">Pediatrics</option>
              </select>
            </div>

            {filteredDoctors.map((doc) => (
              <div key={doc._id} className="doctor-card">
                <img
                  src={doc.imageUrl || "https://via.placeholder.com/150"}
                  alt={doc.name}
                  className="doctor-photo"
                />
                <div className="doctor-info">
                  <h3>{doc.name}</h3>
                  <p className="specialization">{doc.specialization}</p>
                  <p>👨‍⚕️ {doc.experience} years experience</p>
                  <p className="rating">⭐ {doc.rating}</p>
                  <p className="location">📍 {doc.location}</p>
                  <p className="fee">₹{doc.consultationFee} consultation</p>
                  <p className="availability">
                    {doc.availableSlots && doc.availableSlots.length > 0
                      ? "Available Today"
                      : "No slots available"}
                  </p>

                  <button
                    className="book-btn"
                    onClick={() => {
                      if (!user) {
                        alert("User not loaded. Please login again.");
                        return;
                      }

                      navigate("/book-appointment", {
                        state: {
                          doctor: doc,
                          user: {
                            id: user._id,
                            name: user.name,
                            email: user.email,
                          },
                        },
                      });
                    }}
                  >
                    Book Appointment
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "appointments" && (
          <div className="appointments-section">
            <h2>📅 My Appointments</h2>
            <p>No appointments found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientDashboard;
