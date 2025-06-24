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
      alert("File must be PNG/JPG and less than 2MB");
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <Box sx={{ maxWidth: 600, p: 4, boxShadow: 3, borderRadius: 2 }}>
      <Typography variant="subtitle1" sx={{mb: 0}} fontWeight="bold" >
        Profile Picture
      </Typography>

      {/* Main row box */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'flex-end',
          gap: 4,
          flexWrap: 'nowrap'
        }}
      >
        {/* Upload Area */}
        <Box
          sx={{
            width: 200,
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

        {/* Preview Area */}
        {preview && (
          <Box sx={{ width: 200 ,ml: 10}}>
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
