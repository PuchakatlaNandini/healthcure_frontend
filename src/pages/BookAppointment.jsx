import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/BookAppointment.css";
import {
  FaStar,
  FaUserMd,
  FaMapMarkerAlt,
  FaVideo,
  FaClinicMedical,
} from "react-icons/fa";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TextField } from "@mui/material";
import dayjs from "dayjs";


// const timeSlots = [
//   "09:00 AM", "09:15 AM", "09:30 AM", "09:45 AM",
//   "10:00 AM", "10:15 AM", "10:30 AM", "10:45 AM",
//   "11:00 AM", "11:15 AM", "11:30 AM", "11:45 AM",
//   "12:00 PM", "12:15 PM", "12:30 PM", "12:45 PM",
//   "01:00 PM", "01:15 PM", "01:30 PM", "01:45 PM",
//   "02:00 PM", "02:15 PM", "02:30 PM", "02:45 PM",
//   "03:00 PM", "03:15 PM", "03:30 PM", "03:45 PM",
//   "04:00 PM", "04:15 PM", "04:30 PM", "04:45 PM",
// ];

const BookAppointment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // Try to get doctor from state, else from localStorage
  const [doctor, setDoctor] = useState(location.state?.doctor || JSON.parse(localStorage.getItem("selectedDoctor")));
  const user = JSON.parse(localStorage.getItem("currentUser"));

  useEffect(() => {
    // If doctor is present in state, save to localStorage for refresh safety
    if (location.state?.doctor) {
      localStorage.setItem("selectedDoctor", JSON.stringify(location.state.doctor));
      setDoctor(location.state.doctor);
    } else if (!doctor) {
      alert("Missing doctor info. Redirecting...");
      navigate("/patient/dashboard");
    }
  }, [location.state, doctor, navigate]);

  const [consultationType, setConsultationType] = useState("In-Person");
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [availabilityData, setAvailabilityData] = useState([]);
  const [availability, setAvailability] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);


  useEffect(() => {
    if (!doctor || !user) {
      alert("Missing doctor or user info. Redirecting...");
      navigate("/patient/dashboard");
    } else {
      console.log("Loaded user for booking:", user.id || user._id);
    }
  }, [doctor, user, navigate]);


  // 🔽 Fetch availability on load
  useEffect(() => {
    if (!doctor?._id) return;
    axios.get(`http://localhost:5000/api/doctors/availability/${doctor._id}`)
      .then(res => {
        setAvailability(res.data.availability || []);
        setTimeSlots(res.data.timeSlots || []);
      })
      .catch(err => console.error("Error fetching availability:", err));
  }, [doctor]);

    

  // 🔽 Filter slots by selected date
  useEffect(() => {
    const formatted = selectedDate ? dayjs(selectedDate).format("YYYY-MM-DD") : "";
    if (availability.includes(formatted)) {
      setAvailableSlots(timeSlots);
    } else {
      setAvailableSlots([]);
    }
  }, [selectedDate, availability, timeSlots]);



