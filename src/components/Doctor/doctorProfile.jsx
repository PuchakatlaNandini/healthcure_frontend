import React, { useState, useEffect } from "react";
import {
    Box,
    Typography,
    Paper,
    Grid,
    TextField,
    MenuItem,
    Button,
    InputAdornment,
    Container
} from "@mui/material";
import {
    Person,
    Email,
    LocalHospital,
    Phone,
    Business,
    MonetizationOn,
    Password,
} from "@mui/icons-material";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ProfileUpload from "./profileUpload";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import IconButton from '@mui/material/IconButton';

const specializations = [
    "Cardiology",
    "Dermatology",
    "Neurology",
    "Dentist",
    "Pediatrics",
    "Psychiatry",
    "General Physician"
];

const consultationFees = [
    "50",
    "100",
    "150",
    "200",
    "250",
    "300",
    "350",
    "400",
]
export default function DoctorProfile() {

    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        phone: "",
        specialization: "",
        experience: "",
        fee: "",
        degrees: "",
        address: "",
        from: "",
        to: "",
        bio: "",

    });


    const [selectedImage, setSelectedImage] = useState(null);
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    }

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleImageUpload = (file) => {
        setFormData((prev) => ({ ...prev, image: file }));

        const reader = new FileReader();
        reader.onloadend = () => {
            localStorage.setItem("doctorImage", reader.result);
        };
        if (file) {
            reader.readAsDataURL(file);
        }
    };


    const isFormIncomplete = !formData.name || !formData.email || !formData.specialization || !formData.password || !formData.experience || !formData.degrees || !formData.address || !formData.bio || !formData.fee;


    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        const formDataToSend = new FormData();

        Object.keys(formData).forEach((key) => {
            formDataToSend.append(key, formData[key]);
        });

        if (selectedImage) {
            formDataToSend.append("image", selectedImage);

        }

        try {
            await axios.post("http://localhost:5000/api/doctors/profile", formDataToSend, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data"
                }
            });
            toast.success("Profile submitted successfully!");
            navigate("/dashboard");
        } catch (error) {
            toast.error(error?.response?.data?.message || "Error submitting profile");
        }
    };


    const handleTimeInput = (e) => {
        const { name, value } = e.target;
        let input = value.toUpperCase();

        input = input.replace(/[^0-9: AMP]/g, "");

        if (input.length <= 2 && /^(AM|PM)/.test(input)) {
            return;
        }

        const amPmMatch = input.match(/\b(AM|PM)\b/);
        if (amPmMatch) {
            input = input.substring(0, amPmMatch.index + 2);
        }

        if (input && !/^[0-9]/.test(input)) return;

        setFormData((prev) => ({
            ...prev,
            [name]: input
        }));
    };

    //autofill
    useEffect(() => {
        const fetchDoctorProfile = async () => {
            const token = localStorage.getItem("token");
            const doctorId = localStorage.getItem("doctorId");

            if (!doctorId || !token) return;

            try {
                const response = await axios.get(`http://localhost:5000/api/doctors/${doctorId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                const data = response.data;

                setFormData({
                    name: data.name || "",
                    email: data.email || "",
                    password: "",
                    phone: data.phone || "",
                    specialization: data.specialization || "",
                    experience: data.experience || "",
                    fee: data.fee || "",
                    degrees: data.degrees || "",
                    address: data.address || "",
                    from: data.from || "",
                    to: data.to || "",
                    bio: data.bio || "",
                });

                if (data.image && data.image.data) {
                    const imgSrc = `data:${data.image.contentType};base64,${btoa(
                        new Uint8Array(data.image.data.data).reduce((data, byte) => data + String.fromCharCode(byte), '')
                    )}`;
                    setSelectedImage(data.image.data);
                    localStorage.setItem("doctorImage", imgSrc);
                }
            } catch (error) {
                console.error("Error fetching doctor profile:", error);
                toast.error("Failed to load profile");
            }
        };

        fetchDoctorProfile();
    }, []);



    return (
        <Container maxWidth={false} disableGutters sx={{ pl: { xs: 2, sm: 4, md: 6 }, pr: 0 }}>
            <Box sx={{ py: 4, textAlign: "left", minHeight: "90vh" }}>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                    Complete Your Doctor Profile
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                    Help patients find you by providing your professional details
                </Typography>

                <Paper
                    elevation={3}
                    sx={{
                        width: { xs: '90%', sm: '90%', md: '75%', lg: '60%' },
                        p: { xs: 2, sm: 3, md: 4 },
                        mt: { xs: 2, sm: 3, md: 3 },
                        borderRadius: 3,
                        bgcolor: "#f9fdfd",
                        textAlign: "left",
                    }}
                >
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                        <LocalHospital sx={{ mr: 1, verticalAlign: "middle" }} />
                        Professional Information
                    </Typography>
                    <Typography variant="subtitle2" gutterBottom>
                        Please provide accurate information to build trust with patients
                    </Typography>

                    <Box component="form" noValidate sx={{ mt: 3, }}>
                        <Grid container spacing={2}>
                            {/* Full Name */}
                            <Grid item xs={12} sm={6} size={6}>
                                <TextField
                                    fullWidth
                                    label="Full Name *"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    // defaultValue="Dr. John Smith"
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Person />
                                            </InputAdornment>
                                        )
                                    }}
                                    sx={{ fontSize: { xs: 12, sm: 14 } }}
                                />
                            </Grid>
                            {/* Specialization */}
                            <Grid item xs={12} sm={6} size={6}>
                                <TextField
                                    fullWidth
                                    select
                                    label="Specialization *"
                                    name="specialization"
                                    value={formData.specialization}
                                    onChange={handleChange}
                                    defaultValue="Cardiology"
                                    variant="outlined"
                                    sx={{ fontSize: { xs: 12, sm: 14 } }}
                                >
                                    {specializations.map((option) => (
                                        <MenuItem key={option} value={option}>
                                            {option}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            {/* Email */}
                            <Grid item xs={12} sm={6} size={6}>
                                <TextField
                                    fullWidth
                                    label="Email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    defaultValue="doctor@example.com"
                                    required
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Email />
                                            </InputAdornment>
                                        )
                                    }}
                                    sx={{ fontSize: { xs: 12, sm: 14 } }}
                                />
                            </Grid>
                            {/* Password */}
                            <Grid item xs={12} sm={6} size={6}>
                                <TextField
                                    fullWidth
                                    label="Password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    value={formData.password}
                                    onChange={handleChange}
                                    defaultValue="12334"
                                    required
                                    autoComplete="new-password"
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Password />
                                            </InputAdornment>
                                        ),
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton onClick={togglePasswordVisibility} edge="end">
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }}
                                    sx={{ fontSize: { xs: 12, sm: 14 } }}
                                />
                            </Grid>
                            {/* Phone Number */}
                            <Grid item xs={12} sm={6} size={6}>
                                <TextField
                                    fullWidth
                                    label="Phone Number"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    defaultValue="+1 (555) 123-4567"
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Phone />
                                            </InputAdornment>
                                        )
                                    }}
                                    sx={{ fontSize: { xs: 12, sm: 14 } }}
                                />
                            </Grid>
                            {/* Years of Experience */}
                            <Grid item xs={12} sm={6} size={6}>
                                <TextField
                                    fullWidth
                                    label="Years of Experience *"
                                    name="experience"
                                    value={formData.experience}
                                    onChange={handleChange}
                                    defaultValue="10"
                                    type="number"

                                    sx={{ fontSize: { xs: 12, sm: 14 } }}
                                />
                            </Grid>
                            {/* Consultation Fee */}
                            <Grid item xs={12} sm={6} size={6}>
                                <TextField
                                    fullWidth
                                    select
                                    label="Consultation Fee "
                                    name="fee"
                                    value={formData.fee}
                                    onChange={handleChange}
                                    defaultValue="100"
                                    required
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <MonetizationOn />
                                            </InputAdornment>
                                        )
                                    }}
                                    sx={{ fontSize: { xs: 12, sm: 14 } }}
                                >{consultationFees.map((option) => (
                                    <MenuItem key={option} value={option}>
                                        {option}
                                    </MenuItem>
                                ))}
                                </TextField>

                            </Grid>
                            {/* Medical Degrees */}
                            <Grid item xs={12} sm={6} size={12}>
                                <TextField
                                    fullWidth
                                    label="Medical Degrees & Qualifications"
                                    name="degrees"
                                    value={formData.degrees}
                                    onChange={handleChange}
                                    defaultValue="MBBS, MD (Medicine), Fellowship in Cardiology"
                                    required
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <LocalHospital />
                                            </InputAdornment>
                                        )
                                    }}
                                    sx={{ fontSize: { xs: 12, sm: 14 } }}
                                />
                            </Grid>
                            {/* Clinic Address */}
                            <Grid item xs={12} sm={6} size={12}>
                                <TextField
                                    fullWidth
                                    label="Clinic/Hospital Address"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    defaultValue="123 Medical Center, New York, NY 10001"
                                    required
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Business />
                                            </InputAdornment>
                                        )
                                    }}
                                    sx={{ fontSize: { xs: 12, sm: 14 } }}
                                />
                            </Grid>
                            {/* Working Hours Section */}
                            <Grid item xs={12}>
                                <Typography variant="h6" gutterBottom>
                                    Working Hours
                                </Typography>
                                <Grid item xs={12} mt={2}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6} size={6}>
                                            <TextField
                                                fullWidth
                                                label="Available From"
                                                name="from"
                                                value={formData.from}
                                                onChange={handleTimeInput}
                                                placeholder="09:00 AM"
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <AccessTimeIcon />

                                                        </InputAdornment>
                                                    )
                                                }}
                                                inputProps={{ maxLength: 8 }}
                                                sx={{ fontSize: { xs: 12, sm: 14 } }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6} >
                                            <TextField
                                                fullWidth
                                                label="Available To"
                                                name="to"
                                                value={formData.to}
                                                onChange={handleTimeInput}
                                                defaultValue="10:00 PM"
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <AccessTimeIcon />
                                                        </InputAdornment>
                                                    )
                                                }}
                                                inputProps={{ maxLength: 8 }}
                                                sx={{ fontSize: { xs: 12, sm: 14 } }}
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                            {/* Description Section */}
                            <Grid item xs={12} size={12}>
                                <Typography variant="h6" gutterBottom>
                                    Bio
                                </Typography>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        required
                                        id="description"
                                        label="Description"
                                        name="bio"
                                        value={formData.bio}
                                        onChange={handleChange}
                                        placeholder="Describe about yourself"
                                        multiline
                                        rows={3}
                                        variant="outlined"
                                        sx={{ fontSize: { xs: 12, sm: 14 } }}
                                    />
                                </Grid>
                            </Grid>
                            <Grid item xs={12} size={12}>
                                <ProfileUpload onImageSelect={handleImageUpload} />
                            </Grid>
                            <Grid item xs={12} mt={3}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    onClick={handleSubmit}
                                    disabled={isFormIncomplete}
                                    sx={{ py: 1.5, fontWeight: 'bold', fontSize: 16 }}
                                >
                                    Submit Profile
                                </Button>
                            </Grid>

                        </Grid>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
}