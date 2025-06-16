import React, { useState,useEffect } from "react";
import AppointmentList from "../components/appointmentList";
import DoctorProfile from '../pages/doctorProfile';
import Availability from "../components/availability";

import { Box, Button, Stack } from "@mui/material";
import DoctorNavbar from "../components/doctorNavbar";
import axiosInstance from "../utils/axios";

export default function DoctorDashboard() {
  const [tab, setTab] = useState("appointments");
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await axiosInstance.get("/appointments/my");
        setAppointments(res.data);
      } catch (error) {
        console.error(error);
        alert("Failed to fetch appointments");
      }
    };

    fetchAppointments();
  }, []);

  return (
    <Box>
      <DoctorNavbar/>
    <Box sx={{ p: 4 }}>
      
      {/* Tab Buttons with spacing */}
      <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
        <Button
          variant={tab === "appointments" ? "contained" : "outlined"}
          onClick={() => setTab("appointments")}
        >
          Appointments
        </Button>
        <Button
          variant={tab === "profile" ? "contained" : "outlined"}
          onClick={() => setTab("profile")}
        >
          Profile
        </Button>
        <Button
          variant={tab === "availability" ? "contained" : "outlined"}
          onClick={() => setTab("availability")}
        >
          Availability
        </Button>
         
      </Stack>

     
      {tab === "appointments" && <AppointmentList appointments={appointments}  />}
      {tab === "profile" && <DoctorProfile />}
      {tab === "availability" && <Availability />}
      
    </Box>
    </Box>
    
  );
}
