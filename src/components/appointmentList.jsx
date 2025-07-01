import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Chip,
  Stack,
  Button
} from "@mui/material";
import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import axiosInstance from "../utils/axios";

const AppointmentList = ({ appointments: propAppointments,setAppointments }) => {
  const [appointments, setLocalAppointments] = useState(propAppointments || []);

  useEffect(() => {
    console.log('AppointmentList: received appointments prop:', propAppointments);
    if (propAppointments) {
      setLocalAppointments(propAppointments);
    }
    // If appointments are not passed as props, fetch them for today
    if (!propAppointments) {
      const doctor = JSON.parse(localStorage.getItem("currentUser"));
      if (!doctor || !doctor.user || !doctor.user.id) return;
      const doctorId = doctor.user.id;
      axiosInstance
        .get(`/appointments/doctor/today/${doctorId}`)
        .then((res) => {
          setLocalAppointments(res.data);
          console.log('AppointmentList: fetched appointments from API:', res.data);
        })
        .catch((err) => console.error("Error fetching today's appointments", err));
    }
  }, [propAppointments]);

const updateStatus = async (appointmentId, newStatus) => {
  try {
    const res = await axiosInstance.patch(`/appointments/status/${appointmentId}`, {
      status: newStatus,
    });

    const updated = res.data.appointment;

    const oldAppt = appointments.find((a) => a._id === appointmentId);
    if (oldAppt && typeof updated.userId === "string") {
      updated.userId = oldAppt.userId;
    }

    const updatedList = appointments.map((a) =>
      a._id === appointmentId ? updated : a
    );

    setLocalAppointments(updatedList);
    if (setAppointments) setAppointments(updatedList);

    if (newStatus === "cancelled") {
      alert("Appointment cancelled and confirmation email sent.");
    } else {
      alert(`Appointment status updated to ${newStatus}.`);
    }

  } catch (error) {
    console.error("Failed to update appointment status", error);
    // Show proper error message if less than 1 hour
    if (error.response && error.response.data?.message) {
      alert(error.response.data.message);
    } else {
      alert("Failed to update status");
    }
  }
};



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

          {/* status button */}
         
          <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
            <Button
              size="small"
              variant="contained"
              color="success"
              onClick={() => updateStatus(appt._id, "confirmed")}
              disabled={appt.status === "confirmed" }
            >
              Confirm
            </Button>
            <Button
              size="small"
              variant="contained"
              color="error"
              onClick={() => updateStatus(appt._id, "cancelled")}
              disabled={appt.status === "cancelled"}
            >
              Cancel
            </Button>
            {/* <Button
              size="small"
              variant="outlined"
              color="warning"
              onClick={() => updateStatus(appt._id, "pending")}
              disabled={appt.status === "pending"}
            >
               Pending
            </Button> */}
            </Box>




        </Paper>
      ))}
    </Box>
  );
};

export default AppointmentList;
