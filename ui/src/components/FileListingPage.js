import React, { useState, useEffect } from "react";
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
} from "@mui/material";
import FileListingContainer from "./FileListingContainer";

export default function FileListPage() {
  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>
        Current Directory Name Placeholder
      </Typography>
      <FileListingContainer />
    </Box>
  );
}
