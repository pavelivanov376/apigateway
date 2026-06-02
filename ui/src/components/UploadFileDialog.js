import React, { useState, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Alert,
  CircularProgress,
  Box,
  Typography,
  LinearProgress
} from '@mui/material';
import { CloudUpload as UploadIcon } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

export default function UploadFileDialog({ open, onClose, parentFolderId, onSuccess }) {
  const { getAuthHeader } = useAuth();
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  const handleClose = () => {
    setSelectedFile(null);
    setError(null);
    setUploadProgress(0);
    onClose();
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file');
      return;
    }

    setLoading(true);
    setError(null);
    setUploadProgress(0);

    try {
      // Step 1: Upload file to file service
      const formData = new FormData();
      formData.append('file', selectedFile);

      setUploadProgress(10);

      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          ...getAuthHeader()
          // Don't set Content-Type for FormData - browser will set it with boundary
        },
        body: formData
      });

      if (!uploadResponse.ok) {
        if (uploadResponse.status === 401) {
          throw new Error('Session expired. Please login again.');
        }
        throw new Error(`Failed to upload file: ${uploadResponse.status}`);
      }

      setUploadProgress(50);

      // Get the UUID from the response (returned as plain text/UUID)
      const fileUuid = await uploadResponse.text();
      // Remove quotes if present (JSON string response)
      const cleanUuid = fileUuid.replace(/"/g, '');

      setUploadProgress(70);

      // Step 2: Link file to folder in folder service
      const linkResponse = await fetch('/api/file/link/folder', {
        method: 'POST',
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: selectedFile.name,
          uuid: cleanUuid,
          parentFolderId: parentFolderId
        })
      });

      if (!linkResponse.ok) {
        if (linkResponse.status === 401) {
          throw new Error('Session expired. Please login again.');
        }
        throw new Error(`Failed to link file to folder: ${linkResponse.status}`);
      }

      setUploadProgress(100);

      // Success - close dialog and refresh parent
      handleClose();
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error('Error uploading file:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setSelectedFile(file);
      setError(null);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Upload File</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => fileInputRef.current?.click()}
          sx={{
            border: '2px dashed #ccc',
            borderRadius: 2,
            p: 4,
            textAlign: 'center',
            cursor: 'pointer',
            backgroundColor: selectedFile ? '#e8f5e9' : '#fafafa',
            '&:hover': {
              borderColor: 'primary.main',
              backgroundColor: '#f0f7ff'
            },
            transition: 'all 0.2s ease'
          }}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />
          <UploadIcon sx={{ fontSize: 48, color: selectedFile ? 'success.main' : 'action.disabled', mb: 1 }} />
          {selectedFile ? (
            <>
              <Typography variant="body1" color="success.main">
                {selectedFile.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {(selectedFile.size / 1024).toFixed(1)} KB
              </Typography>
            </>
          ) : (
            <>
              <Typography variant="body1" color="text.secondary">
                Drag and drop a file here, or click to select
              </Typography>
              <Typography variant="body2" color="text.disabled" sx={{ mt: 1 }}>
                Any file type supported
              </Typography>
            </>
          )}
        </Box>

        {loading && (
          <Box sx={{ mt: 2 }}>
            <LinearProgress variant="determinate" value={uploadProgress} />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
              {uploadProgress < 50 ? 'Uploading file...' :
               uploadProgress < 100 ? 'Linking to folder...' : 'Complete!'}
            </Typography>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleUpload}
          variant="contained"
          disabled={loading || !selectedFile}
          startIcon={loading ? <CircularProgress size={20} /> : <UploadIcon />}
        >
          {loading ? 'Uploading...' : 'Upload'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
