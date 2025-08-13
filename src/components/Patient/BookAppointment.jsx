import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Grid,
  Paper,
  Stack,
  Avatar,
  TextField
} from "@mui/material";
import {
  FaStar,
  FaUserMd,
  FaVideo,
  FaClinicMedical,
} from "react-icons/fa";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import dayjs from "dayjs";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { toast } from "react-toastify";
import axiosInstance from "../../utils/axios";

const BookAppointment = ({ doctor, user, onClose, onSuccess, reschedule }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [consultationType, setConsultationType] = useState("In-Person");
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [availability, setAvailability] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);

  useEffect(() => {
    if (!doctor) {
      toast.error("Missing doctor info. Redirecting...");
      navigate("/patient/dashboard");
    }
  }, [doctor, navigate]);


  useEffect(() => {
    if (!doctor?._id) return;
    axiosInstance.get(`/doctors/availability/${doctor._id}`)
      .then(res => {
        setAvailability(res.data.availability || []);
        setTimeSlots(res.data.timeSlots || []);
      })
      .catch(err => console.error("Error fetching availability:", err));
  }, [doctor]);

  useEffect(() => {
    const formattedDate = selectedDate ? dayjs(selectedDate).format("YYYY-MM-DD") : "";
    if (!doctor?._id || !formattedDate) return;

    const fetchAvailableSlots = async () => {
      try {
        if (!availability.includes(formattedDate)) {
          setAvailableSlots([]);
          setBookedSlots([]);
          return;
        }

        const res = await axiosInstance.get("/appointments/booked-slots", {
          params: { doctorId: doctor._id, date: formattedDate },
        });

        setBookedSlots(res.data.bookedSlots || []);
        setAvailableSlots(timeSlots);
      } catch (err) {
        console.error("Error fetching booked slots:", err);
        setBookedSlots([]);
        setAvailableSlots([]);
      }
    };

    fetchAvailableSlots();
  }, [selectedDate, doctor, availability, timeSlots]);

  const handleBookingConfirm = async () => {
    if (!user || !doctor || !selectedDate || !selectedSlot) {
      alert("Please fill all fields.");
      return;
    }

    const userId = user.id || user._id;
    const doctorId = doctor._id || doctor.id;
    const dateStr = dayjs(selectedDate).format("YYYY-MM-DD");
    const timeStr = selectedSlot.split("-")[0].trim();
    const scheduledAt = dayjs(`${dateStr} ${timeStr}`, "YYYY-MM-DD HH:mm").toISOString();

    const payload = {
      userId,
      doctorId,
      scheduledAt,
      consultationType,
      status: "pending",
    };

    try {
      setLoading(true);
      await axiosInstance.post("/appointments/book", payload);
      setSuccess(true);
      setBookedSlots(prev => [...prev, selectedSlot]);
      toast.success("Appointment booked successfully!");
      setLoading(false);
      onSuccess();
    } catch (error) {
      setLoading(false);
      toast.error(error.response?.data?.message || "Failed to book appointment.");
    }
  };

  return (
    <Box p={{ xs: 2, sm: 4 }} >
      <Typography variant="h4" display="flex" justifyContent="flex-start" gutterBottom fontSize={{ xs: "1.5rem", sm: "2rem" }}>
        Book Appointment
      </Typography>

      <IconButton
        onClick={onClose}
        sx={{
          position: "absolute",
          top: 8,
          right: 8,
          zIndex: 10,
        }}
      >
        <CloseIcon />
      </IconButton>

      <Grid container spacing={4} direction={{ xs: "column", md: "row" }} alignContent="flex-start" justifyContent="flex-start" alignItems={"stretch"}>
        {/* Doctor Info */}
        <Grid item xs={12} md={6} textAlign="center">
          <Paper elevation={3} sx={{ p: { xs: 2, sm: 3 }, height: "100%" }}>
            <Stack spacing={1} alignItems="center">
              <Avatar
                src={doctor?.image || "https://via.placeholder.com/150"}
                sx={{ width: 100, height: 100 }}
              />
              <Typography variant="h6">Dr. {doctor?.name}</Typography>
              <Typography variant="subtitle1" color="primary">{doctor?.specialization}</Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {(Array.isArray(doctor?.degrees)
                  ? doctor.degrees
                  : typeof doctor?.degrees === 'string'
                    ? doctor.degrees.split(',').map(d => d.trim())
                    : []
                ).map((deg, idx) => (
                  <Typography key={idx} variant="caption" sx={{ border: "1px solid #ccc", borderRadius: 1, px: 1, mb: 1 }}>{deg}</Typography>
                ))}
              </Stack>
              <Typography><FaUserMd /> {doctor?.experience} years experience</Typography>
              {/* <Typography><FaMapMarkerAlt /> {doctor?.address||"location is not"}</Typography> */}

              <Typography variant="body1" color="secondary">₹{doctor?.fee} consultation</Typography>
            </Stack>
          </Paper>
        </Grid>

        {/* Booking Form */}
        <Grid item xs={12} md={6} textAlign="center" maxWidth={"60%"}>
          <Paper elevation={3} sx={{ p: { xs: 2, sm: 3 } }}>
            <Typography variant="h6" gutterBottom>Book Your Appointment</Typography>
            <Typography variant="body2" mb={2}>Choose date, time and consultation type</Typography>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mb={2} justifyContent="center">
              {["In-Person", "Online"].map((type) => (
                <Button
                  key={type}
                  sx={{ minWidth: 160, }}
                  variant={consultationType === type ? "contained" : "outlined"}
                  color={type === "In-Person" ? "secondary" : "primary"}
                  onClick={() => {
                    setConsultationType(type);
                    setSelectedSlot("");
                  }}
                  startIcon={type === "In-Person" ? <FaClinicMedical /> : <FaVideo />}
                >
                  {type}
                </Button>
              ))}
            </Stack>

            <Box mb={3} mt={3}  >
              <MobileDatePicker
                label="Select Date"
                value={selectedDate}
                onChange={(newValue) => {
                  setSelectedDate(newValue);
                  setSelectedSlot("");
                }}
                disablePast
                slotProps={{
                  textField: {
                    minWidth: "50%",
                    size: "small",

                  },
                }}
              />
            </Box>

            {selectedDate && availableSlots.length > 0 && (
              <Box>
                <Typography variant="subtitle1" gutterBottom>Select Time Slot:</Typography>
                <Stack direction="row" useFlexGap spacing={1} sx={{ display: "flex", flexWrap: "wrap", gap: 1, justifyContent: "flex-start", }}>
                  {availableSlots.map((slot) => {
                    const selectedDateStr = dayjs(selectedDate).format("YYYY-MM-DD");
                    const [startTimeStr] = slot.split("-");
                    const slotDateTime = dayjs(`${selectedDateStr} ${startTimeStr.trim()}`, "YYYY-MM-DD HH:mm");
                    const now = dayjs();

                    const isBooked = bookedSlots.includes(slot);
                    const isPastSlot = selectedDateStr === now.format("YYYY-MM-DD") && slotDateTime.isBefore(now);
                    const disabled = isBooked || isPastSlot;
                    return (
                      <Button

                        key={slot}
                        variant={selectedSlot === slot ? "contained" : "outlined"}
                        onClick={() => !isBooked && setSelectedSlot(slot)}
                        disabled={disabled}
                        color={isBooked ? "inherit" : selectedSlot === slot ? "success" : "primary"}
                        sx={{
                          borderColor: isBooked ? '#f44336' : undefined, color: isBooked ? '#f44336' : undefined,
                          '&.Mui-disabled': {
                            borderColor: '#f44336', color: '#f44336',
                          },
                        }}
                      >
                        {slot}
                      </Button>
                    );
                  })}
                </Stack>
              </Box>
            )}

            {selectedDate && availableSlots.length === 0 && (
              <Typography color="error" mt={2}>No available slots for selected date.</Typography>
            )}

            {selectedSlot && (
              <Button
                variant="contained"
                color="success"
                sx={{ mt: 3 }}
                onClick={handleBookingConfirm}
                disabled={loading}
              >
                {loading ? "Booking..." : "Confirm Booking"}
              </Button>
            )}

            {success && (
              <Typography mt={2} color="success.main">
                Appointment successfully created!
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default BookAppointment;
