import React, { useState } from "react";
import {
    Typography,
    Grid,
    Button,
    TextField
} from "@mui/material";

import AvailabilitySlotManager from "./availabilitySlots";
<<<<<<< HEAD:src/components/Doctor/availability.jsx
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import dayjs from 'dayjs';
import axios from '../../utils/axios'
=======
import dayjs from "dayjs";
import axios from "../utils/axios";
>>>>>>> ec4884e3b38cce34c11ebc42cbb582945a950d33:src/components/availability.jsx
import { toast } from "react-toastify";

export default function Availability({ onSaveSettings }) {
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [dateRange, setDateRange] = useState([]); // All dates in range
    const [slots, setSlots] = useState([]);

    const generateDateRange = (start, end) => {
        const startDay = dayjs(start);
        const endDay = dayjs(end);
        const range = [];
        let current = startDay;

        while (current.isBefore(endDay) || current.isSame(endDay)) {
            range.push(current.format("YYYY-MM-DD"));
            current = current.add(1, "day");
        }
        return range;
    };

    const handleSaveAvailability = async () => {
        if (!fromDate || !toDate) {
            toast.error("Please select From Date and To Date");
            return;
        }

        const generatedDates = generateDateRange(fromDate, toDate);
        setDateRange(generatedDates);

        try {
            await axios.put("/doctors/availability", { dates: generatedDates });
            toast.success("Availability saved!");
        } catch (err) {
            toast.error("Error saving availability");
        }
    };

    const handleRemoveDate = (date) => {
        const updatedDates = dateRange.filter(d => d !== date);
        setDateRange(updatedDates);
    };

    return (
        <Grid
            container
            direction="row"
            justifyContent="flex-start"
            alignItems="stretch"
            spacing={4}
            sx={{ ml: 3, width: { xs: "100%", sm: 800, md: 1200 } }}
        >
            {/* Date Range */}
            <Grid item xs={12} md={6}>
                <Typography variant="h5" sx={{ fontWeight: "bold" }}>Availability Settings</Typography>
                <Typography variant="subtitle1">Set your working date range and manage appointment slots</Typography>

                <Typography variant="h5" sx={{ mt: 3,mb:3 }}>Select Date Range</Typography>

                <Grid container spacing={2} sx={{ mt: 1 , }}>
                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            type="date"
                            label="From Date"
                            InputLabelProps={{ shrink: true }}
                            value={fromDate}
                            onChange={(e) => setFromDate(e.target.value)}
                            size="small"
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            type="date"
                            label="To Date"
                            InputLabelProps={{ shrink: true }}
                            value={toDate}
                            onChange={(e) => setToDate(e.target.value)}
                            size="small"
                            disabled={!fromDate}
                            inputProps={{ min: fromDate }}
                        />
                    </Grid>
                </Grid>

                {/* Show selected date range */}
                {dateRange.length > 0 && (
                    <Grid container spacing={1} sx={{ mt: 2 ,width: "40%",  gap: 1 }}>
                        {dateRange.map(date => (
                            <Grid item key={date}>
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    onClick={() => handleRemoveDate(date)}
                                   
                                >
                                    {date} &times;
                                </Button>
                            </Grid>
                        ))}
                    </Grid>
                )}

                <Button
                    variant="contained"
                    color="success"
                    sx={{ mt: 5, textTransform: "none" }}
                    onClick={handleSaveAvailability}
                >
                    Save Availability
                </Button>
            </Grid>

            {/* Time Slots */}
            <Grid item xs={12} md={6} alignItems={"stretch"} sx={{ display: "flex", flexDirection: "column" }}>
                <Typography variant="h5" sx={{ mt: 10, ml: 3,  }}>
                    Available Timeslots
                </Typography>
                <AvailabilitySlotManager
                    slots={slots}
                    setSlots={setSlots}
                    onSaveSettings={onSaveSettings}
                />
            </Grid>
        </Grid>
    );
}
