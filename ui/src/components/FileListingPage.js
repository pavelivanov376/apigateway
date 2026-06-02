import React, { useState, useCallback } from "react";
import { Typography, Box, Paper, Button, Stack, Breadcrumbs, Link } from "@mui/material";
import {
  Folder as FolderIcon,
  CreateNewFolder as CreateFolderIcon,
  CloudUpload as UploadIcon,
  Home as HomeIcon
} from "@mui/icons-material";
import FileListingContainer from "./FileListingContainer";
import CreateFolderDialog from "./CreateFolderDialog";
import UploadFileDialog from "./UploadFileDialog";

const ROOT_FOLDER_ID = "10000000-0000-0000-0000-000000000001";

export default function FileListPage() {
  const [createFolderOpen, setCreateFolderOpen] = useState(false);
  const [uploadFileOpen, setUploadFileOpen] = useState(false);
  const [refreshFn, setRefreshFn] = useState(null);
  const [currentDirectoryId, setCurrentDirectoryId] = useState(ROOT_FOLDER_ID);
  const [folderPath, setFolderPath] = useState([{ uuid: ROOT_FOLDER_ID, name: "Home" }]);

  const handleRefreshReady = useCallback((fn) => {
    setRefreshFn(() => fn);
  }, []);

  const handleSuccess = () => {
    if (refreshFn) {
      refreshFn();
    }
  };

  const handleFolderClick = (folderUuid, folderName) => {
    setCurrentDirectoryId(folderUuid);
    setFolderPath(prev => [...prev, { uuid: folderUuid, name: folderName }]);
  };

  const handleBreadcrumbClick = (index) => {
    const targetFolder = folderPath[index];
    setCurrentDirectoryId(targetFolder.uuid);
    setFolderPath(folderPath.slice(0, index + 1));
  };

  const handleGoHome = () => {
    setCurrentDirectoryId(ROOT_FOLDER_ID);
    setFolderPath([{ uuid: ROOT_FOLDER_ID, name: "Home" }]);
  };

  const handleParentClick = () => {
    if (folderPath.length > 1) {
      const newPath = folderPath.slice(0, -1);
      const parentFolder = newPath[newPath.length - 1];
      setCurrentDirectoryId(parentFolder.uuid);
      setFolderPath(newPath);
    }
  };

  const isAtRoot = currentDirectoryId === ROOT_FOLDER_ID;

  return (
    <Paper elevation={1} sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <FolderIcon sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="h5">
            My Files
          </Typography>
        </Box>

        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            startIcon={<CreateFolderIcon />}
            onClick={() => setCreateFolderOpen(true)}
          >
            New Folder
          </Button>
          <Button
            variant="contained"
            startIcon={<UploadIcon />}
            onClick={() => setUploadFileOpen(true)}
          >
            Upload File
          </Button>
        </Stack>
      </Box>

      {/* Breadcrumb navigation */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <HomeIcon
          sx={{ mr: 1, cursor: 'pointer', color: 'action.active', '&:hover': { color: 'primary.main' } }}
          onClick={handleGoHome}
        />
        <Breadcrumbs separator="›">
          {folderPath.map((folder, index) => (
            index === folderPath.length - 1 ? (
              <Typography key={folder.uuid} color="text.primary">
                {folder.name.replace(/^\//, '')}
              </Typography>
            ) : (
              <Link
                key={folder.uuid}
                component="button"
                variant="body1"
                onClick={() => handleBreadcrumbClick(index)}
                sx={{ cursor: 'pointer' }}
                underline="hover"
              >
                {folder.name.replace(/^\//, '')}
              </Link>
            )
          ))}
        </Breadcrumbs>
      </Box>

      <FileListingContainer
        currentDirectoryId={currentDirectoryId}
        onRefreshReady={handleRefreshReady}
        onFolderClick={handleFolderClick}
        onParentClick={handleParentClick}
        showParentFolder={!isAtRoot}
      />

      <CreateFolderDialog
        open={createFolderOpen}
        onClose={() => setCreateFolderOpen(false)}
        parentFolderId={currentDirectoryId}
        onSuccess={handleSuccess}
      />

      <UploadFileDialog
        open={uploadFileOpen}
        onClose={() => setUploadFileOpen(false)}
        parentFolderId={currentDirectoryId}
        onSuccess={handleSuccess}
      />
    </Paper>
  );
}
