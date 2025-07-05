import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Stack
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axiosInstance from "../../utils/axios";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import DoctorNavBar from "../Doctor/doctorNavbar"

const DoctorAppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
 const [fromDate, setFromDate] = useState(dayjs().startOf('month'));
  const [toDate, setToDate] = useState(dayjs().endOf('month'));

  const doctorId = localStorage.getItem("doctorId");

   useEffect(() => {
    const fetchAppointments = async () => {
      if (!doctorId || !fromDate || !toDate) return;

      try {
        const res = await axiosInstance.get(`/appointments/doctor/${doctorId}`);
        const allAppointments = res.data;

        const filtered = allAppointments.filter((appt) => {
          const apptDate = dayjs(appt.scheduledAt);
          return apptDate.isAfter(fromDate.startOf("day").subtract(1, 'second')) &&
                 apptDate.isBefore(toDate.endOf("day").add(1, 'second'));
        });

        setAppointments(filtered);
      } catch (err) {
        console.error("Failed to load appointments:", err);
      }
    };

    fetchAppointments();
  }, [doctorId, fromDate, toDate]);

  const columns = [
    { field: "id", headerName: "ID", minwidth: 200, sortable: false, filterable: false ,flex:0.5},
    { field: "patientName", headerName: "Patient",minwidth: 200, sortable: false, filterable: false ,flex:1},
    { field: "date", headerName: "Date", minwidth: 200, sortable: false, filterable: false ,flex:1},
    { field: "time", headerName: "Time", minwidth: 200, sortable: false, filterable: false,flex:1 },
    { field: "type", headerName: "Consultation", minwidth: 200, sortable: false, filterable: false,flex:1 },
    { field: "status", headerName: "Status", minwidth: 200, sortable: false, filterable: false,flex:1 },
    // { field: "notes", headerName: "Notes", width: 220,sortable:false,filterable:false },
  ];

  const rows = appointments
  .slice()
  .sort((a,b)=>new Date(a. scheduledAt) - new Date(b.scheduledAt))
  .map((appt, i) => {
    const date = new Date(appt.scheduledAt);
    return {
      id: i + 1,
      patientName: appt.userId?.name || "N/A",
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      type: appt.consultationType,
      status: appt.status,
      //   notes: appt.notes,
    };
  });

  return (
    <Box >
      <DoctorNavBar />
      <Typography variant="h4" align="center" sx={{ mt: 2, mb: 7 }} />
      <Box sx={{ px: 2, py: 3, width: "100%", maxWidth: 1200, mx: "auto", overflowY: "hidden", height: "470px", ml: 4 }}>


        <Typography variant="h5" gutterBottom>
          Appointments by Date
        </Typography>

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mb={2} mt={3}  sx={{ maxWidth: "100%", flexWrap: "wrap" }}>
          <Box sx={{ minWidth: 200, maxWidth: 250, flex: 1 }}>
    <DatePicker
      label="From Date"
      value={fromDate}
      onChange={(newVal) => setFromDate(newVal)}
      slotProps={{ textField: { fullWidth: true, size: "small" } }}
    />
  </Box>
  <Box sx={{ minWidth: 200, maxWidth: 250, flex: 1 }}>
    <DatePicker
      label="To Date"
      value={toDate}
      onChange={(newVal) => setToDate(newVal)}
      slotProps={{ textField: { fullWidth: true, size: "small" } }}
    />
  </Box>
           
          </Stack>
        </LocalizationProvider>

        <Box sx={{ width: "100%",overflowX:"auto" }}>
          <DataGrid autoHeight rows={rows} columns={columns} pageSize={5}
            rowHeight={50}
            pageSizeOptions={[5]}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 5, page: 0 },
              },
            }}
            sx={{
              minWidth:"600px",
              "& .MuiDataGrid-root": {
                border: "none",
              },
              "& .MuiDataGrid-columnHeaders": {
                color: "#fff",
              },
              "& .MuiDataGrid-columnHeader": {
                backgroundColor: "#0043a8 !important",
                border: "none",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              },
              "& .MuiDataGrid-columnHeader:last-of-type": {
                borderRight: "none",
              },

              ".MuiDataGrid-columnSeparator": {
                // display: "none",
              },
              "&.MuiDataGrid-root": {
                border: "none",
              },
              "& .MuiDataGrid-columnHeaderTitle": {
                fontWeight: 500,
                textAlign: "center",
                width: "100%",
                display: "flex",
                justifyContent: "center",
              },
              "& .MuiDataGrid-columnHeaderTitleContainer": {
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                textAlign: "center",
              },
              "& .MuiDataGrid-cell": {
                textAlign: "center",
                justifyContent: "center",
                alignItems: "center",
              },

            }}
            disableColumnMenu />
        </Box>
      </Box>
    </Box>
  );
};

export default DoctorAppointmentsPage;
