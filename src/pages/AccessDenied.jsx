import React from "react";
import { Box, Typography, Button, Card } from "@mui/material";
import { useNavigate } from "react-router-dom";
import LockIcon from "@mui/icons-material/Lock";

const AccessDenied = () => {
  const navigate = useNavigate();

  return (
    <Box display="flex" justifyContent="center" alignItems="center" height="100vh" bgcolor="#f8d7da">
      <Card sx={{ p: 4, textAlign: "center", boxShadow: 3, maxWidth: 400 }}>
        <LockIcon sx={{ fontSize: 60, color: "#d32f2f" }} />
        <Typography variant="h4" color="error" gutterBottom>
          Access Denied
        </Typography>
        <Typography variant="body1" color="textSecondary" gutterBottom>
          You do not have permission to view this page.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/")}
          sx={{ mt: 2 }}
        >
          Go to Home
        </Button>
      </Card>
    </Box>
  );
};

export default AccessDenied;
