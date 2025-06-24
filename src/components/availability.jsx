import React, { useState } from "react";
import {
    Typography,
    Grid,
    TextField,
    InputAdornment,
    Button,
    Switch
} from "@mui/material";
import { AccessTimeFilled } from "@mui/icons-material";
import FormControlLabel from '@mui/material/FormControlLabel';
import { styled } from '@mui/material/styles';
import AvailabilitySlotManager from "./availabilitySlots";
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import dayjs from 'dayjs';
import axios from '../utils/axios';

export default function Availability({ onSaveSettings }) {


    const [selectedDates, setSelectedDates] = useState([]);
    const [currentDate, setCurrentDate] = useState(null);
    const [slots, setSlots] = useState([]);
    const handleDateChange = (date) => {
        if (!date) return;
        const formatted = dayjs(date).format('YYYY-MM-DD');
        if (!selectedDates.includes(formatted)) {
            setSelectedDates([...selectedDates, formatted]);
        }
    };
    const handleRemoveDate = (date) => {
        setSelectedDates(selectedDates.filter(d => d !== date));
    };
    const handleSaveAvailability = async () => {
        try {

            await axios.put('/doctors/availability', { dates: selectedDates });
            alert('Availability saved!');
        } catch (err) {
            alert('Error saving availability');
        }
    };

    return (

        <Grid>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Availability Settings</Typography>
            <Typography variant="subtitle1">Set your working hours and manage appointment slots</Typography>
            <Grid item xs={12} sx={{ mt: 2 }}>
                <Typography variant="h6" gutterBottom>
                    Working Hours
                </Typography>


                <Grid item xs={12} mt={2} >
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6} size={6}>
                            <TextField
                                fullWidth
                                label="Available From"
                                defaultValue="09:00 AM"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <AccessTimeFilled />
                                        </InputAdornment>
                                    )
                                }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6} size={6}>
                            <TextField
                                fullWidth
                                label="Available To"
                                defaultValue="10:00 PM"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <AccessTimeFilled />
                                        </InputAdornment>
                                    )
                                }}
                            />
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>

            <Typography variant="h6" sx={{ mt: 3 }}>Set Available Dates</Typography>
            <DateCalendar
                value={currentDate}
                onChange={(date) => {
                    setCurrentDate(date);
                    handleDateChange(date);
                }}
            />
            <Grid container spacing={1} sx={{ mt: 1 }}>
                {selectedDates.map(date => (
                    <Grid item key={date}>
                        <Button variant="outlined" color="primary" onClick={() => handleRemoveDate(date)}>
                            {date} &times;
                        </Button>
                    </Grid>
                ))}
            </Grid>
            <Button variant="contained" color="success" sx={{ mt: 2 }} onClick={handleSaveAvailability}>
                Save Availability
            </Button>

            <Grid>
                <Typography variant="h6" sx={{ mt: 3 }}>Available Timeslots</Typography>

                <Grid item xs={12}>
                    <AvailabilitySlotManager slots={slots} setSlots={setSlots} onSaveSettings={onSaveSettings} />
                </Grid>

            </Grid>


        </Grid>
    )
}