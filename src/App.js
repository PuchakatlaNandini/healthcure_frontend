import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/landingPage";
import DoctorDashboard from "./pages/doctorDashboard";
import DoctorProfile from "./pages/doctorProfile";
import DoctorLogin from "./pages/doctorLogin";
import AppointmentList from "./components/appointmentList";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/doctor-login" element={<DoctorLogin />} />
        <Route path="/doctor/profile" element={<DoctorProfile />} />
        <Route path="/dashboard" element={<DoctorDashboard />} />
        <Route path="/doctor/appointments/today" element={<AppointmentList />} />
      
      </Routes>
    </Router>
  );
}
