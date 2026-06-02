import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  IconButton
} from '@mui/material';
import {
  Folder as FolderIcon,
  InsertDriveFile as FileIcon,
  ArrowUpward as ParentFolderIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

export default function FileTable({ files, onFolderClick, onParentClick, showParentFolder, onDelete }) {
  const { getAuthHeader } = useAuth();

  // Handle the flat array response from API
  // API returns: [{ uuid, name, type, owner, creationDate, parentFolderId }, ...]
  // Items with type "folder" or name starting with "/" are folders, others are files
  const items = Array.isArray(files)
    ? files.map(f => ({
        ...f,
        itemType: f.type === 'folder' || f.name?.startsWith('/') ? 'folder' : 'file'
      }))
    : [];

  const handleRowClick = async (item) => {
    if (item.itemType === 'folder') {
      // Navigate into folder (if callback provided)
      if (onFolderClick) {
        onFolderClick(item.uuid, item.name);
      }
    } else {
      // Download file
      try {
        const response = await fetch(`/api/download/${item.uuid}`, {
          headers: getAuthHeader()
        });

        if (!response.ok) {
          throw new Error(`Download failed: ${response.status}`);
        }

        // Create blob and trigger download
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = item.name || 'download';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Error downloading file:', error);
        alert('Failed to download file: ' + error.message);
      }
    }
  };

  const handleParentClick = () => {
    if (onParentClick) {
      onParentClick();
    }
  };

  const handleDelete = async (e, item) => {
    e.stopPropagation(); // Prevent row click
    if (!window.confirm(`Delete "${item.name}"?`)) return;

    try {
      const endpoint = item.itemType === 'folder'
        ? `/api/folder/${item.uuid}`
        : `/api/file/${item.uuid}`;

      const response = await fetch(endpoint, {
        method: 'DELETE',
        headers: getAuthHeader()
      });

      if (!response.ok) {
        throw new Error(`Delete failed: ${response.status}`);
      }

      if (onDelete) onDelete();
    } catch (error) {
      console.error('Error deleting:', error);
      alert('Failed to delete: ' + error.message);
    }
  };

  if (items.length === 0 && !showParentFolder) {
    return (
      <Box sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
        <Typography variant="body1">
          This folder is empty
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          Upload files or create folders to get started
        </Typography>
      </Box>
    );
  }

  return (
    <TableContainer component={Paper} variant="outlined">
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
            <TableCell>Name</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Created</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {/* Parent folder row */}
          {showParentFolder && (
            <TableRow
              hover
              onClick={handleParentClick}
              sx={{ cursor: 'pointer', backgroundColor: '#fafafa' }}
            >
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <ParentFolderIcon sx={{ mr: 1, color: '#78909c' }} />
                  /..
                </Box>
              </TableCell>
              <TableCell>Parent Folder</TableCell>
              <TableCell>-</TableCell>
              <TableCell></TableCell>
            </TableRow>
          )}
          {items.map((item) => (
            <TableRow
              key={item.uuid || item.id}
              hover
              onClick={() => handleRowClick(item)}
              sx={{ cursor: 'pointer' }}
            >
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {item.itemType === 'folder' ? (
                    <FolderIcon sx={{ mr: 1, color: '#ffb74d' }} />
                  ) : (
                    <FileIcon sx={{ mr: 1, color: '#90a4ae' }} />
                  )}
                  {item.name}
                </Box>
              </TableCell>
              <TableCell>
                {item.itemType === 'folder' ? 'Folder' : (item.type || 'File')}
              </TableCell>
              <TableCell>
                {item.creationDate
                  ? new Date(item.creationDate).toLocaleDateString()
                  : '-'}
              </TableCell>
              <TableCell align="right">
                <IconButton
                  size="small"
                  onClick={(e) => handleDelete(e, item)}
                  sx={{ color: 'error.main' }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
