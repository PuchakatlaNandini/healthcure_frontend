
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
import axiosInstance from "../../utils/axios";
import { toast } from "react-toastify";

export default function AvailabilitySlotManager({
  slots = [],
  setSlots,
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
        const res = await axiosInstance.get(`/appointments/booked-slots`, {
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
    if (!startTime || !endTime) {
      toast.error("Start and End Time are required.");
      return;
    }
    
    const now = new Date();
  const selectedStart = new Date();
  const [startHour, startMinute] = startTime.split(":").map(Number);
  selectedStart.setHours(startHour, startMinute, 0, 0);

  if (selectedStart <= now) {
    toast.error("You cannot add a time slot in the past.");
    return;
  }
    const start = new Date(`1970-01-01T${startTime}:00`);
    const end = new Date(`1970-01-01T${endTime}:00`);
    const diffMinutes = (end - start) / (1000 * 60);

    if (end <= start) {
      toast.error("End Time must be after Start Time.");
      return;
    }

    if (diffMinutes !== 15) {
      toast.error("Time slot must be exactly 15 minutes.");
      return;
    }

    const duplicate = slots.some(
      (slot) => slot.start === startTime && slot.end === endTime
    );
    if (duplicate) {
      toast.error("This time slot is already added.");
      return;
    }

    const overlaps = slots.some(
      (slot) =>
        (startTime >= slot.start && startTime < slot.end) ||
        (endTime > slot.start && endTime <= slot.end) ||
        (startTime <= slot.start && endTime >= slot.end)
    );
    if (overlaps) {
      toast.error("This time slot overlaps with an existing slot.");
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
    toast.success("Time slot added successfully!");
  };

  const handleDelete = (id) => {
    setSlots(slots.filter((slot) => slot.id !== id));
  };

  const handleSaveTimeSlots = async () => {
    try {
      const formattedSlots = slots
        .filter((slot) => slot.start && slot.end)
        .map((slot) => `${slot.start}-${slot.end}`);
      await axiosInstance.put("/doctors/availability", { timeSlots: formattedSlots });
      toast.success("Time slots saved!");
    } catch (err) {
      toast.error("Error saving time slots");
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
            onChange={(e) => {
              const selectedStart = e.target.value;
              setStartTime(selectedStart);

              if (selectedStart) {
                // Auto-set end time to 15 minutes later
                const [hour, minute] = selectedStart.split(":").map(Number);
                const end = new Date();
                end.setHours(hour);
                end.setMinutes(minute + 15);

                const endHour = String(end.getHours()).padStart(2, "0");
                const endMinute = String(end.getMinutes()).padStart(2, "0");
                setEndTime(`${endHour}:${endMinute}`);
              } else {
                setEndTime("");
              }
            }}
            InputProps={{ startAdornment: <InputAdornment position="start" /> }}
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
            InputProps={{ startAdornment: <InputAdornment position="start" /> }}
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
      </Box>
    </Box>
  );
}
