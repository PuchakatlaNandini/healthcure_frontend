
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "../styles/PatientDashboard.css";
import logo from '../../public/images/image.png';
import axiosInstance from "../utils/axios";
import {
  Box,
  Typography,
  Button,
  Stack,
  Divider,
  Card,
  CardContent,
  Container,
  TextField,
  MenuItem,
  Grid,

} from "@mui/material";
import LogoutIcon from '@mui/icons-material/Logout';
import Dialog from "@mui/material/Dialog";
import BookAppointment from "./BookAppointment";



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
  const [openBooking, setOpenBooking] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);



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
    if (!user) {
      alert("User not loaded. Please login again.");
      return;
    }

    const doctor = {
      ...appt.doctorId,
      image: `http://localhost:5000/api/doctor/${appt.doctorId._id}/image`,
    };

    setSelectedDoctor(doctor);
    setOpenBooking({
      reschedule: true,
      previousAppointment: appt,
    });
  };

  return (
   <Box sx={{ pt: 10, px: 4,width:'82%' }}>

      {/* Header */}
      <Box
  display="flex"
  justifyContent="space-between"
  alignItems="center"
  py={2}
  px={4}
  sx={{
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1100,
    backgroundColor: "#fff",
    borderBottom: "1px solid #ccc",
  }}
>

        <img src={logo} alt="Logo" style={{ height: '40px', width: 'auto' }} />
        <Box display="flex" alignItems="center" gap={2}>
          <Typography variant="subtitle1">Welcome, {user ? user.name : "Patient"}</Typography>
          <Button variant="outlined" color="error" onClick={handleLogout} sx={{ textTransform: "none" }}>
            <LogoutIcon sx={{ mr: 1 }} />
            Logout
          </Button>
        </Box>
      </Box>

      {/* Tab Bar */}
      <Stack direction="row" spacing={2} justifyContent="flex-start" my={2} >
        <Button sx={{ minWidth: 550, textTransform: "none" }}
          variant={activeTab === "find" ? "contained" : "outlined"}
          onClick={() => setActiveTab("find")}
        >
          Find Doctors
        </Button>
        <Button sx={{ minWidth: 550, textTransform: "none" }}
          variant={activeTab === "appointments" ? "contained" : "outlined"}
          onClick={() => setActiveTab("appointments")}
        >
          My Appointments
        </Button>
      </Stack>

      {/* Content */}
      {activeTab === "find" && (
        <Box my={4}>
          <Typography variant="h5" gutterBottom>🔍 Find Your Doctor</Typography>
          <Typography variant="body2" mb={2}  >
            Search for doctors by name, specialization, or condition
          </Typography>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mb={3} >
            <TextField
              label="Search doctors by name"
              variant="outlined"
              fullWidth
              size="small"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <TextField
              select
              label="Specialization"
              value={selectedSpecialization}
              onChange={handleSpecializationChange}
              fullWidth
              size="small"
            >
              <MenuItem value="">All Specializations</MenuItem>
              <MenuItem value="Cardiology">Cardiology</MenuItem>
              <MenuItem value="Dermatology">Dermatology</MenuItem>
              <MenuItem value="Dentist">Dentist</MenuItem>
              <MenuItem value="Neurologist">Neurologist</MenuItem>
              <MenuItem value="Pediatrics">Pediatrics</MenuItem>
            </TextField>
          </Stack>

          <Grid container spacing={4} display={'flex'} justifyContent="flex-start" alignItems="flex-start">

            {filteredDoctors.map((doc) => (
              <Grid item xs={12} sm={6} md={4} lg={3} >
                <Card key={doc._id} sx={{ mb: 3, width: "100%", boxShadow: 3, borderRadius: 2, display: "flex", flexDirection: "column" }}>
                  <CardContent sx={{ display: "flex", alignItems: "center" }}>
                    {doc.hasImage ? (
                      <img
                        src={`http://localhost:5000/api/doctor/${doc._id}/image`}
                        alt={doc.name}
                        style={{
                          width: 100,
                          height: 100,
                          borderRadius: "50%",
                          marginRight: 16,
                        }}
                      />
                    ) : (
                      <Box
                        sx={{
                          width: 100,
                          height: 100,
                          borderRadius: "50%",
                          marginRight: 2,
                          backgroundColor: "#ccc",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 24,
                          fontWeight: "bold",
                        }}
                      > {(doc.name && typeof doc.name === "string" && doc.name.trim().length > 0)
                        ? doc.name.trim()[0].toUpperCase()
                        : "?"}
                      </Box>
                    )}

                    <Box>
                      <Typography variant="h6">{doc.name}</Typography>
                      <Typography variant="body2" color="text.secondary">{doc.specialization}</Typography>
                      <Typography variant="body2">👨‍⚕️ {doc.experience} years experience</Typography>
                      <Typography variant="body2">₹{doc.fee} consultation</Typography>
                      <Button
                        variant="contained"
                        color="primary"
                        sx={{ mt: 1, textTransform: "none" }}
                        onClick={() => {
                          if (!user) {
                            alert("User not loaded. Please login again.");
                            return;
                          }

                          setSelectedDoctor({
                            ...doc,
                            image: `http://localhost:5000/api/doctor/${doc._id}/image`,
                          });

                          setOpenBooking({ reschedule: false });
                        }}

                      >
                        Book Appointment
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}

          </Grid>
        </Box>
      )}



      {activeTab === "appointments" && (
        <Box my={4}>
          <Typography variant="h5" gutterBottom>📅 My Appointments</Typography>

          <Grid container spacing={4} justifyContent="flex-start" alignItems="flex-start">
            {appointments.length === 0 ? (
              <Grid item xs={12}>
                <Typography variant="body1" color="textSecondary" align="center">
                  No appointments found.
                </Typography>
              </Grid>
            ) : (
              [...appointments]
                .sort((a, b) => new Date(b.scheduledAt) - new Date(a.scheduledAt)) // Newest first
                .map((appt) => (
                  <Grid item xs={12} sm={4} md={4} key={appt._id} sx={{ display: "inline", justifyContent: "center", width: "30%" }}>
                    <Card sx={{ boxShadow: 3, borderRadius: 2, }}>
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
                            sx={{ textTransform: "none" }}
                          >
                            Cancel
                          </Button>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleReschedule(appt)}
                            disabled={appt.status === "reschedule"}
                            sx={{ textTransform: "none" }}
                          >
                            Reschedule
                          </Button>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                ))
            )}
          </Grid>



        </Box>
      )}

      {/* modal for booking/rescheduling appointment */}
      <Dialog open={!!openBooking} onClose={() => setOpenBooking(null)} maxWidth="md" fullWidth>
        <BookAppointment
          doctor={selectedDoctor}
          user={user}
          reschedule={openBooking?.reschedule}
          previousAppointment={openBooking?.previousAppointment}
          onClose={() => setOpenBooking(null)}
          onSuccess={() => {
            setOpenBooking(null);
            setActiveTab("appointments");
          }}
        />
      </Dialog>


    </Box >
  );

};
export default PatientDashboard;
