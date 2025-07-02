import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Chip,
  Stack,
  Button,
  Grid
} from "@mui/material";
import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import axiosInstance from "../utils/axios";
import { toast } from "react-toastify";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";


const AppointmentList = ({ appointments: propAppointments, setAppointments }) => {
  const [appointments, setLocalAppointments] = useState(propAppointments || []);
 const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
const [cancelReason, setCancelReason] = useState("");
const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);

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
    const res = await axios.patch(`/appointments/${appointmentId}/cancel-by-doctor`, {
      status: newStatus,
    });

    const updated = res.data.appointment;

      //name remains same
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
      toast.success("Appointment cancelled and confirmation email sent.");
    } else {
      toast.success(`Appointment status updated to ${newStatus}.`);
    }

  } catch (error) {
    console.error("Failed to update appointment status", error);
    // Show proper error message if less than 1 hour
    if (error.response && error.response.data?.message) {
      toast.error(error.response.data.message);
    } else {
      setLocalAppointments(updatedList);
      if (setAppointments) setAppointments(updatedList);
    // } catch (error) {
    //   console.error("Failed to update appointment status", error);
    //   alert("Failed to update status");
    }
  }
};

const handleDoctorCancel = async () => {
  if (!cancelReason.trim()) {
    toast.error("Please provide a cancellation reason.");
    return;
  }

  try {
    const res = await axiosInstance.patch(
      `/appointments/${selectedAppointmentId}/cancel-by-doctor`,
      { reason: cancelReason }
    );

    const updated = res.data.appointment;

    const updatedList = appointments.map((appt) =>
      appt._id === selectedAppointmentId ? updated : appt
    );
    setLocalAppointments(updatedList);
    if (setAppointments) setAppointments(updatedList);

    toast.success("Appointment cancelled and email sent.");
  } catch (error) {
    console.error("Error cancelling appointment:", error);
    toast.error(
      error?.response?.data?.message || "Failed to cancel appointment"
    );
  }

  // Reset dialog
  setCancelDialogOpen(false);
  setCancelReason("");
  setSelectedAppointmentId(null);
};


  return (
    <Box sx={{ p: 3, maxWidth: 900, }}>
      <Typography variant="h5" gutterBottom sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
        <EventAvailableIcon />
        Today's Appointments
      </Typography>
      <Typography variant="body2" gutterBottom color="text.secondary">
        Manage your appointments for today
      </Typography>

      <Grid container spacing={2} sx={{ mt: 2, mb: 4 }} justifyContent="flex-start">
        {[...appointments]
          .sort((a, b) => new Date(b.scheduledAt) - new Date(a.scheduledAt)).map((appt) => (
            <Grid item xs={12} sm={6} md={4} key={appt._id}>
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
                    color="error"
                    onClick={() => { setSelectedAppointmentId(appt._id);
                     setCancelDialogOpen(true);}}
                    disabled={appt.status === "cancelled"}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="small"
                    variant="contained"
                    color="success"
                    onClick={() => updateStatus(appt._id, "confirmed")}
                    disabled={appt.status === "confirmed"}
                  >
                    Completed
                  </Button>
                </Box>
              </Paper>
            </Grid>
          ))}
      </Grid>

<Dialog open={cancelDialogOpen} onClose={() => setCancelDialogOpen(false)}>
  <DialogTitle>Cancel Appointment</DialogTitle>
  <DialogContent>
    <TextField
      autoFocus
      margin="dense"
      label="Reason for cancellation"
      fullWidth
      value={cancelReason}
      onChange={(e) => setCancelReason(e.target.value)}
    />
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setCancelDialogOpen(false)}>Close</Button>
    <Button
      onClick={handleDoctorCancel}
      variant="contained"
      color="error"
      disabled={!cancelReason.trim()}
    >
      Submit
    </Button>
  </DialogActions>
</Dialog>


    </Box>
  );
};

export default AppointmentList;
