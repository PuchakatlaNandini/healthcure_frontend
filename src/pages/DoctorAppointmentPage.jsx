import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axiosInstance from "../utils/axios";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import DoctorNavBar from "../components/DoctorNavBar";

const DoctorAppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(dayjs());

  const doctorId = localStorage.getItem("doctorId");

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!doctorId || !selectedDate) return;

      try {
        const formattedDate = selectedDate.format("YYYY-MM-DD");
        const res = await axiosInstance.get(`/appointments/booked-slots?doctorId=${doctorId}&date=${formattedDate}`);
        const res2 = await axiosInstance.get(`/appointments/doctor/${doctorId}`);

        const filtered = res2.data.filter((appt) => {
          const apptDate = new Date(appt.scheduledAt);
          return (
            apptDate.toISOString().slice(0, 10) === formattedDate
          );
        });

        setAppointments(filtered);
      } catch (err) {
        console.error("Failed to load appointments:", err);
      }
    };

    fetchAppointments();
  }, [doctorId, selectedDate]);

  const columns = [
    { field: "id", headerName: "ID", width: 200, sortable: false, filterable: false },
    { field: "patientName", headerName: "Patient", width: 200, sortable: false, filterable: false },
    { field: "date", headerName: "Date", width: 200, sortable: false, filterable: false },
    { field: "time", headerName: "Time", width: 200, sortable: false, filterable: false },
    { field: "type", headerName: "Consultation", width: 200, sortable: false, filterable: false },
    { field: "status", headerName: "Status", width: 200, sortable: false, filterable: false, },
    // { field: "notes", headerName: "Notes", width: 220,sortable:false,filterable:false },
  ];

  const rows = appointments.map((appt, i) => {
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
          <DatePicker
            sx={{ mb: 2 }}
            label="Select Date"
            value={selectedDate}
            onChange={(newDate) => setSelectedDate(newDate)}
            renderInput={(params) => (
              <TextField {...params} sx={{ mb: 2, width: 300 }} />
            )}
          />
        </LocalizationProvider>

        <Box sx={{ width: "100%" }}>
          <DataGrid autoHeight rows={rows} columns={columns} pageSize={5}
            rowHeight={50}
            pageSizeOptions={[5]}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 5, page: 0 },
              },
            }}
            sx={{
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
