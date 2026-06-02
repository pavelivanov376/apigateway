import React, { useState, useEffect, useCallback } from "react";
import { Alert, CircularProgress, Box } from "@mui/material";
import FileTable from "./FileTable";
import { useAuth } from "../context/AuthContext";

export default function FileListingContainer({ onRefreshReady, currentDirectoryId: propDirectoryId, onFolderClick, onParentClick, showParentFolder }) {
  const { getAuthHeader } = useAuth();
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Use prop if provided, otherwise default to root
  const currentDirectoryId = propDirectoryId || "10000000-0000-0000-0000-000000000001";

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/folder/" + currentDirectoryId, {
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Session expired. Please login again.');
        } else if (response.status === 404) {
          // Folder not found - might be first time, show empty
          setContent([]);
          return;
        }
        throw new Error(`Failed to load folder: ${response.status}`);
      }

      const data = await response.json();
      setContent(data);
    } catch (error) {
      console.error("Error fetching files:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [currentDirectoryId, getAuthHeader]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Expose refresh function to parent
  useEffect(() => {
    if (onRefreshReady) {
      onRefreshReady(fetchData);
    }
  }, [onRefreshReady, fetchData]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  return <FileTable files={content} onFolderClick={onFolderClick} onParentClick={onParentClick} showParentFolder={showParentFolder} onDelete={fetchData} />;
}
