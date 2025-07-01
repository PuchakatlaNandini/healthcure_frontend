import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
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
  FaMapMarkerAlt,
  FaVideo,
  FaClinicMedical,
} from "react-icons/fa";
// import { DatePicker } from "@mui/x-date-pickers/DatePicker";
// import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import dayjs from "dayjs";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
// import IconButton from "@mui/material/IconButton";
// import CloseIcon from "@mui/icons-material/Close";


// const BookAppointment = () => {
  // const location = useLocation();
  // const navigate = useNavigate();
  const BookAppointment = ({ doctor, user, onClose, onSuccess }) => {
const navigate = useNavigate();
  const location = useLocation();
  // const [doctor, setDoctor] = useState(location.state?.doctor || JSON.parse(localStorage.getItem("selectedDoctor")));
  // const user = JSON.parse(localStorage.getItem("currentUser"));

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
    alert("Missing doctor info. Redirecting...");
    navigate("/patient/dashboard");
  }
}, [doctor, navigate]);

  

  // useEffect(() => {
  //   if (!doctor || !user) {
  //     alert("Missing doctor or user info. Redirecting...");
  //     navigate("/patient/dashboard");
  //   }
  // }, [doctor, user, navigate]);

  useEffect(() => {
    if (!doctor?._id) return;
    axios.get(`http://localhost:5000/api/doctors/availability/${doctor._id}`)
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

        const res = await axios.get("http://localhost:5000/api/appointments/booked-slots", {
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
      await axios.post("http://localhost:5000/api/appointments/book", payload);
      setSuccess(true);
      setBookedSlots(prev => [...prev, selectedSlot]); 
      alert("Appointment booked successfully!");
      setLoading(false);
      // navigate("/patient/dashboard", { state: { showAppointments: true } });
      onSuccess(); 
    } catch (error) {
      setLoading(false);
      alert(error.response?.data?.message || "Failed to book appointment.");
    }
  };

  return (
    <Box p={4} >
      <Typography variant="h4" display="flex" justifyContent="flex-start" gutterBottom>
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

      <Grid container spacing={4} direction="row" alignContent="flex-start" justifyContent="flex-start">
        {/* Doctor Info */}
        <Grid item xs={12} md={6}  textAlign="center">
          <Paper elevation={3} sx={{ p: 3 }}>
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
                  <Typography key={idx} variant="caption" sx={{ border: "1px solid #ccc", borderRadius: 1, px: 1 }}>{deg}</Typography>
                ))}
              </Stack>
              <Typography><FaUserMd /> {doctor?.experience} years experience</Typography>
              <Typography><FaMapMarkerAlt /> {doctor?.address||"location is not"}</Typography>
              
              {/* <Typography><FaStar /> {doctor?.rating} ({doctor?.reviews} reviews)</Typography> */}
              <Typography variant="body1" color="secondary">₹{doctor?.fee} consultation</Typography>
            </Stack>
          </Paper>
        </Grid>

        {/* Booking Form */}
        <Grid item xs={12} md={6} textAlign="center" maxWidth={"60%"}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Book Your Appointment</Typography>
            <Typography variant="body2" mb={2}>Choose date, time and consultation type</Typography>

            <Stack direction="row" spacing={2} mb={2} justifyContent="center">
              {["In-Person", "Online"].map((type) => (
                <Button
                  key={type}
                  sx={{ minWidth: 200,height: 30 }}
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
      fullWidth: false,
      size: "small",
      sx: {
        width: "200px",
        fontSize: "14px",
      },
    },
  }}
/>


            </Box>

            {selectedDate && availableSlots.length > 0 && (
              <Box>
                <Typography variant="subtitle1" gutterBottom>Select Time Slot:</Typography>
                <Stack direction="row" spacing={1}  sx={{display: "flex", flexWrap: "wrap",gap:1,justifyContent:"flex-start"}}>
                  {availableSlots.map((slot) => {
                    const isBooked = bookedSlots.includes(slot);
                    return (
                      <Button
                  
                        key={slot}
                        variant={selectedSlot === slot ? "contained" : "outlined"}
                        onClick={() => !isBooked && setSelectedSlot(slot)}
                        disabled={isBooked}
                        color={isBooked ? "inherit" : selectedSlot === slot ? "success" : "primary"}
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
            {/* <Button
  variant="outlined"
  color="error"
  sx={{ mt: 2 }}
  onClick={onClose}
>
  Close
</Button> */}

          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default BookAppointment;
