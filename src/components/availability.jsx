import React, { useState } from "react";
import {
    Typography,
    Grid,
    TextField,
    InputAdornment,
    Button,
    Switch
} from "@mui/material";

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

        <Grid sx={{ ml: 3 }} width={{ xs: '100%', sm: 800, md: 700 }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Availability Settings</Typography>
            <Typography variant="subtitle1">Set your working Dates and manage Appointment slots</Typography>


            <Typography variant="h6" sx={{ mt: 3 }}>Set Available Dates</Typography>
            <DateCalendar
                sx={{ ml: 0 }}
                value={currentDate}
                onChange={(date) => {
                    setCurrentDate(date);
                    handleDateChange(date);
                }}
                shouldDisableDate={(date) => {

                    return dayjs(date).isBefore(dayjs().startOf('day'));
                }}
            />
            <Grid container spacing={1} sx={{ mt: 0, ml: 2 }}>
                {selectedDates.map(date => (
                    <Grid item key={date}>
                        <Button variant="outlined" color="primary" onClick={() => handleRemoveDate(date)}>
                            {date} &times;
                        </Button>
                    </Grid>
                ))}
            </Grid>
            <Button variant="contained" color="success" sx={{ mt: 2, ml: 2, textTransform: "none" }} onClick={handleSaveAvailability}>
                Save Availability
            </Button>

            <Grid>
                <Typography variant="h6" sx={{ mt: 3, ml: 2 }}>Available Timeslots</Typography>

                <Grid item xs={12} >
                    <AvailabilitySlotManager slots={slots} setSlots={setSlots} onSaveSettings={onSaveSettings} />
                </Grid>

            </Grid>


        </Grid>
    )
}