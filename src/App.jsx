import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

// Components
import Navbar from "./components/Navbar";
import AppointmentList from "./components/appointmentList";

// Pages - Doctor
import LandingPage from "./pages/landingPage";
import DoctorDashboard from "./pages/doctorDashboard";
import DoctorProfile from "./pages/doctorProfile";
import DoctorLogin from "./pages/doctorLogin";
import DoctorRegister from "./pages/doctorRegister";
import Availability from "./components/availability";

// Pages - Patient
import PatientDashboard from "./pages/PatientDashboard";
import BookAppointment from "./pages/BookAppointment";
import PatientRegister from "./pages/PatientRegister";
import PatientLogin from "./pages/PatientLogin";

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

          {/* Patient Routes */}
          <Route path="/patient/dashboard" element={<PatientDashboard />} />
          <Route path="/book-appointment" element={<BookAppointment />} />
          <Route path="/patient/register" element={<PatientRegister />} />
          <Route path="/patient/login" element={<PatientLogin />} />

        </Routes>
      </Router>
    </LocalizationProvider>
  );
}

export default App;
