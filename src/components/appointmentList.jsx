import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Chip,
  Stack,
} from "@mui/material";
import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import axiosInstance from "../utils/axios";

const AppointmentList = ({ appointments: propAppointments }) => {
  const [appointments, setAppointments] = useState(propAppointments || []);

  useEffect(() => {
    // Debug log to check received appointments
    console.log('AppointmentList: received appointments prop:', propAppointments);
    // Update local state when propAppointments changes
    if (propAppointments) {
      setAppointments(propAppointments);
    }
    // If appointments are not passed as props, fetch them for today
    if (!propAppointments) {
      const doctor = JSON.parse(localStorage.getItem("currentUser"));
      if (!doctor || !doctor.user || !doctor.user.id) return;
      const doctorId = doctor.user.id;
      axiosInstance
        .get(`/appointments/doctor/today/${doctorId}`)
        .then((res) => {
          setAppointments(res.data);
          // Debug log for fetched appointments
          console.log('AppointmentList: fetched appointments from API:', res.data);
        })
        .catch((err) => console.error("Error fetching today's appointments", err));
    }
  }, [propAppointments]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <EventAvailableIcon />
        Today's Appointments
      </Typography>
      <Typography variant="body2" gutterBottom color="text.secondary">
        Manage your appointments for today
      </Typography>

      {appointments.map((appt) => (
        <Paper
          key={appt._id}
          elevation={appt.status === "Pending" ? 1 : 0}
          sx={{
            p: 2,
            my: 2,
            border: "1px solid #e0e0e0",
            backgroundColor: appt.status === "Pending" ? "#f9f9f9" : "#fff",
            borderRadius: 2,
          }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
            {appt.userId?.name || "Unknown Patient"}
          </Typography>
          <Typography variant="body2" sx={{ mt: 0.5 }}>
            {new Date(appt.scheduledAt).toLocaleString()} - {appt.consultationType}
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}>
            <AccessTimeFilledIcon sx={{ fontSize: 18, color: "#555" }} />
            <Typography variant="body2">{appt.status}</Typography>
            <Chip
              label={appt.consultationType}
              size="small"
              color={appt.consultationType === "Online" ? "info" : "primary"}
              variant="outlined"
            />
          </Stack>
        </Paper>
      ))}
    </Box>
  );
};

export default AppointmentList;
