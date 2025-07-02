import React, { useState, useEffect } from "react";
import {
  Grid,
  TextField,
  InputAdornment,
  Button,
  Paper,
  Box,
  Typography,
  IconButton,
  Chip,
} from "@mui/material";
import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "../utils/axios";

export default function AvailabilitySlotManager({
  slots = [],
  setSlots,
  onSaveSettings,
  selectedDate,
  doctorId,
}) {
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [bookedSlots, setBookedSlots] = useState([]);

  useEffect(() => {
    const fetchBookedSlots = async () => {
      if (!selectedDate || !doctorId) return;
      try {
        const res = await axios.get(`/appointments/booked-slots`, {
          params: {
            date: selectedDate,
            doctorId,
          },
        });
        setBookedSlots(res.data.bookedSlots || []);
      } catch (err) {
        console.error("Failed to fetch booked slots", err);
      }
    };

    fetchBookedSlots();
  }, [selectedDate, doctorId]);

  const isSlotBooked = (start, end) => {
    const formatted = `${formatTime(start)} - ${formatTime(end)}`;
    return bookedSlots.includes(formatted);
  };

  const formatTime = (time) => {
    const [hour, minute] = time.split(":");
    const date = new Date();
    date.setHours(+hour);
    date.setMinutes(+minute);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });
  };

  const handleAddSlot = () => {
    if (!startTime || !endTime) return;

    if (isSlotBooked(startTime, endTime)) {
      alert("This slot is already booked.");
      return;
    }

    const newSlot = {
      id: Date.now(),
      start: startTime,
      end: endTime,
    };

    setSlots([...slots, newSlot]);
    setStartTime("");
    setEndTime("");
  };

  const handleDelete = (id) => {
    setSlots(slots.filter((slot) => slot.id !== id));
  };

  const handleSaveSettings = () => {
    if (onSaveSettings) onSaveSettings();
  };

  const handleSaveTimeSlots = async () => {
    try {
      const formattedSlots = slots
        .filter((slot) => slot.start && slot.end)
        .map((slot) => `${slot.start}-${slot.end}`);
      await axios.put("/doctors/availability", { timeSlots: formattedSlots });
      alert("Time slots saved!");
    } catch (err) {
      alert("Error saving time slots");
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            type="time"
            label="Start Time"
            size="small"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            InputProps={{ startAdornment: <InputAdornment position="start"></InputAdornment> }}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            type="time"
            label="End Time"
            size="small"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            InputProps={{ startAdornment: <InputAdornment position="start"></InputAdornment> }}
          />
        </Grid>
        <Grid item xs={12} md={4} textAlign="right">
          <Button variant="contained" sx={{ textTransform: "none" }} onClick={handleAddSlot}>
            Add Slot
          </Button>
        </Grid>
      </Grid>

      <Box sx={{ mt: 4 }}>
        <Grid container spacing={2}>
          {slots.map((slot) => (
            <Grid item xs={12} key={slot.id}>
              <Paper
                elevation={1}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  backgroundColor: "#ecfdf5",
                  border: "1px solid #d1fae5",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <AccessTimeFilledIcon fontSize="small" />
                  <Typography variant="body1" fontWeight={500}>
                    {slot.start} - {slot.end}
                  </Typography>
                  <Chip
                    label={isSlotBooked(slot.start, slot.end) ? "Booked" : "Available"}
                    color={isSlotBooked(slot.start, slot.end) ? "default" : "success"}
                    size="small"
                    sx={{ fontWeight: 500 }}
                  />
                </Box>
                <IconButton onClick={() => handleDelete(slot.id)} color="error">
                  <DeleteIcon />
                </IconButton>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box textAlign="left" sx={{ mt: 2 }}>
        <Button
          variant="contained"
          color="success"
          onClick={handleSaveTimeSlots}
          sx={{ mr: 2, textTransform: "none" }}
        >
          Save Time Slots
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSaveSettings}
          sx={{ textTransform: "none" }}
        >
          Save Settings
        </Button>
      </Box>
    </Box>
  );
}
