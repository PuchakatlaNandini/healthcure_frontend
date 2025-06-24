import React, { useState } from "react";
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
import { useNavigate } from "react-router-dom";
import axios from "../utils/axios";

export default function AvailabilitySlotManager({ slots = [], setSlots,onSaveSettings }) {
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const navigate = useNavigate();

  const handleAddSlot = () => {
    if (!startTime || !endTime) return;

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
  console.log('Save settings clicked');
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
      {/* Slot Input Fields */}
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            type="time"
            label="Start Time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start"></InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            type="time"
            label="End Time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start"></InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} md={4} textAlign="right">
          <Button variant="contained" onClick={handleAddSlot}>
            Add Slot
          </Button>
        </Grid>
      </Grid>

      {/* Slot List */}
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
                {/* Time + Label */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <AccessTimeFilledIcon fontSize="small" />
                  <Typography variant="body1" fontWeight={500}>
                    {slot.start} - {slot.end}
                  </Typography>
                  <Chip
                    label="Available"
                    color="success"
                    size="small"
                    sx={{ fontWeight: 500 }}
                  />
                </Box>

                {/* Delete Button */}
                <IconButton onClick={() => handleDelete(slot.id)} color="error">
                  <DeleteIcon />
                </IconButton>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Save Settings Button */}
      <Box textAlign="left" sx={{ mt: 2 }}>
        <Button
          variant="contained"
          color="success"
          onClick={handleSaveTimeSlots}
          sx={{ mr: 2 }}
        >
          Save Time Slots
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSaveSettings}
        >
          Save Settings
        </Button>
      </Box>
    </Box>
  );
}
