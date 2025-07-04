import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { ToastContainer } from "react-toastify";

import LandingPage from "./components/headers/landingPage";

import AppointmentList from "./components/Doctor/appointmentList";
import DoctorDashboard from "./components/Doctor/doctorDashboard";
import DoctorProfile from "./components/Doctor/doctorProfile";
import DoctorLogin from "./components/Doctor/doctorLogin";
import DoctorRegister from "./components/Doctor/doctorRegister";
import Availability from "./components/Doctor/availability";
import DoctorAppointmentsPage from "./components/Doctor/DoctorAppointmentPage";

import PatientDashboard from "./components/Patient/PatientDashboard";
import BookAppointment from "./components/Patient/BookAppointment";
import PatientRegister from "./components/Patient/PatientRegister";
import PatientLogin from "./components/Patient/PatientLogin";

function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Router>
        {/* <Navbar /> */}
        <Routes>
          {/* Public */}
          <Route path="/" element={<LandingPage />} />

          {/* Doctor Routes */}
          <Route path="/doctor-login" element={<DoctorLogin />} />
          <Route path="/doctor/register" element={<DoctorRegister />} />
          <Route path="/doctor/profile" element={<DoctorProfile />} />
          <Route path="/dashboard" element={<DoctorDashboard />} />
          <Route path="/doctor/appointments/today" element={<AppointmentList />} />
          <Route path="/doctor/availability" element={<Availability />} />
          <Route path="/doctor/appointments" element={<DoctorAppointmentsPage />} />

          {/* Patient Routes */}
          <Route path="/patient/dashboard" element={<PatientDashboard />} />
          <Route path="/book-appointment" element={<BookAppointment />} />
          <Route path="/patient/register" element={<PatientRegister />} />
          <Route path="/patient/login" element={<PatientLogin />} />

        </Routes>
        <ToastContainer position="top-right" autoClose={3000}  />
      </Router>
    </LocalizationProvider>
  );
}

export default App;
