import React, { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useNavigate } from 'react-router-dom';

const ProfileUpload = () => {
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile && uploadedFile.size <= 2 * 1024 * 1024) {
      setFile(uploadedFile);
    } else {
      alert("File must be PNG/JPG and less than 2MB");
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.size <= 2 * 1024 * 1024) {
      setFile(droppedFile);
    } else {
      alert("File must be PNG/JPG and less than 2MB");
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleSubmit = () => {
    
    alert("Profile setup complete!");
    navigate("/dashboard")
    
  };

  return (
    <Box sx={{ maxWidth: 650, mx: 'auto', p: 4, boxShadow: 3, borderRadius: 2 }}>
      <Typography variant="subtitle1" gutterBottom fontWeight="bold">
        Profile Picture
      </Typography>

      <Box
        sx={{
          border: '2px dashed #ccc',
          borderRadius: 2,
          textAlign: 'center',
          py: 5,
          cursor: 'pointer',
          mb: 3,
          bgcolor: '#f9f9f9',
        }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => document.getElementById('upload-input').click()}
      >
        <CloudUploadIcon sx={{ fontSize: 40, color: '#999' }} />
        <Typography>Click to upload or drag and drop</Typography>
        <Typography fontSize="small" color="text.secondary">
          PNG, JPG up to 2MB
        </Typography>
        <input
          id="upload-input"
          type="file"
          accept="image/png, image/jpeg"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
      </Box>

      {file && (
        <Typography fontSize="small" color="text.primary" mb={2}>
          Selected: {file.name}
        </Typography>
      )}

      <Button
        fullWidth
        variant="contained"
        onClick={handleSubmit}
        sx={{ backgroundColor: '#00c853', '&:hover': { backgroundColor: '#00b44a' } }}
      >
        Complete Profile Setup
      </Button>
    </Box>
  );
};

export default ProfileUpload;