const handleBookingConfirm = async () => {
  console.log("✅ Confirm Booking clicked");

  if (!user || !doctor || !selectedDate || !selectedSlot) {
    alert("Please fill all fields.");
    return;
  }

  const userId = user.id || user._id;
  const doctorId = doctor._id || doctor.id;

  if (!userId || !doctorId) {
    alert("User or Doctor ID missing.");
    return;
  }

  // ✅ Format selectedDate from Dayjs to YYYY-MM-DD
  const dateStr = dayjs(selectedDate).format("YYYY-MM-DD");
  const timeStr = selectedSlot.split("-")[0].trim(); // ✅ use only the start time

  console.log("📅 Selected date:", dateStr);
  console.log("⏰ Selected time:", timeStr);


  // ✅ Combine and parse using Dayjs
 const scheduledAtDayjs = dayjs(`${dateStr} ${timeStr}`, "YYYY-MM-DD HH:mm");


  if (!scheduledAtDayjs.isValid()) {
    alert("Invalid date/time combination");
    return;
  }

  const scheduledAt = scheduledAtDayjs.toISOString();

  console.log("📅 Final scheduledAt:", scheduledAt);

  const payload = {
    userId,
    doctorId,
    scheduledAt,
    consultationType,
    status: "pending",
  };

  try {
    setLoading(true);
    const res = await axios.post("http://localhost:5000/api/appointments/book", payload);
    console.log("✅ Appointment booked:", res.data);
    setSuccess(true);
    alert("Appointment booked successfully!");
    setLoading(false);
    navigate("/patient/dashboard", { state: { showAppointments: true } });
  } catch (error) {
    setLoading(false);
    console.error("❌ Booking error:", error);
    alert(
      error.response?.data?.message ||
      "Failed to book appointment. Please try again."
    );
  }
};



  return (
    <div className="book-appointment-container">
      <h2 className="page-title">Book Appointment</h2>
      <div className="appointment-content">
        {/* Doctor Profile */}
        <div className="doctor-profile">
        <img
  src={doctor?.image || "https://via.placeholder.com/150"}
  alt="Doctor"
  className="doctor-image"
/>


          <h3 className="doctor-name">Dr. {doctor?.name}</h3>
          <p className="specialization">{doctor?.specialization}</p>
          <div className="degree-tags">
            {(Array.isArray(doctor?.degrees) ? doctor.degrees : typeof doctor?.degrees === 'string' && doctor.degrees ? doctor.degrees.split(',').map(d => d.trim()) : []).map((deg, index) => (
              <span key={index} className="degree-tag">{deg}</span>
            ))}
          </div>
          <p className="experience">
            <FaUserMd className="icon" /> {doctor?.experience}
          </p>
          <div className="fee-box">
            <span className="fee-label">₹</span> {doctor?.fee} consultation
          </div>
          <p className="location">
            <FaMapMarkerAlt className="icon" /> {doctor?.location}
          </p>
          <p className="rating">
            <FaStar className="icon star" /> {doctor?.rating} ({doctor?.reviews} reviews)
          </p>
        </div>

        {/* Booking Section */}
        <div className="booking-section">
          <h3 className="booking-title">Book Your Appointment</h3>
          <p className="booking-subtitle">Choose date, time and consultation type</p>

          {/* <div className="user-info-box">
            <p><strong>Booking for:</strong> {user?.name} ({user?.email})</p>
          </div> */}

          {/* Type Selection */}
          <div className="consultation-type">
            {["In-Person", "Online"].map((type) => (
              <div
                key={type}
                className={`option ${consultationType === type ? "selected" : ""}`}
                onClick={() => {
                  setConsultationType(type);
                  setSelectedSlot(""); // reset slot
                }}
              >
                {type === "In-Person" ? (
                  <FaClinicMedical className="option-icon" />
                ) : (
                  <FaVideo className="option-icon" />
                )}
                <p className="option-title">{type}</p>
                <p className="option-sub">{type === "In-Person" ? "Visit clinic" : "Video call"}</p>
              </div>
            ))}
          </div>

          {/* Date Selection */}
          {consultationType && (
            <div className="calendar-section">
              {/* <label>Select Date:</label> */}
              <DatePicker
  label="Select Date"
  value={selectedDate}
  onChange={(newValue) => {
    setSelectedDate(newValue); // Keep as Dayjs
    setSelectedSlot(""); // Reset slot
  }}
  renderInput={(params) => <TextField fullWidth {...params} />}
/>


            </div>
          )}

          {/* Time Slot Selection */}
          {selectedDate && availableSlots.length > 0 && (
  <div className="time-slots">
    <label>Select Time Slot:</label>
    <div className="slot-buttons">
      {availableSlots.map((slot) => (
        <button
          key={slot}
          className={`slot-button ${selectedSlot === slot ? "selected" : ""}`}
          onClick={() => setSelectedSlot(slot)}
        >
          {slot}
        </button>
      ))}
    </div>
  </div>
)}

{selectedDate && availableSlots.length === 0 && (
  <p style={{ marginTop: "1rem", color: "red" }}>
    No available slots for selected date.
  </p>
)}


          {/* Confirm Button */}
          {selectedSlot && (
            <button
              className="confirm-button"
              onClick={handleBookingConfirm}
              disabled={loading}
            >
              {loading ? "Booking..." : "Confirm Booking"}
            </button>
          )}

          {success && (
            <p className="success-message"> Appointment successfully created!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;
