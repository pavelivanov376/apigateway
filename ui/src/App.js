import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  CircularProgress
} from '@mui/material';
import {
  CloudQueue as CloudIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';
import { AuthProvider, useAuth } from "./context/AuthContext";
import FileListingPage from "./components/FileListingPage";
import LoginPage from "./components/LoginPage";

/**
 * Navigation Bar Component
 */
function NavBar() {
  const { user, logout } = useAuth();

  return (
    <AppBar position="static" sx={{ mb: 3 }}>
      <Toolbar>
        <CloudIcon sx={{ mr: 2 }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          CloudDrive
        </Typography>
        {user && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2">
              Welcome, <strong>{user.username}</strong>
            </Typography>
            <Button
              color="inherit"
              onClick={logout}
              startIcon={<LogoutIcon />}
              size="small"
            >
              Logout
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}

/**
 * Main App Content
 * Shows login page or file listing based on auth state
 */
function AppContent() {
  const { isAuthenticated, loading } = useAuth();

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <LoginPage />;
  }

  // Show main app if authenticated
  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#fafafa' }}>
      <NavBar />
      <Box sx={{ padding: 3 }}>
        <FileListingPage />
      </Box>
    </Box>
  );
}

/**
 * Root App Component
 */
function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
