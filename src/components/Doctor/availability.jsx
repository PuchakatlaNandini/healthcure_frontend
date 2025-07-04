
import React, { useState, useEffect } from "react";
import {
    Typography,
    Grid,
    Button,
    TextField,
    CircularProgress
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
    const [dateRange, setDateRange] = useState([]);
    const [slots, setSlots] = useState([]);
    const [loading, setLoading] = useState(true);

    const doctorId = localStorage.getItem("doctorId"); 

    useEffect(() => {
        const fetchAvailability = async () => {
            try {
                const response = await axios.get(`/doctors/availability/${doctorId}`);
                const { availability, timeSlots } = response.data;

                if (availability?.length > 0) {
                    setDateRange(availability);
                    setFromDate(availability[0]);
                    setToDate(availability[availability.length - 1]);
                }

                if (timeSlots?.length > 0) {
                    const formattedSlots = timeSlots.map((slot, index) => {
                        const [start, end] = slot.split("-");
                        return { id: index + 1, start, end };
                    });
                    setSlots(formattedSlots);
                }
            } catch (error) {
                console.error("Error fetching availability:", error);
                toast.error("Failed to load availability");
            } finally {
                setLoading(false);
            }
        };

        fetchAvailability();
    }, [doctorId]);

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
            await axios.put("/doctors/availability", {
                doctorId,
                dates: generatedDates,
                timeSlots: slots.map(s => `${s.start}-${s.end}`)
            });
            toast.success("Availability saved!");
        } catch (err) {
            console.error("Error saving availability:", err);
            toast.error("Error saving availability");
        }
    };

    const handleRemoveDate = (date) => {
        const updatedDates = dateRange.filter(d => d !== date);
        setDateRange(updatedDates);
    };

    if (loading) {
        return (
            <Grid container justifyContent="center" alignItems="center" sx={{ height: "70vh" }}>
                <CircularProgress color="primary" />
            </Grid>
        );
    }

    return (
        <Grid
            container
            direction="row"
            justifyContent="flex-start"
            alignItems="stretch"
            spacing={4}
            sx={{ ml: 3, width: { xs: "100%", sm: 800, md: 1200 } }}
        >
            <Grid item xs={12} md={6}>
                <Typography variant="h5" sx={{ fontWeight: "bold" }}>Availability Settings</Typography>
                <Typography variant="subtitle1">Set your working date range and manage appointment slots</Typography>

                <Typography variant="h5" sx={{ mt: 3, mb: 3 }}>Select Date Range</Typography>

                <Grid container spacing={2} sx={{ mt: 1 }}>
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

                {dateRange.length > 0 && (
                    <Grid container spacing={1} sx={{ mt: 2, width: "40%", gap: 1}}>
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

            <Grid item xs={12} md={6} sx={{ display: "flex", flexDirection: "column" }}>
                <Typography variant="h5" sx={{ mt: 10, ml: 3 }}>
                    Available Timeslots
                </Typography>
                <AvailabilitySlotManager
                    slots={slots}
                    setSlots={setSlots}
                    selectedDate={fromDate}
                    doctorId={doctorId}
                />
            </Grid>
        </Grid>
    );
}
