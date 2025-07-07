import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const ProfileUpload = ({ onCompleteSetup, onImageSelect }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile && uploadedFile.size <= 2 * 1024 * 1024) {
      setFile(uploadedFile);
      onImageSelect(uploadedFile);
      handlePreview(uploadedFile);
    } else {
      alert("File must be PNG/JPG and less than 2MB");
    }
  };

  const handlePreview = (file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.size <= 2 * 1024 * 1024) {
      setFile(droppedFile);
      onImageSelect(droppedFile);
      handlePreview(droppedFile);
    } else {
      toast.error("File must be PNG/JPG and less than 2MB");
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <Box sx={{ width: '90%', p: { xs: 2, sm: 3 }, boxShadow: 3, borderRadius: 2 }}>
      <Typography variant="subtitle1" mb={2} fontWeight="bold" >
        Profile Picture
      </Typography>

      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'center', sm: 'flex-start' },
          gap: 4,
          flexWrap: 'wrap'
        }}
      >
        <Box
          sx={{
            width: { xs: '100%', sm: 200 },
            height: 200,
            border: '2px dashed #ccc',
            borderRadius: 2,
            bgcolor: '#f9f9f9',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            cursor: 'pointer',
            flexShrink: 0,
          }}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => document.getElementById('upload-input').click()}
        >
          <CloudUploadIcon sx={{ fontSize: 40, color: '#999', mb: 1 }} />
          <Typography variant="body2">Click to upload or drag and drop</Typography>
          <Typography variant="caption" color="text.secondary">
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
        {preview && (
          <Box sx={{
            width: { xs: '100%', sm: 200 },
            mt: { xs: 2, sm: 0 },
            textAlign: { xs: 'center', sm: 'left' }
          }}>
            <Typography variant="caption" color="text.primary" mb={1} noWrap>
              Selected: {file?.name}
            </Typography>
            <Box
              component="img"
              src={preview}
              alt="Preview"
              sx={{
                width: '100%',
                height: 200,
                objectFit: 'cover',
                borderRadius: 2,
                boxShadow: 1,
                mt: 1
              }}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ProfileUpload;
