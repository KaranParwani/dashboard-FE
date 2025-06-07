import React, { useState } from "react";
import { TextField, Button, Box, Typography, Alert } from "@mui/material";
import { loginAdmin } from "../services/AdminLoginApi";
import { useNavigate } from "react-router-dom";

const AdminLoginForm = () => {
  const [user_email, set_user_email] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate(); // Hook for navigation

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    try {
      const { access_token, refresh_token } = await loginAdmin({ user_email, password });

      // Save tokens to local storage
      localStorage.setItem("access_token", access_token);
      localStorage.setItem("refresh_token", refresh_token);

      setSuccess(true);

      // Redirect to a blank page
      navigate("/patients");
    } catch (err) {
      setError(err);
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      bgcolor="#f5f5f5"
      p={3}
    >

      <Typography variant="h3" fontWeight="bold" mb={4}>
        Patient Assistant Dashboard
      </Typography>
      <Typography variant="h4" mb={1}>Admin Login</Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        width="100%"
        maxWidth="400px"
        display="flex"
        flexDirection="column"
        gap={2}
      >
        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">Login successful!</Alert>}
        <TextField
          label="Email"
          type="email"
          value={user_email}
          onChange={(e) => set_user_email(e.target.value)}
          fullWidth
          required
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          required
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Login
        </Button>
      </Box>
    </Box>
  );
};

export default AdminLoginForm;
