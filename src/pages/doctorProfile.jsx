import React from "react";
import {
    Box,
    Typography,
    Paper,
    Grid,
    TextField,
    MenuItem,
    InputAdornment
} from "@mui/material";
import {
    Person,
    Email,
    LocalHospital,
    Phone,
    Business,
    MonetizationOn,
    Password
} from "@mui/icons-material";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ProfileUpload from "./profileUpload";

const specializations = [
    "Cardiology",
    "Dermatology",
    "Neurology",
    "Pediatrics",
    "Psychiatry",
    "General Medicine"
];

export default function DoctorProfile() {
    return (
        <Box sx={{ margin: 5, textAlign: "center", minHeight: "90vh" }}>
            {/* Header */}
            <Typography variant="h5" fontWeight="bold" gutterBottom>
                Complete Your Doctor Profile
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
                Help patients find you by providing your professional details
            </Typography>

            {/* Form Container */}
            <Paper
                elevation={3}
                sx={{
                    maxWidth: 600,
                    mx: "auto",
                    p: 4,
                    mt: 4,
                    borderRadius: 3,
                    bgcolor: "#f9fdfd",
                    textAlign: "left"
                }}
            >
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                    <LocalHospital sx={{ mr: 1, verticalAlign: "middle" }} />
                    Professional Information
                </Typography>
                <Typography variant="subtitle2" gutterBottom>
                    Please provide accurate information to build trust with patients
                </Typography>

                <Box component="form" noValidate sx={{ mt: 3 }}>
                    <Grid container spacing={6}>
                        {/* Full Name */}
                        <Grid item xs={12} sm={6} size={6}>
                            <TextField
                                fullWidth
                                label="Full Name *"
                                defaultValue="Dr. John Smith"
                                FilledInput={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Person />
                                        </InputAdornment>
                                    )
                                }}
                            />
                        </Grid>

                        {/* Specialization */}
                        <Grid item xs={12} sm={6} size={6}>
                            <TextField fullWidth select label="Specialization *" defaultValue="Cardiology" variant="outlined">
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
                                defaultValue="doctor@example.com"
                                FilledInput={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Email />
                                        </InputAdornment>
                                    )
                                }}
                            />
                        </Grid>

                             {/* password */}
                        <Grid item xs={12} sm={6} size={6}>
                            <TextField
                                fullWidth
                                label="Password"
                                defaultValue="12334"
                                FilledInput={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Password />
                                        </InputAdornment>
                                    )
                                }}
                            />
                        </Grid>

                        {/* Phone Number */}
                        <Grid item xs={12} sm={6} size={6}>
                            <TextField
                                fullWidth
                                label="Phone Number"
                                defaultValue="+1 (555) 123-4567"
                                FilledInput={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Phone />
                                        </InputAdornment>
                                    )
                                }}
                            />
                        </Grid>

                        {/* Years of Experience */}
                        <Grid item xs={12} sm={6} size={6}>
                            <TextField
                                fullWidth
                                label="Years of Experience *"
                                defaultValue="10"
                                type="number"
                            />
                        </Grid>

                        {/* Consultation Fee */}
                        <Grid item xs={12} sm={6} size={6}>
                            <TextField
                                fullWidth
                                label="Consultation Fee "
                                defaultValue="100"

                                FilledInput={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <MonetizationOn />
                                        </InputAdornment>
                                    )
                                }}
                            />
                        </Grid>

                        {/* Medical Degrees */}
                        <Grid item xs={12} sm={6} size={12}>
                            <TextField
                                fullWidth
                                label="Medical Degrees & Qualifications"
                                defaultValue="MBBS, MD (Medicine), Fellowship in Cardiology"
                                FilledInput={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <LocalHospital />
                                        </InputAdornment>
                                    )
                                }}
                            />
                        </Grid>

                        {/* Clinic Address */}
                        <Grid item xs={12} sm={6} size={12}>
                            <TextField
                                fullWidth
                                label="Clinic/Hospital Address"
                                defaultValue="123 Medical Center, New York, NY 10001"
                                FilledInput={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Business />
                                        </InputAdornment>
                                    )
                                }}
                            />
                        </Grid>

                        {/* Working Hours Section */}
                        <Grid item xs={12}>
                            <Typography variant="h6" gutterBottom>
                                Working Hours
                            </Typography>


                            <Grid item xs={12} mt={2} >
                                <Grid container spacing={3}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Available From"
                                            defaultValue="09:00 AM"
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <AccessTimeIcon />
                                                    </InputAdornment>
                                                )
                                            }}
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={6} >
                                        <TextField
                                            fullWidth
                                            label="Available To"
                                            defaultValue="10:00 PM"
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <AccessTimeIcon />
                                                    </InputAdornment>
                                                )
                                            }}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>

                        {/* Description Section */}
                        <Grid item xs={12} size={4}>
                            <Typography variant="h6" gutterBottom>
                                Bio
                            </Typography>
                            <Grid item xs={12} size={12} width={'40vw'}>
                                <TextField
                                    fullWidth
                                    required
                                    id="description"
                                    label="Description"
                                    placeholder="Describe about yourself"
                                    multiline
                                    rows={3}
                                    variant="outlined"
                                />
                            </Grid>
                        </Grid>
                        <Grid item xs={12} size={12}> 
                        <ProfileUpload/>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>
        </Box>
    );
}
