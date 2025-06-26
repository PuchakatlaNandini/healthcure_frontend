
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "../styles/PatientDashboard.css";
import logo from '../../public/images/image.png';
import axiosInstance from "../utils/axios";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  Divider,
} from "@mui/material";


const PatientDashboard = () => {
  const [activeTab, setActiveTab] = useState("find");
  const [selectedSpecialization, setSelectedSpecialization] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [user, setUser] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // Set active tab to appointments if coming from booking
  useEffect(() => {
    if (location.state && location.state.showAppointments) {
      setActiveTab("appointments");
    }
  }, [location.state]);

  // Load user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser && storedUser !== "undefined") {
      setUser(JSON.parse(storedUser));
    } else {
      setUser(null);
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

  // Fetch appointments when tab is appointments or after booking
  useEffect(() => {
    if (activeTab === "appointments") {
      const storedUser = localStorage.getItem("currentUser");
      const user = storedUser ? JSON.parse(storedUser) : null;
      if (!user || !(user._id || user.id)) return;
      const userId = user._id || user.id;
      axiosInstance.get(`/appointments/user/${userId}`)
        .then(res => {
          console.log("Fetched appointments:", res.data);
          setAppointments(res.data);
        })
        .catch(err => console.error("Error fetching user appointments", err));
    }
    
  }, [activeTab, location.state]);




  const handleLogout = () => {
    localStorage.removeItem("patientToken");
    localStorage.removeItem("currentUser");
    navigate("/login");
  };

  const handleSpecializationChange = (e) => {
    const specialization = e.target.value;
    setSelectedSpecialization(specialization);
    if (specialization === "") {
      setFilteredDoctors(doctors);
    } else {
      const filtered = doctors.filter(
        (doc) => doc.specialization && doc.specialization.trim().toLowerCase() === specialization.trim().toLowerCase()
      );
      setFilteredDoctors(filtered);
    }
  };

  // Add search by name
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    const filtered = doctors.filter(doc =>
      doc.name && doc.name.toLowerCase().includes(value.toLowerCase())
    );
    //  filter by both specialization
    if (selectedSpecialization) {
      setFilteredDoctors(filtered.filter(doc => doc.specialization && doc.specialization.trim().toLowerCase() === selectedSpecialization.trim().toLowerCase()));
    } else {
      setFilteredDoctors(filtered);
    }
  };

  const handleCancel = async (appointmentId) => {
    try {
      const res = await axiosInstance.patch(`/appointments/status/${appointmentId}`, {
        status: "cancelled",
      });
      alert("Appointment cancelled.");
      setAppointments(prev =>
        prev.map(appt => appt._id === appointmentId ? res.data.appointment : appt)
      );
    } catch (err) {
      console.error("Cancel error:", err);
      alert("Failed to cancel appointment.");
    }
  };

  const handleReschedule = (appt) => {
    navigate("/book-appointment", {
      state: {
        doctor: appt.doctorId,
        user: user,
        reschedule: true,
        previousAppointment: appt,
      },
    });
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <img src={logo} alt="Logo" className="logo" style={{ height: '40px', width: 'auto' }} />
        <div className="header-right">
          <span>Welcome, {user ? user.name : "Patient"}</span>
          <button className="logout-btn" onClick={handleLogout} >
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
              <input
                type="text"
                placeholder="Search doctors by name..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
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
                  src={`http://localhost:5000/api/doctor/${doc._id}/image`}

                  alt={doc.name}
                  className="doctor-photo"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/150";
                  }}
                />
                <div className="doctor-info">
                  <h3>{doc.name}</h3>
                  <p className="specialization">{doc.specialization}</p>
                  <p>👨‍⚕️ {doc.experience} years experience</p>
                  <p className="rating">{doc.rating}</p>
                  {/* <p className="location">📍 {doc.location}</p> */}
                  <p className="fee">₹{doc.fee} consultation</p>
                  <button
                    className="book-btn"
                    onClick={() => {
                      if (!user) {
                        alert("User not loaded. Please login again.");
                        return;
                      }
                      navigate("/book-appointment", {
                        state: {
                          doctor: {
                            ...doc,
                            image: `http://localhost:5000/api/doctor/${doc._id}/image`,
                          },
                          user: user,
                        },
                      });

                    }}
                    style={{ marginTop: '10px' }}
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
       {appointments.length === 0 ? (
  <Typography variant="body1" color="textSecondary">
    No appointments found.
  </Typography>
) : (
  appointments.map((appt) => (
    <Card
      key={appt._id}
      sx={{
        mb: 2,
        boxShadow: 3,
        borderRadius: 2,
        backgroundColor: "#f9f9f9",
      }}
    >
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Doctor: {appt.doctorId?.name || "Unknown"}
        </Typography>

        <Typography variant="body2" color="textSecondary">
          Date:{" "}
          {appt.scheduledAt
            ? new Date(appt.scheduledAt).toLocaleString()
            : "Unknown"}
        </Typography>

        <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
          Status: {appt.status || "Unknown"}
        </Typography>

        <Divider sx={{ my: 1 }} />

        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            color="error"
            onClick={() => handleCancel(appt._id)}
            disabled={appt.status === "cancelled"}  
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleReschedule(appt)}
            disabled={appt.status === "reschedule"}
          >
            Reschedule
          </Button>
        </Stack>
      </CardContent>
    </Card>
  ))
)}

            
            </div>
        )}
      </div>
    </div>
  );
};

export default PatientDashboard;
