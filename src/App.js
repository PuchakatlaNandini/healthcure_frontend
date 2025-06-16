import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/landingPage";
import DoctorDashboard from "./pages/doctorDashboard";
import DoctorProfile from "./pages/doctorProfile";
import DoctorLogin from "./pages/doctorLogin";
import DoctorRegister from "./pages/doctorRegister";
import AppointmentList from "./components/appointmentList";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

export default function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/doctor-login" element={<DoctorLogin />} />
          <Route path="/doctor/register" element={<DoctorRegister />} />
          <Route path="/doctor/profile" element={<DoctorProfile />} />
          <Route path="/dashboard" element={<DoctorDashboard />} />
          <Route path="/doctor/appointments/today" element={<AppointmentList />} />
        </Routes>
      </Router>
    </LocalizationProvider>
  );
}
