import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Typography,
  IconButton,
  Dialog,
  Slide,
  Avatar,
  Button,
  useMediaQuery,
  useTheme,
  Tooltip,
  Divider,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import CloseIcon from "@mui/icons-material/Close";
import LogoutIcon from "@mui/icons-material/Logout";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import { useNavigate } from "react-router-dom";
import SettingsIcon from "@mui/icons-material/Settings";
import axiosInstance from "../../utils/axios";


const DoctorNavbar = () => {
  const doctorId = localStorage.getItem("doctorId");

  const navigate = useNavigate();
  const doctorName = localStorage.getItem("doctorName") || "Doctor";
  const doctorRole = "Doctor";

  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const iconRef = useRef(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleProfileClick = () => {
    const rect = iconRef.current.getBoundingClientRect();
    const top = rect.bottom + 8;
    const left = Math.min(rect.left, window.innerWidth - 270);
    setPosition({ top, left });
    setOpen(true);
  };

  const handleDialogClose = () => setOpen(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("doctorName");
    localStorage.removeItem("doctorImage");

    navigate("/doctor/register");
  };

  const handleMyAppointments = () => {
    handleDialogClose();
    navigate("/doctor/appointments");
  };

  const handleProfileForm = () => {
    handleDialogClose();
    navigate("/doctor/profile");
  };
  const doctorImage = localStorage.getItem("doctorImage");
  const [doctor, setDoctor] = useState(null);

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axiosInstance.get(`/doctors/${doctorId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Doctor fetched from backend:", res.data);
        setDoctor(res.data);
      } catch (err) {
        console.error("Error fetching doctor details:", err);
      }
    };

    if (doctorId) fetchDoctor();
  }, [doctorId]);


  return (
    <Box sx={{ borderBottom: "1px solid black", backgroundColor: "#fff", position: "fixed", top: 0, zIndex: 1000, width: "100vw" }}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: 3, py: 1 }}>
        <Box sx={{cursor:"pointer"}}
        onClick={()=>navigate('/dashboard')}>
        <img src="../images/image.png" alt="Healthcure" style={{ width: 250, maxWidth: "30vw", height: "auto" }} />
</Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography variant="subtitle2" sx={{ fontSize: { xs: 12, sm: 16 } }}>
            Welcome {doctorName}
          </Typography>

          <Tooltip title="Profile">
            <IconButton ref={iconRef} onClick={handleProfileClick}>
              <AccountCircleIcon fontSize="large" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Dialog
        open={open}
        onClose={handleDialogClose}
        TransitionComponent={Slide}
        keepMounted
        disableEnforceFocus
        PaperProps={{
          sx: {
            position: "absolute",
            top: position.top,
            left: position.left,
            m: 0,
            backgroundColor: "#fff",
            boxShadow: "0px 4px 12px rgba(0,0,0,0.2)",
            borderRadius: 2,
            overflow: "visible",
            width: isMobile ? "60vw" : "240px",
          },
        }}
        BackdropProps={{
          sx: {
            backgroundColor: "rgba(0,0,0,0.4)",
          },
        }}
      >
        <Box sx={{ position: "relative", p: 2 }}>
          <IconButton
            onClick={handleDialogClose}
            size="small"
            sx={{ position: "absolute", top: 8, right: 8 }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>

          {/* profile */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
            <Avatar
              src={doctorImage || "https://cdn-icons-png.flaticon.com/512/4140/4140037.png"}
              sx={{ width: 56, height: 56 }}
            />
            <Box>
              <Typography variant="h6">{doctor?.name}</Typography>
              <Typography variant="subtitle2">{doctor?.specialization}</Typography>

            </Box>
          </Box>

          <Divider sx={{ mb: 2 }} />

          <Box display="flex" alignItems="center" gap={1} sx={{ cursor: "pointer", mb: 2 }} onClick={handleMyAppointments}>
            <EventAvailableIcon fontSize="small" />
            <Typography fontSize={14}>My Appointments</Typography>
          </Box>

          <Box
            display="flex"
            alignItems="center"
            gap={1}
            sx={{ cursor: "pointer", mb: 2 }}
            onClick={handleProfileForm}
          >
            <SettingsIcon fontSize="small" />
            <Typography fontSize={14}>Profile Settings</Typography>
          </Box>


          <Button
            fullWidth
            endIcon={<LogoutIcon />}
            onClick={handleLogout}
            variant="contained"
            sx={{
              backgroundColor: "#d9664f",
              textTransform: "none",
              borderRadius: 2,
              fontWeight: "bold",
              "&:hover": {
                backgroundColor: "#c25545",
              },
            }}
          >
            Log Out
          </Button>
        </Box>
      </Dialog>
    </Box>
  );
};

export default DoctorNavbar;
