import React from "react";
import {
  Box,
  Typography,
  Paper,
 
  Chip,
  Stack,
} from "@mui/material";
import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import { useEffect ,useState} from "react";
import axios from "axios";

const AppointmentList = () => {
   const [appointments, setAppointments] = useState([]);

useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/doctor/appointments/today");
        setAppointments(res.data);
      } catch (err) {
        console.error("Error fetching appointments", err);
      }
    };

    fetchAppointments();
  }, []);

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
            {appt.patientName}{" "}
            <Typography component="span" variant="body2" color="text.secondary">
              ({appt.age} years old)
            </Typography>
          </Typography>
          <Typography variant="body2" sx={{ mt: 0.5 }}>
            {appt.reason}
          </Typography>

          <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}>
            <AccessTimeFilledIcon sx={{ fontSize: 18, color: "#555" }} />
            <Typography variant="body2">{appt.time}</Typography>
            <Chip
              label={appt.mode}
              size="small"
              color={appt.mode === "Online" ? "info" : "primary"}
              variant="outlined"
            />
            <Chip
              label={appt.status}
              size="small"
              color={
                appt.status === "Confirmed"
                  ? "success"
                  : appt.status === "Pending"
                  ? "warning"
                  : appt.status === "Declined"
                  ? "error"
                  : "default"
              }
            />
          </Stack>
        </Paper>
      ))}
    </Box>
  );
};

export default AppointmentList;
