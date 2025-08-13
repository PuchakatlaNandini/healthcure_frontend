import React, { useState, useEffect } from "react";
import AppointmentList from "./appointmentList";
import DoctorProfile from './doctorProfile';
import Availability from '../Doctor/availability'

import { Box, Button, Stack } from "@mui/material";
import DoctorNavbar from "./doctorNavbar";
import axiosInstance from "../../utils/axios";


export default function DoctorDashboard() {
  const [tab, setTab] = useState("appointments");
  const [appointments, setAppointments] = useState([]);



  useEffect(() => {
    const fetchAppointments = async () => {

      const doctorIdLS = localStorage.getItem("doctorId");
      const doctorIdAlt = localStorage.getItem("doctor_id");
      console.log('DoctorDashboard: doctorId from localStorage =', doctorIdLS, 'doctor_id =', doctorIdAlt);

      // to get doctorId from localStorage 
      const doctorId = doctorIdLS || doctorIdAlt || null;
      if (!doctorId) {
        alert("Doctor ID not found. Please log in again.");
        return;
      }
      try {
        const res = await axiosInstance.get(`/appointments/doctor/today/${doctorId}`);
        console.log('DoctorDashboard: fetched appointments from API:', res.data);
        setAppointments(res.data);
        const profileRes = await axiosInstance.get(`/doctors/${doctorId}`);
        const name = profileRes.data?.name;
        if (name) {
          localStorage.setItem("doctorName", name);
          console.log("Doctor name set in localStorage:", name);
        }
      } catch (error) {
        console.error(error);
        // alert("Failed to fetch appointments");
      }
    };

    fetchAppointments();
  }, []);

  return (
    <Box sx={{
      minHeight: '100vh',
      background: '#f8f9fa',
      px: 0,
      pt: { xs: 1, sm: 2, md: 4 },
      width: '100%',
      overflowX: 'hidden',
    }}>
      <DoctorNavbar />
      <Box
        sx={{
          mt: { xs: 2, sm: 3 },
          mb: { xs: 4, sm: 6 },
          py: { xs: 2, sm: 3 },
          px: { xs: 1, sm: 3 },
          mx: 'auto',
          background: '#fff',
          boxShadow: 2,
          borderRadius: 2,
          width: '100%',
          minHeight: 450,
          overflowX: 'auto',
          // px: 0,
          // mr: 3,
          // ml: 3

        }}
      >
        {/* Tab Buttons with spacing */}
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 2, mt: 3, ml: { xs: 1, sm: 3 }, flexWrap: 'wrap', justifyContent: { xs: 'flex-start', sm: 'flex-start' }, gap: 2 }}>
          <Button
            sx={{
              minWidth: 150, textTransform: "none", mb: { xs: 1, sm: 0 }, mx: 1, fontSize: { xs: 12, sm: 14 }, py: 1,
              px: 2,
            }}
            variant={tab === "appointments" ? "contained" : "outlined"}
            onClick={() => setTab("appointments")}
          >
            Appointments
          </Button>

          <Button
            sx={{
              minWidth: 150, textTransform: "none", mb: { xs: 1, sm: 0 }, mx: 1, fontSize: { xs: 12, sm: 14 }, py: 1,
              px: 2,
            }}
            variant={tab === "availability" ? "contained" : "outlined"}
            onClick={() => setTab("availability")}
          >
            Availability
          </Button>
        </Stack>

        {tab === "appointments" && <AppointmentList appointments={appointments} setAppointments={setAppointments} />}
        {/* {tab === "profile" && <DoctorProfile />} */}
        {tab === "availability" && (
          <Availability onSaveSettings={() => setTab("appointments")} />
        )}
      </Box>
    </Box>
  );
}
