import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Alert,
  CircularProgress
} from '@mui/material';
import { useAuth } from '../context/AuthContext';

export default function CreateFolderDialog({ open, onClose, parentFolderId, onSuccess }) {
  const { getAuthHeader } = useAuth();
  const [folderName, setFolderName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleClose = () => {
    setFolderName('');
    setError(null);
    onClose();
  };

  const handleCreate = async () => {
    if (!folderName.trim()) {
      setError('Folder name is required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/folder/create', {
        method: 'POST',
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: folderName.trim(),
          parentFolderId: parentFolderId
        })
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Session expired. Please login again.');
        }
        throw new Error(`Failed to create folder: ${response.status}`);
      }

      // Success - close dialog and refresh parent
      handleClose();
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error('Error creating folder:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !loading) {
      handleCreate();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create New Folder</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <TextField
          autoFocus
          margin="dense"
          label="Folder Name"
          fullWidth
          variant="outlined"
          value={folderName}
          onChange={(e) => setFolderName(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={loading}
          sx={{ mt: 1 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleCreate}
          variant="contained"
          disabled={loading || !folderName.trim()}
        >
          {loading ? <CircularProgress size={24} /> : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
