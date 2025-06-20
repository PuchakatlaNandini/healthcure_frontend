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

const timeSlots = [
  "09:00 AM", "09:15 AM", "09:30 AM", "09:45 AM",
  "10:00 AM", "10:15 AM", "10:30 AM", "10:45 AM",
  "11:00 AM", "11:15 AM", "11:30 AM", "11:45 AM",
  "12:00 PM", "12:15 PM", "12:30 PM", "12:45 PM",
  "01:00 PM", "01:15 PM", "01:30 PM", "01:45 PM",
  "02:00 PM", "02:15 PM", "02:30 PM", "02:45 PM",
  "03:00 PM", "03:15 PM", "03:30 PM", "03:45 PM",
  "04:00 PM", "04:15 PM", "04:30 PM", "04:45 PM",
];

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
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!doctor || !user) {
      alert("Missing doctor or user info. Redirecting...");
      navigate("/patient/dashboard");
    } else {
      console.log("Loaded user for booking:", user.id || user._id);
    }
  }, [doctor, user, navigate]);

  const handleBookingConfirm = async () => {  
    console.log("user object:", user);
    console.log("doctor object:", doctor);
    if (!user || !doctor || !selectedDate || !selectedSlot) {
      return alert("Please fill all the fields.");
    }
    const userId = user.id || user._id;
    const doctorId = doctor._id || doctor.id;
    if (!userId) {
      alert("User ID is missing or invalid. Cannot book appointment.");
      console.error("User object missing _id or id:", user);
      return;
    }
    if (!doctorId) {
      alert("Doctor ID is missing or invalid. Cannot book appointment.");
      console.error("Doctor object missing _id or id:", doctor);
      return;
    }
    const scheduledAt = new Date(`${selectedDate} ${selectedSlot}`).toISOString();
    const payload = {
      userId,
      doctorId,
      scheduledAt,
      consultationType,
      status: "pending",
    };
    console.log("Booking payload:", payload);
    try {
      setLoading(true);
      const res = await axios.post("http://localhost:5000/api/appointments/book", payload);
      console.log("Booked appointment response:", res.data);
      setSuccess(true);
      alert("Appointment booked successfully!");
      setLoading(false);
      navigate("/patient/dashboard", { state: { showAppointments: true } });
    } catch (error) {
      setLoading(false);
      if (error.response && error.response.data && error.response.data.message) {
        alert("Failed to book appointment: " + error.response.data.message);
      } else {
        alert("Failed to book appointment. Please check your input and try again.");
      }
    }
  };

  return (
    <div className="book-appointment-container">
      <h2 className="page-title">Book Appointment</h2>
      <div className="appointment-content">
        {/* Doctor Profile */}
        <div className="doctor-profile">
          <img
            src={doctor?.imageUrl || "https://via.placeholder.com/150"}
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
              <label>Select Date:</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
          )}

          {/* Time Slot Selection */}
          {selectedDate && (
            <div className="time-slots">
              <label>Select Time Slot:</label>
              <div className="slot-buttons">
                {timeSlots.map((slot) => (
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
